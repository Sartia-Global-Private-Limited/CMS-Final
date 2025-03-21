const dotenv = require("dotenv");
const url = require("url");
const { dirname } = require("path");
const path = require("path");
const { makeDb } = require("../db");
const moment = require("moment");
const fs = require("fs");
const mammoth = require("mammoth");
const pdf = require("html-pdf");
const { PDFDocument } = require("pdf-lib");
const { StatusCodes } = require("http-status-codes");
const docxConverter = require("docx-pdf");
const { calculateGstAmount } = require("../helpers/commonHelper");

dotenv.config();

const { outletsWithComplaintsById, outletsWithComplaintsForFund } = require("./officeInspectionController");
const { siteInspection, approvedOutletsSiteForFunds } = require("./siteInspectionController");

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Convert millimeters to pixels assuming 72 DPI
const A4_WIDTH_PX = Math.floor((A4_WIDTH_MM * 72) / 25.4);
const A4_HEIGHT_PX = Math.floor((A4_HEIGHT_MM * 72) / 25.4);
/** html puppeteer */
const db = makeDb();

// public directory
const publicDir = path.join(process.cwd(), "public");

const currentModuleUrl = url.pathToFileURL(__filename).href;
// Convert the URL to the file path
const currentModulePath = url.fileURLToPath(currentModuleUrl);

// Get the directory name
const currentModuleDir = dirname(currentModulePath);
let publicFolder = path.join(currentModuleDir, "../public/measurement_pdf");

function heading() {
    const Logo = "./public/assets/CMS LOGO.jpg";
    const base64Str = base64Encode(Logo);
    return (
        `<div class="invoice-box"><div class="nameAndLogo">
          <img src="data:image/jpeg;base64, ` +
        base64Str +
        `" alt="cms-image" width="180px" height="70px">
          <header class="header">
              <span class="title">CMS Electricals Private Limited</span><br />
              2nd Floor ,plot No - 133 ,near Syndicate Bank Village </br>Tilpat ,Faridabad ,Haryana 121003
              </br><strong>Email</strong> :projects@cmselectricals.com</br><strong>web</strong>
              :www.cmselectricals.com</br><strong>Tel</strong> : +91
              -129-2279955
          </header>

      </div>
      <hr>`
    );
}

const convertDataToPDF = async (data) => {
    try {
        const {
            id,
            measurement_amount,
            measurement_date,
            measurement_unique_id,
            outlet_id,
            po_number,
            complaint_id,
            complaint_for,
            complaint_unique_id,
            complaint_type_name,
            company_details,
            regional_office_name,
            sales_area_name,
            outlet_name,
            outlet_location,
            outlet_address,
            outelet_cc_number,
            outlet_category,
            po_details,
            complaint_order_by,
            items_data,
        } = data;

        // check if outlet is available for Energy Company
        if (complaint_for == 1) {
            if (!outlet_id) {
                throw new Error("Outlet not found for Energy Company");
            }
        }

        // Build the HTML content for the PDF
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>

          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }

              .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 10px;
                  border: 1px solid #ddd;
                  background-color: #fff;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              }

              .header {
                  text-align: right;
              }

              .bill-details {
                  display: flex;
                  justify-content: space-between;
                  /* margin-bottom: 20px; */
              }

              .bill-details .details-left,
              .bill-details .details-right {

                  text-align: left
              }

              .invoice-table {
                  /* width: 100%; */
                  border-collapse: collapse;
                  margin-bottom: 20px;
                  font-size: 13px;
              }

              .invoice-table th,
              .invoice-table td {
                  border: 1px solid #ddd;
                  padding: 8px;
              }

              .invoice-table th {
                  background-color: #f2f2f2;
                  text-align: left;
              }

              .invoice-table .total-label {
                  text-align: right;
                  background-color: #f9f9f9;
                  font-weight: bold;
              }



              .list {
                  list-style-type: none;
              }

              .font_size {
                  font-size: 14px;
              }

              .font-25 {
                  font-size: 18px;
                  text-decoration: underline;

              }

              .site-heading {
                  font-weight: bold;
                  text-align: right; 
                  font-size: 21px;
              }

              .title {
                  font-size: 25px;
                  font-weight: bold;
                  /* margin-bottom: 51px; */
              }

              .name-col{
              
              font-size:12px;
              font-weight:bold;}

              .col-md{
                  font-weight:bold;
                  font-size:12px;
              }

              .name-heading{
                  max-width:45px;
              }


              *{
                  text-transform: uppercase;
                  font-size: 11px;
              }

              .name-heading {
                  max-width: 140px;
                  white-space: normal;
                  font-weight: bold;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
              }

              .nameAndLogo {
                  display: flex;
                  justify-content: space-between;
              }

              .col-bold {
                  font-weight: bold;
              }
          </style>

      </head>

  <body>
      
      ${heading()}
      <div class="site-heading">Site Measurement Sheet</div>
      <hr>

          <div class="bill-details">
              <div class="details-left font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Customer Details&nbsp;</strong></span>

                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Client</th>
                          <td>: <strong>${company_details?.company_name ?? ""}</strong></td>
                      </tr>
                      <tr>
                          <th>Regional Office</th>
                          <td>: ${regional_office_name ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Sales Area</th>
                          <td>: ${sales_area_name ?? ""}</td>
                      </tr>
                      <tr>
                          <th>PO No.</th>
                          <td>: ${po_number ?? ""}</td>
                      </tr>
                      <tr>
                          <th>PO Date </th>
                          <td>: ${po_details?.po_date ?? ""}</td>
                      </tr>

                      <tr>
                          <th>Complaint No.</th>
                          <td>: ${complaint_unique_id ?? ""}</td>
                      </tr>
                  </table>
              </div>

              <div class="details-left font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Billing Details&nbsp;</strong></span>


                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Measurement No.</th>
                          <td>: ${measurement_unique_id ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Measurement Date</th>
                          <td>: ${moment(measurement_date).format("DD-MM-YYYY")}</td>
                      </tr>
                  </table>
              </div>
              <div class="details-right font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Outlet Details&nbsp;</strong> </span>

                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Outlet Name </th>
                          <td>: ${outlet_name ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>Location</th>
                          <td>: ${outlet_location ?? " - "} ${outlet_address ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>CC Code</th>
                          <td>: ${outelet_cc_number ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>Category </th>
                          <td>: ${outlet_category ?? " - "}</td>
                      </tr>

                      <tr>
                          <th>Order By </th>
                          <td>: ${complaint_order_by ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Work</th>
                          <td>: ${complaint_type_name ?? ""}</td>
                      </tr>
                  </table>

              </div>
          </div>
          <hr />
          <table class="invoice-table">
              <thead>
                  <tr>
                      <th>S.No.</th>
                      <th>Order Line No.</th>
                      <th>Particular</th>
                      <th>No.</th>
                      <th>Length (IN METER)</th>
                      <th>Breadth (In METER)</th>
                      <th>Depth (IN METER)</th>
                      <th>quantity</th>
                      <th>Total qty</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Amount</th>
                  </tr>
              </thead>

              <tbody>

              ${items_data?.map(
                  (data, idx) => `
                      <tr key="${idx}">
                          <td class="col-bold">${idx + 1}</td>
                          <td class="col-bold">${data.order_line_number}</td>
                          <td class="name-heading">${data.item_name}</td>
                          <td class="col-bold"></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="col-bold">${parseFloat(data.total_qty).toFixed(2)}</td>
                          <td class="col-bold">${data.unit}</td>
                          <td class="col-bold">${parseFloat(data.rate).toFixed(2)}</td>
                          <td class="col-bold">${parseFloat(data.rate * data.total_qty).toFixed(2)}</td>
                          ${data.childArray?.map(
                              (data, idx) => `
                                  <tr key="${idx}">
                                      <td></td>
                                      <td></td>
                                      <td>${data.description}</td>
                                      <td>${data.no}</td>
                                      <td>${data.length}</td>
                                      <td>${data.breadth}</td>
                                      <td>${data.depth}</td>
                                      <td>${parseFloat(data.qty).toFixed(2)}</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                  </tr>
                                  `
                          )}
                      
                      </tr>
                  `
              )}  
                  <tr>
                      <td colspan="11" class="total-label">Total</td>
                      <td class="col-bold">₹${measurement_amount}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  </body>
</html>
      `;

        // Generate a unique filename for the PDF
        const filename = `${complaint_unique_id}-${id}.pdf`;
        // Save the PDF to the public folder
        const filePath = path.join(publicFolder, filename);

        const options = {
            format: "A4",
            path: filePath, // you can pass path to save the file
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        };

        const outputDir = path.join(process.cwd(), "public", "output");

        // if output directory doesn't exist, create it
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // creating output file name with measurement id
        const outputFileName = `measurement_attachment_${id}.pdf`;
        const outputPath = `/output/${outputFileName}`;
        const fullOutputPath = path.join(outputDir, outputFileName);

        return new Promise((resolve, reject) => {
            pdf.create(htmlContent, options).toFile(filePath, async function (err, res) {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                // Logic for creating public URL and other processes here...
                const publicUrl = `/measurement_pdf/${filename}`;
                const fullBillPath = path.join(process.cwd(), "public", publicUrl);

                // Attachments processing
                const attachments = await getPiAttachmentDetails(complaint_id);
                const { pdfPaths, docFiles, imageFiles } = categorizedAttachments(attachments);
                const convertedPdfs = await convertDocsToPdfs(docFiles, outputDir);
                const allPdfs = [fullBillPath, ...pdfPaths, ...convertedPdfs];
                await attachPdfsAndImages(allPdfs, imageFiles, fullOutputPath);

                // Update database with pdf path
                const updateQuery = `UPDATE measurements SET pdf_attachment = ? WHERE id = ?`;
                await db.query(updateQuery, [outputPath, id]);

                resolve(outputPath); // Make sure to resolve the final result
            });
        });
    } catch (error) {
        console.log("Error in convertDataToPDF:", error);
        throw new Error(error);
    }
};

/** Convert image to Base64 to be shown in PDF */
function base64Encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString("base64");
}

const convertDocsToPdfs = async (docFiles, outputDir) => {
    // console.log('outputDir: ', outputDir);
    const convertedPdfs = [];
    for (const docFile of docFiles) {
        const outputPdf = path.join(outputDir, path.basename(docFile).replace(/\.docx?$/, ".pdf"));

        try {
            await convertDocToPdf(docFile, outputPdf);
            convertedPdfs.push(outputPdf);
        } catch (error) {
            console.error(`Error converting ${docFile}: `, error);
            throw error;
        }
    }

    return convertedPdfs;
};

async function convertDocToPdf(inputPath, outputPath) {
    try {
        const { value } = await mammoth.convertToHtml({ path: inputPath });
        const html = value;

        const options = { format: "A4" };
        // const file = { content: html };

        pdf.create(html, options).toFile(outputPath, function (err, res) {
            if (err) return console.log(err);
            console.log("PDF file created:", outputPath);
        });
    } catch (err) {
        console.error("Conversion error:", err);
    }
}

const categorizedAttachments = (attachments) => {
    const pdfPaths = [];
    const docFiles = [];
    const imageFiles = [];

    if (!attachments || !attachments.filePath || !Array.isArray(attachments.filePath)) {
        throw new Error("Invalid attachments structure");
    }

    for (const fileData of attachments.filePath) {
        const fullPath = path.join(process.cwd(), "public", fileData.file);

        switch (fileData.fileFormat.toLowerCase()) {
            case "pdf":
                pdfPaths.push(fullPath);
                break;
            case "docx":
            case "doc":
                docFiles.push(fullPath);
                break;
            case "jpg":
            case "jpeg":
            case "png":
                imageFiles.push(fullPath);
                break;
            default:
                console.log(`Unsupported file format: ${fileData.fileFormat}`);
        }
    }
    return { pdfPaths, docFiles, imageFiles };
};

// const attachAllDocumentsByMeasurementId = async (req,res,next) => {
//   try {
//     const id = req.params.id;
//     const { error } = checkPositiveInteger.validate({ id });

//     if (error) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         status: false,
//         message: error.message,
//       });
//     }

//     const check = await getMeasurementDetails(id);

//     if (check[0] && check[0]?.pdf_attachment) {
//       return res
//         .status(StatusCodes.OK)
//         .json({ status: true, data: check[0].pdf_attachment });
//     }

//     // setup output directory
//     const outputDir = path.join(process.cwd(), "public", "output");

//     // if output directory doesn't exist, create it
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir);
//     }

//     // creating output file name with measurement id
//     const outputFileName = `measurement_attachment_${id}.pdf`;
//     const outputPath = `/output/${outputFileName}`;
//     const fullOutputPath = path.join(outputDir, outputFileName);

//     // if output file already exists, return it
//     // if (fs.existsSync(fullOutputPath)) {
//     //   return res
//     //     .status(StatusCodes.OK)
//     //     .json({ status: true, message: "Already Attached", url: outputPath });
//     // }
//     const { complaint_id, publicUrl } = await convertDataToPDF(id);

//     // specify full pdf path
//     const fullBillPath = path.join(process.cwd(), "public", publicUrl);

//     if (publicUrl && complaint_id) {
//       const attachments = await getPiAttachmentDetails(complaint_id);

//       // storing full paths of all type of documents in corresponding variables
//       const { pdfPaths, docFiles, imageFiles } = categorizedAttachments(attachments);

//       // converting doc file to pdf
//       const convertedPdfs = await convertDocsToPdfs(docFiles, outputDir);

//       const allPdfs = [fullBillPath, ...pdfPaths, ...convertedPdfs];

//       // attaching all pdfs and images
//       await attachPdfsAndImages(allPdfs, imageFiles, fullOutputPath);

//       const updateQuery = `UPDATE measurements SET pdf_attachment = ? WHERE id = ?`;
//       await db.query(updateQuery, [outputPath, id]);

//       return res.status(StatusCodes.OK).json({
//         status: true,
//         message: "Attached Successfully",
//         url: outputPath,
//       });
//     }

//     return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "No Complaint Found" });
//   } catch (error) {next(error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//   }
// };

// helper

async function getMeasurementDetails(id) {
    try {
        const query = `SELECT * FROM measurements 
        WHERE id = ${id}`;
        const result = await db.query(query);

        return result;
    } catch (error) {
        console.log("Error in fetching measurement details:", error);
        throw error;
    }
}

async function getPiAttachmentDetails(complaint_id) {
    const query = `SELECT * FROM pi_attachment WHERE complaint_id = ?`;
    const queryResult = await db.query(query, [complaint_id]);

    for (let item of queryResult) {
        item.filePath = item.filePath ? JSON.parse(item.filePath) : [];
    }

    return queryResult[0];
}

async function getComplaintDetailByMeasurementId(measurement_id) {
    const selectQuery = `SELECT complaint_id FROM measurements WHERE id = ?`;
    const queryResult = await db.query(selectQuery, [measurement_id]);

    return queryResult;
}

async function convertDocxToPdf(inputPath, outputPath) {
    const result = await mammoth.convertToHtml({ path: inputPath });
    const htmlContent = result.value;

    // const file = { content: htmlContent };
    const options = {
        format: "A4",
        margin: { top: 20, left: 20, right: 20, bottom: 20 },
    };

    pdf.create(htmlContent, options).toFile(outputPath, function (err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
}

async function attachPdfsAndImages(pdfPaths, imagePaths, outputPath) {
    const pdfDoc = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const existingPdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    for (const imagePath of imagePaths) {
        const imageBytes = fs.readFileSync(imagePath);
        const imageExt = imagePath.split(".").pop().toLowerCase();
        let image;
        if (imageExt === "jpg" || imageExt === "jpeg") {
            image = await pdfDoc.embedJpg(imageBytes);
        } else if (imageExt === "png") {
            image = await pdfDoc.embedPng(imageBytes);
        }

        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;
        let { width, height } = image;
        const aspectRatio = width / height;

        if (width > A4_WIDTH || height > A4_HEIGHT) {
            if (width / A4_WIDTH > height / A4_HEIGHT) {
                width = A4_WIDTH;
                height = A4_WIDTH / aspectRatio;
            } else {
                height = A4_HEIGHT;
                width = A4_HEIGHT * aspectRatio;
            }
        }

        // draw page with A4 size
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        page.drawImage(image, {
            x: (A4_WIDTH - width) / 2,
            y: (A4_HEIGHT - height) / 2,
            width: width,
            height: height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
}
function escapeHtml(text) {
    if (typeof text !== "string") return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
async function generateItemsTableRows(itemsData, HSN) {
    let rows = "";
    let subtotal = 0;
    let tax = 0;
    let srNo = 1;
    const measurementPdfs = new Set();

    for (const item of itemsData) {
        // const measurements = await getMeasurementDetails(item.measurement_id);
        // if (!measurements[0]?.pdf_attachment) {
        //   throw new Error(`Please first create measurement pdf`);
        // }
        // measurementPdfs.add(path.join(publicDir, measurements[0].pdf_attachment));

        const itemAmount = parseFloat(parseFloat(item.total_qty) * parseFloat(item.rate)).toFixed(2);
        const itemGst = await calculateGstAmount(item.measurement_id);

        subtotal += parseFloat(itemAmount);
        tax += parseFloat(itemGst);

        rows += `
          <tr>
              <td>${srNo++}</td>
              <td>${item.order_line_number}</td>
              <td>${item.item_name}</td>
              <td>${HSN?.hsn_code ?? "NA"}</td>
              <td>${item.unit}</td>
              <td>${item.total_qty}</td>
              <td>${item.rate}</td>
              <td>${itemAmount}</td>
          </tr>
      `;
    }

    const total = subtotal + tax;

    rows += `
      <tr>
          <td colspan="7" class="total-label">Subtotal</td>
          <td>₹ ${parseFloat(subtotal).toFixed(2)}</td>
      </tr>
      <tr>
          <td colspan="7" class="total-label">Tax</td>
          <td>₹ ${parseFloat(tax).toFixed(2)}</td>
      </tr>
      <tr>
          <td colspan="7" class="total-label">Total</td>
          <td>₹ ${parseFloat(total).toFixed(2)}</td>
      </tr>
  `;

    return { rows, measurementPdfs };
}
async function getPOItemDetails(poId) {
    const query = `SELECT hsn_code FROM purchase_order_item WHERE purchase_order_id = ?`;
    const queryResult = await db.query(query, [poId]);
    return queryResult[0];
}

const printOfficeFundAndStock = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        const isStock = req.query.isStock || 1;

        let directoryToStorePdf = "office_stock";
        let filename = `office_stock.pdf`;
        let transformedData;
        if (isStock == 0) {
            filename = "office_fund.pdf";
            directoryToStorePdf = "office_fund";
            transformedData = await outletsWithComplaintsForFund(id, month);
        } else {
            transformedData = await outletsWithComplaintsById(id, month);
        }

        const outputDir = path.join(publicDir, directoryToStorePdf);

        const generateHTML = (data) => {
            return data
                .map((transformedObj, objIndex) => {
                    const { userDetails, confirmDetails, itemDetails, total, total_office_amount } = transformedObj;

                    return `
          <table style="width: 100%">
            <tr>
              <td class="bold title-underline" colspan="2">User Details</td>
              <td class="bold title-underline hr" colspan="2">Feedback Details</td>
            </tr>
            <tr>
              <td class="bold">EMPLOYEE NAME</td>
              <td>: ${userDetails[0]?.username}</td>
              <td class="bold hr">CONTACT PERSON NAME</td>
              <td>: ${confirmDetails[0]?.contact_person}</td>
            </tr>
            <tr>
              <td class="bold">EMPLOYEE ID</td>
              <td>: ${userDetails[0]?.employee_id ?? ""}</td>
              <td class="bold hr">CONTACT PERSON PHONE</td>
              <td>: ${confirmDetails[0]?.contact_person_number}</td>
            </tr>
            <tr>
              <td class="bold">COMPLAINT UNIQUE ID</td>
              <td>: ${confirmDetails[0]?.complaint_unique_id}</td>
              <td class="bold hr">CONTACT PERSON EMAIL</td>
              <td>: ${confirmDetails[0]?.email}</td>
            </tr>
            <tr>
              <td colspan="4"><hr /></td>
            </tr>
          </table>
          <hr />
          <table class="invoice-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>ITEM</th>
                <th>ITEM PRICE</th>
                <th>ITEM QUANTITY</th>
                <th>OFFICE APPROVE QTY</th>
                <th>TOTAL</th>
                <th>APPROVED DATE</th>
              </tr>
            </thead>
            <tbody>
              ${itemDetails
                  .map(
                      (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.item_name}</td>
                  <td>${item.item_rate}</td>
                  <td>${item.item_qty}</td>
                  <td>${item.office_approved_qty}</td>
                  <td>${item.total_approved_amount}</td>
                  <td>${moment(item.approved_at, "YYYY-MM-DD HH:mm:ss A").format("YYYY-MM-DD")}</td>
                </tr>
              `
                  )
                  .join("")}
              <tr>
                <td colspan="6" class="total-label">TOTAL REQUESTED AMOUNT</td>
                <td>₹ ${total}</td>
              </tr>
              <tr>
                <td colspan="6" class="total-label">TOTAL OFFICE APPROVED AMOUNT</td>
                <td>₹ ${total_office_amount}</td>
              </tr>
            </tbody>
          </table>
        `;
                })
                .join("");
        };

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }

      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 10px;
        border: 1px solid black;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      }

      .header {
        text-align: right;
      }

      .bill-details {
        display: flex;
        justify-content: space-between;
        /* margin-bottom: 20px; */
      }

      .bill-details .details-left,
      .bill-details .details-right {
        text-align: left;
      }

      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 13px;
      }

      .invoice-table th,
      .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
      }

      .invoice-table th {
        background-color: #f2f2f2;
        text-align: left;
      }

      .invoice-table .total-label {
        text-align: right;
        background-color: #f9f9f9;
        font-weight: bold;
      }

      .list {
        list-style-type: none;
      }

      .font_size {
        font-size: 14px;
      }

      .font-25 {
        font-size: 18px;
        text-decoration: underline;
      }

      .site-heading {
        font-weight: bold;
        text-align: right;
        font-size: 21px;
      }

      .title {
        font-size: 22px;
        font-weight: bold;
      }

      * {
        text-transform: uppercase;
        font-size: 11px;
      }

      .name-heading {
        max-width: 150px;
        white-space: normal;
        font-weight: bold;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .nameAndLogo {
        display: flex;
        justify-content: space-between;
      }
      .title {
        font-size: 25px;
        font-weight: bold;
      }
      td {
        width: 25%;
      }
      .bold {
        font-weight: bold;
      }
      tr {
        border-left: 2px solid #000;
      }
      .hr {
        padding-left: 20px;
      }
      .underline {
        border-bottom: 2px solid !important;
      }
      .details {
        padding-top: 10px;
      }
      .title-underline {
        text-decoration: underline;
        padding-bottom: 8px;
      }
      .dark {
        border: 1px solid #000;
      }
    </style>
  </head>

  <body>
    ${heading()}
      <div class="site-heading">Office Inspection Sheet</div>
      <hr />

      ${generateHTML(transformedData)}
      
    </div>
  </body>
</html>`;

        // if output directory doesn't exist, create it
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Save the PDF to the proforma_invoices folder
        const filePath = path.join(outputDir, filename);

        const options = {
            format: "A4",
            path: filePath, // you can pass path to save the file
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        };

        pdf.create(htmlContent, options).toFile(filePath, function (err, res) {
            if (err) return console.log(err);
            res.status(StatusCodes.OK).json({
                status: true,
                message: "PDF created successfully.",
                path: `/${directoryToStorePdf}/${filename}`,
            });
        });
    } catch (error) {
        return next(error);
    }
};

const printSiteFundAndStock = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        const isStock = req.query.isStock || 1;

        let transformedData;

        let direcotyToStorePdf = "site_stock";
        let filename = `site_stock.pdf`;
        if (isStock == 0) {
            direcotyToStorePdf = "site_fund";
            filename = `site_fund.pdf`;
            transformedData = await approvedOutletsSiteForFunds(id, month);
        } else {
            transformedData = await siteInspection(id, month);
        }

        const outputDir = path.join(publicDir, direcotyToStorePdf);
        const generateHTML = (data) => {
            return data
                .map((transformedObj, objIndex) => {
                    const {
                        userDetails,
                        getAssignDetail,
                        confirmDetails: { office, site },
                        itemDetails,
                        total,
                        total_site_amount,
                    } = transformedObj;

                    const { office_user_name, end_user_name } = getAssignDetail[0];

                    return `
          <table style="width: 100%">
              <tr>
                <td class="bold title-underline" colspan="2">User Details</td>
                <td class="bold title-underline hr" colspan="2">
                  Complaint Assigned
                </td>
              </tr>
              <tr>
                <td class="bold">EMPLOYEE NAME.</td>
                <td>: ${userDetails[0]?.username}</td>
                <td class="bold hr">EMPLOYEE NAME</td>
                <td>: ${(office_user_name ? office_user_name : end_user_name) ?? ""}</td>
              </tr>
              <tr>
                <td class="bold">EMPLOYEE ID</td>
                <td>: ${userDetails[0]?.employee_id ?? ""}</td>
                <td class="bold hr"></td>
                <td></td>
              </tr>
              <tr>
                <td class="bold">COMPLAIN UNIQUE ID</td>
                <td>: ${office[0]?.complaint_unique_id}</td>
                <td class="bold hr"></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="4"><hr /></td>
              </tr>
              <!-- <hr class="position" /> -->
              <tr>
                <td class="bold title-underline" colspan="2">
                  FEEDBACK DETAILS BY OFFICE
                </td>
                <td class="bold title-underline hr" colspan="2">
                  FEEDBACK DETAILS BY SITE USER
                </td>
              </tr>
              <tr>
                <td class="bold">CONTACT PERSON NAME</td>
                <td>: ${office[0]?.contact_person}</td>
                <td class="bold hr">CONTACT PERSON NAME</td>
                <td>: ${site[0]?.contact_person}</td>
              </tr>
              <tr>
                <td class="bold">CONTACT PERSON PHONE</td>
                <td>: ${office[0]?.contact_person_number}</td>
                <td class="bold hr">CONTACT PERSON PHONE</td>
                <td>: ${site[0]?.contact_person_number}</td>
              </tr>
              <tr>
                <td class="bold">CONTACT PERSON EMAIL</td>
                <td>: ${office[0]?.email}</td>
                <td class="bold hr">CONTACT PERSON EMAIL</td>
                <td>: ${site[0]?.email}</td>
              </tr>
      </table>
          <hr />
          <table class="invoice-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>ITEM</th>
                <th>ITEM PRICE</th>
                <th>ITEM QUANTITY</th>
                <th>OFFICE APPROVE QTY</th>
                <th>SITE APPROVED QUANTITY</th>
                <th>SITE APPROVED AMOUNT</th>
                <th>APPROVED DATE & TIME</th>
              </tr>
            </thead>
            <tbody>
              ${itemDetails
                  .map(
                      (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.item_name}</td>
                  <td>${item.item_rate}</td>
                  <td>${item.item_qty}</td>
                  <td>${item.office_approved_qty}</td>
                  <td>${item.site_approved_qty}</td>
                  <td>${item.total_approved_amount}</td>
                  <td>${moment(item.approved_at, "YYYY-MM-DD HH:mm:ss A").format("YYYY-MM-DD")}</td>
                </tr>
              `
                  )
                  .join("")}
              <tr>
                <td colspan="7" class="total-label">TOTAL OFFICE APPROVE AMOUNT</td>
                <td>₹ ${total}</td>
              </tr>
              <tr>
                <td colspan="7" class="total-label">TOTAL SITE APPROVED AMOUNT</td>
                <td>₹ ${total_site_amount}</td>
              </tr>
            </tbody>
          </table>
        `;
                })
                .join("");
        };

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }

      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 10px;
        border: 1px solid black;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      }

      .header {
        text-align: right;
      }

      .bill-details {
        display: flex;
        justify-content: space-between;
        /* margin-bottom: 20px; */
      }

      .bill-details .details-left,
      .bill-details .details-right {
        text-align: left;
      }

      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 13px;
      }

      .invoice-table th,
      .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
      }

      .invoice-table th {
        background-color: #f2f2f2;
        text-align: left;
      }

      .invoice-table .total-label {
        text-align: right;
        background-color: #f9f9f9;
        font-weight: bold;
      }

      .list {
        list-style-type: none;
      }

      .font_size {
        font-size: 14px;
      }

      .font-25 {
        font-size: 18px;
        text-decoration: underline;
      }

      .site-heading {
        font-weight: bold;
        text-align: right;
        font-size: 21px;
      }

      .title {
        font-size: 22px;
        font-weight: bold;
      }

      * {
        text-transform: uppercase;
        font-size: 11px;
      }

      .name-heading {
        max-width: 150px;
        white-space: normal;
        font-weight: bold;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .nameAndLogo {
        display: flex;
        justify-content: space-between;
      }
      .title {
        font-size: 25px;
        font-weight: bold;
      }
      td {
        width: 25%;
      }
      .bold {
        font-weight: bold;
      }
      tr {
        border-left: 2px solid #000;
      }
      .hr {
        padding-left: 20px;
      }
      .underline {
        border-bottom: 2px solid !important;
      }
      .details {
        padding-top: 10px;
      }
      .title-underline {
        text-decoration: underline;
        padding-bottom: 8px;
      }
      .dark {
        border: 1px solid #000;
      }
    </style>
  </head>

  <body>
    ${heading()}
      <div class="site-heading">Site Inspection Sheet</div>
      <hr />

      ${generateHTML(transformedData)}
      
    </div>
  </body>
</html>`;

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Save the PDF to the proforma_invoces folder
        const filePath = path.join(outputDir, filename);

        const options = {
            format: "A4",
            path: filePath, // you can pass path to save the file
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        };

        pdf.create(htmlContent, options).toFile(filePath, function (err, res) {
            if (err) return console.log(err);
            res.status(StatusCodes.OK).json({
                status: true,
                message: "PDF created successfully.",
                path: `/${direcotyToStorePdf}/${filename}`,
            });
        });
    } catch (error) {
        return next(error);
    }
};

async function generatePdf(data, outputDirectory) {
    // console.log('data: ', data);

    const {
        billing_from,
        billing_from_state,
        billing_to,
        bill_no,
        created_at,
        work,
        po_number,
        po_date,
        getMeasurements,
        complaint_for,
        po_id,
    } = data;

    if (!getMeasurements) {
        throw new Error("Measurement not found");
    }
    const result = await getPOItemDetails(po_id);
    const itemsData = getMeasurements?.flatMap((measurement) => measurement.items_data);
    const { measurementPdfs, rows } = await generateItemsTableRows(itemsData, result);
    const htmlContent = `
            <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #F5F5F5;
          }
            .nameAndLogo {
              display: flex;
              justify-content: space-between;
            }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #fff;
            border: 2px solid #000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          }
          .header {
            text-align: right;
          }
          .bill-details {
            display: flex;
            justify-content: space-between;
          }
          .bill-details .details-left,
          .bill-details .details-right {
            text-align: left;
          }
          .invoice-table {
            border-collapse: collapse;
            font-size: 13px;
          }
          .invoice-table th,
          .invoice-table td {
            border: 1px solid #ddd;
            padding: 8px;
            border: 2px solid #616060;
          }
          .invoice-table th {
            background-color: #F2F2F2;
            text-align: left;
          }
          .invoice-table .total-label {
            text-align: right;
            background-color: #F9F9F9;
            font-weight: bold;
          }
          .list {
            list-style-type: none;
          }
          .font_size {
            font-size: 14px;
          }
          .font-25 {
            font-size: 18px;
            text-decoration: underline;
          }
          .site-heading {
            font-weight: bold;
            font-size: 21px;
          }
          .w-25 {
            min-width: 250px;
          }
          .w-10 {
            min-width: 100px;
          }
          .w-5 {
            min-width: 80px;
          }
          .title {
            font-size: 25px;
            font-weight: bold;
          }
          td {
            width: 25%;
          }
          .bold {
            font-weight: bold;
          }
          tr {
            border-left: 2px solid #000;
          }
          .hr {
            /* border-left: 2px solid #d4d2d2; */
            padding-left: 20px;
          }
          .underline {
            border-bottom: 2px solid !important;
          }
          .details {
            padding-top: 10px;
          }
          .title-underline {
            text-decoration: underline;
          }
          table {
            position: relative;
          }
          .dark {
            border: 1px solid #000;
          }
          .position {
            position: absolute;
            height: 15.6rem;
            top: 11.2rem;
            border-width: 2px;
            border-color: #fff;
            transform: translateX(22rem);
          }
        </style>
      </head>
      <body>
        ${heading()}
            <span class="site-heading">ESTIMATE</span>
            <hr class="dark" />
          </header>
          <table style="width: 100%">
            <tr>
              <td class="bold">Estimate No.</td>
              <td>: ${bill_no}</td>
              <td class="bold hr">Place of Supply</td>
              <td>: ${billing_to?.place_of_supply ?? ""}</td>
            </tr>
            <tr>
              <td class="bold">Estimate Date</td>
              <td>: ${created_at}</td>
              <td class="bold hr">PO No.</td>
              <td>: ${po_number}</td>
            </tr>
            <tr>
              <td class="bold">work</td>
              <td>: ${work ?? ""}</td>
              <td class="bold hr">PO Date</td>
              <td>: ${po_date ?? ""}</td>
            </tr>
            <tr>
              <td colspan="4"><hr class="dark" /></td>
            </tr>
            <tr>
              <td colspan="2" class="details">
                <strong class="title-underline">BILL TO</strong>
                <p>
                  <strong>${billing_to.company_name ?? ""}</strong> <br />
                  ${billing_to.company_address ?? ""} <br />
                  ${billing_to?.state ?? ""} - ${billing_to?.pincode ?? ""}<br />
                  Office - ${billing_to.office ?? "NA"}<br />
                  <strong> GSTIN </strong> : ${billing_to.gst_number ?? ""}<br />
                </p>
              </td>
              <td colspan="2" class="hr details">
                <strong class="title-underline">SHIP TO</strong>
                <p>
                  <strong
                     >${billing_from.company_name ?? ""}</strong
                   >
                   <br />
                  ${billing_from.company_address ?? ""} <br />
                   ${billing_from_state ?? "NA"} - ${billing_from?.pincode ?? ""}<br />
                  Office - ${billing_from.office ?? ""}<br />
                  <strong> GSTIN </strong> : ${billing_from.gst_number ?? ""} <br />
                </p>
              </td>
            </tr>
          </table>
          <hr class="dark" />
          <table class="invoice-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Order Line No.</th>
                <th class="w-25">Item & Description</th>
                <th>HSN/SAC</th>
                <th>Unit</th>
                <th class="w-10">QTY</th>
                <th>Rate</th>
                <th class="w-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
          </table>
        </div>
      </body>
    </html>
        `;

    const outputDir = path.join(publicDir, outputDirectory);

    // if output directory doesn't exist, create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Generate a unique filename for the PDF
    const filename = `${bill_no}.pdf`;
    // Save the PDF to the proforma_invoices folder
    const filePath = path.join(outputDir, filename);

    const options = {
        format: "A4",
        path: filePath, // you can pass path to save the file
        printBackground: true,
        margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
    };

    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toFile(filePath, function (err, res) {
            if (err) {
                return reject(err);
            }

            const finalOutputFilename = `${outputDirectory}-${bill_no}.pdf`;
            const relativeOutputFilePath = `/${outputDirectory}/${finalOutputFilename}`;
            const outputFilePath = path.join(outputDir, finalOutputFilename);

            // Call the function to attach PDFs and images
            attachPdfsAndImages([filePath, ...measurementPdfs], [], outputFilePath);

            resolve(relativeOutputFilePath); // Resolve with the relative path
        });
    });
}

// function buildHtml(data) {
//   const {
//     billing_from,
//     billing_from_state,
//     billing_to,
//     bill_no,
//     created_at,
//     work,
//     po_number,
//     po_date,
//     getMeasurements,
//     complaint_for,
//     po_id,
//   } = data;
//   let htmlContent = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <title>Measurements Report</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               margin: 20px;
//               background-color: #f5f5f5;
//           }
//           .nameAndLogo {
//             display: flex;
//             justify-content: space-between;
//           }
//           .title {
//               font-size: 25px;
//               font-weight: bold;
//           }
//           .header {
//               text-align: right;
//           }
//           .invoice {
//               margin-bottom: 40px;
//               background-color: #fff;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 0 10px rgba(0,0,0,0.1);
//           }
//           .invoice-header {
//               text-align: center;
//               margin-bottom: 20px;
//           }
//           .invoice-header h2 {
//               margin: 0;
//               color: #333;
//           }
//           .pi-measurement {
//               margin-bottom: 20px;
//           }
//           .pi-measurement h3 {
//               background-color: #5f3fb0;
//               color: #fff;
//               padding: 10px;
//               border-radius: 5px;
//           }
//           table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 20px;
//           }
//           table, th, td {
//               border: 1px solid #dedede;
//           }
//           th, td {
//               padding: 8px;
//               text-align: left;
//           }
//           th {
//               background-color: #f0f0f0;
//           }
//           .child-table {
//               margin-top: 10px;
//               margin-left: 20px;
//               width: 95%;
//           }
//           .section-title {
//               background-color: #dcdcdc;
//               padding: 5px;
//               border-radius: 3px;
//               margin-top: 10px;
//               margin-bottom: 5px;
//               font-weight: bold;
//           }
//       </style>
//   </head>
//   <body>
//       ${heading()}
//       <span class="site-heading">ESTIMATE</span>
//       <hr class="dark" />
//       <table style="width: 100%">
//           <tr>
//             <td class="bold">Estimate No.</td>
//             <td>: ${bill_no}</td>
//             <td class="bold hr">Place of Supply</td>
//             <td>: ${billing_to?.place_of_supply ?? ""}</td>
//           </tr>
//           <tr>
//             <td class="bold">Estimate Date</td>
//             <td>: ${created_at}</td>
//             <td class="bold hr">PO No.</td>
//             <td>: ${po_number}</td>
//           </tr>
//           <tr>
//             <td class="bold">work</td>
//             <td>: ${work ?? ""}</td>
//             <td class="bold hr">PO Date</td>
//             <td>: ${po_date ?? ""}</td>
//           </tr>
//           <tr>
//             <td colspan="4"><hr class="dark" /></td>
//           </tr>
//           <tr>
//             <td colspan="2" class="details">
//               <strong class="title-underline">BILL TO</strong>
//               <p>
//                 <strong>${billing_to.company_name ?? ""}</strong> <br />
//                 ${billing_to.company_address ?? ""} <br />
//                 ${billing_to?.state ?? ""} - ${billing_to?.pincode ?? ""}<br />
//                 Office - ${billing_to.office ?? "NA"}<br />
//                 <strong> GSTIN </strong> : ${billing_to.gst_number ?? ""}<br />
//               </p>
//             </td>
//             <td colspan="2" class="hr details">
//               <strong class="title-underline">SHIP TO</strong>
//               <p>
//                 <strong
//                   >${billing_from.company_name ?? ""}</strong
//                 >
//                 <br />
//                 ${billing_from.company_address ?? ""} <br />
//                 ${billing_from_state ?? "NA"} - ${
//         billing_from?.pincode ?? ""
//       }<br />
//                 Office - ${billing_from.office ?? ""}<br />
//                 <strong> GSTIN </strong> : ${billing_from.gst_number ?? ""} <br />
//               </p>
//             </td>
//           </tr>
//       </table>
//       <hr class="dark" />
//   `;

//   data.measurements.forEach((invoice) => {
//       htmlContent += `
//       <div class="invoice">
//           <div class="invoice-header">
//               <h2>BILL NUMBER: ${escapeHtml(invoice.invoice_no)}</h2>
//           </div>
//       `;

//       invoice.piMeasurements.forEach((pi) => {
//           htmlContent += `
//           <div class="pi-measurement">
//               <h3>PI NUMBER: ${escapeHtml(pi.bill_no)}</h3>
//           </div>
//           `;

//           pi.measurements.forEach((measurement) => {
//               htmlContent += `
//               <div class="measurement">
//                   <div class="section-title">COMPLAINT NUMBER: ${escapeHtml(measurement.complaintDetails.complaint_unique_id)}</div>

//                   <div class="item-details">
//                       <table class="invoice-table">
//                           <thead>
//                               <tr>
//                                   <th>S.No.</th>
//                                   <th>Order Line No.</th>
//                                   <th>Particular</th>
//                                   <th>No.</th>
//                                   <th>Length (IN METER)</th>
//                                   <th>Breadth (In METER)</th>
//                                   <th>Depth (IN METER)</th>
//                                   <th>Quantity</th>
//                                   <th>Total Qty</th>
//                                   <th>Unit</th>
//                                   <th>Rate</th>
//                                   <th>Amount</th>
//                               </tr>
//                           </thead>
//                           <tbody>
//               `;

//               measurement.items_data.forEach((item, idx) => {
//                   htmlContent += `
//                               <tr>
//                                   <td class="col-bold">${idx + 1}</td>
//                                   <td class="col-bold">${escapeHtml(item.order_line_number)}</td>
//                                   <td class="name-heading">${escapeHtml(item.item_name)}</td>
//                                   <td class="col-bold"></td>
//                                   <td></td>
//                                   <td></td>
//                                   <td></td>
//                                   <td></td>
//                                   <td class="col-bold">${parseFloat(item.total_qty).toFixed(2)}</td>
//                                   <td class="col-bold">${escapeHtml(item.unit)}</td>
//                                   <td class="col-bold">₹${parseFloat(item.rate).toFixed(2)}</td>
//                                   <td class="col-bold">₹${parseFloat(item.rate * item.total_qty).toFixed(2)}</td>
//                               </tr>
//                   `;

//                   // Add childArray details
//                   if (item.childArray && item.childArray.length > 0) {
//                       item.childArray.forEach((child, childIdx) => {
//                           htmlContent += `
//                               <tr>
//                                   <td></td>
//                                   <td></td>
//                                   <td>${escapeHtml(child.description)}</td>
//                                   <td>${escapeHtml(child.no)}</td>
//                                   <td>${escapeHtml(child.length)}</td>
//                                   <td>${escapeHtml(child.breadth)}</td>
//                                   <td>${escapeHtml(child.depth)}</td>
//                                   <td>${parseFloat(child.qty).toFixed(2)}</td>
//                                   <td></td>
//                                   <td></td>
//                                   <td></td>
//                                   <td></td>
//                               </tr>
//                           `;
//                       });
//                   }
//               });

//               htmlContent += `
//                           </tbody>
//                       </table>
//                   </div>
//               </div>
//               `;
//           });

//           htmlContent += `
//           </div>
//           `;
//       });

//       htmlContent += `
//       </div>
//       `;
//   });

//   htmlContent += `
//   </body>
//   </html>
//   `;

//   return htmlContent;
// }

async function buildHtml(data, HSN) {
    const {
        billing_from,
        billing_from_state,
        billing_to,
        bill_no,
        created_at,
        work,
        po_number,
        po_date,
        getMeasurements,
        complaint_for,
        po_id,
    } = data;
    let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Measurements Report</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f5f5f5;
          }
          .nameAndLogo {
            display: flex;
            justify-content: space-between;
          }
          
           .title {
          font-size: 25px;
          font-weight: bold;
        }
        .header {
          text-align: right;
        }
          .invoice {
              margin-bottom: 40px;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .invoice-header {
              text-align: center;
              margin-bottom: 20px;
          }
          .invoice-header h2 {
              margin: 0;
              color: #333;
          }
          .pi-measurement {
              margin-bottom: 20px;
          }
          .pi-measurement h3 {
              background-color: #5f3fb0;
              color: #fff;
              padding: 10px;
              border-radius: 5px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
          }
          table, th, td {
              border: 1px solid #dedede;
          }
          th, td {
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #f0f0f0;
          }
          .child-table {
              margin-top: 10px;
              margin-left: 20px;
              width: 95%;
          }
          .section-title {
              background-color: #dcdcdc;
              padding: 5px;
              border-radius: 3px;
              margin-top: 10px;
              margin-bottom: 5px;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      ${heading()}
      <span class="site-heading">ESTIMATE</span>
          <hr class="dark" />
      <table style="width: 100%">
          <tr>
            <td class="bold">Estimate No.</td>
            <td>: ${bill_no}</td>
            <td class="bold hr">Place of Supply</td>
            <td>: ${billing_to?.place_of_supply ?? ""}</td>
          </tr>
          <tr>
            <td class="bold">Estimate Date</td>
            <td>: ${created_at}</td>
            <td class="bold hr">PO No.</td>
            <td>: ${po_number}</td>
          </tr>
          <tr>
            <td class="bold">work</td>
            <td>: ${work ?? ""}</td>
            <td class="bold hr">PO Date</td>
            <td>: ${po_date ?? ""}</td>
          </tr>
          <tr>
            <td colspan="4"><hr class="dark" /></td>
          </tr>
          <hr class="position" />
          <tr>
            <td colspan="2" class="details">
              <strong class="title-underline">BILL TO</strong>
              <p>
                <strong>${billing_to.company_name ?? ""}</strong> <br />
                ${billing_to.company_address ?? ""} <br />
                ${billing_to?.state ?? ""} - ${billing_to?.pincode ?? ""}<br />
                Office - ${billing_to.office ?? "NA"}<br />
                <strong> GSTIN </strong> : ${billing_to.gst_number ?? ""}<br />
              </p>
            </td>
            <td colspan="2" class="hr details">
              <strong class="title-underline">SHIP TO</strong>
              <p>
                <strong
                  >${billing_from.company_name ?? ""}</strong
                >
                <br />
                ${billing_from.company_address ?? ""} <br />
                ${billing_from_state ?? "NA"} - ${billing_from?.pincode ?? ""}<br />
                Office - ${billing_from.office ?? ""}<br />
                <strong> GSTIN </strong> : ${billing_from.gst_number ?? ""} <br />
              </p>
            </td>
          </tr>
        </table>
        <hr class="dark" />
  `;

    for (const invoice of data.measurements) {
        htmlContent += `
      <div class="invoice">
          <div class="invoice-header">
              <h2>BILL NUMBER: ${escapeHtml(invoice.invoice_no)}</h2>
          </div>
      `;

        for (const pi of invoice.piMeasurements) {
            htmlContent += `
          <div class="pi-measurement">
              <h3>PI NUMBER: ${escapeHtml(pi.bill_no)}</h3>
          </div>
          `;
            const result = await getPOItemDetails(po_id);

            for (const measurement of pi.measurements) {
                // Generate items and calculate total, subtotal, and tax for the measurement
                const { rows, measurementPdfs } = await generateItemsTableRows(measurement.items_data, result);

                htmlContent += `
              <div class="measurement">
                  <div class="section-title">COMPLAINT NUMBER: ${escapeHtml(measurement.complaintDetails.complaint_unique_id)}</div>
                 
                  <div class="item-details">
                      <table class="invoice-table">
                          <thead>
                              <tr>
                                  <th>S.No.</th>
                                  <th>Order Line No.</th>
                                  <th>Particular</th>
                                  <th>HSN Code</th>
                                  <th>Unit</th>
                                  <th>Quantity</th>
                                  <th>Rate</th>
                                  <th>Amount</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${rows}
                          </tbody>
                      </table>
                  </div>
              </div>
              `;
            }
        }

        htmlContent += `
      </div>
      `;
    }

    htmlContent += `
  </body>
  </html>
  `;

    const outputDirectory = "merge_invoices";

    const outputDir = path.join(publicDir, outputDirectory);

    // if output directory doesn't exist, create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Generate a unique filename for the PDF
    const filename = `merge_invoices-${bill_no}.pdf`;
    // Save the PDF to the proforma_invoices folder
    const filePath = path.join(outputDir, filename);

    const options = {
        format: "A4",
        path: filePath, // you can pass path to save the file
        printBackground: true,
        margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
    };

    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toFile(filePath, function (err, res) {
            if (err) return reject(err);
            const finalOutputFilename = `${outputDirectory}-${bill_no}.pdf`;
            const relativeOutputFilePath = `/${outputDirectory}/${finalOutputFilename}`;

            const outputFilePath = path.join(outputDir, finalOutputFilename);
            // attachPdfsAndImages(filePath, [], outputFilePath);

            resolve(relativeOutputFilePath);
        });
    });
}
module.exports = {
    printOfficeFundAndStock,
    printSiteFundAndStock,
    generatePdf,
    buildHtml,
    convertDataToPDF,
};

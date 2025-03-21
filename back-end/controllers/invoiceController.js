require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const htmlPdf = require("html-pdf-node");
const fs = require("fs");

const { StatusCodes } = require("http-status-codes");
const { invoiceSchema, checkPositiveInteger } = require("../helpers/validation");
var moment = require("moment");
var {
    calculatePagination,
    getCreatedByDetails,
    getComplaintUniqueId,
    getCompanyDetailsById,
    getPoDetailById,
    getRegionalNameById,
    getOutletById,
    getComplaintTimeline,
    getComplaintsToAreaManager,
    getComplaintUniqueIdInPayment,
    getComplaintUniqueIdInPaymentForRo,
    getComplaintTypeById,
} = require("../helpers/general");
const {
    generateInvoiceNumber,
    getStateById,
    getRegionalOfficeById,
    getMeasurementsItemsSubChildById,
    calculatedPercentage,
    calculateGstAmount,
    addCreatedByCondition,
    generateInvoiceId,
} = require("../helpers/commonHelper");

const { getExpensePunchAndStockTotalAmounts } = require("../helpers/commonHelper");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const { generatePdf, buildHtml } = require("./pdfController");
// async function getRegionalOfficeById(id) {
//     try {
//         const { error } = checkPositiveInteger.validate({ id });

//         if (error) {
//             return error.message;
//         }

//         const selectQuery = 'SELECT * FROM regional_offices WHERE id = ?';

//         const queryResult = await db.query(selectQuery, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             return queryResult[0];
//         } else {
//             return [];
//         }
//     } catch (error) {next(error)
//         return error.message;
//     }
// }
// create api for invoice data
const createInvoiceData = async (req, res, next) => {
    try {
        const { error } = invoiceSchema.validate(req.body);
        // return
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        // return
        const {
            invoice_date,
            financial_year,
            callup_number,
            pi_id,
            billing_to,
            companies_for,
            billing_from,
            po_number,
            regional_office,
        } = req.body;
        const pi_ids = pi_id.join();
        const formattedInvoiceDate = moment(invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD");
        const createdBy = req.user.user_id || 0;

        // get selected financial year last bill no
        // const lastBillNumber = await generateInvoiceNumber(financial_year, billing_to);
        const lastBillNumber = await generateInvoiceId(createdBy);

        const insertQuery =
            "INSERT INTO invoices (invoice_date, financial_year, callup_number, pi_id, billing_to, companies_for, invoice_no, billing_from, po_number, billing_ro, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const insertValues = [
            formattedInvoiceDate,
            financial_year,
            callup_number,
            pi_id.join(","),
            billing_to,
            companies_for,
            lastBillNumber,
            billing_from,
            po_number,
            regional_office,
            req.user.user_id,
        ];
        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const discardsPi = await discardPI(pi_id);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Invoice data created successfully",
            });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error in creating a new invoice" });
        }
    } catch (error) {
        return next(error);
    }
};

async function discardPI(pi_id) {
    // Ensure pi_id is an array and convert it to a comma-separated string
    const pi_ids = pi_id.map((id) => String(id).trim()).join(",");

    // Query to fetch the relevant records
    const selectQuery = await db.query(`SELECT * FROM proforma_invoices WHERE id IN (${pi_ids})`);
    if (selectQuery.length > 0) {
        for (const row of selectQuery) {
            const pi_details = row.id;

            let discardStatus;

            if (row.status === "2") {
                discardStatus = "3";
            } else {
                discardStatus = "5";
            }

            const updateQuery = `UPDATE proforma_invoices SET status = ?, invoice_status = '2' WHERE id = ?`;

            await db.query(updateQuery, [discardStatus, pi_details]);
        }
    } else {
        console.log("No records found for the given pi_id(s)");
    }
}

async function getComplaintsIdbyPI(ids) {
    const formattedIds = ids
        .split(",")
        .map((id) => id.trim())
        .join(",");
    const pi = await db.query(`SELECT complaint_id FROM proforma_invoices WHERE id IN (${formattedIds})`);

    const allComplaintIds = pi.flatMap((row) => row.complaint_id.split(","));

    return allComplaintIds;
}

//update api for invoice data
const updateInvoiceData = async (req, res, next) => {
    try {
        const { error } = invoiceSchema.validate(req.body);
        // return
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request data" });
        }

        const { id, invoice_date, financial_year, callup_number } = req.body;
        const createdBy = req.user.user_id || 0;

        const selectQuery = await db.query(`select * from invoices where id= ${id}`);
        if (selectQuery.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoice not found" });
        }

        // const lastBillNumber = await generateInvoiceNumber(
        //     financial_year,
        //     selectQuery[0].billing_to,
        //     selectQuery[0].companies_for
        // );
        const lastBillNumber = await generateInvoiceId(createdBy);

        const formattedInvoiceDate = moment(invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD");

        const updateQuery = `UPDATE invoices SET invoice_date ='${formattedInvoiceDate}', financial_year = '${financial_year}', callup_number = ${callup_number}, invoice_no= '${lastBillNumber}' WHERE id = ${id}`;

        const result = await db.query(updateQuery);
        if (result.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Invoice updated successfully",
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoice not found" });
        }
    } catch (error) {
        return next(error);
    }
};
const getAllInvoices = async (req, res, next) => {
    try {
        const status = req.query.status ?? 1;
        const { po_id, ro_id, billing_from, billing_to } = req.query;
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const complaint_type = req.query.complaint_type;
        const sale_area_id = req.query.sale_area_id;
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Build search condition
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `WHERE (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }
        let whereConditions = "";

        if (po_id) {
            whereConditions += ` AND invoices.po_number = '${po_id}'`;
        }

        if (ro_id) {
            whereConditions += ` AND invoices.billing_ro = '${ro_id}'`;
        }

        if (billing_from) {
            whereConditions += ` AND invoices.billing_from = '${billing_from}'`;
        }

        if (billing_to) {
            whereConditions += ` AND invoices.billing_to = '${billing_to}'`;
        }

        // Fetch invoices data
        let selectQuery = `select invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id FROM invoices LEFT JOIN regional_offices ON regional_offices.id = invoices.billing_ro  LEFT JOIN purchase_orders ON purchase_orders.id = invoices.po_number WHERE merged_invoice_status IS NULL AND invoices.status = ${status} ${whereConditions} ORDER BY invoices.id`;

        selectQuery = addCreatedByCondition(selectQuery, { table: "invoices", created_by: req.user.user_id });

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Invoice not found" });
        }
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        let invoices = [];

        for (const row of queryResult) {
            const complaintIds = await getComplaints(row.pi_id);
            const complaintDetails = [];
            const salesAreaDetailsSet = new Set();
            const salesAreaDetails = [];

            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());

                // console.log('complaint?.complaint_type: ', complaint?.complaint_type);
                let complaintType;
                if(complaint?.complaint_type) {
                    complaintType = await getComplaintTypeById(complaint?.complaint_type);
                }
                complaint.complaint_type_name = complaintType?.complaint_type_name;

                const saleAreaId = complaint.sale_area_id && Number(JSON.parse(complaint.sale_area_id)[0]);

                if (!salesAreaDetailsSet.has(saleAreaId) && row.companies_for == "1") {
                    const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                    salesAreaDetails.push(saleAreaDetail);
                    salesAreaDetailsSet.add(saleAreaId);
                }
                complaintDetails.push(complaint);
            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            row.complaintDetails = complaintDetails;
            row.getOutletDetail = getOutletDetail;

            const billingFrom = await getCompanyDetailsById(row.billing_from);
            const billingFromData = {
                company_id: billingFrom.company_id,
                company_name: billingFrom.company_name,
                company_address: billingFrom.company_address,
                gst_number: billingFrom.gst_number,
            };

            const state = await getStateById(row.billing_from_state);

            const billingToData = await getBillingToData(row.billing_to);

            const regionalOffice = await getRegionalOfficeById(row.billing_ro);
            const regionalOfficeData = {
                ro_id: regionalOffice.id,
                ro_name: regionalOffice.regional_office_name,
            };

            const createdByDetails = await getCreatedByDetails(row.created_by);

            const field = {
                id: row.id,
                bill_no: row.invoice_no,
                billing_from: billingFromData,
                billing_from_state: state.name,
                billing_from_state_id: row.billing_from_state,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: row.financial_year,
                po_id: row.po_id,
                po_number: row.po_number,
                po_date: moment(row.po_date).format("DD-MM-YYYY"),
                work: row.work,
                created_by: row.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(row.created_at).format("DD-MM-YYYY"),
                regional_office_name: row.regional_office_name,
                complaintDetails: row.complaintDetails,
                outletDetails: row.getOutletDetail,
                salesAreaDetails,
                pi_bill: complaintIds.finalBill,
                invoice_date: moment(row.invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD"),
            };

            invoices.push(field);
        }

        if (!pageSize) {
            invoices = invoices.map((item) => {
                return {
                    ...item,
                    billing_from: item.billing_from?.company_name,
                    billing_to: item.billing_to?.company_name,
                    billing_to_ro_office: item.billing_to_ro_office?.ro_name,
                    complaint_unique_id: item.complaintDetails
                        .map((complaint) => complaint.complaint_unique_id)
                        .join(", "),
                    outletDetails: item.outletDetails[0]?.outlet_name,
                    pi_bill: item.pi_bill[0],
                };
            });
            let filePath;
            let message;
            if (type == "1") {
                filePath = await exportToExcel(invoices, "invoice", columns);
                message = "excel exported successfully";
            } else {
                filePath = await exportToPDF(invoices, "invoice", "Invoices", columns);
                message = "pdf exported successfully";
            }
            return res.status(StatusCodes.OK).json({ status: true, message, filePath });
        }

        if (sale_area_id) {
            invoices = invoices.filter((item) => item.salesAreaDetails.some((saleArea) => saleArea.id == sale_area_id));
        }

        if (complaint_type) {
            invoices = invoices
                .map((item) => {
                    item.complaintDetails = item.complaintDetails.filter((c) => c.complaint_type == complaint_type);
                    return item;
                })
                .filter((item) => item.complaintDetails.length > 0);
        }

        if (sale_area_id || complaint_type) {
            const pageFirstResult = (currentPage - 1) * pageSize + 1;
            const total = invoices.length;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            const totalPages = Math.ceil(total / pageSize);
            const pageDetails = {
                pageSize,
                currentPage,
                totalPages,
                total,
                pageFirstResult,
                pageEndResult,
            };
            const paginatedData = invoices.slice(pageFirstResult - 1, pageEndResult);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: paginatedData,
                pageDetails: pageDetails,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            data: invoices,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
        console.error("Error in getAllInvoices:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const getBillingToData = async (billingToId, isEnergyCompany) => {
    let queryResult;

    if (isEnergyCompany == 1) {
        queryResult = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [billingToId]);
    } else {
        queryResult = await db.query(
            `SELECT company_id AS id, company_name AS name, company_address, gst_number FROM companies WHERE company_id = ?`,
            [billingToId]
        );
    }

    if (queryResult.length === 0) {
        throw new Error("Company not found");
    }

    const billingTo = queryResult[0];

    return {
        company_id: billingTo.id,
        company_name: billingTo.name,
        company_address: billingTo.company_address || "",
        gst_number: billingTo.gst_number || "",
    };
};

async function getOutletDetails(complaintDetailsArrays) {
    // Combine multiple complaintDetails arrays into one
    const complaintDetails = complaintDetailsArrays.reduce((acc, array) => acc.concat(array), []);

    let outletDetails = [];

    for (let i = 0; i < complaintDetails.length; i++) {
        const outletData = complaintDetails[i];

        if (outletData.complaint_for === "1") {
            // Use parameterized query to get the outlet_id from complaints
            const selectOutlets = await db.query("SELECT outlet_id FROM complaints WHERE id = ?", [outletData.id]);

            if (selectOutlets.length > 0) {
                let outletId = selectOutlets[0].outlet_id;

                // If outletId is a string in the format '[number]', remove the square brackets
                if (typeof outletId === "string" && outletId.startsWith("[") && outletId.endsWith("]")) {
                    outletId = outletId.slice(1, -1); // Remove the square brackets
                }

                // Use parameterized query with FIND_IN_SET
                const query = `SELECT outlet_name, id FROM outlets WHERE FIND_IN_SET(id, ?)`;
                const outlets = await db.query(query, [outletId]);

                if (outlets.length > 0) {
                    outletDetails.push(...outlets);
                }
            }
        }
    }

    // Filter for unique records based on the outlet id
    const filteredResult = {};
    outletDetails.forEach((record) => {
        filteredResult[record.id] = record;
    });

    const uniqueRecords = Object.values(filteredResult);
    return uniqueRecords;
}

async function getPurchaseOrder(id) {
    const query = `SELECT * FROM purchase_orders WHERE id = ?`;
    const queryResult = await db.query(query, [id]);

    if (queryResult.length > process.env.VALUE_ZERO) {
        return { id: queryResult[0].id, po_number: queryResult[0].po_number, po_date: queryResult[0].po_date };
    } else {
        throw new Error("Purchase order not found");
    }
}

const getInvoiceDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pdf = req.query.pdf;

        // Fetch invoice details from the database
        const selectQuery = `SELECT * FROM invoices WHERE id = ? `;
        const invoiceQueryResult = await db.query(selectQuery, [id]);

        if (invoiceQueryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "No invoices found." });
        }

        if (pdf == "1" && invoiceQueryResult[0]?.attachment) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "pdf generated",
                path: invoiceQueryResult[0].attachment,
            });
        }

        const finalData = [];

        for (const invoice of invoiceQueryResult) {
            const pi_ids = invoice.pi_id.split(",").map(Number);

            // Fetch proforma invoices details
            const proformaInvoicesQuery = await db.query("SELECT * FROM proforma_invoices WHERE id IN (?)", [pi_ids]);

            const finalBill = [];
            for (const row of proformaInvoicesQuery) {
                finalBill.push(row.bill_no);
            }
            // Create a map to quickly access proforma invoices by ID
            const proformaInvoicesMap = {};
            proformaInvoicesQuery.forEach((pi) => {
                if (!proformaInvoicesMap[pi.id]) {
                    proformaInvoicesMap[pi.id] = [];
                }
                proformaInvoicesMap[pi.id].push(pi);
            });

            // Flatten proforma invoices into an array
            const flattened = Object.values(proformaInvoicesMap).flat();

            const companyDetails = await getCompanyDetailsById(flattened[0].billing_from);
            const { company_id, company_name, company_address, gst_number } = companyDetails;

            const billing_from = { company_id, company_name, company_address, gst_number };

            const complaint_details = await Promise.all(
                pi_ids.flatMap(async (pi_id) => {
                    const proformaInvoice = flattened.find((item) => item.id === pi_id);
                    if (proformaInvoice) {
                        const complaintIds = proformaInvoice.complaint_id.split(",").map(Number);
                        return Promise.all(
                            complaintIds.map(async (id) => await getComplaintUniqueId(String(id).trim()))
                        );
                    } else {
                        return [];
                    }
                })
            );

            const getOutlet = await getOutletDetails(complaint_details);

            // Prepare data for the current invoice
            const formattedData = {
                id: invoice.id,
                invoice_date: moment(invoice.invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                billing_from: billing_from,
                billing_from_state: await getStateById(flattened[0].billing_from_state),
                billing_to: await getBillingToData(flattened[0].billing_to),
                billing_to_ro_office: await getRegionalOfficeById(flattened[0].billing_to_ro_office),
                financial_year: invoice.financial_year,
                bill_no: invoice.invoice_no,
                callup_number: invoice.callup_number,
                work: invoice.work,
                created_by: invoice.created_by,
                created_by_name: (await getCreatedByDetails(flattened[0].created_by)).name,
                created_at: moment(invoice.created_at).format("DD-MM-YYYY"),
                is_merged: invoice.is_merged,
                po_details: await getPurchaseOrder(flattened[0].po_number),
                complaintDetails: complaint_details,
                outletDetails: getOutlet,
                getMeasurements: [],
                pi_bill: finalBill,
            };

            for (const pi_id of pi_ids) {
                const pi = flattened.find((item) => item.id === pi_id);
                let measurements = [];

                if (pi.mpi_status == null) {
                    measurements = JSON.parse(pi.measurements);
                } else {
                    const mergedPi = pi.merged_pi_id.split(",");
                    for (const id of mergedPi) {
                        const selectQuery = await db.query("SELECT measurements FROM proforma_invoices WHERE id = ?", [
                            id.trim(),
                        ]);
                        if (selectQuery.length > 0) {
                            measurements.push(...JSON.parse(selectQuery[0].measurements));
                        }
                    }
                }

                const parsedMeasurements = measurements.flatMap((measurement) => {
                    if (typeof measurement === "string") {
                        return JSON.parse(measurement);
                    }
                    return measurement;
                });

                const piMeasurements = {
                    pi_id: pi_id,
                    bill_no: pi.bill_no,
                    getMeasurements: [],
                };

                if (Array.isArray(parsedMeasurements) && parsedMeasurements.length > 0) {
                    for (const item of parsedMeasurements) {
                        const getItemDetails = await db.query(
                            `SELECT DISTINCT order_line_number, po_id FROM measurement_items WHERE measurement_id = ?`,
                            [item.measurement_list]
                        );

                        const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                        const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);

                        item.complaintDetails = {
                            complaint_id: complaint.id,
                            complaint_unique_id: complaint.complaint_unique_id,
                            id: getComplaintId.complaint_id,
                        };

                        // Initialize total_amount before processing item details
                        let total_amount = 0;

                        // Process item details and calculate total_amount
                        const itemDetailsArray = getItemDetails.map((detail) => ({
                            order_line_number: detail.order_line_number,
                            is_status: false, // Adjust as needed based on your logic
                        }));

                        const po_id = getItemDetails[0].po_id;
                        item.items_data = await processItemDetails(itemDetailsArray, item.measurement_list, po_id);
                        piMeasurements.getMeasurements.push(item);
                    }
                }

                formattedData.getMeasurements.push(piMeasurements);
            }

            finalData.push(formattedData);
        }

        if (pdf == "1") {
            //generate bill pdf
            finalData[0].getMeasurements = finalData[0].getMeasurements[0].getMeasurements;
            finalData[0].po_number = finalData[0].po_details.po_number;
            finalData[0].po_date = finalData[0].po_details.po_date
                ? moment(finalData[0].po_details.po_date).format("DD-MM-YYYY")
                : "";
            finalData[0].billing_from_state = finalData[0]?.billing_from_state?.name;
            const outputDirectory = "invoices";
            const filePath = await generatePdf(finalData[0], outputDirectory);
            const updateQuery = `UPDATE invoices SET attachment = ? WHERE id = ?`;
            await db.query(updateQuery, [filePath, id]);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "pdf generated",
                path: filePath,
            });
        }

        // Return final formatted data as JSON response
        return res.status(StatusCodes.OK).json({ status: true, data: finalData });
    } catch (error) {
        return next(error);
    }
};

// Function to process item details based on itemDetailsArray and measurementList
const processItemDetails = async (itemDetailsArray, measurementList, po_id) => {
    if (!itemDetailsArray || itemDetailsArray.length === 0) {
        return [];
    }
    const uniqueItemsMap = new Map();
    const itemIds = itemDetailsArray.map((detail) => detail.order_line_number);

    // Assuming po_id is part of the context where the function is called
    // Ensure po_id is correctly derived from the context
    const itemDetails = await getItemsDetailsById(itemIds, measurementList, po_id);
    if (itemDetails.length > 0) {
        for (const mainItem of itemDetails) {
            const subChildData = await getMeasurementsItemsSubChildById(
                mainItem.measurement_id,
                mainItem.order_line_number
            );
            let total_amount = 0; // Initialize total_amount within the loop
            total_amount += mainItem.amount; // Increment total_amount with mainItem.amount

            const key = mainItem.order_line_number;
            if (!uniqueItemsMap.has(key)) {
                uniqueItemsMap.set(key, {
                    order_line_number: mainItem.order_line_number,
                    item_name: mainItem.item_name,
                    rate: mainItem.rate,
                    unit: mainItem.unit_name,
                    total_qty: mainItem.total_quantity,
                    measurement_id: mainItem.measurement_id,
                    is_status: itemDetailsArray.find(
                        (detail) => detail.order_line_number === mainItem.order_line_number
                    )?.is_status,
                    childArray: subChildData,
                });
            }
        }
    }
    return Array.from(uniqueItemsMap.values());
};

async function getComplaintIdMeasurement(measurementId) {
    try {
        const query = `SELECT complaint_id FROM measurements WHERE id ='${measurementId}'`;
        const getData = await db.query(query);
        return getData[0];
    } catch (error) {
        throw error;
    }
}

async function getItemsDetailsById(id, measurement_id, po_id) {
    try {
        let mainIds;

        if (typeof id === "object") {
            mainIds = id.join(",");
        } else {
            mainIds = id;
        }

        const query = `SELECT DISTINCT measurement_items.id, measurement_items.measurement_id,purchase_order_item.name AS item_name, purchase_order_item.hsn_code, measurement_items.order_line_number, measurement_items.unit_id AS unit_name, measurement_items.number, measurement_items.length, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate, measurement_items.amount, measurements.po_id, complaints.id AS complaint_id, complaints.complaint_unique_id FROM measurement_items LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = measurement_items.order_line_number LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN complaints ON measurements.complaint_id = complaints.id WHERE measurement_items.measurement_id = ${measurement_id} AND measurement_items.po_id = ${po_id} AND measurement_items.order_line_number IN (${mainIds});`;

        const queryResult = await db.query(query);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

const deleteInvoiceData = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM invoices WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Invoice deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong deleting the invoices.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const discardInvoice = async (req, res, next) => {
    try {
        const id = req.params.id;
        // return
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please provide id",
            });
        }
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT * FROM invoices WHERE id = ?";
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invoice not found",
            });
        }

        const discardQuery = "UPDATE invoices SET status = 2 WHERE id = ?";
        const updatedata = await db.query(discardQuery, [id]);
        if (updatedata.affectedRows === 0) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Failed to discard.",
            });
        }
        let piIds = queryResult[0].pi_id.split(",");

        const selectPiQuery = "SELECT * FROM proforma_invoices WHERE id = ?";

        for (const id of piIds) {
            const piResult = await db.query(selectPiQuery, [id]);
            if (piResult[0].mpi_status == null) {
                await db.query("UPDATE proforma_invoices SET status = 2 WHERE id = ?", [id]);
            } else {
                await db.query("UPDATE proforma_invoices SET status = 4 WHERE id = ?", [id]);
            }
        }
        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Invoice discarded successfully",
        });
    } catch (error) {
        return next(error);
    }
};

// merged invoice

const mergeInvoice = async (req, res, next) => {
    try {
        const { id, billing_to, companies_for, billing_from, regional_office, po_number } = req.body;
        console.log("id: ", id);

        const pi_id = await getInvoicesByPiIds(id);
        console.log("pi_id: ", pi_id);

        const financial = await checkFinancialYear(id, pi_id.financialYear);

        // const formattedInvoiceDate = moment(invoice_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const lastBillNumber = await generateInvoiceNumber(pi_id.financialYear, billing_to, companies_for);

        const insertQuery =
            "INSERT INTO invoices (pi_id, financial_year, billing_to, companies_for, invoice_no, merged_invoice_id, status, merged_invoice_status, billing_from, billing_ro, po_number, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const insertValues = [
            pi_id.result,
            pi_id.financialYear,
            billing_to,
            companies_for,
            lastBillNumber,
            id.join(","),
            "2",
            "1",
            billing_from,
            regional_office,
            po_number,
            req.user.user_id,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > 0) {
            const updateStatus = await updatInvoiceStatus(id);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Proforma Invoice merged successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function getInvoicesByPiIds(ids) {
    const placeholders = ids.map((id) => id).join(",");
    const selectQuery = `SELECT * FROM invoices WHERE id IN (${placeholders})`;

    const query = await db.query(selectQuery);
    if (query.length > 0) {
        const final = [];
        for (const row of query) {
            final.push(row.pi_id);
        }
        const result = final.join(", ");
        const financialYear = query[0].financial_year;
        return { result, financialYear };
    } else {
        return "";
    }
}

async function updatInvoiceStatus(ids) {
    const placeholders = ids.map((id) => id).join(",");
    const selectQuery = `UPDATE invoices SET status = 2 WHERE id IN (${placeholders})`;
    const query = await db.query(selectQuery);
}

async function checkFinancialYear(ids, expectedFinancialYear) {
    const formattedIds = ids.map((id) => String(id)).join(",");

    try {
        const query = `SELECT financial_year FROM invoices WHERE id IN (${formattedIds})`;
        const rows = await db.query(query);

        const fetchedFinancialYears = rows.map((row) => row.financial_year);

        if (!fetchedFinancialYears.every((year) => year === expectedFinancialYear)) {
            throw new Error(`Please select the same financial year For merged invoice.`);
        }

        return true;
    } catch (error) {
        throw error;
    }
}

const getAllMergedInvoices = async (req, res, next) => {
    try {
        // Pagination data
        const status = req.query.merged_invoice_status ?? 1;
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";

        // Build search condition
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `WHERE (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        // Fetch invoices data
        let selectQuery = `select invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id  from invoices LEFT JOIN regional_offices ON regional_offices.id = invoices.billing_ro  LEFT JOIN purchase_orders ON purchase_orders.id = invoices.po_number WHERE merged_invoice_status = ${status} ORDER BY invoices.id`;

        selectQuery = addCreatedByCondition(selectQuery, { table: "invoices", created_by: req.user.user_id });

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Invoice not found" });
        }
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        let invoices = [];

        for (const row of queryResult) {
            const complaintIds = await getComplaints(row.pi_id);
            const complaintDetails = [];

            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());
                complaintDetails.push(complaint);
            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            row.complaintDetails = complaintDetails;
            row.getOutletDetail = getOutletDetail;

            const billingFrom = await getCompanyDetailsById(row.billing_from);
            const billingFromData = {
                company_id: billingFrom.company_id,
                company_name: billingFrom.company_name,
                company_address: billingFrom.company_address,
                gst_number: billingFrom.gst_number,
            };

            const state = await getStateById(row.billing_from_state);

            const billingToData = await getBillingToData(row.billing_to);

            const regionalOffice = await getRegionalOfficeById(row.billing_ro);
            const regionalOfficeData = {
                ro_id: regionalOffice.id,
                ro_name: regionalOffice.regional_office_name,
            };

            const createdByDetails = await getCreatedByDetails(row.created_by);

            const field = {
                id: row.id,
                bill_no: row.invoice_no,
                billing_from: billingFromData,
                billing_from_state: state.name,
                billing_from_state_id: row.billing_from_state,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: row.financial_year,
                po_id: row.po_id,
                po_number: row.po_number,
                po_date: moment(row.po_date).format("DD-MM-YYYY"),
                work: row.work,
                created_by: row.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(row.created_at).format("DD-MM-YYYY"),
                regional_office_name: row.regional_office_name,
                complaintDetails: row.complaintDetails,
                outletDetails: row.getOutletDetail,
                pi_bill: complaintIds.finalBill,
            };

            invoices.push(field);
        }

        if (!pageSize) {
            invoices = invoices.map((item) => {
                return {
                    ...item,
                    billing_to_ro_office: item.billing_to_ro_office.ro_name,
                    billing_from: item.billing_from.company_name,
                    billing_to: item.billing_to.company_name,
                    complaint_unique_id: item.complaintDetails.map((item) => item.complaint_unique_id).join(", "),
                };
            });
            let filePath;
            let message;
            if (type == "1") {
                filePath = await exportToExcel(invoices, "merged-inovice", columns);
                message = "excel exported successfully";
            } else {
                filePath = await exportToPDF(invoices, "merged-inovice", "Merged Invoices", columns);
                message = "pdf exported successfully";
            }
            return res.status(StatusCodes.OK).json({ status: true, message, filePath });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            data: invoices,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

const getMergedInvoiceDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pdf = req.query.pdf;

        const selectQuery = await db.query(
            `select invoices.*, invoices.invoice_no AS invoice_number, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id  from invoices LEFT JOIN regional_offices ON regional_offices.id = invoices.billing_ro  LEFT JOIN purchase_orders ON purchase_orders.id = invoices.po_number Where invoices.id = ${id}`
        );

        if (selectQuery.length == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoice not found" });
        }

        if (pdf == "1" && selectQuery[0]?.merged_attachment) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "pdf generated",
                path: selectQuery[0].merged_attachment,
            });
        }

        const getDetail = selectQuery[0];
        const invoiceNo = getDetail.invoice_no;
        const complaintIds = await getComplaints(getDetail.pi_id);
        const complaintDetails = [];

        for (const complaintId of complaintIds.finalComplaints) {
            const complaint = await getComplaintUniqueId(complaintId.trim());
            complaintDetails.push(complaint);
        }

        const getOutletDetail = await getOutletDetails(complaintDetails);

        getDetail.complaintDetails = complaintDetails;
        getDetail.getOutletDetail = getOutletDetail;

        const billingFrom = await getCompanyDetailsById(getDetail.billing_from);
        const billingFromData = {
            company_id: billingFrom.company_id,
            company_name: billingFrom.company_name,
            company_address: billingFrom.company_address,
            gst_number: billingFrom.gst_number,
        };

        const state = await getStateById(getDetail.billing_from_state);

        const billingToData = await getBillingToData(getDetail.billing_to);

        const regionalOffice = await getRegionalOfficeById(getDetail.billing_ro);
        const regionalOfficeData = {
            ro_id: regionalOffice.id,
            ro_name: regionalOffice.regional_office_name,
        };

        const createdByDetails = await getCreatedByDetails(getDetail.created_by);

        const field = {
            id: getDetail.id,
            bill_no: getDetail.invoice_no,
            billing_from: billingFromData,
            billing_to: billingToData,
            billing_to_ro_office: regionalOfficeData,
            financial_year: getDetail.financial_year,
            pi_number: getDetail.bill_no,
            po_id: getDetail.po_id,
            po_number: getDetail.po_number,
            po_date: moment(getDetail.po_date).format("DD-MM-YYYY"),
            work: getDetail.work,
            created_by: getDetail.created_by,
            created_by_name: createdByDetails.name,
            created_at: moment(getDetail.created_at).format("DD-MM-YYYY"),
            regional_office_name: getDetail.regional_office_name,
            complaintDetails: getDetail.complaintDetails,
            outletDetails: getDetail.getOutletDetail,
            pi_bill: complaintIds.finalBill,
            netAmount: 0, // Initialize netAmount to 0
            gstAmount: 0,
            grossAmount: 0,
        };

        let invoiceId;
        if (getDetail.merged_invoice_status != "" && getDetail.merged_invoice_status != null) {
            invoiceId = getDetail.merged_invoice_id.split(",").map(Number);
        } else {
            invoiceId = id.split(",").map(Number);
        }

        const getMeasurements = [];

        for (const row of invoiceId) {
            const data = await db.query(`SELECT * FROM invoices WHERE id = ${row}`);
            const invoiceData = data[0];

            const invoiceMeasurements = {
                invoice: invoiceData.id,
                invoice_no: invoiceData.invoice_no,
                piMeasurements: [],
            };

            const pi_detail = invoiceData.pi_id.split(",").map(Number);
            const pi_data = await db.query(`SELECT * FROM proforma_invoices WHERE id IN (${pi_detail.join(",")})`);

            for (const pi_id of pi_data) {
                let measurements = [];

                if (pi_id.mpi_status == null) {
                    measurements = JSON.parse(pi_id.measurements);
                } else {
                    const mergedPi = pi_id.merged_pi_id.split(",");
                    for (const id of mergedPi) {
                        const selectQuery = await db.query("SELECT measurements FROM proforma_invoices WHERE id = ?", [
                            id.trim(),
                        ]);
                        if (selectQuery.length > 0) {
                            measurements.push(...JSON.parse(selectQuery[0].measurements));
                        }
                    }
                }

                const parsedMeasurements = measurements.flatMap((measurement) => {
                    if (typeof measurement === "string") {
                        return JSON.parse(measurement);
                    }
                    return measurement;
                });

                const piMeasurements = {
                    pi_id: pi_id.id,
                    bill_no: pi_id.bill_no,
                    net_amount: 0, // Initialize net_amount to 0
                    gst_amount: 0,
                    measurements: [],
                };

                if (Array.isArray(parsedMeasurements) && parsedMeasurements.length > 0) {
                    for (const item of parsedMeasurements) {
                        const getItemDetails = await db.query(
                            `SELECT DISTINCT order_line_number, po_id FROM measurement_items WHERE measurement_id = ?`,
                            [item.measurement_list]
                        );

                        // Ensure item.netAmount is initialized to 0
                        item.netAmount = 0;
                        item.gstAmount = 0;
                        // Fetch the calculated amount
                        const getAmount = await calculateAmount(item.measurement_list, getItemDetails);

                        // Ensure getAmount[0].Amount is a number before adding it
                        const amountToAdd = parseFloat(getAmount[0].Amount);
                        item.netAmount += amountToAdd;
                        piMeasurements.net_amount += item.netAmount;

                        const calculateGst = await calculateGstAmount(item.measurement_list);

                        const gstAmountAdd = parseFloat(calculateGst);
                        item.gstAmount += gstAmountAdd;

                        piMeasurements.gst_amount += item.gstAmount;
                        // Add item.netAmount to piMeasurements.net_amount

                        const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                        const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);

                        item.complaintDetails = {
                            complaint_id: complaint.id,
                            complaint_unique_id: complaint.complaint_unique_id,
                            id: getComplaintId.complaint_id,
                        };

                        const itemDetailsArray = getItemDetails.map((detail) => ({
                            order_line_number: detail.order_line_number,
                            is_status: false, // Adjust as needed based on your logic
                        }));

                        const po_id = getItemDetails[0].po_id;
                        item.items_data = await processItemDetails(itemDetailsArray, item.measurement_list, po_id);
                        piMeasurements.measurements.push(item);
                    }
                }

                invoiceMeasurements.piMeasurements.push(piMeasurements);

                // Accumulate the net_amount for this piMeasurement
                // field.netAmount += +piMeasurements.net_amount;
                // field.gstAmount += piMeasurements.gst_amount;
                // Assuming field.netAmount and field.gstAmount are numbers or can be parsed to numbers
                field.netAmount = (parseFloat(field.netAmount) + parseFloat(piMeasurements.net_amount)).toFixed(4);
                field.gstAmount = (parseFloat(field.gstAmount) + parseFloat(piMeasurements.gst_amount)).toFixed(4);

                field.grossAmount =
                    parseFloat(field.grossAmount) + piMeasurements.net_amount + piMeasurements.gst_amount;
                field.grossAmount = field.grossAmount.toFixed(4);
            }

            getMeasurements.push(invoiceMeasurements);
        }

        field.measurements = getMeasurements; // Include measurements in the field object

        const data = { ...field, getMeasurements };

        if (pdf == "1") {
            const path = await buildHtml(data);
            const updateQuery = `UPDATE invoices SET merged_attachment = ? WHERE id = ?`;
            await db.query(updateQuery, [path, id]);
            return res.status(200).json({ status: true, path, message: "pdf generated" });
        }

        return res.status(200).json({ status: true, data });
    } catch (error) {
        return next(error);
        return res.status(404).json({ message: error.message });
    }
};

async function calculateAmount(measurement_id, getItemDetails) {
    const selectQuery = await db.query(
        `select SUM(quantity * rate) AS Amount from measurement_items where measurement_id = ${measurement_id}`
    );

    return selectQuery;
}

async function getComplaints(pi_id) {
    const pi = pi_id.split(",").map(Number);

    const selectQuery = await db.query(`SELECT * FROM proforma_invoices WHERE id IN (${pi.map((id) => id)})`);
    const finalBill = [];
    const complaints = [];
    for (const row of selectQuery) {
        const complaintIds = row.complaint_id;
        complaints.push(complaintIds);
        finalBill.push(row.bill_no);
    }
    const joinComplaints = complaints.join(",");
    const finalComplaints = joinComplaints.split(",");

    return { finalComplaints, finalBill };
}

/** Discard Merged Invoice */
const discardMergedInvoice = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please provide id",
            });
        }
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        /** fetch the merged invoice */
        const selectQuery = "SELECT * FROM invoices WHERE id = ?";
        const queryResult = await db.query(selectQuery, [id]);

        /** if invoice not found */
        if (queryResult.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invoice not found",
            });
        }
        /** check whether invoice is merged or not */
        if (queryResult[0].merged_invoice_status == null || queryResult[0].merged_invoice_status != "1") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invoice not Merged",
            });
        }

        /** udpate discard status of Merged Invoice */
        const discardQuery = "UPDATE invoices SET merged_invoice_status = 2 WHERE id = ?";
        const updatedata = await db.query(discardQuery, [id]);

        if (updatedata.affectedRows === 0) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Failed to discard.",
            });
        }
        if (queryResult[0].merged_invoice_id == null) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Merged Invoiced Ids not available",
            });
        }

        let miIds = queryResult[0].merged_invoice_id.split(",");

        /** fetch data query from respective Merge Invoice Ids */
        const selectPiQuery = "SELECT * FROM invoices WHERE id = ?";

        /** update status of merged invoices */
        for (const id of miIds) {
            const miResult = await db.query(selectPiQuery, [id]);
            await db.query("UPDATE invoices SET status = 1 WHERE id = ?", [id]);
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Invoice discarded successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const getAllPOForInvoices = async (req, res, next) => {
    try {
        const status = req.query.status;

        const selectQuery = await db.query(
            // `SELECT * FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL GROUP BY po_number ORDER BY id`
            `SELECT po_number, MAX(id) AS id, status FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL GROUP BY po_number ORDER BY id`
        );

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getPi = selectQuery.map((item) => item.po_number);
            const dataFilter = getPi.filter((value, index) => getPi.indexOf(value) === index);
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const poDetails = await getPoDetailById(dataFilter[i]);
                finalData.push(poDetails);
            }
            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllComplaintTypesForInvoices = async (req, res, next) => {
    try {
        const status = req.query.status;
        const selectQuery = await db.query(
            // `SELECT pi_id FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL group by po_number ORDER BY id ASC;`
            `SELECT pi_id FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL GROUP BY pi_id`
        );

        if (selectQuery.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const finalData = [];
        for (let row of selectQuery) {
            const complaintIds = await getComplaints(row.pi_id);
            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());
                
                if (complaint != "") {
                    let complaintType = await getComplaintTypeById(complaint.complaint_type);
                    finalData.push({
                        complaint_type: complaint.complaint_type,
                        complaint_type_name: complaintType?.complaint_type_name || "",
                    });
                }
            }
        }

        const uniqueData = finalData.filter(
            (value, index, self) => self.findIndex((v) => v.complaint_type === value.complaint_type) === index
        );

        res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: uniqueData });
    } catch (error) {
        return next(error);
    }
};

const getAllROForInvoices = async (req, res, next) => {
    try {
        const status = req.query.status;
        const po = req.query.po_id;
        // const invoice = req.query.invoice;

        if (status) {
            selectQuery = await db.query(
                `SELECT MAX(id) AS id,billing_ro FROM invoices 
                WHERE status = ${status} AND merged_invoice_status IS NULL GROUP BY billing_ro 
                ORDER BY id
                `
            );
        }

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
        const finalData = [];
        for (let item of selectQuery) {
            const ro = await getRegionalNameById(`${item.billing_ro}`);
            finalData.push({
                id: item.id,
                billing_ro: item.billing_ro,
                ro_id: ro[0].id,
                regional_office_name: ro[0].regional_office_name,
            });
        }
        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Request fetched successfully", data: finalData });
    } catch (error) {
        return next(error);
    }
};

const getAllSalesAreaForInvoices = async (req, res, next) => {
    try {
        const status = req.query.status;
        const po = req.query.po_id;
        const ro_id = req.query.ro_id;

        const selectQuery = await db.query(
            // `SELECT pi_id FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL group by po_number ORDER BY id ASC`
            `SELECT pi_id FROM invoices WHERE status = '${status}' AND merged_invoice_status IS NULL GROUP BY pi_id`
        );

        if (selectQuery.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const finalData = [];
        for (let row of selectQuery) {
            const complaintIds = await getComplaints(row.pi_id);
            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());
                // console.log("complaint: ", complaint);
                // console.log("complaint.sale_area_id: ", complaint.sale_area_id);
                const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                if (saleAreaDetail) {
                    finalData.push(saleAreaDetail);
                }
            }
        }

        const uniqueData = finalData.filter((value, index, self) => self.findIndex((s) => s.id === value.id) === index);
        if (uniqueData.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: uniqueData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data Not Found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllBillingFromCompany = async (req, res, next) => {
    try {
        const { status, po_id, ro_id, sale_area_id } = req.query;

        let whereClause = "";
        let queryParams = [];

        // Handle the status conditions
        if (status) {
            whereClause = " WHERE status = ?";
            queryParams.push(status);
        } else {
            whereClause = " WHERE status = 2";
        }

        // Append conditions for `po_id` and `ro_id`
        if (po_id) {
            whereClause += " AND po_number = ?";
            queryParams.push(po_id);
        }
        if (ro_id) {
            whereClause += " AND billing_ro = ?";
            queryParams.push(ro_id);
        }

        const query = `SELECT billing_from, pi_id FROM invoices ${whereClause} AND merged_invoice_status IS NULL`;
        const selectQuery = await db.query(query, queryParams);

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const finalResults = new Map(); // Use a Map to handle unique company entries

        for (const row of selectQuery) {
            const companyQuery = await db.query(
                `SELECT company_id AS id, company_name AS name FROM companies WHERE company_id = ?`,
                [row.billing_from]
            );

            if (companyQuery.length > 0) {
                finalResults.set(companyQuery[0].id, companyQuery[0]);
            }

            // Additional logic for sale_area_id
            // if (sale_area_id) {
            //     const complaintIds = await getComplaints(row.pi_id);

            //     for (const complaintId of complaintIds.finalComplaints) {
            //         const complaint = await getComplaintUniqueId(complaintId.trim());
            //         const saleAreaIds = JSON.parse(complaint.sale_area_id);

            //         if (saleAreaIds.includes(Number(sale_area_id))) {
            //             // If the company matches the sale area, ensure it's added to the results
            //             finalResults.set(companyQuery[0].id, companyQuery[0]);
            //             break; // Stop further iteration for this row if a match is found
            //         }
            //     }
            // }
        }

        // Convert the Map back to an array of unique results
        const uniqueResults = Array.from(finalResults.values());

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Request fetched successfully", data: uniqueResults });
    } catch (error) {
        return next(error);
    }
};

// const fromBillingToCompanyInInvoice = async (req,res,next) => {
//     try {
//         const { po_id, ro_id, billing_from, sale_area_id, status } = req.query;

//         if (!po_id || !ro_id || !billing_from) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: false,
//                 message: "Missing required query parameters."
//             });
//         }

//         // Set the status dynamically based on the invoice parameter
//         const selectQuery = await db.query(
//             `SELECT po_number, billing_ro, billing_from, billing_to, companies_for
//              FROM invoices
//              WHERE po_number = ? AND billing_ro = ? AND billing_from = ? AND status = ?`,
//             [po_id, ro_id, billing_from, status]
//         );

//         if (selectQuery.length === 0) {
//             return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
//         }

//         const finalResults = [];

//         for (const row of selectQuery) {
//             let query;
//             if (row.companies_for == '1') {
//                 query = await db.query(`SELECT id, name , '1' AS companies_for FROM energy_companies WHERE id = ?`, [row.billing_to]);

//             } else {
//                 query = await db.query(`SELECT company_id AS id, company_name AS name, '2' AS companies_for FROM companies WHERE company_id = ?`, [row.billing_to]);
//             }

//             finalResults.push(...query);
//         }

//         // Remove duplicate entries from the final array based on id
//         const uniqueResults = Array.from(new Set(finalResults.map(item => item.id)))
//             .map(id => finalResults.find(item => item.id === id));

//         return res.status(StatusCodes.OK).json({ status: true, data: uniqueResults });

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const fromBillingToCompanyInInvoice = async (req, res, next) => {
    try {
        const { po_id, ro_id, billing_from, sale_area_id, status } = req.query;

        // if (!po_id || !ro_id || !billing_from) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         status: false,
        //         message: "Missing required query parameters."
        //     });
        // }

        // Query invoices based on the provided parameters
        const selectQuery = await db.query(
            `SELECT po_number, billing_ro, billing_from, billing_to, companies_for, pi_id 
            FROM invoices 
            WHERE status = ?`,
            [status]
        );

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const finalResults = new Map(); // Use a Map to ensure uniqueness

        for (const row of selectQuery) {
            let companyQuery;

            // Fetch the company details based on companies_for value
            // if (row.companies_for == "1") {
            //     companyQuery = await db.query(
            //         `SELECT id, name, '1' AS companies_for FROM energy_companies WHERE id = ?`,
            //         [row.billing_to]
            //     );
            // } else {
            //     companyQuery = await db.query(
            //         `SELECT company_id AS id, company_name AS name, '2' AS companies_for FROM companies WHERE company_id = ?`,
            //         [row.billing_to]
            //     );
            // }

            companyQuery = await db.query(
                `SELECT company_id AS id, company_name AS name, '2' AS companies_for FROM companies WHERE company_id = ?`,
                [row.billing_to]
            );

            // Add the company details to the final results
            if (companyQuery.length > 0) {
                finalResults.set(companyQuery[0].id, companyQuery[0]);
            }

            // Additional logic for sale_area_id if provided
            // if (sale_area_id) {
            //     const complaintIds = await getComplaints(row.pi_id);

            //     for (const complaintId of complaintIds.finalComplaints) {
            //         const complaint = await getComplaintUniqueId(complaintId.trim());
            //         const saleAreaIds = JSON.parse(complaint.sale_area_id);

            //         if (saleAreaIds.includes(Number(sale_area_id))) {
            //             // If the company matches the sale area, ensure it's added to the results
            //             finalResults.set(companyQuery[0].id, companyQuery[0]);
            //             break; // Stop further iteration for this row if a match is found
            //         }
            //     }
            // }
        }

        // Convert the Map back to an array of unique results
        const uniqueResults = Array.from(finalResults.values());

        return res.status(StatusCodes.OK).json({ status: true, data: uniqueResults });
    } catch (error) {
        return next(error);
    }
};

const getAllInvoicesListingInPayments = async (req, res, next) => {
    try {
        const status = req.query.status ?? 1;
        const { po_id, ro_id, billing_from, billing_to } = req.query;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Build search condition
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `WHERE (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }
        let whereConditions = "";

        if (po_id) {
            whereConditions += ` AND invoices.po_number = '${po_id}'`;
        }

        if (ro_id) {
            whereConditions += ` AND invoices.billing_ro = '${ro_id}'`;
        }

        if (billing_from) {
            whereConditions += ` AND invoices.billing_from = '${billing_from}'`;
        }

        if (billing_to) {
            whereConditions += ` AND invoices.billing_to = '${billing_to}'`;
        }

        // Fetch invoices data
        let selectQuery = `
        SELECT invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id AS po_id  FROM invoices LEFT JOIN regional_offices ON regional_offices.id = invoices.billing_ro  
        LEFT JOIN purchase_orders ON purchase_orders.id = invoices.po_number WHERE (invoices.status = 1 OR invoices.merged_invoice_status = 1) AND payment_status = '1' ${whereConditions} ORDER BY invoices.id DESC  LIMIT ${pageFirstResult}, ${pageSize}
    `;

        selectQuery = addCreatedByCondition(selectQuery, { table: "invoices", created_by: req.user.user_id });
        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        const invoices = [];

        for (const row of queryResult) {
            const complaintIds = await getComplaints(row.pi_id);
            const complaintDetails = [];

            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());
                complaintDetails.push(complaint);
            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            row.complaintDetails = complaintDetails;
            row.getOutletDetail = getOutletDetail;

            const billingFrom = await getCompanyDetailsById(row.billing_from);
            const billingFromData = {
                company_id: billingFrom.company_id,
                company_name: billingFrom.company_name,
                company_address: billingFrom.company_address,
                gst_number: billingFrom.gst_number,
            };

            const state = await getStateById(row.billing_from_state);

            const billingToData = await getBillingToData(row.billing_to);

            const regionalOffice = await getRegionalOfficeById(row.billing_ro);
            const regionalOfficeData = {
                ro_id: regionalOffice.id,
                ro_name: regionalOffice.regional_office_name,
            };

            const createdByDetails = await getCreatedByDetails(row.created_by);

            const field = {
                id: row.id,
                bill_no: row.invoice_no,
                billing_from: billingFromData,
                billing_from_state: state.name,
                billing_from_state_id: row.billing_from_state,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: row.financial_year,
                po_id: row.po_id,
                po_number: row.po_number,
                po_date: moment(row.po_date).format("DD-MM-YYYY"),
                work: row.work,
                created_by: row.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(row.created_at).format("DD-MM-YYYY"),
                regional_office_name: row.regional_office_name,
                complaintDetails: row.complaintDetails,
                outletDetails: row.getOutletDetail,
                pi_bill: complaintIds.finalBill,
                invoice_date: row.invoice_date
                    ? moment(row.invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD")
                    : moment(row.created_at, "YYYY-MM-DD").format("YYYY-MM-DD"),
            };

            invoices.push(field);
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            data: invoices,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
        console.error("Error in getAllInvoices:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const getMergedInvoiceDetailByIds = async (req, res, next) => {
    try {
        const ids = req.params.id.split(",").map(Number); // Split and convert to an array of numbers
        const results = []; // Array to store results for each ID

        for (const id of ids) {
            const selectQuery = await db.query(
                `SELECT invoices.*, invoices.invoice_no AS invoice_number, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id FROM invoices LEFT JOIN regional_offices ON regional_offices.id = invoices.billing_ro LEFT JOIN purchase_orders ON purchase_orders.id = invoices.po_number WHERE invoices.id = ${id}`
            );

            if (selectQuery.length == 0) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ status: false, message: `Invoice with id ${id} not found` });
            }

            const getDetail = selectQuery[0];
            const complaintIds = await getComplaints(getDetail.pi_id);
            const complaintDetails = [];

            for (const complaintId of complaintIds.finalComplaints) {
                const complaint = await getComplaintUniqueId(complaintId.trim());
                complaintDetails.push(complaint);
            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            getDetail.complaintDetails = complaintDetails;
            getDetail.getOutletDetail = getOutletDetail;

            const billingFrom = await getCompanyDetailsById(getDetail.billing_from);
            const billingFromData = {
                company_id: billingFrom.company_id,
                company_name: billingFrom.company_name,
                company_address: billingFrom.company_address,
                gst_number: billingFrom.gst_number,
            };

            const billingToData = await getBillingToData(getDetail.billing_to);

            const regionalOffice = await getRegionalOfficeById(getDetail.billing_ro);
            const regionalOfficeData = {
                ro_id: regionalOffice.id,
                ro_name: regionalOffice.regional_office_name,
            };

            const createdByDetails = await getCreatedByDetails(getDetail.created_by);

            const field = {
                id: getDetail.id,
                invoice_number: getDetail.invoice_no,
                billing_from: billingFromData,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: getDetail.financial_year,
                pi_number: getDetail.bill_no,
                po_id: getDetail.po_id,
                po_number: getDetail.po_number,
                po_date: moment(getDetail.po_date).format("DD-MM-YYYY"),
                work: getDetail.work,
                invoice_date: getDetail.invoice_date
                    ? moment(getDetail.invoice_date, "YYYY-MM-DD").format("YYYY-MM-DD")
                    : moment(getDetail.created_at, "YYYY-MM-DD").format("YYYY-MM-DD"),
                created_by: getDetail.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(getDetail.created_at).format("YYYY-MM-DD"),
                regional_office_name: getDetail.regional_office_name,
                complaintDetails: getDetail.complaintDetails,
                outletDetails: getDetail.getOutletDetail,
                pi_bill: complaintIds.finalBill,
                net_amount: 0, // Initialize netAmount to 0
                gst_amount: 0,
                gross_amount: 0,
            };

            let invoiceId;
            if (getDetail.merged_invoice_status != "" && getDetail.merged_invoice_status != null) {
                invoiceId = getDetail.merged_invoice_id.split(",").map(Number);
            } else {
                invoiceId = [id];
            }

            const getMeasurements = [];

            for (const row of invoiceId) {
                const data = await db.query(`SELECT * FROM invoices WHERE id = ${row}`);
                const invoiceData = data[0];

                const invoiceMeasurements = {
                    invoice: invoiceData.id,
                    invoice_no: invoiceData.invoice_no,
                    piMeasurements: [],
                };

                const pi_detail = invoiceData.pi_id.split(",").map(Number);
                const pi_data = await db.query(`SELECT * FROM proforma_invoices WHERE id IN (${pi_detail.join(",")})`);

                for (const pi_id of pi_data) {
                    let measurements = [];

                    if (pi_id.mpi_status == null) {
                        measurements = JSON.parse(pi_id.measurements);
                    } else {
                        const mergedPi = pi_id.merged_pi_id.split(",");
                        for (const id of mergedPi) {
                            const selectQuery = await db.query(
                                "SELECT measurements FROM proforma_invoices WHERE id = ?",
                                [id.trim()]
                            );
                            if (selectQuery.length > 0) {
                                measurements.push(...JSON.parse(selectQuery[0].measurements));
                            }
                        }
                    }

                    const parsedMeasurements = measurements.flatMap((measurement) => {
                        if (typeof measurement === "string") {
                            return JSON.parse(measurement);
                        }
                        return measurement;
                    });

                    const piMeasurements = {
                        pi_id: pi_id.id,
                        bill_no: pi_id.bill_no,
                        net_amount: 0, // Initialize net_amount to 0
                        gst_amount: 0,
                        measurements: [],
                    };

                    if (Array.isArray(parsedMeasurements) && parsedMeasurements.length > 0) {
                        for (const item of parsedMeasurements) {
                            const getItemDetails = await db.query(
                                `SELECT DISTINCT order_line_number, po_id FROM measurement_items WHERE measurement_id = ?`,
                                [item.measurement_list]
                            );

                            // Ensure item.netAmount is initialized to 0
                            item.netAmount = 0;
                            item.gstAmount = 0;
                            // Fetch the calculated amount
                            const getAmount = await calculateAmount(item.measurement_list, getItemDetails);

                            // Ensure getAmount[0].Amount is a number before adding it
                            const amountToAdd = parseFloat(getAmount[0].Amount);
                            item.netAmount += amountToAdd;
                            piMeasurements.net_amount += item.netAmount;

                            const calculateGst = await calculateGstAmount(item.measurement_list);

                            const gstAmountAdd = parseFloat(calculateGst);
                            item.gstAmount += gstAmountAdd;

                            piMeasurements.gst_amount += item.gstAmount;
                            // Add item.netAmount to piMeasurements.net_amount

                            const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                            const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);

                            item.complaintDetails = {
                                complaint_id: complaint.id,
                                complaint_unique_id: complaint.complaint_unique_id,
                                id: getComplaintId.complaint_id,
                            };

                            const itemDetailsArray = getItemDetails.map((detail) => ({
                                order_line_number: detail.order_line_number,
                                is_status: false, // Adjust as needed based on your logic
                            }));

                            const po_id = getItemDetails[0].po_id;
                            item.items_data = await processItemDetails(itemDetailsArray, item.measurement_list, po_id);
                            piMeasurements.measurements.push(item);
                        }
                    }

                    invoiceMeasurements.piMeasurements.push(piMeasurements);

                    // Accumulate the net_amount for this piMeasurement
                    field.net_amount = (parseFloat(field.net_amount) + parseFloat(piMeasurements.net_amount)).toFixed(
                        4
                    );
                    field.gst_amount = (parseFloat(field.gst_amount) + parseFloat(piMeasurements.gst_amount)).toFixed(
                        4
                    );

                    field.gross_amount =
                        parseFloat(field.gross_amount) + piMeasurements.net_amount + piMeasurements.gst_amount;
                    field.gross_amount = field.gross_amount.toFixed(4);
                }

                getMeasurements.push(invoiceMeasurements);
            }

            field.measurements = getMeasurements; // Include measurements in the field object

            // Push the result for this ID into the results array
            results.push(field);
        }

        return res.status(200).json({
            status: true,
            data: results, // Return the array of results
        });
    } catch (error) {
        return next(error);
        return res.status(404).json({ message: error.message });
    }
};

const getAllComplaintViaInvoice = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 8;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const ro = req.query.ro;
        const manager_id = req.query.manager_id;
        // const complaint_id = req.query.complaint_id;
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        // Fetch invoices data
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 AND created_by = ${req.user.user_id} ORDER BY id DESC`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoices not found" });
        }

        const resultData = [];
        let id = 1;
        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const pi_ids = row.pi_id;
                const complaintIds = await getComplaintsAndOutlets(pi_ids);
                const po_detail = await getPoDetailById(row.po_number);
                // const [ro_detail] = await getRegionalNameById(row.billing_ro);
                const [ro_detail] = await getRegionalNameById(`${row.billing_ro}`);

                for (const complaintId of complaintIds.finalComplaints) {
                    const complaint = await getComplaintUniqueIdInPayment(complaintId.trim());
                    // Check if complaint is valid and not empty
                    if (!complaint || complaint === "" || Object.keys(complaint).length === 0) {
                        continue; // Skip this complaint
                    }
                    let outletDetails;
                    let saleAreaDetail;
                    if (complaint.complaint_for == 1) {
                        outletDetails = await getOutletById(complaint.outlet_id);
                        const [saleAreaDetails] = await getSalesAreaById(complaint.sale_area_id);
                        saleAreaDetail = saleAreaDetails;
                    } else {
                        outletDetails = "";
                    }
                    const outletDetail = outletDetails[0] ? outletDetails[0] : "";

                    const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
                    const [measurement_detail] = await getMeasurementDetails(complaint.id);
                    const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);

                    const getDeductionAmounts = await getDeductionAmount(
                        row.billing_ro,
                        measurement_detail.amount,
                        getAreaManager.area_manager_id,
                        stockAndFund
                    );

                    resultData.push({
                        id: id++,
                        payment_voucher_number: data.pv_number,
                        payment_voucher_date: moment(data.receipt_date).format("YYYY-MM-DD"),
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        complaint_id: complaint.id,
                        complaint_unique_id: complaint.complaint_unique_id,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row.billing_ro,
                        ro_name: ro_detail?.regional_office_name ? ro_detail.regional_office_name : "",
                        pv_number: data.pv_number,
                        pv_date: data.pv_date,
                        sales_area_id: saleAreaDetail?.id ? saleAreaDetail.id : "",
                        sales_area_name: saleAreaDetail?.sales_area_name ? saleAreaDetail.sales_area_name : "",
                        outlet_id: outletDetail?.id ? outletDetail.id : "",
                        outlet_name: outletDetail?.outlet_name ? outletDetail.outlet_name : "",
                        outlet_unique_id: outletDetail?.outlet_unique_id ? outletDetail.outlet_unique_id : "",
                        measurement_id: measurement_detail?.id ? measurement_detail.id : "",
                        measurement_amount: measurement_detail?.amount ? measurement_detail.amount : "",
                        measurement_date: measurement_detail?.measurement_date
                            ? moment(measurement_detail?.measurement_date).format("YYYY-MM-DD")
                            : "",
                        area_manager_detail: getAreaManager,
                        deduction: getDeductionAmounts,
                        pay_amount: measurement_detail.amount - getDeductionAmounts.deduction,
                        manager_amount: getDeductionAmounts.manager_ratio,
                        stockAndFund: stockAndFund,
                    });
                }
            }
        }

        // Apply filters if provided
        let filteredResultData = resultData;

        if (ro) {
            filteredResultData = filteredResultData.filter((item) => item.ro_id === parseInt(ro));
        }

        if (manager_id) {
            filteredResultData = filteredResultData.filter(
                (item) => item.area_manager_detail.area_manager_id == manager_id
            );
        }

        const totalResults = filteredResultData.length;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        const paginatedResultData = filteredResultData.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalResults / pageSize);
        const pageDetails = {
            pageSize: pageSize,
            currentPage: currentPage,
            totalPages: totalPages,
            total: totalResults,
            pageStartResult: startIndex + 1,
            pageEndResult: endIndex,
        };

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched", data: paginatedResultData, pageDetails: pageDetails });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const getAllComplaintViaInvoiceById = async (req, res, next) => {
    try {
        const searchData = req.query.search || "";
        const ro = req.query.ro;
        const manager_id = req.query.manager_id;
        const complaintIdsArray = req.query.complaint_id
            ? req.query.complaint_id.split(",").map((id) => parseInt(id.trim()))
            : [];

        // const complaintIdsArray = Array.isArray(req.body.complaint_id) ? req.body.complaint_id.map(id => parseInt(id)) : [];

        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        // Fetch invoices data
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 ORDER BY id DESC`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoices not found" });
        }

        const resultData = [];

        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const pi_ids = row.pi_id;
                const complaintsAndOutlets = await getComplaintsAndOutlets(pi_ids);
                const complaintIds = complaintsAndOutlets.finalComplaints;
                const po_detail = await getPoDetailById(row.po_number);
                const [ro_detail] = await getRegionalNameById(row.billing_ro);

                for (const complaintId of complaintIds) {
                    const complaint = await getComplaintUniqueId(complaintId.trim());

                    let outletDetails;
                    if (complaint.complaint_for == 1) {
                        outletDetails = await getOutletById(complaint.outlet_id);
                    } else {
                        outletDetails = "";
                    }
                    const outletDetail = outletDetails[0] ? outletDetails[0] : "";

                    const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                    const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
                    const [measurement_detail] = await getMeasurementDetails(complaint.id);
                    const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);

                    const getDeductionAmounts = await getDeductionAmount(
                        row.billing_ro,
                        measurement_detail.amount,
                        getAreaManager.area_manager_id,
                        stockAndFund
                    );

                    resultData.push({
                        payment_voucher_number: data.pv_number,
                        payment_voucher_date: moment(data.receipt_date).format("YYYY-MM-DD"),
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        complaint_id: complaint.id,
                        complaint_unique_id: complaint.complaint_unique_id,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row.billing_ro,
                        ro_name: ro_detail.regional_office_name ? ro_detail.regional_office_name : "",
                        pv_number: data.pv_number,
                        pv_date: data.pv_date,
                        sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : "",
                        sales_area_name: saleAreaDetail.sales_area_name ? saleAreaDetail.sales_area_name : "",
                        outlet_id: outletDetail.id ? outletDetail.id : "",
                        outlet_name: outletDetail.outlet_name ? outletDetail.outlet_name : "",
                        outlet_unique_id: outletDetail.outlet_unique_id ? outletDetail.outlet_unique_id : "",
                        measurement_id: measurement_detail.id ? measurement_detail.id : "",
                        measurement_amount: measurement_detail.amount ? measurement_detail.amount : "",
                        measurement_date: measurement_detail.measurement_date
                            ? moment(measurement_detail.measurement_date).format("YYYY-MM-DD")
                            : "",
                        area_manager_detail: getAreaManager,
                        stockAndFund: stockAndFund,
                        deduction: parseFloat(getDeductionAmounts).toFixed(2),
                        pay_amount: parseFloat(measurement_detail.amount - getDeductionAmounts).toFixed(2),
                    });
                }
            }
        }

        // Apply filters if provided
        let filteredResultData = resultData;

        if (ro) {
            filteredResultData = filteredResultData.filter((item) => item.ro_id === parseInt(ro));
        }

        if (manager_id) {
            filteredResultData = filteredResultData.filter(
                (item) => item.area_manager_detail.area_manager_id == manager_id
            );
        }

        if (complaintIdsArray.length > 0) {
            filteredResultData = filteredResultData.filter((item) => complaintIdsArray.includes(item.complaint_id));
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched", data: filteredResultData });
    } catch (error) {
        return next(error);
    }
};

const getAllComplaintViaInvoiceForRo = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 8;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const ro = req.query.ro;
        const po_number = req.query.po_number;
        // const complaint_id = req.query.complaint_id;
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }
        // Fetch invoices data
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 AND created_by = ${req.user.user_id} ORDER BY id DESC`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoices not found" });
        }

        const resultData = [];

        // for (const data of queryResult) {
        //     const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

        //     for (const row of invoiceQuery) {
        //         const pi_ids = row.pi_id;
        //         const complaintIds = await getComplaintsAndOutlets(pi_ids);
        //         const po_detail = await getPoDetailById(row.po_number);
        //         const [ro_detail] = await getRegionalNameById(row.billing_ro);

        //         for (const complaintId of complaintIds.finalComplaints) {
        //             const complaint = await getComplaintUniqueIdInPaymentForRo(complaintId.trim());
        //             // Check if complaint is valid and not empty
        //             if (!complaint || complaint === '' || Object.keys(complaint).length === 0) {
        //                 continue; // Skip this complaint
        //             }
        //             let outletDetails;
        //             if (complaint.complaint_for == 1) {
        //                 outletDetails = await getOutletById(complaint.outlet_id);
        //             } else {
        //                 outletDetails = '';
        //             }
        //             const outletDetail = outletDetails[0] ? outletDetails[0] : '';

        //             const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
        //             const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
        //             const [measurement_detail] = await getMeasurementDetails(complaint.id);
        //             const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id)

        //             const getDeductionAmounts = await getPromotionDeduction(row.billing_ro, measurement_detail.amount, stockAndFund);

        //             resultData.push({
        //                 payment_voucher_number: data.pv_number,
        //                 payment_voucher_date: moment(data.receipt_date).format('YYYY-MM-DD'),
        //                 invoice_no: row.invoice_no,
        //                 invoice_date: row.invoice_date ? moment(row.invoice_date).format('YYYY-MM-DD') : moment(row.created_at).format('YYYY-MM-DD'),
        //                 invoice_amount: data.net_amount,
        //                 complaint_id: complaint.id,
        //                 complaint_unique_id: complaint.complaint_unique_id,
        //                 po_id: row.po_number,
        //                 po_number: po_detail.po_number,
        //                 po_date: moment(row.po_date).format('YYYY-MM-DD'),
        //                 ro_id: row.billing_ro,
        //                 ro_name: ro_detail.regional_office_name ? ro_detail.regional_office_name : '',
        //                 pv_number: data.pv_number,
        //                 pv_date: data.pv_date,
        //                 sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : '',
        //                 sales_area_name: saleAreaDetail.sales_area_name ? saleAreaDetail.sales_area_name : '',
        //                 outlet_id: outletDetail.id ? outletDetail.id : '',
        //                 outlet_name: outletDetail.outlet_name ? outletDetail.outlet_name : '',
        //                 outlet_unique_id: outletDetail.outlet_unique_id ? outletDetail.outlet_unique_id : '',
        //                 measurement_id: measurement_detail.id ? measurement_detail.id : '',
        //                 measurement_amount: measurement_detail.amount ? measurement_detail.amount : '',
        //                 measurement_date: measurement_detail.measurement_date ? moment(measurement_detail.measurement_date).format('YYYY-MM-DD') : '',
        //                 area_manager_detail: getAreaManager,
        //                 deduction: getDeductionAmounts,
        //                 pay_amount: getDeductionAmounts.deduction,
        //                 stockAndFund: stockAndFund,
        //             });
        //         }
        //     }
        // }

        // Apply filters if provided
        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const pi_ids = row.pi_id;
                const complaintIds = await getComplaintsAndOutlets(pi_ids);
                const po_detail = await getPoDetailById(row.po_number);
                const [ro_detail] = await getRegionalNameById(row.billing_ro);

                for (const complaintId of complaintIds.finalComplaints) {
                    const complaint = await getComplaintUniqueIdInPaymentForRo(complaintId.trim());
                    // Check if complaint is valid and not empty
                    if (!complaint || complaint === "" || Object.keys(complaint).length === 0) {
                        continue; // Skip this complaint
                    }
                    let outletDetails;
                    let saleAreaDetail;
                    if (complaint.complaint_for == 1) {
                        outletDetails = await getOutletById(complaint.outlet_id);
                        const [saleAreaDetails] = await getSalesAreaById(complaint.sale_area_id);
                        saleAreaDetail = saleAreaDetails;
                    } else {
                        outletDetails = "";
                    }
                    const outletDetail = outletDetails[0] ? outletDetails[0] : "";

                    const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);

                    const [measurement_detail] = await getMeasurementDetails(complaint.id);

                    const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);
                    const getDeductionAmounts = await getPromotionDeduction(
                        row.billing_ro,
                        measurement_detail.amount,
                        stockAndFund
                    );

                    resultData.push({
                        payment_voucher_number: data.pv_number,
                        payment_voucher_date: moment(data.receipt_date).format("YYYY-MM-DD"),
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        complaint_id: complaint.id,
                        complaint_unique_id: complaint.complaint_unique_id,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row?.billing_ro,
                        ro_name: ro_detail?.regional_office_name ? ro_detail.regional_office_name : "",
                        pv_number: data.pv_number,
                        pv_date: data.pv_date,
                        sales_area_id: saleAreaDetail?.id || "",
                        sales_area_name: saleAreaDetail?.sales_area_name || "",
                        outlet_id: outletDetail?.id || "",
                        outlet_name: outletDetail?.outlet_name || "",
                        outlet_unique_id: outletDetail?.outlet_unique_id || "",
                        measurement_id: measurement_detail?.id || "",
                        measurement_amount: measurement_detail.amount ? measurement_detail.amount : "",
                        measurement_date: measurement_detail.measurement_date
                            ? moment(measurement_detail.measurement_date).format("YYYY-MM-DD")
                            : "",
                        area_manager_detail: getAreaManager,
                        deduction: getDeductionAmounts,
                        pay_amount: getDeductionAmounts.deduction,
                        stockAndFund: stockAndFund,
                    });
                }
            }
        }

        // Apply filters if provided
        let filteredResultData = resultData;

        if (ro) {
            filteredResultData = filteredResultData.filter((item) => item.ro_id === parseInt(ro));
        }

        if (po_number) {
            filteredResultData = filteredResultData.filter((item) => item.po_number == po_number);
        }

        const totalResults = filteredResultData.length;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        const paginatedResultData = filteredResultData.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalResults / pageSize);
        const pageDetails = {
            pageSize: pageSize,
            currentPage: currentPage,
            totalPages: totalPages,
            total: totalResults,
            pageStartResult: startIndex + 1,
            pageEndResult: endIndex,
        };

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched", data: paginatedResultData, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

const getRegionalOfficeInPaidPayment = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 AND created_by = ${req.user.user_id} ORDER BY id DESC`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Regional office not found" });
        }

        const resultData = [];
        const uniqueRoSet = new Set();

        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const [ro_detail] = await getRegionalNameById(`${row.billing_ro}`); // getRegionalNameById(row.billing_ro);

                if (!uniqueRoSet.has(row.billing_ro)) {
                    uniqueRoSet.add(row.billing_ro);
                    resultData.push({
                        ro_id: row?.billing_ro,
                        ro_name: ro_detail?.regional_office_name ? ro_detail?.regional_office_name : "",
                    });
                }
            }
        }

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched successfully", data: resultData });
    } catch (error) {
        return next(error);
    }
};

const getPoNumberInPaidPayment = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 ORDER BY id DESC`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Po number not found" });
        }

        const resultData = [];
        const uniqueRoSet = new Set();

        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const po_detail = await getPoDetailById(row.po_number);
                if (!uniqueRoSet.has(row.po_number)) {
                    uniqueRoSet.add(row.po_number);
                    resultData.push({
                        ro_id: row.po_number,
                        ro_name: po_detail.po_number ? po_detail.po_number : "",
                    });
                }
            }
        }

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched successfully", data: resultData });
    } catch (error) {
        return next(error);
    }
};

// const getAreaManagerInPaidPayment = async (req,res,next) => {
//     try {
//         const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 ORDER BY id DESC`;

//         const queryResult = await db.query(selectQuery);

//         if (queryResult.length === 0) {
//             return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: 'Invoices not found' });
//         }

//         const resultData = [];

//         for (const data of queryResult) {
//             const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

//             for (const row of invoiceQuery) {
//                 const pi_ids = row.pi_id;
//                 const complaintIds = await getComplaintsAndOutlets(pi_ids);

//                 for (const complaintId of complaintIds.finalComplaints) {
//                     const complaint = await getComplaintUniqueId(complaintId.trim());

//                     const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
//                     resultData.push({
//                         area_manager_id: getAreaManager.area_manager_id,
//                         area_manager_name: getAreaManager.user_name,
//                     })

//                 }

//             }
//         }

//         return res.status(StatusCodes.OK).json({ status: true, message: "data fetched successfully", data: resultData })
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const getAreaManagerInPaidPayment = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 ORDER BY id DESC`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Invoices not found" });
        }

        const resultData = [];
        const uniqueAreaManagers = new Set();

        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const pi_ids = row.pi_id;
                const complaintIds = await getComplaintsAndOutlets(pi_ids);

                for (const complaintId of complaintIds.finalComplaints) {
                    const complaint = await getComplaintUniqueId(complaintId.trim());
                    // Check if complaint is valid and not empty
                    if (!complaint || complaint === "" || Object.keys(complaint).length === 0) {
                        continue; // Skip this complaint
                    }
                    const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);

                    if (!uniqueAreaManagers.has(getAreaManager.area_manager_id)) {
                        uniqueAreaManagers.add(getAreaManager.area_manager_id);
                        resultData.push({
                            area_manager_id: getAreaManager.area_manager_id,
                            area_manager_name: getAreaManager.user_name,
                        });
                    }
                }
            }
        }

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched successfully", data: resultData });
    } catch (error) {
        return next(error);
    }
};

async function getMeasurementDetails(id) {
    const selectQuery = `SELECT * FROM measurements where complaint_id = ${id} AND status = '5' `;
    return await db.query(selectQuery);
}

async function getComplaintsAndOutlets(pi_id) {
    const pi = pi_id.split(",").map(Number);
    const selectQuery = await db.query(`SELECT * FROM proforma_invoices WHERE id IN (${pi.map((id) => id)})`);
    const finalBill = [];
    const complaints = [];
    for (const row of selectQuery) {
        const complaintIds = row.complaint_id;
        complaints.push(complaintIds);
        finalBill.push(row.bill_no);
    }

    const joinComplaints = complaints.join(",");
    const finalComplaints = joinComplaints.split(",");

    return { finalComplaints, finalBill };
}

async function getSalesAreaById(salesAreaId) {
    try {
        // Debug log to ensure salesAreaId is what you expect

        // Parse salesAreaId if it's a string representation of an array
        if (typeof salesAreaId === "string") {
            salesAreaId = JSON.parse(salesAreaId);
        }

        // Ensure salesAreaId is treated as an array
        if (!Array.isArray(salesAreaId)) {
            throw new Error("salesAreaId is not an array");
        }

        // Construct a safe query using placeholders for ids to avoid SQL injection
        const placeholders = salesAreaId.map(() => "?").join(",");

        const salesAreaResult = await db.query(
            `SELECT id, sales_area_name FROM sales_area WHERE id IN (${placeholders})`,
            salesAreaId
        );

        if (salesAreaResult.length > 0) {
            // Return all sales area names as an array
            return salesAreaResult;
        } else {
            return []; // Return an empty array if no sales areas are found
        }
    } catch (error) {
        return []; // Return an empty array or handle the error appropriately
    }
}

const getAllRoViaInvoice = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 8;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const ro = req.query.ro;
        const manager_id = req.query.manager_id;
        // const complaint_id = req.query.complaint_id;
        let searchCondition = "";
        if (searchData !== "") {
            searchCondition = `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        // Fetch invoices data
        const selectQuery = `SELECT * FROM payment_receive WHERE status = 2 ORDER BY id DESC`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Invoices not found" });
        }

        const resultData = [];

        for (const data of queryResult) {
            const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

            for (const row of invoiceQuery) {
                const pi_ids = row.pi_id;
                const complaintIds = await getComplaintsAndOutlets(pi_ids);
                const po_detail = await getPoDetailById(row.po_number);
                const [ro_detail] = await getRegionalNameById(row.billing_ro);

                for (const complaintId of complaintIds.finalComplaints) {
                    const complaint = await getComplaintUniqueId(complaintId.trim());

                    let outletDetails;
                    if (complaint.complaint_for == 1) {
                        outletDetails = await getOutletById(complaint.outlet_id);
                    } else {
                        outletDetails = "";
                    }
                    const outletDetail = outletDetails[0] ? outletDetails[0] : "";

                    const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                    const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);

                    const [measurement_detail] = await getMeasurementDetails(complaint.id);
                    // const getDeductionAmounts =  await getDeductionAmount(row.billing_ro, amount, getAreaManager[0].id)
                    resultData.push({
                        payment_voucher_number: data.pv_number,
                        payment_voucher_date: moment(data.receipt_date).format("YYYY-MM-DD"),
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        complaint_id: complaint.id,
                        complaint_unique_id: complaint.complaint_unique_id,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row.billing_ro,
                        ro_name: ro_detail.regional_office_name ? ro_detail.regional_office_name : "",
                        pv_number: data.pv_number,
                        pv_date: data.pv_date,
                        sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : "",
                        sales_area_name: saleAreaDetail.sales_area_name ? saleAreaDetail.sales_area_name : "",
                        outlet_id: outletDetail.id ? outletDetail.id : "",
                        outlet_name: outletDetail.outlet_name ? outletDetail.outlet_name : "",
                        outlet_unique_id: outletDetail.outlet_unique_id ? outletDetail.outlet_unique_id : "",
                        measurement_id: measurement_detail.id ? measurement_detail.id : "",
                        measurement_amount: measurement_detail.amount ? measurement_detail.amount : "",
                        measurement_date: measurement_detail.measurement_date
                            ? moment(measurement_detail.measurement_date).format("YYYY-MM-DD")
                            : "",
                        area_manager_detail: getAreaManager,
                    });
                }
            }
        }

        // Apply filters if provided
        let filteredResultData = resultData;

        if (ro) {
            filteredResultData = filteredResultData.filter((item) => item.ro_id === parseInt(ro));
        }

        if (manager_id) {
            filteredResultData = filteredResultData.filter(
                (item) => item.area_manager_detail.area_manager_id == manager_id
            );
        }

        // if(complaint_id){
        //     filteredResultData = filteredResultData.filter(item => item.complaint_id === complaint_id);
        // }

        const totalResults = filteredResultData.length;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        const paginatedResultData = filteredResultData.slice(startIndex, endIndex);

        const totalPages = Math.ceil(totalResults / pageSize);
        const pageDetails = {
            pageSize: pageSize,
            currentPage: currentPage,
            totalPages: totalPages,
            total: totalResults,
            pageStartResult: startIndex + 1,
            pageEndResult: endIndex,
        };

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched", data: paginatedResultData, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

// async function getDeductionAmount(id, amount, manager_id, stock) {

//     let deduction;
//     amount = parseFloat(amount);

//     // Fetch payment settings
//     const selectQuery = `SELECT gst, tds, tds_with_gst, retention_money FROM payment_setting WHERE ro_id = ?`;
//     const queryResult = await db.query(selectQuery, [id]);

//     if (!queryResult || queryResult.length === 0) {
//       throw new Error('No payment settings found');
//     }

//     let { gst, tds, tds_with_gst, retention_money } = queryResult[0];

//     // Convert to float and calculate percentages
//     gst = await calculatedPercentage(parseFloat(gst) || 0, amount);
//     tds = await calculatedPercentage(parseFloat(tds) || 0, amount);
//     tds_with_gst = await calculatedPercentage(parseFloat(tds_with_gst) || 0, amount);
//     retention_money = await calculatedPercentage(parseFloat(retention_money) || 0, amount);

//     // Fetch manager details
//     const managerQuery = `SELECT manager_ratio FROM manager_promotional WHERE manager_id = ?`;
//     const managerDetails = await db.query(managerQuery, [manager_id]);

//     if (!managerDetails || managerDetails.length === 0) {
//       throw new Error('No manager details found');
//     }

//     let { manager_ratio } = managerDetails[0];
//     manager_ratio = await calculatedPercentage(parseFloat(manager_ratio) || 0, amount);

//     // Calculate total deduction
//     deduction = gst + tds + tds_with_gst + retention_money + manager_ratio + stock.Total_Expense + stock.Total_Stock;

//     return deduction || 0;
//   }

async function getDeductionAmount(id, amount, manager_id, stock) {
    let deduction = 0;
    amount = parseFloat(amount);

    // Initialize variables
    let gst = 0,
        tds = 0,
        tds_with_gst = 0,
        retention_money = 0,
        manager_ratio = 0;
    promotion_expense = 0;

    // Fetch payment settings
    const selectQuery = `SELECT gst, tds, tds_with_gst, retention_money, promotion_expense FROM payment_setting WHERE ro_id = ?`;
    const queryResult = await db.query(selectQuery, [id]);

    if (queryResult && queryResult.length > 0) {
        ({ gst, tds, tds_with_gst, retention_money, promotion_expense } = queryResult[0]);
    }

    // Convert to float and calculate percentages
    gst = await calculatedPercentage(parseFloat(gst) || 0, amount);
    tds = await calculatedPercentage(parseFloat(tds) || 0, amount);
    tds_with_gst = await calculatedPercentage(parseFloat(tds_with_gst) || 0, amount);
    retention_money = await calculatedPercentage(parseFloat(retention_money) || 0, amount);
    promotion_expense = await calculatedPercentage(parseFloat(promotion_expense) || 0, amount);

    // Fetch manager details
    const managerQuery = `SELECT manager_ratio FROM manager_promotional WHERE manager_id = ?`;
    const managerDetails = await db.query(managerQuery, [manager_id]);

    if (managerDetails && managerDetails.length > 0) {
        ({ manager_ratio } = managerDetails[0]);
    }

    deduction =
        gst +
        tds +
        tds_with_gst +
        retention_money +
        promotion_expense +
        (stock.Total_Expense || 0) +
        (stock.Total_Stock || 0);

    const finalAmount = parseFloat(amount) - parseFloat(deduction);

    company_ratio = await calculatedPercentage(parseFloat(manager_ratio) || 0, finalAmount);

    // Calculate total deduction
    return { deduction: deduction, manager_ratio: company_ratio };
}

async function getPromotionDeduction(id, amount, stock) {
    let deduction = 0;
    amount = parseFloat(amount);

    // Initialize variables
    let ro_ratio = 0;
    // Fetch payment settings
    const selectQuery = `SELECT gst, tds, tds_with_gst, retention_money, promotion_expense FROM payment_setting WHERE ro_id = ?`;
    const queryResult = await db.query(selectQuery, [id]);

    if (queryResult && queryResult.length > 0) {
        ({ gst, tds, tds_with_gst, retention_money, promotion_expense } = queryResult[0]);
    }

    // Convert to float and calculate percentages
    // gst = await calculatedPercentage(parseFloat(gst) || 0, amount);
    // tds = await calculatedPercentage(parseFloat(tds) || 0, amount);
    // tds_with_gst = await calculatedPercentage(parseFloat(tds_with_gst) || 0, amount);
    // retention_money = await calculatedPercentage(parseFloat(retention_money) || 0, amount);
    promotion_expense = await calculatedPercentage(parseFloat(promotion_expense) || 0, amount);

    // Fetch manager details
    // const managerQuery = `SELECT company_ratio FROM manager_promotional WHERE manager_id = ?`;
    // const managerDetails = await db.query(managerQuery, [manager_id]);

    // if (managerDetails && managerDetails.length > 0) {
    //     ({ company_ratio } = managerDetails[0]);
    // }

    // company_ratio = await calculatedPercentage(parseFloat(manager_ratio) || 0, amount);

    // Calculate total deduction
    // deduction = gst + tds + tds_with_gst + retention_money + promotion_expense +  company_ratio + (stock.Total_Expense || 0) + (stock.Total_Stock || 0);

    deduction = promotion_expense;

    return { deduction: deduction || 0, promotion_expense: promotion_expense };
}

module.exports = {
    createInvoiceData,
    updateInvoiceData,
    getAllInvoices,
    getInvoiceDetailById,
    deleteInvoiceData,
    mergeInvoice,
    getAllMergedInvoices,
    getMergedInvoiceDetailById,
    discardInvoice,
    discardMergedInvoice,
    getAllPOForInvoices,
    getAllROForInvoices,
    getAllBillingFromCompany,
    fromBillingToCompanyInInvoice,
    getAllInvoicesListingInPayments,
    getMergedInvoiceDetailByIds,
    getAllComplaintViaInvoice,
    getComplaintsAndOutlets,
    getSalesAreaById,
    getRegionalOfficeInPaidPayment,
    getAreaManagerInPaidPayment,
    getAllComplaintViaInvoiceById,
    getDeductionAmount,
    getAllComplaintViaInvoiceForRo,
    getPromotionDeduction,
    getPoNumberInPaidPayment,
    getAllSalesAreaForInvoices,
    getComplaints,
    getAllComplaintTypesForInvoices,
};

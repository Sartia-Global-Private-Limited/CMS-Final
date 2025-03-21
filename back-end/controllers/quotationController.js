require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
var moment = require("moment");
const { mailSent } = require("../helpers/sendEmail");

const { quotationSchema, checkPositiveInteger } = require("../helpers/validation");
const { getSalesAreaName, getRegionalOfficeName } = require("../helpers/quotation");
const {
    getCompanyDetailsById,
    getStateById,
    getQuotationItemsSubChildById,
    getQuotationItemsById,
} = require("../helpers/commonHelper");
const {
    calculatePagination,
    getComplaintTypeById,
    getSupplierDetails,
    getOutletById,
    getPoDetailById,
    getCreatedUserNameFromAdmin,
    getEnergyCompaniesById,
} = require("../helpers/general");

/** create a new Quotation record */
const createQuotation = async (req, res, next) => {
    try {
        const { error } = quotationSchema.validate(req.body);
        // return
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.details[0].message });
        }

        const {
            company_from,
            company_from_state,
            company_to,
            company_to_regional_office,
            quotation_date,
            regional_office_id,
            sales_area_id,
            outlet,
            po_id,
            po_number,
            complaint_type,
            remark,
            items_data,
            quotation_type,
            amount,
        } = req.body;

        if(quotation_type == "1" && !outlet || outlet == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Outlet is required" });
        } 

        // Generate the automatic quotation number based on the last two digits of the current year and next year
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const lastTwoDigitsCurrentYear = currentYear.toString().slice(-2);
        const lastTwoDigitsNextYear = nextYear.toString().slice(-2);
        const quotationYear = `${lastTwoDigitsCurrentYear}${lastTwoDigitsNextYear}`; // Example: 2324
        const lastQuotationNumber = await db.query(
            "SELECT MAX(quotations_number) as max_quotations_number FROM quotations WHERE quotations_number LIKE ?",
            [`%${quotationYear}%`]
        );

        let quotations_number = "";

        const fetchQuotationsNumber = await db.query(
            `SELECT quotations_number FROM quotations ORDER BY id DESC LIMIT 1`
        );

        if (fetchQuotationsNumber.length === 0) {
            quotations_number = `${lastTwoDigitsCurrentYear}${lastTwoDigitsNextYear}/CMS/1`;
        } else {
            const lastPart = fetchQuotationsNumber[0].quotations_number.split("/");
            lastPart[2] = parseInt(lastPart[2], 10) + 1;
            quotations_number = `${lastTwoDigitsCurrentYear}${lastTwoDigitsNextYear}/CMS/${lastPart[2]}`;
        }

        if (lastQuotationNumber.length > 0 && lastQuotationNumber[0].max_quotation_number) {
            const lastNumber = parseInt(lastQuotationNumber[0].max_quotation_number.split("/").pop(), 10);
            const nextNumber = lastNumber + 1;
            const paddedNumber = nextNumber.toString().padStart(4, "0");
            quotations_number = `${lastTwoDigitsCurrentYear}${lastTwoDigitsNextYear}/CMS/${paddedNumber}`;
        }

        // Format the quotation date using Moment.js
        const formattedQuotationDate = moment(quotation_date).format("YYYY-MM-DD");

        const quotationData = {
            company_from,
            company_from_state,
            company_to,
            company_to_regional_office,
            quotation_date: formattedQuotationDate,
            quotations_number,
            regional_office_id,
            sales_area_id,
            outlet,
            po_id,
            po_number,
            complaint_type,
            remark,
            quotation_type,
            amount: amount.toFixed(2),
            created_by: req.user.user_id,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        // Insert the company data into the database
        const result = await db.query("INSERT INTO quotations SET ?", [quotationData]);

        for (const item of items_data) {
            // check whether child Array is present and then insert into database
            if (Array.isArray(item.childArray) && item.childArray.length > 0) {
                for (const child of item.childArray) {
                    const amount = child.qty * item.rate;
                    // Insert the items data into the database
                    await db.query(
                        `INSERT INTO quotation_items  
                            (quotation_id,
                            po_id,
                            order_line_number,
                            unit,
                            description,
                            number,
                            length,
                            breadth,
                            depth,
                            quantity,
                            rate,
                            amount,
                            status,
                            created_by)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            result.insertId,
                            po_id,
                            item.order_line_number,
                            item.unit,
                            child.description,
                            child.no,
                            child.length,
                            child.breadth,
                            child.depth,
                            child.qty,
                            item.rate,
                            amount,
                            req.body.status,
                            req.user.user_id,
                        ]
                    );
                }
            }
        }

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Quotation created successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error creating a new quotation" });
        }
    } catch (error) {
        return next(error);
    }
};

/** get all Quotations */
const getQuotation = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || "";
        let search_value = "";

        /** if search value is provided */
        if (searchData != null && searchData != "") {
            search_value += `WHERE (po_number LIKE '%${searchData}%' OR complaint_type LIKE '%${searchData}%' OR quotations_number LIKE '%${searchData}%'OR sales_area_id LIKE '%${searchData}%')`;
        }

        /** if status is provided then check if search value is also provided or not  */
        status
            ? search_value
                ? (search_value += `AND status = ${status} AND is_deleted = '0'`)
                : (search_value += `WHERE status = ${status} AND is_deleted = '0'`)
            : search_value != "" ? (search_value += ` AND is_deleted = '0'`) : (search_value += `WHERE is_deleted = '0'`);

        const selectQuery = `SELECT * FROM quotations ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const results = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let dataName = [];

        if (results.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of results) {
                const sales_area_name = await getSalesAreaName(row.sales_area_id);
                const regional_office_name = await getRegionalOfficeName(row.regional_office_id);
                const outlet_details = await getOutletById(row.outlet);
                const complaintTypeDetail = await getComplaintTypeById(row.complaint_type);
                complaint_type = complaintTypeDetail.complaint_type_name;
                var outlet_name = "";

                if (outlet_details.length > process.env.VALUE_ZERO) {
                    outlet_name += outlet_details[0].outlet_name;
                }

                // company from details
                const company_from_details = await getCompanyDetailsById(row.company_from);
                var company_from_name = company_from_details.company_name;
                // company_from_state details

                const company_from_state_details = await getStateById(row.company_from_state);
                var company_from_state_name = company_from_state_details.name;
                // company to details
                const company_to_details = await getCompanyDetailsById(row.company_to);
                var company_to_name = company_to_details.company_name;

                // po numbers for
                const poDetail = await getPoDetailById(row.po_id);
                var po_name = poDetail.po_number;

                // outlet details
                const outletDetail = await getOutletById(row.outlet);
                var outlet_name = outletDetail[0].outlet_name;

                const quotationData = {
                    ...row,
                    quotation_dates: moment(row.quotation_date).format("DD-MM-YYYY"),
                    sales_area_name,
                    regional_office_name,
                    outlet_name,
                    company_from_name,
                    company_from_state_name,
                    company_to_name,
                    po_name,
                    outlet_name,
                    complaint_type,
                };

                dataName.push(quotationData);
            }
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: dataName,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

/** get Quotation by Id */
const getQuotationById = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: companyId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const queryResult = await db.query("SELECT * FROM quotations WHERE id = ? AND is_deleted = '0'", [companyId]);

        if (queryResult.length > 0) {
            const company = [];
            company.push(queryResult[0]);
            const uniqueItemsMap = new Map();
            const uniqueItemsMapNew = new Map();

            company.sales_area_name = await getSalesAreaName(company[0].sales_area_id);
            company.regional_office_name = await getRegionalOfficeName(company[0].regional_office_id);
            const outletDetail = await getOutletById(parseInt(company[0].outlet));
            company.outlet_name = outletDetail[0].outlet_name;
            company.company_to_regional_office_name = await getRegionalOfficeName(
                company[0].company_to_regional_office
            );

            const complaintTypeDetail = await getComplaintTypeById(parseInt(company[0].complaint_type));
            company.complaint_type_name = complaintTypeDetail.complaint_type_name;
            const companyFromDetail = await getSupplierDetails(company[0].company_from);
            company.company_from_name = companyFromDetail.company_name;

            /** company name detail */
            const quotation_type = queryResult[0].quotation_type;
            const company_to = queryResult[0].company_to;
            const fetchCompanyData = await getCompanyDetails(company_to, quotation_type);

            const poDetail = await getPoDetailById(queryResult[0].po_id);
            const stateDetail = await getStateById(company[0].company_from_state);
            company.state_name = stateDetail.name;
            const createdBy = await getCreatedUserNameFromAdmin(company[0].created_by);
            const updatedBy = await getCreatedUserNameFromAdmin(company[0].updated_by);
            company.created_by_name = createdBy[0].name;
            const amount = parseFloat(queryResult[0].amount);
            company.amount = amount.toFixed(2);

            for (const row of queryResult) {
                const fetchQuotationItems = await getQuotationItemsById(row.id);

                if (fetchQuotationItems && fetchQuotationItems.length > 0) {
                    for (const item of fetchQuotationItems) {
                        const key = item.order_line_number;
                        if (!uniqueItemsMap.has(key)) {
                            uniqueItemsMap.set(key, {
                                order_line_number: item.order_line_number,
                                label: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.rate,
                                unit_name: item.unit_name,
                                quotation_id: item.quotation_id,
                                value: item.order_line_number,
                                total_qty: parseFloat(item.total_qty).toFixed(2),
                            });
                        }
                        if (!uniqueItemsMapNew.has(key)) {
                            uniqueItemsMapNew.set(key, {
                                order_line_number: item.order_line_number,
                                item_name: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.rate,
                                unit: item.unit_name,
                                quotation_id: item.quotation_id,
                                total_qty: parseFloat(item.total_qty).toFixed(2),
                            });
                        }
                        item.item_name = `${item.hsn_code} - ${item.items_name}`;
                    }
                }

                const uniqueItemsArray = Array.from(uniqueItemsMap.values());
                /** save ItemsChildArray in a variable */
                const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

                if (uniqueItemsSubChildArray.length > 0) {
                    for (const childArray of uniqueItemsSubChildArray) {
                        const quotationSubDetails = await getQuotationItemsSubChildById(
                            childArray.quotation_id,
                            childArray.order_line_number
                        );
                        childArray.childArray = quotationSubDetails;
                    }
                }

                company.forEach((data) => {
                    data.company_from_name = companyFromDetail?.company_name || "";
                    data.company_to_name = fetchCompanyData?.company_name || "";
                    data.state_name = stateDetail?.name || "";
                    data.po_id = poDetail?.id || "";
                    data.po_number = poDetail?.po_number || "";
                    data.quotation_date = moment(company[0]?.quotation_date || "").format("YYYY-MM-DD");
                    data.sales_area_name = company?.sales_area_name || "";
                    data.regional_office_name = company?.regional_office_name || "";
                    data.outlet_name = company?.outlet_name || "";
                    data.created_by_name = createdBy[0]?.name || "";
                    data.updated_by_name = updatedBy[0]?.name || "";
                    data.company_to_regional_office_name = company?.company_to_regional_office_name || "";
                    data.complaint_type_name = company?.complaint_type_name || "";
                    data.items_id = uniqueItemsArray;
                    data.items_data = uniqueItemsSubChildArray;
                });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: company });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Company not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function getCompanyDetails(billingToId, isEnergyCompany) {
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
}

/** update Quotation by Id */
const updateQuotation = async (req, res, next) => {
    try {
        const quotationId = req.params.id;
        const {
            company_from,
            company_from_state,
            company_to,
            company_to_regional_office,
            quotation_date,
            regional_office_id,
            sales_area_id,
            outlet,
            po_id,
            po_number,
            complaint_type,
            remark,
            items_data,
            quotation_type,
            amount,
        } = req.body;

        const { error } = quotationSchema.validate(req.body);
        // return
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.details[0].message });
        }

        const quotationData = {
            company_from,
            company_from_state,
            company_to,
            company_to_regional_office,
            quotation_date,
            regional_office_id,
            sales_area_id,
            outlet,
            po_id,
            po_number,
            complaint_type,
            remark,
            quotation_type,
            amount: amount.toFixed(2),
        };

        // Add the updated_by field
        quotationData.updated_by = req.user.user_id;

        // Update the company data in the database
        const result = await db.query("UPDATE quotations SET ? WHERE id = ?", [quotationData, quotationId]);

        const deleteExistingData = await db.query(`DELETE FROM quotation_items WHERE quotation_id = '${quotationId}'`);

        // if (deleteExistingData.affectedRows === 0) {
        //     return res.status(StatusCodes.OK).json({ status: false, message: "Quotation not found" });
        // } else {

        for (const item of items_data) {
            // check whether child Array is present and then insert into database
            if (Array.isArray(item.childArray) && item.childArray.length > 0) {
                for (const child of item.childArray) {
                    const amount = child.qty * item.rate;

                    // Insert the items data into the database
                    const resultChild = await db.query(
                        `INSERT INTO quotation_items
                                (quotation_id, 
                                po_id, 
                                order_line_number, 
                                unit, 
                                description, 
                                number, 
                                length, 
                                breadth, 
                                depth, 
                                quantity, 
                                rate, 
                                amount, 
                                status, 
                                created_by, 
                                updated_by)
                                VALUES
                                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `,

                        [
                            quotationId,
                            po_id,
                            item.order_line_number,
                            item.unit,
                            child.description,
                            child.no,
                            child.length,
                            child.breadth,
                            child.depth,
                            child.qty,
                            item.rate,
                            amount,
                            req.body.status,
                            req.user.user_id,
                            req.user.user_id,
                        ]
                    );
                }
            }
            // }

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Quotation updated successfully" });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Quotation does not exist" });
            }
        }
    } catch (error) {
        return next(error);
    }
};

//Delete api
const deleteQuotation = async (req, res, next) => {
    try {
        const quotationId = req.params.id;
        // return
        const { error } = checkPositiveInteger.validate({ id: quotationId });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send({ status: false, message: error.message });
        }

        // const result = await db.query("DELETE FROM quotations WHERE id = ?", [quotationId]);
        const result = await db.query("UPDATE quotations SET is_deleted = '1' WHERE id = ?", [quotationId]);

        // const quotationItemsResult = await db.query(
        //     `DELETE FROM quotation_items WHERE quotation_id = '${quotationId}'`
        // );
        const quotationItemsResult = await db.query(
            `UPDATE quotation_items SET is_deleted = '1' WHERE quotation_id = '${quotationId}'`
        );

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Quotation deleted successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error deleting the quotation" });
        }
    } catch (error) {
        return next(error);
    }
};

const sendEmailQuotation = async (req, res, next) => {
    const { to, subject, html } = req.body;
    const from = process.env.EMAIL;
    try {
        const result = await mailSent(from, to, subject, html);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

/** get quotations by status */
const getQuotationByStatusById = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (po_number LIKE '%${searchData}%' OR complaint_type LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT * FROM quotations WHERE status = ${status} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const results = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let dataName = [];

        if (results.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of results) {
                const sales_area_name = await getSalesAreaName(row.sales_area_id);
                const regional_office_name = await getRegionalOfficeName(row.regional_office_id);
                const quotation_date1 = moment(row.quotation_date).format("DD-MM-YYYY");
                const outlet_details = await getOutletById(row.outlet);
                const complaintTypeDetail = await getComplaintTypeById(row.complaint_type);
                complaint_type = complaintTypeDetail.complaint_type_name;
                var outlet_name = "";
                if (outlet_details.length > process.env.VALUE_ZERO) {
                    outlet_name += outlet_details[0].outlet_name;
                }

                // company from details
                const company_from_details = await getCompanyDetailsById(row.company_from);
                var company_from_name = company_from_details.company_name;
                // company_from_state details

                const company_from_state_details = await getStateById(row.company_from_state);
                var company_from_state_name = company_from_state_details.name;
                // company to details
                const company_to_details = await getCompanyDetailsById(row.company_to);
                var company_to_name = company_to_details.company_name;

                // po numbers for
                const poDetail = await getPoDetailById(row.po_number);
                var po_name = poDetail.po_number;

                // outlet details
                const outletDetail = await getOutletById(row.outlet);
                var outlet_name = outletDetail[0].outlet_name;

                const quotationData = {
                    ...row,
                    quotation_dates: moment(row.quotation_date).format("DD-MM-YYYY"),
                    sales_area_name,
                    regional_office_name,
                    outlet_name,
                    company_from_name,
                    company_from_state_name,
                    company_to_name,
                    po_name,
                    outlet_name,
                    complaint_type,
                };

                dataName.push(quotationData);
            }
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: dataName,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

// approve or reject quotation by status id
const approveOrRejectQuotationsById = async (req, res, next) => {
    try {
        const status = req.query.status;
        const id = req.query.id;
        // return
        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE quotations SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Item approved successfully" : "Item rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: "Invalid status" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createQuotation,
    getQuotation,
    updateQuotation,
    deleteQuotation,
    getQuotationById,
    sendEmailQuotation,
    getQuotationByStatusById,
    approveOrRejectQuotationsById,
};

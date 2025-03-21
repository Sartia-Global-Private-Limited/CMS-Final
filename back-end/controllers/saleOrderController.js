var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const os = require("os");
const { purchaseOrderValidation, checkPositiveInteger, salesOrderValidation } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getCreatedUserNameFromAdmin,
    calculateTaxAmount,
    getpurchase_order_item,
    get_new_purchase_order_item,
    getCompanyDetailsById,
    getRegionalNameById,
    getCompanyDetailsByUniqueId,
} = require("../helpers/general");

const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const excel = require("exceljs");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const { calculatedPercentage } = require("../helpers/commonHelper");

const createSalesOrder = async (req, res, next) => {
    try {
        let {
            so_date,
            ro_office,
            state,
            so_number,
            limit,
            security_deposit_date,
            security_deposit_amount,
            tender_date,
            tender_number,
            bank,
            dd_bg_number,
            cr_date,
            cr_number,
            cr_code,
            work,
            amount,
            so_for,
            // sub_total,
            tax,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            so_items,
        } = req.body;

        req.body.so_items = JSON.parse(so_items);
        const so_item_data = JSON.parse(so_items);
        so_item_data.forEach((item) => {
            if (item.change_gst_type == "0") {
                if (req.body.gst_id == "" || req.body.gst_percent == "") {
                    throw new Error("GST Type and GST Percent is required for Overall GST calculation.");
                }
            } else if (item.change_gst_type == "1") {
                if (item.gst_id == "" || item.gst_percent == "") {
                    throw new Error("GST Type and GST Percent is required for Individual GST calculation.");
                } else {
                    req.body.gst_id = item.gst_id.value || "";
                    req.body.gst_percent = item.gst_percent || "";
                }
            }
            if (so_for == "1") {
                if (isNaN(parseInt(item.qty))) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Quantity is required ",
                    });
                }
            }
        });

        const { error } = salesOrderValidation.validate(req.body);

        req.body.so_items = JSON.stringify(req.body.so_items);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        let fileFields = [];
        let gst_id;
        let gst_percent;
        let total_gst;

        fileFields = [
            { field: "cr_copy", storePath: "", imageName: "" },
            { field: "sd_letter", storePath: "", imageName: "" },
        ];

        if (req.files != null) {
            fileFields.forEach((fileField) => {
                const file = req.files[fileField.field];
                if (file && file != "null") {
                    fileField.imageName = Date.now() + file.name;
                    fileField.storePath = "/sales_order/" + fileField.imageName;
                    const uploadPath = process.cwd() + "/public/sales_order/" + fileField.imageName;
                    file.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                }
            });
        }

        let soItems = JSON.parse(so_items);
        if (so_for == "1") {
            soItems.map((item) => {
                // Check if `qty` is not provided or is invalid (empty, null, undefined, or 0)
                if (!item.qty || item.qty <= 0 || item.qty === "" || item.qty === null || item.qty === undefined) {
                    throw new Error("Quantity (qty) is required");
                }
                if (
                    !item.amount ||
                    item.amount <= 0 ||
                    item.amount === "" ||
                    item.amount === null ||
                    item.amount === undefined
                ) {
                    throw new Error("Amount (amount) is required");
                }
            });
        }

        let insertQuery = `INSERT INTO sales_order (so_date, ro_office, state, so_number, actual_so_amount, so_limit, security_deposit_date, security_deposit_amount, tender_date, tender_number, bank, dd_bg_number, cr_number, cr_code, so_work, cr_copy, sd_letter, created_by ,gst_id, gst_percent, total_gst, so_for, from_company, to_company, sd_letter_title, cr_copy_title, cr_date, created_at ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const formattedSoDate = moment(so_date, "YYYY-MM-DD").format("YYYY-MM-DD");
        // const formatted_security_deposit_date = moment(security_deposit_date, "YYYY-MM-DD").format("YYYY-MM-DD");
        const formatted_security_deposit_date =
            security_deposit_date && security_deposit_date.trim() !== ""
                ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"], true).isValid()
                    ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]).format("YYYY-MM-DD")
                    : null
                : null;

        const formatted_tender_date = moment(tender_date, "YYYY-MM-DD").format("YYYY-MM-DD");
        const formatted_cr_date = moment(cr_date, "YYYY-MM-DD", true).isValid()
            ? moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
            : null;
        const created_by = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        security_deposit_amount = security_deposit_amount != "" ? security_deposit_amount : 0;

        gst_id = req.body.gst_id;
        gst_percent = req.body.gst_percent;
        const totalGstAmount = await calculatedPercentage(gst_percent, limit);
        total_gst = totalGstAmount;

        const final_amount = parseFloat(amount) > 0 ? parseFloat(amount) + total_gst : 0.0;

        amount = amount != "" ? amount : 0;
        const insertValues = [
            formattedSoDate,
            ro_office,
            state,
            so_number,
            final_amount,
            limit,
            formatted_security_deposit_date,
            security_deposit_amount,
            formatted_tender_date,
            tender_number,
            bank,
            dd_bg_number,
            cr_number,
            cr_code,
            work,
            fileFields[0].storePath,
            fileFields[1].storePath,
            created_by,
            gst_id,
            gst_percent,
            total_gst,
            so_for,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            formatted_cr_date,
            createdAt,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const so_insertId = queryResult.insertId;
            const so_items = JSON.parse(req.body.so_items);
            // console.log("so_items: ", so_items);
            if (so_items.length > 0) {
                for (let index = 0; index < so_items.length; index++) {
                    const element = so_items[index];
                    let description = element.description ? `'${element.description}'` : null;

                    let gstIdValue =
                        element.gst_id && element.gst_id.value
                            ? `'${element.gst_id.value}'`
                            : req.body.gst_id
                              ? `'${req.body.gst_id}'`
                              : "NULL";

                    let gstPercentValue = element.gst_percent
                        ? `'${element.gst_percent}'`
                        : req.body.gst_percent
                          ? `'${req.body.gst_percent}'`
                          : "NULL";

                    let changeGstTypeValue = element.change_gst_type ? `'${element.change_gst_type}'` : "0";

                    let SO_itemQuery;
                    if (so_for == "1") {
                        SO_itemQuery = ` INSERT INTO sales_order_item(sales_order_id, so_for, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, sub_total, gst_id, gst_percent, change_gst_type, description ) VALUES ( '${so_insertId}', '${so_for}', '${element.order_line_number}', '${element.name}', '${element.unit}', '${element.hsn_code}', 'NA', '${element.rate}', '${element.qty}', '${element.amount}', '${element.sub_total ?? 0.0}', ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description} ) `;
                    } else {
                        SO_itemQuery = `INSERT INTO sales_order_item(sales_order_id, so_for,order_line_number, name, unit, hsn_code, ru_code, rate, sub_total, change_gst_type, description,  gst_id, gst_percent) VALUES ('${so_insertId}', '${so_for}', '${element.order_line_number}', '${element.name}','${element.unit}','${element.hsn_code}', 'NA', '${element.rate}','${element.sub_total ?? 0.0}', ${changeGstTypeValue}, ${description}, ${gstIdValue}, ${gstPercentValue} )`;
                    }
                    await db.query(SO_itemQuery);
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sales order created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "!Error, sales order not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGeneratedSalesOrder = async (req, res, next) => {
    try {
        // Pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const ro_office = req.query.ro_office;
        const so_number = req.query.so_number;
        // Status for open or close so
        const so_status = req.query.so_status;
        const security_unique_id = req.query.security_id;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const user_id = req.user.user_id || 0;

        // Status for approved or not
        const status = req.query.status;

        const conditions = [];

        if (security_unique_id) {
            conditions.push(`sales_order.security_unique_id = '${security_unique_id}'`);
        }

        if (so_status) {
            conditions.push(`sales_order.so_status = ${so_status}`);
        }

        if (searchData) {
            conditions.push(
                `(regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_order.so_number LIKE '%${searchData}%' OR states.name LIKE '%${searchData}%')`
            );
        }

        if (ro_office) {
            conditions.push(`sales_order.ro_office = '${ro_office}'`);
        }

        if (so_number) {
            conditions.push(`sales_order.so_number = '${so_number}'`);
        }

        if (status) {
            conditions.push(`sales_order.status = '${status}'`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE sales_order.created_by = ${user_id} AND ` + conditions.join(" AND ")
                : `WHERE sales_order.created_by = ${user_id}`;

        let selectQuery = `SELECT sales_order.*, regional_offices.regional_office_name, states.name as state_name,  gst_master.title, banks.bank_name FROM sales_order LEFT JOIN regional_offices ON regional_offices.id = sales_order.ro_office LEFT JOIN states ON states.id = sales_order.state LEFT JOIN gst_master ON gst_master.id = sales_order.gst_id LEFT JOIN banks ON banks.id = sales_order.bank ${whereClause} ORDER BY sales_order.id `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        // Remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let finalData = [];
        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);

                let regional_office_detail = await getCompanyDetailsByUniqueId(row.to_company, row.ro_office);

                finalData.push({
                    id: row.id,
                    so_date: moment(row.so_date).format("YYYY-MM-DD"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    so_number: row.so_number,
                    used_so_amount: row.so_amount,
                    remaining_so_amount: row.so_limit - row.so_amount,
                    limit: row.so_limit,
                    security_deposit_date: moment(row.security_deposit_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    security_deposit_amount: row.security_deposit_amount,
                    tender_date: moment(row.tender_date).format("YYYY-MM-DD"),
                    tender_number: row.tender_number,
                    bank: row.bank,
                    bank_name: row.bank_name,
                    dd_bg_number: row.dd_bg_number,
                    cr_date: moment(row.cr_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.so_work,
                    cr_copy: row.cr_copy,
                    sd_letter: row.sd_letter,
                    created_by: createdBy[0]?.name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    regional_office_name: row?.regional_office_name || regional_office_detail[0]?.gst_address || "",
                    state_name: row.state_name,
                    gst_id: row.gst_id,
                    gst_percent: row.gst_percent,
                    total_gst: row.total_gst,
                    gst_title: row.title,
                    so_status: row.so_status,
                    so_for: row.so_for,
                    payment_reference_number: row.payment_reference_number ?? "",
                    amount: row.amount ?? 0,
                    security_unique_id: row.security_unique_id ?? "",
                    date: moment(row.date).format("YYYY-MM-DD") ?? "",
                });
            }

            if (!pageSize) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "sales-order", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "sales-order", "Sales Order", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getSalesOrderDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const { error } = checkPositiveInteger.validate({ id });

        if (error)
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });

        const selectQuery = `SELECT sales_order.*, regional_offices.regional_office_name, states.name as state_name, gst_master.title, banks.bank_name, banks.logo FROM sales_order LEFT JOIN regional_offices ON regional_offices.id = sales_order.ro_office LEFT JOIN states ON states.id = sales_order.state LEFT JOIN gst_master ON gst_master.id = sales_order.gst_id LEFT JOIN banks ON banks.id = sales_order.bank WHERE sales_order.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let finalData = [];
            for (row of queryResult) {
                let name = "";
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                if (createdBy.length > 0) {
                    name = createdBy[0].name;
                }
                const sales_order_item = await get_new_sales_order_item(
                    id,
                    pageSize,
                    pageFirstResult,
                    currentPage,
                    searchData
                );

                const fromCompanyDetails = await getCompanyDetailsById(row.from_company);
                let toCompanyDetails = await getCompanyDetailsByUniqueId(row.to_company, row.ro_office);
                const final_from_data = {};
                toCompanyDetails.forEach((item) => {
                    final_from_data.company_id = item?.id || item?.company_id || "";
                    final_from_data.company_name = item?.name || item?.company_name || "";
                    final_from_data.unique_id = item?.unique_id || "";
                    final_from_data.regional_id = item?.gst_id || "";
                    final_from_data.regional_office = item?.gst_address || "";

                    toCompanyDetails = final_from_data;
                    // return item;
                });

                finalData.push({
                    id: row.id,
                    so_date: moment(row.so_date).format("YYYY-MM-DD"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    so_number: row.so_number,
                    used_so_amount: row.so_amount,
                    limit: row.so_limit,
                    so_amount: row.actual_so_amount,
                    remaining_so_amount: row.so_limit - row.so_amount,
                    security_deposit_date: moment(row.security_deposit_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    security_deposit_amount: row.security_deposit_amount,
                    tender_date: moment(row.tender_date).format("YYYY-MM-DD"),
                    tender_number: row.tender_number,
                    bank: row.bank,
                    bank_name: row.bank_name,
                    bank_logo: row.logo,
                    dd_bg_number: row.dd_bg_number,
                    cr_date: moment(row.cr_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.so_work,
                    cr_copy: row.cr_copy,
                    cr_copy_title: row.cr_copy_title,
                    sd_letter: row.sd_letter,
                    sd_letter_title: row.sd_letter_title,
                    created_by: name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    regional_office_name: row?.regional_office_name || toCompanyDetails?.regional_office || "",
                    state_name: row.state_name,
                    sales_order_item: sales_order_item,
                    gst_id: row.gst_id,
                    gst_percent: row.gst_percent,
                    so_tax: row.total_gst,
                    gst_title: row.title,
                    so_status: row.so_status,
                    so_for: row.so_for,
                    fromCompanyDetails: fromCompanyDetails,
                    toCompanyDetails: toCompanyDetails,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function checkSalesOrderAmount(id, limit) {
    try {
        const selectQuery = await db.query(`SELECT * FROM sales_order WHERE id = '${id}'`);

        if (selectQuery.length > 0) {
            const soAmount = parseFloat(selectQuery[0].so_amount);
            const limitAmount = parseFloat(limit);

            if (limitAmount >= soAmount) {
                return { result: true, soAmount: soAmount };
            } else {
                return { result: false, soAmount: soAmount };
            }
        } else {
            return { result: false };
        }
    } catch (error) {
        return false;
    }
}

const updateSalesOrderDetails = async (req, res, next) => {
    try {
        let {
            so_date,
            ro_office,
            state,
            so_number,
            limit,
            security_deposit_date,
            security_deposit_amount,
            tender_date,
            tender_number,
            bank,
            dd_bg_number,
            cr_date,
            cr_number,
            cr_code,
            work,
            cr_copy,
            sd_letter,
            id,
            gst_id,
            gst_percent,
            sub_total,
            tax,
            so_for,
            amount,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            so_items,
        } = req.body;
        amount = parseInt(amount) > 0 ? parseInt(amount) : parseInt(limit);
        const so_item_data = JSON.parse(so_items);
        so_item_data.forEach((item) => {
            if (JSON.parse(item.amount) == null) {
                item.amount = 0;
            }
        });
        req.body.so_items = so_item_data;

        const { error } = salesOrderValidation.validate(req.body);

        req.body.so_items = JSON.stringify(req.body.so_items);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const checkSoAmount = await checkSalesOrderAmount(id, limit);
        if (checkSoAmount.result == false) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: `Sales Amount should be equal or greater than ${checkSoAmount.soAmount}`,
            });
        }

        let fileFields = [
            { field: "cr_copy", storePath: cr_copy != "null" ? cr_copy : "" },
            { field: "sd_letter", storePath: sd_letter != "null" ? sd_letter : "" },
        ];

        if (req.files != null) {
            fileFields.forEach((fileField) => {
                const file = req.files[fileField.field];
                if (file && file != "null") {
                    fileField.imageName = Date.now() + file.name;
                    fileField.storePath = "/sales_order/" + fileField.imageName;
                    const uploadPath = process.cwd() + "/public/sales_order/" + fileField.imageName;
                    file.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                }
            });
        }

        const updateQuery =
            "UPDATE sales_order SET so_date = ?, ro_office = ?, state = ?, so_number = ?, so_limit = ?, security_deposit_date = ?, security_deposit_amount = ?, tender_date = ?, tender_number = ?, bank = ?, dd_bg_number = ?, cr_date = ?, cr_number = ?, cr_code = ?, so_work = ?, cr_copy = ?, sd_letter = ?, created_by = ?, gst_id= ?, gst_percent= ?, total_gst= ?, so_for = ?, actual_so_amount= ?, from_company = ?, to_company = ?, sd_letter_title = ?, cr_copy_title = ?  WHERE id  = ?";

        const formattedSoDate = moment(so_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        // const formattedSecurityDepositDate = moment(security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedSecurityDepositDate = security_deposit_date && security_deposit_date.trim() !== "" 
        ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"], true).isValid()
            ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]).format("YYYY-MM-DD")
            : null
        : null;
        const formattedTenderDate = moment(tender_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedCrDate = moment(cr_date, "YYYY-MM-DD", true).isValid()
            ? moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
            : null;
        const created_by = req.user.user_id;
        security_deposit_amount = security_deposit_amount != "" ? security_deposit_amount : 0;
        let total_gst;

        const updateValues = [
            formattedSoDate,
            ro_office,
            state,
            so_number,
            limit,
            formattedSecurityDepositDate,
            security_deposit_amount,
            formattedTenderDate,
            tender_number,
            bank,
            dd_bg_number,
            formattedCrDate,
            cr_number,
            cr_code,
            work,
            fileFields[0].storePath,
            fileFields[1].storePath,
            created_by,
            gst_id,
            gst_percent,
            tax,
            so_for,
            amount,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            id,
        ];
        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            await db.query(`DELETE FROM sales_order_item WHERE sales_order_id='${id}'`);
            const so_items = JSON.parse(req.body.so_items);
            if (so_items.length > 0) {
                for (let index = 0; index < so_items.length; index++) {
                    const element = so_items[index];
                    let description = element.description ? `'${element.description}'` : null;
                    var gstIdValue =
                        element.gst_id && element.gst_id.value
                            ? `'${element.gst_id.value}'`
                            : req.body.gst_id
                              ? `'${req.body.gst_id}'`
                              : "NULL";
                    var gstPercentValue = element.gst_percent
                        ? `'${element.gst_percent}'`
                        : req.body.gst_percent
                          ? `'${req.body.gst_percent}'`
                          : "NULL";

                    var changeGstTypeValue = element.change_gst_type ? `'${element.change_gst_type}'` : "0";
                    if (so_for == "1") {
                        var SO_itemQuery = ` INSERT INTO sales_order_item( sales_order_id, so_for, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, sub_total, gst_id, gst_percent, change_gst_type, description ) VALUES ( '${id}', '${so_for}', '${element.order_line_number}', '${element.name}', '${element.unit}', '${element.hsn_code}', 'NA', '${element.rate}', '${element.qty}', '${element.amount}', '${element.sub_total ?? 0.0}', ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description}) `;
                    } else {
                        var SO_itemQuery = `INSERT INTO sales_order_item(sales_order_id, so_for,order_line_number, name, unit, hsn_code, ru_code, rate, gst_id, gst_percent, change_gst_type, description ) VALUES ('${id}', '${so_for}', '${element.order_line_number}', '${element.name}','${element.unit}','${element.hsn_code}', 'NA', '${element.rate}', ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description} )`;
                    }
                    await db.query(SO_itemQuery);
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sales order updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "!Error, sales order not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteSalesOrder = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const deleteQuery = "DELETE FROM sales_order WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // delete sales order items as well
            const deleteSoItems = await db.query(`DELETE FROM sales_order_item WHERE sales_order_id = ?`, [id]);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sales order deleted successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Sales order not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const checkSONumberIsAlreadyExists = async (req, res, next) => {
    try {
        const search_value = req.query.search_value;

        const selectQuery = await db.query(
            `SELECT so_number FROM sales_order WHERE so_number LIKE '%${search_value}%'`
        );

        if (selectQuery.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "SO number exists",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "SO number not exists",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getSoListOnRoId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT id, so_number, so_amount FROM sales_order WHERE ro_office = ?";
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getIncludePercentage = async (req, res, next) => {
    try {
        const { type, amount } = req.body;

        const includePercentValidation = Joi.object({
            type: Joi.string().required(),
            amount: Joi.number().required(),
        });

        const { error } = includePercentValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const getTypeAndPercentageValue = `SELECT billing_types.id as id, billing_types.name as type_name, taxes.value FROM billing_types LEFT JOIN taxes ON billing_types.id = taxes.billing_type_id WHERE billing_types.name = '${type}'`;

        const queryResult = await db.query(getTypeAndPercentageValue);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const result = queryResult[0];

            const calculatedPercentage = await calculateTaxAmount(parseInt(result.value), parseInt(amount));

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Tax type found",
                data: calculatedPercentage,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Tax type not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGstType = async (req, res, next) => {
    try {
        const selectQuery = "SELECT id, title, percentage FROM gst_master";
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const changeSoStatus = async (req, res, next) => {
    try {
        const { so_id, status } = req.body;

        const soStatusValidation = Joi.object({
            so_id: Joi.number().required(),
            status: Joi.number().required(),
        });

        const { error } = soStatusValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`UPDATE sales_order SET so_status = ? WHERE id = ?`, [status, so_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            let soStatus;
            if (status == "1") {
                soStatus = "open"; // working
            } else {
                soStatus = "closed"; // done
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "SO status changed to " + soStatus + " successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function salesOrderItemsOnSoIds(so_id) {
    try {
        const id = so_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            throw new Error(error.message);
        }

        const queryResult = await db.query(
            `SELECT sales_order_item.id as so_item_id, sales_order_item.so_for, sales_order_item.order_line_number, sales_order_item.hsn_code, sales_order_item.name, sales_order_item.rate, sales_order_item.qty, sales_order_item.unit, sales_order.so_for FROM sales_order_item LEFT JOIN sales_order ON sales_order.id = sales_order_item.sales_order_id WHERE sales_order_item.sales_order_id = ?`,
            [id]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                const remainingQuantity = await getUsedQty(row.so_for, id);
                const remainingQtyForOrderLine = remainingQuantity?.data?.find(
                    (entry) => entry.order_line_number === row.order_line_number
                );
                if (remainingQtyForOrderLine) {
                    row.remaining_quantity = remainingQtyForOrderLine.remaining_quantity;
                } else {
                    row.remaining_quantity = null; // Set null if remaining quantity not found
                }
            }
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const getSalesOrderItemsOnSo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(
            `SELECT sales_order.id as so_id, sales_order.so_number, sales_order.so_amount, sales_order.so_limit, sales_order.so_date, sales_order.so_for FROM sales_order WHERE sales_order.id = ?`,
            [id]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            const finalData = [];
            for (const row of queryResult) {
                const getSalesOrderItems = await salesOrderItemsOnSoIds(row.so_id);
                for (const getSalesOrderItem of getSalesOrderItems) {
                    getSalesOrderItem.item_name = `${getSalesOrderItem.hsn_code} - ${getSalesOrderItem.name}`;
                    getSalesOrderItem.item_rate = Number(getSalesOrderItem.item_rate);
                }

                finalData.push({
                    so_id: row.so_id,
                    so_number: row.so_number,
                    so_used_amount: row.so_amount,
                    so_limit: row.so_limit,
                    so_for: row.so_for,
                    so_date: moment(row.so_date).format("YYYY-MM-DD"),
                    so_items: getSalesOrderItems,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// const downloadCsvFile = async (req,res,next) => {
//     try {
//         const id = req.params.id;
//         const selectQuery = await db.query(`SELECT id, order_line_number, name, unit, hsn_code, ru_code, rate, qty, sub_total, created_at FROM sales_order_item WHERE purchase_order_id = '${id}'`);

//         const workbook = new excel.Workbook();
//         const worksheet = workbook.addWorksheet('PurchaseOrderItems');

//         // Add headers
//         worksheet.addRow(['OrderLineNumber', 'RuCode', 'Name', 'Unit', 'HsnCode', 'Rate', 'Qty', 'SubTotal', 'Createdon']);

//         // Add data
//         selectQuery.forEach(row => {
//             worksheet.addRow([
//                 row.order_line_number,
//                 row.ru_code,
//                 row.name,
//                 row.unit,
//                 row.hsn_code,
//                 row.rate,
//                 row.qty,
//                 row.sub_total,
//                 row.created_at
//             ]);
//         });

//         // Set up stream
//         const stream = await workbook.xlsx.writeBuffer();

//         // Set response headers
//         res.set({
//             'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//             'Content-Disposition': 'attachment; filename="purchase_order_items.xlsx"'
//         });

//         // Send response
//         res.send(stream);
//     } catch (error) {next(error)
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// }

const downloadCsvFile = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (id) {
            const selectQuery = await db.query(
                `SELECT id, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, sub_total, created_at FROM sales_order_item WHERE sales_order_id = '${id}'`
            );

            const csvWriter = createObjectCsvWriter({
                path: "so_items.csv",
                header: [
                    { id: "order_line_number", title: "OrderLineNumber" },
                    { id: "ru_code", title: "RuCode" },
                    { id: "name", title: "Name" },
                    { id: "unit", title: "Unit" },
                    { id: "hsn_code", title: "HsnCode" },
                    { id: "rate", title: "Rate" },
                    { id: "qty", title: "Qty" },
                    { id: "amount", title: "Amount" },
                    { id: "sub_total", title: "SubTotal" },
                    { id: "created_at", title: "Createdon" },
                ],
            });

            const results = selectQuery.map((row) => ({
                order_line_number: row.order_line_number,
                ru_code:
                    row.ru_code === 0 || row.ru_code === "NA" || row.ru_code == null || row.ru_code == "undefined"
                        ? "NA"
                        : row.ru_code, // handle possible null values
                // handle possible null values
                name: row.name,
                unit: row.unit || "NA",
                hsn_code: row.hsn_code || "NA",
                rate: row.rate,
                qty: row.qty === null || row.qty === 0 ? "null" : row.qty,
                amount: row.amount === null || row.amount === 0 ? "null" : row.amount,
                sub_total: row.sub_total === null || row.sub_total === 0 ? "null" : row.sub_total,
                created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
            }));

            // Write records to CSV
            await csvWriter.writeRecords(results);

            // Set response headers
            res.set({
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="so_items.csv"',
            });

            // Send response
            res.download("so_items.csv", "so_items.csv", (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    fs.unlinkSync("so_items.csv"); // Delete file after sending it
                }
            });
        } else {
            const sampleCsvPath = path.join(__dirname, "../public/sampleCsv/sampleCsv.csv");

            // res.download(sampleCsvPath, 'sampleCsv.csv', (err) => {
            //     if (err) {
            //         res.status(500).send(err);
            //     }
            // });
            res.json({ filePath: sampleCsvPath });
        }
    } catch (error) {
        return next(error);
    }
};

async function getUsedQty(so_for, so_id) {
    try {
        const check = await db.query(
            `SELECT soi.sales_order_id, soi.order_line_number,  soi.qty AS total_quantity, IFNULL(used.used_qty, 0) AS used_quantity, soi.qty - IFNULL(used.used_qty, 0) AS remaining_quantity FROM sales_order_item soi LEFT JOIN (SELECT so_id, order_line_number, SUM(used_qty) AS used_qty FROM used_so_details GROUP BY so_id, order_line_number) AS used ON soi.sales_order_id = used.so_id AND soi.order_line_number = used.order_line_number WHERE soi.so_for = '${so_for}' AND soi.sales_order_id = '${so_id}'`
        );
        return {
            status: true,
            data: check,
        };
    } catch (error) {
        throw error;
    }
}

// const changePoStatus = async (req,res,next) => {
//     try {
//         const { po_id, status } = req.body;

//         const poStatusValidation = Joi.object({
//             po_id: Joi.number().required(),
//             status: Joi.number().required(),
//         });

//         const { error } = poStatusValidation.validate(req.body);

//         if (error) {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: error.message,
//             });
//         }

//         const checkAmount = await checkPurchaseOrderAmount(po_id);

//         if (status == "2" && checkAmount.result == false) {
//             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//                 status: false,
//                 message: `PO limit should be greater than or equal to ${checkAmount.poAmount}`,
//             });
//         }
//         const queryResult = await db.query(
//             `UPDATE sales_order SET po_status = ? WHERE id = ?`,
//             [status, po_id]
//         );

//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             let poStatus;
//             if (status == "1") {
//                 poStatus = "Open";
//             } else {
//                 poStatus = "Closed";
//             }
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "PO status changes to " + poStatus + " successfully",
//             });
//         } else {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: "Error! Something  went wrong, please try again later",
//             });
//         }
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };
async function generateSecurityDepositUniqueId() {
    const retentinoQuery = `SELECT security_unique_id FROM sales_order WHERE security_unique_id IS NOT NULL AND security_unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(retentinoQuery);
    if (result.length) {
        const currentID = result[0].security_unique_id;
        const numberPart = parseInt(currentID?.slice(3), 10);
        const nextNumber = numberPart + 1;
        return `SOD${nextNumber.toString().padStart(3, "0")}`;
    }
    return "SOD001";
}

const approveSalesOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            so_ids: Joi.array().items(Joi.number().integer().required()).required(),
        }).required();
        const { error } = schema.validate(req.body);

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const security_unique_id = await generateSecurityDepositUniqueId();
        const data = {
            security_unique_id,
            status: 2,
        };

        const updateQuery = `UPDATE sales_order SET ? WHERE id IN (?)`;

        const queryResult = await db.query(updateQuery, [data, req.body.so_ids]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sales order approved successfully",
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Something went wrong in approving sales order.",
        });
    } catch (error) {
        return next(error);
    }
};

const approveAndUpdateSalesOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            so_ids: Joi.array().required(),
            payment_reference_number: Joi.string().required(),
            date: Joi.date().required(),
            amount: Joi.number().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }
        const { so_ids, payment_reference_number, date, amount } = req.body;
        const data = {
            payment_reference_number,
            date,
            amount,
            status: 3,
        };
        for (const id of so_ids) {
            const updateQuery = `UPDATE sales_order SET ? WHERE id = ?`;
            const queryResult = await db.query(updateQuery, [data, id]);

            if (queryResult.affectedRows <= process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Cannot update payment for sales order ID: ${id}, please check your values.`,
                });
            }
        }
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Payment amount updated successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const getRoForSalesOrder = async (req, res, next) => {
    const status = req.query.status || 1;
    try {
        const selectQuery = `SELECT DISTINCT ro_office FROM sales_order WHERE so_status = 2 AND status = ?`;
        const queryResult = await db.query(selectQuery, [status]);
        const result = [];
        for (let ro of queryResult) {
            const [ro_detail] = await getRegionalNameById(`${ro.ro_office}`);
            result.push(ro_detail);
        }
        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result });
    } catch (error) {
        return next(error);
    }
};

const getSoNumberForSalesOrder = async (req, res, next) => {
    const status = req.query.status || 1;
    const ro = req.query.ro;
    try {
        const selectQuery = `SELECT id, so_number FROM sales_order WHERE so_status = 2 AND ro_office = ? AND status = ?`;
        const queryResult = await db.query(selectQuery, [ro, status]);
        res.status(StatusCodes.OK).json({ status: true, data: queryResult });
    } catch (error) {
        return next(error);
    }
};

const getSalesSecurityUniqueId = async (req, res, next) => {
    try {
        const status = req.query.status || 3;
        const po = req.query.po;
        let search = "";
        if (po) {
            search = ` AND so_number = '${po}'`;
        }
        const selectQuery = `SELECT DISTINCT security_unique_id FROM sales_order WHERE so_status = 2 ${search} AND status = ${status}`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, data: queryResult });
        }
        res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
    } catch (error) {
        return next(error);
    }
};

async function get_new_sales_order_item(id, pageSize, pageFirstResult, currentPage, searchData) {
    let searchCondition = "";
    if (searchData) {
        searchCondition += `AND soi.name LIKE '%${searchData}%' OR soi.order_line_number LIKE '%${searchData}%' OR soi.unit LIKE '%${searchData}%' OR soi.rate LIKE '%${searchData}%'`;
    }

    // const sql = `SELECT soi.sales_order_id, soi.change_gst_type, soi.order_line_number as OrderLineNumber, soi.ru_code as RuCode, soi.hsn_code as HsnCode, soi.name as Name, soi.unit AS Unit, soi.rate as Rate, soi.qty As Qty, soi.amount as Amount, soi.total_gst as totalGSTAmount, IFNULL(soi.description, '') as description, soi.created_at, gst_master.id as gst_id, gst_master.title as gst_type, gst_master.percentage as gst_percent FROM sales_order_item soi LEFT JOIN gst_master ON gst_master.id = soi.gst_id WHERE soi.sales_order_id='${id}' ${searchCondition} ORDER BY soi.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

    const sql = `SELECT soi.sales_order_id, soi.change_gst_type, soi.order_line_number as order_line_number, soi.ru_code, soi.hsn_code, soi.name, soi.unit, soi.rate, soi.qty, soi.amount, soi.total_gst as total_gst_amount, IFNULL(soi.description, '') as description, soi.created_at, gst_master.id as gst_id, gst_master.title as gst_type, gst_master.percentage as gst_percent FROM sales_order_item soi LEFT JOIN gst_master ON gst_master.id = soi.gst_id WHERE soi.sales_order_id='${id}' ${searchCondition} ORDER BY soi.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

    const queryResult = await db.query(sql);

    // remove after order by
    const modifiedQueryString = sql.substring(0, sql.indexOf("ORDER BY"));
    const totalResult = await db.query(modifiedQueryString);

    if (queryResult.length > 0) {
        let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        return {
            pageDetails: pageDetails,
            data: queryResult,
        };
    } else {
        return [];
    }

    // return await db.query(sql);
}

module.exports = {
    createSalesOrder,
    getAllGeneratedSalesOrder,
    getSalesOrderDetailsById,
    updateSalesOrderDetails,
    deleteSalesOrder,
    checkSONumberIsAlreadyExists,
    getSoListOnRoId,
    getIncludePercentage,
    getAllGstType,
    changeSoStatus,
    getSalesOrderItemsOnSo,
    downloadCsvFile,
    getUsedQty,
    getRoForSalesOrder,
    getSoNumberForSalesOrder,
    approveAndUpdateSalesOrder,
    approveSalesOrder,
    getSalesSecurityUniqueId,
};

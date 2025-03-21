var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const os = require("os");
const { purchaseOrderValidation, checkPositiveInteger } = require("../helpers/validation");
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
    getRecordWithWhereAndJoin,
} = require("../helpers/general");
// const { purchaseOrderItemsOnPoId, calculatedPercentage, getItemDetailsById } = require('../helpers/commonHelper');
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const excel = require("exceljs");
const { insertIntoRoWallets, calculatedPercentage } = require("../helpers/commonHelper");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const createPurchaseOrder = async (req, res, next) => {
    try {
        let {
            po_date,
            ro_office,
            state,
            po_number,
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
            po_for,
            tax,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            po_items,
        } = req.body;

        // console.log('req.body: ', req.body);

        req.body.po_items = JSON.parse(po_items);
        const po_item_data = JSON.parse(po_items);
        po_item_data.forEach((item) => {
            if(item.change_gst_type == '0') {
                if(req.body.gst_id == "" || req.body.gst_percent == "") {
                    throw new Error("GST Type and GST Percent is required for Overall GST calculation.");
                }
            } else if (item.change_gst_type == '1') {
                if(item.gst_id == "" || item.gst_percent == "") {
                    throw new Error("GST Type and GST Percent is required for Individual GST calculation.");
                } else {
                    req.body.gst_id =  item.gst_id.value || "";
                    req.body.gst_percent = item.gst_percent || "";
                }
            }
            if(po_for == '1') {
                if(isNaN(parseInt(item.qty))) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Quantity is required ",
                    });
                }
            }
        })

        const { error } = purchaseOrderValidation.validate(req.body);

        const conditions = [{ field: "po_number", operator: "=", value: po_number }]
        const existingRecord = await getRecordWithWhereAndJoin("purchase_orders", conditions);
        if(existingRecord.length > 0) {
            console.log("==>")
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "PO Number already exists",
            });
        }

        req.body.po_items = JSON.stringify(req.body.po_items);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
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
                    fileField.storePath = "/purchase_order/" + fileField.imageName;
                    const uploadPath = process.cwd() + "/public/purchase_order/" + fileField.imageName;
                    file.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                }
            });
        }

        const [get_from_company_detail] = await getCompanyDetailsByUniqueId(from_company);
        const from_company_id = get_from_company_detail?.unique_id || null;

        let insertQuery =
            "INSERT INTO purchase_orders (po_date, ro_office, state, po_number, actual_po_amount, po_limit, security_deposit_date, security_deposit_amount, tender_date, tender_number, bank, dd_bg_number, cr_number, cr_code, po_work, cr_copy, sd_letter, created_by ,gst_id, gst_percent, total_gst, po_for, from_company, to_company, sd_letter_title, cr_copy_title, created_at, cr_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const formattedPoDate = po_date && moment(po_date, "YYYY-MM-DD").format("YYYY-MM-DD");

        const formatted_security_deposit_date = security_deposit_date && security_deposit_date.trim() !== "" 
            ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"], true).isValid()
                ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]).format("YYYY-MM-DD")
                : null
            : null;

        const formatted_tender_date = tender_date && moment(tender_date, "YYYY-MM-DD").format("YYYY-MM-DD");

        const formatted_cr_date = moment(cr_date, "YYYY-MM-DD", true).isValid()
            ? moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
            : null;
        const created_by = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        security_deposit_amount = security_deposit_amount != "" ? security_deposit_amount : 0;
        // console.log('security_deposit_amount: ', security_deposit_amount);

        // overall GST type and percentage
        gst_id = req.body.gst_id;
        gst_percent = req.body.gst_percent;
        const totalGstAmount = await calculatedPercentage(gst_percent, limit);
        total_gst = totalGstAmount;

        const final_amount = parseFloat(amount) > 0 ? parseFloat(amount) + total_gst : 0.0;

        const insertValues = [
            formattedPoDate,
            ro_office,
            state,
            po_number,
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
            po_for,
            from_company_id,
            to_company,
            sd_letter_title,
            cr_copy_title,
            createdAt,
            formatted_cr_date,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const po_insertId = queryResult.insertId;
            // update the ro wallet
            const paymentSettingQuery = `SELECT promotion_expense FROM payment_setting WHERE ro_id = '${ro_office}'`;
            const paymentSettingResult = await db.query(paymentSettingQuery);
            for (let paymentSetting of paymentSettingResult) {
                const amount = (Number(limit) * Number(paymentSetting.promotion_expense)) / 100;
                await insertIntoRoWallets(ro_office, po_insertId, amount);
            }
            const po_items = JSON.parse(req.body.po_items);
            if (po_items.length > 0) {
                for (let index = 0; index < po_items.length; index++) {
                    const element = po_items[index];

                    let description = element.description ? `'${await cleanDescription(element.description)}'` : null;
                    let name = element.name ? `'${await cleanDescription(element.name)}'` : null;

                    let gstIdValue =
                        element.gst_id && element.gst_id.value
                            ? `'${element.gst_id.value}'`
                            : req.body.gst_id
                              ? `'${req.body.gst_id}'`
                              : "NULL";

                    // var gstPercentValue = element.gst_percent ? `'${element.gst_percent}'` : 'NULL';
                    let gstPercentValue = element.gst_percent
                        ? `'${element.gst_percent}'`
                        : req.body.gst_percent
                          ? `'${req.body.gst_percent}'`
                          : "NULL";

                    let changeGstTypeValue = element.change_gst_type ? `'${element.change_gst_type}'` : "0";

                    if (po_for == "1") {
                        var PO_itemQuery = ` INSERT INTO purchase_order_item( purchase_order_id, po_for, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, gst_id, gst_percent, change_gst_type, description ) VALUES ( '${po_insertId}', '${po_for}', '${element.order_line_number}', ${name}, '${element.unit}', '${element.hsn_code}', 'NA', '${element.rate}', '${element.qty}', '${element.amount}',  ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description} ) `;
                    } else {
                        var PO_itemQuery = `INSERT INTO purchase_order_item(purchase_order_id, po_for,order_line_number, name, unit, hsn_code, ru_code, rate, change_gst_type, description,  gst_id, gst_percent) VALUES ('${po_insertId}', '${po_for}', '${element.order_line_number}', ${name},'${element.unit}','${element.hsn_code}', 'NA', '${element.rate}', ${changeGstTypeValue}, ${description}, ${gstIdValue}, ${gstPercentValue} )`;
                    }
                    await db.query(PO_itemQuery);
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Purchase order created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "!Error, purchase order not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function cleanDescription(description) {
    if (!description) return null;

    // Replace escaped single quotes with a single quote
    let cleaned = description.replace(/''/g, "'");

    // Remove all special characters except alphanumeric, spaces, periods, commas, and dashes
    // Additionally, remove single quotes and double quotes
    cleaned = cleaned.replace(/[^\w\s.,-]/g, ""); // Fixed syntax

    return cleaned;
}

const getAllGeneratedPurchaseOrder = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const ro_office = req.query.ro_office;
        const po_number = req.query.po_number;
        // status for open or close po
        const po_status = req.query.po_status;
        const security_unique_id = req.query.security_id;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const user_id = req.user.user_id || 0;

        // status for approved or not
        const status = req.query.status;

        const conditions = [];

        if (security_unique_id) {
            conditions.push(`purchase_orders.security_unique_id = '${security_unique_id}'`);
        }

        if (po_status) {
            conditions.push(`purchase_orders.po_status = ${po_status}`);
        }

        if (searchData) {
            conditions.push(
                `(regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%' OR states.name LIKE '%${searchData}%')`
            );
        }

        if (ro_office) {
            conditions.push(`purchase_orders.ro_office = '${ro_office}'`);
        }

        if (po_number) {
            conditions.push(`purchase_orders.po_number = '${po_number}'`);
        }

        if (status) {
            conditions.push(`purchase_orders.status = '${status}'`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE purchase_orders.created_by = '${user_id}' AND ` + conditions.join(" AND ")
                : `WHERE purchase_orders.created_by = '${user_id}'`;

        let selectQuery = `SELECT purchase_orders.*, regional_offices.regional_office_name, states.name as state_name,  gst_master.title, banks.bank_name FROM purchase_orders LEFT JOIN regional_offices ON regional_offices.id = purchase_orders.ro_office LEFT JOIN states ON states.id = purchase_orders.state LEFT JOIN gst_master ON gst_master.id = purchase_orders.gst_id LEFT JOIN banks ON banks.id = purchase_orders.bank ${whereClause} ORDER BY purchase_orders.id `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let finalData = [];
        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);

                let regional_office_detail = await getCompanyDetailsByUniqueId(row.from_company);

                finalData.push({
                    id: row.id,
                    po_date: moment(row.po_date).format("YYYY-MM-DD"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    po_number: row.po_number,
                    used_po_amount: row.po_amount,
                    remaining_po_amount: row.po_limit - row.po_amount,
                    limit: row.po_limit,
                    security_deposit_date: moment(row.security_deposit_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    security_deposit_amount: row.security_deposit_amount,
                    tender_date: moment(row.tender_date).format("YYYY-MM-DD"),
                    tender_number: row.tender_number,
                    bank: row.bank,
                    bank_name: row.bank_name,
                    dd_bg_number: row.dd_bg_number,
                    cr_date: (row.cr_date != null && moment(row.cr_date).format("YYYY-MM-DD")) || "",
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.po_work,
                    cr_copy: row.cr_copy,
                    sd_letter: row.sd_letter,
                    created_by: createdBy[0]?.name,
                    created_at: moment(row.cr_date, "YYYY-MM-DD", true).isValid()
                        ? moment(row.cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                        : null,
                    regional_office_name: row?.regional_office_name || regional_office_detail[0]?.gst_address || "",
                    state_name: row.state_name,
                    gst_id: row.gst_id,
                    gst_percent: row.gst_percent,
                    total_gst: row.total_gst,
                    gst_title: row.title,
                    po_status: row.po_status,
                    status: row.status,
                    po_for: row.po_for,
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
                    filePath = await exportToExcel(finalData, "purchase-order", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "purchase-order", "Purchase Orders", columns);
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

async function generateSecurityDepositUniqueId() {
    const retentinoQuery = `SELECT security_unique_id FROM purchase_orders WHERE security_unique_id IS NOT NULL AND security_unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(retentinoQuery);
    if (result.length) {
        const currentID = result[0].security_unique_id;
        const numberPart = parseInt(currentID?.slice(3), 10);
        const nextNumber = numberPart + 1;
        return `PSD${nextNumber.toString().padStart(3, "0")}`;
    }
    return "PSD001";
}

const getPurchaseOrderDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const { error } = checkPositiveInteger.validate({ id });

        if (error)
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });

        const selectQuery = `SELECT purchase_orders.*, regional_offices.regional_office_name, states.name as state_name, gst_master.title, banks.bank_name, banks.logo FROM purchase_orders LEFT JOIN regional_offices ON regional_offices.id = purchase_orders.ro_office LEFT JOIN states ON states.id = purchase_orders.state LEFT JOIN gst_master ON gst_master.id = purchase_orders.gst_id LEFT JOIN banks ON banks.id = purchase_orders.bank WHERE purchase_orders.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let finalData = [];
            for (row of queryResult) {
                let name = "";
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                if (createdBy.length > 0) {
                    name = createdBy[0].name;
                }
                const purchase_order_item = await get_new_purchase_order_item(
                    id,
                    pageSize,
                    pageFirstResult,
                    currentPage,
                    searchData
                );

                let fromCompanyDetails = await getCompanyDetailsByUniqueId(row.from_company);
                const final_from_data = {};
                fromCompanyDetails.forEach((item) => {
                    final_from_data.company_id = item?.id || item?.company_id || "";
                    final_from_data.company_name = item?.name || item?.company_name || "";
                    final_from_data.unique_id = item?.unique_id || "";
                    final_from_data.regional_id = item?.gst_id || "";
                    final_from_data.regional_office = item?.gst_address || "";

                    fromCompanyDetails = final_from_data;
                    // return item;
                });

                const toCompanyDetails = await getCompanyDetailsById(row.to_company);

                // console.log('fromCompanyDetails: ', fromCompanyDetails, fromCompanyDetails.regional_office);
                // console.log("row.cr_date: ", row);
                finalData.push({
                    id: row.id,
                    po_date: moment(row.po_date).format("YYYY-MM-DD"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    po_number: row.po_number,
                    used_po_amount: row.po_amount,
                    limit: row.po_limit,
                    po_amount: row.actual_po_amount,
                    remaining_po_amount: row.po_limit - row.po_amount,
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
                    cr_date: row.cr_date != null ? moment(row.cr_date).format("YYYY-MM-DD") : "",
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.po_work,
                    cr_copy: row.cr_copy,
                    cr_copy_title: row.cr_copy_title,
                    sd_letter: row.sd_letter,
                    sd_letter_title: row.sd_letter_title,
                    created_by: name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    regional_office_name: row?.regional_office_name || fromCompanyDetails?.regional_office || "",
                    state_name: row.state_name,
                    purchase_order_item: purchase_order_item,
                    gst_id: row.gst_id,
                    gst_percent: row.gst_percent,
                    po_tax: row.total_gst,
                    gst_title: row.title,
                    po_status: row.po_status,
                    po_for: row.po_for,
                    fromCompanyDetails: fromCompanyDetails,
                    toCompanyDetails: toCompanyDetails,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: finalData[0] });
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

const updatePurchaseOrderDetails = async (req, res, next) => {
    try {
        let {
            po_date,
            ro_office,
            state,
            po_number,
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
            tax,
            po_for,
            amount,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            po_items,
        } = req.body;
        
        req.body.amount = parseInt(amount) > 0 ? parseInt(amount) : parseInt(limit);
        req.body.limit = parseInt(limit) > 0 ? parseInt(limit) : parseInt(limit);
        console.log('req.body: ', req.body);

        
        const po_item_data = JSON.parse(po_items);
        po_item_data.forEach((item) => {
            if (JSON.parse(item.rate) == null) {
                item.rate = 0;
            }
        });
        req.body.po_items = po_item_data;
        const { error } = purchaseOrderValidation.validate(req.body);

        req.body.po_items = JSON.stringify(req.body.po_items);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const checkPoAmount = await checkPurchaseOrderAmount(id, limit);
        if (checkPoAmount.result == false) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: `Purchase Amount should be equal or greater than ${checkPoAmount.poAmount}`,
            });
        }

        let fileFields = [
            { field: "cr_copy", storePath: cr_copy != "null" ? cr_copy : "" },
            { field: "sd_letter", storePath: sd_letter != "null" ? sd_letter : "" },
        ];

        if (req.files != null) {
            fileFields.forEach((fileField) => {
                const file = req.files[fileField.field];
                if (file) {
                    fileField.imageName = Date.now() + file.name;
                    fileField.storePath = "/purchase_order/" + fileField.imageName;
                    const uploadPath = process.cwd() + "/public/purchase_order/" + fileField.imageName;
                    file.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                }
            });
        }

        const updateQuery =
            "UPDATE purchase_orders SET po_date = ?, ro_office = ?, state = ?, po_number = ?, po_limit = ?, security_deposit_date = ?, security_deposit_amount = ?, tender_date = ?, tender_number = ?, bank = ?, dd_bg_number = ?, cr_date = ?, cr_number = ?, cr_code = ?, po_work = ?, cr_copy = ?, sd_letter = ?, created_by = ?, gst_id= ?, gst_percent= ?, total_gst= ?, po_for = ?, actual_po_amount= ?, from_company = ?, to_company = ?, sd_letter_title = ?, cr_copy_title = ?  WHERE id  = ?";

        const formattedPoDate = moment(po_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        // const formatted_security_deposit_date = moment(security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_security_deposit_date = security_deposit_date && security_deposit_date.trim() !== "" 
            ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"], true).isValid()
                ? moment(security_deposit_date, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]).format("YYYY-MM-DD")
                : null
            : null;
        const formatted_tender_date = moment(tender_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_cr_date = moment(cr_date, "YYYY-MM-DD", true).isValid()
            ? moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD")
            : null;

        const created_by = req.user.user_id;
        security_deposit_amount = security_deposit_amount != "" ? security_deposit_amount : 0 ;
        let total_gst;
        // Ensure amount is a valid number and format it to two decimal places
        const actual_po_amount = (amount && !isNaN(amount)) ? parseFloat(amount).toFixed(2) : "0.00"; 

        const updateValues = [
            formattedPoDate,
            ro_office,
            state,
            po_number,
            limit,
            formatted_security_deposit_date,
            security_deposit_amount,
            formatted_tender_date,
            tender_number,
            bank,
            dd_bg_number,
            formatted_cr_date,
            cr_number,
            cr_code,
            work,
            fileFields[0].storePath,
            fileFields[1].storePath,
            created_by,
            gst_id,
            gst_percent,
            tax,
            po_for,
            actual_po_amount,
            from_company,
            to_company,
            sd_letter_title,
            cr_copy_title,
            id,
        ];
        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            await db.query(`DELETE FROM purchase_order_item WHERE purchase_order_id='${id}'`);
            const po_items = JSON.parse(req.body.po_items);
            if (po_items.length > 0) {
                for (let index = 0; index < po_items.length; index++) {
                    const element = po_items[index];
                    // let description = element.description ? `'${element.description.replace(/'/g, "''")}'` : null;
                    let description = element.description ? `'${await cleanDescription(element.description)}'` : null;

                    let name = element.name ? `'${await cleanDescription(element.name)}'` : null;
                    var gstIdValue =
                        element.gst_id && element.gst_id.value
                            ? `'${element.gst_id.value}'`
                            : req.body.gst_id
                              ? `'${req.body.gst_id}'`
                              : "NULL";
                    // var gstPercentValue = element.gst_percent ? `'${element.gst_percent}'` : 'NULL';
                    var gstPercentValue = element.gst_percent
                        ? `'${element.gst_percent}'`
                        : req.body.gst_percent
                          ? `'${req.body.gst_percent}'`
                          : "NULL";

                    var changeGstTypeValue = element.change_gst_type ? `'${element.change_gst_type}'` : "0";
                    if (po_for == "1") {
                        var PO_itemQuery = ` INSERT INTO purchase_order_item( purchase_order_id, po_for, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, gst_id, gst_percent, change_gst_type, description ) VALUES ( '${id}', '${po_for}', '${element.order_line_number}', ${name}, '${element.unit}', '${element.hsn_code}', 'NA', '${element.rate}', '${element.qty}', '${element.amount}', ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description}) `;
                    } else {
                        var PO_itemQuery = `INSERT INTO purchase_order_item(purchase_order_id, po_for,order_line_number, name, unit, hsn_code, ru_code, rate, gst_id, gst_percent, change_gst_type, description ) VALUES ('${id}', '${po_for}', '${element.order_line_number}', ${name},'${element.unit}','${element.hsn_code}', 'NA', '${element.rate}', ${gstIdValue}, ${gstPercentValue}, ${changeGstTypeValue}, ${description} )`;
                    }
                    await db.query(PO_itemQuery);
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Purchase order updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "!Error, purchase order not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deletePurchaseOrder = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        const deleteQuery = "DELETE FROM purchase_orders WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // delete purchase order item as well
            const deletePoItems = await db.query(`DELETE FROM purchase_order_item WHERE purchase_order_id = ?`, [id]);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "purchase order deleted successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! purchase order not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const checkPONumberIsAlreadyExists = async (req, res, next) => {
    try {
        const search_value = req.query.search_value;

        const selectQuery = await db.query(
            `SELECT po_number FROM purchase_orders WHERE po_number LIKE '%${search_value}%'`
        );

        if (selectQuery.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "PO number exists",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "PO number not exists",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getPoListOnRoId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT id, po_number, po_amount FROM purchase_orders WHERE ro_office = ?";
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
            return res.status(StatusCodes.BAD_REQUEST).json({
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

const changePoStatus = async (req, res, next) => {
    try {
        const { po_id, status } = req.body;

        const poStatusValidation = Joi.object({
            po_id: Joi.number().required(),
            status: Joi.number().required(),
        });

        const { error } = poStatusValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`UPDATE purchase_orders SET po_status = ? WHERE id = ?`, [status, po_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            let poStatus;
            if (status == "1") {
                poStatus = "open"; // working
            } else {
                poStatus = "closed"; // done
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "PO status changes to " + poStatus + " successfully",
            });
        } else {
            throw new Error("purchase order does not exists");
        }
    } catch (error) {
        return next(error);
    }
};

const getPurchaseOrderItemsOnPo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(
            `SELECT purchase_orders.id as po_id, purchase_orders.po_number, purchase_orders.po_amount, purchase_orders.po_limit, purchase_orders.po_date, purchase_orders.po_for FROM purchase_orders WHERE purchase_orders.id = ?`,
            [id]
        );
        

        if (queryResult.length > process.env.VALUE_ZERO) {
            const finalData = [];
            for (const row of queryResult) {
                const getPurchaseOrderItems = await purchaseOrderItemsOnPoIds(row.po_id);
                for (const getPurchaseOrderItem of getPurchaseOrderItems) {
                    getPurchaseOrderItem.item_name = `${getPurchaseOrderItem.hsn_code} - ${getPurchaseOrderItem.name}`;
                    getPurchaseOrderItem.item_rate = Number(getPurchaseOrderItem.item_rate);
                }

                finalData.push({
                    po_id: row.po_id,
                    po_number: row.po_number,
                    po_used_amount: row.po_amount,
                    po_limit: row.po_limit,
                    po_for: row.po_for,
                    po_date: moment(row.po_date).format("YYYY-MM-DD"),
                    po_items: getPurchaseOrderItems,
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

async function purchaseOrderItemsOnPoIds(po_id) {
    try {
        const id = po_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            throw new Error(error.message);
        }

        const queryResult = await db.query(
            `SELECT purchase_order_item.id as po_item_id, purchase_order_item.po_for, purchase_order_item.order_line_number, purchase_order_item.hsn_code, purchase_order_item.name, purchase_order_item.rate, purchase_order_item.qty, purchase_order_item.unit, purchase_orders.po_for FROM purchase_order_item LEFT JOIN purchase_orders ON purchase_orders.id = purchase_order_item.purchase_order_id WHERE purchase_order_item.purchase_order_id = ?`,
            [id]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {

                const remainingQuantity = await getUsedQty(row.po_for, id);
                const remainingQtyForOrderLine = remainingQuantity.data.find(
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

const downloadCsvFile = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (id) {
            const selectQuery = await db.query(
                `SELECT id, order_line_number, name, unit, hsn_code, ru_code, rate, qty, amount, sub_total, created_at FROM purchase_order_item WHERE purchase_order_id = '${id}'`
            );

            const csvWriter = createObjectCsvWriter({
                path: "po_items.csv",
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
                "Content-Disposition": 'attachment; filename="po_items.csv"',
            });

            // Send response
            res.download("po_items.csv", "po_items.csv", (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    fs.unlinkSync("po_items.csv"); // Delete file after sending it
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

async function checkPurchaseOrderAmount(id, limit) {
    try {
        const selectQuery = await db.query(`SELECT * FROM purchase_orders WHERE id = '${id}'`);

        if (selectQuery.length > 0) {
            const poAmount = parseFloat(selectQuery[0].po_amount);
            const limitAmount = parseFloat(limit);

            if (limitAmount >= poAmount) {
                return { result: true, poAmount: poAmount };
            } else {
                return { result: false, poAmount: poAmount };
            }
        } else {
            return { result: false };
        }
    } catch (error) {
        return false;
    }
}

async function getUsedQty(po_for, po_id) {
    try {
        const check = await db.query(
            `SELECT poi.purchase_order_id, poi.order_line_number,  poi.qty AS total_quantity, IFNULL(used.used_qty, 0) AS used_quantity, poi.qty - IFNULL(used.used_qty, 0) AS remaining_quantity FROM purchase_order_item poi LEFT JOIN (SELECT po_id, order_line_number, SUM(used_qty) AS used_qty FROM used_po_details GROUP BY po_id, order_line_number) AS used ON poi.purchase_order_id = used.po_id AND poi.order_line_number = used.order_line_number WHERE poi.po_for = '${po_for}' AND poi.purchase_order_id = '${po_id}'`
        );
        return {
            status: true,
            data: check,
        };
    } catch (error) {
        throw error;
    }
}

// const approveAndUpdatePurchaseOrder = async (req,res,next) => {
//     try {
//         const schema = Joi.object({
//             po_id: Joi.number().required(),
//             payment_reference_number: Joi.string().required(),
//             date: Joi.date().required(),
//             amount: Joi.number().required(),
//         });
//         const { error, value } = schema.validate(req.body);
//         if (error) {
//             return res
//                 .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                 .json({ status: false, message: error.message });
//         }
//         const { po_id, payment_reference_number, date, amount } = req.body;
//         const data = {
//             payment_reference_number,
//             date,
//             amount: amount,
//             status: 2,
//         };
//         const updateQuery = `UPDATE purchase_orders SET ? WHERE id = ?`;
//         const queryResult = await db.query(updateQuery, [data, po_id]);
//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "PO approved successfully.",
//             });
//         }
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "Something went wrong in approving PO, please try again later.",
//         });
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const approveAndUpdatePurchaseOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            po_ids: Joi.array().required(),
            payment_reference_number: Joi.string().required(),
            date: Joi.date().required(),
            amount: Joi.number().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
        const { po_ids, payment_reference_number, date, amount } = req.body;
        const data = {
            payment_reference_number,
            date,
            amount: amount,
            status: 3,
        };
        for (const id of po_ids) {
            const updateQuery = `UPDATE purchase_orders SET ? WHERE id = ? AND po_date < ?`;
            const queryResult = await db.query(updateQuery, [data, id, date]);

            if (queryResult.affectedRows <= process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Cannot update payment for security_unique_id: ${id}, please check your values.`,
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

// const getRoForPurchaseOrder = async (req,res,next) => {
//     try {
//         const selectQuery = `SELECT DISTINCT ro_office FROM purchase_orders WHERE po_status = 2 AND status = 1`;
//         const queryResult = await db.query(selectQuery);
//         const result = [];
//         for (let ro of queryResult) {
//             const [ro_detail] = await getRegionalNameById(ro.ro_office);
//             result.push(ro_detail);
//         }
//         res
//             .status(StatusCodes.OK)
//             .json({ status: true, message: "Fetched successfully", data: result });
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const getRoForPurchaseOrder = async (req, res, next) => {
    const status = req.query.status || 1;
    try {
        const selectQuery = `SELECT DISTINCT ro_office, from_company FROM purchase_orders WHERE po_status = '2' AND status = ${status}`;
        const queryResult = await db.query(selectQuery);
        const result = [];
        for (let ro of queryResult) {
            const [ro_detail] = await getRegionalNameById(`${ro.ro_office}`, ro.from_company);
            result.push(ro_detail);
        }
        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result });
    } catch (error) {
        return next(error);
    }
};

// const getPoNumberForPurchaseOrder = async (req,res,next) => {
//     try {
//         const selectQuery = `SELECT id, po_number FROM purchase_orders WHERE po_status = 2 AND status = 1`;
//         const queryResult = await db.query(selectQuery);
//         res.status(StatusCodes.OK).json({ status: true, data: queryResult });
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const getPoNumberForPurchaseOrder = async (req, res, next) => {
    const status = req.query.status || 1;
    const ro = req.query.ro;
    try {
        const selectQuery = `SELECT id, po_number FROM purchase_orders WHERE po_status = 2 AND ro_office = '${ro}' AND status = ${status}`;
        const queryResult = await db.query(selectQuery);
        res.status(StatusCodes.OK).json({ status: true, data: queryResult });
    } catch (error) {
        return next(error);
    }
};

const getSecurityUniqueId = async (req, res, next) => {
    try {
        const status = req.query.status || 3;
        const po = req.query.po;
        let search = "";
        if (po) {
            search = ` AND po_number = '${po}'`;
        }
        const selectQuery = `SELECT DISTINCT security_unique_id FROM purchase_orders WHERE po_status = 2 ${search} AND status = ${status}`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, data: queryResult });
        }
        res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
    } catch (error) {
        return next(error);
    }
};

const approvePurchaseOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            po_ids: Joi.array().items(Joi.number().integer().required()).required(),
        }).required();
        const { error } = schema.validate(req.body);

        if (error) return res.status(400).json({ status: false, message: error.message });
        const security_unique_id = await generateSecurityDepositUniqueId();
        const data = {
            security_unique_id,
            status: 2,
        };

        const updateQuery = `UPDATE purchase_orders SET ? WHERE id IN (?)`;

        const queryResult = await db.query(updateQuery, [data, req.body.po_ids]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Purchase order approved successfully",
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Something went wrong in approving purchase order.",
        });
    } catch (error) {
        return next(error);
    }
};

const getFromCompanies = async (req, res, next) => {
    try {
        const clientCompanyQuery = `SELECT companies.company_id, companies.company_unique_id,companies.unique_id, companies.company_type, companies.company_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.is_superadmin_company = '0' AND companies.company_type = '1' AND companies.is_deleted = '0' AND companies.created_by = '${req.user.user_id}' ORDER BY companies.company_id`;

        const energyCompanyQuery = `SELECT id AS energy_company_id , admin_id as user_id, name AS company_name, status, unique_id FROM energy_companies WHERE status='1'`;

        const [clientCompanies, energyCompanies] = await Promise.all([
            db.query(clientCompanyQuery),
            db.query(energyCompanyQuery),
        ]);

        // Check if data is found in either query
        if (!clientCompanies.length && !energyCompanies.length) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No companies or energy companies found",
            });
        }

        const companies = [...clientCompanies, ...energyCompanies];
        res.status(StatusCodes.OK).json({ status: true, data: companies });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getFromCompanies,
    createPurchaseOrder,
    getAllGeneratedPurchaseOrder,
    getPurchaseOrderDetailsById,
    updatePurchaseOrderDetails,
    deletePurchaseOrder,
    checkPONumberIsAlreadyExists,
    getPoListOnRoId,
    getIncludePercentage,
    getAllGstType,
    changePoStatus,
    getPurchaseOrderItemsOnPo,
    downloadCsvFile,
    getUsedQty,
    getRoForPurchaseOrder,
    getPoNumberForPurchaseOrder,
    approveAndUpdatePurchaseOrder,
    getSecurityUniqueId,
    approvePurchaseOrder,
};

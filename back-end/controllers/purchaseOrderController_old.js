var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { purchaseOrderValidation, checkPositiveInteger } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getCreatedUserNameFromAdmin,
    calculateTaxAmount,
} = require("../helpers/general");

const createPurchaseOrder = async (req, res, next) => {
    try {
        const {
            po_date,
            ro_office,
            state,
            po_number,
            po_amount,
            tax_type,
            tax,
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
            po_final_amount,
            tax_amount,
        } = req.body;

        const { error } = purchaseOrderValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        var fileFields = [];
        if (req.files != null) {
            fileFields = [
                { field: "cr_copy", storePath: "", imageName: "" },
                { field: "sd_letter", storePath: "", imageName: "" },
            ];

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

        const insertQuery =
            "INSERT INTO purchase_orders (po_date, ro_office, state, po_number, po_amount, po_final_amount, tax_type, tax, tax_amount, `limit`, security_deposit_date, security_deposit_amount, tender_date, tender_number, bank, dd_bg_number, cr_date, cr_number, cr_code, `work`, cr_copy, sd_letter, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const formattedPoDate = moment(po_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_security_deposit_date = moment(security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_tender_date = moment(tender_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_cr_date = moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const created_by = req.user.user_id;

        const insertValues = [
            formattedPoDate,
            ro_office,
            state,
            po_number,
            po_amount,
            po_final_amount,
            tax_type,
            tax,
            tax_amount,
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
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
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

const getAllGeneratedPurchaseOrder = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%' OR states.name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT purchase_orders.*, regional_offices.regional_office_name, states.name as state_name FROM purchase_orders LEFT JOIN regional_offices ON regional_offices.id = purchase_orders.ro_office LEFT JOIN states ON states.id = purchase_orders.state  ${search_value} ORDER BY purchase_orders.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);

                finalData.push({
                    id: row.id,
                    po_date: moment(row.po_date).format("DD-MM-YYYY"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    po_number: row.po_number,
                    po_amount: row.po_amount,
                    tax_type: row.tax_type,
                    tax_amount: row.tax,
                    limit: row.limit,
                    security_deposit_date: moment(row.security_deposit_date).format("DD-MM-YYYY"),
                    security_deposit_amount: row.security_deposit_amount,
                    tender_date: moment(row.tender_date).format("DD-MM-YYYY"),
                    tender_number: row.tender_number,
                    bank: row.bank,
                    dd_bg_number: row.dd_bg_number,
                    cr_date: moment(row.cr_date).format("DD-MM-YYYY"),
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.work,
                    cr_copy: row.cr_copy,
                    sd_letter: row.sd_letter,
                    created_by: createdBy[0].name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY HH:mm:ss A"),
                    regional_office_name: row.regional_office_name,
                    state_name: row.state_name,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: finalData, pageDetails: pageDetails });
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

const getPurchaseOrderDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error)
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });

        const selectQuery = `SELECT purchase_orders.*, regional_offices.regional_office_name, states.name as state_name FROM purchase_orders LEFT JOIN regional_offices ON regional_offices.id = purchase_orders.ro_office LEFT JOIN states ON states.id = purchase_orders.state WHERE purchase_orders.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);

                finalData.push({
                    id: row.id,
                    po_date: moment(row.po_date).format("YYYY-MM-DD"),
                    ro_office_id: row.ro_office,
                    state: row.state,
                    po_number: row.po_number,
                    po_amount: row.po_amount,
                    tax_type: row.tax_type,
                    tax_amount: row.tax,
                    limit: row.limit,
                    security_deposit_date: moment(row.security_deposit_date).format("YYYY-MM-DD"),
                    security_deposit_amount: row.security_deposit_amount,
                    tender_date: moment(row.tender_date).format("YYYY-MM-DD"),
                    tender_number: row.tender_number,
                    bank: row.bank,
                    dd_bg_number: row.dd_bg_number,
                    cr_date: moment(row.cr_date).format("YYYY-MM-DD"),
                    cr_number: row.cr_number,
                    cr_code: row.cr_code,
                    work: row.work,
                    cr_copy: row.cr_copy,
                    sd_letter: row.sd_letter,
                    created_by: createdBy[0].name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    regional_office_name: row.regional_office_name,
                    state_name: row.state_name,
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
        const {
            po_date,
            ro_office,
            state,
            po_number,
            po_amount,
            tax_type,
            tax,
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
        } = req.body;

        const { error } = purchaseOrderValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        var fileFields = [];
        if (req.files != null) {
            fileFields = [
                { field: "cr_copy", storePath: "", imageName: "" },
                { field: "sd_letter", storePath: "", imageName: "" },
            ];

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
        } else {
            fileFields = [
                { field: "cr_copy", storePath: cr_copy },
                { field: "sd_letter", storePath: sd_letter },
            ];
        }

        const updateQuery =
            "UPDATE purchase_orders SET po_date = ?, ro_office = ?, state = ?, po_number = ?, po_amount = ?, tax_type = ?, tax = ?, `limit` = ?, security_deposit_date = ?, security_deposit_amount = ?, tender_date = ?, tender_number = ?, bank = ?, dd_bg_number = ?, cr_date = ?, cr_number = ?, cr_code = ?, `work` = ?, cr_copy = ?, sd_letter = ?, created_by = ? WHERE id  = ?";

        const formattedPoDate = moment(po_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_security_deposit_date = moment(security_deposit_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_tender_date = moment(tender_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formatted_cr_date = moment(cr_date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const created_by = req.user.user_id;

        const updateValues = [
            formattedPoDate,
            ro_office,
            state,
            po_number,
            po_amount,
            tax_type,
            tax,
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
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
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

module.exports = {
    createPurchaseOrder,
    getAllGeneratedPurchaseOrder,
    getPurchaseOrderDetailsById,
    updatePurchaseOrderDetails,
    deletePurchaseOrder,
    checkPONumberIsAlreadyExists,
    getPoListOnRoId,
    getIncludePercentage,
};

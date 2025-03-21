require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { invoiceSchema, checkPositiveInteger } = require("../helpers/validation");
let moment = require("moment");
const Joi = require("joi");
var { calculatePagination, getCreatedByDetails } = require("../helpers/general");
const { generateRandomNumber, fetchFormatById } = require("../helpers/commonHelper");

const createClientVendorNumberFormat = async (req, res, next) => {
    try {
        const { prefix, separation_symbol, financial_year_format, start_company_number, financial_year } = req.body;

        const companyNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            financial_year_format: Joi.required(),
            start_company_number: Joi.required(),
            financial_year: Joi.required(),
            separation_symbol: Joi.required(),
        });

        const { error } = companyNumberFormatSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message.replace("_", " "),
            });
        }

        const sample_format =
            prefix + separation_symbol + financial_year_format + separation_symbol + start_company_number;
        const insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_company_number,
            financial_year,
            sample_format,
            created_by: req.user.user_id,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        const queryResult = await db.query(`INSERT INTO client_vendor_no_format SET ?`, [insertData]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company number format created successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong creating the Company number format.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGeneratedClientVendorNumberFormat = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["financial_year", "financial_year_format"];
        const searchConditions = [];
        const role_id = req.user.user_type;
        const user_id = req.user.user_id;

        const format_types = [
            { id: 1, name: "Client" },
            { id: 2, name: "Vendor" },
            { id: 3, name: "Both" }
        ];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id ASC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM client_vendor_no_format ${
            searchConditions.length > 0
                ? `WHERE ${searchConditions.join(" OR ")} AND is_deleted = 0 AND created_by = ${user_id} `
                : ` WHERE is_deleted = 0 AND created_by = ${user_id}`
        } ${orderLimitQuery}`;

        let queryResult = await db.query(query);

        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            // Ensure format_types has no duplicate entry for Supplier
            const supplierType = { id: 4, name: "Supplier" };
            if (role_id !== 1 && !format_types.some((type) => type.id === supplierType.id)) {
                format_types.push(supplierType);
            }

            queryResult = queryResult.filter((item) => {
                if (role_id == 1) {
                    // Client
                    if (item.type === format_types[0].id) {
                        item.type = format_types[0].name;
                    }
                    // Vendor
                    else if (item.type === format_types[1].id) {
                        item.type = format_types[1].name;
                    }
                    // Both
                    else if (item.type === format_types[2].id) {
                        item.type = format_types[2].name; 
                    }
                    // Remove item if type is 4
                    else if (item.type === 4) {
                        return false;       // Exclude this item
                    }
                } else {
                    // console.log('format_types: ', format_types);
                    // Client
                    if (item.type === format_types[0].id) {
                        item.type = format_types[0].name;
                    }
                    // Vendor
                    else if (item.type === format_types[1].id) {
                        item.type = format_types[1].name;
                    }
                    // Both
                    else if (item.type === format_types[2].id) {
                        item.type = format_types[2].name;
                    }
                    // Supplier
                    else if (item.type === format_types[3].id) {
                        item.type = format_types[3].name;
                    }
                }
                return true; // Retain item
            });
            
            // console.log('queryResult: ', queryResult);
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company number format fetched successfully",
                data: queryResult,
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

const getAllGeneratedClientVendorNumberFormatById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        const user_id = req.user.user_id;

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const queryResult = await db.query(`SELECT * FROM client_vendor_no_format WHERE id = ? AND created_by = ? AND is_deleted = '0'`, [
            id, 
            user_id
        ]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company number format fetched successfully",
                data: queryResult[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "No Company number format found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateClientVendorNumberFormat = async (req, res, next) => {
    try {
        const { prefix, separation_symbol, financial_year_format, start_company_number, financial_year, id } = req.body;

        const companyNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            separation_symbol: Joi.required(),
            financial_year_format: Joi.required(),
            start_company_number: Joi.required(),
            financial_year: Joi.required(),
            id: Joi.required(),
        });

        const { error } = companyNumberFormatSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const sample_format =
            prefix + separation_symbol + financial_year_format + separation_symbol + start_company_number;

        const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
        const insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_company_number,
            financial_year,
            sample_format,
            updated_at,
        };

        // check financial year is already created or not
        // const financialYearQueryResult = await db.query(`SELECT * FROM client_vendor_no_format`);
        // if (financialYearQueryResult.length > process.env.VALUE_ZERO) {
        //     const result = financialYearQueryResult.filter((item) => item.financial_year == financial_year);
        //     let checkValidFinancialYearForUpdate = false;

        //     if (result.length > process.env.VALUE_ZERO) {
        //         if (result[0].id == id) {
        //             checkValidFinancialYearForUpdate = false;
        //         } else {
        //             checkValidFinancialYearForUpdate = true;
        //         }
        //     } else {
        //         checkValidFinancialYearForUpdate = false;
        //     }

        //     if (checkValidFinancialYearForUpdate) {
        //         return res.status(StatusCodes.BAD_REQUEST).json({
        //             status: false,
        //             message: "That financial year " + financial_year + " already exists",
        //         });
        //     }
        // }

        const queryResult = await db.query(`UPDATE client_vendor_no_format SET ? WHERE id = ?`, [insertData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company number format updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong creating the Company number format.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateClientVendorNumberFormatStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;

        const clientVendorNumberFormatStatusSchema = Joi.object({
            id: Joi.required().messages({ "any.required": "Company number format id is required" }),
            status: Joi.required().messages({ "any.required": "Status is required" }),
        });

        const { error } = clientVendorNumberFormatStatusSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const existingStatus = await fetchFormatById(id, "client_vendor_no_format");
        if (existingStatus.length == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Company number format not found",
            });
        }
        if (existingStatus[0].status == "1") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "One format should be active at a time",
            });
        }

        const queryResult = await db.query(
            `UPDATE client_vendor_no_format SET status = '${status}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            await db.query(`UPDATE client_vendor_no_format SET status = "0" WHERE id != '${id}' AND status = "1"`);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Status updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteClientVendorNumberFormatById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const getFormat = await fetchFormatById(id, "client_vendor_no_format");
        if (getFormat.length > process.env.VALUE_ZERO) {
            if (getFormat[0].status == "1") {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "You cannot delete Active format",
                });
            }
        }

        // Update the is_deleted column to '1' for soft delete
        const queryResult = await db.query(`UPDATE client_vendor_no_format SET is_deleted = '1' WHERE id = ?`, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company number format deleted successfully",
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

module.exports = {
    createClientVendorNumberFormat,
    getAllGeneratedClientVendorNumberFormat,
    getAllGeneratedClientVendorNumberFormatById,
    updateClientVendorNumberFormat,
    updateClientVendorNumberFormatStatus,
    deleteClientVendorNumberFormatById,
};

require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { invoiceSchema, checkPositiveInteger } = require("../helpers/validation");
let moment = require("moment");
const Joi = require("joi");
var { calculatePagination, getCreatedByDetails } = require("../helpers/general");
const { generateRandomNumber, fetchFormatById } = require("../helpers/commonHelper");

const createEmployeeNumberFormat = async (req, res, next) => {
    try {
        const { prefix, separation_symbol, financial_year_format, start_employee_number, financial_year } = req.body;

        const employeeNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            financial_year_format: Joi.required(),
            start_employee_number: Joi.required(),
            financial_year: Joi.required(),
            separation_symbol: Joi.required(),
        });

        const { error } = employeeNumberFormatSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message.replace("_", " "),
            });
        }

        // check that financial year already exists or not
        // const financialYearQueryResult = await db.query(`SELECT * FROM employee_no_format WHERE financial_year = ?`, [
        //     financial_year,
        // ]);
        // if (financialYearQueryResult.length > process.env.VALUE_ZERO) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         status: false,
        //         message: "That financial year " + financial_year + " already exists",
        //     });
        // }

        const sample_format =
            prefix + separation_symbol + financial_year_format + separation_symbol + start_employee_number;
        const insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_employee_number,
            financial_year,
            sample_format,
            created_by: req.user.user_id,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        const queryResult = await db.query(`INSERT INTO employee_no_format SET ?`, [insertData]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Employee number format created successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong creating the employee number format.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGeneratedEmployeeNumberFormat = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["financial_year", "financial_year_format"];
        const searchConditions = [];
        const user_id = req.user.user_id;

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM employee_no_format ${
            searchConditions.length > 0
                ? `WHERE ${searchConditions.join(" OR ")} AND is_deleted = 0 AND created_by = ${user_id} `
                : ` WHERE is_deleted = 0 AND created_by = ${user_id} `
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Employee number format fetched successfully",
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

const getAllGeneratedEmployeeNumberFormatById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const queryResult = await db.query(`SELECT * FROM employee_no_format WHERE id = ? AND is_deleted = '0'`, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Employee number format fetched successfully",
                data: queryResult[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "No Employee number format found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateEmployeeNumberFormat = async (req, res, next) => {
    try {
        const { prefix, separation_symbol, financial_year_format, start_employee_number, financial_year, status, id } =
            req.body;

        const employeeNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            separation_symbol: Joi.required(),
            financial_year_format: Joi.required(),
            start_employee_number: Joi.required(),
            financial_year: Joi.required(),
            id: Joi.required(),
        });

        const { error } = employeeNumberFormatSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const sample_format =
            prefix + separation_symbol + financial_year_format + separation_symbol + start_employee_number;

        let insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_employee_number,
            financial_year,
            sample_format,
        };

        if (status) {
            insertData = {
                status,
            };
        }

        // check financial year is already created or not
        // const financialYearQueryResult = await db.query(`SELECT * FROM employee_no_format`);
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

        const queryResult = await db.query(`UPDATE employee_no_format SET ? WHERE id = ?`, [insertData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Employee number format updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong creating the Employee number format.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateEmployeeNumberFormatStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;

        const employeeNumberFormatStatusSchema = Joi.object({
            id: Joi.required().messages({ "any.required": "Employee number format id is required" }),
            status: Joi.required().messages({ "any.required": "Status is required" }),
        });

        const { error } = employeeNumberFormatStatusSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const existingStatus = await fetchFormatById(id, "employee_no_format");
        if(existingStatus.length == 0){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Employee number format not found",
            });
        }
        if(existingStatus[0].status == "1"){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "One format should be active at a time",
            });
        }

        const queryResult = await db.query(`UPDATE employee_no_format SET status = '${status}' WHERE id = '${id}'`);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            await db.query(`UPDATE employee_no_format SET status = "0" WHERE id != '${id}' AND status = "1"`);
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

const deleteEmployeeNumberFormatById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const getFormat = await fetchFormatById(id, "employee_no_format");
        if (getFormat.length > process.env.VALUE_ZERO) {
            if (getFormat[0].status == "1") {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "You cannot delete Active format",
                });
            }
        }

        // Update the is_deleted column to '1' for soft delete
        const queryResult = await db.query(`UPDATE employee_no_format SET is_deleted = '1' WHERE id = ?`, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Employee number format deleted successfully",
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
    createEmployeeNumberFormat,
    getAllGeneratedEmployeeNumberFormat,
    getAllGeneratedEmployeeNumberFormatById,
    updateEmployeeNumberFormat,
    updateEmployeeNumberFormatStatus,
    deleteEmployeeNumberFormatById,
};

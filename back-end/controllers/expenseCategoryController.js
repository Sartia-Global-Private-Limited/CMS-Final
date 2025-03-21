var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, requestCashValidation } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, generateRandomAlphanumeric } = require("../helpers/general");

const addExpenseCategory = async (req, res, next) => {
    try {
        const { category_name, status, description } = req.body;

        const expenseCategoryValidation = Joi.object({
            category_name: Joi.string().required(),
            status: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = expenseCategoryValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO expense_categories (category_name, status, description, created_by) VALUES(?, ?, ?, ?)";
        const queryResult = await db.query(insertQuery, [category_name, status, description, req.user.user_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense category added successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: true,
                message: "Error! Please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getExpenseCategory = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (category_name LIKE '%${searchData}%' OR description LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT id, category_name, description, status FROM expense_categories ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
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

const fetchExpenseCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const selectQuery = "SELECT id, category_name, description, status FROM  WHERE id = ?";
        const queryResult = await db.query(selectQuery, id);

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

const updateExpenseCategory = async (req, res, next) => {
    try {
        const { id, category_name, status, description } = req.body;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const updateQuery =
            "UPDATE expense_categories SET category_name = ?, status =?, description=?, updated_by = ? WHERE id = ?";
        const queryResult = await db.query(updateQuery, [category_name, status, description, req.user.user_id, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense category updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: true,
                message: "Error! Please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteExpenseCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM expense_categories WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense category deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! expense category not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getExpenseCategoryForDropdown = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id, category_name FROM expense_categories ORDER BY id DESC`;

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

module.exports = {
    addExpenseCategory,
    getExpenseCategory,
    deleteExpenseCategory,
    updateExpenseCategory,
    fetchExpenseCategory,
    getExpenseCategoryForDropdown,
};

var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, requestCashValidation } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, generateRandomAlphanumeric } = require("../helpers/general");

const addPaymentMethod = async (req, res, next) => {
    try {
        const { method, status } = req.body;

        const paymentMethodValidation = Joi.object({
            method: Joi.string().required(),
            status: Joi.number().required(),
        });

        const { error } = paymentMethodValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = "INSERT INTO payment_methods (method, status, created_by) VALUES(?, ?, ?)";
        const queryResult = await db.query(insertQuery, [method, status, req.user.user_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment method added successfully",
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

const getAllMethods = async (req, res, next) => {
    try {
        const selectQuery = "SELECT id, method, status FROM payment_methods";
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

const getMethodDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const selectQuery = "SELECT id, method, status FROM payment_methods WHERE id = ?";
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
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

const updatePaymentMethod = async (req, res, next) => {
    try {
        const { method, status, id } = req.body;

        const paymentMethodValidation = Joi.object({
            method: Joi.string().required(),
            status: Joi.number().required(),
            id: Joi.number().required(),
        });

        const { error } = paymentMethodValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = "UPDATE payment_methods SET method = ?, status = ?, updated_by = ? WHERE id = ?";
        const queryResult = await db.query(insertQuery, [method, status, req.user.user_id, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment method updated successfully",
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

const deleteMethod = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM payment_methods WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment Method deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! payment method not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllMethodsForDropdown = async (req, res, next) => {
    try {
        const selectQuery = "SELECT id, method FROM payment_methods";
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
    addPaymentMethod,
    getAllMethods,
    deleteMethod,
    getMethodDetailById,
    updatePaymentMethod,
    getAllMethodsForDropdown,
};

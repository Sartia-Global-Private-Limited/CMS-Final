require("dotenv").config();
const bcrypt = require("bcrypt");
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, breakValidations } = require("../helpers/validation");
const { roleById } = require("../helpers/general");
const HTTP_STATUS_CODES = {
    OK: 200,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
};

const createBreaks = async (req, res, next) => {
    try {
        const { break_name, break_number, status } = req.body;
        const { error } = breakValidations.validate(req.body);
        if (error) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: error.message });

        const createdBy = req.user.userId;
        const insertQuery = `INSERT INTO breaks(break_name, break_number, status, created_by) VALUES(?,?,?,?)`;
        const queryResult = await db.query(insertQuery, [break_name, break_number, status, createdBy]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(HTTP_STATUS_CODES.OK).json({ status: true, message: "Breaks created successfully" });
        } else {
            return res
                .status(HTTP_STATUS_CODES.FORBIDDEN)
                .json({ status: true, message: "Something went wrong, please try again" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllBreaks = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM breaks`;
        const queryResult = await promisify(db.query)(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(HTTP_STATUS_CODES.OK).json({
                status: false,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            return res
                .status(HTTP_STATUS_CODES.FORBIDDEN)
                .json({ status: false, message: "Data not found", data: queryResult });
        }
    } catch (error) {
        return next(error);
    }
};

const getBreakOnId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM breaks WHERE id =?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(HTTP_STATUS_CODES.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
            });
        } else {
            return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateBreaks = async (req, res, next) => {
    try {
        const { break_name, break_number, status, id } = req.body;
        const { error } = breakValidations.validate(req.body);
        if (error) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: error.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE breaks SET break_name = ?, break_number = ?, status = ?, updated_at = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [break_name, break_number, status, updatedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(HTTP_STATUS_CODES.OK).json({ status: true, message: "Breaks updated successfully" });
        } else {
            return res
                .status(HTTP_STATUS_CODES.FORBIDDEN)
                .json({ status: true, message: "Something went wrong, please try again" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteBreak = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM breaks WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(HTTP_STATUS_CODES.OK).json({ status: true, message: "Break deleted successfully" });
        } else {
            return res
                .status(HTTP_STATUS_CODES.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { createBreaks, getAllBreaks, getBreakOnId, updateBreaks, deleteBreak };

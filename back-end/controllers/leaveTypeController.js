require("dotenv").config();
const bcrypt = require("bcrypt");
let moment = require("moment");
let jwt = require("jsonwebtoken");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { roleById } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");

const createLeaveType = async (req, res, next) => {
    try {
        const { leave_type, description, status } = req.body;
        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const insertQuery = `
        INSERT INTO leave_types (leave_type, description, status, created_by, created_at) VALUES(?, ?, ?, ?, ?)`;
        
        const queryResult = await db.query(insertQuery, [leave_type, description, status, createdBy, createdAt]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Leave type created successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllLeaveType = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const hasDropdown = req.query.isDropdown || false;

        const countSelectQuery = `SELECT COUNT(id) as total FROM leave_types`;
        const constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_cond = "";
        if (searchData != "") {
            search_cond = ` Where leave_type like '%${searchData}%'`;
        }

        let selectQuery = `SELECT * FROM leave_types ${search_cond} ORDER by id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        if(hasDropdown) {
            selectQuery = `SELECT * FROM leave_types WHERE status = '1' ORDER by id DESC`;
        }
        const queryResult = await promisify(db.query)(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            let pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails[0],
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllActiveLeaveType = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM leave_types WHERE status = ? ORDER by id DESC`;
        const queryResult = await db.query(selectQuery, [process.env.ACTIVE_STATUS]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllLeaveTypeById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM leave_types WHERE id = ? ORDER by id DESC`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateLeaveType = async (req, res, next) => {
    try {
        const { leave_type, description, status, id } = req.body;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE leave_types SET leave_type = ?, description= ?, status = ?, updated_at = ? WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [leave_type, description, status, updatedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Leave type updated successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong,   please try again" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteLeaveType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM leave_types WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Leave Type deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createLeaveType,
    getAllLeaveType,
    getAllActiveLeaveType,
    getAllLeaveTypeById,
    updateLeaveType,
    deleteLeaveType,
};

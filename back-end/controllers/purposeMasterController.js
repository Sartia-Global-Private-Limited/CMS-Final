var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");

const createPurposeMaster = async (req, res, next) => {
    try {
        const { name, status } = req.body;
        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO purpose_masters(name, status, created_by) VALUES('${name}', '${status}', '${createdBy}')`;

        db.query(insertQuery, (err, result) => {
            if (err) return res.status(403).json({ status: true, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Purpose master created successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

const getAllPurposeMaster = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM purpose_masters`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_condition = "";
        if (searchData != null && searchData != "") {
            search_condition = `WHERE name LIKE '%${searchData}%'`;
        }
        var selectQuery = `SELECT * FROM purpose_masters ${search_condition} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                return res
                    .status(200)
                    .json({ status: true, message: "Fetched successfully", data: result, pageDetails: pageDetails[0] });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

const getSinglePurposeMasterById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM purpose_masters WHERE id = ${id}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

const updatePurposeMaster = async (req, res, next) => {
    try {
        const { name, status, id } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE purpose_masters SET name = '${name}', status = '${status}', updated_at='${updatedAt}' WHERE id = ${id}`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Purpose master updated successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

const deletePurposeMasterById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM purpose_masters WHERE id = ${id}`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Purpose master deleted successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

module.exports = {
    createPurposeMaster,
    getAllPurposeMaster,
    getSinglePurposeMasterById,
    updatePurposeMaster,
    deletePurposeMasterById,
};

var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, createTaskValidation } = require("../helpers/validation");

const createTaskCategory = async (req, res, next) => {
    try {
        const { name, status } = req.body;
        const { error } = createTaskValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO task_categories(name, status, created_by) VALUES('${name}', '${status}', '${createdBy}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "task category created successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllTaskCategory = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        let isDropdown = req.query.isDropdown || false;

        const countSelectQuery = `SELECT COUNT(*) as total FROM task_categories`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let selectQuery;

        if (!isDropdown) {
            if (searchData != null && searchData != "") {
                selectQuery = `SELECT * FROM task_categories WHERE name LIKE '%${searchData}%'  ORDER By id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
            } else {
                selectQuery = `SELECT * FROM task_categories ORDER By id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
            }
        } else {
            selectQuery = `SELECT * FROM task_categories WHERE status = '1'`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                let pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                if (!isDropdown) {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: result,
                        pageDetails: pageDetails[0],
                    });
                } else {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: result });
                }

                // res.status(200).json({
                //     status: true,
                //     message: "Fetched successfully",
                //     data: result,
                //     pageDetails: pageDetails[0],
                // });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSingleTaskCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(200).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM task_categories WHERE id='${id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateTaskCategoryDetails = async (req, res, next) => {
    try {
        const { name, status, id } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE task_categories SET name='${name}', status='${status}', updated_at='${updatedAt}' WHERE id='${id}'`;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "task category updated successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const removeTaskCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM task_categories WHERE id='${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Task category deleted successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createTaskCategory,
    getAllTaskCategory,
    getSingleTaskCategory,
    updateTaskCategoryDetails,
    removeTaskCategoryById,
};

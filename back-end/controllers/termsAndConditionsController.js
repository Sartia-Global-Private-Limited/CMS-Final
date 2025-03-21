require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, termsAndConditionsValidation } = require("../helpers/validation");
const { roleById } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const { calculatePagination } = require("../helpers/general");
const createTermsAndConditions = async (req, res, next) => {
    try {
        const { title, content, status } = req.body;
        const { error } = termsAndConditionsValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO term_conditions(title, content, status, created_by) VALUES(?, ?, ?, ?)`;
        const createdBy = req.user.user_id;
        const insertValues = [title, content, status, createdBy];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Terms and conditions created successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! Terms and conditions not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCreateTermsAndConditions = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var searchCond = ``;
        if (searchData != "") {
            searchCond = ` WHERE title LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT * FROM term_conditions ${searchCond} ORDER BY id desc LIMIT ${pageFirstResult}, ${pageSize}`;
        const queryResult = await promisify(db.query)(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getCreateTermsAndConditionsDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM term_conditions WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateTermsConditionsDetails = async (req, res, next) => {
    try {
        const { title, content, status, id } = req.body;
        const { error } = termsAndConditionsValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE term_conditions SET title = ?, content = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?`;

        const updatedBy = req.user.user_id;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateValues = [title, content, status, updatedBy, updatedAt, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Terms and conditions updated successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! Terms and conditions not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteTermsAndConditions = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM term_conditions WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Terms and conditions deleted successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! Terms and conditions not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createTermsAndConditions,
    getAllCreateTermsAndConditions,
    getCreateTermsAndConditionsDetailsById,
    updateTermsConditionsDetails,
    deleteTermsAndConditions,
};

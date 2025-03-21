require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const registerInsuranceCompany = async (req, res, next) => {
    try {
        const { company_name, company_code, status } = req.body;

        const validation = Joi.object({
            company_name: Joi.string().required(),
            company_code: Joi.string().required(),
        });

        const { error } = validation.validate({ company_name: company_name, company_code: company_code });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO insurance_companies(company_name, company_code, status, created_by) VALUES (?, ?, ?, ?)`;
        const createdBy = req.user.user_id;
        const queryResult = await db.query(insertQuery, [company_name, company_code, status, createdBy]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Insurance company created successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! insurance company not created" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllInsuranceCompanyList = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM insurance_companies WHERE is_deleted = ?`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";
        var queryParams = [process.env.NOT_DELETED, pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition = "company_name LIKE ? AND ";
            queryParams.unshift(`%${searchData}%`);
        }

        const selectQuery = `SELECT * FROM insurance_companies WHERE ${searchDataCondition}  is_deleted = ? ORDER BY id DESC LIMIT ?, ?`;

        const queryResult = await db.query(selectQuery, queryParams);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });

            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getSingleInsuranceCompanyDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM insurance_companies WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateInsuranceCompanyDetails = async (req, res, next) => {
    try {
        const { company_name, company_code, status, id } = req.body;

        const validation = Joi.object({
            company_name: Joi.string().required(),
            company_code: Joi.string().required(),
            id: Joi.number().integer().positive().required(),
        });

        const { error } = validation.validate({ company_name: company_name, company_code: company_code, id: id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE insurance_companies SET company_name = ?, company_code = ?, status = ?  WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [company_name, company_code, status, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Insurance company details updated successfully",
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! insurance company details not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteInsuranceCompanyById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const softDeleteQuery = `UPDATE insurance_companies SET is_deleted = ? WHERE id = ?`;
        const queryResult = await db.query(softDeleteQuery, [process.env.DELETED, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Insurance company deleted successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! insurance company not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

const getInsuranceCompanyPlans = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM insurance_companies WHERE  is_deleted = ?`;
        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    registerInsuranceCompany,
    getAllInsuranceCompanyList,
    getSingleInsuranceCompanyDetails,
    updateInsuranceCompanyDetails,
    deleteInsuranceCompanyById,
};

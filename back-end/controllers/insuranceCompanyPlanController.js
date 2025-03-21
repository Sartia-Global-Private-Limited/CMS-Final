require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, insurancePlansValidations } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const registerInsuranceCompanyPlan = async (req, res, next) => {
    try {
        const {
            insurance_company_id,
            policy_name,
            policy_plan_number,
            policy_code,
            policy_type,
            policy_start_date,
            policy_end_date,
            policy_premium_amount,
            policy_coverage_limits,
            policy_covered_risks,
            policy_deductible_amount,
            policy_renewal_date,
            policy_endorsements,
            policy_tenure,
        } = req.body;

        const { error } = insurancePlansValidations.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO insurance_company_plans(insurance_company_id, policy_name, policy_plan_number, policy_code, policy_type, policy_tenure, policy_start_date, policy_end_date, policy_premium_amount, policy_coverage_limits, policy_covered_risks, policy_deductible_amount, policy_renewal_date, policy_endorsements, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const createdBy = req.user.user_id;

        const insertValues = [
            insurance_company_id,
            policy_name,
            policy_plan_number,
            policy_code,
            policy_type,
            policy_tenure,
            policy_start_date,
            policy_end_date,
            policy_premium_amount,
            policy_coverage_limits,
            policy_covered_risks,
            policy_deductible_amount,
            policy_renewal_date,
            policy_endorsements,
            createdBy,
        ];

        const queryResult = await db.query(insertQuery, insertValues);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Plan Created successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! plan not created" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllInsurancePlans = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM insurance_company_plans WHERE is_deleted = ?`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";
        var queryParams = [process.env.NOT_DELETED, pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition = "insurance_company_plans.policy_name LIKE ? AND ";
            queryParams.unshift(`%${searchData}%`);
        }
        const selectQuery = `SELECT insurance_company_plans.*, insurance_companies.company_name FROM insurance_company_plans INNER JOIN insurance_companies ON insurance_companies.id=insurance_company_plans.insurance_company_id WHERE ${searchDataCondition}  insurance_company_plans.is_deleted = ? ORDER BY insurance_company_plans.plan_id DESC LIMIT ?, ? `;

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
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getInsurancePlanById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT insurance_company_plans.*, insurance_companies.company_name FROM insurance_company_plans INNER JOIN insurance_companies ON insurance_companies.id=insurance_company_plans.insurance_company_id WHERE insurance_company_plans.plan_id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.ERROR).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateInsurancePlanDetails = async (req, res, next) => {
    try {
        const {
            insurance_company_id,
            policy_name,
            policy_plan_number,
            policy_code,
            policy_type,
            policy_start_date,
            policy_end_date,
            policy_premium_amount,
            policy_coverage_limits,
            policy_covered_risks,
            policy_deductible_amount,
            policy_renewal_date,
            policy_endorsements,
            policy_tenure,
            id,
        } = req.body;

        const { error } = insurancePlansValidations.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const { error: idError } = checkPositiveInteger.validate({ id });
        if (idError) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: idError.message });

        const updateQuery = `UPDATE insurance_company_plans SET insurance_company_id = ?, policy_name = ?, policy_plan_number = ?, policy_code = ?, policy_type = ?, policy_tenure = ?, policy_start_date = ?, policy_end_date = ?, policy_premium_amount = ?, policy_coverage_limits = ?, policy_covered_risks = ?, policy_deductible_amount = ?, policy_renewal_date = ?, policy_endorsements = ?, updated_at = ? WHERE plan_id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateValues = [
            insurance_company_id,
            policy_name,
            policy_plan_number,
            policy_code,
            policy_type,
            policy_tenure,
            policy_start_date,
            policy_end_date,
            policy_premium_amount,
            policy_coverage_limits,
            policy_covered_risks,
            policy_deductible_amount,
            policy_renewal_date,
            policy_endorsements,
            updatedAt,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Plan updated successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! plan not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteInsurancePlanById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const softDeleteQuery = `UPDATE insurance_company_plans SET is_deleted = ? WHERE plan_id = ?`;
        const queryResult = await db.query(softDeleteQuery, [process.env.DELETED, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Insurance plan deleted successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! insurance plan not deleted successfully",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getInsuranceCompanyWithPlansById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT plan_id, insurance_company_id, policy_name FROM insurance_company_plans WHERE  is_deleted = ? AND insurance_company_id = ?`;
        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED, id]);

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
    registerInsuranceCompanyPlan,
    getAllInsurancePlans,
    getInsurancePlanById,
    updateInsurancePlanDetails,
    deleteInsurancePlanById,
    getInsuranceCompanyWithPlansById,
};

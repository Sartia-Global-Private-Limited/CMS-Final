require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const getAllActivityLog = async (req, res, next) => {
    try {
        let response = "";
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let searchDataCondition = "";
        const role_id = req.user.role_id;

        let queryParams = [pageFirstResult, pageSize];

        if(role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            if (searchData != null && searchData != "") {
                searchDataCondition = `WHERE admins.name LIKE '%${searchData}%' OR DATE_FORMAT(user_activity_logs.created_at, "%d-%m-%Y")  LIKE '%${searchData}%' OR user_activity_logs.action LIKE '%${searchData}%'`;
            }
        } else {
            if (searchData != null && searchData != "") {
                searchDataCondition = `WHERE users.name LIKE '%${searchData}%' OR DATE_FORMAT(user_activity_logs.created_at, "%d-%m-%Y")  LIKE '%${searchData}%' OR user_activity_logs.action LIKE '%${searchData}%'`;
            }
        }

        let selectQuery;
        if(role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            selectQuery = `SELECT user_activity_logs.*, admins.name as user_name, admins.employee_id, admins.image, roles.name as role FROM user_activity_logs INNER JOIN admins ON admins.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id ${searchDataCondition} ORDER BY user_activity_logs.id DESC LIMIT ?, ?`;
        } else {
            selectQuery = `SELECT user_activity_logs.*, users.name as user_name, users.employee_id, users.image, roles.name as role FROM user_activity_logs INNER JOIN users ON users.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id ${searchDataCondition} ORDER BY user_activity_logs.id DESC LIMIT ?, ?`;
        }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "user_activity_logs",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });
        const queryResult = await db.query(selectQuery, queryParams);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            res.status(200).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        } else {
            res.status(200).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getActivityLogDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role_id = req.user.user_type;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.OK).json({ Status: false, message: error.message });

        let selectQuery;
        if(role_id == process.env.SUPER_ADMIN_ROLE_ID) { 
            selectQuery = `SELECT user_activity_logs.*, admins.name as user_name, admins.image, roles.name as role FROM user_activity_logs INNER JOIN admins ON admins.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id WHERE user_activity_logs.id = ?`;
        } else {
            selectQuery = `SELECT user_activity_logs.*, users.name as user_name, users.image, roles.name as role FROM user_activity_logs INNER JOIN users ON users.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id WHERE user_activity_logs.id = ?`;
        }

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(403).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllActivityLog, getActivityLogDetails };

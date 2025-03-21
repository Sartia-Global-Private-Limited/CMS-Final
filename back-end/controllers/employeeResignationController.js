require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, resignationStatusValidation } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { Console } = require("console");
const { getAdminAndUserDetail, calculatePagination, getAdminDetails } = require("../helpers/general");

const registerResignation = async (req, res, next) => {
    try {
        const { user_id, resignation_date, last_working_day, reason } = req.body;

        const formValidation = Joi.object({
            user_id: Joi.required(),
            resignation_date: Joi.date().required(),
            last_working_day: Joi.date().required(),
            reason: Joi.string().required(),
        });

        const { error } = formValidation.validate({
            user_id: user_id,
            resignation_date: resignation_date,
            last_working_day: last_working_day,
            reason: reason,
        });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO employee_resignations(user_id, resignation_date, last_working_day, reason, created_by) VALUES(?, ?, ?, ?, ?)`;

        const createdBy = req.user.user_id;

        const queryResult = await db.query(insertQuery, [
            user_id,
            resignation_date,
            last_working_day,
            reason,
            createdBy,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation submitted successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Resignation not submitted" });
        }
    } catch (error) {
        return next(error);
    }
};

const getPendingResignationRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if(role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }

        let selectQuery;
        if(role_id == 1){
            selectQuery = `
            SELECT employee_resignations.*, admins.name as user_name, admins.image, admins.employee_id 
            FROM employee_resignations 
            LEFT JOIN admins ON admins.id = employee_resignations.user_id 
            WHERE resignation_status = '${[process.env.PENDING]}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
            SELECT employee_resignations.*, users.name as user_name, users.image, users.employee_id 
            FROM employee_resignations 
            LEFT JOIN users ON users.id = employee_resignations.user_id 
            WHERE resignation_status = '${[process.env.PENDING]}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getApprovedResignationRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if(role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }
        
        let selectQuery;
        if(role_id == 1){
            selectQuery = `
            SELECT employee_resignations.*, admins.name as user_name, admins.image, admins.employee_id 
            FROM employee_resignations 
            LEFT JOIN admins ON admins.id = employee_resignations.user_id 
            WHERE resignation_status = '${[process.env.APPROVED]}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
            SELECT employee_resignations.*, users.name as user_name, users.image, users.employee_id 
            FROM employee_resignations 
            LEFT JOIN users ON users.id = employee_resignations.user_id 
            WHERE resignation_status = '${[process.env.APPROVED]}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getRejectedResignationRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if(role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }

        let selectQuery;
        if(role_id == 1){
            selectQuery = `
            SELECT employee_resignations.*, admins.name as user_name, admins.image, admins.employee_id 
            FROM employee_resignations 
            LEFT JOIN admins ON admins.id = employee_resignations.user_id 
            WHERE resignation_status = '${process.env.REJECTED}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
            SELECT employee_resignations.*, users.name as user_name, users.image, users.employee_id 
            FROM employee_resignations 
            LEFT JOIN users ON users.id = employee_resignations.user_id 
            WHERE resignation_status = '${process.env.REJECTED}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getResignationDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role_id = req.user.user_type || 0;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM employee_resignations WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found" });
        }

        let result = queryResult[0];
        result.resignation_date = moment(result.resignation_date).format("YYYY-MM-DD");
        result.last_working_day = moment(result.last_working_day).format("YYYY-MM-DD");

        let user;
        if(role_id == 1) {
            [user] = await getAdminDetails(result.user_id);
            // result.id = user.id;
            result.username = user?.name || "";
            result.employee_id = user.employee_id;
            result.image = user.image;
            result.user_type = user.user_type;
            
        } else {
            [user] = await getAdminAndUserDetail(result.user_id);
            result.username = user?.username || "";
        }

        // result.username = user?.username || user?.name || "";

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result });
        }
    } catch (error) {
        return next(error);
    }
};

const updateResignationDetails = async (req, res, next) => {
    try {
        const { resignation_date, last_working_day, reason, id } = req.body;
        const formValidation = Joi.object({
            resignation_date: Joi.date().required(),
            last_working_day: Joi.date().required(),
            reason: Joi.string().required(),
            id: Joi.number().integer().positive().required(),
        });

        const { error } = formValidation.validate({
            id: id,
            resignation_date: resignation_date,
            last_working_day: last_working_day,
            reason: reason,
        });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE employee_resignations SET resignation_date = ?, last_working_day = ?, reason = ?, updated_at = ? WHERE id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId;
        const queryResult = await db.query(updateQuery, [resignation_date, last_working_day, reason, updatedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation updated successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const resignationRequestViewed = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE employee_resignations SET viewed_by = ?, viewed_at = ? WHERE id = ?`;

        const viewedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId;
        const queryResult = await db.query(updateQuery, [user_id, viewedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation request viewed successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not viewed" });
        }
    } catch (error) {
        return next(error);
    }
};

const resignationStatusUpdateByAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const resignationStatus = req.params.status;
        const { error } = resignationStatusValidation.validate({ id: id, status: resignationStatus });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE employee_resignations SET resignation_status = ?, approved_by = ?, updated_by = ?, updated_at = ? WHERE id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId;
        const approvedBy = user_id;
        const queryResult = await db.query(updateQuery, [resignationStatus, approvedBy, user_id, updatedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation request updated successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const generateFnFStatement = async (req, res, next) => {
    try {
        const { user_id, remarks } = req.body;

        const fnfValidation = Joi.object({
            user_id: Joi.number().required(),
            remarks: Joi.string().required(),
        }).options({ allowUnknown: true });

        const { error } = fnfValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO fnf_statements(user_id, remarks, created_by) VALUES(?, ?, ?)`;
        const insertValues = [user_id, remarks, req.user.user_id];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fnf statements generated successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Fnf statements not generated" });
        }
    } catch (error) {
        return next(error);
    }
};

const getFnfStatement = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if(role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }
        
        let selectQuery;
        if(role_id == 1){
            selectQuery = `
            SELECT fnf_statements.*, admins.name as user_name, admins.image, admins.employee_id 
            FROM fnf_statements 
            LEFT JOIN admins ON admins.id = fnf_statements.user_id 
            WHERE resignation_status = '${process.env.REJECTED}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
            SELECT fnf_statements.*, users.name as user_name, users.image, users.employee_id 
            FROM fnf_statements 
            LEFT JOIN users ON users.id = fnf_statements.user_id 
            WHERE resignation_status = '${process.env.REJECTED}'  ${search_value}
            ORDER BY employee_resignations.id 
            DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResult = await promisify(db.query)(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: true, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    registerResignation,
    getPendingResignationRequests,
    getApprovedResignationRequests,
    getRejectedResignationRequests,
    getResignationDetailsById,
    updateResignationDetails,
    resignationRequestViewed,
    resignationStatusUpdateByAdmin,
    generateFnFStatement,
    getFnfStatement,
};

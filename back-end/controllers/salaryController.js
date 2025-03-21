require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, salaryValidation } = require("../helpers/validation");
const { getRoleInGroupById, getUserInGroupById } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const addDetailsSalary = async (req, res, next) => {
    try {
        const { user_id, date_of_hire, salary, salary_term } = req.body;
        const { error } = salaryValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO salaries(user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

        const getUserById = await db.query(`SELECT id, user_type FROM users WHERE id = ?`, [user_id]);
        const createdBy = req.user.user_id;
        const userType = getUserById[0].user_type;
        const dateOfHireFormatted = moment(date_of_hire, "DD-MM-YYYY").format("YYYY-MM-DD");

        const insertValues = [user_id, userType, dateOfHireFormatted, salary, salary_term, createdBy];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Salary details added successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! salary details not added" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCreatedSalaryDetails = async (req, res, next) => {
    try {
        const selectQuery = `SELECT salaries.*, users.name FROM salaries INNER JOIN users ON users.id = salaries.user_id WHERE salaries.is_deleted = ? ORDER BY salaries.id DESC`;

        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getCreatedSalaryDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT salaries.*, users.name FROM salaries INNER JOIN users ON users.id = salaries.user_id WHERE salaries.is_deleted = ? AND salaries.id = ?`;

        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED, id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateSalaryDetails = async (req, res, next) => {
    try {
        const { user_id, date_of_hire, salary, salary_term, id } = req.body;
        const { error } = salaryValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const getUserById = await db.query(`SELECT id, user_type FROM users WHERE id = ?`, [user_id]);
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const userType = getUserById[0].user_type;
        const dateOfHireFormatted = moment(date_of_hire, "DD-MM-YYYY").format("YYYY-MM-DD");

        const updateQuery = `UPDATE salaries SET user_id = ?, user_type = ?, date_of_hire = ?, salary = ?, salary_term = ?, updated_at = ? WHERE id = ?`;

        const updateValues = [user_id, userType, dateOfHireFormatted, salary, salary_term, updatedAt, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Salary details updated successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! salary details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteSalaryDetails = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const softDeleteQuery = `UPDATE salaries SET is_deleted = ? WHERE id = ?`;

        const queryResult = await db.query(softDeleteQuery, [process.env.DELETED, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Salary deleted successfully" });
        } else {
            res.status(StatusCodes.OK).json({ status: true, message: "Error! salary not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addDetailsSalary,
    getAllCreatedSalaryDetails,
    getCreatedSalaryDetailsById,
    updateSalaryDetails,
    deleteSalaryDetails,
};

require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const { calculatePagination } = require("../helpers/general");
const Joi = require("joi");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const employeeAddAction = async (req, res, next) => {
    try {
        const {
            user_id,
            purpose,
            reason,
            new_designation,
            new_team,
            change_in_salary,
            change_in_salary_type,
            change_in_salary_value,
        } = req.body;

        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            purpose: Joi.string().required(),
        });

        const { error } = formValidation.validate({ user_id, purpose });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        let storePath = "";
        if (req.files != null) {
            const image = req.files.document;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, async (err, response) => {
                if (err) return res.status(HTTP_STATUS_CODES.OK).json({ status: false, message: err.message });
            });
        }
        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        let insertQuery;
        const insertValues = [
            user_id,
            purpose,
            reason,
            new_designation,
            change_in_salary,
            change_in_salary_type,
            change_in_salary_value,
            storePath,
            createdBy,
            createdAt,
        ];

        if (new_team != "" && new_team != "undefined") {
            insertQuery = `INSERT INTO employee_promotion_demotions(user_id, purpose, reason, new_designation, change_in_salary, change_in_salary_type, change_in_salary_value, document, created_by, created_at, new_team) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
            insertValues.push(new_team);
        } else {
            insertQuery = `INSERT INTO employee_promotion_demotions(user_id, purpose, reason, new_designation, change_in_salary, change_in_salary_type, change_in_salary_value, document,created_by, created_at) VALUES(?,?,?,?,?,?,?,?,?,?)`;
        }

        // console.log("insertQuery: ", insertQuery);
        // console.log("insertValues: ", insertValues);

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Employee " + purpose + " added successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllEmployeePromotionDemotion = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];
        const role_id = req.user.user_type;

        if (searchData != null && searchData != "") {
            if(role_id == 1) {
                searchDataCondition = `WHERE admins.created_by = '${req.user.user_id}' AND employee_promotion_demotions.purpose LIKE '%${searchData}%' OR employee_promotion_demotions.reason LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%' OR roles.name LIKE '%${searchData}%' OR hr_teams.team_name LIKE '%${searchData}%'`;
            } else {
                searchDataCondition = `WHERE users.created_by = '${req.user.user_id}' AND employee_promotion_demotions.purpose LIKE '%${searchData}%' OR employee_promotion_demotions.reason LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%' OR roles.name LIKE '%${searchData}%' OR hr_teams.team_name LIKE '%${searchData}%'`;
            }
        } else {
            if(role_id == 1) {
                searchDataCondition = `WHERE admins.created_by = '${req.user.user_id}'`;
            } else {
                searchDataCondition = `WHERE users.created_by = '${req.user.user_id}'`;
            }
            // searchDataCondition = ` WHERE created_by = '${req.user.user_id}'`;
        }
        let selectQuery;
        // let hrJoinCondition;
        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            // hrJoinCondition = "INNER JOIN teams ON teams.id = employee_promotion_demotions.new_team";
            selectQuery = `SELECT employee_promotion_demotions.*, admins.name, admins.employee_id, roles.name as role_name, teams.team_name FROM employee_promotion_demotions INNER JOIN admins ON admins.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation INNER JOIN teams ON teams.id = employee_promotion_demotions.new_team ${searchDataCondition} ORDER BY employee_promotion_demotions.id DESC LIMIT ?, ?`;
        } else {
            // hrJoinCondition = `INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team`;
            selectQuery = `SELECT employee_promotion_demotions.*, users.name, users.employee_id, roles.name as role_name, hr_teams.team_name FROM employee_promotion_demotions INNER JOIN users ON users.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team ${searchDataCondition} ORDER BY employee_promotion_demotions.id DESC LIMIT ?, ?`;
        }

        // selectQuery = `SELECT employee_promotion_demotions.*, users.name as user_name, roles.name as role_name, hr_teams.team_name FROM employee_promotion_demotions INNER JOIN users ON users.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation ${hrJoinCondition} ${searchDataCondition} ORDER BY employee_promotion_demotions.id DESC LIMIT ?, ?`;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "employee_promotion_demotions",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        const queryResult = await db.query(selectQuery, queryParams);

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
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllEmployeePromotionDemotionById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role_id = req.user.user_type;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // const selectQuery = `SELECT employee_promotion_demotions.*, users.name as user_name, roles.name as role_name, hr_teams.team_name FROM employee_promotion_demotions INNER JOIN users ON users.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team WHERE employee_promotion_demotions.id = ?`;

        let selectQuery;

        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            selectQuery = `
                SELECT employee_promotion_demotions.*, admins.name as user_name, admins.employee_id, roles.name as role_name, teams.team_name, s.salary
                FROM employee_promotion_demotions 
                INNER JOIN admins ON admins.id = employee_promotion_demotions.user_id 
                INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation 
                INNER JOIN teams ON teams.id = employee_promotion_demotions.new_team 
                LEFT JOIN salaries s ON s.user_id = employee_promotion_demotions.user_id
                WHERE employee_promotion_demotions.id = ?`;
        } else {
            selectQuery = `
                SELECT employee_promotion_demotions.*, users.name as user_name, users.employee_id, roles.name as role_name, hr_teams.team_name, s.salary 
                FROM employee_promotion_demotions 
                INNER JOIN users ON users.id = employee_promotion_demotions.user_id 
                INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation 
                INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team 
                LEFT JOIN salaries s ON s.user_id = employee_promotion_demotions.user_id
                WHERE employee_promotion_demotions.id = ?`;
        }

        let queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let final_salary;
            // employee promotion demotion logic
            queryResult.map(item => {
                item.basic = item.salary;
                if(item.change_in_salary == "deduction") {
                    if(item.change_in_salary_type == "amount") {
                        final_salary = item.salary - item.change_in_salary_value
                    } else {
                        final_salary = item.salary - (item.salary * item.change_in_salary_value / 100)
                    }
                } else {
                    if(item.change_in_salary_type == "amount") {
                        final_salary = item.salary + item.change_in_salary_value
                    } else {
                        final_salary = item.salary + (item.salary * item.change_in_salary_value / 100)
                    }
                }
                item.final_salary = final_salary;
                delete item.salary;
            })
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateEmployeePromotionDemotionDetails = async (req, res, next) => {
    try {
        const {
            user_id,
            purpose,
            reason,
            new_designation,
            new_team,
            change_in_salary,
            change_in_salary_type,
            change_in_salary_value,
            document,
            id,
        } = req.body;

        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            purpose: Joi.string().required(),
            id: Joi.number().integer().positive().required(),
        });

        const { error } = formValidation.validate({ user_id, purpose, id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        var storePath = "";
        if (req.files != null) {
            const image = req.files.document;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, async (err, response) => {
                if (err) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ status: false, message: err.message });
            });
        } else {
            storePath = document;
        }

        const updateQuery = `UPDATE employee_promotion_demotions SET user_id = ?, purpose = ?, reason = ?, new_designation = ?, new_team = ?, change_in_salary = ?, change_in_salary_type = ?, change_in_salary_value = ?, document = ?, updated_at = ? WHERE id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [
            user_id,
            purpose,
            reason,
            new_designation,
            new_team,
            change_in_salary,
            change_in_salary_type,
            change_in_salary_value,
            storePath,
            updatedAt,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Employee " + purpose + " updated successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    employeeAddAction,
    getAllEmployeePromotionDemotion,
    getAllEmployeePromotionDemotionById,
    updateEmployeePromotionDemotionDetails,
};

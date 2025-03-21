var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, tasksManagerValidations } = require("../helpers/validation");
const {
    getTotalTaskCount,
    getTotalCompletedTask,
    getTotalCanceledTask,
    getTotalToDoTask,
    getTotalInProgressTask,
    getTotalOverDueTask,
    getTaskCommentDetails,
    getCollaboratorsList,
} = require("../helpers/taskHelper");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { json } = require("express");

const createTask = async (req, res, next) => {
    try {
        const { title, start_date, end_date, assign_to, project_name, category_id, status, collaborators } = req.body;
        const { error } = tasksManagerValidations.validate(req.body);
        if (error) return res.status(200).json({ status: false, message: error.message });

        if (end_date < start_date)
            return res.status(200).json({ status: false, message: "Task end date must be equal to or greater than start date" });

        const createdBy = req.user.user_id;
        const collaborators_json = JSON.stringify(collaborators);
        const insertQuery = `INSERT INTO tasks(title, start_date, end_date, assign_to, project_name, category_id, status, created_by, collaborators) VALUES('${title}', '${start_date}', '${end_date}', '${assign_to}', '${project_name}', '${category_id}', '${status}', '${createdBy}', '${collaborators_json}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Task created successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllTaskList = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(tasks.id) as total FROM tasks INNER JOIN users ON users.id = tasks.assign_to INNER JOIN task_categories ON task_categories.id = tasks.category_id`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var searchString = "";
        if (searchData != null && searchData != "") {
            searchString = `WHERE tasks.title LIKE '%${searchData}%'`;
        }

        var selectQuery = `SELECT tasks.*, users.name as user_name, task_categories.name as task_category_name FROM tasks LEFT JOIN users ON users.id = tasks.assign_to LEFT JOIN task_categories ON task_categories.id = tasks.category_id ${searchString} ORDER BY tasks.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        db.query(selectQuery, async (err, results) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (results.length > process.env.VALUE_ZERO) {
                const final = results.map(async (element) => {
                    const collaborators_list = await getCollaboratorsList(JSON.parse(element.collaborators));
                    return {
                        id: element.id,
                        title: element.title,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        assign_to: element.assign_to,
                        assign_user_name: element.user_name,
                        project_name: element.project_name,
                        category_id: element.category_id,
                        category_name: element.task_category_name,
                        status: element.status,
                        collaborators: JSON.parse(element.collaborators),
                        collaborators_list: collaborators_list,
                    };
                });

                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(200).json({ status: false, message: error.message });

        const selectQuery = `
            SELECT tasks.*, users.name as user_name, users.image as user_image, users.employee_id AS assign_employee_id, task_categories.name as task_category_name 
            FROM tasks 
            LEFT JOIN users ON users.id = tasks.assign_to 
            LEFT JOIN task_categories ON task_categories.id = tasks.category_id 
            WHERE tasks.id = ${id}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                var values = [];

                for (const row of result) {
                    const comments = await getTaskCommentDetails(row.id);
                    const collaborators_list = await getCollaboratorsList(JSON.parse(row.collaborators));
                    values.push({
                        id: row.id,
                        title: row.title,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        assign_to: row.assign_to,
                        assign_user_name: row.user_name,
                        assign_user_image: row.user_image,
                        assign_employee_id: row.assign_employee_id,
                        project_name: row.project_name,
                        category_id: row.category_id,
                        task_category_name: row.task_category_name,
                        status: row.status,
                        previous_status: row.previous_status,
                        status_changed_at: row.status_changed_at,
                        created_by: row.created_by,
                        comments: comments,
                        collaborators: JSON.parse(row.collaborators),
                        collaborators_list: collaborators_list,
                    });
                }
                res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateTaskDetails = async (req, res, next) => {
    try {
        const { title, start_date, end_date, assign_to, project_name, category_id, status, id, collaborators } =
            req.body;
        const { error } = tasksManagerValidations.validate({
            title: title,
            start_date: start_date,
            end_date: end_date,
            assign_to: assign_to,
            project_name: project_name,
            category_id: category_id,
            status: status,
            collaborators: collaborators,
        });

        if (error) return res.status(200).json({ status: false, message: error.message });

        const { error: idError } = checkPositiveInteger.validate({ id: id });
        if (idError) return res.status(200).json({ status: false, message: idError.message });

        if (end_date < start_date)
            return res.status(200).json({ status: false, message: "Task end date must be equal to or greater than start date" });

        const updatedBy = req.user.user_id;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const collaborators_json = JSON.stringify(collaborators);

        const updateQuery = `UPDATE tasks SET title='${title}', start_date='${start_date}', end_date='${end_date}', assign_to='${assign_to}', project_name='${project_name}', category_id='${category_id}', status='${status}', updated_by='${updatedBy}', updated_at='${updatedAt}', collaborators='${collaborators_json}' WHERE id='${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return request.status(200).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Task updated successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(200).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM tasks WHERE id='${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Task deleted successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const taskDashboard = async (req, res, next) => {
    try {
        var data = [];
        const totalTask = await getTotalTaskCount();
        const completedTasks = await getTotalCompletedTask();
        const canceledTasks = await getTotalCanceledTask();
        const toDoTasks = await getTotalToDoTask();
        const inProgressTasks = await getTotalInProgressTask();
        const overDueTasks = await getTotalOverDueTask();

        data.push(totalTask, completedTasks, canceledTasks, toDoTasks, inProgressTasks, overDueTasks);
        const results = data.reduce((r, a) => r.concat(a), []);
        const totalTaskObject = results[0];
        totalTaskObject["totalTaskName"] = "Total tasks";

        const totalCompletedTaskObject = results[1];
        totalCompletedTaskObject["completedTasksName"] = "Total Completed Tasks";

        const totalCancelTaskObject = results[2];
        totalCancelTaskObject["toDoTasksName"] = "Total Cancel Tasks";

        const totalToDoTaskObject = results[3];
        totalToDoTaskObject["inProgressTasksName"] = "Total ToDo Tasks";

        const totalInProgressTaskObject = results[4];
        totalInProgressTaskObject["task_dashboard_name"] = "Total In Progress Tasks";

        const totalOverDueTaskObject = results[5];
        totalOverDueTaskObject["overDueTasksName"] = "Total OverDue Tasks";

        return res.status(200).json({ status: true, message: "Found", data: results });
    } catch (error) {
        return next(error);
    }
};

const updateMainTaskStatus = async (req, res, next) => {
    try {
        const { status, task_id } = req.body;
        const statusValidation = Joi.object({
            status: Joi.string().required(),
            task_id: Joi.number().required(),
        });

        const { error } = statusValidation.validate(req.body);

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const getPreviousTaskStatusQuery = `SELECT * FROM tasks WHERE id = ?`;
        const getPreviousTaskStatusQueryResults = await db.query(getPreviousTaskStatusQuery, [task_id]);

        const previousStatus = getPreviousTaskStatusQueryResults[0].status;
        const updatedBy = req.user.user_id;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const statusChangedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateTaskStatusQuery = `UPDATE tasks SET status = ?, previous_status = ?, status_changed_at = ?, updated_by = ?, updated_at = ?  WHERE id = ?`;
        const updateTaskStatusQueryResult = await db.query(updateTaskStatusQuery, [
            status,
            previousStatus,
            statusChangedAt,
            updatedBy,
            updatedAt,
            task_id,
        ]);

        if (updateTaskStatusQueryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Task status changed successfully" });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! task status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllTaskByStatus = async (req, res, next) => {
    try {
        const status = req.query.status;
        const statusValidation = Joi.object({
            status: Joi.string().required(),
        });

        const { error } = statusValidation.validate({ status: status });

        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

        var whereCondition = "";

        if (status === "completed" || status === "in progress" || status === "assign" || status === "canceled") {
            whereCondition = `WHERE tasks.status = '${status}'`;
        } else if (status == "all") {
            whereCondition = "";
        } else if (status == "overdue") {
            const todayDate = moment().format("YYYY-MM-DD");
            whereCondition = `WHERE tasks.end_date <='${todayDate}' AND (tasks.status='in progress' OR tasks.status='assign')`;
        }

        const selectQuery = `SELECT tasks.title, tasks.project_name, tasks.start_date, tasks.end_date, tasks.status, users.name as assign_user_name FROM tasks INNER JOIN users ON users.id = tasks.assign_to ${whereCondition}`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createTask,
    getAllTaskList,
    getTaskById,
    updateTaskDetails,
    deleteTask,
    taskDashboard,
    updateMainTaskStatus,
    getAllTaskByStatus,
};

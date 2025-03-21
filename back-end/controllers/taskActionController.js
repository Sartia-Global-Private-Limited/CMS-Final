var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { getTaskCommentDetails } = require("../helpers/taskHelper");

const createTaskComment = async (req, res, next) => {
    try {
        const { task_id, user_id, remark, status } = req.body;
        const createdBy = req.user.user_id;

        var storePath = "";

        if (req.files != null) {
            const image = req.files.attachment;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/task_comment_images/" + imageName;
            storePath = "/task_comment_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        }
        const insertQuery = `INSERT INTO task_comments (task_id, user_id, remark, attachment, created_by) VALUES("${task_id}", "${user_id}", "${remark}", "${storePath}","${createdBy}")`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "task comment added successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateTaskComment = async (req, res, next) => {
    try {
        const { remark, status, attachment, id } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM task_comments WHERE id = ${id}`;
        const results = await db.query(selectQuery);
        const previousStatus = results[0].status;
        const taskCommentId = results[0].id;

        const statusChangedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        var storePath = "";

        if (req.files != null) {
            const image = req.files.attachment;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/task_comment_images/" + imageName;
            storePath = "/task_comment_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        } else {
            storePath = attachment;
        }

        const updateQuery = `UPDATE task_comments SET remark='${remark}', attachment='${storePath}', updated_at='${updatedAt}' WHERE id='${taskCommentId}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Task updated successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTaskCommentDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT tasks.id as task_id, tasks.title, tasks.start_date, tasks.end_date, tasks.assign_to, tasks.category_id, admins.name as created_by, users.name as assign_to_user, task_categories.name as category_name FROM tasks INNER JOIN admins ON admins.id=tasks.created_by INNER JOIN users ON users.id=tasks.assign_to INNER JOIN task_categories ON task_categories.id=tasks.category_id WHERE tasks.id=${id}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                var response = [];
                const comments = await getTaskCommentDetails(id);
                //response.push(result[0], comments)
                res.status(200).json({
                    status: true,
                    message: "Fetched successfully",
                    data: result[0],
                    comments: comments,
                });
            } else {
                return res.status(500).json({ status: true, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { createTaskComment, getTaskCommentDetailsById, updateTaskComment };

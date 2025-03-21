var moment = require("moment");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require("./validation");

async function getTotalTaskCount() {
    const sql = `SELECT COUNT(*) as totalTask FROM tasks`;
    return await db.query(sql);
}

async function getTotalCompletedTask() {
    const sql = `SELECT COUNT(*) as totalCompletedTask FROM tasks WHERE status = 'completed'`;
    return await db.query(sql);
}

async function getTotalCanceledTask() {
    const sql = `SELECT COUNT(*) as totalCanceledTask FROM tasks WHERE status = 'canceled'`;
    return await db.query(sql);
}

async function getTotalToDoTask() {
    const sql = `SELECT COUNT(*) as totalToDodTask FROM tasks WHERE status = 'assign'`;
    return await db.query(sql);
}

async function getTotalInProgressTask() {
    const sql = `SELECT COUNT(*) as totalInProgressTask FROM tasks WHERE status = 'in progress'`;
    return await db.query(sql);
}

async function getTotalOverDueTask() {
    const todayDate = moment().format("YYYY-MM-DD");
    const sql = `SELECT COUNT(*) as totalOverDueTask FROM tasks WHERE end_date <='${todayDate}' AND (status='in progress' OR status='assign')`;
    return await db.query(sql);
}

async function getTaskCommentDetails(taskId) {
    const sql = `
        SELECT task_comments.id as task_comments_id, task_comments.remark, task_comments.status, task_comments.previous_status, task_comments.user_id, task_comments.created_at as task_comment_date,task_comments.attachment, task_comments.status_changed_at, users.name as user_name, users.image as user_image, users.employee_id AS user_employee_id 
        FROM task_comments 
        LEFT JOIN users ON users.id=task_comments.user_id 
        WHERE task_comments.task_id='${taskId}' 
        ORDER BY task_comments.id DESC
    `;
    return await db.query(sql);
}

async function getCollaboratorsList(collaborators) {
    const selectQuery = `
        SELECT id, name, employee_id, image 
        FROM users 
        WHERE id IN (${collaborators.toString()});
    `;
    return await db.query(selectQuery);
}

module.exports = {
    getTotalTaskCount,
    getTotalCompletedTask,
    getTotalCanceledTask,
    getTotalToDoTask,
    getTotalInProgressTask,
    getTotalOverDueTask,
    getTaskCommentDetails,
    getCollaboratorsList,
};

require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const {checkPositiveInteger} = require("./validation");
var moment = require('moment');
const { StatusCodes } = require('http-status-codes');

async function insertNotifications(notificationData)
{ 
    const created_by = notificationData[0].userId;
    const user_type = notificationData[0].roleId;
    const title = notificationData[0].title;
    const message = notificationData[0].message;
    const created_for = notificationData[0].userId;
    
    const insertQuery = `INSERT INTO notifications(title, message, user_type, created_by, created_for) 
    VALUES (?, ?, ?, ?, ?)`;
    const insertValues = [title, message, user_type, created_by, created_for]
    const queryResult = await db.query(insertQuery, insertValues)
}


module.exports = {insertNotifications}
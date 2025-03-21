require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const {checkPositiveInteger, userActivityLogValidations} = require("./validation");
var moment = require('moment');
const { StatusCodes } = require('http-status-codes');

async function insertEmployeeActivityLog(logData)
{ 
    const userId = logData[0].userId;
    const roleId = logData[0].roleId;
    const timestamp = logData[0].timestamp;
    const action = logData[0].action;
    const ipAddress = logData[0].ipAddress;
    const userAgent = logData[0].userAgent;
    const logResult = logData[0].logResult;
    
    const insertQuery = `INSERT INTO user_activity_logs(user_id, role_id, timestamp, action, ip_address, user_agent, result) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const insertValues = [userId, roleId, timestamp, action, ipAddress, userAgent, logResult]
    const queryResult = await db.query(insertQuery, insertValues)
}


module.exports = {insertEmployeeActivityLog}
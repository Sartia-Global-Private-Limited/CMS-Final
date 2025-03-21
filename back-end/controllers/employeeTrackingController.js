require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const trackEmployeeHistory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        const role_id = req.user.user_type;

        let selectQuery;
        if(role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            selectQuery = `SELECT trackings.*, admins.name AS user_name FROM trackings INNER JOIN admins ON admins.id = trackings.user_id WHERE trackings.user_id = ?`;
        } else {
            selectQuery = `SELECT trackings.*, users.name AS user_name FROM trackings INNER JOIN users ON users.id = trackings.user_id WHERE trackings.user_id = ?`;
        }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "trackings",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });


        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: true, message: "History not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { trackEmployeeHistory };

require("dotenv").config();
const bcrypt = require("bcrypt");
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const addPayrollMasterSettingLabel = async (req, res, next) => {
    try {
        const { input_type, label, active_setting } = req.body;

        if (active_setting == process.env.ACTIVE_STATUS) {
            const updateQuery = `UPDATE payroll_master_settings SET active_setting=?`;
            const queryResult = await db.query(updateQuery, ["0"]);
        }
        const insertQuery = `INSERT INTO payroll_master_settings(input_type, label, active_setting, created_by) VALUES(?, ?, ?, ?)`;

        const createdBy = req.user.user_id;
        const queryResults = await db.query(insertQuery, [input_type, label, active_setting, createdBy]);

        if (queryResults.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Payroll setting added successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllPayRollMasterSettings = async (req, res, next) => {
    try {
        const { id } = req.params;
        let condition = "";
        if (id) {
            condition = `WHERE id = '${id}'`;
        }
        const selectQuery = `SELECT * FROM payroll_master_settings ${condition}`;
        const queryResults = await promisify(db.query)(selectQuery);

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: id ? queryResults[0] : queryResults });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updatePayrollSettings = async (req, res, next) => {
    try {
        const id = req.body.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE payroll_master_settings SET active_setting = ?`;
        const queryResult = await db.query(updateQuery, ["0"]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const ActiveNewSettings = `UPDATE  payroll_master_settings SET active_setting = ? WHERE id= ?`;
            const activeSettingResult = await db.query(ActiveNewSettings, ["1", id]);

            res.status(StatusCodes.OK).json({ status: true, message: "Payroll settings saved successfully" });
        } else {
            return request
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later." });
        }
    } catch (error) {
        return next(error);
    }
};

const updatePayrollSettingLabel = async (req, res, next) => {
    try {
        const { id, label, active_setting } = req.body;
        const formValidation = Joi.object({
            id: Joi.number().required(),
            label: Joi.string().required(),
            active_setting: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (active_setting === "1") {
            const updateQueryPrevious = `UPDATE payroll_master_settings SET active_setting = ?`;
            const result = await db.query(updateQueryPrevious, ["0"]);
        }

        const updateQuery = `UPDATE payroll_master_settings SET label = ?, active_setting = ? WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [label, active_setting, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Payroll settings label updated successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! payroll settings label not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addPayrollMasterSettingLabel,
    getAllPayRollMasterSettings,
    updatePayrollSettings,
    updatePayrollSettingLabel,
};

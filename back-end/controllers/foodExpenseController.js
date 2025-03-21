require("dotenv").config();
var moment = require("moment");
const Joi = require("joi");
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");
const { todayFoodExpensePunch } = require("../helpers/commonHelper");

const getFoodExpenses = async (req, res, next) => {
    try {
        const queryResult = await db.query(`SELECT id, name, rate FROM item_masters WHERE item_type = ?`, [2]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    name: row.name,
                    max_limit: row.rate,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Food expense found",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Food expense not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const setFoodExpenseMaxLimit = async (req, res, next) => {
    try {
        const { id, amount } = req.body;
        const foodExpenseSchema = Joi.object({
            id: Joi.number().required(),
            amount: Joi.number().required(),
        });

        const { error } = foodExpenseSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`UPDATE item_masters SET rate = ? WHERE id = ?`, [amount, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Food expense max limit set successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const punchFoodExpense = async (req, res, next) => {
    try {
        const { item_id, user_id, amount, complaint_id, expense_description } = req.body;
        const foodExpenseValidations = Joi.object({
            item_id: Joi.number().required(),
            user_id: Joi.number().required(),
            amount: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = foodExpenseValidations.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const expense_date = moment(new Date()).format("YYYY-MM-DD");
        const payment_method = "1";
        const status = "1";
        const approved_by = req.user.user_id;
        const created_by = approved_by;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const approved_amount = amount;

        // check users food expense is already punch today or not
        const checkFoodExpensePunchToday = await todayFoodExpensePunch(expense_date, user_id);
        if (checkFoodExpensePunchToday) {
            const itemDetails = await getItemDetails(item_id);
            // Transform the data
            const transformedData = [
                {
                    item_name: {
                        label: itemDetails.name,
                        value: itemDetails.id,
                        rate: itemDetails.rate,
                    },
                    prev_qty: "", // Assuming qty is a string, convert it to a number
                    prev_amount: "",
                    qty: "1", // Set your desired quantity here
                    amount: itemDetails.rate, // Calculate the amount based on the quantity
                    sub_total: itemDetails.rate, // Assuming sub_total is the same as the amount in this context
                },
            ];

            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Food expense already punched today",
            });
        }

        const queryResult = await db.query(
            `INSERT INTO expenses(expense_date, expense_amount, payment_method, user_id, complaint_id, expense_description, status, approved_amount, approved_by, approved_at, created_by)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                expense_date,
                amount,
                payment_method,
                user_id,
                complaint_id,
                expense_description,
                status,
                approved_amount,
                approved_by,
                approved_at,
                created_by,
            ]
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Food expense punched successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error,
        });
    }
};

async function getItemDetails(item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });
        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM item_masters WHERE id =?`, [item_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { getFoodExpenses, setFoodExpenseMaxLimit, punchFoodExpense };

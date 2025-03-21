var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails } = require("../helpers/general");

const getUserAllTransaction = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "transactions.amount",
            "transactions.description",
            "users.name",
            "transactions.transaction_date",
            "transactions.transaction_type",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const user_id = req.query.user_id || req.user.user_id;
        const orderLimitQuery = `ORDER BY transactions.id ASC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT transactions.*, users.name as user_name, users.image, users.employee_id FROM transactions LEFT JOIN users ON users.id = transactions.user_id WHERE transactions.user_id = '${user_id}'`;
        const query = `${baseQuery} ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var finalData = [];

            // add moment on transaction_date
            for (const row of queryResult) {
                var creditAmount = "-";
                var debitAmount = "-";

                if (row.transaction_type === "credit") {
                    creditAmount = row.amount;
                } else {
                    debitAmount = row.amount;
                }
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    credit: creditAmount,
                    debit: debitAmount,
                    transaction_date: moment(row.transaction_date).format("YYYY-MM-DD"),
                    remaining_balance: row.balance,
                    description: row.description,
                    user_name: row.user_name,
                    image: row.image,
                    employee_id: row.employee_id,
                    transaction_type: row.transaction_type,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { getUserAllTransaction };

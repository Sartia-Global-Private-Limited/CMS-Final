var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
    checkPositiveInteger,
    requestCashValidation,
    amountAddToUserWalletValidationSchema,
} = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    generateRandomAlphanumeric,
    getCashRequestStatus,
    getUserDetails,
} = require("../helpers/general");
const {
    getUserCashRequestDetailById,
    manageUserWallet,
    saveTransactionDetails,
    getUserWalletBalance,
} = require("../helpers/commonHelper");

const addFundtoUser = async (req, res, next) => {
    try {
        const created_by = req.user.user_id;
        const { user_id, amount, remark } = req.body;
        const { error } = amountAddToUserWalletValidationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        let balance = 0;
        let queryResult;
        const todayDate = moment(new Date()).format("YYYY-MM-DD");
        /**check user */
        const checkUser = await getUserDetails(user_id);
        if (checkUser.length > 0) {
            const walletBalance = await getUserWalletBalance(user_id);
            if (Object.keys(walletBalance).length > 0) {
                balance = Number(walletBalance.balance) + Number(amount);
                queryResult = `UPDATE user_wallets SET user_id = ?, balance = ?, created_by = ?`;
            } else {
                balance = amount;
                queryResult = `INSERT INTO user_wallets (user_id, balance, created_by) VALUES(?, ?, ?)`;
            }
            const Result = await db.query(queryResult, [user_id, balance, created_by]);
            if (Result.affectedRows > 0) {
                await db.query(
                    `INSERT INTO transactions(user_id, transaction_type, transaction_date, amount, balance, description, created_by) VALUES ('${user_id}','credit','${todayDate}','${amount}','${balance}','${remark}', '${created_by}')`
                );
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: `fund added to  ${checkUser[0].name} wallet` });
            } else {
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ status: true, message: "Something gone wrong!" });
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "User not exist!" });
        }
    } catch (error) {
        return next(error);
    }
};

const userWalletBalance = async (req, res, next) => {
    try {
        const userId = req.query.user_id || req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const walletBalance = await getUserWalletBalance(userId);
        // get user details
        const userDetails = await getCreatedByDetails(userId);

        if (Object.keys(walletBalance).length > process.env.VALUE_ZERO) {
            walletBalance.user_name = userDetails.name;
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "balance fetched successfully",
                data: walletBalance,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "balance fetched successfully",
                data: { balance: "00.0", user_name: userDetails.name },
            });
        }
    } catch (error) {
        return next(error);
    }
};

const userTransactionMonthlyReport = async (req, res, next) => {
    try {
        const userId = req.query.user_id || req.user.user_id;
        const queryYearMonth = req.query.year_month || moment(new Date()).format("YYYY-MM");
        const { error } = checkPositiveInteger.validate({ id: userId });
        const year = moment(queryYearMonth, "YYYY-MM").format("YYYY");
        const month = moment(queryYearMonth, "YYYY-MM").format("MM");

        // for pagination

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // const selectQuery =
        //     `SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month, DAY(transaction_date) AS day, SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_debit, SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_credit FROM transactions WHERE user_id = ? AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? GROUP BY month, day ORDER BY day DESC LIMIT ? , ?`;

        if (searchData != null && searchData != "") {
            search_value += `AND (transaction_type LIKE '%${searchData}%' OR amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT * FROM transactions WHERE user_id = '${userId}' AND YEAR(transaction_date) = '${year}' AND MONTH(transaction_date) = '${month}' ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                row.status = "Completed";
                row.transaction_date = moment(row.created_at).format("YYYY-MM-DD");
                row.transaction_time = moment(row.created_at).format("HH:mm:ss A");
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
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

const cashRequestTracked = async (req, res, next) => {
    try {
        const userId = req.query.user_id || req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT * FROM new_fund_requests WHERE request_by = ? AND status = ? ORDER BY id DESC";
        const queryResult = await db.query(selectQuery, [userId, process.env.PENDING]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    complaint_id: row.complaint_id,
                    request_purpose: row.request_purpose,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_time: moment(row.request_date).format("HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                finalData: finalData,
                message: "Fetched successfully",
                data: queryResult,
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

const userTransactionHistory = async (req, res, next) => {
    try {
        const userId = req.query.user_id || req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT * FROM transactions WHERE user_id = ?";
        const queryResult = await db.query(selectQuery, [userId]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    transaction_type: row.transaction_type,
                    amount: row.amount,
                    transaction_date: moment(row.created_at).format("YYYY-MM-DD"),
                    transaction_time: moment(row.created_at).format("HH:mm:ss A"),
                    status: "Completed",
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                finalData: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getUserAssetAndFundMonthlyReport = async (req, res, next) => {
    try {
        const userId = req.query.user_id || req.user.user_id;
        const queryYearMonth = req.query.month_year || moment(new Date()).format("YYYY-MM");
        const year = moment(queryYearMonth, "YYYY-MM").format("YYYY");
        const month = moment(queryYearMonth, "YYYY-MM").format("MM");

        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const assetSelectQuery =
            "SELECT items_used.used_item, items_used.quantity, items_used.item_price, items_used.created_at, item_masters.name as item_name FROM items_used LEFT JOIN item_masters ON item_masters.id = items_used.used_item WHERE items_used.created_by = ?";
        const assetQueryResult = await db.query(assetSelectQuery, [userId]);

        var assetData = [];
        var fundData = [];

        if (assetQueryResult.length > process.env.VALUE_ZERO) {
            for (const asset of assetQueryResult) {
                var assetsPrice = parseInt(asset.quantity) * parseInt(asset.item_price);
                assetData.push({
                    id: asset.used_item,
                    // quantity: asset.quantity,
                    item_price: assetsPrice,
                    item_name: asset.item_name,
                    date: moment(asset.created_at).format("YYYY-MM-DD"),
                });
            }
        } else {
            assetData;
        }

        // get company funds
        const fundSelectQuery =
            "SELECT fund_requests.id, fund_requests.request_amount FROM fund_requests WHERE fund_requests.status = ? AND fund_requests.request_by = ?";

        const fundQueryResult = await db.query(fundSelectQuery, [process.env.APPROVED, userId]);

        if (fundQueryResult.length > process.env.VALUE_ZERO) {
            for (const row of fundQueryResult) {
                fundData.push({
                    id: row.id,
                    amount: row.request_amount,
                    request_purpose: row.request_purpose,
                });
            }
        } else {
            fundData;
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Fetched successfully",
            assetData: assetData,
            fundData: fundData,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    userWalletBalance,
    userTransactionMonthlyReport,
    cashRequestTracked,
    userTransactionHistory,
    getUserAssetAndFundMonthlyReport,
    addFundtoUser,
};

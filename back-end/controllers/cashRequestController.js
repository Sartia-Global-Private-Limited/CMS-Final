var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, requestCashValidation } = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    generateRandomAlphanumeric,
    getCashRequestStatus,
} = require("../helpers/general");
const {
    getUserCashRequestDetailById,
    manageUserWallet,
    saveTransactionDetails,
    getUserWalletBalance,
} = require("../helpers/commonHelper");

const requestCash = async (req, res, next) => {
    try {
        const { request_amount, request_purpose } = req.body;
        const { error } = requestCashValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO cash_requests (user_id, request_unique_id, request_date, request_amount, request_purpose, created_by) VALUES(?, ?, ?, ?, ?, ?)";

        const request_date = moment().format("YYYY-MM-DD");
        const user_id = req.user.user_id;
        const created_by = user_id;
        const request_unique_id = await generateRandomAlphanumeric(10);

        const insertValues = [user_id, request_unique_id, request_date, request_amount, request_purpose, created_by];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Cash request successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllLoggedUserCashRequested = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "cash_requests.request_date",
            "cash_requests.request_amount",
            "cash_requests.request_purpose",
            "users.name",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const loggedUserId = req.user.user_id;
        const orderLimitQuery = `ORDER BY cash_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT cash_requests.*, users.name, users.image FROM cash_requests LEFT JOIN users ON users.id = cash_requests.user_id WHERE cash_requests.user_id = ${loggedUserId} AND cash_requests.request_status = '0'`;
        const query = `${baseQuery} ${searchConditions.length > 0 ? `AND( ${searchConditions.join(" OR ")}) ` : ""} ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            var finalData = [];

            for (const row of queryResult) {
                const createdByDetail = await getCreatedByDetails(row.created_by);
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.name ? row.name : createdByDetail.name,
                    user_image: row.image ? row.image : createdByDetail.image,
                    request_unique_id: row.request_unique_id,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_amount: row.request_amount,
                    request_purpose: row.request_purpose,
                    request_status: row.request_status,
                    approval_date: row.approval_date ? moment(row.approval_date).format("YYYY-MM-DD") : "",
                    approval_by: row.approval_by,
                    approval_amount: row.approval_amount,
                    created_by: createdByDetail.name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const getCashRequestedDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const baseQuery =
            "SELECT cash_requests.*, users.name, users.employee_id, users.image FROM cash_requests LEFT JOIN users ON users.id = cash_requests.user_id WHERE cash_requests.id = ?";

        const queryResult = await db.query(baseQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const createdByDetail = await getCreatedByDetails(row.created_by);
                const getApprovedByDetails = await getCreatedByDetails(row.approval_by);

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.name ? row.name : createdByDetail.name,
                    user_image: row.image ? row.image : createdByDetail.image,
                    user_employee_code: row.employee_id,
                    request_unique_id: row.request_unique_id,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_amount: row.request_amount,
                    request_purpose: row.request_purpose,
                    request_status: row.request_status,
                    approval_date: row.approval_date ? moment(row.approval_date).format("YYYY-MM-DD") : "",
                    approval_by: row.approval_by,
                    approval_by_name: getApprovedByDetails.name ? getApprovedByDetails.name : "",
                    approval_by_image: getApprovedByDetails.image ? getApprovedByDetails.image : "",
                    approval_by_employee_code: getApprovedByDetails.employee_id ? getApprovedByDetails.employee_id : "",
                    approval_amount: row.approval_amount,
                    created_by: createdByDetail.name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: finalData[0],
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

const updatedRequestedCashDetail = async (req, res, next) => {
    try {
        const { request_amount, request_purpose, id } = req.body;
        //check cash request status for update details
        const cashRequestStatus = await getCashRequestStatus(id);

        if (cashRequestStatus.request_status > process.env.PENDING) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Don't have access to update request",
            });
        }
        const { error } = requestCashValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE cash_requests SET request_amount = ?, request_purpose = ?, updated_by =? WHERE id = ?";

        const updated_by = req.user.user_id;

        const updateValues = [request_amount, request_purpose, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Cash request detail updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteRequestedCashDetail = async (req, res, next) => {
    try {
        const id = req.params.id;

        //check cash request status for update details
        const cashRequestStatus = await getCashRequestStatus(id);

        if (cashRequestStatus.request_status > process.env.PENDING) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Don't have access to delete request",
            });
        }
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM cash_requests WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Cash request deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const cashRequestStatusAction = async (req, res, next) => {
    try {
        const { id, status, remark, transaction_id } = req.body;
        const requestActionValidation = Joi.object({
            id: Joi.number().required(),
            status: Joi.number().required(),
            remark: Joi.required(),
            transaction_id: Joi.required(),
        });

        const { error } = requestActionValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        //get cash request amount for update details
        const cashRequestDetail = await getCashRequestStatus(id);
        const approval_amount = cashRequestDetail.request_amount;
        const statusUpdateQuery =
            "UPDATE cash_requests SET approval_date = ?, approval_by = ?, approval_amount = ?, request_status = ?, remark = ?, transaction_id = ? WHERE id = ?";
        const approval_date = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");
        const approval_by = req.user.user_id;
        const queryResult = await db.query(statusUpdateQuery, [
            approval_date,
            approval_by,
            approval_amount,
            status,
            remark,
            transaction_id,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (status == process.env.APPROVED) {
                // get cash request details
                const cash_request_detail = await getUserCashRequestDetailById(id);
                var amount = 0;

                if (cash_request_detail.approval_amount > process.env.VALUE_ZERO) {
                    amount = cash_request_detail.approval_amount;
                } else {
                    amount = cash_request_detail.request_amount;
                }

                // add amount to wallet on cash request approved
                if (cash_request_detail.request_status === "1") {
                    const wallet = await manageUserWallet(cash_request_detail.user_id, amount, process.env.ADD_AMOUNT);
                    // get user balance from wallet
                    const wallet_balance = await getUserWalletBalance(cash_request_detail.user_id);

                    // add details to transaction table
                    const transactionData = {
                        user_id: cash_request_detail.user_id,
                        transaction_type: process.env.CREDIT,
                        transaction_date: moment(new Date()).format("YYYY-MM-DD"),
                        amount: amount,
                        balance: wallet_balance.balance,
                        description: cash_request_detail.request_purpose,
                        created_by: approval_by,
                    };
                    const transactions = await saveTransactionDetails(transactionData);
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Successfully updated",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request processing",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedCashRequest = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["cash_requests.request_date", "cash_requests.request_amount", "users.name"];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }
        const loggedUserId = req.user.user_id;
        const orderLimitQuery = `ORDER BY cash_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT cash_requests.*, users.name, users.image FROM cash_requests LEFT JOIN users ON users.id = cash_requests.user_id WHERE cash_requests.user_id = ${loggedUserId} AND cash_requests.request_status = '${process.env.APPROVED}'`;
        const query = `${baseQuery} ${searchConditions.length > 0 ? `AND (${searchConditions.join(" OR ")}) ` : ""} ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            var finalData = [];

            for (const row of queryResult) {
                const createdByDetail = await getCreatedByDetails(row.created_by);
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.name ? row.name : createdByDetail.name,
                    user_image: row.image ? row.image : createdByDetail.image,
                    request_unique_id: row.request_unique_id,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_amount: row.request_amount,
                    request_purpose: row.request_purpose,
                    request_status: row.request_status,
                    approval_date: row.approval_date ? moment(row.approval_date).format("YYYY-MM-DD") : "",
                    approval_by: row.approval_by,
                    approval_amount: row.approval_amount,
                    created_by: createdByDetail.name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const getAllRejectedCashRequest = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "cash_requests.id",
            "cash_requests.request_date",
            "cash_requests.request_amount",
            "cash_requests.request_status",
            "users.name",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY cash_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT cash_requests.*, users.name, users.image FROM cash_requests LEFT JOIN users ON users.id = cash_requests.user_id WHERE cash_requests.request_status = '${process.env.REJECTED}'`;
        const query = `${baseQuery} ${
            searchConditions.length > 0 ? `AND (${searchConditions.join(" OR ")} )` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            var finalData = [];

            for (const row of queryResult) {
                const createdByDetail = await getCreatedByDetails(row.created_by);
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.name ? row.name : createdByDetail.name,
                    user_image: row.image ? row.image : createdByDetail.image,
                    request_unique_id: row.request_unique_id,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_amount: row.request_amount,
                    request_purpose: row.request_purpose,
                    request_status: row.request_status,
                    approval_date: row.approval_date ? moment(row.approval_date).format("YYYY-MM-DD") : "",
                    approval_by: row.approval_by,
                    approval_amount: row.approval_amount,
                    created_by: createdByDetail.name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

//---------------Contractor Admin------------------------
const getAllCashRequestedList = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const cashRequestStatus = req.query.cashRequestStatus || "0";
        const cashRequestDate = req.query.cashRequestDate || moment(new Date()).format("YYYY-MM-DD");
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "cash_requests.request_date",
            "cash_requests.request_amount",
            "cash_requests.request_purpose",
            "users.name",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const loggedUserId = req.user.user_id;
        const orderLimitQuery = `ORDER BY cash_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT cash_requests.*, users.name, users.image FROM cash_requests LEFT JOIN users ON users.id = cash_requests.user_id WHERE cash_requests.user_id != ${loggedUserId} AND cash_requests.request_status = '${cashRequestStatus}' AND cash_requests.request_date = '${cashRequestDate}'`;

        const query = `${baseQuery} ${searchConditions.length > 0 ? `AND( ${searchConditions.join(" OR ")}) ` : ""} ${orderLimitQuery}`;
        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        let total_balance = 0;
        let total_count = 0;
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            var finalData = [];
            total_count = queryResult.length;

            for (const row of queryResult) {
                const createdByDetail = await getCreatedByDetails(row.created_by);

                // add total result amount
                total_balance += row.request_amount;

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.name ? row.name : createdByDetail.name,
                    user_image: row.image ? row.image : createdByDetail.image,
                    request_unique_id: row.request_unique_id,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    request_amount: row.request_amount,
                    request_purpose: row.request_purpose,
                    request_status: row.request_status,
                    approval_date: row.approval_date ? moment(row.approval_date).format("YYYY-MM-DD") : "",
                    approval_by: row.approval_by,
                    approval_amount: row.approval_amount,
                    created_by: createdByDetail.name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: finalData,
                total_count: total_count,
                total_balance: process.env.RUPEE_SYMBOL + total_balance,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
                total_count: total_count,
                total_balance: process.env.RUPEE_SYMBOL + total_balance,
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    requestCash,
    getAllLoggedUserCashRequested,
    getCashRequestedDetailById,
    updatedRequestedCashDetail,
    deleteRequestedCashDetail,
    cashRequestStatusAction,
    getAllCashRequestedList,
    getAllApprovedCashRequest,
    getAllRejectedCashRequest,
};

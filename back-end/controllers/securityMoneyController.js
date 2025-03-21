var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { securityMoneyValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getUserDetails, getCreatedUserNameFromAdmin } = require("../helpers/general");

const addSecurityMoney = async (req, res, next) => {
    try {
        const { date, po_id, amount, method, security_deposit_status, payment_status, details } = req.body;
        const { error } = securityMoneyValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO security_monies(date, po_id, amount, method, security_deposit_status, payment_status, details, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        const insertValues = [
            date,
            po_id,
            amount,
            method,
            security_deposit_status,
            payment_status,
            details,
            created_by,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Security money added successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Security money added successfully",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSecurityMoney = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (security_monies.amount LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT security_monies.*, purchase_orders.po_number FROM security_monies LEFT JOIN purchase_orders ON purchase_orders.id = security_monies.po_id ${search_value} ORDER BY security_monies.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            let securityDepositStatus = "";
            let paymentStatus = "";
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                if (row.securityDepositStatus == "1") {
                    securityDepositStatus = "Partially Received";
                } else if (row.securityDepositStatus == "2") {
                    securityDepositStatus = "Transit";
                } else {
                    securityDepositStatus = "Received";
                }

                // payment status
                if (row.payment_status == "1") {
                    paymentStatus = "pending";
                } else if (row.payment_status == "2") {
                    paymentStatus = "paid";
                } else {
                    paymentStatus = "unpaid";
                }

                // created by details
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const created_by_name = createdBy[0].name;

                finalData.push({
                    id: row.id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    po_id: row.po_id,
                    amount: row.amount,
                    method: row.method,
                    security_deposit_status: securityDepositStatus,
                    security_deposit_status_id: row.security_deposit_status,
                    payment_status: paymentStatus,
                    payment_status_id: row.payment_status,
                    details: row.details,
                    created_by: created_by_name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    po_number: row.po_number,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "fetched successfully",
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

const getSecurityMoneyDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const selectQuery = `SELECT security_monies.*, purchase_orders.po_number FROM security_monies LEFT JOIN purchase_orders ON purchase_orders.id = security_monies.po_id WHERE security_monies.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            let securityDepositStatus = "";
            let paymentStatus = "";

            for (const row of queryResult) {
                if (row.securityDepositStatus == "1") {
                    securityDepositStatus = "Partially Received";
                } else if (row.securityDepositStatus == "2") {
                    securityDepositStatus = "Transit";
                } else {
                    securityDepositStatus = "Received";
                }

                // payment status
                if (row.payment_status == "1") {
                    paymentStatus = "pending";
                } else if (row.payment_status == "2") {
                    paymentStatus = "paid";
                } else {
                    paymentStatus = "unpaid";
                }

                // created by details
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const created_by_name = createdBy[0].name;

                finalData.push({
                    id: row.id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    po_id: row.po_id,
                    amount: row.amount,
                    method: row.method,
                    security_deposit_status: securityDepositStatus,
                    security_deposit_status_id: row.security_deposit_status,
                    payment_status: paymentStatus,
                    payment_status_id: row.payment_status,
                    details: row.details,
                    created_by: created_by_name,
                    created_at: moment(row.created_at).format("DD-MM-YY HH:mm:ss A"),
                    po_number: row.po_number,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "fetched successfully",
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

const updateSecurityMoney = async (req, res, next) => {
    try {
        const { date, po_id, amount, method, security_deposit_status, payment_status, details, id } = req.body;
        const { error } = securityMoneyValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE security_monies SET date = ?, po_id = ?, amount = ?, method = ?, security_deposit_status = ?, payment_status = ?, details = ?, updated_by = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        const updateValues = [
            date,
            po_id,
            amount,
            method,
            security_deposit_status,
            payment_status,
            details,
            updated_by,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Security money updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Security money not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteSecurityMoneyDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const deleteQuery = `DELETE FROM security_monies WHERE id = ?`;

        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Security money detail deleted successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Security money detail not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addSecurityMoney,
    getAllSecurityMoney,
    getSecurityMoneyDetailById,
    updateSecurityMoney,
    deleteSecurityMoneyDetailById,
};

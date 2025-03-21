var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { billingTypeValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedUserNameFromAdmin } = require("../helpers/general");

const createBillingType = async (req, res, next) => {
    try {
        const { name, status } = req.body;

        const { error } = billingTypeValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = "INSERT INTO billing_types(name, status, created_by) VALUES(?, ?, ?)";

        const created_by = req.user.user_id;
        const insertValues = [name, status, created_by];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Billing type created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Error! billing type not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllBillingTypes = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (billing_types.name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT * FROM billing_types ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            let statusValue = "";
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getCreatedByDetails = await getCreatedUserNameFromAdmin(row.created_by);
                // status
                if (row.status == "1") {
                    statusValue = "Active";
                } else {
                    statusValue = "Inactive";
                }

                finalData.push({
                    id: row.id,
                    name: row.name,
                    status: statusValue,
                    created_by: getCreatedByDetails[0].name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY HH:mm:ss A"),
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

const getBillingTypesById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT * FROM billing_types WHERE id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            let statusValue = "";

            for (const row of queryResult) {
                const getCreatedByDetails = await getCreatedUserNameFromAdmin(row.created_by);
                // status
                if (row.status == "1") {
                    statusValue = "Active";
                } else {
                    statusValue = "Inactive";
                }

                finalData.push({
                    id: row.id,
                    name: row.name,
                    status: statusValue,
                    created_by: getCreatedByDetails[0].name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY HH:mm:ss A"),
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
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

const updateBillingType = async (req, res, next) => {
    try {
        const { name, status, id } = req.body;

        const { error } = billingTypeValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = "UPDATE billing_types SET name = ?, status = ?, updated_by = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        const updateValues = [name, status, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Billing type updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Error! billing type not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const removeBillingTypeById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM billing_types WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Billing type deleted successfully",
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

module.exports = {
    createBillingType,
    getAllBillingTypes,
    getBillingTypesById,
    updateBillingType,
    removeBillingTypeById,
};

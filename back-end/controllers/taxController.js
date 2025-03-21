var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { taxValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedUserNameFromAdmin } = require("../helpers/general");

const createTaxDetails = async (req, res, next) => {
    try {
        const { billing_type_id, name, value, status } = req.body;
        const { error } = taxValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = "INSERT INTO taxes(billing_type_id, name, value, status, created_by) VALUES(?, ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        const insertValues = [billing_type_id, name, value, status, created_by];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Taxes created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! taxes not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllTaxes = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (billing_types.name LIKE '%${searchData}%' OR taxes.name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT taxes.*, billing_types.name as billing_name FROM taxes LEFT JOIN billing_types ON billing_types.id = taxes.billing_type_id ${search_value} ORDER BY taxes.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getCreatedByDetails = await getCreatedUserNameFromAdmin(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_type_id: row.billing_type_id,
                    name: row.name,
                    billing_name: row.billing_name,
                    value: row.value,
                    status: row.status,
                    created_by: getCreatedByDetails[0].name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY"),
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

const getTaxesDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT taxes.*, billing_types.name as billing_name FROM taxes LEFT JOIN billing_types ON billing_types.id = taxes.billing_type_id WHERE taxes.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const getCreatedByDetails = await getCreatedUserNameFromAdmin(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_type_id: row.billing_type_id,
                    name: row.name,
                    billing_name: row.billing_name,
                    value: row.value,
                    status: row.status,
                    created_by: getCreatedByDetails[0].name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY"),
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

const updateTaxDetails = async (req, res, next) => {
    try {
        const { billing_type_id, name, value, status, id } = req.body;
        const { error } = taxValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE taxes SET billing_type_id = ?, name = ?, value = ?, status = ?, updated_by = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        const updateValues = [billing_type_id, name, value, status, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Taxes updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! taxes not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const removeTaxById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM taxes WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Tax deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during deletion of tax",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { createTaxDetails, getAllTaxes, getTaxesDetailById, updateTaxDetails, removeTaxById };

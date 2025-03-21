var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails } = require("../helpers/general");
const e = require("express");

const createCategory = async (req, res, next) => {
    try {
        const { category_name, status } = req.body;
        const categoryValidation = Joi.object({
            category_name: Joi.string().required(),
            status: Joi.required(),
        });

        const { error } = categoryValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = "INSERT INTO categories(category_name, status, created_by) VALUES(?, ?, ?)";
        const created_by = req.user.user_id;
        const insertValues = [category_name, status, created_by];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Category created successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong with your request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCategory = async (req, res, next) => {
    try {
        const hasDropdown = req.query.isDropdown === "true" || false;

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (categories.category_name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT categories.* FROM categories ${search_value} ORDER BY categories.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        let queryResult;
        let fetchDropdownData = false;

        if (hasDropdown) {
            fetchDropdownData = true;
        }

        if (fetchDropdownData) {
            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
            queryResult = await db.query(modifiedQueryString);

            if (queryResult.length > process.env.VALUE_ZERO) {
                var finalData = [];

                for (const row of queryResult) {
                    const created_by_detail = await getCreatedByDetails(row.created_by);

                    finalData.push({
                        id: row.id,
                        category_name: row.category_name,
                    });
                }
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData,
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Data not found",
                });
            }
        } else {
            queryResult = await db.query(selectQuery);
            // remove after order by
            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);

            if (queryResult.length > process.env.VALUE_ZERO) {
                var finalData = [];
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                for (const row of queryResult) {
                    const created_by_detail = await getCreatedByDetails(row.created_by);

                    finalData.push({
                        id: row.id,
                        category_name: row.category_name,
                        status: row.status,
                        created_by: row.created_by,
                        created_by_name: created_by_detail.name,
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
        }

        //const queryResult = await db.query(selectQuery);
    } catch (error) {
        return next(error);
    }
};

const getCategoryDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT categories.* FROM categories WHERE id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const created_by_detail = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    category_name: row.category_name,
                    status: row.status,
                    created_by: row.created_by,
                    created_by_name: created_by_detail.name,
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

const updateCategory = async (req, res, next) => {
    try {
        const { category_name, status, id } = req.body;
        const categoryValidation = Joi.object({
            category_name: Joi.string().required(),
            status: Joi.required(),
            id: Joi.required(),
        });

        const { error } = categoryValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = "UPDATE categories SET category_name = ?, status = ?, updated_by = ? WHERE id = ?";
        const updated_by = req.user.user_id;
        const updateValues = [category_name, status, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Category updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong with your request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = await db.query("DELETE FROM categories WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Category deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createCategory,
    getAllCategory,
    getCategoryDetailById,
    updateCategory,
    deleteCategoryById,
};

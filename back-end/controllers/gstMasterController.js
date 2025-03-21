var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { fundRequestValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getUserDetails, getCreatedByDetails } = require("../helpers/general");
const { getItemDetailsById } = require("../helpers/commonHelper");

const createGstMasters = async (req, res, next) => {
    try {
        const { title, percentage } = req.body;
        const gstValidate = Joi.object({
            title: Joi.string().required(),
            percentage: Joi.number().required(),
        });

        const { error } = gstValidate.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`INSERT INTO gst_master(title, percentage)VALUES(?, ?)`, [
            title,
            percentage,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Gst details saved successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGstMasterData = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["title", "percentage"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM gst_master ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;
        const units = await db.query(query);

        if (units.length > 0) {
            var finalData = [];
            const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of units) {
                finalData.push({
                    id: row.id,
                    title: row.title,
                    percentage: row.percentage,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res
                .status(200)
                .json({ status: true, message: "Data found", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getGstMasterDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT * FROM gst_master WHERE id= ?`;
        const units = await db.query(query, [id]);

        if (units.length > 0) {
            var finalData = [];

            for (const row of units) {
                finalData.push({
                    id: row.id,
                    title: row.title,
                    percentage: row.percentage,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res.status(200).json({ status: true, message: "Data found", data: finalData[0] });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateGstMasters = async (req, res, next) => {
    try {
        const { title, percentage, id } = req.body;
        const gstValidate = Joi.object({
            title: Joi.string().required(),
            percentage: Joi.number().required(),
            id: Joi.number().required(),
        });

        const { error } = gstValidate.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`UPDATE gst_master SET title = ?, percentage = ? where id = ?`, [
            title,
            percentage,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Gst details updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteGstMasterDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }
        const query = `DELETE FROM gst_master WHERE id= ?`;
        const units = await db.query(query, [id]);

        if (units.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "Gst details deleted successfully" });
        } else {
            return res
                .status(200)
                .json({ status: false, message: "Error! something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const getGstDetailsOnStateId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT * FROM gst_details WHERE state_id= ?`;
        const units = await db.query(query, [id]);

        if (units.length > 0) {
            var finalData = [];

            for (const row of units) {
                finalData.push({
                    id: row.id,
                    state_id: row.state_id,
                    gst_details: JSON.parse(row.gst_details),
                });
            }

            return res.status(200).json({ status: true, message: "Data found", data: finalData[0] });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllGstMasterDataForDropdown = async (req, res, next) => {
    try {
        const query = `SELECT * FROM gst_master`;
        const units = await db.query(query);

        if (units.length > 0) {
            var finalData = [];

            for (const row of units) {
                finalData.push({
                    id: row.id,
                    title: row.title,
                    percentage: row.percentage,
                });
            }

            return res.status(200).json({ status: true, message: "Data found", data: finalData });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createGstMasters,
    getAllGstMasterData,
    getGstMasterDetailsById,
    updateGstMasters,
    deleteGstMasterDetailsById,
    getGstDetailsOnStateId,
    getAllGstMasterDataForDropdown,
};

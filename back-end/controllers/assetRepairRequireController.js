require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger, assetsValidationScheme } = require("../helpers/validation");
const { calculatePagination, getUserDetails, getCreatedByDetails } = require("../helpers/general");
const Joi = require("joi");
let moment = require("moment");
const { createAssetTimeline } = require("./assetTimelineController");

const createRepairRequest = async (req, res, next) => {
    try {
        const { asset_id, label, description } = req.body;
        const validationSchema = Joi.object({
            asset_id: Joi.number().required(),
            label: Joi.number().required(),
            description: Joi.string().required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const requestData = {
            asset_id,
            label,
            description,
            created_by: req.user.user_id,
        };
        const queryResult = await db.query(`INSERT INTO asset_requiring_repairs SET ? `, [requestData]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request submitted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllRepairRequestedAssetList = async (req, res, next) => {
    try {
        //pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["assets.asset_name", "asset_requiring_repairs.description"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY asset_requiring_repairs.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT asset_requiring_repairs.*, assets.asset_name, assets.asset_model_number FROM asset_requiring_repairs LEFT JOIN assets ON assets.id = asset_requiring_repairs.asset_id ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by for total records
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            var finalData = [];

            for (const row of queryResult) {
                const requested_by_details = await getCreatedByDetails(row.created_by);
                const viewed_by_details = await getCreatedByDetails(row.viewed_by);

                finalData.push({
                    id: row.id,
                    asset_id: row.asset_id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    label: row.label,
                    description: row.description,
                    requested_by: requested_by_details ? requested_by_details.name : "",
                    requested_at: moment(row.requested_at).format("YYYY-MM-DD HH:mm:ss A"),
                    viewed_by: row.viewed_by,
                    viewed_by_name: viewed_by_details ? viewed_by_details.name : "",
                    viewed_at: moment(row.viewed_at).format("YYYY-MM-DD HH:mm:ss A"),
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

const getSingleRepairRequestedAssetListDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error.message,
            });
        }

        const query = `SELECT asset_requiring_repairs.*, assets.asset_name, assets.asset_model_number FROM asset_requiring_repairs LEFT JOIN assets ON assets.id = asset_requiring_repairs.asset_id WHERE asset_requiring_repairs.id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const viewed_by_details = await getCreatedByDetails(row.viewed_by);

                finalData.push({
                    id: row.id,
                    asset_id: row.asset_id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    label: row.label,
                    description: row.description,
                    viewed_by: row.viewed_by,
                    viewed_by_name: viewed_by_details.name,
                    viewed_at: moment(row.viewed_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: finalData,
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

const updateRepairRequestDetails = async (req, res, next) => {
    try {
        const { asset_id, label, description, id } = req.body;
        const validationSchema = Joi.object({
            asset_id: Joi.number().required(),
            label: Joi.number().required(),
            description: Joi.string().required(),
            id: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const requestData = {
            asset_id,
            label,
            description,
            updated_by: req.user.user_id,
            updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        const queryResult = await db.query(`UPDATE asset_requiring_repairs SET ? WHERE id = ?`, [requestData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteRepairRequest = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQueryResult = await db.query(`DELETE FROM asset_requiring_repairs WHERE id =? `, [id]);

        if (deleteQueryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllAssignedAssetList = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;

        const queryResult = await db.query(`SELECT id, asset_name, asset_model_number, asset_uin_number FROM assets`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assets assigned",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Assets not assigned",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const markRequestViewed = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const viewed_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const markData = {
            viewed_by: req.user.user_id,
            viewed_at: viewed_at,
        };
        const markViewedQueryResult = await db.query(`UPDATE asset_requiring_repairs SET ? WHERE id = ?`, [
            markData,
            id,
        ]);

        if (markViewedQueryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request mark viewed successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const AssignedRequest = async (req, res, next) => {
    try {
        const { id, assign_to } = req.body;

        const validationSchema = Joi.object({
            id: Joi.number().required(),
            assign_to: Joi.number().required(),
        });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const assignData = {
            assign_to,
            assign_by: req.user.user_id,
            assign_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        const assignQueryResult = await db.query(`UPDATE asset_requiring_repairs SET ? WHERE id = ?`, [assignData, id]);

        if (assignQueryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request assign successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createRepairRequest,
    getAllRepairRequestedAssetList,
    getSingleRepairRequestedAssetListDetails,
    updateRepairRequestDetails,
    deleteRepairRequest,
    getAllAssignedAssetList,
    markRequestViewed,
    AssignedRequest,
};

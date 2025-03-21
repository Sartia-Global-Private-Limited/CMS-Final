require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger, assetsValidationScheme } = require("../helpers/validation");
const { calculatePagination, getUserDetails, getCreatedByDetails } = require("../helpers/general");
const Joi = require("joi");
let moment = require("moment");
const { createAssetTimeline } = require("./assetTimelineController");

const createAssets = async (req, res, next) => {
    try {
        const {
            asset_name,
            asset_model_number,
            asset_uin_number,
            asset_price,
            asset_purchase_date,
            asset_warranty_guarantee_start_date,
            asset_warranty_guarantee_end_date,
            asset_warranty_guarantee_value,
            asset_supplier_id,
            asset_status,
        } = req.body;

        const { error } = assetsValidationScheme.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        var storePath = "";

        if (req.files != null) {
            const image = req.files.asset_image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/assets/" + imageName;
            storePath = "/assets/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message });
            });
        }

        const created_by = req.user.user_id;
        const queryResult = await db.query(
            `INSERT INTO assets 
            (asset_name, asset_model_number, asset_uin_number, asset_price, asset_purchase_date, asset_warranty_guarantee_start_date, asset_warranty_guarantee_end_date, asset_warranty_guarantee_value, asset_supplier_id, asset_status, asset_image, asset_created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                asset_name,
                asset_model_number,
                asset_uin_number,
                asset_price,
                asset_purchase_date,
                asset_warranty_guarantee_start_date,
                asset_warranty_guarantee_end_date,
                asset_warranty_guarantee_value,
                asset_supplier_id,
                asset_status,
                storePath,
                created_by,
            ]
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assets created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something  went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// get all stored assets based on status
const getAllStoredAssets = async (req, res, next) => {
    try {
        //pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || "";
        let searchConditions = "";

        if (searchData != null && searchData != "") {
            searchConditions += `WHERE (
            assets.asset_name LIKE '%${searchData}%'
            OR assets.asset_model_number LIKE '%${searchData}%'
            OR suppliers.supplier_name LIKE '%${searchData}%'
            )`;
        }

        /** if status is provided then check if search value is also provided or not  */
        status
            ? searchConditions
                ? (searchConditions += ` AND assets.status = ${status}`)
                : (searchConditions += `WHERE assets.status = ${status} `)
            : "";

        const orderLimitQuery = `ORDER BY assets.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const query = `SELECT assets.*, suppliers.supplier_name 
        FROM assets 
        LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id 
        ${searchConditions}
        ${orderLimitQuery}`;

        const queryResult = await db.query(query);
        // remove order by for total records
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var finalData = [];
            let asset_assign_status = "";

            for (const row of queryResult) {
                if (row.asset_assigned_to != null) {
                    asset_assign_status = "assigned";
                } else {
                    asset_assign_status = "not assigned";
                }

                finalData.push({
                    id: row.id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    asset_uin_number: row.asset_uin_number,
                    asset_price: row.asset_price,
                    asset_purchase_date: moment(row.asset_purchase_date).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    asset_status: row.asset_status,
                    asset_created_at: moment(row.asset_created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    supplier_name: row.supplier_name,
                    asset_assign_status,
                    status: row.status,
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

const getSingleStoredAssetDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT assets.*, suppliers.supplier_name FROM assets LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id WHERE assets.id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var asset_assign_status = "";
            var asset_assign_to = "";
            var asset_assign_at = "";
            var asset_assign_by = "";

            for (const row of queryResult) {
                if (row.asset_assigned_to != null) {
                    // get assigned details from
                    const asset_assign_to_details = await getUserDetails(row.asset_assigned_to);
                    const asset_assign_by_details = await getCreatedByDetails(row.asset_assigned_by);
                    asset_assign_status = "assigned";
                    asset_assign_to = asset_assign_to_details[0].name;
                    asset_assign_at = moment(row.asset_assigned_at).format("YYYY-MM-DD");
                    asset_assign_by = asset_assign_by_details.name;
                } else {
                    asset_assign_status = "not assigned";
                }

                finalData.push({
                    id: row.id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    asset_uin_number: row.asset_uin_number,
                    asset_price: row.asset_price,
                    asset_purchase_date: moment(row.asset_purchase_date).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    asset_status: row.asset_status,
                    asset_created_at: moment(row.asset_created_at),
                    supplier_name: row.supplier_name,
                    asset_image: row.asset_image,
                    asset_assign_status: asset_assign_status,
                    asset_assign_to: asset_assign_to,
                    asset_assign_at: asset_assign_at,
                    asset_assign_by: asset_assign_by,
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

const updateStoredAssetDetails = async (req, res, next) => {
    try {
        const {
            asset_name,
            asset_model_number,
            asset_uin_number,
            asset_price,
            asset_purchase_date,
            asset_warranty_guarantee_start_date,
            asset_warranty_guarantee_end_date,
            asset_warranty_guarantee_value,
            asset_supplier_id,
            asset_status,
            image,
            id,
        } = req.body;

        const { error } = assetsValidationScheme.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        var storePath = "";

        if (req.files != null) {
            const image = req.files.asset_image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/assets/" + imageName;
            storePath = "/assets/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message });
            });
        } else {
            storePath = image;
        }

        const updated_by = req.user.user_id;
        const updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(
            `UPDATE assets SET asset_name = ?, asset_model_number = ?, asset_uin_number = ?, asset_price = ?, asset_purchase_date = ?, asset_warranty_guarantee_start_date = ?, asset_warranty_guarantee_end_date = ?, asset_warranty_guarantee_value = ?, asset_supplier_id = ?, asset_status = ?, asset_image = ?,  asset_updated_by = ?, asset_updated_at = ? WHERE id = ?`,
            [
                asset_name,
                asset_model_number,
                asset_uin_number,
                asset_price,
                asset_purchase_date,
                asset_warranty_guarantee_start_date,
                asset_warranty_guarantee_end_date,
                asset_warranty_guarantee_value,
                asset_supplier_id,
                asset_status,
                storePath,
                updated_by,
                updated_at,
                id,
            ]
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assets updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something  went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteAssets = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = await db.query("DELETE FROM assets WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Asset deleted successfully",
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

const assignAssetToUsers = async (req, res, next) => {
    try {
        const { user_id, asset_id, notes } = req.body;

        const validationSchema = Joi.object({
            user_id: Joi.number().required(),
            asset_id: Joi.number().required(),
            notes: Joi.string().required(),
        });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error.message,
            });
        }

        //assigned query
        const asset_assigned_by = req.user.user_id;
        const asset_assigned_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const assignedQuery = await db.query(
            `UPDATE assets SET asset_assigned_to = ?, asset_assigned_by = ?, asset_assigned_at = ?, status = ? WHERE id = ?`,
            [user_id, asset_assigned_by, asset_assigned_at, "4", asset_id]
        );

        if (assignedQuery.affectedRows > process.env.VALUE_ZERO) {
            // insert data in asset timeline
            const asset_data = {
                asset_id,
                asset_assigned_to: user_id,
                asset_assigned_by,
                asset_assigned_at,
                notes,
            };
            const assetTimeLine = await createAssetTimeline(asset_data);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Asset assigned successfully",
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

const getAllAssignedAssets = async (req, res, next) => {
    try {
        //pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["assets.asset_name", "suppliers.supplier_name"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY assets.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT assets.*, suppliers.supplier_name FROM assets LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id WHERE assets.asset_assigned_to IS NOT NULL ${
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
                finalData.push({
                    id: row.id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    asset_uin_number: row.asset_uin_number,
                    asset_price: row.asset_price,
                    asset_purchase_date: moment(row.asset_purchase_date).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    asset_status: row.asset_status,
                    asset_created_at: moment(row.asset_created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    supplier_name: row.supplier_name,
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

// idle assets module starts

const getAllIdleAssets = async (req, res, next) => {
    try {
        //pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["assets.asset_name", "suppliers.supplier_name"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY assets.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT assets.*, suppliers.supplier_name FROM assets LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id WHERE assets.asset_assigned_to IS NULL ${
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
                finalData.push({
                    id: row.id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    asset_uin_number: row.asset_uin_number,
                    asset_price: row.asset_price,
                    asset_purchase_date: moment(row.asset_purchase_date).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    asset_status: row.asset_status,
                    asset_created_at: moment(row.asset_created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    supplier_name: row.supplier_name,
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

// changes by nilanjan
// get all stored assets based on status
const getAllStoredAsset = async (req, res, next) => {
    try {
        //pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["assets.asset_name", "suppliers.supplier_name"];
        const status = req.query.status || "";
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY assets.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT assets.*, suppliers.supplier_name FROM assets LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id WHERE assets.asset_status = '${status}' ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")}` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by for total records
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var finalData = [];
            let asset_assign_status;

            for (const row of queryResult) {
                if (row.asset_assigned_to != null) {
                    asset_assign_status = "assigned";
                } else {
                    asset_assign_status = "not assigned";
                }

                finalData.push({
                    id: row.id,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    asset_uin_number: row.asset_uin_number,
                    asset_price: row.asset_price,
                    asset_purchase_date: moment(row.asset_purchase_date).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format("YYYY-MM-DD"),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    asset_status: row.asset_status,
                    asset_created_at: moment(row.asset_created_at).format("YYYY-MM-DD HH:mm:ss A"),
                    supplier_name: row.supplier_name,
                    asset_assign_status: asset_assign_status,
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

// approve reject assets based on status
const approveRejectAssetsByStatusAndById = async (req, res, next) => {
    try {
        const status = req.query.status;
        const id = req.query.id;

        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE assets SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Assets approved successfully" : "Assets rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: "Invalid status" });
        }
    } catch (error) {
        return next(error);
    }
};

const createAssetsRepairRequest = async (req, res, next) => {
    try {
        const { id, status, description } = req.body;

        const validationSchema = Joi.object({
            id: Joi.number().required(),
            status: Joi.number().required(),
            description: Joi.string().required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        if (status == "5") {
            queryResult = await db.query(
                `Update assets set status = '${status}', repair_descriptions = '${description}' WHERE id = '${id}'`
            );
        } else {
            queryResult = await db.query(
                `Update assets set status = '${status}', scrap_descriptions = '${description}' WHERE id = '${id}'`
            );
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request submitted successfully",
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

module.exports = {
    createAssets,
    getAllStoredAssets,
    getSingleStoredAssetDetails,
    updateStoredAssetDetails,
    deleteAssets,
    assignAssetToUsers,
    getAllAssignedAssets,
    getAllIdleAssets,
    approveRejectAssetsByStatusAndById,
    createAssetsRepairRequest,
};

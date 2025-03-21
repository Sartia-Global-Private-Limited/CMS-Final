require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, getUserDetails } = require("../helpers/general");
const Joi = require("joi");
let moment = require("moment");

async function createAssetTimeline(asset_data) {
    try {
        const insertQuery = await db.query(
            `INSERT INTO asset_timelines(asset_id, asset_assigned_to, asset_assigned_by, asset_assigned_at, notes) VALUES(?, ?, ?, ?, ?)`,
            [
                asset_data.asset_id,
                asset_data.asset_assigned_to,
                asset_data.asset_assigned_by,
                asset_data.asset_assigned_at,
                asset_data.notes,
            ]
        );

        if (insertQuery.affectedRows > process.env.VALUE_ZERO) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error.message;
    }
}

const getAssetTimelineHistory = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(
            `SELECT asset_timelines.id as timeline_id, asset_timelines.asset_id, asset_timelines.asset_assigned_to, asset_timelines.asset_assigned_by, asset_timelines.asset_assigned_at, asset_timelines.notes, assets.asset_name, assets.asset_model_number FROM asset_timelines LEFT JOIN assets ON assets.id = asset_timelines.asset_id WHERE asset_timelines.asset_id = ? ORDER BY asset_timelines.id DESC`,
            [id]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            const colors = ["danger", "info", "warning", "success", "secondary", "primary", "light"];

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const asset_assigned_to_details = await getCreatedByDetails(row.asset_assigned_to);
                const asset_assigned_by_details = await getCreatedByDetails(row.asset_assigned_by);

                const colorIndex = i % colors.length;
                const color = colors[colorIndex];

                finalData.push({
                    timeline_id: row.timeline_id,
                    asset_id: row.asset_id,
                    asset_assigned_to: row.asset_assigned_to,
                    asset_assigned_to_name: asset_assigned_to_details.name,
                    asset_assigned_to_image: asset_assigned_to_details.image,
                    asset_assigned_by: row.asset_assigned_by,
                    asset_assigned_by_name: asset_assigned_by_details.name,
                    asset_assigned_by_image: asset_assigned_by_details.image,
                    asset_assigned_at: moment(row.asset_assigned_at).format("YYYY-MM-DD HH:mm:ss A"),
                    notes: row.notes,
                    asset_name: row.asset_name,
                    asset_model_number: row.asset_model_number,
                    color: color, // Adding the color property
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "data found",
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

const getAssetWithTimelineHistory = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery =
            "SELECT assets.*, suppliers.supplier_name FROM assets LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id WHERE assets.id = ?";

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var asset_assign_status = "";
            var asset_assign_to = "";
            var asset_assign_at = "";
            var asset_assign_by = "";

            for (const row of queryResult) {
                const colors = ["danger", "info", "warning", "success", "secondary", "primary", "light"];

                const getAssetTimelineHistory = await db.query(
                    `SELECT asset_timelines.id as timeline_id, asset_timelines.asset_id, asset_timelines.asset_assigned_to, asset_timelines.asset_assigned_by, asset_timelines.asset_assigned_at, asset_timelines.notes, assets.asset_name, assets.asset_model_number FROM asset_timelines LEFT JOIN assets ON assets.id = asset_timelines.asset_id WHERE asset_timelines.asset_id = ? ORDER BY asset_timelines.id DESC`,
                    [id]
                );

                if (getAssetTimelineHistory.length > process.env.VALUE_ZERO) {
                    for (let i = 0; i < getAssetTimelineHistory.length; i++) {
                        const asset = getAssetTimelineHistory[i];

                        //users details
                        const asset_assigned_to_details = await getCreatedByDetails(asset.asset_assigned_to);
                        const asset_assigned_by_details = await getCreatedByDetails(asset.asset_assigned_by);

                        asset.asset_assigned_at = moment(asset.asset_assigned_at).format("YYYY-MM-DD HH:mm:ss A");

                        // Assign colors sequentially based on index in the colors array
                        const colorIndex = i % colors.length;
                        asset.color = colors[colorIndex];
                        asset.asset_assigned_to_name = asset_assigned_to_details.name;
                        asset.asset_assigned_to_image = asset_assigned_to_details.image;
                        asset.asset_assigned_by_name = asset_assigned_by_details.name;
                        asset.asset_assigned_by_image = asset_assigned_by_details.image;
                    }
                }

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
                    asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start_date).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end_date).format(
                        "YYYY-MM-DD"
                    ),
                    asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
                    asset_supplier_id: row.asset_supplier_id,
                    supplier_name: row.supplier_name,
                    asset_status: row.asset_status,
                    asset_assigned_to: row.asset_assigned_to,
                    asset_assigned_by: row.asset_assigned_by,
                    asset_assigned_at: moment(row.asset_assigned_at).format("YYYY-MM-DD HH:mm:ss"),
                    asset_image: row.asset_image,
                    asset_created_at: moment(row.asset_created_at).format("YYYY-MM-DD HH:mm:ss"),
                    asset_assign_status: asset_assign_status,
                    asset_assign_to: asset_assign_to,
                    asset_assign_at: asset_assign_at,
                    asset_assign_by: asset_assign_by,
                    asset_timeline_history: getAssetTimelineHistory,
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

module.exports = { createAssetTimeline, getAssetTimelineHistory, getAssetWithTimelineHistory };

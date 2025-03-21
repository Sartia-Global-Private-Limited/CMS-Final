var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { measurementItemValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, getCreatedUserNameFromAdmin } = require("../helpers/general");

const saveMeasurementItems = async (req, res, next) => {
    try {
        // Same code as before to extract data
        const measurementItems = req.body; // Assuming an array of measurement items

        if (!Array.isArray(measurementItems) || measurementItems.length === 0) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Invalid measurement items data",
            });
        }

        const created_by = req.user.user_id;

        // Validate each measurement item
        for (const item of measurementItems) {
            const { error } = measurementItemValidation.validate(item);

            if (error) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: false,
                    message: error.message,
                });
            }
        }

        const insertQuery =
            "INSERT INTO measurement_items(measurement_id, po_id, complaint_id, item_id, unit_id, number, length, breadth, depth, quantity, total_quantity, rate, amount, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        for (const item of measurementItems) {
            const insertValues = [
                item.measurement_id,
                item.po_id,
                item.complaint_id,
                item.item_id,
                item.unit_id,
                item.number,
                item.length,
                item.breadth,
                item.depth,
                item.quantity,
                item.total_quantity,
                item.rate,
                item.amount,
                created_by,
            ];

            try {
                await db.query(insertQuery, insertValues);
            } catch (error) {
                return next(error);
                // Handle individual insert error here (optional)
                console.error("Error inserting measurement item:", error);
            }
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Measurement items created successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const getAllSavedMeasurementItems = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (purchase_orders.po_number LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT measurement_items.id as measurement_id_item_id, measurement_items.length, measurement_items.number, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate, measurement_items.amount, measurement_items.created_by, measurements.id as measurement_id, purchase_orders.po_number, complaints.complaint_unique_id as complaint_id, item_masters.name as item_name, units.name as unit_name, units.short_name as unit_short_name FROM measurement_items LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN purchase_orders ON purchase_orders.id = measurement_items.po_id LEFT JOIN complaints ON complaints.id = measurement_items.complaint_id LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id ${search_value} ORDER BY measurements.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

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

const getSavedMeasurementItemsById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT measurement_items.id as measurement_id_item_id, measurement_items.length, measurement_items.number, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate, measurement_items.amount, measurement_items.created_by, measurements.id as measurement_id, purchase_orders.po_number, complaints.complaint_unique_id as complaint_id, item_masters.name as item_name, units.name as unit_name, units.short_name as unit_short_name FROM measurement_items LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN purchase_orders ON purchase_orders.id = measurement_items.po_id LEFT JOIN complaints ON complaints.id = measurement_items.complaint_id LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id WHERE measurement_items.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
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

const updateMeasurementItems = async (req, res, next) => {
    try {
        // Same code as before to extract data
        const measurementItemsToUpdate = req.body; // Assuming an array of measurement items

        if (!Array.isArray(measurementItemsToUpdate) || measurementItemsToUpdate.length === 0) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Invalid measurement items data",
            });
        }

        const updated_by = req.user.user_id;

        // Validate each measurement item using your custom validation function
        for (const item of measurementItemsToUpdate) {
            const { error } = measurementItemValidation.validate(item);

            if (error) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: false,
                    message: error.message,
                });
            }
        }

        const updateQuery =
            "UPDATE measurement_items SET po_id = ?, complaint_id = ?, item_id = ?, unit_id = ?, number = ?, length = ?, breadth = ?, depth = ?, quantity = ?, total_quantity = ?, rate = ?, amount = ?, updated_by = ? WHERE measurement_id = ?";

        for (const item of measurementItemsToUpdate) {
            const updateValues = [
                item.po_id,
                item.complaint_id,
                item.item_id,
                item.unit_id,
                item.number,
                item.length,
                item.breadth,
                item.depth,
                item.quantity,
                item.total_quantity,
                item.rate,
                item.amount,
                updated_by,
                item.measurement_id,
            ];

            try {
                await db.query(updateQuery, updateValues);
            } catch (error) {
                return next(error);
                // Handle individual update error here (optional)
                console.error("Error updating measurement item:", error);
            }
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Measurement items updated successfully",
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    saveMeasurementItems,
    getAllSavedMeasurementItems,
    getSavedMeasurementItemsById,
    updateMeasurementItems,
};

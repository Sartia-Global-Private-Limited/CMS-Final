var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { holidayListValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, getUserDetails } = require("../helpers/general");

const requestItems = async (req, res, next) => {
    try {
        const { item_id, date, notes } = req.body;

        const itemRequestValidation = Joi.object({
            item_id: Joi.number().required(),
            date: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = itemRequestValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertData = {
            item_id,
            date,
            notes,
            created_by: req.user.user_id,
        };

        const queryResult = await db.query(`INSERT INTO item_requests SET ?`, [insertData]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Item requested successfully",
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

const getAllRequestedItemList = async (req, res, next) => {
    try {
        // Pagination code
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["item_requests.notes", "item_masters.name", "item_requests.date"];
        const searchConditions = [];
        let loggedUserCondition = "";
        const loggedUserType = req.user.user_type;
        var checkUserRoleTypeForRequestByDetails = false;

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        if (loggedUserType != process.env.CONTRACTOR_ROLE_ID) {
            loggedUserCondition = `AND item_requests.created_by = '${req.user.user_id}'`;
        }

        const orderLimitQuery = `ORDER BY item_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT item_requests.*, item_masters.name as item_name, item_masters.image as item_image, item_masters.id as item_id FROM item_requests LEFT JOIN item_masters ON item_masters.id = item_requests.item_id WHERE item_requests.request_status='0' ${loggedUserCondition} ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // Remove ORDER BY and LIMIT for total pagination count
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = {};
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            // Create an array to store requested items
            finalData = [];

            for (const row of queryResult) {
                const requestedByDetails = await getUserDetails(row.created_by);

                // Create an object for each requested item
                const requestedItem = {
                    id: row.id,
                    item_name: row.item_name,
                    item_image: row.item_image,
                    item_id: row.item_id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    notes: row.notes,
                    request_status: row.request_status,
                    requested_by: "",
                    requested_by_image: "",
                    requested_by_employee_id: "",
                };

                if (loggedUserType == process.env.CONTRACTOR_ROLE_ID) {
                    requestedItem.requested_by = requestedByDetails[0].name ? requestedByDetails[0].name : "-";
                    requestedItem.requested_by_image = requestedByDetails[0].image ? requestedByDetails[0].image : null;
                    requestedItem.requested_by_employee_id = requestedByDetails[0].employee_id
                        ? requestedByDetails[0].employee_id
                        : null;
                    checkUserRoleTypeForRequestByDetails = true;
                } else {
                    checkUserRoleTypeForRequestByDetails = false;
                }

                // Push the requested item to the array
                finalData.push(requestedItem);
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                checkUserRoleTypeForRequestByDetails: checkUserRoleTypeForRequestByDetails,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getRequestedItemDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const query = `SELECT item_requests.*, item_masters.name as item_name, item_masters.image as item_image, item_masters.id as item_id FROM item_requests LEFT JOIN item_masters ON item_masters.id = item_requests.item_id WHERE item_requests.id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            const loggedUserType = req.user.user_type;

            for (const row of queryResult) {
                // requested by details
                const requestedByDetails = await getUserDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    item_name: row.item_name,
                    item_image: row.item_image,
                    item_id: row.item_id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    notes: row.notes,
                    request_status: row.request_status,
                    requested_by: requestedByDetails[0].name ? requestedByDetails[0].name : "-",
                    requested_by_image: requestedByDetails[0].image ? requestedByDetails[0].image : null,
                    requested_by_employee_id: requestedByDetails[0].employee_id
                        ? requestedByDetails[0].employee_id
                        : null,
                });

                if (row.status_action_by != null) {
                    const approvedDetails = await getCreatedByDetails(row.status_action_by);

                    // Add approved details to the existing object in finalData
                    finalData[0].approved_by_name = approvedDetails.name ? approvedDetails.name : "-";
                    finalData[0].approved_by_image = approvedDetails.image ? approvedDetails.image : null;
                    finalData[0].approved_by_employee_id = approvedDetails.employee_id
                        ? approvedDetails.employee_id
                        : null;
                    finalData[0].approved_at = moment(row.status_action_at).format("YYYY-MM-DD HH:mm:ss A");

                    if (loggedUserType == process.env.CONTRACTOR_ROLE_ID) {
                        finalData[0].checkUserRoleTypeForRequestByDetails = true;
                    } else {
                        finalData[0].checkUserRoleTypeForRequestByDetails = false;
                    }
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateRequestItemsDetails = async (req, res, next) => {
    try {
        const { item_id, date, notes, id } = req.body;

        const itemRequestValidation = Joi.object({
            item_id: Joi.number().required(),
            date: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = itemRequestValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateData = {
            item_id,
            date,
            notes,
            updated_by: req.user.user_id,
            updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        const queryResult = await db.query(`UPDATE item_requests SET ? WHERE id = ?`, [updateData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Requested item details updated successfully",
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

const deleteRequestedItemById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const query = `DELETE FROM item_requests WHERE id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Item deleted successfully",
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

const requestStatusChanged = async (req, res, next) => {
    try {
        const { id, value } = req.body;

        const statusChangeValidation = Joi.object({
            id: Joi.number().required(),
            value: Joi.number().required(),
        });

        const { error } = statusChangeValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const updateData = {
            request_status: value,
            status_action_by: req.user.user_id,
            status_action_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        const queryResult = await db.query(`UPDATE item_requests SET ? WHERE id = ?`, [updateData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            var status = "";
            if (value == "1") {
                status = "accepted";
            } else {
                status = "rejected";
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Item requests " + status + " successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong, please try again later.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedRequestedItemList = async (req, res, next) => {
    try {
        //pagination code for

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["item_requests.notes", "item_masters.name", "item_requests.date"];
        const searchConditions = [];
        let loggedUserCondition = "";
        const loggedUserType = req.user.user_type;
        var checkUserRoleTypeForRequestByDetails = false;

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        if (loggedUserType != process.env.CONTRACTOR_ROLE_ID) {
            loggedUserCondition = `AND item_requests.created_by = '${req.user.user_id}'`;
        }
        const orderLimitQuery = `ORDER BY item_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT item_requests.*, item_masters.name as item_name, item_masters.image as item_image, item_masters.id as item_id FROM item_requests LEFT JOIN item_masters ON item_masters.id = item_requests.item_id WHERE item_requests.request_status = '1' ${loggedUserCondition} ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by limit for totaL PAGINATION COUNT
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const approvedDetails = await getCreatedByDetails(row.status_action_by);

                finalData.push({
                    id: row.id,
                    item_name: row.item_name,
                    item_image: row.item_image,
                    item_id: row.item_id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    notes: row.notes,
                    request_status: row.request_status,
                    approved_by_name: approvedDetails.name ? approvedDetails.name : "-",
                    approved_by_image: approvedDetails.image ? approvedDetails.image : null,
                    approved_by_employee_id: approvedDetails.employee_id ? approvedDetails.employee_id : null,
                    approved_at: moment(row.status_action_at).format("YYYY-MM-DD HH:mm:ss A"),
                    created_by: row.created_by,
                });
            }

            // requested by details
            for (const value of finalData) {
                const requestedByDetails = await getUserDetails(value.created_by);
                if (loggedUserType == process.env.CONTRACTOR_ROLE_ID) {
                    value.requested_by = requestedByDetails[0].name ? requestedByDetails[0].name : "-";
                    value.requested_by_image = requestedByDetails[0].image ? requestedByDetails[0].image : null;
                    value.requested_by_employee_id = requestedByDetails[0].employee_id
                        ? requestedByDetails[0].employee_id
                        : null;
                    checkUserRoleTypeForRequestByDetails = true;
                } else {
                    checkUserRoleTypeForRequestByDetails = false;
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                checkUserRoleTypeForRequestByDetails: checkUserRoleTypeForRequestByDetails,
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllRejectedRequestedItemList = async (req, res, next) => {
    try {
        //pagination code for

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["item_requests.notes", "item_masters.name", "item_requests.date"];
        const searchConditions = [];
        let loggedUserCondition = "";
        const loggedUserType = req.user.user_type;
        var checkUserRoleTypeForRequestByDetails = false;

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        if (loggedUserType != process.env.CONTRACTOR_ROLE_ID) {
            loggedUserCondition = `AND item_requests.created_by = '${req.user.user_id}'`;
        }

        const orderLimitQuery = `ORDER BY item_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT item_requests.*, item_masters.name as item_name, item_masters.image as item_image, item_masters.id as item_id FROM item_requests LEFT JOIN item_masters ON item_masters.id = item_requests.item_id WHERE item_requests.request_status = '2' ${loggedUserCondition} ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by limit for totaL PAGINATION COUNT
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const approvedDetails = await getCreatedByDetails(row.status_action_by);

                finalData.push({
                    id: row.id,
                    item_name: row.item_name,
                    item_image: row.item_image,
                    item_id: row.item_id,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    notes: row.notes,
                    request_status: row.request_status,
                    approved_by_name: approvedDetails.name ? approvedDetails.name : "-",
                    approved_by_image: approvedDetails.image ? approvedDetails.image : null,
                    approved_by_employee_id: approvedDetails.employee_id ? approvedDetails.employee_id : null,
                    approved_at: moment(row.status_action_at).format("YYYY-MM-DD HH:mm:ss A"),
                    created_by: row.created_by,
                });
            }

            // requested by details
            for (const value of finalData) {
                const requestedByDetails = await getUserDetails(value.created_by);
                if (loggedUserType == process.env.CONTRACTOR_ROLE_ID) {
                    value.requested_by = requestedByDetails[0].name ? requestedByDetails[0].name : "-";
                    value.requested_by_image = requestedByDetails[0].image ? requestedByDetails[0].image : null;
                    value.requested_by_employee_id = requestedByDetails[0].employee_id
                        ? requestedByDetails[0].employee_id
                        : null;
                    checkUserRoleTypeForRequestByDetails = true;
                } else {
                    checkUserRoleTypeForRequestByDetails = false;
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                checkUserRoleTypeForRequestByDetails: checkUserRoleTypeForRequestByDetails,
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const approvedItemRequestAssignTo = async (req, res, next) => {
    try {
        const { id, user_id } = req.body;

        const statusChangeValidation = Joi.object({
            id: Joi.number().required(),
            user_id: Joi.number().required(),
        });

        const { error } = statusChangeValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const updateData = {
            item_assign_to: user_id,
            item_assign_by: req.user.user_id,
            item_assign_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        const queryResult = await db.query(`UPDATE item_requests SET ? WHERE id = ?`, [updateData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Requested item assigned successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong, please try again later.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getApprovedRequestDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const query = `SELECT item_requests.*, item_masters.name as item_name FROM item_requests LEFT JOIN item_masters ON item_masters.id = item_requests.item_id WHERE item_requests.id = ? AND item_requests.request_status = '1'`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const statusChangedByDetails = await getCreatedByDetails(row.status_action_by);
                var assign_to_name = "";
                var assign_by_name = "";
                if (row.item_assign_to != null) {
                    const assignToDetails = await getCreatedByDetails(row.item_assign_to);
                    assign_to_name = assignToDetails.name;

                    const assignByDetails = await getCreatedByDetails(row.item_assign_by);
                    assign_by_name = assignByDetails.name;
                }

                finalData.push({
                    id: row.id,
                    item_name: row.item_name,
                    date: moment(row.date).format("YYYY-MM-DD"),
                    notes: row.notes,
                    request_status: row.request_status,
                    status_action_by: statusChangedByDetails.name,
                    status_action_at: moment(row.status_action_at).format("YYYY-MM-DD HH:mm:ss A"),
                    item_assign_to: assign_to_name,
                    item_assign_by: assign_by_name,
                    item_assign_at: moment(row.item_assign_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    requestItems,
    getAllRequestedItemList,
    getRequestedItemDetailById,
    updateRequestItemsDetails,
    deleteRequestedItemById,
    requestStatusChanged,
    getAllApprovedRequestedItemList,
    getAllRejectedRequestedItemList,
    approvedItemRequestAssignTo,
    getApprovedRequestDetailById,
};

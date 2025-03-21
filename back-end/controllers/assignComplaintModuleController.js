require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getUserDetails } = require("../helpers/general");
const Joi = require("joi");
let moment = require("moment");

const assignComplaintModule = async (req, res, next) => {
    try {
        const { module_id, module_type, assign_to, is_future_date_visible, assign_for } = req.body;
        const complaintAssignModuleValidation = Joi.object({
            module_id: Joi.number().required(),
            module_type: Joi.string().required(),
            assign_to: Joi.number().required(),
            is_future_date_visible: Joi.number().required(),
            assign_for: Joi.required(),
        });

        const { error } = complaintAssignModuleValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
                modal: false,
                type: "",
            });
        }

        // get all assigned data from the table

        const assignedData = await db.query("SELECT * FROM assign_complaint_modules");

        if (assignedData.length > process.env.VALUE_ZERO) {
            // incoming assign data for single
            const complaintData = [
                {
                    module_id: module_id,
                    module_type: module_type,
                    assign_for: assign_for,
                },
            ];

            if (complaintData[0].module_type == "complaint") {
                // check for single complaint assign is exist or not
                const result = await isComplaintDataExist(assignedData, complaintData);
                if (result[0].status) {
                    const getAssignToName = await getUserDetails(result[0].assign_to);

                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: "Complaint is already assigned to " + getAssignToName[0].name,
                        modal: false,
                        type: "",
                    });
                }
            }

            // check for outlet complaint assigned or not assigned

            if (complaintData[0].module_type == "outlet") {
                const isOutletComplaints = await isOutletComplaintsExist(complaintData);
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Outlet is already assigned",
                    modal: true,
                    data: isOutletComplaints,
                    type: "outlet",
                });
            }

            // check for sales area complaint assigned or not assigned

            if (complaintData[0].module_type == "sale_area") {
                const isSaleAreaOutlets = await isSaleAreaOutletsExist(complaintData);

                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Sale Area is already assigned",
                    modal: true,
                    data: isSaleAreaOutlets,
                    type: "sale_area",
                });
            }
        }

        const assignQuery = "INSERT INTO assign_complaint_modules SET ?";
        const assign_date = moment(new Date()).format("YYYY-MM-DD");
        const assign_by = req.user.user_id;
        const assignData = {
            module_id,
            module_type,
            assign_to,
            is_future_date_visible,
            assign_date,
            assign_by,
            assign_for,
        };

        const assignQueryResult = await db.query(assignQuery, [assignData]);

        if (assignQueryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assign successfully",
                modal: false,
                type: "",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong during request",
                modal: false,
                type: "",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAssignComplaintModuleOnUserId = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: user_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery =
            "SELECT module_id, module_type, assign_to, is_future_date_visible, assign_date FROM assign_complaint_modules WHERE assign_to = ?";

        const queryResult = await db.query(selectQuery, [user_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                row.assign_date = moment(row.assign_date).format("YYYY-MM-DD");
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: queryResult,
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

const assignMultipleComplaintModule = async (req, res, next) => {
    try {
        const { module_ids, module_type, assign_to, is_future_date_visible, assign_for } = req.body;

        const complaintAssignModuleValidation = Joi.object({
            module_ids: Joi.required(),
            module_type: Joi.string().required(),
            assign_to: Joi.number().required(),
            is_future_date_visible: Joi.number().required(),
            assign_for: Joi.required(),
        });

        const { error } = complaintAssignModuleValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
                modal: false,
            });
        }

        if (module_ids.length > process.env.VALUE_ZERO) {
            for (var i = 0; i < module_ids.length; i++) {
                const module_id = module_ids[i];

                const assignQuery = "INSERT INTO assign_complaint_modules SET ?";
                const assign_date = moment(new Date()).format("YYYY-MM-DD");
                const assign_by = req.user.user_id;
                const assignData = {
                    module_id,
                    module_type,
                    assign_to,
                    is_future_date_visible,
                    assign_date,
                    assign_by,
                    assign_for,
                };

                try {
                    await db.query(assignQuery, [assignData]);
                } catch (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Failed to assign complaint.",
                    });
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Complaints assigned successfully.",
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "No module_id provided.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// Function to check if complaint data exists in data
async function isComplaintDataExist(data, complaintData) {
    const result = [];

    for (const complaint of complaintData) {
        const matchedItem = data.find(
            (item) =>
                item.module_id === parseInt(complaint.module_id, 10) &&
                item.module_type === complaint.module_type &&
                item.assign_for === complaint.assign_for
        );

        if (matchedItem) {
            complaint.status = true;
            complaint.assign_to = matchedItem.assign_to;
        } else {
            complaint.status = false;
            complaint.assign_to = null;
        }

        result.push(complaint);
    }

    return result;
}

// check outlets complaints assigned or not assigned

async function isOutletComplaintsExist(outletData) {
    // get all complaint on outlet id
    const outlet_id = outletData[0].module_id;
    const assign_for = outletData[0].assign_for;

    const getAllComplaintOnOutlet = await db.query(
        `SELECT complaints.*, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE JSON_CONTAINS(outlet_id, '${outlet_id}', '$')`
    );

    const getAllAssignComplaint = await db.query(
        `SELECT module_id, module_type, assign_to, assign_for FROM assign_complaint_modules WHERE module_type = 'complaint'`
    );

    // Find matched and unmatched data
    const assigned = [];
    const unassigned = [];

    for (const complaint of getAllComplaintOnOutlet) {
        const matchedAssignment = getAllAssignComplaint.find(
            (assignment) => assignment.module_id === complaint.id && assignment.assign_for === assign_for
        );

        if (matchedAssignment) {
            const assignedData = await getUserDetails(matchedAssignment.assign_to);
            complaint.assign_user_name = assignedData[0].name;
            assigned.push(complaint);
        } else {
            unassigned.push(complaint);
        }
    }

    return {
        assigned,
        unassigned,
    };
}

// check sale area outlet is assigned or not assigned

async function isSaleAreaOutletsExist(outletData) {
    // get all complaint on outlet id
    const sale_area_id = outletData[0].module_id;
    const assign_for = outletData[0].assign_for;
    // const getAllOutletOfSaleArea = await db.query(
    //     `SELECT complaints.*, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE JSON_CONTAINS(sale_area_id, '${sale_area_id}', '$')`
    //     );

    var complaintSaleAreaOutlets = [];
    const getAllOutletOfSaleArea = await db.query(
        `SELECT id, complaint_unique_id,outlet_id, sale_area_id FROM complaints WHERE JSON_CONTAINS(sale_area_id, '${sale_area_id}', '$')`
    );

    for (const row of getAllOutletOfSaleArea) {
        complaintSaleAreaOutlets.push(row);
        // get outlet names
        const outletIds = JSON.parse(row.outlet_id);
        const commaSeparatedOutletIds = outletIds.join(",");
        const getOutlets = await db.query(`SELECT id, outlet_name FROM outlets WHERE id IN(?)`, [
            commaSeparatedOutletIds,
        ]);

        for (const outlet of getOutlets) {
            row.outlet_name = outlet.outlet_name;
        }

        // get sale area names
        const saleAreaIds = JSON.parse(row.sale_area_id);
        const commaSeparatedSaleAreaIds = saleAreaIds.join(",");
        const getSaleAreas = await db.query(`SELECT id, sales_area_name FROM sales_area WHERE id IN(?)`, [
            commaSeparatedSaleAreaIds,
        ]);

        for (const saleArea of getSaleAreas) {
            row.sale_area_name = saleArea.sales_area_name;
        }
    }

    const getAllAssignComplaint = await db.query(
        `SELECT id, module_id, module_type, assign_to, assign_for FROM assign_complaint_modules WHERE module_type = 'outlet'`
    );

    // Find matched and unmatched data
    const assigned = [];
    const unassigned = [];

    for (const outlet of complaintSaleAreaOutlets) {
        const matchedAssignment = getAllAssignComplaint.find(
            (assignment) => assignment.module_id === outlet.id && assignment.assign_for === assign_for
        );

        if (matchedAssignment) {
            const assignedData = await getUserDetails(matchedAssignment.assign_to);
            outlet.assign_user_name = assignedData[0].name;
            assigned.push(outlet);
        } else {
            unassigned.push(outlet);
        }
    }

    return {
        assigned,
        unassigned,
    };
}

module.exports = {
    assignComplaintModule,
    getAssignComplaintModuleOnUserId,
    assignMultipleComplaintModule,
};

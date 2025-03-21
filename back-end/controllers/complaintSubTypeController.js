var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { complaintTypeValidations, checkPositiveInteger } = require("../helpers/validation");
const {
    getZoneNameById,
    getRegionalNameById,
    getSaleAreaNameById,
    getDistrictById,
    getOutletById,
    getCompanyName,
} = require("../helpers/general");

const addComplaintSubType = async (req, res, next) => {
    try {
        const { complaint_type_name, energy_company_id } = req.body;

        const createdBy = req.user.user_id;
        const status = 1;
        const insertQuery = `INSERT INTO complaint_types (complaint_type_name, energy_company_id, created_by) VALUES ('${complaint_type_name}', '${energy_company_id}', '${createdBy}')`;

        db.query(insertQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Complaint Type Added successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllComplaintSubTypes = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM complaint_types`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if (searchData != null && searchData != "") {
            var selectQuery = `SELECT complaint_types.*, energy_companies.name as energy_company_name FROM complaint_types INNER JOIN energy_companies ON energy_companies.id = complaint_types.energy_company_id WHERE complaint_types.complaint_type_name LIKE '%${searchData}%' ORDER BY complaint_types.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            var selectQuery = `SELECT complaint_types.*, energy_companies.name as energy_company_name FROM complaint_types INNER JOIN energy_companies ON energy_companies.id = complaint_types.energy_company_id ORDER BY complaint_types.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                res.status(200).json({
                    status: true,
                    message: "Fetched successfully",
                    data: result,
                    pageDetails: pageDetails[0],
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getComplaintSubTypeById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM complaint_types WHERE id = '${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            result[0].energy_company_name = await getCompanyName(result[0].energy_company_id, 1)

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateComplaintSubType = async (req, res, next) => {
    try {
        const { complaint_type_name, energy_company_id, id } = req.body;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE complaint_types SET complaint_type_name='${complaint_type_name}', energy_company_id='${energy_company_id}', updated_at='${updatedAt}' WHERE id = '${id}'`;

        db.query(updateQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Complaint Type Updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateComplaintStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;

        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        var complaintStatus = "";
        if (status == 1) {
            complaintStatus = "Pending";
        } else if (status == 2) {
            complaintStatus = "Viewed";
        } else if (status == 3) {
            complaintStatus = "Approved";
        } else if (status == 4) {
            complaintStatus = "Rejected";
        } else if (status == 5) {
            complaintStatus = "Resolved";
        }
        const updateQuery = `UPDATE complaints SET status = ? WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [status, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({
                status: true,
                message: "Complaint status change to " + complaintStatus + " successfully",
            });
        } else {
            return res.status(400).json({ status: false, message: "Error! complaint status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addComplaintSubType,
    getAllComplaintSubTypes,
    getComplaintSubTypeById,
    updateComplaintSubType,
    updateComplaintStatus,
};

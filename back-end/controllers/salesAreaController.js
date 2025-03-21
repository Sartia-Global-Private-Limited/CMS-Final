require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const db = makeDb();
const moment = require("moment");

const addSalesArea = async (req, res, next) => {
    try {
        const { energy_company_id, zone_id, regional_office_id, sales_area_name, sales_area_status } = req.body;
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_office_id: Joi.number().required(),
            sales_area_name: Joi.string().required(),
            sales_area_status: Joi.number().required(),
        }).options({ allowUnknown: true });
        const { error, value } = joiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const insertQuery = `INSERT INTO sales_area(energy_company_id, zone_id, regional_office_id, sales_area_name, status, created_by, created_at) VALUES('${energy_company_id}', '${zone_id}','${regional_office_id}','${sales_area_name}','${sales_area_status}', '${createdBy}', '${createdAt}')`;

        db.query(insertQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Sales area added successfully." });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSalesArea = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(sales_area.id) as total FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id`;

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if (searchData != null && searchData != "") {
            var selectQuery = `SELECT sales_area.id, sales_area.energy_company_id, sales_area.zone_id,sales_area.regional_office_id,sales_area.sales_area_name,sales_area.status, zones.zone_name, regional_offices.regional_office_name, energy_companies.name as ec_name FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id WHERE sales_area.sales_area_name LIKE '%${searchData}%' ORDER BY sales_area.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            var selectQuery = `SELECT sales_area.id, sales_area.energy_company_id, sales_area.zone_id,sales_area.regional_office_id,sales_area.sales_area_name,sales_area.status, zones.zone_name, regional_offices.regional_office_name, energy_companies.name as ec_name FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id ORDER BY sales_area.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                return res.status(200).json({
                    status: true,
                    message: "Sales area fetched successfully",
                    data: result,
                    pageDetails: pageDetails[0],
                });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSalesAreaById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM sales_area WHERE id = '${id}'`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Sales area fetched successfully", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getActiveSalesArea = async (req, res, next) => {
    try {
        const activeStatus = process.env.ACTIVE_STATUS;
        const selectQuery = `SELECT * FROM sales_area WHERE status = '${activeStatus}'`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                return res
                    .status(200)
                    .json({ status: true, message: "Active sales area fetched successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const editSalesArea = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM sales_area WHERE id = '${id}'`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sales area fetched successfully", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateSalesArea = async (req, res, next) => {
    try {
        const id = req.body.id;
        const { energy_company_id, zone_id, regional_office_id, sales_area_name, sales_area_status } = req.body;
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_office_id: Joi.number().required(),
            sales_area_name: Joi.string().required(),
            sales_area_status: Joi.number().required(),
            id: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error, value } = joiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        const updatedTime = new Date().toISOString().slice(0, 19).replace("T", " ");
        const updateQuery = `UPDATE sales_area SET energy_company_id='${energy_company_id}', zone_id = '${value.zone_id}', regional_office_id = '${value.regional_office_id}', sales_area_name = '${value.sales_area_name}', status = '${value.sales_area_status}', updated_at='${updatedTime}' WHERE id = '${id}'`;
        db.query(updateQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sales area updated successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteSalesArea = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteQuery = `DELETE FROM sales_area WHERE id = '${id}'`;
        db.query(deleteQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sales area deleted successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSaleAreaOnRoId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, regional_office_id, sales_area_name FROM sales_area WHERE regional_office_id = '${id}' AND status='${process.env.ACTIVE_STATUS}'`;
        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sales area fetched successfully", data: result });
            } else {
                return res
                    .status(400)
                    .json({ status: false, message: "Sale area not found on that selected regional office" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSaleArea = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(sales_area.id) as total FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id`;

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if (searchData != null && searchData != "") {
            var selectQuery = `SELECT sales_area.id, sales_area.energy_company_id, sales_area.zone_id,sales_area.regional_office_id,sales_area.sales_area_name,sales_area.status, zones.zone_name, regional_offices.regional_office_name, energy_companies.name as ec_name FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id WHERE sales_area.sales_area_name LIKE '%${searchData}%' ORDER BY sales_area.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            var selectQuery = `SELECT sales_area.id, sales_area.energy_company_id, sales_area.zone_id,sales_area.regional_office_id,sales_area.sales_area_name,sales_area.status, zones.zone_name, regional_offices.regional_office_name, energy_companies.name as ec_name FROM sales_area INNER JOIN zones ON zones.zone_id=sales_area.zone_id INNER JOIN regional_offices ON regional_offices.id=sales_area.regional_office_id INNER JOIN energy_companies ON energy_companies.id=sales_area.energy_company_id ORDER BY sales_area.id DESC`;
        }

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                return res.status(200).json({
                    status: true,
                    message: "Sales area fetched successfully",
                    data: result,
                    pageDetails: pageDetails[0],
                });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addSalesArea,
    getSalesArea,
    getSalesAreaById,
    getActiveSalesArea,
    editSalesArea,
    updateSalesArea,
    deleteSalesArea,
    getSaleAreaOnRoId,
};

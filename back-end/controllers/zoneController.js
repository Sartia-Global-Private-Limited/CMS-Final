require("dotenv").config();
const Joi = require("joi");
const { con, makeDb } = require("../db");
const { checkPositiveInteger } = require("../helpers/validation");
const db = makeDb();
const moment = require("moment");

const createZone = async (req, res, next) => {
    try {
        const { name, description, energy_company_id } = req.body;
        const JoiSchema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            // description: Joi.string().required(),
            energy_company_id: Joi.number().integer().positive().required(),
        }).options({ allowUnknown: true });

        const { error, value } = JoiSchema.validate(req.body);
        if (error) {
            return res.status(401).json({ status: false, message: error.message });
        }

        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const insertQuery = `INSERT INTO zones(energy_company_id, zone_name, zone_description,created_by, created_at) VALUES('${energy_company_id}', '${name}', '${description ? description : ""}', '${createdBy}', '${createdAt}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Zone created successfully." });
            } else {
                return res
                    .status(400)
                    .json({ status: false, message: "Something went wrong, please try after sometime" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(403).json({ status: false, message: error.message });
    }
};

const getAllZones = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(zones.zone_id) as total FROM zones INNER JOIN energy_companies ON energy_companies.id = zones.energy_company_id`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.ceil(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const id = req.params.id || "";
        console.log('id: ', id);

        let selectQuery = ``;

        if(id && id != "") {
            selectQuery = `SELECT zones.*, energy_companies.name as ec_name FROM zones INNER JOIN energy_companies ON energy_companies.id = zones.energy_company_id WHERE zones.zone_id = '${id}'`;
        }
        if (searchData != null && searchData != "" && id == "") {
            selectQuery = `SELECT zones.*, energy_companies.name as ec_name FROM zones INNER JOIN energy_companies ON energy_companies.id = zones.energy_company_id WHERE zones.zone_name LIKE '%${searchData}%' ORDER BY zones.zone_id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else if(id == "") {
            selectQuery = `SELECT zones.*, energy_companies.name as ec_name FROM zones INNER JOIN energy_companies ON energy_companies.id = zones.energy_company_id ORDER BY zones.zone_id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                
                // console.log('result: ', result);
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                let pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                if(id && id != "") {
                    return res.status(200).json({ status: true, message: "success", data: result[0]});
                } else {
                    return res.status(200).json({ status: true, message: "success", data: result, pageDetails: pageDetails[0] });
                }

            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllActiveZones = async (req, res, next) => {
    try {
        const activeStatus = process.env.VALUE_ONE;
        const selectQuery = `SELECT * FROM zones WHERE zone_status='${activeStatus}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "success", data: result });
            } else {
                return res.status(403).json({ status: false, message: "Data not found." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const editZone = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM zones WHERE zone_id='${id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "success", data: result[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateZone = async (req, res, next) => {
    try {
        const { name, description, id, status, energy_company_id } = req.body;
        const JoiSchema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            description: Joi.string().required(),
            id: Joi.number().required(),
            status: Joi.number().required(),
            energy_company_id: Joi.number().required(),
        });

        const { error, value } = JoiSchema.validate(req.body);
        if (error) {
            return res.status(401).json({ status: false, message: error.message });
        }

        const updateQuery = `UPDATE zones SET energy_company_id='${energy_company_id}', zone_name='${name}', zone_description='${description}', zone_status='${status}' WHERE zone_id='${id}'`;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Zone updated successfully." });
            } else {
                return res
                    .status(400)
                    .json({ status: false, message: "Something went wrong, please try after sometime" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteZone = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `DELETE FROM zones WHERE zone_id='${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });
            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Zone deleted successfully." });
            } else {
                return res
                    .status(400)
                    .json({ status: false, message: "Something went wrong, please try after sometime." });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanyAssignZones = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(error).json({ status: false, message: error.message });

        // const selectQuery = `SELECT energy_companies.id as ec_id, energy_companies.name, admins.id as user_id, admins.name as user_name,  zone_assigns.zone_id as assign_zone_id, zones.zone_id,zones.zone_name FROM energy_companies INNER JOIN admins ON admins.id=energy_companies.admin_id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN zones ON zones.zone_id=zone_assigns.zone_id WHERE energy_companies.id='${id}'`

        const selectQuery = `SELECT zone_id, energy_company_id, zone_name FROM zones WHERE energy_company_id='${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result });
            } else {
                return res.status(403).json({ status: false, message: "Zones not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createZone,
    getAllZones,
    getAllActiveZones,
    editZone,
    updateZone,
    deleteZone,
    getEnergyCompanyAssignZones,
};

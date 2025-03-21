var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { getModuleOfSubModuleForReports } = require("../helpers/commonHelper");

const getAllSubModule = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM sub_modules`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if (searchData != null && searchData != "") {
            var selectQuery = `SELECT * FROM sub_modules WHERE title LIKE '%${searchData}%' AND is_deleted = 0 ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            var selectQuery = `SELECT * FROM sub_modules WHERE is_deleted = 0 ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });

                res.status(200).json({
                    status: true,
                    message: "Sub module fetched successfully",
                    data: result,
                    pageDetails: pageDetails[0],
                });
            } else {
                return res.status(200).json({ status: false, message: "No data found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSubModuleWithModuleName = async (req, res, next) => {
    try {
        const selectQuery = `SELECT sub_modules.id as sub_module_id, sub_modules.title as sub_module_name, sub_modules.path as sub_module_path, modules.id as module_id, modules.title as module_name, modules.path as module_path FROM sub_modules INNER JOIN modules ON sub_modules.module_id = modules.id WHERE sub_modules.is_deleted = 0 AND modules.is_deleted = 0`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub module fetched successfully", data: result });
            } else {
                return res.status(200).json({ status: false, message: "No data found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSubModuleByModuleId = async (req, res, next) => {
    try {
        const moduleId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: moduleId });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM sub_modules WHERE module_id = '${moduleId}' AND is_deleted = 0`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                for (const module of result) {
                    module.modulesOfSubModule = await getModuleOfSubModuleForReports(module.id);

                    //;
                }
                res.status(200).json({ status: true, message: "Sub module fetched successfully", data: result });
            } else {
                return res.status(200).json({ status: false, message: "No data found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllSubModule, getSubModuleWithModuleName, getSubModuleByModuleId };

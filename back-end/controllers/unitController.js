require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { unitsSchema, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");

// create api for unit data
const createUnitData = async (req, res, next) => {
    try {
        const { error } = unitsSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const { name, short_name } = req.body;
        const created_by = req.user.user_id;

        const unitData = {
            name,
            short_name,
            created_by,
        };

        const result = await db.query("INSERT INTO units SET ?", [unitData]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Unit data created successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error in creating unitData" });
        }
    } catch (error) {
        return next(error);
    }
};

//update  api for unit data
const updateUnitDataById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = unitsSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }
        const { positiveError } = checkPositiveInteger.validate({ id: id });
        if (positiveError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const { name, short_name } = req.body;
        if (!name || !short_name) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Both 'name' and 'short_name' are required." });
        }

        const updated_by = req.user.user_id;

        const updateUnitData = {
            name,
            short_name,
            updated_by,
        };

        const result = await db.query("UPDATE units SET ? WHERE id=?", [updateUnitData, id]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Unit data updated successfully" });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Unit with the specified ID not found" });
        }
    } catch (error) {
        return next(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: "Error in updating unitData: " + error.message });
    }
};

const getAllUnitData = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["name", "short_name"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM units ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const units = await db.query(query);

        if (units.length > 0) {
            var finalData = [];
            const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of units) {
                finalData.push({
                    id: row.id,
                    name: row.name,
                    short_name: row.short_name,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_by: row.updated_by,
                    updated_at: row.updated_at,
                });
            }

            return res
                .status(200)
                .json({ status: true, message: "Data found", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

//get data by id of unit
const getUnitDataById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const result = await db.query("SELECT * FROM units WHERE id=?", [id]);
        if (result.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, data: result[0] });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Unit with the specified ID not found" });
        }
    } catch (error) {
        return next(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: "Error in retrieving unit data: " + error.message });
    }
};

//delete api for delete unit by id

const deleteUnitDataById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const result = await db.query("DELETE FROM units WHERE id=?", [id]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Unit data deleted successfully" });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Unit with the specified ID not found" });
        }
    } catch (error) {
        return next(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: "Error in deleting unit data: " + error.message });
    }
};

const getAllUnitDataForDropdown = async (req, res, next) => {
    try {
        const query = `SELECT * FROM units`;

        const units = await db.query(query);

        if (units.length > 0) {
            var finalData = [];
            for (const row of units) {
                finalData.push({
                    id: row.id,
                    name: row.name,
                    short_name: row.short_name,
                });
            }

            return res.status(200).json({ status: true, message: "Data found", data: finalData });
        } else {
            return res.status(200).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createUnitData,
    updateUnitDataById,
    getAllUnitData,
    getUnitDataById,
    deleteUnitDataById,
    getAllUnitDataForDropdown,
};

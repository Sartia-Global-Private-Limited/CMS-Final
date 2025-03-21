require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");

const getSalesAreaName = async (salesAreaId) => {
    try {
        // Replace this code with the logic to fetch sales_area_name based on salesAreaId from the database
        const salesAreaResult = await db.query("SELECT sales_area_name FROM sales_area WHERE id = ?", [salesAreaId]);

        if (salesAreaResult.length > process.env.VALUE_ZERO) {
            return salesAreaResult[0].sales_area_name;
        } else {
            return ""; // Return an empty string or handle the case when sales area is not found
        }
    } catch (error) {
        return error; // Return an empty string or handle the error
    }
};

const getRegionalOfficeName = async (regionalOfficeId) => {
    try {
        // Replace this code with the logic to fetch regional_office_name based on regionalOfficeId from the database
        const regionalOfficeResult = await db.query("SELECT regional_office_name FROM regional_offices WHERE id = ?", [
            regionalOfficeId,
        ]);

        if (regionalOfficeResult.length > 0) {
            return regionalOfficeResult[0].regional_office_name;
        } else {
            return ""; // Return an empty string or handle the case when regional office is not found
        }
    } catch (error) {
        return error; // Return an empty string or handle the error
    }
};

async function getOutletById(outlet_id) {
    try {
        const sql = await db.query(`SELECT id as outlet_id, outlet_name FROM outlets WHERE id='${outlet_id}'`);
        if (sql.length > process.env.VALUE_ZERO) {
            return sql;
        } else {
            return [];
        }
    } catch (error) {
        return error; // Return an empty string or handle the
    }
}

module.exports = { getSalesAreaName, getRegionalOfficeName, getOutletById };

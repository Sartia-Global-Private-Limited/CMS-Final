var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { financialYearSchema, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, checkFinancialYearFormat } = require("../helpers/general");

const createFinancialYears = async (req, res, next) => {
    try {
        const { error } = financialYearSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request data" });
        }
        const { start_date, end_date } = req.body;
        const created_by = req.user.user_id;
        const startYear = moment(start_date, "YYYY-MM-DD").format("YYYY");
        const endYear = moment(end_date, "YYYY-MM-DD").format("YYYY");
        const formattedYearName = startYear + "-" + endYear.substring(2);

        // check financial year format it should plus one year ahead of start date year
        const isFinancialYearCorrect = await checkFinancialYearFormat(start_date, end_date);

        if (formattedYearName != isFinancialYearCorrect) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Invalid financial Year " + formattedYearName,
            });
        }
        // check formattedYearName is exist or not in db
        const selectQuery = await db.query("SELECT * FROM financial_years WHERE year_name = ?", [formattedYearName]);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Financial Year already exists " + formattedYearName,
            });
        }

        const financeData = {
            start_date,
            year_name: formattedYearName,
            end_date,
            created_by,
        };

        const result = await db.query("INSERT INTO financial_years SET ?", [financeData]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Finance data created successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error creating financial year" });
        }
    } catch (error) {
        return next(error);
        console.error("Error creating financial year: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

//update api
const updateFinancialYearById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = financialYearSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request data" });
        }

        const { positiveCheck } = checkPositiveInteger.validate({ id: id });
        if (positiveCheck) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: positiveCheck.message });
        }
        const { start_date, year_name, end_date } = req.body;
        const updated_by = req.user.user_id;
        const startYear = moment(start_date, "YYYY-MM-DD").format("YYYY");
        const endYear = moment(end_date, "YYYY-MM-DD").format("YYYY");
        const formattedYearName = startYear + "-" + endYear.substring(2);
        const financeData = {
            start_date,
            year_name: formattedYearName,
            end_date,
            updated_by,
        };

        const result = await db.query("UPDATE financial_years SET ? WHERE id = ?", [financeData, id]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Financial year data updated successfully" });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Financial year data not found for update" });
        }
    } catch (error) {
        return next(error);
        console.error("Error updating financial year by ID: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

//get all api

const fetchAllFinancialYears = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["id", "start_date", "year_name", "end_date"];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY end_date DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = "SELECT * FROM financial_years";
        const query = `${baseQuery} ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const rows = await db.query(query);

        if (rows.length > 0) {
            const finalData = rows.map((row) => ({
                id: row.id,
                start_date: moment(row.start_date).format("YYYY-MM-DD"),
                year_name: row.year_name,
                end_date: moment(row.end_date).format("YYYY-MM-DD"),
                created_by: row.created_by,
                created_at: row.created_at,
                updated_by: row.updated_by,
                updated_at: row.updated_at,
            }));

            const modifiedQueryString = `${baseQuery} ${
                searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")}` : ""
            }`;
            const totalResult = await db.query(modifiedQueryString);
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            const response = {
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            };

            return res.status(StatusCodes.OK).json(response);
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
        console.error("Error fetching financial years: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

//get finance by id

const fetchFinancialYearById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        {
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
            }
        }
        const query = "SELECT * FROM financial_years WHERE id = ?";
        const financialYear = await db.query(query, [id]);
        if (financialYear && financialYear.length > 0) {
            for (const row of financialYear) {
                row.start_date = moment(row.start_date).format("YYYY-MM-DD");
                row.end_date = moment(row.end_date).format("YYYY-MM-DD");
            }
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: financialYear[0] });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Financial year data not found" });
        }
    } catch (error) {
        return next(error);
        console.error("Error fetching financial year by ID: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

//delete finance by id

const deleteFinancialYearById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const query = "DELETE FROM financial_years WHERE id = ?";

        const result = await db.query(query, [id]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Financial year data deleted successfully" });
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Financial year data not found for deletion" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createFinancialYears,
    fetchAllFinancialYears,
    fetchFinancialYearById,
    deleteFinancialYearById,
    updateFinancialYearById,
};

require("dotenv").config();
var moment = require("moment");
const Joi = require("joi");
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { subCategoryValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");

const addSubCategory = async (req, res, next) => {
    try {
        const { name, status = 1 } = req.body;
        const { error } = subCategoryValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });
        const created_by = req.user.user_id;
        const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        // check sub category is already exist or not
        // const checkSubCategoryExists = await db.query(
        //     `SELECT * FROM sub_category WHERE name = ? AND created_by = ? AND is_deleted = 0`,
        //     [name, created_by]
        // );
        const checkSubCategoryExists = await db.query(
            `SELECT * FROM sub_category WHERE name = ? AND is_deleted = 0`,
            [name]
        );
        if (checkSubCategoryExists.length > process.env.VALUE_ZERO) {
            return res.status(400).json({ status: false, message: "Sub Category already exists" });
        }
        const queryResult = await db.query(`INSERT INTO sub_category(name, status, created_by, created_at)VALUES(?, ?, ?, ?)`, [
            name,
            status,
            created_by,
            created_at
        ]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sub Category added successfully",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};
const subCategoryList = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const isDropdown = req.query.isDropdown;
        const pageFirstResult = (currentPage - 1) * pageSize;
        // const searchColumns = ["name"];
        const searchConditions = [];
        // console.log(searchData);
        // if (searchData != null && searchData != "") {
        //   searchColumns.forEach((column) => {
        //     searchConditions.push(`${column} LIKE '%${searchData}%'`);
        //   });
        // }
        let searchFilter = "";
        if (searchData) {
            searchFilter = ` AND (name LIKE "%${searchData}%")`;
        }
        searchConditions.push(`created_by = ${req.user.user_id}`);
        let orderLimitQuery = `ORDER BY id DESC`;
        orderLimitQuery += isDropdown === "true" ? ` LIMIT ${pageFirstResult}, ${pageSize}` : "";
        const query = `SELECT * FROM sub_category WHERE is_deleted = 0 ${searchFilter} AND created_by IN ('1', '${req.user.user_id}') ${orderLimitQuery}`;
        const queryResult = await db.query(query);
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > 0) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                row.created_at = moment(row.created_at).isValid() ? moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A") : null;
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: queryResult,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Sub Category Not Found",
            });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};
const subCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT  id , name, status, created_by  FROM sub_category WHERE id = ? AND is_deleted = 0`;
        const queryResult = await db.query(query, [id]);
        if (queryResult.length > 0) {
            queryResult[0].created_at = moment(queryResult[0].created_at).format("YYYY-MM-DD HH:mm:ss A");
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sub Category List",
                data: queryResult[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Sub Category not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};
const updateSubCategory = async (req, res, next) => {
    try {
        const { name, id, status } = req.body;
        const { error } = subCategoryValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
        // check sub category is already exist or not
        const created_by = req.user.user_id;
        const checkSubCategoryExists = await db.query(
            `SELECT * FROM sub_category WHERE name = ? AND created_by = ? AND id != ? AND is_deleted = 0`,
            [name, created_by, id]
        );
        if (checkSubCategoryExists.length > process.env.VALUE_ZERO) {
            return res.status(400).json({ status: false, message: "Sub Category already exists" });
        }
        const queryResult = await db.query(`UPDATE sub_category SET name = ? , status = ? WHERE id = ?`, [
            name,
            status,
            id,
        ]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Sub Category updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};
const deleteSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteQuery = `UPDATE sub_category SET is_deleted = ? WHERE id = ?`;
        const result = await db.query(deleteQuery, [1, id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: true,
                message: "Sub Category deleted Successfully",
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Sub Category Not Found",
            });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
module.exports = {
    addSubCategory,
    updateSubCategory,
    subCategoryById,
    subCategoryList,
    deleteSubCategory,
};

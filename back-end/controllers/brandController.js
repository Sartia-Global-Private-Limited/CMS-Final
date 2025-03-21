require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { calculatePagination, getRecordWithWhereAndJoin } = require("../helpers/general");

const createBrand = async (req, res, next) => {
    try {
        const schema = Joi.object({
            brand_name: Joi.string().required(),
            status: Joi.number().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
        const { brand_name, status } = req.body;
        const created_by = req.user.user_id;

        const condition = [
            { field : "brand_name", operator : "=", value : brand_name },
            { field : "is_deleted", operator : "=", value : 0 }
        ]

        const existingBrand = await getRecordWithWhereAndJoin("brands", condition);

        if (existingBrand.length > 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Brand already exists" });
        }

        const insertQuery = `INSERT INTO brands (brand_name, status, created_by) VALUES ('${brand_name}', '${status}', '${created_by}')`;
        const queryResult = await db.query(insertQuery);
        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.CREATED).json({ status: true, message: "Brand created successfully" });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Something went wrong in creating brand,",
        });
    } catch (error) {
        return next(error);
    }
};

const getAllBrands = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || 1;

        let search = "";
        if (searchData) {
            search = ` AND brand_name LIKE '%${searchData}%'`;
        }

        let whereCondition = "";
        if (status) {
            whereCondition = ` AND status = '${status}'`;
        }
        const selectQuery = `SELECT * FROM brands WHERE is_deleted = 0 ${whereCondition} ${search} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: true, message: "Brands not found" });
        }
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

const getAllBrandsMarkDown = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM brands Where status = 1 AND  is_deleted = 0 ORDER BY id DESC`;

        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: true, message: "Data not found" });
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
    } catch (error) {
        return next(error);
    }
};

const getBrandById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM brands WHERE id = ${id} AND is_deleted = 0`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: true, message: "Brand not found" });
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
    } catch (error) {
        return next(error);
    }
};

const updateBrand = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
            brand_name: Joi.string().required(),
            status: Joi.number().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
        const { id, brand_name, status } = req.body;
        const updated_by = req.user.user_id;
        const updateQuery = `UPDATE brands SET brand_name = '${brand_name}', status = '${status}', updated_by = '${updated_by}' WHERE id = ${id} AND is_deleted = 0`;
        const queryResult = await db.query(updateQuery);
        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Brand updated successfully" });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Something went wrong in updating brand",
        });
    } catch (error) {
        return next(error);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteQuery = `update brands set is_deleted = 1 WHERE id = ${id}`;
        const queryResult = await db.query(deleteQuery);
        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Brand deleted successfully" });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Something went wrong or brand not found",
        });
    } catch (error) {
        return next(error);
    }
};

const getBrandsByItemId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT
                                brands.id AS brand_id,
                                brands.brand_name,
                                brands.status AS brand_status
                            FROM
                                item_rates 
                            JOIN
                                brands ON item_rates.brand_id = brands.id
                            WHERE
                                item_rates.item_id = '${id}' AND brands.is_deleted = 0;`;
        const result = await db.query(selectQuery);
        if (result.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: true, message: "Data not found" });
        }
        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    getAllBrandsMarkDown,
    getBrandsByItemId,
};

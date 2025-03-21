require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { calculatePagination } = require("../helpers/general");

//============ Create order api  =============//
const createOrder = async (req, res, next) => {
    try {
        const { order_via, status } = req.body;
        const created_by = req.user.user_id;
        const data = `Insert INTO order_vias SET order_via="${order_via}",status="${status}",created_by=${created_by}`;
        const result = await db.query(data);
        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Created Successfully",
            });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error in creating a new order" });
        }
    } catch (error) {
        return next(error);
    }
};

//=========== update order api ===============//
const updateOrder = async (req, res, next) => {
    try {
        const { order_via, status, id } = req.body;
        const updated_by = req.user.user_id;
        const data = `UPDATE  order_vias SET order_via="${order_via}", status="${status}", 
    updated_by="${updated_by}" where id='${id}'`;
        const result = await db.query(data);
        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Updated Successfully",
            });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error in updating a new order" });
        }
    } catch (error) {
        return next(error);
    }
};

//=============== get all order ===============//
const getAllData = async (req, res, next) => {
    try {
        const query = `SELECT id, order_via, status FROM order_vias WHERE deleted = 0`;
        const result = await db.query(query);
        if (result.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data retrieved successfully",
                data: result,
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

//============== get all data with pagination ==========//
const getAllOrderWithPagination = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let searchConditions = "";

        if (searchData !== "") {
            searchConditions = `AND (name LIKE '%${searchData}%')`;
        }

        // Include a condition for deleted = 0
        const deletedCondition = "deleted = 0";

        const query = `SELECT * FROM order_vias WHERE ${deletedCondition} ${searchConditions} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize} `;

        const result = await db.query(query);

        if (result.length > 0) {
            const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);

            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Data retrieved successfully", data: result, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No data found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

//============ get order by id ============//
const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const query = `SELECT id, order_via, status, created_by FROM order_vias WHERE id = "${id}" AND deleted = 0`;

        const result = await db.query(query);

        if (result.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data retrieved successfully",
                data: result[0],
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "Data not found for the specified ID",
            });
        }
    } catch (error) {
        return next(error);
    }
};

//============= delete order by id ==============//
const deleteOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const query = `UPDATE order_vias SET deleted=1 WHERE id=${id}`;

        const result = await db.query(query);

        if (result.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data deleted successfully",
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "Data not found for the specified ID",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { createOrder, updateOrder, getAllData, getOrderById, deleteOrderById, getAllOrderWithPagination };

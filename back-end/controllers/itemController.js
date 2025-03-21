require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const { con, makeDb } = require("../db");
const db = makeDb();

const { itemSchema, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination, getOutletById } = require("../helpers/general");

// Create a new item complaint
const createItem = async (req, res, next) => {
    try {
        const { complaint_id, outlet_id, quantity, item_price } = req.body;
        const { error } = itemSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send({ status: false, message: error.message });
        }
        // Convert outlet_id to a string
        const outletIdString = JSON.stringify(outlet_id);

        // Calculate the total price
        const total_price = quantity * item_price;
        const created_by = req.user.user_id;

        //const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // const updatedAt = createdAt;

        await db.query(
            "INSERT INTO items_used (complaint_id, outlet_id, quantity, created_by, item_price, total_price) VALUES (?, ?, ?, ?, ?, ?)",
            [complaint_id, outletIdString, quantity, created_by, item_price, total_price]
        );

        res.status(201).json({ message: "Complaint created successfully." });
    } catch (error) {
        return next(error);
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update item complaint
const updateItem = async (req, res, next) => {
    try {
        const item_id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: item_id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const { complaint_id, outlet_id, quantity, item_price } = req.body;
        // const{error} = itemSchema.validate(req.body)
        // if(error){
        //  return res.status(StatusCodes.BAD_REQUEST).send({status:false,message:error.message})
        // }
        // Convert outlet_id to a string
        const outletIdString = JSON.stringify(outlet_id);

        // Calculate the total price
        const total_price = quantity * item_price;
        const updated_by = req.user.user_id;

        const result = await db.query(
            "UPDATE items_used SET complaint_id = ?, outlet_id = ?, quantity = ?, item_price = ?, total_price = ?, updated_by = ? WHERE item_id = ?",
            [complaint_id, outletIdString, quantity, item_price, total_price, updated_by, item_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found." });
        }

        return res.status(200).json({ message: "Item complaint updated successfully." });
    } catch (error) {
        return next(error);
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getAllItems = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var searchColumns = ["item_id", "complaint_id", "quantity", "item_price"];
        var searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const selectQuery = `SELECT * FROM items_used ${searchConditions} ORDER BY item_id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const rows = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (rows.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of rows) {
                const outletData = await getOutletById(row.outlet_id);

                finalData.push({
                    item_id: row.item_id,
                    used_items: row.used_item,
                    complaint_id: row.complaint_id,
                    quantity: row.quantity,
                    item_price: row.item_price,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_by: row.updated_by,
                    updated_at: row.updated_at,
                    total_price: row.total_price,
                    outletData: outletData,
                });
            }

            const response = {
                finalData: finalData,
                pageDetails: pageDetails,
            };

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Data fetch successfully", data: response });
        } else {
            // If no data is found, return an empty array and appropriate message
            return res.status(StatusCodes.OK).json({ status: false, message: "No items found" });
        }
    } catch (error) {
        return next(error);
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//delete item
const deleteItem = async (req, res, next) => {
    try {
        const item_id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: item_id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const result = await db.query("DELETE FROM items_used WHERE item_id = ?", [item_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found." });
        }

        res.json({ message: "Item deleted successfully." });
    } catch (error) {
        return next(error);
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//get item with outlet by complaintId
const getItemById = async (req, res, next) => {
    try {
        const item_id = req.params.id;

        // Assuming `checkPositiveInteger.validate` is a valid function for positive integer validation
        const { error } = checkPositiveInteger.validate({ id: item_id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const itemData = await db.query("SELECT * FROM items_used WHERE item_id = ?", [item_id]);

        if (itemData.length === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        const finalData = [];

        for (const row of itemData) {
            const outletData = await getOutletById(row.outlet_id);

            // Assuming getOutletData function works correctly and returns valid outlet data

            finalData.push({
                item_id: row.item_id,
                complaint_id: row.complaint_id,
                quantity: row.quantity,
                item_price: row.item_price,
                created_by: row.created_by,
                created_at: row.created_at,
                updated_by: row.updated_by,
                updated_at: row.updated_at,
                total_price: row.total_price,
                outletData: outletData,
            });
        }

        const response = {
            finalData: finalData,
        };

        return res.status(200).json(response);
    } catch (error) {
        return next(error);
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//module exports
module.exports = { createItem, getAllItems, updateItem, deleteItem, getItemById };

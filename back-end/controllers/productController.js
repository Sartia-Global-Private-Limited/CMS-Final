var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, productValidations } = require("../helpers/validation");
const { calculatePagination, getCreatedByDetails, getSupplierDetails, supplierDetails } = require("../helpers/general");

const addProduct = async (req, res, next) => {
    try {
        const {
            category_id,
            product_name,
            price,
            quantity,
            alert_quantity,
            supplier_id,
            manufacturing_date,
            expiry_date,
            availability_status,
            is_published,
            description,
        } = req.body;

        const { error } = productValidations.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO products (category_id, product_name, price, quantity, alert_quantity, supplier_id, manufacturing_date, expiry_date, availability_status, is_published, description, created_by, image_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        var storePath = "";
        const manufacturing_date_formatted = manufacturing_date;
        const expiry_date_formatted = expiry_date;

        if (req.files != null) {
            const image = req.files.image_url;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/product_images/" + imageName;
            storePath = "/product_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err)
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: err.message,
                    });
            });
        }

        const insertValues = [
            category_id,
            product_name,
            price,
            quantity,
            alert_quantity,
            supplier_id,
            manufacturing_date_formatted,
            expiry_date_formatted,
            availability_status,
            is_published,
            description,
            created_by,
            storePath,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Product added successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (categories.category_name LIKE '%${searchData}%' OR products.product_name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT products.*, categories.category_name FROM products LEFT JOIN categories ON categories.id = products.category_id ${search_value} ORDER BY products.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var supplier_names = "";

            for (const row of queryResult) {
                const created_by_detail = await getCreatedByDetails(row.created_by);
                if (row.supplier_id != null) {
                    const supplier_detail = await supplierDetails(row.supplier_id);
                    supplier_names = supplier_detail.supplier_name;
                }

                finalData.push({
                    id: row.id,
                    category_id: row.category_id,
                    category_name: row.category_name,
                    product_name: row.product_name,
                    price: row.price,
                    quantity: row.quantity,
                    alert_quantity: row.alert_quantity,
                    supplier_id: row.supplier_id,
                    supplier_name: supplier_names,
                    manufacturing_date: moment(row.manufacturing_date).format("YYYY-MM-DD"),
                    expiry_date: moment(row.expiry_date).format("YYYY-MM-DD"),
                    image_url: row.image_url,
                    availability_status: row.availability_status,
                    is_published: row.is_published,
                    description: row.description,
                    created_by: row.created_by,
                    created_by_name: created_by_detail.name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
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

const getProductDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT products.*, categories.category_name FROM products LEFT JOIN categories ON categories.id = products.category_id WHERE products.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var supplier_name = "";

            for (const row of queryResult) {
                const created_by_detail = await getCreatedByDetails(row.created_by);

                if (row.supplier_id != null) {
                    const supplier_detail = await supplierDetails(row.supplier_id);
                    supplier_name = supplier_detail.supplier_name;
                }

                finalData.push({
                    id: row.id,
                    category_id: row.category_id,
                    category_name: row.category_name,
                    product_name: row.product_name,
                    price: row.price,
                    quantity: row.quantity,
                    alert_quantity: row.alert_quantity,
                    supplier_id: row.supplier_id,
                    supplier_name: supplier_name,
                    manufacturing_date: moment(row.manufacturing_date).format("YYYY-MM-DD"),
                    expiry_date: moment(row.expiry_date).format("YYYY-MM-DD"),
                    image_url: row.image_url,
                    availability_status: row.availability_status,
                    is_published: row.is_published,
                    description: row.description,
                    created_by: row.created_by,
                    created_by_name: created_by_detail.name,
                    created_at: moment(row.created_at).format("DD-MM-YYYY HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
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

const updateProduct = async (req, res, next) => {
    try {
        const {
            category_id,
            product_name,
            price,
            quantity,
            alert_quantity,
            supplier_id,
            manufacturing_date,
            expiry_date,
            availability_status,
            is_published,
            description,
            id,
            image_url,
        } = req.body;

        const { error } = productValidations.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE products SET category_id = ?, product_name = ?, price = ?, quantity = ?, alert_quantity = ?, supplier_id = ?, manufacturing_date = ?, expiry_date = ?, availability_status = ?, is_published = ?, description = ?, updated_by = ?, image_url = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        var storePath = "";
        const manufacturing_date_formatted = manufacturing_date; //moment(manufacturing_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const expiry_date_formatted = expiry_date; //moment(expiry_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

        if (req.files != null) {
            const image = req.files.image_url;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/product_images/" + imageName;
            storePath = "/product_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err)
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: err.message,
                    });
            });
        } else {
            storePath = image_url;
        }

        const updateValues = [
            category_id,
            product_name,
            price,
            quantity,
            alert_quantity,
            supplier_id,
            manufacturing_date_formatted,
            expiry_date_formatted,
            availability_status,
            is_published,
            description,
            updated_by,
            storePath,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Product updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const removedProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = await db.query("DELETE FROM products WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Product deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong with delete request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const publishedProduct = async (req, res, next) => {
    try {
        const { product_id, value } = req.body;

        const publishValidation = Joi.object({
            product_id: Joi.number().required(),
            value: Joi.number().required(),
        });

        const { error } = publishValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = "UPDATE products SET is_published = ? WHERE id = ?";
        const queryResult = await db.query(updateQuery, [value, product_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Product publish status updated successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong updating product publish status",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductDetailById,
    updateProduct,
    removedProductById,
    publishedProduct,
};

const moment = require("moment-timezone");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const sharp = require("sharp");
const fs = require("fs");
const cron = require("node-cron");
const {
    stockRequestValidation,
    checkPositiveInteger,
    transferStockValidation,
    reschduleDate,
    transferFund,
} = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getSupplierDetails,
    getCreatedByDetails,
    getGstMasterDetails,
    generateRandomAlphanumerics,
    getSupplierDetailsById,
    generateRandomNumber,
    getAdminDetails,
} = require("../helpers/general");
const { convertBase64Image, getItemDetailsById } = require("../helpers/commonHelper");
const { json, query } = require("express");
const { Console } = require("console");
const { get } = require("lodash");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const {
    insertItemMasterForFundRequest,
    checkForNewItemApprovalStatusForFundRequest,
} = require("./fundRequestController");

const stockRequestSave = async (req, res, next) => {
    try {
        const { request_stock_by_user, request_tax_type, stock_request_for, supplier_id, user_id } = req.body;
        let gst_id;
        let gst_percent;

        if (!Array.isArray(request_stock_by_user) || request_stock_by_user.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Request Stock field is missing or empty.",
            });
        }

        if (req.body.request_stock_by_user != null) {
            const new_stock_request = req.body.request_stock_by_user[0].new_request_stock || null
            if(new_stock_request && new_stock_request.length > 0) {
                for (let i = 0; i < req.body.request_stock_by_user[0].new_request_stock.length; i++) {
                    if(!(req.body.request_stock_by_user[0].new_request_stock[i].title)) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Please provide Item",
                        })
                    }
                    const titleValue = req.body.request_stock_by_user[0].new_request_stock[i].title.label;
    
                    const queryResult = await db.query(`SELECT * FROM item_masters WHERE name = ? AND is_deleted = 0`, [
                        titleValue,
                    ]);
                    if (queryResult.length > 0) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Item already exist",
                        });
                    }
                }

                for (let i = 0; i < req.body.request_stock_by_user[0].new_request_stock.length; i++) {
                    if(!(req.body.request_stock_by_user[0].new_request_stock[i].brand)) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Please provide Brand",
                        })
                    }
                    const brandValue = req.body.request_stock_by_user[0].new_request_stock[i].brand.label;
    
                    const queryResult = await db.query(`SELECT * FROM brands WHERE brand_name = ? AND is_deleted = 0`, [
                        brandValue,
                    ]);
                    if (queryResult.length > 0) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Brand already exist",
                        });
                    }
                }
            }            

            if (request_tax_type == "2") {
                // Check if gst_id or gst_percent is empty or undefined
                if (!req.body.request_stock_by_user[0].gst_id || req.body.request_stock_by_user[0].gst_id == "" || !req.body.request_stock_by_user[0].gst_percent || req.body.request_stock_by_user[0].gst_percent === "") {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Please provide both GST type and GST percentage",
                    });
                }
                gst_id = req.body.request_stock_by_user[0].gst_id.value;
                gst_percent = req.body.request_stock_by_user[0].gst_percent;

            }

            const created_by = req.user.user_id;
            const request_date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
            let queryResult;

            const unique_id = await generateRandomAlphanumerics(10);

            // Iterate over each object in the request_data array
            const item_master_ids = [];
            let new_item_image = [];
            for (const data of request_stock_by_user) {
                // Check if either request_fund or new_request_fund has data with non-empty item_name and request_quantity
                if (data.supplier_id == null || data.supplier_id == undefined || data.supplier_id == "") {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ status: false, message: "Please choose the supplier." });
                }
                const supplier_id = data.supplier_id;

                if (
                    (data.request_stock &&
                        Array.isArray(data.request_stock) &&
                        data.request_stock.length > 0 &&
                        data.request_stock.some((item) => item.item_name && item.request_quantity)) ||
                    (data.new_request_stock &&
                        data.new_request_stock.length > 0 &&
                        data.new_request_stock.some((item) => item.title && item.qty))
                ) {
                    // Proceed with your logic if validation passes

                    // Iterate over request_stock only if it's a valid array
                    if (data.request_stock && Array.isArray(data.request_stock)) {
                        for (const item of data.request_stock) {
                            if (!item.rate) {
                                console.log("item.rate: ", item.rate);
                                return res.status(StatusCodes.OK).json({
                                    status: false,
                                    message: "Please provide Brand",
                                });
                            }
                            if (item?.request_quantity <= 0 || item?.current_item_price <= 0) {
                                return res.status(StatusCodes.OK).json({
                                    status: false,
                                    message: "Values cannot be negative or equal to zero",
                                });
                            }
                        }
                    }

                    // Ensure new_request_stock is an array before iterating
                    if (data.new_request_stock && Array.isArray(data.new_request_stock)) {
                        for (const item of data.new_request_stock) {
                            const insertResult = await insertItemMasterForFundRequest(
                                item,
                                created_by,
                                supplier_id,
                                "stock"
                            );
                            if (insertResult) {
                                const newItemObject = {
                                    unit_id: item.unit_id,
                                    description: item.description,
                                    item_image: item.item_image, // Assuming result contains the processed image path
                                    title: item.title,
                                    qty: item.qty,
                                    transfer_quantity: item.transfer_quantity,
                                    fund_amount: item.fund_amount,
                                    rate: item.rate,
                                    brand: item.brand?.label, // Using optional chaining to avoid errors
                                };
                                new_item_image.push(newItemObject);

                                console.log(insertResult);
                                item_master_ids.push(insertResult.item_master_ids);
                            } else {
                                return res.status(StatusCodes.BAD_REQUEST).json(insertResult);
                            }
                        }
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Please filled the Item Name and Quantity. No field can be left empty.",
                    });
                }
            }

            for (const imageData of request_stock_by_user) {
                // Check if new_request_fund exists and is not empty
                if (imageData.new_request_stock && imageData.new_request_stock.length > 0) {
                    // Perform the validation only if new_request_fund is not empty
                    if (!imageData.new_request_stock.every((item) => item.item_image)) {
                        return res
                            .status(StatusCodes.BAD_REQUEST)
                            .json({ status: false, message: "Please select an item image for New Request Stock." });
                    }
                }
            }

            if (request_stock_by_user != null && request_stock_by_user != undefined) {
                // let gst_id;
                // let gst_percent;
                let total_gst_value;
                let request_stock_image;

                for (const row of request_stock_by_user) {
                    if (row.request_stock_images != null && row.request_stock_images.length > 0) {
                        const processedImages = [];
                        for (let i = 0; i < row.request_stock_images.length; i++) {
                            const base64File = row.request_stock_images[i].item_image.replace(
                                /^data:image\/\w+;base64,/,
                                ""
                            );
                            const result = await convertBase64Image(
                                base64File,
                                "./public/stock_request_images/",
                                "/stock_request_images/"
                            );
                            processedImages.push({ title: row.request_stock_images[i].title, item_image: result }); // Assuming result contains the processed image path
                        }
                        request_stock_image = processedImages;
                    } else {
                        request_stock_image = [];
                    }

                    const area_manager_id = row.area_manager_id?.value ?? null;
                    const supervisor_id = row.supervisor_id?.value ?? null;
                    const end_users_id = row.end_users_id?.value ?? null;
                    const supplier_id = row.supplier_id?.value ?? null;
                    const self_request_id = user_id;
                    const officeUsers = row.office_users_id ?? null;
                    const request_by = end_users_id || supervisor_id || area_manager_id;

                    if (stock_request_for == 1) {
                        // Self request - only user_id is needed
                        if (!self_request_id) {
                            return res
                                .status(StatusCodes.FORBIDDEN)
                                .json({ status: false, message: "For self_request, user_id is required" });
                        }
                    } else {
                        // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
                        if (!officeUsers && !area_manager_id && !supervisor_id && !end_users_id) {
                            return res.status(StatusCodes.FORBIDDEN).json({
                                status: false,
                                message: "Please select at least one area manager, supervisor, end users",
                            });
                        }
                    }
                    const total_request_qty = row.total_request_qty;

                    // const request_stocks = JSON.stringify(row.request_stock);

                    const finalData = {
                        request_stock: row.request_stock,
                        new_request_stock: new_item_image,
                    };

                    // const finalData = {
                    //     request_stock: row.request_stock,
                    //     new_request_stock: row.new_request_stock
                    // };

                    const request_stocks = JSON.stringify(finalData);
                    const request_images = JSON.stringify(request_stock_image);

                    // if (request_tax_type == "2") {
                    //     // Check if gst_id or gst_percent is empty or undefined
                    //     if (!row.gst_id || row.gst_id == "" || !row.gst_percent || row.gst_percent === "") {
                    //         return res.status(StatusCodes.BAD_REQUEST).json({
                    //             status: false,
                    //             message: "Please provide both GST type and GST percentage",
                    //         });
                    //     }
                    //     gst_id = row.gst_id.value;
                    //     gst_percent = row.gst_percent;

                    // }
                    const insertQuery = `INSERT INTO stock_requests(requested_by, request_stock, request_date, total_request_qty, image, gst_id, gst_percent, request_tax_type, created_by, supplier_id, area_manager_id, supervisor_id, end_users_id, stock_request_for, unique_id, office_users_id) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    const insertValues = [
                        request_by || officeUsers || self_request_id,
                        request_stocks,
                        request_date,
                        total_request_qty,
                        request_images,
                        gst_id || null,
                        gst_percent || null,
                        request_tax_type,
                        created_by,
                        supplier_id,
                        area_manager_id,
                        supervisor_id,
                        end_users_id,
                        stock_request_for,
                        unique_id,
                        officeUsers,
                    ];

                    queryResult = await db.query(insertQuery, insertValues);
                }

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    if (request_stock_by_user[0].new_request_stock) {
                        const stock_request_id = queryResult.insertId;
                        await db.query(
                            `UPDATE item_masters SET fund_stock_id = ${stock_request_id} WHERE id IN (${item_master_ids.join(",")})`
                        );
                    }
                    return res
                        .status(StatusCodes.OK)
                        .json({ status: true, message: "Stock request created successfully" });
                } else {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        status: false,
                        message: "Error creating stock request",
                    });
                }
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Error! something went wrong, please try again later",
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const getAllStockRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.request_date LIKE '%${searchData}%' OR stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE status = '0' AND created_by = '${req.user.user_id}' AND stock_requests.total_request_qty > 0 
            ${search_value} 
            ORDER BY stock_requests.id
            LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];

                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                // const userDetails = await getCreatedByDetails(row.user_id);
                const request_stock = JSON.parse(row.request_stock);

                const totalItemsInRequestFund = request_stock.request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                for (const item of request_stock.new_request_stock) {
                    if (item.title) {
                        totalTitlesInNewRequestFund++;
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: row.status,
                    request_stock: request_stock,
                    request_tax_type: row.request_tax_type,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const getAllApprovedStockRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.request_date LIKE '%${searchData}%' OR stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE created_by = '${req.user.user_id}' AND status = '1' 
            ${search_value} 
            ORDER BY stock_requests.id 
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                // const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const [approvedByDetails] = await getAdminDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.request_stock);

                const totalItemsInRequestFund = request_stock.request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                for (const item of request_stock.new_request_stock) {
                    if (item.title) {
                        totalTitlesInNewRequestFund++;
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: row.status,
                    request_stock: JSON.parse(row.request_stock),
                    approved_by_id: approvedByDetails.id ? approvedByDetails.id : null,
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const getAllRejectedStockRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.request_date LIKE '%${searchData}%' OR stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests WHERE created_by = '${req.user.user_id}' AND status = '2' 
            ${search_value} 
            ORDER BY stock_requests.id
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const rejectedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.request_stock);

                const totalItemsInRequestFund = request_stock.request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                for (const item of request_stock.new_request_stock) {
                    if (item.title) {
                        totalTitlesInNewRequestFund++;
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: row.status,
                    request_stock: JSON.parse(row.request_stock),
                    rejected_by_name: rejectedByDetails.name ? rejectedByDetails.name : null,
                    rejected_by_employee_id: rejectedByDetails.employee_id ? rejectedByDetails.employee_id : null,
                    rejected_image: rejectedByDetails.image ? rejectedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const getStockRequestsDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT stock_requests.* FROM stock_requests WHERE stock_requests.id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        const getSupplierDetails = await db.query(`select * from suppliers where id = '${queryResult[0].supplier_id}'`);

        const getSupplierValue = {
            label: getSupplierDetails[0]?.supplier_name,
            value: getSupplierDetails[0]?.id,
        };

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var history = [];

            for (row of queryResult) {
                const requested_by = await getCreatedByDetails(row.created_by);
                const requested_for = await getCreatedByDetails(row.requested_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const stockForUserDetails = await getCreatedByDetails(row.user_id);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const requestStock = JSON.parse(row.request_stock);
                let total_gst_amount = 0;
                let totalSum = 0;  // add old request stock prices here

                // Iterate over request_fund array and sum up fund_amount
                if (requestStock.request_stock) {
                    for (const item of requestStock.request_stock) {
                        totalSum += item.total_price;
                        // total_gst_amount += ((item?.approve_quantity||0) * (item?.approve_price||0) * ((item.gst_percent ||0)/100))
                    }
                }
                let totalSums = 0;  // add new request stock prices here
                // Iterate over new_request_fund array and sum up fund_amount
                if (requestStock.new_request_stock) {
                    for (const item of requestStock.new_request_stock) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums); // sum of total old and total new request stock amount

                let totalRequestQty = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (requestStock.request_stock) {
                    for (const item of requestStock.request_stock) {
                        totalRequestQty += Number(item.request_quantity);
                    }
                }

                let totalNewRequestQty = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (requestStock.new_request_stock) {
                    for (const item of requestStock.new_request_stock) {
                        totalNewRequestQty += Number(item.qty);
                    }
                }

                const totalQuantity = Number(totalRequestQty) + Number(totalNewRequestQty);

                if (row.approval_data) {
                    const approveData = JSON.parse(row.approval_data);
                    if (approveData[0]?.request_stock) {
                        // Check if request_stock is present
                        for (let i = 0; i < approveData[0].request_stock.length; i++) {
                            const approve = approveData[0].request_stock[i];
                            // console.log(requestStock.request_stock, "approve")
                            if (requestStock?.request_stock[i]) {
                                // Check if requestStock[i] exists
                                total_gst_amount +=
                                    (approve?.approve_quantity || 0) *
                                    (approve?.approve_price || 0) *
                                    ((approve?.gst_percent || 0) / 100);
                                requestStock.request_stock[i]["only_view_approved_amount"] = approve.approve_quantity;
                            }
                        }
                    }
                } else {
                    // If there is no approval_data, set a default value for newRahulKey
                    for (let i = 0; i < requestStock.length; i++) {
                        requestStock.request_stock[i]["only_view_approved_amount"] = 0;
                    }
                }
                console.log(total_gst_amount, "total_gst_amount");

                if (row.transaction_id && row.approved_remark) {
                    const dbTransactions = JSON.parse(row.transaction_id);
                    const dbApprovedRemarks = JSON.parse(row.approved_remark);
                    const dbTransactionDate = JSON.parse(row.transaction_date);

                    for (let j = 0; j < dbTransactions.length; j++) {
                        history.push({
                            date: moment(dbTransactionDate[j]).format("YYYY-MM-DD HH:mm:ss A"),
                            approved_remarks: dbApprovedRemarks[j],
                            transaction_id: dbTransactions[j],
                        });
                    }
                }

                const transfer_Stocks = JSON.parse(row.transfer_stocks);

                const getResultManagerQuery = `SELECT users.name, users.image, users.id AS userId FROM users WHERE id IN (?, ?, ?, ?)`;

                const execResultManager = await db.query(getResultManagerQuery, [
                    row.office_users_id,
                    row.area_manager_id,
                    row.supervisor_id,
                    row.end_users_id,
                ]);
                const userDetails = {};

                execResultManager.forEach((user) => {
                    const userType = (() => {
                        switch (user.userId) {
                            case row.office_users_id:
                                return "Office User";
                            case row.area_manager_id:
                                return "Area Manager";
                            case row.supervisor_id:
                                return "Supervisor";
                            case row.end_users_id:
                                return "End User";
                            default:
                                return "Unknown"; // Handle unexpected cases
                        }
                    })();

                    userDetails[userType] = {
                        label: user.name,
                        image: user.image,
                        value: user.userId,
                    };
                });

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    stock_request_for: row.stock_request_for,
                    supplier_id: getSupplierValue,
                    requested_for: requested_for.id,
                    requested_for_name: requested_for.name,
                    requested_for_image: requested_for.image ? requested_for.image : "",
                    requested_for_employee_id: requested_for.employee_id ? requested_for.employee_id : "",
                    requested_for_credit_limit: requested_for.credit_limit ? requested_for.credit_limit : "",
                    employee_id: stockForUserDetails.employee_id ? stockForUserDetails.employee_id : "",
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    status: row.status,
                    request_stock: requestStock,
                    total_sum_of_request: totalSum, //  old request stock prices here
                    total_sum_of_new_request_stock: totalSums, // new request stock prices here
                    total_sum_of_request_stock: total, // sum of total old and total new request stock amount
                    total_new_request_quantity: totalNewRequestQty,
                    total_request_quantity: totalRequestQty,
                    total_sum_of_quantity: totalQuantity,
                    request_stock_images: row.image ? JSON.parse(row.image) : "",
                    // request_stock_images:request_stock_images,
                    approved_data: row.approval_data ? JSON.parse(row.approval_data) : null,
                    approved_at: row.approved_at ? moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss A") : null,
                    total_approved_qty: row.total_approved_qty,
                    history: history,
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    gst_id: row.gst_id,
                    gst_type: await getGstMasterDetails(row.gst_id),
                    gst_percent: row.gst_percent,
                    request_tax_type: row.request_tax_type,
                    transfer_stocks: transfer_Stocks,
                    total_transfer_stocks: row.total_transfer_amount,
                    requested_by: requested_by.id,
                    requested_by_name: requested_by.name,
                    requested_by_image: requested_by.image ? requested_by.image : "",
                    requested_by_employee_id: requested_by.employee_id ? requested_by.employee_id : "",
                    area_manager_id: userDetails["Area Manager"] || {},
                    supervisor_id: userDetails["Supervisor"] || {},
                    end_users_id: userDetails["End User"] || {},
                    office_users_id: userDetails["Office User"] || {},
                    status: row.status,
                    bill_date: row.bill_date ? moment(row.bill_date).format("YYYY-MM-DD") : null,
                    bill_number: row.bill_number,
                    total_gst_amount: total_gst_amount,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const stockRequestDetailsUpdate = async (req, res, next) => {
    try {
        const { request_stock_by_user, request_tax_type, id, status } = req.body;
        const updated_by = req.user.user_id;
        const updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let resultImage = [];
        let queryResult;

        if (request_stock_by_user != null && request_stock_by_user != undefined) {
            let gst_id;
            let gst_percent;
            let total_gst_value;

            for (const row of request_stock_by_user) {
                const user_id = row.user_id;
                const total_request_qty = row.total_request_qty;

                if (row.request_stock_images != null && row.request_stock_images.length > 0) {
                    const processedImages = [];
                    for (let i = 0; i < row.request_stock_images.length; i++) {
                        if (row.request_stock_images[i].item_image.startsWith("data:image/")) {
                            const base64File = row.request_stock_images[i].item_image.replace(
                                /^data:image\/\w+;base64,/,
                                ""
                            );
                            const result = await convertBase64Image(
                                base64File,
                                "./public/stock_request_images/",
                                "/stock_request_images/"
                            );
                            processedImages.push({ title: row.request_stock_images[i].title, item_image: result });
                        } else {
                            processedImages.push({
                                title: row.request_stock_images[i].title,
                                item_image: row.request_stock_images[i].item_image,
                            });
                        }
                    }
                    resultImage = processedImages;
                }

                let result1;
                let new_item_image = [];
                if (Array.isArray(row.new_request_stock)) {
                    for (const new_request of row.new_request_stock) {
                        if (new_request && new_request.item_image) {
                            if (new_request.item_image.startsWith("data:image/")) {
                                const base64File = new_request.item_image.replace(/^data:image\/\w+;base64,/, "");
                                result1 = await convertBase64Image(
                                    base64File,
                                    "./public/stock_request_images/",
                                    "/stock_request_images/"
                                );
                            } else {
                                result1 = new_request.item_image;
                            }

                            const newItemObject = {
                                unit_id: new_request.unit_id,
                                description: new_request.description,
                                item_image: result1, // Assuming result contains the processed image path
                                title: new_request.title,
                                qty: new_request.qty,
                                transfer_quantity: new_request.transfer_quantity,
                                fund_amount: new_request.fund_amount,
                                rate: new_request.rate,
                                brand: new_request.brand,
                            };
                            new_item_image.push(newItemObject);
                        }
                    }
                } else {
                    new_item_image = [];
                }

                const finalData = {
                    request_stock: row.request_stock,
                    new_request_stock: new_item_image,
                };

                const request_stocks = JSON.stringify(finalData);
                const request_stock_images = JSON.stringify(resultImage);

                if (request_tax_type == "2") {
                    gst_id = row.gst_id.value;
                    gst_percent = row.gst_percent;
                    total_gst_value = "0.00";
                    if (gst_id == "") {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Please select gst type",
                        });
                    }
                }
                let insertQuery;
                let insertValues;

                if (status) {
                    insertQuery =
                        "UPDATE stock_requests SET request_stock = ?, image = ?, total_request_qty = ?, updated_by = ?, gst_id = ?, gst_percent = ?, status = ? WHERE id = ?";

                    insertValues = [
                        request_stocks,
                        request_stock_images,
                        total_request_qty,
                        updated_by,
                        gst_id || null,
                        gst_percent || null,
                        status,
                        id,
                    ];
                } else {
                    insertQuery =
                        "UPDATE stock_requests SET request_stock = ?, image = ?, total_request_qty = ?, updated_by = ?, gst_id = ?, gst_percent = ?, supplier_id = ? WHERE id = ?";

                    insertValues = [
                        request_stocks,
                        request_stock_images,
                        total_request_qty,
                        updated_by,
                        gst_id || null,
                        gst_percent || null,
                        row.supplier_id.value,
                        id,
                    ];
                }

                queryResult = await db.query(insertQuery, insertValues);
            }

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Stock request updated successfully" });
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: false,
                    message: "Error! stock request not updated",
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error,
        });
    }
};

const deleteStockRequest = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });

        const deleteQuery = await db.query("DELETE FROM stock_requests WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Stock requests deleted successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! stock requests not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateStockRequestStatus = async (req, res, next) => {
    try {
        const { id, status, request_stock_by_user, approve_quantity, approved_remarks, rejected_remarks } = req.body;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (approved_remarks === "") {
            console.error("Validation Error:", "Approved remarks cannot be empty");
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Approved remarks cannot be empty",
            });
        }

        let itemIndex = 0;
        if (
            itemIndex !== undefined &&
            itemIndex >= 0 &&
            itemIndex < request_stock_by_user[0].new_request_stock.length
        ) {
            const item = request_stock_by_user[0].new_request_stock[itemIndex];

            // Check if view_status is not already 1, if yes, no need to update
            if (item.view_status !== true) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ status: false, message: "Please view the image first." });
            }

            // Update view_status to 1 as the image is viewed
            request_stock_by_user[0].new_request_stock[itemIndex].view_status = true;
        }

        //Get already approved data for that stock request
        if (approve_quantity <= 0) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Approved quantity is not valid value" });
        }

        const queryResult = await db.query(`SELECT * FROM stock_requests WHERE id = ?`, [id]);

        if (queryResult[0].status == "1") {
            const removeItems = await removeItemInStocks(id);
        }

        var finalItem = [];
        // var transactionData = [];
        var remarksData = [];
        var transactionDateData = [];
        var transaction_today_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        finalItem = request_stock_by_user;

        if (remarksData != null) {
            remarksData.push(approved_remarks);
        } else {
            remarksData = [approved_remarks];
        }

        if (transactionDateData != null) {
            transactionDateData.push(transaction_today_date);
        } else {
            transactionDateData = [transaction_today_date];
        }
        const approved_stocks = JSON.stringify(finalItem);
        const remarks = JSON.stringify(remarksData);
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const newRequestData = request_stock_by_user[0].new_request_stock;
        newRequestData.forEach((item) => {
            item.supplier_id = request_stock_by_user[0].supplier_id;
        });
        // Check for new item master approval status before approving fund request

        if (newRequestData.length) {
            const newItemAddStatus = await checkForNewItemApprovalStatusForFundRequest(newRequestData, "stock");
            if (!newItemAddStatus.status) {
                return res.status(StatusCodes.BAD_REQUEST).json(newItemAddStatus);
            }
        }

        const updateQuery = await db.query(
            "UPDATE stock_requests SET status = ?, approval_data = ?, approved_by = ?, approved_at = ?, total_approved_qty = ?, approved_remark = ?, transaction_date = ? WHERE id = ?",
            [
                status,
                approved_stocks,
                approved_by,
                approved_at,
                approve_quantity,
                remarks,
                JSON.stringify(transactionDateData),
                id,
            ]
        );

        if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
            if (status == "1") {
                const dbStockData = await db.query("SELECT * FROM stock_requests WHERE id = ?", [id]);
                if (dbStockData.length > process.env.VALUE_ZERO) {
                    const dbStock = dbStockData[0];
                    const getSupplierId = dbStockData[0].supplier_id;

                    const approvedData = dbStock.approval_data;
                    if (approvedData != null) {
                        for (const row of JSON.parse(approvedData)) {
                            const allNewRequestStock = row.new_request_stock;
                            if (allNewRequestStock != null && allNewRequestStock.length > 0) {
                                let getItemId = await addItemFromStockRequestToItemMasters(
                                    allNewRequestStock,
                                    getSupplierId,
                                    req
                                );
                            }
                        }
                    }
                }

                const result = await addRequestStockDataToStock(id);
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Status changed successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

async function addRequestStockDataToStock(id) {
    try {
        // add approved request data to stock
        const currentMonthYear = moment().format("YYYY-MM");
        const request_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const dbStockData = await db.query("SELECT * FROM stock_requests WHERE id = ?", [id]);
        if (dbStockData.length > process.env.VALUE_ZERO) {
            const dbStock = dbStockData[0];
            const requested_by = dbStock.requested_by;
            const request_date = dbStock.request_date;
            const total_request_qty = dbStock.total_approved_qty;
            const approvedData = dbStock.approval_data;
            const getSupplierId = dbStockData[0].supplier_id;
            if (approvedData != null) {
                for (const row of JSON.parse(approvedData)) {
                    const allRequests = row.request_stock.concat(row.new_request_stock);
                    for (const item of allRequests) {
                        if (item.item_name && item.item_name.value) {
                            const q = `SELECT * FROM stocks WHERE requested_by = ? AND product_id = ? AND rate = ? AND DATE_FORMAT(created_at, '%Y-%m') = ?`;
                            const getExistStockDetails = await db.query(q, [
                                requested_by,
                                item.item_name.value,
                                item.approve_price,
                                currentMonthYear,
                            ]);

                            if (getExistStockDetails.length > 0) {
                                for (const existingStock of getExistStockDetails) {
                                    const quantity = Number(item.approve_quantity) + Number(existingStock.quantity);

                                    const rate = item.approve_price;
                                    const updateQuery = `UPDATE stocks SET rate = ?, quantity = ? WHERE requested_by = ? AND product_id = ?  AND DATE_FORMAT(created_at, '%Y-%m') = ?`;
                                    await db.query(updateQuery, [
                                        rate,
                                        quantity,
                                        requested_by,
                                        item.item_name.value,
                                        currentMonthYear,
                                    ]);
                                }
                            } else {
                                const insertQuery = `INSERT INTO stocks (product_id, rate, quantity, supplier_id, requested_by) VALUES (?, ?, ?, ?, ?)`;
                                await db.query(insertQuery, [
                                    item.item_name.value,
                                    item.approve_price,
                                    item.approve_quantity,
                                    getSupplierId,
                                    requested_by,
                                ]);
                            }
                        } else if (item.title && (item.title.label || item.title.value)) {
                            let productId, rate, quantity;
                            if (!isNaN(item.title.value) && Number(item.title.value) !== 0) {
                                productId = item.title.value;
                                const existingItem = await db.query(
                                    `SELECT * FROM stocks WHERE product_id = ? AND rate = ? AND DATE_FORMAT(created_at, '%Y-%m') = ?`,
                                    [productId, item.rate, currentMonthYear]
                                );

                                if (existingItem.length > 0) {
                                    quantity = Number(item.qty) + Number(existingItem[0].quantity);

                                    const updateQuery = `UPDATE stocks SET quantity = ?, requested_by = ? WHERE product_id = ?  AND DATE_FORMAT(created_at, '%Y-%m') = ?`;
                                    await db.query(updateQuery, [quantity, requested_by, productId, currentMonthYear]);
                                } else {
                                    rate = item.rate;

                                    const insertQuery = `INSERT INTO stocks (product_id, rate, quantity, supplier_id, requested_by) VALUES (?, ?, ?, ?, ?)`;
                                    await db.query(insertQuery, [
                                        productId,
                                        item.rate,
                                        item.qty,
                                        getSupplierId,
                                        requested_by,
                                    ]);
                                }
                            } else if (
                                item.title &&
                                typeof item.title.label === "string" &&
                                typeof item.title.value === "string"
                            ) {
                                productId = item.title.value;
                                rate = item.rate;
                                quantity = item.qty;
                                const insertQuery = `
                                    INSERT INTO stocks (new_item, rate, quantity, supplier_id, requested_by) VALUES (?, ?, ?, ?, ?)`;
                                await db.query(insertQuery, [productId, rate, quantity, getSupplierId, requested_by]);

                                const selectQuery = await db.query(`SELECT id FROM item_masters WHERE name = ?`, [
                                    item.title.value,
                                ]);

                                if (selectQuery.length > 0) {
                                    const getId = selectQuery[0].id;

                                    // Update item_id in fund_requests table
                                    await db.query(`UPDATE stocks SET product_id = ? WHERE new_item = ?`, [
                                        getId,
                                        item.title.value,
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

const getStockDetailsOnItemId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const request_by = req.params.user_id;
        if (request_by <= 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please select user" });
        }
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const queryResult = await db.query(
            `SELECT product_id as item_id, rate as item_price, quantity FROM stocks WHERE product_id = ? AND requested_by = ?`,
            [id, request_by]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            //const data = {item_id: 0, item_price: 0, quantity: 0};
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const transferStock = async (req, res, next) => {
    try {
        const { error } = transferStockValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const { transfer_for, transfer_by, transfer_to, items } = req.body;

        const created_by = req.user.user_id;

        for (const [index, item] of items.entries()) {
            try {
                const itemData = await getItemDetailsById(item.item_id);

                if (itemData.qty < item.qty) {
                    throw new Error("Insufficient quantity!");
                }

                const Stock = await db.query(
                    `SELECT * FROM stocks WHERE product_id = ? AND requested_by = ? AND supplier_id = ?`,
                    [item.item_id, transfer_to, itemData.supplier_id]
                );

                let StockQuery;
                let params;

                if (Stock.length > 0) {
                    const updateQty = Number(item.qty) + Number(Stock[0].quantity);
                    StockQuery = `UPDATE stocks SET quantity = ? WHERE id = ?`;
                    params = [updateQty, Stock[0].id];
                } else {
                    StockQuery = `INSERT INTO stocks(product_id, rate, quantity, supplier_id, requested_by) VALUES (?,?,?,?,?)`;
                    params = [item.item_id, itemData.rate, item.qty, itemData.supplier_id, transfer_to];
                }

                await db.query(StockQuery, params);

                const insertHistoryQuery = `INSERT INTO stock_transfer_history(item_id, transfered_for, transfered_by, transfered_to, quantity, supplier_id, created_by) VALUES (?,?,?,?,?,?,?)`;
                const historyParams = [
                    item.item_id,
                    transfer_for,
                    transfer_by,
                    transfer_to,
                    item.qty,
                    itemData.supplier_id,
                    created_by,
                ];
                await db.query(insertHistoryQuery, historyParams);

                const updateItemQuery = `UPDATE item_masters SET qty = ? WHERE id = ?`;
                await db.query(updateItemQuery, [itemData.qty - item.qty, item.item_id]);
            } catch (error) {
                return next(error);
            }
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Stock transferred successfully!" });
    } catch (error) {
        return next(error);
    }
};

const getSupplier = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id, username, name, email, mobile FROM users WHERE role_id = '42';`;
        const execSupplier = await db.query(selectQuery);
        return res.status(StatusCodes.OK).json({ status: true, data: execSupplier });
    } catch (error) {
        return next(error);
    }
};

const getRescheduleTransferStock = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.unique_id LIKE '%${searchData}%')`;
        }
        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE status IN ('1', '4') AND reschedule_stock_transfer = '0' AND created_by = '${req.user.user_id}' ${search_value} 
            ORDER BY stock_requests.id 
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let totalApproveAmount = 0;
        // Calculate the total sum of amounts for request_stock

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];

                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const rejectedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);

                const transfer_stocks = JSON.parse(row.transfer_stocks);

                const data = JSON.parse(row.request_stock);

                const totalItemsInRequestFund = data.request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                for (const item of data.new_request_stock) {
                    if (item.title) {
                        totalTitlesInNewRequestFund++;
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                let totalSumRequestStock = 0;
                if (data.request_stock) {
                    data.request_stock.forEach((item) => {
                        totalSumRequestStock += Number(item.request_quantity) * Number(item.current_item_price);
                    });
                }

                let totalSumNewRequestStock = 0;
                if (data.new_request_stock) {
                    data.new_request_stock.forEach((item) => {
                        totalSumNewRequestStock += Number(item.qty) * Number(item.rate);
                    });
                }

                const totalSumOfRequests = totalSumRequestStock + totalSumNewRequestStock;

                const approvalData = JSON.parse(row.approval_data);

                let totalSumRequestStockApprove = 0;
                if (approvalData && approvalData.length > 0) {
                    approvalData.forEach((data) => {
                        if (data.request_stock) {
                            data.request_stock.forEach((item) => {
                                totalSumRequestStockApprove +=
                                    Number(item.request_quantity) * Number(item.current_item_price);
                            });
                        }

                        if (data.new_request_stock) {
                            data.new_request_stock.forEach((item) => {
                                totalSumRequestStockApprove += Number(item.qty) * Number(item.rate);
                            });
                        }
                    });
                }
                let status;

                if (row.status === "1") {
                    status = "Rescheduled";
                } else if (row.status === "4") {
                    status = "Partial";
                }

                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    reschdule_transfer: row.reschdule_transfer,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    reschedule_date: row.reschedule_date,
                    status: status,
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    approved_date: moment(row.approved_at).format("DD-MM-YYYY HH:mm:ss A"),
                    request_stock_quantity: row.total_request_qty,
                    approve_stock_quantity: row.total_approved_qty,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const rescheduledTransferstock = async (req, res, next) => {
    try {
        const { id, rescheduled_date } = req.params;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const { error: dateError } = reschduleDate.validate(rescheduled_date);

        if (dateError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid date format. Date should be in YYYY-MM-DD format",
            });
        }

        const selectedDate = new Date(rescheduled_date);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please select upcoming date.",
            });
        }

        const selectQuery = `UPDATE stock_requests SET reschedule_stock_transfer = 0, reschedule_date='${rescheduled_date}' WHERE id = '${id}'`;
        const execQuery = await db.query(selectQuery);

        if (execQuery.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Stock Request rescheduled." });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Stock Request not rescheduled." });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
    }
};

async function getRescheduleDate() {
    // Get tomorrow's date
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split("T")[0]; // Convert to ISO date string format

    // Fetch records with rescheduled date as tomorrow's date
    const selectQuery = `SELECT id FROM stock_requests WHERE reschedule_stock_transfer = 0 AND DATE(reschedule_date) = '${tomorrowDateString}' ORDER BY id ASC`;
    const queryResult = await db.query(selectQuery);
    return queryResult;
}
cron.schedule("0 0 * * *", async () => {
    try {
        const rescheduleData = await getRescheduleDate();
        if (rescheduleData.length > 0) {
            // Extract IDs from the query result
            const ids = rescheduleData.map((data) => data.id);
            // Update records where id is in the list of IDs
            await db.query("UPDATE stock_requests SET reschedule_stock_transfer = 1 WHERE id IN (?)", [ids]);
        } else {
            await db.query(
                "UPDATE stock_requests SET reschedule_stock_transfer = 1 WHERE reschedule_stock_transfer = 0 AND reschedule_date IS NULL"
            );
        }
        console.log("reschedule_stock_transfer status reset successfully");
    } catch (error) {
        console.error("Error resetting reschedule_stock_transfer status:", error);
        throw error;
    }
});

const stocksAmountTransfer = async (req, res, next) => {
    try {
        const {
            transfer_data,
            id,
            remark,
            transaction_id,
            account_id,
            payment_mode,
            bill_date,
            bill_number,
            bill_amount,
        } = req.body;

        const { error } = transferFund.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const transfer_by = req.user.user_id;

        const transfer_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const transactionIdExists = await db.query(`SELECT * FROM account_transactions WHERE transaction_id=?`, [
            transaction_id,
        ]);

        if (transactionIdExists.length > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                status: false,
                message: "Transaction ID already exists. Please use a different transaction ID.",
            });
        }
        // Get already approved data for that fund request
        const transferData = await db.query(`SELECT * FROM stock_requests WHERE id = ?`, [id]);
        // Parse the approval_data string into a JavaScript object
        const approvalData = JSON.parse(transferData[0].approval_data);

        let totalApproveAmount = 0;

        // Calculate the total sum of amounts for request_stock
        if (approvalData[0]?.request_stock) {
            for (const item of approvalData[0].request_stock) {
                totalApproveAmount += Number(item.approve_quantity) * Number(item.current_item_price);
            }
        }

        // Calculate the total sum of amounts for new_request_stock
        if (approvalData[0]?.new_request_stock) {
            for (const item of approvalData[0].new_request_stock) {
                totalApproveAmount += Number(item.qty) * Number(item.rate);
            }
        }

        let finalItem = [];
        let total_transfer_amount;

        const userId = transferData[0].requested_by; // get user id

        finalItem = {
            request_stock: transfer_data[0].request_stock,
            new_request_stock: transfer_data[0].new_request_stock,
        };

        const final_transfer_data = JSON.stringify(finalItem);
        // Calculate total sum for request_stock
        let totalSumTransferFund = 0;

        // if (transfer_data[0].request_stock) {
        //     transfer_data[0].request_stock.forEach(item => {
        //         totalSumTransferFund += Number(item.transfer_qty) * Number(item.current_item_price);
        //     });
        // }

        if (transfer_data[0].request_stock) {
            transfer_data[0].request_stock.forEach((item) => {
                if (item.transfer_qty !== undefined && item.transfer_qty !== null) {
                    totalSumTransferFund += Number(item.transfer_qty) * Number(item.approve_price);
                } else {
                    totalSumTransferFund += 0;
                }
            });
        }

        let totalSumNewTransferFund = 0;

        if (transfer_data[0].new_request_stock) {
            transfer_data[0].new_request_stock.forEach((item) => {
                // Ensure transfer_qty is defined and not null
                if (item.transfer_qty !== undefined && item.transfer_qty !== null) {
                    totalSumNewTransferFund += Number(item.transfer_qty) * Number(item.rate);
                } else {
                    // Handle undefined or null transfer_qty (default to 0)
                    totalSumNewTransferFund += 0; // Add 0 to the total sum
                }
            });
        }
        // Calculate total sum
        const totalSum = Number(totalSumTransferFund) + Number(totalSumNewTransferFund);
        total_transfer_amount = totalSum.toFixed(3);

        const checkLimit = await getTotalTransferAmounts(userId, total_transfer_amount);

        if (checkLimit === false) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Your credit limit amount exceeds." });
        }
        // get remaining amount from users
        const checkTotalTransferAmount = total_transfer_amount + transferData[0].total_transfer_amount;

        let paymentStatus;
        if (payment_mode === "Cash" && totalApproveAmount >= checkTotalTransferAmount) {
            var remainingAmountForCash = totalApproveAmount - checkTotalTransferAmount;
            if (remainingAmountForCash > 0) {
                paymentStatus = "4";
                const updateReschedule = await reschedulePartialTransfer(id);
            } else {
                paymentStatus = "5";
            }
        }

        if (payment_mode !== "Cash") {
            var insertTransaction = await transactionDetails(
                transfer_by,
                remark,
                transaction_id,
                total_transfer_amount,
                account_id,
                totalApproveAmount,
                id,
                payment_mode,
                bill_date,
                bill_number
            );
            // const addTransferInFund = addItemToFundRequest(transfer_data, id)
        }

        console.log("insertTransaction: ", insertTransaction);
        if (payment_mode === "Cash") {
            const statusChangedQuery = `UPDATE stock_requests SET total_transfer_amount = '${total_transfer_amount}', transfer_stocks = '${final_transfer_data}', status = '${paymentStatus}', bill_date ='${bill_date}', bill_number='${bill_number}', bill_amount='${bill_amount}', remaining_transfer_amount= '${remainingAmountForCash}' WHERE id = '${id}'`;
            const queryResult = await db.query(statusChangedQuery);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Stock Transfer successfully" });
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Status not changed" });
            }
        } else if (insertTransaction === "Insufficient balance") {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Insufficient balance" });
        } else if (insertTransaction === "Amount is too large") {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Transfer amount should not be greater than approved amount." });
        } else if (insertTransaction.status === "success") {
            const addAmountInWallet = await addAmountToRequestedUserWallet(id, transfer_by, total_transfer_amount);
            const walletTransactions = await transactionAdd(id, transfer_by, total_transfer_amount);

            const statusChangedQuery = `UPDATE stock_requests SET total_transfer_amount = ?, transfer_stocks = ?, status = ?, bill_date =?, bill_number=?, bill_amount=?, remaining_transfer_amount=? WHERE id = ?`;

            const queryResult = await db.query(statusChangedQuery, [
                insertTransaction.getTotalAmount,
                final_transfer_data,
                `${insertTransaction.getStatus}`,
                bill_date,
                bill_number,
                bill_amount,
                insertTransaction.remainingTransferAmount,
                id,
            ]);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Stock Transfer successfully" });
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Status not changed" });
            }
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

async function transactionDetails(
    transfer_by,
    remark,
    transaction_id,
    total_transfer_amount,
    account_id,
    totalApproveAmount,
    id,
    payment_mode
) {
    try {
        // Get the latest transaction details
        const queryResult = await db.query(
            `SELECT * FROM account_transactions WHERE account_id=? ORDER BY id DESC LIMIT 1`,
            [account_id]
        );
        if (queryResult.length === 0) {
            throw new Error(`Insufficient balance for provided account`);
        }
        // Check if there are any previous transactions
        // console.log('queryResult[0].updated_balance: ', queryResult[0].updated_balance);
        const balance = queryResult[0].updated_balance;
        // Validate if the balance is sufficient for the transaction
        if (balance < total_transfer_amount) {
            return "Insufficient balance";
        }
        const getStatus = await getTotalTransferValue(total_transfer_amount, id, totalApproveAmount);
        if (totalApproveAmount < getStatus.getTotalAmount) {
            return "Amount is too large";
        }
        // Calculate the final balance after deducting the transfer amount
        const finalBalance = balance - total_transfer_amount;

        // Insert the new transaction record
        const createTransactions = await db.query(
            `INSERT INTO account_transactions SET user_id=?, account_id=?, status='debit', transaction=?, updated_balance=?, transaction_id=?, description=?, payment_mode = ?,  category_type = 'stock' `,
            [transfer_by, account_id, total_transfer_amount, finalBalance, transaction_id, remark, payment_mode]
        );

        let updateUserBalance;
        // Update the account balance
        if (createTransactions.affectedRows > 0) {
            updateUserBalance = await db.query(`UPDATE accounts SET balance=? WHERE id=?`, [finalBalance, account_id]);
        }
        return {
            status: "success",
            getStatus: getStatus.status,
            getTotalAmount: getStatus.getTotalAmount,
            remainingTransferAmount: getStatus.remainingAmount,
        };
    } catch (error) {
        throw error;
    }
}

async function transactionAdd(id, transfer_by, total_transfer_amount) {
    const selectQuery = await db.query(`SELECT requested_by FROM stock_requests WHERE id='${id}'`);

    if (selectQuery.length > 0) {
        const userId = selectQuery[0].requested_by;
        let insert;
        const transaction_date = moment().format("YYYY-MM-DD");
        const select = await db.query(`SELECT * FROM user_wallets WHERE user_id = '${userId}'`);

        if (select.length > 0) {
            const lastBalance = Number(select[0].balance) + Number(total_transfer_amount);

            const insertQuery = `INSERT INTO transactions (user_id, transaction_type, transaction_date, created_by, amount, balance, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            insert = await db.query(insertQuery, [
                userId,
                "credit",
                transaction_date,
                transfer_by,
                total_transfer_amount,
                lastBalance,
                "Add fund from fund transactions.",
            ]);
        } else {
            const insertQuery = `INSERT INTO transactions (user_id, transaction_type, transaction_date, created_by, amount, balance, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            insert = await db.query(insertQuery, [
                userId,
                "credit",
                transaction_date,
                transfer_by,
                total_transfer_amount,
                total_transfer_amount,
                "Add fund from fund transactions.",
            ]);
        }

        const query = `SELECT id FROM account_transactions ORDER BY id DESC LIMIT 1`;
        const latestTransaction = await db.query(query);
        if (latestTransaction.length > 0) {
            // update transaction id into account_transactions
            const result = await db.query(
                `UPDATE account_transactions SET user_transaction_id = '${insert.insertId}' WHERE id = '${latestTransaction[0].id}'`
            );
        }
    } else {
        console.log("No record found for the provided ID.");
    }
}

async function getTotalTransferValue(total_transfer_amount, id, totalApproveAmount) {
    const selectQuery = await db.query(`SELECT total_transfer_amount FROM stock_requests WHERE id = ?`, [id]);

    if (selectQuery.length > 0) {
        const { total_transfer_amount: getTransferAmount } = selectQuery[0];

        const getTotalAmount = Number(getTransferAmount) + Number(total_transfer_amount);
        // Determine status based on the comparison
        const get_remaining_transfer_amount = Number(totalApproveAmount) - Number(getTotalAmount);
        // const tomorrowDate = new Date();
        // tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        // const tomorrowDateString = tomorrowDate.toISOString().split('T')[0];
        const status = getTotalAmount == totalApproveAmount ? 5 : 4;

        if (status == 4) {
            // await db.query(`UPDATE stock_requests SET reschedule_stock_transfer = 0, reschedule_date = '${tomorrowDateString}' WHERE id='${id}'`)
            const updateReschedule = await reschedulePartialTransfer(id);
        }
        return { status: status, getTotalAmount: getTotalAmount, remainingAmount: get_remaining_transfer_amount };
    }
}

async function reschedulePartialTransfer(id) {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];
    await db.query(
        `UPDATE stock_requests SET reschedule_stock_transfer = 0, reschedule_date = '${tomorrowDateString}' WHERE id='${id}'`
    );
}

async function addAmountToRequestedUserWallet(id, transfer_by, total_transfer_amount) {
    const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM stock_requests WHERE id = ?`, [id]);
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
        const requestedData = getApprovedRequestedFundDetails[0];
        const user_id = requestedData.requested_by;
        // const amount = requestedData.total_approved_amount;
        const amount = total_transfer_amount;
        const request_by = transfer_by;
        //---check if user id is in wallet then update balance otherwise put request approved amount in wallet---

        const getWalletBalance = await db.query(`SELECT * FROM user_wallets WHERE user_id = ?`, [user_id]);

        if (getWalletBalance.length > process.env.VALUE_ZERO) {
            //---------------update wallet balance--------------------------------
            const walletBalanceId = getWalletBalance[0].id;
            // console.log('walletBalanceId: ', walletBalanceId);
            const dbWalletBalance = getWalletBalance[0].balance;
            // console.log('dbWalletBalance: ', dbWalletBalance);
            const updatedWalletBalance = Number(dbWalletBalance) + Number(amount);
            // console.log('updatedWalletBalance: ', updatedWalletBalance);
            const updateQuery = `UPDATE user_wallets SET balance  = ?, updated_by = ?, updated_at = ? WHERE id = ?`;
            const queryResult = await db.query(updateQuery, [updatedWalletBalance, request_by , createdAt, walletBalanceId]);
            // console.log('queryResult:(addAmountToRequestedUserWallet) ', queryResult);
            if(queryResult.affectedRows > process.env.VALUE_ZERO){
                return true;
            } else return false;
        } else {
            //---------------add user to wallet--------------------------------
            const insertQuery = `INSERT INTO user_wallets (user_id, balance, created_by, created_at) VALUES(?, ?, ?, ?)`;
            const queryResult = await db.query(insertQuery, [user_id, amount, request_by, createdAt]);
            if(queryResult.affectedRows > process.env.VALUE_ZERO){
                return true;
            } else return false;
        }
    }
}

async function addItemFromStockRequestToItemMasters(newRequestData, getSupplierId, req) {
    try {
        const insertIds = [];
        const createdBy = req.user.user_id;
        for (const requestData of newRequestData) {
            const { unit_id, description, item_image, title, rate, qty, hsncode } = requestData;
            if (typeof title.value == "string") {
                // var storePath = '';
                let hsncodes = hsncode ? hsncode : "";
                // const processedImages = [];

                // const base64File = item_image.replace(/^data:image\/\w+;base64,/, '');
                // const result = await convertBase64Image(base64File, './public/item_masters/', '/item_masters/');
                // processedImages.push(result);

                // storePath = processedImages.join(', ');

                const generateAutomatically = await generateRandomNumber(10);
                const insertQuery = `
                    INSERT INTO item_masters SET 
                    name = '${title.value}', 
                    rate = '${rate}', 
                    qty = '${qty}', 
                    image = '${item_image}', 
                    hsncode = '${hsncodes}',
                    description='${description}', 
                    supplier_id = '${getSupplierId}', 
                    unique_id = '${generateAutomatically}', 
                    status = '0', 
                    unit_id = '${unit_id.value}',
                    created_by = '${createdBy}'
                `;

                const getResult = await db.query(insertQuery);
                if (getResult.affectedRows > 0) {
                    insertIds.push(getResult.insertId);
                }
            }
        }
        return insertIds;
    } catch (error) {
        throw error;
    }
}

const getAllPendingStockTransfer = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE total_approved_qty > 0 AND reschedule_stock_transfer = 1 AND status IN ('1', '4') AND created_by = '${req.user.user_id}' 
            ${search_value} ORDER BY stock_requests.id 
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.approval_data);
                const totalItemsInRequestFund = request_stock[0].request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                if (Array.isArray(request_stock[0].new_request_stock)) {
                    for (const item of request_stock[0].new_request_stock) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }
                const requestStock = JSON.parse(row.request_stock);

                let totalSum = 0; // add old request stock prices here
                if (requestStock.request_stock) {
                    for (const item of requestStock.request_stock) {
                        totalSum += item.total_price;  // Calculate total requested amount by adding items prices with quantities
                    }
                }

                let totalSums = 0;  // add new request stock prices here
                // Iterate over new_request_fund array and sum up fund_amount
                if (requestStock.new_request_stock) {
                    for (const item of requestStock.new_request_stock) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums); // sum of total old and total new request stock amount

                // console.log('row: ', row);
                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: row.status,
                    approved_request_stock: JSON.parse(row.approval_data),
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                    total_transfer_amount: row.total_transfer_amount,
                    total_requested_amount: total, // sum of total old and total new request stock amount
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const getAllPreviousPriceOfStocks = async (req, res, next) => {
    try {
        const request_for_id = req.params.request_for_id;

        // Validate request_for_id
        const { error } = checkPositiveInteger.validate({ id: request_for_id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
        const queryResults = await db.query(
            `SELECT SUM(total_transfer_amount) AS total_transfer_amount  FROM stock_requests WHERE requested_by = ?`,
            [request_for_id]
        );

        // Fetch data from the database
        const queryResult = await db.query(`SELECT * FROM stocks WHERE requested_by = ?`, [request_for_id]);
        // Check if data found
        if (queryResult.length > 0) {
            // Assuming finalBalance is calculated somewhere else
            const finalBalance = await calculateFinalBalance(queryResult);

            const lastBalance = finalBalance - queryResults[0].total_transfer_amount;

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: lastBalance });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
        // Internal server error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

async function getTotalTransferAmounts(id, total_transfer_amount) {
    const selectQuery = await db.query(
        `SELECT SUM(total_transfer_amount) as transfer_amount FROM stock_requests WHERE requested_by = '${id}'`
    );

    if (selectQuery.length > 0) {
        const getTotalPunchAmount = await db.query(
            `SELECT SUM(stock_punch_transfer) AS stock_punch_transfer FROM stocks WHERE requested_by = '${id}'`
        );
        const getRemainingLimit =
            Number(selectQuery[0].transfer_amount) - Number(getTotalPunchAmount[0].stock_punch_transfer);

        const transferAmount = getRemainingLimit + Number(total_transfer_amount);

        const getUserLimit = await db.query(
            `SELECT credit_limit FROM users WHERE id = '${id}' UNION SELECT credit_limit FROM admins WHERE id = '${id}';`
        );

        if (!(transferAmount < getUserLimit[0].credit_limit)) {
            return false;
        } else {
            return true;
        }
    }
}

// Function to calculate final balance
async function calculateFinalBalance(data) {
    // Calculate final balance here
    // Example calculation:
    let balance = 0;
    data.forEach((item) => {
        balance += item.quantity * item.rate;
    });
    return balance;
}

const getStockTransfer = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE total_approved_qty > 0 AND reschedule_stock_transfer IN ('0', '1')  AND status IN ('4', '5') AND created_by = '${req.user.user_id}' 
            ${search_value} 
            ORDER BY stock_requests.id
            LIMIT ${pageFirstResult} , ${pageSize}
        `;

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.approval_data);
                const transfer_stocks = JSON.parse(row.transfer_stocks);

                const totalItemsInRequestFund = request_stock[0].request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                if (Array.isArray(request_stock[0].new_request_stock)) {
                    for (const item of request_stock[0].new_request_stock) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                const request_by_details = await getCreatedByDetails(row.requested_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);

                const data = JSON.parse(row.request_stock);

                let totalSumRequestStock = 0;
                if (data.request_stock) {
                    data.request_stock.forEach((item) => {
                        totalSumRequestStock += Number(item.request_quantity) * Number(item.current_item_price);
                    });
                }

                let totalSumNewRequestStock = 0;
                if (data.new_request_stock) {
                    data.new_request_stock.forEach((item) => {
                        totalSumNewRequestStock += Number(item.qty) * Number(item.rate);
                    });
                }

                const totalSumOfRequests = totalSumRequestStock + totalSumNewRequestStock;

                const approvalData = JSON.parse(row.approval_data);

                let totalSumRequestStockApprove = 0;
                if (approvalData && approvalData.length > 0) {
                    approvalData.forEach((data) => {
                        if (data.request_stock) {
                            data.request_stock.forEach((item) => {
                                totalSumRequestStockApprove +=
                                    Number(item.request_quantity) * Number(item.current_item_price);
                            });
                        }

                        if (data.new_request_stock) {
                            data.new_request_stock.forEach((item) => {
                                totalSumRequestStockApprove += Number(item.qty) * Number(item.rate);
                            });
                        }
                    });
                }

                let status;
                if (row.status === "4") {
                    status = "Partial";
                } else if (row.status === "5") {
                    status = "Done";
                }

                const transferStocks = transfer_stocks?.request_stock || [];
                const newTransferStocks = transfer_stocks?.new_request_stock || [];

                let totalTransferQty = 0;

                // Iterate over request_stock array
                if (transferStocks) {
                    transferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                // Iterate over new_request_stock array
                if (newTransferStocks) {
                    newTransferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: status,
                    approved_request_stock: JSON.parse(row.approval_data),
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                    transfer_stock: transfer_stocks,
                    transfer_stock_amount: row.total_transfer_amount,
                    request_stock_quantity: row.total_request_qty,
                    approve_stock_quantity: row.total_approved_qty,
                    transfer_stock_quantity: totalTransferQty,
                    bill_number: row.bill_number,
                    bill_date: row.bill_date ? moment(row.bill_date).format("YYYY-MM-DD") : null,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const getAllStockTransfer = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        let selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE total_approved_qty > 0 AND reschedule_stock_transfer IN ('0', '1')  AND status IN ('1', '4', '5') AND created_by = '${req.user.user_id}' 
            ${search_value} 
            ORDER BY stock_requests.id
        `;

        if (pageSize) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];

                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.approval_data);
                const transfer_stocks = JSON.parse(row.transfer_stocks);
                const totalItemsInRequestFund = request_stock[0].request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                if (Array.isArray(request_stock[0].new_request_stock)) {
                    for (const item of request_stock[0].new_request_stock) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                const request_by_details = await getCreatedByDetails(row.requested_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);

                const data = JSON.parse(row.request_stock);

                let totalSumRequestStock = 0;
                if (data.request_stock) {
                    data.request_stock.forEach((item) => {
                        totalSumRequestStock += Number(item.request_quantity) * Number(item.current_item_price);
                    });
                }

                let totalSumNewRequestStock = 0;
                if (data.new_request_stock) {
                    data.new_request_stock.forEach((item) => {
                        totalSumNewRequestStock += Number(item.qty) * Number(item.rate);
                    });
                }

                const totalSumOfRequests = totalSumRequestStock + totalSumNewRequestStock;

                const approvalData = JSON.parse(row.approval_data);

                let totalSumRequestStockApprove = 0;
                if (approvalData && approvalData.length > 0) {
                    approvalData.forEach((data) => {
                        if (data.request_stock) {
                            data.request_stock.forEach((item) => {
                                totalSumRequestStockApprove +=
                                    Number(item.request_quantity) * Number(item.current_item_price);
                            });
                        }

                        if (data.new_request_stock) {
                            data.new_request_stock.forEach((item) => {
                                totalSumRequestStockApprove += Number(item.qty) * Number(item.rate);
                            });
                        }
                    });
                }

                const transferStocks = transfer_stocks?.request_stock || [];
                const newTransferStocks = transfer_stocks?.new_request_stock || [];

                let totalTransferQty = 0;

                // Iterate over request_stock array
                if (transferStocks) {
                    transferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                // Iterate over new_request_stock array
                if (newTransferStocks) {
                    newTransferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                let status;
                if (row.status == "0") {
                    status = "Pending";
                } else if (row.status == "1") {
                    status = "Approved";
                } else if (row.status === "4") {
                    status = "Partial";
                } else if (row.status === "5") {
                    status = "Done";
                } else if (row.status === "2") {
                    status = "Rejected";
                }
                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: status,
                    approved_request_stock: JSON.parse(row.approval_data),
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                    transfer_stock: transfer_stocks,
                    transfer_stock_amount: row.total_transfer_amount,
                    request_stock_quantity: row.total_request_qty,
                    approve_stock_quantity: row.total_approved_qty,
                    transfer_stock_quantity: totalTransferQty,
                });
            }

            if (!pageSize) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "stock_transfer", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "stock_transfer", "Transfer Stock", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

const rejectStockRequest = async (req, res, next) => {
    try {
        const { id, rejected_remarks, status } = req.body;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(
            `UPDATE stock_requests SET status = '${status}', rejected_remarks='${rejected_remarks}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const removeItems = await removeItemInStocks(id);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request rejected successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const reActiveToRejectedStockRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }
        const updated_by = req.user.user_id;
        const queryResult = await db.query(
            `UPDATE stock_requests SET status = '0', updated_by = '${updated_by}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request Reactive successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getLastThreePrevPriceInStocks = async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const selectQuery = await db.query(
            `SELECT st.id, im.name AS item_name, st.product_id as item_id, st.rate as item_price, st.requested_by, st.quantity, st.created_at as date FROM stocks AS st JOIN item_masters AS im ON st.product_id = im.id WHERE st.product_id = '${id}' AND st.requested_by = '${userId}' ORDER BY st.created_at DESC LIMIT 3;`
        );
        if (selectQuery.length > 0) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: selectQuery });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllhistoryByToday = async (req, res, next) => {
    try {
        const supplier_id = req.params.supplier_id;
        const { error } = checkPositiveInteger.validate({ id: supplier_id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = await db.query(
            `
            SELECT * 
            FROM stocks 
            LEFT JOIN item_masters ON stocks.product_id = item_masters.id 
            WHERE DATE(stocks.created_at) = CURDATE() AND stocks.supplier_id = ?
        `,
            [supplier_id]
        );

        if (selectQuery.length > 0) {
            const final = [];
            for (const row of selectQuery) {
                const getSupplierName = await getSupplierDetailsById(supplier_id);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                final.push({
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    item_id: row.product_id,
                    item_name: row.name,
                    item_image: row.image,
                    requested_for_id: row.requested_by,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                });
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: final });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllStocksRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.request_date LIKE '%${searchData}%' OR stock_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT stock_requests.* 
            FROM stock_requests 
            WHERE created_by = '${req.user.user_id}' AND total_approved_qty > 0 AND reschedule_stock_transfer IN (0, 1) 
            ${search_value} 
            ORDER BY stock_requests.id
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];

                var total_approved_qty = 0;
                const request_by_stocks = await getCreatedByDetails(row.created_by);
                const request_for_stocks = await getCreatedByDetails(row.requested_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                const request_stock = JSON.parse(row.approval_data);
                const transfer_stocks = JSON.parse(row.transfer_stocks);
                const totalItemsInRequestFund = request_stock[0].request_stock.length;

                let totalTitlesInNewRequestFund = 0;
                if (Array.isArray(request_stock[0].new_request_stock)) {
                    for (const item of request_stock[0].new_request_stock) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                //row.total_approved_qty ? total_approved_qty : 0
                if (row.total_approved_qty != null) {
                    total_approved_qty = row.total_approved_qty;
                }

                const request_by_details = await getCreatedByDetails(row.requested_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);

                const data = JSON.parse(row.request_stock);

                let totalSumRequestStock = 0;
                if (data.request_stock) {
                    data.request_stock.forEach((item) => {
                        totalSumRequestStock += Number(item.request_quantity) * Number(item.current_item_price);
                    });
                }

                let totalSumNewRequestStock = 0;
                if (data.new_request_stock) {
                    data.new_request_stock.forEach((item) => {
                        totalSumNewRequestStock += Number(item.qty) * Number(item.rate);
                    });
                }

                const totalSumOfRequests = totalSumRequestStock + totalSumNewRequestStock;

                const approvalData = JSON.parse(row.approval_data);

                let totalSumRequestStockApprove = 0;
                if (approvalData && approvalData.length > 0) {
                    approvalData.forEach((data) => {
                        if (data.request_stock) {
                            data.request_stock.forEach((item) => {
                                totalSumRequestStockApprove +=
                                    Number(item.request_quantity) * Number(item.current_item_price);
                            });
                        }

                        if (data.new_request_stock) {
                            data.new_request_stock.forEach((item) => {
                                totalSumRequestStockApprove += Number(item.qty) * Number(item.rate);
                            });
                        }
                    });
                }

                const transferStocks = transfer_stocks?.request_stock || [];
                const newTransferStocks = transfer_stocks?.new_request_stock || [];

                let totalTransferQty = 0;

                // Iterate over request_stock array
                if (transferStocks) {
                    transferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                // Iterate over new_request_stock array
                if (newTransferStocks) {
                    newTransferStocks.forEach((item) => {
                        if (item.transfer_qty) {
                            totalTransferQty += parseInt(item.transfer_qty);
                        }
                    });
                }

                let status;
                if (row.status == "0") {
                    status = "Pending";
                } else if (row.status == "1") {
                    status = "Approved";
                } else if (row.status === "4") {
                    status = "Partial";
                } else if (row.status === "5") {
                    status = "Done";
                } else if (row.status === "2") {
                    status = "Rejected";
                }
                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    request_by: request_by_stocks.name,
                    request_by_id: request_by_stocks.employee_id,
                    request_image: request_by_stocks.image,
                    request_date: moment(row.request_date).format("YYYY-MM-DD HH:mm:ss A"),
                    total_request_qty: row.total_request_qty,
                    total_approved_qty: total_approved_qty,
                    image: row.image ? JSON.parse(row.image) : "",
                    status: status,
                    approved_request_stock: JSON.parse(row.approval_data),
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_by_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    active: i === 0 && currentPage === 1,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    stock_request_for: row.stock_request_for,
                    request_for: request_for_stocks.name,
                    request_for_employee_id: request_for_stocks.employee_id,
                    request_for_image: request_for_stocks.image,
                    request_for_id: request_for_stocks.id,
                    transfer_stock: transfer_stocks,
                    transfer_stock_amount: row.total_transfer_amount,
                    request_stock_quantity: row.total_request_qty,
                    approve_stock_quantity: row.total_approved_qty,
                    transfer_stock_quantity: totalTransferQty,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

async function removeItemInStocks(id) {
    const queryResult = await db.query(`SELECT * FROM stock_requests WHERE id = ?`, [id]);
    const requested_by = queryResult[0].requested_by;

    if (queryResult[0].approval_data != null && queryResult[0].approval_data !== undefined) {
        const getApproval = queryResult[0].approval_data;
        const getApprovalData = JSON.parse(getApproval);
        const allRequest = getApprovalData[0].request_stock.concat(getApprovalData[0].new_request_stock);

        for (const item of allRequest) {
            if (item.item_name && item.item_name.value) {
                const getExistStockDetails = await db.query(
                    `SELECT * FROM stocks WHERE requested_by = ? AND product_id = ? AND rate = ?`,
                    [requested_by, item.item_name.value, item.approve_price]
                );
                if (getExistStockDetails.length > 0) {
                    for (const existingStock of getExistStockDetails) {
                        const quantity = Number(existingStock.quantity) - Number(item.approve_quantity);
                        const rate = item.approve_price;
                        const updateQuery = `UPDATE stocks SET rate = ?, quantity = ? WHERE requested_by = ? AND product_id = ?`;
                        await db.query(updateQuery, [rate, quantity, requested_by, item.item_name.value]);
                    }
                }
            } else if (item.title && (item.title.label || item.title.value)) {
                let productId, rate, quantity;
                if (!isNaN(item.title.value) && Number(item.title.value) !== 0) {
                    productId = item.title.value;
                    const existingItem = await db.query(`SELECT * FROM stocks WHERE product_id = ? AND rate = ?`, [
                        productId,
                        item.rate,
                    ]);
                    if (existingItem.length > 0) {
                        quantity = Number(existingItem[0].quantity) - Number(item.qty);
                        const updateQuery = `UPDATE stocks SET quantity = ?, requested_by = ? WHERE product_id = ?`;
                        await db.query(updateQuery, [quantity, requested_by, productId]);
                    }
                } else {
                    rate = item.rate;
                    productId = item.title.value;
                    // Fetch existing item again for proper logic
                    const existingItems = await db.query(`SELECT * FROM stocks WHERE new_item = ? AND rate = ?`, [
                        productId,
                        item.rate,
                    ]);

                    if (existingItems.length > 0) {
                        let quantities = Number(existingItems[0].quantity) - Number(item.qty);
                        const updateQuery = `UPDATE stocks SET quantity = ?, requested_by = ? WHERE new_item = ? AND rate = ?`;
                        await db.query(updateQuery, [quantities, requested_by, item.title.value, rate]);
                    }
                }
            }
        }
    }
}

const getSupplierTransactions = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (stock_requests.bill_number LIKE '%${searchData}%')`;
        }

        let selectQuery = `
            SELECT stock_requests.id, stock_requests.bill_number, SUBSTRING_INDEX(stock_requests.bill_date, 'T', 1) AS bill_date, stock_requests.total_transfer_amount, stock_requests.supplier_id, suppliers.supplier_name 
            FROM stock_requests 
            left join suppliers ON stock_requests.supplier_id = suppliers.id 
            WHERE supplier_id = '${id}' AND stock_requests.bill_number IS NOT NULL AND stock_requests.total_transfer_amount IS NOT NULL 
            ${search_value} 
            ORDER BY stock_requests.id
        `;

        if (pageSize) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            if (!pageSize) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(queryResult, "supplier-transactions", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(
                        queryResult,
                        "supplier-transactions",
                        "Supplier Transactions",
                        columns
                    );
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllOldItemInStocks = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }
        const queryResult = await db.query(`
            SELECT st.id, im.name AS item_name, im.id AS item_master_id, st.new_item, st.rate as item_price, st.requested_by, st.quantity AS request_qty, st.rate * st.quantity AS request_amount, im.hsncode, DATE_FORMAT(st.created_at, '%Y-%m-%d') AS request_date, s.supplier_name, ir.brand AS brand_name, im.unique_id 
            FROM stocks AS st 
            LEFT JOIN item_masters AS im ON st.product_id = im.id 
            LEFT JOIN suppliers s ON s.id = st.supplier_id
            LEFT JOIN item_rates ir ON ir.item_id = im.id
            WHERE st.requested_by ='${id}'
            `);

        // SELECT fr.id, CASE WHEN im.name IS NULL THEN fr.new_item ELSE im.name END AS item_name, fr.item_price, fr.request_by, fr.request_qty, fr.request_amount FROM fund_requests AS fr LEFT JOIN item_masters AS im ON fr.item_id = im.id WHERE fr.request_by = 125;

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateBillNumber = async (req, res, next) => {
    try {
        const { id, bill_number, bill_date } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        const queryResult = await db.query(
            `UPDATE stock_requests SET bill_number = '${bill_number}', bill_date = '${bill_date}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Bill Number update successfully." });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getLastThreePrevPriceBySuppliers = async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const selectQuery = await db.query(
            `SELECT st.id, im.name AS item_name, st.product_id as item_id, st.rate as item_price, st.requested_by, st.quantity, DATE_FORMAT(st.created_at, '%Y-%m-%d') as date FROM stocks AS st JOIN item_masters AS im ON st.product_id = im.id WHERE st.product_id = '${id}' AND st.supplier_id = '${userId}' ORDER BY st.created_at DESC LIMIT 3;`
        );
        if (selectQuery.length > 0) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: selectQuery });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    stockRequestSave,
    getAllStockRequests,
    getStockRequestsDetailsById,
    stockRequestDetailsUpdate,
    deleteStockRequest,
    updateStockRequestStatus,
    getStockDetailsOnItemId,
    getAllRejectedStockRequests,
    getAllApprovedStockRequests,
    transferStock,
    getSupplier,
    getRescheduleTransferStock,
    stocksAmountTransfer,
    rescheduledTransferstock,
    getAllPendingStockTransfer,
    getAllPreviousPriceOfStocks,
    getStockTransfer,
    getAllStockTransfer,
    rejectStockRequest,
    reActiveToRejectedStockRequest,
    getLastThreePrevPriceInStocks,
    getAllhistoryByToday,
    getAllStocksRequests,
    getSupplierTransactions,
    getAllOldItemInStocks,
    updateBillNumber,
    getLastThreePrevPriceBySuppliers,
};

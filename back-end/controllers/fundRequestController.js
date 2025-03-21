var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { fundRequestValidation, checkPositiveInteger, checkString } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getCreatedByDetails,
    generateRandomAlphanumerics,
    updateOrNotFund,
    generateRandomNumber,
    getAdminDetails,
} = require("../helpers/general");
const { getItemDetailsById, convertBase64Image, uploadFile } = require("../helpers/commonHelper");
const { query, request } = require("express");
const path = require("path");
const xlsx = require("xlsx");

const fundRequest = async (req, res, next) => {
    try {

        const { request_data } = req.body;

        if (!Array.isArray(request_data) || request_data.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Request field is missing or empty.",
            });
        }

        if (req.body.request_data != null) {
            const { fund_request_for, user_id } = req.body;

            const requestData = req.body.request_data;

            if (!Array.isArray(requestData) || requestData.length === 0) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Request data is missing or empty.",
                });
            }

            for (let i = 0; i < req.body.request_data[0].new_request_fund.length; i++) {
                const titleValue = req.body.request_data[0].new_request_fund[i].title.label;

                const queryResult = await db.query(`SELECT * FROM item_masters WHERE name = ?  AND is_deleted = 0`, [
                    titleValue,
                ]);
                if (queryResult.length > 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Item already exist",
                    });
                }
            }

            for (let i = 0; i < req.body.request_data[0].new_request_fund.length; i++) {
                const brandValue = req.body.request_data[0].new_request_fund[i].brand.label;

                const queryResult = await db.query(`SELECT * FROM brands WHERE brand_name = ?  AND is_deleted = 0`, [
                    brandValue,
                ]);
                if (queryResult.length > 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Brand already exist",
                    });
                }
            }

            const item_master_ids = [];
            // Iterate over each object in the request_data array
            for (const data of requestData) {
                // Check if either request_fund or new_request_fund has data with non-empty item_name and request_quantity
                if (
                    (data.request_fund &&
                        data.request_fund.length > 0 &&
                        data.request_fund.some((item) => item.item_name && item.request_quantity)) ||
                    (data.new_request_fund &&
                        data.new_request_fund.length > 0 &&
                        data.new_request_fund.some((item) => item.title && item.qty))
                ) {
                    // Proceed with logic if validation passes

                    const supplier_id = data.supplier_id;

                    if (!supplier_id || typeof supplier_id !== "object" || !supplier_id.value) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Please provide a valid Supplier",
                        });
                    }

                    for (const item of data.request_fund) {
                        if (!item.rate) {
                            return res.status(StatusCodes.OK).json({
                                status: false,
                                message: "Please provide Brand",
                            });
                        }
                        if (item?.request_quantity <= 0 || item?.new_price <= 0 || item?.fund_amount <= 0) {
                            return res.status(StatusCodes.OK).json({
                                status: false,
                                message: "Values cannot be negative or zero",
                            });
                        }
                    }
                    // Check if new_request_fund has data
                    if (data.new_request_fund && data.new_request_fund.length > 0) {
                        // Insert the New Item master into database with initial pending status
                        for (const item of data.new_request_fund) {
                            // console.log('item', item)
                            const createdBy = req.user.user_id;

                            const insertResult = await insertItemMasterForFundRequest(
                                item,
                                createdBy,
                                supplier_id,
                                "fund"
                            );
                            if (insertResult) {
                                console.log(insertResult);
                                item_master_ids.push(insertResult.item_master_ids);
                            } else {
                                return res.status(StatusCodes.BAD_REQUEST).json(insertResult);
                            }
                        }
                    }
                } else {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: "Please fill the Item Name and Quantity. No field can be left empty.",
                    });
                }
            }

            for (const imageData of requestData) {
                // Check if new_request_fund exists and is not empty
                if (imageData.new_request_fund && imageData.new_request_fund.length > 0) {
                    // Perform the validation only if new_request_fund is not empty
                    if (!imageData.new_request_fund.every((item) => item.item_image)) {
                        return res
                            .status(StatusCodes.OK)
                            .json({ status: false, message: "Please select an item image for New Request Fund." });
                    }
                }
            }

            if (requestData.length > process.env.VALUE_ZERO) {
                const request_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                const created_by = req.user.user_id;
                let queryResult;

                const unique_id = await generateRandomAlphanumerics(10);
                for (let i = 0; i < requestData.length; i++) {
                    const element = requestData[i];
                    const supplier_id = element.supplier_id?.value ?? null;
                    const officeUsers = element.office_users_id;
                    const area_manager_id = element.area_manager_id;
                    const supervisor_id = element.supervisor_id;
                    const end_users_id = element.end_users_id;
                    const self_request_id = user_id;
                    const request_by = end_users_id || supervisor_id || area_manager_id;
                    const total_request_amount = element.total_request_amount;
                    // const request_data = JSON.stringify(element.request_fund);
                    const finalData = {
                        request_fund: element.request_fund,
                        new_request_fund: element.new_request_fund,
                    };

                    const request_data = JSON.stringify(finalData);

                    // Validation based on fund_request_for value
                    if (fund_request_for == 1) {
                        // Self request - only user_id is needed
                        if (!self_request_id) {
                            return res
                                .status(StatusCodes.OK)
                                .json({ status: false, message: "For self_request, user_id is required" });
                        }
                    } else {
                        // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
                        if (!officeUsers && !area_manager_id && !supervisor_id && !end_users_id) {
                            return res.status(StatusCodes.OK).json({
                                status: false,
                                message: "Please select at least one area manager, supervisor, or end users",
                            });
                        }
                    }

                    const insertQuery = `INSERT INTO new_fund_requests (request_by, area_manager_id,  supervisor_id, end_users_id, request_data, total_request_amount, request_date, created_by, fund_request_for, unique_id, supplier_id, office_users_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    queryResult = await db.query(insertQuery, [
                        request_by || officeUsers || self_request_id,
                        area_manager_id,
                        supervisor_id,
                        end_users_id,
                        request_data,
                        total_request_amount,
                        request_date,
                        created_by,
                        fund_request_for,
                        unique_id,
                        supplier_id,
                        officeUsers,
                    ]);
                }

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    if (requestData[0].new_request_fund.length > 0) {
                        const fund_request_id = queryResult.insertId;
                        // update fund id into item master ids to link the fund request data in item masters
                        await db.query(
                            `UPDATE item_masters SET fund_stock_id = ${fund_request_id} WHERE id IN (${item_master_ids.join(",")})`
                        );
                    }

                    return res.status(StatusCodes.OK).json({ status: true, message: "Fund requested successfully" });
                } else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund not requested" });
                }
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllFundRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_users_id = req.query.end_users_id;

        if (searchData != null && searchData != "") {
            search_value += `AND ( new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE created_by = '${req.user.user_id}' AND status = '0' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;
        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);

                const request_data = JSON.parse(row.request_data);
                const checkUpdateOrNot = await updateOrNotFund(row.request_date);

                // Initialize total sum
                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums);

                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;
                if (
                    request_data.new_request_fund &&
                    typeof request_data.new_request_fund[Symbol.iterator] === "function"
                ) {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    area_manager_id: row.area_manager_id,
                    supervisor_id: row.supervisor_id,
                    end_users_id: row.end_users_id,
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: request_data,
                    active: i === 0 && currentPage === 1,
                    fund_request_for: row.fund_request_for,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    update_fund_request: checkUpdateOrNot,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
                });
            }

            var finalResult = [];
            // Remove undefined values from the finalData array
            if (area_manager_id != null && area_manager_id != "" && supervisor_id != null && supervisor_id != "") {
                // Both area_manager_id and supervisor_id are present
                finalResult = finalData.filter((item) => {
                    return item.area_manager_id === area_manager_id && item.supervisor_id === supervisor_id;
                });
            } else if (area_manager_id != null && area_manager_id != "") {
                finalResult = finalData.filter((item) => item.area_manager_id == area_manager_id);
            } else if (supervisor_id != null && supervisor_id != "") {
                finalResult = finalData.filter((item) => item.supervisor_id == supervisor_id);
            } else if (end_users_id != null && end_users_id != "") {
                finalResult = finalData.filter((item) => item.end_users_id == end_users_id);
            } else {
                finalResult = finalData;
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalResult,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedFundRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND ( new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE created_by = '${req.user.user_id}' AND status = '1' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                // const request_by_details = await getCreatedByDetails(row.request_by);
                const [request_by_details] = await getUserDetails(row.request_by);
                console.log("request_by_details: ", request_by_details);
                // const created_by_details = await getCreatedByDetails(row.created_by);
                const [created_by_details] = await getAdminDetails(row.created_by);
                // const approved_by_details = await getCreatedByDetails(row.approved_by);
                const [approved_by_details] = await getAdminDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);

                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums);

                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;
                if (
                    request_data.new_request_fund &&
                    typeof request_data.new_request_fund[Symbol.iterator] === "function"
                ) {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : "",
                    approved_by_image: approved_by_details.image ? approved_by_details.image : "",
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : "",
                    approved_date: moment(row.approved_at).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
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

const getAllRejectedFundRequests = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE created_by = '${req.user.user_id}' AND status = '2' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);

                const rejected_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);
                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;

                if (
                    request_data.new_request_fund &&
                    typeof request_data.new_request_fund[Symbol.iterator] === "function"
                ) {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    total_request_amount: totalSum,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: JSON.parse(row.request_data),
                    rejected_by: rejected_by_details.name ? rejected_by_details.name : "",
                    rejected_by_image: rejected_by_details.image ? rejected_by_details.image : "",
                    rejected_by_employee_id: rejected_by_details.employee_id ? rejected_by_details.employee_id : "",
                    rejected_date: moment(row.approved_at).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    rejected_remarks: row.rejected_remarks,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
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

const getFundRequestById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user_type = req.user.user_type || 0;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

        const selectQuery = `
            SELECT new_fund_requests.*, uw.balance AS user_balance 
            FROM new_fund_requests
            LEFT JOIN user_wallets uw ON uw.user_id = new_fund_requests.request_by 
            WHERE new_fund_requests.id = ?
        `;

        const queryResult = await db.query(selectQuery, [id]);

        // Check if queryResult has any data
        if (queryResult.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
        // console.log("queryResult", queryResult);
        let getSupplierValue;

        if (queryResult[0].supplier_id === null || !queryResult[0].supplier_id) {
            getSupplierValue = {
                label: "",
                value: null,
            };
        } else {
            const getSupplierDetails = await db.query(
                `SELECT * FROM suppliers WHERE id = '${queryResult[0].supplier_id}'`
            );

            getSupplierValue = {
                label: getSupplierDetails[0].supplier_name,
                value: getSupplierDetails[0].id,
            };
        }

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                // console.log("row: ", row);

                let getResultManagerQuery;
                if (user_type == 1) {
                    getResultManagerQuery = `
                        SELECT admins.name, admins.image, admins.id AS userId 
                        FROM admins 
                        WHERE id IN (?, ?, ?, ?)
                `;
                } else {
                    getResultManagerQuery = `
                        SELECT users.name, users.image, users.id AS userId 
                        FROM users 
                        WHERE id IN (?, ?, ?, ?)
                `;
                }
                // const getResultManagerQuery = `
                //     SELECT users.name, users.image, users.id AS userId
                //     FROM users
                //     WHERE id IN (?, ?, ?, ?)
                // `;

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
                        name: user.name,
                        image: user.image,
                        id: user.userId,
                    };
                });

                var [request_by_details] = await getUserDetails(row.request_by);
                var [created_by_details] = await getAdminDetails(row.created_by);
                var [approvedByDetails] = await getAdminDetails(row.approved_by);

                const dbRequestFund = row.request_data && JSON.parse(row.request_data);

                // Function to clean description by removing <p> tags if they wrap the text
                function cleanDescription(description) {
                    // Check if description is a string and has <p> tags at start and end
                    if (typeof description === 'string' && description.startsWith('<p>') && description.endsWith('</p>')) {
                        // Remove <p> (3 characters) from start and </p> (4 characters) from end, then trim whitespace
                        return description.slice(3, -4).trim();
                    }
                    // Return unchanged if no <p> tags are present or conditions aren't met
                    return description;
                }

                if (dbRequestFund) {
                    // Process each entry in request_fund array
                    dbRequestFund.request_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });

                    // Process each entry in new_request_fund array
                    dbRequestFund.new_request_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });
                }

                const dbApprovedFund = row.approval_data && JSON.parse(row.approval_data);

                if (dbApprovedFund) {
                    // Process each entry in request_fund array
                    dbApprovedFund.request_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });

                    // Process each entry in new_request_fund array
                    dbApprovedFund.new_request_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });
                }


                const requestFundDetails = dbRequestFund.request_fund;
                let fund_request;
                if (requestFundDetails.every((item) => item.item_name == "" && item.request_quantity == "")) {
                    fund_request = [];
                }

                let combinedData = [];

                // Concatenate the arrays
                if (Array.isArray(dbRequestFund.request_fund)) {
                    combinedData = combinedData.concat(dbRequestFund.request_fund);
                }

                if (Array.isArray(dbRequestFund.new_request_fund)) {
                    combinedData = combinedData.concat(dbRequestFund.new_request_fund);
                }

                let itemCount = 0;

                // Iterate over each object in the combinedData array
                combinedData.forEach((item) => {
                    // Check if the item has an item_name property
                    if (item.hasOwnProperty("item_name")) {
                        // Increment the counter if item_name is present
                        itemCount++;
                    }
                });

                if (dbApprovedFund != null) {
                    if (dbApprovedFund.length > 0) {
                        for (let i = 0; i < dbApprovedFund.length; i++) {
                            const element = dbApprovedFund[i];
                            const requestElement = dbRequestFund[i];
                            // for request fund key

                            dbRequestFund[i]["approved_price"] = element.price;
                            dbRequestFund[i]["approved_quantity"] = parseInt(element.quantity);
                            dbRequestFund[i]["total_approved_amount"] = element.price * element.quantity;
                            dbRequestFund[i]["remaining_amount"] =
                                dbRequestFund[i].fund_amount - dbRequestFund[i]["total_approved_amount"];

                            // for approved fund key
                            element["approved_price"] = element.price;
                            element["approved_quantity"] = parseInt(element.quantity);
                            element["total_approved_amount"] = element.price * element.quantity;
                            element["remaining_amount"] =
                                dbRequestFund[i].fund_amount - dbRequestFund[i]["total_approved_amount"];
                        }
                    }
                }

                const dbTransferFund = row.transfer_data ? JSON.parse(row.transfer_data) : null

                if (dbTransferFund) {
                    // Process each entry in request_fund array
                    dbTransferFund.transfer_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });

                    // Process each entry in new_request_fund array
                    dbTransferFund.new_transfer_fund.forEach(fund => {
                        // Check if item_name and description exist
                        if (fund.item_name && fund.item_name.description) {
                            fund.item_name.description = cleanDescription(fund.item_name.description);
                        }
                    });
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    area_manager_id: userDetails["Area Manager"] || {},
                    supervisor_id: userDetails["Supervisor"] || {},
                    end_users_id: userDetails["End User"] || {},
                    office_users_id: userDetails["Office User"] || {},
                    total_request_amount: row.total_request_amount,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_fund: dbRequestFund, //JSON.parse(row.request_data),
                    approved_data: dbApprovedFund, //row.approval_data ? JSON.parse(row.approval_data) : null,
                    approved_at: row.approved_at ? moment(row.approved_at).utcOffset(330).format("YYYY-MM-DD HH:mm:ss A") : null,
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    approved_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    transfer_data: dbTransferFund,
                    fund_request_for: row.fund_request_for,
                    total_item: itemCount,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
                    request_for_credit_limit: request_by_details.credit_limit ? request_by_details.credit_limit : "",
                    supplier_id: getSupplierValue ?? null,
                    user_balance: row?.user_balance || 0,
                });
            }
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: finalData[0] });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateFundRequest = async (req, res, next) => {
    try {
        const { fund_request_for, status } = req.body;
        const item_master_ids = [];
        if (req.body.request_data != null) {
            const requestData = req.body.request_data;
            const id = req.body.id;

            if (requestData.length > process.env.VALUE_ZERO) {
                const updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                const updated_by = req.user.user_id;

                for (const item of requestData) {
                    const supplier_id = item.supplier_id;
                    if (item.new_request_fund.length > 0) {
                        console.log("new_request_fund", item.new_request_fund);

                        // Check for new item master approval status before approving fund request
                        const newItemAddStatus = await checkForNewItemApprovalStatusForFundRequest(
                            item.new_request_fund,
                            "fund",
                            supplier_id
                        );
                        if (!newItemAddStatus.status) {
                            return res.status(StatusCodes.BAD_REQUEST).json(newItemAddStatus);
                        }

                        for (const element of item.new_request_fund) {
                            const createdBy = req.user.user_id;

                            const insertResult = await insertItemMasterForFundRequest(
                                element,
                                createdBy,
                                supplier_id,
                                "fund"
                            );
                            if (insertResult) {
                                console.log(insertResult);
                                item_master_ids.push(insertResult.item_master_ids);
                            } else {
                                return res.status(StatusCodes.BAD_REQUEST).json(insertResult);
                            }
                        }
                    }
                }

                let queryResult;

                for (let i = 0; i < requestData.length; i++) {
                    const element = requestData[i];
                    // console.log('element: ', element);
                    const area_manager_id = element.area_manager_id;
                    const supervisor_id = element.supervisor_id;
                    const end_users_id = element.end_users_id;
                    const office_users_id = element.office_users_id;
                    const self_request_id = element.user_id; // const request_by = element.user_id;
                    const request_by = office_users_id || end_users_id || supervisor_id || area_manager_id;
                    const total_request_amount = element.total_request_amount;

                    const finalData = {
                        request_fund: element.request_fund,
                        new_request_fund: element.new_request_fund,
                    };

                    const request_data = JSON.stringify(finalData);

                    if (fund_request_for == 1) {
                        // Self request - only user_id is needed
                        if (!self_request_id) {
                            return res
                                .status(StatusCodes.OK)
                                .json({ status: false, message: "For self_request, user_id is required" });
                        }
                    } else {
                        // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
                        if (!office_users_id && !area_manager_id && !supervisor_id && !end_users_id) {
                            return res.status(StatusCodes.OK).json({
                                status: false,
                                message: "Please select at least one area manager, supervisor, end users",
                            });
                        }
                    }
                    if (status === "1") {
                        const insertQuery = `UPDATE new_fund_requests SET request_by = ?,area_manager_id=?,  supervisor_id=?, end_users_id=?, request_data  = ?, total_request_amount = ?, approved_by = ?, approved_at = ?, status='1' WHERE id = ?`;

                        queryResult = await db.query(insertQuery, [
                            request_by || self_request_id,
                            area_manager_id,
                            supervisor_id,
                            end_users_id,
                            request_data,
                            total_request_amount,
                            updated_by,
                            updated_at,
                            id,
                        ]);
                    } else {
                        const insertQuery = `UPDATE new_fund_requests SET request_by = ?,area_manager_id=?,  supervisor_id=?, end_users_id=?, request_data  = ?, total_request_amount = ?, updated_by = ?, updated_at = ?, status='0', supplier_id = ? WHERE id = ?`;

                        queryResult = await db.query(insertQuery, [
                            request_by || self_request_id,
                            area_manager_id,
                            supervisor_id,
                            end_users_id,
                            request_data,
                            total_request_amount,
                            updated_by,
                            updated_at,
                            element.supplier_id.value,
                            id,
                        ]);
                    }
                }

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    if (item_master_ids.length > process.env.VALUE_ZERO) {
                        await db.query(
                            `UPDATE item_masters SET fund_stock_id = ${id} WHERE id IN (${item_master_ids.join(",")})`
                        );
                    }
                    return res
                        .status(StatusCodes.OK)
                        .json({ status: true, message: "Fund requested details updated successfully" });
                } else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund not requested" });
                }
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const deleteFundRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        //----------------First check request id approved or not--------------------------------
        const checkRequestApprovedQuery = `SELECT status FROM new_fund_requests WHERE id = ? AND approval_data IS NOT NULL`;
        const checkRequestApprovedQueryResult = await db.query(checkRequestApprovedQuery, [id]);

        if (checkRequestApprovedQueryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Request is approved so you can't delete it" });
        } else {
            //delete request query
            const deleteRequestQuery = `DELETE FROM new_fund_requests WHERE id = ?`;
            const queryResult = await db.query(deleteRequestQuery, [id]);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Fund requests deleted successfully" });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund request not deleted" });
            }
        }
    } catch (error) {
        return next(error);
    }
};

const getFundRequestOnComplaintUniqueId = async (req, res, next) => {
    try {
        const complaint_id = req.params.complaint_id;

        const complaintUniqueIdValidation = Joi.object({
            complaint_id: Joi.string().required(),
        });

        const { error } = complaintUniqueIdValidation.validate({ complaint_id: complaint_id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM fund_requests WHERE complaint_id = ?`;

        const queryResult = await db.query(selectQuery, [complaint_id]);

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

const changeStatusOfFundRequest = async (req, res, next) => {
    try {
        const { fund_request_for, request_data, id, status } = req.body;

        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        let itemIndex = 0;
        if (itemIndex !== undefined && itemIndex >= 0 && itemIndex < request_data[0].new_request_fund.length) {
            const item = request_data[0].new_request_fund[itemIndex];

            // Check if view_status is not already 1, if yes, no need to update
            if (item.view_status !== true) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Please view the image first." });
            }

            // Update view_status to 1 as the image is viewed
            request_data[0].new_request_fund[itemIndex].view_status = true;
        }

        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        //Get already approved data for that stock request
        const approvedData = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);

        var finalItem = [];
        let total_approved_amount;
        let totalSum = 0;

        // Iterate over request_fund array and sum up fund_amount
        if (request_data[0].request_fund) {
            for (const item of request_data[0].request_fund) {
                totalSum += Number(item.price) * Number(item.quantity);
            }
        }

        let totalSums = 0;
        // Iterate over new_request_fund array and sum up fund_amount
        if (request_data[0].new_request_fund) {
            for (const item of request_data[0].new_request_fund) {
                totalSums += Number(item.fund_amount);
            }
        }
        let total = Number(totalSum) + Number(totalSums);

        const total_body_approved_amount = total;

        const quantities = [];
        const prices = [];

        // request_data[0].request_fund.some(item => {
        //     if (item?.new_price < 0 || item?.price < 0 || item?.quantity < 0) {
        //         return res.status(StatusCodes.OK).json({ status: false, message: "Values cannot be negative" });
        //     }
        // });

        for (const item of request_data[0].request_fund) {
            if (item?.new_price <= 0 || item?.price <= 0 || item?.quantity <= 0)
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Price or Quantity must be greater than 0",
                });
        }

        request_data.forEach((request) => {
            // Check if `request.request_fund` is valid before iterating over its contents
            if (!Array.isArray(request.request_fund) || request.request_fund.length === 0) {
                // Handle invalid request.request_fund: log error, send appropriate response, etc.
                console.error("Invalid request.request_fund encountered:", request.request_fund);
                // Replace with your desired error handling logic, e.g., return specific error message
                return;
            }

            request.request_fund.forEach((item) => {
                quantities.push(item.quantity);
                prices.push(item.price);
            });
        });

        // Only perform quantity and price checks if both arrays have been populated
        if (prices.length > 0 && quantities.length > 0) {
            const invalidPrices = prices.some((price) => price == null || price <= 0 || price === "");
            const invalidQuantities = quantities.some((qty) => qty == null || qty <= 0 || qty === "");

            if (invalidPrices) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Price or Quantity must be greater than 0.",
                });
            }

            if (invalidQuantities) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Quantity Value must be greater than 0.",
                });
            }
        }

        if (approvedData[0].status == "1") {
            const removeExistingPrice = removeItemToFundRequest(id);
        }

        finalItem = {
            request_fund: request_data[0].request_fund,
            new_request_fund: request_data[0].new_request_fund,
        };

        total_approved_amount = total_body_approved_amount;

        const newRequestData = request_data[0].new_request_fund;
        newRequestData.forEach((item) => {
            item.supplier_id = request_data[0].supplier_id;
        });

        const approved_amount = total_approved_amount;
        const approved_data = JSON.stringify(finalItem);

        if (newRequestData != null && newRequestData.length > 0) {
            // Check for new item master approval status before approving fund request
            const newItemAddStatus = await checkForNewItemApprovalStatusForFundRequest(newRequestData, "fund");
            if (!newItemAddStatus.status) {
                return res.status(StatusCodes.BAD_REQUEST).json(newItemAddStatus);
            }
        }

        const statusChangedQuery = `UPDATE new_fund_requests SET total_approved_amount = ?, approval_data = ?, status = ?, approved_by = ?, approved_at = ? WHERE id = ?`;
        const queryResult = await db.query(statusChangedQuery, [
            approved_amount,
            approved_data,
            status,
            approved_by,
            approved_at,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (request_data != null) {
                // add old item masters to db
                const addItemToFundRequestData = await addItemToFundRequest(request_data, id);
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Fund approved successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! status not changed" });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(StatusCodes.OK).json({ status: false, message: error.message });
    }
};

async function addAmountToRequestedUserWallet(id, approved_by) {
    const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);

    if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
        const requestedData = getApprovedRequestedFundDetails[0];
        const user_id = requestedData.request_by;
        const amount = requestedData.total_approved_amount;
        const request_by = approved_by;
        //---check if user id is in wallet then update balance otherwise put request approved amount in wallet---

        const getWalletBalance = await db.query(`SELECT * FROM user_wallets WHERE user_id = ?`, [user_id]);

        if (getWalletBalance.length > process.env.VALUE_ZERO) {
            //---------------update wallet balance--------------------------------
            const walletBalanceId = getWalletBalance[0].id;
            const dbWalletBalance = getWalletBalance[0].balance;
            const updatedWalletBalance = dbWalletBalance + amount;
            const updateQuery = `UPDATE user_wallets SET balance  = ?, updated_by = ? WHERE id = ?`;
            const queryResult = await db.query(updateQuery, [updatedWalletBalance, request_by, walletBalanceId]);
        } else {
            //---------------add user to wallet--------------------------------
            const insertQuery = `INSERT INTO user_wallets (user_id, balance, created_by) VALUES(?, ?, ?)`;
            const queryResult = await db.query(insertQuery, [user_id, amount, request_by]);
        }
    }
}

async function addItemToFundRequest(approvalData, id) {
    try {
        const currentMonthYear = moment().format("YYYY-MM");
        // no need in this query for request date because its already stored in current date
        const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ? `, [id]);

        if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
            const requestedData = getApprovedRequestedFundDetails[0];
            const request_by = requestedData.request_by;

            const request_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            const created_by = requestedData.created_by;

            if (approvalData != null) {
                for (const data of approvalData) {
                    const allRequests = data.request_fund.concat(data.new_request_fund);
                    for (const row of allRequests) {
                        if (row.item_name && row.item_name.value) {
                            const existingItem = await db.query(
                                `SELECT * FROM fund_requests WHERE request_by = ? AND item_id = ? AND item_price = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`,
                                [request_by, row.item_name.value, row.price, currentMonthYear]
                            );

                            if (existingItem.length > process.env.VALUE_ZERO) {
                                const request_qty = Number(row.quantity) + Number(existingItem[0].request_qty);
                                const request_amount =
                                    Number(row.quantity * row.price) + Number(existingItem[0].request_amount);
                                const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE request_by = ? AND item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
                                await db.query(updateQuery, [
                                    request_qty,
                                    request_amount,
                                    created_by,
                                    request_by,
                                    row.item_name.value,
                                    currentMonthYear,
                                ]);
                            } else {
                                const getTotalAmount = Number(row.price) * Number(row.quantity);
                                const insertQueryNew = `INSERT INTO fund_requests (item_id, item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES ('${row.item_name.value}', '${row.price}', '${request_by}', '${getTotalAmount}', '${row.quantity}', '${request_date}', '${created_by}')`;
                                const insertRequestRecord = await db.query(insertQueryNew);
                            }
                        } else if (row.title && (row.title.label || row.title.value)) {
                            if (!isNaN(row.title.value) && Number(row.title.value) !== 0) {
                                const existingItem = await db.query(
                                    `SELECT * FROM fund_requests WHERE item_id = ? AND  item_price = ? AND request_by = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`,
                                    [row.title.value, row.rate, request_by, currentMonthYear]
                                );
                                if (existingItem.length > 0) {
                                    const request_qty = Number(row.qty) + Number(existingItem[0].request_qty);
                                    const request_amount =
                                        Number(row.qty * row.rate) + Number(existingItem[0].request_amount);
                                    const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
                                    await db.query(updateQuery, [
                                        request_qty,
                                        request_amount,
                                        created_by,
                                        row.title.value,
                                        currentMonthYear,
                                    ]);
                                } else {
                                    const insertQuery = `INSERT INTO fund_requests (item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
                                    await db.query(insertQuery, [
                                        row.rate,
                                        request_by,
                                        row.fund_amount,
                                        row.qty,
                                        request_date,
                                        created_by,
                                    ]);
                                }
                            } else if (
                                row.title &&
                                typeof row.title.label === "string" &&
                                typeof row.title.value === "string"
                            ) {
                                const request_qty = row.qty;
                                const request_amount = Number(row.rate) * Number(row.qty);
                                const insertQuery = `
                                    INSERT INTO fund_requests 
                                    (new_item, item_price, request_by, request_amount, request_qty, request_date, created_by) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?)
                                `;
                                const insertResult = await db.query(insertQuery, [
                                    row.title.value,
                                    row.rate,
                                    request_by,
                                    request_amount,
                                    request_qty,
                                    request_date,
                                    created_by,
                                ]);

                                // Check if item exists in item_masters table
                                const selectQuery = await db.query(`SELECT id FROM item_masters WHERE name = ?`, [
                                    row.title.value,
                                ]);

                                if (selectQuery.length > 0) {
                                    const getId = selectQuery[0].id;

                                    // Update item_id in fund_requests table
                                    await db.query(`UPDATE fund_requests SET item_id = ? WHERE new_item = ?`, [
                                        getId,
                                        row.title.value,
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

const getFundDetailsOnItemId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const request_by = req.user.user_id;
        const queryResult = await db.query(
            `SELECT item_id, request_qty, request_amount as item_price, transfer_qty, transfer_amount FROM fund_requests WHERE item_id = ? AND request_by = ?`,
            [id, request_by]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const rejectFundRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const remarks = req.body.remarks;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const approved_by = req.user.user_id;
        const queryResult = await db.query(
            `UPDATE new_fund_requests SET status = '2', approved_at = '${approved_at}', approved_by = '${approved_by}', rejected_remarks='${remarks}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const removeItem = await removeItemToFundRequest(id);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request rejected successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedFundAndPartialTransfer = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR new_fund_requests.request_by LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status = '1' AND total_approved_amount < total_transfer_amount ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);

                finalData.push({
                    id: row.id,
                    request_by: request_by_details.name ? request_by_details.name : "",
                    request_by_image: request_by_details.image ? request_by_details.image : "",
                    request_by_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    total_request_amount: row.total_request_amount,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: JSON.parse(row.request_data),
                    approved_by: approved_by_details.name ? approved_by_details.name : "",
                    approved_by_image: approved_by_details.image ? approved_by_details.image : "",
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : "",
                    approved_date: moment(row.approved_at).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
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

const getPendingTransferFund = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += ` AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE created_by = '${req.user.user_id}' AND status IN ('1', '4') AND reschedule_transfer = 1 AND total_approved_amount IS NOT NULL AND total_approved_amount <> 0 ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);

                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums);

                let status;
                if (row.status == "1") {
                    status = "Pending";
                } else if (row.status == "4") {
                    status = "partial";
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    total_transfer_amount: row.total_transfer_amount || 0,
                    status: status,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : "",
                    approved_by_image: approved_by_details.image ? approved_by_details.image : "",
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : "",
                    approved_date: moment(row.approved_at).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    active: i === 0 && currentPage === 1,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
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

// const getFundRequestFourLowPrice = async (req,res,next) => {

//     try {
//         const hsncode = req.params.hsncode;

//         const { error } = checkString.validate({ hsncode });
//         if (error) {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         // Query to select the lowest 4 priced items for the given HSNCODE
//         // const query = ` SELECT item_masters.id AS item_id, item_masters.name AS item_name, item_masters.rate AS item_rate, item_masters.image, item_masters.hsncode,item_masters.rucode, item_masters.unique_id as item_unique_id, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name FROM item_masters LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id WHERE item_masters.hsncode = ? ORDER BY CAST(item_masters.rate AS DECIMAL(10,2)) ASC LIMIT 4; `;

//         const query = ` SELECT item_masters.id AS item_id, item_masters.name AS item_name, item_masters.rate AS item_rate, item_masters.image, item_masters.hsncode, item_masters.rucode, item_masters.unique_id AS item_unique_id, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name, supplier_addresses.shop_office_number, supplier_addresses.street_name, supplier_addresses.city, supplier_addresses.state, supplier_addresses.pin_code FROM item_masters LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id LEFT JOIN supplier_addresses ON supplier_addresses.id = suppliers.id WHERE item_masters.hsncode = ? ORDER BY CAST(item_masters.rate AS DECIMAL(10,2)) ASC LIMIT 4; `;

//         const queryResult = await db.query(query, [hsncode]);
//         if (queryResult.length > 0) {
//             return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };

const getFundRequestFourLowPrice = async (req, res, next) => {
    try {
        const hsncode = req.params.hsncode;
        const category = req.params.category;
        // Validate the hsncode
        const { error } = checkString.validate({ hsncode });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        // Query to select the lowest 4 priced items for the given HSNCODE
        const query = `
            SELECT 
                item_masters.id AS item_id, 
                item_masters.name AS item_name, 
                item_masters.image, 
                item_masters.hsncode, 
                item_masters.rucode, 
                item_masters.unique_id AS item_unique_id, 
                suppliers.id AS supplier_id, 
                suppliers.supplier_name AS supplier_name, 
                supplier_addresses.shop_office_number, 
                supplier_addresses.street_name, 
                supplier_addresses.city, 
                supplier_addresses.state, 
                supplier_addresses.pin_code, 
                item_rates.brand, 
                item_rates.rate AS item_rate 
            FROM item_masters 
            LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id 
            LEFT JOIN supplier_addresses ON supplier_addresses.id = suppliers.id 
            LEFT JOIN item_rates ON item_masters.id = item_rates.item_id 
            WHERE item_masters.hsncode = ? AND category = ? 
            ORDER BY CAST(item_rates.rate AS DECIMAL(10, 2)) ASC 
            LIMIT 4;
        `;

        const queryResult = await db.query(query, [hsncode, category]);

        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
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

const reActiveToRejectedFundRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }
        const updated_by = req.user.user_id;
        const queryResult = await db.query(
            `UPDATE new_fund_requests SET status = '0', updated_by = '${updated_by}' WHERE id = '${id}'`
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request Reactive successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const reschduleTransferFund = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += ` AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE reschedule_transfer = 0 AND status IN ('1', '4') AND total_approved_amount IS NOT NULL AND total_approved_amount <> 0 AND created_by = '${req.user.user_id}' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;
        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                let actualStatus;
                if (row.status == "4") {
                    actualStatus = "Rescheduled";
                } else if (row.status == "1") {
                    actualStatus = "Rescheduled";
                }

                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);

                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }
                }

                let total = Number(totalSum) + Number(totalSums);

                finalData.push({
                    id: row.id,
                    reschedule_transfer: row.reschedule_transfer,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    reschedule_date: row.reschedule_date,
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    total_transfer_amount: row.total_transfer_amount || 0,
                    status: actualStatus,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : "",
                    approved_by_image: approved_by_details.image ? approved_by_details.image : "",
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : "",
                    approved_date: moment(row.approved_at).utcOffset(330).format("DD-MM-YYYY HH:mm:ss A"),
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    request_for_id: request_by_details.id ? request_by_details.id : "",
                    request_for: request_by_details.name ? request_by_details.name : "",
                    request_for_image: request_by_details.image ? request_by_details.image : "",
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
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

const getAllPreviousPrice = async (req, res, next) => {
    try {
        const request_for_id = req.params.request_for_id;
        const { error } = checkPositiveInteger.validate({ id: request_for_id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const queryResult = await db.query(
            `SELECT SUM(request_amount) AS total_request_amount, SUM(transfer_amount) AS total_transfer_amount, request_by FROM fund_requests WHERE request_by = ?`,
            [request_for_id]
        );

        const finalBalance = queryResult[0].total_request_amount - queryResult[0].total_transfer_amount || 0;

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult, finalBalance: finalBalance });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllOldItemInFunds = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }
        const queryResult = await db.query(`
            SELECT fr.id, im.name AS item_name, im.id AS item_master_id, fr.item_price, fr.request_by, fr.request_qty, fr.request_amount, fr.request_date, im.hsncode, s.supplier_name, ir.brand AS brand_name, im.unique_id 
            FROM fund_requests AS fr 
            LEFT JOIN item_masters AS im ON fr.item_id = im.id 
            LEFT JOIN suppliers s ON s.id = im.supplier_id
            LEFT JOIN item_rates ir ON ir.item_id = im.id
            WHERE fr.request_by ='${id}'
            `);

        if (queryResult.length > process.env.VALUE_ZERO) {
            // return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
            // Calculate the total request amount
            const totalRequestAmount = queryResult.reduce((total, item) => {
                return total + (item.request_amount || 0); // Add request_amount if present, otherwise 0
            }, 0);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                total_request_amount: totalRequestAmount, // Add total amount key here
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// async function addItemFromFundRequestToItemMasters(newRequestData) {
//     try {
//         const insertIds = [];

//         for (const requestData of newRequestData) {
//             const { supplier_id, unit_id, description, item_image, title, rate, qty, hsncode } = requestData;

//             if (typeof title.value == "string") {
//                 var storePath = "";
//                 const processedImages = [];

//                 const base64File = item_image.replace(/^data:image\/\w+;base64,/, "");
//                 const result = await convertBase64Image(base64File, "./public/item_masters/", "/item_masters/");
//                 processedImages.push(result);

//                 storePath = processedImages.join(", ");
//                 const generateAutomatically = await generateRandomNumber(10);

//                 const insertQuery = `
//                 INSERT INTO item_masters
//                 SET name = '${title.value}', rate = '${rate}', qty = '${qty}', image = '${storePath}', hsncode = '${hsncode}',
//                 supplier_id = '${supplier_id}', unique_id = '${generateAutomatically}', status = '1', unit_id = '${unit_id.value}, description = '${description}'
//                 `;

//                 const getResult = await db.query(insertQuery);

//                 if (getResult.affectedRows > 0) {
//                     insertIds.push(getResult.insertId);
//                 }
//             }
//         }

//         return insertIds;
//     } catch (error) {next(error)
//         return error.message;
//     }
// }

async function checkForNewItemApprovalStatusForFundRequest(newRequestData, category, existing_supplier_id) {
    try {
        for (const requestData of newRequestData) {
            const { supplier_id, title } = requestData;

            // Check if the item already exists in item_masters and fetch its status
            const checkStatusQuery = `
                SELECT id, name, status, is_deleted 
                FROM item_masters 
                WHERE name = '${title.value}' 
                AND supplier_id = '${supplier_id ? supplier_id.value : existing_supplier_id.value}'
                AND category = '${category}'
            `;

            console.log('checkStatusQuery: ', checkStatusQuery);
            const [existingItem] = await db.query(checkStatusQuery);

            console.log(existingItem);

            // If the item exists and status is 0, return an approval message
            if (existingItem && existingItem.is_deleted == 1) {
                return {
                    status: false,
                    message: `'${title.value}' item deleted. ${category} request cannot be approved`,
                    metadata: existingItem,
                };
            }
            if (existingItem && (existingItem.status === "0" || existingItem.status === "2")) {
                return {
                    status: false,
                    message:
                        existingItem.status === "0"
                            ? `'${title.value}' not approved.`
                            : `'${title.value}' item rejected. ${category} request cannot be approved`,
                    metadata: existingItem,
                };
            }

            return { status: true };
        }

        // return insertIds;
    } catch (error) {
        throw error;
    }
}

const getLastThreePrevPrice = async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const selectQuery = await db.query(
            `SELECT fr.id, im.name AS item_name, fr.item_price, fr.request_by, fr.request_qty, fr.request_amount, fr.request_date as date  FROM fund_requests AS fr JOIN item_masters AS im ON fr.item_id = im.id WHERE fr.item_id = '${id}' AND fr.request_by = '${userId}' ORDER BY fr.request_date DESC LIMIT 3;`
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

async function removeItemToFundRequest(id) {
    try {
        const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);
        if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
            const requestedData = getApprovedRequestedFundDetails[0];
            const request_by = requestedData.request_by;

            const request_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            const created_by = requestedData.created_by;

            if (requestedData.approval_data != null && requestedData.approval_data !== undefined) {
                const getApproval = requestedData.approval_data;
                const getApprovalData = JSON.parse(getApproval);
                const allRequests = getApprovalData.request_fund.concat(getApprovalData.new_request_fund);

                for (const row of allRequests) {
                    if (row.item_name && row.item_name.value) {
                        const existingItem = await db.query(
                            `SELECT * FROM fund_requests WHERE request_by = ? AND item_id = ? AND item_price = ?`,
                            [request_by, row.item_name.value, row.price]
                        );

                        if (existingItem.length > process.env.VALUE_ZERO) {
                            //---------------update Fund request--------------------------------
                            const request_qty = Number(existingItem[0].request_qty) - Number(row.quantity);
                            const request_amount =
                                Number(existingItem[0].request_amount) - Number(row.quantity * row.price);

                            const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE request_by = ? AND item_id = ?`;
                            await db.query(updateQuery, [
                                request_qty,
                                request_amount,
                                created_by,
                                request_by,
                                row.item_name.value,
                            ]);
                        }
                    } else if (row.title && (row.title.label || row.title.value)) {
                        // If item_name and item_name.value are not present, but title.label or title.value is present
                        if (!isNaN(row.title.value) && Number(row.title.value) !== 0) {
                            // If title.value is a non-zero number

                            const existingItem = await db.query(
                                `SELECT * FROM fund_requests WHERE item_id = ? AND  item_price = ? AND request_by = ? `,
                                [row.title.value, row.rate, request_by]
                            );
                            if (existingItem.length > 0) {
                                const request_qty = Number(existingItem[0].request_qty) - Number(row.qty);
                                const request_amount =
                                    Number(existingItem[0].request_amount) - Number(row.qty * row.rate);

                                const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE item_id = ?`;
                                await db.query(updateQuery, [request_qty, request_amount, created_by, row.title.value]);
                            }
                        } else {
                            const existingItem = await db.query(
                                `SELECT * FROM fund_requests WHERE new_item = ? AND  item_price = ? AND request_by = ? `,
                                [row.title.value, row.rate, request_by]
                            );
                            if (existingItem.length > 0) {
                                const request_qty = Number(existingItem[0].request_qty) - Number(row.qty);
                                const request_amount =
                                    Number(existingItem[0].request_amount) - Number(row.rate) * Number(row.qty);

                                const updateQuery = `UPDATE fund_requests SET request_amount = ?, request_qty = ? WHERE new_item = ? AND item_price = ? AND request_by = ?`;
                                await db.query(updateQuery, [
                                    request_amount,
                                    request_qty,
                                    row.title.value,
                                    row.rate,
                                    request_by,
                                ]);
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

const fundRequestImport = async (req, res, next) => {
    try {
        // Check if file is uploaded
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel file is required",
            });
        }

        // Upload file and get the path
        const filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);

        // Read the Excel file
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert Excel sheet to JSON array
        const rows = xlsx.utils.sheet_to_json(sheet);

        // Initialize an object to group request_fund by supplier
        const fundRequests = {};

        // Iterate through each row in the Excel
        rows.forEach((row) => {
            const {
                fund_request_for,
                user_id,
                supplier_id,
                supplier_name,
                item_name,
                item_unique_id,
                item_brand,
                item_rate,
                request_quantity,
                fund_amount,
            } = row;

            // Create a unique key based on user_id and supplier_id
            const fundRequestKey = `${user_id}_${supplier_id}`;

            // If this supplier doesn't exist in fundRequests, initialize it
            if (!fundRequests[fundRequestKey]) {
                fundRequests[fundRequestKey] = {
                    supplier_id: {
                        value: supplier_id,
                        label: supplier_name,
                    },
                    user_id: user_id,
                    request_fund: [],
                    new_request_fund: [], // Default empty
                    total_request_amount: 0,
                };
            }

            // Prepare the item object to push into the request_fund array
            const item = {
                item_name: {
                    label: item_name,
                    value: item_unique_id,
                    unique_id: item_unique_id,
                    rates: [
                        {
                            item_rates_id: null, // You can populate this if needed
                            brand: item_brand,
                            rate: item_rate,
                        },
                    ],
                },
                request_quantity,
                fund_amount,
            };

            // Push the item into request_fund
            fundRequests[fundRequestKey].request_fund.push(item);

            // Update total_request_amount for the fund
            fundRequests[fundRequestKey].total_request_amount += fund_amount;
        });

        // Convert fundRequests object into an array of fund request objects
        const processedData = Object.values(fundRequests);
        return console.log("processedData: ", processedData);

        // Save the processed data into the database
        await saveToDatabase(processedData); // Implement your own DB logic

        return res.status(200).json({
            status: true,
            message: "Data imported and processed successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const saveToDatabase = async (data) => {
    try {
        for (const fundRequest of data) {
            const { supplier_id, user_id, request_fund, new_request_fund, total_request_amount } = fundRequest;

            // Construct the request_data field as JSON string
            const request_data = JSON.stringify({
                request_fund,
                new_request_fund,
            });

            // Generate a unique ID if needed (e.g., using UUID or a custom method)
            const unique_id = generateUniqueId(); // Implement this function as needed

            // Insert query parameters
            const queryParams = [
                user_id, // request_by
                null, // area_manager_id (adjust if needed)
                null, // supervisor_id (adjust if needed)
                null, // end_users_id (adjust if needed)
                request_data,
                total_request_amount,
                new Date(), // request_date (current date/time)
                null, // created_by (adjust if needed)
                fundRequest.fund_request_for,
                unique_id,
                supplier_id,
                null, // office_users_id (adjust if needed)
            ];

            // Execute the query
            await db.query(insertQuery, queryParams);
        }

        console.log("Data saved successfully.");
    } catch (error) {
        throw error; // Re-throw the error to handle it in the caller function
    }
};

const insertItemMasterForFundRequest = async (item, createdBy, supplier_id, category) => {
    let storePath = "";
    const item_master_ids = [];
    // upload image
    try {
        if (item.item_image != null) {
            const processedImages = [];

            const base64File = item.item_image.replace(/^data:image\/\w+;base64,/, "");
            const result = await convertBase64Image(base64File, "./public/item_masters/", "/item_masters/");
            processedImages.push(result);

            storePath = processedImages.join(", ");
        }

        let unique_id = item.item_unique_id || (await generateRandomNumber(10));

        const insertItemMaster = `
            INSERT INTO item_masters (name, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category, status, qty, rate, sub_category) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        const item_title = item.title.label;
        const item_unit = item.unit_id.value;

        console.log(item.title.value, "item.title.value", item.unit_id.value, "item.unit_id.value");

        const insertResult = await db.query(insertItemMaster, [
            item_title || "",
            storePath,
            createdBy,
            item.hsncode || "",
            item.rucode || "",
            supplier_id.value,
            unique_id,
            item.description || "",
            item_unit || "",
            category,
            "0",
            item.qty,
            item.rate,
            item.sub_category.value,
        ]);

        // if insertion is successful, insert rates
        if (insertResult.affectedRows > 0) {
            const item_id = insertResult.insertId;
            item_master_ids.push(item_id);
            let brand_id = item.brand.value;
            // if brand is new then create
            if (item.brand?.__isNew__) {
                const insertBrandQuery = `INSERT INTO brands (brand_name, status, created_by) VALUES ("${item.brand.label}", 1, ${createdBy})`;
                const insertBrand = await db.query(insertBrandQuery);
                brand_id = insertBrand.insertId;
            }

            if (item.rate && item.rate > 0) {
                const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ('${item_id}', '${brand_id}', '${item.brand.label}', '${item.rate}')`;
                // const rateValues = parse.map((rate) => [itemId, rate.brand_id, rate.brand, rate.rate]);

                const rateInsertResult = await db.query(rateInsertQuery);

                if (rateInsertResult.affectedRows > 0) {
                    console.log("Item and rates inserted successfully");
                    return {
                        status: true,
                        item_master_ids,
                    };
                } else {
                    return { status: false, message: "Error inserting rates" };
                }
            }
        } else {
            return { status: false, message: "Items not saved. Please try again" };
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fundRequest,
    getAllFundRequests,
    getAllApprovedFundRequests,
    getAllRejectedFundRequests,
    getFundRequestById,
    updateFundRequest,
    deleteFundRequest,
    getFundRequestOnComplaintUniqueId,
    changeStatusOfFundRequest,
    getFundDetailsOnItemId,
    rejectFundRequest,
    getAllApprovedFundAndPartialTransfer,
    getPendingTransferFund,
    getFundRequestFourLowPrice,
    reActiveToRejectedFundRequest,
    reschduleTransferFund,
    getAllPreviousPrice,
    getAllOldItemInFunds,
    getLastThreePrevPrice,
    fundRequestImport,
    insertItemMasterForFundRequest,
    checkForNewItemApprovalStatusForFundRequest,
};

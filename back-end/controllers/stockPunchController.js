var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { stockRequestValidation, checkPositiveInteger, stockPunchValidation } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    generateRandomNumber,
    getCreatedByDetails,
    getRoleByUserId,
    totalComplaintsPunch,
    groupDataByItemName,
    getSupplierDetailsById,
    getComplaintDetails,
    insertTransactionsImages,
    updateStockRequests,
    totalComplaintsStockPunch,
    getTotalStockPunchItems,
    getUserWalletBalance,
    getComplaintUniqueIdInPaymentForRo,
    getOutletById,
    getRegionalNameById,
    getComplaintsToAreaManager,
} = require("../helpers/general");
const { insertNotifications } = require("../helpers/notifications");
const { convertBase64Image, saveTransactionDetails, manageUserWallet } = require("../helpers/commonHelper");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const { getSalesAreaById } = require("./invoiceController");

const stockPunch = async (req, res, next) => {
    try {
        const { area_manager_id, supervisor_id, end_users_id, complaint_id, stock_punch_detail, otp } = req.body;

        const { error } = stockPunchValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const punch_by = req.user.user_id;
        const userId = end_users_id || supervisor_id || area_manager_id;

        const wallet_balance = await getUserWalletBalance(userId);

        const balanceAmount = wallet_balance ? wallet_balance : 0;

        const sumOfSubTotal = stock_punch_detail.reduce((acc, item) => acc + parseFloat(item.total_price), 0);

        let otpCode;
        if (otp !== "" && otp !== undefined && otp !== null) {
            otpCode = otp;
        } else {
            const userOtp = await insertOtpAndNotifications(userId, complaint_id);
            if (userOtp.length > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Otp send successfully." });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Otp not send." });
            }
        }

        const otpVerification = await verifyStockPunchOtp(userId, otpCode, complaint_id, punch_by, req.body);
        if (!otpVerification) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Invalid OTP!",
            });
        }

        const wallet = await manageUserWallet(userId, sumOfSubTotal, process.env.DEDUCT_AMOUNT);
        if(wallet) {
            console.log(`User wallet deducted of amount ${sumOfSubTotal} successfully.`);
        }
        // add details to transaction table
        const transactionData = {
            user_id: userId,
            transaction_type: process.env.DEBIT,
            transaction_date: moment(new Date()).format("YYYY-MM-DD"),
            amount: sumOfSubTotal,
            balance: balanceAmount - sumOfSubTotal,
            description: "Amount debit for expense punch.",
            created_by: userId,
            complaints_id: complaint_id,
        };

        await saveTransactionDetails(transactionData);

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Stock punched successfully.",
        });
    } catch (error) {
        return next(error);
    }
};

async function insertOtpAndNotifications(userId, complaint_id) {
    // Generate OTP
    const otp = await generateRandomNumber(6);
    // Insert OTP into database
    await insertOtpInStocks(userId, complaint_id, otp);
    // Insert notification
    const user_type = await getRoleByUserId(userId);
    const notificationData = [
        {
            userId: userId,
            roleId: user_type,
            title: "OTP for Stock Punch.",
            message: `Stock punched successfully! Use OTP ${otp} for verification.`,
        },
    ];
    await insertNotifications(notificationData);

    return otp;
}

async function verifyStockPunchOtp(userId, otp, complaint_id, punch_by, stockPunchData) {
    try {
        const selectQuery = `SELECT * FROM stock_punch_otp WHERE user_id='${userId}' AND complaint_id='${complaint_id}' AND otp='${otp}' AND is_verify='0'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0 || otp == process.env.STOCK_PUNCH_MASTER_OTP) {
            if (queryResult.length > 0) {
                await db.query(`UPDATE stock_punch_otp SET is_verify='1' WHERE id='${queryResult[0].id}'`);
            }

            // Insert stock punch data
            await insertStockPunchData(stockPunchData, punch_by);

            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function insertStockPunchData(stockPunchData, punch_by) {
    try {
        const { area_manager_id, supervisor_id, end_users_id, complaint_id, stock_punch_detail } = stockPunchData;

        const userId = end_users_id || supervisor_id || area_manager_id;
        for (const detail of stock_punch_detail) {
            const { stock_id, item_id, brand_id, item_qty } = detail;

            const queryResult = await db.query(
                `
                INSERT INTO stock_punch_histories (user_id, complaint_id, stock_id, item_id, brand_id, item_qty, punch_by, area_manager_id, supervisor_id, end_users_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
                [
                    userId,
                    complaint_id,
                    stock_id,
                    item_id,
                    brand_id,
                    item_qty,
                    punch_by,
                    area_manager_id,
                    supervisor_id || null,
                    end_users_id || null,
                ]
            );

            if (queryResult.affectedRows > 0) {
                const [getStock] = await db.query(`SELECT * FROM stocks WHERE id=?`, [stock_id]);

                if (getStock) {
                    const updateQty = Number(getStock.stock_punch_qty) + Number(item_qty);
                    const getTotalTransferAmount =
                        Number(getStock.rate) * Number(item_qty) + Number(getStock.stock_punch_transfer);

                    await db.query(`UPDATE stocks SET stock_punch_qty = ?, stock_punch_transfer = ? WHERE id = ?`, [
                        updateQty,
                        getTotalTransferAmount,
                        stock_id,
                    ]);
                }
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function insertOtpInStocks(userId, complaint_id, otp) {
    const selectQuery = `SELECT * FROM stock_punch_otp WHERE user_id = '${userId}' AND complaint_id = '${complaint_id}'`;

    const selectResult = await db.query(selectQuery);

    if (selectResult.length > 0) {
        const updateQuery = `UPDATE stock_punch_otp SET otp = '${otp}', is_verify = '0' WHERE user_id = '${userId}' AND complaint_id = '${complaint_id}'`;
        await db.query(updateQuery);
    } else {
        const insertQuery = `INSERT INTO stock_punch_otp (user_id, complaint_id, otp) VALUES ('${userId}', '${complaint_id}', '${otp}')`;
        await db.query(insertQuery);
    }
}

const getAllStockPunchList = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value = `AND (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        // const selectQuery = `SELECT stock_punch_histories.*, complaints.complaint_unique_id,item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, brands.id as brand_id, brands.brand_name as brand_name FROM stock_punch_histories LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id LEFT JOIN item_masters ON item_masters.id = stock_punch_histories.item_id LEFT JOIN brands ON brands.id = stock_punch_histories.brand_id LEFT JOIN users ON users.id = stock_punch_histories.user_id WHERE stock_punch_histories.punch_by = '${req.user.user_id}' ${search_value} group by stock_punch_histories.user_id, stock_punch_histories.complaint_id  HAVING ((SUM(stock_punch_histories.item_qty) - SUM(stock_punch_histories.approved_qty)) != 0)  ORDER BY stock_punch_histories.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
                SELECT 
                    MAX(stock_punch_histories.id) as id,
                    stock_punch_histories.user_id,
                    stock_punch_histories.complaint_id,
                    SUM(stock_punch_histories.item_qty) AS item_qty,
                    SUM(stock_punch_histories.approved_qty) AS approved_qty,
                    MAX(complaints.complaint_unique_id) AS complaint_unique_id,
                    MAX(item_masters.name) AS item_name,
                    MAX(item_masters.id) AS item_id,
                    MAX(item_masters.image) AS item_images,
                    MAX(brands.id) AS brand_id,
                    MAX(brands.brand_name) AS brand_name,
                    SUM(stock_punch_histories.item_qty) AS total_item_qty,
                    SUM(stock_punch_histories.approved_qty) AS total_approved_qty
                FROM 
                    stock_punch_histories
                LEFT JOIN 
                    complaints ON complaints.id = stock_punch_histories.complaint_id
                LEFT JOIN 
                    item_masters ON item_masters.id = stock_punch_histories.item_id
                LEFT JOIN 
                    brands ON brands.id = stock_punch_histories.brand_id
                LEFT JOIN 
                    users ON users.id = stock_punch_histories.user_id
                WHERE 
                    stock_punch_histories.punch_by = '${req.user.user_id}'
                    ${search_value}
                GROUP BY 
                    stock_punch_histories.user_id, stock_punch_histories.complaint_id
                HAVING 
                    (SUM(stock_punch_histories.item_qty) - SUM(stock_punch_histories.approved_qty)) != 0
                ORDER BY 
                    MAX(stock_punch_histories.id) DESC
                LIMIT ${pageFirstResult} , ${pageSize}
                `;
        // const selectQuery = `
        //         SELECT
        //                 MAX(stock_punch_histories.id) as id,
        //                 stock_punch_histories.user_id,
        //                 stock_punch_histories.complaint_id,
        //                 SUM(stock_punch_histories.item_qty) AS item_qty,
        //                 SUM(stock_punch_histories.approved_qty) AS approved_qty,
        //                 (SUM(stock_punch_histories.item_qty) - SUM(stock_punch_histories.approved_qty)) AS remaining_qty, -- Calculate remaining_qty
        //                 MAX(complaints.complaint_unique_id) AS complaint_unique_id,
        //                 MAX(item_masters.name) AS item_name,
        //                 MAX(item_masters.id) AS item_id,
        //                 MAX(item_masters.image) AS item_images,
        //                 MAX(brands.id) AS brand_id,
        //                 MAX(brands.brand_name) AS brand_name
        //             FROM
        //                 stock_punch_histories
        //             LEFT JOIN
        //                 complaints ON complaints.id = stock_punch_histories.complaint_id
        //             LEFT JOIN
        //                 item_masters ON item_masters.id = stock_punch_histories.item_id
        //             LEFT JOIN
        //                 brands ON brands.id = stock_punch_histories.brand_id
        //             LEFT JOIN
        //                 users ON users.id = stock_punch_histories.user_id
        //             WHERE
        //                 stock_punch_histories.punch_by = '13'
        //             GROUP BY
        //                 stock_punch_histories.user_id, stock_punch_histories.complaint_id
        //             HAVING
        //                 remaining_qty > 0  -- Filter based on remaining_qty being greater than 0
        //             ORDER BY
        //                 MAX(stock_punch_histories.id) DESC
        //             LIMIT ${pageFirstResult} , ${pageSize}
        //         `;

                // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);
        

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let finalData = [];
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (row of queryResult) {
                const complaint = await getComplaintUniqueIdInPaymentForRo(row.complaint_id);

                let outletDetails;
                let saleAreaDetail;
                let ro_detail;
                if (complaint.complaint_for == 1) {
                    outletDetails = await getOutletById(complaint.outlet_id);
                    const [saleAreaDetails] = await getSalesAreaById(complaint.sale_area_id);
                    saleAreaDetail = saleAreaDetails;
                    const [ro_details] = await getRegionalNameById(complaint.ro_id);
                    ro_detail = ro_details;
                } else {
                    outletDetails = "";
                }
                const outletDetail = outletDetails[0] ? outletDetails[0] : "";

                const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
                const userDetails = await getUserDetails(row.user_id);
                const getPunch = await giveCurrentPunch(row.user_id, row.complaint_id);

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    item_id: row.item_id,
                    item_name: row.item_name,
                    item_qty: row.item_qty,
                    approved_qty: row.approved_qty,
                    brand_id: row.brand_id,
                    brand_name: row.brand_name,
                    item_images: row.item_images,
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    punch_at: moment(getPunch).utcOffset(330).format("YYYY-MM-DD HH:mm:ss A"),
                    outlet_detail: outletDetail,
                    sale_area_detail: saleAreaDetail,
                    ro_detail,
                    area_manager_detail: getAreaManager,
                });
            }
            // filter out those which are approved in full quantity out of requested items
            // const filteredData = finalData.filter(item => item.approved_at == null);
            // console.log('filteredData: ', filteredData);
            // console.log('finalData: ', finalData);
            // console.log('filteredData: ', filteredData);

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

async function giveCurrentPunch(userId, complaintId) {
    const selectQuery = `SELECT * FROM stock_punch_histories WHERE user_id = '${userId}' AND complaint_id = '${complaintId}' ORDER BY id DESC`;
    const queryResult = await db.query(selectQuery);

    return queryResult[0].punch_at;
}

const getStockPunchById = async (req, res, next) => {
    try {
        const { id, complaint_id } = req.params;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        // const selectQuery = `SELECT stock_punch_histories.*, stocks.rate as item_price, DATE_FORMAT(stock_punch_histories.punch_at, '%y-%m-%d %H:%i:%s %p') AS punch_at, complaints.complaint_unique_id, users.name AS user_name, users.employee_id AS employee_id, users.image AS user_image, item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, stocks.supplier_id as supplier_id FROM stock_punch_histories LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id LEFT JOIN users ON users.id = stock_punch_histories.user_id LEFT JOIN item_masters ON item_masters.id = stock_punch_histories.item_id LEFT JOIN stocks ON stocks.id = stock_punch_histories.stock_id WHERE stock_punch_histories.user_id ='${id}' AND stock_punch_histories.complaint_id ='${complaint_id}'`;

        const selectQuery = `
        SELECT 
            MAX(stock_punch_histories.id) as id, 
            stock_punch_histories.user_id,
            MAX(stock_punch_histories.complaint_id) as complaint_id,
            MAX(stock_punch_histories.approved_qty) as approved_qty,
            SUM(stock_punch_histories.item_qty) as item_qty,
            MAX(stocks.rate) as item_price, 
            MAX(stock_punch_histories.punch_at) AS punch_at, 
            MAX(complaints.complaint_unique_id) as complaint_unique_id, 
            MAX(users.name) AS user_name, 
            MAX(users.employee_id) AS employee_id, 
            MAX(users.image) AS user_image, 
            MAX(item_masters.name) AS item_name, 
            item_masters.id AS item_id, 
            MAX(item_masters.image) as item_images, 
            MAX(stocks.supplier_id) as supplier_id 
        FROM stock_punch_histories   
        LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id 
        LEFT JOIN users ON users.id = stock_punch_histories.user_id 
        LEFT JOIN item_masters ON item_masters.id = stock_punch_histories.item_id 
        LEFT JOIN stocks ON stocks.id = stock_punch_histories.stock_id 
        WHERE stock_punch_histories.user_id = '${id}' 
        AND stock_punch_histories.complaint_id = '${complaint_id}'
        GROUP BY item_masters.id;
        `;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0) {
            let finalTotal = 0;
            const finalData = await Promise.all(
                queryResult.map(async (row) => {
                    const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                    const complaintsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id);
                    const getRemainingQty = Number(row.item_qty) - Number(row.approved_qty);

                    const getResultManagerQuery = `SELECT users.name, users.image, users.id AS userId FROM users WHERE id IN (?, ?, ?)`;

                    const execResultManager = await db.query(getResultManagerQuery, [
                        row.area_manager_id,
                        row.supervisor_id,
                        row.end_users_id,
                    ]);
                    const userDetail = {};

                    execResultManager.forEach((user) => {
                        const userType = (() => {
                            switch (user.userId) {
                                case row.area_manager_id:
                                    return "Area Manager";
                                case row.supervisor_id:
                                    return "Supervisor";
                                case row.end_users_id:
                                    return "End User";
                                default:
                                    return "Unknown";
                            }
                        })();

                        userDetail[userType] = {
                            name: user.name,
                            image: user.image,
                            id: user.userId,
                        };
                    });
                    finalTotal += Number(row.item_price) * Number(row.item_qty);
                    return {
                        id: row.id,
                        user_id: row.user_id,
                        user_name: row.user_name,
                        employee_id: row.employee_id ? row.employee_id : "",
                        user_image: row.user_image,
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id,
                        item_name: row.item_name,
                        item_id: row.item_id,
                        approved_qty: row.approved_qty,
                        item_qty: row.item_qty,
                        item_price: row.item_price,
                        item_images: row.item_images,
                        total_Amount: Number(row.item_price) * Number(row.item_qty),
                        transaction_id: row.transaction_id ? row.transaction_id : null,
                        punch_at: moment(row.punch_at).utcOffset(330).format("YYYY-MM-DD HH:mm:ss"),
                        supplier_id: row.supplier_id,
                        supplier_name: getSupplierName[0].supplier_name,
                        complaintsDetails: complaintsDetails,
                        remaining_approved_qty: getRemainingQty,
                    };
                })
            );

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                total: finalTotal,
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

const getStockRequest = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";
        let search_values = "";
        if (searchData != null && searchData != "") {
            search_value = `AND (users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
            search_values = `AND (admins.name LIKE '%${searchData}%' OR admins.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT stocks.requested_by, SUM(stocks.rate * stocks.quantity) AS total_approve_amount, DATE_FORMAT(stocks.created_at, '%Y-%m') AS request_month, SUM(stock_punch_transfer) AS transfer_amounts, COALESCE(users.username, admins.name) AS user_name FROM stocks LEFT JOIN users ON stocks.requested_by = users.id ${search_value} LEFT JOIN admins ON stocks.requested_by = admins.id  ${search_values} WHERE (stocks.created_at < CURRENT_DATE + INTERVAL 1 MONTH AND stocks.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)) AND (users.username IS NOT NULL OR admins.name IS NOT NULL) GROUP BY stocks.requested_by, request_month ORDER BY request_month DESC, stocks.requested_by ASC LIMIT ${pageFirstResult}, ${pageSize};`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const finalData = {};

        for (const row of queryResult) {
            const getRequestData = row.request_month;
            const formattedMonth = moment(getRequestData).format("YY-MM");
            const userId = row.requested_by;
            const totalSum = parseFloat(row.total_approve_amount);
            const request_by_details = await getCreatedByDetails(row.requested_by);
            // const generate_unique_id = await generateRandomAlphanumeric(10);
            const getTotalComplaintsPunch = await totalComplaintsStockPunch(request_by_details.id);
            if (!finalData[formattedMonth]) {
                finalData[formattedMonth] = [];
            }

            const balance = totalSum - Number(row.transfer_amounts);

            // Check if user already exists in the month's data
            const userIndex = finalData[formattedMonth].findIndex((user) => user.id === request_by_details.id);

            if (userIndex === -1) {
                // User not found, add new user entry
                finalData[formattedMonth].push({
                    month: formattedMonth,
                    totalSum: totalSum,
                    id: request_by_details.id || "",
                    name: request_by_details.name || "",
                    image: request_by_details.image || "",
                    employee_id: request_by_details.employee_id || "",
                    status: "1",
                    totalPunch: getTotalComplaintsPunch,
                    balance: balance,
                    total_stock_amount: row.transfer_amounts,
                });
            } else {
                // User found, update totalSum for existing user
                finalData[formattedMonth][userIndex].totalSum += totalSum;
            }
        }
        // Convert finalData object to array of arrays
        const dataArray = Object.values(finalData).flat();
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched successfully", data: dataArray, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

const getStockRequestById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const currentDate = new Date();
        const currentMonthbyNumber = currentDate.getMonth() + 1;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || currentMonthbyNumber;
        const pageFirstResult = (currentPage - 1) * pageSize;
        if (currentMonthbyNumber < searchData) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        var searchCondition = "";

        if (searchData) {
            // Include data for the specified month and all previous months
            searchCondition = `
            AND ( (MONTH(stocks.created_at) = '${searchData}') OR (MONTH(stocks.created_at) < '${searchData}' AND YEAR(stocks.created_at) = YEAR(CURRENT_DATE())) )`;
        }

        const selectQuery = `SELECT stocks.*, DATE_FORMAT(stocks.created_at, '%Y-%m-%d') AS requested_date, SUM( stocks.rate * stocks.quantity) AS total_approve_amount, (quantity - stock_punch_qty) AS remaining_punch_quantity, SUM(stock_punch_transfer) AS transfer_amounts, item_masters.name as item_name, item_masters.image as item_images FROM stocks LEFT JOIN item_masters ON stocks.product_id = item_masters.id WHERE  requested_by = '${id}' ${searchCondition} GROUP BY stocks.id;`;

        const queryResult = await db.query(selectQuery);
        const finalData = {};
        const currentMonth = moment().format("YY-MM");
        for (const row of queryResult) {
            const getRequestData = row.requested_date;

            var formattedMonth = moment(getRequestData).format("YY-MM");

            const userId = row.request_by;
            const totalSum = parseFloat(row.total_approve_amount);
            const request_by_details = await getCreatedByDetails(row.requested_by);
            // const generate_unique_id = await generateRandomAlphanumeric(10);
            const balance = totalSum - Number(row.transfer_amounts);

            // Include current month's data
            if (formattedMonth === currentMonth) {
                if (!finalData[formattedMonth]) {
                    finalData[formattedMonth] = {
                        data: [],
                        users: [],
                        totalSum: 0,
                    };
                }

                const userIndex = finalData[formattedMonth].users.findIndex(
                    (user) => user.id === request_by_details.id
                );
                if (userIndex === -1) {
                    // User not found, add new user entry
                    finalData[formattedMonth].users.push({
                        id: request_by_details.id || "",
                        name: request_by_details.name || "",
                        image: request_by_details.image || "",
                        employee_id: request_by_details.employee_id || "",
                        status: "1",
                        formattedMonth: formattedMonth,
                    });
                }

                // Add row data to the month's data array
                finalData[formattedMonth].data.push({
                    ...row,
                    formattedMonth: formattedMonth,
                    balance: balance,
                });
                // Update totalSum for the month
                finalData[formattedMonth].totalSum += totalSum;
            } else if (formattedMonth < currentMonth && balance > 0) {
                // Include last month's items with remaining balance
                if (!finalData[formattedMonth]) {
                    finalData[formattedMonth] = {
                        data: [],
                        users: [],
                        totalSum: 0,
                    };
                }

                const userIndex = finalData[formattedMonth].users.findIndex(
                    (user) => user.id === request_by_details.id
                );
                if (userIndex === -1) {
                    // User not found, add new user entry
                    finalData[formattedMonth].users.push({
                        id: request_by_details.id || "",
                        name: request_by_details.name || "",
                        image: request_by_details.image || "",
                        employee_id: request_by_details.employee_id || "",
                        status: "1",
                        formattedMonth: formattedMonth,
                    });
                }

                // Add row data to the month's data array
                finalData[formattedMonth].data.push({
                    ...row,
                    formattedMonth: formattedMonth,
                    balance: balance,
                });
                // Update totalSum for the month
                finalData[formattedMonth].totalSum += totalSum;
            }
        }
        // Process finalData to get dataArray
        const dataArray = Object.values(finalData).map((monthData) => ({
            totalSum: monthData.totalSum,
            users: monthData.users,
            data: monthData.data,
        }));

        const groupedDataByItemName = groupDataByItemNames(dataArray, formattedMonth);

        const pageDetails = await calculatePagination(finalData.length, currentPage, pageSize);

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Data fetched successfully",
            data: groupedDataByItemName,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

function groupDataByItemNames(dataArray, currentMonthFormatted) {
    const groupedData = {};
    const prevMonthItems = {};
    const usersMap = {};
    let currentMonthTotalSum = 0; // Total sum for current month
    let prevMonthTotalSum = 0; // Total sum for previous month

    dataArray.forEach((item) => {
        item.users.forEach((user) => {
            if (!usersMap[user.id]) {
                usersMap[user.id] = user;
            }
        });

        item.data.forEach((dataItem) => {
            const isCurrentMonth = dataItem.formattedMonth === currentMonthFormatted;
            const itemNameKey = dataItem.item_name || dataItem.new_item;
            const targetObject = isCurrentMonth ? groupedData : prevMonthItems;

            if (!targetObject[itemNameKey]) {
                targetObject[itemNameKey] = {
                    totalSum: 0,
                    remainingQty: 0,
                    remainingAmount: 0,
                    data: [],
                };
            }

            const itemBalance = Math.abs(dataItem.balance || 0); // Convert to positive
            const requestQty = dataItem.quantity || 0;
            const itemPrice = dataItem.rate || 0;
            const expenseTransferQty = dataItem.stock_punch_qty || 0;
            const expenseTransferAmounts = dataItem.stock_punch_transfer || 0;

            const remainingQty = requestQty - expenseTransferQty;
            const remainingAmount = itemPrice * requestQty - expenseTransferQty * itemPrice;
            targetObject[itemNameKey].totalSum += itemBalance;
            targetObject[itemNameKey].remainingQty += remainingQty;
            targetObject[itemNameKey].remainingAmount += remainingAmount;
            targetObject[itemNameKey].data.push(dataItem);

            if (isCurrentMonth) {
                currentMonthTotalSum += itemBalance;
            } else {
                prevMonthTotalSum += itemBalance;
            }
        });
    });

    return {
        users: Object.values(usersMap),
        currentMonth: {
            items: groupedData,
            overallTotalSum: currentMonthTotalSum,
        },
        previousMonth: {
            items: prevMonthItems,
            overallTotalSum: prevMonthTotalSum,
        },
    };
}

const approveStockPunch = async (req, res, next) => {
    try {
        const { items, transaction_images, user_id, complaint_id } = req.body;

        const approve_by = req.user.user_id;
        const approve_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Approve Stock Punch field is missing or empty.",
            });
        }

        for (const data of items) {
            if (!data.item_qty || data.item_qty <= 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ status: false, message: "Approve Quantity should be provided and greater than 0!" });
            }
        }

        for (const imageObj of transaction_images) {
            // Check if the image property is not empty
            if (imageObj.image != null && imageObj.image != "" && imageObj.image.length > 0) {
                const processedImages = [];
                const base64File = imageObj.image.replace(/^data:image\/\w+;base64,/, "");
                const result = await convertBase64Image(
                    base64File,
                    "./public/transaction_images/",
                    "/transaction_images/"
                );
                processedImages.push({ title: imageObj.title, images: result });

                const req_images = JSON.stringify(processedImages);

                const insertTransaction = await insertTransactionsImages(user_id, complaint_id, req_images);
            }
        }

        for (const data of items) {
            const { id, item_qty, transaction_id, remaining_qty } = data;
            const query = `SELECT * FROM stock_punch_histories WHERE id ='${id}'`;
            const selectQuery = await db.query(query);

            const approve_quantity = selectQuery[0].approved_qty;
            const totalQty = Number(approve_quantity) + Number(item_qty);
            const stockId = selectQuery[0].stock_id;

            let status;
            if (remaining_qty == selectQuery[0].item_qty) {
                const deleteData = await db.query(`delete from stock_punch_histories where id ='${id}'`);
            } else {
                status = "1";
                const stockPunchApprove = await db.query(
                    `UPDATE stock_punch_histories SET approved_qty = COALESCE(approved_qty, 0) + ?, status = ?, approved_by = ?, approved_at = ?, transaction_id= ? WHERE id = ?`,
                    [item_qty, status, approve_by, approve_at, transaction_id || null, id]
                );
            }
            await ChangeStocksItemApprovedQtyAndQty(stockId, remaining_qty, user_id, complaint_id, id);
        }

        await updateStockRequests(items);

        return res.status(StatusCodes.OK).json({ status: true, message: "Stock Punch Approved Successfully" });
    } catch (error) {
        return next(error);
    }
};

async function ChangeStocksItemApprovedQtyAndQty(stockId, remaining_qty, user_id, complaint_id, id) {
    try {
        // Retrieve stock and stock history data
        const [stockData] = await db.query(`SELECT * FROM stocks WHERE id='${stockId}'`);
        const [stockHistoryData] = await db.query(`SELECT * FROM stock_punch_histories WHERE id='${id}'`);
        // Calculate updated values
        const updatedStockQty = stockData.stock_punch_qty - remaining_qty;
        const updatedStockTransfer = stockData.rate * updatedStockQty;
        const updatedStockHistoryQty = stockHistoryData.item_qty - remaining_qty;

        // Update stocks and stock punch history
        await db.query(
            `UPDATE stocks SET stock_punch_qty = '${updatedStockQty}', stock_punch_transfer = '${updatedStockTransfer}' WHERE id = '${stockId}'`
        );
        await db.query(`UPDATE stock_punch_histories SET item_qty ='${updatedStockHistoryQty}' WHERE id =  '${id}'`);

        // Update user wallet and create transaction record
        const balanceAmount = await getUserWalletBalance(user_id);

        const UpdateRate = stockData.rate * (stockData.stock_punch_qty - updatedStockQty);

        if (remaining_qty != 0) {
            await Promise.all([
                manageUserWallet(user_id, UpdateRate, process.env.ADD_AMOUNT),
                saveTransactionDetails({
                    user_id,
                    transaction_type: process.env.CREDIT,
                    transaction_date: moment(new Date()).format("YYYY-MM-DD"),
                    amount: UpdateRate,
                    balance: balanceAmount + UpdateRate,
                    description: "Amount Credit for stock punch.",
                    created_by: user_id,
                    complaints_id: complaint_id,
                }),
            ]);
        }
    } catch (error) {
        console.error("Error in ChangeStocksItemApprovedQtyAndQty:", error);
        throw error; // Rethrow the error for better error handling upstream
    }
}

const getAllApproveStockPunchList = async (req, res, next) => {
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
            search_value = `AND (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        // let selectQuery = `
        //     SELECT stock_punch_histories.*, item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, brands.id as brand_id, brands.brand_name as brand_name, DATE_FORMAT(stock_punch_histories.approved_at, '%y-%m-%d %H:%i:%s') AS approve_at, stocks.supplier_id AS supplier_id, complaints.complaint_unique_id, count_transactions.count_transactions 
        //     FROM stock_punch_histories 
        //     LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id 
        //     LEFT JOIN users ON users.id = stock_punch_histories.user_id 
        //     LEFT JOIN item_masters ON item_masters.id = stock_punch_histories.item_id 
        //     LEFT JOIN brands ON brands.id = stock_punch_histories.brand_id 
        //     LEFT JOIN stocks ON stocks.id = stock_punch_histories.stock_id 
        //     LEFT JOIN (SELECT user_id, complaint_id, COUNT(transaction_id) AS count_transactions FROM stock_punch_histories GROUP BY user_id, complaint_id ) AS count_transactions ON count_transactions.user_id = stock_punch_histories.user_id AND count_transactions.complaint_id = stock_punch_histories.complaint_id 
        //     WHERE stock_punch_histories.status IN ('0', '1') AND stock_punch_histories.approved_qty <> 0 AND stock_punch_histories.punch_by = '${req.user.user_id}' 
        //     ${search_value} 
        //     GROUP BY stock_punch_histories.user_id, stock_punch_histories.complaint_id 
        //     ORDER BY stock_punch_histories.id `;

        // let selectQuery = `
        //     SELECT 
        //         MAX(stock_punch_histories.id) AS id,
        //         MAX(stock_punch_histories.user_id) AS user_id,
        //         MAX(stock_punch_histories.complaint_id) AS complaint_id,
        //         MAX(item_masters.name) AS item_name,
        //         MAX(item_masters.id) AS item_id,
        //         MAX(item_masters.image) AS item_images,
        //         MAX(brands.id) AS brand_id,
        //         MAX(brands.brand_name) AS brand_name,
        //         DATE_FORMAT(MAX(stock_punch_histories.approved_at), '%y-%m-%d %H:%i:%s') AS approve_at,
        //         MAX(stocks.supplier_id) AS supplier_id,
        //         MAX(complaints.complaint_unique_id) AS complaint_unique_id,
        //         MAX(count_transactions.count_transactions) AS count_transactions
        //     FROM 
        //         stock_punch_histories
        //     LEFT JOIN 
        //         complaints ON complaints.id = stock_punch_histories.complaint_id
        //     LEFT JOIN 
        //         users ON users.id = stock_punch_histories.user_id
        //     LEFT JOIN 
        //         item_masters ON item_masters.id = stock_punch_histories.item_id
        //     LEFT JOIN 
        //         brands ON brands.id = stock_punch_histories.brand_id
        //     LEFT JOIN 
        //         stocks ON stocks.id = stock_punch_histories.stock_id
        //     LEFT JOIN 
        //         (SELECT user_id, complaint_id, COUNT(transaction_id) AS count_transactions 
        //         FROM stock_punch_histories 
        //         GROUP BY user_id, complaint_id) AS count_transactions 
        //         ON count_transactions.user_id = stock_punch_histories.user_id 
        //         AND count_transactions.complaint_id = stock_punch_histories.complaint_id
        //     WHERE 
        //         stock_punch_histories.status IN ('0', '1') 
        //         AND stock_punch_histories.approved_qty <> 0 
        //         AND stock_punch_histories.punch_by = '${req.user.user_id}' 
        //         ${search_value}
        //     GROUP BY 
        //         stock_punch_histories.user_id, stock_punch_histories.complaint_id, stock_punch_histories.id
        //     ORDER BY 
        //         stock_punch_histories.id
        //     `;

        let selectQuery = `
        SELECT
                stock_punch_histories.id ,
                stock_punch_histories.user_id,
                stock_punch_histories.complaint_id,
                MAX(item_masters.name) AS item_name,
                MAX(item_masters.id) AS item_id,
                MAX(item_masters.image) AS item_images,
                MAX(brands.id) AS brand_id,
                MAX(brands.brand_name) AS brand_name,
                DATE_FORMAT(MAX(stock_punch_histories.approved_at), '%y-%m-%d %H:%i:%s') AS approve_at,
                MAX(stocks.supplier_id) AS supplier_id,
                MAX(complaints.complaint_unique_id) AS complaint_unique_id,
                MAX(count_transactions.count_transactions) AS count_transactions,
                MAX(stock_punch_histories.approved_at) AS approved_at
            FROM
                stock_punch_histories
            LEFT JOIN
                complaints ON complaints.id = stock_punch_histories.complaint_id
            LEFT JOIN
                users ON users.id = stock_punch_histories.user_id
            LEFT JOIN
                item_masters ON item_masters.id = stock_punch_histories.item_id
            LEFT JOIN
                brands ON brands.id = stock_punch_histories.brand_id
            LEFT JOIN
                stocks ON stocks.id = stock_punch_histories.stock_id
            LEFT JOIN
                (
                    SELECT user_id, complaint_id, COUNT(transaction_id) AS count_transactions
                    FROM stock_punch_histories
                    GROUP BY user_id, complaint_id
                ) AS count_transactions
                ON count_transactions.user_id = stock_punch_histories.user_id
                AND count_transactions.complaint_id = stock_punch_histories.complaint_id
            WHERE
                stock_punch_histories.status IN ('0', '1')
                AND stock_punch_histories.approved_qty <> 0
                AND stock_punch_histories.punch_by = '${req.user.user_id}' 
                ${search_value}
            GROUP BY
                stock_punch_histories.user_id, stock_punch_histories.complaint_id, stock_punch_histories.id
            ORDER BY
                stock_punch_histories.id
        `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let finalData = [];
            let approved_at;
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (row of queryResult) {
                const userDetails = await getUserDetails(row.user_id);
                const complainsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                const getItems = await getTotalStockPunchItems(row.user_id, row.complaint_id);
                // const getPunch = await giveApprovePunch(row.user_id, row.complaint_id)
                approved_at = row.approved_at ? moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss A") : "";

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    item_id: row.item_id,
                    item_name: row.item_name,
                    item_images: row.item_images,
                    item_qty: row.item_qty,
                    brand_id: row.brand_id,
                    brand_name: row.brand_name,
                    punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                    item_approved_qty: row.approved_qty,
                    approved_at,
                    supplier_id: row.supplier_id,
                    supplier_name: getSupplierName[0].supplier_name,
                    total_transactions: row.count_transactions,
                    complainsDetails: complainsDetails,
                    total_items: getItems[0].total_items,
                });
            }

            if (!pageSize) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "approve-stock-punch", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "approve-stock-punch", "Approved Stock Punch", columns);
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

const getAllApproveStockPunchListById = async (req, res, next) => {
    try {
        const { id, complaint_id } = req.params;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value = `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = ` SELECT stock_punch_histories.*, item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, DATE_FORMAT(stock_punch_histories.approved_at, '%y-%m-%d %H:%i:%s %p') AS approve_at, stocks.supplier_id as supplier_id, complaints.complaint_unique_id, stocks.rate as item_price FROM stock_punch_histories LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id LEFT JOIN item_masters ON item_masters.id = stock_punch_histories.item_id LEFT JOIN stocks ON stocks.id = stock_punch_histories.stock_id WHERE stock_punch_histories.status IN ('0', '1') AND stock_punch_histories.approved_qty <> 0 AND stock_punch_histories.user_id= '${id}' AND stock_punch_histories.complaint_id = '${complaint_id}' ORDER BY stock_punch_histories.id DESC`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (row of queryResult) {
                const userDetails = await getUserDetails(row.user_id);
                const complainsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id);
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    item_name: row.item_name,
                    item_id: row.item_id,
                    item_punch_qty: row.item_qty,
                    item_price: row.item_price,
                    item_images: row.item_images,
                    total_Amount: Number(row.item_price) * Number(row.item_qty),
                    transaction_id: row.transaction_id ? row.transaction_id : null,
                    punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                    item_approved_qty: row.approved_qty,
                    approved_at: row.approve_at,
                    supplier_id: row.supplier_id ? row.supplier_id : "",
                    supplier_name: getSupplierName[0].supplier_name ? getSupplierName[0].supplier_name : "",
                    complainsDetails: complainsDetails,
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

async function giveApprovePunch(userId, complaintId) {
    const selectQuery = `SELECT * FROM stock_punch_histories WHERE user_id = '${userId}' AND complaint_id = '${complaintId}' AND approved_at IS NOT NULL ORDER BY id DESC`;
    const queryResult = await db.query(selectQuery);

    return queryResult[0].approved_at;
}

// stocks
const stockItemList = async (req, res, next) => {
    try {
        const { id } = req.params;
        // const query = `SELECT stocks.*, item_masters.name AS item_name, item_masters.image AS item_image, COALESCE(users.name, admins.name) AS user_name, COALESCE(users.employee_id, admins.employee_id) AS employee_id, COALESCE(users.image, admins.image) AS user_image FROM stocks LEFT JOIN item_masters ON item_masters.id = stocks.product_id LEFT JOIN users ON users.id = stocks.requested_by LEFT JOIN admins ON admins.id = stocks.requested_by WHERE stocks.requested_by = '${id}' AND stocks.quantity != 0 AND (stocks.quantity - IFNULL(stocks.stock_punch_qty, 0)) != 0 GROUP BY stocks.product_id`;

        const query = `
        SELECT 
            stocks.product_id, 
            MAX(stocks.id) AS stock_id, 
            MAX(item_masters.name) AS item_name, 
            MAX(item_masters.image) AS item_image, 
            MAX(COALESCE(users.name, admins.name)) AS user_name, 
            MAX(COALESCE(users.employee_id, admins.employee_id)) AS employee_id, 
            MAX(COALESCE(users.image, admins.image)) AS user_image, 
            SUM(stocks.quantity) AS total_quantity, 
            SUM(IFNULL(stocks.stock_punch_qty, 0)) AS total_stock_punch_qty
        FROM stocks
        LEFT JOIN item_masters ON item_masters.id = stocks.product_id
        LEFT JOIN users ON users.id = stocks.requested_by
        LEFT JOIN admins ON admins.id = stocks.requested_by
        WHERE stocks.requested_by = '${id}' 
        AND stocks.quantity != 0 
        AND (stocks.quantity - IFNULL(stocks.stock_punch_qty, 0)) != 0
        GROUP BY stocks.product_id;
`
        const queryResult = await db.query(query);

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Request fetched successfully",
            data: queryResult,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    stockPunch,
    getAllStockPunchList,
    getStockPunchById,
    verifyStockPunchOtp,
    getStockRequest,
    getStockRequestById,
    approveStockPunch,
    getAllApproveStockPunchList,
    getAllApproveStockPunchListById,
    stockItemList,
};

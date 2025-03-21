var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getSupplierDetails,
    getCreatedByDetails,
    getSupplierDetailsById,
    generateRandomNumber,
    getRoleByUserId,
} = require("../helpers/general");
const { getItemUsedDetailsInComplaint, getBrandsByItemId } = require("../helpers/commonHelper");
const { insertNotifications } = require("../helpers/notifications");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const getAllItemStockReport = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["item_masters.name", "item_masters.rate", "units.short_name", "units.name"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT item_masters.*, units.name as unit_name, units.short_name as unit_short_name FROM item_masters LEFT JOIN units ON units.id = item_masters.unit_id ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by for pagination
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var stockAlertStatus = false;
            var stockAlertQty = 0;

            for (const row of queryResult) {
                const totalUsedItems = await db.query(
                    "SELECT SUM(quantity) AS total_quantity FROM items_used WHERE used_item = ?",
                    [row.id]
                );

                const total_quantity = totalUsedItems[0];
                const getTotalLeftStockQty = row.qty - total_quantity.total_quantity;

                if (getTotalLeftStockQty < 5) {
                    stockAlertStatus = true;
                    stockAlertQty = getTotalLeftStockQty;
                }

                finalData.push({
                    item_id: row.id,
                    name: row.name,
                    rate: row.rate,
                    qty: getTotalLeftStockQty,
                    image: row.image,
                    unit_id: row.unit_id,
                    unit_name: row.unit_name,
                    unit_short_name: row.unit_short_name,
                    totalUsedItems: total_quantity.total_quantity || 0,
                    stockAlertStatus: stockAlertStatus,
                    stockAlertQty: stockAlertQty,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const getItemDistributeReport = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const query = `SELECT item_masters.*, units.name as unit_name, units.short_name as unit_short_name FROM item_masters LEFT JOIN units ON units.id = item_masters.unit_id WHERE item_masters.id = ?`;

        const queryResult = await db.query(query, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var stockAlertStatus = false;
            var stockAlertQty = 0;

            for (const row of queryResult) {
                const totalUsedItems = await db.query(
                    "SELECT SUM(quantity) AS total_quantity FROM items_used WHERE used_item = ?",
                    [row.id]
                );

                const total_quantity = totalUsedItems[0];
                const getTotalLeftStockQty = row.qty - total_quantity.total_quantity;

                if (getTotalLeftStockQty < 5) {
                    stockAlertStatus = true;
                    stockAlertQty = getTotalLeftStockQty;
                }

                // get item used in complaints
                const itemUsedDetails = await getItemUsedDetailsInComplaint(row.id);

                if (itemUsedDetails.length > process.env.VALUE_ZERO) {
                    for (const item of itemUsedDetails) {
                        item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss A");
                    }
                }

                finalData.push({
                    item_id: row.id,
                    name: row.name,
                    rate: row.rate,
                    qty: row.qty,
                    image: row.image,
                    unit_id: row.unit_id,
                    unit_name: row.unit_name,
                    unit_short_name: row.unit_short_name,
                    totalUsedItems: total_quantity.total_quantity || 0,
                    stockAlertStatus: stockAlertStatus,
                    stockAlertQty: stockAlertQty,
                    itemUsedDetails: itemUsedDetails,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const stockTransfer = async (req, res, next) => {
    try {
        const { user_id, items_detail } = req.body;
        const items = JSON.stringify(items_detail);
        const created_by = req.user.user_id;
        const query = `INSERT INTO stock_transfer_history(user_id, items, created_by) VALUES (?,?,?)`;
        const queryResult = await db.query(query, [user_id, items, created_by]);
        if (queryResult.insertId > process.env.VALUE_ZERO) {
            if (items_detail.length > 0) {
                for (let index = 0; index < items_detail.length; index++) {
                    const element = items_detail[index];
                    const stockData = await db.query(
                        `SELECT id, product_id, rate, quantity, supplier_id, requested_by FROM stocks WHERE requested_by='${user_id}' AND product_id='${element.item_id}'`
                    );
                    if (stockData.length > 0) {
                        const newQty = Number(stockData[0].quantity) + Number(element.item_qty);
                        await db.query(`UPDATE stocks SET quantity='${newQty}' WHERE id='${stockData[0].id}'`);
                    } else {
                        await db.query(
                            `INSERT INTO stocks(product_id, rate, quantity, supplier_id, requested_by) VALUES ('${element.item_id}','${element.item_rate}','${element.item_qty}','1','${user_id}')`
                        );
                    }
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Stock transfer successfully.",
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

// const newStockTransfer = async (req,res,next) => {
//     try {
//         const { transfered_by, transfered_to, transfer_items } = req.body;

//         if (!Array.isArray(transfer_items)) {
//             throw new Error('Transfer items should be an array');
//         }

//         const created_by = req.user.user_id;
//         for (let i = 0; i < transfer_items.length; i++) {
//             const { id, item_id, transfer_item_qty, transfer_amount, approved_price } = transfer_items[i];
//             const getSupplierId = await db.query(`SELECT * from stocks where id = '${id}'`)
//             const supplierId = getSupplierId[0].supplier_id;

//             const insertQuery = `INSERT INTO stock_transfer_history(transfered_by, transfered_to, item_id, quantity, created_by, transfer_amount, supplier_id, price) VALUES (?,?,?,?,?,?,?,?)`;
//             const insertResult = await db.query(insertQuery, [transfered_by, transfered_to, item_id, transfer_item_qty, created_by, transfer_amount, supplierId, approved_price]);

//             if (insertResult.affectedRows > 0) {
//                 const stockData = await db.query(`SELECT id, product_id, rate, quantity, supplier_id, requested_by FROM stocks WHERE id= ? `, [id]);
//                 if (stockData.length > 0) {

//                     const newQty = Number(stockData[0].quantity) - Number(transfer_item_qty);
//                     const updatedStockQty = await db.query(`UPDATE stocks SET quantity=? WHERE id=?`, [newQty, id]);

//                     if (updatedStockQty.affectedRows > 0) {
//                         const selectQuery = await db.query(`SELECT * FROM stocks WHERE rate=? AND requested_by=?`, [stockData[0].rate, transfered_to]);

//                         if (selectQuery.length > 0) {
//                             const addNewQty = Number(selectQuery[0].quantity) + Number(transfer_item_qty);
//                             await db.query(`UPDATE stocks SET quantity=? WHERE id=?`, [addNewQty, selectQuery[0].id]);
//                         } else {
//                             await db.query(`INSERT INTO stocks(product_id, rate, quantity, supplier_id, requested_by) VALUES (?,?,?,?,?)`, [stockData[0].product_id, stockData[0].rate, transfer_item_qty, stockData[0].supplier_id, transfered_to]);
//                         }
//                     } else {
//                         throw new Error("Failed to update stock quantity");
//                     }
//                 }
//             }
//         }

//         return res.status(StatusCodes.OK).json({
//             status: true,
//             message: 'Stock transfer successful'
//         });

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message
//         });
//     }
// }

const newStockTransfer = async (req, res, next) => {
    try {
        let { transfered_by, transfered_to, stock_transfer_for, otp } = req.body;
        const transferItemSchema = Joi.object({
            id: Joi.number().required(),
            item_id: Joi.number().required(),
            // remaining_item_qty: Joi.number().required().min(1).messages({
            //     'number.base': 'Transfer quantity should be a number',
            //     'number.min': 'Minimum transfer quantity is 1',
            // }),
            transfer_item_qty: Joi.number().required(),
            transfer_amount: Joi.number().required(),
            approved_price: Joi.number().required(),
        }).options({ allowUnknown: true });

        const transferRequestSchema = Joi.object({
            transfered_by: Joi.number().required(),
            transfered_to: Joi.number().required(),
            stock_transfer_for: Joi.number().required(),
            otp: Joi.optional(),
            transfer_items: Joi.array().items(transferItemSchema).required(),
        });

        const { error } = transferRequestSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }
        // check if transfer quantity is greater than 0
        if (!Array.isArray(req.body.transfer_items && req.body.transfer_items.length > 0)) {
            if (parseInt(req.body.transfer_items[0].transfer_item_qty) <= 0) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Transfer quantity should be greater than 0",
                });
            }
        }

        const userId = req.user.user_id;

        let otpCode;
        if (otp !== "" && otp !== undefined && otp !== null) {
            otpCode = otp;
        } else {
            const userOtp = await insertOtpAndNotificationsStockTransfer(transfered_by, transfered_to, userId);
            if (userOtp.length > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Otp send successfully." });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Otp not send." });
            }
        }

        const otpVerification = await verifyStockTransferOtp(userId, otpCode, req.body);
        if (!otpVerification) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Invalid OTP!",
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Stock transfer successful",
        });
    } catch (error) {
        return next(error);
    }
};

// const newStockTransfer = async (req,res,next) => {
//     try {
//         const { transfered_by, transfered_to, stock_transfer_for, otp } = req.body;
//         const userId = req.user.user_id;

//         // Validate request body
//         const validationResult = validateTransferRequest(req.body);
//         if (validationResult.error) {
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: validationResult.error.message
//             });
//         }

//         let otpCode;

//         // Direct transfer without OTP
//         if (stock_transfer_for == 1) {
//             await insertStockTransferData(userId, req.body);
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: 'Stock transfer successful'
//             });
//         }else if (stock_transfer_for == 2) {
//             // If OTP provided, verify it
//             if (otp) {
//                 otpCode = otp;
//                 const otpVerification = await verifyStockTransferOtp(userId, otpCode, req.body);
//                 if (!otpVerification) {
//                     return res.status(StatusCodes.UNAUTHORIZED).json({
//                         status: false,
//                         message: "Invalid OTP!"
//                     });
//                 }
//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: 'Stock transfer successful'
//                 });
//             }
//             // If OTP not provided, generate and send OTP
//             else {
//                 const userOtp = await insertOtpAndNotificationsStockTransfer(transfered_by, transfered_to, userId);
//                 if (userOtp.length > 0) {
//                     return res.status(StatusCodes.OK).json({ status: true, message: "OTP sent successfully." });
//                 } else {
//                     return res.status(StatusCodes.OK).json({ status: false, message: "Failed to send OTP." });
//                 }
//             }
//         }else{
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: "Invalid stock transfer type!"
//             });
//         }

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message || 'Internal server error'
//         });
//     }
// }

// // Function to validate transfer request schema
// const validateTransferRequest = (data) => {
//     const transferItemSchema = Joi.object({
//         id: Joi.number().required(),
//         item_id: Joi.number().required(),
//         remaining_item_qty: Joi.number().required(),
//         transfer_item_qty: Joi.number().required(),
//         transfer_amount: Joi.number().required(),
//         approved_price: Joi.number().required(),
//     });

//     const transferRequestSchema = Joi.object({
//         transfered_by: Joi.number().required(),
//         transfered_to: Joi.number().required(),
//         stock_transfer_for: Joi.number().required(),
//         otp: Joi.optional(),
//         transfer_items: Joi.array().items(transferItemSchema).required()
//     });

//     return transferRequestSchema.validate(data);
// }

async function verifyStockTransferOtp(userId, otpCode, data) {
    try {
        const { transfered_by, transfered_to, transfer_items, stock_transfer_for } = data;
        const selectQuery = `SELECT * FROM stock_transfer_otp WHERE transfered_to='${transfered_to}' AND transfered_by='${transfered_by}' AND otp='${otpCode}' AND is_verify='0'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0 || otpCode == process.env.STOCK_PUNCH_MASTER_OTP) {
            if (queryResult.length > 0) {
                await db.query(`UPDATE stock_transfer_otp SET is_verify='1' WHERE id='${queryResult[0]?.id}'`);
            }
            // Insert stock transfer data
            await insertStockTransferData(userId, data);

            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function insertStockTransferData(userId, data) {
    const created_by = userId;
    const { transfer_items, stock_transfer_for, transfered_to, transfered_by } = data;
    for (let i = 0; i < transfer_items.length; i++) {
        const { id, item_id, transfer_item_qty, transfer_amount, approved_price } = transfer_items[i];
        const getSupplierId = await db.query(`SELECT * from stocks where id = '${id}'`);
        const supplierId = getSupplierId[0].supplier_id;
        const insertQuery = `INSERT INTO stock_transfer_history(transfered_for,transfered_by, transfered_to, item_id, quantity, created_by, transfer_amount, supplier_id, price) VALUES (?,?,?,?,?,?,?,?,?)`;
        const insertResult = await db.query(insertQuery, [
            stock_transfer_for,
            transfered_by,
            transfered_to,
            item_id,
            transfer_item_qty,
            created_by,
            transfer_amount,
            supplierId,
            approved_price,
        ]);
        if (insertResult.affectedRows > 0) {
            const stockData = await db.query(
                `SELECT id, product_id, rate, quantity, supplier_id, requested_by FROM stocks WHERE id= ? `,
                [id]
            );
            if (stockData.length > 0) {
                const newQty = Number(stockData[0].quantity) - Number(transfer_item_qty);
                const updatedStockQty = await db.query(`UPDATE stocks SET quantity=? WHERE id=?`, [newQty, id]);
                if (updatedStockQty.affectedRows > 0) {
                    const selectQuery = await db.query(`SELECT * FROM stocks WHERE rate=? AND requested_by=?`, [
                        stockData[0].rate,
                        transfered_to,
                    ]);
                    if (selectQuery.length > 0) {
                        const addNewQty = Number(selectQuery[0].quantity) + Number(transfer_item_qty);
                        await db.query(`UPDATE stocks SET quantity=? WHERE id=?`, [addNewQty, selectQuery[0].id]);
                    } else {
                        await db.query(
                            `INSERT INTO stocks(product_id, rate, quantity, supplier_id, requested_by) VALUES (?,?,?,?,?)`,
                            [
                                stockData[0].product_id,
                                stockData[0].rate,
                                transfer_item_qty,
                                stockData[0].supplier_id,
                                transfered_to,
                            ]
                        );
                    }
                } else {
                    throw new Error("Failed to update stock quantity");
                }
            }
        }
    }
}

async function insertOtpAndNotificationsStockTransfer(transfered_by, transfered_to, userId) {
    // Generate OTP
    const otp = await generateRandomNumber(6);
    // Insert OTP into database
    await insertOtpInStocksTransfer(transfered_to, transfered_by, otp);
    // Insert notification

    const user_type = await getRoleByUserId(transfered_to);
    const notificationData = [
        {
            userId: transfered_to,
            roleId: user_type,
            title: "OTP for Stock Transfer.",
            message: `Stock transfer successfully! Use OTP ${otp} for verification.`,
        },
    ];
    await insertNotifications(notificationData);

    return otp;
}

async function insertOtpInStocksTransfer(transfered_to, transfered_by, otp) {
    const selectQuery = `SELECT * FROM stock_transfer_otp WHERE transfered_by = '${transfered_by}' AND transfered_to = '${transfered_to}'`;

    const selectResult = await db.query(selectQuery);

    if (selectResult.length > 0) {
        const updateQuery = `UPDATE stock_transfer_otp SET otp = '${otp}', is_verify = '0' WHERE transfered_by = '${transfered_by}' AND transfered_to = '${transfered_to}'`;
        await db.query(updateQuery);
    } else {
        const insertQuery = `INSERT INTO stock_transfer_otp (transfered_by, transfered_to, otp) VALUES ('${transfered_by}', '${transfered_to}', '${otp}')`;
        await db.query(insertQuery);
    }
}

const stockPunchItemsMasterToApprovePrice = async (req, res, next) => {
    try {
        const { id, request_by } = req.params; // Assuming you are getting the id from the request parameters
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        const selectQuery = `SELECT stocks.id as stock_id, stocks.product_id, stocks.stock_punch_qty, stocks.quantity , stocks.rate, item_masters.name As item_name, stocks.supplier_id FROM item_masters LEFT JOIN stocks ON item_masters.id = stocks.product_id  WHERE stocks.product_id = '${id}' AND stocks.requested_by = '${request_by}'`;
        const queryResult = await db.query(selectQuery);

        let check;
        const finalData = [];
        if (queryResult.length > 0) {
            let nextPrice = null; // Initialize nextPrice to null

            for (const row of queryResult) {
                const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                check = row.quantity - row.stock_punch_qty;

                if (check !== 0 && nextPrice === null) {
                    nextPrice = row.rate;
                }

                const expenseTransferSum = queryResult.reduce((sum, item) => {
                    return item.product_id === row.product_id ? sum + item.stock_punch_qty : sum;
                }, 0);
                // Add to finalData only if remaining quantity is greater than 0
                if (check > 0) {
                    finalData.push({
                        stock_id: row.stock_id,
                        item_id: row.product_id,
                        item_name: row.item_name,
                        item_price: nextPrice,
                        remaining_quantity: check,
                        request_qty: row.request_qty,
                        supplier_id: row.supplier_id,
                        supplier_name: getSupplierName[0].supplier_name,
                        previous_punch_qty: expenseTransferSum,
                    });
                    break;
                }
            }

            if (finalData.length > 0) {
                return res.status(StatusCodes.OK).json({ status: true, data: finalData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getStockTransferQuantity = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const month = req.query.month || moment().format("YYYY-MM");
        // const month = '2024-04'
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (transfered_to_users.name LIKE '%${searchData}%' OR transfered_to_users.employee_id LIKE '%${searchData}%' OR transfered_by_admins.name LIKE '%${searchData}%'  OR transfered_by_admins.employee_id LIKE '%${searchData}%')`;
        }

        let selectQuery = ` 
        SELECT stock_transfer_history.transfered_to, stock_transfer_history.transfered_by, stock_transfer_history.created_at, 
        DATE_FORMAT(stock_transfer_history.created_at, '%y-%m-%d %H:%i:%s %p') AS stock_transfer_date, 
        item_masters.id AS item_id, item_masters.name AS item_name, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name, stock_transfer_history.supplier_id 
        FROM stock_transfer_history 
        LEFT JOIN item_masters ON stock_transfer_history.item_id = item_masters.id 
        LEFT JOIN suppliers ON stock_transfer_history.supplier_id = suppliers.id 
        LEFT JOIN users AS transfered_to_users ON transfered_to_users.id = stock_transfer_history.transfered_to 
        LEFT JOIN admins AS transfered_to_admins ON transfered_to_admins.id = stock_transfer_history.transfered_to 
        LEFT JOIN users AS transfered_by_users ON transfered_by_users.id = stock_transfer_history.transfered_by 
        LEFT JOIN admins AS transfered_by_admins ON transfered_by_admins.id = stock_transfer_history.transfered_by 
        WHERE DATE_FORMAT(stock_transfer_history.created_at, '%Y-%m') = '${month}' AND stock_transfer_history.created_by = '${req.user.user_id}' 
        ${search_value} 
        GROUP BY stock_transfer_history.id, stock_transfer_history.transfered_to, stock_transfer_history.transfered_by, stock_transfer_history.created_at, stock_transfer_history.item_id, stock_transfer_history.supplier_id
        ORDER BY stock_transfer_history.id`;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const brands = await getBrandsByItemId(row.item_id);
                const transfer_by_details = await getCreatedByDetails(row.transfered_by);
                const transfer_to_details = await getCreatedByDetails(row.transfered_to);
                const getPunch = await giveCurrentPunch(row.transfered_by, row.transfered_to);
                finalData.push({
                    id: row.id,
                    item_id: row.item_id,
                    item_name: row.item_name,
                    brands,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_name,
                    transfer_by: transfer_by_details,
                    transfer_to_details: transfer_to_details,
                    transfer_quantity: row.quantity,
                    transfer_amounts: row.transfer_amount,
                    transfered_date: moment(getPunch).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            if (!pageSize) {
                finalData.forEach((item) => {
                    item.transfer_by = item.transfer_by?.name;
                    item.transfer_to = item.transfer_to_details?.name;
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "stock-punch-transfer", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "stock-punch-transfer", "Stock Punch Transfer", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            return res.status(StatusCodes.OK).json({ status: true, data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function giveCurrentPunch(userId, complaintId) {
    const selectQuery = `SELECT * FROM stock_transfer_history WHERE transfered_by = '${userId}' AND transfered_to = '${complaintId}' ORDER BY id DESC`;
    const queryResult = await db.query(selectQuery);
    return queryResult[0].created_at;
}

const getStockTransferQuantityById = async (req, res, next) => {
    try {
        const { transfered_by, transfered_to } = req.params;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (transfered_to_users.name LIKE '%${searchData}%' OR transfered_to_users.employee_id LIKE '%${searchData}%' OR transfered_by_admins.name LIKE '%${searchData}%'  OR transfered_by_admins.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = ` SELECT stock_transfer_history.*,DATE_FORMAT(stock_transfer_history.created_at, '%y-%m-%d %H:%i:%s %p') AS stock_transfer_date, item_masters.id AS item_id, item_masters.name AS item_name, item_masters.image as item_images, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name, stock_transfer_history.supplier_id FROM stock_transfer_history LEFT JOIN item_masters ON stock_transfer_history.item_id = item_masters.id LEFT JOIN suppliers ON stock_transfer_history.supplier_id = suppliers.id LEFT JOIN users AS transfered_to_users ON transfered_to_users.id = stock_transfer_history.transfered_to LEFT JOIN admins AS transfered_to_admins ON transfered_to_admins.id = stock_transfer_history.transfered_to LEFT JOIN users AS transfered_by_users ON transfered_by_users.id = stock_transfer_history.transfered_by LEFT JOIN admins AS transfered_by_admins ON transfered_by_admins.id = stock_transfer_history.transfered_by WHERE stock_transfer_history.transfered_by = '${transfered_by}' AND transfered_to = '${transfered_to}' ORDER BY stock_transfer_history.id ASC`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const transfer_by_details = await getCreatedByDetails(row.transfered_by);
                const transfer_to_details = await getCreatedByDetails(row.transfered_to);

                finalData.push({
                    id: row.id,
                    item_id: row.item_id,
                    item_name: row.item_name,
                    item_images: row.item_images,
                    item_price: row.price,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_name,
                    transfer_by: transfer_by_details,
                    transfer_to_details: transfer_to_details,
                    transfer_quantity: row.quantity,
                    transfer_amounts: row.transfer_amount,
                    transfered_date: row.stock_transfer_date,
                });
            }
            return res.status(StatusCodes.OK).json({ status: true, data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getUserStockItems = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = await db.query(
            `SELECT stocks.product_id, stocks.new_item, stocks.rate, stocks.requested_by, item_masters.id as item_id, item_masters.name as item_name, item_masters.image as item_image FROM stocks LEFT JOIN item_masters ON stocks.product_id = item_masters.id WHERE stocks.requested_by = '${id}' GROUP BY stocks.product_id ORDER BY stocks.id ASC;`
        );

        if (selectQuery.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, data: selectQuery });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllItemStockReport,
    getItemDistributeReport,
    stockTransfer,
    newStockTransfer,
    stockPunchItemsMasterToApprovePrice,
    getStockTransferQuantity,
    getStockTransferQuantityById,
    getUserStockItems,
};

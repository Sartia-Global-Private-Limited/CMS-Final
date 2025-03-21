require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const { con, makeDb } = require("../db");
const moment = require("moment");
const Joi = require("joi");
const path = require("path");
const xlsx = require("xlsx");

const {
    calculatePagination,
    generateRandomNumber,
    getRoleByUserId,
    getRegionalNameById,
    getComplaintUniqueId,
    getPoDetailById,
    getOutletById,
    getSalesAreaById,
    getRecord,
} = require("../helpers/general");
const {
    addPaymentSettingValidation,
    updatePaymentSettngValidation,
    updatePaymentSettingAmountValidation,
    addPaidAmountValidation,
    addPaymentPaidValidation,
    createAreaManagerValidation,
    updateAreaManagerValidation,
    addRoPaymentPaidValidation,
    checkPositiveInteger,
    importPromotionValidation,
} = require("../helpers/validation");

const {
    calculatedPercentage,
    uploadFile,
    importDataFromExcel,
    uploadAndValidateData,
    performRecordChecks,
} = require("../helpers/commonHelper");
const { insertNotifications } = require("../helpers/notifications");
const { parseDate } = require("pdf-lib");

const db = makeDb();

const addPaymentSetting = async (req, res, next) => {
    try {
        const { error, value } = addPaymentSettingValidation.validate(req.body);

        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
        req.body.created_by = req.user.user_id;

        const insertQuery = "INSERT INTO payment_setting SET ?";
        const queryResult = await db.query(insertQuery, req.body);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.CREATED).json({
                status: true,
                message: "Payment setting added successfully",
            });
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Payment adding failed" });
    } catch (error) {
        return next(error);
    }
};

const createAreaManagerRatio = async (req, res, next) => {
    try {
        const { error, value } = createAreaManagerValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }

        const data = {
            manager_id: req.body.manager_id,
            company_ratio: req.body.company_ratio,
            manager_ratio: req.body.manager_ratio,
            created_by: req.user.user_id,
        };
        const insertQuery = "INSERT INTO manager_promotional SET ?";
        const queryResult = await db.query(insertQuery, data);
        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.CREATED).json({
                status: true,
                message: "Area manager added successfully",
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Area manager adding failed",
        });
    } catch (error) {
        return next(error);
    }
};

const getAllAreaManager = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";

        if (searchData) {
            search_value += ` AND users.username LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT manager_promotional.id, manager_promotional.manager_id, manager_promotional.company_ratio, manager_promotional.manager_ratio, users.username AS manager_name FROM manager_promotional LEFT JOIN users ON users.id = manager_promotional.manager_id WHERE manager_promotional.created_by = '${req.user.user_id}' ${search_value} ORDER BY manager_promotional.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Data not found",
        });
    } catch (error) {
        return next(error);
    }
};

const getAreaManagerById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT manager_promotional.id, manager_promotional.manager_id, manager_promotional.company_ratio, manager_promotional.manager_ratio, users.username AS manager_name FROM manager_promotional LEFT JOIN users ON users.id = manager_promotional.manager_id WHERE manager_promotional.id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
            });
        }
        res.status(StatusCodes.NOT_FOUND).json({
            status: false,
            message: "Manager Ratio Not Found",
        });
    } catch (error) {
        return next(error);
    }
};

const updateAreaManager = async (req, res, next) => {
    try {
        const { error, value } = updateAreaManagerValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }

        const data = {
            manager_id: req.body.manager_id,
            company_ratio: req.body.company_ratio,
            manager_ratio: req.body.manager_ratio,
            updated_by: req.user.user_id,
        };
        const updateQuery = "UPDATE manager_promotional SET ? WHERE id = ?";
        const queryResult = await db.query(updateQuery, [data, req.body.id]);
        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.CREATED).json({
                status: true,
                message: "Area manager updated successfully",
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Area manager updating failed",
        });
    } catch (error) {
        return next(error);
    }
};

const getAllPaymentSettings = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";

        if (searchData) {
            search_value += ` AND (payment_setting.man_power LIKE '%${searchData}%' OR payment_setting.retention_money LIKE '%${searchData}%' OR regional_offices.regional_office_name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT  payment_setting.id AS id, payment_setting.gst AS gst,payment_setting.tds, payment_setting.tds_with_gst, payment_setting.retention_money, payment_setting.man_power, payment_setting.site_expense, payment_setting.site_stock,payment_setting.promotion_expense, regional_offices.regional_office_name AS regional_office, regional_offices.id AS ro_id FROM payment_setting JOIN regional_offices ON regional_offices.id = payment_setting.ro_id WHERE payment_setting.is_status = 0 AND payment_setting.created_by = ${req.user.user_id} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Data not found",
        });
    } catch (error) {
        return next(error);
    }
};

const getPaymentSettingDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT payment_setting.id AS id, payment_setting.gst AS gst, payment_setting.tds, payment_setting.tds_with_gst, payment_setting.retention_money, payment_setting.man_power, payment_setting.site_expense, payment_setting.site_stock,payment_setting.promotion_expense, regional_offices.id AS ro_id, regional_offices.regional_office_name AS regional_office FROM payment_setting LEFT JOIN regional_offices ON regional_offices.id = payment_setting.ro_id WHERE payment_setting.id = ? AND payment_setting.is_status = 0`;
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
            });
        }
        res.status(StatusCodes.NOT_FOUND).json({
            status: false,
            message: "Payment Setting Not Found",
        });
    } catch (error) {
        return next(error);
    }
};

const updatePaymentSetting = async (req, res, next) => {
    try {
        const { error, value } = updatePaymentSettngValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
        const {
            id,
            gst,
            tds,
            tds_with_gst,
            retention_money,
            man_power,
            site_expense,
            site_stock,
            promotion_expense,
            ro_id,
        } = req.body;

        const paymentSettingData = {
            tds,
            gst,
            tds_with_gst,
            retention_money,
            man_power,
            site_expense,
            site_stock,
            promotion_expense,
            ro_id,
            updated_by: req.user.user_id,
        };

        const updateQuery = `UPDATE payment_setting SET ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [paymentSettingData, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment Setting Updated successfully",
            });
        }
        return res.status(StatusCodes.OK).json({
            status: false,
            message: "Payment Setting Updation Failed",
        });
    } catch (error) {
        return next(error);
    }
};

const deletePaymentSetting = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteQuery = `UPDATE payment_setting SET is_status = ? WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [1, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment Setting Deleted successfully",
            });
        }
        return res.status(StatusCodes.OK).json({
            status: false,
            message: "Payment Setting Deletion Failed",
        });
    } catch (error) {
        return next(error);
    }
};

const getExpensePunchAndStockTotalAmount = async (req, res, next) => {
    try {
        const ids = req.body.id;
        const complaint_ids = ids.map((id) => id.toString().trim());

        const results = [];

        for (const complaint_id of complaint_ids) {
            const selectQuery = `
        SELECT 
            SUM(CASE WHEN Type = 'Total Stock' THEN Total ELSE 0 END) AS Total_Stock,
            SUM(CASE WHEN Type = 'Total Expense' THEN Total ELSE 0 END) AS Total_Expense
        FROM (
            SELECT 
                'Total Stock' AS Type,
                SUM(stocks.rate * stock_punch_histories.site_approved_qty) AS Total
            FROM
                stock_punch_histories
                LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id
                LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id
            WHERE 
                stock_punch_histories.site_approved_status = 2 
                AND stock_punch_histories.complaint_id = ${complaint_id}

            UNION ALL

            SELECT 
                'Total Expense' AS Type,
                SUM(expense_punch_history.site_approved_qty * fund_requests.item_price) AS Total
            FROM
                expense_punch_history
                LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id
                LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id
            WHERE 
                expense_punch_history.site_approved_status = 2 
                AND expense_punch_history.complaint_id = ${complaint_id}
        ) AS combined_totals`;

            const queryResult = await db.query(selectQuery);
            results.push({
                complaint_id: complaint_id,
                Total_Stock: queryResult[0].Total_Stock,
                Total_Expense: queryResult[0].Total_Expense,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            data: results,
        });
    } catch (error) {
        return next(error);
    }
};

// async function getExpensePunchAndStockTotalAmounts(ids){
//   try {
//     const complaint_ids = ids.map(id => id.toString().trim());

//     const results = [];

//     for (const complaint_id of complaint_ids) {
//       const selectQuery = `
//         SELECT
//             SUM(CASE WHEN Type = 'Total Stock' THEN Total ELSE 0 END) AS Total_Stock,
//             SUM(CASE WHEN Type = 'Total Expense' THEN Total ELSE 0 END) AS Total_Expense
//         FROM (
//             SELECT
//                 'Total Stock' AS Type,
//                 SUM(stocks.rate * stock_punch_histories.site_approved_qty) AS Total
//             FROM
//                 stock_punch_histories
//                 LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id
//                 LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id
//             WHERE
//                 stock_punch_histories.site_approved_status = 2
//                 AND stock_punch_histories.complaint_id = ${complaint_id}

//             UNION ALL

//             SELECT
//                 'Total Expense' AS Type,
//                 SUM(expense_punch_history.site_approved_qty * fund_requests.item_price) AS Total
//             FROM
//                 expense_punch_history
//                 LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id
//                 LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id
//             WHERE
//                 expense_punch_history.site_approved_status = 2
//                 AND expense_punch_history.complaint_id = ${complaint_id}
//         ) AS combined_totals`;

//       const queryResult = await db.query(selectQuery);
//       results.push({
//         complaint_id: complaint_id,
//         Total_Stock: queryResult[0].Total_Stock,
//         Total_Expense: queryResult[0].Total_Expense
//       });
//     }
//     return results

//   } catch (error) {next(error)
//     return error.message;
//   }
// };

async function getDeductionAmount(id, amount) {
    let deduction;
    amount = parseFloat(amount);
    const selectQuery = `SELECT * FROM payment_setting WHERE manager_id = ${id}`;
    const queryResult = await db.query(selectQuery);

    let { gst, tds, tds_with_gst } = queryResult[0];

    gst = await calculatedPercentage(parseFloat(gst), amount);
    tds = await calculatedPercentage(parseFloat(tds), amount);
    tds_with_gst = await calculatedPercentage(parseFloat(tds_with_gst), amount);

    let ratio = await calculatedPercentage(40, amount);
    deduction = gst + tds + tds_with_gst + ratio;

    return deduction ?? 0;
}

// async function inseretIntoPaymentPaidOtp(manager_id, otp) {
//   try {
//     const selectQuery = `SELECT * FROM payment_paid_otp WHERE user_id = '${manager_id}'`;
//     const selectResult = await db.query(selectQuery);

//     //if already sent otp, resend it
//     if (selectResult.length > 0) {
//       const updateQuery = `UPDATE payment_paid_otp SET otp = '${otp}', is_verify = '0' WHERE user_id = '${manager_id}'`;
//       await db.query(updateQuery);
//     }
//     // send otp
//     else {
//       const insertQuery = `INSERT INTO payment_paid_otp (user_id, otp) VALUES ('${manager_id}', '${otp}')`;
//       await db.query(insertQuery);
//     }
//   } catch (error) {next(error)
//     throw new Error("otp sending failed", error.message);
//   }
// }

async function inseretIntoPaymentPaidOtp(ro_id, manager_id, otp) {
    try {
        const selectQuery = `SELECT * FROM payment_paid_otp WHERE user_id = '${manager_id}' AND ro_id = '${ro_id}'  `;
        const selectResult = await db.query(selectQuery);

        //if already sent otp, resend it
        if (selectResult.length > 0) {
            const updateQuery = `UPDATE payment_paid_otp SET otp = '${otp}', is_verify = '0' WHERE user_id = '${manager_id}' AND ro_id = ${ro_id}`;
            await db.query(updateQuery);
        }
        // send otp
        else {
            const insertQuery = `INSERT INTO payment_paid_otp (ro_id, user_id, otp) VALUES ('${ro_id}','${manager_id}', '${otp}')`;
            await db.query(insertQuery);
        }
    } catch (error) {
        throw new Error("otp sending failed", error.message);
    }
}
async function verifyOtp(manager_id, otp, ro_id) {
    try {
        const selectQuery = `SELECT * FROM payment_paid_otp WHERE user_id='${manager_id}' AND otp='${otp}' AND ro_id = ${ro_id}`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0) {
            await db.query(`UPDATE payment_paid_otp SET is_verify='1' WHERE id='${queryResult[0].id}'`);
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error.message);
    }
}

// payment paid controllers

const addPaymentPaidss = async (req, res, next) => {
    try {
        const { otp, billNumber, billDate, manager_id, ro_id, paid_payment, payment_data } = req.body;

        // Validate the incoming request
        const { error } = addPaymentPaidValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        // Handle OTP generation if not provided
        const generatedOtp = await generateRandomNumber(6);
        await inseretIntoPaymentPaidOtp(manager_id, generatedOtp);

        const user_type = await getRoleByUserId(manager_id);
        const notificationData = [
            {
                userId: manager_id,
                roleId: user_type,
                title: "OTP for paid amount.",
                message: `Payment OTP received successfully! Use OTP ${generatedOtp} for verification.`,
            },
        ];
        await insertNotifications(notificationData);

        return res.status(200).json({
            status: true,
            message: "OTP sent successfully.",
            otp: generatedOtp,
        });

        // Verify the provided OTP
        const otpVerification = await verifyOtp(manager_id, otp);
        if (!otpVerification) {
            return res.status(200).json({
                status: false,
                message: `Invalid OTP.`,
            });
        }

        // Prepare data for insertion
        let insertValues = [];
        let received_amount = 0;

        await Promise.all(
            payment_data.map(async (payment) => {
                const { measurement_amount, complaint_id, deduction } = payment;

                // Fetch deductions

                // Calculate the net amount after deduction
                const amount = parseFloat(measurement_amount - deduction).toFixed(2);

                // Aggregate the received amount
                received_amount += amount;

                // Prepare the data for batch insertion
                insertValues.push([
                    manager_id,
                    complaint_id,
                    ro_id,
                    measurement_amount,
                    0, // Assuming man_power is not provided
                    deduction,
                    amount,
                ]);
            })
        );

        // Insert the data into the payment_paid table
        const insertQuery = `INSERT INTO payment_paid (manager_id, complaint_id, ro_id, measurement_amount, man_power, deduction, amount) VALUES ?`;
        const queryResult = await db.query(insertQuery, [insertValues]);

        if (queryResult.affectedRows > 0) {
            // Update the manager's wallet
            await insertIntoAreaManagerWallet(manager_id, received_amount, otp, paid_payment);

            return res.status(200).json({ status: true, message: "Payment credited successfully." });
        }

        return res.status(200).json({
            status: false,
            message: "Something went wrong in inserting data.",
        });
    } catch (error) {
        return next(error);
    }
};

const addPaymentPaid = async (req, res, next) => {
    try {
        const { manager_id, ro_id, paid_payment, payment_data } = req.body;
        // Validate the incoming request
        const { error } = addPaymentPaidValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
        const user_id = req.user.user_id;
        // Handle OTP generation
        const generatedOtp = await generateRandomNumber(6);
        await inseretIntoPaymentPaidOtp(ro_id, manager_id, generatedOtp);

        // Get user type based on manager_id
        const user_type = await getRoleByUserId(manager_id);
        const uniqueId = await generatePaymentUniqueId();
        // Prepare notification data
        const notificationData = [
            {
                userId: manager_id,
                roleId: user_type,
                title: "OTP for paid amount.",
                message: `Payment OTP received successfully! Use OTP ${generatedOtp} for verification.`,
            },
        ];
        await insertNotifications(notificationData);

        // Convert payment_data to JSON string for insertion
        const paymentDataString = JSON.stringify(payment_data);

        // Insert payment data into the database
        const insertQuery =
            "INSERT INTO payment_paid (manager_id, ro_id, amount, payment_data, otp, unique_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const result = await db.query(insertQuery, [
            manager_id,
            ro_id,
            paid_payment,
            paymentDataString,
            generatedOtp,
            uniqueId,
            user_id,
        ]);

        if (result.affectedRows > 0) {
            const statusUpdate = await updateComplaintPaymentStatus(payment_data);
            return res.status(200).json({
                status: true,
                message: "OTP sent successfully.",
                otp: generatedOtp,
            });
        }
        // Send success response
    } catch (error) {
        return next(error);
        // Handle errors
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const otpVerifyInPaymentPaid = async (req, res, next) => {
    try {
        const { id, manager_id, amount_received, otp, payment_mode, paid_amount, ro_id, transaction_id, remark } =
            req.body;

        // Verify OTP

        const { error } = paymentSchema.validate(req.body);
        if (error) {
            return res.status(200).json({ status: false, message: error.message });
        }

        const otpVerification = await verifyOtp(manager_id, otp, ro_id);
        if (!otpVerification) {
            return res.status(200).json({
                status: false,
                message: "Invalid OTP.",
            });
        }

        // Process transaction
        const createdBy = req.user.user_id;
        const transaction = await insertIntoAreaManagerWallet(
            manager_id,
            amount_received,
            otp,
            paid_amount,
            transaction_id,
            payment_mode,
            remark,
            createdBy
        );
        // Update payment status in the database
        const updateQuery = "UPDATE payment_paid SET status = ?, payment_mode = ?, paid_amount = ? WHERE id = ?";

        await db.query(updateQuery, ["2", payment_mode, paid_amount, id]);

        return res.status(200).json({
            status: true,
            message: "Payment processed successfully.",
        });
    } catch (error) {
        return next(error);
    }
};

const paymentSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    payment_mode: Joi.string().required(),
    manager_id: Joi.number().integer().positive().required(),
    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
    amount_received: Joi.number().required(),
    paid_amount: Joi.number().required(),
    ro_id: Joi.number().integer().positive().required(),
}).options({ allowUnknown: true });

const updateComplaintPaymentStatus = async (paymentData) => {
    try {
        for (const payment of paymentData) {
            const { complaint_id } = payment;

            if (complaint_id) {
                const updateQuery = `UPDATE complaints SET payment_paid_status = 1 WHERE id = ?`;
                await db.query(updateQuery, [complaint_id]);
            }
        }

        console.log("Complaint payment statuses updated successfully.");
    } catch (error) {
        console.error("Error updating complaint payment statuses:", error);
        throw new Error("Error updating complaint payment statuses.");
    }
};

const updateComplaintPaymentStatusForRo = async (paymentData) => {
    try {
        for (const payment of paymentData) {
            const { complaint_id } = payment;

            if (complaint_id) {
                const updateQuery = `UPDATE complaints SET ro_paid_status  = 1 WHERE id = ?`;
                await db.query(updateQuery, [complaint_id]);
            }
        }

        console.log("Complaint payment statuses updated successfully.");
    } catch (error) {
        console.error("Error updating complaint payment statuses:", error);
        throw new Error("Error updating complaint payment statuses.");
    }
};

async function insertIntoAreaManagerWallet(
    area_manager_id,
    received_amount,
    otp,
    paid_amount,
    transaction_id,
    payment_mode,
    remark,
    createdBy
) {
    try {
        // Fetch the current balance for the area manager
        const selectQuery = `SELECT balance FROM area_manager_wallet WHERE area_manager_id = '${area_manager_id}' ORDER BY id DESC LIMIT 1`;
        const queryResult = await db.query(selectQuery);

        let newBalance = parseFloat(received_amount).toFixed(2);

        // If there's an existing balance, update the new balance
        if (queryResult.length > 0) {
            const currentBalance = queryResult[0].balance;
            newBalance = currentBalance - newBalance;
        }

        // Insert the new record with the updated balance
        const insertQuery = `INSERT INTO area_manager_wallet (area_manager_id, received_amount, balance, otp, transaction_id, status, created_by) VALUES ('${area_manager_id}', '${paid_amount}', '${newBalance}', '${otp}', '${transaction_id}', '${payment_mode}', '${createdBy}')`;

        await db.query(insertQuery);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAreaManagerTransactions = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        // const selectQuery = `SELECT amw1.area_manager_id, u.name, u.email, u.image, u.mobile, u.employee_id, amw1.balance, ( SELECT SUM(received_amount) FROM area_manager_wallet amw3 WHERE amw3.area_manager_id = amw1.area_manager_id ) AS total_received FROM area_manager_wallet amw1 INNER JOIN ( SELECT area_manager_id, MAX(id) AS max_id FROM area_manager_wallet GROUP BY area_manager_id ) amw2 ON amw1.area_manager_id = amw2.area_manager_id AND amw1.id = amw2.max_id INNER JOIN users u ON amw1.area_manager_id = u.id ORDER BY amw1.area_manager_id DESC LIMIT ${pageFirstResult}, ${pageSize} `;

        const selectQuery = `SELECT amw1.area_manager_id, amw1.balance,u.name, u.email, u.image, u.mobile, u.employee_id,(SELECT SUM(received_amount)  FROM area_manager_wallet amw3  WHERE amw3.area_manager_id = amw1.area_manager_id  AND amw3.status = 'credit') AS total_received_credit,(SELECT SUM(received_amount)  FROM area_manager_wallet amw3  WHERE amw3.area_manager_id = amw1.area_manager_id  AND amw3.status != 'credit') AS total_received_non_credit,((SELECT SUM(received_amount)   FROM area_manager_wallet amw3   WHERE amw3.area_manager_id = amw1.area_manager_id   AND amw3.status = 'credit') - (SELECT SUM(received_amount)   FROM area_manager_wallet amw3 WHERE amw3.area_manager_id = amw1.area_manager_id   AND amw3.status != 'credit')) AS remaining_balance FROM area_manager_wallet amw1 INNER JOIN (SELECT area_manager_id, MAX(id) AS max_id  FROM area_manager_wallet  GROUP BY area_manager_id) amw2 ON amw1.area_manager_id = amw2.area_manager_id AND amw1.id = amw2.max_id INNER JOIN users u ON amw1.area_manager_id = u.id INNER JOIN users am ON amw1.area_manager_id = am.id WHERE amw1.created_by = '${req.user.user_id}'  ORDER BY amw1.area_manager_id DESC LIMIT ${pageFirstResult}, ${pageSize} ;`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));

        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({ status: true, data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.OK).json({ status: false, message: error.message });
    }
};

const getAreaManagerTransactionsById = async (req, res, next) => {
    try {
        const areaManagerId = req.query.id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let search_value = "";

        if (!areaManagerId) {
            return res.status(StatusCodes.OK).json({ status: false, message: "area_manager_id is required" });
        }

        if (searchData) {
            search_value += ` AND ( otp LIKE '%${searchData}%' OR received_amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS date FROM area_manager_wallet WHERE area_manager_id = ${areaManagerId} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            const getBalance = await getLastBalance(areaManagerId);

            return res.status(StatusCodes.OK).json({
                status: true,
                data: queryResult,
                getBalance: getBalance,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function getLastBalance(areaManagerId) {
    try {
        const selectQuery = `
      SELECT 
    amw1.area_manager_id, 
    amw1.balance,
    u.name, 
    u.email, 
    u.image, 
    u.mobile, 
    u.employee_id,
    (SELECT SUM(received_amount)  
      FROM area_manager_wallet amw3  
      WHERE amw3.area_manager_id = amw1.area_manager_id  
      AND amw3.status = 'credit') AS total_received_credit,
    (SELECT SUM(received_amount)  
      FROM area_manager_wallet amw3  
      WHERE amw3.area_manager_id = amw1.area_manager_id  
      AND amw3.status != 'credit') AS total_received_non_credit,
    ((SELECT SUM(received_amount)   
      FROM area_manager_wallet amw3   
      WHERE amw3.area_manager_id = amw1.area_manager_id   
      AND amw3.status = 'credit') - 
    (SELECT SUM(received_amount)   
      FROM area_manager_wallet amw3 
      WHERE amw3.area_manager_id = amw1.area_manager_id   
      AND amw3.status != 'credit')) AS remaining_balance
FROM 
    area_manager_wallet amw1
INNER JOIN 
    (SELECT area_manager_id, MAX(id) AS max_id  
      FROM area_manager_wallet  
      GROUP BY area_manager_id) amw2 
    ON amw1.area_manager_id = amw2.area_manager_id 
    AND amw1.id = amw2.max_id
INNER JOIN 
    users u 
    ON amw1.area_manager_id = u.id
INNER JOIN 
    users am 
    ON amw1.area_manager_id = am.id
WHERE 
    amw1.area_manager_id = '${areaManagerId}'
ORDER BY 
    amw1.area_manager_id DESC;

    `;

        const queryResult = await db.query(selectQuery);
        return queryResult[0];
    } catch (error) {
        throw error;
    }
}

async function getRoLastBalance(ro_id) {
    const selectQuery = `SELECT 
    rw1.ro_id, 
    rw1.balance, 
    ro.regional_office_name, 
    po.id AS po_id,
    po.po_number,
    po.po_date,
    (SELECT SUM(amount_received) 
      FROM ro_wallet rw3 
      WHERE rw3.ro_id = rw1.ro_id 
      AND rw3.status = 'credit') AS total_received_credit,
    (SELECT SUM(amount_received) 
      FROM ro_wallet rw3 
      WHERE rw3.ro_id = rw1.ro_id 
      AND rw3.status != 'credit') AS total_received_non_credit,
    ((SELECT SUM(amount_received) 
      FROM ro_wallet rw3 
      WHERE rw3.ro_id = rw1.ro_id 
      AND rw3.status = 'credit') -
    (SELECT SUM(amount_received) 
      FROM ro_wallet rw3 
      WHERE rw3.ro_id = rw1.ro_id 
      AND rw3.status != 'credit')) AS remaining_balance
FROM 
    ro_wallet rw1
INNER JOIN 
    (SELECT ro_id, MAX(id) AS max_id 
      FROM ro_wallet 
      GROUP BY ro_id) rw2 
    ON rw1.ro_id = rw2.ro_id 
    AND rw1.id = rw2.max_id
INNER JOIN 
    users u 
    ON rw1.ro_id = u.id
INNER JOIN 
    regional_offices ro 
    ON rw1.ro_id = ro.id
INNER JOIN 
    purchase_orders po 
    ON rw1.po_id = po.id
WHERE 
    rw1.ro_id = '${ro_id}'
ORDER BY 
    rw1.ro_id;
`;

    const queryResult = await db.query(selectQuery);

    if (queryResult.length > 0) {
        return queryResult[0];
    } else {
        return 0;
    }
}

async function getPoLastBalance(po_id) {
    const selectQuery = `SELECT po1.po_id, po.po_date, po1.balance, po.po_number, (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status = 'credit') AS total_received_credit, (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status != 'credit') AS total_received_non_credit, ((SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status = 'credit') - (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status != 'credit')) AS remaining_balance FROM ro_wallet po1 INNER JOIN ( SELECT po_id, MAX(id) AS max_id FROM ro_wallet GROUP BY po_id ) po2 ON po1.po_id = po2.po_id AND po1.id = po2.max_id INNER JOIN purchase_orders po ON po1.po_id = po.id where po1.po_id = '${po_id}' ORDER BY po1.po_id DESC LIMIT 0, 8;
`;

    const queryResult = await db.query(selectQuery);

    if (queryResult.length > 0) {
        return queryResult[0];
    } else {
        return 0;
    }
}
// const transactionOfAreaManager

async function generatePaymentUniqueId() {
    const retentinoQuery = `SELECT unique_id FROM payment_paid WHERE unique_id IS NOT NULL AND unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(retentinoQuery);
    if (result.length) {
        const currentID = result[0].unique_id;
        const numberPart = parseInt(currentID.slice(3), 10);
        const nextNumber = numberPart + 1;
        return `PP${nextNumber.toString().padStart(3, "0")}`;
    }
    return "PP001";
}

async function generatePaymentUniqueIdForRo() {
    const retentinoQuery = `SELECT unique_id FROM ro_payment_paid WHERE unique_id IS NOT NULL AND unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(retentinoQuery);
    if (result.length) {
        const currentID = result[0].unique_id;
        const numberPart = parseInt(currentID.slice(3), 10);
        const nextNumber = numberPart + 1;
        return `RPP${nextNumber.toString().padStart(3, "0")}`;
    }
    return "RPP001";
}

const getPaymentPaid = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const ro = req.query.ro;
        const status = req.query.status;

        let whereCondition = "";
        if (ro) {
            whereCondition = ` AND ro_id = '${ro}'`;
        }

        const selectQuery = `SELECT * FROM payment_paid WHERE status = ${status} AND created_by = ${req.user.user_id} ${whereCondition} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found" });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        const result = [];
        for (const data of queryResult) {
            const [roDetail] = await getRegionalNameById(data.ro_id);
            const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [
                data.manager_id,
            ]);
            const paymentData = JSON.parse(data.payment_data);
            const complaintDetails = [];

            for (const payment of paymentData) {
                const complaint = await getComplaintUniqueId(payment.complaint_id);
                const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

                let salesAreaDetail = {};
                if (complaint.sale_area_id) {
                    [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                }

                let outletDetail = {};
                if (complaint.complaint_for == 1 && complaint.outlet_id) {
                    const outlet = await getOutletById(complaint.outlet_id);
                    outletDetail = outlet[0] || {};
                }

                const poDetails = [];
                if (measurementDetail && measurementDetail.po_id) {
                    const poDetail = await getPoDetailById(measurementDetail.po_id);
                    poDetails.push({
                        po_id: poDetail.id,
                        po_number: poDetail.po_number,
                        po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
                    });
                }

                const complaintDetail = {
                    complaint_id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    measurement_id: measurementDetail?.id || "",
                    measurement_amount: measurementDetail?.measurement_amount || "",
                    measurement_date: measurementDetail
                        ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD")
                        : null,
                    deduction: payment.deduction,
                    pay_amount: measurementDetail && (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
                    invoice_number: payment.billNumber,
                    invoice_date: payment.billDate,
                    pv_number: payment.pv_number,
                    pv_date: payment.pv_date,
                    po_details: poDetails,
                    sales_area_details: {
                        sales_area_id: salesAreaDetail.id,
                        sales_area_name: salesAreaDetail.sales_area_name,
                    },
                    outlet_details: {
                        outlet_id: outletDetail.id,
                        outlet_name: outletDetail.outlet_name,
                        outlet_unique_id: outletDetail.outlet_unique_id,
                    },
                };
                complaintDetails.push(complaintDetail);
            }

            result.push({
                unique_id: data?.unique_id,
                id: data?.id,
                ro_id: roDetail?.id,
                ro_name: roDetail?.regional_office_name,
                manager_id: areaManagerDetail?.id,
                manager_name: areaManagerDetail?.username,
                amount: data?.amount,
                payment_mode: data?.payment_mode,
                otp: data?.otp,
                paid_amount: data?.paid_amount,
                complaint_details: complaintDetails,
                created_at: moment(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
            });
        }

        res.status(StatusCodes.OK).json({ status: true, data: result, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

async function getMeasurementDetails(id) {
    const selectQuery = `SELECT * FROM measurements where complaint_id = ${id} AND status = '5' `;
    // return await db.query(selectQuery);
    const result = await db.query(selectQuery);
    if(result.length > 0) {
        return result;
    } else {
        return [];
    }
}

const getPaymentPaidById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const selectQuery = `SELECT * FROM payment_paid WHERE id = '${id}'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found" });
        }

        const result = [];
        for (const data of queryResult) {
            const [roDetail] = await getRegionalNameById(data.ro_id);
            const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [
                data.manager_id,
            ]);
            const paymentData = JSON.parse(data.payment_data);
            const complaintDetails = [];

            for (const payment of paymentData) {
                const complaint = await getComplaintUniqueId(payment.complaint_id);
                const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

                let salesAreaDetail = {};
                if (complaint.sale_area_id) {
                    [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                }

                let outletDetail = {};
                if (complaint.complaint_for == 1 && complaint.outlet_id) {
                    const outlet = await getOutletById(complaint.outlet_id);
                    outletDetail = outlet[0] || {};
                }

                const poDetails = [];
                if (measurementDetail && measurementDetail.po_id) {
                    const poDetail = await getPoDetailById(measurementDetail.po_id);
                    poDetails.push({
                        po_id: poDetail.id,
                        po_number: poDetail.po_number,
                        po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
                    });
                }

                const complaintDetail = {
                    complaint_id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    measurement_id: measurementDetail?.id,
                    measurement_amount: measurementDetail?.amount,
                    measurement_date: measurementDetail
                        ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD")
                        : null,
                    deduction: payment.deduction,
                    pay_amount: measurementDetail && (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
                    invoice_number: payment.billNumber,
                    invoice_date: payment.billDate,
                    pv_number: payment.pv_number,
                    pv_date: payment.pv_date,
                    po_details: poDetails,
                    sales_area_details: {
                        sales_area_id: salesAreaDetail.id,
                        sales_area_name: salesAreaDetail.sales_area_name,
                    },
                    outlet_details: {
                        outlet_id: outletDetail.id,
                        outlet_name: outletDetail.outlet_name,
                        outlet_unique_id: outletDetail.outlet_unique_id,
                    },
                };
                complaintDetails.push(complaintDetail);
            }

            result.push({
                unique_id: data?.unique_id,
                id: data?.id,
                ro_id: roDetail?.id,
                ro_name: roDetail?.regional_office_name,
                manager_id: areaManagerDetail?.id,
                manager_name: areaManagerDetail?.username,
                amount: data?.amount,
                payment_mode: data?.payment_mode,
                otp: data?.otp,
                paid_amount: data?.paid_amount,
                complaint_details: complaintDetails,
                created_at: moment(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
            });
        }

        res.status(StatusCodes.OK).json({ status: true, data: result });
    } catch (error) {
        return next(error);
    }
};

// const resendOtp = async (req,res,next) => {
//   try {
//     const { manager_id, ro_id, id } = req.body;

//     const user_id = req.user.user_id;

//     // Handle OTP generation
//     const generatedOtp = await generateRandomNumber(6);
//     await inseretIntoPaymentPaidOtp(ro_id, manager_id, generatedOtp);

//     // Get user type based on manager_id
//     const userType = await getRoleByUserId(manager_id);

//     // Prepare notification data
//     const notificationData = [
//       {
//         userId: manager_id,
//         roleId: userType,
//         title: "OTP for paid amount.",
//         message: `Payment OTP received successfully! Use OTP ${generatedOtp} for verification.`,
//       },
//     ];

//     await insertNotifications(notificationData);
//     const update = await db.query(`update payment_paid set otp = '${generatedOtp}' where id = ${id}`)
//     if(update.affectedRows > 0) {
//       const updateOtp = await db.query(`update payment_paid_otp set otp = '${generatedOtp}' where ro_id =${ro_id} AND user_id = ${manager_id} `)
//       return res.status(200).json({ status: true, message: 'OTP sent successfully.' });

//     }else{
//       return res.status(200).json({ status: false, message: 'Failed to send OTP.' });
//     }
//     // Send a success response

//   } catch (err) {
//     // Handle unexpected errors
//     return res.status(500).json({ status: false, message: 'An error occurred while processing the request.' });
//   }
// };

const resendOtp = async (req, res, next) => {
    try {
        const { manager_id, ro_id, id } = req.body;

        // Check if an OTP record already exists
        const selectQuery = `SELECT * FROM payment_paid_otp WHERE user_id = '${manager_id}' AND ro_id = '${ro_id}'`;
        const selectResult = await db.query(selectQuery);

        // Handle OTP generation
        const generatedOtp = await generateRandomNumber(6);

        // If record exists, update it, otherwise insert a new record
        if (selectResult.length > 0) {
            const updateOtpQuery = `UPDATE payment_paid_otp SET otp = '${generatedOtp}' WHERE ro_id = ${ro_id} AND user_id = ${manager_id}`;
            await db.query(updateOtpQuery);
        } else {
            await inseretIntoPaymentPaidOtp(ro_id, manager_id, generatedOtp);
        }

        // Get user type based on manager_id
        const userType = await getRoleByUserId(manager_id);

        // Prepare notification data
        const notificationData = [
            {
                userId: manager_id,
                roleId: userType,
                title: "OTP for paid amount.",
                message: `Payment OTP received successfully! Use OTP ${generatedOtp} for verification.`,
            },
        ];

        await insertNotifications(notificationData);

        // Update payment_paid table with the generated OTP
        const updatePaymentPaidQuery = `UPDATE payment_paid SET otp = '${generatedOtp}' WHERE id = ${id}`;
        const update = await db.query(updatePaymentPaidQuery);

        if (update.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "OTP sent successfully." });
        } else {
            return res.status(200).json({ status: false, message: "Failed to send OTP." });
        }
    } catch (err) {
        // Handle unexpected errors
        return res.status(500).json({ status: false, message: err.message });
    }
};

const addPaymentPaidforRo = async (req, res, next) => {
    try {
        const { po_id, ro_id, paid_payment, payment_data } = req.body;
        // Validate the incoming request
        const { error } = addRoPaymentPaidValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
        const user_id = req.user.user_id;
        // Handle OTP generation
        // const generatedOtp = await generateRandomNumber(6);
        // await inseretIntoPaymentPaidOtp(ro_id, manager_id, generatedOtp);

        // Get user type based on manager_id
        // const user_type = await getRoleByUserId(manager_id);
        const uniqueId = await generatePaymentUniqueIdForRo();
        // Prepare notification data
        // const notificationData = [
        //   {
        //     userId: manager_id,
        //     roleId: user_type,
        //     title: "OTP for paid amount.",
        //     message: `Payment OTP received successfully! Use OTP ${generatedOtp} for verification.`,
        //   },
        // ];
        // await insertNotifications(notificationData);

        // Convert payment_data to JSON string for insertion
        const paymentDataString = JSON.stringify(payment_data);

        // Insert payment data into the database
        const insertQuery =
            "INSERT INTO ro_payment_paid (po_id, ro_id, amount, payment_data, unique_id, created_by) VALUES (?, ?, ?, ?, ?, ?)";
        const result = await db.query(insertQuery, [po_id, ro_id, paid_payment, paymentDataString, uniqueId, user_id]);

        if (result.affectedRows > 0) {
            const statusUpdate = await updateComplaintPaymentStatusForRo(payment_data);
            return res.status(200).json({
                status: true,
                message: "Payment proceed successfully.",
            });
        }
        // Send success response
    } catch (error) {
        return next(error);
        // Handle errors
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const getRoPaymentPaid = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const ro = req.query.ro;
        const status = req.query.status;

        let whereCondition = "";
        if (ro) {
            whereCondition = ` AND ro_id = '${ro}'`;
        }

        const selectQuery = `SELECT * FROM ro_payment_paid WHERE status = ${status} AND created_by = ${req.user.user_id} ${whereCondition} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const result = [];
        for (const data of queryResult) {
            const [roDetail] = await getRegionalNameById(data.ro_id);
            const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [
                data.manager_id,
            ]);
            const poDetails = [];
            const poDetail = await getPoDetailById(data.po_id);
            poDetails.push({
                po_id: poDetail.id,
                po_number: poDetail.po_number,
                po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
            });

            const paymentData = JSON.parse(data.payment_data);
            const complaintDetails = [];

            for (const payment of paymentData) {
                const complaint = await getComplaintUniqueId(payment.complaint_id);
                const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

                let salesAreaDetail = {};
                if (complaint.sale_area_id) {
                    [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                }

                let outletDetail = {};
                if (complaint.complaint_for == 1 && complaint.outlet_id) {
                    const outlet = await getOutletById(complaint.outlet_id);
                    outletDetail = outlet[0] || {};
                }

                const complaintDetail = {
                    complaint_id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    measurement_id: measurementDetail?.id,
                    measurement_amount: measurementDetail?.measurement_amount,
                    measurement_date: measurementDetail
                        ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD")
                        : null,
                    deduction: payment.deduction,
                    pay_amount: measurementDetail && (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
                    invoice_number: payment.billNumber,
                    invoice_date: payment.billDate,
                    pv_number: payment.pv_number,
                    pv_date: payment.pv_date,
                    sales_area_details: {
                        sales_area_id: salesAreaDetail.id,
                        sales_area_name: salesAreaDetail.sales_area_name,
                    },
                    outlet_details: {
                        outlet_id: outletDetail.id,
                        outlet_name: outletDetail.outlet_name,
                        outlet_unique_id: outletDetail.outlet_unique_id,
                    },
                };
                complaintDetails.push(complaintDetail);
            }

            result.push({
                unique_id: data.unique_id,
                id: data.id,
                ro_id: roDetail.id,
                ro_name: roDetail.regional_office_name,
                po_details: poDetails[0],
                amount: data.amount,
                payment_mode: data.payment_mode,
                otp: data.otp ? data.otp : "",
                paid_amount: data.paid_amount,
                complaint_details: complaintDetails,
                created_at: moment(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
            });
        }

        res.status(StatusCodes.OK).json({ status: true, data: result, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

const getPaymentPaidRoById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const selectQuery = `SELECT * FROM ro_payment_paid WHERE id = '${id}'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found" });
        }

        const result = [];
        for (const data of queryResult) {
            const [roDetail] = await getRegionalNameById(data.ro_id);
            const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [
                data.manager_id,
            ]);
            const poDetails = [];
            const poDetail = await getPoDetailById(data.po_id);
            poDetails.push({
                po_id: poDetail.id,
                po_number: poDetail.po_number,
                po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
            });

            const paymentData = JSON.parse(data.payment_data);
            const complaintDetails = [];

            for (const payment of paymentData) {
                const complaint = await getComplaintUniqueId(payment.complaint_id);
                const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

                let salesAreaDetail = {};
                if (complaint.sale_area_id) {
                    [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                }

                let outletDetail = {};
                if (complaint.complaint_for == 1 && complaint.outlet_id) {
                    const outlet = await getOutletById(complaint.outlet_id);
                    outletDetail = outlet[0] || {};
                }

                const complaintDetail = {
                    complaint_id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    measurement_id: measurementDetail?.id,
                    measurement_amount: measurementDetail?.amount,
                    measurement_date: measurementDetail
                        ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD")
                        : null,
                    deduction: payment.deduction,
                    pay_amount: measurementDetail && (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
                    invoice_number: payment.billNumber,
                    invoice_date: payment.billDate,
                    pv_number: payment.pv_number,
                    pv_date: payment.pv_date,
                    sales_area_details: {
                        sales_area_id: salesAreaDetail.id,
                        sales_area_name: salesAreaDetail.sales_area_name,
                    },
                    outlet_details: {
                        outlet_id: outletDetail.id,
                        outlet_name: outletDetail.outlet_name,
                        outlet_unique_id: outletDetail.outlet_unique_id,
                    },
                };
                complaintDetails.push(complaintDetail);
            }

            result.push({
                unique_id: data.unique_id,
                id: data.id,
                ro_id: roDetail.id,
                ro_name: roDetail.regional_office_name,
                amount: data.amount,
                payment_mode: data.payment_mode,
                otp: data.otp ? data.otp : "",
                paid_amount: data.paid_amount,
                po_details: poDetails[0],
                complaint_details: complaintDetails,
                created_at: moment(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
            });
        }

        res.status(StatusCodes.OK).json({ status: true, data: result });
    } catch (error) {
        return next(error);
    }
};

const updatePaymentRoPaid = async function (req, res, next) {
    try {
        const { id, ro_id, po_id, amount_received, payment_mode, transaction_id, remark } = req.body;

        const select = await db.query(`SELECT * FROM ro_wallet WHERE ro_id = ? ORDER BY id DESC LIMIT 1`, [ro_id]);
        let newBalance = parseFloat(amount_received);

        if (select.length > 0) {
            const currentBalance = parseFloat(select[0].balance);
            newBalance = currentBalance - newBalance;
        }

        const insert = `INSERT INTO ro_wallet (ro_id, po_id, amount_received, balance, status, transaction_id, remark) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const query = await db.query(insert, [
            ro_id,
            po_id,
            amount_received.toFixed(2),
            newBalance.toFixed(2),
            payment_mode,
            transaction_id,
            remark,
        ]);

        if (query.affectedRows > 0) {
            // Update payment status in the database
            const updateQuery = "UPDATE ro_payment_paid SET status = ?, payment_mode = ?, paid_amount = ? WHERE id = ?";

            await db.query(updateQuery, ["2", payment_mode, amount_received, id]);

            return res.status(StatusCodes.OK).json({ status: true, message: "Payment proceed successfully." });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Failed to insert into ro_wallet." });
        }
    } catch (error) {
        return next(error);
    }
};

const roTransactions = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectQuery = `SELECT rw1.ro_id, rw1.balance, ro.regional_office_name, (SELECT SUM(amount_received) FROM ro_wallet rw3 WHERE rw3.ro_id = rw1.ro_id AND rw3.status = 'credit') AS total_received_credit, (SELECT SUM(amount_received) FROM ro_wallet rw3 WHERE rw3.ro_id = rw1.ro_id AND rw3.status != 'credit') AS total_received_non_credit, ((SELECT SUM(amount_received) FROM ro_wallet rw3 WHERE rw3.ro_id = rw1.ro_id AND rw3.status = 'credit') - (SELECT SUM(amount_received) FROM ro_wallet rw3 WHERE rw3.ro_id = rw1.ro_id AND rw3.status != 'credit')) AS remaining_balance FROM ro_wallet rw1 INNER JOIN (SELECT ro_id, MAX(id) AS max_id FROM ro_wallet GROUP BY ro_id) rw2 ON rw1.ro_id = rw2.ro_id AND rw1.id = rw2.max_id INNER JOIN users u ON rw1.ro_id = u.id INNER JOIN regional_offices ro ON rw1.ro_id = ro.id ORDER BY rw1.ro_id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));

        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({ status: true, data: queryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.OK).json({ status: false, message: error.message });
    }
};

const getRoTransactionsById = async (req, res, next) => {
    try {
        const ro_id = req.query.id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let search_value = "";

        if (!ro_id) {
            return res.status(StatusCodes.OK).json({ status: false, message: "ro_id is required" });
        }

        if (searchData) {
            search_value += ` AND ( otp LIKE '%${searchData}%' OR received_amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT rw.*, DATE_FORMAT(rw.created_at, '%Y-%m-%d') AS date, po.id AS po_id, po.po_number, DATE_FORMAT(po.po_date, '%Y-%m-%d') AS po_date FROM ro_wallet rw INNER JOIN purchase_orders po ON rw.po_id = po.id WHERE rw.ro_id = ${ro_id} ${search_value} ORDER BY rw.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            const getBalance = await getRoLastBalance(ro_id);

            return res.status(StatusCodes.OK).json({
                status: true,
                data: queryResult,
                getBalance: getBalance,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// const getRoPaymentPaidByPoDetails = async (req,res,next) => {
//   try {
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const currentPage = parseInt(req.query.pageNo) || 1;
//     const searchData = req.query.search || "";
//     const pageFirstResult = (currentPage - 1) * pageSize;
//     const ro = req.query.ro;
//     const status = req.query.status;

//     let whereCondition = ""
//     if (ro) {
//       whereCondition = ` AND ro_id = '${ro}'`
//     }

//     const selectQuery = `SELECT * FROM ro_payment_paid WHERE status = ${status} ${whereCondition} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

//     const queryResult = await db.query(selectQuery);

//     if (queryResult.length == 0) {
//       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//     }

//     const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//     const totalResult = await db.query(modifiedQueryString);
//     const pageDetails = await calculatePagination(
//       totalResult.length,
//       currentPage,
//       pageSize
//     );
//     if (queryResult.length == 0) {
//       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//     }

//     const result = []
//     for (const data of queryResult) {
//       const [roDetail] = await getRegionalNameById(data.ro_id);
//       const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [data.manager_id]);
//       const poDetails = [];
//       const poDetail = await getPoDetailById(data.po_id);
//       poDetails.push({
//         po_id: poDetail.id,
//         po_number: poDetail.po_number,
//         po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
//       });

//       const paymentData = JSON.parse(data.payment_data);
//       const complaintDetails = [];

//       for (const payment of paymentData) {
//         const complaint = await getComplaintUniqueId(payment.complaint_id);
//         const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

//         let salesAreaDetail = {};
//         if (complaint.sale_area_id) {
//           [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
//         }

//         let outletDetail = {};
//         if (complaint.complaint_for == 1 && complaint.outlet_id) {
//           const outlet = await getOutletById(complaint.outlet_id);
//           outletDetail = outlet[0] || {};
//         }

//         const complaintDetail = {
//           complaint_id: complaint.id,
//           complaint_unique_id: complaint.complaint_unique_id,
//           measurement_id: measurementDetail?.id,
//           measurement_amount: measurementDetail?.measurement_amount,
//           measurement_date: measurementDetail ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD") : null,
//           deduction: payment.deduction,
//           pay_amount: (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
//           invoice_number: payment.billNumber,
//           invoice_date: payment.billDate,
//           pv_number: payment.pv_number,
//           pv_date: payment.pv_date,
//           sales_area_details: {
//             sales_area_id: salesAreaDetail.id,
//             sales_area_name: salesAreaDetail.sales_area_name
//           },
//           outlet_details: {
//             outlet_id: outletDetail.id,
//             outlet_name: outletDetail.outlet_name,
//             outlet_unique_id: outletDetail.outlet_unique_id
//           },
//         };
//         complaintDetails.push(complaintDetail);
//       }

//       result.push({
//         unique_id: data.unique_id,
//         id: data.id,
//         ro_id: roDetail.id,
//         ro_name: roDetail.regional_office_name,
//         po_details: poDetails[0],
//         amount: data.amount,
//         payment_mode: data.payment_mode,
//         otp: data.otp ? data.otp : "",
//         paid_amount: data.paid_amount,
//         complaint_details: complaintDetails,
//         created_at: moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')
//       });
//     }

//     res.status(StatusCodes.OK).json({ status: true, data: result, pageDetails: pageDetails });

//   } catch (error) {next(error)
//     console.error(error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ status: false, message: error.message });
//   }
//   }

const getRoPaymentPaidByPoDetails = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const ro = req.query.ro;
        const status = req.query.status || 2;

        let whereCondition = "";
        if (ro) {
            whereCondition = ` AND ro_id = '${ro}'`;
        }

        let selectQuery = `
      SELECT 
        ro_payment_paid.po_id,
        purchase_orders.po_number,
        purchase_orders.po_date,
        SUM(ro_payment_paid.paid_amount) AS total_paid_amount 
      FROM 
        ro_payment_paid  
        LEFT JOIN purchase_orders ON purchase_orders.id = ro_payment_paid.po_id
      WHERE 
        ro_payment_paid.status = ${status} ${whereCondition} 
      GROUP BY 
        ro_payment_paid.po_id, purchase_orders.po_number, purchase_orders.po_date 
      ORDER BY 
        total_paid_amount DESC
    `;

        if (pageSize) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await db.query(selectQuery);

        if (queryResult.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        const finalData = queryResult.map((row) => ({
            po_id: row.po_id,
            po_number: row.po_number,
            po_date: moment(row.po_date).format("YYYY-MM-DD"),
            total_paid_amount: row.total_paid_amount,
        }));

        res.status(StatusCodes.OK).json({
            status: true,
            data: finalData,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

// const getPaymentPaidRoDetailsById = async (req,res,next) => {
//   try {
//     const id = req.params.id;

//     // Fetch all payments related to the given ro_id
//     const selectQuery = `SELECT * FROM ro_payment_paid WHERE po_id = '${id}'`;
//     const queryResult = await db.query(selectQuery);

//     if (queryResult.length == 0) {
//       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//     }

//     const poMap = {};

//     for (const data of queryResult) {
//       const [roDetail] = await getRegionalNameById(data.ro_id);
//       const [areaManagerDetail] = await db.query(`SELECT id, username FROM users WHERE id = ?`, [data.manager_id]);

//       const po_id = data.po_id;

//       if (!poMap[po_id]) {
//         // If po_id is encountered for the first time, initialize its structure
//         const poDetail = await getPoDetailById(po_id);
//         poMap[po_id] = {
//           po_id: poDetail.id,
//           po_number: poDetail.po_number,
//           po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
//           paid_amount: 0,  // Initialize total paid amount for this po_id
//           complaints: [],  // Initialize complaints array for this po_id
//         };
//       }

//       const paymentData = JSON.parse(data.payment_data);
//       for (const payment of paymentData) {
//         const complaint = await getComplaintUniqueId(payment.complaint_id);
//         const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

//         let salesAreaDetail = {};
//         if (complaint.sale_area_id) {
//           [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
//         }

//         let outletDetail = {};
//         if (complaint.complaint_for == 1 && complaint.outlet_id) {
//           const outlet = await getOutletById(complaint.outlet_id);
//           outletDetail = outlet[0] || {};
//         }

//         const complaintDetail = {
//           complaint_id: complaint.id,
//           complaint_unique_id: complaint.complaint_unique_id,
//           measurement_id: measurementDetail?.id,
//           measurement_amount: measurementDetail?.amount,
//           measurement_date: measurementDetail ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD") : null,
//           deduction: payment.deduction,
//           pay_amount: (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
//           invoice_number: payment.billNumber,
//           invoice_date: payment.billDate,
//           pv_number: payment.pv_number,
//           pv_date: payment.pv_date,
//           sales_area_details: {
//             sales_area_id: salesAreaDetail.id,
//             sales_area_name: salesAreaDetail.sales_area_name
//           },
//           outlet_details: {
//             outlet_id: outletDetail.id,
//             outlet_name: outletDetail.outlet_name,
//             outlet_unique_id: outletDetail.outlet_unique_id
//           },
//         };

//         poMap[po_id].complaints.push(complaintDetail);
//         poMap[po_id].paid_amount += parseFloat(data.paid_amount);  // Accumulate the paid amount for this po_id
//       }
//     }

//     // Transform the poMap into an array for the final result
//     const result = Object.values(poMap).map(po => ({
//       po_id: po.po_id,
//       po_number: po.po_number,
//       po_date: po.po_date,
//       total_paid_amount: po.paid_amount.toFixed(2),
//       complaints: po.complaints,
//     }));

//     res.status(StatusCodes.OK).json({ status: true, data: result });

//   } catch (error) {next(error)
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//   }
// };

// const getPaymentPaidRoDetailsById = async (req,res,next) => {
//   try {
//     const id = req.params.id;

//     // Fetch all payments related to the given ro_id
//     const selectQuery = `SELECT * FROM ro_payment_paid WHERE po_id = '${id}'`;
//     const queryResult = await db.query(selectQuery);

//     if (queryResult.length == 0) {
//       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//     }

//     const poMap = {};

//     for (const data of queryResult) {
//       const po_id = data.po_id;

//       if (!poMap[po_id]) {
//         // If po_id is encountered for the first time, initialize its structure
//         const poDetail = await getPoDetailById(po_id);
//         poMap[po_id] = {
//           po_id: poDetail.id,
//           po_number: poDetail.po_number,
//           po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
//           total_paid_amount: 0, // Initialize total paid amount for this po_id
//           complaints: [], // Initialize complaints array for this po_id
//         };
//       }

//       // Accumulate the paid amount for this po_id
//       poMap[po_id].total_paid_amount += parseFloat(data.paid_amount);

//       // Parse payment_data for each complaint
//       const paymentData = JSON.parse(data.payment_data);
//       for (const payment of paymentData) {
//         const complaint = await getComplaintUniqueId(payment.complaint_id);
//         const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);

//         let salesAreaDetail = {};
//         if (complaint.sale_area_id) {
//           [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
//         }

//         let outletDetail = {};
//         if (complaint.complaint_for == 1 && complaint.outlet_id) {
//           const outlet = await getOutletById(complaint.outlet_id);
//           outletDetail = outlet[0] || {};
//         }

//         const complaintDetail = {
//           complaint_id: complaint.id,
//           complaint_unique_id: complaint.complaint_unique_id,
//           measurement_id: measurementDetail?.id,
//           measurement_amount: measurementDetail?.amount,
//           measurement_date: measurementDetail ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD") : null,
//           deduction: payment.deduction,
//           pay_amount: (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
//           invoice_number: payment.billNumber,
//           invoice_date: payment.billDate,
//           pv_number: payment.pv_number,
//           pv_date: payment.pv_date,
//           sales_area_details: {
//             sales_area_id: salesAreaDetail.id,
//             sales_area_name: salesAreaDetail.sales_area_name,
//           },
//           outlet_details: {
//             outlet_id: outletDetail.id,
//             outlet_name: outletDetail.outlet_name,
//             outlet_unique_id: outletDetail.outlet_unique_id,
//           },
//         };

//         poMap[po_id].complaints.push(complaintDetail);
//       }
//     }

//     // Transform the poMap into an array for the final result
//     const result = Object.values(poMap).map(po => ({
//       po_id: po.po_id,
//       po_number: po.po_number,
//       po_date: po.po_date,
//       total_paid_amount: po.total_paid_amount.toFixed(2),
//       complaints: po.complaints,
//     }));

//     res.status(StatusCodes.OK).json({ status: true, data: result });

//   } catch (error) {next(error)
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//   }
// };

const getPaymentPaidRoDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Fetch all payments related to the given po_id
        const selectQuery = `SELECT * FROM ro_payment_paid WHERE po_id = '${id}'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        const poMap = {};

        for (const data of queryResult) {
            const po_id = data.po_id;
            const ro_id = data.ro_id; // Extract ro_id from the data

            if (!poMap[po_id]) {
                // If po_id is encountered for the first time, initialize its structure
                const poDetail = await getPoDetailById(po_id);
                poMap[po_id] = {
                    po_id: poDetail.id,
                    po_number: poDetail.po_number,
                    po_date: moment(poDetail.po_date).format("YYYY-MM-DD"),
                    ro_id: ro_id, // Store ro_id here
                    total_paid_amount: 0, // Initialize total paid amount for this po_id
                    complaints: [], // Initialize complaints array for this po_id
                };
            }

            // Accumulate the paid amount for this po_id
            poMap[po_id].total_paid_amount += parseFloat(data.paid_amount);

            // Parse payment_data for each complaint
            const paymentData = JSON.parse(data.payment_data);
            for (const payment of paymentData) {
                const complaint = await getComplaintUniqueId(payment.complaint_id);
                const [measurementDetail] = await getMeasurementDetails(payment.complaint_id);
                const [roDetail] = await getRegionalNameById(ro_id); // Fetch ro_details using ro_id from poMap

                let salesAreaDetail = {};
                if (complaint.sale_area_id) {
                    [salesAreaDetail] = await getSalesAreaById(complaint.sale_area_id);
                }

                let outletDetail = {};
                if (complaint.complaint_for == 1 && complaint.outlet_id) {
                    const outlet = await getOutletById(complaint.outlet_id);
                    outletDetail = outlet[0] || {};
                }

                const complaintDetail = {
                    complaint_id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    measurement_id: measurementDetail?.id,
                    measurement_amount: measurementDetail?.amount,
                    measurement_date: measurementDetail
                        ? moment(measurementDetail.measurement_date).format("YYYY-MM-DD")
                        : null,
                    deduction: payment.deduction,
                    pay_amount: (measurementDetail.amount - parseFloat(payment.deduction)).toFixed(2),
                    invoice_number: payment.billNumber,
                    invoice_date: payment.billDate,
                    pv_number: payment.pv_number,
                    pv_date: payment.pv_date,
                    ro_details: {
                        ro_id: roDetail.id,
                        ro_name: roDetail.regional_office_name,
                    },
                    sales_area_details: {
                        sales_area_id: salesAreaDetail.id,
                        sales_area_name: salesAreaDetail.sales_area_name,
                    },
                    outlet_details: {
                        outlet_id: outletDetail.id,
                        outlet_name: outletDetail.outlet_name,
                        outlet_unique_id: outletDetail.outlet_unique_id,
                    },
                };

                poMap[po_id].complaints.push(complaintDetail);
            }
        }

        // Transform the poMap into an array for the final result
        const result = Object.values(poMap).map((po) => ({
            po_id: po.po_id,
            po_number: po.po_number,
            po_date: po.po_date,
            ro_id: po.ro_id, // Include ro_id in the final result
            total_paid_amount: po.total_paid_amount.toFixed(2),
            complaints: po.complaints,
        }));

        res.status(StatusCodes.OK).json({ status: true, data: result });
    } catch (error) {
        return next(error);
    }
};

const poTransactions = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectQuery = `SELECT po1.po_id, po.po_date, po1.balance, po.po_number, (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status = 'credit') AS total_received_credit, (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status != 'credit') AS total_received_non_credit, ((SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status = 'credit') - (SELECT SUM(amount_received) FROM ro_wallet po2 WHERE po2.po_id = po1.po_id AND po2.status != 'credit')) AS remaining_balance FROM ro_wallet po1 INNER JOIN ( SELECT po_id, MAX(id) AS max_id FROM ro_wallet GROUP BY po_id ) po2 ON po1.po_id = po2.po_id AND po1.id = po2.max_id INNER JOIN purchase_orders po ON po1.po_id = po.id ORDER BY po1.po_id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));

        const totalResult = await db.query(modifiedQueryString);
        const finalData = queryResult.map((row) => ({
            po_id: row.po_id,
            po_number: row.po_number,
            po_date: row.po_date ? moment(row.po_date).format("YYYY-MM-DD") : null, // Format date if available
            balance: parseFloat(row.balance).toFixed(2),
            total_received_credit: parseFloat(row.total_received_credit).toFixed(2),
            total_received_non_credit: parseFloat(row.total_received_non_credit).toFixed(2),
            remaining_balance: parseFloat(row.remaining_balance).toFixed(2),
        }));

        if (queryResult.length > 0) {
            const pageDetails = await calculatePagination(totalResult[0].total, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({ status: true, data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
        return res.status(StatusCodes.OK).json({ status: false, message: error.message });
    }
};

const getPoTransactionsById = async (req, res, next) => {
    try {
        const ro_id = req.query.id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let search_value = "";

        if (!ro_id) {
            return res.status(StatusCodes.OK).json({ status: false, message: "ro_id is required" });
        }

        if (searchData) {
            search_value += ` AND ( otp LIKE '%${searchData}%' OR received_amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT rw.*, DATE_FORMAT(rw.created_at, '%Y-%m-%d') AS date, po.id AS po_id, po.po_number, DATE_FORMAT(po.po_date, '%Y-%m-%d') AS po_date FROM ro_wallet rw INNER JOIN purchase_orders po ON rw.po_id = po.id WHERE rw.po_id = ${ro_id} ${search_value} ORDER BY rw.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            const getBalance = await getPoLastBalance(ro_id);

            return res.status(StatusCodes.OK).json({
                status: true,
                data: queryResult,
                getBalance: getBalance,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const importPromotion = async (req, res, next) => {
    try {
        let filePath = "";
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel File is required",
            });
        }
        filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        let errorMessage = [];

        for (let i = 0; i < rows.length; i++) {
            const item = rows[i];
            item.site_expense = 0;
            item.site_stock = 0;
            item.man_power = 0;

            const { error } = addPaymentSettingValidation.validate(item);
            if (error) {
                const errMsg = error.message.replace(/"(.*?)"/g, "$1");
                errorMessage.push(`${errMsg} in the ${i + 1} record`);
            }

            const roExists = await getRecord("regional_offices", "id", item.ro_id);
            if (roExists.length == 0) {
                errorMessage.push(`${item.ro_id} is not valid ro_id in the ${i + 1} record`);
            }
        }

        if (errorMessage.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Failed to import data.", errorMessage });
        }

        for (let item of rows) {
            item.created_by = req.user.user_id;
            const insertQuery = "INSERT INTO payment_setting SET ?";
            await db.query(insertQuery, item);
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Data imported successfully!" });
    } catch (error) {
        return next(error);
    }
};

const importAreaManagerRatio = async (req, res, next) => {
    try {
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel File is required",
            });
        }

        const recordChecks = [{ table: "users", key: "id", extraConditions: { user_type: 9 } }];
        const addFields = (item) => ({
            company_ratio: 100 - (Number(item.manager_ratio) || 0),
        });

        let { status, data, errorMessage } = await uploadAndValidateData(
            req.files.excel,
            createAreaManagerValidation,
            addFields
        );
        // const recordCheckErrors = await performRecordChecks(data, recordChecks);

        // let errMesgs = [...validationErrors, ...recordCheckErrors];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            const roExists = await getRecord("users", "id", item.manager_id, process.env.MANAGER_ROLE_ID);
            if (roExists.length == 0) {
                errorMessage.push(`${item.manager_id} is not valid manager id in the ${i + 1} record`);
            }
        }
        if (errorMessage.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Failed to import data.", errorMessage });
        }

        // for(let i=0; i<rows.length; i++){
        //   const item = rows[i];
        //   item.company_ratio = 100 - (Number(item.manager_ratio) || 0)
        //   const {error} = createAreaManagerValidation.validate(item)
        //   if(error){
        //     const errMsg = error.message.replace(/"(.*?)"/g, '$1');
        //     errorMessage.push(`${errMsg} in the ${i+1} record`);
        //   }

        for (let item of data) {
            item.created_by = req.user.user_id;
            const insertQuery = "INSERT INTO manager_promotional SET ?";
            await db.query(insertQuery, item);
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Data imported successfully!" });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addPaymentSetting,
    getAllPaymentSettings,
    getPaymentSettingDetailsById,
    updatePaymentSetting,
    deletePaymentSetting,
    getExpensePunchAndStockTotalAmount,
    addPaymentPaid,
    getAreaManagerTransactions,
    getAreaManagerTransactionsById,
    createAreaManagerRatio,
    getAllAreaManager,
    getAreaManagerById,
    updateAreaManager,
    otpVerifyInPaymentPaid,
    getPaymentPaid,
    getPaymentPaidById,
    resendOtp,
    insertIntoAreaManagerWallet,
    getMeasurementDetails,
    addPaymentPaidforRo,
    getPaymentPaidRoById,
    getRoPaymentPaid,
    updatePaymentRoPaid,
    roTransactions,
    getRoTransactionsById,
    getRoPaymentPaidByPoDetails,
    getPaymentPaidRoDetailsById,
    poTransactions,
    getPoTransactionsById,
    importPromotion,
    importAreaManagerRatio,
};

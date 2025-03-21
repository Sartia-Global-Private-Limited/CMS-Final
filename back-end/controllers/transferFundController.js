var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, transferFund, reschduleDate, transferFundForFundReq } = require("../helpers/validation");
const {
    calculatePagination,
    getUserDetails,
    getCreatedByDetails,
    getLastBalanceOfAccount,
    getRecord,
    getRecordWithWhereAndJoin,
} = require("../helpers/general");
const cron = require("node-cron");
const { last } = require("lodash");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const { saveTransactionDetails } = require("../helpers/commonHelper");

const transferFundAmount = async (req, res, next) => {
    try {
        const { transfer_data, id, remark, transaction_id, account_id, payment_mode } = req.body;

        const { error } = transferFundForFundReq.validate(req.body);
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

        const transferData = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);

        const getRequestById = transferData[0].request_by;

        const totalApproveAmount = transferData[0].total_approved_amount;

        let finalItem = [];
        let total_transfer_amount;
        const total_body_transfer_amount = transfer_data[0].total_transfer_amount;

        finalItem = {
            transfer_fund: transfer_data[0].transfer_fund,
            new_transfer_fund: transfer_data[0].new_transfer_fund,
        };
        total_transfer_amount = total_body_transfer_amount;

        const final_transfer_data = JSON.stringify(finalItem);
        // Calculate total sum for transfer_fund
        let totalSumTransferFund = 0;

        if (transfer_data[0].transfer_fund) {
            transfer_data[0].transfer_fund.forEach((item) => {
                if (Number(item.transfer_quantity) < 0) throw new Error("Transfer quantity should be greater then 0.");
                totalSumTransferFund += (item.transfer_quantity || 0) * item.price;
                // If item.transfer_quantity is undefined or null, use 0 as its value
            });
        }

        // Calculate total sum for new_transfer_fund
        let totalSumNewTransferFund = 0;

        if (transfer_data[0].new_transfer_fund) {
            transfer_data[0].new_transfer_fund.forEach((item) => {
                if (Number(item.transfer_quantity) < 0) throw new Error("Transfer quantity should be greater then 0.");

                totalSumNewTransferFund += Number(item.transfer_quantity || 0) * item.rate;
            });
        }

        // Calculate total sum
        const totalSum = totalSumTransferFund + totalSumNewTransferFund;
        total_transfer_amount = totalSum.toFixed(3);

        const checkLimit = await getTotalTransferAmounts(getRequestById, total_transfer_amount);
        if (checkLimit === false) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Your credit limit amount exceeds." });
        }

        if (total_transfer_amount == 0) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Transfer amount should be greater then 0.",
            });
        }
        const getAmount = transferData[0].total_transfer_amount;

        const checkTotalTransferAmount = Number(total_transfer_amount) + getAmount;
        let paymentStatus;

        if (payment_mode === "Cash" && totalApproveAmount >= checkTotalTransferAmount) {
            var remainingAmountForCash = totalApproveAmount - checkTotalTransferAmount;
            if (remainingAmountForCash > 0) {
                paymentStatus = "4";
                const updateReschedule = await rescheduleTransferFund(id);
            } else {
                paymentStatus = "5";
            }
        }
        // return

        if (payment_mode !== "Cash") {
            var insertTransaction = await transactionDetails(
                transfer_by,
                remark,
                transaction_id,
                total_transfer_amount,
                account_id,
                totalApproveAmount,
                id,
                payment_mode
            );
        }

        if (payment_mode === "Cash") {
            const addTransferInFund = addItemToFundRequest(transfer_data, id);

            const statusChangedQuery = `UPDATE new_fund_requests SET total_transfer_amount = ?, transfer_data = ?, transfer_by = ?, transfer_at = ?, status = ? WHERE id = ?`;

            const queryResult = await db.query(statusChangedQuery, [
                checkTotalTransferAmount,
                final_transfer_data,
                transfer_by,
                transfer_at,
                paymentStatus,
                id,
            ]);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Transfer Fund successfully" });
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Status not changed" });
            }
        } else if (insertTransaction.status === "success") {
            const addTransferInFund = await addItemToFundRequest(transfer_data, id, req);
            const addAmountInWallet = await addAmountToRequestedUserWallet(id, transfer_by, total_transfer_amount);
            // const walletTransactions = await transactionAdd(id, transfer_by, total_transfer_amount);

            const statusChangedQuery = `UPDATE new_fund_requests SET total_transfer_amount = ?, transfer_data = ?, transfer_by = ?, transfer_at = ?, status = ? WHERE id = ?`;

            const queryResult = await db.query(statusChangedQuery, [
                insertTransaction.getTotalAmount,
                final_transfer_data,
                transfer_by,
                transfer_at,
                `${insertTransaction.getStatus}`,
                id,
            ]);

            if (queryResult.affectedRows > 0) {
                // get previous balance of user and add balance and transactions to log data
                let previousUserBalance = 0;
                const getPreviousTransaction = await db.query(`SELECT balance FROM user_wallets WHERE user_id = ${getRequestById}`);
                if(getPreviousTransaction.length > 0){
                    previousUserBalance = getPreviousTransaction[0]?.balance || 0
                }
                
                const transactionAddResult = await saveTransactionDetails({
                    user_id: getRequestById,
                    transaction_type: "credit",
                    transaction_date: moment().format("YYYY-MM-DD"),
                    amount: total_transfer_amount,
                    balance: previousUserBalance,
                    description: `Transfer fund of amount ${Number(total_transfer_amount)} to ${getRequestById}`,
                    created_by: transfer_by,
                    complaints_id: id,
                })
                 // add transaction id as user_transaction_id to link the company account and user
                const query = `SELECT id FROM account_transactions ORDER BY id DESC LIMIT 1`;
                const latestTransaction = await db.query(query);
                if (latestTransaction.length > 0) {
                    // update transaction id into account_transactions
                    const result = await db.query(
                        `UPDATE account_transactions SET user_transaction_id = '${transactionAddResult.data}' WHERE id = '${latestTransaction[0].id}'`
                    );
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "Transfer Fund successfully" });
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Status not changed" });
            }
        } else if (insertTransaction === "Insufficient balance") {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Insufficient balance" });
        } else if (insertTransaction === "Amount is too large") {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Transfer amount should not be greater than approved amount.",
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong." });
        }
    } catch (error) {
        return next(error);
    }
};

const getTransferFund = async (req, res, next) => {
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

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status IN ('4','5') AND total_transfer_amount IS NOT NULL AND total_transfer_amount <> 0 AND created_by = '${req.user.user_id}' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

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

                if (row.status === "4") {
                    status = "Partial";
                } else if (row.status === "5") {
                    status = "Done";
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : "",
                    request_by: created_by_details.name ? created_by_details.name : "",
                    request_by_image: created_by_details.image ? created_by_details.image : "",
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : "",
                    request_date: moment(row.request_date).format("DD-MM-YYYY HH:mm:ss A"),
                    transfer_date: moment(row.transfer_at).format("DD-MM-YYYY HH:mm:ss A"),
                    area_manager_id: row.area_manager_id,
                    supervisor_id: row.supervisor_id,
                    end_users_id: row.end_users_id,
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    total_transfer_amount: row.total_transfer_amount,
                    status: status,
                    request_data: request_data,
                    active: i === 0 && currentPage === 1,
                    fund_request_for: row.fund_request_for,
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

const getALLTransferFund = async (req, res, next) => {
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
            search_value += ` AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        let selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE total_approved_amount IS NOT NULL AND total_approved_amount <> 0 AND status IN ('1', '4', '5') AND created_by = '${req.user.user_id}'  ${search_value} ORDER BY new_fund_requests.id`;

        if (pageSize) {
            selectQuery += ` ASC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

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
                let status;

                if (row.status === "1") {
                    status = "Approved";
                } else if (row.status === "4") {
                    status = "Partial";
                } else if (row.status === "5") {
                    status = "Done";
                }

                if (row.reschedule_transfer === "0") {
                    status = "Rescheduled";
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: request_by_details.id ? request_by_details.id : "",
                    request_by: request_by_details.name ? request_by_details.name : "",
                    request_by_image: request_by_details.image ? request_by_details.image : "",
                    request_by_employee_id: request_by_details.employee_id ? request_by_details.employee_id : "",
                    request_date: moment(row.request_date).format("DD-MM-YYYY HH:mm:ss A"),
                    total_request_amount: row.total_request_amount,
                    total_approved_amount: row.total_approved_amount,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    total_transfer_amount: row.total_transfer_amount || 0,
                    status: status,
                    request_data: JSON.parse(row.request_data),
                    approved_by: approved_by_details.name ? approved_by_details.name : "",
                    approved_by_image: approved_by_details.image ? approved_by_details.image : "",
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : "",
                    approved_date: moment(row.approved_at).format("DD-MM-YYYY HH:mm:ss A"),
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                });
            }

            if (!pageSize) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "fund_transfer", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "fund_transfer", "Transfer Fund", columns);
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
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const rescheduledTransferFund = async (req, res, next) => {
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

        const selectQuery = `UPDATE new_fund_requests SET reschedule_transfer = 0, reschedule_date='${rescheduled_date}' WHERE id = '${id}'`;
        const execQuery = await db.query(selectQuery);

        if (execQuery.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Transfer Fund rescheduled." });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Transfer Fund not rescheduled." });
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
    payment_mode,
    date
) {
    try {
        // Get the latest transaction details
        const queryResult = await db.query(
            `SELECT * FROM account_transactions WHERE account_id=? ORDER BY id DESC LIMIT 1`,
            [account_id]
        );
        // Check if there are any previous transactions, if there is no transaction then update last balance to 0
        const balance = queryResult[0]?.updated_balance || 0;
        // Validate if the balance is sufficient for the transaction
        if (balance < total_transfer_amount) {
            return "Insufficient balance";
        }

        const getStatus = await getTotalTransferValue(total_transfer_amount, id);
        if (totalApproveAmount < getStatus.getTotalAmount) {
            return "Amount is too large";
        }

        // Calculate the final balance after deducting the transfer amount
        const finalBalance = balance - total_transfer_amount;

        // Insert the new transaction record
        const createTransactions = await db.query(
            `INSERT INTO account_transactions SET user_id=?, account_id=?, status='debit', transaction=?, updated_balance=?, transaction_id=?, description=?, payment_mode = ?, category_type = 'fund' `,
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
        };
    } catch (error) {
        throw error;
    }
}

async function transactionAdd(id, transfer_by, total_transfer_amount) {
    const selectQuery = await db.query(`SELECT request_by FROM new_fund_requests WHERE id='${id}'`);

    if (selectQuery.length > 0) {
        const userId = selectQuery[0].request_by;
        const transaction_date = moment().format("YYYY-MM-DD");
        const select = await db.query(`SELECT balance FROM user_wallets WHERE user_id = '${userId}'`);
        let insert;

        if (select.length > 0) {
            // const lastBalance = Number(select[0].balance) + Number(total_transfer_amount);
            const finalBalance = Number(select[0].balance);

            const insertQuery = `INSERT INTO transactions (user_id, transaction_type, transaction_date, created_by, amount, balance, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            insert = await db.query(insertQuery, [
                userId,
                "credit",
                transaction_date,
                transfer_by,
                total_transfer_amount,
                finalBalance,
                `Add fund of amount ${total_transfer_amount} for fund transactions.`,
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
                `Add fund of amount ${total_transfer_amount} for fund transactions.`,
            ]);
        }
        // add transaction id as user_transaction_id to link the company account and user
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

async function getTotalTransferValue(total_transfer_amount, id) {
    const selectQuery = await db.query(
        `SELECT total_transfer_amount, total_approved_amount FROM new_fund_requests WHERE id = ?`,
        [id]
    );
    if (selectQuery.length > 0) {
        const { total_transfer_amount: getTransferAmount, total_approved_amount: getTotalApprovedAmount } =
            selectQuery[0];
        const getTotalAmount = Number(getTransferAmount) + Number(total_transfer_amount);

        // Determine status based on the comparison
        const status = getTotalAmount == getTotalApprovedAmount ? 5 : 4;
        if (status == 4) {
            const updateReschedule = await rescheduleTransferFund(id);
        }
        return { status: status, getTotalAmount: getTotalAmount };
    }
}

async function rescheduleTransferFund(id) {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

    await db.query(
        `UPDATE new_fund_requests SET reschedule_transfer = 0, reschedule_date = '${tomorrowDateString}' WHERE id='${id}'`
    );
}

async function addItemToFundRequest(transfer_data, id, req) {
    try {
        const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);

        if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
            const requestedData = getApprovedRequestedFundDetails[0];
            const transfer_by = requestedData.request_by;

            const transfer_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            for (const data of transfer_data) {
                const allRequests = data.transfer_fund.concat(data.new_transfer_fund);

                let existingItem;
                for (const row of allRequests) {
                    if (row.item_name && row.item_name.value) {
                        existingItem = await db.query(
                            `SELECT * FROM fund_requests WHERE item_id = ? AND request_by = ? AND item_price = ?`,
                            [row.item_name.value, transfer_by, row.price]
                        );
                    } else if (row.title && (row.title.label || row.title.value)) {
                        if (!isNaN(row.title.value)) {
                            // Check if title value is a number
                            existingItem = await db.query(
                                `SELECT * FROM fund_requests WHERE item_id = ? AND request_by = ? AND item_price = ?`,
                                [row.title.value, transfer_by, row.price]
                            );
                        } else {
                            existingItem = await db.query(
                                `SELECT * FROM fund_requests WHERE new_item = ? AND request_by = ?`,
                                [row.title.value, transfer_by]
                            );
                        }
                    }

                    if (existingItem && existingItem.length > 0) {
                        let transfer_qty;
                        let transfer_amount;
                        let updateQuery;
                        let queryParams;

                        if (row.item_name && row.item_name.value) {
                            transfer_qty = Number(row.transfer_quantity) + Number(existingItem[0].transfer_qty);
                            transfer_amount =
                                Number(row.transfer_quantity * row.price) + Number(existingItem[0].transfer_amount);
                            updateQuery = `UPDATE fund_requests SET transfer_qty = ?, transfer_amount = ? WHERE request_by = ? AND item_id = ? AND item_price = ?`;
                            queryParams = [transfer_qty, transfer_amount, transfer_by, row.item_name.value, row.price];
                        } else if (row.title && (row.title.label || row.title.value)) {
                            transfer_qty = Number(row.transfer_quantity) + Number(existingItem[0].transfer_qty);
                            transfer_amount =
                                Number(row.transfer_quantity * row.rate) + Number(existingItem[0].transfer_amount);
                            updateQuery = `UPDATE fund_requests SET transfer_qty = ?, transfer_amount = ? WHERE request_by = ? AND new_item = ?`;
                            queryParams = [transfer_qty, transfer_amount, transfer_by, row.title.value];
                        }

                        const queryResult = await db.query(updateQuery, queryParams);
                    } else {
                        
                        // console.log('row: ', row);
                        let transfer_amount;
                        if (row.item_name && row.item_name.value) {
                            transfer_amount = Number(row.transfer_quantity * row.price);
                        } else if (row.title && (row.title.label || row.title.value)) {
                            transfer_amount = Number(row.transfer_quantity * row.rate); // Assuming rate should be used here instead of price
                        }
                        const insertQuery = `INSERT INTO fund_requests (new_item, request_by, transfer_amount, request_qty, transfer_qty, transfer_date, request_amount, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        const queryResult = await db.query(insertQuery, [
                            row.title ? row.title.value : null,
                            transfer_by,
                            transfer_amount,
                            row.requested_qty,
                            row.transfer_quantity,
                            transfer_at,
                            row.fund_amount,
                            req.user.user_id,
                        ]);
                    }
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

async function getRescheduleDate() {
    // Get tomorrow's date
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateString = tomorrowDate.toISOString().split("T")[0]; // Convert to ISO date string format

    // Fetch records with rescheduled date as tomorrow's date
    const selectQuery = `SELECT id FROM new_fund_requests WHERE reschedule_transfer = 0 AND DATE(reschedule_date) = '${tomorrowDateString}' ORDER BY id ASC`;
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
            await db.query("UPDATE new_fund_requests SET reschedule_transfer = 1 WHERE id IN (?)", [ids]);
        } else {
            await db.query(
                "UPDATE new_fund_requests SET reschedule_transfer = 1 WHERE reschedule_transfer = 0 AND reschedule_date IS NULL"
            );
        }
        console.log("Reschedule_transfer status reset successfully");
    } catch (error) {
        console.error("Error resetting reschedule_transfer status:", error);
        throw error;
    }
});

async function addAmountToRequestedUserWallet(fundRequestId, transfer_by, total_transfer_amount) {
    const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [fundRequestId]);
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
        const requestedData = getApprovedRequestedFundDetails[0];
        const user_id = requestedData.request_by;
        // const amount = requestedData.total_approved_amount;
        const amount = total_transfer_amount;
        const request_by = transfer_by;
        //---check if user id is in wallet then update balance otherwise put request approved amount in wallet---

        const getWalletBalance = await db.query(`SELECT * FROM user_wallets WHERE user_id = ?`, [user_id]);

        if (getWalletBalance.length > process.env.VALUE_ZERO) {
            //---------------update wallet balance--------------------------------
            const walletBalanceId = getWalletBalance[0].id;
            const dbWalletBalance = getWalletBalance[0].balance;
            const updatedWalletBalance = Number(dbWalletBalance) + Number(amount);
            const updateQuery = `UPDATE user_wallets SET balance  = ?, updated_by = ?, updated_at = ? WHERE id = ?`;
            const queryResult = await db.query(updateQuery, [updatedWalletBalance, request_by, createdAt, walletBalanceId]);
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

const getTotalTransferAmount = async (req, res, next) => {
    const id = req.params.id;
    const selectQuery = await db.query(
        `SELECT SUM(transfer_amount) as transfer_amount FROM fund_requests WHERE request_by = '${id}'`
    );

    const getUserLimit = await db.query(`SELECT credit_limit FROM users WHERE id ='${id}'`);

    if (!(selectQuery[0].transfer_amount < getUserLimit[0].credit_limit)) {
        return "Total amount is not greater than limit.";
    }
};

async function getTotalTransferAmounts(id, total_transfer_amount) {
    const selectQuery = await db.query(
        `SELECT SUM(transfer_amount) as transfer_amount,  SUM(expense_transfer_amounts) as expense_punch_amount FROM fund_requests WHERE request_by = '${id}'`
    );
    const remainingAmount = selectQuery[0].transfer_amount - selectQuery[0].expense_punch_amount;
    const transferAmount = remainingAmount + Number(total_transfer_amount);

    const getUserLimit = await db.query(
        `SELECT credit_limit FROM users WHERE id = '${id}' UNION SELECT credit_limit FROM admins WHERE id = '${id}'`
    );
    if (!(transferAmount < getUserLimit[0].credit_limit)) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    transferFundAmount,
    getTransferFund,
    getALLTransferFund,
    rescheduledTransferFund,
    getTotalTransferAmount,
};

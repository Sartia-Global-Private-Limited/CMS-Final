var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger, expenseValidation } = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    generateRandomAlphanumeric,
    totalComplaintsPunch,
    groupDataByItemName,
} = require("../helpers/general");
const {
    manageUserWallet,
    getUserExpenseDetailById,
    saveTransactionDetails,
    getUserWalletBalance,
} = require("../helpers/commonHelper");

const addExpenses = async (req, res, next) => {
    try {
        var {
            expense_category,
            expense_amount,
            payment_method,
            supplier_id,
            complaint_id,
            expense_description,
            user_id,
            expense_date,
        } = req.body;

        const { error } = expenseValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO expenses (expense_date, expense_category, expense_amount, payment_method, receipt_invoice, supplier_id, user_id, complaint_id, expense_description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        if (user_id === null || user_id === undefined || user_id === "") {
            user_id = req.user.user_id;
        }
        if (expense_date === null || expense_date === undefined || expense_date === "") {
            expense_date = moment(new Date()).format("YYYY-MM-DD");
        }

        var storePath = "";

        if (req.files != null) {
            const image = req.files.receipt_invoice;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/cash_expense/" + imageName;
            storePath = "/cash_expense/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: err.message });
            });
        }

        const insertValues = [
            expense_date,
            expense_category,
            expense_amount,
            payment_method,
            storePath,
            supplier_id,
            user_id,
            complaint_id,
            expense_description,
            created_by,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense added successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong with expense addition",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getLoggedUserAllExpenses = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "expenses.expense_amount",
            "payment_methods.method",
            "expenses.expense_category",
            "suppliers.supplier_Name",
            "expense_categories.category_name",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const loggedUserId = req.user.user_id;
        const user_type = req.user.user_type;
        var query;
        if (user_type == process.env.CONTRACTOR_ROLE_ID) {
            const orderLimitQuery = `ORDER BY expenses.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
            var baseQuery = `SELECT expenses.*, payment_methods.method, suppliers.supplier_Name, complaints.complaint_unique_id, expense_categories.category_name FROM expenses LEFT JOIN payment_methods ON payment_methods.id = expenses.payment_method LEFT JOIN suppliers ON suppliers.id = expenses.supplier_id LEFT JOIN complaints ON complaints.id = expenses.complaint_id LEFT JOIN expense_categories ON expense_categories.id = expenses.expense_category`;
            query = `${baseQuery} ${searchConditions.length > 0 ? `WHERE (${searchConditions.join(" OR ")} )` : ""
                } ${orderLimitQuery}`;
        } else {
            const orderLimitQuery = `ORDER BY expenses.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
            var baseQuery = `SELECT expenses.*, payment_methods.method, suppliers.supplier_Name, complaints.complaint_unique_id, expense_categories.category_name FROM expenses LEFT JOIN payment_methods ON payment_methods.id = expenses.payment_method LEFT JOIN suppliers ON suppliers.id = expenses.supplier_id LEFT JOIN complaints ON complaints.id = expenses.complaint_id LEFT JOIN expense_categories ON expense_categories.id = expenses.expense_category WHERE expenses.user_id = '${loggedUserId}'`;
            query = `${baseQuery} ${searchConditions.length > 0 ? `AND (${searchConditions.join(" OR ")} )` : ""
                } ${orderLimitQuery}`;
        }

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var finalData = [];
            var is_expense_approved_rejected = false;

            for (const row of queryResult) {
                const userDetail = await getCreatedByDetails(row.user_id);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);

                // check is expense approved/rejected

                if (row.approved_by != null && row.approved_by !== 0) {
                    is_expense_approved_rejected = true;
                }

                finalData.push({
                    id: row.id,
                    expense_date: moment(row.expense_date).format("YYYY-MM-DD"),
                    expense_category: row.expense_category,
                    expense_category_name: row.category_name,
                    expense_amount: row.expense_amount,
                    payment_method_id: row.payment_method,
                    payment_method_name: row.method,
                    receipt_invoice: row.receipt_invoice,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_Name,
                    user_id: row.user_id,
                    user_name: userDetail.name,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    expense_description: row.expense_description,
                    status: row.status,
                    approved_by: row.approved_by ? approvedByDetails.name : "",
                    approved_at: row.approved_at ? row.approved_at : "",
                    receipt_verification: row.receipt_verification ? row.receipt_verification : "",
                    is_expense_approved_rejected: is_expense_approved_rejected,
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

const getExpensesDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const baseQuery = `SELECT expenses.*, payment_methods.method, suppliers.supplier_Name, complaints.complaint_unique_id, expense_categories.category_name FROM expenses LEFT JOIN payment_methods ON payment_methods.id = expenses.payment_method LEFT JOIN suppliers ON suppliers.id = expenses.supplier_id LEFT JOIN complaints ON complaints.id = expenses.complaint_id LEFT JOIN expense_categories ON expense_categories.id = expenses.expense_category WHERE expenses.id = '${id}'`;

        const queryResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (const row of queryResult) {
                const userDetail = await getCreatedByDetails(row.user_id);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);

                finalData.push({
                    id: row.id,
                    expense_date: moment(row.expense_date).format("YYYY-MM-DD"),
                    expense_category: row.expense_category,
                    expense_category_name: row.category_name,
                    expense_amount: row.expense_amount,
                    payment_method_id: row.payment_method,
                    payment_method_name: row.method,
                    receipt_invoice: row.receipt_invoice,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_Name,
                    user_id: row.user_id,
                    user_name: userDetail.name,
                    user_image: userDetail.image,
                    employee_id: userDetail.employee_id,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    expense_description: row.expense_description,
                    status: row.status,
                    approved_by: row.approved_by ? approvedByDetails.name : "",
                    approved_at: row.approved_at ? moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss A") : "",
                    receipt_verification: row.receipt_verification ? row.receipt_verification : "",
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

const updateExpenses = async (req, res, next) => {
    try {
        const {
            expense_category,
            expense_amount,
            payment_method,
            supplier_id,
            complaint_id,
            expense_description,
            user_id,
            id,
            receipt_invoice_file,
        } = req.body;

        const { error } = expenseValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE expenses SET expense_date = ?, expense_category = ?, expense_amount = ?, payment_method = ?, receipt_invoice = ?, supplier_id = ?, user_id = ?, complaint_id = ?, expense_description = ?, updated_by = ? WHERE id  = ?";

        const updated_by = req.user.user_id;
        if (user_id != null) {
            const user_id = req.user.user_id;
        }
        const expense_date = moment(new Date()).format("YYYY-MM-DD");

        var storePath = "";

        if (req.files != null) {
            const image = req.files.receipt_invoice;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/cash_expense/" + imageName;
            storePath = "/cash_expense/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: err.message });
            });
        } else {
            storePath = receipt_invoice_file;
        }

        const updateValues = [
            expense_date,
            expense_category,
            expense_amount,
            payment_method,
            storePath,
            supplier_id,
            user_id,
            complaint_id,
            expense_description,
            updated_by,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! something went wrong with expense addition",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = "DELETE FROM expenses WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense deleted successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong deleting the expense",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const expenseApproveReject = async (req, res, next) => {
    try {
        const { approved_amount, status, id, remark, transaction_id } = req.body;
        const expenseActionValidation = Joi.object({
            status: Joi.number().required(),
            id: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = expenseActionValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE expenses SET status = ?, approved_amount = ?, approved_by = ?, approved_at = ?, remark = ?, transaction_id = ? WHERE id = ?";
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateValues = [status, approved_amount, approved_by, approved_at, remark, transaction_id, id];
        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // get user details and manage his wallet according to expense status
            // get user details from expense
            const userExpenseDetail = await getUserExpenseDetailById(id);

            if (Object.keys(userExpenseDetail).length !== process.env.VALUE_ZERO) {
                var amount = 0;

                if (userExpenseDetail.approved_amount > process.env.VALUE_ZERO) {
                    amount = userExpenseDetail.approved_amount;
                } else {
                    amount = userExpenseDetail.expense_amount;
                }

                // deduct amount from wallet on expense approved
                if (userExpenseDetail.status === "1") {
                    const wallet = await manageUserWallet(userExpenseDetail.user_id, amount, process.env.DEDUCT_AMOUNT);

                    // get user balance from wallet
                    const wallet_balance = await getUserWalletBalance(userExpenseDetail.user_id);

                    // add details to transaction table
                    const transactionData = {
                        user_id: userExpenseDetail.user_id,
                        transaction_type: process.env.DEBIT,
                        transaction_date: moment(new Date()).format("YYYY-MM-DD"),
                        amount: amount,
                        balance: wallet_balance.balance,
                        description: userExpenseDetail.expense_description,
                        created_by: approved_by,
                    };
                    const transactions = await saveTransactionDetails(transactionData);
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense status changed successfully.",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during expense status change.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

//---------------Contractor Admin------------------------
const viewRequestedExpenses = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const expenseStatus = req.query.expenseStatus || "0";
        const expenseDate = req.query.expenseDate || moment(new Date()).format("YYYY-MM-DD");

        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "expenses.expense_amount",
            "payment_methods.method",
            "expenses.expense_category",
            "suppliers.supplier_Name",
            "expense_categories.category_name",
        ];
        const searchConditions = [];

        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const loggedUserId = req.user.user_id;
        const orderLimitQuery = `ORDER BY expenses.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const baseQuery = `SELECT expenses.*, payment_methods.method, suppliers.supplier_Name, complaints.complaint_unique_id, expense_categories.category_name FROM expenses LEFT JOIN payment_methods ON payment_methods.id = expenses.payment_method LEFT JOIN suppliers ON suppliers.id = expenses.supplier_id LEFT JOIN complaints ON complaints.id = expenses.complaint_id LEFT JOIN expense_categories ON expense_categories.id = expenses.expense_category WHERE expenses.user_id != '${loggedUserId}' AND expenses.status = '${expenseStatus}' AND expenses.expense_date = '${expenseDate}'`;
        const query = `${baseQuery} ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
            } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // total number of results
        const totalResult = await db.query(baseQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var finalData = [];
            const total_count = queryResult.length;
            var total_balance = 0;

            for (const row of queryResult) {
                const userDetail = await getCreatedByDetails(row.user_id);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);

                // check is expense approved/rejected
                var is_expense_approved_rejected = false;
                if (row.approved_by != null && row.approved_by !== 0) {
                    is_expense_approved_rejected = true;
                }

                // add total result amount
                total_balance += row.expense_amount;

                finalData.push({
                    id: row.id,
                    expense_date: moment(row.expense_date).format("YYYY-MM-DD"),
                    expense_category: row.expense_category,
                    expense_category_name: row.category_name,
                    expense_amount: row.expense_amount,
                    payment_method_id: row.payment_method,
                    payment_method_name: row.payment_method,
                    receipt_invoice: row.receipt_invoice,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_Name,
                    user_id: row.user_id,
                    user_name: userDetail.name,
                    user_image: userDetail.image,
                    employee_id: userDetail.employee_id,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    expense_description: row.expense_description,
                    status: row.status,
                    approved_by: row.approved_by ? approvedByDetails.name : "",
                    approved_at: row.approved_at ? row.approved_at : "",
                    receipt_verification: row.receipt_verification ? row.receipt_verification : "",
                    is_expense_approved_rejected: is_expense_approved_rejected,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                total_count: total_count,
                total_balance: process.env.RUPEE_SYMBOL + total_balance,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
                total_count: 0,
                total_balance: process.env.RUPEE_SYMBOL + " 0.00",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getExpenseRequest = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const yearMonth = req.query.yearMonth || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        

        let search_value = ""; // Initialize the search_value variable
        let search_values = "";
        if (searchData != null && searchData != "") {
            search_value = `AND (users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
            search_values = `AND (admins.name LIKE '%${searchData}%' OR admins.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT request_by, SUM(item_price * request_qty) AS total_approve_amount, DATE_FORMAT(request_date, '%Y-%m') AS request_month, SUM(expense_transfer_amounts) AS transfer_amounts, COALESCE(users.username, admins.name) AS user_name FROM fund_requests LEFT JOIN users ON fund_requests.request_by = users.id ${search_value} LEFT JOIN admins ON fund_requests.request_by = admins.id  ${search_values} WHERE (request_date < CURRENT_DATE + INTERVAL 1 MONTH AND request_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)) AND (users.username IS NOT NULL OR admins.name IS NOT NULL) AND fund_requests.created_by = '${req.user.user_id}' GROUP BY request_by, request_month, user_name ORDER BY request_month DESC, request_by ASC LIMIT ${pageFirstResult}, ${pageSize};`;

        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const finalData = {};

        const currentYearMonth = moment().format("YY-MM");

        for (const row of queryResult) {
            // const getRequestDate = row.request_month;
            const formattedMonth = moment(yearMonth).isValid() ? moment(yearMonth).format("YY-MM") : currentYearMonth;
            const userId = row.request_by;
            const totalSum = row.total_approve_amount && parseFloat(row.total_approve_amount);
            const request_by_details = await getCreatedByDetails(row.request_by);
            const generate_unique_id = await generateRandomAlphanumeric(10);
            const result = await totalComplaintsPunch(request_by_details.id, formattedMonth);
            if (result.totalComplaintsPunch > 0 && result.complaint_id) {
                if (!finalData[formattedMonth]) {
                    finalData[formattedMonth] = [];
                }

                const complaintDetail = await db.query(`SELECT * FROM complaints WHERE id = ?`, [result.complaint_id]);

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
                        unique_id: generate_unique_id,
                        status: "1",
                        totalPunch: result.totalComplaintsPunch,
                        balance: balance,
                        total_expense_amount: row.transfer_amounts,
                        complaint_unique_id: complaintDetail[0]?.complaint_unique_id,
                    });
                } else {
                    // User found, update totalSum for existing user
                    finalData[formattedMonth][userIndex].totalSum += totalSum;
                }
            }
        }

        // Convert finalData object to array of arrays
        const dataArray = Object.values(finalData).flat();
        var pageDetails = await calculatePagination(dataArray?.length, currentPage, pageSize);
        if (dataArray.length == 0) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Data not found", data: [] });
        }
        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Data fetched successfully", data: dataArray, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

const getExpenseRequestById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || currentMonthbyNumber;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const currentDate = new Date();
        const currentMonthbyNumber = currentDate.getMonth() + 1;
        if (currentMonthbyNumber < searchData) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        var searchCondition = "";

        if (searchData) {
            // Include data for the specified month and all previous months
            searchCondition = `
            AND ( (MONTH(fund_requests.request_date) = '${searchData}') OR (MONTH(fund_requests.request_date) < '${searchData}' AND YEAR(fund_requests.request_date) = YEAR(CURRENT_DATE())) )`;
        }

        const selectQuery = `SELECT fund_requests.*, DATE_FORMAT(fund_requests.request_date, '%Y-%m-%d') AS requested_date, SUM(item_price * request_qty) AS total_approve_amount, (request_qty - expense_transfer_quantity) AS remaining_punch_quantity, SUM(expense_transfer_amounts) AS transfer_amounts, item_masters.name as item_name, item_masters.image as item_images FROM fund_requests LEFT JOIN item_masters ON fund_requests.item_id = item_masters.id WHERE  request_by = '${id}' ${searchCondition} GROUP BY fund_requests.id;`;

        const queryResult = await db.query(selectQuery);
        const finalData = {};
        const currentMonth = moment().format("YY-MM");
        for (const row of queryResult) {
            const getRequestData = row.request_date;

            var formattedMonth = moment(getRequestData).format("YY-MM");
            const userId = row.request_by;
            const totalSum = parseFloat(row.total_approve_amount);
            const request_by_details = await getCreatedByDetails(row.request_by);
            const generate_unique_id = await generateRandomAlphanumeric(10);
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
                        unique_id: generate_unique_id,
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
                        unique_id: generate_unique_id,
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

        const groupedDataByItemName = groupDataByItemName(dataArray, formattedMonth);

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

const itemsMasterToApprovePrice = async (req, res, next) => {
    try {
        const { id, request_by } = req.params; // Assuming you are getting the id from the request parameters
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        const selectQuery = `SELECT fund_requests.id AS fund_id, fund_requests.item_price as item_price, fund_requests.expense_transfer_quantity, fund_requests.request_qty AS request_qty, item_masters.id AS item_id, item_masters.name AS item_name FROM item_masters LEFT JOIN fund_requests ON item_masters.id = fund_requests.item_id WHERE fund_requests.item_id = '${id}' AND fund_requests.request_by = '${request_by}'`;

        const queryResult = await db.query(selectQuery);
        let check;
        const finalData = [];
        if (queryResult.length > 0) {
            let nextPrice = null;

            for (const row of queryResult) {
                check = row.request_qty - row.expense_transfer_quantity;

                if (check !== 0 && nextPrice === null) {
                    nextPrice = row.item_price; // Store the price of the first item where check != 0
                }

                const expenseTransferSum = queryResult.reduce((sum, item) => {
                    return item.item_id === row.item_id ? sum + item.expense_transfer_quantity : sum;
                }, 0);
                // Add to finalData only if remaining quantity is greater than 0
                if (check > 0) {
                    finalData.push({
                        fund_id: row.fund_id,
                        item_id: row.item_id,
                        item_name: row.item_name,
                        item_price: nextPrice,
                        remaining_quantity: check,
                        request_qty: row.request_qty,
                        previous_punch_qty: expenseTransferSum,
                    });
                    break;
                }
            }

            if (finalData.length > 0) {
                return res.status(StatusCodes.OK).json({ status: true, data: finalData });
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addExpenses,
    getLoggedUserAllExpenses,
    getExpensesDetailById,
    updateExpenses,
    deleteExpense,
    expenseApproveReject,
    viewRequestedExpenses,
    getExpenseRequest,
    getExpenseRequestById,
    itemsMasterToApprovePrice,
};

require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, loanValidation } = require("../helpers/validation");
const { generateRandomNumber, calculatePagination } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { insertLoanEmis, fetchLoanEmis, updateLoanEmis } = require("../helpers/commonHelper");


const createLoan = async (req, res, next) => {
    try {
        const { error } = loanValidation.validate(req.body);

        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

        const {
            user_id,
            loan_type,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_term,
            payment_type,
            remarks,
        } = req.body;

        //get already active loan status for that user
        const getLoanDetailsQuery = `SELECT * FROM loans WHERE user_id = ?`;
        const getLoanStatus = await db.query(getLoanDetailsQuery, [user_id]);

        // if (getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status === "active") {
        //     return res.status(StatusCodes.OK).json({
        //         status: false,
        //         message: "Your have already an active loan, your loan number is " + getLoanStatus[0].loan_id,
        //     });
        // }

        if (getLoanStatus.length > process.env.VALUE_ZERO) {
            // Check if there is any loan which is not closed or rejected
            const hasNonTerminalLoan = getLoanStatus.some(loan => loan.status !== "closed" && loan.status !== "reject");
            if (hasNonTerminalLoan) {
                // Find the first non-terminal loan to get loan_id
                const nonTerminalLoan = getLoanStatus.find(loan => loan.status !== "closed" && loan.status !== "reject");
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "You already have an existing loan which is not closed or rejected, your loan number is " + nonTerminalLoan.loan_id,
                });
            }
            // If no non-terminal loan is found, it means all existing loans are either closed or rejected, so proceed to create new loan
        } else {
            // No existing loans, proceed to create new loan
        }

        let no_of_payments = parseInt(loan_term);

        const loanId = await generateRandomNumber(10);
        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const insertQuery = `INSERT INTO loans (loan_id, user_id, loan_date, emi_start_from, interest_rate, interest_mode, no_of_payments, emi, payment_date, payment_mode, cheque_number, cheque_date, bank, branch, loan_amount, loan_type, loan_term, payment_type, remarks, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
            loanId,
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            createdBy,
            createdAt,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // create loan emis
            await insertLoanEmis(queryResult.insertId, user_id, emi, payment_date, loan_term, createdBy, createdAt);
            return res.status(StatusCodes.OK).json({ status: true, message: "Loan details submitted successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! loan not submitted" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateLoanDetails = async (req, res, next) => {
    try {
        const {
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            id,
        } = req.body;

        const { error } = loanValidation.validate(req.body);

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        //get loan status for the update request
        const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`;
        const getLoanStatus = await db.query(getLoanStatusQuery, [id]);

        if (getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status != "pending") {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Loan is active now so you won't able to update this loan",
            });
        }

        const createdBy = req.user.user_id || 0;
        const updateAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE loans SET user_id = ?, loan_date = ?, emi_start_from = ?, interest_rate = ?, interest_mode = ?, no_of_payments = ?, emi = ?, payment_date = ?, payment_mode = ?, cheque_number = ?, cheque_date = ?, bank = ?, branch = ?, loan_amount = ?, loan_type = ?, loan_term = ?, payment_type= ?, remarks = ?, updated_at = ? WHERE id = ?`;

        const updateValues = [
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            updateAt,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const existingLoanCheck = await db.query(
                `SELECT COUNT(*) AS count, MAX(amount) AS amount, MIN(emi_date) AS emi_date FROM loan_emis WHERE loan_id = '${id}' AND user_id = '${user_id}'`
            );
            if (
                existingLoanCheck[0].count != loan_term ||
                existingLoanCheck[0].amount != emi ||
                existingLoanCheck[0].emi_date != emi_start_from
            ) {
                const loanQuery = await updateLoanEmis(
                    id,
                    user_id,
                    emi,
                    emi_start_from,
                    loan_term,
                    createdBy,
                    updateAt
                );
                if (loanQuery) console.log("Loan EMI updated successfully");
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Loan details updated successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! loan not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllLoanRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if (role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT loans.*, admins.name, admins.image, admins.employee_id
                FROM loans 
                LEFT JOIN admins ON admins.id = loans.user_id 
                WHERE loans.status = 'pending' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value} 
                ORDER BY loans.id
                DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
                SELECT loans.*, users.name, users.image, users.employee_id
                FROM loans 
                LEFT JOIN users ON users.id = loans.user_id 
                WHERE loans.status = 'pending' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}' 
                ${search_value}
                ORDER BY loans.id
                DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResults = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResults.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const final = queryResults.map((element) => {
                return {
                    id: element.id,
                    loan_id: element.loan_id,
                    user_id: element.user_id,
                    employee_id: element.employee_id,
                    loan_amount: element.loan_amount,
                    loan_type: element.loan_type,
                    interest_rate: element.interest_rate,
                    loan_term: element.loan_term,
                    repayment_date: element.repayment_date ? moment(element.repayment_date).format("YYYY-MM-DD") : null,
                    repayment_amount: element.repayment_amount,
                    bank: element.bank,
                    branch: element.branch,
                    payment_type: element.payment_type,
                    status: element.status,
                    remarks: element.remarks,
                    loan_status_changed_date: element.loan_status_changed_date
                        ? moment(element.loan_status_changed_date).format("YYYY-MM-DD")
                        : null,
                    loan_status_changed_by: element.loan_status_changed_by,
                    loan_date: element.loan_date ? moment(element.loan_date).format("YYYY-MM-DD") : null,
                    emi_start_from: element.emi_start_from,
                    interest_mode: element.interest_mode,
                    no_of_payments: element.no_of_payments,
                    emi: element.emi,
                    payment_date: element.payment_date ? moment(element.payment_date).format("YYYY-MM-DD") : null,
                    payment_mode: element.payment_mode,
                    cheque_number: element.cheque_number,
                    cheque_date: element.cheque_date ? moment(element.cheque_date).format("YYYY-MM-DD") : null,
                    is_deleted: element.is_deleted,
                    created_by: element.created_by,
                    created_at: element.created_at ? moment(element.created_at).format("YYYY-MM-DD") : null,
                    updated_at: element.updated_at ? moment(element.update_at).format("YYYY-MM-DD") : null,
                    name: element.name,
                    image: element.image,
                    loan_status_changed_image: null,
                };
            });

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: final, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllActiveLoan = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if (role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }

        // const selectQuery = `SELECT loans.*, users.name, users.image, users.employee_id, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'active' AND loans.is_deleted = '0' ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT loans.*, admins.name, admins.employee_id, admins.image 
                FROM loans 
                LEFT JOIN admins ON admins.id = loans.user_id
                WHERE loans.status = 'active' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
                SELECT loans.*, users.name, users.employee_id, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image 
                FROM loans 
                LEFT JOIN users ON users.id = loans.user_id 
                LEFT JOIN admins ON admins.id = loans.loan_status_changed_by
                WHERE loans.status = 'active' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResults = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResults.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllRejectedLoan = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if (role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }
        // const selectQuery = `SELECT loans.*, users.name, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'reject' AND loans.is_deleted = '0' ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT loans.*, admins.name, admins.employee_id, admins.image
                FROM loans 
                LEFT JOIN admins ON admins.id = loans.user_id
                WHERE loans.status = 'reject' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
                SELECT loans.*, users.name, users.employee_id, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image 
                FROM loans 
                LEFT JOIN users ON users.id = loans.user_id 
                LEFT JOIN admins ON admins.id = loans.loan_status_changed_by
                WHERE loans.status = 'reject' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResults = await promisify(db.query)(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResults.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllClosedLoan = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        let search_value = "";

        if (searchData != null && searchData != "") {
            if (role_id == 1) {
                search_value += ` AND admins.name LIKE '%${searchData}%' `;
            } else {
                search_value += ` AND users.name LIKE '%${searchData}%' `;
            }
        }

        // const selectQuery = `SELECT loans.*, users.name, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'closed' AND loans.is_deleted = '0' ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT loans.*, admins.name, admins.employee_id, admins.image
                FROM loans 
                LEFT JOIN admins ON admins.id = loans.user_id
                WHERE loans.status = 'closed' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
                SELECT loans.*, users.name, users.employee_id, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image 
                FROM loans 
                LEFT JOIN users ON users.id = loans.user_id 
                LEFT JOIN admins ON admins.id = loans.loan_status_changed_by
                WHERE loans.status = 'closed' AND loans.is_deleted = '0' AND loans.created_by = '${req.user.user_id}'
                ${search_value}
                ORDER BY loans.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        const queryResults = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResults.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getLoanDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        const role_id = req.user.user_type;
        let selectQuery;
        if (role_id == 1) {
            selectQuery = `SELECT loans.*, 
                DATE_FORMAT(loans.loan_date, '%y-%m-%d') AS loan_dates, 
                DATE_FORMAT(loans.cheque_date, '%y-%m-%d') AS cheque_dates,
                DATE_FORMAT(loans.payment_date, '%y-%m-%d') AS payment_dates, 
                admins.id AS user_id, admins.name, admins.employee_id, admins.image
                FROM loans 
                INNER JOIN admins ON admins.id = loans.user_id
                INNER JOIN loan_emis lm ON lm.id = loans.id  
                WHERE loans.id = ? AND loans.is_deleted = '0'`;
        } else {
            selectQuery = `SELECT loans.*, 
                DATE_FORMAT(loans.loan_date, '%y-%m-%d') AS loan_dates, 
                DATE_FORMAT(loans.cheque_date, '%y-%m-%d') AS cheque_dates,
                DATE_FORMAT(loans.payment_date, '%y-%m-%d') AS payment_dates, 
                users.id AS user_id, users.name, users.employee_id, users.image 
                FROM loans 
                INNER JOIN users ON users.id = loans.user_id
                INNER JOIN loan_emis lm ON lm.id = loans.id
                WHERE loans.id = ? AND loans.is_deleted = '0'`;
        }

        let queryResults = await db.query(selectQuery, [id]);

        if (queryResults.length == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "data not found" });
        }

        const emi_data = await fetchLoanEmis(id, queryResults[0].user_id);

        emi_data.forEach((item) => {
            item.payment_date = item.paid_date;
        });

        queryResults = queryResults.map((element) => {
            console.log("element.emi_start_from: ", element.emi_start_from);
            return {
                ...element,
                loan_date: element.loan_date ? moment(element.loan_date).format("YYYY-MM-DD") : null,
                emi_start_from: element.emi_start_from ? moment(element.emi_start_from).format("YYYY-MM-DD") : null,
                cheque_date: element.cheque_date ? moment(element.cheque_date).format("YYYY-MM-DD") : null,
                payment_date: element.payment_date ? moment(element.payment_date).format("YYYY-MM-DD") : null,
                created_at: moment(element.created_at).format("YYYY-MM-DD"),
                emis: (emi_data.length > 0 && emi_data) || [],
            };
        });

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults[0] });
        }
    } catch (error) {
        return next(error);
    }
};

// const updateLoanDetails = async(req,res,next) => {

//     try {

//         const {user_id, loan_amount, loan_type, loan_term, payment_type, remarks, id} = req.body;

//         const {error} = loanValidation.validate(req.body)

//         if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

//         //get loan status for the update request
//         const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`
//         const getLoanStatus = await db.query(getLoanStatusQuery, [id])

//         if(getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status != 'pending')
//         {
//             return res.status(StatusCodes.OK).json({status: false, message: "Loan is active now so you won't able to update this loan"})
//         }

//         const updateAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

//         const updateQuery = `UPDATE loans SET user_id = ?, loan_amount = ?, loan_type = ?, loan_term = ?, payment_type= ?, remarks = ?, updated_at = ? WHERE id = ?`

//         const updateValues = [user_id, loan_amount, loan_type, loan_term, payment_type, remarks, updateAt, id]

//         const queryResult = await db.query(updateQuery, updateValues);

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             res.status(StatusCodes.OK).json({status: true, message: "Loan details updated successfully"})
//         }
//         else
//         {
//             res.status(StatusCodes.OK).json({status: false, message: "Error! loan not updated"})
//         }

//     }
//     catch (error)
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});
//     }
// }

// verify and update loan status by super admin
const updateLoanStatus = async (req, res, next) => {
    try {
        const { id, status, user_id } = req.body;
        let loan_status = "";
        if (status == "active") {
            loan_status = "Activated";
        } else if (status == "reject") {
            loan_status = "Rejected";
        } else loan_status = "Closed";

        const statusValidation = Joi.object({
            id: Joi.number().required(),
            status: Joi.string().required(),
            user_id: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = statusValidation.validate(req.body);

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        //get already active loan status for that user
        const getLoanDetailsQuery = `SELECT * FROM loans WHERE user_id = ? AND status = 'active'`;
        const getLoanStatus = await db.query(getLoanDetailsQuery, [user_id]);

        if (status == "active" && getLoanStatus.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Loan is already active, with loan number is " + getLoanStatus[0].loan_id,
            });
        }

        const updateQuery = `UPDATE loans SET status = ?, loan_status_changed_date = ?, loan_status_changed_by = ? WHERE id = ?`;
        const loanStatusChangedDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const loanStatusChangedBy = req.user.user_id;
        const queryResult = await db.query(updateQuery, [status, loanStatusChangedDate, loanStatusChangedBy, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Loan " + loan_status });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! loan status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteLoanDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`;
        const getLoanStatus = await db.query(getLoanStatusQuery, [id]);

        if (getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status === "active") {
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Loan is active now so you won't able to delete this loan" });
        }

        const selectQuery = `UPDATE loans SET is_deleted = ? WHERE id = ?`;
        const queryResults = await db.query(selectQuery, [process.env.DELETED, id]);

        if (queryResults.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Loans deleted successfully" });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! loan not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createLoan,
    getAllLoanRequests,
    getAllActiveLoan,
    getAllRejectedLoan,
    getAllClosedLoan,
    getLoanDetailById,
    updateLoanDetails,
    updateLoanStatus,
    deleteLoanDetailById,
};

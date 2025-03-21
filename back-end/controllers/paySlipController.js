require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const {
    countUserTotalWorkingDaysInMonth,
    checkUserHasActiveLoan,
    getEmployeeSalary,
    countUserTotalLeaveDaysInMonth,
    getUserInsuranceDetails,
    getInsuranceCompanyDetailsById,
    getAssignFromAdmin,
    getEmployeeFullMonthWorkHours,
    getAppliedAllowance,
    getAppliedDeductions,
    getUserGrossSalaryInMonth,
    calculateTaxAmount,
    calculatePagination,
    calculateAppliedAllowanceForUser,
    calculateAppliedDeductionForUser,
    calculateUserActiveLoan,
    calculateTotalWorkingDay,
} = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const numberToWords = require("number-to-words");

const getUsersPaySlip = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;
        const queryMonth = req.query.month || moment(new Date()).format("YYYY-MM");
        const dateObj = moment(queryMonth, "YYYY-MM");
        const year = dateObj.format("YYYY");
        const month = dateObj.format("MM");
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
                SELECT admins.name as user_name, admins.employee_id, admins.email, admins.image as user_image, admins.joining_date, salary_disburses.user_id, salary_disburses.gross_salary, salary_disburses.month, salary_disburses.created_by, roles.name as employee_role 
                FROM salary_disburses 
                INNER JOIN admins ON admins.id = salary_disburses.user_id 
                INNER JOIN roles ON roles.id = admins.user_type 
                WHERE admins.created_by = '${req.user.user_id}' AND MONTH(salary_disburses.month) = '${month}' AND YEAR(salary_disburses.month) = '${year}'
                ${search_value}
                ORDER BY salary_disburses.id
                DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `
                SELECT users.name as user_name, users.email, users.employee_id, users.image as user_image, users.joining_date, salary_disburses.user_id, salary_disburses.gross_salary, salary_disburses.month, salary_disburses.created_by, roles.name as employee_role 
                FROM salary_disburses 
                INNER JOIN users ON users.id = salary_disburses.user_id 
                INNER JOIN roles ON roles.id = users.user_type 
                WHERE users.created_by = '${req.user.user_id}' AND MONTH(salary_disburses.month) = '${month}' AND YEAR(salary_disburses.month) = '${year}'
                ${search_value}
                ORDER BY salary_disburses.id 
                DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        // const queryResult = await promisify(db.query)(selectQuery);
        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var values = [];
            for (const row of queryResult) {
                const salaryDisbursedBy = await getAssignFromAdmin(row.created_by);
                values.push({
                    user_id: row.user_id,
                    user_name: row?.user_name || "",
                    employee_id: row?.employee_id || "",
                    email: row.email,
                    user_image: row?.user_image || "",
                    joining_date: moment(row.joining_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    gross_salary: row.gross_salary,
                    month: moment(row.month, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    employee_role: row.employee_role,
                    salaryDisbursedBy: salaryDisbursedBy[0].name,
                });
            }
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getUserPayslipDetailsById = async (req, res, next) => {
    try {
        const id = req.query.id;
        const month = req.query.month;
        const role_id = req.user.user_type || 0;
        let insuranceCompanyDetails;
        let deductionAmount;
        let allowanceAmount;
        const dateObj = moment(month, "YYYY-MM");
        const getNumberOfDaysInMonth = dateObj.daysInMonth();

        const queryValidate = Joi.object({
            id: Joi.number().positive().integer().required(),
            month: Joi.required(),
        });

        const { error } = queryValidate.validate({ id, month });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT admins.id as user_id, admins.user_type, admins.name,  admins.joining_date, admins.email, admins.contact_no AS mobile, roles.name as role_name 
                FROM admins 
                INNER JOIN roles ON roles.id = admins.user_type 
                WHERE admins.id = ?`;
        } else {
            selectQuery = `
                SELECT users.id as user_id, users.user_type, users.name,  users.joining_date, users.email, users.mobile, roles.name as role_name 
                FROM users 
                INNER JOIN roles ON roles.id = users.user_type 
                WHERE users.id = ?`;
        }

        const queryResult = await db.query(selectQuery, [id]);

        let now = new Date(month) || new Date();
        const totalDayInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        if (queryResult.length > process.env.VALUE_ZERO) {
            let values = [];
            let insuranceAmount = 0;
            let loanAmount = 0;
            let totalDeductionAmount = 0;
            let finalGrossSalaryAmount = 0;

            //get active loan of user
            const getUserActiveLoan = await checkUserHasActiveLoan(id, month);
            const loanEndDate = getUserActiveLoan.loan_term;
            // calculate loan amount for the specified user
            loanAmount = await calculateUserActiveLoan(getUserActiveLoan, month);

            //get total working days of month
            // const getUserTotalWorkingDaysInMonth = await countUserTotalWorkingDaysInMonth(id, month);
            const { present_days, half_day } = await countUserTotalWorkingDaysInMonth(id, month);
            //get total leave days of month
            const getUserTotalLeaveDaysInMonth = await countUserTotalLeaveDaysInMonth(id, month);
            //get user insurance premium details
            const getInsuranceDetails = await getUserInsuranceDetails(id);
            const insuranceObj = getInsuranceDetails;
            //get users base salary
            const getUserSalary = await getEmployeeSalary(id);
            let salary = getUserSalary[0].salary;

            if (insuranceObj != null) {
                const matchValue = parseInt(id);
                const matchedValues = insuranceObj.insurance_applied_on.filter((val) => val === matchValue);
                // get insurance company,plan, abd premium details
                const insuranceCompanyData = await getInsuranceCompanyDetailsById(insuranceObj.id);

                insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount);
                insuranceCompanyDetails = insuranceCompanyData[0];
            } else {
                insuranceAmount = 0;
                insuranceCompanyDetails = [];
            }
            

            //get allowance details
            const userType = queryResult[0].user_type;
            const appliedAllowance = await getAppliedAllowance(id, userType);
            let allowanceDetails = [];

            // calculate all allowances for employee
            if (appliedAllowance != null && appliedAllowance.length > 0) {
                for (let row of appliedAllowance) {
                    let employee_value;

                    if (row.value_type === "1") {
                        employee_value = "₹ " + row.value;
                    } else {
                        employee_value = row.value + "%";
                    }

                    allowanceDetails.push({
                        id: row.id,
                        name: row.name,
                        value: employee_value,
                    });

                    // total allowance amount is calculated
                    let totalValue = 0;

                    totalValue = await calculateAppliedAllowanceForUser(appliedAllowance, salary);
                    allowanceAmount = totalValue;
                }
            } else {
                // allowanceDetails;
                allowanceAmount = 0;
            }

            // get deductions amounts details
            const appliedDeduction = await getAppliedDeductions(id, userType);
            let deductionDetails = [];

            if (appliedDeduction != null && appliedDeduction.length > 0) {
                for (let row of appliedDeduction) {
                    let employee_value;
                    let employer_value;

                    if (row.value_type === "1") {
                        employee_value = "₹" + row.by_employee;
                        employer_value = "₹" + row.by_employer;
                    } else {
                        employee_value = row.by_employee + "%";
                        employer_value = row.by_employer + "%";
                    }

                    deductionDetails.push({
                        id: row.id,
                        name: row.name,
                        value: row.value,
                        by_employee: employee_value,
                        by_employer: employer_value,
                    });
                }

                // total deduction amount calculation
                let deductionTotalValue = 0;

                deductionTotalValue = await calculateAppliedDeductionForUser(appliedDeduction, salary, allowanceAmount);

                deductionAmount = deductionTotalValue;
            } else {
                deductionAmount = 0;
            }

            const getUserTotalWorkingDaysInMonth = await countUserTotalWorkingDaysInMonth(id, month);
            // fetching getUserTotalWorkingDaysInMonth => { present_days, half_day }

            const finalTotalWorkingDays = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMonth);

            totalDeductionAmount = deductionAmount + loanAmount + insuranceAmount;

            const dailyGrossSalary = ((salary + allowanceAmount) / getNumberOfDaysInMonth).toFixed(2);

            const dailyDeduction = (totalDeductionAmount / getNumberOfDaysInMonth).toFixed(2);
            // calculate net salary on no. of paid days
            const netGross = dailyGrossSalary * finalTotalWorkingDays;
            // console.log('netGross: ', netGross);
            const netDeduction = dailyDeduction * finalTotalWorkingDays;
            // console.log('netDeduction: ', netDeduction);
            finalGrossSalaryAmount = (netGross - netDeduction).toFixed(2);

            //get users gross in particular month salary
            const getUserGrossSalary = await getUserGrossSalaryInMonth(id, month);
            const gross_salary = getUserGrossSalary.gross_salary;
            const gross_salary_in_word = gross_salary > 0 ? numberToWords.toWords(gross_salary) : "/-";
            const paySlipNumber = getUserGrossSalary.slip_number;

            //get user total work hours in month
            const date = new Date(`${month}-01`);
            const dbFormattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");

            const getUserTotalWorkHours = await getEmployeeFullMonthWorkHours(id, dbFormattedDate);
            for (const row of queryResult) {
                values.push({
                    user_id: row.user_id,
                    user_name: row.name,
                    joining_date: row.joining_date,
                    user_email: row.email,
                    user_mobile: row.mobile,
                    user_role: row.role_name,
                    loan_number: getUserActiveLoan.loan_id,
                    loan_amount: getUserActiveLoan.repayment_amount,
                    loan_term: getUserActiveLoan.loan_term,
                    loanEndDate: getUserActiveLoan.loan_end_date,
                    total_working_days: present_days + half_day + "/" + totalDayInMonth,
                    total_leaves: getUserTotalLeaveDaysInMonth.total_leaves,
                    total_work_hours_in_month: getUserTotalWorkHours.total_work_hours,
                    base_salary: getUserSalary[0].salary,
                    gross_salary: gross_salary,
                    gross_salary_in_word: gross_salary_in_word,
                    net_payable_salary: finalGrossSalaryAmount > 0 ? finalGrossSalaryAmount : 0,
                    net_payable_salary_in_word: finalGrossSalaryAmount > 0 ? numberToWords.toWords(finalGrossSalaryAmount) : "/-",
                    insurance: insuranceCompanyDetails,
                    allowance: allowanceDetails,
                    totalAllowance: allowanceAmount,
                    deduction: deductionDetails,
                    totalDeductionAmount: totalDeductionAmount,
                    paySlipNumber: paySlipNumber || "--",
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Details not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { getUsersPaySlip, getUserPayslipDetailsById };

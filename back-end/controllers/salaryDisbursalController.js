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
    checkUserSalaryDisbursed,
    getAppliedAllowance,
    getAppliedDeductions,
    calculateTaxAmount,
    calculateAppliedAllowanceForUser,
    calculateUserActiveLoan,
    calculateAppliedDeductionForUser,
    calculateTotalWorkingDay,
} = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
    getUserSalaryDisburseHistory,
    getUserSalaryDueAmount,
    getUserSalaryDisbursedAmount,
} = require("../helpers/commonHelper");

const getAllUserSalaryForDisbursal = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const role_id = req.user.user_type || 0;
        const user_id = req.user.user_id;
        let search_cond = "";


        if (searchData != "") {
            if (role_id == 1) {
                search_cond = `AND admins.name LIKE '%${searchData}%'`;
            } else {
                search_cond = `AND users.name LIKE '%${searchData}%'`;
            }

        }

        let selectQuery2;

        const pageFirstResult = (currentPage - 1) * pageSize;

        const month = req.query.month || moment(new Date()).format("YYYY-MM");

        if (role_id == 1) {
            selectQuery2 = `
                SELECT admins.id as user_id, admins.user_type, admins.name, admins.image, admins.employee_id, admins.joining_date, MAX(salaries.salary) AS salary 
                FROM salaries 
                LEFT JOIN admins ON salaries.user_id = admins.id
                WHERE (admins.is_deleted='0' AND admins.created_by = '${user_id}' AND admins.status = '1') AND DATE_FORMAT(admins.joining_date, '%Y-%m') <= '${month}' ${search_cond} 
                GROUP BY admins.id ORDER BY admins.id DESC
                LIMIT ${pageFirstResult}, ${pageSize};`;
        } else {
            selectQuery2 = `
                SELECT users.id as user_id, users.user_type, users.name, users.image, users.employee_id, users.joining_date, MAX(salaries.salary) AS salary 
                FROM salaries 
                LEFT JOIN users ON salaries.user_id = users.id
                WHERE (users.is_deleted = '0' AND users.created_by ='${user_id}' AND users.status = '1' AND users.outlet_id IS NULL AND DATE_FORMAT(users.joining_date, '%Y-%m') <= '${month}') ${search_cond}   
                GROUP BY users.id ORDER BY users.id DESC
                LIMIT ${pageFirstResult}, ${pageSize};`;
        }

        const queryResult = await db.query(selectQuery2);

        const modifiedQueryString = selectQuery2.substring(0, selectQuery2.indexOf("LIMIT"));
        const constTotalLength = await db.query(modifiedQueryString);
        const total = constTotalLength.length;
        totalPages = Math.round(total / pageSize);
        // const total = constTotalLength;


        if (queryResult.length > process.env.VALUE_ZERO) {
            let values = [];
            let loanAmount = 0;
            let totalAllowanceAmount = 0;
            let totalDeductionAmount = 0;
            let finalGrossSalaryAmount = 0;
            let insuranceAmount = 0;
            let allowanceAmount = 0;
            let deductionAmount = 0;

            // fetch days in a month
            const dateObj = moment(month, "YYYY-MM");
            const getNumberOfDaysInMonth = dateObj.daysInMonth();
            for (const row of queryResult) {
                //total working days in month
                const getUserTotalWorkingDaysInMonth = await countUserTotalWorkingDaysInMonth(row.user_id, month);
                // fetching getUserTotalWorkingDaysInMonth => { present_days, half_day }

                const finalTotalWorkingDays = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMonth);

                //get user insurance premium details for the specified user or on designations
                const getInsuranceDetails = await getUserInsuranceDetails(row.user_id);
                const insuranceObj = getInsuranceDetails;
                if (insuranceObj != null) {
                    // fetch insurance amount for the specified user or on designations if exists
                    insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount);
                } else {
                    insuranceAmount = 0;
                }

                //get allowance details for the specified user or on designations
                const appliedAllowance = await getAppliedAllowance(row.user_id, row.user_type);

                // calculate allowance amount for the specified user or on designations
                allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, row.salary);
                // console.log('allowanceAmount: ', allowanceAmount);

                //get all deductions if applied to the specified user or on designations
                const appliedDeduction = await getAppliedDeductions(row.user_id, row.user_type);

                // console.log('appliedDeduction, row.salary, allowanceAmount: ', appliedDeduction, row.salary, allowanceAmount);

                // calculate deduction amount for the specified user or on designations
                deductionAmount = await calculateAppliedDeductionForUser(appliedDeduction, row.salary, allowanceAmount);
                // console.log('deductionAmount: ', deductionAmount);

                // get active loan for specified user
                const getUserActiveLoan = await checkUserHasActiveLoan(row.user_id, month);

                // calculate loan amount for the specified user
                loanAmount = await calculateUserActiveLoan(getUserActiveLoan, month);
                //loan calculation end here

                totalAllowanceAmount = allowanceAmount;
                totalDeductionAmount = deductionAmount + loanAmount + insuranceAmount;
                // console.log('totalDeductionAmount: ', totalDeductionAmount);
                // calculate daily salary based on monthly salary and total month days
                const dailyGrossSalary = ((row.salary + totalAllowanceAmount) / getNumberOfDaysInMonth).toFixed(2);
                // console.log('getNumberOfDaysInMonth: ', getNumberOfDaysInMonth);

                const dailyDeduction = (totalDeductionAmount / getNumberOfDaysInMonth).toFixed(2);
                // calculate net salary on no. of paid days
                const netGross = dailyGrossSalary * finalTotalWorkingDays;
                // console.log('netGross: ', netGross);
                const netDeduction = dailyDeduction * finalTotalWorkingDays;
                // console.log('netDeduction: ', netDeduction);
                finalGrossSalaryAmount = (netGross - netDeduction) <= 0 ? 0 : (netGross - netDeduction).toFixed(2);
                const totalSalaryWithAllowance = totalAllowanceAmount + row.salary;
                //check user salary disbursed or not in that particular month
                const userSalaryDisbursed = await checkUserSalaryDisbursed(row.user_id, month, finalGrossSalaryAmount);

                // get user previous due salary amount
                const currentMonth = moment(month, "YYYY-MM");
                const oneMonthAgo = currentMonth.subtract(1, "months");
                const oneMonthAgoDateFormatted = oneMonthAgo.format("YYYY-MM");
                const userSalaryDueAmount = await getUserSalaryDueAmount(row.user_id, oneMonthAgoDateFormatted);

                // get user current month disbursed total salary
                const userSalaryDisbursedAmount = await getUserSalaryDisbursedAmount(row.user_id, month);

                let final_pay_amounts = 0;
                // console.log('finalGrossSalaryAmount: ', finalGrossSalaryAmount);
                // console.log('userSalaryDisbursedAmount: ', userSalaryDisbursedAmount);
                if (moment(userSalaryDueAmount.date).format("YYYY-MM") == month) {
                    final_pay_amounts = Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount);
                    if (final_pay_amounts < 0) {
                        final_pay_amounts = 0
                    }
                } else {
                    const user_due_amount = userSalaryDueAmount.due_amount ? userSalaryDueAmount.due_amount : 0;
                    final_pay_amounts =
                        Number(user_due_amount) + Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount);
                }

                values.push({
                    user_id: row.user_id,
                    name: row.name,
                    image: row.image,
                    employee_code: row.employee_id,
                    month: moment(month, "YYYY-MM").format("MMMM"),
                    allowance: allowanceAmount.toFixed(2),
                    deduction: totalDeductionAmount.toFixed(2),
                    salary: row.salary,
                    totalWorkingDays: finalTotalWorkingDays,
                    grossSalary: totalSalaryWithAllowance.toFixed(2),
                    payable_salary: finalGrossSalaryAmount,
                    is_salary_disbursed: userSalaryDisbursed,
                    due_amount: userSalaryDueAmount.due_amount,
                    final_pay_amount: final_pay_amounts.toFixed(2),
                });
            }

            const pageStartResult = (currentPage - 1) * pageSize + 1;
            // const pageEndResult = Math.min(currentPage * pageSize, total);
            const pageEndResult = Math.min(currentPage * pageSize, total);
            let pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                pageDetails: pageDetails[0],
                data: values,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// const getUserSalaryDisbursalDetailsById = async (req, res, next) => {
//     try {
//         const id = req.query.id;
//         const month = req.query.month;
//         const role_id = req.user.user_type || 0;

//         const queryValidate = Joi.object({
//             id: Joi.number().positive().integer().required(),
//             month: Joi.required(),
//         });

//         const { error } = queryValidate.validate({ id, month });

//         if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

//         let selectQuery;
//         if (role_id == 1) {
//             selectQuery = `
//                 SELECT admins.id as user_id, admins.user_type, admins.name,  admins.image, admins.email, admins.contact_no AS mobile, admins.employee_id, roles.name as role_name 
//                 FROM admins 
//                 INNER JOIN roles ON roles.id = admins.user_type 
//                 WHERE admins.id = ?`;
//         } else {
//             selectQuery = `
//                 SELECT users.id as user_id, users.user_type, users.name,  users.image, users.email, users.mobile, users.employee_id, roles.name as role_name 
//                 FROM users 
//                 INNER JOIN roles ON roles.id = users.user_type 
//                 WHERE users.id = ?`;
//         }
//         const queryResult = await db.query(selectQuery, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var values = [];
//             let totalDeductionAmount;
//             let totalAllowanceAmount;
//             let finalGrossSalaryAmount;
//             let allowanceAmount = 0;
//             let loanAmount = 0;
//             let insuranceAmount;
//             let deductionAmount = 0;

//             //get total working days of month
//             const getUserTotalWorkingDaysInMonth = await countUserTotalWorkingDaysInMonth(id, month);
//             //get total leave days of month
//             const getUserTotalLeaveDaysInMonth = await countUserTotalLeaveDaysInMonth(id, month);

//             //get user insurance premium details
//             const getInsuranceDetails = await getUserInsuranceDetails(id);

//             const insuranceObj = getInsuranceDetails;
//             let insuranceCompanyDetails;
//             if (insuranceObj != null) {
//                 insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount);
//                 insuranceCompanyDetails = await getInsuranceCompanyDetailsById(insuranceObj.id);
//             } else {
//                 insuranceAmount = 0;
//                 insuranceCompanyDetails = [];
//             }

//             //get users salary
//             const getUserSalary = await getEmployeeSalary(id);

//             const userType = queryResult[0].user_type;

//             //get allowance details
//             const appliedAllowance = await getAppliedAllowance(id, userType);
//             let allowanceDetails = [];
//             if (appliedAllowance != null) {
//                 if (appliedAllowance.length > 0) {
//                     for (let row of appliedAllowance) {
//                         let employee_value;

//                         if (row.value_type === "1") {
//                             employee_value = "₹ " + row.value;
//                         } else {
//                             employee_value = row.value + "%";
//                         }

//                         const amountValue = row.value_type === "1" ? row.value : getUserSalary[0].salary * (row.value / 100);
//                         allowanceDetails.push({
//                             id: row.id,
//                             name: row.name,
//                             percentage: row.value_type === "1" ? "" : row.value + "%",
//                             value: amountValue.toFixed(2),
//                         });
//                     }
//                 }
//             }
//             allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, getUserSalary[0].salary);

//             //get deduction details
//             const appliedDeduction = await getAppliedDeductions(id, userType, month);
//             // console.log('appliedDeduction: ', appliedDeduction);

//             let deductionDetails = [];
//             if (appliedDeduction != null) {
//                 if (appliedDeduction.length > 0) {
//                     for (let row of appliedDeduction) {
//                         let employee_value;
//                         let employer_value;

//                         if (row.value_type === "1") {
//                             employee_value = "₹" + row.by_employee;
//                             employer_value = "₹" + row.by_employer;
//                         } else {
//                             employee_value = row.by_employee + "%";
//                             employer_value = row.by_employer + "%";
//                         }

//                         let amountValue;
//                         if (row.value_type === "1") {
//                             amountValue = parseFloat(row.by_employee) + parseFloat(row.by_employer);  // Sum both contributions
//                         } else {
//                             amountValue = getUserSalary[0].salary * ((parseFloat(row.by_employee) + parseFloat(row.by_employer)) / 100);
//                         }

//                         deductionDetails.push({
//                             id: row.id,
//                             name: row.name,
//                             emi_start_date: moment(row.emi_start_date).format('YYYY-MM-DD'),
//                             percentage: row.value_type === "1" ? "" : row.value + "%",
//                             value: amountValue.toFixed(2),
//                             by_employee: employee_value,
//                             by_employer: employer_value,
//                         });
//                     }
//                 }
//             }

//             /**************************************************************************** */
//             // *** Updated Loan EMI Deferral Logic Starts Here ***
//             const loanDeduction = deductionDetails.find(d => d.name.includes("Loan Repayment -")); // Identify loan by name
//             let totalDeductionsExcludingLoan = deductionDetails
//                 .filter(d => !d.name.includes("Loan Repayment -"))
//                 .reduce((sum, d) => sum + parseFloat(d.value), 0);
//             let finalDeductions = [...deductionDetails];

//             // Get active loan details
//             const getUserActiveLoan = await checkUserHasActiveLoan(id, month);

//             // Calculate total earnings
//             const finalTotalWorkingDays = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMonth);
//             totalAllowanceAmount = allowanceAmount;
//             const getNumberOfDaysInMonth = moment(month, "YYYY-MM").daysInMonth();
//             totalDeductionAmount = deductionAmount + insuranceAmount;

//             let totalSalaryOnWorkingDays;
//             const baseSalary = parseFloat(getUserSalary[0].salary);
//             const dailySalaryForDeduction = baseSalary / 30;
//             const absentDays = getNumberOfDaysInMonth - finalTotalWorkingDays;

//             if (finalTotalWorkingDays === getNumberOfDaysInMonth) {
//                 totalSalaryOnWorkingDays = baseSalary;
//             } else if (finalTotalWorkingDays <= 0) {
//                 totalSalaryOnWorkingDays = 0;
//             } else {
//                 totalSalaryOnWorkingDays = baseSalary - (dailySalaryForDeduction * absentDays);
//                 if (totalSalaryOnWorkingDays < 0) totalSalaryOnWorkingDays = 0;
//             }

//             const totalEarnings = totalSalaryOnWorkingDays + totalAllowanceAmount;

//             // Check loan EMI deferral condition
//             if (loanDeduction) {
//                 const loanEMI = parseFloat(loanDeduction.value);
//                 if (totalEarnings - totalDeductionsExcludingLoan - loanEMI <= 1000) {
//                     // Defer the loan EMI
//                     finalDeductions = deductionDetails.filter(d => !d.name.includes("Loan Repayment -"));

//                     // Calculate the correct emi_date based on emi_start_date
//                     const emiStartDate = loanDeduction.emi_start_date;
//                     const emiDay = moment(emiStartDate, "YYYY-MM-DD").date(); // Get the day of the month (e.g., 30)
//                     const currentMonth = moment(month, "YYYY-MM").format("MM");
//                     let emiDate = moment(month, "YYYY-MM").format("YYYY-MM") + "-" + emiDay;

//                     // Adjust if the day exceeds the month's length (e.g., 31st in April)
//                     if (emiDay > getNumberOfDaysInMonth) {
//                         emiDate = currentMonth.endOf("month").format("YYYY-MM-DD");
//                     }

//                     const result = await db.query(
//                         `UPDATE loan_emis SET deferred_amount = ?, status = 'deferred' WHERE user_id = ? AND loan_id = ? AND emi_date = ?`,
//                         [loanEMI, id, loanDeduction.id, emiDate]
//                     );
//                     console.log('result: ', result);
//                 }
//             }

//             // Calculate final total deduction amount with updated deductions
//             totalDeductionAmount = finalDeductions.reduce((sum, d) => sum + parseFloat(d.value), 0) + insuranceAmount;

//             // Calculate final gross salary
//             finalGrossSalaryAmount = totalEarnings - totalDeductionAmount;
//             if (finalGrossSalaryAmount <= 0) {
//                 finalGrossSalaryAmount = 0;
//             }
//             // *** Updated Loan EMI Deferral Logic Ends Here ***

//             /*********************************************************************** */

//             // get users salary disburse history
//             const salaryDisburseHistory = await getUserSalaryDisburseHistory(id, month);

//             for (const row of queryResult) {
//                 values.push({
//                     user_id: row.user_id,
//                     user_name: row.name,
//                     user_image: row.image,
//                     user_email: row.email,
//                     user_mobile: row.mobile,
//                     employee_code: row.employee_id,
//                     user_role: row.role_name,
//                     loan_number: getUserActiveLoan.loan_id,
//                     // loan_amount: getUserActiveLoan.repayment_amount,
//                     loan_term: getUserActiveLoan.loan_term,
//                     total_working_days: finalTotalWorkingDays,
//                     total_leaves: getUserTotalLeaveDaysInMonth.total_days,
//                     base_salary: getUserSalary[0].salary,
//                     insurance: insuranceCompanyDetails,
//                     allowance: allowanceDetails,
//                     deduction: deductionDetails,
//                     total_working_day_salary: totalSalaryOnWorkingDays.toFixed(2),
//                     gross_salary: finalGrossSalaryAmount.toFixed(2),
//                     totalAllowanceAmount: totalAllowanceAmount.toFixed(2),
//                     totalDeductionAmount: totalDeductionAmount.toFixed(2),
//                     salaryDisburseHistory: salaryDisburseHistory,
//                 });
//             }
//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

const getUserSalaryDisbursalDetailsById = async (req, res, next) => {
    try {
        const id = req.query.id;
        const month = req.query.month;
        const role_id = req.user.user_type || 0;

        const queryValidate = Joi.object({
            id: Joi.number().positive().integer().required(),
            month: Joi.required(),
        });

        const { error } = queryValidate.validate({ id, month });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT admins.id as user_id, admins.user_type, admins.name,  admins.image, admins.email, admins.contact_no AS mobile, admins.employee_id, roles.name as role_name 
                FROM admins 
                INNER JOIN roles ON roles.id = admins.user_type 
                WHERE admins.id = ?`;
        } else {
            selectQuery = `
                SELECT users.id as user_id, users.user_type, users.name,  users.image, users.email, users.mobile, users.employee_id, roles.name as role_name 
                FROM users 
                INNER JOIN roles ON roles.id = users.user_type 
                WHERE users.id = ?`;
        }
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            let totalDeductionAmount;
            let totalAllowanceAmount;
            let finalGrossSalaryAmount;
            let allowanceAmount = 0;
            let loanAmount = 0;
            let insuranceAmount;
            let deductionAmount = 0;

            //get total working days of month
            const getUserTotalWorkingDaysInMonth = await countUserTotalWorkingDaysInMonth(id, month);
            //get total leave days of month
            const getUserTotalLeaveDaysInMonth = await countUserTotalLeaveDaysInMonth(id, month);

            //get user insurance premium details
            const getInsuranceDetails = await getUserInsuranceDetails(id);

            const insuranceObj = getInsuranceDetails;
            let insuranceCompanyDetails;
            if (insuranceObj != null) {
                insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount);
                insuranceCompanyDetails = await getInsuranceCompanyDetailsById(insuranceObj.id);
            } else {
                insuranceAmount = 0;
                insuranceCompanyDetails = [];
            }

            //get users salary
            const getUserSalary = await getEmployeeSalary(id);

            const userType = queryResult[0].user_type;

            //get allowance details
            const appliedAllowance = await getAppliedAllowance(id, userType);
            let allowanceDetails = [];
            if (appliedAllowance != null) {
                if (appliedAllowance.length > 0) {
                    for (let row of appliedAllowance) {
                        let employee_value;

                        if (row.value_type === "1") {
                            employee_value = "₹ " + row.value;
                        } else {
                            employee_value = row.value + "%";
                        }

                        const amountValue = row.value_type === "1" ? row.value : getUserSalary[0].salary * (row.value / 100);
                        allowanceDetails.push({
                            id: row.id,
                            name: row.name,
                            percentage: row.value_type === "1" ? "" : row.value + "%",
                            value: amountValue.toFixed(2),
                        });
                    }
                }
            }
            allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, getUserSalary[0].salary);

            //get deduction details
            const appliedDeduction = await getAppliedDeductions(id, userType, month);

            let deductionDetails = [];
            if (appliedDeduction != null) {
                if (appliedDeduction.length > 0) {
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

                        let amountValue;
                        if (row.value_type === "1") {
                            amountValue = parseFloat(row.by_employee) + parseFloat(row.by_employer);
                        } else {
                            amountValue = getUserSalary[0].salary * ((parseFloat(row.by_employee) + parseFloat(row.by_employer)) / 100);
                        }

                        deductionDetails.push({
                            id: row.id,
                            name: row.name,
                            emi_start_date: moment(row.emi_start_date).format('YYYY-MM-DD'),
                            percentage: row.value_type === "1" ? "" : row.value + "%",
                            value: amountValue.toFixed(2),
                            by_employee: employee_value,
                            by_employer: employer_value,
                        });
                    }
                }
            }

            /**************************************************************************** */
            // *** Updated Loan EMI Deferral Logic Starts Here ***
            const loanDeduction = deductionDetails.find(d => d.name.includes("Loan Repayment -"));
            let totalDeductionsExcludingLoan = deductionDetails
                .filter(d => !d.name.includes("Loan Repayment -"))
                .reduce((sum, d) => sum + parseFloat(d.value), 0);
            let finalDeductions = [...deductionDetails];

            // Get active loan details
            const getUserActiveLoan = await checkUserHasActiveLoan(id, month);

            // Fetch deferred loan EMIs from previous months
            const deferredEmis = await db.query(
                `SELECT SUM(deferred_amount) as total_deferred, GROUP_CONCAT(emi_date) as deferred_dates 
                 FROM loan_emis 
                 WHERE user_id = ? AND loan_id = ? AND status = 'deferred' AND emi_date < ?`,
                [id, getUserActiveLoan.loan_id, moment(month, "YYYY-MM").startOf('month').format('YYYY-MM-DD')]
            );
            const totalDeferredAmount = deferredEmis[0]?.total_deferred ? parseFloat(deferredEmis[0].total_deferred) : 0;
            const deferredDates = deferredEmis[0]?.deferred_dates ? deferredEmis[0].deferred_dates.split(',') : [];

            // Calculate total earnings
            const finalTotalWorkingDays = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMonth);
            totalAllowanceAmount = allowanceAmount;
            const getNumberOfDaysInMonth = moment(month, "YYYY-MM").daysInMonth();
            totalDeductionAmount = deductionAmount + insuranceAmount;

            let totalSalaryOnWorkingDays;
            const baseSalary = parseFloat(getUserSalary[0].salary);
            const dailySalaryForDeduction = baseSalary / 30;
            const absentDays = getNumberOfDaysInMonth - finalTotalWorkingDays;

            if (finalTotalWorkingDays === getNumberOfDaysInMonth) {
                totalSalaryOnWorkingDays = baseSalary;
            } else if (finalTotalWorkingDays <= 0) {
                totalSalaryOnWorkingDays = 0;
            } else {
                totalSalaryOnWorkingDays = baseSalary - (dailySalaryForDeduction * absentDays);
                if (totalSalaryOnWorkingDays < 0) totalSalaryOnWorkingDays = 0;
            }

            const totalEarnings = totalSalaryOnWorkingDays + totalAllowanceAmount;

            // Check loan EMI deferral condition and handle deferred amounts
            if (loanDeduction) {
                const loanEMI = parseFloat(loanDeduction.value);
                const totalLoanAmount = loanEMI + totalDeferredAmount;

                if (totalEarnings - totalDeductionsExcludingLoan - totalLoanAmount <= 1000) {
                    // Defer the current EMI if total (current + deferred) cannot be covered
                    finalDeductions = deductionDetails.filter(d => !d.name.includes("Loan Repayment -"));

                    const emiStartDate = loanDeduction.emi_start_date;
                    const emiDay = moment(emiStartDate, "YYYY-MM-DD").date();
                    const currentMonth = moment(month, "YYYY-MM").format("MM");
                    let emiDate = moment(month, "YYYY-MM").format("YYYY-MM") + "-" + emiDay;

                    if (emiDay > getNumberOfDaysInMonth) {
                        emiDate = currentMonth.endOf("month").format("YYYY-MM-DD");
                    }

                    await db.query(
                        `UPDATE loan_emis SET deferred_amount = ?, status = 'deferred' 
                         WHERE user_id = ? AND loan_id = ? AND emi_date = ?`,
                        [loanEMI, id, loanDeduction.id, emiDate]
                    );
                } else {
                    // If salary is sufficient, include current EMI and deferred amounts
                    if (totalDeferredAmount > 0) {
                        finalDeductions.push({
                            id: "deferred",
                            name: "Deferred Loan Repayment",
                            emi_start_date: null,
                            percentage: "",
                            value: totalDeferredAmount.toFixed(2),
                            by_employee: "₹" + totalDeferredAmount,
                            by_employer: "₹0"
                        });

                        // Update deferred EMIs to paid
                        await db.query(
                            `UPDATE loan_emis SET deferred_amount = 0, status = 'paid' 
                             WHERE user_id = ? AND loan_id = ? AND status = 'deferred' AND emi_date < ?`,
                            [id, getUserActiveLoan.loan_id, moment(month, "YYYY-MM").startOf('month').format('YYYY-MM-DD')]
                        );
                    }
                }
            } else if (totalDeferredAmount > 0 && totalEarnings - totalDeductionsExcludingLoan - totalDeferredAmount > 1000) {
                // Handle case where no current EMI but deferred amounts can be paid
                finalDeductions.push({
                    id: "deferred",
                    name: "Deferred Loan Repayment",
                    emi_start_date: null,
                    percentage: "",
                    value: totalDeferredAmount.toFixed(2),
                    by_employee: "₹" + totalDeferredAmount,
                    by_employer: "₹0"
                });

                await db.query(
                    `UPDATE loan_emis SET deferred_amount = 0, status = 'paid' 
                     WHERE user_id = ? AND loan_id = ? AND status = 'deferred' AND emi_date < ?`,
                    [id, getUserActiveLoan.loan_id, moment(month, "YYYY-MM").startOf('month').format('YYYY-MM-DD')]
                );
            }

            // Calculate final total deduction amount with updated deductions
            totalDeductionAmount = finalDeductions.reduce((sum, d) => sum + parseFloat(d.value), 0) + insuranceAmount;

            // Calculate final gross salary
            finalGrossSalaryAmount = totalEarnings - totalDeductionAmount;
            if (finalGrossSalaryAmount <= 0) {
                finalGrossSalaryAmount = 0;
            }
            // *** Updated Loan EMI Deferral Logic Ends Here ***

            /*********************************************************************** */

            // get users salary disburse history
            const salaryDisburseHistory = await getUserSalaryDisburseHistory(id, month);

            for (const row of queryResult) {
                values.push({
                    user_id: row.user_id,
                    user_name: row.name,
                    user_image: row.image,
                    user_email: row.email,
                    user_mobile: row.mobile,
                    employee_code: row.employee_id,
                    user_role: row.role_name,
                    loan_number: getUserActiveLoan.loan_id,
                    // loan_amount: getUserActiveLoan.repayment_amount,
                    loan_term: getUserActiveLoan.loan_term,
                    total_working_days: finalTotalWorkingDays,
                    total_leaves: getUserTotalLeaveDaysInMonth.total_days,
                    base_salary: getUserSalary[0].salary,
                    insurance: insuranceCompanyDetails,
                    allowance: allowanceDetails,
                    deduction: finalDeductions, // Use finalDeductions instead of deductionDetails
                    total_working_day_salary: totalSalaryOnWorkingDays.toFixed(2),
                    gross_salary: finalGrossSalaryAmount.toFixed(2),
                    totalAllowanceAmount: totalAllowanceAmount.toFixed(2),
                    totalDeductionAmount: totalDeductionAmount.toFixed(2),
                    salaryDisburseHistory: salaryDisburseHistory,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};


const markSalaryDisbursed = async (req, res, next) => {
    try {
        const {
            user_id,
            gross_salary,
            month,
            amount,
            transaction_number,
            transaction_mode,
            payable_amount,
            due_amount,
            final_pay_amount,
        } = req.body;

        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            gross_salary: Joi.number().required(),
            month: Joi.required(),
            // amount: Joi.number().required(), // amount validation removed as per requirement
        }).options({ allowUnknown: true });
        const { error } = formValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // --- Add new checks here ---

        // Check if disbursed amount is negative or zero
        if (Number(amount) <= 0) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Disbursed amount cannot be zero or negative." });
        }

        // Check if final payable amount is zero
        if (Number(final_pay_amount) === 0 || Number(final_pay_amount) === 0.00) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Salary cannot be disbursed as the final payable amount is zero." });
        }

        // Check if disbursed amount exceeds final payable amount
        if (Number(amount) > Number(final_pay_amount)) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Disbursed amount cannot be greater than the final payable amount." });
        }

        // --- End of new checks ---

        //check user salary not disbursed in that month
        const dateObj = moment(month, "YYYY-MM-DD");
        const formattedMonth = dateObj.format("MM");
        const year = dateObj.format("YYYY");

        let slip_number;
        var queryResult;
        let gross_salary_sb_id;

        //get last pay slip number
        const checkSlipNumber = await db.query(`SELECT * FROM salary_disburses ORDER BY id dESC LIMIT 1`);

        if (checkSlipNumber.length > process.env.VALUE_ZERO) {
            const addedNumber = await incrementAfterZero(checkSlipNumber[0].slip_number);
            slip_number = addedNumber;
        } else {
            slip_number = "MCS" + moment(month).format("DDMMYYYY") + "001";
        }

        //check user salary not disbursed in that month
        const checkUserSalaryExistOrNot = await db.query(
            `SELECT * FROM salary_disburses WHERE user_id = ? AND MONTH(month) = ?`,
            [user_id, formattedMonth]
        );
        if (checkUserSalaryExistOrNot.length > process.env.VALUE_ZERO) {
            const dbAmount = Number(checkUserSalaryExistOrNot[0].gross_salary);

            gross_salary_sb_id = checkUserSalaryExistOrNot[0].id;
            // const finalAmount = dbAmount + Number(amount);
            const finalAmount = dbAmount;

            // update disbursal amount
            const updateQuery = `UPDATE salary_disburses SET gross_salary = ? WHERE user_id = ? AND MONTH(month) = ?`;
            const updateValues = [finalAmount, user_id, formattedMonth];
            queryResult = await db.query(updateQuery, updateValues);
        } else {
            //insert salary disbursed
            const insertQuery = `
                INSERT INTO salary_disburses(user_id, gross_salary, month, slip_number, created_by)
                VALUES(?, ?, ?, ?, ?)`;

            const insertValues = [user_id, gross_salary, month, slip_number, req.user.user_id];
            queryResult = await db.query(insertQuery, insertValues);
            gross_salary_sb_id = queryResult.insertId;
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            let db_due_amount = 0;
            let db_opening_balance = 0;
            // check user has already opening balance and due amount is present in that month or not
            const sqlDisburseHistoryQuery = await db.query(
                `SELECT amount, opening_balance, due_amount FROM salary_disburse_histories WHERE user_id = '${user_id}' AND YEAR(date) = '${year}' AND MONTH(date) = '${formattedMonth}' ORDER BY id DESC LIMIT 1`
            );

            if (sqlDisburseHistoryQuery.length > process.env.VALUE_ZERO) {
                db_opening_balance = sqlDisburseHistoryQuery[0].due_amount;
                db_due_amount = db_opening_balance - amount;
            } else {
                db_opening_balance = Number(final_pay_amount);
                db_due_amount = db_opening_balance - Number(amount);
            }

            // manage salary disbursed history
            const gross_salary_id = gross_salary_sb_id;
            const historyInsertQuery = `INSERT INTO salary_disburse_histories(gross_salary_id, user_id, date, amount, opening_balance, due_amount, transaction_number, transaction_mode, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const historyInsertValues = [
                gross_salary_id,
                user_id,
                month,
                amount,
                db_opening_balance,
                db_due_amount,
                transaction_number,
                transaction_mode,
                req.user.user_id,
            ];
            const historyQueryResult = await db.query(historyInsertQuery, historyInsertValues);

            return res.status(StatusCodes.OK).json({ status: true, message: "Salary disbursed successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! salary not disbursed" });
        }
    } catch (error) {
        return next(error);
    }
};

async function incrementAfterZero(inputString) {
    // Use a regular expression to find '0' followed by a number
    const regex = /0(\d+)/g;

    // Replace each match with the incremented number
    const resultString = inputString.replace(regex, (match, capturedNumber) => {
        const incrementedNumber = parseInt(capturedNumber) + 1;
        return `0${incrementedNumber}`;
    });

    return resultString;
}

module.exports = {
    getAllUserSalaryForDisbursal,
    getUserSalaryDisbursalDetailsById,
    markSalaryDisbursed,
    calculateAppliedAllowanceForUser,
    calculateTotalWorkingDay,
};

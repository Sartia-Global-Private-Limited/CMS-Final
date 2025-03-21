require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
    getAppliedOnAllowanceEmployeeWise,
    getAppliedOnAllowanceDesignationWise,
    calculatePagination,
    getAppliedOnAdminAllowanceEmployeeWise,
    getRecordWithWhereAndJoin,
} = require("../helpers/general");

// const createDeductionsType = async (req, res, next) => {
//     try {
//         const { deduction } = req.body;
//         console.log('deduction: ', deduction);
//         let submittedStatus = false;

//         if (deduction.length > process.env.VALUE_ZERO) {
//             for (let index = 0; index < deduction.length; index++) {
//                 const element = deduction[index];
//                 const name = element.name;
//                 const applied_type = element.applied_type;
//                 const appliedOnFormat = JSON.stringify([{ applied_on: element.applied_on.join(",") }]);
//                 const value_type = element.value_type;
//                 const by_employee = element.by_employee;
//                 const by_employer = element.by_employer;
//                 const createdBy = req.user.user_id;
//                 const value = by_employee;

//                 const validation = Joi.object({
//                     //type: Joi.required(),
//                     name: Joi.string().required(),
//                     applied_type: Joi.required(),
//                     applied_on: Joi.required(),
//                     value_type: Joi.required(),
//                     by_employee: Joi.required(),
//                     by_employer: Joi.required(),
//                 }).options({ allowUnknown: true });

//                 const { error } = validation.validate({
//                     name: name,
//                     applied_type: applied_type,
//                     applied_on: appliedOnFormat,
//                     value_type: value_type,
//                     by_employee: by_employee,
//                     by_employer: by_employer,
//                 });
//                 if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

//                 const insertQuery = `INSERT INTO deductions(name, applied_type, applied_on, value_type, value, by_employee, by_employer, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//                 const insertValues = [
//                     name,
//                     applied_type,
//                     appliedOnFormat,
//                     value_type,
//                     value,
//                     by_employee,
//                     by_employer,
//                     createdBy,
//                 ];

//                 // Only insert if all keys have valid values
//                 if (name && applied_type && value_type && value && appliedOnFormat && by_employee && by_employer) {
//                     const queryResult = await db.query(insertQuery, insertValues);

//                     if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//                         submittedStatus = true;
//                     } else {
//                         submittedStatus = false;
//                     }
//                 }
//             }

//             if (submittedStatus) {
//                 res.status(StatusCodes.OK).json({ status: true, message: "Deduction created successfully" });
//             } else {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" });
//             }
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

const createDeductionsType = async (req, res, next) => {
    try {
        const { deduction } = req.body;
        console.log('deduction: ', deduction);
        let submittedStatus = false;

        if (deduction.length > process.env.VALUE_ZERO) {
            for (let index = 0; index < deduction.length; index++) {
                const element = deduction[index];
                const name = element.name;
                const applied_type = element.applied_type;
                const applied_on_employee_ids_array = element.applied_on; // applied_on is now an array of employee IDs
                const applied_on_employee_ids_string = applied_on_employee_ids_array.join(","); // Join array to comma-separated string
                const appliedOnFormat = JSON.stringify([{ applied_on: applied_on_employee_ids_string }]); // Format as JSON string
                const value_type = element.value_type;
                const by_employee = element.by_employee;
                const by_employer = element.by_employer;
                const createdBy = req.user.user_id;
                const value = by_employee; // value is still derived from by_employee

                const validation = Joi.object({
                    name: Joi.string().required(),
                    applied_type: Joi.required(),
                    applied_on: Joi.array().items(Joi.number().integer()).required(), // Validate applied_on as array of numbers
                    value_type: Joi.required(),
                    by_employee: Joi.required(),
                    by_employer: Joi.required(),
                }).options({ allowUnknown: true });

                const { error } = validation.validate({
                    name: name,
                    applied_type: applied_type,
                    applied_on: applied_on_employee_ids_array, // Validate the array
                    value_type: value_type,
                    by_employee: by_employee,
                    by_employer: by_employer,
                });
                if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

                let deductionAlreadyExistsForAnyEmployee = false;
                for (const employee_id of applied_on_employee_ids_array) {
                    // Check for existing deduction for each employee ID
                    const conditions = [{ field: "name", operator: "=", value: name }];
                    const existingDeductions = await getRecordWithWhereAndJoin("deductions", conditions);

                    if (existingDeductions && existingDeductions.length > 0) {
                        for (const existingDeduction of existingDeductions) {
                            try {
                                const existingAppliedOnArray = JSON.parse(existingDeduction.applied_on);
                                if (existingAppliedOnArray && existingAppliedOnArray.length > 0 && existingAppliedOnArray[0].applied_on) {
                                    const existingEmployeeIds = existingAppliedOnArray[0].applied_on.split(",");
                                    if (existingEmployeeIds.includes(String(employee_id).trim())) { // Check if current employee_id exists (convert to string for comparison)
                                        deductionAlreadyExistsForAnyEmployee = true;
                                        break; // Exit inner loop, deduction exists for this employee
                                    }
                                }
                            } catch (parseError) {
                                console.error("Error parsing existing applied_on JSON:", parseError);
                                // Handle JSON parsing error if needed
                            }
                        }
                    }
                    if (deductionAlreadyExistsForAnyEmployee) {
                        break; // Exit outer loop, deduction exists for at least one employee
                    }
                }

                if (deductionAlreadyExistsForAnyEmployee) {
                    return res.status(StatusCodes.OK).json({ status: false, message: `"${name}" already exists for one or more of the provided employees/designation` });
                }

                if (name && applied_type && value_type && value && appliedOnFormat && by_employee && by_employer) {
                    const insertQuery = `INSERT INTO deductions(name, applied_type, applied_on, value_type, value, by_employee, by_employer, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                    const insertValues = [
                        name,
                        applied_type,
                        appliedOnFormat,
                        value_type,
                        value,
                        by_employee,
                        by_employer,
                        createdBy,
                    ];

                    // Only insert if all keys have valid values
                    if (name && applied_type && value_type && value && appliedOnFormat && by_employee && by_employer) {
                        const queryResult = await db.query(insertQuery, insertValues);

                        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                            submittedStatus = true;
                        } else {
                            submittedStatus = false;
                        }
                    }
                } else {
                    submittedStatus = true; // to continue loop for other deductions if some has empty values
                }
            }

            if (submittedStatus) {
                res.status(StatusCodes.OK).json({ status: true, message: "Deduction created successfully" });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCreatedDeductionTypes = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const role_id = req.user.user_type || 0;

        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition = ` WHERE name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT * FROM deductions ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`;
        const queryResult = await db.query(selectQuery, queryParams);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let values = [];
            let appliedType;
            let valueType;
            let valueWithSign;
            let appliedOn;

            for (const row of queryResult) {
                if (row.applied_type === "1") {
                    appliedType = "Employee wise";
                    if (role_id == 1) {
                        appliedOn = await getAppliedOnAdminAllowanceEmployeeWise(row.applied_on);
                    } else {
                        appliedOn = await getAppliedOnAllowanceEmployeeWise(row.applied_on);
                    }
                } else {
                    appliedType = "Designation wise";
                    appliedOn = await getAppliedOnAllowanceDesignationWise(row.applied_on);
                }

                if (row.value_type === "1") {
                    valueType = "Fixed amount";
                    valueWithSign = "\u20B9" + row.value;
                } else if (row.value_type === "2") {
                    valueType = "Percentage of basic salary";
                    valueWithSign = row.value + "\u0025";
                } else {
                    valueType = "Percentage of gross salary";
                    valueWithSign = row.value + "\u0025";
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by: row.created_by,
                    created_at: moment(row.created_at).format("DD-MM-YYYY"),
                    applied_on: appliedOn,
                });
            }
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateDeductionTypes = async (req, res, next) => {
    try {
        const { name, status, id } = req.body;
        const validation = Joi.object({
            name: Joi.string().required(),
            status: Joi.number().required(),
            id: Joi.number().integer().positive().required(),
        });

        const { error } = validation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE deduction_types SET name = ?, status= ?, updated_at = ? WHERE id= ?`;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [name, status, updatedAt, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Deduction type updated successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Deduction type not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteDeductionTypes = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM deduction_types WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: false, message: "Deduction types deleted successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Deduction types not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { createDeductionsType, getAllCreatedDeductionTypes, updateDeductionTypes, deleteDeductionTypes };

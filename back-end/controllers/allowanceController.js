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

// const createAllowances = async (req, res, next) => {
//     try {
//         const { allowance } = req.body;
//         if (allowance.length > process.env.VALUE_ZERO) {
//             let submittedStatus = false;

//             for (let index = 0; index < allowance.length; index++) {
//                 const element = allowance[index];
//                 const allowance_name = element.name;
//                 const applied_type = element.applied_type;
//                 let value_type = element.value_type;
//                 const value = element.value;
//                 const appliedOnFormat = JSON.stringify([{ applied_on: element.applied_on.join(",") }]);
//                 const createdBy = req.user.user_id;

//                 const validation = Joi.object({
//                     name: Joi.string().required(),
//                     applied_type: Joi.required(),
//                     value_type: Joi.required(),
//                     value: Joi.required(),
//                     applied_on: Joi.required(),
//                 }).options({ allowUnknown: true });

//                 const { error } = validation.validate({
//                     name: allowance_name,
//                     applied_type: applied_type,
//                     value_type: value_type,
//                     value: value,
//                     applied_on: appliedOnFormat,
//                 });
//                 if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

//                 const conditions = [{ field: "name", operator: "=", value: allowance_name }]
//                 const existingAllowance = await getRecordWithWhereAndJoin("allowances", conditions);

//                 const insertQuery = `INSERT INTO allowances(name, applied_type, applied_on, value_type, value, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

//                 value_type = value_type > 0 && JSON.stringify(value_type);
//                 const insertValues = [allowance_name, applied_type, appliedOnFormat, value_type, value, createdBy];

//                 // Only insert if all keys have valid values
//                 if (allowance_name && applied_type > 0 && value_type && value > 0 && appliedOnFormat) {
//                     const queryResult = await db.query(insertQuery, insertValues);

//                     if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//                         submittedStatus = true;
//                     } else {
//                         submittedStatus = false;
//                     }
//                 }
//             }
//             if (submittedStatus) {
//                 return res.status(StatusCodes.OK).json({ status: true, message: "Allowance submitted successfully" });
//             } else {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" });
//             }
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

const createAllowances = async (req, res, next) => {
    try {
        const { allowance } = req.body;
        if (allowance.length > process.env.VALUE_ZERO) {
            let submittedStatus = false;

            for (let index = 0; index < allowance.length; index++) {
                const element = allowance[index];
                const allowance_name = element.name;
                const applied_type = element.applied_type;
                let value_type = element.value_type;
                const value = element.value;
                // applied_on is now an array of employee IDs
                const applied_on_employee_ids_array = element.applied_on;
                const applied_on_employee_ids_string = applied_on_employee_ids_array.join(","); // Join array to comma-separated string
                const appliedOnFormat = JSON.stringify([{ applied_on: applied_on_employee_ids_string }]); // Format as JSON string

                const createdBy = req.user.user_id;

                const validation = Joi.object({
                    name: Joi.string().required(),
                    applied_type: Joi.required(),
                    value_type: Joi.required(),
                    value: Joi.required(),
                    applied_on: Joi.array().items(Joi.number().integer()).required(), // Validate applied_on as array of numbers
                }).options({ allowUnknown: true });

                const { error } = validation.validate({
                    name: allowance_name,
                    applied_type: applied_type,
                    value_type: value_type,
                    value: value,
                    applied_on: applied_on_employee_ids_array, // Validate the array
                });
                if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

                let allowanceAlreadyExistsForAnyEmployee = false;
                for (const employee_id of applied_on_employee_ids_array) {
                    // Check for existing allowance for each employee ID
                    const conditions = [{ field: "name", operator: "=", value: allowance_name }];
                    const existingAllowances = await getRecordWithWhereAndJoin("allowances", conditions);

                    if (existingAllowances && existingAllowances.length > 0) {
                        for (const existingAllowance of existingAllowances) {
                            try {
                                const existingAppliedOnArray = JSON.parse(existingAllowance.applied_on);
                                if (existingAppliedOnArray && existingAppliedOnArray.length > 0 && existingAppliedOnArray[0].applied_on) {
                                    const existingEmployeeIds = existingAppliedOnArray[0].applied_on.split(",");
                                    if (existingEmployeeIds.includes(String(employee_id).trim())) { // Check if current employee_id exists (convert to string for comparison)
                                        allowanceAlreadyExistsForAnyEmployee = true;
                                        break; // Exit inner loop, allowance exists for this employee
                                    }
                                }
                            } catch (parseError) {
                                console.error("Error parsing existing applied_on JSON:", parseError);
                                // Handle JSON parsing error if needed
                            }
                        }
                    }
                    if (allowanceAlreadyExistsForAnyEmployee) {
                        break; // Exit outer loop, allowance exists for at least one employee
                    }
                }

                if (allowanceAlreadyExistsForAnyEmployee) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: `"${allowance_name}" already exists for one or more of the provided employees/Designations` });
                }

                if (applied_type && value_type && value && allowance_name) {
                    const insertQuery = `INSERT INTO allowances(name, applied_type, applied_on, value_type, value, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

                    value_type = value_type > 0 && JSON.stringify(value_type);
                    const insertValues = [allowance_name, applied_type, appliedOnFormat, value_type, value, createdBy];

                    // Only insert if all keys have valid values
                    if (allowance_name && applied_type > 0 && value_type && value > 0 && appliedOnFormat) {
                        const queryResult = await db.query(insertQuery, insertValues);

                        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                            submittedStatus = true;
                        } else {
                            submittedStatus = false;
                        }
                    }
                } else {
                    submittedStatus = true; // to continue loop for other allowances if some has empty values
                }

            }
            if (submittedStatus) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Allowance submitted successfully" });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" });
        }
    } catch (error) {
        return next(error);
    }
};
const getAllCreatedAllowances = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const role_id = req.user.user_type || 0;

        const pageFirstResult = (currentPage - 1) * pageSize;
        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];
        if (searchData != null && searchData != "") {
            searchDataCondition = `WHERE name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT * FROM allowances ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`;
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
                    valueType = "Fixed amount,";
                    valueWithSign = "\u20B9" + row.value;
                } else {
                    valueType = "Percentage of basic salary";
                    valueWithSign = row.value + "\u0025";
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by: row.created_by,
                    created_at: moment(row.created_at).format(`DD-MM-YYYY`),
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

const getSingleAllowancesDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM allowances WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const values = [];
            let appliedType;
            let valueType;
            let valueWithSign;

            for (const row of queryResult) {
                if (row.applied_type === "1") {
                    appliedType = "Employee wise";
                    var appliedOn = await getAppliedOnAllowanceEmployeeWise(row.applied_on);
                } else {
                    appliedType = "Designation wise";
                    var appliedOn = await getAppliedOnAllowanceDesignationWise(row.applied_on);
                }

                if (row.value_type === "1") {
                    valueType = "Fixed amount";
                    valueWithSign = "\u20B9" + row.value;
                } else {
                    valueType = "Percentage of basic salary";
                    valueWithSign = row.value + "\u0025";
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by: row.created_by,
                    created_at: moment(row.created_at).format(`DD-MM-YYYY`),
                    applied_on: appliedOn,
                });
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            return request.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateAllowances = async (req, res, next) => {
    try {
        const { name, id } = req.body;
        const validation = Joi.object({
            name: Joi.string().required(),
        });
        const { error } = validation.validate({ name });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE allowances SET name=? WHERE id=?`;
        const queryResult = await db.query(updateQuery, [name, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: false, message: "Allowances updated successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong,please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteAllowance = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM allowances WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ sttaus: false, message: "Allowance deleted successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ sttaus: false, message: "Allowance not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createAllowances,
    getAllCreatedAllowances,
    updateAllowances,
    deleteAllowance,
    getSingleAllowancesDetails,
};

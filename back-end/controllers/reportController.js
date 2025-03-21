var moment = require("moment");
const ExcelJS = require("exceljs");
const fs = require("fs");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
    getSubModuleForReports,
    getModuleOfSubModuleForReports,
    isPlural,
    makePlural,
} = require("../helpers/commonHelper");
const { getCreatedByDetails } = require("../helpers/general");

const getAllModules = async (req, res, next) => {
    try {
        const queryResult = await db.query(
            `SELECT modules.id as module_id, modules.title as module_name FROM modules WHERE modules.is_deleted = '0' ORDER BY modules.id`
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (const row of queryResult) {
                const getSubmodule = await getSubModuleForReports(row.module_id);
                finalData.push({
                    module_id: row.module_id,
                    module_name: row.module_name,
                });

                if (getSubmodule.length > process.env.VALUE_ZERO) {
                    for (const submodule of getSubmodule) {
                        const moduleOfSubModules = await getModuleOfSubModuleForReports(submodule.sub_module_id);

                        finalData.push({
                            module_id: submodule.sub_module_id,
                            module_name: submodule.sub_module_name,
                        });

                        if (moduleOfSubModules.length > process.env.VALUE_ZERO) {
                            for (const moduleOFSubModule of moduleOfSubModules) {
                                finalData.push({
                                    module_id: moduleOFSubModule.module_of_sub_module_id,
                                    module_name: moduleOFSubModule.module_of_sub_module_name,
                                });
                            }
                        }
                    }
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Modules found",
                data: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Module not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getTableNameColumnNameOnModuleId = async (req, res, next) => {
    try {
        const { module_id, module_name } = req.body;

        const moduleValidationSchema = Joi.object({
            module_id: Joi.number().required(),
            module_name: Joi.string().required(),
        });

        const { error } = moduleValidationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // check module has plural or not
        var plural_module_name = "";
        var finalData = [];

        const isPluralModuleName = await isPlural(module_name);
        if (isPluralModuleName) {
            plural_module_name = module_name;
        } else {
            const makeStringPlural = await makePlural(module_name);
            plural_module_name = makeStringPlural;
        }

        const query = `DESCRIBE ${plural_module_name}`;
        const queryResult = await db.query(query);

        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                finalData.push({
                    name: plural_module_name + " - " + row.Field,
                });
            }
        }

        res.send(finalData);
    } catch (error) {
        return next(error);
    }
};

const generateReport = async (req, res, next) => {
    try {
        const { report_data } = req.body;

        if (report_data.length > process.env.VALUE_ZERO) {
            // Initialize an array to store the results of each query
            let results;
            let columnsWithTableName;
            let query;
            let hasUserIdColumn = false;

            // Iterate through report_data and generate queries
            for (const reportItem of report_data) {
                const tableName = report_data[0].tableName;
                const dynamicTableName = reportItem.tableName;

                const columns = reportItem.columns;
                if (report_data.length == "1") {
                    columnsWithTableName = reportItem.columns
                        .map((column) => `${dynamicTableName}.${column}`)
                        .join(", ");
                    query = `SELECT ${columnsWithTableName} FROM ${tableName}`;
                } else {
                    // Initialize arrays to store SELECT and JOIN clauses
                    const selectClauses = [];
                    const joinClauses = [];

                    // Iterate through report_data to build SELECT and JOIN clauses
                    report_data.forEach((tableInfo, index) => {
                        const { tableName, columns } = tableInfo;

                        // Build the SELECT clause without aliases
                        const selectClause = columns.map((column) => `${tableName}.${column}`).join(", ");
                        selectClauses.push(selectClause);

                        // Skip the first table in the loop since it doesn't need a JOIN
                        if (index > 0) {
                            // Build the JOIN clause
                            const joinClause = `LEFT JOIN ${tableName} ON ${report_data[0].tableName}.user_id = ${tableName}.user_id`;
                            joinClauses.push(joinClause);
                        }
                    });

                    // Combine the SELECT and JOIN clauses to create the final query
                    const baseQuery = `SELECT ${selectClauses.join(", ")} FROM ${
                        report_data[0].tableName
                    } ${joinClauses.join(" ")}`;
                    query = baseQuery;
                }
                // Include 'user_id' in the columns to fetch if it's not already in the list
                //const hasUserIdColumn = columns.includes("user_id");
                if (columns.includes("user_id")) {
                    hasUserIdColumn = true;
                    // No need to break the loop; continue checking other tables
                }
                // Execute the query
                const rows = await db.query(query);

                // Check if 'user_id' is included in the columns
                // If user_id column is present, fetch user_name for each row
                if (hasUserIdColumn) {
                    const userDetailPromises = rows.map(async (row) => {
                        const userDetails = await getCreatedByDetails(row.user_id);
                        return userDetails.name || "";
                    });

                    const userNames = await Promise.all(userDetailPromises);

                    // Update each row with the user_name
                    rows.forEach((row, index) => {
                        row.user_name = userNames[index];
                        delete row.user_id;
                    });
                }

                // Add the query result to the results array
                results = rows;
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                data: results,
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Something went wrong with your request",
            });
        }
    } catch (error) {
        return next(error);
        let errorMessage = "Something went wrong with your request";

        // Customize error message for specific error types
        if (error.code === "ER_BAD_FIELD_ERROR") {
            // Check if the error message contains the table and column names
            const match = /Unknown column '(.+?)\.(.+?)' in 'on clause'/.exec(error.message);
            if (match) {
                const tableName = match[1];
                const columnName = match[2];
                errorMessage = `Record not matched with <b>${tableName}</b> module. Please remove <b>${tableName}</b> module and fetch again.`;
            }
        } else if (error.code === "ANOTHER_ERROR_CODE") {
            // Add additional custom error handling if needed
            errorMessage = "Another specific error occurred.";
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: errorMessage,
        });
    }
};

const makeDynamicQuery = (req, res, next) => {
    try {
        const { report_data } = req.body;

        if (!Array.isArray(report_data) || report_data.length === 0) {
            return res.status(400).json({ status: false, message: "Invalid report_data format" });
        }

        // Initialize arrays to store SELECT and JOIN clauses
        const selectClauses = [];
        const joinClauses = [];

        // Iterate through report_data to build SELECT and JOIN clauses
        report_data.forEach((tableInfo, index) => {
            const { tableName, columns } = tableInfo;

            // Build the SELECT clause without aliases
            const selectClause = columns.map((column) => `${tableName}.${column}`).join(", ");
            selectClauses.push(selectClause);

            // Skip the first table in the loop since it doesn't need a JOIN
            if (index > 0) {
                // Build the JOIN clause
                const joinClause = `LEFT JOIN ${tableName} ON ${report_data[0].tableName}.user_id = ${tableName}.user_id`;
                joinClauses.push(joinClause);
            }
        });

        // Combine the SELECT and JOIN clauses to create the final query
        const baseQuery = `SELECT ${selectClauses.join(", ")} FROM ${
            report_data[0].tableName
        } ${joinClauses.join(" ")}`;

        // Log or use the generated query

        // You can execute the query or send it as a response, depending on your use case.

        return res.status(200).json({
            status: true,
            message: "Query generated successfully",
            query: baseQuery,
        });
    } catch (error) {
        return next(error);
    }
};

async function doesUserIdExist(data) {
    for (const obj of data) {
        if (obj.name === "attendances - user_id") {
            return true; // user_id exists
        }
    }
    return false; // user_id does not exist
}

module.exports = {
    getAllModules,
    getTableNameColumnNameOnModuleId,
    generateReport,
    makeDynamicQuery,
};

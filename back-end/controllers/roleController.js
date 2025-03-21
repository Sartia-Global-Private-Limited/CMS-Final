require("dotenv").config();
const { con, makeDb } = require("../db");
require("dotenv").config();
const db = makeDb();
const { createDefaultPermission } = require("../helpers/general");
const moment = require("moment");

const createRole = async (req, res, next) => {
    try {
        const { name, module } = req.body;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const createdBy = req.user.user_id;
        const userType = req.user.user_type;
        const moduleJson = JSON.stringify(module);
        const checkExistingRole = await db.query(`SELECT * FROM roles WHERE name = '${name}'`);

        if (checkExistingRole.length > 0) {
            // Check if a role with the same name already exists and is not deleted
            const existingActiveRole = checkExistingRole.find(
                (role) => role.name.toLowerCase() === name.toLowerCase() && role.is_deleted === "0"
            );
            if (existingActiveRole) {
                return res.status(400).json({ status: false, message: "Role already exists" });
            }

            // Check if a role with the same name exists but is marked as deleted
            const existingDeletedRole = checkExistingRole.find((role) => role.name == name && role.is_deleted == "1");
            if (existingDeletedRole) {
                const updateQuery = `
                    UPDATE roles 
                    SET name = ?, created_by = ?, created_for = ?, modules = ?, created_at = ?, is_deleted = '0' 
                    WHERE id = ?`;
                const updateValues = [name, createdBy, userType, moduleJson, createdAt, existingDeletedRole.id];

                const updateResult = await db.query(updateQuery, updateValues); // Ensure db.query returns a promise
                if (updateResult.affectedRows > 0) {
                    await createDefaultPermission(existingDeletedRole.id);
                    return res.status(200).json({ status: true, message: `${name} role Created successfully` });
                } else {
                    return res.status(500).json({ status: false, message: "Failed to update role. Please try again." });
                }
            }
        }

        // If no matching role exists, create a new one
        const insertQuery = `
            INSERT INTO roles (name, created_by, created_for, modules, created_at) 
            VALUES (?, ?, ?, ?, ?)`;
        const insertValues = [name, createdBy, userType, moduleJson, createdAt];

        try {
            const insertResult = await db.query(insertQuery, insertValues); // Ensure db.query returns a promise
            if (insertResult.insertId > 0) {
                await createDefaultPermission(insertResult.insertId);
                return res.status(200).json({ status: true, message: `${name} role created successfully` });
            } else {
                return res.status(500).json({ status: false, message: "Failed to create role. Please try again." });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllRoles = async (req, res, next) => {
    try {
        const role_id = req.params.role_id || "";
        // console.log('role_id: ', role_id);
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM roles WHERE status = '1' AND is_deleted = '0' AND id NOT IN ('1')`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let sql = "";

        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND roles.name LIKE '%${searchData}%'`;
            queryParams.unshift(`%${searchData}%`);
        }
        if (searchDataCondition != "") {
            searchDataCondition += ` AND is_deleted = '0'`;
        } else {
            searchDataCondition = ` AND is_deleted = '0'`;
        }

        if (role_id && role_id != "") {
            sql = `SELECT * 
                FROM roles 
                WHERE status = 1 AND is_deleted = '0' AND id = '${role_id}'
            `;
        } else {
            sql = `SELECT * 
                FROM roles 
                WHERE status = 1 ${searchDataCondition} AND id NOT IN ('1') 
                ORDER BY id DESC LIMIT 
                ${pageFirstResult}, ${pageSize}`;
        }

        // console.log('sql: ', sql);
        let pageDetails = [];
        db.query(sql, (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (results.length > process.env.VALUE_ZERO) {
                const filteredResults = results.filter((role) => role.id != process.env.SUPER_ADMIN_ROLE_ID);
                // console.log('filteredResults: ', filteredResults);
                // const total = filteredResults.length;
                // totalPages = Math.round(total / pageSize);
                // results.map((item) => {
                //     item.modules = JSON.parse(item.modules);
                // });
                results.map((item) => {
                    item.modules = item && item.modules ? JSON.parse(item.modules) : undefined;
                });
                
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                if (role_id && role_id != "") {
                    res.status(200).json({
                        status: true,
                        message: "All Roles fetched successfully.",
                        data: results[0],
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        message: "All Roles fetched successfully.",
                        data: filteredResults,
                        pageDetails: pageDetails[0],
                    });
                }
            } else {
                res.status(400).json({
                    status: false,
                    message: "Roles not found",
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const editRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM roles WHERE id='${id}'`;
        db.query(selectQuery, (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (results.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetch successfully", data: results[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { role_id, name, module } = req.body;

        const moduleJson = JSON.stringify(module);
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const updatedBy = req.user.user_type;
        const updateQuery = `UPDATE roles SET name='${name}', modules='${moduleJson}', updated_at='${updatedAt}', updated_by='${updatedBy}' WHERE id='${role_id}'`;
        db.query(updateQuery, (err, results) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (results.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Roles updated successfully" });
            } else {
                return res
                    .status(500)
                    .json({ status: false, message: "Something went wrong, please try after sometime" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const role_id = req.params.id;
        // const deleteQuery = `DELETE FROM roles WHERE id='${role_id}'`;
        let adminQuery = `SELECT id, name FROM admins WHERE user_type = '${role_id}' AND is_deleted = '0'`;
        let userQuery = `SELECT id, name FROM users WHERE user_type = '${role_id}' AND is_deleted = '0'`;
        const adminUser = await db.query(adminQuery);
        // if admin user not found
        if (adminUser.length == 0) {
            const user = await db.query(userQuery);
            // if user not found
            if (user.length == 0) {
                const deleteQuery = `UPDATE roles SET is_deleted = '1' WHERE id='${role_id}'`;
                db.query(deleteQuery, (err, results) => {
                    if (err) throw new Error(err);

                    if (results.affectedRows > process.env.VALUE_ZERO) {
                        res.status(200).json({ status: true, message: "Role deleted successfully" });
                    } else {
                        res.status(403).json({
                            status: false,
                            message: "Something went wrong, please try after sometime",
                        });
                    }
                });
            } else {
                return res
                    .status(403)
                    .json({ status: false, message: "The role cannot be deleted because user exists" });
            }
        } else {
            return res.status(403).json({ status: false, message: "The role cannot be deleted because user exists" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllRolesForDropdown = async (req, res, next) => {
    try {
        // const selectQuery = `SELECT id, name FROM roles WHERE status = '1'`;
        const userType = req.user.user_type;
        let selectQuery;

        if (userType == 1) {
            // selectQuery = `SELECT id, name FROM roles WHERE status = '1' AND name IN ('Energy Company','Contractor','Dealer','Admin')`;
            // selectQuery = `SELECT id, name FROM roles WHERE status = '1' AND created_by = '${process.env.SUPER_ADMIN_ROLE_ID}' AND created_for = '${process.env.SUPER_ADMIN_ROLE_ID}' AND is_deleted = '0' ORDER BY id DESC`;
            selectQuery = `SELECT id, name FROM roles WHERE status = '1' AND created_by = '${process.env.SUPER_ADMIN_ROLE_ID}' AND created_for LIKE '%${process.env.SUPER_ADMIN_ROLE_ID}%' AND is_deleted = '0' ORDER BY id DESC`;
        } else {
            // selectQuery = `SELECT id, name FROM roles WHERE status = '1' AND name NOT IN ('Super Admin','Energy Company','Contractor','Dealer', 'Admin')`;
            selectQuery = `SELECT id, name FROM roles WHERE status = '1' AND created_for LIKE '%${userType}%' AND is_deleted = '0' ORDER BY id DESC`;
        }
        db.query(selectQuery, async (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (results.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Role Fetched successfully", data: results });
            } else {
                res.status(403).json({ status: false, message: "Roles not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllRoles, createRole, editRole, updateRole, deleteRole, getAllRolesForDropdown };

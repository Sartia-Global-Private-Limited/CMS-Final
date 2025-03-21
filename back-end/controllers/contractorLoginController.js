const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation } = require("../helpers/validation");
const Joi = require("joi");
const { getRecord } = require("../helpers/general");
const db = makeDb();
const moment = require("moment");

const contractorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const adminQuery = await db.query(
            `SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role FROM admins LEFT JOIN plans ON admins.plan_id = plans.id INNER JOIN roles ON roles.id = admins.user_type WHERE admins.email='${email}'`
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
        if (adminQuery.length > 0) {
            const userData = {
                ...adminQuery[0],
                company_logo: adminQuery[0]?.logo || "",
            };
            // if super-admin logs in return invalid panel to access
            if(userData.user_type == process.env.SUPER_ADMIN_ROLE_ID) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid access in Client panel",
                });
            }
            // account is active or not
            if (userData.status == process.env.INACTIVE_STATUS) {
                return res.status(400).json({
                    status: false,
                    message: "Your account is not activated yet. Please contact our support team for assistance.",
                });
            } else if (userData.status === process.env.ACCOUNT_SUSPENDED) {
                return res.status(403).json({
                    status: false,
                    message: "Your account is suspended, please contact with super administrator",
                });
            }

            if (userData.is_deleted === process.env.ACTIVE_STATUS) {
                return res.status(403).json({ status: false, message: "Your account is deleted with us" });
            }

            const isCorrectPassword = await bcrypt.compare(password, userData.password);

            if (isCorrectPassword) {
                delete userData.password;
                const token = jwt.sign(
                    {
                        user_id: userData.id,
                        user_type: userData.user_type,
                        employee_id: userData.employee_id,
                        unique_id: userData.unique_id,
                        user_data: userData,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: "8h", // Set token expiry to 8 hours
                    }
                );
                // Set Authorization header
                res.set("Authorization", `Bearer ${token}`).cookie("token", token, cookieOptions);
                return res.status(200).json({ status: true, message: "Login Successfully", data: userData, token });
            } else {
                return res.status(400).json({ status: false, message: "Wrong Credentials" });
            }
        } else {
            const userQuery = await db.query(`SELECT * FROM users WHERE email='${email}'`);

            if (userQuery.length > 0) {
                const isCorrectPassword = await bcrypt.compare(password, userQuery[0].password);

                // account is active or not
                if (userQuery[0].status == process.env.INACTIVE_STATUS) {
                    return res.status(400).json({
                        status: false,
                        message: "Your account is not activated yet. Please contact our support team for assistance.",
                    });
                } else if (userQuery[0].status === process.env.ACCOUNT_SUSPENDED) {
                    return res.status(403).json({
                        status: false,
                        message: "Your account is suspended, please contact with super administrator",
                    });
                }

                if (userQuery[0].is_deleted === process.env.ACTIVE_STATUS) {
                    return res.status(403).json({ status: false, message: "Your account is deleted with us" });
                }

                if (isCorrectPassword) {
                    delete userQuery[0].password;

                    const fetchAdminForLoggedInUser = await db.query(
                        `SELECT plan_id FROM admins WHERE id = ${userQuery[0].created_by}`
                    );
                    // assign plan for logged in user
                    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                    await db.query(
                        `UPDATE users SET plan_id = ${fetchAdminForLoggedInUser[0].plan_id}, updated_at = '${updatedAt}' WHERE id = ${userQuery[0].id}`
                    );

                    const token = jwt.sign(
                        {
                            user_id: userQuery[0].id,
                            user_type: userQuery[0].user_type,
                            employee_id: userQuery[0].employee_id,
                            unique_id: userQuery[0].unique_id,
                            user_data: userQuery,
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "8h", // Set token expiry to 8 hours
                        }
                    );
                    // Set Authorization header
                    res.set("Authorization", `Bearer ${token}`).cookie("token", token, cookieOptions);
                    return res
                        .status(200)
                        .json({ status: true, message: "Login Successfully", data: userQuery[0], token });
                } else {
                    return res.status(400).json({ status: false, message: "Wrong Credentials" });
                }
            } else {
                return res.status(500).json({ status: false, message: "Email Invalid" });
            }
        }
    } catch (error) {
        return next(error);
    }
};

const renewPlan = async (req, res, next) => {
    try {
        const contractorId = req.user.user_id;
        const { plan_id } = req.body;
        /** renew the current contractor plan  */
        const [planRecord] = await getRecord("plans", "id", plan_id);
        if (!planRecord) {
            return res.status(404).json({
                status: false,
                message: "Plan not found",
            });
        }
        const daysObject = {
            week: 7,
            month: 30,
            year: 365,
        };
        const numberOfDays = daysObject[planRecord?.duration] || 0;
        const [userDetails] = await getRecord("admins", "id", contractorId);
        if (!userDetails) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
        /** Renew Check can't update plan  */
        if (userDetails.plan_id != plan_id) {
            return res.status(400).json({
                status: false,
                message: "You can only renew your plan",
            });
        }
        const planRenewQuery = `
            UPDATE admins
            SET plan_expire_date = COALESCE(plan_expire_date, CURDATE()) + INTERVAL ? DAY
            WHERE id = ?;
            `;
        await db.query(planRenewQuery, [numberOfDays, contractorId]);
        return res.status(200).json({
            status: true,
            message: "Plan renewed successfully",
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { contractorLogin, renewPlan };

var moment = require("moment");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const db = makeDb();
const {
    subUserFormValidation,
    loginValidation,
    subUserProfileUpdateValidation,
    changePasswordValidation,
} = require("../helpers/validation");
var Buffer = require("buffer/").Buffer;
const { StatusCodes } = require("http-status-codes");

const createSubUser = async (req, res, next) => {
    try {
        const { name, username, email, password, mobile, user_type } = req.body;
        const joining_date = moment(new Date(req.body.joining_date)).format("YYYY-DD-MM");
        const { error } = subUserFormValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedData = Buffer.from(password).toString("base64");
        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, admin_id, created_by, user_type) VALUES ('${name}', '${username}', '${email}', '${hashPassword}', '${encodedData}', '${mobile}', '${joining_date}', '${createdBy}', '${createdBy}', '${user_type}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const subUserLoggedIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        var inputData = "";
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const isEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                req.body.email
            );
        if (isEmail) {
            inputData = "email='" + req.body.email + "'";
        } else {
            inputData = "username='" + req.body.email + "'";
        }

        const selectQuery = `SELECT * FROM users WHERE ${inputData}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                if (result[0].status == process.env.INACTIVE_STATUS) {
                    return res
                        .status(StatusCodes.FORBIDDEN)
                        .json({ status: false, message: "Your account is not verified yet, please wait for verify" });
                } else if (result[0].status === process.env.ACCOUNT_SUSPENDED) {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        status: false,
                        message: "Your account is suspended, please contact with super administrator",
                    });
                }

                if (result[0].is_deleted === process.env.ACTIVE_STATUS) {
                    return res
                        .status(StatusCodes.FORBIDDEN)
                        .json({ status: false, message: "Your account is deleted with us" });
                }

                const isCorrectPassword = await bcrypt.compare(password, result[0].password);
                if (isCorrectPassword) {
                    const token = jwt.sign(
                        { user_id: result[0].id, user_type: result[0].user_type },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "30d" }
                    );
                    res.status(200).json({
                        status: true,
                        message: "Sub user logged in successfully",
                        token: token,
                        data: result[0],
                    });
                } else {
                    return res.status(400).json({ status: false, message: "Wrong credentials." });
                }
            } else {
                return res.status(400).json({ status: false, message: "Email Invalid" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSubUserProfileDetails = (req, res, next) => {
    try {
        const loggedInUserId = req.user.user_id;
        const selectQuery = `SELECT * FROM users WHERE id='${loggedInUserId}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({
                    status: true,
                    message: "Profile details fetched successfully",
                    data: result[0],
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateSubUserProfileDetails = (req, res, next) => {
    try {
        const { name, email, mobile } = req.body;
        const loggedInUserId = req.user.user_id;

        const { error } = subUserProfileUpdateValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${mobile}' WHERE id='${loggedInUserId}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Profile details updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const subUserChangePassword = async (req, res, next) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        const { error } = changePasswordValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });
        if (new_password != confirm_password)
            return res.status(400).json({ status: false, message: "New password and confirm password do not match" });

        const loggedInUserId = req.user.user_id;
        const selectQuery = `SELECT * FROM users WHERE id='${loggedInUserId}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                const isCorrectPassword = await bcrypt.compare(old_password, result[0].password);
                if (isCorrectPassword) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(confirm_password, salt);
                    const encodedData = Buffer.from(confirm_password).toString("base64");

                    const updateQuery = `UPDATE users SET password='${hashPassword}', base_64_password='${encodedData}' WHERE id='${loggedInUserId}'`;
                    db.query(updateQuery, async (err, result) => {
                        if (err) return res.status(500).json({ status: false, message: err });

                        if (result.affectedRows > process.env.VALUE_ZERO) {
                            res.status(200).json({
                                status: true,
                                message: "Password changed successfully",
                                data: result[0],
                            });
                        } else {
                            return res
                                .status(400)
                                .json({ status: false, message: "Something went wrong, please try again" });
                        }
                    });
                } else {
                    return res
                        .status(400)
                        .json({ status: false, message: "Wrong old password, please verify your old password" });
                }
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createSubUser,
    subUserLoggedIn,
    getSubUserProfileDetails,
    updateSubUserProfileDetails,
    subUserChangePassword,
};

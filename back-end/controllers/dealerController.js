var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, adminCreateValidation, contractorValidations } = require("../helpers/validation");
const { getDealerAllUserById, getPendingContractorUsersById } = require("../helpers/general");
const { generatePanelIdForAdmin } = require("../helpers/panelHelper");
var Buffer = require("buffer/").Buffer;
const Joi = require("joi");

const createDealer = async (req, res, next) => {
    try {
        const { name, email, password, contact_no, alt_number, address_1, country, city, pin_code, status } = req.body;
        const { error } = adminCreateValidation.validate({ email: email, password: password });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const createdBy = req.user.user_id;
        const userType = process.env.DEALER_ROLE_ID;
        var storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(500).json({ status: false, message: err.message });
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const panel_id = await generatePanelIdForAdmin(userType, name);
        const insertQuery = `
            INSERT INTO admins(name, email, password, contact_no, alt_number, user_type, address_1, country, city, pin_code, status, image, created_by, panel_id) 
            VALUES('${name}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${userType}','${address_1}','${country}','${city}','${pin_code}','${status}','${storePath}', '${createdBy}','${panel_id}')
        `;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Dealer created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const createDealerUser = async (req, res, next) => {
    try {
        const { name, email, password, mobile, joining_date } = req.body;
        const { error } = adminCreateValidation.validate({ email: email, password: password });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const createdBy = req.user.user_id;
        var adminId = "";
        const loggedUserType = req.user.user_type;
        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            adminId = req.body.dealer_id;
        } else {
            adminId = req.user.user_id;
        }
        const user_type = process.env.USER_ROLE_ID;

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");
        var storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        }

        const insertQuery = `
            INSERT INTO users(name, username, email, password, base_64_password, mobile, joining_date, user_type, admin_id, image, created_by) 
            VALUES('${name}', '${name}', '${email}', '${hashPassword}', '${encodedPassword}', '${mobile}', '${joining_date}', '${user_type}', '${adminId}', '${storePath}', '${createdBy}')
        `;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Dealer user created successfully" });
            } else {
                return res.status(500).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getDealersAndUsers = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.DEALER_ROLE_ID}' AND admins.is_deleted='0'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.id as admin_id, admins.name, admins.email, admins.image, admins.contact_no, admins.status, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.DEALER_ROLE_ID}' AND admins.is_deleted='0' ${searchDataCondition} ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        users: await getDealerAllUserById(element.admin_id),
                    };
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getDealerAndUserSingleRecordByIdAndType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const type = req.params.type;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        if (type == "Dealer") {
            var selectQuery = `SELECT admins.id as admin_id, admins.name, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.country, admins.city, admins.pin_code, admins.description, admins.image, admins.status, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.id='${id}' AND admins.user_type ='${process.env.DEALER_ROLE_ID}'`;
        } else {
            var selectQuery = `SELECT users.id as admin_id, users.name, users.email, users.mobile, users.joining_date, users.image, users.user_type as role_id, users.admin_id as dealer_id, users.status, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type WHERE users.id='${id}' AND users.user_type ='${process.env.USER_ROLE_ID}'`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const values = [];
                var user_type_number = "";
                if (result[0].user_type == "Dealer") {
                    user_type_number = "1";
                } else {
                    user_type_number = "2";
                }

                for (var rows of result) {
                    values.push({
                        admin_id: rows.admin_id,
                        dealer_id: rows.dealer_id,
                        name: rows.name,
                        email: rows.email,
                        contact_no: rows.contact_no,
                        alt_number: rows.alt_number,
                        address_1: rows.address_1,
                        country: rows.country,
                        city: rows.city,
                        pin_code: rows.pin_code,
                        description: rows.description,
                        mobile: rows.mobile,
                        joining_date: rows.joining_date,
                        image: rows.image,
                        user_type: rows.user_type,
                        user_type_number: user_type_number,
                        status: rows.status,
                    });
                }

                res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateDealerDetails = async (req, res, next) => {
    try {
        var type = req.body.type;
        const id = req.body.id;

        var storePath = "";
        const updateAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(500).json({ status: false, message: err.message });
            });
        } else {
            storePath = req.body.image;
        }

        if (type == "Dealer") {
            const { name, email, contact_no, alt_number, address_1, country, city, pin_code, status } = req.body;

            const updateQuery = `UPDATE admins SET name = ?, email = ?, contact_no = ?, alt_number = ?, address_1 = ?, country = ?, city = ?, pin_code = ?, image = ?, status = ?, updated_at = ? WHERE id = ?`;

            var queryResult = await db.query(updateQuery, [
                name,
                email,
                contact_no,
                alt_number,
                address_1,
                country,
                city,
                pin_code,
                storePath,
                status,
                updateAt,
                id,
            ]);
        } else {
            const { name, email, mobile, joining_date, status } = req.body;
            const updateQuery = `UPDATE users SET name = ?, email = ?, mobile = ?, joining_date = ?, image = ?, status = ?, updated_at = ? WHERE id = ?`;

            var queryResult = await db.query(updateQuery, [
                name,
                email,
                mobile,
                joining_date,
                storePath,
                status,
                updateAt,
                id,
            ]);
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Updated successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteDealerAndUsers = async (req, res, next) => {
    try {
        const id = req.params.id;
        const type = req.params.type;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        if (type == "Dealer") {
            var updateQuery = `UPDATE admins SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.DEALER_ROLE_ID}'`;
        } else {
            var updateQuery = `UPDATE users SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.USER_ROLE_ID}'`;
        }

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Account has been deleted successfully" });
            } else {
                return res
                    .status(403)
                    .json({ status: false, message: "Something went wrong, please try after sometime" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllDealersAndUsersWithPendingAccountStatus = async (req, res, next) => {
    try {
        const dealerRole = process.env.DEALER_ROLE_ID;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${dealerRole}' AND admins.is_deleted='0' AND admins.status='0'`;

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${dealerRole}' AND admins.is_deleted='0' AND admins.status='0' ${searchDataCondition} ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        console.log("selectQuery: ", selectQuery);

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        users: await getPendingContractorUsersById(element.admin_id),
                    };
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails,
                    });
                });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const dealersAccountStatusAction = async (req, res, next) => {
    try {
        const { admin_id, status, user_type } = req.body;
        const accountStatusValidation = Joi.object({
            admin_id: Joi.number().required(),
            status: Joi.number().required(),
            user_type: Joi.string().required(),
        });

        const { error } = accountStatusValidation.validate(req.body);

        if (error) return res.status(403).json({ status: false, message: error.message });

        var responseMessage = "";

        if (status == "1") {
            responseMessage = "Activated";
        } else {
            responseMessage = "Rejected";
        }

        if (user_type == "Dealer") {
            var updateQuery = `UPDATE admins SET status = '${status}' WHERE id = '${admin_id}'`;
        } else {
            var updateQuery = `UPDATE users SET '${status}' WHERE id = '${admin_id}'`;
        }

        const queryResult = await db.query(updateQuery);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({
                status: true,
                message: "User account status changed to " + responseMessage + " successfully",
            });
        } else {
            res.status(404).json({ status: true, message: "Error! User account status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createDealer,
    createDealerUser,
    getDealersAndUsers,
    getDealerAndUserSingleRecordByIdAndType,
    deleteDealerAndUsers,
    updateDealerDetails,
    getAllDealersAndUsersWithPendingAccountStatus,
    dealersAccountStatusAction,
};

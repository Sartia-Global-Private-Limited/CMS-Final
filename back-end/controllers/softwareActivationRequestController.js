var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { subUserFormValidation, teamValidations, checkPositiveInteger } = require("../helpers/validation");
const { getSubModule, getCreatedUserNameFromAdmin } = require("../helpers/general");

const getAllPendingRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total, admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests LEFT JOIN admins ON admins.id=software_activation_requests.user_id LEFT JOIN companies ON companies.company_id=software_activation_requests.company_id LEFT JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.INACTIVE_STATUS}'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND companies.company_name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests LEFT JOIN admins ON admins.id=software_activation_requests.user_id LEFT JOIN companies ON companies.company_id=software_activation_requests.company_id LEFT JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.INACTIVE_STATUS}' ${searchDataCondition} ORDER BY software_activation_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
                res.status(200).json({ status: true, message: "success", data: result, pageDetails: pageDetails[0] });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const viewSinglePendingRequestDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error, value } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title as module_name, software_activation_requests.status, software_activation_requests.requested_date, software_activation_requests.image, software_activation_requests.remark, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests LEFT JOIN admins ON admins.id=software_activation_requests.user_id LEFT JOIN companies ON companies.company_id=software_activation_requests.company_id LEFT JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.id='${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, sub_module: await getSubModule(element.module_id) };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "success", data: values });
                });
                //res.status(200).json({status: true, message: "success", data: result})
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const approvedSoftwareActivationRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const remark = req.body.remark;
        var storePath = "";
        const { error, value } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const approved_by = req.user.user_id;
        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/software_activation/" + imageName;
            storePath = "/software_activation/" + imageName;
            image.mv(uploadPath, (error, response) => {
                if (error) return res.status(403).json({ status: false, message: error.message });
            });
        }

        const updateQuery = `UPDATE software_activation_requests SET status = '1', image='${storePath}', remark='${remark}', approved_by = '${approved_by}' WHERE id = '${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const selectSoftwareActivationRequestQuery = `SELECT * FROM software_activation_requests WHERE id = '${id}'`;
                const softwareActivationRequestDetails = await db.query(selectSoftwareActivationRequestQuery);
                const userId = softwareActivationRequestDetails[0].user_id;
                const moduleId = softwareActivationRequestDetails[0].module_id;
                const getRoleQuery = `SELECT * FROM admins WHERE id='${userId}'`;
                const roleQueryResult = await db.query(getRoleQuery);
                const roleId = roleQueryResult[0].user_type;

                const insertPermissionQuery = `INSERT INTO permissions(module_id, role_id,  user_id) VALUES('${moduleId}', '${roleId}', '${userId}')`;
                db.query(insertPermissionQuery, async (err, result) => {
                    if (err) return res.status(403).json({ status: false, message: err });
                    if (result.affectedRows > process.env.VALUE_ZERO) {
                        res.status(200).json({ status: true, message: "Request approved successfully" });
                    } else {
                        return res
                            .status(400)
                            .json({ status: false, message: "Something went wrong, please try again" });
                    }
                });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const rejectedSoftwareActivationRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const remark = req.body.remark;

        // const {error, value} = checkPositiveInteger.validate({id: id,remark:remark })
        // if(error) return res.status(400).json({status: false, message: error.message})

        const rejected_by = req.user.user_id;
        const updateQuery = `UPDATE software_activation_requests SET status = '2', remark='${remark}', approved_by = '${rejected_by}' WHERE id = '${id}'`;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });
            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Request rejected successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteSoftwareActivationRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error, value } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM software_activation_requests WHERE id = '${id}'`;
        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Request deleted successfully" });
            } else {
                return res.status(403).json({ status: true, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(software_activation_requests.id) as total FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.ACTIVE_STATUS}'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND companies.company_name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.ACTIVE_STATUS}' ${searchDataCondition} ORDER BY software_activation_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, approvedBy: await getCreatedUserNameFromAdmin(element.approved_by) };
                });
                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
                    res.status(200).json({
                        status: true,
                        message: "success",
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

const getAllRejectedRequests = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(software_activation_requests.id) as total FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='2'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND companies.company_name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by as rejected_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='2' ${searchDataCondition} ORDER BY software_activation_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, rejectedBy: await getCreatedUserNameFromAdmin(element.rejected_by) };
                });
                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
                    res.status(200).json({
                        status: true,
                        message: "success",
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

module.exports = {
    getAllPendingRequests,
    viewSinglePendingRequestDetails,
    approvedSoftwareActivationRequest,
    rejectedSoftwareActivationRequest,
    deleteSoftwareActivationRequest,
    getAllApprovedRequests,
    getAllRejectedRequests,
};

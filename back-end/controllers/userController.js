require("dotenv").config();
let moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const fs = require("fs");
const { checkPositiveInteger, userCreateValidations, loginValidation } = require("../helpers/validation");
const { roleById, getUserDetails, calculatePagination, getRecord } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const { insertEmployeeActivityLog } = require("../helpers/activityLog");
const requestIp = require("request-ip");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
var Buffer = require("buffer/").Buffer;
const Joi = require("joi");
const xlsx = require("xlsx");
const path = require("path");
const {
    generatePanelIdForUser,
    generateSuperAdminEmpId,
    generateEmpIdForContractorUsers,
} = require("../helpers/panelHelper");
const {
    uploadFile,
    addCreatedByCondition,
    generateEmployeeId,
    checkUserWithDisabledStatus,
} = require("../helpers/commonHelper");

const createUsers = async (req, res, next) => {
    try {
        var response = "";
        var logRoleId = 0;
        var logUserId = 0;
        // let team_id_val = 0;

        let {
            name,
            email,
            password,
            mobile,
            joining_date,
            // status,
            role_id,
            address,
            skills,
            employment_status,
            pan,
            aadhar,
            epf_no,
            esi_no,
            bank_name,
            ifsc_code,
            account_number,
            department,
            family_info,
            salary,
            salary_term,
            dob,
            team_id,
            credit_limit,
            manager_id,
            supervisor_id,
        } = req.body;

        const createdBy = req.user.user_id;

        const { error } = userCreateValidations.validate({
            name: name,
            email: email,
            aadhar: aadhar,
            pan: pan,
            joining_date: joining_date,
            salary: salary,
            mobile: mobile,
            salary_term,
            role_id,
            employment_status,
            credit_limit,
        });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (!/^\d+$/.test(credit_limit)) {
            return res.status(400).json({ message: "Invalid credit_limit. It should be a numeric value." });
        }
        credit_limit = parseInt(credit_limit, 10);

        const existing_user_data = await checkUserWithDisabledStatus(name, email, aadhar, mobile);
        // console.log("existing_user_data: ", existing_user_data);

        // if user is found and user status is active => if user, status = 1
        if (existing_user_data && existing_user_data.status == "1") {

            // Check if the existing user was created by the same user
            if (existing_user_data.created_by === createdBy) {
                // User already exists in the same panel
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `${name} already exists in the same panel`,
                    metadata: existing_user_data
                });
            } else {
                // User exists in another panel
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `${name} already active in another panel`,
                    metadata: existing_user_data
                });
            }
            // return res.status(StatusCodes.OK).json({ status: false, message: `${name} already active in other panel`, metadata: existing_user_data });
        }

        // if user, status = 0
        if (!existing_user_data) {
            const checkUniqu = await checkUnique(email, pan, aadhar, "", epf_no, esi_no, createdBy);
            // console.log('checkUniqu: ', checkUniqu);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }

        let storePath = "";
        let graduationStorePath = "";
        let postGraduationStorePath = "";
        let doctorateStorePath = "";
        let panCardStorePath = "";
        let aadharCard1StorePath = "";
        let aadharCard2StorePath = "";
        let bankDocumentsStorePath = "";

        response = "Trying to create user";

        if (req.files != null) {
            //upload image
            if (req.files.image != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/user_images/" + imageName;
                storePath = "/user_images/" + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.graduation != null) {
                const graduation = req.files.graduation;
                const graduationImageName = Date.now() + graduation.name;
                const graduationUploadPath = process.cwd() + "/public/user_images/" + graduationImageName;
                graduationStorePath = "/user_images/" + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.post_graduation != null) {
                const post_graduation = req.files.post_graduation;
                const postGraduationImageName = Date.now() + post_graduation.name;
                const postGraduationUploadPath = process.cwd() + "/public/user_images/" + postGraduationImageName;
                postGraduationStorePath = "/user_images/" + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate;
                const doctorateImageName = Date.now() + doctorate.name;
                const doctorateUploadPath = process.cwd() + "/public/user_images/" + doctorateImageName;
                doctorateStorePath = "/user_images/" + doctorateImageName;

                doctorate.mv(doctorateUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //pan card image upload
            if (req.files.upload_pan_card != null) {
                const pan_card = req.files.upload_pan_card;
                const panCardName = Date.now() + pan_card.name;
                const panCardUploadPath = process.cwd() + "/public/user_images/" + panCardName;
                panCardStorePath = "/user_images/" + panCardName;

                pan_card.mv(panCardUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //Aadhar card image upload
            if (req.files.upload_aadhar_card_image1 != null) {
                const aadharCard1 = req.files.upload_aadhar_card_image1;
                const aadharCard1Name = Date.now() + aadharCard1.name;
                const aadharCard1dUploadPath = process.cwd() + "/public/user_images/" + aadharCard1Name;
                aadharCard1StorePath = "/user_images/" + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2;
                const aadharCard2Name = Date.now() + aadharCard2.name;
                const aadharCard2dUploadPath = process.cwd() + "/public/user_images/" + aadharCard2Name;
                aadharCard2StorePath = "/user_images/" + aadharCard2Name;

                aadharCard2.mv(aadharCard2dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //upload bank documents
            if (req.files.upload_bank_documents != null) {
                const bankDocuments = req.files.upload_bank_documents;
                const bankDocumentsName = Date.now() + bankDocuments.name;
                const bankDocumentsUploadPath = process.cwd() + "/public/user_images/" + bankDocumentsName;
                bankDocumentsStorePath = "/user_images/" + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            response = "Error in upload user images";
        }

        const getRoleOnId = await roleById(role_id);
        const userType = req.user.user_type;
        logRoleId = role_id;
        const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
        let employee_id = "";
        const type = 2; //for users table
        if (req.user.user_type == "1" || req.user.user_type == "3") {
            employee_id = (await generateEmployeeId(type, createdBy)) || (await generateEmpIdForContractorUsers());
        }

        // let manager_id = null;
        // let supervisor_id = null;

        if (role_id == 40) {
            // manager_id = team_id;
            supervisor_id = null;
        } else if (role_id == 7) {
            // supervisor_id = team_id;
            manager_id = null;
        }

        let insertQuery;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        insertQuery = `
                INSERT INTO users(name, username, email, password, mobile, joining_date, image, role_id, user_type, created_by, address, graduation, post_graduation, doctorate, skills, team_id, employment_status, pan, pan_card_image, aadhar, aadhar_card_front_image, aadhar_card_back_image, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, family_info, panel_id,  employee_id, dob, credit_limit, manager_id, supervisor_id, created_at) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)   `;

        let hashPassword = "";
        if (password != "") {
            const salt = bcrypt.genSaltSync(10);
            hashPassword = await bcrypt.hash(password, salt);
        }

        let values = [
            name,
            name,
            email,
            hashPassword,
            mobile,
            joining_date,
            storePath,
            role_id,
            role_id,
            createdBy,
            address,
            graduationStorePath,
            postGraduationStorePath,
            doctorateStorePath,
            skills,
            team_id ? team_id : null,
            employment_status,
            pan,
            panCardStorePath,
            aadhar,
            aadharCard1StorePath,
            aadharCard2StorePath,
            epf_no,
            esi_no,
            bank_name,
            ifsc_code,
            account_number,
            bankDocumentsStorePath,
            department,
            family_info,
            panel_id,
            employee_id,
            dob,
            credit_limit,
            manager_id ? manager_id : null,
            supervisor_id ? supervisor_id : null,
            createdAt,
        ];

        // const checkExistingEmail = await db.query(`SELECT email FROM users WHERE email = '${email}'`);
        // if (checkExistingEmail.length > 0) return res.status(400).json({ status: false, message: "Email already exists" });

        const queryResult = await db.query(insertQuery, values);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // add into team (id  team id is given)
            if (team_id != "") {
                const teamQuery = `SELECT * FROM hr_teams WHERE id = ${team_id} AND is_deleted = '0'`;
                const teamDetail = await db.query(teamQuery);
                if (teamDetail.length > 0) {
                    const parsedMembers = teamDetail[0].team_member ? JSON.parse(teamDetail[0].team_member) : [];
                    const members = parsedMembers?.team_member ? parsedMembers.team_member : [];
                    console.log("members: ", members);
                    members.push(insertedData.insertId);
                    const teamAddQuery = await db.query(`UPDATE hr_teams SET team_member = ? WHERE id = ?`, [
                        JSON.stringify(members),
                        team_id,
                    ]);
                    if (teamAddQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log(`Employee added to '${teamDetail[0].team_name}' Team`);
                    } else {
                        console.log(`Unable to add employee to '${teamDetail[0].team_name}' Team`);
                    }
                }
                // add into team (if manager id OR supervisor id is given)
            } else {
                if (supervisor_id != "") {
                    const teamQuery = `SELECT * FROM hr_teams WHERE supervisor_id = ${supervisor_id} AND is_deleted = '0'`;
                    const teamDetail = await db.query(teamQuery);
                    if (teamDetail.length > 0) {
                        const members = teamDetail[0].team_member ? JSON.parse(teamDetail[0].team_member) : [];
                        // console.log('members: ', members);
                        members.push(insertedData.insertId);
                        const teamAddQuery = await db.query(`UPDATE hr_teams SET team_member = ? WHERE id = ?`, [
                            JSON.stringify(members),
                            team_id,
                        ]);
                        if (teamAddQuery.affectedRows > process.env.VALUE_ZERO) {
                            console.log(`Employee added to '${teamDetail[0].team_name}' Team`);
                        } else {
                            console.log(`Unable to add employee to '${teamDetail[0].team_name}' Team`);
                        }
                    }
                }
            }

            // add supervisor/manager data
            logUserId = queryResult.insertId;
            const unique_id = `U${logUserId}`;
            await db.query("UPDATE users SET unique_id = ? WHERE id = ?", [unique_id, logUserId]);

            const fetchAdminLogo = await db.query(`SELECT logo FROM admins WHERE user_type = '1' AND status = '1'`);
            if (fetchAdminLogo.length > 0) {
                await db.query("UPDATE users SET logo = ? WHERE id = ?", [fetchAdminLogo[0].logo, logUserId]);
            }

            //salary generated from
            const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
            const salaryValues = [logUserId, role_id, joining_date, salary, salary_term, createdBy];

            const salaryQueryResult = await db.query(salaryInsert, salaryValues);

            response = "User created successfully";
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = "Something went wrong, please try again later";
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        return next(error);
    }

    const logData = [
        {
            userId: logUserId,
            roleId: logRoleId,
            timestamp: moment().unix(),
            action: "createUsers method of userController ",
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];

    const userActivityLog = await insertEmployeeActivityLog(logData);
};

async function checkUnique(email = null, pan = null, aadhar = null, mobile = null, epf_no = null, esi_no = null, created_by) {
    try {
        let nonUniqueFields = [];
        let user = "";

        // Check email uniqueness
        if (email && email != "") {
            let emailQuery = `SELECT email FROM users WHERE email = ? AND is_deleted = '0'`;
            created_by && (emailQuery += ` AND created_by = '${created_by}'`);
            let emailRows = await db.query(emailQuery, [email]);
            if (emailRows.length > 0) {
                nonUniqueFields.push("Email");
                user = emailRows[0].email;
            } else {
                emailQuery = `SELECT email FROM admins WHERE email = ? AND is_deleted = '0'`;
                created_by && (emailQuery += ` AND created_by = '${created_by}'`);
                emailRows = await db.query(emailQuery, [email]);
                if (emailRows.length > 0) {
                    nonUniqueFields.push("Email");
                    user = emailRows[0].email;
                }
            }
        }

        // Check pan uniqueness (if provided)
        if (pan && pan != "") {
            let panQuery = `SELECT pan, email FROM users WHERE pan = ? AND is_deleted = '0'`;
            created_by && (panQuery += ` AND created_by = '${created_by}'`);
            let panRows = await db.query(panQuery, [pan]);
            if (panRows.length > 0) {
                nonUniqueFields.push("PAN");
                user = panRows[0].email;
            } else {
                panQuery = `SELECT pan_number, email FROM admins WHERE pan_number = ? AND is_deleted = '0'`;
                created_by && (panQuery += ` AND created_by = '${created_by}'`);
                panRows = await db.query(panQuery, [pan]);
                if (panRows.length > 0) {
                    nonUniqueFields.push("PAN");
                    user = panRows[0].email;
                }
            }
        }

        // Check aadhar uniqueness
        if (aadhar && aadhar != "") {
            let aadharQuery = `SELECT aadhar, email FROM users WHERE aadhar = ? AND is_deleted = '0'`;
            created_by && (aadharQuery += ` AND created_by = '${created_by}'`);
            let aadharRows = await db.query(aadharQuery, [aadhar]);
            if (aadharRows.length > 0) {
                nonUniqueFields.push("Aadhar No.");
                user = aadharRows[0].email;
            } else {
                aadharQuery = `SELECT aadhar, email FROM admins WHERE aadhar = ? AND is_deleted = '0'`;
                created_by && (aadharQuery += ` AND created_by = '${created_by}'`);
                aadharRows = await db.query(aadharQuery, [aadhar]);
                if (aadharRows.length > 0) {
                    nonUniqueFields.push("Aadhar No.");
                    user = aadharRows[0].email;
                }
            }
        }

        // Check mobile uniqueness
        if (mobile && mobile != "") {
            let mobileQuery = `SELECT mobile, email FROM users WHERE mobile = ? AND is_deleted = '0'`;
            created_by && (mobileQuery += ` AND created_by = '${created_by}'`);
            let mobileRows = await db.query(mobileQuery, [mobile]);
            if (mobileRows.length > 0) {
                nonUniqueFields.push("Mobile");
                user = mobileRows[0].email;
            } else {
                mobileQuery = `SELECT contact_no, email FROM admins WHERE contact_no = ? AND is_deleted = '0'`;
                created_by && (mobileQuery += ` AND created_by = '${created_by}'`);
                mobileRows = await db.query(mobileQuery, [mobile]);
                if (mobileRows.length > 0) {
                    nonUniqueFields.push("Mobile");
                    user = mobileRows[0].email;
                }
            }
        }

        // Check epf uniqueness
        if (epf_no && epf_no != "") {
            let epfQuery = `SELECT epf_no, email FROM users WHERE epf_no = ? AND is_deleted = '0'`;
            created_by && (epfQuery += ` AND created_by = '${created_by}'`);
            let epfRows = await db.query(epfQuery, [epf_no]);
            if (epfRows.length > 0) {
                nonUniqueFields.push("EPF No.");
                user = epfRows[0].email;
            } else {
                epfQuery = `SELECT epf_no, email FROM admins WHERE epf_no = ? AND is_deleted = '0'`;
                created_by && (epfQuery += ` AND created_by = '${created_by}'`);
                epfRows = await db.query(epfQuery, [epf_no]);
                if (epfRows.length > 0) {
                    nonUniqueFields.push("EPF No.");
                    user = epfRows[0].email;
                }
            }
        }

        // Check esi uniqueness
        if (esi_no && esi_no != "") {
            let esiQuery = `SELECT esi_no, email FROM users WHERE esi_no = ? AND is_deleted = '0'`;
            created_by && (esiQuery += ` AND created_by = '${created_by}'`);
            let esiRows = await db.query(esiQuery, [esi_no]);
            if (esiRows.length > 0) {
                nonUniqueFields.push("ESIC No.");
                user = esiRows[0].email;
            } else {
                esiQuery = `SELECT esi_no, email FROM admins WHERE esi_no = ? AND is_deleted = '0'`;
                created_by && (esiQuery += ` AND created_by = '${created_by}'`);
                esiRows = await db.query(esiQuery, [esi_no]);
                if (esiRows.length > 0) {
                    nonUniqueFields.push("ESIC No.");
                    user = esiRows[0].email;
                }
            }
        }

        let dataResult = { status: nonUniqueFields.length === 0, data: nonUniqueFields, user: user };

        return dataResult;
    } catch (err) {
        throw err;
    }
}

const updateUsers = async (req, res, next) => {
    try {
        var response = "";
        var logRoleId = 0;
        var logUserId = 0;
        let team_id_val = 0;

        let {
            name,
            email,
            password,
            mobile,
            joining_date,
            // status,
            role_id,
            address,
            graduation,
            post_graduation,
            doctorate,
            skills,
            employment_status,
            pan,
            aadhar,
            epf_no,
            esi_no,
            bank_name,
            ifsc_code,
            account_number,
            department,
            family_info,
            team_id,
            employee_id,
            supervisor_id,
            manager_id,
            image,
            upload_pan_card,
            upload_aadhar_card_image1,
            salary,
            salary_term,
            upload_aadhar_card_image2,
            upload_bank_documents,
            dob,
            credit_limit,
        } = req.body;

        const createdBy = req.user.user_id;

        if (team_id != "undefined" && team_id != "") {
            team_id_val = team_id;
            supervisor_id = "";
            manager_id = "";
        }

        const { error } = userCreateValidations.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const [user_data] = await getUserDetails(employee_id);

        // unique Aadhar no. check
        if (user_data.aadhar != aadhar) {
            const checkUniqu = await checkUnique("", "", aadhar, "", "", "", createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // unique PAN no. check
        if (user_data.pan != pan) {
            const checkUniqu = await checkUnique("", pan, "", "", "", "", createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // unique EPF no. check
        if (user_data.epf_no != epf_no) {
            const checkUniqu = await checkUnique("", "", "", "", epf_no, "", createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // unique ESIC no. check
        if (user_data.esi_no != esi_no) {
            const checkUniqu = await checkUnique("", "", "", "", "", esi_no, createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }

        let storePath = "";
        let graduationStorePath = "";
        let postGraduationStorePath = "";
        let doctorateStorePath = "";
        let panCardStorePath = "";
        let aadharCard1StorePath = "";
        let aadharCard2StorePath = "";
        let bankDocumentsStorePath = "";

        response = "Trying to create user";

        if (req.files != null) {
            //upload image
            if (req.files.image != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/user_images/" + imageName;
                storePath = "/user_images/" + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                storePath = image;
            }

            if (req.files.graduation != null) {
                const graduation = req.files.graduation;
                const graduationImageName = Date.now() + graduation.name;
                const graduationUploadPath = process.cwd() + "/public/user_images/" + graduationImageName;
                graduationStorePath = "/user_images/" + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                graduationStorePath = graduation;
            }

            if (req.files.post_graduation != null) {
                const post_graduation = req.files.post_graduation;
                const postGraduationImageName = Date.now() + post_graduation.name;
                const postGraduationUploadPath = process.cwd() + "/public/user_images/" + postGraduationImageName;
                postGraduationStorePath = "/user_images/" + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                postGraduationStorePath = post_graduation;
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate;
                const doctorateImageName = Date.now() + doctorate.name;
                const doctorateUploadPath = process.cwd() + "/public/user_images/" + doctorateImageName;
                doctorateStorePath = "/user_images/" + doctorateImageName;

                doctorate.mv(doctorateUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                doctorateStorePath = doctorate;
            }

            //pan card image upload
            if (req.files.upload_pan_card != null) {
                const pan_card = req.files.upload_pan_card;
                const panCardName = Date.now() + pan_card.name;
                const panCardUploadPath = process.cwd() + "/public/user_images/" + panCardName;
                panCardStorePath = "/user_images/" + panCardName;

                pan_card.mv(panCardUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                panCardStorePath = upload_pan_card;
            }

            //Aadhar card image upload
            if (req.files.upload_aadhar_card_image1 != null) {
                const aadharCard1 = req.files.upload_aadhar_card_image1;
                const aadharCard1Name = Date.now() + aadharCard1.name;
                const aadharCard1dUploadPath = process.cwd() + "/public/user_images/" + aadharCard1Name;
                aadharCard1StorePath = "/user_images/" + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                aadharCard1StorePath = upload_aadhar_card_image1;
            }

            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2;
                const aadharCard2Name = Date.now() + aadharCard2.name;
                const aadharCard2dUploadPath = process.cwd() + "/public/user_images/" + aadharCard2Name;
                aadharCard2StorePath = "/user_images/" + aadharCard2Name;

                aadharCard2.mv(aadharCard2dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                aadharCard2StorePath = upload_aadhar_card_image2;
            }

            //upload bank documents
            if (req.files.upload_bank_documents != null) {
                const bankDocuments = req.files.upload_bank_documents;
                const bankDocumentsName = Date.now() + bankDocuments.name;
                const bankDocumentsUploadPath = process.cwd() + "/public/user_images/" + bankDocumentsName;
                bankDocumentsStorePath = "/user_images/" + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                bankDocumentsStorePath = upload_bank_documents;
            }

            response = "Error in upload user images";
        } else {
            storePath = image != null ? image : "";
            graduationStorePath = graduation != null ? graduation : "";
            postGraduationStorePath = post_graduation != null ? post_graduation : "";
            doctorateStorePath = doctorate != null ? doctorate : "";
            panCardStorePath = upload_pan_card != null ? upload_pan_card : "";
            aadharCard1StorePath = upload_aadhar_card_image1 != null ? upload_aadhar_card_image1 : "";
            aadharCard2StorePath = upload_aadhar_card_image2 != null ? upload_aadhar_card_image2 : "";
            bankDocumentsStorePath = upload_bank_documents != null ? upload_bank_documents : "";
        }

        const updated_by = req.user.user_id;
        if (team_id != null && team_id > 0) {
            const fetchTeamId = await db.query(`SELECT team_id FROM users WHERE id = ?`, [employee_id]);
            if (fetchTeamId.length > 0 && fetchTeamId[0].team_id != team_id) {
                const oldTeamId = fetchTeamId[0].team_id;
                // get team members to add new one
                const getOldTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [
                    oldTeamId,
                ]);

                // Get team members to remove one
                if (getOldTeamMemberList.length > process.env.VALUE_ZERO) {
                    const oldTeamDbData = getOldTeamMemberList[0];
                    const oldTeamDbMembers = oldTeamDbData.team_member;
                    const oldTeamDbId = oldTeamDbData.id;

                    // Parse the JSON string into a JavaScript object (assuming `team_member` is a JSON string)
                    let oldTeamMemberList;
                    try {
                        oldTeamMemberList = JSON.parse(oldTeamDbMembers);
                    } catch (error) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Error parsing team member data.",
                        });
                    }

                    // Assuming the "team_member" is an array of numeric IDs
                    let oldTeam_member_ids = oldTeamMemberList.team_member.split(",").map(Number);
                    if (oldTeam_member_ids.length <= process.env.VALUE_ONE) {
                        return res.status(StatusCodes.OK).json({
                            status: false,
                            message: `Sorry! you can't delete the last member of team`,
                        });
                    }

                    // Remove the employee ID from the team members
                    const valueToRemove = parseInt(employee_id, 10); // Ensure `employee_id` is an integer

                    const updatedTeamMembers = oldTeam_member_ids.filter((member) => member !== valueToRemove);

                    // Convert the modified JavaScript object back to a JSON string
                    oldTeamMemberList.team_member = updatedTeamMembers.join(","); // If team_member is stored as a string
                    const updatedJsonString = JSON.stringify(oldTeamMemberList);

                    // Update the team members in the database
                    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
                    const updateQuery = await db.query(
                        "UPDATE hr_teams SET team_member = ?, updated_by = ?, updated_at = ? WHERE id = ?",
                        [updatedJsonString, updated_by, updated_at, oldTeamDbId]
                    );

                    if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Member removed from Old Team");
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Failed to update team members.",
                        });
                    }
                }

                const getTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [team_id]);

                if (getTeamMemberList.length > process.env.VALUE_ZERO) {
                    const teamDbData = getTeamMemberList[0];
                    const teamDbMembers = teamDbData.team_member;
                    const teamDbId = teamDbData.id;

                    // Parse the JSON string into a JavaScript object
                    const teamMemberList = JSON.parse(teamDbMembers);
                    // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
                    const team_member_ids = teamMemberList.team_member.split(",").map(Number);
                    const valueToAdd = Number(employee_id); //JSON.parse(user_id);

                    // Check if the user_id already exists in the team_member_ids array
                    if (team_member_ids.includes(Number(employee_id))) {
                        throw new Error("User already exists in the team");
                    }

                    team_member_ids.push(valueToAdd);

                    //Convert the modified JavaScript object back to a JSON string
                    teamMemberList.team_member = team_member_ids.join(",");
                    const updatedJsonString = JSON.stringify(teamMemberList);

                    // update team members with new members
                    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
                    const updateQuery = await db.query(
                        "UPDATE hr_teams SET team_member = ?, updated_by = ?, updated_at = ? WHERE id = ?",
                        [updatedJsonString, updated_by, updated_at, teamDbId]
                    );

                    if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Member updated to team successfully");
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Something went wrong, Unable to add to team",
                        });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Invalid new team details.",
                    });
                }
            }
        }

        const getRoleOnId = await roleById(role_id);
        // const userType = getRoleOnId.role;
        logRoleId = role_id;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        // let manager_id = null;
        // let supervisor_id = null;

        // if SUPERVISOR
        // if (role_id == 40) {
        //     manager_id = team_id;
        //     // if SUB_USER
        // } else if (role_id == 7) {
        //     supervisor_id = team_id;
        // }

        let updateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, joining_date = ?, image = ?, role_id = ?, user_type = ?, created_by = ?, address = ?, graduation = ?, post_graduation = ?, doctorate = ?, skills = ?, team_id = ?, employment_status = ?, pan = ?, pan_card_image = ?, aadhar = ?, aadhar_card_front_image = ?, aadhar_card_back_image = ?, epf_no = ?, esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, bank_documents = ?, department = ?, family_info = ?, dob = ?, updated_at = ?, credit_limit = ?`;
        const values = [
            name,
            name,
            email,
            mobile,
            joining_date,
            storePath,
            // status,
            role_id,
            role_id,
            createdBy,
            address,
            graduationStorePath,
            postGraduationStorePath,
            doctorateStorePath,
            skills,
            team_id_val ? team_id_val : null,
            employment_status,
            pan,
            panCardStorePath,
            aadhar,
            aadharCard1StorePath,
            aadharCard2StorePath,
            epf_no,
            esi_no,
            bank_name,
            ifsc_code,
            account_number,
            bankDocumentsStorePath,
            department,
            family_info,
            dob,
            updatedAt,
            credit_limit,
        ];

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);
            updateQuery += `, password = ?`;
            values.push(hashPassword);
        }

        if (manager_id != "" && manager_id > 0 && supervisor_id == "") {
            updateQuery += `, manager_id = ?, supervisor_id = ?`;
            values.push(manager_id, null);
        }
        if (supervisor_id != "" && supervisor_id > 0 && manager_id == "") {
            updateQuery += `, supervisor_id = ?, manager_id = ?`;
            values.push(supervisor_id, null);
        }

        updateQuery += ` WHERE id = ?`;
        values.push(employee_id);

        const queryResult = await db.query(updateQuery, values);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            //salary generated from
            const salaryInsert = `
            UPDATE salaries SET user_type='${role_id}',date_of_hire='${joining_date}',salary='${salary}',salary_term='${salary_term}' WHERE user_id="${employee_id}"`;
            const salaryUpdate = await db.query(salaryInsert);
            if (salaryUpdate.affectedRows > process.env.VALUE_ZERO) {
                console.log("Salary updated successfully");
            } else {
                const insertSalary = await db.query(
                    "INSERT INTO salaries(user_id,user_type,date_of_hire,salary,salary_term, created_by) VALUES(?,?,?,?,?,?)",
                    [employee_id, role_id, joining_date, salary, salary_term, req.user.user_id]
                );

                if (insertSalary.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Salary inserted successfully");
                } else {
                    return res
                        .status(400)
                        .json({ status: false, message: "Something went wrong, while inserting/updating salary" });
                }
            }

            logUserId = employee_id;
            response = "User updated successfully";
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = "Something went wrong, please try again later";
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }

    const logData = [
        {
            userId: logUserId,
            roleId: logRoleId,
            timestamp: moment().unix(),
            action: "updateUsers method of userController ",
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];

    const userActivityLog = await insertEmployeeActivityLog(logData);
};

// const getAllManagerUsers = async (req, res, next) => {
//     try {
//         const type = req.query.type || "";
//         const team = req.query.team || "";

//         let table;
//         let selectQuery;
//         const role_id = req.user.user_type;
//         if (role_id == 1) {
//             if (!type) {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Type is required" });
//             }
//         }
//         if (type != "" && type == 1) {
//             selectQuery = `SELECT admins.id AS id, admins.name as name, admins.email, admins.employee_id
//             FROM admins 
//             WHERE admins.user_type = '${managerRoleId}'`;
//             table = "admins";
//         } else {
//             selectQuery = `
//             SELECT id, name, email, mobile as contact_no, joining_date, image, status, user_type, created_by, employee_id
//             FROM users 
//             WHERE is_deleted = '0' AND status = '1' AND outlet_id IS NULL`;
//             table = "users";
//         }

//         selectQuery = addCreatedByCondition(selectQuery, {
//             table: table,
//             created_by: req.user.user_id,
//             role: req.user.user_type,
//         });

//         const queryResult = await db.query(selectQuery);
//         let userIds = [];
//         let filteredResult;
//         let teamQuery;
//         // console.log('req.user.user_id: ', req.user.user_id);
//         if (queryResult.length > 0) {
//             let modifiedResult = [];
//             for (const result of queryResult) {
//                 // console.log('result: ', result);
//                 if (team == 1) {
//                     teamQuery = await db.query(
//                         `SELECT hr_teams.supervisor_id, hr_teams.manager_id, users.name FROM hr_teams JOIN users ON hr_teams.supervisor_id = users.id WHERE hr_teams.supervisor_id = '${result.id}' AND hr_teams.is_deleted = 0 AND hr_teams.created_by = '${req.user.user_id}'`
//                     );
//                     // teamQuery.length > 0 && console.log("teamQuery: ", teamQuery);

//                     if (teamQuery.length > 0) {
//                         userIds.push(result.id);
//                     }
//                     // teamQuery.length > 0 && console.log("userIds: ", userIds);

//                     modifiedResult.push({
//                         id: result.id,
//                         name: result.name,
//                         email: result.email,
//                         mobile: result.contact_no,
//                         joining_date: result.joining_date,
//                         image: result.image,
//                         status: result.status,
//                         user_type: result.user_type,
//                         created_by: result.created_by,
//                         employee_id: result.employee_id,
//                     });

//                     // filteredResult = modifiedResult.filter((result) => !userIds.includes(result.id));
//                     filteredResult = modifiedResult;
//                 }
//             }
//             if (team == 1) {
//                 return res
//                     .status(StatusCodes.OK)
//                     .json({ status: true, message: "Fetched successfully", data: filteredResult });
//             } else {
//                 return res
//                     .status(StatusCodes.OK)
//                     .json({ status: true, message: "Fetched successfully", data: queryResult });
//             }
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };


// const getAllManagerUsers = async (req, res, next) => {
//     try {
//         const type = req.query.type || "";
//         const team = req.query.team || "";

//         let table;
//         let selectQuery;
//         const role_id = req.user.user_type;
//         if (role_id == 1) {
//             if (!type) {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Type is required" });
//             }
//         }
//         if (type != "" && type == 1) {
//             selectQuery = `SELECT admins.id AS id, admins.name as name, admins.email, admins.employee_id
//             FROM admins 
//             WHERE admins.user_type = '${managerRoleId}'`;
//             table = "admins";
//         } else {
//             selectQuery = `
//             SELECT id, name, email, mobile as contact_no, joining_date, image, status, user_type, created_by, employee_id
//             FROM users 
//             WHERE is_deleted = '0' AND status = '1' AND outlet_id IS NULL`;
//             table = "users";
//         }

//         selectQuery = addCreatedByCondition(selectQuery, {
//             table: table,
//             created_by: req.user.user_id,
//             role: req.user.user_type,
//         });

//         const queryResult = await db.query(selectQuery);
//         let userIds = [];
//         let filteredResult;

//         // Get manager and supervisor IDs
//         const teamQuery = await db.query(
//             `SELECT DISTINCT manager_id, supervisor_id FROM hr_teams WHERE is_deleted = 0 AND created_by = '${req.user.user_id}'`
//         );
//         const managerIds = teamQuery.map(row => row.manager_id);
//         const supervisorIds = teamQuery.map(row => row.supervisor_id);

//         if (queryResult.length > 0) {
//             let modifiedResult = [];
//             for (const result of queryResult) {
//                 if (team == 1) {
//                     teamQuery = await db.query(
//                         `SELECT hr_teams.supervisor_id, users.name FROM hr_teams JOIN users ON hr_teams.supervisor_id = users.id WHERE hr_teams.supervisor_id = '${result.id}' AND hr_teams.is_deleted = 0 AND hr_teams.created_by = '${req.user.user_id}'`
//                     );

//                     if (teamQuery.length > 0) {
//                         userIds.push(result.id);
//                     }

//                     modifiedResult.push({
//                         id: result.id,
//                         name: result.name,
//                         email: result.email,
//                         mobile: result.contact_no,
//                         joining_date: result.joining_date,
//                         image: result.image,
//                         status: result.status,
//                         user_type: result.user_type,
//                         created_by: result.created_by,
//                         employee_id: result.employee_id,
//                         is_manager: managerIds.includes(result.id),    // Separate key for manager
//                         is_supervisor: supervisorIds.includes(result.id)  // Separate key for supervisor
//                     });

//                     filteredResult = modifiedResult;
//                 }
//             }
//             if (team == 1) {
//                 return res
//                     .status(StatusCodes.OK)
//                     .json({ status: true, message: "Fetched successfully", data: filteredResult });
//             } else {
//                 return res
//                     .status(StatusCodes.OK)
//                     .json({
//                         status: true, message: "Fetched successfully", data: queryResult.map(result => ({
//                             ...result,
//                             is_manager: managerIds.includes(result.id),    // Separate key for manager
//                             is_supervisor: supervisorIds.includes(result.id)  // Separate key for supervisor
//                         }))
//                     });
//             }
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

const getAllManagerUsers = async (req, res, next) => {
    try {
        const type = req.query.type || "";
        const team = req.query.team || "";

        let table;
        let selectQuery;
        const role_id = req.user.user_type;
        if (role_id == 1) {
            if (!type) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Type is required" });
            }
        }
        if (type != "" && type == 1) {
            selectQuery = `SELECT admins.id AS id, admins.name as name, admins.email, admins.employee_id
            FROM admins 
            WHERE admins.user_type = '${managerRoleId}'`;
            table = "admins";
        } else {
            selectQuery = `
            SELECT id, name, email, mobile as contact_no, joining_date, image, status, user_type, created_by, employee_id
            FROM users 
            WHERE is_deleted = '0' AND status = '1' AND outlet_id IS NULL`;
            table = "users";
        }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: table,
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery);
        let userIds = [];
        let filteredResult;

        // Get manager and supervisor IDs
        let teamQuery = await db.query(
            `SELECT DISTINCT manager_id, supervisor_id FROM hr_teams WHERE is_deleted = 0 AND created_by = '${req.user.user_id}'`
        );
        const managerIds = teamQuery.map(row => row.manager_id);
        const supervisorIds = teamQuery.map(row => row.supervisor_id);

        if (queryResult.length > 0) {
            let modifiedResult = [];
            for (const result of queryResult) {
                if (team == 1) {
                    teamQuery = await db.query(
                        `SELECT hr_teams.supervisor_id, users.name FROM hr_teams JOIN users ON hr_teams.supervisor_id = users.id WHERE hr_teams.supervisor_id = '${result.id}' AND hr_teams.is_deleted = 0 AND hr_teams.created_by = '${req.user.user_id}'`
                    );

                    if (teamQuery.length > 0) {
                        userIds.push(result.id);
                    }

                    modifiedResult.push({
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        mobile: result.contact_no,
                        joining_date: result.joining_date,
                        image: result.image,
                        status: result.status,
                        user_type: result.user_type,
                        created_by: result.created_by,
                        employee_id: result.employee_id,
                        is_manager: managerIds.includes(result.id),
                        is_supervisor: supervisorIds.includes(result.id)
                    });

                    filteredResult = modifiedResult;
                }
            }
            if (team == 1) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Fetched successfully", data: filteredResult });
            } else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true, message: "Fetched successfully", data: queryResult
                            .filter(result => managerIds.includes(result.id))  // Filter for managers only
                            .map(result => ({
                                ...result,
                                is_manager: true,
                                is_supervisor: supervisorIds.includes(result.id)
                            }))
                    });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};


const getEmployeeDocumentsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT graduation, post_graduation, doctorate, pan, pan_card_image, aadhar, aadhar_card_front_image, aadhar_card_back_image FROM users WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Documents not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getEmployeeLoginDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const sendLoginCredentialsViaEmail = async (req, res, next) => {
    try {
        const { email, password, id } = req.body;
        const { error } = loginValidation.validate(req.body);

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, error: error.message });

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        const name = queryResult[0].name;

        //password convert in to base64
        const decodedData = Buffer.from(password, "base64").toString("utf8");
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "mail.sartiaglobal.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "devtest@sartiaglobal.com",
                pass: "LXpC5mfC9A.-",
            },
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Sartia Dev" <devtest@sartiaglobal.com>', // sender address
            to: email, // list of receivers
            subject: "Your login credentials", // Subject line
            // text: 'Hello world?', // plain text body
            html:
                "<h3><b>Hello, " +
                name +
                "</b><h3><br><h5>Here is your login credentials</h5><br><p><b>Email:</b> " +
                email +
                " </p><p><b>password:</b> " +
                decodedData +
                " </p>", // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Login credentials send successfully" });
        });
    } catch (error) {
        return next(error);
    }
};

const sendLoginCredentialsViaWhatsApp = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, error: error.message });

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        const name = queryResult[0].name;
        const email = queryResult[0].email;
        const password = queryResult[0].password;
        const mobileNumber = queryResult[0].mobile;

        //password convert in to base64
        const decodedPassword = Buffer.from(password, "base64").toString("utf8");
        const textMessage =
            "Hello, " + name + " Here is your login credentials, Email: " + email + " Password: " + decodedPassword;
        const encodedText = JSON.stringify(textMessage);

        if (mobileNumber != "" && mobileNumber != undefined) {
            const whatsAppLink = "https://wa.me/" + mobileNumber + "?text=" + textMessage;
            res.status(StatusCodes.OK).json({
                status: true,
                message: "WhatsApp link ready to share with employee",
                link: whatsAppLink,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Message user has no mobile number." });
        }
    } catch (error) {
        return next(error);
    }
};

const changeUserStatus = async (req, res, next) => {
    try {
        const { status, id, remark, updated_by } = req.body;

        const statusValidation = Joi.object({
            status: Joi.number().required(),
            id: Joi.number().required(),
            remark: Joi.string().required(),
            updated_by: Joi.number().required(),
        });

        const { error } = statusValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const [user_data] = await getUserDetails(id);
        // console.log('user_data: ', user_data);
        const fetchUserInAdmin = await db.query(
            `SELECT id, name, email, aadhar, contact_no, status, is_deleted, created_at FROM admins WHERE (name = ? AND (email = ? OR aadhar = ? OR contact_no = ?)) ORDER BY id DESC LIMIT 1`,
            [user_data.name, user_data.email, user_data.aadhar, user_data.mobile]
        );
        console.log("fetchUserInAdmin: ", fetchUserInAdmin);

        if (status == 1 && fetchUserInAdmin.length > 0 && fetchUserInAdmin[0].status == "1" && fetchUserInAdmin[0].is_deleted == "0") {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "User already active in Other panel", data: fetchUserInAdmin });
        }
        const fetchUserInOtherClientPanel = await db.query(
            `SELECT id, name, email, aadhar, mobile, status, is_deleted, created_at, created_by FROM users WHERE (name = ? AND created_by != ? AND (email = ? OR aadhar = ? OR mobile = ?)) ORDER BY id DESC LIMIT 1`,
            [user_data.name, req.user.user_id, user_data.email, user_data.aadhar, user_data.mobile]
        );
        console.log('fetchUserInOtherClientPanel: ', fetchUserInOtherClientPanel);

        if (status == 1 && fetchUserInOtherClientPanel.length > 0 && fetchUserInOtherClientPanel[0].status == "1" && fetchUserInOtherClientPanel[0].is_deleted == "0") {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "User already active in Other client panel", data: fetchUserInOtherClientPanel });
        }

        const updateQuery = `UPDATE users SET status = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [status, id]);
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            let insertQuery = `INSERT INTO user_status_timeline(user_id, remark, updated_status, updated_by, updated_at) VALUES ('${id}','${remark}','${status}','${updated_by}', '${updatedAt}')`;
            await db.query(insertQuery);

            return res.status(StatusCodes.OK).json({ status: true, message: "Status changed successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

const getUsersByRoleId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        const role_id = req.user.user_type || 0;

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `SELECT id as user_id, name as user_name FROM admins where user_type = ?`;
        } else {
            selectQuery = `SELECT id as user_id, name as user_name FROM users where user_type = ?`;
        }

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAdminsByRoleId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as admin_id, name as admin_name FROM admins where user_type = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                values.push({
                    admin_id: row.admin_id,
                    admin_name: row.admin_name,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getUsersByAdminId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as user_id, name as user_name FROM users where admin_id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                values.push({
                    user_id: row.user_id,
                    user_name: row.user_name,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllUsersForExpenses = async (req, res, next) => {
    try {
        let selectQuery = `
            SELECT DISTINCT users.id, name, image, employee_id 
            FROM users 
            LEFT JOIN transactions ON transactions.user_id = users.id
            LEFT JOIN complaints ON complaints.id =  transactions.complaints_id
            WHERE users.is_deleted = '${process.env.NOT_DELETED}' AND transactions.id > 0 AND complaints.id > 0
            ORDER BY users.id
            `;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "users",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                if (row.employee_id) {
                    row.name = `${row.name} (${row.employee_id})`;
                }
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Users not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id, name, image, employee_id FROM users WHERE is_deleted = ? AND created_by = '${req.user.user_id}'`;
        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                if (row.employee_id) {
                    row.name = `${row.name} (${row.employee_id})`;
                }
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Users not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, name, email, image, mobile, user_type, employee_id FROM users WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                const getRoleName = await roleById(row.user_type);
                values.push({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    image: row.image,
                    mobile: row.mobile,
                    role_name: getRoleName.name,
                    employee_id: row.employee_id,
                });
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Users not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const userStatusTimeLine = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT user_status_timeline.* , users.name as updated_by_name
        FROM user_status_timeline
        LEFT JOIN users ON user_status_timeline.user_id = users.id
        WHERE user_status_timeline.user_id='${id}';`;
        const timeline_list = await db.query(selectQuery);
        if (timeline_list.length > 0) {
            return res.status(200).json({ status: true, data: timeline_list, message: "Record found" });
        } else {
            return res.status(400).json({ status: true, data: timeline_list, message: "No record found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getEndUserManagerAndSupervisor = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const getEndUserDetails = await getUserDetails(userId);

        if (getEndUserDetails.length > 0) {
            var finalData = {};
            const supervisorId = getEndUserDetails[0].supervisor_id;
            if (supervisorId) {
                // get end user supervisor details
                const getEndUserSupervisorDetails = await getUserDetails(supervisorId);

                if (getEndUserSupervisorDetails.length > 0) {
                    const endUserSupervisorDetails = {
                        supervisor_id: getEndUserSupervisorDetails[0].id,
                        supervisor_name: getEndUserSupervisorDetails[0].name,
                        supervisor_employee_id: getEndUserSupervisorDetails[0].employee_id,
                        supervisor_image: getEndUserSupervisorDetails[0].image,
                    };
                    finalData = { ...finalData, ...endUserSupervisorDetails };
                    const managerId = getEndUserSupervisorDetails[0].manager_id;

                    if (managerId) {
                        // get end user manager details
                        const getEndUserManagerDetails = await getUserDetails(managerId);

                        if (getEndUserManagerDetails.length > 0) {
                            const endUserManagerDetails = {
                                manager_id: getEndUserManagerDetails[0].id,
                                manager_name: getEndUserManagerDetails[0].name,
                                manager_employee_id: getEndUserManagerDetails[0].employee_id,
                                manager_image: getEndUserManagerDetails[0].image,
                            };

                            finalData = { ...finalData, ...endUserManagerDetails };
                        }
                    }
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "User related found",
                data: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "User not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSupervisorUsers = async (req, res, next) => {
    try {
        const supervisorRoleId = process.env.SUPERVISOR;
        const selectQuery = `SELECT * FROM users WHERE user_type = ?`;
        const queryResult = await db.query(selectQuery, [supervisorRoleId]);
        if (queryResult.length > 0) {
            var finalData = [];
            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    employee_id: row.employee_id,
                    image: row.image,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllDealerUsers = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search = "";
        if (searchData) {
            search = ` AND (name LIKE '%${searchData}%' OR email LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT id, name as dealer_name, mobile,email, address, status, image FROM users WHERE user_type = ${process.env.DEALER_ROLE_ID} ${search} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found." });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Fetched successfully",
            data: queryResult,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

const getDealerById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT id, name as dealer_name, mobile,email, address, status, image FROM users WHERE user_type = ${process.env.DEALER_ROLE_ID} AND id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > 0) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found" });
    } catch (error) {
        return next(error);
    }
};

const getAllAdmins = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search = "";
        if (searchData) {
            search = ` AND (name LIKE '%${searchData}%' OR email LIKE '%${searchData}%')`;
        }

        let selectQuery = `SELECT id, name as client_name, contact_no as mobile ,email, address_1 as address, country, city, pin_code, status, image FROM admins WHERE user_type = ${process.env.ADMIN_ROLE_ID} ${search} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "admins",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Fetched successfully",
            data: queryResult,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

const importEmployee = async (req, res, next) => {
    try {
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel file is required",
            });
        }

        // Upload file and get the path
        const filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);

        // Read the Excel file
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = xlsx.utils.sheet_to_json(sheet);
        let errorMessage = [];

        for (let i = 0; i < rows.length; i++) {
            const item = rows[i];
            item.mobile = item.mobile ? item.mobile.toString() : "";
            item.status = 1;
            item.family_info = JSON.stringify([{ member_name: "", member_relation: "" }]);
            if (item.team_id != "undefined") {
                item.team_id_val = item.team_id;
            }

            const { error } = userCreateValidations.validate(item);
            if (error) {
                const errMsg = error.message.replace(/"(.*?)"/g, "$1");
                errorMessage.push(`${errMsg} in the ${i + 1} record`);
            }

            const checkUniqu = await checkUnique(item?.email, item?.pan, item?.aadhar, item?.mobile, item?.epf_no, item?.esi_no);

            if (checkUniqu.status == false) {
                errorMessage.push(`${checkUniqu.data} is already exist in the ${i + 1} record`);
            }

            const role = await getRecord("roles", "id", item.role_id);
            if (role.length == 0) {
                errorMessage.push(`${item.role_id} is not valid role_id in the ${i + 1} record`);
            }
        }

        // delete the uploaded file once data is parsed successfully
        fs.unlinkSync(completePath);
        console.log("File deleted successfully");

        if (errorMessage.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Failed to import data.", errorMessage });
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Data imported successfully!" });
    } catch (error) {
        return next(error);
    }
};

// Sale and Purchase Company Users
const getAllClientAndPurchaseCompanyContacts = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const hasDropdown = req.query.isDropdown || false;
        const type = req.query.type || "";

        let search = "";
        if (searchData) {
            search = ` AND (company_contact_person LIKE '%${searchData}%' OR primary_contact_email LIKE '%${searchData}%')`;
        }

        let company_type = "";
        if (type != "" && type == "client") {
            company_type = ` AND companies.company_type = '1'`;
        } else {
            if (type != "" && type == "vendor") {
                company_type = ` AND companies.company_type = '2'`;
            } else {
                throw new Error("Invalid company type");
            }
        }
        let selectQuery = `
            SELECT companies.company_id AS id, company_contact_person AS name, primary_contact_number AS mobile, primary_contact_email AS email, company_address AS address, states.name AS state, cities.name AS city, companies.company_pincode AS pin_code, admins.status 
            FROM companies 
            LEFt JOIN admins ON admins.id = companies.login_id
            LEFT JOIN states ON states.id = companies.company_state 
            LEFT JOIN cities ON cities.id = companies.company_city 
            WHERE companies.is_superadmin_company = '0' ${company_type} AND companies.is_deleted = '0' 
            ${search} 
            ORDER BY id DESC 
            LIMIT ${pageFirstResult}, ${pageSize}`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "companies",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery);
        const dropdownData = [];
        if (queryResult.length == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
        }
        // console.log('queryResult: ', queryResult);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        if (hasDropdown) {
            for (const row of queryResult) {
                dropdownData.push({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: dropdownData,
            });

        }
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Fetched successfully",
            data: queryResult,
            pageDetails: pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createUsers,
    updateUsers,
    getAllManagerUsers,
    getEmployeeDocumentsById,
    sendLoginCredentialsViaEmail,
    sendLoginCredentialsViaWhatsApp,
    getEmployeeLoginDetailsById,
    changeUserStatus,
    getUsersByRoleId,
    getAdminsByRoleId,
    getUsersByAdminId,
    getAllUsers,
    getUserById,
    userStatusTimeLine,
    getEndUserManagerAndSupervisor,
    getAllSupervisorUsers,
    getDealerById,
    getAllDealerUsers,
    getAllAdmins,
    getAllUsersForExpenses,
    importEmployee,
    getAllClientAndPurchaseCompanyContacts,
    checkUnique,
};

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const Joi = require("joi");
const { con, makeDb } = require("../db");
const {
    loginValidation,
    checkPositiveInteger,
    adminCreateValidation,
    changePasswordValidations,
    adminUserUpdateValidation,
} = require("../helpers/validation");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
var moment = require("moment");
const { generatePanelIdForAdmin, generateEmpIdForSuperAdminUsers } = require("../helpers/panelHelper");
const { mailSent } = require("../helpers/sendEmail");
const { generateEmailTemplate } = require("../helpers/mailTemplate");
const { getAdminDetailsById, checkAdminUnique, getAdminDetails } = require("../helpers/general");
const { checkUserWithDisabledStatus } = require("../helpers/commonHelper");

const createAdmin = async (req, res, next) => {
    try {
        let {
            name,
            email,
            password,
            mobile,
            joining_date,
            role_id,
            address,
            skills,
            employment_status,
            pan,
            aadhar,
            bank_name,
            epf_no,
            esi_no,
            ifsc_code,
            account_number,
            family_info,
            team_id,
            salary,
            salary_term,
            credit_limit,
            manager_id,
            supervisor_id,
        } = req.body;
        // console.log('req.body: ', req.body);

        const createdBy = req.user.user_id;
        
        const { error } = adminCreateValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const existing_user_data = await checkUserWithDisabledStatus(name, email, aadhar, mobile);
        // console.log("existing_user_data: ", existing_user_data);

        // if user is found and user status is active => if user, status = 1
        if (existing_user_data && existing_user_data.status == "1") {
            return res.status(StatusCodes.OK).json({ status: false, message: `${name} already active in other panel` });
        } // if user, status = 0

        if (!existing_user_data) {
            const checkUniqu = await checkAdminUnique(email, pan, aadhar, "", epf_no, esi_no, createdBy);

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

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/admin_images/" + imageName;
            storePath = "/admin_images/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(500).json({ status: false, message: err.message });
            });

            if (req.files.graduation != null) {
                const graduation = req.files.graduation;
                const graduationImageName = Date.now() + graduation.name;
                const graduationUploadPath = process.cwd() + "/public/admin_images/" + graduationImageName;
                graduationStorePath = "/admin_images/" + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.post_graduation != null) {
                const post_graduation = req.files.post_graduation;
                const postGraduationImageName = Date.now() + post_graduation.name;
                const postGraduationUploadPath = process.cwd() + "/public/admin_images/" + postGraduationImageName;
                postGraduationStorePath = "/admin_images/" + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate;
                const doctorateImageName = Date.now() + doctorate.name;
                const doctorateUploadPath = process.cwd() + "/public/admin_images/" + doctorateImageName;
                doctorateStorePath = "/admin_images/" + doctorateImageName;

                doctorate.mv(doctorateUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //pan card image upload
            if (req.files.upload_pan_card != null) {
                const pan_card = req.files.upload_pan_card;
                const panCardName = Date.now() + pan_card.name;
                const panCardUploadPath = process.cwd() + "/public/admin_images/" + panCardName;
                panCardStorePath = "/admin_images/" + panCardName;

                pan_card.mv(panCardUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //Aadhar card image upload
            if (req.files.upload_aadhar_card_image1 != null) {
                const aadharCard1 = req.files.upload_aadhar_card_image1;
                const aadharCard1Name = Date.now() + aadharCard1.name;
                const aadharCard1dUploadPath = process.cwd() + "/public/admin_images/" + aadharCard1Name;
                aadharCard1StorePath = "/admin_images/" + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2;
                const aadharCard2Name = Date.now() + aadharCard2.name;
                const aadharCard2dUploadPath = process.cwd() + "/public/admin_images/" + aadharCard2Name;
                aadharCard2StorePath = "/admin_images/" + aadharCard2Name;

                aadharCard2.mv(aadharCard2dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }

            //upload bank documents
            if (req.files.upload_bank_documents != null) {
                const bankDocuments = req.files.upload_bank_documents;
                const bankDocumentsName = Date.now() + bankDocuments.name;
                const bankDocumentsUploadPath = process.cwd() + "/public/admin_images/" + bankDocumentsName;
                bankDocumentsStorePath = "/admin_images/" + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            }
        }

        let employee_id = "";

        let hashPassword = "";
        if (password != "") {
            const salt = bcrypt.genSaltSync(10);
            hashPassword = await bcrypt.hash(password, salt);
        }

        const panel_id = await generatePanelIdForAdmin(role_id, name);

        let insertQuery = `
            INSERT INTO admins(
            name, email, password, contact_no, joining_date, user_type, skills, employment_status, 
            pan_number, pan_card_image, image, graduation, post_graduation, doctorate, aadhar, 
            aadhar_card_front_image, aadhar_card_back_image, bank_name, bank_documents, epf_no, 
            esi_no, ifsc_code, account_number, family_info, team_id, credit_limit, created_by, panel_id, address_1
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        let insertValues = [
            name,
            email,
            hashPassword,
            mobile,
            joining_date,
            role_id,
            skills,
            employment_status,
            pan,
            panCardStorePath,
            storePath,
            graduationStorePath,
            postGraduationStorePath,
            doctorateStorePath,
            aadhar,
            aadharCard1StorePath,
            aadharCard2StorePath,
            bank_name,
            bankDocumentsStorePath,
            epf_no,
            esi_no,
            ifsc_code,
            account_number,
            family_info,
            team_id ? team_id : null,
            credit_limit,
            createdBy,
            panel_id,
            address,
        ];

        const checkExistingEmail = await db.query(`SELECT email FROM admins WHERE email = '${email}'`);
        if (checkExistingEmail.length > 0)
            if (checkExistingEmail[0].is_deleted == "0") {
                return res.status(400).json({ status: false, message: "Email already exists" });
            }

        const insertedData = await db.query(insertQuery, insertValues);
        if (insertedData.affectedRows > process.env.VALUE_ZERO) {
            // add into team (id  team id is given)
            if (team_id != "") {
                const teamQuery = `SELECT * FROM hr_teams WHERE id = ${team_id} AND is_deleted = '0'`;
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
            let updateQuery;
            let updateData;
            if (manager_id != "") {
                updateQuery = `UPDATE admins SET manager_id = '${manager_id}' WHERE id = '${insertedData.insertId}'`;
                updateData = await db.query(updateQuery);
                if (updateData.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Manager updated successfully");
                }
            } else if (supervisor_id != "") {
                updateQuery = `UPDATE admins SET supervisor_id = '${supervisor_id}' WHERE id = '${insertedData.insertId}'`;
                updateData = await db.query(updateQuery);
                if (updateData.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Supervisor updated successfully");
                }
            }

            const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
            const unique_id = `A${insertedData.insertId}`;
            await db.query("UPDATE admins SET unique_id = ?, created_at = ? WHERE id = ?", [
                unique_id,
                createdAt,
                insertedData.insertId,
            ]);

            // Generate Employee Id
            if (
                req.user.user_type == "1" ||
                req.user.user_type == "2" ||
                req.user.user_type == "3" ||
                req.user.user_type == "4"
            ) {
                employee_id = await generateEmpIdForSuperAdminUsers(createdBy);
                // console.log('employee_id: ', employee_id);
                if (!employee_id) {
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ status: false, message: "Unable to generate employee id" });
                }
                // Insert Employee ID
                const updateEmployeeIdQuery = await db.query("UPDATE admins SET employee_id = ? WHERE id = ?", [
                    employee_id,
                    insertedData.insertId,
                ]);
                if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Employee Id Inserted successfully");
                } else {
                    console.log("Employee Id Insertion failed");
                }
            }

            if (typeof team_id != "string" && team_id !== "" && team_id !== null) {
                // get team members to add new one
                const getTeamMemberList = await db.query("SELECT id, members FROM teams WHERE id= ?", [team_id]);
                if (getTeamMemberList.length > process.env.VALUE_ZERO) {
                    const teamDbData = getTeamMemberList[0];
                    const teamDbMembers = teamDbData.members;
                    const teamDbId = teamDbData.id;

                    // Parse the JSON string into a JavaScript object
                    const teamMemberList = JSON.parse(teamDbMembers);
                    // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
                    const team_member_ids = teamMemberList.map(Number);
                    const valueToAdd = insertedData.insertId; //JSON.parse(user_id);
                    team_member_ids.push(valueToAdd);

                    //Convert the modified JavaScript object back to a JSON string
                    // teamMemberList.team_member = team_member_ids.join(",");
                    const updatedJsonString = JSON.stringify(team_member_ids);

                    // update team members with new members
                    const updateQuery = await db.query("UPDATE teams SET members = ? WHERE id = ?", [
                        updatedJsonString,
                        teamDbId,
                    ]);

                    if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Member added to team successfully");
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Something went wrong, Unable to add to team",
                        });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: "Invalid team details or Team not found",
                    });
                }
            }

            const html = generateEmailTemplate(name, email, password);
            const response = await mailSent(
                process.env.EMAIL,
                email,
                "Welcome to CMS! Here are Your Login Credentials",
                html
            );
            if (response.status) {
                console.log(response.message);
            } else {
                throw new Error(response.message);
            }

            //salary generated from
            const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
            const salaryValues = [insertedData.insertId, role_id, joining_date, salary, salary_term, createdBy];

            const salaryQueryResult = await db.query(salaryInsert, salaryValues);
            if (salaryQueryResult.affectedRows > process.env.VALUE_ZERO) {
                console.log("Salary Inserted successfully");
            } else {
                return res.status(400).json({ status: false, message: "Salary data couldn't be inserted" });
            }

            return res.status(200).json({ status: true, message: "Admin user created successfully" });
        } else {
            return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const updateSingleEmployeeDetailByIdForAdmins = async (req, res, next) => {
    try {
        let {
            name,
            email,
            password,
            mobile,
            joining_date,
            role_id,
            address,
            skills,
            employment_status,
            pan,
            aadhar,
            bank_name,
            epf_no,
            esi_no,
            ifsc_code,
            account_number,
            family_info,
            team_id,
            salary,
            salary_term,
            credit_limit,
            employee_id,
            image,
            graduation,
            post_graduation,
            doctorate,
            upload_pan_card,
            upload_aadhar_card_image1,
            upload_aadhar_card_image2,
            upload_bank_documents,
            panel_id,
            manager_id,
            supervisor_id,
        } = req.body;

        const createdBy = req.user.user_id;

        const { error } = adminUserUpdateValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.details[0].message });
        }

        const [user_data] = await getAdminDetails(employee_id);

        // Unique AADHAR check
        if (user_data.aadhar != aadhar) {
            const checkUniqu = await checkAdminUnique("", "", aadhar, "", createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // Unique PAN check
        if (user_data.pan_number != pan) {
            const checkUniqu = await checkAdminUnique("", pan, "", "", createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // Unique EPF check
        if (user_data.epf_no != epf_no) {
            const checkUniqu = await checkAdminUnique("", "", "", "", epf_no, "",  createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }
        // Unique ESIC check
        if (user_data.esi_no != esi_no) {
            const checkUniqu = await checkAdminUnique("", "", "", "", "", esi_no, createdBy);

            if (checkUniqu.status == false) {
                const message =
                    checkUniqu.user != ""
                        ? `${checkUniqu.data} already exist for email ${checkUniqu.user}`
                        : `${checkUniqu.data} already exist`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
        }

        const updated_by = req.user.user_id;
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let storePath = "";
        let graduationStorePath = "";
        let postGraduationStorePath = "";
        let doctorateStorePath = "";
        let panCardStorePath = "";
        let aadharCard1StorePath = "";
        let aadharCard2StorePath = "";
        let bankDocumentsStorePath = "";

        if (req.files != null) {
            if (req.files.image != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/admin_images/" + imageName;
                storePath = "/admin_images/" + imageName;

                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(500).json({ status: false, message: err.message });
                });
            } else {
                storePath = image;
            }

            if (req.files.graduation != null) {
                const graduation = req.files.graduation;
                console.log("graduation: ", graduation);
                const graduationImageName = Date.now() + graduation.name;
                const graduationUploadPath = process.cwd() + "/public/admin_images/" + graduationImageName;
                graduationStorePath = "/admin_images/" + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) throw err;
                });
            } else {
                graduationStorePath = graduation;
            }

            if (req.files.post_graduation != null) {
                const post_graduation = req.files.post_graduation;
                const postGraduationImageName = Date.now() + post_graduation.name;
                const postGraduationUploadPath = process.cwd() + "/public/admin_images/" + postGraduationImageName;
                postGraduationStorePath = "/admin_images/" + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                postGraduationStorePath = post_graduation;
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate;
                const doctorateImageName = Date.now() + doctorate.name;
                const doctorateUploadPath = process.cwd() + "/public/admin_images/" + doctorateImageName;
                doctorateStorePath = "/admin_images/" + doctorateImageName;

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
                const panCardUploadPath = process.cwd() + "/public/admin_images/" + panCardName;
                panCardStorePath = "/admin_images/" + panCardName;

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
                const aadharCard1dUploadPath = process.cwd() + "/public/admin_images/" + aadharCard1Name;
                aadharCard1StorePath = "/admin_images/" + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                aadharCard1StorePath = upload_aadhar_card_image1;
            }

            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2;
                const aadharCard2Name = Date.now() + aadharCard2.name;
                const aadharCard2dUploadPath = process.cwd() + "/public/admin_images/" + aadharCard2Name;
                aadharCard2StorePath = "/admin_images/" + aadharCard2Name;

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
                const bankDocumentsUploadPath = process.cwd() + "/public/admin_images/" + bankDocumentsName;
                bankDocumentsStorePath = "/admin_images/" + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                });
            } else {
                bankDocumentsStorePath = upload_bank_documents;
            }
        } else {
            storePath = image;
            graduationStorePath = graduation;
            postGraduationStorePath = post_graduation;
            doctorateStorePath = doctorate;
            panCardStorePath = upload_pan_card;
            aadharCard1StorePath = upload_aadhar_card_image1;
            aadharCard2StorePath = upload_aadhar_card_image2;
            bankDocumentsStorePath = upload_bank_documents;
        }

        const fetchTeamId = await db.query(`SELECT team_id FROM admins WHERE id = ?`, [employee_id]);
        if (fetchTeamId.length > 0 && fetchTeamId[0].team_id !== null && fetchTeamId[0].team_id != team_id) {
            const oldTeamId = fetchTeamId[0].team_id;
            // get team members to add new one
            const getTeamMemberList = await db.query("SELECT id, members FROM teams WHERE id= ?", [team_id]);
            const getOldTeamMemberList = await db.query("SELECT id, members FROM teams WHERE id= ?", [oldTeamId]);

            // Get team members to remove one
            if (getOldTeamMemberList.length > process.env.VALUE_ZERO) {
                const oldTeamDbData = getOldTeamMemberList[0];
                const oldTeamDbMembers = oldTeamDbData.members;
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
                let oldTeam_member_ids = oldTeamMemberList;

                // If `team_member` is stored as a string, convert it to an array of numeric IDs
                oldTeam_member_ids = oldTeam_member_ids.map(Number);

                // Remove the employee ID from the team members
                const valueToRemove = parseInt(employee_id, 10); // Ensure `employee_id` is an integer
                const index = oldTeam_member_ids.indexOf(valueToRemove);

                if (index > -1) {
                    oldTeam_member_ids.splice(index, 1); // Remove the ID from the array
                }

                // Convert the modified JavaScript object back to a JSON string
                // oldTeamMemberList = oldTeam_member_ids.join(","); // If team_member is stored as a string
                const updatedJsonString = JSON.stringify(oldTeam_member_ids);

                // Update the team members in the database
                const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
                const updateQuery = await db.query(
                    "UPDATE teams SET members = ?, updated_by = ?, updated_at = ? WHERE id = ?",
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
            // else {
            //     return res.status(StatusCodes.BAD_REQUEST).json({
            //         status: false,
            //         message: "Invalid Old team details.",
            //     });
            // }

            if (getTeamMemberList.length > process.env.VALUE_ZERO) {
                const teamDbData = getTeamMemberList[0];
                const teamDbMembers = teamDbData.members;
                const teamDbId = teamDbData.id;

                // Parse the JSON string into a JavaScript object
                const teamMemberList = JSON.parse(teamDbMembers);
                // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
                const team_member_ids = teamMemberList.map(Number);
                const valueToAdd = Number(employee_id); //JSON.parse(user_id);

                // Check if the user_id already exists in the team_member_ids array
                if (team_member_ids.includes(Number(employee_id))) {
                    throw new Error("User already exists in the team");
                }

                team_member_ids.push(valueToAdd);

                //Convert the modified JavaScript object back to a JSON string
                // teamMemberList.team_member = team_member_ids.join(",");
                const updatedJsonString = JSON.stringify(team_member_ids);

                // update team members with new members
                const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
                const updateQuery = await db.query(
                    "UPDATE teams SET members = ?, updated_by = ?, updated_at = ? WHERE id = ?",
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

        let updateQuery = `
            UPDATE admins
                SET 
                    name = ?, 
                    email = ?,
                    contact_no = ?, 
                    joining_date = ?, 
                    user_type = ?, 
                    address_1 = ?, 
                    skills = ?, 
                    employment_status = ?, 
                    pan_number = ?, 
                    pan_card_image = ?, 
                    image = ?, 
                    graduation = ?, 
                    post_graduation = ?, 
                    doctorate = ?, 
                    aadhar = ?, 
                    aadhar_card_front_image = ?, 
                    aadhar_card_back_image = ?, 
                    bank_name = ?, 
                    bank_documents = ?, 
                    epf_no = ?, 
                    esi_no = ?, 
                    ifsc_code = ?, 
                    account_number = ?, 
                    family_info = ?, 
                    team_id = ?, 
                    credit_limit = ?, 
                    panel_id = ?,
                    updated_by = ?,
                    updated_at = ?
            `;

        team_id = team_id !== "" ? team_id : null;
        let updateValues = [
            name,
            email,
            mobile,
            joining_date,
            role_id,
            address,
            skills,
            employment_status,
            pan,
            panCardStorePath,
            storePath,
            graduationStorePath,
            postGraduationStorePath,
            doctorateStorePath,
            aadhar,
            aadharCard1StorePath,
            aadharCard2StorePath,
            bank_name,
            bankDocumentsStorePath,
            epf_no,
            esi_no,
            ifsc_code,
            account_number,
            family_info,
            team_id,
            credit_limit,
            panel_id,
            updated_by,
            updatedAt,
        ];

        if (password != null && password != "") {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);
            updateQuery += `, password = ?`;
            updateValues.push(hashPassword);
        }

        updateQuery += ` WHERE id = ?`;
        updateValues.push(employee_id);

        const updateData = await db.query(updateQuery, updateValues);
        if (updateData.affectedRows > process.env.VALUE_ZERO) {
            //update manager_id
            let updateQuery;
            let updateData;
            if (manager_id != "") {
                updateQuery = `UPDATE admins SET manager_id = '${manager_id}' WHERE id = '${employee_id}'`;
                updateData = await db.query(updateQuery);
                if (updateData.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Manager/Supervisor updated successfully");
                }
            } else if (supervisor_id != "") {
                updateQuery = `UPDATE admins SET supervisor_id = '${supervisor_id}' WHERE id = '${employee_id}'`;
                updateData = await db.query(updateQuery);
                if (updateData.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Manager/Supervisor updated successfully");
                }
            }

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

            return res.status(200).json({ status: true, message: "Admin user Updated successfully" });
        } else {
            return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const changeAdminUserStatus = async (req, res, next) => {
    try {
        const { status, id, remark, updated_by } = req.body;
        console.log('req.body: ', req.body);
        const statusValidation = Joi.object({
            status: Joi.number().required(),
            id: Joi.number().required(),
            remark: Joi.string().required(),
            updated_by: Joi.number().required(),
        });

        const userStatus = status.toString();

        const { error } = statusValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const fetchUser = await getAdminDetailsById(id);
        if (Object.keys(fetchUser).length === 0)
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "User not found" });
        else {
            if (Object.keys(fetchUser).length > 0 && fetchUser.user_type == 1) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ status: false, message: "Super Admin status cannot be changed" });
            }
        }

        const fetchUserInUserTable = await db.query(
            `SELECT id, name, email, aadhar, mobile, status, is_deleted, created_at FROM users WHERE (name = ? AND (email = ? OR aadhar = ? OR mobile = ?)) ORDER BY id DESC LIMIT 1`,
            [fetchUser.name, fetchUser.email, fetchUser.aadhar, fetchUser.contact_no]
        );
        console.log("fetchUserInUserTable: ", fetchUserInUserTable);

        if (status == 1 &&
            fetchUserInUserTable.length > 0 &&
            fetchUserInUserTable[0].status == "1" &&
            fetchUserInUserTable[0].is_deleted == "0"
        ) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "User already active in Other panel", metadata: fetchUserInUserTable[0] });
        }

        const updateQuery = `UPDATE admins SET status = ? WHERE id = ?`;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [userStatus, id]);
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

const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM admins WHERE email = '${email}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                if (result[0].status == process.env.INACTIVE_STATUS) {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        status: false,
                        message: "Your account is not activated yet. Please contact our support team for assistance.",
                    });
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
                    return res
                        .status(200)
                        .json({ status: true, message: "Login Successful", data: result[0], token: token });
                } else {
                    return res.status(400).json({ status: false, message: "Wrong Credentials" });
                }
            } else {
                return res.status(400).json({ status: false, message: "Email invalid" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAdminProfileDetails = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id: loggedUserId });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const sql = `SELECT admins.name, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.status, admins.country, admins.city, admins.pin_code, admins.image, admins.description, admins.gst_number, admins.fb_url, admins.inst_url, admins.twitter_url, admins.linkedin_url, roles.name AS role FROM admins INNER JOIN roles ON roles.id = admins.user_type WHERE admins.id = ?`;

        const sqlResult = await db.query(sql, [loggedUserId]);

        if (sqlResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "success", data: sqlResult[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Details not found.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateAdminProfile = async (req, res, next) => {
    try {
        const {
            name,
            email,
            contact_no,
            alt_number,
            address_1,
            status,
            country,
            city,
            pin_code,
            image,
            description,
            gst_number,
            fb_url,
            inst_url,
            twitter_url,
            linkedin_url,
        } = req.body;

        //dummy password for form validation
        const password = "jh67b37";

        const { error } = adminCreateValidation.validate({
            email: req.body.email,
            password: password,
            contact_no: req.body.contact_no,
        });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const loggedUserId = req.user.user_id;
        var storePath = "";
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;

            image.mv(uploadPath, (error, response) => {
                if (error) return res.status(403).json({ status: false, message: error.message });
            });
        } else {
            storePath = image;
        }

        const updateQuery = ` name = ?, email = ?, contact_no = ?, alt_number = ?, address_1 = ?, status = ?, country = ?, city = ?, pin_code = ?, image = ?, description = ?, gst_number = ?, fb_url = ?, inst_url = ?, twitter_url = ?, linkedin_url = ?, updated_at = ? WHERE id= ?`;

        const queryResult = await db.query(updateQuery, [
            name,
            email,
            contact_no,
            alt_number,
            address_1,
            status,
            country,
            city,
            pin_code,
            storePath,
            description,
            gst_number,
            fb_url,
            inst_url,
            twitter_url,
            linkedin_url,
            updatedAt,
            loggedUserId,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Profile details updated successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Profile details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const adminChangePassword = async (req, res, next) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        const { error } = changePasswordValidations.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const loggedUserId = req.user.user_id;

        const getLoggedUserPassword = `SELECT password FROM admins WHERE id= ?`;
        const loggedUserPasswordResult = await db.query(getLoggedUserPassword, [loggedUserId]);

        if (loggedUserPasswordResult.length > process.env.VALUE_ZERO) {
            const isCorrectPassword = await bcrypt.compare(old_password, loggedUserPasswordResult[0].password);
            if (isCorrectPassword) {
                if (new_password == confirm_password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(new_password, salt);
                    const updateQuery = `UPDATE admins SET password= ? WHERE id=?`;
                    const updateResult = await db.query(updateQuery, [hashPassword, loggedUserId]);

                    if (updateResult.affectedRows > process.env.VALUE_ZERO) {
                        res.status(StatusCodesOk).json({ status: true, message: "Password changed successfully" });
                    } else {
                        res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Error! password not updated",
                        });
                    }
                } else {
                    return res
                        .status(StatusCodes.FORBIDDEN)
                        .json({ status: false, message: "Confirm password is not equal to new password." });
                }
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Old password is wrong" });
            }
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Internal server error" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSideBarModules = async (req, res, next) => {
    try {
        const userType = req.user.user_type;
        const getModulesQuery = `SELECT * , 'module' AS module_type FROM modules WHERE type LIKE '%CONTRACTOR%' AND is_deleted = 0 ORDER BY id`;
        const modules = await db.query(getModulesQuery);
        const moduleIds = modules.map((e) => e.id);
        const modulesObj = {};
        for (const module of modules) {
            modulesObj[module.id] = module;
            module.submodules = [];
        }
        const getSubModulesQuery = `SELECT * , 'submodule' AS module_type FROM sub_modules WHERE module_id IN (${moduleIds}) AND type LIKE '%CONTRACTOR%' AND is_deleted = 0 ORDER BY id`;
        const subModules = moduleIds.length === 0 ? [] : await db.query(getSubModulesQuery);
        const subModulesObj = {};
        for (const subMod of subModules) {
            subModulesObj[subMod.id] = subMod;
            subMod.modulesOfSubModule = [];
        }
        const subModIds = subModules.map((subMod) => subMod.id);
        const getSubSubModulesQuery = `SELECT * , 'subsubmodule' AS module_type FROM module_of_sub_modules WHERE sub_module_id IN (${subModIds}) AND is_deleted = 0 ORDER BY id`;
        const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
        const subSubModulesObj = {};
        for (const subSubMod of subSubModules) {
            subSubModulesObj[subSubMod.id] = subSubMod;
        }
        for (const subMod in subModulesObj) {
            subModulesObj[subMod].subModules = subSubModules.filter((e) => e.sub_module_id == subMod);
        }
        for (const module in modulesObj) {
            modulesObj[module].submodules = subModules.filter((e) => e.module_id == module);
        }
        const sidebarList = Object.values(modulesObj);
        return res.status(200).json({
            status: true,
            message: "Sidebar Fetched successfully",
            data: sidebarList,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createAdmin,
    changeAdminUserStatus,
    adminLogin,
    getAdminProfileDetails,
    updateAdminProfile,
    adminChangePassword,
    getAllSideBarModules,
    updateSingleEmployeeDetailByIdForAdmins,
};

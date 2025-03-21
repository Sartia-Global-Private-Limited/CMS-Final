const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation, checkPositiveInteger } = require("../helpers/validation");
const {
    getDealerAllUserById,
    getPendingContractorUsersById,
    roleById,
    getEmployeeBaseSalary,
    calculatePagination,
    historyTimeLine,
    getAdminDetailsById,
} = require("../helpers/general");
const { generatePanelIdForAdmin } = require("../helpers/panelHelper");
const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const { addCreatedByCondition } = require("../helpers/commonHelper");
const moment = require("moment");

const db = makeDb();

async function fetchUserData(id, type) {
    type = parseInt(type);
    try {
        const [fetch_user] = await db.query(`SELECT unique_id FROM users WHERE id = ${id} AND user_type = ${type}`);
        if (fetch_user?.unique_id?.startsWith("U")) {
            return "USER";
        }
        const [fetch_admin] = await db.query(`SELECT unique_id FROM admins WHERE id = ${id} AND user_type = ${type}`);
        if (fetch_admin?.unique_id?.startsWith("A")) {
            return "ADMIN";
        }
        return null;
    } catch (error) {
        console.log("Error while fetching user data", error);
        return null;
    }
}

const superAdminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        let sql = `SELECT * FROM admins WHERE email='${email}' AND user_type='${process.env.SUPER_ADMIN_ROLE_ID}' AND is_deleted = '0'`;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        db.query(sql, async (error, result) => {
            if (error) {
                return res.status(500).json({ status: false, message: error });
            }
            // if Super-Admin sign in
            if (result.length > process.env.VALUE_ZERO) {
                const userData = {
                    ...result[0],
                    company_logo: result[0].logo,
                };
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
                            expiresIn: '8h' // Set token expiry to 8 hours
                        }
                    );
                    // Set Authorization header
                    res.set("Authorization", `Bearer ${token}`).cookie("token", token, cookieOptions);
                    return res.status(200).json({ status: true, message: "Login Successfully", data: userData, token });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Wrong Credentials" });
                }
            } else {
                // if Super Admin's employee sign in
                sql = ` SELECT admins.*, roles.id AS role_id, roles.name AS role_name, roles.created_by AS role_created_by, roles.created_for AS role_created_for 
                        FROM admins 
                        LEFT JOIN roles ON admins.user_type = roles.id
                        WHERE admins.email='${email}' AND roles.is_deleted = '0'`;
                const result = await db.query(sql);
                if (result.length > 0) {
                    if (result[0].role_created_by == 1 && result[0].role_created_for == 1) {
                        const userData = {
                            ...result[0],
                            company_logo: result[0].logo,
                        };
                        // account is active or not
                        if (userData.status == process.env.INACTIVE_STATUS) {
                            return res.status(400).json({
                                status: false,
                                message:
                                    "Your account is not activated yet. Please contact our support team for assistance.",
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
                                    expiresIn: '8h' // Set token expiry to 8 hours
                                }
                            );
                            // Set Authorization header
                            res.set("Authorization", `Bearer ${token}`).cookie("token", token, cookieOptions);
                            return res
                                .status(200)
                                .json({ status: true, message: "Login Successfully", data: userData, token });
                        } else {
                            return res
                                .status(StatusCodes.BAD_REQUEST)
                                .json({ status: false, message: "Wrong Credentials" });
                        }
                    } else {
                        return res
                            .status(StatusCodes.BAD_REQUEST)
                            .json({ status: false, message: "You don't have permission to access" });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Email Invalid" });
                }
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllStoredEmployeeDetailsForSuperAdmin = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const user_type = req.user.user_type;
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const hasDropdown = req.query.isDropdown;
        const team = req.query.team || "";

        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition += `AND (
            admins.name LIKE '%${searchData}%' OR 
            admins.email LIKE '%${searchData}%' OR 
            admins.contact_no LIKE '%${searchData}%' OR 
            admins.joining_date LIKE '%${searchData}%' OR
            roles.name LIKE '%${searchData}%'
            )`;
        }

        let selectQuery = `
            SELECT admins.id, admins.name, admins.employee_id, admins.email, admins.contact_no, admins.joining_date, admins.image, admins.status, admins.user_type, roles.name as role_name, admins.created_by, admins.created_at, admins.updated_at   
            FROM admins 
            LEFT JOIN roles ON roles.id = admins.user_type  
            WHERE  (admins.is_deleted = '0' AND admins.created_by = '${user_id}')  
            ${searchDataCondition} 
            ORDER BY id 
        `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ?, ?`;
        }

            /********************************************************************************** */
            /********************************************************************************** */

            // Step 1: Get grouped IDs for users with "un-skilled"
            // const [rows] = await db.execute(`
            //     SELECT 
            //         GROUP_CONCAT(id ORDER BY id DESC) AS grouped_ids 
            //     FROM admins 
            //     WHERE skills = 'UN-SKILLED'
            // `);
    
            // if (rows.length === 0 || !rows[0].grouped_ids) {
            //     console.log('No records found with skills "UN-SKILLED".');
            //     return;
            // }
    
            // // Parse the grouped IDs
            // const groupedIds = rows[0].grouped_ids.split(',').map(Number);
    
            // console.log('Found IDs to update:', groupedIds);
    
            // // Step 2: Update the records to "non-skilled"
            // const [updateResult] = await db.execute(
            //     `UPDATE admins 
            //         SET skills = 'non-skilled' 
            //         WHERE id IN (?)`,
            //     [groupedIds]
            // );
    
            // console.log(`${updateResult.affectedRows} records updated to "non-skilled".`);


            /******************************************************************************************* */
            /******************************************************************************************* */



        selectQuery = addCreatedByCondition(selectQuery, {
            table: "admins",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        let queryResult;

        // pagination remove on all dropdown
        if (hasDropdown != null && hasDropdown != "") {
            selectQuery = `
                    SELECT admins.id, admins.name, admins.employee_id, admins.email, admins.contact_no, admins.joining_date, admins.image, admins.status, admins.user_type, roles.name as role_name, admins.created_by 
                    FROM admins 
                    LEFT JOIN roles ON roles.id = admins.user_type  
                    WHERE  (admins.is_deleted = '0' AND admins.status = '1' AND admins.created_by = '${user_id}')  
                    ORDER BY id 
                `;

            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
            queryResult = await db.query(modifiedQueryString, queryParams);
        } else {
            queryResult = await db.query(selectQuery, queryParams);
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        let userIds = [];
        if (queryResult.length > 0) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let modifiedResult = [];
            for (let result of queryResult) {
                // console.log('result: ', result);
                // if (result.employee_id) {
                //     result.name = `${result.name} (${result.employee_id})`;
                // }

                let teamQuery;
                if (team == 1) {
                    teamQuery = await db.query(
                        `SELECT supervisor_id FROM hr_teams WHERE supervisor_id = '${result.id}' AND is_deleted = '0' AND created_by = '${req.user.user_id}'`
                    );
                    // console.log("teamQuery: ", teamQuery);

                    if (teamQuery.length > 0) {
                        userIds.push(result.id);
                    }
                }

                const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
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
                    salary: employeeBaseSalary.salary,
                    employee_id: result.employee_id,
                    role_name: result.role_name,
                    created_at: result.created_at,
                    updated_at: result.updated_at,
                });
            }

            if (!pageSize && !hasDropdown) {
                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(modifiedResult, "employees", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(modifiedResult, "employees", "Employees", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            let filteredResult;
            if (hasDropdown != null && hasDropdown != "" && team == 1) {
                // Filter the results if the supervisor in the team exists
                filteredResult = modifiedResult.filter((result) => !userIds.includes(result.id));
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: filteredResult,
                });
            } else if (hasDropdown != null && hasDropdown != "") {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: modifiedResult,
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: modifiedResult,
                    pageDetails: pageDetails,
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getSingleEmployeeDetailByIdForSuperAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `
                SELECT admins.*, t.team_name, roles.name as role_name, d.user_id AS document_id, d.image AS document_image, d.remark AS document_remark, d.created_at AS document_created_at, dc.title as document_category
                FROM admins 
                LEFT JOIN roles ON roles.id = admins.user_type 
                LEFT JOIN hr_teams t ON t.id = admins.team_id
                LEFT JOIN documents d ON d.user_type = admins.user_type
                LEFT JOIN document_categories dc ON dc.id = d.document_category_id
                WHERE admins.id = ?
            `;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const employeeBaseSalary = await getEmployeeBaseSalary(id);
            queryResult[0].status_timeline = await historyTimeLine(id);
            queryResult[0].family_info = JSON.parse(queryResult[0].family_info);
            // queryResult[0].skills =
            //     queryResult[0].skills && typeof queryResult[0].skills != "string"
            //         ? JSON.parse(queryResult[0].skills)
            //         : null;

            delete queryResult[0].password;
            const document_data = new Object();

            if (queryResult[0].document_id) {
                document_data.id = JSON.parse(JSON.parse(queryResult[0].document_id))[0] || null;
                document_data.image = JSON.parse(queryResult[0].document_image) || null;
                document_data.remark = queryResult[0].document_remark || null;
                document_data.created_at = moment(queryResult[0].document_created_at).format("DD-MM-YYYY") || null;
                document_data.category = queryResult[0].document_category || null;
                queryResult[0].document = document_data;
                delete queryResult[0].document_id;
                delete queryResult[0].document_image;
                delete queryResult[0].document_remark;
                delete queryResult[0].document_created_at;
                delete queryResult[0].document_category;
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: {
                    ...queryResult[0],
                    mobile: queryResult[0].contact_no,
                    address: queryResult[0].address_1,
                    salary: employeeBaseSalary.salary,
                    salary_term: employeeBaseSalary.salary_term,
                    pan: queryResult[0].pan_number,
                    skills: queryResult[0]?.skills || null,
                    team: queryResult[0]?.team || null,
                    employee_id: queryResult[0]?.employee_id || null,
                    username: queryResult[0]?.name || null,
                    role_id: queryResult[0]?.user_type || null,
                    team: queryResult[0]?.team_name || null,
                },
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getProfileDetails = async (req, res, next) => {
    try {
        const loggedUserId = req.user?.user_id || "";
        const user_type = req.user?.user_type || "";
        if (loggedUserId == "" || user_type == "") {
            return res.status(200).json({ status: false, message: "User not found" });
        }
        const sql = `
            SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role 
            FROM admins 
            LEFT JOIN plans ON admins.plan_id = plans.id 
            INNER JOIN roles ON roles.id = admins.user_type 
            WHERE admins.id='${loggedUserId}' AND admins.user_type='${user_type}'
        `;
        db.query(sql, async (error, result) => {
            if (error) throw new Error(error);

            const finalData = {
                ...result[0],
                company_logo: result[0]?.logo || "",
            };

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "success", data: finalData });
            } else {
                const sql = `SELECT users.*, users.name, roles.name AS role, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price 
                FROM users 
                LEFT JOIN plans ON users.plan_id = plans.id 
                INNER JOIN roles ON roles.id = users.user_type 
                WHERE users.id='${loggedUserId}' AND users.user_type='${user_type}'`;
                db.query(sql, async (error, result) => {
                    if (error) return res.status(403).json({ status: false, message: error });

                    let plan_duration;
                    if (result[0]?.plan_duration == "week") {
                        plan_duration = 7;
                    } else if (result[0]?.plan_duration == "month") {
                        plan_duration = 30;
                    } else {
                        plan_duration = 365;
                    }

                    const plan_expire_date = moment(result[0]?.created_at)
                        .add(plan_duration, "days")
                        .format("YYYY-MM-DD HH:mm:ss");

                    if (result.length > process.env.VALUE_ZERO) {
                        const finalData = {
                            ...result[0],
                            address_1: result[0]?.address || "",
                            plan_expire_date,
                        };
                        delete finalData.address;

                        res.status(200).json({ status: true, message: "success", data: finalData });
                    }
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, email, contact_no = null } = req.body;
        const updatedTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const loggedUserId = req.user.user_id;
        console.log("req.user: ", req.user);
        const user_type = req.user.user_type;

        let updateSql = "";

        const fetch_user = await fetchUserData(loggedUserId, user_type);

        let uploadPath = "";
        let uploadPathLogo = "";
        let storePath = "";
        let logoStorePath = "";

        if (req.files != null) {
            let image;
            let imageName;
            let logo;
            let logoName;
            if (req.files.image || req.files.company_logo) {
                image = req.files.image;
                imageName = image ? Date.now() + image.name : "";
                logo = req.files.company_logo;
                logoName = logo ? Date.now() + logo.name : "";
            }

            if (fetch_user === "USER") {
                uploadPath = process.cwd() + "/public/user_images/" + imageName;
                storePath = "/user_images/" + imageName;
            } else if (fetch_user === "ADMIN") {
                imageName.length > 0 ? (uploadPath = process.cwd() + "/public/super_admin_images/" + imageName) : "";
                logoName.length > 0 ? (uploadPathLogo = process.cwd() + "/public/super_admin_images/" + logoName) : "";
                imageName.length > 0 ? (storePath = "/super_admin_images/" + imageName) : "";
                logoName.length > 0 ? (logoStorePath = "/super_admin_images/" + logoName) : "";
            }
            if (uploadPath.length > 0) {
                image.mv(uploadPath, (error, response) => {
                    if (error) return res.status(403).json({ status: false, message: error.message });
                });
            }

            if (uploadPathLogo.length > 0) {
                logo.mv(uploadPathLogo, (error, response) => {
                    if (error) return res.status(403).json({ status: false, message: error.message });
                });
            }

            if (fetch_user === "USER") {
                const [userData] = await db.query(`SELECT image FROM users WHERE id='${loggedUserId}'`);
                updateSql = `
                    UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', image='${storePath.length > 0 ? storePath : userData.image}', updated_at='${updatedTime}', updated_by='${user_type}' 
                    WHERE id='${loggedUserId}'`;
            } else if (fetch_user === "ADMIN") {
                const [adminData] = await db.query(`SELECT image, logo FROM admins WHERE id='${loggedUserId}'`);
                updateSql = `
                    UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', image='${storePath.length > 0 ? storePath : adminData.image}', logo = '${logoStorePath.length > 0 ? logoStorePath : adminData.logo}', updated_at='${updatedTime}', updated_by='${user_type}' 
                    WHERE id='${loggedUserId}'`;
                // if (logoStorePath.length > 0) {
                //     const updateAllAdminsLogo = await db.query(
                //         `UPDATE admins SET logo = '${logoStorePath}' WHERE id != '${loggedUserId}' `
                //     );
                //     const updateAllUsersLogo = await db.query(`UPDATE users SET logo = '${logoStorePath}'`);
                //     if (updateAllAdminsLogo.affectedRows > process.env.VALUE_ZERO) {
                //         console.log("Logo updated Successfully");
                //     } else {
                //         return res.status(400).json({ status: false, message: "Unable to update Logo" });
                //     }
                // }
            }
        } else {
            if (fetch_user === "USER") {
                updateSql = `UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', updated_at='${updatedTime}', updated_by='${user_type}' WHERE id='${loggedUserId}'`;
            } else if (fetch_user === "ADMIN") {
                updateSql = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', updated_at='${updatedTime}', updated_by='${user_type}' WHERE id='${loggedUserId}'`;
            }
        }

        if (fetch_user === "USER") {
            updateSql = addCreatedByCondition(updateSql, {
                table: "users",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });
        } else if (fetch_user === "ADMIN") {
            updateSql = addCreatedByCondition(updateSql, {
                table: "admins",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });
        }

        console.log("updateSql: ", updateSql);
        db.query(updateSql, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Profile Updated Successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Profile Not Updated" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

// const changePassword = async (req,res,next) => {

//     try {
//         const { old_password, new_password, confirm_password } = req.body
//         const loggedUserId = req.user.user_id;
//         console.log("loggedUserId", loggedUserId)
//         const getLoggedUserPassword = `SELECT password FROM admins WHERE id='${loggedUserId}'`
//         db.query(getLoggedUserPassword, async (err, result) => {
//             if (err) return res.status(200).json({ status: false, message: err })

//             if (result.length > process.env.VALUE_ZERO) {
//                 const isCorrectPassword = await bcrypt.compare(old_password, result[0].password)
//                 if (isCorrectPassword) {
//                     if (new_password == confirm_password) {
//                         const salt = bcrypt.genSaltSync(10);
//                         const hashPassword = await bcrypt.hash(new_password, salt);
//                         const updateQuery = `UPDATE admins SET password='${hashPassword}' WHERE id='${loggedUserId}'`
//                         //  res.status(200).send(updateQuery);
//                         db.query(updateQuery, async (err, result) => {
//                             if (err) return res.status(200).json({ status: false, message: err });

//                             if (result.affectedRows > process.env.VALUE_ZERO) {
//                                 res.status(200).json({ status: true, message: "Password changed successfully" })
//                             }
//                             else {
//                                 res.status(200).json({ status: false, message: "There is some error to change password, please try after sometime." })
//                             }
//                         })
//                     }
//                     else {
//                         return res.status(403).json({ status: false, message: "Confirm password is not equal to new password." })
//                     }
//                 }
//                 else {
//                     return res.status(200).json({ status: false, message: "Old password wrong" })
//                 }
//             }
//             else {
//                 return res.status(400).json({ status: false, message: "Something went wrong, please try after sometime" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(400).json({
//             status: false,
//             message: error.message
//         })
//     }
// }

const changePassword = async (req, res, next) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        const loggedUserId = req.user.user_id;
        const user_type = req.user.user_type;

        if (new_password !== confirm_password) {
            return res.status(403).json({ status: false, message: "Confirm password is not equal to new password." });
        }

        const getLoggedUserPasswordFromAdmins = `SELECT password FROM admins WHERE id='${loggedUserId}'`;
        db.query(getLoggedUserPasswordFromAdmins, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const isCorrectPassword = await bcrypt.compare(old_password, result[0].password);
                if (isCorrectPassword) {
                    await updatePasswordInTable("admins", loggedUserId, user_type, new_password, res);
                } else {
                    return res.status(200).json({ status: false, message: "Old password wrong" });
                }
            } else {
                const getLoggedUserPasswordFromUsers = `SELECT password FROM users WHERE id='${loggedUserId}'`;
                db.query(getLoggedUserPasswordFromUsers, async (err, result) => {
                    if (err) return res.status(500).json({ status: false, message: err.message });

                    if (result.length > process.env.VALUE_ZERO) {
                        const isCorrectPassword = await bcrypt.compare(old_password, result[0].password);
                        if (isCorrectPassword) {
                            await updatePasswordInTable("users", loggedUserId, user_type, new_password, res);
                        } else {
                            return res.status(200).json({ status: false, message: "Old password wrong" });
                        }
                    } else {
                        return res
                            .status(400)
                            .json({ status: false, message: "User not found in both admins and users tables." });
                    }
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updatePasswordInTable = async (table, userId, user_type, newPassword, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updateQuery = `UPDATE ${table} SET password='${hashPassword}', updated_by='${user_type}' WHERE id='${userId}'`;

    db.query(updateQuery, (err, result) => {
        if (err) return res.status(500).json({ status: false, message: err.message });

        if (result.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Password changed successfully" });
        } else {
            res.status(500).json({
                status: false,
                message: "There is some error to change password, please try after sometime.",
            });
        }
    });
};

const createEnergyCompany = async (req, res, next) => {
    try {
        const {
            username,
            email,
            password,
            contact_no,
            alt_number,
            company_name,
            website_url,
            address_1,
            gst_number,
            zone_id,
            ro_id,
            sale_area_id,
            status,
            country,
            city,
            pin_code,
            description,
        } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            contact_no: Joi.string().required(),
        }).options({ allowUnknown: true });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const createdBy = req.user.user_id;
        const user_type = process.env.ENERGY_COMPANY_ROLE_ID;
        const panel_id = await generatePanelIdForAdmin(process.env.ENERGY_COMPANY_ROLE_ID, company_name);
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

        const userInsertQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, status, country, city, pin_code, image, description, gst_number, created_by, panel_id) VALUES ('${username}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${status}', '${country}', '${city}', '${pin_code}',  '${storePath}', '${description}', '${gst_number}', '${createdBy}','${panel_id}')`;

        const checkExistingEmail = await db.query(`SELECT email FROM admins WHERE email = '${email}'`);
        if (checkExistingEmail.length > 0)
            return res.status(400).json({ status: false, message: "Email already exists" });

        db.query(userInsertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const energy_company_id = result.insertId;
                const unique_id = `A${result.insertId}`;
                await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [unique_id, energy_company_id]);
                //energy company create
                const insertEnergyCompanyQuery = `INSERT INTO energy_companies (admin_id, name, website) VALUES('${energy_company_id}', '${company_name}', '${website_url}')`;
                const insertEnergyCompanyResult = await db.query(insertEnergyCompanyQuery);

                res.status(200).json({ status: true, message: "Energy company created Successfully" });
            } else {
                res.status(200).json({
                    status: false,
                    message: "There is some error to insert data, please try after sometime.",
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllSubUserForSuperAdmin = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;
        const selectQuery = `SELECT * FROM users WHERE created_by = '${loggedUserId}'`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Success", data: result });
            } else {
                return res.status(200).json({ status: false, message: "No Data Found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllSuperAdminAndUsersWithPendingAccountStatus = async (req, res, next) => {
    try {
        const adminRole = process.env.ADMIN_ROLE_ID;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${adminRole}' AND admins.is_deleted='0' AND admins.status='0'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${adminRole}' AND admins.is_deleted='0' AND admins.status='0' ${searchDataCondition} ORDER   BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

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
                        pageDetails: pageDetails[0],
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

const superAdminAccountStatusAction = async (req, res, next) => {
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

        if (user_type == "Admin") {
            var updateQuery = `UPDATE admins SET status = '${status}' WHERE id = '${admin_id}'`;
        } else {
            var updateQuery = `UPDATE users SET status = '${status}' WHERE id = '${admin_id}'`;
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

// const markAsResolvedComplaints = async (req,res,next) => {
//     try {
//         const { complaints_id, assign_to } = req.body;

//         const loggedUserId = req.user.user_id;
//         const loggedUserType = req.user.user_type;
//         const title = 'Complaint assigned to user';
//         const roleDetailsData = await roleById(loggedUserType);
//         const remark = 'Complaint assigned by ' + roleDetailsData.name;
//         const resolvedRemark = 'Complaint resolved by' + roleDetailsData.name;
//         const status = 'assigned';
//         const resolvedStatus = 'resolved'

//         const checkComplaintisAssignOrNot = await db.query('SELECT * FROM complaints_timeline WHERE complaints_id = ? AND status IN (?, ?)', [complaints_id, 'approved', 'assigned']);
//         let query, values;
//         if (checkComplaintisAssignOrNot.length > 0) {
//             /**here to resolved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId];
//         } else {
//             /**here to approved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, remark, roleDetailsData.id, null, 'approved', loggedUserId];
//             /**here to assign the complalints its may be assign the end users multiple (assign_to)*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, remark, roleDetailsData.id, assign_to, status, loggedUserId];
//             /**here to resolved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId];

//         }

//         const updateQuery= `UPDATE complaints SET status= 5 WHERE id = ? `
//         const updateValues= [complaints_id];

//         const execQuery = await db.query(query, values)
//         const execUpdateQuery= await db.query(updateQuery, updateValues)
//         if (execQuery.affectedRows > 0) {
//             return res.status(StatusCodes.OK).json({ status: true, message: 'Complaint marked as resolved' })
//         } else {
//             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "some thing went wrong" })
//         }

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const markAsResolvedComplaints = async (req, res, next) => {
    try {
        const { complaints_id, area_manager_id, supervisor_id, assign_to } = req.body;

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = "Complaint assigned to user";
        const roleDetailsData = await roleById(loggedUserType);
        const remark = "Complaint assigned by " + roleDetailsData.name;
        const resolvedRemark = "Complaint resolved by " + roleDetailsData.name;
        const status = "assigned";
        const resolvedStatus = "resolved";

        const checkComplaintisAssignOrNot = await db.query(
            "SELECT * FROM complaints_timeline WHERE complaints_id = ? ORDER BY created_at DESC LIMIT 1",
            [complaints_id]
        );

        let query, values;
        const checkStatus = checkComplaintisAssignOrNot[0].status;

        if (checkComplaintisAssignOrNot.length > 0) {
            if (checkStatus == "approved") {
                if (assign_to.length > 0) {
                    // Assign the complaint to end users
                    const assignToPlaceholders = Array(assign_to.length).fill("(?, ?, ?, ?, ?, ?, ?)").join(",");
                    query = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id,area_manager_id, supervisor_id, assign_to, status, created_by, free_end_users) VALUES ${assignToPlaceholders}`;
                    values = assign_to.flatMap((assignToValue) => [
                        complaints_id,
                        title,
                        remark,
                        roleDetailsData.id,
                        area_manager_id,
                        supervisor_id,
                        assignToValue,
                        status,
                        loggedUserId,
                        1,
                    ]);
                    await db.query(query, values);

                    // Resolve the complaints
                    query =
                        "INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    values = [
                        complaints_id,
                        title,
                        resolvedRemark,
                        roleDetailsData.id,
                        null,
                        resolvedStatus,
                        loggedUserId,
                        0,
                    ];
                }
            } else if (checkStatus == "assigned") {
                // Directly mark the complaint as resolved
                query =
                    "INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                values = [
                    complaints_id,
                    title,
                    resolvedRemark,
                    roleDetailsData.id,
                    null,
                    resolvedStatus,
                    loggedUserId,
                    0,
                ];
            } else if (checkStatus == "resolved") {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "complaint already resolved" });
            } else {
                // If no record found, the complaint is in 'created' state
                // To approve the complaint
                query =
                    "INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
                values = [complaints_id, title, remark, roleDetailsData.id, null, "approved", loggedUserId];
                // await db.query(query, values);
                if (assign_to.length > 0) {
                    // Assign the complaint to end users
                    const assignToPlaceholders = Array(assign_to.length).fill("(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");
                    query = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, area_manager_id, supervisor_id, assign_to, status, created_by, free_end_users) VALUES ${assignToPlaceholders}`;
                    values = assign_to.flatMap((assignToValue) => [
                        complaints_id,
                        title,
                        remark,
                        roleDetailsData.id,
                        area_manager_id,
                        supervisor_id,
                        assignToValue,
                        status,
                        loggedUserId,
                        1,
                    ]);
                    // await db.query(query, values);

                    // Resolve the complaints
                    query =
                        "INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    values = [
                        complaints_id,
                        title,
                        resolvedRemark,
                        roleDetailsData.id,
                        null,
                        resolvedStatus,
                        loggedUserId,
                        0,
                    ];
                }
            }
        }

        // Update the status of the complaint
        const updateQuery = "UPDATE complaints SET status = 5 WHERE id = ?";
        const updateValues = [complaints_id];

        // Execute all queries
        const execQuery = await db.query(query, values);
        if (execQuery.affectedRows > 0) {
            await db.query(updateQuery, updateValues);

            return res.status(StatusCodes.OK).json({ status: true, message: "Complaint marked as resolved" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: true, message: "Error! complaint status not changed." });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteSuperAdminEmployees = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const loggedInUser = req.user.user_id;

        // const fetchUser = await getAdminDetailsById(id);
        // if (Object.keys(fetchUser).length === 0)
        //     return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "User not found" });
        // else {
        //     if (Object.keys(fetchUser).length > 0 && fetchUser.user_type == 1) {
        //         return res
        //             .status(StatusCodes.FORBIDDEN)
        //             .json({ status: false, message: "Super Admin cannot be deleted" });
        //     }
        // }
        if (loggedInUser == id)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "You cannot delete your self",
            });

        const deleteQuery = `UPDATE admins SET is_deleted = ? WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, ["1", id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Employee deleted successfully" });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Employee not deleted" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAdminUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, name, email, image, contact_no AS mobile, user_type, employee_id FROM admins WHERE id = ?`;
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

module.exports = {
    superAdminLogin,
    getProfileDetails,
    updateProfile,
    changePassword,
    createEnergyCompany,
    getAllSubUserForSuperAdmin,
    getAllSuperAdminAndUsersWithPendingAccountStatus,
    superAdminAccountStatusAction,
    markAsResolvedComplaints,
    getAllStoredEmployeeDetailsForSuperAdmin,
    getSingleEmployeeDetailByIdForSuperAdmin,
    deleteSuperAdminEmployees,
    getAdminUserById,
};

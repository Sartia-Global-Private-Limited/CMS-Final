var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const {
    checkPositiveInteger,
    adminCreateValidation,
    contractorValidations,
    contractorValidationsForUpdate,
} = require("../helpers/validation");
const {
    getContractorUsersById,
    getPendingContractorUsersById,
    getRecord,
    getPermissionOfModulesUsingRoleId,
    getSubModuleWithSubModulesWithPermission,
} = require("../helpers/general");
const {
    generatePanelIdForAdmin,
    generatePanelIdForUser,
    generateEmpIdForContractorUsers,
    generateEmpIdForSuperAdminUsers,
} = require("../helpers/panelHelper");
var Buffer = require("buffer/").Buffer;
const Joi = require("joi");
const { addCreatedByCondition } = require("../helpers/commonHelper");
const { mailSent } = require("../helpers/sendEmail");
const { generateEmailTemplate } = require("../helpers/mailTemplate");

const contractorCreate = async (req, res, next) => {
    try {
        let {
            name,
            email,
            password,
            contact_no,
            alt_number,
            address_1,
            country,
            city,
            pin_code,
            description,
            gst_number,
            pan_number,
            status,
            plan_id,
        } = req.body;
        const { error } = contractorValidations.validate({
            name: name,
            email: email,
            password: password,
            contact_no: contact_no,
        });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const checkUniqueGstNumber = `SELECT gst_number FROM admins WHERE gst_number=? `;
        const checkUniqueGstNumberQueryResult = await db.query(checkUniqueGstNumber, [gst_number]);

        const checkUniquePanNumber = `SELECT  pan_number FROM admins WHERE pan_number=? `;
        const checkUniquePanNumberQueryResult = await db.query(checkUniquePanNumber, [pan_number]);
        if (checkUniqueGstNumberQueryResult.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Gst number must be unique" });
        }

        if (checkUniquePanNumberQueryResult.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Pan number must be unique" });
        }

        const created_by = req.user.user_id;
        const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        const user_type = process.env.CONTRACTOR_ROLE_ID;
        let storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const panel_id = await generatePanelIdForAdmin(user_type, name);
        const [planRecord] = await getRecord("plans", "id", plan_id);
        if (!planRecord) {
            return res.status(400).json({ status: false, message: "Invalid Plan ID" });
        }
        const daysObject = {
            week: 7,
            month: 30,
            quarter: 90,
            half_year: 180,
            year: 365,
        };
        // let plan_expire_date = moment().format("YYYY-MM-DD");
        // plan_expire_date.setDate(plan_expire_date.getDate() + daysObject[planRecord.duration]);
        // console.log('plan_expire_date: ', plan_expire_date);
        // plan_expire_date = plan_expire_date.toISOString().split("T")[0];

        let plan_expire_date = moment(); // Use moment object instead of formatting to string
        plan_expire_date.add(daysObject[planRecord.duration], 'days'); // Add the duration in days
        plan_expire_date = plan_expire_date.format("YYYY-MM-DD"); // Format to "YYYY-MM-DD" for final value
        // console.log('plan_expire_date: ', plan_expire_date);

        description = description ?? "";
        gst_number = gst_number ?? "";
        pan_number = pan_number ?? "";
        let employee_id = "";
        const insertQuery = `
        INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, country, city, pin_code, image, description, gst_number, pan_number, status, created_by, panel_id, plan_id , plan_expire_date) 
        VALUES('${name}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${country}', '${city}', '${pin_code}', '${storePath}', '${description}', '${gst_number}', '${pan_number}', '${status}', '${created_by}', '${panel_id}', '${plan_id}', '${plan_expire_date}')`;

        // check for existing email and it is deleted
        const checkExistingEmail = await db.query(`SELECT id, email, is_deleted FROM admins WHERE email = '${email}'`);
        if (checkExistingEmail.length > 0) {
            // console.log('checkExistingEmail: ', checkExistingEmail);
            if (checkExistingEmail[0].is_deleted == "0") {
                return res.status(400).json({ status: false, message: "Email already exists" });
            } else {
                const updateQuery = `UPDATE admins SET 
                name = '${name}',
                email = '${email}',
                password = '${hashPassword}',
                contact_no = '${contact_no}',
                alt_number = '${alt_number}',
                user_type = '${user_type}',
                address_1 = '${address_1}',
                country = '${country}',
                city = '${city}',
                pin_code = '${pin_code}',
                image = '${storePath}',
                description = '${description}',
                gst_number = '${gst_number}',
                pan_number = '${pan_number}',
                status = '${status}',
                created_by = '${created_by}',
                panel_id = '${panel_id}',
                plan_id = '${plan_id}',
                plan_expire_date = '${plan_expire_date}',
                is_deleted = '0'
                WHERE email = '${email}'`;
                const updateResult = await db.query(updateQuery);

                if (updateResult.affectedRows > process.env.VALUE_ZERO) {
                    // console.log('updateResult: ', updateResult);
                    const insertId = checkExistingEmail[0].id;
                    const unique_id = `A${insertId}`;
                    const uniqueIdQuery = await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [
                        unique_id,
                        insertId,
                    ]);

                    employee_id = await generateEmpIdForSuperAdminUsers(created_by);
                    if (!employee_id) {
                        return res
                            .status(StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ status: false, message: "Unable to generate employee id" });
                    }
                    // Insert Employee ID
                    const updateEmployeeIdQuery = await db.query("UPDATE admins SET employee_id = ? WHERE id = ?", [
                        employee_id,
                        checkExistingEmail[0].id,
                    ]);
                    if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Employee Id Inserted successfully");
                    } else {
                        console.log("Employee Id Insertion failed");
                    }

                    // send email credentials in code block
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
                        console.log(response.message, response?.error);
                        throw new Error(response.message);
                    }

                    if (uniqueIdQuery.affectedRows > process.env.VALUE_ZERO) {
                        return res.status(200).json({ status: true, message: "Contractor Created Successfully" });
                    } else {
                        return res
                            .status(400)
                            .json({ status: false, message: "Something went wrong, please try again later" });
                    }
                } else {
                    return res.status(500).json({ status: false, message: "Something went wrong" });
                }
            }
        }

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const insertId = result.insertId;
                const unique_id = `A${insertId}`;
                const uniqueIdQuery = await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [
                    unique_id,
                    result.insertId,
                ]);

                employee_id = await generateEmpIdForSuperAdminUsers(created_by);
                if (!employee_id) {
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ status: false, message: "Unable to generate employee id" });
                }
                // Insert Employee ID
                const updateEmployeeIdQuery = await db.query("UPDATE admins SET employee_id = ? WHERE id = ?", [
                    employee_id,
                    result.insertId,
                ]);
                if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Employee Id Inserted successfully");
                } else {
                    console.log("Employee Id Insertion failed");
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
                if (uniqueIdQuery.affectedRows > process.env.VALUE_ZERO) {

                    const initialsName = name?.substring(0, 4).toUpperCase() || "CMS";

                    const currentYear = moment().format("YYYY");
                    const nextYear = moment().add(1, 'year').format("YY");;
                    // const billNoPrefix = "CMSIT";
                    const billNoPrefix = initialsName + "-" + "BILL";
                    const separation_symbol = "-";
                    const start_bill_number = "00000";

                    // Output: 2024-25
                    // console.log(`${currentYear}-${nextYear}`); 

                    const financial_year_format = `${currentYear}-${nextYear}`

                    // add bill no. format for new created contractor user
                    const billNoFormatData = {
                        prefix: billNoPrefix,
                        separation_symbol,
                        financial_year_format: financial_year_format,
                        start_bill_number,
                        financial_year: financial_year_format,
                        sample_format: `${billNoPrefix}${separation_symbol}${financial_year_format}${separation_symbol}${start_bill_number}`,
                        status: 1,
                        created_by: insertId,
                        created_at
                    }
                    await db.query(`INSERT INTO invoice_no_format SET ?`, billNoFormatData);

                    // add bill no. format for new created contractor user
                    // const empNoPrefix = "CMSIT-EMP";
                    const empNoPrefix = initialsName + "-" + "EMP";
                    const start_employee_number = "00000";

                    const empNoFormatData = {
                        prefix: empNoPrefix,
                        separation_symbol,
                        financial_year_format: financial_year_format,
                        start_employee_number,
                        financial_year: financial_year_format,
                        sample_format: `${empNoPrefix}${separation_symbol}${financial_year_format}${separation_symbol}${start_employee_number}`,
                        status: 1,
                        created_by: insertId,
                        created_at
                    }
                    await db.query(`INSERT INTO employee_no_format SET ?`, empNoFormatData);

                    // add bill no. format for new created contractor user
                    // const companyNoFormatData = {
                    //     prefix: "CMSIT-EMP",
                    //     separation_symbol: "-",
                    //     financial_year_format: financial_year_format,
                    //     start_company_number: "00000",
                    //     type: 1,
                    //     financial_year: financial_year_format,
                    //     sample_format: `${prefix}${separation_symbol}${financial_year_format}${separation_symbol}${start_company_number}`,
                    //     status: 1,
                    //     created_by: created_by,
                    //     created_at: created_by
                    // }
                    // await db.query(`INSERT INTO client_vendor_no_format SET ?`, empNoFormatData);


                    const companyPrefix = [`${initialsName}-client`, `${initialsName}-vendor`, `${initialsName}-client-vendor`, `${initialsName}-supplier`];

                    const startCompanyNumbers = [100000, 200000, 300000, 400000];

                    const insertData = startCompanyNumbers.map((num, index) => ({
                        prefix: companyPrefix[index],
                        separation_symbol,
                        financial_year_format: financial_year_format,
                        start_company_number: num.toString(),
                        type: index + 1,
                        financial_year: financial_year_format,
                        sample_format: `${companyPrefix[index]}${separation_symbol}${financial_year_format}${separation_symbol}${num.toString()}`,
                        status: 1,
                        created_by: insertId,
                        created_at: created_at
                    }));

                    await db.query(
                        `INSERT INTO client_vendor_no_format (prefix, separation_symbol, financial_year_format, start_company_number, type, financial_year, sample_format, status, created_by, created_at) VALUES ?`, 
                        [insertData.map(item => Object.values(item))]
                    );
                    console.log("Company formats inserted successfully!");

                    return res.status(200).json({ status: true, message: "Contractor Created Successfully" });
                } else {
                    return res
                        .status(400)
                        .json({ status: false, message: "Something went wrong, please try again later" });
                }
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getContractorById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as admin_id, name, email, contact_no, alt_number, address_1, country, city, pin_code, description, image, status FROM admins WHERE id='${id}' AND user_type ='${process.env.CONTRACTOR_ROLE_ID}' AND is_deleted = '0'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            db.query(selectQuery, async (err, result) => {
                if (err) return res.status(403).json({ status: false, message: err });

                if (result.length > process.env.VALUE_ZERO) {
                    return res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
                } else {
                    return res.status(404).json({ status: false, message: "Contractor not found" });
                }
            });
        });
    } catch (error) {
        return next(error);
    }
};

const updateContractorDetailsById = async (req, res, next) => {
    try {
        let {
            name,
            email,
            contact_no,
            alt_number,
            address_1,
            country,
            city,
            pin_code,
            description,
            id,
            type,
            status,
            joining_date,
            gst_number,
            pan_number,
            plan_id,
        } = req.body;

        const { error } = contractorValidationsForUpdate.validate({ name: name, email: email, contact_no: contact_no });
        if (error) return res.status(400).json({ status: false, message: error.message });
        const { error: formError } = checkPositiveInteger.validate({ id: id });
        if (formError) return res.status(400).json({ status: false, message: formError });

        const checkUniqueGstNumber = `SELECT gst_number FROM admins WHERE gst_number=? `;
        const checkUniqueGstNumberQueryResult = await db.query(checkUniqueGstNumber, [gst_number]);

        const checkUniquePanNumber = `SELECT  pan_number FROM admins WHERE pan_number=? `;
        const checkUniquePanNumberQueryResult = await db.query(checkUniquePanNumber, [pan_number]);

        if (checkUniqueGstNumberQueryResult.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Gst number must be unique" });
        }

        if (checkUniquePanNumberQueryResult.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Pan number must be unique" });
        }

        let storePath = "";
        let updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        let updateQuery = ``;
        if (type == "Contractor") {
            if (req.files != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/user_images/" + imageName;
                storePath = "/user_images/" + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({ status: false, message: err.message });
                });

                updateQuery = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', alt_number='${alt_number}', address_1='${address_1}', country='${country}', city='${city}', pin_code='${pin_code}', description='${description}', image='${storePath}', updated_at='${updatedAt}', status='${status}', gst_number='${gst_number}', pan_number='${pan_number}', plan_id='${plan_id}' WHERE id='${id}'`;
            } else {
                updateQuery = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', alt_number='${alt_number}', address_1='${address_1}', country='${country}', city='${city}', pin_code='${pin_code}', description='${description}', updated_at='${updatedAt}', status='${status}', gst_number='${gst_number}', pan_number='${pan_number}', plan_id='${plan_id}' WHERE id='${id}'`;
            }
        } else {
            if (req.files != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/user_images/" + imageName;
                storePath = "/user_images/" + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({ status: false, message: err.message });
                });

                updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', status='${status}', joining_date='${joining_date}', image='${storePath}', updated_at='${updatedAt}' WHERE id='${id}'`;
            } else {
                updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', status='${status}', joining_date='${joining_date}', updated_at='${updatedAt}' WHERE id='${id}'`;
            }
        }

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const remark = `Updated status to ${status == process.env.ACTIVE_STATUS ? "Active" : "Inactive"}`;
                const updatedBy = req.user.user_id;

                if (type != "Contractor") {
                    const insertQuery = `
                    INSERT INTO user_status_timeline(user_id, remark, updated_status, updated_by, updated_at) 
                    VALUES ('${id}','${remark}','${status}','${updatedBy}', '${updatedAt}')`;
                    await db.query(insertQuery);
                }

                return res.status(200).json({ status: true, message: `${type} Updated Successfully` });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const createContractorUser = async (req, res, next) => {
    try {
        const { name, email, password, mobile, joining_date, status } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            mobile: Joi.string().required(),
            joining_date: Joi.string().required(),
        }).options({ allowUnknown: true });

        const { error } = schema.validate({
            name: name,
            email: email,
            password: password,
            mobile: mobile,
            joining_date: joining_date,
        });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const checkExistingEmail = await db.query(`SELECT email FROM users WHERE email = '${email}'`);
        if (checkExistingEmail.length > 0)
            return res.status(400).json({ status: false, message: "Email already exists" });

        const createdBy = req.user.user_id;
        let adminId = "";
        let loggedUserType = req.user.user_type;
        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            adminId = req.body.contractor_id;
        } else {
            adminId = req.user.user_id;
        }
        const user_type = process.env.USER_ROLE_ID;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");
        let storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        }

        // console.log('adminId: ', adminId);
        const panelId = await generatePanelIdForUser(loggedUserType, adminId);
        // console.log('panelId: ', panelId);

        const userCreateQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, image, user_type, admin_id, created_by, status) VALUES('${name}', '${name}', '${email}', '${hashPassword}', '${encodedPassword}', '${mobile}', '${joining_date}', '${storePath}', '${user_type}', '${adminId}', '${adminId}', '${status}')`;

        db.query(userCreateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const employee_id = await generateEmpIdForContractorUsers();
                const unique_id = `U${result.insertId}`;
                await db.query("UPDATE users SET unique_id = ?, panel_id = ?, employee_id = ? WHERE id = ?", [
                    unique_id,
                    panelId,
                    employee_id,
                    result.insertId,
                ]);

                return res.status(200).json({ status: true, message: "Contractor user created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllContractorAndUsers = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.CONTRACTOR_ROLE_ID}' AND admins.is_deleted='0'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const contractorRole = process.env.CONTRACTOR_ROLE_ID;
        let selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name, admins.email, admins.alt_number, admins.address_1, admins.city, admins.pin_code, admins.country, plans.name AS plan_name, plans.price AS plan_price, plans.duration, admins.plan_expire_date, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type LEFT JOIN plans ON plans.id=admins.plan_id WHERE admins.user_type='${contractorRole}' AND admins.is_deleted='0' ${searchDataCondition} ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        // let selectQuery = `SELECT users.id as admin_id, users.image, users.name, users.email, users.alt_number, users.address_1, users.city, users.pin_code, users.country, plans.name AS plan_name, plans.price AS plan_price, plans.duration, users.plan_expire_date, users.status, users.contact_no, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type LEFT JOIN plans ON plans.id=users.plan_id WHERE users.user_type='${contractorRole}' AND users.is_deleted='0' ${searchDataCondition} ORDER BY users.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "admins",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // console.log('selectQuery: ', selectQuery);
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        plan_duration: element.duration,
                        users: await getContractorUsersById(element.admin_id),
                    };
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    let pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getContractorAndUsersFullDetailByIdAndType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const type = req.params.type;

        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        let selectQuery;

        // if (type == "Client" || type == "Contractor") {
        if (type == "Client") {
            selectQuery = `
            SELECT admins.id as admin_id, admins.name, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.country, admins.city, admins.pin_code, admins.description, admins.image, admins.status, roles.name as user_type, plans.id AS plan_id, plans.name AS plan_name, plans.price AS plan_price, plans.duration AS plan_duration, admins.plan_expire_date
            FROM admins 
            INNER JOIN roles ON roles.id=admins.user_type 
            LEFT JOIN plans ON plans.id=admins.plan_id
            WHERE admins.id='${id}' AND admins.user_type ='${process.env.CONTRACTOR_ROLE_ID}'
            `;
        } else {
            // selectQuery = `
            //     SELECT users.id as admin_id, users.name, users.email, users.mobile, users.joining_date, users.image, users.status, roles.name as user_type, plans.id AS plan_id, plans.name AS plan_name, plans.price AS plan_price, plans.duration AS plan_duration, admins.plan_expire_date
            //     FROM users
            //     INNER JOIN roles ON roles.id=users.user_type
            //     LEFT JOIN plans ON plans.id=admins.plan_id
            //     WHERE users.id='${id}' AND users.user_type ='${process.env.USER_ROLE_ID}'
            //     `;
            selectQuery = `
                SELECT users.id as admin_id, users.name, users.email, users.mobile, users.joining_date, users.image, users.status, roles.name as user_type,  plans.name AS plan_name, plans.price AS plan_price, plans.duration AS plan_duration, admins.plan_expire_date, admins.plan_id as plan_id
                FROM users 
                LEFT JOIN roles ON roles.id=users.user_type 
                LEFT JOIN admins ON users.admin_id = admins.id
                LEFT JOIN plans ON plans.id=admins.plan_id
                WHERE users.id='${id}' AND users.user_type ='${process.env.USER_ROLE_ID}'
                `;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteContractorAndUsers = async (req, res, next) => {
    try {
        const id = req.params.id;
        const type = req.params.type;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        if (type == "Contractor") {
            var updateQuery = `UPDATE admins SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.CONTRACTOR_ROLE_ID}'`;
        } else {
            var updateQuery = `UPDATE users SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.USER_ROLE_ID}'`;
        }

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Account has been deleted successfully" });
            } else {
                res.status(403).json({ status: false, message: "Something went wrong, please try after sometime" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllContractorAndUsersWithPendingAccountStatus = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.CONTRACTOR_ROLE_ID}' AND admins.is_deleted='0' AND admins.status='0'`;

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const contractorRole = process.env.CONTRACTOR_ROLE_ID;
        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${contractorRole}' AND admins.is_deleted='0' AND admins.status='0' '${searchDataCondition}' ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, users: await getPendingContractorUsersById(element.admin_id) };
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
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const contractorAccountStatusAction = async (req, res, next) => {
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

        if (status === 1) {
            responseMessage = "Activated";
        } else {
            responseMessage = "Rejected";
        }
        if (user_type == "Contractor") {
            var updateQuery = `UPDATE admins SET status = '${status}' WHERE id = '${admin_id}'`;
        } else {
            var updateQuery = `UPDATE users SET status = '${status}' WHERE id = '${admin_id}`;
        }

        // res.send({data: updateQuery, status: status})
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

const getContractorSidebar = async (req, res, next) => {
    try {
        const type = req.query.type;
        let adminUserDetails;
        let uniqueId = req.user.unique_id;
        if (uniqueId && uniqueId.startsWith("A")) {
            adminUserDetails = await getRecord("admins", "id", req.user.user_id);
        }

        let otherUserDetails;
        // console.log('adminUserDetails: ', adminUserDetails);
        if (!adminUserDetails || adminUserDetails.length === 0) {
            otherUserDetails = await getRecord("users", "id", req.user.user_id);
            if (!otherUserDetails || otherUserDetails.length === 0) {
                // return res.status(403).json({ status: false, message: "User not found" });
                throw new Error("User not found");
            }
        }
        // console.log('otherUserDetails: ', otherUserDetails);
        let plan_id;
        // console.log('adminUserDetails: ', adminUserDetails);
        // console.log('Array.isArray(adminUserDetails) : ', Array.isArray(adminUserDetails) );
        // console.log(' Object.keys(adminUserDetails): ', Object.keys(adminUserDetails) );
        if (Array.isArray(adminUserDetails) && adminUserDetails.length > 0) {
            plan_id = adminUserDetails[0]?.plan_id;
        }
        // else if (Object.keys(adminUserDetails).length > 0) {
        //     plan_id = adminUserDetails?.plan_id;
        // }
        else {
            // check if any plan exists for user
            // if not then fetch contractors plan id and insert into users plan
            // console.log('otherUserDetails[0].plan_id: ', otherUserDetails[0].plan_id);
            if (!otherUserDetails[0].plan_id) {
                const adminUserDetails = await getRecord("admins", "id", otherUserDetails[0].created_by);
                plan_id = adminUserDetails[0].plan_id;
            } else {
                plan_id = otherUserDetails[0].plan_id;
            }

            // plan_id = otherUserDetails[0].plan_id;
        }
        if (!plan_id) {
            // return res.status(403).json({ status: false, message: "No plan assigned" });
            throw new Error("Plan not assigned");
        }
        const [userPlanDetails] = await getRecord("plans", "id", plan_id);
        if (!userPlanDetails) {
            // return res.status(403).json({ status: false, message: "Plan not found" });
            throw new Error("Plan not found");
        }
        let purchasedModulesId = JSON.parse(JSON.parse(userPlanDetails?.module || "[]"));
        const parentModuleObj = {};
        purchasedModulesId.forEach((element) => {
            parentModuleObj[element] = element;
        });


        const getModulesQuery = `SELECT * FROM modules WHERE type LIKE '%${type}%' AND is_deleted = 0 ORDER BY id`;
        const modules = await db.query(getModulesQuery);
        const moduleIds = modules.map((e) => e.id);
        const modulesObj = {};
        for (const module of modules) {
            modulesObj[module.id] = module;
            module.submodules = [];
        }
        const getSubModulesQuery = `SELECT * FROM sub_modules WHERE module_id IN (${moduleIds}) AND type LIKE '%${type}%' AND is_deleted = 0 ORDER BY id`;
        const subModules = moduleIds.length === 0 ? [] : await db.query(getSubModulesQuery);
        const subModulesObj = {};
        for (const subMod of subModules) {
            subModulesObj[subMod.id] = subMod;
            subMod.modulesOfSubModule = [];
        }
        const subModIds = subModules.map((subMod) => subMod.id);
        const getSubSubModulesQuery = `SELECT * FROM module_of_sub_modules WHERE sub_module_id IN (${subModIds}) AND type LIKE '%${type}%' AND is_deleted = 0 ORDER BY id`;
        const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
        const subSubModulesObj = {};
        for (const subSubMod of subSubModules) {
            subSubModulesObj[subSubMod.id] = subSubMod;
        }

        for (const module in modulesObj) {
            modulesObj[module].submodules = subModules.filter((e) => e.module_id == module);
        }

        for (const subMod in subModulesObj) {
            subModulesObj[subMod].modulesOfSubModule = subSubModules.filter((e) => e.sub_module_id == subMod);
        }

        let create_permission = 0;
        let view_permission = 0;
        let update_permission = 0;
        let delete_permission = 0;

        let sidebarList = Object.values(modulesObj);

        const finalResult = sidebarList.map(async (element) => {
            const modulePermissionData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, req.user.user_type);
            if (modulePermissionData.length > 0) {
                create_permission = modulePermissionData[0].created;
                view_permission = modulePermissionData[0].viewed;
                update_permission = modulePermissionData[0].updated;
                delete_permission = modulePermissionData[0].deleted;
            }

            element.create = create_permission;
            element.view = view_permission;
            element.update = update_permission;
            element.delete = delete_permission;

            if (parentModuleObj[element.id]) {
                element.status = 1;
                element.submodules.map(async (submodule) => {
                    submodule.status = 1;
                    submodule.modulesOfSubModule.map((subSubModule) => {
                        subSubModule.status = 1;
                        return subSubModule;
                    });
                    return submodule;
                });
                return {
                    ...element,
                    create: create_permission,
                    view: view_permission,
                    update: update_permission,
                    delete: delete_permission,
                    submodules: await getSubModuleWithSubModulesWithPermission(element.id, req.user.user_type, type),
                };
            } else {
                element.status = 0;
                element.submodules.map((submodule) => {
                    // if(modulePermissionData[0].module_id == 11 && submodule.id == 38)

                    // providing explicit permission to My Profile for all users of cms panel
                    // if (submodule.title == "My Profile") {
                    //     submodule.status = 1;
                    //     submodule.create = 1;
                    //     submodule.view = 1;
                    //     submodule.update = 1;
                    //     submodule.delete = 1;
                    // }
                    // else {
                    submodule.status = 0;
                    submodule.create = 0;
                    submodule.view = 0;
                    submodule.update = 0;
                    submodule.delete = 0;
                    submodule.modulesOfSubModule.forEach((subSubModule) => {
                        subSubModule.status = 0;
                        subSubModule.create = 0;
                        subSubModule.view = 0;
                        subSubModule.update = 0;
                        subSubModule.delete = 0;
                        return subSubModule;
                    });
                    // }
                    return submodule;
                });
                return {
                    ...element,
                    create: 0,
                    view: 0,
                    update: 0,
                    delete: 0,
                };
            }
        });
        const values = await Promise.all(finalResult);
        return res.status(200).json({ status: true, message: "Sidebar Fetched successfully", data: values });
    } catch (error) {
        return next(error);
    }
};

const getContractorSidebarTest = async (req, res, next) => {
    try {
        const getModulesQuery = `SELECT * FROM modules WHERE is_deleted = 0 ORDER BY id`;
        const modules = await db.query(getModulesQuery);
        const moduleIds = modules.map((e) => e.id);
        const modulesObj = {};
        for (const module of modules) {
            modulesObj[module.id] = module;
            module.submodules = [];
        }
        const getSubModulesQuery = `SELECT * FROM sub_modules WHERE module_id IN (${moduleIds}) AND is_deleted = 0 ORDER BY id`;
        const subModules = moduleIds.length === 0 ? [] : await db.query(getSubModulesQuery);
        const subModulesObj = {};
        for (const subMod of subModules) {
            subModulesObj[subMod.id] = subMod;
            subMod.modulesOfSubModule = [];
        }
        const subModIds = subModules.map((subMod) => subMod.id);
        const getSubSubModulesQuery = `SELECT * FROM module_of_sub_modules WHERE sub_module_id IN (${subModIds}) AND is_deleted = 0 ORDER BY id`;
        const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
        const subSubModulesObj = {};
        for (const subSubMod of subSubModules) {
            subSubModulesObj[subSubMod.id] = subSubMod;
        }
        for (const subMod in subModulesObj) {
            subModulesObj[subMod].subModules = subSubModules.filter((e) => e.sub_module_id == subMod);
            // console.log(subModulesObj[subMod], "subModulesObj[subMod]")
        }
        for (const module in modulesObj) {
            modulesObj[module].submodules = subModules.filter((e) => e.module_id == module);
            // console.log(modulesObj[module], "modulesObj[module]")
        }
        const sidebarList = Object.values(modulesObj);
        return res.status(200).json({
            status: true,
            message: "sidebar Fetched successfully",
            data: sidebarList,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    contractorCreate,
    getContractorById,
    updateContractorDetailsById,
    createContractorUser,
    getAllContractorAndUsers,
    getContractorAndUsersFullDetailByIdAndType,
    deleteContractorAndUsers,
    getAllContractorAndUsersWithPendingAccountStatus,
    contractorAccountStatusAction,
    getContractorSidebar,
    getContractorSidebarTest,
};

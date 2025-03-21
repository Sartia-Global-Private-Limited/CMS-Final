require("dotenv").config();
const moment = require("moment");
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const Joi = require("joi");
const db = makeDb();
const { checkPositiveInteger, companyValidation, emailValidation, loginValidation } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const {
    getGstDetailsByCompanyId,
    getAdminDetailsById,
    getRecord,
    calculatePagination,
    getRecordWithWhereAndJoin,
} = require("../helpers/general");
const { exportToPDF, exportToExcel } = require("./contractorComplaintController");
const { addCreatedByCondition, checkAlreadyExistGst } = require("../helpers/commonHelper");
const { generatePanelIdForAdmin, generateEmpIdForSuperAdminUsers } = require("../helpers/panelHelper");

const addPurchaseCompany = async (req, res, next) => {
    try {
        const {
            company_name,
            company_email,
            company_contact,
            company_mobile,
            company_address,
            company_contact_person,
            primary_contact_number,
            primary_contact_email,
            designation,
            department,
            company_website,
            gst_treatment_type,
            business_legal_name,
            business_trade_name,
            pan_number,
            gst_number,
            place_of_supply,
            billings_address,
            shipping_address,
        } = req.body;

        const { error, value } = purchaseCompany.validate(req.body);

        if (error) return res.status(400).json({ status: false, message: error.message });
        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO purchase_companies(company_name, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_number, place_of_supply, billings_address, shipping_address, created_by) VALUES('${company_name}', '${company_email}', '${company_contact}', '${company_mobile}', '${company_address}', '${company_contact_person}', '${primary_contact_number}', '${primary_contact_email}', '${designation}', '${department}', '${company_website}', '${gst_treatment_type}', '${business_legal_name}', '${business_trade_name}', '${pan_number}', '${gst_number}', '${place_of_supply}', '${billings_address}', '${shipping_address}', '${createdBy}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Purchase company created successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getPurchaseCompany = async (req, res, next) => {
    try {
        // const loggedUserId = req.user.user_id;

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const city = req.query.city || "";

        let searchDataCondition = "";
        let queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND (companies.company_name LIKE ? OR 
                companies.company_unique_id LIKE ? OR
                companies.company_email LIKE ? OR
                companies.pan_number LIKE ? OR
                companies.company_contact_person LIKE ? OR 
                companies.company_pincode LIKE ? OR 
                companies.company_mobile LIKE ? OR
                states.name LIKE ? OR 
                cities.name LIKE ? OR  
                company_gst_details.gst_number LIKE ?
                )`;

            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
            queryParams.unshift(`%${searchData}%`);
        }

        let cityFilter = "";
        if (city && city != "") {
            cityFilter = ` cities.name = ? AND`;
        }

        let selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city LEFT JOIN company_gst_details ON company_gst_details.company_id = companies.company_id WHERE ${cityFilter} companies.is_superadmin_company = ? AND companies.company_type = ? AND companies.is_deleted = ? AND companies.created_by = ? ${searchDataCondition} ORDER BY companies.company_id `;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "companies",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        if (pageSize) {
            selectQuery += ` DESC LIMIT ?, ?`;
        }

        queryParams.unshift(
            process.env.VALUE_ZERO,
            process.env.PURCHASE_COMPANY,
            process.env.INACTIVE_STATUS,
            req.user.user_id
        );
        if (city && city != "") {
            queryParams.unshift(city);
        }

        const queryResult = await db.query(selectQuery, queryParams);

        let values = [];
        let pageDetails = [];
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact,
                    primary_contact_number: row.primary_contact_,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails,
                    state: row.state_id,
                    state_name: row.state_name,
                    city: row.city_id,
                    city_name: row.city_name,
                    pin_code: row.company_pincode,
                });
            }

            if (!pageSize) {
                values = values.map((item) => {
                    return {
                        ...item,
                        gst_number: item.gst_details[0].gst_number,
                    };
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(values, "vendor-companies", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(values, "vendor-companies", "Vendor Companies", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            pageDetails = await calculatePagination(queryResult.length, currentPage, pageSize);

            return res.send({ status: true, message: "Fetched successfully", data: values, pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getPurchaseCompanyById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const loggedUserId = req.user.user_id;
        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, companies.is_company_login_enable, companies.login_id, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city WHERE companies.company_type = ? AND companies.company_id = ?`;
        const queryResult = await db.query(selectQuery, [process.env.PURCHASE_COMPANY, id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);

                if (row.is_company_login_enable >= "1") {
                    const loginId = row.login_id;
                    const loginDetails = await getAdminDetailsById(loginId);
                    if (loginDetails) {
                        row.email = loginDetails.email;
                        row.password = loginDetails.password;
                    } else {
                        row.email = "";
                        row.password = "";
                    }
                }

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact_person,
                    primary_contact_number: row.primary_contact_number,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade_name,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    is_company_login_enable: row.is_company_login_enable,
                    login_id: row.login_id,
                    email: row.email,
                    password: row.password,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails,
                    state: row.state_id,
                    state_name: row.state_name,
                    city: row.city_id,
                    city_name: row.city_name,
                    pin_code: row.company_pincode,
                });
            }

            res.send({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const editPurchaseCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const loggedUserId = req.user.user_id;
        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.company_type = ? AND companies.company_id = ?`;
        const queryResult = await db.query(selectQuery, [process.env.PURCHASE_COMPANY, id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact_person,
                    primary_contact_number: row.primary_contact_number,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade_name,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails,
                });
            }

            res.send({ status: true, message: "Fetched successfully", data: values[0] });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updatePurchaseCompanyById = async (req, res, next) => {
    try {
        let {
            company_name,
            company_type,
            company_email,
            company_contact,
            company_mobile,
            company_address,
            company_contact_person,
            primary_contact_number,
            primary_contact_email,
            designation,
            department,
            company_website,
            gst_treatment_type,
            business_legal_name,
            business_trade_name,
            pan_number,
            gst_details,
            place_of_supply,
            my_company,
            enable_company_type,
            email,
            password,
            login_id,
            id,
            state,
            city,
            pin_code,
        } = req.body;

        const createdBy = req.user.user_id;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const { error } = companyValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        let is_company_login_enable = "0";

        // update login details for company
        if (enable_company_type) {
            const { error } = emailValidation.validate({ email: email });
            if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

            if (login_id != null || login_id > 0) {
                // first check if user with email already exist
                const conditions = [
                    { field: "admins.email", operator: "=", value: email },
                    { field: "companies.login_id", operator: "!=", value: login_id },
                    { field: "admins.is_deleted", operator: "=", value: "0" },
                ];
                const joins = [{ type: "LEFT", table: "admins", on: "companies.login_id = admins.id" }];
                const existingUser = await getRecordWithWhereAndJoin("companies", conditions, joins);
                console.log("existingUser: ", existingUser);
                if (existingUser.length > 0) {
                    const message =
                        existingUser[0].company_name != "" ? `for company ${existingUser[0].company_name}` : "";
                    return res
                        .status(StatusCodes.FORBIDDEN)
                        .json({ status: false, message: `primary contact email already exist ${message}` });
                }
                // on updating if password is changed , then update password and other details
                if (password != "") {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    const updateQuery = `UPDATE admins SET name = ?, email = ?, password = ?, contact_no = ?, address_1 = ?, status = ? WHERE id = ?`;
                    const updateValues = [
                        company_contact_person,
                        email,
                        hashPassword,
                        company_contact,
                        company_address,
                        "1",
                        login_id,
                    ];
                    const loginQueryResult = await db.query(updateQuery, updateValues);
                    if (loginQueryResult.affectedRows > 0) {
                        console.log(`Login details updated successfully for email: ${email}`);
                    }
                } else {
                    const updateQuery = `UPDATE admins SET name = ?, email = ?, contact_no = ?, address_1 = ?, status = ? WHERE id = ?`;
                    const updateValues = [
                        company_contact_person,
                        email,
                        company_contact,
                        company_address,
                        "1",
                        login_id,
                    ];
                    const loginQueryResult = await db.query(updateQuery, updateValues);
                    if (loginQueryResult.affectedRows > 0) {
                        console.log(`Login details updated successfully for email: ${email}`);
                    }
                }
            } else {
                // first check if user with email already exist
                const conditions = [
                    { field: "email", operator: "=", value: email },
                    { field: "is_deleted", operator: "=", value: "0" },
                ];
                const existingUser = await getRecordWithWhereAndJoin("admins", conditions);
                if (existingUser.length > 0) {
                    return res
                        .status(StatusCodes.FORBIDDEN)
                        .json({ status: false, message: "primary contact email already exist" });
                }
                // if login_id is null, then insert new user with password
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hash(password, salt);
                const user_type = process.env.ADMIN_ROLE_ID;
                const panel_id = await generatePanelIdForAdmin(process.env.ADMIN_ROLE_ID, company_name);

                const userInsertQuery = `
                    INSERT INTO admins (name, email, password, contact_no, user_type, address_1, created_by, panel_id, created_at, status) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const insertValues = [
                    company_contact_person,
                    email,
                    hashPassword,
                    primary_contact_number,
                    user_type,
                    company_address,
                    createdBy,
                    panel_id,
                    createdAt,
                    "1",
                ];
                const loginQueryResult = await db.query(userInsertQuery, insertValues);
                let employee_id = "";
                if (loginQueryResult.affectedRows > 0) {
                    login_id = loginQueryResult.insertId;
                    const unique_id = `A${login_id}`;
                    await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [unique_id, login_id]);

                    employee_id = await generateEmpIdForSuperAdminUsers(createdBy);
                    if (!employee_id) {
                        console.log("Employee Id Generation failed");
                    }
                    // Insert Employee ID
                    const updateEmployeeIdQuery = await db.query("UPDATE admins SET employee_id = ? WHERE id = ?", [
                        employee_id,
                        login_id,
                    ]);
                    if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Employee Id Inserted successfully");
                    } else {
                        console.log("Employee Id Insertion failed");
                    }
                }
            }

            is_company_login_enable = "1";
            await db.query(`UPDATE companies SET login_id = ? WHERE company_id = ?`, [login_id, id]);
        }

        if (is_company_login_enable == "0" && login_id > 0) {
            await db.query(`UPDATE admins SET status = ? WHERE id = ?`, [process.env.INACTIVE_STATUS, login_id]);
        }

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, is_company_login_enable = ?, updated_at = ?, company_state = ?, company_city = ?, company_pincode = ? WHERE company_id = ?`;

        const company_state = state ? state : null;
        const company_city = city ? city : null;
        const company_pincode = pin_code ? pin_code : null;

        // const panAlreadyExist = await getRecord("companies", "pan_number", pan_number);
        const panAlreadyExist = await db.query(
            `SELECT * FROM companies WHERE pan_number = ? AND is_deleted = "0" AND company_id != ? AND created_by = ?`,
            [pan_number, id, createdBy]
        );
        if (panAlreadyExist.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: `Pan number ${pan_number} already exist` });
        }

        const queryResult = await db.query(updateQuery, [
            company_name,
            company_type,
            company_email,
            company_contact,
            company_mobile,
            company_address,
            company_contact_person,
            primary_contact_number,
            primary_contact_email,
            designation,
            department,
            company_website,
            gst_treatment_type,
            business_legal_name,
            business_trade_name,
            pan_number,
            place_of_supply,
            my_company,
            is_company_login_enable,
            updatedAt,
            company_state,
            company_city,
            company_pincode,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (gst_details != null) {
                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    // check for existing gst details
                    const existingGst = await checkAlreadyExistGst(gst_details);

                    if (existingGst.status) {
                        if (existingGst.company_id != id) {
                            if (existingGst.created_by == createdBy) {
                                if (existingGst.deleted == "1") {
                                    const updateQuery = `UPDATE company_gst_details SET
                                    is_deleted = '0', 
                                    company_id = ${id}, 
                                    gst_number = '${existingGst.gst}', 
                                    shipping_address = '${existingGst.shipping_address}', 
                                    billing_address = '${existingGst.billing_address}', 
                                    is_default = '${existingGst.is_default}', 
                                    created_by = '${createdBy}', 
                                    created_at = '${createdAt}' 
                                    WHERE id = ${existingGst.id}`;
                                    // console.log("updateQuery: ", updateQuery);
                                    await db.query(updateQuery);
                                    console.log("GST details updated successfully");
                                } else {
                                    return res.status(StatusCodes.BAD_REQUEST).json({
                                        status: false,
                                        message: `GST number ${existingGst.gst} already exists`,
                                    });
                                }
                            }
                        }
                    }

                    const updateGstQuery = await db.query(`SELECT * FROM company_gst_details WHERE company_id = ?`, [
                        id,
                    ]);

                    if (updateGstQuery.length == 0) {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [
                            id,
                            gst_number,
                            gst_details[i].shipping_address,
                            gst_details[i].billing_address,
                            gst_details[i].is_default,
                            createdBy,
                        ]);
                        console.log("GST details updated successfully");
                    } else {
                        const updateQuery = `UPDATE company_gst_details SET
                                        is_deleted = '0', 
                                        gst_number = '${gst_number}', 
                                        shipping_address = '${gst_details[i].shipping_address}', 
                                        billing_address = '${gst_details[i].billing_address}', 
                                        is_default = '${gst_details[i].is_default}', 
                                        created_by = '${createdBy}', 
                                        created_at = '${createdAt}' 
                                        WHERE id = ${updateGstQuery[0].id}`;
                        // console.log("updateQuery: ", updateQuery);
                        await db.query(updateQuery);
                        console.log("GST details updated successfully");
                    }

                    // const deleteExistCompanyGstDetails = `DELETE FROM company_gst_details WHERE company_id = ?`;
                    // const deleteExistCompanyGstDetailsResult = await db.query(deleteExistCompanyGstDetails, [id]);

                    // for (let i = 0; i < gst_details.length; i++) {
                    //     const gst_number = gst_details[i].gst_number;
                    //     const shipping_address = gst_details[i].shipping_address;
                    //     const billing_address = gst_details[i].billing_address;
                    //     const is_default = gst_details[i].is_default;
                    //     const gst_details_id = gst_details[i].id;

                    //     if (deleteExistCompanyGstDetailsResult.affectedRows > process.env.VALUE_ZERO) {
                    //         const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                    //         const result = await db.query(gstDetailInsertQuery, [
                    //             id,
                    //             gst_number,
                    //             shipping_address,
                    //             billing_address,
                    //             is_default,
                    //             createdBy,
                    //         ]);
                    //     }
                    // }
                }
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Company details updated successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! Company details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const deletePurchaseCompanyById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `UPDATE companies SET is_deleted = ? WHERE company_id = ?`;
        const queryResult = await db.query(deleteQuery, [process.env.ACTIVE_STATUS, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Company deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! Company details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addPurchaseCompany,
    getPurchaseCompany,
    getPurchaseCompanyById,
    editPurchaseCompany,
    updatePurchaseCompanyById,
    deletePurchaseCompanyById,
};

require("dotenv").config();
const moment = require("moment");
const { con, makeDb } = require("../db");
const db = makeDb();
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const { generatePanelIdForAdmin, generateEmpIdForSuperAdminUsers } = require("../helpers/panelHelper");

const {
    companyValidation,
    checkPositiveInteger,
    loginValidation,
    emailValidation,
    gst_details,
    companyImportValidation,
} = require("../helpers/validation");
const {
    getGstDetailsByCompanyId,
    getAdminDetailsById,
    calculatePagination,
    getRecord,
    deleteRecords,
    softDeleteRecords,
    getRecordWithWhereAndJoin,
} = require("../helpers/general");
const {
    checkCompanyGstDefaultMarkOrNot,
    importExcelData,
    uploadFile,
    checkAlreadyExistGst,
    generateCompanyUniqueId,
    addAdminCondition,
    addCreatedByCondition,
    fetchStates,
    fetchCities,
    fetchCitiesBasedOnState,
    generateClientVendorId,
} = require("../helpers/commonHelper");
const { log } = require("console");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");
const xlsx = require("xlsx");
const { body, validationResult } = require("express-validator");
const path = require("path");

const createCompany = async (req, res, next) => {
    try {
        const {
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
            state,
            city,
            pin_code,
        } = req.body;

        const { error } = companyValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // check gst mark default address or not
        const checkGstMarkDefaultOrNot = await checkCompanyGstDefaultMarkOrNot(gst_details);
        if (!checkGstMarkDefaultOrNot) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please set one gst address as a default address",
            });
        }

        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const companyUniqueId = await generateClientVendorId(company_type, createdBy);

        // check whether contact person email already exists in database before insertion
        const conditions = [
            { field: "email", operator: "=", value: primary_contact_email },
            { field: "is_deleted", operator: "=", value: "0" },
        ];
        const existingUser = await getRecordWithWhereAndJoin("admins", conditions);
        if (existingUser.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Primary Contact person email already exists",
            });
        }
        // Insert new user for company using 'primary_contact_email'
        const user_type = process.env.ADMIN_ROLE_ID;
        const panel_id = await generatePanelIdForAdmin(process.env.ADMIN_ROLE_ID, company_name);
        let login_id = "";
        let employee_id = "";
        const userInsertQuery = `
            INSERT INTO admins (name, email, contact_no, user_type, address_1, panel_id, created_by, created_at) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
        const userInsertValues = [
            company_contact_person,
            primary_contact_email,
            primary_contact_number,
            user_type,
            company_address,
            panel_id,
            createdBy,
            createdAt,
        ];
        const userInsertResult = await db.query(userInsertQuery, userInsertValues);
        // if user inserted successfully, then update unique_id and employee id
        if (userInsertResult.affectedRows > 0) {
            console.log(`User '${company_contact_person}' inserted successfully`);
            login_id = userInsertResult.insertId; //login_id updated
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

        let is_company_login_enable = "0";

        // create login details for company if Company Login is Enabled from Frontend side
        if (enable_company_type) {
            const { error } = loginValidation.validate(req.body);
            if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // activate user with status 1 if company login enable
            const userUpdateQuery = `UPDATE admins SET password = ?, status = ? WHERE id = ?`;

            const userUpdateResult = await db.query(userUpdateQuery, [
                hashPassword,
                process.env.ACTIVE_STATUS,
                login_id,
            ]);

            if (userUpdateResult.affectedRows > 0) {
                is_company_login_enable = "1";
                console.log(`User updated with password and status activated successfully`);
            }
        }

        const unique_id = await generateCompanyUniqueId();

        let insertQuery = `
            INSERT INTO companies(company_unique_id, company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, is_superadmin_company, is_company_login_enable, status, unique_id, created_by, company_state, company_city, company_pincode, created_at, login_id) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const company_state = state ? state : null;
        const company_city = city ? city : null;
        const company_pincode = pin_code ? pin_code : null;

        const panAlreadyExist = await getRecord("companies", "pan_number", pan_number);
        // login_id != "" ? `login_id = ${login_id},` : "";
        // console.log("panAlreadyExist: ", panAlreadyExist);
        if (panAlreadyExist.length > 0) {
            if (panAlreadyExist[0].created_by == createdBy) {
                if (panAlreadyExist[0].is_deleted == "1") {
                    const updateCompanyQuery = `UPDATE companies
                        SET 
                            is_deleted = '0', 
                            company_unique_id = '${companyUniqueId}', 
                            company_name = '${company_name}', 
                            company_type = '${company_type}', 
                            company_email = '${company_email}', 
                            company_contact = '${company_contact}', 
                            company_mobile = '${company_mobile}', 
                            company_address = '${company_address}', 
                            company_contact_person = '${company_contact_person}', 
                            primary_contact_number = '${primary_contact_number}', 
                            primary_contact_email = '${primary_contact_email}', 
                            designation = '${designation}', 
                            department = '${department}', 
                            company_website = '${company_website}', 
                            gst_treatment_type = '${gst_treatment_type}', 
                            business_legal_name = '${business_legal_name}', 
                            business_trade_name = '${business_trade_name}', 
                            pan_number = '${pan_number}', 
                            place_of_supply = '${place_of_supply}', 
                            is_superadmin_company = '${my_company}', 
                            is_company_login_enable = '${is_company_login_enable}', 
                            login_id = '${login_id}', 
                            status = '1', 
                            unique_id = '${"OC_" + panAlreadyExist[0].company_id}', 
                            created_by = '${createdBy}', 
                            company_state = '${company_state}', 
                            company_city = '${company_city}', 
                            company_pincode = '${company_pincode}', 
                            updated_at = '${createdAt}' 
                        WHERE 
                            company_id = '${panAlreadyExist[0].company_id}'
                        `;
                    // console.log("updateCompanyQuery: ", updateCompanyQuery);
                    const updateQueryResult = await db.query(updateCompanyQuery);
                    if (updateQueryResult.affectedRows > process.env.VALUE_ZERO) {
                        // check for existing gst details
                        if (gst_details != null) {
                            for (let i = 0; i < gst_details.length; i++) {
                                const gst_number = gst_details[i].gst_number;
                                const shipping_address = gst_details[i].shipping_address;
                                const billing_address = gst_details[i].billing_address;
                                const is_default = gst_details[i].is_default;

                                const existingGst = await checkAlreadyExistGst(gst_details);
                                // console.log('existingGst: ', existingGst);
                                if (existingGst.status) {
                                    if (existingGst.created_by == createdBy) {
                                        if (existingGst.deleted == "1") {
                                            const updateQuery = `UPDATE company_gst_details SET 
                                                is_deleted = '0', company_id = ${panAlreadyExist[0].company_id}, gst_number = '${gst_number}', shipping_address = '${shipping_address}', billing_address = '${billing_address}', is_default = '${is_default}', created_by = '${createdBy}', updated_at = '${createdAt}' WHERE id = ${existingGst.id}`;
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
                        }
                        return res.status(StatusCodes.OK).json({
                            status: true,
                            message: "Company created successfully",
                        });
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            status: false,
                            message: "Something went wrong, Please try again later",
                        });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: false,
                        message: `PAN number ${pan_number} already exists`,
                    });
                }
            }
            // else {
            //     return res.status(StatusCodes.BAD_REQUEST).json({
            //         status: false,
            //         message: `PAN number ${pan_number} already exists`,
            //     });
            // }
        }

        let insertValues = [
            companyUniqueId,
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
            "1",
            unique_id,
            createdBy,
            company_state,
            company_city,
            company_pincode,
            createdAt,
            login_id,
        ];

        // if (login_id != "") {
        //     insertValues.push(login_id);
        // }

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const companyId = queryResult.insertId;
            // const company_unique_id = `OC_${companyId}`;
            // await db.query("UPDATE companies SET unique_id = ? WHERE company_id = ?", [company_unique_id, companyId]);

            if (gst_details != null) {
                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;

                    const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                    const result = await db.query(gstDetailInsertQuery, [
                        companyId,
                        gst_number,
                        shipping_address,
                        billing_address,
                        is_default,
                        createdBy,
                        createdAt,
                    ]);
                }
            }
            // }

            return res.status(StatusCodes.OK).json({ status: true, message: "Company created successfully" });
        } else {
            // if company creation failed, delete user from database
            await db.query(`DELETE FROM admins WHERE id = ?`, [login_id]);
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! company not created" });
        }
    } catch (error) {
        return next(error);
    }
};

const getMyCompany = async (req, res, next) => {
    try {
        // const loggedUserId = req.user.user_id;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const isDropdown = req.query.isDropdown ?? null;
        const city = req.query.city || "";

        let searchDataCondition = "";
        let queryParams = [];

        if (searchData != null && searchData != "") {
            searchDataCondition += ` AND (companies.company_name LIKE '%${searchData}%' OR 
            companies.company_unique_id LIKE '%${searchData}%' OR 
            companies.company_email LIKE '%${searchData}%' OR 
            companies.pan_number LIKE '%${searchData}%' OR 
            companies.company_contact_person LIKE '%${searchData}%' OR 
            companies.company_pincode LIKE '%${searchData}%' OR
            companies.company_mobile LIKE '%${searchData}%' OR
            states.name LIKE '%${searchData}%' OR 
            cities.name LIKE '%${searchData}%' OR
            company_gst_details.gst_number LIKE '%${searchData}%' OR
            company_types.company_type_name LIKE '%${searchData}%' 
            )`;
        }

        let cityFilter = "";
        if (city && city != "") {
            cityFilter = ` AND cities.name = ?`;
        }

        let selectQuery = `SELECT companies.company_id, companies.company_unique_id,companies.unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city LEFT JOIN company_gst_details ON company_gst_details.company_id = companies.company_id WHERE companies.is_superadmin_company= ? AND companies.is_deleted = ? AND companies.created_by = '${req.user.user_id}' ${cityFilter} ${searchDataCondition} ORDER BY companies.company_id DESC `;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "companies",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        if (pageSize && !isDropdown) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        queryParams.unshift(process.env.ACTIVE_STATUS, process.env.INACTIVE_STATUS);
        if (city && city != "") {
            queryParams.push(city);
        }

        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery, queryParams);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        // console.log('modifiedQueryString: ', modifiedQueryString);
        const totalResult = await db.query(modifiedQueryString, [
            process.env.ACTIVE_STATUS,
            process.env.INACTIVE_STATUS,
            city ? city : "",
        ]);
        // console.log('totalResult: ', totalResult);

        let values = [];
        let pageDetails;
        // console.log('queryResult: ', queryResult);
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
                pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
                // console.log('pageDetails: ', pageDetails);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact,
                    unique_id: row.unique_id,
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

            if (!pageSize && !isDropdown) {
                values = values.map((item) => {
                    return {
                        ...item,
                        gst_number: item.gst_details[0].gst_number,
                    };
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(values, "my-companies", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(values, "my-companies", "My Companies", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }
            return res.send({
                status: true,
                message: "Fetched successfully",
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getMyCompanySingleDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // const loggedUserId = req.user.user_id;
        let selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, companies.is_company_login_enable, companies.login_id, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city WHERE companies.is_superadmin_company= ? AND companies.company_id = ?`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "companies",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery, [process.env.ACTIVE_STATUS, id]);

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
                    unique_id: row.unique_id,
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

            res.send({
                status: true,
                message: "Fetched successfully",
                data: values[0],
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateMyCompanyDetails = async (req, res, next) => {
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

        // console.log("req.body.login_id: ", req.body.login_id);

        const createdBy = req.user.user_id;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const { error } = companyValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // check gst mark default address or not
        const checkGstMarkDefaultOrNot = await checkCompanyGstDefaultMarkOrNot(gst_details);
        if (!checkGstMarkDefaultOrNot) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please set one gst address as a default address",
            });
        }

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
                    // else update details except password
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

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, is_company_login_enable = ?, updated_at = ?, companY_state = ?, company_city = ?, company_pincode = ? WHERE company_id = ?`;

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
                    // console.log("gst_number: ", gst_number);
                    // check for existing gst details
                    // const existingGst = await checkAlreadyExistGst(gst_details);
                    const existingGst = await db.query(`
                        SELECT * FROM company_gst_details
                        WHERE gst_number = '${gst_number}' AND is_deleted = '0'
                        AND created_by = '${createdBy}' `);
                    // console.log("existingGst: ", existingGst);

                    if (existingGst.length > 0) {
                        if (existingGst[0].company_id != id) {
                            if (existingGst[0].created_by == createdBy) {
                                if (existingGst[0].is_deleted == "1") {
                                    const updateQuery = `UPDATE company_gst_details SET
                                        is_deleted = '0',
                                        company_id = ${id},
                                        gst_number = '${existingGst[0].gst_number}',
                                        shipping_address = '${existingGst[0].shipping_address}',
                                        billing_address = '${existingGst[0].billing_address}',
                                        is_default = '${existingGst[0].is_default}',
                                        created_by = '${createdBy}',
                                        created_at = '${createdAt}'
                                        WHERE id = ${existingGst[0].id}`;
                                    // console.log("updateQuery: ", updateQuery);
                                    await db.query(updateQuery);
                                    console.log("GST details updated successfully");
                                } else {
                                    return res.status(StatusCodes.BAD_REQUEST).json({
                                        status: false,
                                        message: `GST number ${existingGst[0].gst_number} already exists`,
                                    });
                                }
                            }
                            return res.status(StatusCodes.BAD_REQUEST).json({
                                status: false,
                                message: `GST number ${existingGst[0].gst_number} already exists`,
                            });
                        }
                    }

                    if (gst_details[i].id && gst_details[i].company_id) {
                        const shippingAdd =
                            gst_details[i]?.shipping_address == null ? "" : gst_details[i]?.shipping_address;
                        const updateQuery = `UPDATE company_gst_details SET
                            is_deleted = '0',
                            gst_number = '${gst_number}',
                            shipping_address = '${shippingAdd}',
                            billing_address = '${gst_details[i].billing_address}',
                            is_default = '${gst_details[i].is_default}',
                            created_by = '${createdBy}',
                            created_at = '${createdAt}'
                            WHERE id = ${gst_details[i].id}`;
                        // console.log("updateQuery: ", updateQuery);
                        await db.query(updateQuery);
                        console.log(`GST number ${gst_number} updated successfully`);
                    } else {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [
                            id,
                            gst_number,
                            gst_details[i].shipping_address,
                            gst_details[i].billing_address,
                            gst_details[i].is_default,
                            createdBy,
                        ]);
                        console.log(`New GST number ${gst_number} updated successfully`);
                    }

                    // const updateGstQuery = await db.query(`SELECT * FROM company_gst_details WHERE company_id = ?`, [
                    //     id,
                    // ]);

                    // if (updateGstQuery.length == 0) {
                    //     const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                    //     const result = await db.query(gstDetailInsertQuery, [
                    //         id,
                    //         gst_number,
                    //         gst_details[i].shipping_address,
                    //         gst_details[i].billing_address,
                    //         gst_details[i].is_default,
                    //         createdBy,
                    //     ]);
                    //     console.log(`New GST number ${gst_number} updated successfully`);
                    // } else {
                    //     const updateQuery = `UPDATE company_gst_details SET
                    //                     is_deleted = '0',
                    //                     gst_number = '${gst_number}',
                    //                     shipping_address = '${gst_details[i].shipping_address}',
                    //                     billing_address = '${gst_details[i].billing_address}',
                    //                     is_default = '${gst_details[i].is_default}',
                    //                     created_by = '${createdBy}',
                    //                     created_at = '${createdAt}'
                    //                     WHERE id = ${updateGstQuery[0].id}`;
                    //     // console.log("updateQuery: ", updateQuery);
                    //     await db.query(updateQuery);
                    //     console.log(`GST number ${gst_number} updated successfully`);
                    // }

                    // const deleteExistCompanyGstDetails = `DELETE FROM company_gst_details WHERE company_id = ?`;
                    // const deleteExistCompanyGstDetailsResult = await db.query(deleteExistCompanyGstDetails, [id]);

                    // const shipping_address = gst_details[i].shipping_address;
                    // const billing_address = gst_details[i].billing_address;
                    // const is_default = gst_details[i].is_default;
                    // const gst_details_id = gst_details[i].id;

                    // if (deleteExistCompanyGstDetailsResult.affectedRows > process.env.VALUE_ZERO) {
                    // const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                    // const result = await db.query(gstDetailInsertQuery, [
                    //     id,
                    //     gst_details[i].gst_number,
                    //     gst_details[i].shipping_address,
                    //     gst_details[i].billing_address,
                    //     gst_details[i].is_default,
                    //     req.user.user_id,
                    // ]);
                    // }
                }
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: "Company details updated successfully",
            });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! Company details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteMyCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // check first is there any complaints for this company;
        const complaintRecords = await getRecord("complaints", "energy_company_id", id);
        const complaintIds = [];
        let complaintExist = false;
        for (let record of complaintRecords) {
            if (
                record.complaint_for == "2" &&
                (record.status == 2 || record.status == 3 || record.status == 5 || record.status == 6)
            ) {
                complaintExist = true;
                break;
            }
            complaintIds.push(record.id);
        }
        if (complaintExist) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Cannot delete company, Company has complaints record",
            });
        }

        const deleteQuery = `UPDATE companies SET is_deleted = ? WHERE company_id = ?`;
        const queryResult = await db.query(deleteQuery, [process.env.ACTIVE_STATUS, id]);
        complaintIds.length > 0 && (await softDeleteRecords("complaints", complaintIds));
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // soft delete GST details after deleting company
            const deleteGst = await db.query(
                `UPDATE company_gst_details SET is_deleted = '1' WHERE company_id = '${id}'`
            );
            if (deleteGst.affectedRows > process.env.VALUE_ZERO) {
                console.log("Company gst details deleted successfully");
            } else console.log("Error while deleting company gst details");
            return res.status(StatusCodes.OK).json({ status: true, message: "Company deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! Company details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const getCompanyTypes = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM  company_types`;
        const result = await promisify(db.query)(selectQuery);

        if (result.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

//all company with my/sale/purchase company
const getAllCompany = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";
        const isDropdown = req.query.isDropdown || false;
        // let totalPages = process.env.VALUE_ZERO;
        // const countSelectQuery = `SELECT COUNT(companies.company_id) as total, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id = companies.company_type WHERE companies.is_deleted = ? GROUP BY company_types.company_type_name;`;

        // constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        // if (constTotalLength.length > 0) totalPages = Math.round(constTotalLength[0].total / pageSize);
        // const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

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
            company_gst_details.gst_number LIKE ? OR
            ct.company_type_name LIKE ?
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
            queryParams.unshift(`%${searchData}%`);
        }

        let selectQuery = `SELECT companies.*, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id = companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city LEFT JOIN company_gst_details ON company_gst_details.company_id = companies.company_id LEFT JOIN company_types ct ON ct.company_type_id = companies.company_type WHERE companies.is_deleted = ? AND companies.created_by = ? ${searchDataCondition} ORDER BY companies.company_id`;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "companies",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        if (pageSize && !isDropdown) {
            selectQuery += ` DESC LIMIT ?, ?`;
        }

        queryParams.unshift(process.env.NOT_DELETED, req.user.user_id);
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
                    unique_id: row.unique_id,
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

            if (!pageSize && !isDropdown) {
                values = values.map((item) => {
                    return {
                        ...item,
                        gst_number: item.gst_details[0].gst_number,
                    };
                });

                let filePath;
                let message = type == "1" ? "excel exported successfully" : "pdf exported successfully";
                if (type == "1") {
                    filePath = await exportToExcel(values, "all-companies", columns);
                } else {
                    filePath = await exportToPDF(values, "all-companies", "All (360° View) Companies", columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }

            let countSelectQuery = `SELECT COUNT(companies.company_id) as total FROM companies INNER JOIN company_types ON company_types.company_type_id = companies.company_type WHERE companies.is_deleted = ?`;

            countSelectQuery = addCreatedByCondition(countSelectQuery, {
                table: "companies",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });

            constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
            if (constTotalLength.length > 0) {
                // totalPages = Math.round(constTotalLength[0].total / pageSize);
                totalPages = Math.ceil(constTotalLength[0].total / pageSize);
            }
            const total = constTotalLength[0].total;

            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            pageDetails.push({
                pageSize,
                currentPage,
                totalPages,
                total,
                pageStartResult,
                pageEndResult,
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: values,
                pageDetails: pageDetails[0],
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCompanyDataForChart = async (req, res, next) => {
    try {
        const finalData = {};
        const currentYear = moment().year();

        const roundMyCompanyQuery = `
            SELECT 
                COUNT(companies.company_id) AS total, 
                IFNULL(SUM(companies.company_type = 1), 0) AS client_company_count, 
                IFNULL(SUM(companies.company_type = 2), 0) AS vendor_company_count, 
                IFNULL(SUM(companies.company_type = 3), 0) AS both_company_count
            FROM companies 
            INNER JOIN company_types ON company_types.company_type_id = companies.company_type 
            LEFT JOIN states ON states.id = companies.company_state 
            LEFT JOIN cities ON cities.id = companies.company_city 
            WHERE companies.is_deleted = ? AND companies.is_superadmin_company = ? AND companies.created_by = ?; 
        `;

        const monthlyCompaniesQuery = `
            SELECT 
                DATE_FORMAT(created_at, '%b') AS month, 
                SUM(company_type = 1) AS total_client_company, 
                SUM(company_type = 2) AS total_vendor_company
            FROM companies 
            WHERE 
                is_deleted = ? AND 
                is_superadmin_company = ? AND 
                YEAR(created_at) = ? AND
                created_by = ? 
            GROUP BY DATE_FORMAT(created_at, '%b'), MONTH(created_at)
            ORDER BY MONTH(created_at);
        `;

        // Execute queries
        const dataMyCompanies = await db.query(roundMyCompanyQuery, [process.env.NOT_DELETED, 1, req.user.user_id]);
        const monthlyData = await db.query(monthlyCompaniesQuery, [
            process.env.NOT_DELETED,
            0,
            currentYear,
            req.user.user_id,
        ]);

        // Prepare monthly data with all months of the year
        const monthsMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        };

        const monthlyCompanyData = Array.from({ length: 12 }, (_, i) => ({
            month: moment().month(i).format("MMM"), // Use moment to generate month names
            total_client_company: 0,
            total_vendor_company: 0,
        }));

        // Fill in data for months where companies were created
        monthlyData.forEach((record) => {
            const monthIndex = monthsMap[record.month];
            if (monthIndex !== undefined) {
                monthlyCompanyData[monthIndex].total_client_company = record.total_client_company || 0;
                monthlyCompanyData[monthIndex].total_vendor_company = record.total_vendor_company || 0;
            }
        });

        // Add data to finalData object
        finalData.totalCompanies = dataMyCompanies[0];
        finalData.monthlyData = monthlyCompanyData;

        return res.status(StatusCodes.OK).json({ status: true, data: finalData });
    } catch (error) {
        return next(error);
    }
};

const getCompanySingleDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT companies.company_id, companies.company_unique_id,companies.unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name, companies.company_pincode, states.id AS state_id, states.name AS state_name, cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN states ON states.id = companies.company_state LEFT JOIN cities ON cities.id = companies.company_city WHERE companies.company_id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

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
                    unique_id: row.unique_id,
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
                    state: row.state_id,
                    state_name: row.state_name,
                    city: row.city_id,
                    city_name: row.city_name,
                    pin_code: row.company_pincode,
                });
            }

            res.send({
                status: true,
                message: "Fetched successfully",
                data: values[0],
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateCompanyDetails = async (req, res, next) => {
    try {
        const {
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
            id,
            state,
            city,
            pin_code,
        } = req.body;

        const { error } = companyValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, updated_at = ?, company_state = ?, company_city = ?, company_pincode = ? WHERE company_id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const createdBy = req.user.user_id;
        const company_state = state ? state : null;
        const company_city = city ? city : null;
        const company_pincode = pin_code ? pin_code : null;

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
            updatedAt,
            company_state,
            company_city,
            company_pincode,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (gst_details != null) {
                const deleteExistCompanyGstDetails = `DELETE FROM company_gst_details WHERE company_id = ?`;
                const deleteExistCompanyGstDetailsResult = await db.query(deleteExistCompanyGstDetails, [id]);

                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;
                    const gst_details_id = gst_details[i].id;

                    if (deleteExistCompanyGstDetailsResult.affectedRows > process.env.VALUE_ZERO) {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [
                            id,
                            gst_number,
                            shipping_address,
                            billing_address,
                            is_default,
                            createdBy,
                        ]);
                    }
                }
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: "Company details updated successfully",
            });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Error! Company details not updated" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCompanyForDropdown = async (req, res, next) => {
    try {
        const query = `SELECT company_id, company_name FROM companies WHERE is_deleted = "0"`;
        const queryResult = await db.query(query);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetch successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getCompanyDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(`SELECT * FROM companies WHERE company_id = ?`, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (const row of queryResult) {
                finalData.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_type: row.company_type,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    unique_id: row.unique_id,
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
                    gst_number: row.gst_number,
                    place_of_supply: row.place_of_supply,
                    billings_address: row.billings_address,
                    shipping_address: row.shipping_address,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Company details found",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Company details not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getComplaintName = async (req, res, next) => {
    try {
        const { id } = req.body;

        if (!id || !Array.isArray(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid ID format. Expected an array of IDs.",
            });
        }

        const selectQuery = await db.query(
            `SELECT energy_company_id, complaint_for FROM complaints WHERE id IN (${id.map(() => "?").join(",")})`,
            id
        );

        if (selectQuery.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No complaints found for the provided IDs.",
            });
        }

        const final = [];
        for (const row of selectQuery) {
            let query;
            if (row.complaint_for == "1") {
                query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);
            } else {
                query = await db.query(
                    `SELECT company_id AS id, company_name as name FROM companies WHERE company_id = ?`,
                    [row.energy_company_id]
                );
            }
            final.push(...query);
        }

        const filteredResults = {};
        final.forEach((record) => {
            if (!filteredResults[record.id]) {
                filteredResults[record.id] = record;
            }
        });

        return res.status(200).json({
            status: true,
            data: Object.values(filteredResults),
        });
    } catch (error) {
        return next(error);
    }
};

async function getComplaint(id) {
    try {
        if (!id || !Array.isArray(id) || id.length === 0) {
            throw new Error("Invalid ID format. Expected a non-empty array of IDs.");
        }

        const selectQuery = await db.query(
            `SELECT energy_company_id, complaint_for FROM complaints WHERE id IN (${id.map(() => "?").join(",")})`,
            id
        );

        if (selectQuery.length === 0) {
            throw new Error("No complaints found for the provided IDs.");
        }

        const final = [];
        for (const row of selectQuery) {
            let query;
            if (row.complaint_for === "1") {
                query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);
            } else {
                query = await db.query(
                    `SELECT company_id AS id, company_name AS name FROM companies WHERE company_id = ?`,
                    [row.energy_company_id]
                );
            }
            final.push(...query);
        }

        const uniqueResults = final.reduce((acc, record) => {
            if (!acc.some((item) => item.id === record.id)) {
                acc.push(record);
            }
            return acc;
        }, []);

        return uniqueResults;
    } catch (error) {
        throw error;
    }
}

// const bulkInsertExcelData = async (req,res,next) => {

//     try {
//         const companyFilePath = req.files?.company_file;
//         const gstFilePath = req.files?.gst_file;
//         if(!companyFilePath || !gstFilePath) return res.status(StatusCodes.BAD_REQUEST).json({
//             status: false,
//             message: "File not provided!"
//         })

//         const companyResult = await importExcelData(companyFilePath, "companies", req.user.user_id);

//         if(companyResult && gstResult) {
//             return res.status(StatusCodes.OK).json({ status: true, message: "Data imported successfully!" });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not imported!" });
//         }
//     } catch (error) {next(error)
//
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };

const companyImport = async (req, res, next) => {
    try {
        let filePath = "";
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel File is required",
            });
        }
        const { state, city } = req.body;
        filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);
        // return console.log('completePath: ', completePath);
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        // const rows = req.body.data

        const createdBy = req.user.user_id;
        const userType = req.user.user_type;
        const createdAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        // Separate sets for each field to track duplicates within the provided rows
        const mobileSet = new Set();
        const panSet = new Set();
        const gstSet = new Set();
        const contactEmailSet = new Set();

        // loop to check duplicate records in excel sheet first, before inserting into database
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            const {
                company_name,
                company_type,
                company_email = "",
                company_contact = "",
                company_mobile = "",
                company_address,
                company_pincode,
                company_contact_person,
                primary_contact_number,
                primary_contact_email = "",
                designation,
                department,
                company_website,
                gst_treatment_type,
                business_legal_name,
                business_trade_name,
                pan_number = "",
                place_of_supply,
                my_company,
                enable_company_type,
                email,
                password,
                gst_number = "",
                shipping_address,
                billing_address,
            } = row;

            // console.log("row: ", row);

            // Validate the row
            const { error } = companyImportValidation.validate(row);
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} ${error.details[0].message}`,
                });
            }

            if (company_mobile && mobileSet.has(company_mobile)) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} duplicate company mobile ${company_mobile} found in provided rows`,
                });
            }
            if (pan_number && panSet.has(pan_number)) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} duplicate PAN number ${pan_number} found in provided rows`,
                });
            }
            if (gst_number && gstSet.has(gst_number)) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} duplicate GST number ${gst_number} found in provided rows`,
                });
            }
            if (primary_contact_email && contactEmailSet.has(primary_contact_email)) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} duplicate company email ${primary_contact_email} found in provided rows`,
                });
            }

            // Add to sets for tracking
            if (company_mobile) mobileSet.add(company_mobile);
            if (pan_number) panSet.add(pan_number);
            if (gst_number) gstSet.add(gst_number);
            if (primary_contact_email) contactEmailSet.add(primary_contact_email);

            // Business-specific validation logic
            if (company_type == "3" && my_company != "1") {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} set my company 1 for company type ${company_type}`,
                });
            }

            // Unique PAN number database check
            const panAlreadyExist = await db.query(
                `SELECT * FROM companies WHERE pan_number = ? AND is_deleted = "0" AND created_by = ?`,
                [pan_number, createdBy]
            );
            if (panAlreadyExist.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} PAN number ${pan_number} already exists`,
                });
            }

            // Unique GST number database check
            const existingGst = await db.query(
                `SELECT * FROM company_gst_details WHERE gst_number = ? AND is_deleted = "0" AND created_by = ?`,
                [gst_number, createdBy]
            );
            if (existingGst.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} GST number ${gst_number} already exists`,
                });
            }

            // Email and password requirement check
            if (enable_company_type) {
                if (!email || !password) {
                    return res.status(400).json({
                        status: false,
                        message: `at row ${i + 1} email and password are required`,
                    });
                }
            }

            // Company type validation
            const companyTypeExists = await getRecord("company_types", "company_type_id", company_type);
            if (companyTypeExists.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: `at row ${i + 1} company_type is not valid`,
                });
            }

            // first check if user with email already exist
            const conditions = [
                { field: "email", operator: "=", value: email },
                { field: "is_deleted", operator: "=", value: "0" },
            ];
            const existingContactUser = await getRecordWithWhereAndJoin("admins", conditions);
            if (existingContactUser.length > 0) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ status: false, message: `primary contact email already exist` });
            }
        }

        let errorMessage = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            const {
                company_name,
                company_type,
                company_email,
                company_contact,
                company_mobile,
                company_address,
                company_pincode,
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
                enable_company_type,
                email,
                password,
                gst_number,
                shipping_address,
                billing_address,
            } = row;

            // Insert new user for company using 'primary_contact_email'
            const user_type = process.env.ADMIN_ROLE_ID;
            const panel_id = await generatePanelIdForAdmin(process.env.ADMIN_ROLE_ID, company_name);
            let login_id = "";
            let employee_id = "";
            const userInsertQuery = `
                INSERT INTO admins (name, email, contact_no, user_type, address_1, panel_id, created_by, created_at) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
            const userInsertValues = [
                company_contact_person,
                primary_contact_email,
                primary_contact_number,
                user_type,
                company_address,
                panel_id,
                createdBy,
                createdAt,
            ];
            const userInsertResult = await db.query(userInsertQuery, userInsertValues);
            // if user inserted successfully, then update unique_id and employee id
            if (userInsertResult.affectedRows > 0) {
                console.log(`User '${company_contact_person}' inserted successfully`);
                login_id = userInsertResult.insertId; //login_id updated
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

            const companyUniqueId = await generateClientVendorId(company_type, createdBy);
            const unique_id = await generateCompanyUniqueId();
            let is_company_login_enable = enable_company_type ? "1" : "0";

            // create login details for company if Company Login is Enabled from Frontend side
            if (enable_company_type) {
                const { error } = loginValidation.validate(req.body);
                if (error) return res.status(StatusCodes.FORBIDDEN).json({ 
                    status: false, 
                    message: `at row ${i + 1} ${error.details[0].message}` 
                });

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hash(password, salt);

                // activate user with status 1 if company login enable
                const userUpdateQuery = `UPDATE admins SET password = ?, status = ? WHERE id = ?`;

                const userUpdateResult = await db.query(userUpdateQuery, [
                    hashPassword,
                    process.env.ACTIVE_STATUS,
                    login_id,
                ]);

                if (userUpdateResult.affectedRows > 0) {
                    is_company_login_enable = "1";
                    console.log(`User updated with password and status activated successfully`);
                }
            }

            const insertQuery = `INSERT INTO companies(company_unique_id, company_name, company_type, company_email, company_contact, company_mobile, company_address, company_pincode, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, is_superadmin_company, is_company_login_enable, login_id, status, unique_id, created_by, company_state, company_city, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const queryResult = await db.query(insertQuery, [
                companyUniqueId,
                company_name,
                company_type,
                company_email,
                company_contact,
                company_mobile,
                company_address,
                company_pincode,
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
                login_id,
                "1",
                unique_id,
                createdBy,
                state,
                city,
                createdAt,
            ]);
            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                console.log(`Company '${company_name}' created successfully`);
                const companyId = queryResult.insertId;
                const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                const result = await db.query(gstDetailInsertQuery, [
                    companyId,
                    gst_number,
                    shipping_address,
                    billing_address,
                    "1",
                    createdBy,
                    createdAt,
                ]);
                if (result.affectedRows > process.env.VALUE_ZERO) {
                    console.log(`GST number '${gst_number}' inserted successfully`);
                }
            } else {
                // errorMessage.push(`at row ${i + 1} Error! company not created`);
                // continue;
                throw new Error(`at row ${i + 1} Error! company '${company_name}' not created`);
            }
        }

        // delete the uploaded file once data is imported successfully
        fs.unlinkSync(completePath);
        console.log("File deleted successfully");

        // return response
        return res.status(200).json({
            status: true,
            message: "Data Imported successfully",
            errorMessage,
        });
    } catch (error) {
        return next(error);
    }
};

const getCompanyCounts = async (req, res, next) => {
    try {
        const query = `SELECT COUNT(CASE WHEN company_type = 1 THEN 1 END) AS client, COUNT(CASE WHEN company_type = 2 THEN 1 END) AS vendor, COUNT(CASE WHEN company_type = 3 THEN 1 END) AS both_companies, COUNT(*) AS total FROM companies`;

        const queryResult = await db.query(query);

        res.status(StatusCodes.OK).json({ status: true, message: "Fetch successfully", data: queryResult });
    } catch (error) {
        return next(error);
    }
};

const getAllStates = async (req, res, next) => {
    try {
        const allStates = await fetchStates();
        if (allStates.length > process.env.VALUE_ZERO) {
            const resultObj = await Promise.all(
                allStates.map(async (state) => {
                    // Fetch cities based on the state ID
                    const cities = await fetchCitiesBasedOnState(state.id);
                    return {
                        id: state.id,
                        name: state.name,
                        cities, // Add cities to the result object
                    };
                })
            );

            return res.status(StatusCodes.OK).json({ status: true, message: "Fetch successfully", data: resultObj });
        } else {
            return res.status(StatusCodes.OK).json({ status: true, message: "No Data Found", data: [] });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCities = async (req, res, next) => {
    try {
        const allCities = await fetchCities();
        if (allCities.length > process.env.VALUE_ZERO) {
            // const resultObj = allCities.map((city) => {
            //     return {
            //         id: city.id,
            //         name: city.name,
            //     };
            // });
            const resultObj = await Promise.all(
                allCities.map(async (city) => {
                    // Fetch cities based on the state ID
                    const state = await db.query(`SELECT * FROM cities WHERE state_id = '${city.id}'`);
                    return {
                        id: state.id,
                        name: state.name,
                        state, // Add state to the result object
                    };
                })
            );
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetch successfully", data: resultObj });
        } else {
            return res.status(StatusCodes.OK).json({ status: true, message: "No Data Found", data: [] });
        }
    } catch (error) {
        return next(error);
    }
};

const getCitiesBasedOnState = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "State is required" });
        else if (id == 0 || id == "null" || id == "undefined")
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "State is Invalid!" });
        const allCities = await fetchCitiesBasedOnState(id);
        if (allCities.length > process.env.VALUE_ZERO) {
            const resultObj = allCities.map((city) => {
                return {
                    id: city.id,
                    name: city.name,
                };
            });
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetch successfully", data: resultObj });
        } else {
            return res.status(StatusCodes.OK).json({ status: true, message: "City Not Found", data: [] });
        }
    } catch (error) {
        return next(error);
    }
};

const getCityBasedOnCompanies = async (req, res, next) => {
    try {
        let { type, my_company, city } = req.query;
        // const { error } = getCompanyBasedOnCityValidation.validate(req.query);
        // if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

        let searchDataCondition = "";
        const searchData = req.query.search || "";
        const loggedInUser = req.user.user_id;

        if (searchData != null && searchData != "") {
            searchDataCondition += ` AND cities.name LIKE '%${searchData}%' AND companies.created_by = ${loggedInUser} AND companies.is_deleted = '0'`;
        } else {
            searchDataCondition += `AND companies.created_by = ${loggedInUser} AND companies.is_deleted = '0'`;
        }

        if (!my_company) {
            my_company = 0;
        }

        let is_superadmin = "";

        if (!type) {
            type = "";
        }

        // if company type is sale/purchase/both company
        if (type && (type == 1 || type == 2 || type == 3)) {
            // if company is My company
            if (my_company == 1) {
                is_superadmin = ` AND companies.is_superadmin_company = '1' AND companies.company_type = '${type}'`;
                // if company type is sale/purchase company and it's not my company
            } else if (type && (type == 1 || type == 2)) {
                is_superadmin = ` AND companies.is_superadmin_company = '0' AND companies.company_type = '${type}'`;
            }
        } else {
            is_superadmin =
                my_company == 1
                    ? ` AND companies.is_superadmin_company = '1'`
                    : ` AND companies.is_superadmin_company = '0'`;
        }

        let selectQuery = `SELECT DISTINCT cities.id AS city_id, cities.name AS city_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type LEFT JOIN cities ON cities.id = companies.company_city WHERE companies.is_deleted = '0' AND cities.name IS NOT NULL ${is_superadmin} ${searchDataCondition} ORDER BY cities.name DESC`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "companies",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const result = await db.query(selectQuery);

        if (result.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetch successfully", data: result });
        } else {
            return res.status(StatusCodes.OK).json({ status: true, message: "No Data Found", data: [] });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllCompanyDataForChart,
    createCompany,
    getMyCompany,
    getMyCompanySingleDetailsById,
    updateMyCompanyDetails,
    deleteMyCompany,
    getCompanyTypes,
    getAllCompany,
    getCompanySingleDetailsById,
    updateCompanyDetails,
    getAllCompanyForDropdown,
    getCompanyDetailsById,
    getComplaintName,
    companyImport,
    getCompanyCounts,
    getAllStates,
    getAllCities,
    getCitiesBasedOnState,
    getCityBasedOnCompanies,
};

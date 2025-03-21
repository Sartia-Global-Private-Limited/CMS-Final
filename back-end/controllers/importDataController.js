require("dotenv").config();
const moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, adminCreateValidation, userCreateValidations } = require("../helpers/validation");
const { checkEmailDuplicacys, checkAdminUnique, getRecord } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const fs = require("fs");
const csv = require("fast-csv");
const bcrypt = require("bcrypt");
const {
    generatePanelIdForUser,
    generateSuperAdminEmpId,
    generateEmpIdForSuperAdminUsers,
    generatePanelIdForAdmin,
    generateEmpIdForContractorUsers,
} = require("../helpers/panelHelper");
const { type } = require("os");
const xlsx = require("xlsx"); // Import the xlsx package for handling Excel files
const { checkUnique } = require("./userController");

const importData = async (req, res, next) => {
    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No file uploaded" });
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + "/public/importData/" + imageName;
        storePath = "/importData/" + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let allowOnlyNumberInPhones = false;
            let phoneNumberError = [];
            let roleIdError = false;
            let roleIdErrorArray = [];
            let statusValueCheckError = [];
            let emailError = [];
            let emailExistError = false;

            let fileStream = csv
                .parse()
                .on("data", async function (data) {
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 20) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[0]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!nameRegex.test(data[0])) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    // check if password is empty then add default password value
                    if (!data[3]) {
                        data[3] = "12345678";
                    }

                    // Validate phone number
                    phoneNumber = data[4];
                    if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
                        allowOnlyNumberInPhones = true;
                        phoneNumberError.push(rowNumber);
                    }

                    // Check if status value is valid (0 or 1 )
                    if (data[18] != "0" && data[18] != "1") {
                        statusValueCheck = true;
                        statusValueCheckError.push(rowNumber);
                    }

                    // role_id validation 31
                    roleId = data[19];
                    if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
                        roleIdError = true;
                        roleIdErrorArray.push(rowNumber);
                    }
                    csvDataColl.push(data);
                })
                .on("end", async function () {
                    if (hasExtraColumns) {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "CSV file has extra columns" });
                    }

                    if (blankFields.length > 0) {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "Filed is blank in rows: " + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Name contains invalid characters at rows " + nameRegexError.join(", "),
                        });
                    }

                    if (allowOnlyNumberInPhones) {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Invalid phone number at row " + phoneNumberError.join(", "),
                        });
                    }

                    if (roleIdError) {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "Invalid role id at row " + roleIdErrorArray.join(", ") });
                    }

                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", "),
                        });
                    }

                    //csvDataColl.shift();

                    // Hash the password before inserting it into the database
                    const hashedData = csvDataColl.map((row) => {
                        const [
                            name,
                            email,
                            password,
                            base_64_password,
                            mobile,
                            joining_date,
                            address,
                            skills,
                            team_id,
                            employment_status,
                            pan,
                            aadhar,
                            epf_no,
                            esi_no,
                            bank_name,
                            ifsc_code,
                            account_number,
                            bank_documents,
                            department,
                            status,
                            role_id,
                        ] = row;

                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(password, salt);

                        return [
                            name,
                            email,
                            password,
                            base_64_password,
                            mobile,
                            joining_date,
                            address,
                            skills,
                            team_id,
                            employment_status,
                            pan,
                            aadhar,
                            epf_no,
                            esi_no,
                            bank_name,
                            ifsc_code,
                            account_number,
                            bank_documents,
                            department,
                            status,
                            role_id,
                        ];
                    });

                    const insertQuery = `INSERT INTO users (name,email,password,base_64_password,mobile,joining_date,address,skills,team_id,employment_status,pan,aadhar,epf_no,esi_no,bank_name,ifsc_code,account_number,bank_documents,department,status,role_id) VALUES (?)`;
                    const queryResult = await db.query(insertQuery, hashedData);

                    if (queryResult.affectedRows > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "No records were inserted" });
                    }
                });

            stream.pipe(fileStream);
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * function to import user data
 * @param {*} req
 * @param {*} res
 * @returns
 */

const importUserData = async (req, res, next) => {
    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No file uploaded" });
        }

        const uploadedFile = req.files.data;
        const fileName = Date.now() + uploadedFile.name;
        const uploadPath = `${process.cwd()}/public/importData/${fileName}`;
        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const errorMessage = [];
        const userType = req.user.user_type;
        // console.log('userType: ', userType);

        // Move file to designated path
        await uploadedFile.mv(uploadPath);

        // Check the file type (CSV or XLSX)
        const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
        let dataColl = [];

        if (fileExtension === "csv") {
            // Read and parse CSV file
            const csvDataColl = [];
            const fileStream = fs.createReadStream(uploadPath).pipe(csv.parse());

            for await (const row of fileStream) {
                csvDataColl.push(row);
            }

            if (csvDataColl.length <= 1) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No data found in file" });
            }

            dataColl = csvDataColl;
        } else if (fileExtension === "xlsx") {
            // Read and parse XLSX file
            const workbook = xlsx.readFile(uploadPath);
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const sheet = workbook.Sheets[sheetName];
            const excelData = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

            if (excelData.length <= 1) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No data found in file" });
            }

            dataColl = excelData;
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Invalid file format. Please upload a CSV or XLSX file." });
        }

        const headers = dataColl.shift(); // Remove header row

        const requiredHeaders = [
            "name",
            "email",
            "password",
            "mobile",
            "joining_date",
            "address",
            "skills",
            "employment_status",
            "pan",
            "aadhar",
            "bank_name",
            "epf_no",
            "esi_no",
            "ifsc_code",
            "account_number",
            "salary",
            "salary_term",
            "credit_limit",
        ];

        // Check for required headers
        if (JSON.stringify(headers) !== JSON.stringify(requiredHeaders)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Columns headers do not match the required format",
            });
        }

        let insertedRecords = 0;
        const role_id = req.body.role_id || 0;

        if (!role_id || role_id == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Role is required" });
        }

        const roleCheck = await getRecord("roles", "id", role_id);
        // console.log("roleCheck: ", roleCheck);
        if (roleCheck.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Role not found" });
        } else {
            const createdFor = roleCheck[0].created_for;
            let createdForArr = createdFor.split(",");
            // console.log("createdForArr: ", createdForArr);

            if (!createdForArr.includes(userType.toString())) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Role not found" });
            }
        }

        // Separate sets for each field to track duplicates
        const emailSet = new Set();
        const panSet = new Set();
        const aadharSet = new Set();
        const mobileSet = new Set();
        for (let i = 0; i < dataColl.length; i++) {
            let [
                name,
                email = "",
                password,
                mobile = "",
                joining_date,
                address,
                skills,
                employment_status,
                pan = "",
                aadhar = "",
                bank_name,
                epf_no,
                esi_no,
                ifsc_code,
                account_number,
                salary,
                salary_term,
                credit_limit,
            ] = dataColl[i];

            console.log("Row: ", { name, email, mobile, pan, aadhar });

            const { error } = adminCreateValidation.validate({
                name: name,
                email: email,
                pan: pan,
                mobile: mobile,
                joining_date: joining_date,
                employment_status: employment_status,
                salary_term: salary_term,
                aadhar: aadhar,
                credit_limit: credit_limit,
                role_id: role_id,
                skills: skills,
            });

            if (error) {
                // console.log('error: ', error);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ status: false, message: `At row ${i + 1}, ${error.message}` });
            }

            // Check for duplicates in the current rows
            if (email && emailSet.has(email)) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Duplicate email ${email} found at row ${i + 1}`,
                });
            }
            if (pan && panSet.has(pan)) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Duplicate PAN ${pan} found at row ${i + 1}`,
                });
            }
            if (aadhar && aadharSet.has(aadhar)) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Duplicate Aadhar ${aadhar} found at row ${i + 1}`,
                });
            }
            if (mobile && mobileSet.has(mobile)) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Duplicate Mobile ${mobile} found at row ${i + 1}`,
                });
            }

            // Ensure salary is numeric and positive
            if (salary && (isNaN(salary) || salary <= 0)) {
                errorMessage.push(`At row ${i + 1}, invalid salary for user: ${name}`);
                continue;
            }

            // Add the current row's fields to their respective sets
            if (email) emailSet.add(email);
            if (pan) panSet.add(pan);
            if (aadhar) aadharSet.add(aadhar);
            if (mobile) mobileSet.add(mobile);

            // user admin unique check
            const checkAdminDetailUnique = await checkAdminUnique(email, pan, aadhar, mobile, createdBy);

            if (checkAdminDetailUnique.status == false) {
                const message =
                    checkAdminDetailUnique.user != ""
                        ? `${checkAdminDetailUnique.data} already exist at row ${i + 1} for email ${checkAdminDetailUnique.user}`
                        : `${checkAdminDetailUnique.data} already exist at row ${i + 1}`;
                return res.status(StatusCodes.OK).json({ status: false, message: message });
            }
            // if importing from other than superadmin panel
            if (userType != 1) {
                const { error } = userCreateValidations.validate({
                    name: name,
                    email: email,
                    pan: pan,
                    mobile: mobile,
                    joining_date: joining_date,
                    salary: salary,
                    salary_term: salary_term,
                    aadhar: aadhar,
                    role_id: role_id,
                    employment_status: employment_status,
                    credit_limit: credit_limit,
                });

                if (error) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ status: false, message: `At row ${i + 1}, ${error.message}` });
                }

                // user user unique check
                const checkUserDetailUnique = await checkUnique(email, pan, aadhar, mobile, createdBy);

                if (checkUserDetailUnique.status == false) {
                    const message =
                        checkUserDetailUnique.user != ""
                            ? `${checkUserDetailUnique.data} already exist at row ${i + 1} for email ${checkUserDetailUnique.user}`
                            : `${checkUserDetailUnique.data} already exist at row ${i + 1}`;
                    return res.status(StatusCodes.OK).json({ status: false, message: message });
                }
            }
        }

        // Process each row for insertion
        for (let i = 0; i < dataColl.length; i++) {
            let [
                name,
                email,
                password = "",
                mobile,
                joining_date,
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
                salary,
                salary_term,
                credit_limit,
                // ] = csvDataColl[i];
            ] = dataColl[i];

            password = password != "" ? password.toString() : "";
            const hashedPassword = password != "" ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : "";

            let insertQuery = `
                INSERT INTO admins (name, email, password, contact_no, joining_date, user_type, address_1, skills, employment_status, 
                                    pan_number, aadhar, bank_name, epf_no, esi_no, ifsc_code, account_number,
                                    credit_limit, created_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            let queryValues = [
                name,
                email,
                hashedPassword,
                mobile,
                moment(joining_date).format("YYYY-MM-DD"),
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
                credit_limit,
                createdBy,
                createdAt,
            ];

            if (userType != 1) {
                insertQuery = `
                    INSERT INTO users 
                    (name, username, email, password, base_64_password, mobile, joining_date, user_type, role_id, address, skills, employment_status, 
                    pan, aadhar, bank_name, epf_no, esi_no, ifsc_code, account_number, credit_limit, created_by, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const encodedPassword = password != "" ? Buffer.from(password || "12345678").toString("base64") : "";

                queryValues = [
                    name,
                    name,
                    email,
                    hashedPassword,
                    encodedPassword,
                    mobile,
                    moment(joining_date).format("YYYY-MM-DD"),
                    role_id,
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
                    credit_limit,
                    createdBy,
                    createdAt,
                ];
            }

            // console.log("insertQuery: ", insertQuery);
            // console.log("queryValues: ", queryValues);
            const insertResult = await db.query(insertQuery, queryValues);

            const insertSalaryQuery = `
                            INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;

            const salaryValues = [
                insertResult.insertId,
                role_id,
                moment(joining_date).format("YYYY-MM-DD"),
                salary,
                salary_term,
                createdBy,
                createdAt,
            ];

            let employee_id = "";
            if (insertResult.affectedRows > 0) {
                const insertedUserId = insertResult.insertId;

                // if inserted user is inserted other than superadmin panel
                if (userType != 1) {
                    //insert unique_id
                    const unique_id = `U${insertedUserId}`;
                    await db.query("UPDATE users SET unique_id = ? WHERE id = ?", [unique_id, insertedUserId]);
                    //insert employee id
                    employee_id = await generateEmpIdForContractorUsers();
                    const panel_id = await generatePanelIdForUser(role_id, insertedUserId);
                    // Insert Employee ID
                    const updateEmployeeIdQuery = await db.query(
                        "UPDATE users SET employee_id = ?, panel_id = ? WHERE id = ?",
                        [employee_id, panel_id, insertedUserId]
                    );
                    if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Employee Id Inserted successfully");
                    } else {
                        console.log("Employee Id Insertion failed");
                    }
                } else {
                    // insert unique_id
                    const unique_id = `A${insertedUserId}`;
                    await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [unique_id, insertedUserId]);

                    //insert employee id and panel id
                    employee_id = await generateEmpIdForSuperAdminUsers(createdBy);
                    const panel_id = await generatePanelIdForAdmin(role_id, name);

                    if (!employee_id) {
                        console.log("Unable to generate employee id");
                    }
                    // Insert Employee ID
                    const updateEmployeeIdQuery = await db.query(
                        "UPDATE admins SET employee_id = ?, panel_id = ? WHERE id = ?",
                        [employee_id, panel_id, insertedUserId]
                    );
                    if (updateEmployeeIdQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log("Employee Id Inserted successfully");
                    } else {
                        console.log("Employee Id Insertion failed");
                    }
                }

                const salaryResult = await db.query(insertSalaryQuery, salaryValues);
                if (salaryResult.affectedRows > 0) {
                    console.log("Inserted user:", name);
                }
                console.log("Inserted admin:", name);
                insertedRecords++;
            } else {
                errorMessage.push(`At row ${i + 1}, error inserting admin`);
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(uploadPath);

        if (insertedRecords === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Data not imported",
                errorMessage,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Data imported successfully",
            insertedRecords,
            errorMessage,
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * function to import bank details data
 * @param {*} req
 * @param {*} res
 * @returns
 */
const importBankDetailData = async (req, res, next) => {
    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No file uploaded" });
        }
        let insertedRecord = 0;
        const created_by = req.params.id;
        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + "/public/importData/" + imageName;
        storePath = "/importData/" + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let statusValueCheckError = [];

            let fileStream = csv
                .parse()
                .on("data", async function (data) {
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 4) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[1]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!data[1]) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    csvDataColl.push(data);
                })
                .on("end", async function () {
                    if (hasExtraColumns) {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "CSV file has extra columns" });
                    }

                    if (blankFields.length > 0) {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "Filed is blank in rows: " + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Name contains invalid characters at rows " + nameRegexError.join(", "),
                        });
                    }

                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", "),
                        });
                    }
                    // csvDataColl.shift();
                    var csvLength = csvDataColl.length;
                    for (let index = 0; index < csvLength; index++) {
                        const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
                        var employee_id = "";
                        if (req.user.user_type == "1") {
                            employee_id = await generateSuperAdminEmpId();
                        }

                        const row = csvDataColl[index];

                        const salaryInsert = `INSERT INTO banks (bank_name, website, logo) VALUES("${row[1]}", "${row[2]}", "${row[3]}")`;
                        await db.query(salaryInsert);
                        insertedRecord++;
                    }

                    if (insertedRecord > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .json({ status: false, message: "No records were inserted" });
                    }
                });
            stream.pipe(fileStream);
        });
    } catch (error) {
        return next(error);
    }
};

const getSpecificColumnValueFromCsv = async (req, res, next) => {
    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "No file uploaded" });
        }

        let columns = req.body.columns;

        // Ensure that columns is an array
        if (!Array.isArray(columns)) {
            columns = columns;
        }
        // Check if columns is a string, and split it into an array if needed
        if (typeof columns === "string") {
            columns = JSON.parse(columns.replace(/'/g, '"'));
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + "/public/importData/" + imageName;
        var storePath = "/importData/" + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            const filePath = uploadPath;

            const columnValues = [];

            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on("data", (row) => {
                    // Loop through the specified columns and store their values in the result object
                    const rowData = {};
                    columns.forEach((column) => {
                        rowData[column] = row[column] || null; // Use null if the column doesn't exist in the row
                    });
                    columnValues.push(rowData);
                })
                .on("end", () => {
                    // Now, you can use 'columnValues' to access the values of the specified columns
                    fs.unlinkSync(filePath);
                    return res.status(StatusCodes.OK).json({ status: true, columnValues });
                })
                .on("error", (error) => {
                    console.error("Error processing CSV file:", error.message);
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ status: false, message: error.message });
                });
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { importData, importUserData, importBankDetailData, getSpecificColumnValueFromCsv };

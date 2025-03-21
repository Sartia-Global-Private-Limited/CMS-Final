var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const { con, makeDb } = require("../db");
const db = makeDb();
const {
    checkPositiveInteger,
    adminCreateValidation,
    energyCompanyValidations,
    createEnergyCompanyTeamValidation,
    updateEnergyCompanyTeamValidation,
} = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
var Buffer = require("buffer/").Buffer;
const {
    getContractorUsersById,
    getPendingContractorUsersById,
    getEnergyCompaniesById,
    calculatePagination,
    getAdminDetailsById,
} = require("../helpers/general");
const { AllSubModuleOfEnergyCompany, addCreatedByCondition } = require("../helpers/commonHelper");

const Joi = require("joi");
const { generatePanelIdForUser, generateSuperAdminEmpId } = require("../helpers/panelHelper");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const createEnergyCompanyUser = async (req, res, next) => {
    try {
        const { username, email, password, contact_no, joining_date } = req.body;
        const schema = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            contact_no: Joi.string().required(),
            joining_date: Joi.string().required(),
            energy_company_id: Joi.required(),
        }).options({ allowUnknown: true });
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const user_type = process.env.USER_ROLE_ID;
        const type = req.body.area_name;
        const area_selected = req.body.area_selected;
        const energy_company_id = req.body.energy_company_id;
        const created_by = req.user.user_id;

        if (type == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select Area name",
            });
        }

        if (area_selected == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select  area name related filed",
            });
        }

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

        // get admin_id from energy company
        const energyCompanyDetails = await getEnergyCompaniesById(energy_company_id);
        // console.log("energyCompanyDetails: ", energyCompanyDetails);
        const admin_id = energyCompanyDetails.admin_id;

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");
        const date = new Date(req.body.joining_date);

        const column_name = await AllSubModuleOfEnergyCompany(type);

        const createUserQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, image, user_type, admin_id, ${column_name}, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${encodedPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${area_selected}', '${created_by}')`;

        const panelId = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
        const employee_id = await generateSuperAdminEmpId();

        // db.query(createUserQuery, async (err, result) => {
        //     if (err) return res.status(500).json({ status: false, message: err });

        //     console.log('result: ', result);
        //     if (result.affectedRows > process.env.VALUE_ZERO) {
        //         const unique_id = `U${result.insertId}`;
        //         await db.query(`UPDATE users SET unique_id = '${unique_id}', panel_id = '${panelId}', employee_id = '${employee_id}' WHERE id = ${result.insertId}`);
        //         return res.status(200).json({ status: true, message: "Energy company User created successfully" });
        //     } else {
        //         return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
        //     }
        // });
        const result = await db.query(createUserQuery);
        if (result.affectedRows > process.env.VALUE_ZERO) {
            const unique_id = `U${result.insertId}`;
            await db.query(
                `UPDATE users SET unique_id = '${unique_id}', panel_id = '${panelId}', employee_id = '${employee_id}' WHERE id = ${result.insertId}`
            );
            return res.status(200).json({ status: true, message: "Energy company User created successfully" });
        } else {
            return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const createSubUsersForEnergyCompanyZoneUser = async (req, res, next) => {
    try {
        const { username, email, password, contact_no, joining_date, zone_id } = req.body;
        const { error, value } = adminCreateValidation.validate({
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.contact_no,
        });

        if (error) return res.status(400).json({ status: false, message: error.message });

        const user_type = process.env.SUB_USER_ROLE_ID;
        const admin_id = req.user.user_id;
        const created_by = admin_id;
        const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND zone_id='${zone_id}'`;
        const getZoneUserResult = await db.query(getZoneUser);
        const user_id = getZoneUserResult[0].id;

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

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");

        const insertQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, image, user_type, admin_id, user_id, zone_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${encodedPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${zone_id}', '${created_by}')`;

        // res.status(200).json({status: true, data:insertQuery})

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const createSubUsersForEnergyCompanyRegionalOfficeUser = async (req, res, next) => {
    try {
        const { username, email, password, contact_no, joining_date, regional_id } = req.body;
        const { error, value } = adminCreateValidation.validate({
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.contact_no,
        });

        if (error) return res.status(400).json({ status: false, message: error.message });

        const user_type = process.env.SUB_USER_ROLE_ID;
        const admin_id = req.user.user_id;
        const created_by = admin_id;
        const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND regional_id='${regional_id}'`;
        const getZoneUserResult = await db.query(getZoneUser);
        const user_id = getZoneUserResult[0].id;

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

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");

        const insertQuery = `INSERT INTO users (name, username, email, password, mobile, base_64_password, joining_date, image, user_type, admin_id, user_id, regional_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}',  '${encodedPassword}','${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${regional_id}', '${created_by}')`;

        //res.status(200).json({status: true, data: insertQuery})

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const createSubUsersForEnergyCompanySaleAreaUser = async (req, res, next) => {
    try {
        const { username, email, password, contact_no, joining_date, sale_area_id } = req.body;
        const { error, value } = adminCreateValidation.validate({
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.contact_no,
        });

        if (error) return res.status(400).json({ status: false, message: error.message });

        const user_type = process.env.SUB_USER_ROLE_ID;
        const admin_id = req.user.user_id;
        const created_by = admin_id;
        const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND sale_area_id='${sale_area_id}'`;
        const getZoneUserResult = await db.query(getZoneUser);
        // res.status(200).json({status: true, data: getZoneUserResult})
        const user_id = getZoneUserResult[0].id;

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

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");

        const insertQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, image, user_type, admin_id, user_id, sale_area_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${encodedPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${sale_area_id}', '${created_by}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user created successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanyDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        // let selectQuery = `SELECT energy_companies.id as ec_id, energy_companies.name as company_name, energy_companies.website as website_url, admins.id as user_id, admins.name as username, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.status, admins.country, admins.city, admins.pin_code, admins.image, admins.description, admins.gst_number, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM admins INNER JOIN energy_companies ON energy_companies.admin_id=admins.id LEFT JOIN zones ON zones.energy_company_id=energy_companies.id LEFT JOIN regional_offices ON regional_offices.energy_company_id=energy_companies.id LEFT JOIN sales_area ON sales_area.energy_company_id=energy_companies.id WHERE energy_companies.id ='${id}' AND admins.user_type = '${process.env.ENERGY_COMPANY_ROLE_ID}' LIMIT 100`;

        let selectQuery = `
                    SELECT 
                ec.id as ec_id,
                ec.name as company_name,
                ec.website as website_url,
                a.id as user_id,
                a.name as username,
                a.email,
                a.contact_no,
                a.alt_number,
                a.address_1,
                a.status,
                a.country,
                a.city,
                a.pin_code,
                a.image,
                a.description,
                a.gst_number,
                z.zones_list,
                ro.regional_offices_list,
                sa.sales_areas_list
            FROM admins AS a
            INNER JOIN energy_companies AS ec ON ec.admin_id = a.id
            LEFT JOIN (
                SELECT energy_company_id, GROUP_CONCAT(CONCAT(zone_id, ':', zone_name)) AS zones_list
                FROM zones
                GROUP BY energy_company_id
            ) AS z ON z.energy_company_id = ec.id
            LEFT JOIN (
                SELECT energy_company_id, GROUP_CONCAT(CONCAT(id, ':', regional_office_name)) AS regional_offices_list
                FROM regional_offices
                GROUP BY energy_company_id
            ) AS ro ON ro.energy_company_id = ec.id
            LEFT JOIN (
                SELECT energy_company_id, GROUP_CONCAT(CONCAT(id, ':', sales_area_name)) AS sales_areas_list
                FROM sales_area
                GROUP BY energy_company_id
            ) AS sa ON sa.energy_company_id = ec.id
            WHERE ec.id = '${id}' 
            AND a.user_type = '${process.env.ENERGY_COMPANY_ROLE_ID}';
            `;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "admins",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // db.query(selectQuery, async (err, result) => {
        //     if (err) return res.status(403).json({ stats: false, message: err });

        //     if (result.length > process.env.VALUE_ZERO) {
        //         for (const row of result) {
        //             const data = [];
        //             data.push(await getAdminDetailsById(row.user_id));
        //             // row.user = await getAdminDetailsById(row.user_id);
        //             row.users = data;
        //         }
        //         return res.status(200).json({ status: true, data: result[0] });
        //     } else {
        //         return res.status(400).json({ status: false, message: "Data not found" });
        //     }
        // });
        const result = await db.query(selectQuery);
        // console.log("result: ", result[0]);
        if (result.length > 0) {
            for (const row of result) {
                const data = [];
                data.push(await getAdminDetailsById(row.user_id));
                // row.user = await getAdminDetailsById(row.user_id);
                row.users = data;
            }
            return res.status(200).json({ status: true, data: result[0] });
        } else {
            return res.status(400).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateEnergyCompanyDetails = async (req, res, next) => {
    try {
        const {
            username,
            email,
            contact_no,
            alt_number,
            country,
            city,
            company_name,
            description,
            gst_number,
            pin_code,
            status,
            website_url,
            address_1,
            zone_id,
            ro_id,
            sale_area_id,
            image,
            energy_company_id,
            id,
        } = req.body;

        const { error } = energyCompanyValidations.validate({ name: username, email: email, contact_no: contact_no });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const { error: idError } = checkPositiveInteger.validate({ id: id });
        if (idError) return res.status(400).json({ status: false, message: idError.message });

        let storePath = "";
        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        } else {
            storePath = image;
        }

        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE admins SET name='${username}', email='${email}', contact_no='${contact_no}',  alt_number='${alt_number}', country='${country}', city='${city}', description='${description}', gst_number='${gst_number}', pin_code='${pin_code}', status='${status}', address_1='${address_1}',  updated_at='${updatedAt}' WHERE id='${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                //const energy_company_id = id

                // const assignZoneUpdateQuery = `UPDATE zones SET zone_id='${zone_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                // const assignZoneUpdateResult = await db.query(assignZoneUpdateQuery)

                // const assignRegionalOfficeUpdateQuery = `UPDATE regional_office_assigns SET regional_office_id='${ro_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                // const assignRegionalOfficeUpdateResult = await db.query(assignRegionalOfficeUpdateQuery)

                // const assignSaleAreaUpdateQuery = `UPDATE sale_area_assigns SET sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                // const assignSaleAreaUpdateResult = await db.query(assignSaleAreaUpdateQuery)

                const energyCompanyUpdateQuery = `
                UPDATE energy_companies SET name= ?, website= ?, status = ?, updated_at = ? WHERE id = ?`;
                const queryResult = await db.query(energyCompanyUpdateQuery, [
                    company_name,
                    website_url,
                    status,
                    updatedAt,
                    energy_company_id,
                ]);

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    return res.status(200).json({ status: true, message: "Energy company updated successfully" });
                } else {
                    return res
                        .status(400)
                        .json({ status: false, message: "Something went wrong, please try again later" });
                }
                // res.status(200).json({ status: true, message: "Data updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateEnergyCompanyUserDetails = async (req, res, next) => {
    try {
        const { name, email, mobile, joining_date, zone_id, regional_id, sale_area_id, id } = req.body;
        const { error } = energyCompanyValidations.validate({ name: name, email: email, contact_no: mobile });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const { error: idError } = checkPositiveInteger.validate({ id: id });
        if (idError) return res.status(400).json({ status: false, message: idError.message });

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

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${mobile}', joining_date='${joining_date}', image='${storePath}', zone_id='${zone_id}', regional_id='${regional_id}', sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE id = '${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "User updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateEnergyCompanySubUserDetails = async (req, res, next) => {
    try {
        const { name, email, mobile, joining_date, zone_id, regional_id, sale_area_id, id } = req.body;
        const { error } = energyCompanyValidations.validate({ name: name, email: email, contact_no: mobile });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const { error: idError } = checkPositiveInteger.validate({ id: id });
        if (idError) return res.status(400).json({ status: false, message: idError.message });

        var storePath = "";
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/user_images/" + imageName;
            storePath = "/user_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({ status: false, message: err.message });
            });
        }

        const updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${mobile}', joining_date='${joining_date}', image='${storePath}', zone_id='${zone_id}', regional_id='${regional_id}', sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE id = '${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ stats: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteEnergyCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        // const selectQueryForUserType = `SELECT admins.name, admins.user_type, energy_companies.name as company_name, energy_companies.id as energy_company_id, zone_assigns.id as zone_id, regional_office_assigns.id as regional_office_id, sale_area_assigns.id as sale_area_id FROM admins INNER JOIN energy_companies ON energy_companies.admin_id= admins.id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id = admins.id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id = admins.id WHERE admins.id='${id}' AND admins.user_type='${process.env.ENERGY_COMPANY_ROLE_ID}'`

        const selectQueryForUserType = `SELECT energy_companies.id as energy_company_id, energy_companies.name as company_name, energy_companies.website as website_url, admins.name as username, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.status, admins.country, admins.city, admins.pin_code, admins.image, admins.description, admins.gst_number, admins.user_type, zones.zone_id, zones.zone_name, regional_offices.id as regional_office_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM admins INNER JOIN energy_companies ON energy_companies.admin_id=admins.id LEFT JOIN zones ON zones.energy_company_id=energy_companies.id LEFT JOIN regional_offices ON regional_offices.energy_company_id=energy_companies.id LEFT JOIN sales_area ON sales_area.energy_company_id=energy_companies.id WHERE admins.id ='${id}' AND admins.user_type = '${process.env.ENERGY_COMPANY_ROLE_ID}'`;

        db.query(selectQueryForUserType, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                if (result[0].user_type != process.env.ENERGY_COMPANY_ROLE_ID) {
                    return res.status(403).json({ status: false, message: "Energy company does not exist" });
                } else {
                    const {
                        username,
                        email,
                        password,
                        contact_no,
                        alt_number,
                        address_1,
                        gst_number,
                        country,
                        city,
                        pin_code,
                        description,
                        status,
                    } = req.body;

                    const schema = Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                        contact_no: Joi.string().required(),
                    }).options({ allowUnknown: true });
                    const { error } = schema.validate({
                        email: email,
                        password: password,
                        contact_no: contact_no,
                    });
                    if (error) return res.status(400).json({ status: false, message: error.message });

                    const energy_company_id = result[0].energy_company_id;
                    const zone_id = result[0].zone_id;
                    const regional_id = result[0].regional_office_id;
                    const sale_area_id = result[0].sale_area_id;
                    const user_type = result[0].user_type;
                    const created_by = req.user.user_id;

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

                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);

                    const createdAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

                    const insertAdminQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, status, country, city, pin_code, image, description, gst_number, created_by, created_at) VALUES('${username}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${status}', '${country}', '${city}', '${pin_code}', '${storePath}', '${description}', '${gst_number}', '${created_by}', '${createdAt}')`;

                    db.query(insertAdminQuery, async (err, result) => {
                        if (err) return res.status(403).json({ stats: false, message: err });

                        if (result.affectedRows > process.env.VALUE_ZERO) {
                            const newEnergyCompanyId = result.insertId;
                            const unique_id = `A${newEnergyCompanyId}`;
                            const uniqueIdQuery = await db.query("UPDATE admins SET unique_id = ? WHERE id = ?", [
                                unique_id,
                                newEnergyCompanyId,
                            ]);
                            const updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

                            const updateZoneAssignQuery = `UPDATE zone_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${zone_id}'`;
                            const updateZoneAssignResult = await db.query(updateZoneAssignQuery);

                            const updateRegionalAssign = `UPDATE regional_office_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${regional_id}'`;
                            const updateRegionalAssignResult = await db.query(updateRegionalAssign);

                            const updateSaleAreaQuery = `UPDATE sale_area_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${sale_area_id}'`;
                            const updateSaleAreaResult = await db.query(updateSaleAreaQuery);

                            const updateEnergyCompanyQuery = `UPDATE energy_companies SET admin_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id='${energy_company_id}'`;
                            const updateEnergyCompanyResult = await db.query(updateEnergyCompanyQuery);

                            const softDeleteQueryForOldEnergyCompany = `UPDATE admins SET status='0' WHERE id='${id}'`;
                            const softDeleteResultForOldEnergyCompany = await db.query(
                                softDeleteQueryForOldEnergyCompany
                            );

                            return res.status(200).json({
                                status: true,
                                message: "Energy company deleted and new user assigned to company successfully",
                            });
                        } else {
                            return res
                                .status(400)
                                .json({ status: false, message: "Something went wrong, please try again later" });
                        }
                    });
                }
            } else {
                return res.status(400).json({ status: false, message: "Energy company does not exist" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteEnergyCompanyUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const existedUserQuery = `SELECT * FROM users WHERE id='${id}' AND user_type='${process.env.USER_ROLE_ID}'`;
        const existedUserDetails = await db.query(existedUserQuery);

        if (existedUserDetails.length > process.env.VALUE_ZERO) {
            const admin_id = existedUserDetails[0].existedUserDetails;
            const zone_id = existedUserDetails[0].zone_id;
            const regional_id = existedUserDetails[0].regional_id;
            const sale_area_id = existedUserDetails[0].sale_area_id;
            const created_by = req.user.user_id;
            const user_type = existedUserDetails[0].user_type;

            const { name, email, password, mobile, joining_date } = req.body;
            const { error: formError } = adminCreateValidation.validate({
                email: email,
                password: password,
                contact_no: mobile,
            });
            if (formError) return res.status(400).json({ status: false, message: formError.message });

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

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const insertQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, zone_id, regional_id, sale_area_id, created_by) VALUES('${name}', '${name}', '${email}', '${hashPassword}', '${mobile}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${zone_id}', '${regional_id}', '${sale_area_id}', '${created_by}')`;

            db.query(insertQuery, async (err, result) => {
                if (err) return res.status(400).json({ status: false, message: err });

                if (result.affectedRows > process.env.VALUE_ZERO) {
                    const softDeleteQuery = `UPDATE users SET status='0' WHERE id='${id}'`;
                    const softDeleteQueryResult = await db.query(softDeleteQuery);

                    res.status(200).json({
                        status: true,
                        message: "Energy company deleted and new admin assigned successfully",
                    });
                } else {
                    return res
                        .status(400)
                        .json({ status: false, message: "Something went wrong, please try again later" });
                }
            });
        } else {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }
    } catch (error) {
        return next(error);
    }
};

const energyCompanyDeleteSubUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const deleteQueryForSubUser = `DELETE  FROM users WHERE id='${id}' AND user_type='${process.env.SUB_USER_ROLE_ID}'`;

        db.query(deleteQueryForSubUser, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Sub user deleted successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllCreatedEnergyCompany = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id as energy_company_id, admin_id as user_id, name, status, is_deleted FROM energy_companies  WHERE is_deleted = '0' ORDER BY id DESC`;
        const queryResult = await promisify(db.query)(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCreatedEnergyCompanyWithSoftDelete = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;

        const pageFirstResult = (currentPage - 1) * pageSize;
        const selectQuery = `
            SELECT id AS energy_company_id, admin_id AS user_id, name, status, is_deleted 
            FROM energy_companies 
            ORDER BY id DESC
            LIMIT ${pageFirstResult} , ${pageSize}`;
        const queryResult = await promisify(db.query)(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        let pageDetails;
        if (queryResult.length > process.env.VALUE_ZERO) {
            pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const updatedQueryResult = await Promise.all(
                queryResult.map(async (item) => {
                    item.user = await getAdminDetailsById(item.user_id);
                    // item.user_id = user.id;
                    // item.name = user.name;
                    return item; // Return the updated item for Promise.all
                })
            );
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Fetched successfully", data: updatedQueryResult, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllActiveEnergyCompany = async (req, res, next) => {
    try {
        const activeStatus = process.env.ACTIVE_STATUS;
        const selectQuery = `SELECT id as energy_company_id, admin_id as user_id, name, status FROM energy_companies WHERE status='${activeStatus}'`;
        // console.log("selectQuery: ", selectQuery);
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(400).json({ status: false, message: req.error.message });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllEnergyCompanyAndUsersWithPendingAccountStatus = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.ENERGY_COMPANY_ROLE_ID}' AND admins.is_deleted='0' AND admins.status='0'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";

        if (searchData != null && searchData != "") {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const EnergyCompanyRole = process.env.ENERGY_COMPANY_ROLE_ID;
        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${EnergyCompanyRole}' AND admins.is_deleted='0' AND admins.status='0' ${searchDataCondition} ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

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

const energyCompanyAccountStatusAction = async (req, res, next) => {
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

        if (user_type == "Energy Company") {
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

const getAllZoneByEnergyCompanyId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = await db.query(`SELECT * FROM zones WHERE energy_company_id = ?`, [id]);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: selectQuery });
        } else {
            res.status(404).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const checkRelatedDataForEnergyCompany = async (req, res, next) => {
    try {
        const energy_company_id = req.params.energy_company_id;
        var finalData = [];
        const selectComplaintsType = `SELECT complaint_type_name FROM complaint_types WHERE energy_company_id='${energy_company_id}';`;
        const complaint_type_data = await db.query(selectComplaintsType);

        const selectComplaints = `SELECT complaints.description, complaint_types.complaint_type_name
        FROM complaints 
        LEFT JOIN complaint_types ON complaints.complaint_type = complaint_types.id
        WHERE complaints.energy_company_id='${energy_company_id}';`;
        const complaint_data = await db.query(selectComplaints);
        if (complaint_type_data.length > 0 || complaint_data.length > 0) {
            finalData.push({ complaint_type_data: complaint_type_data });
            finalData.push({ complaint_data: complaint_data });
            return res.status(200).json({ status: true, message: "Record found", data: finalData });
        } else {
            return res.status(400).json({ status: true, message: "No record found", data: finalData });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteRelatedDataForEnergyCompany = async (req, res, next) => {
    try {
        const { energy_company_id, delete_all } = req.body;
        if (delete_all == 1) {
            await db.query(`DELETE FROM complaint_types WHERE energy_company_id='${energy_company_id}'`);
            await db.query(`DELETE FROM complaints WHERE energy_company_id='${energy_company_id}'`);
            await db.query(`DELETE FROM energy_companies WHERE id='${energy_company_id}'`);
            return res.status(200).json({ status: true, message: "Record deleted successfully." });
        } else {
            await db.query(`UPDATE energy_companies SET is_deleted='1' WHERE id='${energy_company_id}'`);
            return res.status(200).json({ status: true, message: "Record updated successfully." });
        }
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanySubSidiaries = async (req, res, next) => {
    try {
        const energy_company_id = req.params.energy_company_id;
        const type = req.params.type;

        const validationSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            type: Joi.number().required(),
        });

        const { error } = validationSchema.validate({ energy_company_id, type });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        let query;
        let selectedValue;

        if (type == "1") {
            query = `SELECT zone_id as id, zone_name as area_name FROM zones WHERE energy_company_id = ?`;
            selectedValue = "Zones";
        } else if (type == "2") {
            query = `SELECT id , regional_office_name as area_name FROM regional_offices WHERE energy_company_id = ?`;
            selectedValue = "Regional Offices";
        } else if (type == "3") {
            query = `SELECT id , sales_area_name as area_name FROM sales_area WHERE energy_company_id = ?`;
            selectedValue = "Sale Area";
        } else if (type == "4") {
            query = `SELECT id , district_name as area_name FROM districts WHERE energy_company_id = ?`;
            selectedValue = "Districts";
        } else if (type == "5") {
            query = `SELECT id , outlet_name as area_name FROM outlets WHERE energy_company_id = ?`;
            selectedValue = "Outlets";
        }

        const queryResult = await db.query(query, [energy_company_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: queryResult,
                selectedValue: selectedValue,
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

const createEnergyTeam = async (req, res, next) => {
    try {
        const { error, value } = createEnergyCompanyTeamValidation.validate(req.body);
        if (error) return res.status(500).json({ status: false, message: error.message });

        const {
            username,
            email,
            contact_no,
            alt_number,
            country,
            city,
            company_name,
            description,
            gst_number,
            pin_code,
            status,
            address,
            energy_company_id,
            area_selected,
            joining_date,
            designation,
            password,
        } = req.body;
        const userExists = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (userExists.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "User already exists",
            });
        }

        const user_type = process.env.USER_ROLE_ID;
        const type = req.body.area_name;
        const created_by = req.user.user_id;
        if (type == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select Area name",
            });
        }

        if (area_selected == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select  area name related filed",
            });
        }

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

        // get admin_id from energy company
        const energyCompanyDetails = await getEnergyCompaniesById(energy_company_id);
        const admin_id = energyCompanyDetails.admin_id;

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString("base64");

        const column_name = await AllSubModuleOfEnergyCompany(type);

        const createUserQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, alt_number, country, city, pin_code, status, address, image, user_type, admin_id, ${column_name}, joining_date, description, department, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            username,
            username,
            email,
            hashPassword,
            encodedPassword,
            contact_no,
            alt_number,
            country,
            city,
            pin_code,
            status,
            address,
            storePath,
            user_type,
            admin_id,
            area_selected,
            joining_date,
            description,
            designation,
            created_by,
        ];

        const panelId = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
        const employee_id = await generateSuperAdminEmpId();

        const insertData = await db.query(createUserQuery, values);
        if (insertData.affectedRows > process.env.VALUE_ZERO) {
            const unique_id = `U${insertData.insertId}`;
            await db.query(
                `UPDATE users SET unique_id = '${unique_id}', panel_id = '${panelId}', employee_id = '${employee_id}' WHERE id = ${insertData.insertId}`
            );
            return res.status(200).json({ status: true, message: "Energy company User created successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};
const updateEnergyTeam = async (req, res, next) => {
    try {
        const { error } = updateEnergyCompanyTeamValidation.validate(req.body);
        if (error) return res.status(500).json({ status: false, message: error.message });

        let {
            username,
            email,
            contact_no,
            alt_number,
            country,
            city,
            description,
            pin_code,
            status,
            address,
            energy_company_id,
            area_selected,
            joining_date,
            password,
            id,
            transfer_date,
        } = req.body;

        const user_type = process.env.USER_ROLE_ID;
        const type = req.body.area_name;
        const updated_by = req.user.user_id;
        if (type == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select Area name",
            });
        }
        if (area_selected == "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please Select area name related filed",
            });
        }
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
        // get admin_id from energy company
        const energyCompanyDetails = await getEnergyCompaniesById(energy_company_id);
        const admin_id = energyCompanyDetails.admin_id;
        const column_name = await AllSubModuleOfEnergyCompany(type);
        let query = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, alt_number = ?, country = ?, city = ?, pin_code = ?, status = ?, address = ?, image = ?, user_type = ?, admin_id = ?, joining_date = ?, description = ?, updated_by = ?`;
        // let values = [
        //     username,
        //     username,
        //     email,
        //     contact_no,
        //     alt_number,
        //     country,
        //     city,
        //     pin_code,
        //     status,
        //     address,
        //     storePath,
        //     user_type,
        //     admin_id,
        //     joining_date,
        //     description,
        //     updated_by,
        //     transfer_date,
        // ];
        // const currentDate = moment().format("YYYY-MM-DD");
        // if (moment(transfer_date).format("YYYY-MM-DD") == currentDate) {
        //     const updateTeam = await energyTeamTransfer(id);
        //     query += `, ${column_name} = ?`;
        //     values.push(area_selected);
        // } else {
        //     const transfer_area = {
        //         column_name: column_name,
        //         value: area_selected,
        //     };
        //     const stringifyTransferArea = JSON.stringify(transfer_area);
        //     query += `, transfer_area = ?`;
        //     values.push(stringifyTransferArea);
        // }
        // if (password) {
        //     const salt = await bcrypt.genSalt(10);
        //     const hashPassword = await bcrypt.hash(password, salt);
        //     const encodedPassword = Buffer.from(password).toString("base64");

        //     query += `, password = ?, base_64_password = ?`;
        //     values.push(hashPassword, encodedPassword);
        // }

        // query += ` WHERE id = ?`;
        // values.push(id);

        // const updateData = await db.query(query, values);

        transfer_date =
            transfer_date == "Invalid date" ||
            !moment(transfer_date, "YYYY-MM-DD", true).isValid() ||
            transfer_date == null
                ? ""
                : transfer_date;
        let values = [
            username,
            username,
            email,
            contact_no,
            alt_number,
            country,
            city,
            pin_code,
            status,
            address,
            storePath,
            user_type,
            admin_id,
            joining_date,
            description,
            updated_by,
        ];

        if (transfer_date != "") {
            query = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, alt_number = ?, country = ?, city = ?, pin_code = ?, status = ?, address = ?, image = ?, user_type = ?, admin_id = ?, joining_date = ?, description = ?, updated_by = ?, transfer_date = ?`;
            values.push(transfer_date);
        }

        const currentDate = moment().format("YYYY-MM-DD");

        // Check if transfer_date is valid
        if (
            moment(transfer_date, "YYYY-MM-DD", true).isValid() &&
            moment(transfer_date).format("YYYY-MM-DD") === currentDate
        ) {
            const updateTeam = await energyTeamTransfer(id);
            query += `, ${column_name} = ?`;
            values.push(area_selected);
        } else if (
            transfer_date == "Invalid date" ||
            !moment(transfer_date, "YYYY-MM-DD", true).isValid() ||
            transfer_date === null
        ) {
            query += `, transfer_area = ?`;
            values.push("");
        } else {
            const transfer_area = {
                column_name: column_name,
                value: area_selected,
            };
            const stringifyTransferArea = JSON.stringify(transfer_area);
            query += `, transfer_area = ?`;
            values.push(stringifyTransferArea);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const encodedPassword = Buffer.from(password).toString("base64");

            query += `, password = ?, base_64_password = ?`;
            values.push(hashPassword, encodedPassword);
        }

        query += ` WHERE id = ?`;
        values.push(id);

        const updateData = await db.query(query, values);

        if (updateData.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Energy company User updated successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};
cron.schedule("0 0 * * *", async () => {
    try {
        const today = moment().format("YYYY-MM-DD");
        const query = `SELECT id, transfer_area FROM users WHERE transfer_date = '${today}'`;
        const result = await db.query(query);
        if (result.length > 0) {
            for (let row of result) {
                const { id, transfer_area } = row;
                await energyTeamTransfer(id);
                const parsedArea = JSON.parse(transfer_area);
                const updateQuery = `UPDATE users SET ${parsedArea.column_name} = ${parsedArea.value}, transfer_area = NULL, transfer_date = NULL WHERE id = ${id}`;
                await db.query(updateQuery);
            }
            console.log("Energy Team Transfer Successfully");
        }
    } catch (error) {
        console.error("error in transferring energy team by cron job: ", error);
        throw error;
    }
});

async function energyTeamTransfer(id) {
    const updateQuery = `UPDATE users SET regional_id = NULL, zone_id = NULL, district_id = NULL, outlet_id = NULL, sale_area_id = NULL WHERE id = '${id}'`;
    const result = await db.query(updateQuery);
}

const getEnergyTeamDetailsById = async (req, res, next) => {
    try {
        const id = req.query.id;
        const user_id = req.query?.user_id || "";
        const zone_id = req.query.zone_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const district_id = req.query.district_id;
        let pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const type = req.query?.type || "";
        const isDropdown = req.query.isDropdown || false;
        let columns = req.query.columns ? JSON.parse(req.query.columns) : "";

        let searchValue = "";
        if (searchData) {
            searchValue = ` AND (u.name LIKE '%${searchData}%' OR u.username LIKE '%${searchData}%' OR u.email LIKE '%${searchData}%' OR u.pin_code LIKE '%${searchData}%')`;
        }
        let condition;
        // console.log('pageSize: ', pageSize);
        console.log("type: ", type);
        if (type != "" && pageSize == null) {
            condition = `ORDER BY u.id DESC`;
        } else {
            condition = `ORDER BY u.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        if (user_id && user_id != "" && user_id != 0) {
            condition = ` AND u.id = '${user_id}'`;
        }

        // Adding filters for zone, regional office, sales area, and district
        let filterConditions = "";
        if (zone_id) {
            filterConditions += ` AND u.zone_id = ${zone_id}`;
        }
        if (regional_office_id) {
            filterConditions += ` AND u.regional_id = ${regional_office_id}`;
        }
        if (sales_area_id) {
            filterConditions += ` AND u.sale_area_id = ${sales_area_id}`;
        }
        if (district_id) {
            filterConditions += ` AND u.district_id = ${district_id}`;
        }

        let query = `SELECT energy_companies.id AS energy_company_id, energy_companies.name AS energy_company_name, u.id AS user_id, u.name AS username,u.email,u.mobile,u.alt_number,u.address,u.status,u.country,u.city,u.pin_code,u.image,u.description,u.joining_date,u.transfer_date,u.transfer_by, u.created_at, u.id as id,
                        COALESCE(r.regional_office_name, z.zone_name, d.district_name, o.outlet_name, s.sales_area_name) AS area_selected,
                        COALESCE(u.zone_id, u.regional_id, u.sale_area_id, u.district_id, u.outlet_id) AS area_selected_id,
                            CASE 
                            WHEN u.zone_id IS NOT NULL THEN 'zone'
                            WHEN u.regional_id IS NOT NULL THEN 'regional_office'
                            WHEN u.sale_area_id IS NOT NULL THEN 'sales_area'
                            WHEN u.district_id IS NOT NULL THEN 'district'
                            WHEN u.outlet_id IS NOT NULL THEN 'outlet'
                            END AS area_name,
                            CASE 
                            WHEN u.zone_id IS NOT NULL THEN 1
                            WHEN u.regional_id IS NOT NULL THEN 2
                            WHEN u.sale_area_id IS NOT NULL THEN 3
                            WHEN u.district_id IS NOT NULL THEN 4
                            WHEN u.outlet_id IS NOT NULL THEN 5
                            END AS area_name_id
                        FROM 
                            users u
                        INNER JOIN
                            energy_companies ON energy_companies.admin_id = u.admin_id
                        LEFT JOIN 
                            regional_offices r ON r.id = u.regional_id
                        LEFT JOIN 
                            zones z ON z.zone_id = u.zone_id
                        LEFT JOIN 
                            districts d ON d.id = u.district_id
                        LEFT JOIN 
                            outlets o ON o.id = u.outlet_id
                        LEFT JOIN 
                            sales_area s ON s.id = u.sale_area_id
                        WHERE 
                            energy_companies.id = '${id}' AND u.is_deleted = '0' ${searchValue} ${filterConditions} ${condition}`;

        query = addCreatedByCondition(query, {
            table: "u",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // console.log("query: ", query);
        const queryResult = await db.query(query);
        // console.log("queryResult: ", queryResult);
        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        queryResult.map((item) => {
            item.joining_date = moment(item.joining_date, "YYYY-MM-DD").format("YYYY-MM-DD");
            item.transfer_date = moment(item.transfer_date, "YYYY-MM-DD").format("YYYY-MM-DD");
        });

        let finalData = [];

        if (!pageSize && !isDropdown && type != "") {
            if (columns.length == 0) {
                columns = [
                    "energy_company_name",
                    "username",
                    "email",
                    "mobile",
                    "address",
                    "status",
                    "country",
                    "city",
                    "pin_code",
                    "description",
                    "joining_date",
                    "transfer_date",
                    "transfer_by",
                    "created_at",
                    "area_name",
                    "area_selected",
                ];
            } 

            // Process finalData for any specific transformations
            finalData = queryResult.map((item) => {
                return {
                    ...item,
                    joining_date: moment(item.joining_date).format("YYYY-MM-DD"),
                    created_at: moment(item.created_at).format("YYYY-MM-DD"),
                    transfer_by: item.transfer_by ? item.transfer_by : "", // Replace null with empty string
                    transfer_date:
                        item.transfer_date == "Invalid date" ||
                        !moment(item.transfer_date, "YYYY-MM-DD", true).isValid() ||
                        item.transfer_date == null
                            ? ""
                            : moment(item.transfer_date).format("YYYY-MM-DD"),
                    status: item.status === 1 ? "Active" : "Inactive", // Transform status to readable format
                };
            });

            let filePath;
            let message = type == "1" ? "Excel exported successfully" : "PDF exported successfully";

            // console.log("type: ", type);
            if (type == "1") {
                filePath = await exportToExcel(finalData, "energy-company-users", columns);
            } else {
                filePath = await exportToPDF(
                    finalData,
                    "energy-company-users",
                    "All (360° View) Energy Company Users",
                    columns
                );
            }

            return res.status(StatusCodes.OK).json({ status: true, message, filePath });
        }

        if (!user_id && type == "") {
            if (pageSize == null) pageSize = 10;
            const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true,
                data: queryResult,
                pageDetails: pageDetails,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            data: queryResult[0],
        });
    } catch (error) {
        return next(error);
    }
};

const deleteEnergyTeam = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(500).json({ status: false, message: error.message });

        const query = `UPDATE users SET is_deleted = '1' WHERE id='${id}'`;
        const result = await db.query(query);
        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Energy Team Member deleted successfully" });
        }
        res.status(500).json({ status: false, message: "Something went wrong, please try again later" });
    } catch (error) {
        return next(error);
    }
};

const getZonesForEnergyCompanyUsers = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        // const isDropdown = req.query.isDropdown || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }

        let query = `SELECT DISTINCT z.zone_id, z.zone_name
                        FROM 
                            users u
                        INNER JOIN
                            energy_companies ON energy_companies.admin_id = u.admin_id
                        LEFT JOIN 
                            zones z ON z.zone_id = u.zone_id
                        WHERE 
                            energy_companies.id = '${id}' AND u.is_deleted = '0' 
                            AND z.zone_id IS NOT NULL 
                            AND z.zone_name IS NOT NULL `;

        query = addCreatedByCondition(query, {
            table: "u",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(query);

        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.zone_id !== null && item.zone_name !== null);

        return res.status(StatusCodes.OK).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getRegionalAreaForEnergyCompanyUsers = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        // const isDropdown = req.query.isDropdown || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }

        let query = `SELECT DISTINCT r.id AS ro_id, r.regional_office_name AS ro_name
                        FROM 
                            users u
                        INNER JOIN
                            energy_companies ON energy_companies.admin_id = u.admin_id
                        LEFT JOIN 
                            regional_offices r ON r.id = u.regional_id
                        WHERE 
                            energy_companies.id = '${id}' AND u.is_deleted = '0'
                            AND r.id IS NOT NULL 
                            AND r.regional_office_name IS NOT NULL  `;

        query = addCreatedByCondition(query, {
            table: "u",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(query);

        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.ro_id != null && item.ro_name != null);

        return res.status(StatusCodes.OK).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getSalesAreaForEnergyCompanyUsers = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        // const isDropdown = req.query.isDropdown || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }

        let query = `SELECT DISTINCT s.id AS sales_area_id, s.sales_area_name 
                        FROM 
                            users u
                        INNER JOIN
                            energy_companies ON energy_companies.admin_id = u.admin_id
                        LEFT JOIN 
                            sales_area s ON s.id = u.sale_area_id
                        WHERE 
                            energy_companies.id = '${id}' AND u.is_deleted = '0'
                            AND s.id IS NOT NULL 
                            AND s.sales_area_name IS NOT NULL `;

        query = addCreatedByCondition(query, {
            table: "u",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(query);

        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter(
            (item) => item.sales_area_id != null && item.sales_area_name != null
        );

        return res.status(StatusCodes.OK).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getDistrictForEnergyCompanyUsers = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        // const isDropdown = req.query.isDropdown || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }

        let query = `SELECT DISTINCT d.id AS district_id, d.district_name
                        FROM 
                            users u
                        INNER JOIN
                            energy_companies ON energy_companies.admin_id = u.admin_id
                        LEFT JOIN 
                            districts d ON d.id = u.district_id
                        WHERE 
                            energy_companies.id = '${id}' AND u.is_deleted = '0'
                            AND d.id IS NOT NULL 
                            AND d.district_name IS NOT NULL `;

        query = addCreatedByCondition(query, {
            table: "u",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(query);

        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.district_id != null && item.district_name != null);

        return res.status(StatusCodes.OK).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createEnergyCompanyUser,
    createSubUsersForEnergyCompanyZoneUser,
    createSubUsersForEnergyCompanyRegionalOfficeUser,
    createSubUsersForEnergyCompanySaleAreaUser,
    getEnergyCompanyDetailsById,
    updateEnergyCompanyDetails,
    updateEnergyCompanyUserDetails,
    updateEnergyCompanySubUserDetails,
    deleteEnergyCompany,
    deleteEnergyCompanyUser,
    energyCompanyDeleteSubUser,
    getAllActiveEnergyCompany,
    getAllCreatedEnergyCompany,
    getAllCreatedEnergyCompanyWithSoftDelete,
    getAllEnergyCompanyAndUsersWithPendingAccountStatus,
    energyCompanyAccountStatusAction,
    getAllZoneByEnergyCompanyId,
    checkRelatedDataForEnergyCompany,
    deleteRelatedDataForEnergyCompany,
    getEnergyCompanySubSidiaries,
    createEnergyTeam,
    updateEnergyTeam,
    getEnergyTeamDetailsById,
    deleteEnergyTeam,
    getZonesForEnergyCompanyUsers,
    getRegionalAreaForEnergyCompanyUsers,
    getSalesAreaForEnergyCompanyUsers,
    getDistrictForEnergyCompanyUsers,
};

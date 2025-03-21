var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const {
    getZoneUsers,
    getReginalOfficeUsers,
    getSaleAreaUsers,
    getZoneSubUsers,
    getRegionalOfficeSubUsers,
    getSaleAreaSubUsers,
} = require("../helpers/general");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const getEnergyCompanies = async (req, res, next) => {
    try {
        const selectQuery = `SELECT admins.id as user_id, admins.name as user_name, roles.name as user_type, zone_assigns.zone_id, zones.zone_name, regional_office_assigns.regional_office_id, regional_offices.regional_office_name, sale_area_assigns.sale_area_id, sales_area.sales_area_name FROM admins INNER JOIN roles ON roles.id=admins.user_type INNER JOIN zone_assigns ON zone_assigns.energy_company_id = admins.id INNER JOIN zones ON zones.zone_id=zone_assigns.zone_id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=admins.id INNER JOIN regional_offices ON regional_offices.id=regional_office_assigns.regional_office_id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=admins.id INNER JOIN sales_area ON sales_area.id=sale_area_assigns.sale_area_id WHERE admins.user_type='${process.env.ENERGY_COMPANY_ROLE_ID}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return request.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully.", data: result });
            } else {
                return res.status(400).json({ status: false, message: "No data found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompaniesContacts = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT admins.id, admins.name as user_name,admins.contact_no, admins.address_1, roles.name as user_type, energy_companies.name as company_name, zone_assigns.zone_id, regional_office_assigns.regional_office_id, sale_area_assigns.sale_area_id, admins.image FROM admins INNER JOIN roles ON roles.id=admins.user_type INNER JOIN energy_companies ON energy_companies.admin_id=admins.id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=admins.id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=admins.id WHERE admins.id='${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return request.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        zones: await getZoneUsers(element.zone_id),
                        regional_name: await getReginalOfficeUsers(element.regional_office_id),
                        sale_area_name: await getSaleAreaUsers(element.sale_area_id),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully.", data: values });
                });
            } else {
                return res.status(400).json({ status: false, message: "No data found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanyZoneSubUsers = async (req, res, next) => {
    try {
        const zone_id = req.params.zone_id;
        const user_id = req.params.user_id;
        const { error } = checkPositiveInteger.validate({ id: zone_id, id: user_id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT name, email, image,mobile,joining_date,zone_id,id FROM users WHERE id='${user_id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return request.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, sub_users: await getZoneSubUsers(element.zone_id, element.id) };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully.", data: values });
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanyRegionalOfficeSubUsers = async (req, res, next) => {
    try {
        const regional_id = req.params.regional_id;
        const user_id = req.params.user_id;
        const { error } = checkPositiveInteger.validate({ id: regional_id, id: user_id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT name, email, image,mobile,joining_date,regional_id,id FROM users WHERE id='${user_id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return request.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, sub_users: await getRegionalOfficeSubUsers(element.regional_id, element.id) };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully.", data: values });
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanySaleAreaSubUsers = async (req, res, next) => {
    try {
        const sale_area_id = req.params.sale_area_id;
        const user_id = req.params.user_id;
        const { error } = checkPositiveInteger.validate({ id: sale_area_id, id: user_id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT name, email, image,mobile,joining_date,sale_area_id,id FROM users WHERE id='${user_id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return request.status(400).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, sub_users: await getSaleAreaSubUsers(element.sale_area_id, element.id) };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully.", data: values });
                });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanyUserDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT users.id, users.name, users.email, users.mobile, users.joining_date, users.image, users.zone_id, users.regional_id, users.sale_area_id, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name FROM users LEFT JOIN zones ON zones.zone_id=users.zone_id LEFT JOIN regional_offices ON regional_offices.id = users.regional_id LEFT JOIN sales_area ON sales_area.id=users.sale_area_id WHERE users.id='${id}' AND users.user_type='${process.env.USER_ROLE_ID}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(402).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "success", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getEnergyCompanySubUserDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `SELECT users.id, users.name, users.email, users.mobile, users.joining_date, users.image, users.zone_id, users.regional_id, users.sale_area_id, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name FROM users LEFT JOIN zones ON zones.zone_id=users.zone_id LEFT JOIN regional_offices ON regional_offices.id = users.regional_id LEFT JOIN sales_area ON sales_area.id=users.sale_area_id WHERE users.id='${id}' AND users.user_type='${process.env.SUB_USER_ROLE_ID}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(402).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "success", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getContactsForChat = async (req, res, next) => {
    try {
        let contacts_type = req.query.type || "";

        contacts_type = contacts_type != "" && contacts_type.toLowerCase();

        let selectQuery = "";
        let table = "";
        switch(contacts_type) {
            case "my_company" :
                selectQuery = ` SELECT id, id AS employee_id, CONCAT(first_name, ' ', last_name) AS name, image
                    FROM contacts
                    WHERE status = '1'
                    ORDER by id DESC`;
                    table = "contacts";
                break;
            case "oil_and_gas" :
                selectQuery = `SELECT u.unique_id AS id, u.employee_id, u.name, u.email, u.image
                    FROM users u 
                    LEFT JOIN energy_companies ON energy_companies.admin_id = u.admin_id
                    WHERE u.is_deleted = '0' 
                    ORDER BY id DESC`;
                    table = "u";
                break;
            case "outlet" :
                selectQuery = `SELECT u.unique_id AS id, o.outlet_contact_person_name AS name, o.primary_email AS email, o.outlet_image AS image, u.id AS user_id, u.employee_id
                    FROM outlets o
                    LEFT JOIN users u ON u.outlet_id = o.id
                    WHERE o.is_deleted = '0' AND u.is_deleted = '0' AND o.outlet_contact_person_name IS NOT NULL AND o.outlet_contact_person_name != '' 
                    ORDER BY id DESC`;
                    table = "o";
                break;
            case "client" :
                selectQuery = `SELECT company_id AS id, c.company_id AS employee_id, c.company_contact_person AS name, c.primary_contact_email AS email
                    FROM companies c
                    LEFT JOIN states ON states.id = c.company_state 
                    LEFT JOIN cities ON cities.id = c.company_city 
                    WHERE c.is_superadmin_company = '0' AND c.company_type = '1' AND c.is_deleted = '0' 
                    ORDER BY employee_id DESC`;
                    table = "c";
                break;
            case "vendor" :
                selectQuery = `SELECT company_id AS id, c.company_id AS employee_id, c.company_contact_person AS name, c.primary_contact_email AS email
                    FROM companies c
                    LEFT JOIN states ON states.id = c.company_state 
                    LEFT JOIN cities ON cities.id = c.company_city 
                    WHERE c.is_superadmin_company = '0' AND c.company_type = '2' AND c.is_deleted = '0' 
                    ORDER BY employee_id DESC`;
                    table = "c";
                break;
            case "supplier" :
                selectQuery = ` SELECT suppliers.id, suppliers.id AS employee_id, suppliers.supplier_name AS name, suppliers.upi_image AS image
                    FROM suppliers 
                    LEFT JOIN banks On banks.id = suppliers.bank_id 
                    ORDER BY suppliers.id DESC`;
                    table = "suppliers";
                break;
            default: 
                selectQuery = ""
                break;
        }

        if(selectQuery == "") {
            return res.status(400).json({ status: false, message: "Please provide valid contact type" });
        }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: table,
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const contactsData = await db.query(selectQuery);

        if(contactsData.length > 0) {
            return res.status(200).json({ status: true, message: "Fetched contacts successfully", data: contactsData });
        } else {
            return res.status(400).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getEnergyCompaniesContacts,
    getEnergyCompanies,
    getEnergyCompanyZoneSubUsers,
    getEnergyCompanyRegionalOfficeSubUsers,
    getEnergyCompanySaleAreaSubUsers,
    getEnergyCompanySubUserDetailById,
    getEnergyCompanyUserDetailsById,
    getContactsForChat,
};

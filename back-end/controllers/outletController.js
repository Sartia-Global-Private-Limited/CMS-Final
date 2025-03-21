var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { outletFormValidation, checkPositiveInteger, importOutletValidation } = require("../helpers/validation");
const {
    generatePanelIdForUser,
    generateEmpIdForOutletUsers,
} = require("../helpers/panelHelper");
const { getOutLetUserDetailsByOutletId, addCreatedByCondition} = require("../helpers/commonHelper");
const {
    calculatePagination,
    getDistrictById,
    getAdminAndUserDetail,
    roleById,
    getAdminDetails,
    getUserDetails,
    getRecordWithWhereAndJoin,
} = require("../helpers/general");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const addOutlet = async (req, res, next) => {
    try {
        let {
            energy_company_id,
            zone_id,
            regional_id,
            sales_area_id,
            district_id,
            outlet_name,
            outlet_contact_person_name,
            outlet_contact_number,
            primary_number,
            secondary_number,
            primary_email,
            secondary_email,
            customer_code,
            outlet_category,
            location,
            address,
            outlet_ccnoms,
            outlet_ccnohsd,
            outlet_resv,
            outlet_longitude,
            outlet_lattitude,
            outlet_unique_id,
            status,
            email,
            password,
        } = req.body;
        const created_by = req.user.user_id;
        var storePath = "";
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_id: Joi.number().required(),
            sales_area_id: Joi.number().required(),
            //district_id: Joi.number().optional(),
            outlet_name: Joi.string().required(),
            outlet_contact_number: Joi.number().required(),
            customer_code: Joi.string().required(),
            outlet_category: Joi.string().required(),
            outlet_ccnoms: Joi.string().required(),
            outlet_ccnohsd: Joi.string().required(),
            outlet_unique_id: Joi.string().required(),
            status: Joi.string().required(),
            // address: Joi.string().required(),
            email: Joi.string().optional(),
            password: Joi.string().optional(),
        }).options({ allowUnknown: true });

        const { error, value } = joiSchema.validate(req.body);

        if (error) return res.status(200).json({ status: false, message: error.message });

        const userExists = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (userExists.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "User already exists",
            });
        }
        const check = await checkOutletUniqueId(outlet_unique_id);

        if (check === false)
            return res.status(200).json({ status: false, message: "Outlet unique ID already exists." });

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/outlet_images/" + imageName;
            storePath = "/outlet_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(200).json({ status: false, message: err.message });
            });
        }
        district_id != "" ? (district_id = district_id) : (district_id = "");
        let insertQuery = "";
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        if (district_id != "") {
            insertQuery = `INSERT INTO outlets (energy_company_id, zone_id, regional_office_id, sales_area_id, district_id, outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, created_by, created_at, outlet_image, status) VALUES ('${energy_company_id}', '${zone_id}', '${regional_id}', '${sales_area_id}', '${district_id}', '${outlet_unique_id}', '${outlet_name}', '${outlet_contact_person_name}', '${outlet_contact_number}', '${primary_number}', '${secondary_number}', '${primary_email}', '${secondary_email}', '${customer_code}', '${outlet_category}', '${location}', '${address}', '${outlet_ccnoms}', '${outlet_ccnohsd}', '${outlet_resv}', '${outlet_lattitude}', '${outlet_longitude}', '${created_by}', '${createdAt}', '${storePath}', '${status}')`;
        } else {
            insertQuery = `INSERT INTO outlets (energy_company_id, zone_id, regional_office_id, sales_area_id, outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, created_by, created_at, outlet_image, status) VALUES ('${energy_company_id}', '${zone_id}', '${regional_id}', '${sales_area_id}', '${outlet_unique_id}', '${outlet_name}', '${outlet_contact_person_name}', '${outlet_contact_number}', '${primary_number}', '${secondary_number}', '${primary_email}', '${secondary_email}', '${customer_code}', '${outlet_category}', '${location}', '${address}', '${outlet_ccnoms}', '${outlet_ccnohsd}', '${outlet_resv}', '${outlet_lattitude}', '${outlet_longitude}', '${created_by}', '${createdAt}', '${storePath}', '${status}')`;
        }

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const outletId = result.insertId;
                // create outlet user
                if (outletId > 0) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    const user_type = process.env.USER_ROLE_ID;
                    const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
                    
                    const employee_id = null;
                    const joining_date = moment().format("YYYY-MM-DD");

                    const userInsertQuery = `INSERT INTO users (name, username, email, password, mobile, user_type, address, created_by, panel_id, status, image, outlet_id, employee_id, joining_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const insertValues = [
                        outlet_name,
                        outlet_name,
                        email,
                        hashPassword,
                        outlet_contact_number,
                        user_type,
                        address,
                        created_by,
                        panel_id,
                        status,
                        storePath,
                        outletId,
                        employee_id,
                        joining_date,
                    ];
                    const loginQueryResult = await db.query(userInsertQuery, insertValues);
                    if (loginQueryResult.affectedRows > process.env.VALUE_ZERO) {
                        const employee_id = await generateEmpIdForOutletUsers();
                        // console.log('employee_id: ', employee_id);
                        const unique_id = `U${loginQueryResult.insertId}`;
                        await db.query(
                            `UPDATE users 
                                SET unique_id = '${unique_id}', employee_id = '${employee_id}' 
                                WHERE id = '${loginQueryResult.insertId}'
                                `
                        );
                    }
                }
                res.status(200).json({ status: true, message: "Outlet created successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const importOutlet = async (req, res, next) => {
    try {
        const { outlets } = req.body; // Assuming 'outlets' is an array of outlet objects
        if (outlets.length === 0) {
            throw new Error("Invalid Excel File");
        }
        const created_by = req.user.user_id;

        const { error } = importOutletValidation.validate(outlets);
        if (error) return res.status(400).json({ status: false, message: error.message });

        // DUPLICACY CHECK IN EXCEL ROWS
        // Separate sets for outlet_name and outlet_unique_id to track duplicates within the provided outlets
        const outletNameSet = new Set();
        const outletUniqueIdSet = new Set();

        for (let i = 0; i < outlets.length; i++) {
            let outlet = outlets[i];
            const {
                energy_company_id,
                zone_id,
                regional_id,
                sales_area_id,
                district_id,
                outlet_name,
                outlet_contact_person_name,
                outlet_contact_number,
                primary_number,
                secondary_number,
                primary_email,
                secondary_email,
                customer_code,
                outlet_category,
                location,
                address,
                outlet_ccnoms,
                outlet_ccnohsd,
                outlet_resv,
                outlet_longitude,
                outlet_lattitude,
                outlet_unique_id,
                status,
                email,
                password,
            } = outlet;

            if (outlet_name && outletNameSet.has(outlet_name)) {
                return res
                    .status(400)
                    .json({ status: false, message: `at outlet index ${i + 1} duplicate outlet name ${outlet_name} found in provided outlets.` });
            }

            if (outlet_unique_id && outletUniqueIdSet.has(outlet_unique_id)) {
                return res
                    .status(400)
                    .json({ status: false, message: `at outlet index ${i + 1} duplicate outlet unique ID ${outlet_unique_id} found in provided outlets.` });
            }

            // Add to sets for tracking
            if (outlet_name) outletNameSet.add(outlet_name);
            if (outlet_unique_id) outletUniqueIdSet.add(outlet_unique_id);

            // Check Outlet name in database
            const conditions = [
                { field: "outlet_name", operator: "=", value: outlet_name },
                { field: "is_deleted", operator: "=", value: 0 },
            ];
            const existingOutlet = await getRecordWithWhereAndJoin("outlets", conditions);
            if (existingOutlet.length > 0) {
                return res
                    .status(400)
                    .json({ status: false, message: `at outlet index ${i + 1} Outlet name ${outlet_name} already exists in system` });
            }

            // Check if the outlet unique ID already exists in database
            const check = await checkOutletUniqueId(outlet_unique_id);
            if (check === false) {
                return res
                    .status(400)
                    .json({ status: false, message: `at outlet index ${i + 1} Outlet unique ID ${outlet_unique_id} already exists in system` });
            }
        }

        for (let outlet of outlets) {
            const {
                energy_company_id,
                zone_id,
                regional_id,
                sales_area_id,
                district_id,
                outlet_name,
                outlet_contact_person_name,
                outlet_contact_number,
                primary_number,
                secondary_number,
                primary_email,
                secondary_email,
                customer_code,
                outlet_category,
                location,
                address,
                outlet_ccnoms,
                outlet_ccnohsd,
                outlet_resv,
                outlet_longitude,
                outlet_lattitude,
                outlet_unique_id,
                status,
                email,
                password,
            } = outlet;

            // Insert a single outlet
            const outletInsertQuery = `
        INSERT INTO outlets (
          energy_company_id, zone_id, regional_office_id, sales_area_id, district_id,
          outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number,
          primary_number, secondary_number, primary_email, secondary_email, customer_code,
          outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv,
          outlet_longitude, outlet_lattitude, created_by, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

            const result = await db.query(outletInsertQuery, [
                energy_company_id,
                zone_id,
                regional_id,
                sales_area_id,
                district_id,
                outlet_unique_id,
                outlet_name,
                outlet_contact_person_name,
                outlet_contact_number,
                primary_number,
                secondary_number,
                primary_email,
                secondary_email,
                customer_code,
                outlet_category,
                location,
                address,
                outlet_ccnoms,
                outlet_ccnohsd,
                outlet_resv,
                outlet_longitude,
                outlet_lattitude,
                created_by,
                status,
            ]);

            if (result.affectedRows > 0) {
                const outletId = result.insertId;
                // If user details are provided, insert the user with the correct outlet ID
                if (password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    const user_type = process.env.USER_ROLE_ID;
                    const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
                    const employee_id = null;
                    const joining_date = moment().format("YYYY-MM-DD");

                    const userInsertQuery = `
                    INSERT INTO users (
                        name, username, email, password, mobile, user_type, address, created_by,
                        panel_id, status, employee_id, joining_date, outlet_id
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                    const userInsertResult = await db.query(userInsertQuery, [
                        outlet_name,
                        outlet_name,
                        email,
                        hashPassword,
                        outlet_contact_number,
                        user_type,
                        address,
                        created_by,
                        panel_id,
                        status,
                        employee_id,
                        joining_date,
                        outletId,
                    ]);

                    if(userInsertResult.affectedRows > 0){
                        const userInsertId = userInsertResult.insertId;
                        const employee_id = await generateEmpIdForOutletUsers();
                                console.log('employee_id: ', employee_id);
                                const unique_id = `U${userInsertId}`;
                                await db.query(
                                    `UPDATE users 
                                        SET unique_id = '${unique_id}', employee_id = '${employee_id}' 
                                        WHERE id = '${userInsertId}'
                                        `
                                );
                    }
                }
                
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Failed to insert outlet. Something went wrong, please try again",
                });
            }
        }

        res.status(200).json({ status: true, message: "Outlets created successfully" });
    } catch (error) {
        return next(error);
    }
};

async function checkOutletUniqueId(outlet_unique_id) {
    try {
        const selectQuery = await db.query(`select * from outlets where outlet_unique_id = '${outlet_unique_id}'`);
        if (selectQuery.length > 0) {
            return false;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllOutlet = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const energy_company_id = req.query.energy_company_id || "";
        const status = req.query.status || "";
        const zone_id = req.query.zone_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const district_id = req.query.district_id;
        const type = req.query.type || ""; // For export type: 1 for Excel, 2 for PDF
        const isDropdown = req.query.isDropdown || false;
        let columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const role_id = req.user.user_type;

        // Search and filter conditions
        let search_where = "WHERE outlets.is_deleted = '0'";
        if (searchData) {
            search_where += ` 
                AND (outlets.outlet_name LIKE '%${searchData}%' 
                OR outlets.outlet_contact_person_name LIKE '%${searchData}%'
                OR outlets.outlet_unique_id LIKE '%${searchData}%'
                OR outlets.outlet_category LIKE '%${searchData}%'
                OR energy_companies.name LIKE '%${searchData}%'
                OR zones.zone_name LIKE '%${searchData}%'
                OR regional_offices.regional_office_name LIKE '%${searchData}%'
                OR sales_area.sales_area_name LIKE '%${searchData}%')
            `;
        }
        if (status) {
            search_where += ` AND outlets.status = ${status}`;
        }
        if (zone_id) {
            search_where += ` AND outlets.zone_id = ${zone_id}`;
        }
        if (regional_office_id) {
            search_where += ` AND outlets.regional_office_id = ${regional_office_id}`;
        }
        if (sales_area_id) {
            search_where += ` AND outlets.sales_area_id = ${sales_area_id}`;
        }
        if (district_id) {
            search_where += ` AND outlets.district_id = ${district_id}`;
        }
        if (energy_company_id) {
            search_where += ` AND outlets.energy_company_id = ${energy_company_id}`;
        }
        const clients = await db.query(`SELECT id FROM admins WHERE  user_type = '${process.env.CONTRACTOR_ROLE_ID}'`);
        // console.log("clients: ", clients);
        // console.log('req.user: ', req.user);
        if (req.user.user_type == process.env.SUPER_ADMIN_ROLE_ID && req.user.unique_id == "A1") {
            search_where += ` AND (outlets.created_by = ${req.user.user_id} OR outlets.created_by IN (${clients.map((client) => client.id).join(", ")}))`;
        } else if (req.user.user_type == process.env.CONTRACTOR_ROLE_ID) {
            const users = await db.query(`SELECT id FROM users WHERE created_by = '${req.user.user_id}'`);
            if (users.length > 0) {
                search_where += ` AND (outlets.created_by = ${req.user.user_id} 
                OR outlets.created_by IN (
                    ${users.map((user) => user.id).join(", ")}
                )
                OR (outlets.status = '2' AND outlets.created_by IN (
                    SELECT id FROM admins WHERE user_type = ${process.env.SUPER_ADMIN_ROLE_ID}
                )))`;
            } else {
                search_where += ` AND (outlets.created_by = ${req.user.user_id} 
                OR (outlets.status = '2' AND outlets.created_by IN (
                    SELECT id FROM admins WHERE user_type = ${process.env.SUPER_ADMIN_ROLE_ID}
                )))`;
            }
        } else {
            const createdBy = await db.query(`SELECT created_by FROM users WHERE id = '${req.user.user_id}'`);

            if (createdBy.length > 0) {
                search_where += ` AND (outlets.created_by = ${req.user.user_id} OR (outlets.status = '2' AND outlets.created_by IN (${createdBy.map((user) => user.created_by).join(", ")})))`;
            } else {
                search_where += ` AND (outlets.created_by = ${req.user.user_id} OR (outlets.status = '2')`;
            }
        }

        let orderBy = `ORDER BY outlets.id DESC`;
        if (type === "1" || type === "2") {
            orderBy = ""; // No pagination or ordering needed for export
        }

        let limit = `LIMIT ${pageFirstResult}, ${pageSize}`;
        if (type === "1" || type === "2" || isDropdown) {
            limit = ""; // No pagination for dropdowns or exports
        }

        let query = `
            SELECT 
                outlets.id, 
                outlets.energy_company_id, 
                outlets.zone_id, 
                outlets.regional_office_id, 
                outlets.sales_area_id, 
                outlets.district_id, 
                outlets.outlet_unique_id, 
                outlets.outlet_name, 
                outlets.outlet_contact_person_name, 
                outlets.outlet_contact_number, 
                outlets.primary_number, 
                outlets.secondary_number, 
                outlets.primary_email, 
                outlets.secondary_email, 
                outlets.customer_code, 
                outlets.outlet_category, 
                outlets.location, 
                outlets.address, 
                outlets.outlet_ccnoms, 
                outlets.outlet_ccnohsd, 
                outlets.outlet_resv, 
                outlets.outlet_longitude, 
                outlets.outlet_lattitude, 
                outlets.outlet_image, 
                outlets.created_by, 
                outlets.created_at, 
                energy_companies.name as energy_company_name, 
                zones.zone_name, 
                regional_offices.regional_office_name, 
                sales_area.sales_area_name, 
                outlets.status, 
                users.email, 
                users.image,
                users.unique_id,
                districts.district_name
            FROM 
                outlets
            LEFT JOIN 
                users ON users.outlet_id = outlets.id
            LEFT JOIN 
                energy_companies ON energy_companies.id = outlets.energy_company_id
            LEFT JOIN 
                zones ON zones.zone_id = outlets.zone_id
            LEFT JOIN 
                regional_offices ON regional_offices.id = outlets.regional_office_id
            LEFT JOIN 
                sales_area ON sales_area.id = outlets.sales_area_id
            LEFT JOIN 
                districts ON districts.id = outlets.district_id
            ${search_where} ${orderBy} ${limit}`;

        // console.log("query: ", query);
        let queryResult = await db.query(query);

        queryResult = await Promise.all(
            queryResult.map(async (item) => {
                const userDetail = {};
                if (role_id == 1) {
                    const [createdBy] = await getAdminDetails(item.created_by);
                    const role = createdBy?.user_type != null && (await roleById(createdBy.user_type));

                    userDetail.id = createdBy?.id || "";
                    userDetail.name = createdBy?.name || "";
                    userDetail.image = createdBy?.image || "";
                    userDetail.employee_id = createdBy?.employee_id || "";
                    userDetail.role = role && role.name;

                    item.created_by = userDetail;
                    return item;
                } else if (role_id == 3) {
                    // const [createdBy] = await getAdminAndUserDetail(item.created_by);
                    // find user details from admin table because outlet is created by users who are stored in admin table.
                    const [createdBy] = await getAdminDetails(item.created_by);
                    const role = createdBy?.user_type != null && (await roleById(createdBy.user_type));
                    userDetail.id = createdBy?.id || "";
                    userDetail.name = createdBy?.name || "";
                    userDetail.image = createdBy?.image || "";
                    userDetail.employee_id = createdBy?.employee_id || "";
                    userDetail.role = role && role.name;

                    item.created_by = userDetail;
                    return item;
                } else {
                    // const [createdBy] = await getUserDetails(item.created_by);
                    const [createdBy] = await getAdminAndUserDetail(item.created_by);
                    const role = createdBy?.user_type != null && (await roleById(createdBy.user_type));

                    userDetail.id = createdBy?.id || "";
                    userDetail.name = createdBy?.username || "";
                    userDetail.image = createdBy?.image || "";
                    userDetail.employee_id = createdBy?.employee_id || "";
                    userDetail.role = role && role.name;

                    item.created_by = userDetail;
                    return item;
                }
            })
        );

        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        if (type === "1" || type === "2") {
            if (columns.length == 0) {
                columns = [
                    "outlet_name",
                    "zone_name",
                    "regional_office_name",
                    "sales_area_name",
                    "district_name",
                    "status",
                    "created_at",
                ];
            }
            // Prepare data for export
            const exportData = queryResult.map((item) => ({
                outlet_name: item.outlet_name,
                zone_name: item.zone_name,
                regional_office_name: item.regional_office_name,
                sales_area_name: item.sales_area_name,
                district_name: item.district_name,
                status: item.status === 1 ? "Active" : "Inactive",
                created_at: moment(item.created_at).format("YYYY-MM-DD"),
            }));

            let filePath, message;
            if (type === "1") {
                filePath = await exportToExcel(exportData, "outlets", columns);
                message = "Excel exported successfully";
            } else if (type === "2") {
                filePath = await exportToPDF(exportData, "outlets", "All (360° View) Outlets Data", columns);
                message = "PDF exported successfully";
            }

            return res.status(200).json({ status: true, message, filePath });
        }

        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

        // let finalData = [];
        // for (const item of queryResult) {
        //     if (item.district_id != null) {
        //         district = await getDistrictById(item.district_id); // Await here to fetch district by ID
        //     }
        //     item.district_name = district[0]?.district_name || null;
        //     finalData.push(item);
        // }

        return res.status(200).json({
            status: true,
            data: queryResult,
            pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

const getZonesForOutlets = async (req, res, next) => {
    try {
        const id = req.query?.id || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }

        // Initialize the base query
        let query = `
            SELECT 
                DISTINCT z.zone_id, 
                z.zone_name
            FROM 
                outlets o
            INNER JOIN
                energy_companies ON energy_companies.id = o.energy_company_id
            LEFT JOIN 
                zones z ON z.zone_id = o.zone_id
            WHERE  
                energy_companies.id = '${id}' AND o.is_deleted = '0'  
                AND z.zone_id IS NOT NULL
                AND z.zone_name IS NOT NULL
        `;

        query = addCreatedByCondition(query, {
            table: "o",
            created_by: req.user.user_id,
            role: req.user.user_type, // Assuming the user type is passed in the request
        });

        // Execute the query
        const queryResult = await db.query(query);

        // Handle case where no data is found
        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.zone_id !== null && item.zone_name !== null);

        // Return the filtered results
        return res.status(200).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getRegionalOfficeOnZoneForOutlets = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        const zone_id = req.query?.zone_id || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }
        if (!zone_id || zone_id == "") {
            return res.status(400).json({ status: false, message: "Provide Zone id" });
        }

        // Initialize the base query
        let query = `
            SELECT 
                DISTINCT r.id AS ro_id, r.regional_office_name AS ro_name
            FROM 
                outlets o
            INNER JOIN
                energy_companies ON energy_companies.id = o.energy_company_id
            LEFT JOIN 
                zones z ON z.zone_id = o.zone_id
            LEFT JOIN 
                regional_offices r ON r.id = o.regional_office_id
            WHERE  
                energy_companies.id = '${id}' AND o.is_deleted = '0'
                AND z.zone_id = '${zone_id}'  
                AND r.id IS NOT NULL
                AND r.regional_office_name IS NOT NULL
        `;

        query = addCreatedByCondition(query, {
            table: "o",
            created_by: req.user.user_id,
            role: req.user.user_type, // Assuming the user type is passed in the request
        });

        // Execute the query
        const queryResult = await db.query(query);

        // Handle case where no data is found
        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.ro_id !== null && item.ro_name !== null);

        // Return the filtered results
        return res.status(200).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getSalesAreaOnRegionalForOutlets = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        const zone_id = req.query?.zone_id || "";
        const regional_office_id = req.query?.regional_office_id || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }
        if (!zone_id || zone_id == "") {
            return res.status(400).json({ status: false, message: "Provide Zone id" });
        }
        if (!regional_office_id || regional_office_id == "") {
            return res.status(400).json({ status: false, message: "Provide Regional office id" });
        }

        // Initialize the base query
        let query = `
            SELECT 
                DISTINCT s.id AS sa_id, s.sales_area_name AS sa_name
            FROM 
                outlets o
            INNER JOIN
                energy_companies ON energy_companies.id = o.energy_company_id
            LEFT JOIN 
                zones z ON z.zone_id = o.zone_id
            LEFT JOIN 
                sales_area s ON s.id = o.sales_area_id
            LEFT JOIN 
                regional_offices r ON r.id = o.regional_office_id
            WHERE  
                energy_companies.id = '${id}' AND o.is_deleted = '0'
                AND z.zone_id = '${zone_id}'
                AND r.id = '${regional_office_id}'  
                AND s.id IS NOT NULL
                AND s.sales_area_name IS NOT NULL
        `;

        query = addCreatedByCondition(query, {
            table: "o",
            created_by: req.user.user_id,
            role: req.user.user_type, // Assuming the user type is passed in the request
        });

        // Execute the query
        const queryResult = await db.query(query);

        // Handle case where no data is found
        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.sa_id !== null && item.sa_name !== null);

        // Return the filtered results
        return res.status(200).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getDistrictOnSalesAreaForOutlets = async (req, res, next) => {
    try {
        const id = req.query?.id || "";
        const zone_id = req.query?.zone_id || "";
        const regional_office_id = req.query?.regional_office_id || "";
        const sales_area_id = req.query?.sales_area_id || "";

        if (!id || id == "") {
            return res.status(400).json({ status: false, message: "Provide Energy company id" });
        }
        if (!zone_id || zone_id == "") {
            return res.status(400).json({ status: false, message: "Provide Zone id" });
        }
        if (!regional_office_id || regional_office_id == "") {
            return res.status(400).json({ status: false, message: "Provide Regional office id" });
        }
        if (!sales_area_id || sales_area_id == "") {
            return res.status(400).json({ status: false, message: "Provide Sales area id" });
        }

        // Initialize the base query
        let query = `
            SELECT 
                DISTINCT d.id AS district_id, d.district_name
            FROM 
                outlets o
            INNER JOIN
                energy_companies ON energy_companies.id = o.energy_company_id
            LEFT JOIN 
                zones z ON z.zone_id = o.zone_id
            LEFT JOIN 
                sales_area s ON s.id = o.sales_area_id
            LEFT JOIN 
                regional_offices r ON r.id = o.regional_office_id
            LEFT JOIN 
                districts d ON d.id = o.district_id
            WHERE  
                energy_companies.id = '${id}' AND o.is_deleted = '0'
                AND z.zone_id = '${zone_id}'
                AND r.id = '${regional_office_id}'
                AND s.id = '${sales_area_id}'  
                AND d.id IS NOT NULL
                AND d.district_name IS NOT NULL
        `;

        query = addCreatedByCondition(query, {
            table: "o",
            created_by: req.user.user_id,
            role: req.user.user_type, // Assuming the user type is passed in the request
        });

        // Execute the query
        const queryResult = await db.query(query);

        // Handle case where no data is found
        if (queryResult.length === 0) {
            return res.status(200).json({ status: false, message: "Data not found" });
        }

        // Filter out entries with null values
        const filteredResults = queryResult.filter((item) => item.district_id !== null && item.district_name !== null);

        // Return the filtered results
        return res.status(200).json({
            status: true,
            data: filteredResults,
        });
    } catch (error) {
        return next(error);
    }
};

const getOutletById = async (req, res, next) => {
    try {
        const id = req.params.id;
        // const selectQuery = `SELECT * FROM outlets WHERE id = '${id}'`
        const selectQuery = `SELECT outlets.id, outlets.energy_company_id, outlets.zone_id, outlets.regional_office_id, outlets.sales_area_id, outlets.district_id, outlets.outlet_unique_id, outlets.outlet_name, outlets.outlet_contact_person_name, outlets.outlet_contact_number, outlets.primary_number, outlets.secondary_number, outlets.primary_email, outlets.secondary_email, outlets.customer_code, outlets.outlet_category, outlets.location, outlets.address, outlets.outlet_ccnoms, outlets.outlet_ccnohsd, outlets.outlet_resv, outlets.outlet_longitude, outlets.outlet_lattitude, outlets.outlet_image, outlets.created_by, outlets.created_at, energy_companies.name as energy_company_name, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name, districts.district_name,  outlets.status, users.email AS user_email FROM outlets LEFT JOIN users ON users.outlet_id = outlets.id LEFT JOIN energy_companies ON energy_companies.id=outlets.energy_company_id INNER JOIN zones ON zones.zone_id=outlets.zone_id INNER JOIN regional_offices ON regional_offices.id=outlets.regional_office_id INNER JOIN sales_area ON sales_area.id=outlets.sales_area_id LEFT JOIN districts ON districts.id=outlets.district_id WHERE outlets.id = '${id}' AND outlets.is_deleted = '0'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const outletUserDetails = await getOutLetUserDetailsByOutletId(result[0].id);
                for (const row of result) {
                    row.email = outletUserDetails.email;
                    row.user_id = outletUserDetails.id;
                }
                res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const editOutlet = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM outlets WHERE id = '${id}' AND is_deleted = '0'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const outletUserDetails = await getOutLetUserDetailsByOutletId(result[0].id);
                for (const row of result) {
                    row.email = outletUserDetails.email;
                }

                res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result[0] });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

// const updateOutlet = async (req,res,next) => {

//     try
//     {
//         const id = req.body.id;

//         const {energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_conatct_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, outlet_unique_id, status, email, password, user_id} = req.body;

//         const {error, value} = outletFormValidation.validate(req.body);

//         if(error) return res.status(400).json({status: false, message: error})

//         const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//         var storePath = '';

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/outlet_images/' + imageName;
//             storePath = '/outlet_images/' + imageName;
//             image.mv(uploadPath, (err, response) => {

//                 if (err) return res.status(403).json({status: false, message: err});
//             })
//         }
//         else
//         {
//             storePath = req.body.image
//         }

//         const updateQuery = `UPDATE outlets SET energy_company_id = '${energy_company_id}', zone_id='${zone_id}', regional_office_id='${regional_id}', sales_area_id='${sales_area_id}', district_id='${district_id}', outlet_unique_id='${outlet_unique_id}', outlet_name='${outlet_name}', outlet_contact_person_name='${outlet_contact_person_name}', outlet_contact_number='${outlet_conatct_number}', primary_number='${primary_number}', secondary_number='${secondary_number}', primary_email='${primary_email}', secondary_email='${secondary_email}', customer_code='${customer_code}', outlet_category='${outlet_category}', location='${location}', address='${address}', outlet_ccnoms='${outlet_ccnoms}', outlet_ccnohsd='${outlet_ccnohsd}', outlet_resv='${outlet_resv}', outlet_longitude='${outlet_longitude}', outlet_lattitude='${outlet_lattitude}', updated_at='${updatedAt}', outlet_image='${storePath}', status='${status}' WHERE id = '${id}'`;

//         db.query(updateQuery, async(err, result) => {
//             if (err) return res.status(500).json({status: false, message: err});

//             if(result.affectedRows > process.env.VALUE_ZERO)
//             {
//                 // update outlet user details
//                 if(password != '')
//                 {
//                     const salt = bcrypt.genSaltSync(10);
//                     const hashPassword = await bcrypt.hash(password, salt);

//                     const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, password = ?, mobile = ?, address = ?, status = ?, image = ? WHERE id = ?`;
//                     const updateValues = [outlet_name, outlet_name, email, hashPassword, outlet_conatct_number, address, status, storePath, user_id];
//                     const loginQueryResult = await db.query(userUpdateQuery, updateValues);
//                 }
//                 else
//                 {
//                     const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, address = ?, status = ?, image = ?  WHERE id = ?`;
//                     const updateValues = [outlet_name, outlet_name, email, outlet_conatct_number, address, status, storePath, user_id];
//                     const loginQueryResult = await db.query(userUpdateQuery, updateValues);
//                 }

//                 res.status(200).json({status: true, message: "Outlet updated successfully"})
//             }
//             else
//             {
//                 return res.status(400).json({status: false, message: "Something went wrong, please try again"})
//             }
//         })
//     }
//     catch (error)
//     {
//         return res.status(400).json({status: false, message: error.message})
//     }
// }

const updateOutlet = async (req, res, next) => {
    try {
        const id = req.body.id;

        const {
            energy_company_id,
            zone_id,
            regional_id,
            sales_area_id,
            district_id,
            outlet_name,
            outlet_contact_person_name,
            outlet_contact_number,
            primary_number,
            secondary_number,
            primary_email,
            secondary_email,
            customer_code,
            outlet_category,
            location,
            address,
            outlet_ccnoms,
            outlet_ccnohsd,
            outlet_resv,
            outlet_longitude,
            outlet_lattitude,
            outlet_unique_id,
            status,
            email,
            password,
            user_id,
        } = req.body;
        // return
        const { error, value } = outletFormValidation.validate(req.body);

        if (error) return res.status(400).json({ status: false, message: error.details[0].message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        var storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/outlet_images/" + imageName;
            storePath = "/outlet_images/" + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err });
            });
        } else {
            storePath = req.body.image;
        }

        const updateQuery = `UPDATE outlets SET energy_company_id = '${energy_company_id}', zone_id='${zone_id}', regional_office_id='${regional_id}', sales_area_id='${sales_area_id}', district_id='${district_id}', outlet_unique_id='${outlet_unique_id}', outlet_name='${outlet_name}', outlet_contact_person_name='${outlet_contact_person_name}', outlet_contact_number='${outlet_contact_number}', primary_number='${primary_number}', secondary_number='${secondary_number}', primary_email='${primary_email}', secondary_email='${secondary_email}', customer_code='${customer_code}', outlet_category='${outlet_category}', location='${location}', address='${address}', outlet_ccnoms='${outlet_ccnoms}', outlet_ccnohsd='${outlet_ccnohsd}', outlet_resv='${outlet_resv}', outlet_longitude='${outlet_longitude}', outlet_lattitude='${outlet_lattitude}', updated_at='${updatedAt}', outlet_image='${storePath}', status='${status}' WHERE id = '${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                // update outlet user details
                if (password != "") {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);

                    const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, password = ?, mobile = ?, address = ?, status = ?, image = ? WHERE id = ?`;
                    const updateValues = [
                        outlet_name,
                        outlet_name,
                        email,
                        hashPassword,
                        outlet_contact_number,
                        address,
                        status,
                        storePath,
                        user_id,
                    ];
                    const loginQueryResult = await db.query(userUpdateQuery, updateValues);
                } else {
                    const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, address = ?, status = ?, image = ?  WHERE id = ?`;
                    const updateValues = [
                        outlet_name,
                        outlet_name,
                        email,
                        outlet_contact_number,
                        address,
                        status,
                        storePath,
                        user_id,
                    ];
                    const loginQueryResult = await db.query(userUpdateQuery, updateValues);
                }

                res.status(200).json({ status: true, message: "Outlet updated successfully" });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Something went wrong, please try again",
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const removeOutletById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateQuery = `UPDATE outlets SET is_deleted = '1' WHERE id = '${id}'`;

        db.query(updateQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Outlet deleted successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getOutletByDistrictId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const sale_area_id = req.query.sale_area_id;
        var selectQuery;
        if (id > 0) {
            selectQuery = `SELECT * FROM outlets WHERE district_id = '${id}' AND is_deleted = '0'`;
        } else if (sale_area_id > 0) {
            selectQuery = `SELECT * FROM outlets WHERE sales_area_id = '${sale_area_id}' AND is_deleted = '0'`;
        }

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getOutletBySalesId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT outlet_name FROM outlets WHERE sales_area_id = '${id}' AND district_id != 0 AND is_deleted = '0'`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getOutletByEnergyCompanyId = async (req, res, next) => {
    try {
        const ecId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: ecId });

        if (error) return res.status(403).status({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM outlets WHERE energy_company_id = ?`;
        const queryResult = await db.query(selectQuery, [ecId]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(403).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllOutletForDropdown = async (req, res, next) => {
    try {
        const query = `SELECT id, outlet_name FROM outlets WHERE is_deleted = '0'`;
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

const approveRejectOutletByStatus = async (req, res, next) => {
    try {
        // return
        const id = req.query.id;
        const status = req.query.status;

        const currentUserId = req.user.user_id;

        const selectQuery = `SELECT created_by FROM outlets WHERE id = ?`;
        const [outlet] = await db.query(selectQuery, [id]);

        if (outlet.created_by == currentUserId && req.user.user_type != process.env.SUPER_ADMIN_ROLE_ID) {
            return res.status(403).json({
                status: false,
                message: "You are not authorized to approve or reject this outlet",
            });
        }

        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE outlets SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Outlet approved successfully" : "Outlet rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid status",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addOutlet,
    getAllOutlet,
    getOutletById,
    editOutlet,
    updateOutlet,
    removeOutletById,
    getOutletByDistrictId,
    getOutletByEnergyCompanyId,
    getOutletBySalesId,
    getAllOutletForDropdown,
    approveRejectOutletByStatus,
    importOutlet,
    getZonesForOutlets,
    getRegionalOfficeOnZoneForOutlets,
    getSalesAreaOnRegionalForOutlets,
    getDistrictOnSalesAreaForOutlets,
};

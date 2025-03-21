var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, createItemMasterValidation, importItemMasterValidation } = require("../helpers/validation");
const { calculatePagination, getRecordWithWhereAndJoin } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const { parseInt } = require("lodash");
const { uploadFile, addCreatedByCondition, generateItemMasterId } = require("../helpers/commonHelper");
const xlsx = require("xlsx");
const path = require("path");

const createItemMaster = async (req, res, next) => {
    try {
        const {
            name,
            rates,
            hsncode,
            rucode,
            supplier_id,
            item_unique_id,
            description,
            unit_id,
            category,
            sub_category,
        } = req.body;
        // console.log('req.body: ', req.body);

        const { error } = createItemMasterValidation.validate(req.body);
        if (error)
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.details[0].message });

        // handle supplier id if not present
        let supp_id = supplier_id != "" ? supplier_id : null;

        const createdBy = req.user.user_id;
        let storePath = "";

        const conditions = [{ field: "name", operator: "=", value: name }];
        const existingItemMaster = await getRecordWithWhereAndJoin("item_masters", conditions);
        if (existingItemMaster.length > 0)
            return res.status(400).json({ status: false, message: `Item '${name}' already exists` });

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/item_masters/" + imageName;
            storePath = "/item_masters/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message });
            });
        }

        const item_types = [
            { id: 1, name: "fund" },
            { id: 2, name: "stock" },
        ];

        let category_id;

        item_types.forEach((type) => {
            if (type.name == category) {
                category_id = type.id;
            } else if (type.name == category) {
                category_id = type.id;
            }
        });

        let unique_id = item_unique_id || (await generateItemMasterId(category_id));

        const insertItemMaster = `
            INSERT INTO item_masters (name, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category, sub_category, status) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        if (rates && rates.length > 0) {
            const parse = JSON.parse(rates);

            // Validate if all rates are valid decimal numbers
            const invalidRate = parse.find((rate) => isNaN(rate.rate) || rate.rate <= 0);

            if (invalidRate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: `Invalid rate value for brand: ${invalidRate.brand}. Rate must be a decimal number and should be greater than 0`,
                });
            }
            const insertResult = await db.query(insertItemMaster, [
                name,
                storePath,
                createdBy,
                hsncode,
                rucode,
                supp_id,
                unique_id,
                description,
                unit_id,
                category,
                sub_category,
                "1",
            ]);
            if (insertResult.affectedRows > 0) {
                const itemId = insertResult.insertId;
                const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ?`;
                const rateValues = parse.map((rate) => [itemId, rate.brand_id, rate.brand, rate.rate]);

                const rateInsertResult = await db.query(rateInsertQuery, [rateValues]);

                if (rateInsertResult.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Item and rates created successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Error inserting rates" });
                }
            }
        } else {
            return res.status(200).json({ status: true, message: "Item created successfully, but no rates provided." });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllItemMasters = async (req, res, next) => {
    try {
        //pagination data
        const category = req.query.category;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const isDropdown = req.query.isDropdown || false;
        const status = req.query.status;

        //check logged user id
        const loggedUserType = req.user?.user_type || null;
        const loggedUserId = req.user?.user_id || null;

        let searchCondition = "";
        let whereCondition = "";

        if (category) {
            if (status) {
                // When both category and status are passed, and fund_stock_id should not be null
                whereCondition = `item_masters.category = '${category}' AND item_masters.status = '${status}' AND item_masters.fund_stock_id IS NOT NULL`;
            } else {
                // When category is passed and status is '1', and fund_stock_id should be null
                whereCondition = `item_masters.category = '${category}' AND item_masters.status = '1' AND item_masters.fund_stock_id IS NULL`;
            }
        }

        let search_value = "";

        if (searchData != null && searchData != "") {
            search_value = `item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
        }
        // if logged in user is SUPER ADMIN then show all item masters
        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            if (search_value) {
                searchCondition = search_value;
            }
        } else {
            // else show items created by logged in user
            if (search_value) {
                searchCondition = `${search_value} AND item_masters.created_by IN ('1', '${loggedUserId}') AND item_masters.is_deleted = 0 `;
            } else {
                searchCondition = `item_masters.created_by IN ('1', '${loggedUserId}')`;
            }
        }

        // Combine whereCondition and searchCondition
        let finalCondition = "";
        // console.log('whereCondition: ', whereCondition);
        if (whereCondition != "" && searchCondition != "") {
            finalCondition = `WHERE (${whereCondition} AND ${searchCondition}) AND item_masters.is_deleted = 0`;
        } else if (whereCondition != "") {
            finalCondition = `WHERE (${whereCondition}) AND item_masters.is_deleted = 0`;
        } else if (searchCondition != "") {
            finalCondition = `WHERE (${searchCondition}) AND item_masters.status = '1' AND item_masters.is_deleted = 0`;
        } else {
            finalCondition = `WHERE item_masters.is_deleted = 0 AND item_masters.status = '1'`;
        }
        // console.log('finalCondition: ', finalCondition);

        let selectQuery = `
            SELECT item_masters.*, suppliers.supplier_name, suppliers.supplier_code AS supplier_id, suppliers.upi_image AS supplier_image, units.name as unit_name, sc.name as sub_category
            FROM item_masters 
            LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id 
            LEFT JOIN units ON units.id = item_masters.unit_id
            LEFT JOIN sub_category sc ON sc.id = item_masters.sub_category
            ${finalCondition}
            ORDER BY item_masters.id DESC 
        `;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "item_masters",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        // console.log('selectQuery: ', selectQuery);

        if (!isDropdown) {
            selectQuery += ` LIMIT ${pageFirstResult} , ${pageSize} `;
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString); // This should ideally be a separate query to count total results

        // console.log('selectQuery: ', selectQuery);
        const result = await db.query(selectQuery);

        if (result.length > 0) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            const items = result.reduce((acc, row) => {
                const { item_rates_id, brand, rate, ...itemData } = row;

                // Find the index of the item in the array
                let existingItem = acc.find((item) => item.id === itemData.id);

                if (!existingItem) {
                    // If item doesn't exist, add it to the array with an empty 'rates' array
                    existingItem = { ...itemData, rates: [] };
                    acc.push(existingItem);
                }

                // If item_rates_id exists, push the rate details to 'rates'
                if (item_rates_id) {
                    existingItem.rates.push({ item_rates_id, brand, rate });
                }

                return acc;
            }, []);

            // console.log('items: ', items[0]);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: Object.values(items),
                ...(isDropdown ? {} : { pageDetails }),
            });
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
    } catch (error) {
        return next(error);
    }
};

const getSingleItemMaster = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const selectQuery = `
        SELECT item_masters.*, 
            suppliers.supplier_name, 
            units.name as unit_name, 
            item_rates.id as item_rates_id,
            item_rates.brand,
            item_rates.rate,
            sc.name as sub_category
        FROM item_masters
        LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
        LEFT JOIN units ON units.id = item_masters.unit_id
        LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
        LEFT JOIN sub_category sc ON sc.id = item_masters.sub_category
        WHERE item_masters.id = ? AND item_masters.is_deleted = 0
    `;

        // Execute the query
        const results = await db.query(selectQuery, [id]);

        // Process results to group rates by item
        const items = results.reduce((acc, row) => {
            const { item_rates_id, brand, rate, ...itemData } = row;

            if (!acc[itemData.id]) {
                acc[itemData.id] = { ...itemData, rates: [] };
            }

            if (item_rates_id) {
                acc[itemData.id].rates.push({ item_rates_id, brand, rate });
            }

            return acc;
        }, {});

        if (Object.keys(items).length > 0) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items)[0] });
        } else {
            res.status(404).json({ status: false, message: "Item not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateItemMaster = async (req, res, next) => {
    try {
        const { name, image, rates, id, rucode, hsncode, supplier_id, description, unit_id, category } = req.body;

        // Validate item ID
        const { idError } = checkPositiveInteger.validate({ id: id });
        if (idError) return res.status(403).json({ status: false, message: error.message });

        const { error } = createItemMasterValidation.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        // handle supplier_id if it's null
        let supp_id = supplier_id != "" ? supplier_id : null;

        // Check if item exists
        const selectQuery = `SELECT * FROM item_masters WHERE id = ?`;
        const [existingItem] = await db.query(selectQuery, [id]);

        if (!existingItem || existingItem.length === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        let storePath = existingItem.image || null;

        // Handle image upload
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageName = Date.now() + "_" + image.name;
            const uploadPath = process.cwd() + "/public/item_masters/" + imageName;
            storePath = "/item_masters/" + imageName;

            // Upload the new image
            await new Promise((resolve, reject) => {
                image.mv(uploadPath, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        let parsedRates = rates;

        if (typeof rates === "string") {
            try {
                parsedRates = JSON.parse(rates);
            } catch (error) {
                return next(error);
            }
        }

        // Update item_masters
        const updateQuery = `
            UPDATE item_masters 
            SET name = ?, 
                image = ?, 
                updated_at = ?, 
                rucode = ?, 
                hsncode = ?, 
                supplier_id = ?, 
                description = ?, 
                unit_id = ?, 
                category = ? 
            WHERE id = ?
        `;
        await db.query(updateQuery, [
            name,
            storePath,
            updatedAt,
            rucode,
            hsncode,
            supp_id,
            description,
            unit_id,
            category,
            id,
        ]);

        if (parsedRates && Array.isArray(parsedRates)) {
            // Delete existing rates for this item
            const deleteRatesQuery = `DELETE FROM item_rates WHERE item_id = ?`;
            await db.query(deleteRatesQuery, [id]);

            // Insert new rates
            const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ?`;
            const rateValues = parsedRates.map((rate) => [id, rate.brand_id, rate.brand, rate.rate]);
            await db.query(rateInsertQuery, [rateValues]);
        }
        res.status(200).json({ status: true, message: "Item and rates updated successfully" });
    } catch (error) {
        return next(error);
    }
};

// const deleteItemMaster = async (req,res,next) => {

//     try {
//         const id = req.params.id
//         const { error } = checkPositiveInteger.validate({ id: id })
//         if (error) return res.status(400).json({ status: false, message: error.message })

//         const deleteQuery = `DELETE FROM item_masters WHERE id = '${id}'`

//         db.query(deleteQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.affectedRows > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: "Item deleted successfully" })
//             }
//             else {
//                 return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message })
//     }
// }

const deleteItemMaster = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const deleteQuery = `UPDATE item_masters SET is_deleted = 1 WHERE id = '${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Item deleted successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllItemMastersForDropdown = async (req, res, next) => {
    try {
        //pagination data
        const category = req.query.category;

        let whereCondition = "";

        if (category) {
            whereCondition = `WHERE item_masters.category = '${category}' AND item_masters.is_deleted = 0 AND item_masters.status = '1'`;
        }

        // Combine whereCondition and searchCondition

        const selectQuery = `
            SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name, item_rates.id as item_rates_id, item_rates.brand, item_rates.rate, sc.name as sub_category 
            FROM item_masters 
            LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id 
            LEFT JOIN units ON units.id = item_masters.unit_id 
            LEFT JOIN item_rates ON item_masters.id = item_rates.item_id 
            LEFT JOIN sub_category sc ON sc.id = item_masters.sub_category
            ${whereCondition} 
            ORDER BY item_masters.id DESC;
        `;

        // console.log("selectQuery: ", selectQuery);
        db.query(selectQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ status: false, message: err.message });
            }

            const items = results.reduce((acc, row) => {
                const { item_rates_id, brand, rate, ...itemData } = row;

                if (!acc[itemData.id]) {
                    acc[itemData.id] = { ...itemData, rates: [] };
                }

                if (item_rates_id) {
                    acc[itemData.id].rates.push({ item_rates_id, brand, rate });
                }

                return acc;
            }, {});

            res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items) });
        });
    } catch (error) {
        return next(error);
    }
};

const addItemFromStockRequest = async (req, res, next) => {
    try {
        const { name, rate, qty, hsncode, rucode, supplier_id, item_unique_id, description } = req.body;
        const createdBy = req.user.user_id;
        var storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/item_masters/" + imageName;
            storePath = "/item_masters/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message });
            });
        }
        const insertQuery = `INSERT INTO item_masters (name, rate, qty, image, created_by, hsncode, rucode, supplier_id, unique_id, status, unique_id, description) VALUES('${name}', '${rate}', '${qty}', '${storePath}', '${createdBy}', '${hsncode}', '${rucode}', '${supplier_id}', '0', '${item_unique_id}', '${item_unique_id}', 'description')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Item added successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const checkItemUniqueIdExist = async (req, res, next) => {
    try {
        const { item_unique_id } = req.body;
        const queryResult = await db.query(`SELECT unique_id FROM item_masters WHERE unique_id = ?`, [item_unique_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "item unique id already exists",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "valid item unique id",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const addItemFromFundRequest = async (req, res, next) => {
    try {
        const { name, rate, hsncode, rucode, supplier_id, item_unique_id, description, unit_id } = req.body;
        const createdBy = req.user.user_id;
        var storePath = "";

        // const checkHsncode = await getHsncode(name)
        // let hsncodeToInsert = checkHsncode.length > process.env.VALUE_ZERO ? checkHsncode : hsncode;

        if (req.files != null) {
            const image = req.files.image;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/item_masters/" + imageName;
            storePath = "/item_masters/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
            });
        }
        // const unique_id = req.body.unique_id;
        let unique_ids;
        if (item_unique_id != null && item_unique_id !== "") {
            // Change || to &&
            unique_ids = item_unique_id;
        } else if (item_unique_id === "") {
            // Use strict equality here
            const generateAutomatically = await generateItemMasterId();
            unique_ids = generateAutomatically;
        }
        const insertQuery = `INSERT INTO item_masters (name, rate, image, created_by, hsncode, rucode, supplier_id, unique_id, status, description, unit_id) VALUES('${name}', '${qty}', '${storePath}', '${createdBy}', '${hsncode}', '${rucode}', '${supplier_id}', '${unique_ids}', '0', '${description}','${unit_id}' )`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(StatusCodes.OK).json({ status: true, message: "Item added successfully" });
            } else {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const approvedAddItemFromFundRequest = async (req, res, next) => {
    try {
        const { id } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });

        const updateQuery = await db.query(`UPDATE item_masters SET status = 1 WHERE id='${id}'`);

        if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Item has been approved." });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error, Item not approved." });
        }
    } catch (error) {
        return next(error);
    }
};
//contractor panel Item masters

// const byNameToHsnCode = async (req,res,next) => {
//     try {
//         const name = req.body.name;
//         const searchData = req.body.name || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchColumns = ['name'];
//         const searchConditions = [];

//         if (searchData != null && searchData != '') {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//         }
//         // Use parameterized queries to prevent SQL injection
//         const selectQuery = await db.query('SELECT * FROM item_masters WHERE name = ?', [name]);

//         if (selectQuery.length > 0) {
//             // Extracting data from the first row of the result
//             const item_id = selectQuery[0].id;
//             const item_name = selectQuery[0].name;
//             const hsncode = selectQuery[0].hsncode;

//             // Returning the fetched data
//             return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: { item_id, item_name, hsncode } });
//         } else {
//             // No data found
//             return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
//         }
//     } catch (error) {next(error)
//         // Error handling
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const byNameToHsnCode = async (req, res, next) => {
    try {
        let searchData = "";
        let searchConditions = [];
        let query;

        if (req.body.name || req.query.name) {
            searchData = req.body.name || req.query.name;
            searchConditions.push("name LIKE '%" + searchData + "%'");
            query = "SELECT * FROM item_masters WHERE " + searchConditions.join(" OR ");
        } else {
            query = "SELECT * FROM item_masters";
        }

        const result = await db.query(query);

        if (result.length > 0) {
            if (query === "SELECT * FROM item_masters") {
                // Return all item details
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Data fetched successfully.", data: result });
            } else {
                // Return only details of the first item
                const item_id = result[0].id;
                const item_name = result[0].name;
                const hsncode = result[0].hsncode;
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Data fetched successfully.",
                    data: { item_id, item_name, hsncode },
                });
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
        }
    } catch (error) {
        return next(error);
    }
};

async function getHsncode(name) {
    try {
        const selectQuery = await db.query(`select * from item_masters where name= '${name}'`);
        if (selectQuery.length > process.env.VALUE_ZERO) {
            return selectQuery[0].hsncode;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

const getAllItemsBySupplierId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        var selectQuery = `SELECT * FROM item_masters WHERE supplier_id = '${id}' AND item_type = 1 AND status = '1'  ORDER BY id DESC`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                for (const row of result) {
                    row.rate = parseInt(row.rate);
                    row.qty = parseInt(row.qty);
                }
                res.status(200).json({ status: true, message: "Fetched successfully", data: result });
            } else {
                return res.status(500).json({ status: false, message: "data not found" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

const approveOrRejectItems = async (req, res, next) => {
    try {
        const id = req.query.id;
        const status = req.query.status;
        const category = req.query.category;

        // Check if status is either '2' or '3'
        if (status === "1" || status === "2") {
            const updateQuery = `UPDATE item_masters SET status = ? WHERE id = ? AND category = ?`;

            await db.query(updateQuery, [status, id, category]);

            const message = status === "1" ? "Item approved successfully" : "Item rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: "Invalid status" });
        }
    } catch (error) {
        return next(error);
    }
};

/** get all item_master based on status */
const getAllItemMaster = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || "";
        var search_value = "";

        //check logged user id
        const loggedUserType = req.user.user_type;
        const loggedUserId = req.user.user_id;
        let searchCondition;

        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            if (searchData != null && searchData != "") {
                search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
            }
            searchCondition = "";
        } else {
            if (searchData != null && searchData != "") {
                search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
            }
            searchCondition = `WHERE item_masters.created_by = '${loggedUserId}'`;
        }
        var selectQuery = `SELECT item_masters.*, suppliers.supplier_name FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id where item_masters.status = '${status}' ${search_value} ORDER BY item_masters.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                res.status(200).json({
                    status: true,
                    message: "Fetched successfully",
                    data: result,
                    pageDetails: pageDetails,
                });
            } else {
                return res.status(500).json({ status: false, message: "data not found" });
            }
        });
    } catch (error) {
        return next(error);
        return res.status(500).json({ status: true, message: error.message });
    }
};

// const getItemPriceByBrand = async (req,res,next) => {
//     try {
//         const { category, item } = req.query;

//         // Initialize the where condition
//         let whereCondition = '';
//         let filterCondition = '';

//         if (category) {
//             filterCondition += `item_masters.category = '${category}'`;
//         }

//         if (item) {
//             if (filterCondition) filterCondition += ' AND ';
//             filterCondition += `item_masters.name LIKE '%${item}%'`;
//         }

//         if (filterCondition) {
//             whereCondition = `WHERE ${filterCondition} AND item_masters.is_deleted = 0`;
//         } else {
//             whereCondition = `WHERE item_masters.is_deleted = 0`;
//         }

//         // Query to get the last three lowest prices for each item
//         const selectQuery = `
//             WITH RankedPrices AS (
//                 SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
//                        ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
//                 FROM item_masters
//                 LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
//                 ${whereCondition}
//             )
//             SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name,
//                    rp.brand, rp.rate
//             FROM RankedPrices rp
//             JOIN item_masters ON item_masters.id = rp.id
//             LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
//             LEFT JOIN units ON units.id = item_masters.unit_id
//             WHERE rp.rank <= 3
//             ORDER BY item_masters.id DESC;
//         `;

//         console.log("selectQuery", selectQuery);

//         db.query(selectQuery, (err, results) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             const items = results.reduce((acc, row) => {
//                 const { brand, rate, ...itemData } = row;

//                 if (!acc[itemData.id]) {
//                     acc[itemData.id] = { ...itemData, rates: [] };
//                 }

//                 if (brand) {
//                     acc[itemData.id].rates.push({ brand, rate });
//                 }

//                 return acc;
//             }, {});

//             res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items) });
//         });

//     } catch (error) {next(error)
//         return res.status(500).json({ status: true, message: error.message });
//     }
// };

// const getItemPriceByBrand = async (req,res,next) => {
//     try {
//         const { category, itemName } = req.query;

//         // Initialize the where condition
//         let whereCondition = '';

//         if (category) {
//             whereCondition += `item_masters.category = '${category}' AND item_masters.is_deleted = 0`;
//         }

//         if (itemName) {
//             if (whereCondition) whereCondition += ' AND ';
//             whereCondition += `item_masters.name LIKE '%${itemName}%'`;
//         }

//         if (whereCondition) {
//             whereCondition = `WHERE ${whereCondition}`;
//         } else {
//             whereCondition = `WHERE item_masters.is_deleted = 0`;
//         }

//         // Query to get the last three lowest prices for each item
//         const selectQuery = `
//             WITH RankedPrices AS (
//                 SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
//                        ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
//                 FROM item_masters
//                 LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
//                 ${whereCondition}
//             )
//             SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name,
//                    rp.brand, rp.rate
//             FROM RankedPrices rp
//             JOIN item_masters ON item_masters.id = rp.id
//             LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
//             LEFT JOIN units ON units.id = item_masters.unit_id
//             WHERE rp.rank <= 3
//             ORDER BY item_masters.id DESC;
//         `;

//         console.log("selectQuery", selectQuery);

//         db.query(selectQuery, (err, results) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             const items = results.map(row => {
//                 const { id, name, qty, image, hsncode, rucode, unique_id, unit_id, item_type, supplier_id, status, category, description, created_by, created_at, updated_at, is_deleted, supplier_name, unit_name, brand, rate } = row;

//                 return {
//                     id,
//                     name,
//                     qty,
//                     image,
//                     hsncode,
//                     rucode,
//                     unique_id,
//                     unit_id,
//                     item_type,
//                     supplier_id,
//                     status,
//                     category,
//                     description,
//                     created_by,
//                     created_at,
//                     updated_at,
//                     is_deleted,
//                     supplier_name,
//                     unit_name,
//                     brand,
//                     rate
//                 };
//             });

//             res.status(200).json({ status: true, message: "Fetched successfully", data: items });
//         });

//     } catch (error) {next(error)
//         return res.status(500).json({ status: true, message: error.message });
//     }
// };

// item price depends upon category like fund or stocks

const getItemPriceByBrand = async (req, res, next) => {
    try {
        const { category, itemName } = req.query;

        // Initialize the where condition
        let whereCondition = "";

        if (category) {
            whereCondition += `item_masters.category = '${category}' AND item_masters.is_deleted = 0`;
        }

        if (itemName) {
            if (whereCondition) whereCondition += " AND ";
            whereCondition += `item_masters.name LIKE '%${itemName}%'`;
        }

        if (whereCondition) {
            whereCondition = `WHERE ${whereCondition}`;
        } else {
            whereCondition = `WHERE item_masters.is_deleted = 0`;
        }

        // Query to get the last three lowest prices for each item
        // const selectQuery = `
        //     WITH RankedPrices AS (
        //         SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
        //                ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
        //         FROM item_masters
        //         LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
        //         ${whereCondition}
        //     )
        //     SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name,
        //            rp.brand, rp.rate
        //     FROM RankedPrices rp
        //     JOIN item_masters ON item_masters.id = rp.id
        //     LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
        //     LEFT JOIN units ON units.id = item_masters.unit_id
        //     WHERE rp.rank <= 3
        //     ORDER BY rp.rate ASC
        //     LIMIT 3;
        // `;

        // const selectQuery = `
        //         SELECT im.*, s.supplier_name, u.name AS unit_name, ir.brand, ir.rate
        //         FROM (
        //             SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
        //                 ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) AS rank
        //             FROM item_masters
        //             LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
        //             ${whereCondition}
        //         ) AS ir
        //         JOIN item_masters im ON im.id = ir.id
        //         LEFT JOIN suppliers s ON s.id = im.supplier_id
        //         LEFT JOIN units u ON u.id = im.unit_id
        //         WHERE ir.rank <= 3
        //         ORDER BY ir.rate ASC
        //         LIMIT 3;
        //     `;
        const selectQuery = `
                SELECT im.*, s.supplier_name, u.name AS unit_name, ir.brand, ir.rate
                FROM (
                    SELECT 
                        item_masters.id, 
                        item_masters.name, 
                        item_rates.brand, 
                        item_rates.rate, 
                        @row_number := IF(@prev_item_id = item_masters.id, @row_number + 1, 1) AS row_number,
                        @prev_item_id := item_masters.id
                    FROM 
                        item_masters
                    LEFT JOIN 
                        item_rates 
                    ON 
                        item_masters.id = item_rates.item_id
                    CROSS JOIN 
                        (SELECT @row_number := 0, @prev_item_id := NULL) AS vars
                    ${whereCondition}
                    ORDER BY 
                        item_masters.id, item_rates.rate ASC
                ) AS ir
                JOIN item_masters im ON im.id = ir.id
                LEFT JOIN suppliers s ON s.id = im.supplier_id
                LEFT JOIN units u ON u.id = im.unit_id
                WHERE ir.row_number <= 3
                ORDER BY ir.rate ASC
                LIMIT 3;
            `;

        // console.log('selectQuery: ', selectQuery);
        db.query(selectQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ status: false, message: err.message });
            }

            const items = results.map((row) => {
                const {
                    id,
                    name,
                    qty,
                    image,
                    hsncode,
                    rucode,
                    unique_id,
                    unit_id,
                    item_type,
                    supplier_id,
                    status,
                    category,
                    description,
                    created_by,
                    created_at,
                    updated_at,
                    is_deleted,
                    supplier_name,
                    unit_name,
                    brand,
                    rate,
                } = row;

                return {
                    id,
                    name,
                    qty,
                    image,
                    hsncode,
                    rucode,
                    unique_id,
                    unit_id,
                    item_type,
                    supplier_id,
                    status,
                    category,
                    description,
                    created_by,
                    created_at,
                    updated_at,
                    is_deleted,
                    supplier_name,
                    unit_name,
                    brand,
                    rate,
                };
            });

            res.status(200).json({ status: true, message: "Fetched successfully", data: items });
        });
    } catch (error) {
        return next(error);
    }
};

const importItemMaster = async (req, res, next) => {
    try {
        let filePath = "";
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel File is required",
            });
        }
        
        filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);
        // return console.log('completePath: ', completePath);
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        // console.log('rows: ', rows);

        const errorMessage = [];
        const { unit_id, sub_category, supplier_id } = req.body;

        // check existing items first before inserting
        const itemNameSet = new Set();
        if (Array.isArray(rows) && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                let {
                    name = "",
                    rates,
                    hsncode,
                    rucode,
                    item_unique_id,
                    description,
                    category,
                } = row;

                const { error } = importItemMasterValidation.validate(row);
                if(error) {
                    return res.status(400).json({
                        status: false,
                        message: `at row ${i + 1} ${error.message}`,
                    });
                }

                if (name && itemNameSet.has(name)) {
                    return res.status(400).json({
                        status: false,
                        message: `at row ${i + 1} duplicate Item ${name} found in provided rows`,
                    });
                }

                // Add to sets for tracking
                if (name) itemNameSet.add(name);

                condition = [
                    { field: "name", operator: "=", value: name },
                    { field: "is_deleted", operator: "=", value: 0 },
                ];

                const existingItem = await getRecordWithWhereAndJoin("item_masters", condition);
                if (existingItem.length > 0) {
                    throw new Error(`Item at row ${i + 1} already exists in system`);
                }
            }
        }

        if (Array.isArray(rows) && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                let {
                    name = "",
                    rates,
                    hsncode,
                    rucode,
                    item_unique_id,
                    description,
                    category,
                } = row;
                // console.log("supplier_id: ", supplier_id);

                let type;
                if (category == "fund" || category == "FUND") {
                    type = 1;
                } else if (category == "stock" || category == "STOCK") {
                    type = 2;
                } else {
                    throw new Error("please provide valid item master category");
                }

                item_unique_id = item_unique_id || (await generateItemMasterId(type));
                const createdBy = req.user.user_id;
                const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

                // Validate rates if present
                if (rates && rates !== "" && !/[a-zA-Z]/.test(rates)) {
                    const parsedRates = JSON.parse(rates);
                    // console.log("parsedRates: ", parsedRates);
                    // const invalidRate = parsedRates.find((rate) => isNaN(rate.rate) || rate.rate <= 0);
                    const invalidRate = isNaN(parsedRates) || parsedRates <= 0;
                    if (invalidRate) {
                        errorMessage.push(`At row ${i + 1}, invalid rate for item: ${name}`);
                        continue;
                    }
                } else {
                    errorMessage.push(`At row ${i + 1}, invalid rate for item: ${name}`);
                    continue;
                }

                let insertItemMaster = `
                    INSERT INTO item_masters (name, rate, image, created_by, hsncode, rucode, unique_id, description, unit_id, category, sub_category, status, created_at)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                let queryVales = [
                    name,
                    rates,
                    "",
                    createdBy,
                    hsncode,
                    rucode,
                    item_unique_id,
                    description,
                    unit_id,
                    category,
                    sub_category,
                    "1",
                    createdAt,
                ];
                // if loggedIn user is not Super Admin
                if (req.user.user_type != 1) {
                    insertItemMaster = `
                        INSERT INTO item_masters (name, rate, image, created_by, hsncode, rucode, unique_id, description, unit_id, category, sub_category, status, created_at, supplier_id)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    queryVales.push(supplier_id);
                }
                console.log('queryVales: ', queryVales);
                const insertResult = await db.query(insertItemMaster, queryVales);

                if (insertResult.affectedRows > 0) {
                    console.log("Inserted item:", name);
                } else {
                    errorMessage.push(`At row ${i + 1}, error inserting item master`);
                }
            }

            if (rows.length === errorMessage.length) {
                return res.status(400).json({
                    status: false,
                    message: "Data not imported",
                    errorMessage,
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Data imported successfully",
                    errorMessage,
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid data or File not uploaded",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createItemMaster,
    getAllItemMasters,
    getSingleItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getAllItemMastersForDropdown,
    addItemFromStockRequest,
    checkItemUniqueIdExist,
    addItemFromFundRequest,
    approvedAddItemFromFundRequest,
    getHsncode,
    byNameToHsnCode,
    getAllItemsBySupplierId,
    approveOrRejectItems,
    getItemPriceByBrand,
    importItemMaster,
};

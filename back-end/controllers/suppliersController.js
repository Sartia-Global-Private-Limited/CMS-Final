require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { supplierSchema, checkPositiveInteger, supplierImportSchema } = require("../helpers/validation");
const { calculatePagination, getRecord, getRecordWithWhereAndJoin } = require("../helpers/general");
const {
    getSupplierAddresses,
    convertBase64Image,
    generateSupplierCode,
    supplier_status,
    addCreatedByCondition,
    generateClientVendorId,
    uploadFile,
} = require("../helpers/commonHelper");
const xlsx = require("xlsx");
const path = require("path");
var moment = require("moment");
const fs = require("fs");

const createSuppliers = async (req, res, next) => {
    try {
        req.body.address = JSON.parse(req.body.address);
        const { error } = supplierSchema.validate(req.body);

        // console.log("req.body: ", req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const {
            supplier_name,
            owner_name,
            cashier_name,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            address,
        } = req.body;

        const conditions = [
            { field: "supplier_name", operator: "=", value: supplier_name },
            { field: "owner_name", operator: "=", value: owner_name },
            { field: "cashier_name", operator: "=", value: cashier_name },
            { field: "gst_number", operator: "=", value: req.body.address[0].gst_number },
        ];
        const joins = [
            { type: "LEFT", table: "supplier_addresses", on: "suppliers.id = supplier_addresses.supplier_id" },
        ];
        const existingSupplierCode = await getRecordWithWhereAndJoin("suppliers", conditions, joins);
        // console.log('existingSupplierCode: ', existingSupplierCode);

        // if(existingSupplierCode.length > process.env.VALUE_ZERO) {
        //     return res.status(StatusCodes.OK).json({ status: false, message: "Supplier with this details already exists" });
        // }

        if (existingSupplierCode.length > process.env.VALUE_ZERO) {
            // Identify matching fields
            const matchingFields = [];
            for (const condition of conditions) {
                const field = condition.field;
                const value = condition.value;

                // Check if the field matches in any of the existing records
                if (existingSupplierCode.some((record) => record[field] === value)) {
                    matchingFields.push(field);
                }
            }

            return res.status(StatusCodes.OK).json({
                status: false,
                message: `Supplier with these matching fields: ${matchingFields.join(", ")} already exists`,
            });
        }

        let storePath;
        if (req.body.upi_image) {
            let base64File = req.body.upi_image.replace(/^data:image\/\w+;base64,/, "");
            storePath = await convertBase64Image(base64File, "./public/supplier_upi_images/", "/supplier_upi_images/");
        }

        const type = 4; // for supplier format no. in Master Data

        // get supplier code from master data format
        const supplier_code = await generateClientVendorId(type, req.user.user_id);

        const supplierData = {
            supplier_name,
            owner_name,
            cashier_name,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            upi_image: storePath,
            created_by: req.user.user_id,
            supplier_code,
        };

        // check gst mark default settings
        if (address.length > process.env.VALUE_ZERO) {
            // Check if at least one "is_default" value is greater than or equal to 1
            const defaultCount = address.filter((address) => parseInt(address.is_default) >= 1).length;

            if (defaultCount < 1) {
                return res.status(StatusCodes.OK).json({ status: false, message: "No address is set as default" });
            }
        }

        const result = await db.query("INSERT INTO suppliers SET ?", [supplierData]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // insert addresses into
            if (address.length > process.env.VALUE_ZERO) {
                for (let i = 0; i < address.length; i++) {
                    const addressData = address[i];
                    addressData.supplier_id = result.insertId;
                    // addressData.state =  addressData.state.label;
                    const addressQuery = await db.query("INSERT INTO supplier_addresses SET ?", [addressData]);
                    if (addressQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log(`Address for GSTIN ${addressData.gst_number} inserted successfully`);
                    }
                }
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Supplier created successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error creating a new company" });
        }
    } catch (error) {
        return next(error);
    }
};

// const getSuppliers = async (req, res, next) => {
//     try {
//         const hasDropdown = req.query.isDropdown === "true";
//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || "";
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         const searchColumns = [
//             "suppliers.supplier_name",
//             "suppliers.owner_name",
//             "suppliers.cashier_name",
//             "suppliers.supplier_code",
//             "banks.bank_name",
//             "suppliers.account_holder_name",
//             "suppliers.account_number",
//             "suppliers.branch_name",
//             "suppliers.ifsc_code",
//             "suppliers.upi_id",
//         ];

//         const status = req.query.status || "";
//         let searchConditions = [];
//         let conditionString = "";
//         let whereCondition = "";

//         if (status) {
//             whereCondition = `WHERE suppliers.status = ${status}`;
//         } else {
//             whereCondition = `WHERE 1=1`;
//         }

//         if (searchData != null && searchData != "") {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//             conditionString = " AND (" + searchConditions.join(" OR ") + ")";
//         }

//         let query = `
//             SELECT suppliers.*, banks.bank_name 
//             FROM suppliers 
//             LEFT JOIN banks On banks.id = suppliers.bank_id 
//             ${whereCondition} ${conditionString}
//             ORDER BY suppliers.id DESC`;

//         if (!hasDropdown) {
//             query += ` LIMIT ${pageFirstResult}, ${pageSize}`;
//         }

//         let suppliers;

//         query = addCreatedByCondition(query, {
//             table: "suppliers",
//             created_by: req.user.user_id,
//             role: req.user.user_type,
//         });

//         if (hasDropdown) {
//             whereCondition = `WHERE suppliers.status = '2'`;
//             query = `
//             SELECT suppliers.id, suppliers.supplier_name 
//             FROM suppliers 
//             ${whereCondition}
//             ORDER BY suppliers.supplier_name ASC`;

//             query = addCreatedByCondition(query, {
//                 table: "suppliers",
//                 created_by: req.user.user_id,
//                 role: req.user.user_type,
//             });

//             // console.log('query: ', query);
//             suppliers = await db.query(query);

//             if (suppliers.length > 0) {
//                 const finalData = suppliers.map((row) => ({
//                     id: row.id,
//                     supplier_name: row.supplier_name,
//                 }));

//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetched successfully",
//                     data: finalData,
//                 });
//             } else {
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         } else {
//             suppliers = await db.query(query);
//             const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
//             const totalResult = await db.query(modifiedQueryString);

//             if (suppliers.length > 0) {
//                 const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//                 const finalData = await Promise.all(
//                     suppliers.map(async (row) => {
//                         const getSupplierAddressesData = await getSupplierAddresses(row.id);
//                         return {
//                             id: row.id,
//                             supplier_name: row.supplier_name,
//                             owner_name: row.owner_name,
//                             cashier_name: row.cashier_name,
//                             supplier_code: row.supplier_code,
//                             bank_id: row.bank_id,
//                             bank_name: row.bank_name,
//                             account_holder_name: row.account_holder_name,
//                             account_number: row.account_number,
//                             branch_name: row.branch_name,
//                             ifsc_code: row.ifsc_code,
//                             status: supplier_status[row.status],
//                             upi_id: row.upi_id,
//                             supplier_addresses: getSupplierAddressesData,
//                         };
//                     })
//                 );

//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetched successfully",
//                     data: finalData,
//                     pageDetails: pageDetails,
//                 });
//             } else {
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         }
//     } catch (error) {
//         return next(error);
//     }
// };


// const getSuppliers = async (req, res, next) => {
//     try {
//         const hasDropdown = req.query.isDropdown === "true";
//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || "";
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         const isTransactions = req.query?.isTransactions || false;

//         // Search columns for full mode (includes bank field)
//         const fullSearchColumns = [
//             "suppliers.supplier_name",
//             "suppliers.owner_name",
//             "suppliers.cashier_name",
//             "suppliers.supplier_code",
//             "banks.bank_name",
//             "suppliers.account_holder_name",
//             "suppliers.account_number",
//             "suppliers.branch_name",
//             "suppliers.ifsc_code",
//             "suppliers.upi_id",
//         ];

//         // Search columns for dropdown mode (exclude bank field)
//         const dropdownSearchColumns = [
//             "suppliers.supplier_name",
//             "suppliers.owner_name",
//             "suppliers.cashier_name",
//             "suppliers.supplier_code",
//             "suppliers.account_holder_name",
//             "suppliers.account_number",
//             "suppliers.branch_name",
//             "suppliers.ifsc_code",
//             "suppliers.upi_id",
//         ];

//         const status = req.query.status || "";
//         let searchConditions = [];
//         let conditionString = "";
//         let whereCondition = "";

//         if (status) {
//             whereCondition = `WHERE suppliers.status = ${status}`;
//         } else {
//             whereCondition = `WHERE 1=1`;
//         }

//         // Build condition string based on mode and search term
//         if (searchData != null && searchData !== "") {
//             const columns = hasDropdown ? dropdownSearchColumns : fullSearchColumns;
//             columns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//             conditionString = " AND (" + searchConditions.join(" OR ") + ")";
//         }

//         let query = "";
//         let suppliers;

//         if (hasDropdown) {
//             // Dropdown Mode: Return only id and supplier_name
//             query = `
//                 SELECT suppliers.id, suppliers.supplier_name 
//                 FROM suppliers 
//                 ${whereCondition} ${conditionString}
//                 ORDER BY suppliers.supplier_name ASC`;
//             query = addCreatedByCondition(query, {
//                 table: "suppliers",
//                 created_by: req.user.user_id,
//                 role: req.user.user_type,
//             });
//             suppliers = await db.query(query);

//             // For each supplier, fetch its transactions (without applying searchData on transactions)
//             const finalData = await Promise.all(
//                 suppliers.map(async (row) => {
//                     const txnQuery = `
//                         SELECT id, bill_number, SUBSTRING_INDEX(bill_date, 'T', 1) AS bill_date, total_transfer_amount
//                         FROM stock_requests
//                         WHERE supplier_id = '${row.id}'
//                           AND bill_number IS NOT NULL
//                           AND total_transfer_amount IS NOT NULL
//                         ORDER BY id`;
//                     const transactions = await db.query(txnQuery);
//                     return {
//                         id: row.id,
//                         supplier_name: row.supplier_name,
//                         transactions: transactions,
//                     };
//                 })
//             );

//             if (finalData.length > 0) {
//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetched successfully",
//                     data: finalData,
//                 });
//             } else {
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         } else {
//             // Full Mode: Return detailed supplier information with pagination
//             query = `
//                 SELECT suppliers.*, banks.bank_name 
//                 FROM suppliers 
//                 LEFT JOIN banks On banks.id = suppliers.bank_id 
//                 ${whereCondition} ${conditionString}
//                 ORDER BY suppliers.id DESC`;
//             query += ` LIMIT ${pageFirstResult}, ${pageSize}`;

//             query = addCreatedByCondition(query, {
//                 table: "suppliers",
//                 created_by: req.user.user_id,
//                 role: req.user.user_type,
//             });

//             suppliers = await db.query(query);
//             const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
//             const totalResult = await db.query(modifiedQueryString);

//             if (suppliers.length > 0) {
//                 const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//                 const finalData = await Promise.all(
//                     suppliers.map(async (row) => {
//                         // Fetch all transactions for this supplier (no searchData filter)
//                         const txnQuery = `
//                             SELECT id, bill_number, SUBSTRING_INDEX(bill_date, 'T', 1) AS bill_date, total_transfer_amount
//                             FROM stock_requests
//                             WHERE supplier_id = '${row.id}'
//                               AND bill_number IS NOT NULL
//                               AND total_transfer_amount IS NOT NULL
//                             ORDER BY id`;
//                         const transactions = await db.query(txnQuery);

//                         // Fetch supplier addresses as per original logic
//                         const getSupplierAddressesData = await getSupplierAddresses(row.id);

//                         return {
//                             id: row.id,
//                             supplier_name: row.supplier_name,
//                             owner_name: row.owner_name,
//                             cashier_name: row.cashier_name,
//                             supplier_code: row.supplier_code,
//                             bank_id: row.bank_id,
//                             bank_name: row.bank_name,
//                             account_holder_name: row.account_holder_name,
//                             account_number: row.account_number,
//                             branch_name: row.branch_name,
//                             ifsc_code: row.ifsc_code,
//                             status: supplier_status[row.status],
//                             upi_id: row.upi_id,
//                             supplier_addresses: getSupplierAddressesData,
//                             transactions: transactions,
//                         };
//                     })
//                 );

//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetched successfully",
//                     data: finalData,
//                     pageDetails: pageDetails,
//                 });
//             } else {
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

const getSuppliers = async (req, res, next) => {
    try {
        const isTransactions = req.query?.isTransactions === "true";
        const hasDropdown = req.query.isDropdown === "true";
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Search columns for full mode (includes bank field)
        const fullSearchColumns = [
            "suppliers.supplier_name",
            "suppliers.owner_name",
            "suppliers.cashier_name",
            "suppliers.supplier_code",
            "banks.bank_name",
            "suppliers.account_holder_name",
            "suppliers.account_number",
            "suppliers.branch_name",
            "suppliers.ifsc_code",
            "suppliers.upi_id",
        ];

        // Search columns for dropdown mode (exclude bank field)
        const dropdownSearchColumns = [
            "suppliers.supplier_name",
            "suppliers.owner_name",
            "suppliers.cashier_name",
            "suppliers.supplier_code",
            "suppliers.account_holder_name",
            "suppliers.account_number",
            "suppliers.branch_name",
            "suppliers.ifsc_code",
            "suppliers.upi_id",
        ];

        const status = req.query.status || "";
        let searchConditions = [];
        let conditionString = "";
        let whereCondition = "";

        if (status) {
            whereCondition = `WHERE suppliers.status = ${status}`;
        } else {
            whereCondition = `WHERE 1=1`;
        }

        // Build condition string based on mode and search term
        if (searchData != null && searchData !== "") {
            const columns = hasDropdown ? dropdownSearchColumns : fullSearchColumns;
            columns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
            conditionString = " AND (" + searchConditions.join(" OR ") + ")";
        }

        let query = "";
        let suppliers;

        if (hasDropdown) {
            // Dropdown Mode: Return only id and supplier_name
            query = `
                SELECT suppliers.id, suppliers.supplier_name 
                FROM suppliers 
                ${whereCondition} ${conditionString}
                ORDER BY suppliers.supplier_name ASC`;
            query = addCreatedByCondition(query, {
                table: "suppliers",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });
            suppliers = await db.query(query);

            let finalData = [];

            // For each supplier, fetch its transactions
            if (isTransactions) {
                finalData = await Promise.all(
                    suppliers.map(async (row) => {
                        const txnQuery = `
                            SELECT id, bill_number, SUBSTRING_INDEX(bill_date, 'T', 1) AS bill_date, total_transfer_amount
                            FROM stock_requests
                            WHERE supplier_id = '${row.id}'
                                AND bill_number IS NOT NULL
                                AND total_transfer_amount IS NOT NULL
                            ORDER BY id`;
                        const transactions = await db.query(txnQuery);

                        // Only return suppliers with transactions
                        if (transactions.length > 0) {
                            return {
                                id: row.id,
                                supplier_name: row.supplier_name,
                                transactions: transactions,
                            };
                        }
                        return null;
                    })
                );

                // Filter out null values (suppliers without transactions)
                finalData = finalData.filter(item => item !== null);
            } else {
                // If not looking for transactions, return all suppliers
                finalData = suppliers.map(row => ({
                    id: row.id,
                    supplier_name: row.supplier_name
                }));
            }

            if (finalData.length > 0) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Data fetched successfully",
                    data: finalData,
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Data not found",
                });
            }
        } else {
            // Full Mode: Return detailed supplier information with pagination
            query = `
                SELECT suppliers.*, banks.bank_name 
                FROM suppliers 
                LEFT JOIN banks On banks.id = suppliers.bank_id 
                ${whereCondition} ${conditionString}
                ORDER BY suppliers.id DESC`;
            query += ` LIMIT ${pageFirstResult}, ${pageSize}`;

            query = addCreatedByCondition(query, {
                table: "suppliers",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });

            suppliers = await db.query(query);
            const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);

            if (suppliers.length > 0) {
                const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                let finalData = [];

                if (isTransactions) {
                    // Get all suppliers with transactions
                    const suppliersWithTransactions = await Promise.all(
                        suppliers.map(async (row) => {
                            const txnQuery = `
                                SELECT id, bill_number, SUBSTRING_INDEX(bill_date, 'T', 1) AS bill_date, total_transfer_amount
                                FROM stock_requests
                                WHERE supplier_id = '${row.id}'
                                    AND bill_number IS NOT NULL
                                    AND total_transfer_amount IS NOT NULL
                                ORDER BY id`;
                            const transactions = await db.query(txnQuery);

                            // Only include suppliers with transactions
                            if (transactions.length > 0) {
                                // Fetch supplier addresses
                                const getSupplierAddressesData = await getSupplierAddresses(row.id);

                                return {
                                    id: row.id,
                                    supplier_name: row.supplier_name,
                                    owner_name: row.owner_name,
                                    cashier_name: row.cashier_name,
                                    supplier_code: row.supplier_code,
                                    bank_id: row.bank_id,
                                    bank_name: row.bank_name,
                                    account_holder_name: row.account_holder_name,
                                    account_number: row.account_number,
                                    branch_name: row.branch_name,
                                    ifsc_code: row.ifsc_code,
                                    status: supplier_status[row.status],
                                    upi_id: row.upi_id,
                                    supplier_addresses: getSupplierAddressesData,
                                    transactions: transactions,
                                };
                            }
                            return null;
                        })
                    );

                    // Filter out null values (suppliers without transactions)
                    finalData = suppliersWithTransactions.filter(item => item !== null);

                    // Recalculate pagination if filtering changed the number of results
                    if (finalData.length !== suppliers.length) {
                        pageDetails.totalItems = finalData.length;
                        pageDetails.totalPages = Math.ceil(finalData.length / pageSize);
                    }
                } else {
                    // If not looking for transactions, process all suppliers normally
                    finalData = await Promise.all(
                        suppliers.map(async (row) => {
                            // Fetch supplier addresses
                            const getSupplierAddressesData = await getSupplierAddresses(row.id);

                            return {
                                id: row.id,
                                supplier_name: row.supplier_name,
                                owner_name: row.owner_name,
                                cashier_name: row.cashier_name,
                                supplier_code: row.supplier_code,
                                bank_id: row.bank_id,
                                bank_name: row.bank_name,
                                account_holder_name: row.account_holder_name,
                                account_number: row.account_number,
                                branch_name: row.branch_name,
                                ifsc_code: row.ifsc_code,
                                status: supplier_status[row.status],
                                upi_id: row.upi_id,
                                supplier_addresses: getSupplierAddressesData,
                            };
                        })
                    );
                }

                if (finalData.length > 0) {
                    return res.status(StatusCodes.OK).json({
                        status: true,
                        message: "Data fetched successfully",
                        data: finalData,
                        pageDetails: pageDetails,
                    });
                } else {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: "Data not found",
                    });
                }
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Data not found",
                });
            }
        }
    } catch (error) {
        return next(error);
    }
};


const getSuppliersById = async (req, res, next) => {
    try {
        const supplierId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: supplierId });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const query = `
            SELECT suppliers.*, banks.bank_name, banks.logo 
            FROM suppliers 
            LEFT JOIN banks On banks.id = suppliers.bank_id 
            WHERE suppliers.id = ?`;

        const suppliers = await db.query(query, [supplierId]);

        if (suppliers.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of suppliers) {
                const getSupplierAddressesData = await getSupplierAddresses(row.id);

                finalData.push({
                    id: row.id,
                    supplier_name: row.supplier_name,
                    owner_name: row.owner_name,
                    cashier_name: row.cashier_name,
                    supplier_code: row.supplier_code,
                    bank_id: row.bank_id,
                    bank_name: row.bank_name,
                    bank_logo: row.logo,
                    account_holder_name: row.account_holder_name,
                    account_number: row.account_number,
                    branch_name: row.branch_name,
                    ifsc_code: row.ifsc_code,
                    status: supplier_status[row.status],
                    upi_id: row.upi_id,
                    upi_image: row.upi_image,
                    supplier_addresses: getSupplierAddressesData,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data fetch successfully",
                data: finalData[0],
            });
        } else {
            // If no data is found, return an empty array and appropriate message
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateSuppliers = async (req, res, next) => {
    try {
        const supplierId = req.params.id;
        // return
        req.body.address = JSON.parse(req.body.address);
        const { error } = supplierSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const {
            supplier_name,
            owner_name,
            cashier_name,
            // supplier_code,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            address,
        } = req.body;
        // console.log('req.body: ', req.body);

        let storePath;

        if (req.body.upi_image) {
            // Check if the image path is the specified one
            if (req.body.upi_image.startsWith("/supplier_upi_images/")) {
                storePath = req.body.upi_image;
            } else {
                let base64File = req.body.upi_image.replace(/^data:image\/\w+;base64,/, "");
                storePath = await convertBase64Image(
                    base64File,
                    "./public/supplier_upi_images/",
                    "/supplier_upi_images/"
                );
            }
        }

        const supplierData = {
            supplier_name,
            owner_name,
            cashier_name,
            // supplier_code,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            upi_image: storePath,
            updated_by: req.user.user_id,
        };

        // check gst mark default settings
        if (address.length > process.env.VALUE_ZERO) {
            // Check if at least one "is_default" value is greater than or equal to 1
            const defaultCount = address.filter((address) => parseInt(address.is_default) >= 1).length;

            if (defaultCount < 1) {
                return res.status(StatusCodes.OK).json({ status: false, message: "No address is set as default" });
            }
        }

        const result = await db.query("UPDATE suppliers SET ? WHERE id = ?", [supplierData, supplierId]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // insert addresses into
            if (address.length > process.env.VALUE_ZERO) {
                // delete previous all addresses of supplier
                // const deleteAddress = await db.query("DELETE FROM supplier_addresses WHERE supplier_id = ?", [
                //     supplierId,
                // ]);

                for (let i = 0; i < address.length; i++) {
                    // console.log("address[i]: ", address[i]);
                    const {
                        id,
                        supplier_id,
                        shop_office_number,
                        street_name,
                        city,
                        state,
                        pin_code,
                        landmark,
                        gst_number,
                        is_default,
                    } = address[i];

                    if (id && supplier_id) {
                        // Update query
                        const updateQuery = `
                            UPDATE supplier_addresses
                            SET
                                supplier_id = ?,
                                shop_office_number = ?,
                                street_name = ?,
                                city = ?,
                                state = ?,
                                pin_code = ?,
                                landmark = ?,
                                gst_number = ?,
                                is_default = ?
                            WHERE
                                id = ?
                        `;
                        await db.query(updateQuery, [
                            supplier_id,
                            shop_office_number,
                            street_name,
                            city,
                            state,
                            pin_code,
                            landmark,
                            gst_number,
                            is_default,
                            id,
                        ]);
                    } else {
                        // Insert query
                        const insertQuery = `
                            INSERT INTO supplier_addresses (
                                supplier_id,
                                shop_office_number,
                                street_name,
                                city,
                                state,
                                pin_code,
                                landmark,
                                gst_number,
                                is_default
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        await db.query(insertQuery, [
                            supplierId,
                            shop_office_number,
                            street_name,
                            city,
                            state,
                            pin_code,
                            landmark,
                            gst_number,
                            is_default,
                        ]);
                    }
                }
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "suppliers updated successfully" });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error creating a new company" });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteSuppliers = async (req, res, next) => {
    try {
        const supplierId = req.params.id;
        // return
        const { error } = checkPositiveInteger.validate({ id: supplierId });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }
        const existingSupplier = await db.query("SELECT * FROM suppliers WHERE id = ?", [supplierId]);

        if (existingSupplier.length === process.env.VALUE_ZERO) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Supplier not found" });
        }

        const result = await db.query("DELETE FROM suppliers WHERE id = ?", [supplierId]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // delete previous all addresses of supplier
            const deleteAddress = await db.query("DELETE FROM supplier_addresses WHERE supplier_id = ?", [supplierId]);

            return res.status(StatusCodes.OK).json({ status: true, message: "Supplier deleted successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error deleting the supplier" });
        }
    } catch (error) {
        return next(error);
    }
};

/** approve or reject status of suppliers by id */
const approveOrRejectSuppliersById = async (req, res, next) => {
    try {
        const status = req.query.status;
        const id = req.query.id;
        // Check if status is either '2' or '3'
        // return
        // const supplier_code = await generateSupplierCode(id);

        if (status === "2" || status === "3") {
            let updateQuery = `UPDATE suppliers SET status = '${status}'`;
            // if (status === "2") {
            //     updateQuery += `, supplier_code = '${supplier_code}'`;
            // }
            updateQuery += ` WHERE id = ${id}`;
            const updateResults = await db.query(updateQuery);

            if (updateResults.affectedRows === 0) {
                return res.status(400).json({ status: false, message: "Invalid id" });
            }

            const message = status === "2" ? "Supplier approved successfully" : "Supplier rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: "Invalid status or id" });
        }
    } catch (error) {
        return next(error);
    }
};

const importSuppliers = async (req, res, next) => {
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
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        // console.log("rows: ", rows);

        const createdBy = req.user.user_id;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const errorMessage = [];
        const userType = req.user.user_type;

        let insertedRecords = 0;

        const { bank_id, city, state } = req.body;

        // Separate sets for each field to track duplicates
        const gstNumberSet = new Set();
        const cashierNameSet = new Set();
        const ownerNameSet = new Set();
        const supplierNameSet = new Set();

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let {
                    supplier_name = "",
                    owner_name = "",
                    cashier_name = "",
                    // bank_id,
                    account_holder_name,
                    account_number,
                    branch_name,
                    ifsc_code,
                    upi_id,
                    shop_office_number,
                    street_name,
                    // city,
                    // state,
                    pin_code,
                    landmark,
                    gst_number = "",
                } = rows[i];

                const { error } = supplierImportSchema.validate({
                    supplier_name,
                    owner_name,
                    cashier_name,
                    bank_id,
                    account_holder_name,
                    account_number,
                    branch_name,
                    ifsc_code,
                    shop_office_number,
                    street_name,
                    city,
                    state,
                    pin_code,
                    landmark,
                    gst_number,
                });

                if (error) {
                    // console.log('error: ', error);
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ status: false, message: `At row ${i + 1}, ${error.message}` });
                }

                // Check for duplicates in the current rows
                if (supplier_name && supplierNameSet.has(supplier_name)) {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: `Duplicate Supplier Name '${supplier_name}' found at row ${i + 1}`,
                    });
                }

                if (owner_name && ownerNameSet.has(owner_name)) {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: `Duplicate Owner name '${owner_name}' found at row ${i + 1}`,
                    });
                }

                if (cashier_name && cashierNameSet.has(cashier_name)) {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: `Duplicate Cashier Name '${cashier_name}' found at row ${i + 1}`,
                    });
                }

                // Check for duplicates in the current rows
                if (gst_number && gstNumberSet.has(gst_number)) {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: `Duplicate GSTIN '${gst_number}' found at row ${i + 1}`,
                    });
                }

                // Add the current row's fields to their respective sets
                if (gst_number) gstNumberSet.add(gst_number);
                if (cashier_name) cashierNameSet.add(cashier_name);
                if (owner_name) ownerNameSet.add(owner_name);
                if (supplier_name) supplierNameSet.add(supplier_name);
                // console.log('supplierNameSet: ', supplierNameSet);

                const conditions = [
                    { field: "supplier_name", operator: "=", value: supplier_name },
                    { field: "owner_name", operator: "=", value: owner_name },
                    { field: "cashier_name", operator: "=", value: cashier_name },
                    { field: "gst_number", operator: "=", value: gst_number },
                ];
                const joins = [
                    { type: "LEFT", table: "supplier_addresses", on: "suppliers.id = supplier_addresses.supplier_id" },
                ];
                const existingSupplierCode = await getRecordWithWhereAndJoin("suppliers", conditions, joins);
                // console.log('existingSupplierCode: ', existingSupplierCode);

                if (existingSupplierCode.length > process.env.VALUE_ZERO) {
                    // Identify matching fields
                    const matchingFields = [];
                    for (const condition of conditions) {
                        const field = condition.field;
                        const value = condition.value;

                        // Check if the field matches in any of the existing records
                        if (existingSupplierCode.some((record) => record[field] === value)) {
                            matchingFields.push(field);
                        }
                    }

                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: `at row ${i + 1} duplicate supplier found, matching fields: ${matchingFields.join(", ")}`,
                    });
                }
            }

            // Process each row for insertion
            for (let i = 0; i < rows.length; i++) {
                let {
                    supplier_name = "",
                    owner_name,
                    cashier_name,
                    account_holder_name,
                    account_number,
                    branch_name,
                    ifsc_code,
                    upi_id,
                    shop_office_number,
                    street_name,
                    pin_code,
                    landmark,
                    gst_number,
                } = rows[i];

                // for supplier format no. in Master Data
                const type = 4;

                // get supplier code from master data format
                const supplier_code = await generateClientVendorId(type, req.user.user_id);

                const supplierData = {
                    supplier_name,
                    owner_name,
                    cashier_name,
                    bank_id,
                    account_holder_name,
                    account_number,
                    branch_name,
                    ifsc_code,
                    upi_id,
                    // upi_image: storePath,
                    created_by: createdBy,
                    created_at: createdAt,
                    supplier_code,
                };

                const result = await db.query("INSERT INTO suppliers SET ?", [supplierData]);

                if (result.affectedRows > process.env.VALUE_ZERO) {
                    const addressData = {
                        shop_office_number,
                        street_name,
                        city,
                        state,
                        pin_code,
                        landmark,
                        gst_number,
                        is_default: 1,
                    };
                    addressData.supplier_id = result.insertId;
                    // addressData.state =  addressData.state.label;
                    const addressQuery = await db.query("INSERT INTO supplier_addresses SET ?", [addressData]);
                    if (addressQuery.affectedRows > process.env.VALUE_ZERO) {
                        console.log(`Address for GSTIN ${gst_number} inserted successfully`);
                    }

                    insertedRecords++;
                } else {
                    errorMessage.push(`At row ${i + 1}, error inserting supplier`);
                }
            }

            // Clean up uploaded file
            fs.unlinkSync(completePath);

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
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid data or File not uploaded",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createSuppliers,
    getSuppliers,
    getSuppliersById,
    updateSuppliers,
    deleteSuppliers,
    approveOrRejectSuppliersById,
    importSuppliers,
};

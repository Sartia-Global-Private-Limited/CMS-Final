require("dotenv").config();
const moment = require("moment");
const Joi = require("joi");
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { bankFieldValidation, checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");


const getAllBankList = async (req, res, next) => {
    try {
        const isAccounts = req.query?.isAccounts || false;

        // Fetch all banks
        const queryResult = await db.query(`SELECT id, bank_name, logo FROM banks`);

        let banksData = queryResult;

        // Only fetch and attach accounts if isAccounts is true
        if (isAccounts) {
            // Fetch all accounts with required fields only
            const accountsResult = await db.query(`
                SELECT id, user_id, bank_id, account_number, account_holder_name, account_type, 
                ifsc_code, branch, balance, created_at, created_by 
                FROM accounts
            `);

            // Map accounts to their respective banks
            const bankAccountsMap = new Map();

            accountsResult.forEach(account => {
                if (!bankAccountsMap.has(account.bank_id)) {
                    bankAccountsMap.set(account.bank_id, []);
                }
                bankAccountsMap.get(account.bank_id).push(account);
            });

            // Add accounts key to each bank and filter out banks with no accounts
            banksData = queryResult
                .map(bank => ({
                    ...bank,
                    accounts: bankAccountsMap.get(bank.id) || []
                }))
                .filter(bank => bank.accounts.length > 0);
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Banks list fetched successfully",
            data: banksData,
        });
    } catch (error) {
        return next(error);
    }
};

const addBankDetails = async (req, res, next) => {
    try {
        const { bank_name, website } = req.body;

        const { error } = bankFieldValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: Error.message,
                message: error.message,
            });
        }
        const created_by = req.user.user_id;
        // check bank details is already exist or not
        const checkBankExists = await db.query(`SELECT * FROM banks WHERE bank_name = ? OR website = ?`, [
            bank_name,
            website,
        ]);

        if (checkBankExists.length > process.env.VALUE_ZERO && checkBankExists[0].created_by == created_by) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Bank details already exists",
            });
        }

        let storePath;
        if (req.files != null) {
            const image = req.files.logo;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/bank_logo/" + imageName;
            storePath = "/bank_logo/" + imageName;
            image.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                }
            });
        }

        const queryResult = await db.query(
            `INSERT INTO banks(bank_name, website, logo, created_by)VALUES(?, ?, ?, ?)`,
            [bank_name, website, storePath, created_by]
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Bank details saved successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const bankList = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["bank_name", "website"];
        const searchConditions = [];
        const role_id = req.user.user_type || 0;

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        let query;

        if (role_id == 1) {
            query = `SELECT * FROM banks ${searchConditions.length > 0
                ? `WHERE ${searchConditions.join(" OR ")} AND created_by = '${req.user.user_id}'`
                : `WHERE created_by = '${req.user.user_id}'`
                } ${orderLimitQuery}`;
        } else {
            query = `SELECT * FROM banks ${searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")}` : ``
                } ${orderLimitQuery}`;
        }

        const queryResult = await db.query(query);
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            let finalData = [];
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    bank_name: row.bank_name,
                    website: row.website,
                    logo: row.logo,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched Successfully",
                data: finalData,
                pageDetails: pageDetails,
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

const bankDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT * FROM banks WHERE id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > 0) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    bank_name: row.bank_name,
                    website: row.website,
                    logo: row.logo,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: finalData[0],
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "No items found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const updateBankDetails = async (req, res, next) => {
    try {
        const { bank_name, website, logo, id } = req.body;

        const { error } = bankFieldValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: Error.message,
                message: error.message,
            });
        }

        let storePath;
        if (req.files != null) {
            const image = req.files.logo;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/bank_logo/" + imageName;
            storePath = "/bank_logo/" + imageName;
            image.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                }
            });
        } else {
            storePath = logo;
        }

        const queryResult = await db.query(`UPDATE banks SET bank_name = ?, website = ?, logo = ? WHERE id = ?`, [
            bank_name,
            website,
            storePath,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Bank details updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllBankList, addBankDetails, bankList, bankDetailsById, updateBankDetails };

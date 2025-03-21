const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");

/**
 * get all countries list
 * @param {*} req
 * @param {*} res
 * @returns
 */
const allCountries = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM countries`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! company not created",
                data: queryResult,
            });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * get all status by country id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getStates = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM states WHERE country_id='${id}';`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Error! company not created",
                data: queryResult,
            });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * get all cities by using states id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const allCities = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM cities WHERE state_id ='${id}';`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No record found", data: queryResult });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { allCountries, getStates, allCities };

var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { subUserFormValidation, teamValidations, checkPositiveInteger } = require("../helpers/validation");
const { getSubModule } = require("../helpers/general");

const getAllFeedbackAndSuggestions = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM feedback_and_suggestions`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let selectQuery;

        if (searchData != null && searchData != "") {
            selectQuery = `SELECT users.name, complaint_types.complaint_type_name, feedback_and_suggestions.* FROM feedback_and_suggestions INNER JOIN users ON users.id=feedback_and_suggestions.user_id INNER JOIN complaint_types ON complaint_types.id=feedback_and_suggestions.complaint_id WHERE complaint_types.complaint_type_name LIKE '%${searchData}%' ORDER BY feedback_and_suggestions.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        } else {
            selectQuery = `SELECT users.name, complaint_types.complaint_type_name, feedback_and_suggestions.* FROM feedback_and_suggestions INNER JOIN users ON users.id=feedback_and_suggestions.user_id INNER JOIN complaint_types ON complaint_types.id=feedback_and_suggestions.complaint_id ORDER BY feedback_and_suggestions.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const readAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                const updateStatusReadQuery = `UPDATE feedback_and_suggestions SET status=1, updated_at='${readAt}'`;
                const updateStatusRead = await db.query(updateStatusReadQuery);
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

                res.status(200).json({ status: true, message: "success", data: result, pageDetails: pageDetails[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllFeedbackAndSuggestions };

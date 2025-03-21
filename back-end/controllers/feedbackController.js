var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const addFeedback = async (req, res, next) => {
    try {
        const feedbackData = req.body;
        const feedbackJson = JSON.stringify(feedbackData.feedback);
        /** Validation */
        const { error } = feedbackDataSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }
        const insertQuery = `
        INSERT INTO feedback (
             date, time, area_manager, supervisor, supervisor_contact, 
            technician_name, technician_contact, start_date, end_date, 
            complain_number, outlet_name, location, work_details, 
            ro_name, sales_area, contact_person_name, contact_person_no, 
            email_id, complaints, suggestions, questions,created_by
        ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        const queryValues = [
            feedbackData.date,
            feedbackData.time,
            feedbackData.area_manager,
            feedbackData.supervisor,
            feedbackData.supervisor_contact,
            feedbackData.technician_name,
            feedbackData.technician_contact,
            feedbackData.start_date,
            feedbackData.end_date,
            feedbackData.complain_number,
            feedbackData.outlet_name,
            feedbackData.location,
            feedbackData.work_details,
            feedbackData.ro_name,
            feedbackData.sales_area,
            feedbackData.contact_person_name,
            feedbackData.contact_person_no,
            feedbackData.email_id,
            feedbackData.complaints,
            feedbackData.suggestions,
            feedbackJson,
            req.user.user_id,
        ];

        const execQuery = await db.query(insertQuery, queryValues);
        if (execQuery.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Feedback added successfully." });
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Failed to insert data." });
    } catch (error) {
        return next(error);
    }
};

const feedbackSchema = Joi.object({
    question: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
});

const feedbackDataSchema = Joi.object({
    date: Joi.date().iso().required(),
    time: Joi.string().required(),
    area_manager: Joi.string().required(),
    supervisor: Joi.string().required(),
    supervisor_contact: Joi.string().required(),
    technician_name: Joi.string().required(),
    technician_contact: Joi.string().required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
    complain_number: Joi.string().required(),
    outlet_name: Joi.string().required(),
    location: Joi.string().required(),
    work_details: Joi.string().required(),
    ro_name: Joi.string().required(),
    sales_area: Joi.string().required(),
    contact_person_name: Joi.string().required(),
    contact_person_no: Joi.string().required(),
    email_id: Joi.string().email().required(),
    complaints: Joi.string().required(),
    suggestions: Joi.string().required(),
    feedback: Joi.array().items(feedbackSchema).required(),
}).options({ allowUnknown: true });

const getAllFeedbacks = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectQuery = `SELECT * FROM feedback ORDER BY id DESC LIMIT ${pageFirstResult},${pageSize}`;

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const getData = await db.query(selectQuery);
        if (getData.length == 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Data not found." });
        }
        for (let item of getData) {
            item.questions = item.questions ? JSON.parse(item.questions) : null;
        }

        const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        return res.status(StatusCodes.OK).json({ status: true, message: getData, pageDetails: pageDetails });
    } catch (error) {
        return next(error);
    }
};

var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, surveyValidations } = require("../helpers/validation");
const {
    getSurveyQuestions,
    getCreatedUserNameFromAdmin,
    getAssignFromAdmin,
    getAssignToSubUser,
    getUserDetails,
    getQuestionList,
    calculatePagination,
    getRecord,
} = require("../helpers/general");
const Joi = require("joi");

const createSurvey = async (req, res, next) => {
    try {
        const { title, description, format, questions } = req.body;
        const { error } = surveyValidations.validate({
            title: title,
            description: description,
            format: format,
            questions: questions,
        });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const createdBy = req.user.user_id;
        //status = 1 :- request , 2 :- approved , 3 :- rejected
        const insertQuery = `INSERT INTO survey(title, description, format, questions, status, created_by) VALUES('${title}', '${description}', '${format}', '${JSON.stringify(
            questions
        )}' , '1', '${createdBy}')`;

        const result = await db.query(insertQuery);
        if (result.affectedRows > process.env.VALUE_ZERO) {
            return res.status(200).json({ status: true, message: "Survey created successfully" });
        } else {
            return res.status(400).json({
                status: false,
                message: "Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSurvey = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID;
        const roleCheck =
            superAdminRoleId == req.user.user_type
                ? ``
                : `AND (survey.created_by = ${req.user.user_id} OR survey.assign_to = ${req.user.user_id} OR survey.assign_to_sub_user = ${req.user.user_id})`;
        const countSelectQuery = `SELECT COUNT(survey.id) as total FROM survey WHERE survey.status != 0 ${roleCheck}`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var whereCond = "";
        if (searchData != null && searchData != "") {
            whereCond = `AND survey.title LIKE '%${searchData}%'`;
        }

        // if (user_type != 1) {
        //   whereCond += ` AND survey.created_by = '${user_id}'`;
        // }

        var selectAllSurveyQuery = `SELECT * FROM survey WHERE survey.status != 0 ${roleCheck} ${whereCond} ORDER BY survey.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign_to: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        questions: JSON.parse(element?.questions || "[]"),
                        created_at: moment(element.created_at).format("DD-MM-YYYY"),
                    };
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({
                        pageSize,
                        currentPage,
                        totalPages,
                        total,
                        pageStartResult,
                        pageEndResult,
                    });

                    return res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSurveyById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.questions, survey.created_by, survey.status,survey.assign_to, survey.assign_to_sub_user , survey.format FROM survey WHERE id='${id}'`;

        db.query(selectSurveyByIdQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by_name: await getCreatedUserNameFromAdmin(element.created_by),
                        questions: JSON.parse(element?.questions, "[]"),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values[0],
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

const editSurveyDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.created_by,survey.status FROM survey WHERE id='${id}'`;

        db.query(selectSurveyByIdQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        survey_questions: await getSurveyQuestions(element.survey_id),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values[0],
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

const updateSurveyDetails = async (req, res, next) => {
    try {
        const { title, description, format, questions, id } = req.body;
        const { error } = surveyValidations.validate({
            title: title,
            description: description,
            format: format,
        });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const { error: idErrorCheck } = checkPositiveInteger.validate({ id: id });
        if (idErrorCheck) return res.status(403).json({ status: false, message: idErrorCheck.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE survey SET title='${title}', description='${description}', questions = '${JSON.stringify(
            questions
        )}', updated_at='${updatedAt}' WHERE id='${id}'`;

        const createdBy = req.user.user_id;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({
                    status: true,
                    message: "Survey details updated successfully",
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Something went wrong, please try again later",
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteSurvey = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const deleteQuery = `UPDATE survey SET status='0' WHERE id='${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Survey deleted successfully" });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Something went wrong, please try again later",
                });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAssignedSurvey = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(survey.id) as total FROM survey WHERE (survey.assign_to IS NOT NULL OR survey.assign_to_sub_user IS NOT NULL) AND survey.status != 0`;
        const constTotalLength = await db.query(countSelectQuery);

        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";
        if (searchData != null && searchData != "") {
            searchDataCondition = `AND survey.title LIKE '%${searchData}%'`;
        }

        const selectAllSurveyQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.questions, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by FROM survey WHERE (survey.assign_to IS NOT NULL OR survey.assign_to_sub_user IS NOT NULL) AND survey.status != 0 ${searchDataCondition} ORDER BY survey.id DESC LIMIT ${pageFirstResult}, ${pageSize} `;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        // survey_questions: await getSurveyQuestions(element.survey_id)
                        questions: JSON.parse(element?.questions || "[]"),
                    };
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({
                        pageSize,
                        currentPage,
                        totalPages,
                        total,
                        pageStartResult,
                        pageEndResult,
                    });

                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getRequestedSurvey = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const status = req.query.status;
        let totalPages = process.env.VALUE_ZERO;
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID;
        const roleCheck =
            superAdminRoleId == req.user.user_type
                ? ``
                : `AND (survey.created_by = ${req.user.user_id} OR survey.assign_to = ${req.user.user_id} OR survey.assign_to_sub_user = ${req.user.user_id})`;
        let searchDataCondition = "";
        if (searchData != null && searchData != "") {
            searchDataCondition = `AND survey.title LIKE '%${searchData}%'`;
        }

        const countSelectQuery = `SELECT COUNT(survey.id) as total FROM survey WHERE survey.status = '${status}' ${roleCheck} ${searchDataCondition}`;
        const constTotalLength = await db.query(countSelectQuery);

        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const pageStartResult = (currentPage - 1) * pageSize + 1;
        const pageEndResult = Math.min(currentPage * pageSize, total);
        let pageDetails = {
            pageSize,
            currentPage,
            totalPages,
            total,
            pageStartResult,
            pageEndResult,
        };
        const selectAllSurveyQuery = `
            SELECT survey.id as survey_id, survey.title, survey.description, survey.questions, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by 
            FROM survey 
            WHERE survey.status = '${status}' 
            ${roleCheck} ${searchDataCondition} 
            ORDER BY survey.id DESC 
            LIMIT ${pageFirstResult}, ${pageSize} 
        `;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        requested_by: await getCreatedUserNameFromAdmin(element.created_by),
                        questions: JSON.parse(element?.questions || "[]"),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails,
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getSurveyQuestionResponse = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        var search_cond = "";
        if (searchData != "") {
            search_cond = `WHERE survey.title like '%${searchData}%'`;
        }
        const countSelectQuery = `SELECT COUNT(id) as total FROM survey_question_responses`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectAllSurveyQuery = `SELECT survey_question_responses.*, survey.title as survey_title, survey.created_by, IFNULL(survey.assign_to,0) as assign_to, IFNULL(survey.assign_to_sub_user,0) as assign_to_sub_user
        FROM survey_question_responses
        LEFT JOIN survey ON survey_question_responses.survey_id = survey.id 
        ${search_cond} ORDER BY survey_question_responses.id DESC LIMIT ${pageFirstResult}, ${pageSize};`;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({
                    pageSize,
                    currentPage,
                    totalPages,
                    total,
                    pageStartResult,
                    pageEndResult,
                });

                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign_to: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        question_response_by: await getUserDetails(element.response_by),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                        pageDetails: pageDetails[0],
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const assignToSurvey = async (req, res, next) => {
    try {
        const { survey_id, assign_to } = req.body;

        const formValidate = Joi.object({
            survey_id: Joi.number().required(),
            assign_to: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidate.validate(req.body);
        if (error) return res.status(403).json({ status: false, message: error.message });

        const assignQuery = `UPDATE survey SET assign_to = ? , status = ? WHERE id = ?`;
        const queryResult = await db.query(assignQuery, [assign_to, 4, survey_id]);
        if (queryResult.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "Survey assigned successfully" });
        } else {
            return res.status(403).json({ status: false, message: "Error! survey not assigned" });
        }
    } catch (error) {
        return next(error);
    }
};

const updateRequestedSurveyStatus = async (req, res, next) => {
    try {
        const { survey_id, status } = req.body;

        const formValidation = Joi.object({
            survey_id: Joi.number().required(),
            status: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidation.validate(req.body);

        if (error) return res.status(403).json({ status: false, message: error.message });

        const approvedQuery = `UPDATE survey SET status = ? WHERE id = ?`;

        const queryResult = await db.query(approvedQuery, [status, survey_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Survey status changed successfully" });
        } else {
            res.status(403).json({ status: false, message: "Error! survey status not changed" });
        }
    } catch (error) {
        return next(error);
    }
};

const surveyQuestionFormResponse = async (req, res, next) => {
    try {
        const { survey_id, question_id, response } = req.body;

        const formValidation = Joi.object({
            survey_id: Joi.number().required(),
            question_id: Joi.required(),
            response: Joi.required(),
        });

        const { error } = formValidation.validate(req.body);

        if (error) return res.status(403).json({ status: false, message: error.message });

        const answerSubmitQuery = `INSERT INTO survey_question_responses(survey_id, question_id, response, response_by) VALUES(?, ?, ?, ?)`;

        const response_by = req.user.user_id;
        const questionResponseFormat = { response };
        const responseJSONString = JSON.stringify(questionResponseFormat);

        const insertValues = [survey_id, JSON.stringify(question_id), responseJSONString, response_by];

        const queryResult = await db.query(answerSubmitQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Response submitted successfully" });
        } else {
            res.status(403).json({ status: true, message: "Error! response not submitted" });
        }
    } catch (error) {
        return next(error);
    }
};

const otpSendSurvey = async (req, res, next) => {
    try {
        const { id, mobile } = req.body;
        const updateQuery = `UPDATE survey SET otp='123456' WHERE id='${id}'`;
        const queryResult = await db.query(updateQuery);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Otp send successfully" });
        } else {
            res.status(403).json({ status: false, message: "Error! Otp send unsuccessfully" });
        }
    } catch (error) {
        return next(error);
    }
};

const VerifyOtpSurvey = async (req, res, next) => {
    try {
        const { id, otp } = req.body;
        const selectQuery = `select * FROM survey WHERE id='${id}' and otp='${otp}'`;
        const selectResult = await db.query(selectQuery);
        if (selectResult.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Otp Verify successfully" });
        } else {
            res.status(403).json({ status: false, message: "Error! Otp Verify unsuccessfully" });
        }
    } catch (error) {
        return next(error);
    }
};

// const getSurveyResponseById = async(req,res,next)=>{
//     try{
//         const id = req.params.id;
//         const selectAllSurveyQuery = `SELECT survey_question_responses.*,survey.format, survey.title as survey_title, survey.created_by, IFNULL(survey.assign_to,0) as assign_to, IFNULL(survey.assign_to_sub_user,0) as assign_to_sub_user
//         FROM survey_question_responses
//         LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//         WHERE survey.id="${id}";`;

//         console.log("selectAllSurveyQuery", selectAllSurveyQuery)
//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: err })

//             if (result.length > process.env.VALUE_ZERO) {
//                 result[0].created_by = await getCreatedUserNameFromAdmin(result[0].created_by);
//                 result[0].assign_to = await getCreatedUserNameFromAdmin(result[0].assign_to);
//                 result[0].assign_to_sub_user = await getCreatedUserNameFromAdmin(result[0].assign_to_sub_user);
//                 result[0].question_response_by = await getCreatedUserNameFromAdmin(result[0].response_by);
//                 result[0].response = JSON.parse(result[0].response);
//                 result[0].question_list = await getQuestionList(JSON.parse(result[0].question_id));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: result });
//             }
//             else {
//                 return res.status(500).json({ status: false, message: "Data not found" })
//             }

//         })
//     }catch(error){
//         return res.status(500).json({ status:false, message:error.message });
//     }
// }

// const getSurveyResponseById = async(req,res,next) => {
//     try {
//         const id = req.params.id;
//         const selectAllSurveyQuery = `
//             SELECT survey_question_responses.*,
//                    survey.format,
//                    survey.title as survey_title,
//                    survey.created_by,
//                    IFNULL(survey.assign_to, 0) as assign_to,
//                    IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
//             FROM survey_question_responses
//             LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//             WHERE survey.id = "${id}";
//         `;

//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: error.message });

//             if (result.length > process.env.VALUE_ZERO) {
//                 const mappedResults = await Promise.all(result.map(async (row) => {
//                     row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
//                     row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
//                     row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
//                     row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
//                     row.response = JSON.parse(row.response);
//                     row.question_list = await getQuestionList(JSON.parse(row.question_id));
//                     return row;
//                 }));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: mappedResults });
//             } else {
//                 return res.status(500).json({ status: false, message: "Data not found" });
//             }
//         });
//     } catch (error) {next(error)
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };

// const getSurveyResponseById = async(req,res,next) => {
//     try {
//         const id = req.params.id;
//         const selectAllSurveyQuery = `
//             SELECT survey_question_responses.*,
//                    survey.format,
//                    survey.title as survey_title,
//                    survey.created_by,
//                    IFNULL(survey.assign_to, 0) as assign_to,
//                    IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
//             FROM survey_question_responses
//             LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//             WHERE survey.id = "${id}";
//         `;

//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: error.message });

//             if (result.length > process.env.VALUE_ZERO) {
//                 const mappedResults = await Promise.all(result.map(async (row) => {
//                     row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
//                     row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
//                     row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
//                     row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
//                     row.response = JSON.parse(row.response);
//                     row.question_list = await getQuestionList(JSON.parse(row.question_id));

//                     // Combine questions with corresponding answers
//                     row.questions_with_answers = row.question_list.map((question, index) => {
//                         return {
//                             question: question.question.question.title,
//                             answer: row.response.response[index] ? row.response.response[index].answer : null
//                         };
//                     });

//                     return row;
//                 }));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: mappedResults });
//             } else {
//                 return res.status(500).json({ status: false, message: "Data not found" });
//             }
//         });
//     } catch (error) {next(error)
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };

const getSurveyResponseById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectAllSurveyQuery = `
            SELECT survey_question_responses.*, 
                survey.format, 
                survey.title as survey_title, 
                survey.created_by, 
                IFNULL(survey.assign_to, 0) as assign_to, 
                IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
            FROM survey_question_responses
            LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
            WHERE survey.id = "${id}";
        `;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error.message });

            if (result.length > process.env.VALUE_ZERO) {
                const mappedResults = await Promise.all(
                    result.map(async (row) => {
                        row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
                        row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
                        row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
                        row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
                        row.response = JSON.parse(row.response);
                        row.question_list = await getQuestionList(JSON.parse(row.question_id));

                        // Combine questions with corresponding answers
                        row.questions_with_answers = row.question_list.map((question, index) => {
                            // Assuming 'question.question' contains the question details.
                            return {
                                question: question.question,
                                answer: row.response.response[index] ? row.response.response[index].answer : null,
                            };
                        });

                        return row;
                    })
                );

                res.status(200).json({
                    status: true,
                    message: "Fetched successfully",
                    data: mappedResults,
                });
            } else {
                return res.status(500).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

/** approve or reject survey based on status */
const approveRejectSurveyByStatus = async (req, res, next) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE survey SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Survey approved successfully" : "Survey rejected successfully";
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

// changes by nilanjan

/** get all requested survey based on status */
const getAllRequestedSurvey = async (req, res, next) => {
    try {
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID;
        const status = req.query.status || "";
        const selectAllSurveyQuery = `
        SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by 
        FROM survey 
        WHERE survey.created_by !='${superAdminRoleId}' AND survey.status = ${status}`;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        requested_by: await getCreatedUserNameFromAdmin(element.created_by),
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: values,
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

/** Create Response api for survey response */

const createSurveyResponse = async (req, res, next) => {
    try {
        const { survey_id, response } = req.body;
        if (!survey_id || !response) {
            return res.status(400).json({
                status: false,
                message: "all fields survey_id and response data",
            });
        }

        //already response exits check

        const recordCheck = await getRecord("survey_question_responses", "survey_id", survey_id);

        if (recordCheck.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Survey response already added",
            });
        }

        const surveyResponseQuery = `INSERT INTO survey_question_responses (survey_id , response , response_by) VALUES ( ? , ? , ? )`;
        const result = await db.query(surveyResponseQuery, [survey_id, JSON.stringify(response), req.user.user_id]);
        if (result.insertId > 0) {
            return res.status(200).json({
                status: true,
                message: "Survey Response added successfully",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
            });
        }
    } catch (error) {
        return next(error);
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const getSurveyResponse = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const id = req.params.id;
        const whereCondition = id ? `WHERE survey_question_responses.id = ${id}` : "";
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID;

        let searchDataCondition = "";
        if (searchData != null && searchData != "") {
            searchDataCondition = `WHERE survey.title LIKE '%${searchData}%'`;
        }

        const countSelectQuery = `SELECT COUNT(survey_question_responses.id) as total FROM survey_question_responses`;
        const constTotalLength = await db.query(countSelectQuery);

        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const pageStartResult = (currentPage - 1) * pageSize + 1;
        const pageEndResult = Math.min(currentPage * pageSize, total);
        let pageDetails = {
            pageSize,
            currentPage,
            totalPages,
            total,
            pageStartResult,
            pageEndResult,
        };
        const surveyResponseQuery = `SELECT survey_question_responses.*, survey.title as survey_name, admins.name as user_name FROM survey_question_responses
    LEFT JOIN admins ON  admins.id = survey_question_responses.response_by
    LEFT JOIN survey ON  survey.id = survey_question_responses.survey_id 
      ${searchDataCondition} ${whereCondition} ORDER BY survey_question_responses.id DESC`; // LIMIT ${pageFirstResult}, ${pageSize}

        const result = await db.query(surveyResponseQuery);
        for (let i = 0; i < result.length; i++) {
            let element = result[i];
            element.response = JSON.parse(element?.response || "[]");
        }
        if (result.length > 0) {
            return res.status(200).json({
                status: true,
                message: "survey responses fetch successfully",
                data: result,
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "survey responses not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createSurvey,
    getAllSurvey,
    getSurveyById,
    editSurveyDetails,
    updateSurveyDetails,
    deleteSurvey,
    getAssignedSurvey,
    getRequestedSurvey,
    getSurveyQuestionResponse,
    assignToSurvey,
    updateRequestedSurveyStatus,
    surveyQuestionFormResponse,
    otpSendSurvey,
    VerifyOtpSurvey,
    getSurveyResponseById,
    getAllRequestedSurvey,
    createSurveyResponse,
    getSurveyResponse,
};

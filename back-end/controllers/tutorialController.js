var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, tutorialValidations } = require("../helpers/validation");
const { roleById } = require("../helpers/general");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const createTutorial = async (req, res, next) => {
    try {
        const { user_type, application_type, module_type, tutorial_format, description } = req.body;
        const { error } = tutorialValidations.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const createdBy = req.user.user_id;
        let storePath = "";

        if (req.files != null) {
            const image = req.files.attachment;

            const array_of_allowed_audio = ["mp3", "aac", "flac", "wav"];
            const array_of_allowed_video = ["mp4", "webm", "mkv", "mpeg-2", "avi"];
            const array_of_allowed_excel = ["xlsx", "xlsm", "xlsb", "xls", "xls", "csv"];
            const array_of_allowed_docs = ["txt", "csv", "dif", "ppt", "pptx", "doc", "docx"];
            const array_of_allowed_pdf = ["pdf"];
            const array_of_allowed_image = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp"];

            // Array of allowed files
            const array_of_allowed_files = array_of_allowed_audio.concat(
                array_of_allowed_video,
                array_of_allowed_excel,
                array_of_allowed_docs,
                array_of_allowed_pdf,
                array_of_allowed_image
            );

            // Get the extension of the uploaded file
            const file_extension = image.name.slice(((image.name.lastIndexOf(".") - 1) >>> 0) + 2);

            // Check if the uploaded file is allowed
            if (!array_of_allowed_files.includes(file_extension)) {
                return res.status(403).json({ status: false, message: "This file is not allowed to be uploaded" });
            }

            var matchedData = "";
            switch (tutorial_format) {
                case "audio":
                    let isCorrectAudio = array_of_allowed_audio.includes(file_extension);
                    if (!isCorrectAudio) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "video":
                    let isCorrectVideo = array_of_allowed_video.includes(file_extension);
                    if (!isCorrectVideo) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "excel":
                    let isCorrectDocs = array_of_allowed_excel.includes(file_extension);
                    if (!isCorrectDocs) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;
                case "text":
                    let isCorrectExcel = array_of_allowed_docs.includes(file_extension);
                    if (!isCorrectExcel) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "pdf":
                    let isCorrectPdf = array_of_allowed_pdf.includes(file_extension);
                    if (!isCorrectPdf) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "image":
                    let isCorrectImage = array_of_allowed_image.includes(file_extension);
                    if (!isCorrectImage) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;
                default:
                    matchedData = "ok";
            }

            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/tutorials/" + imageName;
            storePath = "/tutorials/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).status({ status: false, message: err, message });
            });
        } else {
            return res.status(404).json({ status: false, message: "Please select file" });
        }

        const insertQuery = `INSERT INTO tutorials (user_type, application_type, module_type, tutorial_format, attachment, description, created_by) VALUES('${user_type}', '${application_type}', '${module_type}', '${tutorial_format}', '${storePath}', '${description}', '${createdBy}')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Tutorial created successfully" });
            } else {
                return res.status(404).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTutorials = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM tutorials WHERE is_deleted = '0'`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        let total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        // const isDropdown = req.query.isDropdown ?? null;

        let selectQuery;

        if (searchData != null && searchData != "") {
            selectQuery = `SELECT tutorials.*, roles.name as user_type_name FROM tutorials INNER JOIN roles ON roles.id=tutorials.user_type WHERE (tutorial_format LIKE '%${searchData}%' OR tutorials.module_type LIKE '%${searchData}%' OR tutorials.description LIKE '%${searchData}%') AND tutorials.is_deleted = '0' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        } else {
            selectQuery = `SELECT tutorials.*, roles.name as user_type_name FROM tutorials INNER JOIN roles ON roles.id=tutorials.user_type WHERE tutorials.is_deleted = '0' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        // if(isDropdown) {
        //     selectQuery = `SELECT DISTINCT tutorial_format FROM tutorials WHERE is_deleted = '0' ORDER BY id DESC`;
        // }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "tutorials",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                let pageDetails = [];
                total = result.length
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
                // console.log('pageDetails: ', pageDetails);
                
                // console.log('pageDetails: ', pageDetails);
                // if(isDropdown){
                //     return res.status(200).json({
                //         status: true,
                //         message: "Fetched successfully",
                //         data: result,
                //     });
                // } else {
                    return res.status(200).json({
                        status: true,
                        message: "Fetched successfully",
                        data: result,
                        pageDetails: pageDetails[0],
                    });
                // }

            } else {
                return res.status(200).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTutorialByFormat = async (req, res, next) => {
    try {
        // const format = req.params.format;
        // const id = req.params.id;

        const getTutorialQuery = `SELECT DISTINCT tutorial_format, MAX(id) AS id FROM tutorials WHERE is_deleted = '0' GROUP BY tutorial_format`;
        db.query(getTutorialQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    // const userTypeName = await roleById(element.user_type);
                    return {
                        ...element,
                        id: element.id,
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: `Fetched successfully`, data: values });
                });
                // return res.status(200).json({status: true, message: "Fetched successfully", data: result})
            } else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTutorialById = async (req, res, next) => {
    try {
        const format = req.params.id;

        const getTutorialQuery = `SELECT * FROM tutorials WHERE id = '${format}' AND is_deleted = '0'`;
        db.query(getTutorialQuery, async (err, result) => {
            if (err) return res.status(200).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    const userTypeName = await roleById(element.user_type);
                    const applicationTypeArray = [];
                    element.application_type.split(",").map((item) => {
                        return applicationTypeArray.push(item)
                    })
                    return {
                        ...element,
                        user_type_name: userTypeName.name,
                        application_type: applicationTypeArray
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] });
                });
                //res.status(200).json({status: true, message: "Fetched successfully", data: result})
            } else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateTutorials = async (req, res, next) => {
    try {
        const { user_type, application_type, module_type, tutorial_format, description, id } = req.body;
        const { error } = tutorialValidations.validate({
            user_type: user_type,
            application_type: application_type,
            module_type: module_type,
            tutorial_format: tutorial_format,
            description: description,
        });
        if (error) return res.status(400).json({ status: false, message: error.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        var storePath = "";

        if (req.files != null) {
            const image = req.files.attachment;

            const array_of_allowed_audio = ["mp3", "aac", "flac", "wav"];
            const array_of_allowed_video = ["mp4", "webm", "mkv", "mpeg-2", "avi"];
            const array_of_allowed_excel = ["xlsx", "xlsm", "xlsb", "xls", "xls"];
            const array_of_allowed_docs = ["txt", "csv", "dif", "ppt", "pptx", "doc", "docx"];
            const array_of_allowed_pdf = ["pdf"];
            const array_of_allowed_image = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp"];
            // Array of allowed files
            const array_of_allowed_files = array_of_allowed_audio.concat(
                array_of_allowed_video,
                array_of_allowed_excel,
                array_of_allowed_docs,
                array_of_allowed_pdf,
                array_of_allowed_image
            );

            // Get the extension of the uploaded file
            const file_extension = image.name.slice(((image.name.lastIndexOf(".") - 1) >>> 0) + 2);

            // Check if the uploaded file is allowed
            if (!array_of_allowed_files.includes(file_extension)) {
                return res.status(403).json({ status: false, message: "This file is not allowed to be uploaded" });
            }

            var matchedData = "";
            switch (tutorial_format) {
                case "audio":
                    let isCorrectAudio = array_of_allowed_audio.includes(file_extension);
                    if (!isCorrectAudio) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "video":
                    let isCorrectVideo = array_of_allowed_video.includes(file_extension);
                    if (!isCorrectVideo) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "excel":
                    let isCorrectDocs = array_of_allowed_excel.includes(file_extension);
                    if (!isCorrectDocs) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;
                case "text":
                    let isCorrectExcel = array_of_allowed_docs.includes(file_extension);
                    if (!isCorrectExcel) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "pdf":
                    let isCorrectPdf = array_of_allowed_pdf.includes(file_extension);
                    if (!isCorrectPdf) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;

                case "image":
                    let isCorrectImage = array_of_allowed_image.includes(file_extension);
                    if (!isCorrectImage) {
                        return res
                            .status(403)
                            .json({ status: false, message: "Tutorial format not matched with file" });
                    }
                    matchedData = "ok";
                    break;
                default:
                    matchedData = "ok";
            }

            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/tutorials/" + imageName;
            storePath = "/tutorials/" + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).status({ status: false, message: err, message });
            });
        } else {
            storePath = req.body.attachment;
        }

        const updateQuery = `UPDATE tutorials SET user_type='${user_type}', application_type='${application_type}', module_type='${module_type}', tutorial_format='${tutorial_format}', attachment='${storePath}', description='${description}', updated_at='${updatedAt}' WHERE id = '${id}' AND is_deleted = '0'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Tutorial updated successfully" });
            } else {
                return res.status(404).json({ status: false, message: "Tutorial does not exist" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const deleteTutorialsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(400).json({ status: false, message: error.message });

        // const deleteQuery = `DELETE FROM tutorials WHERE id = '${id}'`;
        const deleteQuery = `UPDATE tutorials SET is_deleted = '${process.env.DELETED}' WHERE id = '${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Tutorial deleted successfully" });
            } else {
                return res.status(404).json({ status: false, message: "Tutorial does not exist" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createTutorial,
    getTutorials,
    getTutorialByFormat,
    updateTutorials,
    deleteTutorialsById,
    getTutorialById,
};

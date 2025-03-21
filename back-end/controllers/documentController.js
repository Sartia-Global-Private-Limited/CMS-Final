var moment = require("moment");
var fs = require("fs");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, addDocumentValidations } = require("../helpers/validation");
const { getUploadedFileExtension, getMultipleUsersOnId, calculatePagination, getMultipleAdminUsersOnId } = require("../helpers/general");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const createDocumentCategory = async (req, res, next) => {
    try {
        const { category, title, description } = req.body;
        const createdBy = req.user.user_id;
        const insertDocumentCategory = `INSERT INTO document_categories(category, title, description, created_by) VALUES('${category}', '${title}', '${description}', '${createdBy}')`;

        db.query(insertDocumentCategory, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document Category created successfully" });
            } else {
                res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllDocumentCategory = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        let searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_cond = "";
        if (searchData != "") {
            search_cond = `WHERE category LIKE '%${searchData}%' OR title LIKE '%${searchData}%' OR description  LIKE '%${searchData}%'`;
        } else {
            searchData = `WHERE document_categories.created_by = '${req.user.user_id}'`;
        }
        const selectQuery = `SELECT * FROM document_categories ${search_cond} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const result = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (result.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            res.status(200).json({
                status: true,
                pageDetails: pageDetails,
                message: "Fetched successfully",
                data: result,
            });
        } else {
            return res.status(200).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getDocumentCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM document_categories WHERE id = '${id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateDocumentCategory = async (req, res, next) => {
    try {
        const id = req.body.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const { category, title, description } = req.body;
        const updatedAT = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateDocumentCategory = `UPDATE document_categories SET category = '${category}', title = '${title}', description = '${description}', updated_at = '${updatedAT}' WHERE id = '${id}'`;

        db.query(updateDocumentCategory, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document Category updated successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const removeDocumentCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const deleteDocumentCategory = `DELETE FROM document_categories WHERE id = '${id}'`;

        db.query(deleteDocumentCategory, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document Category deleted successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const addDocuments = async (req, res, next) => {
    try {
        const { category_id, user_type, user_id, remarks } = req.body;
        const { error } = addDocumentValidations.validate(req.body);
        if (error) return res.status(500).json({ status: false, message: error.message });
        const createdBy = req.user.user_id || 0;
        let storePath = "";
        let jsonArr = [];
        if (req.files != null) {
            if (req.files.images.length == undefined) {
                const image = req.files.images;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/documents/" + imageName;
                storePath = "/documents/" + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({ status: false, message: err.message });
                });
                // jsonArr.push({ storePath: storePath });
                // storePath = JSON.stringify(storePath);
                // console.log('storePath1: ', storePath);
                jsonArr.push(storePath);
            } else {
                for (i = 0; i < req.files.images.length; i++) {
                    const image = req.files.images[i];
                    const imageName = Date.now() + image.name;
                    const uploadPath = process.cwd() + "/public/documents/" + imageName;
                    storePath = "/documents/" + imageName;
                    image.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                    // jsonArr.push({ storePath: storePath });
                    // console.log('storePath2: ', storePath);
                    jsonArr.push(storePath);
                }
            }
        }

        const obj = JSON.stringify(jsonArr);
        const formatUserIds = JSON.stringify(user_id);
        const insertDocuments = `INSERT INTO documents(document_category_id, user_type, user_id, image, remark, created_by) VALUES('${category_id}', '${user_type}', '${formatUserIds}', '${obj}', '${remarks}', '${createdBy}')`;
        db.query(insertDocuments, async (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (results.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document added successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllDocuments = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(documents.id) as total FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        const role_id = req.user.user_type || 0;
        let whereCond = "";
        if (searchData != null && searchData != "") {
            whereCond = ` WHERE document_categories.title LIKE '%${searchData}%' `;
        } else {
            whereCond = `WHERE documents.created_by = '${req.user.user_id}'`;
        }

        let selectQuery = `SELECT documents.id as document_id, documents.user_id, documents.image, documents.remark, documents.created_at, document_categories.category, document_categories.title FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id ${whereCond} ORDER BY documents.id DESC limit ${pageFirstResult} , ${pageSize}`;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "documents",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        db.query(selectQuery, async (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (results.length > process.env.VALUE_ZERO) {
                const final = results.map(async (element) => {
                    let users;
                    if(role_id == 1) {
                        users = await getMultipleAdminUsersOnId(element.user_id);
                    } else {
                        users = await getMultipleUsersOnId(element.user_id);
                    }
                    return {
                        document_id: element.document_id,
                        created_at: element.created_at,
                        category: element.category,
                        title: element.title,
                        remark: element.remark,
                        fileExtension: element.image != "" && await getUploadedFileExtension(element.image) || "",
                        image: element.image != "" && JSON.parse(element.image) || [],
                        user_ids: element.user_id != "" && JSON.parse(JSON.parse(element.user_id)),
                        users: users,
                    };
                });

                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                let pageDetails = [];
                pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

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

const viewDocuments = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });
        const role_id = req.user.user_type || 0;

        let selectQuery = `
            SELECT documents.*, document_categories.title, roles.name as user_type_name 
            FROM documents 
            INNER JOIN document_categories ON document_categories.id = documents.document_category_id 
            INNER JOIN roles ON roles.id = documents.user_type 
            WHERE documents.id = '${id}'`;
        
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    if(role_id == 1) {
                        // console.log(element.image)
                        return {
                            ...element,
                            user_id: element.user_id != "" && JSON.parse(JSON.parse(element.user_id))[0] || "",
                            image: element.image != "" && JSON.parse(element.image) || [],
                            fileExtension: element.image != "" && await getUploadedFileExtension(element.image) || "",
                            users: await getMultipleAdminUsersOnId(element.user_id),
                        };
                    } else {
                        return {
                            ...element,
                            user_id: element.user_id != "" && JSON.parse(JSON.parse(element.user_id))[0] || "",
                            image: element.image != "" && JSON.parse(element.image) || [],
                            fileExtension: element.image != "" && await getUploadedFileExtension(element.image) || "",
                            users: await getMultipleUsersOnId(element.user_id),
                        };
                    }
                    
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] });
                });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getDocumentOnCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        const selectQuery = `SELECT documents.id as document_id, documents.image, documents.remark, documents.created_at, document_categories.category, document_categories.title FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id WHERE document_categories.id='${id}' ORDER BY documents.id DESC`;

        db.query(selectQuery, async (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (results.length > process.env.VALUE_ZERO) {
                const final = results.map(async (element) => {
                    return {
                        document_id: element.document_id,
                        created_at: element.created_at,
                        category: element.category,
                        title: element.title,
                        remark: element.remark,
                        fileExtension: await getUploadedFileExtension(element.image),
                        image: element.image,
                    };
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values });
                });
            } else {
                return res.status(403).json({ status: false, message: "Data not found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const removeDocumentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(500).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM documents WHERE id='${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document deleted successfully" });
            } else {
                return res.status(404).json({ status: true, message: "Something went wrong, please try again later" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updateDocuments = async (req, res, next) => {
    try {
        const { category_id, user_type, user_id, remarks, id, images } = req.body;
        const { error } = addDocumentValidations.validate(req.body);
        if (error) return res.status(500).json({ status: false, message: error.message });

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updated_by = req.user.user_id;
        let storePath = "";
        let jsonArr = [];
        let obj = [];

        if (req.files != null) {
            if (req.files.images.length == undefined) {
                const image = req.files.images;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/documents/" + imageName;
                storePath = "/documents/" + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({ status: false, message: err.message });
                });
                jsonArr.push(storePath);
            } else {
                for (i = 0; i < req.files.images.length; i++) {
                    const image = req.files.images[i];
                    const imageName = Date.now() + image.name;
                    const uploadPath = process.cwd() + "/public/documents/" + imageName;
                    storePath = "/documents/" + imageName;
                    image.mv(uploadPath, (err, response) => {
                        if (err) return res.status(400).json({ status: false, message: err.message });
                    });
                    jsonArr.push(storePath);
                }
            }
            obj = JSON.stringify(jsonArr);
            const imageData = await db.query(`SELECT image FROM documents WHERE id="${id}";`);
            if (imageData && imageData.length > 0) {
                let imgList = imageData[0].image != "" && JSON.parse(imageData[0].image);
                if (imgList.length > 0) {
                    for (let index = 0; index < imgList.length; index++) {
                        if (fs.existsSync("public/" + imgList[index].storePath)) {
                            fs.unlinkSync("public/" + imgList[index].storePath);
                        }
                    }
                }
            } 
        } else {
            // console.log('images: ', images);
            if(images != undefined) {
                if(Array.isArray(images)) {
                    jsonArr = images;
                    obj =  JSON.stringify(jsonArr);
                } else {
                    jsonArr.push(images);
                    obj =  JSON.stringify(jsonArr);
                }
                
            } else {
                obj = ""
            }
            
        }
        
        const formatUserIds = JSON.stringify(user_id);

        const updateDocuments = `UPDATE documents SET document_category_id = '${category_id}', user_type  = '${user_type}', user_id  = '${formatUserIds}', image  = '${obj}', remark  = '${remarks}', updated_by='${updated_by}', updated_at = '${updatedAt}' WHERE id = '${id}'`;

        db.query(updateDocuments, async (err, results) => {
            if (err) return res.status(403).json({ status: false, message: err.message });

            if (results.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Document updated successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createDocumentCategory,
    getAllDocumentCategory,
    getDocumentCategoryById,
    updateDocumentCategory,
    removeDocumentCategoryById,
    addDocuments,
    getAllDocuments,
    viewDocuments,
    getDocumentOnCategoryById,
    removeDocumentById,
    updateDocuments,
};

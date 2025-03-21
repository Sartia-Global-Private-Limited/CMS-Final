require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");
const {
    calculatePagination,
    getComplaintById,
    getCreatedByDetails,
    getOutletById,
    getComplaintAndComplaintTypeById,
} = require("../helpers/general");
const Joi = require("joi");
let moment = require("moment");
const sharp = require("sharp");
const fs = require("fs");
const PPTX = require("nodejs-pptx");
const path = require("path");
const { startsWith } = require("lodash");
const fontList = require("font-list");

const uploadComplaintImages = async (req, res, next) => {
    try {
        const { complaint_id, full_slide_color, heading_text_color, presentation_title, main_image } = req.body;

        let beforeImageAndtext = [];
        let afterImageAndtext = [];
        let progressImageAndtext = [];
        var image_upload_by_id = req.user.user_id;
        var slideTitle = [];
        var slideTitleColor = [];

        if (main_image != null) {
            for (const main of main_image) {
                slideTitle.push(main.row_title);
                slideTitleColor.push(main.row_title_color);

                if (main.before_image != null && main.before_image != "") {
                    const beforeRow = main.before_image;
                    const title = beforeRow.title;
                    const title_bg_color = beforeRow.title_bg_color;
                    const title_text_color = beforeRow.title_text_color;
                    const description_text_color = beforeRow.description_text_color;
                    const description = beforeRow.description;
                    const image_type = "before";
                    const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                    const result = await uploadBeforeImages(
                        base64File,
                        title,
                        description,
                        title_bg_color,
                        title_text_color,
                        description_text_color,
                        complaint_id,
                        image_type,
                        presentation_title
                    );

                    beforeImageAndtext.push(result);
                }

                if (main.progress_image != null && main.progress_image != "") {
                    const beforeRow = main.progress_image;
                    const title = beforeRow.title;
                    const title_bg_color = beforeRow.title_bg_color;
                    const title_text_color = beforeRow.title_text_color;
                    const description_text_color = beforeRow.description_text_color;
                    const description = beforeRow.description;
                    const image_type = "working";
                    const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                    if (base64File != null && base64File != "") {
                        const result = await uploadBeforeImages(
                            base64File,
                            title,
                            description,
                            title_bg_color,
                            title_text_color,
                            description_text_color,
                            complaint_id,
                            image_type,
                            presentation_title
                        );
                        progressImageAndtext.push(result);
                    }
                }

                if (main.after_image != null && main.after_image != "") {
                    const beforeRow = main.after_image;
                    const title = beforeRow.title;
                    const title_bg_color = beforeRow.title_bg_color;
                    const title_text_color = beforeRow.title_text_color;
                    const description_text_color = beforeRow.description_text_color;
                    const description = beforeRow.description;
                    const image_type = "after";
                    const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                    const result = await uploadBeforeImages(
                        base64File,
                        title,
                        description,
                        title_bg_color,
                        title_text_color,
                        description_text_color,
                        complaint_id,
                        image_type,
                        presentation_title
                    );
                    afterImageAndtext.push(result);
                }
            }
        }

        // Now, you can save each image's information separately in the database
        const beforeImageInfo = JSON.stringify(beforeImageAndtext);
        const progressImageInfo = JSON.stringify(progressImageAndtext);
        const afterImageInfo = JSON.stringify(afterImageAndtext);

        // insert data into the database
        const insertQuery = await db.query(
            "INSERT INTO complaint_images (complaint_id, image_upload_by, presentation_title, slide_title, slide_title_color, full_slide_color, heading_text_color, before_image, progress_image, after_image, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                complaint_id,
                image_upload_by_id,
                presentation_title,
                JSON.stringify(slideTitle),
                JSON.stringify(slideTitleColor),
                full_slide_color,
                heading_text_color,
                beforeImageInfo,
                progressImageInfo,
                afterImageInfo,
                req.user.user_id,
            ]
        );

        if (insertQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Images uploaded successfully",
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

/** get all uploaded complaint images */
const getAllUploadedImages = async (req, res, next) => {
    try {
        //pagination code for

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["complaint_types.complaint_type_name", "complaints.complaint_unique_id"];
        const searchConditions = [];
        const status = req.query.status || "";

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY complaint_images.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `
        SELECT complaint_images.id, complaint_images.complaint_id, complaint_images.image_upload_by, complaint_images.slide_title, complaint_images.before_image, complaint_images.progress_image, complaint_images.progress_image, complaint_images.after_image, complaint_images.status, complaints.complaint_unique_id, complaint_types.complaint_type_name 
        FROM complaint_images 
        LEFT JOIN complaints ON complaints.id = complaint_images.complaint_id 
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        ${status ? `WHERE complaint_images.status = '${status}'` : ""}  
        ${searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")} ` : ""} 
        ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove order by limit for totaL PAGINATION COUNT
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let index = 0; index < queryResult.length; index++) {
                const element = queryResult[index];
                const imageUploadByName = await getCreatedByDetails(element.image_upload_by);

                const slideTitleArray = JSON.parse(element.slide_title) || [];
                const beforeImageArray = JSON.parse(element.before_image) || [];
                const progressImageArray = JSON.parse(element.progress_image) || [];
                const afterImageArray = JSON.parse(element.after_image) || [];

                // Creating main_image array with all elements
                const mainImage = slideTitleArray.map((slide, slideIndex) => {
                    return {
                        row_title: slide || "", // You might want to adjust this based on your actual data structure
                        before_image: {
                            title: beforeImageArray[slideIndex]?.title || "",
                            description: beforeImageArray[slideIndex]?.description || "",
                            file: beforeImageArray[slideIndex]?.file || "",
                        },
                        progress_image: {
                            title: progressImageArray[slideIndex]?.title || "",
                            description: progressImageArray[slideIndex]?.description || "",
                            file: progressImageArray[slideIndex]?.file || "",
                        },
                        after_image: {
                            title: afterImageArray[slideIndex]?.title || "",
                            description: afterImageArray[slideIndex]?.description || "",
                            file: afterImageArray[slideIndex]?.file || "",
                        },
                    };
                });
                finalData.push({
                    id: element.id,
                    complaint_id: element.complaint_id,
                    complaint_unique_id: element.complaint_unique_id,
                    complaint_type_name: element.complaint_type_name,
                    status: element?.status || "",
                    image_upload_by: element.image_upload_by,
                    image_upload_by_name: imageUploadByName.name,
                    main_image: mainImage,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
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

const getSingleUploadedImagesById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const query = `SELECT complaint_images.id, complaint_images.presentation_title, complaint_images.slide_title, complaint_images.slide_title_color, complaint_images.full_slide_color, complaint_images.heading_text_color, complaint_images.complaint_id, complaint_images.image_upload_by, complaint_images.before_image, complaint_images.progress_image, complaint_images.progress_image, complaint_images.after_image, complaints.complaint_unique_id, complaint_types.complaint_type_name 
        FROM complaint_images 
        LEFT JOIN complaints ON complaints.id = complaint_images.complaint_id 
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type 
        WHERE complaint_images.id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (let index = 0; index < queryResult.length; index++) {
                const element = queryResult[index];
                const imageUploadByName = await getCreatedByDetails(element.image_upload_by);

                const slideTitleArray = JSON.parse(element.slide_title) || [];
                const slideTitleColorArray = JSON.parse(element.slide_title_color) || [];
                const beforeImageArray = JSON.parse(element.before_image) || [];
                const progressImageArray = JSON.parse(element.progress_image) || [];
                const afterImageArray = JSON.parse(element.after_image) || [];

                // Creating main_image array with all elements
                const mainImage = slideTitleArray.map((slide, slideIndex) => {
                    return {
                        row_title: slide || "",
                        row_title_color: slideTitleColorArray[slideIndex],
                        before_image: {
                            title: beforeImageArray[slideIndex]?.title || "",
                            description: beforeImageArray[slideIndex]?.description || "",
                            file: beforeImageArray[slideIndex]?.file || "",
                            title_bg_color: beforeImageArray[slideIndex]?.title_bg_color,
                            title_text_color: beforeImageArray[slideIndex]?.title_text_color,
                            description_text_color: beforeImageArray[slideIndex]?.description_text_color,
                        },
                        progress_image: {
                            title: progressImageArray[slideIndex]?.title || "",
                            description: progressImageArray[slideIndex]?.description || "",
                            file: progressImageArray[slideIndex]?.file || "",
                            title_bg_color: progressImageArray[slideIndex]?.title_bg_color,
                            title_text_color: progressImageArray[slideIndex]?.title_text_color,
                            description_text_color: progressImageArray[slideIndex]?.description_text_color,
                        },
                        after_image: {
                            title: afterImageArray[slideIndex]?.title || "",
                            description: afterImageArray[slideIndex]?.description || "",
                            file: afterImageArray[slideIndex]?.file || "",
                            title_bg_color: afterImageArray[slideIndex]?.title_bg_color,
                            title_text_color: afterImageArray[slideIndex]?.title_text_color,
                            description_text_color: afterImageArray[slideIndex]?.description_text_color,
                        },
                    };
                });
                finalData.push({
                    id: element.id,
                    complaint_id: element.complaint_id,
                    complaint_unique_id: element.complaint_unique_id,
                    complaint_type_name: element.complaint_type_name,
                    image_upload_by: element.image_upload_by,
                    image_upload_by_name: imageUploadByName.name,
                    full_slide_color: element.full_slide_color,
                    heading_text_color: element.heading_text_color,
                    presentation_title: element.presentation_title,
                    main_image: mainImage,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
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

const updateComplaintImages = async (req, res, next) => {
    try {
        const { complaint_id, full_slide_color, heading_text_color, presentation_title, main_image, id } = req.body;

        let beforeImageAndtext = [];
        let afterImageAndtext = [];
        let progressImageAndtext = [];
        var image_upload_by_id = req.user.user_id;
        var updated_by = image_upload_by_id;
        var slideTitle = [];
        var slideTitleColor = [];

        if (main_image != null) {
            for (const main of main_image) {
                slideTitle.push(main.row_title);
                slideTitleColor.push(main.row_title_color);

                if (main.before_image != null && main.before_image != "") {
                    const beforeRow = main.before_image;
                    if (beforeRow.file.startsWith("data:image")) {
                        const title = beforeRow.title;
                        const description = beforeRow.description;
                        const title_bg_color = beforeRow.title_bg_color;
                        const title_text_color = beforeRow.title_text_color;
                        const description_text_color = beforeRow.description_text_color;
                        const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                        const result = await uploadBeforeImages(
                            base64File,
                            title,
                            description,
                            title_bg_color,
                            title_text_color,
                            description_text_color,
                            complaint_id
                        );
                        beforeImageAndtext.push(result);
                    } else {
                        beforeImageAndtext.push(beforeRow);
                    }
                }

                if (main.progress_image != null && main.progress_image != "") {
                    const beforeRow = main.progress_image;

                    if (beforeRow.file.startsWith("data:image")) {
                        const title = beforeRow.title;
                        const description = beforeRow.description;
                        const title_bg_color = beforeRow.title_bg_color;
                        const title_text_color = beforeRow.title_text_color;
                        const description_text_color = beforeRow.description_text_color;
                        const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                        const result = await uploadBeforeImages(
                            base64File,
                            title,
                            description,
                            title_bg_color,
                            title_text_color,
                            description_text_color,
                            complaint_id
                        );
                        progressImageAndtext.push(result);
                    } else {
                        progressImageAndtext.push(beforeRow);
                    }
                }

                if (main.after_image != null && main.after_image != "") {
                    const beforeRow = main.after_image;
                    if (beforeRow.file.startsWith("data:image")) {
                        const title = beforeRow.title;
                        const description = beforeRow.description;
                        const title_bg_color = beforeRow.title_bg_color;
                        const title_text_color = beforeRow.title_text_color;
                        const description_text_color = beforeRow.description_text_color;
                        const base64File = beforeRow.file.replace(/^data:image\/\w+;base64,/, "");
                        const result = await uploadBeforeImages(
                            base64File,
                            title,
                            description,
                            title_bg_color,
                            title_text_color,
                            description_text_color,
                            complaint_id
                        );
                        afterImageAndtext.push(result);
                    } else {
                        afterImageAndtext.push(beforeRow);
                    }
                }
            }
        }

        // Now, you can save each image's information separately in the database
        const beforeImageInfo = JSON.stringify(beforeImageAndtext.flat());
        const progressImageInfo = JSON.stringify(progressImageAndtext.flat());
        const afterImageInfo = JSON.stringify(afterImageAndtext.flat());

        // insert data into the database
        const insertQuery = await db.query(
            "UPDATE complaint_images SET complaint_id = ?, image_upload_by = ?, presentation_title = ?, slide_title = ?, slide_title_color = ?, before_image = ?, progress_image  = ?, after_image  = ?, full_slide_color = ?, heading_text_color = ?, updated_by = ? WHERE id = ?",
            [
                complaint_id,
                image_upload_by_id,
                presentation_title,
                JSON.stringify(slideTitle),
                JSON.stringify(slideTitleColor),
                beforeImageInfo,
                progressImageInfo,
                afterImageInfo,
                full_slide_color,
                heading_text_color,
                updated_by,
                id,
            ]
        );

        if (insertQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Complaints Images updated successfully",
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

const deleteComplaintWorkImages = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = await db.query("DELETE FROM complaint_images WHERE  id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Complaint images deleted successfully",
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

const getComplaintImagesForPPT = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const query = `SELECT complaints.id, complaint_images.complaint_id, complaint_images.image_upload_by, complaint_images.presentation_title, complaint_images.slide_title, complaint_images.slide_title_color, complaint_images.heading_text_color, complaint_images.full_slide_color, complaint_images.image_upload_by, complaint_images.before_image, complaint_images.progress_image, complaint_images.after_image, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_images ON complaints.id = complaint_images.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.id = ?`;

        const queryResult = await db.query(query, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            let pptx = new PPTX.Composer();

            await pptx.compose(async (pres) => {
                pres.title("Complaint Presentation")
                    .author("CMS Electricals")
                    .company("CMS Electricals Pvt Ltd")
                    .revision("1.0")
                    .subject("Complaint Details Presentation")
                    .layout("landscape"); // Set layout to landscape;

                // Loop through your query results and add slides
                for (let index = 0; index < queryResult.length; index++) {
                    const element = queryResult[index];

                    const slideTitleArray = JSON.parse(element.slide_title) || [];
                    const slideTitleColorArray = JSON.parse(element.slide_title_color) || [];
                    const beforeImageArray = JSON.parse(element.before_image) || [];
                    const progressImageArray = JSON.parse(element.progress_image) || [];
                    const afterImageArray = JSON.parse(element.after_image) || [];
                    const HeadingTextColor = element.heading_text_color;
                    const fullSlideColor = element.full_slide_color;

                    // get ppt prepare name and employee id
                    const preparedDetails = await getCreatedByDetails(element.image_upload_by);

                    // Creating main_image array with all elements
                    const mainImage = slideTitleArray.map((slide, slideIndex) => {
                        return {
                            row_title: slide || "",
                            row_title_color: slideTitleColorArray[slideIndex],
                            heading_text_color: HeadingTextColor,
                            full_slide_color: fullSlideColor,
                            before_image: {
                                title: beforeImageArray[slideIndex]?.title || "",
                                description: beforeImageArray[slideIndex]?.description || "",
                                file: beforeImageArray[slideIndex]?.file || "",
                                title_bg_color: beforeImageArray[slideIndex]?.title_bg_color,
                                title_text_color: beforeImageArray[slideIndex]?.title_text_color,
                                description_text_color: beforeImageArray[slideIndex]?.description_text_color,
                            },
                            progress_image: {
                                title: progressImageArray[slideIndex]?.title || "",
                                description: progressImageArray[slideIndex]?.description || "",
                                file: progressImageArray[slideIndex]?.file || "",
                                title_bg_color: progressImageArray[slideIndex]?.title_bg_color,
                                title_text_color: progressImageArray[slideIndex]?.title_text_color,
                                description_text_color: progressImageArray[slideIndex]?.description_text_color,
                            },
                            after_image: {
                                title: afterImageArray[slideIndex]?.title || "",
                                description: afterImageArray[slideIndex]?.description || "",
                                file: afterImageArray[slideIndex]?.file || "",
                                title_bg_color: afterImageArray[slideIndex]?.title_bg_color,
                                title_text_color: afterImageArray[slideIndex]?.title_text_color,
                                description_text_color: afterImageArray[slideIndex]?.description_text_color,
                            },
                        };
                    });

                    finalData.push({
                        id: element.id,
                        complaint_id: element.complaint_id,
                        complaint_unique_id: element.complaint_unique_id,
                        complaint_type_name: element.complaint_type_name,
                        presentation_title: element.presentation_title,
                        image_upload_by: element.image_upload_by,
                        image_upload_by_name: preparedDetails.name,
                        image_upload_by_employee_id: preparedDetails.employee_id,
                        main_image: mainImage,
                    });

                    pres.addSlide(async (slide) => {
                        // Add the logo and image inline
                        const logoPath =
                            "C:\\xampp\\htdocs\\CMS-Electricals-Platform\\Api\\public\\complaint_images\\logo.jpg";
                        const logoHeight = 100; // Update this based on your actual logo size
                        const logoTopMargin = 70; // Adjust this margin based on your design

                        const full_slide_color = mainImage[0].full_slide_color.replace("#", "");
                        // add dynamic background to whole slide
                        slide.backgroundColor(full_slide_color);

                        slide.addImage((image) => {
                            image.file(logoPath).x(250).y(50).cx(200); // Set the horizontal size of the image
                        });
                        // Add first text in the center
                        slide.addText((text) => {
                            text.value(finalData[0].presentation_title.toUpperCase())
                                .x(250)
                                .y(150)
                                .fontFace("Alien Encounters")
                                .fontSize(30)
                                .textColor("CC0000")
                                .textWrap("none")
                                .textAlign("center")
                                .textVerticalAlign("center")
                                .margin(0);
                        });

                        // Add first text in the center
                        slide.addText((text) => {
                            text.value("COMPLAINT ID : " + finalData[0].complaint_unique_id.toUpperCase())
                                .x(250)
                                .y(200)
                                .fontFace("Alien Encounters")
                                .fontSize(20)
                                .textColor("CC0000")
                                .textWrap("none")
                                .textAlign("center")
                                .textVerticalAlign("center")
                                .margin(0);
                        });

                        slide.addText((text) => {
                            text.value("COMPLAINT TYPE : " + finalData[0].complaint_type_name.toUpperCase())
                                .x(250)
                                .y(240)
                                .fontFace("Alien Encounters")
                                .fontSize(20)
                                .textColor("CC0000")
                                .textWrap("none")
                                .textAlign("center")
                                .textVerticalAlign("center")
                                .margin(0);
                        });

                        if (finalData[0].image_upload_by_name) {
                            const employee_id = finalData[0].image_upload_by_employee_id
                                ? finalData[0].image_upload_by_employee_id
                                : "";
                            slide.addText((text) => {
                                text.value(
                                    "PREPARED BY : " +
                                        finalData[0].image_upload_by_name.toUpperCase() +
                                        employee_id.toUpperCase()
                                )
                                    .x(250)
                                    .y(280)
                                    .fontFace("Alien Encounters")
                                    .fontSize(20)
                                    .textColor("CC0000")
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });
                        }
                    });
                    // Add slides for each mainImage
                    for (const image of mainImage) {
                        pres.addSlide(async (slide) => {
                            const row_title = image.row_title.toUpperCase();
                            const row_title_color = image.row_title_color.replace("#", "");
                            const heading_text_color = image.heading_text_color.replace("#", "");
                            const full_slide_color = image.full_slide_color.replace("#", "");

                            // add dynamic background to whole slide
                            slide.backgroundColor(full_slide_color);
                            // Add first text in the center
                            slide.addText((text) => {
                                text.value(row_title)
                                    .x(250)
                                    .y(50)
                                    .fontFace("Alien Encounters")
                                    .fontSize(30)
                                    .textColor(row_title_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });
                            // Calculate the height of the first text
                            const firstTextHeight = 30; // Update this based on your actual height calculation
                            const topMargin = 70; // Adjust this margin based on your design
                            const logoHeight = 200; // Update this based on your actual logo size

                            // Before Image Heading
                            slide.addText((text) => {
                                text.value("BEFORE IMAGE")
                                    .x(10) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 20)
                                    .fontFace("Alien Encounters")
                                    .fontSize(20)
                                    .textColor(heading_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // Before Image
                            const beforeCurrentFile = "./public" + image.before_image.file;
                            // Get the absolute path of the current file
                            const beforeAbsolutePath = path.resolve(beforeCurrentFile).replace(/\\/g, "\\\\");
                            const before_title_bg_color = image.before_image.title_bg_color.replace("#", "");
                            const before_title_text_color = image.before_image.title_text_color.replace("#", "");
                            const before_description_text_color = image.before_image.description_text_color.replace(
                                "#",
                                ""
                            );

                            slide.addImage((image) => {
                                image
                                    .file(beforeAbsolutePath)
                                    .x(10)
                                    .y(firstTextHeight + topMargin + 60)
                                    .cx(200) // Set the horizontal size of the image
                                    .cy(logoHeight); // Set the vertical size of the image
                            });

                            //return res.send(PPTX.ShapeTypes);
                            // Add a shape (button) on top of the image
                            slide.addShape({
                                type: PPTX.ShapeTypes.RECTANGLE,
                                x: 10,
                                y: firstTextHeight + topMargin + 250,
                                cx: 200,
                                cy: 50,
                                color: before_title_bg_color, // Set fill color to blue with alpha (transparency)
                            });

                            // before image title
                            const before_image_title = image.before_image.title.toUpperCase();
                            slide.addText((text) => {
                                text.value(before_image_title)
                                    .x(10) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 265)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(before_title_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // before image description
                            const before_image_description = image.before_image.description.toUpperCase();
                            slide.addText((text) => {
                                text.value(before_image_description)
                                    .x(10) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 320)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(before_description_text_color)
                                    .textAlign("left")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });
                            // progress Image Heading
                            slide.addText((text) => {
                                text.value("PROGRESS IMAGE")
                                    .x(260) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 20)
                                    .fontFace("Alien Encounters")
                                    .fontSize(20)
                                    .textColor(heading_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // Progress Image
                            const progressCurrentFile = "./public" + image.progress_image.file;
                            // Get the absolute path of the current file
                            const progressAbsolutePath = path.resolve(progressCurrentFile).replace(/\\/g, "\\\\");
                            const progress_title_bg_color = image.progress_image.title_bg_color.replace("#", "");
                            const progress_title_text_color = image.progress_image.title_text_color.replace("#", "");
                            const progress_description_text_color = image.progress_image.description_text_color.replace(
                                "#",
                                ""
                            );

                            slide.addImage((image) => {
                                image
                                    .file(progressAbsolutePath)
                                    .x(260)
                                    .y(firstTextHeight + topMargin + 60)
                                    .cx(200) // Set the horizontal size of the image
                                    .cy(logoHeight); // Set the vertical size of the image
                            });

                            slide.addShape({
                                type: PPTX.ShapeTypes.RECTANGLE,
                                x: 260,
                                y: firstTextHeight + topMargin + 250,
                                cx: 200,
                                cy: 50,
                                color: progress_title_bg_color, // Set fill color to blue with alpha (transparency)
                            });

                            // progress image title
                            const progress_image_title = image.progress_image.title.toUpperCase();
                            slide.addText((text) => {
                                text.value(progress_image_title)
                                    .x(260) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 265)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(progress_title_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // progress image description
                            const progress_image_description = image.progress_image.description.toUpperCase();
                            slide.addText((text) => {
                                text.value(progress_image_description)
                                    .x(260) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 320)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(progress_description_text_color)
                                    .textAlign("left")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // After Image Heading
                            slide.addText((text) => {
                                text.value("AFTER IMAGE")
                                    .x(500) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 20)
                                    .fontFace("Alien Encounters")
                                    .fontSize(20)
                                    .textColor(heading_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // After Image
                            const afterCurrentFile = "./public" + image.after_image.file;
                            // Get the absolute path of the current file
                            const afterAbsolutePath = path.resolve(afterCurrentFile).replace(/\\/g, "\\\\");
                            const after_title_bg_color = image.after_image.title_bg_color.replace("#", "");
                            const after_title_text_color = image.after_image.title_text_color.replace("#", "");
                            const after_description_text_color = image.after_image.description_text_color.replace(
                                "#",
                                ""
                            );

                            slide.addImage((image) => {
                                image
                                    .file(afterAbsolutePath)
                                    .x(500)
                                    .y(firstTextHeight + topMargin + 60)
                                    .cx(200) // Set the horizontal size of the image
                                    .cy(logoHeight); // Set the vertical size of the image
                            });
                            slide.addShape({
                                type: PPTX.ShapeTypes.RECTANGLE,
                                x: 500,
                                y: firstTextHeight + topMargin + 250,
                                cx: 200,
                                cy: 50,
                                color: after_title_bg_color, // Set fill color to blue with alpha (transparency)
                            });

                            // after image title
                            const after_image_title = image.after_image.title.toUpperCase();
                            slide.addText((text) => {
                                text.value(after_image_title)
                                    .x(500) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 265)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(after_title_text_color)
                                    .textWrap("none")
                                    .textAlign("center")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // after image description
                            const after_image_description = image.after_image.description.toUpperCase();
                            slide.addText((text) => {
                                text.value(after_image_description)
                                    .x(500) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 320)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(after_description_text_color)
                                    .textAlign("left")
                                    .textVerticalAlign("justify")
                                    .margin(0);
                            });

                            // footer parts start here
                            const todayDate = moment(new Date()).format("DD-MM-YYYY");
                            slide.addText((text) => {
                                text.value(todayDate)
                                    .x(10) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 410)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(heading_text_color)
                                    .textAlign("left")
                                    .textVerticalAlign("center")
                                    .margin(0);
                            });

                            slide.addText((text) => {
                                text.value(finalData[0].complaint_unique_id.toUpperCase())
                                    .x(260) // Adjust the x position based on your layout
                                    .y(firstTextHeight + topMargin + 410)
                                    .fontFace("Alien Encounters")
                                    .fontSize(14)
                                    .textColor(heading_text_color)
                                    .textAlign("left")
                                    .textVerticalAlign("center")
                                    .margin(0);
                            });

                            // footer end here
                        });
                    }
                }
            });

            // Save the presentation
            const pptPath = await pptx.save(`./public/complaint_images/ppt/complaint-presentation.pptx`);

            // const pptRelativePath = `./public/complaint_images/ppt/`+Date.now()+`-complaint-presentation.pptx`;
            // const pptAbsolutePath = path.resolve(pptRelativePath);
            // await pptx.save(pptAbsolutePath);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData[0],
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

// async function uploadBeforeImages(base64File, title, description, title_bg_color, title_text_color, description_text_color, complaint_id) {
//     const beforeUploadedImagesAndText = {};
//     // Convert the Base64 string to a buffer
//     const imageBuffer = Buffer.from(base64File, 'base64');

//     // get complaint details for water mark on image buffer
//     const complaintDetails = await getComplaintById(complaint_id);
//     let outlet_name = '';

//     if (complaintDetails.complaint_for == '1') {
//         const outletDetails = await getOutletById(complaintDetails.outlet_id);
//         outlet_name = outletDetails[0].outlet_name;
//     }

//     const watermarkText = complaintDetails.complaint_unique_id + " - " + outlet_name;
//     // Specify the output directory path
//     const outputDir = './public/complaint_images/';

//     // Create the output directory if it doesn't exist
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }
//     const imageName = Date.now() + '_output_resized.jpg'; // Include a file name here
//     const imagePath = outputDir + imageName;
//     const dbImagePath = '/complaint_images/' + imageName;
//     // Create a JSON object with title and dbImagePath
//     beforeUploadedImagesAndText['title'] = title;
//     beforeUploadedImagesAndText['description'] = description;
//     beforeUploadedImagesAndText['file'] = dbImagePath;
//     beforeUploadedImagesAndText['title_bg_color'] = title_bg_color;
//     beforeUploadedImagesAndText['title_text_color'] = title_text_color;
//     beforeUploadedImagesAndText['description_text_color'] = description_text_color;

//     // Push the object to the array
//     //beforeUploadedImagesAndText.push(imageData);
//     // return;
//     // const outputBuffer = await sharp(imageBuffer)
//     // .composite([
//     //     {
//     //         input: Buffer.from(`
//     //         <svg>
//     //                 <rect width="1000" height="500" fill="rgba(0, 0, 0, 0.9)" />
//     //                 <text x="5%" y="50%" font-family="Arial" alignment-baseline="middle" font-size="20" fill="white">${watermarkText}</text>
//     //             </svg>`),
//     //         gravity: 'center',
//     //     },
//     // ])
//     // .toBuffer();

//     // //res.set('Content-Type', 'image/png'); // Adjust content type as needed
//     // await sharp(outputBuffer).toFile(imagePath);

//     const outputBuffer = await sharp(imageBuffer)
//         .metadata() // Get metadata of the base image
//         .then(metadata => {
//             const watermarkWidth = Math.min(metadata.width, 280); // Limit watermark width to fit within base image width or 280, whichever is smaller
//             const watermarkHeight = Math.min(metadata.height, 100); // Limit watermark height to fit within base image height or 100, whichever is smaller

//             // Compose the SVG with adjusted dimensions
//             return sharp(imageBuffer)
//                 .composite([
//                     {
//                         input: Buffer.from(`
//                         <svg width="${watermarkWidth}" height="${watermarkHeight}">
//                             <rect width="${watermarkWidth}" height="${watermarkHeight}" fill="rgba(0, 0, 0, 0.9)" />
//                             <text x="5%" y="50%" font-family="Arial" alignment-baseline="middle" font-size="20" fill="white">${watermarkText}</text>
//                         </svg>`),
//                         gravity: 'center',
//                     },
//                 ])
//                 .toBuffer();
//         });

//     // Write the composited image to a file
//     await sharp(outputBuffer).toFile(imagePath);

//     return beforeUploadedImagesAndText;
// }

// async function uploadBeforeImages(base64File, title, description, title_bg_color, title_text_color, description_text_color, complaint_id) {
//     const beforeUploadedImagesAndText = {};

//     // Convert the Base64 string to a buffer
//     const imageBuffer = Buffer.from(base64File, 'base64');

//     // Get complaint details for watermark on the image buffer
//     const complaintDetails = await getComplaintById(complaint_id);
//     let outlet_name = '';

//     if (complaintDetails.complaint_for == '1') {
//         const outletDetails = await getOutletById(complaintDetails.outlet_id);
//         outlet_name = outletDetails[0].outlet_name;
//     }

//     const watermarkText = complaintDetails.complaint_unique_id + " - " + outlet_name;

//     // Specify the output directory path
//     const outputDir = './public/complaint_images/';

//     // Create the output directory if it doesn't exist
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }

//     const imageName = Date.now() + '_output_resized.jpg'; // Include a file name here
//     const imagePath = outputDir + imageName;
//     const dbImagePath = '/complaint_images/' + imageName;

//     // Create a JSON object with title and dbImagePath
//     beforeUploadedImagesAndText['title'] = title;
//     beforeUploadedImagesAndText['description'] = description;
//     beforeUploadedImagesAndText['file'] = dbImagePath;
//     beforeUploadedImagesAndText['title_bg_color'] = title_bg_color;
//     beforeUploadedImagesAndText['title_text_color'] = title_text_color;
//     beforeUploadedImagesAndText['description_text_color'] = description_text_color;

//     const outputBuffer = await sharp(imageBuffer)
//         .metadata() // Get metadata of the base image
//         .then(metadata => {
//             const watermarkWidth = metadata.width;
//             const watermarkHeight = metadata.height;

//             // Compose the SVG with adjusted dimensions
//             return sharp(imageBuffer)
//                 .composite([
//                     {
//                         input: Buffer.from(`
//                         <svg width="${watermarkWidth}" height="${watermarkHeight}">
//                             <rect x="0" y="0" width="100%" height="50px" fill="rgba(0, 0, 0, 0.7)" />
//                             <text x="50%" y="30px" font-family="Arial" alignment-baseline="middle" font-size="16" fill="white" text-anchor="middle">${watermarkText}</text>

//                             <rect x="0" y="${watermarkHeight - 50}" width="300px" height="50px" fill="rgba(0, 0, 0, 0.7)" />
//                             <text x="5%" y="${watermarkHeight - 20}" font-family="Arial" alignment-baseline="middle" font-size="16" fill="${title_text_color}">${title}</text>
//                         </svg>`),
//                         gravity: 'center',
//                     },
//                 ])
//                 .toBuffer();
//         });

//     // Write the composited image to a file
//     await sharp(outputBuffer).toFile(imagePath);

//     return beforeUploadedImagesAndText;
// }

// async function uploadBeforeImages(base64File, title, description, title_bg_color, title_text_color, description_text_color, complaint_id, image_type) {
//     const beforeUploadedImagesAndText = {};

//     // Convert the Base64 string to a buffer
//     const imageBuffer = Buffer.from(base64File, 'base64');

//     // Get complaint details for watermark on the image buffer
//     const complaintDetails = await getComplaintById(complaint_id);
//     let outlet_name = '';

//     if (complaintDetails.complaint_for == '1') {
//         const outletDetails = await getOutletById(complaintDetails.outlet_id);
//         outlet_name = outletDetails[0].outlet_name;
//     }

//     const watermarkText = complaintDetails.complaint_unique_id + " - " + outlet_name;

//     // Specify the output directory path
//     const outputDir = './public/complaint_images/';

//     // Create the output directory if it doesn't exist
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }

//     const imageName = Date.now() + '_output_resized.jpg'; // Include a file name here
//     const imagePath = outputDir + imageName;
//     const dbImagePath = '/complaint_images/' + imageName;

//     // Create a JSON object with title and dbImagePath
//     beforeUploadedImagesAndText['title'] = title;
//     beforeUploadedImagesAndText['description'] = description;
//     beforeUploadedImagesAndText['file'] = dbImagePath;
//     beforeUploadedImagesAndText['title_bg_color'] = title_bg_color;
//     beforeUploadedImagesAndText['title_text_color'] = title_text_color;
//     beforeUploadedImagesAndText['description_text_color'] = description_text_color;

//     const outputBuffer = await sharp(imageBuffer)
//         .metadata() // Get metadata of the base image
//         .then(metadata => {
//             const watermarkWidth = metadata.width;
//             const watermarkHeight = metadata.height;

//             // Compose the SVG with adjusted dimensions
//             return sharp(imageBuffer)
//                 .composite([
//                     {
//                         input: Buffer.from(`
//                         <svg width="${watermarkWidth}" height="${watermarkHeight}">
//                             <text x="50%" y="30px" font-family="Arial" alignment-baseline="middle" font-size="32" fill="white" text-anchor="middle">${watermarkText}</text>
//                             <text x="5%" y="${watermarkHeight - 20}" font-family="Arial" alignment-baseline="middle" font-size="22" fill="${title_text_color}">${title}</text>
//                         </svg>`),
//                         gravity: 'center',
//                     },
//                 ])
//                 .toBuffer();
//         });

//     // Write the composited image to a file
//     await sharp(outputBuffer).toFile(imagePath);

//     return beforeUploadedImagesAndText;
// }

async function uploadBeforeImages(
    base64File,
    title,
    description,
    title_bg_color,
    title_text_color,
    description_text_color,
    complaint_id,
    image_type,
    presentation_title
) {
    const beforeUploadedImagesAndText = {};

    // Convert the Base64 string to a buffer
    const imageBuffer = Buffer.from(base64File, "base64");

    // Get complaint details for watermark on the image buffer
    const complaintDetails = await getComplaintAndComplaintTypeById(complaint_id);
    let outlet_name = "";

    if (complaintDetails.complaint_for == "1") {
        const outletDetails = await getOutletById(complaintDetails.outlet_id);
        outlet_name = outletDetails[0].outlet_name;
    }

    const watermarkText = complaintDetails.complaint_unique_id + " - " + outlet_name;
    const complaint_type_name = complaintDetails.complaint_type_name;

    // Specify the output directory path
    const outputDir = "./public/complaint_images/";

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const imageName = Date.now() + `_output_resized_${image_type}.jpg`; // Include image type in the file name
    const imagePath = outputDir + imageName;
    const dbImagePath = "/complaint_images/" + imageName;

    // Create a JSON object with title and dbImagePath
    beforeUploadedImagesAndText["title"] = title;
    beforeUploadedImagesAndText["description"] = description;
    beforeUploadedImagesAndText["file"] = dbImagePath;
    beforeUploadedImagesAndText["title_bg_color"] = title_bg_color;
    beforeUploadedImagesAndText["title_text_color"] = title_text_color;
    beforeUploadedImagesAndText["description_text_color"] = description_text_color;
    beforeUploadedImagesAndText["image_type"] = image_type; // Include image type

    const outputBuffer = await sharp(imageBuffer)
        .metadata() // Get metadata of the base image
        .then((metadata) => {
            const imageWidth = metadata.width;
            const imageHeight = metadata.height;

            // Dynamic scaling based on image size
            const fontSize = Math.round(imageHeight * 0.03); // Font size is 3% of image height
            const backgroundHeight = Math.round(fontSize * 5.5); // Background height based on font size

            const backgroundY = imageHeight - backgroundHeight; // Y-position of the background rectangle

            return sharp(imageBuffer)
                .composite([
                    {
                        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}">
                        <!-- Background rectangle behind the text -->
                        <rect x="0" y="${backgroundY}" width="${imageWidth}" height="${backgroundHeight}" fill="black" opacity="0.7" />
                        
                        <!-- Adjusted text positions with dynamic font size -->
                        <text x="20" y="${backgroundY + fontSize + 10}" font-family="Arial" font-size="${fontSize}" fill="white" text-anchor="start">Complaint Id   : ${watermarkText}</text>
                        <text x="20" y="${backgroundY + fontSize * 2.5 + 10}" font-family="Arial" font-size="${fontSize}" fill="white" text-anchor="start">Complaint Type : ${complaint_type_name}</text>
                        <text x="20" y="${backgroundY + fontSize * 4 + 10}" font-family="Arial" font-size="${fontSize}" fill="white" text-anchor="start">Image Title    : ${title}</text>
                    </svg>`),
                        gravity: "southwest",
                    },
                ])
                .toBuffer();
        });

    // Write the composited image to a file
    await sharp(outputBuffer).toFile(imagePath);

    return beforeUploadedImagesAndText;
}

async function addWatermark(originalImageBuffer, watermarkText) {
    const originalImage = sharp(originalImageBuffer);
    const metadata = await originalImage.metadata();

    const watermarkBuffer = Buffer.from(`
        <svg width="100%" height="100%">
            <rect width="280" height="60" fill="rgba(0, 0, 0, 0.5)" />
            <text x="5%" y="50%" font-family="Arial" alignment-baseline="middle" font-size="16" fill="white">${watermarkText}</text>
        </svg>
    `);

    return originalImage
        .composite([
            {
                input: watermarkBuffer,
                gravity: "center",
            },
        ])
        .toBuffer();
}

/** approve or reject complaint images based on status */
const approveRejectComplaintImagesByStatus = async (req, res, next) => {
    try {
        const status = req.query.status;
        const id = req.query.id;

        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE complaint_images SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Item approved successfully" : "Item rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: "Invalid status" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    uploadComplaintImages,
    getAllUploadedImages,
    getSingleUploadedImagesById,
    updateComplaintImages,
    deleteComplaintWorkImages,
    getComplaintImagesForPPT,
    approveRejectComplaintImagesByStatus,
};

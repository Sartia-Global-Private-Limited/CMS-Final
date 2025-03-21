var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const sharp = require("sharp");
const fs = require("fs");
const { checkPositiveInteger } = require("../helpers/validation");

const getAllStateForDropdown = async (req, res, next) => {
    try {
        const selectQuery = `SELECT * FROM states WHERE country_id = '101'`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllPurchaseOrder = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id, po_number, po_for, po_status FROM purchase_orders`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const finalData = queryResult.filter(item => item.po_status == 1);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getComplaintType = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id, complaint_type_name FROM complaint_types`;
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getOutletBySaleArea = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query("SELECT * FROM outlets WHERE sales_area_id = ?", [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
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

const uploadImageWithWaterMark = async (req, res, next) => {
    try {
        var storePath = "";

        if (req.files != null) {
            const image = req.files.image;
            const imageBuffer = image.data;
            const watermarkText = "Your Watermark Here";

            const outputBuffer = await sharp(imageBuffer)
                .composite([
                    {
                        input: Buffer.from(`
                        <svg>
                                <rect width="180" height="50" fill="rgba(0, 0, 0, 0.4)" />
                                <text x="5%" y="50%" font-family="Arial" alignment-baseline="middle" font-size="16" fill="white">${watermarkText}</text>
                            </svg>`),
                        gravity: "southeast",
                    },
                ])
                .toBuffer();

            res.set("Content-Type", "image/png"); // Adjust content type as needed

            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/watermark_images/" + imageName;
            storePath = "/watermark_images/" + imageName;

            image.mv(uploadPath, async (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message });
            });
            await sharp(outputBuffer).toFile(uploadPath);
        }
    } catch (error) {
        return next(error);
    }
};

const convertBase64Image = async (req, res, next) => {
    try {
        const { image } = req.body;
        // Convert the Base64 string to a buffer
        const imageBuffer = Buffer.from(image, "base64");
        const watermarkText = "Your Watermark Here";

        // Specify the output directory path
        const outputDir = "./public/watermark_images/";

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const imageName = Date.now() + "_output_resized.jpg"; // Include a file name here
        const imagePath = outputDir + imageName;
        const dbImagePath = "public/watermark_images/" + imageName;
        // Use sharp to process the image
        //   sharp(imageBuffer)
        //     .toFile(outputDir + imageName, (err, info) => {
        //       if (err) {
        //         console.error(err);
        //       } else {
        //       }
        //     });

        const outputBuffer = await sharp(imageBuffer)
            .composite([
                {
                    input: Buffer.from(`
                        <svg>
                                <rect width="180" height="50" fill="rgba(0, 0, 0, 0.4)" />
                                <text x="5%" y="50%" font-family="Arial" alignment-baseline="middle" font-size="16" fill="white">${watermarkText}</text>
                            </svg>`),
                    gravity: "southeast",
                },
            ])
            .toBuffer();

        res.set("Content-Type", "image/png"); // Adjust content type as needed
        await sharp(outputBuffer).toFile(imagePath);

        return res.status(200).json({
            status: true,
            message: "Image successfully converted and resized.",
        });
    } catch (error) {
        return next(error);
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error.",
        });
    }
};

module.exports = {
    getAllStateForDropdown,
    getAllPurchaseOrder,
    getComplaintType,
    getOutletBySaleArea,
    uploadImageWithWaterMark,
    convertBase64Image,
};

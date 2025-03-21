var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { measurementValidation, checkPositiveInteger } = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    getCreatedUserNameFromAdmin,
    getPoDetailById,
    getComplaintTypeById,
    generateRandomAlphanumeric,
} = require("../helpers/general");

const createMeasurement = async (req, res, next) => {
    try {
        const { measurement_date, financial_year, ro_office_id, sale_area_id, po_id, complaint_id } = req.body;

        const { error } = measurementValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery =
            "INSERT INTO measurements (measurement_unique_id, measurement_date, financial_year, ro_office_id, sale_area_id, po_id, complaint_id, created_by) VALUES (? , ? , ? , ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        const measurement_date_format = moment(measurement_date).format("YYYY-MM-DD");
        const unique_id = await generateRandomAlphanumeric(10);

        const insertValues = [
            unique_id,
            measurement_date_format,
            financial_year,
            ro_office_id,
            sale_area_id,
            po_id,
            complaint_id,
            created_by,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Measurement created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! measurement not created",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllCreatedMeasurements = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_area.sales_area_name LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id ${search_value} ORDER BY measurements.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);

                finalData.push({
                    id: row.id,
                    measurement_date: moment(row.measurement_date).format("DD-MM-YYYY"),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    complaint_id: row.complaint_id,
                    complaint_type_name: complaintTypeDetail.complaint_type_name,
                    created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
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

const getMeasurementsDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id WHERE measurements.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);

                finalData.push({
                    id: row.id,
                    measurement_date: moment(row.measurement_date).format("YYYY-MM-DD"),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    complaint_id: row.complaint_id,
                    complaint_type_name: complaintTypeDetail.complaint_type_name,
                    created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
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

const updateMeasurementDetails = async (req, res, next) => {
    try {
        const { measurement_date, financial_year, ro_office_id, sale_area_id, po_id, complaint_id, id } = req.body;

        const { error } = measurementValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery =
            "UPDATE measurements SET measurement_date = ?, financial_year  = ?, ro_office_id  = ?, sale_area_id  = ?, po_id  = ?, complaint_id  = ?, updated_by = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        const measurement_date_format = moment(measurement_date).format("YYYY-MM-DD");

        const updateValues = [
            measurement_date_format,
            financial_year,
            ro_office_id,
            sale_area_id,
            po_id,
            complaint_id,
            updated_by,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Measurement updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! measurement not updated",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteMeasurementDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const deleteQuery = await db.query("DELETE FROM measurements WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Measurement deleted successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! measurement not deleted",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const measurementDetailsWithPoAndComplaint = async (req, res, next) => {
    try {
        const po_id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: po_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery =
            "SELECT measurements.*, purchase_orders.po_number, purchase_orders.work, purchase_orders.limit, purchase_orders.po_amount, complaints.complaint_unique_id FROM measurements LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.po_id = ?";

        const queryResult = await db.query(selectQuery, [po_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [
                    row.sale_area_id,
                ]);

                //get outlet details
                const outletDetails = await db.query(
                    "SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );

                //get regional office details
                const regionalOfficeDetails = await db.query(
                    "SELECT id, regional_office_name FROM regional_offices WHERE id = ?",
                    [row.ro_office_id]
                );

                // get location details
                const locationDetails = await db.query(
                    "SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );

                // order by details
                const orderByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    measurement_id: row.id,
                    measurement_date: moment(row.measurement_date).format("DD-MM-YYYY"),
                    measurement_no: row.measurement_unique_id,
                    po_number: row.po_number,
                    title: row.work,
                    po_limit: row.limit,
                    po_amount: row.po_amount,
                    complaint_id: row.complaint_unique_id,
                    work: "",
                    area_manager: "",
                    team_technician: "",
                    letter_status: "",
                    attachments: "",
                    outlet_name: outletDetails[0].outlet_name,
                    ro_office: regionalOfficeDetails[0].regional_office_name,
                    sale_area: saleArea[0].sales_area_name,
                    location: locationDetails[0].district_name,
                    order_by: orderByDetails.name,
                    financial_year: row.financial_year,
                });
            }

            // all items list
            const itemLists = await getFullItemList();
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                items: itemLists,
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

// get all items listed in measurement details with PO
async function getFullItemList() {
    try {
        const selectQuery = `SELECT id, name, rate FROM item_masters`;
        const queryResult = await db.query(selectQuery);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createMeasurement,
    getAllCreatedMeasurements,
    getMeasurementsDetailsById,
    updateMeasurementDetails,
    deleteMeasurementDetails,
    measurementDetailsWithPoAndComplaint,
};

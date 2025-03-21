var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const {
    checkPositiveInteger,
    requestCashValidation,
    earthingTestingSchema,
    earthingTestingStatusValidation,
} = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    getRegionalNameById,
    getSaleAreaNameById,
    getOutletById,
    getDistrictById,
    getFreeEndUsersCount,
    getUsersData,
    getUserDetails,
} = require("../helpers/general");
const { result } = require("lodash");
const { convertBase64Image, addCreatedByCondition } = require("../helpers/commonHelper");
const { insertNotifications } = require("../helpers/notifications");
const cron = require("node-cron");

const getAllComplaintList = async (req, res, next) => {
    try {
        const selectQuery = `SELECT id as complaint_id, complaint_type, complaint_unique_id, ro_id, sale_area_id, outlet_id, complaint_for  FROM complaints ORDER BY complaints.id DESC`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var getOutletNames = [];

            for (const row of queryResult) {
                const getRegionalOfficeNames = await getRegionalNameById(row.ro_id);
                const getSaleAreaNames = await getSaleAreaNameById(row.sale_area_id);
                if (row.complaint_for == "1") {
                    getOutletNames = await getOutletById(row.outlet_id);
                }

                var ro_name = "";
                var sale_area_name = "";
                var outlet_name = "";

                // regional office names
                if (getRegionalOfficeNames.length > process.env.VALUE_ZERO) {
                    for (const ro of getRegionalOfficeNames) {
                        ro_name = "-" + ro.regional_office_name;
                    }
                } else {
                    ro_name = "-";
                }

                //sale area name
                if (getSaleAreaNames.length > process.env.VALUE_ZERO) {
                    for (const sale_area of getSaleAreaNames) {
                        sale_area_name = "-" + sale_area.sales_area_name;
                    }
                } else {
                    sale_area_name = "-";
                }

                // outlet names
                if (getOutletNames.length > process.env.VALUE_ZERO) {
                    for (const outlet of getOutletNames) {
                        outlet_name = "-" + outlet.outlet_name;
                    }
                } else {
                    outlet_name = "-";
                }

                finalData.push({
                    id: row.complaint_id,
                    complaint_type: row.complaint_type,
                    complaints: row.complaint_unique_id + "" + ro_name + "" + sale_area_name + "" + outlet_name,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
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

const getComplaintDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT complaints.id as complaint_id, complaints.complaint_unique_id, complaints.ro_id, complaints.sale_area_id, complaints.outlet_id, complaints.description, complaints.created_at, complaints.district_id, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const getRegionalOfficeNames = await getRegionalNameById(row.ro_id);
                const getSaleAreaNames = await getSaleAreaNameById(row.sale_area_id);
                const getOutletNames = await getOutletById(row.outlet_id);
                const getDistrictNames = await getDistrictById(row.district_id);

                var ro_name = "";
                var sale_area_name = "";
                var outlet_name = "";
                var district_name = "";

                // regional office names
                if (getRegionalOfficeNames.length > process.env.VALUE_ZERO) {
                    for (const ro of getRegionalOfficeNames) {
                        ro_name = ro.regional_office_name;
                    }
                } else {
                    ro_name = "-";
                }

                //sale area name
                if (getSaleAreaNames.length > process.env.VALUE_ZERO) {
                    for (const sale_area of getSaleAreaNames) {
                        sale_area_name = sale_area.sales_area_name;
                    }
                } else {
                    sale_area_name = "-";
                }

                // outlet names
                if (getOutletNames.length > process.env.VALUE_ZERO) {
                    for (const outlet of getOutletNames) {
                        outlet_name = outlet.outlet_name;
                    }
                } else {
                    outlet_name = "-";
                }

                // district name
                if (getDistrictNames.length > process.env.VALUE_ZERO) {
                    for (const district of getDistrictNames) {
                        district_name = district.district_name;
                    }
                } else {
                    district_name = "-";
                }

                finalData.push({
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    row_names: ro_name,
                    sale_area_names: sale_area_name,
                    outlet_names: outlet_name,
                    district_names: district_name,
                    description: row.description,
                    complaint_type_name: row.complaint_type_name,
                    date: moment(row.created_at).format("YYYY-MM-DD"),
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
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

const getOutletDetails = async (req, res, next) => {
    try {
        const selectQuery = `SELECT outlets.id as outlet_id, outlets.outlet_name, outlets.regional_office_id, outlets.district_id, regional_offices.regional_office_name, districts.district_name FROM outlets LEFT JOIN regional_offices ON regional_offices.id = outlets.regional_office_id LEFT JOIN districts ON districts.id = outlets.district_id`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    outlet_id: row.outlet_id,
                    outlet: row.outlet_name + " " + row.regional_office_name + " " + row.district_name,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
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

const getFreeEndUsers = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;
        const selectQuery = "SELECT id, name, image, admin_id FROM users WHERE admin_id = ?";
        const queryResult = await db.query(selectQuery, [loggedUserId]);

        if (queryResult.length > 0) {
            const combinedData = []; // Combined array to store finalData and freeEndUsersCounts

            for (const row of queryResult) {
                const totalUsersUnder = await getFreeEndUsersCount(row.id);

                const userData = {
                    user_id: row.id,
                    admin_id: row.admin_id,
                    name: row.name,
                    image: row.image,
                };

                // Add the user data to the combined array
                combinedData.push(userData);

                // Extracting the freeEndUsersCount values and adding them to the combined array
                combinedData.push(...totalUsersUnder);
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "users fetched successfully",
                data: combinedData,
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No users found" });
        }
    } catch (error) {
        return next(error);
    }
};

const createEarthingTesting = async (req, res, next) => {
    try {
        const { complaint_id, outlet_id, user_id, expire_date } = req.body;

        const { error } = earthingTestingSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const insertQuery = `INSERT INTO earthing_testings(complaint_id, outlet_id, user_id, expire_date,created_by_type, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

        const created_by = req.user.user_id;
        const formatted_outlet_id = JSON.stringify(outlet_id);
        const formatted_user_id = JSON.stringify(user_id);
        const formatted_date = moment(expire_date).format("YYYY-MM-DD");
        const created_by_type = req.user.user_type;
        const currentDate = moment().format("YYYY-MM-DD");

        if (formatted_date < currentDate) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Date cannot be in the past",
            });
        }

        const insertValues = [
            complaint_id,
            formatted_outlet_id,
            formatted_user_id,
            formatted_date,
            created_by_type,
            created_by,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Earthing testing created successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong with the request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// const getAllEarthingTestingLists = async(req,res,next) => {

//     try {

//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value += `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR complaint_types.complaint_type_name LIKE '%${searchData}%' OR earthing_testings.created_by LIKE '%${searchData}%')`;
//         }

//         const selectQuery = `SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id, earthing_testings.created_by, earthing_testings.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM earthing_testings LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type ${search_value} ORDER BY earthing_testings.id DESC LIMIT ${pageFirstResult} , ${pageSize}`

//         const queryResult = await db.query(selectQuery);

//         // remove after order by
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//        if(queryResult.length > process.env.VALUE_ZERO)
//        {
//             var finalData = [];
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             for(const row of queryResult)
//             {
//                 const outletData = await getOutletById(row.outlet_id);
//                 const userData = await getUsersData(row.user_id);
//                 const createdByDetails = await getCreatedByDetails(row.created_by);

//                 finalData.push({
//                     id: row.id,
//                     complaint_id: row.complaint_id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     complaint_type_name: row.complaint_type_name,
//                     outlet_id: row.outlet_id,
//                     outletData: outletData,
//                     user_id: row.user_id,
//                     user_data: userData,
//                     created_by: createdByDetails.name,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 });
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: finalData,
//                     pageDetails:pageDetails
//                 });
//        }
//        else
//        {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Data not found"
//                 });
//        }
//     }
//     catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }

//  changes by nilanjan
/** get all earthing testing based on status */

// const getAllEarthingTestingLists = async(req,res,next) => {

//     try {

//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const status = req.query.status || '';
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value += `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR complaint_types.complaint_type_name LIKE '%${searchData}%' OR earthing_testings.created_by LIKE '%${searchData}%')`;
//         }

//         const selectQuery = `
//         SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id, earthing_testings.created_by, earthing_testings.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name
//         FROM earthing_testings
//         LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id
//         LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
//         ${search_value}
//         ${status != '' ? `WHERE earthing_testings.status = '${status}'` : ''}
//         ORDER BY earthing_testings.id
//         DESC LIMIT ${pageFirstResult} , ${pageSize}`

//         const queryResult = await db.query(selectQuery);

//         // remove after order by
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//     if(queryResult.length > process.env.VALUE_ZERO)
//     {
//             var finalData = [];
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             for(const row of queryResult)
//             {
//                 const outletData = await getOutletById(row.outlet_id);
//                 const userData = await getUsersData(row.user_id);
//                 const createdByDetails = await getCreatedByDetails(row.created_by);

//                 finalData.push({
//                     id: row.id,
//                     complaint_id: row.complaint_id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     complaint_type_name: row.complaint_type_name,
//                     outlet_id: row.outlet_id,
//                     outletData: outletData,
//                     user_id: row.user_id,
//                     user_data: userData,
//                     created_by: createdByDetails.name,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 });
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: finalData,
//                     pageDetails:pageDetails
//                 });
//        }
//        else
//        {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Data not found"
//                 });
//        }
//     }
//     catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }

/** get all earthing testing based on status */
const getAllEarthingTestingLists = async (req, res, next) => {
    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || "";
        var search_value = "";

        let conditions = [];

        if (searchData) {
            conditions.push(
                `(complaints.complaint_unique_id LIKE '%${searchData}%' OR complaint_types.complaint_type_name LIKE '%${searchData}%' OR earthing_testings.created_by LIKE '%${searchData}%')`
            );
        }

        if (status) {
            conditions.push(`earthing_testings.status = '${status}'`);
        }

        // conditions.push(`earthing_testings.expire_date IS NULL OR earthing_testings.expire_date >= '${moment().format("YYYY-MM-DD")}'`)
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        let selectQuery = `
        SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id, earthing_testings.expire_date, earthing_testings.status, earthing_testings.created_by, earthing_testings.earth_pit, earthing_testings.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name 
        FROM earthing_testings
        LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id 
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type 
        ${whereClause}
        ORDER BY earthing_testings.id 
        DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "earthing_testings",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const outletData = await getOutletById(row.outlet_id);
                const userData = await getUsersData(row.user_id);
                const createdByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type_name: row.complaint_type_name,
                    outlet_id: row.outlet_id,
                    outletData: outletData,
                    user_id: row.user_id,
                    user_data: userData,
                    status: row?.status || "",
                    expire_date: row?.expire_date ? moment(row?.expire_date).format("YYYY-MM-DD") : "",
                    created_by: createdByDetails.name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
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

// const getEarthingTestingDetailById = async(req,res,next) => {

//     try {

//         const id = req.params.id;
//         const {error} = checkPositiveInteger.validate({id});

//         if(error)
//         {
//             return res
//                 .status(StatusCodes.BAD_REQUEST)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const selectQuery = `SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id, earthing_testings.created_by, earthing_testings.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM earthing_testings LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE earthing_testings.id = ?`

//         const queryResult = await db.query(selectQuery, [id]);

//        if(queryResult.length > process.env.VALUE_ZERO)
//        {
//             var finalData = [];

//             for(const row of queryResult)
//             {
//                 const outletData = await getOutletById(row.outlet_id);
//                 const userData = await getUsersData(row.user_id);
//                 const createdByDetails = await getCreatedByDetails(row.created_by);

//                 finalData.push({
//                     id: row.id,
//                     complaint_id: row.complaint_id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     complaint_type_name: row.complaint_type_name,
//                     outlet_id: row.outlet_id,
//                     outletData: outletData,
//                     user_id: row.user_id,
//                     user_data: userData,
//                     created_by: createdByDetails.name,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 });
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: finalData[0],
//                 });
//        }
//        else
//        {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Data not found"
//                 });
//        }
//     }
//     catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }

const getEarthingTestingDetailById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id,earthing_testings.expire_date, earthing_testings.status, earthing_testings.created_by, earthing_testings.created_at, earthing_testings.earth_pit, earthing_testings.earth_point, earthing_testings.earth_crocodile_clamp, earthing_testings.du_hose, earthing_testings.rubber_hose_pipe, earthing_testings.earth_point_image, complaints.complaint_unique_id, complaint_types.complaint_type_name 
        FROM earthing_testings 
        LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id 
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type 
        WHERE earthing_testings.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                const outletData = await getOutletById(row.outlet_id);
                const userData = await getUsersData(row.user_id);
                const createdByDetails = await getCreatedByDetails(row.created_by);
                // const earth_pit = JSON.parse(row.earth_pit);
                const parsedDataEarthPit = JSON.parse(row.earth_pit);
                const parsedDataDuHose = JSON.parse(row.du_hose);
                const parsedDataCrocodile = JSON.parse(row.earth_crocodile_clamp);
                const parsedDataEarthPoint = JSON.parse(row.earth_point);

                finalData.push({
                    id: row.id,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type_name: row.complaint_type_name,
                    outlet_id: row.outlet_id,
                    outletData: outletData,
                    user_id: row.user_id,
                    user_data: userData,
                    earth_pit: parsedDataEarthPit,
                    du_hose: parsedDataDuHose,
                    crocodile_clamp: parsedDataCrocodile,
                    earth_point: parsedDataEarthPoint,
                    earth_point_image: row.earth_point_image,
                    rubber_hose_image: row.rubber_hose_pipe,
                    status: row?.status || "",
                    expire_date: row?.expire_date ? moment(row?.expire_date).format("YYYY-MM-DD") : "",
                    created_by: createdByDetails.name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
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

// const updateEarthingTesting = async(req,res,next) =>{

//     try {

//         const {complaint_id, outlet_id, user_id, id} = req.body;

//         const validation = Joi.object({

//             complaint_id: Joi.required(),
//             outlet_id: Joi.required(),
//             user_id: Joi.required(),

//         }).options({allowUnknown: true});

//         const {error} = validation.validate(req.body);

//         if(error)
//         {
//             return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//         }

//         const updateQuery = `UPDATE earthing_testings SET complaint_id = ?, outlet_id = ?, user_id = ?, updated_by = ? WHERE id = ?`;

//         const updated_by = req.user.user_id;
//         const formatted_outlet_id = JSON.stringify(outlet_id);
//         const formatted_user_id = JSON.stringify(user_id);

//         const updateValues = [complaint_id, formatted_outlet_id, formatted_user_id, updated_by, id];

//         const queryResult = await db.query(updateQuery, updateValues);

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Earthing testing updated successfully"
//                 });
//         }
//         else
//         {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Error! Something went wrong with the request"
//                 });
//         }
//     }
//     catch (error) {
//         return res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({
//             status: false,
//             message: error.message
//         });
//     }
// }

const updateEarthingTesting = async (req, res, next) => {
    try {
        const { complaint_id, outlet_id, user_id, expire_date, id } = req.body;

        const { error } = earthingTestingSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = `UPDATE earthing_testings SET complaint_id = ?, outlet_id = ?, user_id = ?, expire_date = ?, updated_by = ? 
        WHERE id = ?`;

        const updated_by = req.user.user_id;
        const formatted_outlet_id = JSON.stringify(outlet_id);
        const formatted_user_id = JSON.stringify(user_id);
        const formatted_date = moment(expire_date).format("YYYY-MM-DD");

        const updateValues = [complaint_id, formatted_outlet_id, formatted_user_id, formatted_date, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Earthing testing updated successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Something went wrong with the request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const changeEarthingTestingStatus = async (req, res, next) => {
    try {
        const { value, id } = req.body;

        const { error } = earthingTestingStatusValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const updateQuery = `UPDATE earthing_testings SET status = ? WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [value, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Status changed successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! status not changed",
            });
        }
    } catch (error) {
        return next(error);
    }
};

/** approve reject earthing testing by status */
const approveRejectEarthingTestingsByStatus = async (req, res, next) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        // Check if status is either '2' or '3'
        if (status === "2" || status === "3") {
            const updateQuery = `UPDATE earthing_testings SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === "2" ? "Item approved successfully" : "Item rejected successfully";
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

const assignToEarthingTesting = async (req, res, next) => {
    try {
        const { id, assign_to } = req.body;

        const formValidate = Joi.object({
            id: Joi.number().required(),
            assign_to: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidate.validate(req.body);
        if (error) return res.status(403).json({ status: false, message: error.message });

        const assignQuery = `UPDATE earthing_testings SET assign_to = ?, status = ? WHERE id = ?`;
        const queryResult = await db.query(assignQuery, [assign_to, "4", id]);

        if (queryResult.affectedRows > 0) {
            res.status(200).json({ status: true, message: "Survey assigned successfully" });
        } else {
            res.status(200).json({ status: false, message: "Error! survey not assigned" });
        }
    } catch (error) {
        return next(error);
    }
};

const earthPitReport = async (req, res, next) => {
    try {
        const { id, earth_pit, du_hose, earth_point, crocodile_clamp } = req.body;

        const formValidate = Joi.object({
            id: Joi.number().required(),
            earth_pit: Joi.array()
                .items(
                    Joi.object({
                        earth_pit_type: Joi.string().required(),
                        resistance_of_individual_earth_pit_ohm: Joi.string().allow(""),
                        earth_pit_identification_board_available: Joi.string().required(),
                        funnel_available: Joi.string().required(),
                        clamp_available: Joi.string().required(),
                        size_of_pipes_50mm: Joi.string().required(),
                        clamp_nutbolt_replaced: Joi.string().required(),
                        chamber_size_18x18: Joi.string().required(),
                        chamber_cover_available: Joi.string().required(),
                    })
                )
                .required(), // Properly invoking the required method
        }).options({ allowUnknown: true });

        const { error } = formValidate.validate(req.body);
        if (error) return res.status(403).json({ status: false, message: error.message });

        const stringifyData = JSON.stringify(earth_pit);
        const stringifyDuhose = JSON.stringify(du_hose);
        const stringifyEarthPoint = JSON.stringify(earth_point);
        const stringifyCrocodile = JSON.stringify(crocodile_clamp);

        // let storePath = null;
        // if (req.body.rubber_hose_image && req.body.rubber_hose_image.trim() !== ""){
        //     let base64File = req.body.rubber_hose_image.replace(
        //         /^data:image\/\w+;base64,/,
        //         ""
        //     );
        //     storePath = await convertBase64Image(
        //         base64File,
        //         "./public/earthing_rubber_image/",
        //         "/earthing_rubber_image/"
        //     );
        // }
        // let storePaths = null;
        // if (req.body.earth_point_image) {

        //     let base64File = req.body.earth_point_image.replace(
        //         /^data:image\/\w+;base64,/,
        //         ""
        //     );
        //     storePaths = await convertBase64Image(
        //         base64File,
        //         "./public/earth_point_image/",
        //         "/earth_point_image/"
        //     );

        // }

        let storePath = null;

        if (typeof req.body.rubber_hose_image === "string" && req.body.rubber_hose_image.trim() !== "") {
            let base64File = req.body.rubber_hose_image.replace(/^data:image\/\w+;base64,/, "");
            storePath = await convertBase64Image(
                base64File,
                "./public/earthing_rubber_image/",
                "/earthing_rubber_image/"
            );
        }

        let storePaths = null;

        if (typeof req.body.earth_point_image === "string" && req.body.earth_point_image.trim() !== "") {
            let base64File = req.body.earth_point_image.replace(/^data:image\/\w+;base64,/, "");
            storePaths = await convertBase64Image(base64File, "./public/earth_point_image/", "/earth_point_image/");
        }

        const insertedData = `UPDATE earthing_testings SET earth_pit = '${stringifyData}', du_hose = 
        '${stringifyDuhose}', earth_crocodile_clamp = '${stringifyCrocodile}', earth_point = '${stringifyEarthPoint}', rubber_hose_pipe = '${storePath}', earth_point_image = '${storePaths}', status = "5" WHERE id = '${id}'`;

        const insertQuery = await db.query(insertedData);

        if (insertQuery.affectedRows > 0) {
            res.status(200).json({ status: true, message: "Earth pit report submitted successfully" });
        } else {
            res.status(200).json({ status: false, message: "Error! Earth pit report not submitted" });
        }
    } catch (error) {
        return next(error);
    }
};

const getEarthPitreport = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || "";
        var search_value = "";

        // if (searchData != null && searchData != "") {
        //     search_value += `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR complaint_types.complaint_type_name LIKE '%${searchData}%' OR earthing_testings.created_by LIKE '%${searchData}%')`;
        // }

        // /** if status is provided then check if search value is also provided or not  */
        // status ? (search_value ? (search_value += `AND earthing_testings.status = '${status}'`) : search_value += `WHERE earthing_testings.status = '${status}'`) : "";

        if (searchData != null && searchData != "") {
            search_value += `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR complaint_types.complaint_type_name LIKE '%${searchData}%' OR earthing_testings.created_by LIKE '%${searchData}%')`;
        }

        /** If status is provided then check if search value is also provided or not */
        status
            ? search_value
                ? (search_value += ` AND earthing_testings.status = '${status}'`)
                : (search_value += `WHERE earthing_testings.status = '${status}'`)
            : "";

        /** Add condition to check if earth_pit is not null */
        search_value
            ? (search_value += " AND earthing_testings.earth_pit IS NOT NULL")
            : (search_value += "WHERE earthing_testings.earth_pit IS NOT NULL");

        const selectQuery = `
        SELECT earthing_testings.id, earthing_testings.complaint_id, earthing_testings.outlet_id, earthing_testings.user_id, earthing_testings.status, earthing_testings.created_by, earthing_testings.earth_pit, earthing_testings.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name 
        FROM earthing_testings
        LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id 
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type 
        ${search_value}
        ORDER BY earthing_testings.id 
        DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const outletData = await getOutletById(row.outlet_id);
                const userData = await getUsersData(row.user_id);
                const createdByDetails = await getCreatedByDetails(row.created_by);
                const parsedData = JSON.parse(row.earth_pit);

                finalData.push({
                    id: row.id,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type_name: row.complaint_type_name,
                    outlet_id: row.outlet_id,
                    outletData: outletData,
                    user_id: row.user_id,
                    user_data: userData,
                    earth_pit: parsedData,
                    status: row?.status || "",
                    created_by: createdByDetails.name,
                    created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
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

cron.schedule("0 0 * * *", async () => {
    try {
        const twoDaysAgo = moment().subtract(2, "days").format("YYYY-MM-DD");
        const query = `SELECT earthing_testings.id,earthing_testings.user_id,earthing_testings.expire_date, earthing_testings.created_by,earthing_testings.created_by_type, complaints.complaint_unique_id FROM earthing_testings LEFT JOIN complaints ON complaints.id = earthing_testings.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE earthing_testings.expire_date = ?`;
        const queryResult = await db.query(query, [twoDaysAgo]);
        if (queryResult.length > 0) {
            const superAdminQuery = `SELECT id, user_type FROM admins WHERE user_type = ?`;
            const superAdmins = await db.query(superAdminQuery, [process.env.SUPER_ADMIN_ROLE_ID]);
            const users = [];
            for (let superAdmin of superAdmins) {
                users.push({ type: superAdmin.user_type, id: superAdmin.id });
            }
            const title = "Earthing Testing Reminder";
            let message;
            for (let earthingTesting of queryResult) {
                users.push({ type: earthingTesting.created_by_type, id: earthingTesting.created_by });
                message = `Earthing Testing of complaint id ${earthingTesting.complaint_unique_id} is going to expire on ${currentDate}`;
                const parsedUsers = JSON.parse(earthingTesting.user_id);
                for (let userId of parsedUsers) {
                    const userDetail = await getUserDetails(userId);
                    if (userDetail.length > 0) {
                        users.push({ type: userDetail[0].user_type, id: userDetail[0].id });
                    }
                }
            }
            for (let user of users) {
                const notificationData = [
                    {
                        userId: user.id,
                        roleId: user.type,
                        title: title,
                        message: message,
                    },
                ];
                await insertNotifications(notificationData);
            }
        }
    } catch (error) {
        throw error;
    }
});

module.exports = {
    getAllComplaintList,
    getComplaintDetailById,
    getOutletDetails,
    getFreeEndUsers,
    createEarthingTesting,
    getAllEarthingTestingLists,
    getEarthingTestingDetailById,
    updateEarthingTesting,
    changeEarthingTestingStatus,
    approveRejectEarthingTestingsByStatus,
    assignToEarthingTesting,
    earthPitReport,
    getEarthPitreport,
};

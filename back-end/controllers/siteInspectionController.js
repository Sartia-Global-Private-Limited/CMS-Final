var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const {
    calculatePagination,
    getCreatedByDetails,
    getComplaintTypeById,
    getEnergyCompaniesById,
    getOutletById,
    getCompanyDetailsById,
    getRegionalNameById,
    getSaleAreaNameById,
    getDistrictById,
    complaintRaiseBy,
    getUserDetails,
    getAdminAndUserDetails,
    getAdminAndUserDetail,
} = require("../helpers/general");
const { addOfficeInspectionsDetails, addOfficeInspectionsForFundDetails } = require("./officeInspectionController");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const verifiedUsedItems = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = `UPDATE items_used SET site_inspection_status = ?, verified_by = ?, verified_at = ? WHERE item_id = ?`;
        const verified_by = req.user.user_id;
        const verified_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [process.env.APPROVED, verified_by, verified_at, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Item verified successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong with request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllVerifiedComplaintItems = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "items_used.complaint_id",
            "complaint_types.complaint_type_name",
            "items_used.item_price",
        ];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY items_used.item_id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT items_used.item_id as item_used_id, items_used.complaint_id, items_used.quantity, items_used.item_price, items_used.status as office_inspection_status, items_used.site_inspection_status, items_used.verified_by, items_used.verified_at, complaints.complaint_type, complaint_types.complaint_type_name FROM items_used LEFT JOIN complaints ON complaints.complaint_unique_id = items_used.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE items_used.site_inspection_status = '1' ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove the order limit query
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const verifiedByDetail = await getCreatedByDetails(row.verified_by);

                finalData.push({
                    item_used_id: row.item_used_id,
                    complaint_id: row.complaint_id,
                    quantity: row.quantity,
                    item_price: row.item_price,
                    office_inspection_status: row.office_inspection_status,
                    site_inspection_status: row.site_inspection_status,
                    verified_by: verifiedByDetail.name,
                    verified_at: moment(row.verified_at).format("YYYY-MM-DD"),
                    complaint_type: row.complaint_type,
                    complaint_type_name: row.complaint_type_name,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const verifiedExpensesFromSite = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = `UPDATE fund_requests SET site_inspection_status = ?, site_inspection_verified_by = ?, site_inspection_verified_at = ? WHERE id= ?`;

        const status = process.env.APPROVED;
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(updateQuery, [status, approved_by, approved_at, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense verified successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong with request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllVerifiedSiteExpenseList = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = [
            "fund_requests.request_purpose",
            "complaint_types.complaint_type_name",
            "fund_requests.request_amount",
            "complaints.complaint_unique_id",
        ];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY fund_requests.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT fund_requests.id, fund_requests.request_by, fund_requests.request_purpose, fund_requests.supporting_document, fund_requests.request_amount, fund_requests.request_date, fund_requests.status, fund_requests.office_inspection_status, fund_requests.status_changed_by, fund_requests.status_changed_at, fund_requests.office_inspection_approved_by, fund_requests.office_inspection_approved_at, fund_requests.site_inspection_status, fund_requests.site_inspection_verified_by, fund_requests.site_inspection_verified_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM fund_requests LEFT JOIN complaints ON complaints.id = fund_requests.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE fund_requests.status = '1' AND fund_requests.office_inspection_status = '1' ${
            searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        // remove the order limit query
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const requestByDetail = await getCreatedByDetails(row.request_by);
                const statusChangedBy = await getCreatedByDetails(row.status_changed_by);
                const officeExpenseApprovedBy = await getCreatedByDetails(row.office_inspection_approved_by);
                const siteExpenseVerifiedDetail = await getCreatedByDetails(row.site_inspection_verified_by);

                finalData.push({
                    id: row.id,
                    request_by: row.request_by,
                    request_by_name: requestByDetail.name,
                    request_purpose: row.request_purpose,
                    supporting_document: row.supporting_document,
                    request_amount: row.request_amount,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    status: row.status,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type_name: row.complaint_type_name,
                    status_changed_by: row.status_changed_by,
                    status_changed_by_name: statusChangedBy.name,
                    status_changed_at: moment(row.status_changed_at).format("YYYY-MM-DD HH:mm:ss A"),
                    office_inspection_status: row.office_inspection_status,
                    office_inspection_approved_by: row.office_inspection_approved_by,
                    office_inspection_approved_by_name: officeExpenseApprovedBy.name,
                    office_inspection_approved_at: moment(row.office_inspection_approved_at).format(
                        "YYYY-MM-DD HH:mm:ss A"
                    ),
                    site_inspection_status: row.site_inspection_status,
                    site_inspection_verified_by: row.site_inspection_verified_by,
                    site_inspection_verified_by_name: siteExpenseVerifiedDetail.name,
                    site_inspection_verified_at: moment(row.site_inspection_verified_at).format(
                        "YYYY-MM-DD HH:mm:ss A"
                    ),
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

const getAllSiteInspection = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        let whereConditions = "";
        const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // const selectQuery = `SELECT DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.office_approved_qty * st.rate) AS total_cost, c.*, complaint_types.complaint_type_name, s.office_approved_at AS approved_office_at, s.user_id as stock_user_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status = '0' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.office_approved_at DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
            SELECT 
                DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.office_approved_qty * st.rate) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.office_approved_at) AS approved_office_at, 
                MAX(s.user_id) AS stock_user_id,
                MAX(c.complaint_type) AS complaint_type,
                MAX(c.complaint_for) AS complaint_for,
                MAX(c.energy_company_id) AS energy_company_id,
                MAX(c.ro_id) AS ro_id,
                MAX(c.sale_area_id) AS sale_area_id,
                MAX(c.district_id) AS district_id
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '2' 
                AND s.site_approved_status = '0' 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value}   
            GROUP BY 
                DATE_FORMAT(s.office_approved_at, '%Y-%m'), c.outlet_id
            ORDER BY 
                MAX(s.office_approved_at) DESC
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "0",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSiteInspectionById = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE  stock_punch_histories.office_approved_at IS NOT NULL AND stock_punch_histories.office_approved_status = '2' AND stock_punch_histories.site_approved_status= '0' AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

        const result = await db.query(selectQuery);

        if (result.length > 0) {
            const transformedData = await transformDataForApproved(result);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: Object.values(transformedData) });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// async function transformDataForApproved(data) {
//     const transformedData = {};

//     // Iterate through each entry in the data
//     for (const entry of data) {
//         const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for, complaint_id } = entry;
//         let outletDetails;

//         try {
//             // Call the asynchronous function inside a try-catch block
//             const userDetails = await getAdminAndUserDetail(user_id);
//             const getAssignDetail = await getAssignDetails(complaint_id)
//             // Check if the user details are already added

//             const complaintType = await getComplaintTypeById(complaint_type);

//             if (complaint_for == '1') {
//                 const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
//                 company_name = energyCompanyName.name ? energyCompanyName.name : "";
//                 const selectedOutlets = await getOutletById(outlet_id);
//                 outletDetails = selectedOutlets;

//             }
//             else {
//                 const energyCompanyName = await getCompanyDetailsById(energy_company_id);
//                 company_name = energyCompanyName.company_name;
//                 outletDetails = ''
//             }

//             if (!transformedData[user_id]) {
//                 transformedData[user_id] = { getAssignDetail, userDetails, outletDetails, itemDetails: [], total: 0, total_site_amount: 0 };
//             }

//             // Add item details to the array
//             const itemDetail = {
//                 id: entry.stock_punch_history_id,
//                 complaint_id: entry.complaint_id,
//                 complaint_unique_id: entry.complaint_unique_id,
//                 stock_id: entry.stock_id,
//                 item_id: entry.item_id,
//                 item_name: entry.item_name,
//                 item_image: entry.item_image,
//                 item_rate: entry.item_rate,
//                 item_qty: entry.item_qty,
//                 punch_by: entry.punch_by,
//                 punch_at: entry.punch_at,
//                 status: entry.status,
//                 approved_qty: entry.approved_qty,
//                 approved_amount: entry.approved_amount,
//                 approved_by: entry.approved_by,
//                 approved_at: moment(entry.approved_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 stock_user_id: entry.stock_user_id,
//                 total_item_qty: entry.total_item_qty,
//                 total_approved_qty: entry.total_approved_qty,
//                 total_approved_amount: entry.item_rate * entry.approved_qty,
//                 office_approved_qty: entry.office_approved_qty,
//                 total_office_approved_amounts: entry.item_rate * entry.office_approved_qty,
//                 office_approved_at: moment(entry.office_approved_at).format('YYYY-MM-DD HH:mm:ss'),
//                 site_approved_qty: entry.site_approved_qty,
//                 total_site_approved_amount: entry.item_rate * entry.site_approved_qty,
//                 site_approved_at: moment(entry.site_approved_at).format('YYYY-MM-DD HH:mm:ss'),
//                 office_expense_approve_id: entry.office_expense_approve_id,
//                 site_expense_approve_id:entry.site_expense_approve_id,
//             };

//             // Add the total_approved_amount of this item to the total sum
//             transformedData[user_id].total += itemDetail.total_office_approved_amounts;

//             transformedData[user_id].total_site_amount += itemDetail.total_site_approved_amount;

//             transformedData[user_id].itemDetails.push(itemDetail);

//             // office_approved_at = moment(entry.office_approved_at).format('YYYY-MM-DD HH:mm:ss');

//             const officeId = entry.office_expense_approve_id;
//             const siteId= entry.site_expense_approve_id;
//             // Add the fetched data to confirmDetails under transformedData
//             const selectQuery = `select * from office_expense_approve where id = '${officeId}'`
//             const result = await db.query(selectQuery);

//             const siteFeedback = `select * from office_expense_approve where id = '${ officeId}'`

//             // Add the fetched data to confirmDetails under transformedData
//             if (result.length > 0) {
//                 if (!transformedData[user_id].confirmDetails) {
//                     transformedData[user_id].confirmDetails = [];
//                 }
//             }
//             transformedData[user_id].confirmDetails = transformedData[user_id].confirmDetails.concat(result);

//         } catch (error) {next(error)
//             console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
//         }
//     }

//     return transformedData;
// }

async function transformDataForApproved(data) {
    const transformedData = {};

    // Iterate through each entry in the data
    for (const entry of data) {
        const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for, complaint_id } = entry;
        let outletDetails;

        try {
            // Call the asynchronous functions inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);
            const getAssignDetail = await getAssignDetails(complaint_id);
            const complaintType = await getComplaintTypeById(complaint_type);

            // Fetch energy company details and outlet details based on complaint type
            if (complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
                company_name = energyCompanyName.name ? energyCompanyName.name : "";
                const selectedOutlets = await getOutletById(outlet_id);
                outletDetails = selectedOutlets;
            } else {
                const energyCompanyName = await getCompanyDetailsById(energy_company_id);
                company_name = energyCompanyName.company_name;
                outletDetails = "";
            }

            // Initialize transformedData[user_id] if not already exists
            if (!transformedData[user_id]) {
                transformedData[user_id] = {
                    getAssignDetail,
                    userDetails,
                    outletDetails,
                    itemDetails: [],
                    total: 0,
                    total_site_amount: 0,
                    confirmDetails: {
                        office: [],
                        site: [],
                    },
                };
            }

            // Prepare item details for the current entry
            const itemDetail = {
                id: entry.stock_punch_history_id,
                complaint_id: entry.complaint_id,
                complaint_unique_id: entry.complaint_unique_id,
                stock_id: entry.stock_id,
                item_id: entry.item_id,
                item_name: entry.item_name,
                item_image: entry.item_image,
                item_rate: entry.item_rate,
                item_qty: entry.item_qty,
                punch_by: entry.punch_by,
                punch_at: entry.punch_at,
                status: entry.status,
                approved_qty: entry.approved_qty,
                approved_amount: entry.approved_amount,
                approved_by: entry.approved_by,
                approved_at: moment(entry.approved_at).format("YYYY-MM-DD HH:mm:ss A"),
                stock_user_id: entry.stock_user_id,
                total_item_qty: entry.total_item_qty,
                total_approved_qty: entry.total_approved_qty,
                total_approved_amount: entry.item_rate * entry.approved_qty,
                office_approved_qty: entry.office_approved_qty,
                total_office_approved_amounts: entry.item_rate * entry.office_approved_qty,
                office_approved_at: moment(entry.office_approved_at).format("YYYY-MM-DD HH:mm:ss"),
                site_approved_qty: entry.site_approved_qty,
                total_site_approved_amount: entry.item_rate * entry.site_approved_qty,
                site_approved_at: moment(entry.site_approved_at).format("YYYY-MM-DD HH:mm:ss"),
                office_expense_approve_id: entry.office_expense_approve_id,
                site_expense_approve_id: entry.site_expense_approve_id,
            };

            // Add item detail to itemDetails array and update totals
            transformedData[user_id].itemDetails.push(itemDetail);
            transformedData[user_id].total += itemDetail.total_office_approved_amounts;
            transformedData[user_id].total_site_amount += itemDetail.total_site_approved_amount;

            // Fetch and categorize feedback for office and site expense approvals
            if (
                entry.office_expense_approve_id &&
                !transformedData[user_id].confirmDetails.office.some(
                    (feedback) => feedback.id === entry.office_expense_approve_id
                )
            ) {
                const officeFeedback = await db.query(
                    `SELECT * FROM office_expense_approve WHERE id = '${entry.office_expense_approve_id}'`
                );
                if (officeFeedback.length > 0) {
                    transformedData[user_id].confirmDetails.office.push(officeFeedback[0]);
                }
            }

            if (
                entry.site_expense_approve_id &&
                !transformedData[user_id].confirmDetails.site.some(
                    (feedback) => feedback.id === entry.site_expense_approve_id
                )
            ) {
                const siteFeedback = await db.query(
                    `SELECT * FROM office_expense_approve WHERE id = '${entry.site_expense_approve_id}'`
                );
                if (siteFeedback.length > 0) {
                    transformedData[user_id].confirmDetails.site.push(siteFeedback[0]);
                }
            }
        } catch (error) {
            console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
            throw error;
        }
    }

    return transformedData;
}

async function getAssignDetails(complaint_id) {
    try {
        if (!complaint_id) throw new Error(`Provide Complaint id`);

        const selectQuery = `SELECT si.*, u1.id AS area_manager_id, u1.name AS area_manager_name, u1.image AS area_manager_image, u1.employee_id AS area_manager_employee_id, u2.id AS supervisor_id, u2.name AS supervisor_name, u2.image AS supervisor_image, u2.employee_id AS supervisor_employee_id, u3.id AS end_user_id, u3.name AS end_user_name, u3.image AS end_user_image, u3.employee_id AS end_user_employee_id, u4.id AS office_user_id, u4.name AS office_user_name, u4.image AS office_user_image, u4.employee_id AS office_user_employee_id FROM site_inspections AS si LEFT JOIN users AS u1 ON si.area_manager_id = u1.id LEFT JOIN users AS u2 ON si.supervisor_id = u2.id LEFT JOIN users AS u3 ON si.end_users_id = u3.id LEFT JOIN users AS u4 ON si.office_users_id = u4.id WHERE si.complaint_id =  '${complaint_id}' `;

        const result = await db.query(selectQuery);
        if (result.length > 0) {
            return result[0];
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

const assignComplaints = async (req, res, next) => {
    try {
        const { complaint_id, office_users_id, area_manager_id, supervisor_id, end_users_id } = req.body;
        const assign_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const assign_by = req.user.user_id;
        const assign_to = office_users_id || end_users_id || supervisor_id || area_manager_id;

        const userAssignComplaints = await db.query(
            `SELECT * FROM complaints_timeline WHERE complaints_id= '${complaint_id}' AND status= 'assigned' AND free_end_users = '1'`
        );

        for (const row of userAssignComplaints) {
            if (row.assign_to == assign_to) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "Complaint cannot be assigned to the same user." });
            }
        }

        const selectQuery = await db.query(
            `SELECT * FROM stock_punch_histories WHERE complaint_id = '${complaint_id}' AND office_approved_status = '2'`
        );

        if (selectQuery.length > 0) {
            await insertSiteInspection(
                complaint_id,
                assign_to,
                office_users_id,
                area_manager_id,
                supervisor_id,
                end_users_id,
                assign_by,
                assign_at
            );

            return res.status(StatusCodes.OK).json({ status: true, message: "Complaints Assigned successfully." });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Complaint not found." });
        }
    } catch (error) {
        return next(error);
    }
};

const assignComplaintsForFundSite = async (req, res, next) => {
    try {
        const { complaint_id, office_users_id, area_manager_id, supervisor_id, end_users_id } = req.body;
        const assign_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const assign_by = req.user.user_id;
        const assign_to = office_users_id || end_users_id || supervisor_id || area_manager_id;

        const userAssignComplaints = await db.query(
            `SELECT * FROM complaints_timeline WHERE complaints_id= '${complaint_id}' AND status= 'assigned' AND free_end_users = '1'`
        );

        for (const row of userAssignComplaints) {
            if (row.assign_to == assign_to) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "Complaint cannot be assigned to the same user." });
            }
        }

        const selectQuery = await db.query(
            `SELECT * FROM expense_punch_history WHERE complaint_id = '${complaint_id}' AND office_approved_status = '2'`
        );

        if (selectQuery.length > 0) {
            await insertSiteFundInspection(
                complaint_id,
                assign_to,
                office_users_id,
                area_manager_id,
                supervisor_id,
                end_users_id,
                assign_by,
                assign_at
            );

            return res.status(StatusCodes.OK).json({ status: true, message: "Complaints Assigned successfully." });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Complaint not found." });
        }
    } catch (error) {
        return next(error);
    }
};

const insertSiteInspection = async (
    complaintId,
    assignTo,
    officeUsersId,
    areaManagerId,
    supervisorId,
    endUsersId,
    assignBy,
    assignAt
) => {
    const insertQuery = `INSERT INTO site_inspections SET complaint_id = ?, assign_to = ?, office_users_id = ?, area_manager_id = ?, supervisor_id = ?, end_users_id = ?, assign_by = ?, assign_at = ?`;
    const values = [complaintId, assignTo, officeUsersId, areaManagerId, supervisorId, endUsersId, assignBy, assignAt];
    await db.query(insertQuery, values);
};

const insertSiteFundInspection = async (
    complaintId,
    assignTo,
    officeUsersId,
    areaManagerId,
    supervisorId,
    endUsersId,
    assignBy,
    assignAt
) => {
    const insertQuery = `INSERT INTO fund_inspections SET complaint_id = ?, assign_to = ?, office_users_id = ?, area_manager_id = ?, supervisor_id = ?, end_users_id = ?, assign_by = ?, assign_at = ?`;
    const values = [complaintId, assignTo, officeUsersId, areaManagerId, supervisorId, endUsersId, assignBy, assignAt];
    await db.query(insertQuery, values);
};

// const approveSiteInspections = async (req,res,next) => {
//     try {
//         const { approve_site_inspections, site_not_approved, feedback } = req.body;
//         const siteApprovedBy = req.user.user_id;
//         const site_approved_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

//         if (!Array.isArray(approve_site_inspections) || approve_site_inspections.length === 0) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Please fill the details for site inspections to be approved." });
//         }

//         for (const data of approve_site_inspections) {
//             const { id, office_approved_status, site_approved_qty } = data;
//             const selectQuery = await db.query(`SELECT * FROM stock_punch_histories WHERE id = '${id}' AND office_approved_status = '${office_approved_status}'`);

//             if (selectQuery.length > 0) {
//                 const updateQuery = `UPDATE stock_punch_histories SET site_approved_status = '2', site_approved_qty= '${site_approved_qty}', site_approved_by = '${siteApprovedBy}', site_approved_at = '${site_approved_at}' WHERE id = '${id}' AND office_approved_status = '${office_approved_status}'`;
//                 await db.query(updateQuery);
//             }
//         }

//         if (Array.isArray(site_not_approved) && site_not_approved.length > 0) {
//             await officeNotApproved(site_not_approved, site_approved_at);
//         }

//         return res.status(StatusCodes.OK).json({ status: true, message: "Site inspections approved successfully." });

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const approveSiteInspections = async (req, res, next) => {
    try {
        const { approve_site_inspections, site_not_approved, feedback } = req.body;
        const siteApprovedBy = req.user.user_id;
        const site_approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if (!Array.isArray(approve_site_inspections) || approve_site_inspections.length === 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Please fill the details for site inspections to be approved." });
        }

        const insertResults = await addOfficeInspectionsDetails(feedback, siteApprovedBy);

        for (const data of approve_site_inspections) {
            const { id, stock_id, office_approved_status, site_approved_qty } = data;

            if (site_approved_qty <= 0) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Quantity cannot be zero." });
            }

            const selectQuery = await db.query(
                `
                SELECT * FROM stock_punch_histories WHERE id = ? AND stock_id = ?
                `,
                [id, stock_id]
            );

            const stockQuery = `SELECT sph.*, s.rate 
                FROM stock_punch_histories sph
                LEFT JOIN stocks s ON s.id = sph.stock_id
                WHERE complaint_id = ?
            `;
            const stockData = await db.query(stockQuery, [selectQuery[0].complaint_id]);

            let stockAmount = 0;
            if (stockData.length > 0) {
                // loop thru fund request and expense punch history to add up fund amounts
                for (const item of stockData) {
                    stockAmount += item.office_approved_qty * item.rate;
                }
            }

            if (selectQuery.length > 0) {
                const matchingResult = insertResults.find(
                    (result) => result.complaint_id === selectQuery[0].complaint_id
                );

                if (matchingResult) {
                    const { insertOrUpdateId, complaint_id } = matchingResult;
                    const updateQuery = `
                        UPDATE stock_punch_histories 
                        SET site_approved_status = ?, site_approved_qty = ?, site_approved_by = ?, site_approved_at = ?, 
                        site_expense_approve_id = ?
                        WHERE id = ? AND stock_id = ?
                    `;

                    await db.query(updateQuery, [
                        office_approved_status,
                        site_approved_qty,
                        siteApprovedBy,
                        site_approved_at,
                        insertOrUpdateId,
                        id,
                        stock_id,
                    ]);

                    await db.query(`UPDATE complaints SET stock_amount = ? WHERE id = ? `, [stockAmount, complaint_id]);
                }
            }
        }

        if (Array.isArray(site_not_approved) && site_not_approved.length > 0) {
            await officeNotApproved(site_not_approved, site_approved_at);
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Site inspections approved successfully." });
    } catch (error) {
        return next(error);
    }
};

const officeNotApproved = async (office_not_approved, office_approved_at) => {
    try {
        for (const office of office_not_approved) {
            const { id, stock_id } = office;
            const updateQuery = `UPDATE stock_punch_histories SET site_approved_status = '1', site_approved_at = '${office_approved_at}' WHERE id = '${id}'`;
            const query = await db.query(updateQuery);
        }
    } catch (error) {
        throw new Error("Error executing  office_not_approved command   " + error.message);
    }
};

const getAllSiteInspectionApproved = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        let whereConditions = "";
        const loggedUserType = req.user.user_type;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // let selectQuery = `SELECT DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.office_approved_qty * st.rate) AS total_cost, c.*, complaint_types.complaint_type_name, s.office_approved_at AS approved_office_at, s.user_id as stock_user_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status = '2' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.office_approved_at`;

        let selectQuery = `
            SELECT 
                DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id,  
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.office_approved_qty * st.rate) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name,  
                MAX(s.office_approved_at) AS approved_office_at, 
                MAX(s.user_id) AS stock_user_id,
                MAX(c.energy_company_id) AS energy_company_id,
                MAX(c.ro_id) AS ro_id,
                MAX(c.sale_area_id) AS sale_area_id,
                MAX(c.district_id) AS district_id,
                MAX(c.complaint_type) AS complaint_type,
                MAX(c.complaint_for) AS complaint_for
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '2' 
                AND s.site_approved_status = '2' 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value}   
            GROUP BY 
                DATE_FORMAT(s.office_approved_at, '%Y-%m'), c.outlet_id
            ORDER BY 
                MAX(s.office_approved_at) 
            `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "2",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            if (!pageSize) {
                finalData = finalData.map((item) => {
                    return {
                        ...item,
                        outlet_name: item.outlet[0]?.outlet_name,
                        outlet_unique_id: item.outlet[0]?.outlet_unique_id,
                        regional_office_name: item.regionalOffice[0]?.regional_office_name,
                        sales_area_name: item.saleAreaDetails[0]?.sales_area_name,
                    };
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "site_stock", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "site_stock", "Site Stock Inspection", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllSiteInspectionPartial = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        let whereConditions = "";
        const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // const selectQuery = `SELECT DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.office_approved_qty * st.rate) AS total_cost, c.*, complaint_types.complaint_type_name, s.office_approved_at AS approved_office_at, s.user_id as stock_user_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status = '1' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.office_approved_at DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
            SELECT 
                DATE_FORMAT(MAX(s.office_approved_at), '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.office_approved_qty * st.rate) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name,  
                MAX(s.office_approved_at) AS approved_office_at, 
                MAX(s.user_id) AS stock_user_id 
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '2' 
                AND s.site_approved_status = '1' 
                AND c.created_by = '${req.user.user_id}'
                ${whereConditions}
                ${search_value}   
            GROUP BY 
                DATE_FORMAT(s.office_approved_at, '%Y-%m'), c.outlet_id
            ORDER BY 
                approved_office_at DESC
            LIMIT ${pageFirstResult} , ${pageSize};
        `;

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "1",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function siteInspection(id, month) {
    const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate 
    FROM stock_punch_histories 
    LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id 
    LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id 
    LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id 
    WHERE stock_punch_histories.office_approved_status = '2' AND stock_punch_histories.site_approved_status = '2' AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

    const result = await db.query(selectQuery);
    if (result.length > 0) {
        const transformedData = await transformDataForApproved(result);

        return Object.values(transformedData);
    } else {
        throw new Error("Data not found");
    }
}
const getAllSiteInspectionApprovedById = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        // console.log('req.params: ', req.params);
        const transformedData = await siteInspection(id, month);
        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Request fetched successfully",
            data: transformedData,
        });
    } catch (error) {
        return next(error);
    }
};

const getAllSiteInspectionPartialById = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE stock_punch_histories.office_approved_status = '2' AND stock_punch_histories.site_approved_status ='1'  AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

        const result = await db.query(selectQuery);

        if (result.length > 0) {
            const transformedData = await transformDataForApproved(result);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: Object.values(transformedData) });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function getAssignDetailsOfComplaints(complaint_id) {
    try {
        const getAssignDetails = `SELECT * FROM site_inspections WHERE complaints_id = '${complaint_id}' `;
        const result = await db.query(getAssignDetails);
    } catch (error) {
        return error.message;
    }
}

/**---------------------site inspection fund--------------------- */

const getAllOutletsWithComplaintsSiteForFunds = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";
        let whereConditions = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // const selectQuery = `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.approved_qty * st.item_price) AS total_cost, c.*, complaint_types.complaint_type_name, s.approved_at AS approved_stock_punch_at, s.user_id as stock_user_id FROM complaints c INNER JOIN expense_punch_history s ON c.id = s.complaint_id INNER JOIN fund_requests st ON s.fund_id = st.id  LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status= '0' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.approved_at DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
            SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.approved_qty * st.item_price) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.approved_at) AS approved_stock_punch_at, 
                MAX(s.user_id) AS stock_user_id,
                MAX(c.complaint_for) AS complaint_for,
                MAX(c.energy_company_id) AS energy_company_id,
                MAX(c.ro_id) AS ro_id,
                MAX(c.sale_area_id) AS sale_area_id,
                MAX(c.district_id) AS district_id,
                MAX(c.created_by) AS created_by
            FROM 
                complaints c 
            INNER JOIN 
                expense_punch_history s ON c.id = s.complaint_id 
            INNER JOIN 
                fund_requests st ON s.fund_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '2' 
                AND s.site_approved_status = '0' 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value} 
            GROUP BY 
                DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id 
            ORDER BY 
                MAX(s.approved_at) DESC
            LIMIT ${pageFirstResult} , ${pageSize}
            `;

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const loggedUserType = req.user.user_type;
        const finalData = [];

        let complaintRaiseType;

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                // console.log('row: ', row);
                // const complaintType = await getComplaintTypeById(row.complaint_type);
                row.outlet_id = JSON.parse(row.outlet_id);
                row.ro_id = JSON.parse(row.ro_id);
                row.sale_area_id = JSON.parse(row.sale_area_id);
                let district_id = row.district_id != null ? JSON.parse(row.district_id) : [];
                // district_id = district_id[0];
                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "0",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getOutletsWithComplaintsSiteForFundsById = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        let outletCondition;

        if (id && id > 0) {
            outletCondition = ` AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0`;
        } else {
            outletCondition = ` AND complaints.outlet_id IS NULL`;
        }

        const selectQuery = `
            SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,office_fund_approve.*, office_fund_approve.id as office_fund_approve_id, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id 
            LEFT JOIN office_fund_approve ON office_fund_approve.id = expense_punch_history.office_fund_approve_id
            WHERE expense_punch_history.office_approved_status = '2' AND expense_punch_history.site_approved_status = '0' AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' 
            ${outletCondition} 
        `;

        const result = await db.query(selectQuery);
        if (result.length > 0) {
            const transformedData = await transformDataForFundApproved(result);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: Object.values(transformedData) });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllPendingOutletsWithComplaintsSiteForFunds = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";
        let whereConditions = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // const selectQuery = `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.approved_qty * st.item_price) AS total_cost, c.*, complaint_types.complaint_type_name, s.approved_at AS approved_stock_punch_at, s.user_id as stock_user_id FROM complaints c INNER JOIN expense_punch_history s ON c.id = s.complaint_id INNER JOIN fund_requests st ON s.fund_id = st.id  LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status= '1' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.approved_at DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
                SELECT 
                    DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                    c.outlet_id, 
                    COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                    SUM(s.approved_qty * st.item_price) AS total_cost, 
                    MAX(c.complaint_unique_id) AS complaint_unique_id,
                    MAX(complaint_types.complaint_type_name) AS complaint_type_name,
                    MAX(s.approved_at) AS approved_stock_punch_at, 
                    MAX(s.user_id) AS stock_user_id 
                FROM 
                    complaints c 
                INNER JOIN 
                    expense_punch_history s ON c.id = s.complaint_id 
                INNER JOIN 
                    fund_requests st ON s.fund_id = st.id 
                LEFT JOIN 
                    complaint_types ON complaint_types.id = c.complaint_type 
                WHERE 
                    s.office_approved_status = '2' 
                    AND s.site_approved_status = '1' 
                    AND c.created_by = '${req.user.user_id}' 
                    ${whereConditions} 
                    ${search_value} 
                GROUP BY 
                    DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id 
                ORDER BY 
                    MAX(s.approved_at) DESC
                LIMIT ${pageFirstResult} , ${pageSize}
                `;

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const loggedUserType = req.user.user_type;
        const finalData = [];

        let complaintRaiseType;

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "1",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getPartialOutletsSiteForFundsById = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        const selectQuery = `SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,office_fund_approve.*, office_fund_approve.id as office_fund_approve_id, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id 
        LEFT JOIN office_fund_approve ON office_fund_approve.id = expense_punch_history.office_fund_approve_id
        WHERE expense_punch_history.office_approved_status = '2' AND expense_punch_history.site_approved_status = '1' AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

        const result = await db.query(selectQuery);
        if (result.length > 0) {
            const transformedData = await transformDataForFundApproved(result);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: Object.values(transformedData) });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

async function approvedOutletsSiteForFunds(id, month) {
    const selectQuery = `SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,office_fund_approve.*, office_fund_approve.id as office_fund_approve_id, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id 
            LEFT JOIN office_fund_approve ON office_fund_approve.id = expense_punch_history.office_fund_approve_id
            WHERE expense_punch_history.office_approved_status = '2' AND expense_punch_history.site_approved_status = '2' AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

    const result = await db.query(selectQuery);
    if (result.length > 0) {
        const transformedData = await transformDataForFundApproved(result);
        return Object.values(transformedData);
    } else {
        throw new Error("Data not found");
    }
}

const getApprovedOutletsSiteForFundsById = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        const data = await approvedOutletsSiteForFunds(id, month);
        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Request fetched successfully",
            data: data,
        });
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedOutletsWithComplaintsSiteForFunds = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";
        let whereConditions = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR c.complaint_unique_id LIKE '%${searchData}%') `;
        }

        if (outlet_id != null && outlet_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', c.outlet_id) > 0`;
        }

        if (regional_office_id != null && regional_office_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', c.ro_id) > 0`;
        }

        if (sales_area_id != null && sales_area_id != "") {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', c.sale_area_id) > 0`;
        }

        // let selectQuery = `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.approved_qty * st.item_price) AS total_cost, c.*, complaint_types.complaint_type_name, s.approved_at AS approved_stock_punch_at, s.user_id as stock_user_id FROM complaints c INNER JOIN expense_punch_history s ON c.id = s.complaint_id INNER JOIN fund_requests st ON s.fund_id = st.id  LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '2' AND s.site_approved_status= '2' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.approved_at`;

        let selectQuery = `
            SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.approved_qty * st.item_price) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.approved_at) AS approved_stock_punch_at, 
                MAX(s.user_id) AS stock_user_id,
                MAX(c.complaint_type) AS complaint_type,
                MAX(c.ro_id) AS ro_id,
                MAX(c.sale_area_id) AS sale_area_id,
                MAX(c.district_id) AS district_id,
                MAX(c.outlet_id) AS outlet_id, 
                MAX(c.complaint_for) AS complaint_for,
                MAX(c.energy_company_id) AS energy_company_id
            FROM 
                complaints c 
            INNER JOIN 
                expense_punch_history s ON c.id = s.complaint_id 
            INNER JOIN 
                fund_requests st ON s.fund_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '2' 
                AND s.site_approved_status = '2' 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value} 
            GROUP BY 
                DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id 
            ORDER BY 
                MAX(s.approved_at)
            `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        const loggedUserType = req.user.user_type;
        let finalData = [];

        let complaintRaiseType;

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                console.log("row111: ", row);
                // row.outlet_id = JSON.parse(row.outlet_id);

                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    row.ro_id = JSON.parse(row.ro_id);
                    row.sale_area_id = JSON.parse(row.sale_area_id);
                    // row.outlet_id = JSON.parse(row.outlet_id);
                    let district_id = JSON.parse(row.district_id);
                    // district_id = district_id[0];
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    // console.log('row.outlet_id: ', row.outlet_id);
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != "") {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = "";
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: "2",
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : "",
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    total_complaints: row.complaint_count,
                    total_amount: row.total_cost,
                    approved_stock_punch: row.approved_stock_punch_at,
                    month: row.month,
                });
            }

            if (!pageSize) {
                finalData = finalData.map((item) => {
                    return {
                        ...item,
                        outlet_name: item.outlet[0]?.outlet_name,
                        outlet_unique_id: item.outlet[0]?.outlet_unique_id,
                        regional_office_name: item.regionalOffice[0]?.regional_office_name,
                        sales_area_name: item.saleAreaDetails[0]?.sales_area_name,
                    };
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "site_fund", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "site_fund", "Site Fund Inspection", columns);
                    message = "pdf exported successfully";
                }
                return res.status(StatusCodes.OK).json({ status: true, message, filePath });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const approveSiteInspectionsForFund = async (req, res, next) => {
    try {
        const { approve_fund_punch, office_not_approved, feedback } = req.body;

        const officeApprovedBy = req.user.user_id;
        const office_approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if (!feedback || Object.keys(feedback).length === 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Please fill the details first." });
        }

        const insertResults = await addOfficeInspectionsForFundDetails(feedback, officeApprovedBy);

        for (const data of approve_fund_punch) {
            const { id, fund_id, site_approved_qty } = data;

            if (site_approved_qty <= 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ status: false, message: "Approve Quantity cannot be zero" });
            }

            const selectQuery = await db.query(
                `SELECT eph.* 
                FROM expense_punch_history eph
                WHERE eph.id = ? AND eph.fund_id = ?`,
                [id, fund_id]
            );

            const expenseQuery = `SELECT eph.*, fr.item_price 
                FROM expense_punch_history eph
                LEFT JOIN fund_requests fr ON fr.id = eph.fund_id
                WHERE complaint_id = ?
            `;
            const expenseData = await db.query(expenseQuery, [selectQuery[0].complaint_id]);

            let fundAmount = 0;
            if (expenseData.length > 0) {
                // loop thru fund request and expense punch history to add up fund amounts
                for (const item of expenseData) {
                    fundAmount += item.office_approved_qty * item.item_price;
                }
            }

            if (selectQuery.length > 0) {
                const matchingResult = insertResults.find(
                    (result) => result.complaint_id === selectQuery[0].complaint_id
                );

                if (matchingResult) {
                    const { insertOrUpdateId, complaint_id } = matchingResult;

                    const updateQuery = `
                        UPDATE expense_punch_history 
                        SET site_approved_status = '2', site_approved_qty = ?, site_approved_by = ?, site_approved_at = ?, 
                        site_fund_approve_id = ?
                        WHERE id = ? AND fund_id = ?
                    `;

                    await db.query(updateQuery, [
                        site_approved_qty,
                        officeApprovedBy,
                        office_approved_at,
                        insertOrUpdateId,
                        id,
                        fund_id,
                    ]);

                    await db.query(`UPDATE complaints SET fund_amount = ? WHERE id = ? `, [fundAmount, complaint_id]);
                }
            }
        }

        if (Array.isArray(office_not_approved) && office_not_approved.length > 0) {
            await siteNotApprovedForFund(office_not_approved, office_approved_at);
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Site inspections approved successfully." });
    } catch (error) {
        return next(error);
    }
};

// const addOfficeInspectionsForFundDetails = async (outletDetails, officeApprovedBy) => {
//     try {
//         const { outlet_honor_name, contact_number, office_inspection_for, area_manager, supervisor, end_users, remarks } = outletDetails;
//         const office_approved_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
//         const insertQuery = `INSERT INTO office_fund_approve (outlet_honor_name, contact_number, office_inspection_for, area_manager, supervisor, end_users, remarks, created_by, created_at, approve_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//         const query = await db.query(insertQuery, [outlet_honor_name, contact_number, office_inspection_for, area_manager, supervisor, end_users, remarks, officeApprovedBy, office_approved_at, '1']);
//         return query.insertId;

//     } catch (error) {next(error)
//         throw new Error("Error while adding office inspection details: " + error.message);
//     }
// }

const siteNotApprovedForFund = async (office_not_approved, office_approved_at) => {
    try {
        for (const office of office_not_approved) {
            const { id, fund_id } = office;
            const updateQuery = `UPDATE expense_punch_history SET site_approved_status = '1', site_approved_at = '${office_approved_at}' WHERE id = '${id}'`;
            const query = await db.query(updateQuery);
        }
    } catch (error) {
        throw new Error("Error executing  site_not_approved command   " + error.message);
    }
};

async function transformDataFund(data) {
    const transformedDataFund = {};
    // Iterate through each entry in the data
    for (const entry of data) {
        const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for } = entry;
        let outletDetails;

        try {
            // Call the asynchronous function inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);

            // Check if the user details are already added

            const complaintType = await getComplaintTypeById(complaint_type);

            if (complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
                company_name = energyCompanyName.name ? energyCompanyName.name : "";
                const selectedOutlets = await getOutletById(outlet_id);
                outletDetails = selectedOutlets;
            } else {
                const energyCompanyName = await getCompanyDetailsById(energy_company_id);
                company_name = energyCompanyName.company_name;
                outletDetails = "";
            }

            if (!transformedDataFund[user_id]) {
                transformedDataFund[user_id] = { userDetails, outletDetails, itemDetails: [], total: 0 };
            }

            // Add item details to the array

            const itemDetail = {
                id: entry.expense_punch_history_id,
                complaint_id: entry.complaint_id,
                complaint_unique_id: entry.complaint_unique_id,
                fund_id: entry.fund_id,
                item_id: entry.item_id,
                item_name: entry.item_name,
                item_image: entry.item_image,
                item_rate: entry.item_price,
                item_qty: entry.item_qty,
                punch_by: entry.punch_by,
                punch_at: entry.punch_at,
                status: entry.status,
                approved_qty: entry.approved_qty,
                approved_amount: entry.approved_amount,
                approved_by: entry.approved_by,
                approved_at: moment(entry.approved_at).format("YYYY-MM-DD HH:mm:ss A"),
                fund_user_id: entry.user_id,
                total_item_qty: entry.item_qty,
                total_approved_qty: entry.approved_qty,
                total_approved_amount: entry.item_price * entry.approved_qty,
                office_approved_qty: entry.office_approved_qty,
                total_office_approved_amount: entry.item_price * entry.office_approved_qty,
            };

            // Add the total_approved_amount of this item to the total sum
            transformedDataFund[user_id].total += itemDetail.total_approved_amount;
            transformedDataFund[user_id].itemDetails.push(itemDetail);
        } catch (error) {
            console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
            throw error;
        }
    }

    return transformedDataFund;
}

// async function transformDataForFundApproved(data) {
//     const transformedData = {};

//     // Iterate through each entry in the data
//     for (const entry of data) {
//         const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for, complaint_id } = entry;
//         let outletDetails;

//         try {
//             // Call the asynchronous function inside a try-catch block
//             const userDetails = await getAdminAndUserDetail(user_id);
//             const getAssignDetail =  await getAssignDetailsForFund(complaint_id)
//             // Check if the user details are already added

//             const complaintType = await getComplaintTypeById(complaint_type);

//             if (complaint_for == '1') {
//                 const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
//                 company_name = energyCompanyName.name ? energyCompanyName.name : "";
//                 const selectedOutlets = await getOutletById(outlet_id);
//                 outletDetails = selectedOutlets;

//             }
//             else {
//                 const energyCompanyName = await getCompanyDetailsById(energy_company_id);
//                 company_name = energyCompanyName.company_name;
//                 outletDetails = ''
//             }

//             if (!transformedData[user_id]) {
//                 transformedData[user_id] = { userDetails, getAssignDetail, outletDetails, itemDetails: [], total: 0, total_site_amount: 0 };
//             }
//             // Add item details to the array
//             const itemDetail = {
//                 id: entry.expense_punch_history_id,
//                 complaint_id: entry.complaint_id,
//                 complaint_unique_id: entry.complaint_unique_id,
//                 fund_id: entry.fund_id,
//                 item_id: entry.item_id,
//                 item_name: entry.item_name,
//                 item_image: entry.item_image,
//                 item_rate: entry.item_price,
//                 item_qty: entry.item_qty,
//                 punch_by: entry.punch_by,
//                 punch_at: entry.punch_at,
//                 status: entry.status,
//                 approved_qty: entry.approved_qty,
//                 approved_amount: entry.approved_amount,
//                 approved_by: entry.approved_by,
//                 approved_at: moment(entry.approved_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 fund_user_id: entry.fund_user_id,
//                 total_item_qty: entry.item_qty,
//                 total_approved_qty: entry.approved_qty,
//                 total_approved_amount: entry.item_price * entry.approved_qty,
//                 office_approved_qty: entry.office_approved_qty,
//                 total_approved_amounts: entry.item_price * entry.office_approved_qty,
//                 office_fund_approve_id: entry.office_fund_approve_id,
//                 site_fund_approve_id: entry.site_fund_approve_id,
//                 site_approved_qty: entry.site_approved_qty,
//                 total_site_approved_amount: entry.item_price * entry.site_approved_qty
//             };

//             // Add the total_approved_amount of this item to the total sum
//             transformedData[user_id].total += itemDetail.total_approved_amounts;
//             transformedData[user_id].total_site_amount += itemDetail.total_site_approved_amount;

//             transformedData[user_id].itemDetails.push(itemDetail);

//             let officeId = entry.site_fund_approve_id;

//             const selectQuery = await db.query(`select * from office_fund_approve where id = ${officeId}`)

//             const result = await db.query(selectQuery);
//             if (result.length > 0) {
//                 // Add the fetched data to confirmDetails under transformedData
//                 if (!transformedData[user_id].confirmDetails) {
//                     transformedData[user_id].confirmDetails = [];
//                 }
//             }

//             transformedData[user_id].confirmDetails = transformedData[user_id].confirmDetails.concat(result[0]);

//         } catch (error) {next(error)
//             console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
//         }
//     }

//     return transformedData;
// }

// async function transformDataForFundApproved(data) {
//     const transformedData = {};
//     const officeFundApproveCache = {};

//     // Iterate through each entry in the data
//     for (const entry of data) {
//         const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for, complaint_id } = entry;
//         let outletDetails;

//         try {
//             // Call the asynchronous functions inside a try-catch block
//             const userDetails = await getAdminAndUserDetail(user_id);
//             const getAssignDetail = await getAssignDetailsForFund(complaint_id);
//             const complaintType = await getComplaintTypeById(complaint_type);

//             if (complaint_for == '1') {
//                 const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
//                 company_name = energyCompanyName.name ? energyCompanyName.name : "";
//                 outletDetails = await getOutletById(outlet_id);
//             } else {
//                 const energyCompanyName = await getCompanyDetailsById(energy_company_id);
//                 company_name = energyCompanyName.company_name;
//                 outletDetails = '';
//             }

//             if (!transformedData[user_id]) {
//                 transformedData[user_id] = { userDetails, getAssignDetail, outletDetails, itemDetails: [], total: 0, total_site_amount: 0, confirmDetails: [] };
//             }

//             // Add item details to the array
//             const itemDetail = {
//                 id: entry.expense_punch_history_id,
//                 complaint_id: entry.complaint_id,
//                 complaint_unique_id: entry.complaint_unique_id,
//                 fund_id: entry.fund_id,
//                 item_id: entry.item_id,
//                 item_name: entry.item_name,
//                 item_image: entry.item_image,
//                 item_rate: entry.item_price,
//                 item_qty: entry.item_qty,
//                 punch_by: entry.punch_by,
//                 punch_at: entry.punch_at,
//                 status: entry.status,
//                 approved_qty: entry.approved_qty,
//                 approved_amount: entry.approved_amount,
//                 approved_by: entry.approved_by,
//                 approved_at: moment(entry.approved_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 fund_user_id: entry.fund_user_id,
//                 total_item_qty: entry.item_qty,
//                 total_approved_qty: entry.approved_qty,
//                 total_approved_amount: entry.item_price * entry.approved_qty,
//                 office_approved_qty: entry.office_approved_qty,
//                 total_approved_amounts: entry.item_price * entry.office_approved_qty,
//                 office_fund_approve_id: entry.office_fund_approve_id,
//                 site_fund_approve_id: entry.site_fund_approve_id,
//                 site_approved_qty: entry.site_approved_qty,
//                 total_site_approved_amount: entry.item_price * entry.site_approved_qty
//             };

//             // Add the total_approved_amount of this item to the total sum
//             transformedData[user_id].total += itemDetail.total_approved_amounts;
//             transformedData[user_id].total_site_amount += itemDetail.total_site_approved_amount;
//             transformedData[user_id].itemDetails.push(itemDetail);

//             const office_fund_approve_id = entry.site_fund_approve_id;

//             if (!officeFundApproveCache[office_fund_approve_id]) {
//                 const selectQuery = `SELECT * FROM office_fund_approve WHERE id = ${office_fund_approve_id}`;
//                 const result = await db.query(selectQuery);

//                 if (result.length > 0) {
//                     officeFundApproveCache[office_fund_approve_id] = result[0];
//                 } else {
//                     officeFundApproveCache[office_fund_approve_id] = null;
//                 }
//             }

//             // Add the fetched data to confirmDetails under transformedData if not already added
//             if (officeFundApproveCache[office_fund_approve_id] && !transformedData[user_id].confirmDetails.some(detail => detail.id === office_fund_approve_id)) {
//                 transformedData[user_id].confirmDetails.push(officeFundApproveCache[office_fund_approve_id]);
//             }

//         } catch (error) {next(error)
//             console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
//         }
//     }

//     return transformedData;
// }

async function transformDataForFundApproved(data) {
    const transformedData = {};
    const officeFundApproveCache = {};
    const siteFundApproveCache = {};

    // Iterate through each entry in the data
    for (const entry of data) {
        const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for, complaint_id } = entry;
        let outletDetails;

        try {
            // Call the asynchronous functions inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);
            const getAssignDetail = await getAssignDetailsForFund(complaint_id);
            const complaintType = await getComplaintTypeById(complaint_type);

            if (complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
                company_name = energyCompanyName.name ? energyCompanyName.name : "";
                outletDetails = await getOutletById(outlet_id);
            } else {
                const energyCompanyName = await getCompanyDetailsById(energy_company_id);
                company_name = energyCompanyName.company_name;
                outletDetails = "";
            }

            if (!transformedData[user_id]) {
                transformedData[user_id] = {
                    userDetails,
                    getAssignDetail,
                    outletDetails,
                    itemDetails: [],
                    total: 0,
                    total_site_amount: 0,
                    confirmDetails: { office: [], site: [] },
                };
            }

            // Add item details to the array
            const itemDetail = {
                id: entry.expense_punch_history_id,
                complaint_id: entry.complaint_id,
                complaint_unique_id: entry.complaint_unique_id,
                fund_id: entry.fund_id,
                item_id: entry.item_id,
                item_name: entry.item_name,
                item_image: entry.item_image,
                item_rate: entry.item_price,
                item_qty: entry.item_qty,
                punch_by: entry.punch_by,
                punch_at: entry.punch_at,
                status: entry.status,
                approved_qty: entry.approved_qty,
                approved_amount: entry.approved_amount,
                approved_by: entry.approved_by,
                approved_at: moment(entry.approved_at).format("YYYY-MM-DD HH:mm:ss A"),
                fund_user_id: entry.fund_user_id,
                total_item_qty: entry.item_qty,
                total_approved_qty: entry.approved_qty,
                total_approved_amount: entry.item_price * entry.approved_qty,
                office_approved_qty: entry.office_approved_qty,
                total_approved_amounts: entry.item_price * entry.office_approved_qty,
                office_fund_approve_id: entry.office_fund_approve_id,
                site_fund_approve_id: entry.site_fund_approve_id,
                site_approved_qty: entry.site_approved_qty,
                total_site_approved_amount: entry.item_price * entry.site_approved_qty,
            };

            // Add the total_approved_amount of this item to the total sum
            transformedData[user_id].total += itemDetail.total_approved_amounts;
            transformedData[user_id].total_site_amount += itemDetail.total_site_approved_amount;
            transformedData[user_id].itemDetails.push(itemDetail);

            const office_fund_approve_id = entry.office_fund_approve_id;
            const site_fund_approve_id = entry.site_fund_approve_id;

            if (office_fund_approve_id) {
                if (!officeFundApproveCache[office_fund_approve_id]) {
                    const selectQuery = `SELECT * FROM office_fund_approve WHERE id = ${office_fund_approve_id}`;
                    const result = await db.query(selectQuery);

                    if (result.length > 0) {
                        officeFundApproveCache[office_fund_approve_id] = result[0];
                        transformedData[user_id].confirmDetails.office.push(result[0]);
                    } else {
                        officeFundApproveCache[office_fund_approve_id] = null;
                    }
                }
            }

            if (site_fund_approve_id) {
                if (!siteFundApproveCache[site_fund_approve_id]) {
                    const selectQuery = `SELECT * FROM office_fund_approve WHERE id = ${site_fund_approve_id}`;
                    const result = await db.query(selectQuery);

                    if (result.length > 0) {
                        siteFundApproveCache[site_fund_approve_id] = result[0];
                        transformedData[user_id].confirmDetails.site.push(result[0]);
                    } else {
                        siteFundApproveCache[site_fund_approve_id] = null;
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
            throw error;
        }
    }

    return transformedData;
}

async function getAssignDetailsForFund(complaint_id) {
    const selectQuery = `SELECT si.*, u1.id AS area_manager_id, u1.name AS area_manager_name, u1.image AS area_manager_image, u1.employee_id AS area_manager_employee_id, u2.id AS supervisor_id, u2.name AS supervisor_name, u2.image AS supervisor_image, u2.employee_id AS supervisor_employee_id, u3.id AS end_user_id, u3.name AS end_user_name, u3.image AS end_user_image, u3.employee_id AS end_user_employee_id, 
    u4.id AS office_user_id, u4.name AS office_user_name, u4.image AS office_user_image, u4.employee_id AS office_user_employee_id FROM fund_inspections AS si LEFT JOIN users AS u1 ON si.area_manager_id = u1.id LEFT JOIN users AS u2 ON si.supervisor_id = u2.id LEFT JOIN users AS u3 ON si.end_users_id = u3.id LEFT JOIN users AS u4 ON si.office_users_id = u4.id WHERE si.complaint_id =  '${complaint_id}' `;

    return await db.query(selectQuery);
}

/** function to save feedback form to approve office fund */
const fundFeedbackForm = async (req, res, next) => {
    try {
        const {
            area_manager,
            supervisor,
            technician,
            supervisor_number,
            technician_number,
            start_date,
            completion_date,
            complaint_number,
            outlet,
            location,
            work_details,
            ro_name,
            sales_area,
            contact_person_name,
            contact_person_number,
            email_id,
            feedback,
            complaint_feedback,
            suggestion_feedback,
        } = req.body;

        // Insert the feedback for details
        const insertQuery = await db.query(
            `
            INSERT INTO office_fund_approve (area_manager, supervisor, supervisor_number, end_users, end_users_number, start_date, completion_date, complaint_number, outlet_owner_name, location, work_details, regional_office, sales_area, contact_person, contact_person_number, email, feedback, complaint_feedback, suggestion_feedback, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                area_manager,
                supervisor,
                supervisor_number,
                technician,
                technician_number,
                start_date,
                completion_date,
                complaint_number,
                outlet,
                location,
                work_details,
                ro_name,
                sales_area,
                contact_person_name,
                contact_person_number,
                email_id,
                JSON.stringify(feedback, null, 2),
                complaint_feedback || null,
                suggestion_feedback || null,
                req.user.user_id,
            ]
        );

        if (insertQuery.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Feedback submitted successfully",
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Failed to save feedback",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    verifiedUsedItems,
    getAllVerifiedComplaintItems,
    verifiedExpensesFromSite,
    getAllVerifiedSiteExpenseList,
    getAllSiteInspection,
    getAllSiteInspectionById,
    assignComplaints,
    approveSiteInspections,
    getAllSiteInspectionApproved,
    getAllSiteInspectionPartial,
    getAllSiteInspectionPartialById,
    getAllSiteInspectionApprovedById,
    getAllOutletsWithComplaintsSiteForFunds,
    getOutletsWithComplaintsSiteForFundsById,
    approveSiteInspectionsForFund,
    getAllPendingOutletsWithComplaintsSiteForFunds,
    getAllApprovedOutletsWithComplaintsSiteForFunds,
    getPartialOutletsSiteForFundsById,
    getApprovedOutletsSiteForFundsById,
    assignComplaintsForFundSite,
    approvedOutletsSiteForFunds,
    siteInspection,
    transformDataForFundApproved,
};

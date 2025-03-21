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
    getZoneNameById,
    roleById,
} = require("../helpers/general");
const { isArray } = require("lodash");
const { exportToExcel, exportToPDF } = require("./contractorComplaintController");

const getAllSaleAreaAndOutlet = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["outlets.outlet_name", "outlets.location", "sales_area.sales_area_name"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY outlets.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT outlets.id as outlet_id, outlets.outlet_name, outlets.location, outlets.sales_area_id,sales_area.sales_area_name FROM outlets LEFT JOIN sales_area ON sales_area.id = outlets.sales_area_id WHERE outlets.sales_area_id = '${id}' ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
            } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        //remove the order limit for pagination
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: queryResult,
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

const getOutletComplaints = async (req, res, next) => {
    try {
        const outlet_id = req.params.outlet_id;
        const { error } = checkPositiveInteger.validate({ id: outlet_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["complaint_types.complaint_type_name", "complaints.complaint_unique_id"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }
        //get outlet details
        var outletData = {};
        const outlet_details = await db.query(
            `SELECT outlets.id as outlet_id, outlets.outlet_name, outlets.location FROM outlets WHERE outlets.id = '${outlet_id}'`
        );

        if (outlet_details.length > process.env.VALUE_ZERO) {
            outletData = outlet_details[0];
        } else {
            outletData;
        }

        const orderLimitQuery = `ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE JSON_CONTAINS(outlet_id, '${outlet_id}', '$') ${searchConditions.length > 0 ? `AND (${searchConditions.join(" OR ")}) ` : ""
            } ${orderLimitQuery}`;

        const queryResult = await db.query(selectQuery);

        //remove the order limit for pagination
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const matched_outlet_id = await checkMatchedOutletId(outlet_id, row.outlet_id);
                const complaintApprovalByDetail = await getCreatedByDetails(row.complaints_approval_by);

                finalData.push({
                    id: row.id,
                    outlet_id: matched_outlet_id,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type: row.complaint_type,
                    description: row.description,
                    status: row.status,
                    complaints_approval_by: row.complaints_approval_by,
                    complaints_approval_by_name: complaintApprovalByDetail.name,
                    status_changed_by: row.status_changed_by,
                    status_changed_on: row.status_changed,
                    resolved_by: row.resolved_by,
                    resolved_on: row.resolved_on,
                    complaint_raise_by: row.complaint_raise_by,
                    complaint_type_name: row.complaint_type_name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Complaints found",
                outletDetails: outletData,
                complaintData: finalData,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Complaints not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getApprovedUsedItemsOnComplaint = async (req, res, next) => {
    try {
        const complaint_id = req.params.complaint_id;
        const complaintIdValidate = Joi.object({
            complaint_id: Joi.string().required(),
        });

        const { error } = complaintIdValidate.validate({ complaint_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["users.name", "expenses.expense_amount", "expenses.payment_method"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        // complaint basics details
        const complaintDetails = await db.query(
            `SELECT complaints.id as complaint_id, complaints.complaint_unique_id, complaints.status, complaints.description, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.complaint_unique_id = ?`,
            [complaint_id]
        );

        const orderLimitQuery = `ORDER BY expenses.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const itemsSelectQuery = `SELECT expenses.id, expenses.expense_date, expenses.expense_amount, expenses.payment_method, expenses.receipt_invoice, expenses.receipt_invoice, expenses.user_id, expenses.complaint_id, expenses.expense_description, expenses.status, expenses.approved_amount, expenses.approved_by, expenses.approved_at, users.name as user_name, users.image, users.employee_id FROM expenses LEFT JOIN users ON users.id = expenses.user_id WHERE expenses.complaint_id = '${complaintDetails[0].complaint_id}' AND expenses.status = '${1}' ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""} ${orderLimitQuery}`;

        const itemQueryResult = await db.query(itemsSelectQuery);

        //remove the order limit for pagination
        const modifiedQueryString = itemsSelectQuery.substring(0, itemsSelectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        var complaintData = {};
        if (complaintDetails.length > process.env.VALUE_ZERO) {
            complaintData = complaintDetails[0];
        } else {
            complaintData;
        }
        if (itemQueryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of itemQueryResult) {
                const approvedBy = await getCreatedByDetails(row.approved_by);
                row.expense_date = moment(row.expense_date).format("YYYY-MM-DD");
                row.approved_at = moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss");
                row.approved_by_name = approvedBy.name;
                row.approved_by_image = approvedBy.image;
                row.approved_by_employee_id = approvedBy.employee_id;
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                complaintDetails: complaintData,
                data: itemQueryResult,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
                complaintDetails: complaintData,
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getPendingUsedItemsOnComplaint = async (req, res, next) => {
    try {
        const complaint_id = req.params.complaint_id;
        const complaintIdValidate = Joi.object({
            complaint_id: Joi.string().required(),
        });

        const { error } = complaintIdValidate.validate({ complaint_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // pagination
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ["users.name", "expenses.expense_amount", "expenses.payment_method"];
        const searchConditions = [];

        if (searchData != null && searchData != "") {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        // complaint basics details
        const complaintDetails = await db.query(
            `SELECT complaints.id as complaint_id, complaints.complaint_unique_id, complaints.status, complaints.description, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.complaint_unique_id = ?`,
            [complaint_id]
        );

        const orderLimitQuery = `ORDER BY expenses.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const itemsSelectQuery = `SELECT expenses.id, expenses.expense_date, expenses.expense_amount, expenses.payment_method, expenses.receipt_invoice, expenses.receipt_invoice, expenses.user_id, expenses.complaint_id, expenses.expense_description, expenses.status, users.name as user_name, users.image, users.employee_id FROM expenses LEFT JOIN users ON users.id = expenses.user_id WHERE expenses.complaint_id = '${complaintDetails[0].complaint_id}' AND expenses.status = '${0}' ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""} ${orderLimitQuery}`;

        const itemQueryResult = await db.query(itemsSelectQuery);
        //remove the order limit for pagination
        const modifiedQueryString = itemsSelectQuery.substring(0, itemsSelectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        var complaintData = {};
        if (complaintDetails.length > process.env.VALUE_ZERO) {
            complaintData = complaintDetails[0];
        } else {
            complaintData;
        }

        if (itemQueryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of itemQueryResult) {
                row.expense_date = moment(row.expense_date).format("YYYY-MM-DD");
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                complaintDetails: complaintData,
                data: itemQueryResult,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
                complaintDetails: complaintData,
            });
        }
    } catch (error) {
        return next(error);
    }
};

const approvedUsedItems = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get amount and date for that expense
        const getExpenseData = await db.query("SELECT * FROM expenses WHERE id = ?", [id]);
        const data = getExpenseData[0];
        const approved_amount = data.expense_amount;
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE expenses SET status = ?, approved_amount = ?, approved_by = ?, approved_at = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [
            process.env.APPROVED,
            approved_amount,
            approved_by,
            approved_at,
            id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Item approved successfully",
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

async function checkMatchedOutletId(outlet_id, outlet_list) {
    if (outlet_list.includes(outlet_id)) {
        const matched_outlet_id = outlet_id;
        return matched_outlet_id;
    } else {
        return "";
    }
}

const assignApprovedItems = async (req, res, next) => {
    try {
        const { item_id, user_id } = req.body;

        const assignToValidation = Joi.object({
            item_id: Joi.number().required(),
            user_id: Joi.number().required(),
        });

        const { error } = assignToValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const assignQuery = "UPDATE items_used SET assign_to = ?, assign_by = ?, assign_at = ? WHERE item_id = ?";
        const assign_by = req.user.user_id;
        const assign_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(assignQuery, [user_id, assign_by, assign_at, item_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assigned successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

//Expense from office inspection approved

const getAllApprovedExpenseList = async (req, res, next) => {
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
        const query = `SELECT fund_requests.id, fund_requests.request_by, fund_requests.request_purpose, fund_requests.supporting_document, fund_requests.request_amount, fund_requests.request_date, fund_requests.status, fund_requests.office_inspection_status, fund_requests.status_changed_by, fund_requests.status_changed_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM fund_requests LEFT JOIN complaints ON complaints.id = fund_requests.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE fund_requests.status = '1' ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
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

                finalData.push({
                    id: row.id,
                    request_by: row.request_by,
                    request_by_name: requestByDetail.name,
                    request_purpose: row.request_purpose,
                    supporting_document: row.supporting_document,
                    request_amount: row.request_amount,
                    request_date: moment(row.request_date).format("YYYY-MM-DD"),
                    status: row.status,
                    office_inspection_status: row.office_inspection_status,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_type_name: row.complaint_type_name,
                    status_changed_by: row.status_changed_by,
                    status_changed_by_name: statusChangedBy.name,
                    status_changed_at: moment(row.status_changed_at).format("YYYY-MM-DD HH:mm:ss A"),
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

const approvedExpensesFromOffice = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const updateQuery = `UPDATE fund_requests SET office_inspection_status = ?, office_inspection_approved_by = ?, office_inspection_approved_at = ? WHERE id= ?`;

        const status = process.env.APPROVED;
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(updateQuery, [status, approved_by, approved_at, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Expense approved successfully",
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

const getAllApprovedOfficeExpenseList = async (req, res, next) => {
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
        const query = `SELECT fund_requests.id, fund_requests.request_by, fund_requests.request_purpose, fund_requests.supporting_document, fund_requests.request_amount, fund_requests.request_date, fund_requests.status, fund_requests.office_inspection_status, fund_requests.status_changed_by, fund_requests.status_changed_at, fund_requests.office_inspection_approved_by, fund_requests.office_inspection_approved_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM fund_requests LEFT JOIN complaints ON complaints.id = fund_requests.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE fund_requests.status = '1' AND fund_requests.office_inspection_status = '1' ${searchConditions.length > 0 ? `AND ${searchConditions.join(" OR ")} ` : ""
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

const getAllSaleAreaList = async (req, res, next) => {
    try {
        const selectQuery = "SELECT id, sales_area_name FROM sales_area";

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
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

const assignApprovedExpense = async (req, res, next) => {
    try {
        const { expense_id, user_id } = req.body;

        const assignToValidation = Joi.object({
            expense_id: Joi.number().required(),
            user_id: Joi.number().required(),
        });

        const { error } = assignToValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const assignQuery = "UPDATE fund_requests SET assign_to = ?, assign_by = ?, assign_at = ? WHERE id = ?";
        const assign_by = req.user.user_id;
        const assign_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(assignQuery, [user_id, assign_by, assign_at, expense_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assigned successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// office inspection for Stock request pending and approved punch

// get all pending punched stocks
const getAllStockPunchedList = async (req, res, next) => {
    try {
        const id = req.params.id;
        const status = req.params.status;

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%')`;
        }

        // get complaint id by unquie id
        const complaintDetails = await db.query(
            `SELECT id, complaint_unique_id  FROM complaints WHERE complaint_unique_id = ?`,
            [id]
        );
        const complaintId = complaintDetails[0].id;

        const selectQuery = `SELECT stock_punch_histories.*, complaints.complaint_unique_id, users.name as user_name, users.image as user_image, users.employee_id as employee_id FROM stock_punch_histories LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id LEFT JOIN users ON users.id = stock_punch_histories.user_id WHERE stock_punch_histories.complaint_id = '${complaintId}' AND stock_punch_histories.status = '${status}'  ${search_value} ORDER BY stock_punch_histories.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                if (row.status == 1) {
                    // for approved data
                    const approvedDetails = await getCreatedByDetails(row.approved_by);

                    finalData.push({
                        id: row.id,
                        user_id: row.user_id,
                        user_name: row.user_name,
                        employee_id: row.employee_id,
                        user_image: row.user_image,
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id,
                        approved_by: row.approved_by,
                        approved_by_employee_id: approvedDetails.employee_id,
                        approved_by_name: approvedDetails.name,
                        approved_by_image: approvedDetails.image,
                        approved_at: moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss A"),
                        stock_punch_detail: JSON.parse(row.stock_punch_detail),
                        punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                    });
                } else {
                    // for pending data
                    finalData.push({
                        id: row.id,
                        user_id: row.user_id,
                        user_name: row.user_name,
                        employee_id: row.employee_id,
                        user_image: row.user_image,
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id,
                        punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                        stock_punch_detail: JSON.parse(row.stock_punch_detail),
                    });
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
                complaintDetails: complaintDetails[0],
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

// get single punched stock request details on status o/1 for both pending nd approved
const getSingleStockPunchedDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const status = req.params.status;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT stock_punch_histories.*, complaints.complaint_unique_id FROM stock_punch_histories LEFT JOIN complaints ON complaints.id = stock_punch_histories.complaint_id WHERE stock_punch_histories.id = '${id}' AND stock_punch_histories.status = '${status}'`;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (row of queryResult) {
                const userDetails = await getCreatedByDetails(row.user_id);

                if (row.status == 1) {
                    // for approved data
                    const approvedDetails = await getCreatedByDetails(row.approved_by);

                    finalData.push({
                        id: row.id,
                        user_id: row.user_id,
                        user_name: userDetails.name,
                        employee_id: userDetails.employee_id,
                        user_image: userDetails.image,
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id,
                        status: row.status,
                        approved_by: row.approved_by,
                        approved_by_employee_id: approvedDetails.employee_id,
                        approved_by_name: approvedDetails.name,
                        approved_by_image: approvedDetails.image,
                        approved_at: moment(row.approved_at).format("YYYY-MM-DD HH:mm:ss A"),
                        stock_punch_detail: JSON.parse(row.stock_punch_detail),
                        punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                    });
                } else {
                    // for pending data
                    finalData.push({
                        id: row.id,
                        user_id: row.user_id,
                        user_name: userDetails.name,
                        employee_id: userDetails.employee_id,
                        user_image: userDetails.image,
                        complaint_id: row.complaint_id,
                        status: row.status,
                        complaint_unique_id: row.complaint_unique_id,
                        punch_at: moment(row.punch_at).format("YYYY-MM-DD HH:mm:ss A"),
                        stock_punch_detail: JSON.parse(row.stock_punch_detail),
                    });
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
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

// approved stock punched details in office inspection
const approvedPunchedStockDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        const status = "1";
        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(
            `UPDATE stock_punch_histories SET status = ?, approved_by = ?, approved_at = ? WHERE id = ?`,
            [status, approved_by, approved_at, id]
        );

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Punched stock approved successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// assign approved Stock punch details to the users
const assignApprovedItemStock = async (req, res, next) => {
    try {
        const { item_stock_id, user_id } = req.body;

        const assignToValidation = Joi.object({
            item_stock_id: Joi.number().required(),
            user_id: Joi.number().required(),
        });

        const { error } = assignToValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const assignQuery = "UPDATE stock_punch_histories SET assign_to = ?, assign_by = ?, assign_at = ? WHERE id = ?";
        const assign_by = req.user.user_id;
        const assign_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const queryResult = await db.query(assignQuery, [user_id, assign_by, assign_at, item_stock_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Assigned successfully",
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! Something went wrong during request",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// office stock inspections

const getAllOutletsWithComplaints = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const user_id = req.query.user_id;

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

        if (user_id != null && user_id != "") {
            whereConditions += ` AND FIND_IN_SET('${user_id}', s.user_id) > 0`;
        }

        const selectQuery = `
            SELECT 
                MAX(users.id) AS user_id,
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.approved_qty * st.rate) AS total_cost, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.approved_at) AS approved_stock_punch_at, 
                s.user_id AS stock_user_id, 
                MAX(users.username) AS username, 
                MAX(users.employee_id) AS employee_id, 
                MAX(users.image) AS user_image, 
                MAX(c.complaint_type) AS complaint_type,
                MAX(c.energy_company_id) AS energy_company_id,
                MAX(c.complaint_for) AS complaint_for,
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
                users ON users.id = st.requested_by 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.approved_qty != 0  
                AND s.office_approved_status = 0 
                AND users.user_type IN ('6', '7') 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value} 
            GROUP BY 
                s.user_id, DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id 
            ORDER BY 
                MAX(s.approved_at) DESC
            LIMIT ${pageFirstResult} , ${pageSize}
        `;

        // console.log('selectQuery: ', selectQuery);
        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        // const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of result) {
                // console.log('row: ', row);
                let outletDetails;
                let company_name;
                let districtDetailsData = [];
                var order_by_name = "";
                let regionalOfficeDetails;
                let saleAreaDetails;
                // const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                    regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    if (row.district_id != null && row.district_id != "") {
                        districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                    }
                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                    }
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                    order_by_name = row.order_by;
                }

                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                let employeeDetail = null;
                if (row.user_id) {
                    employeeDetail = {
                        id: row.user_id,
                        username: row.username,
                        employee_id: row.employee_id,
                        image: row.image,
                    };
                }

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    employee: employeeDetail,
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

const getAllOutletsWithComplaintsById = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE  stock_punch_histories.office_approved_qty IS NULL AND DATE_FORMAT(stock_punch_histories.approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0`;

        const result = await db.query(selectQuery);

        if (result.length > 0) {
            const transformedData = await transformData(result);
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

async function transformData(data) {
    const transformedData = {};

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

            if (!transformedData[user_id]) {
                transformedData[user_id] = { userDetails, outletDetails, itemDetails: [], total: 0 };
            }

            // Add item details to the array
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
            };

            // Add the total_approved_amount of this item to the total sum
            transformedData[user_id].total += itemDetail.total_approved_amount;

            transformedData[user_id].itemDetails.push(itemDetail);
        } catch (error) {
            console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
            throw error;
        }
    }

    return transformedData;
}

const approveOfficeInspections = async (req, res, next) => {
    try {
        const { approve_stock_punch, office_not_approved, feedback } = req.body;

        const officeApprovedBy = req.user.user_id;
        const office_approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if (!feedback || Object.keys(feedback).length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please fill the details first." });
        }
        const insertResults = await addOfficeInspectionsDetails(feedback, officeApprovedBy);

        for (const data of approve_stock_punch) {
            const { id, stock_id, approve_office_qty } = data;
            if (approve_office_qty <= 0) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Quantity cannot be zero." });
            }
            const selectQuery = await db.query(`SELECT * FROM stock_punch_histories WHERE id = ? AND stock_id = ?`, [
                id,
                stock_id,
            ]);

            if (selectQuery.length > 0) {
                // Find the matching complaint_id from the feedback
                const matchingResult = insertResults.find(
                    (result) => result.complaint_id === selectQuery[0].complaint_id
                );
                if (matchingResult) {
                    const { insertOrUpdateId, complaint_id } = matchingResult;
                    const updateQuery = `
                    UPDATE stock_punch_histories 
                    SET office_approved_status = '2', office_approved_qty = ?, office_approved_by = ?, office_approved_at = ?, office_expense_approve_id = ?
                        WHERE id = ? AND stock_id = ?
                    `;
                    await db.query(updateQuery, [
                        approve_office_qty,
                        officeApprovedBy,
                        office_approved_at,
                        insertOrUpdateId,
                        id,
                        stock_id,
                    ]);
                }
            }
        }

        await officeNotApproved(office_not_approved, office_approved_at);

        return res.status(StatusCodes.OK).json({ status: true, message: "Office Inspections Approved Successfully." });
    } catch (error) {
        return next(error);
    }
};

// stock approved in site inspections
const addOfficeInspectionsDetails = async (feedback, officeApprovedBy) => {
    try {
        let results = [];

        for (const row of feedback) {
            const {
                contact_person_name,
                contact_person_no,
                contact_person_email,
                feedback,
                complaints,
                suggestions,
                complaint_unique_id,
                complaint_id,
                approve_type,
            } = row;

            const selectQuery = await db.query(
                `
                SELECT * FROM office_expense_approve WHERE complaint_unique_id = ? AND approve_type = ?
            `,
                [complaint_unique_id, approve_type]
            );

            if (selectQuery.length > 0) {
                const updateResult = await db.query(
                    `
                    UPDATE office_expense_approve
                    SET contact_person = ?, contact_person_number = ?, email = ?, feedback = ?, complaint_feedback = ?, suggestion_feedback = ?, created_by = ?, complaint_id = ?
                    WHERE complaint_unique_id = ? AND approve_type = ?
                `,
                    [
                        contact_person_name,
                        contact_person_no,
                        contact_person_email,
                        JSON.stringify(feedback),
                        complaints || null,
                        suggestions || null,
                        officeApprovedBy,
                        complaint_id,
                        complaint_unique_id,
                        approve_type,
                    ]
                );

                insertOrUpdateId = updateResult.affectedRows > 0 ? selectQuery[0].id : null;
            } else {
                const insertResult = await db.query(
                    `
                    INSERT INTO office_expense_approve (complaint_unique_id, approve_type, contact_person, contact_person_number, email, feedback, complaint_feedback, suggestion_feedback, created_by, complaint_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                    [
                        complaint_unique_id,
                        approve_type,
                        contact_person_name,
                        contact_person_no,
                        contact_person_email,
                        JSON.stringify(feedback),
                        complaints || null,
                        suggestions || null,
                        officeApprovedBy,
                        complaint_id,
                    ]
                );

                insertOrUpdateId = insertResult.insertId;
            }

            // Collect both insertOrUpdateId and complaint_id
            results.push({ insertOrUpdateId, complaint_id });
        }

        return results;
    } catch (error) {
        throw new Error("Error while adding office inspection details: " + error.message);
    }
};

const officeNotApproved = async (office_not_approved, office_approved_at) => {
    try {
        for (const office of office_not_approved) {
            const { id, stock_id } = office;
            const updateQuery = `UPDATE stock_punch_histories SET office_approved_status = '1', office_approved_at = '${office_approved_at}' WHERE id = '${id}'`;
            const query = await db.query(updateQuery);
        }
    } catch (error) {
        throw new Error("Error executing  office_not_approved command   " + error.message);
    }
};

const getAllOutletsWithComplaintsApproved = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const user_id = req.query.user_id;

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const columns = req.query.columns ? JSON.parse(req.query.columns) : "";
        const type = req.query.type || "1";

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != "") {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' 
            OR c.complaint_unique_id LIKE '%${searchData}%') 
        `;
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

        if(user_id != null && user_id != "") {
            whereConditions += ` AND FIND_IN_SET('${user_id}', s.user_id) > 0`;
        }

        let selectQuery = `
            SELECT 
                DATE_FORMAT(s.office_approved_at, '%Y-%m') AS month, 
                c.outlet_id,
                MAX(s.complaint_id) AS complaint_id,
                MAX(c.complaint_type) AS complaint_type,
                MAX(c.energy_company_id) AS energy_company_id,
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.office_approved_qty * st.rate) AS total_cost, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.office_approved_at) AS approved_office_at, 
                s.user_id AS stock_user_id,
                MAX(c.complaint_for) AS complaint_for,
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
                s.office_approved_qty IS NOT NULL 
                AND s.office_approved_status = '2' 
                AND c.created_by = '${req.user.user_id}' 
                ${whereConditions} 
                ${search_value} 
            GROUP BY 
                s.user_id,
                DATE_FORMAT(s.office_approved_at, '%Y-%m'), 
                c.outlet_id 
            ORDER BY 
                MAX(s.office_approved_at)
        `;

        if (pageSize) {
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        // console.log('selectQuery: ', selectQuery);
        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {
                // console.log('row: ', row);
                // const complaintType = await getComplaintTypeById(row.complaint_type);

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

                const userDetails = await db.query(
                    `SELECT id, name, employee_id FROM users WHERE id = '${row.stock_user_id}'`
                );

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    employee_id: userDetails[0]?.employee_id,
                    employee_name: userDetails[0]?.name,
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
                    filePath = await exportToExcel(finalData, "office_stock", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "office_stock", "Office Stock Inspection", columns);
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

async function outletsWithComplaintsById(id, month) {
    const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE stock_punch_histories.office_approved_at IS NOT NULL AND stock_punch_histories.office_approved_status = '2' AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

    const result = await db.query(selectQuery);

    if (result.length > 0) {
        const transformedData = await transformDataForApproved(result);
        return Object.values(transformedData);
        // const getApproveAt = result.map((data) => data.created_at);
        // const getDetails = await getConfirmationDetails(result.office_approved_at)
        // const officeApprovedAts = await getOfficeApprovedAt(transformedData);
    } else {
        throw new Error("Data not found");
    }
}
const getAllOutletsWithComplaintsByApprovedId = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        const transformedData = await outletsWithComplaintsById(id, month);
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Request fetched successfully",
            data: transformedData,
        });
    } catch (error) {
        return next(error);
    }
};

async function getConfirmationDetails(office_approved_at) {
    const dateFormat = moment(office_approved_at).format("YYYY-MM-DD HH:mm:ss");
    const selectQuery = `SELECT * FROM office_expense_approve WHERE created_at = '${dateFormat}'`;

    const result = await db.query(selectQuery);

    if (result.length > 0) {
        return result;
    } else {
        return "";
    }
}

async function transformDataForApproved(data) {
    const transformedData = {};

    try {
        // Collect all user IDs for efficient batch fetching
        const userIds = Array.from(new Set(data.map((entry) => entry.user_id)));
        // console.log('userIds: ', userIds);

        // Fetch user details in bulk
        // const userDetailsPromises = userIds.map((user_id) => getAdminAndUserDetail(user_id));
        const userDetailsPromises = userIds.map((user_id) => getUserDetails(user_id));
        const userDetailResults = await Promise.all(userDetailsPromises);
        // console.log('userDetailResults: ', userDetailResults);

        // Map user details to user IDs
        const userDetailsMap = {};
        userIds.forEach((user_id, index) => {
            userDetailsMap[user_id] = userDetailResults[index];
        });

        // Iterate through each entry in the data
        for (const entry of data) {
            // console.log('entry: ', entry);
            const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for } = entry;
            let outletDetails;

            // Retrieve cached user details
            const userDetails = userDetailsMap[user_id];

            // Check if the user details are already added to transformedData
            if (!transformedData[user_id]) {
                transformedData[user_id] = {
                    userDetails,
                    outletDetails: null, // Initialize outletDetails
                    itemDetails: [],
                    total: 0,
                    total_office_amount: 0,
                    confirmDetails: [], // Initialize confirmDetails array
                };
            }

            // Fetch additional details based on complaint type and energy company ID
            if (complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
                const selectedOutlets = await getOutletById(outlet_id);
                outletDetails = selectedOutlets;
                transformedData[user_id].outletDetails = outletDetails; // Update outletDetails
            } else {
                const energyCompanyName = await getCompanyDetailsById(energy_company_id);
                outletDetails = ""; // Adjust as needed for your logic
                transformedData[user_id].outletDetails = outletDetails; // Update outletDetails
            }


            // Add item details to the array
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
                total_office_approved_amount: entry.item_rate * entry.office_approved_qty,
                office_approved_at: moment(entry.office_approved_at).format("YYYY-MM-DD HH:mm:ss"),
                office_expense_approve_id: entry.office_expense_approve_id,
            };

            // Add the total_approved_amount of this item to the total sum
            // console.log('itemDetail.total_approved_amount: ', itemDetail.total_approved_amount);
            transformedData[user_id].total += itemDetail.total_approved_amount;
            transformedData[user_id].total_office_amount += itemDetail.total_office_approved_amount;

            transformedData[user_id].itemDetails.push(itemDetail);



            // Fetch office expense approve feedback if not already fetched
            if (entry.office_expense_approve_id && transformedData[user_id].confirmDetails.length === 0) {
                const feedback = await db.query(
                    `SELECT * FROM office_expense_approve WHERE id = ${entry.office_expense_approve_id}`
                );
                if (feedback.length > 0) {
                    transformedData[user_id].confirmDetails.push(feedback[0]);
                } else {
                    transformedData[user_id].confirmDetails = null;
                }
            }

            console.log('transformedData[user_id].confirmDetails: ', transformedData[user_id].confirmDetails);
        }
    } catch (error) {
        console.error(`Error processing data: ${error.message}`);
        throw error;
    }

    return transformedData;
}

async function getFeedbackDetails(officeId) {
    const selectQuery = `SELECT oea.*, u1.id AS area_manager_id, u1.name AS area_manager_name, u1.image AS area_manager_image, u1.employee_id AS area_manager_employee_id, u2.id AS supervisor_id, u2.name AS supervisor_name, u2.image AS supervisor_image, u2.employee_id AS supervisor_employee_id, u3.id AS end_user_id, u3.name AS end_user_name, u3.image AS end_user_image, u3.employee_id AS end_user_employee_id FROM office_expense_approve AS oea LEFT JOIN users AS u1 ON oea.area_manager = u1.id LEFT JOIN users AS u2 ON oea.supervisor = u2.id LEFT JOIN users AS u3 ON oea.end_users = u3.id WHERE oea.id = '${officeId}'`;

    const result = await db.query(selectQuery);

    return result;
}

async function getOfficeApprovedAt(transformedData) {
    const officeApprovedAts = [];

    // Iterate over each key in transformedData
    for (const key of Object.keys(transformedData)) {
        const data = transformedData[key];

        // Extracting user details
        const userDetails = data.userDetails[0]; // Assuming there's only one user per data

        // Iterate over each item in itemDetails for the current user
        for (const item of data.itemDetails) {
            if (item.office_approved_at) {
                // Check if office_approved_at exists
                officeApprovedAts.push({ user_id: userDetails.user_id, office_approved_at: item.office_approved_at });
                break; // Break the loop after finding the first office_approved_at
            }
        }
    }

    return officeApprovedAts;
}

const getAllOutletsWithComplaintsPartial = async (req, res, next) => {
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
        // const loggedUserType = req.user.user_type;
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

        const selectQuery = `
            SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.outlet_id, 
                COUNT(DISTINCT s.complaint_id) AS complaint_count, 
                SUM(s.approved_qty * st.rate) AS total_cost, 
                MAX(c.complaint_unique_id) AS complaint_unique_id, 
                MAX(complaint_types.complaint_type_name) AS complaint_type_name, 
                MAX(s.office_approved_at) AS approved_office_at, 
                s.user_id AS stock_user_id,
                MAX(c.complaint_for)  AS complaint_for,
                MAX(c.ro_id)  AS ro_id,
                MAX(c.sale_area_id)  AS sale_area_id,
                MAX(c.district_id)  AS district_id
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type 
            WHERE 
                s.office_approved_status = '1' 
                AND c.created_by = '${req.user.user_id}'
                ${whereConditions} 
                ${search_value}
            GROUP BY 
                s.user_id,
                DATE_FORMAT(s.approved_at, '%Y-%m'), 
                c.outlet_id 
            ORDER BY 
                MAX(s.office_approved_at) DESC 
            LIMIT ${pageFirstResult} , ${pageSize}
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
                // const complaintType = await getComplaintTypeById(row.complaint_type);

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

const getAllOutletsWithComplaintsByPartialId = async (req, res, next) => {
    try {
        const { id, month } = req.params;

        // const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE  stock_punch_histories.office_approved_qty IS NULL AND stock_punch_histories.office_approved_status = '1' AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

        const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE stock_punch_histories.office_approved_status = '1' AND DATE_FORMAT(stock_punch_histories.office_approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

        const result = await db.query(selectQuery);

        if (result.length > 0) {
            const transformedData = await transformData(result);
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

const getOutletOfficeById = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE s.office_approved_status = '2' AND s.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE s.approved_qty != 0 AND s.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id ${whereConditions} AND c.outlet_id != '[null]' GROUP BY month, c.outlet_id ORDER BY s.approved_at DESC;`
        // );

        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.outlet_id 
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            ${whereConditions} AND 
                c.outlet_id != '[null]'
            GROUP BY 
                DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id 
            ORDER BY 
                DATE_FORMAT(s.approved_at, '%Y-%m') DESC;
            `);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.outlet_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getOutletById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();

            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getSalesAreaOfficeById = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE s.office_approved_status = '2' AND s.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE s.approved_qty != 0 AND s.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.sale_area_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id ${whereConditions} AND c.sale_area_id != '[null]' GROUP BY month, c.outlet_id, ORDER BY s.approved_at DESC;`
        // );
        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.sale_area_id 
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id  
            ${whereConditions}
            GROUP BY 
                DATE_FORMAT(s.approved_at, '%Y-%m'), c.sale_area_id 
            ORDER BY 
                DATE_FORMAT(s.approved_at, '%Y-%m') DESC;
`
        );

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.sale_area_id);

            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getSaleAreaNameById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getRegionalOfficeExpenseById = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE s.office_approved_status = '2' AND s.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE s.approved_qty != 0 AND s.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.ro_id FROM complaints c INNER JOIN stock_punch_histories s ON c.id = s.complaint_id INNER JOIN stocks st ON s.stock_id = st.id ${whereConditions} AND c.ro_id != '[null]' GROUP BY month, c.outlet_id ORDER BY s.approved_at DESC;`
        // );

        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(s.approved_at, '%Y-%m') AS month, 
                c.ro_id, 
                COUNT(DISTINCT c.id) AS complaint_count 
            FROM 
                complaints c 
            INNER JOIN 
                stock_punch_histories s ON c.id = s.complaint_id 
            INNER JOIN 
                stocks st ON s.stock_id = st.id 
            ${whereConditions} AND c.ro_id != '[null]'
            GROUP BY 
                DATE_FORMAT(s.approved_at, '%Y-%m'), c.ro_id 
            ORDER BY 
                DATE_FORMAT(s.approved_at, '%Y-%m') DESC;
            `);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.ro_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getRegionalNameById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// office expense for fund managements
const getAllOutletsWithComplaintsForFunds = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const user_id = req.query.user_id;

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

        if (user_id != null && user_id != "") {
            whereConditions += ` AND FIND_IN_SET('${user_id}', s.user_id) > 0`;
        }


        // const selectQuery = `
        //     SELECT 
        //         DATE_FORMAT(s.punch_at, '%Y-%m') AS month,
        //         c.outlet_id,
        //         MAX(c.complaint_unique_id) AS complaint_unique_id,
        //         COUNT(DISTINCT s.complaint_id) AS complaint_count,
        //         SUM(s.approved_qty * st.item_price) AS total_cost,
        //         MAX(complaint_types.complaint_type_name) AS complaint_type_name,
        //         MAX(s.approved_at) AS approved_stock_punch_at,
        //         MAX(s.user_id) AS stock_user_id,
        //         MAX(st.request_by) AS request_by,
        //         MAX(c.complaint_for) AS complaint_for,
        //         MAX(c.energy_company_id) AS energy_company_id,
        //         MAX(c.ro_id) AS ro_id,
        //         MAX(c.sale_area_id) AS sale_area_id,
        //         MAX(c.district_id) AS district_id
        //     FROM 
        //         complaints c
        //     INNER JOIN 
        //         expense_punch_history s ON c.id = s.complaint_id
        //     INNER JOIN 
        //         fund_requests st ON s.fund_id = st.id
        //     LEFT JOIN 
        //         complaint_types ON complaint_types.id = c.complaint_type
        //     WHERE 
        //         s.status = '1' 
        //         AND s.office_approved_status = 0 
        //         AND c.created_by = '${req.user.user_id}'
        //         ${whereConditions}
        //         ${search_value}
        //     GROUP BY 
        //         DATE_FORMAT(s.punch_at, '%Y-%m'), c.outlet_id
        //     ORDER BY 
        //         MAX(s.approved_at) DESC
        //     LIMIT ${pageFirstResult} , ${pageSize}
        //     `;

        const selectQuery = `
            SELECT 
                s.user_id,
                DATE_FORMAT(s.punch_at, '%Y-%m') AS month,
                c.outlet_id,
                MAX(c.complaint_unique_id) AS complaint_unique_id,
                COUNT(DISTINCT s.complaint_id) AS complaint_count,
                SUM(s.approved_qty * st.item_price) AS total_cost,
                MAX(complaint_types.complaint_type_name) AS complaint_type_name,
                MAX(s.approved_at) AS approved_stock_punch_at,
                MAX(s.user_id) AS stock_user_id,
                MAX(st.request_by) AS request_by,
                MAX(c.complaint_for) AS complaint_for,
                MAX(c.energy_company_id) AS energy_company_id,
                MAX(c.ro_id) AS ro_id,
                MAX(c.sale_area_id) AS sale_area_id,
                MAX(c.district_id) AS district_id
            FROM 
                complaints c
            INNER JOIN 
                expense_punch_history s ON c.id = s.complaint_id
            INNER JOIN 
                fund_requests st ON s.fund_id = st.id
            LEFT JOIN 
                complaint_types ON complaint_types.id = c.complaint_type
            WHERE 
                s.status = '1' 
                AND s.office_approved_status = 0 
                AND c.created_by = '${req.user.user_id}'
                ${whereConditions}
                ${search_value}
            GROUP BY 
                s.user_id, DATE_FORMAT(s.punch_at, '%Y-%m'), c.outlet_id
            ORDER BY 
                MAX(s.approved_at) DESC
            LIMIT ${pageFirstResult} , ${pageSize}
        `;

        // console.log('selectQuery: ', selectQuery);
        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        // const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (result.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let districtDetailsData = [];

            for (row of result) {
                // console.log('row: ', row);
                // const complaintType = await getComplaintTypeById(row.complaint_type);
                let outletDetails;
                let company_name;
                let regionalOfficeDetails;
                let saleAreaDetails;
                let order_by_name = "";

                if (row.complaint_for == "1") {
                    row.outlet_id = JSON.parse(row.outlet_id);
                    // console.log('row.outlet_id: ', row.outlet_id);
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                    regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    if (row.district_id != null && row.district_id != "") {
                        districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                    }
                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                    }
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                    order_by_name = row.order_by;
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                const [employeeDetails] = await getAdminAndUserDetail(row.request_by);
                const employeeType = await roleById(employeeDetails.user_type);
                employeeDetails.user_type = employeeType.name;

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    employee: employeeDetails,
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

const getAllOutletsWithComplaintsForFundsById = async (req, res, next) => {
    try {
        // id = outlet_id, month = current month
        const { id, month } = req.params;
        // console.log('req.params: ', req.params);

        const user_id = req.query.user_id;

        let outletCondition;

        if (id && id > 0) {
            outletCondition = ` AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0`;
            // outletCondition = ` AND complaints.outlet_id IS NOT NULL`;
        } else {
            outletCondition = ` AND complaints.outlet_id IS NULL`;
        }

        const selectQuery = `
            SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as expense_punch_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_rate 
            FROM expense_punch_history 
            LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id 
            LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id 
            LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id 
            WHERE expense_punch_history.office_approved_qty IS NULL AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' AND user_id = '${user_id}'
            ${outletCondition}
        `;

        console.log('selectQuery: ', selectQuery);
        const result = await db.query(selectQuery);

        if (result.length > 0) {
            const transformedData = await transformDataFund(result);
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: Object.values(transformedData) });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// async function transformDataFund(data) {
//     const transformedDataFund = {};
//     // Iterate through each entry in the data
//     for (const entry of data) {
//         const { user_id, energy_company_id, outlet_id, complaint_type, complaint_for } = entry;
//         let outletDetails;

//         try {
//             // Call the asynchronous function inside a try-catch block
//             const userDetails = await getAdminAndUserDetail(user_id);

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

//             if (!transformedDataFund[user_id]) {
//                 transformedDataFund[user_id] = { userDetails, outletDetails, itemDetails: [], total: 0 };
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
//                 item_rate: entry.item_rate,
//                 item_qty: entry.item_qty,
//                 punch_by: entry.punch_by,
//                 punch_at: entry.punch_at,
//                 status: entry.status,
//                 approved_qty: entry.approved_qty,
//                 approved_amount: entry.approved_amount,
//                 approved_by: entry.approved_by,
//                 approved_at: moment(entry.approved_at).format('YYYY-MM-DD HH:mm:ss A'),
//                 fund_user_id: entry.user_id,
//                 total_item_qty: entry.item_qty,
//                 total_approved_qty: entry.approved_qty,
//                 total_approved_amount: entry.item_rate * entry.approved_qty
//             };

//             // Add the total_approved_amount of this item to the total sum
//             transformedDataFund[user_id].total += itemDetail.total_approved_amount;
//             transformedDataFund[user_id].itemDetails.push(itemDetail);
//         } catch (error) {next(error)
//             console.error(`Error processing entry with user_id ${user_id}: ${error.message}`);
//         }
//     }
//     return transformedDataFund;
// }

// const approveOfficeInspectionsForFund = async (req,res,next) => {
//     try {

//         const { approve_fund_punch, office_not_approved, feedback } = req.body;
//         const officeApprovedBy = req.user.user_id;
//         const office_approved_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

//         if (!feedback || Object.keys(feedback).length === 0) {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Please fill the details first." });
//         }
//         const insertQuery = await addOfficeInspectionsForFundDetails(feedback, officeApprovedBy);

//         for (const data of approve_fund_punch) {
//             const { id, fund_id, approve_office_qty } = data;

//             const selectQuery = await db.query(`SELECT * FROM expense_punch_history WHERE id = '${id}' AND fund_id = '${fund_id}'`)

//             if (selectQuery.length > 0) {
//                 const updateQuery = `UPDATE expense_punch_history SET office_approved_status = '2', office_approved_qty = '${approve_office_qty}', office_approved_by = '${officeApprovedBy}', office_approved_at = '${office_approved_at}', office_fund_approve_id = '${insertQuery}' WHERE id = '${id}' AND fund_id = '${fund_id}'`

//                 const query = await db.query(updateQuery);
//             }
//         }

//         await officeNotApprovedForFund(office_not_approved, office_approved_at)
//         return res.status(StatusCodes.OK).json({ status: true, message: "Office Inspections Approved Successfully." });

//     } catch (error) {next(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }

async function transformDataFund(data) {
    const transformedDataFund = {};

    // Iterate through each entry in the data
    for (const entry of data) {
        const { user_id, complaint_id, energy_company_id, outlet_id, complaint_type, complaint_for } = entry;
        let outletDetails;

        try {
            // Call the asynchronous functions inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);
            // const complaintType = await getComplaintTypeById(complaint_type);
            let company_name;

            if (complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(energy_company_id);
                company_name = energyCompanyName.name ? energyCompanyName.name : "";
                outletDetails = await getOutletById(outlet_id);
            } else {
                const energyCompanyName = await getCompanyDetailsById(energy_company_id);
                company_name = energyCompanyName.company_name;
                outletDetails = "";
            }

            const key = `${user_id}_${complaint_id}`;

            if (!transformedDataFund[key]) {
                transformedDataFund[key] = {
                    user_id,
                    complaint_id,
                    userDetails,
                    outletDetails,
                    itemDetails: [],
                    total: 0,
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
                item_rate: entry.item_rate,
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
                total_approved_amount: entry.item_rate * entry.approved_qty,
            };

            // Add the total_approved_amount of this item to the total sum
            transformedDataFund[key].total += itemDetail.total_approved_amount;
            transformedDataFund[key].itemDetails.push(itemDetail);
        } catch (error) {
            console.error(
                `Error processing entry with user_id ${user_id} and complaint_id ${complaint_id}: ${error.message}`
            );
            throw error;
        }
    }
    return transformedDataFund;
}

const approveOfficeInspectionsForFund = async (req, res, next) => {
    try {
        const { approve_fund_punch, office_not_approved, feedback } = req.body;

        const officeApprovedBy = req.user.user_id;
        const office_approved_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if (!feedback || Object.keys(feedback).length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please fill the details first." });
        }

        const insertResults = await addOfficeInspectionsForFundDetails(feedback, officeApprovedBy);
        for (const data of approve_fund_punch) {
            const { id, fund_id, approve_office_qty } = data;

            if (approve_office_qty <= 0) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Approve Quantity cannot be zero" });
            }

            const selectQuery = await db.query(`SELECT * FROM expense_punch_history WHERE id = ? AND fund_id = ?`, [
                id,
                fund_id,
            ]);
            if (selectQuery.length > 0) {
                // Find the matching complaint_id from the feedback
                const matchingResult = insertResults.find(
                    (result) => result.complaint_id === selectQuery[0].complaint_id
                );
                if (matchingResult) {
                    const { insertOrUpdateId, complaint_id } = matchingResult;
                    const updateQuery = `
                        UPDATE expense_punch_history 
                        SET office_approved_status = '2', office_approved_qty = ?, office_approved_by = ?, office_approved_at = ?, office_fund_approve_id = ?
                        WHERE id = ? AND fund_id = ?
                    `;
                    await db.query(updateQuery, [
                        approve_office_qty,
                        officeApprovedBy,
                        office_approved_at,
                        insertOrUpdateId,
                        id,
                        fund_id,
                    ]);
                }
            }
        }

        await officeNotApprovedForFund(office_not_approved, office_approved_at);

        return res.status(StatusCodes.OK).json({ status: true, message: "Office Inspections Approved Successfully." });
    } catch (error) {
        return next(error);
    }
};

// check feedback and complaint id length shoudl be same or not

const validateComplaintIds = (data) => {
    const { complaint_id, feedback } = data;

    const feedbackComplaintIds = feedback.map((item) => item.complaint_id);

    const allIdsExist = complaint_id.every((id) => feedbackComplaintIds.includes(id));

    return allIdsExist;
};

const officeNotApprovedForFund = async (office_not_approved, office_approved_at) => {
    try {
        for (const office of office_not_approved) {
            const { id, fund_id } = office;
            const updateQuery = `UPDATE expense_punch_history SET office_approved_status = '1', office_approved_at = '${office_approved_at}' WHERE id = '${id}'`;
            const query = await db.query(updateQuery);
        }
    } catch (error) {
        throw new Error("Error executing  office_not_approved command   " + error.message);
    }
};

const addOfficeInspectionsForFundDetails = async (feedback, officeApprovedBy) => {
    try {
        let results = [];

        for (const row of feedback) {
            const {
                contact_person_name,
                contact_person_no,
                contact_person_email,
                feedback,
                complaints,
                suggestions,
                complaint_unique_id,
                complaint_id,
                approve_type,
            } = row;

            const selectQuery = await db.query(
                `
                SELECT * FROM office_fund_approve WHERE complaint_unique_id = ? AND approve_type = ?
            `,
                [complaint_unique_id, approve_type]
            );

            let insertOrUpdateId;

            if (selectQuery.length > 0) {
                const updateResult = await db.query(
                    `
                    UPDATE office_fund_approve
                    SET contact_person = ?, contact_person_number = ?, email = ?, feedback = ?, complaint_feedback = ?, suggestion_feedback = ?, created_by = ?, complaint_id =?
                    WHERE complaint_unique_id = ? AND approve_type = ?
                `,
                    [
                        contact_person_name,
                        contact_person_no,
                        contact_person_email,
                        JSON.stringify(feedback),
                        complaints || null,
                        suggestions || null,
                        officeApprovedBy,
                        complaint_id,
                        complaint_unique_id,
                        approve_type,
                    ]
                );

                if (updateResult.affectedRows > 0) {
                    insertOrUpdateId = selectQuery[0].id;
                } else {
                    console.error(
                        `Failed to update office_fund_approve for complaint_unique_id: ${complaint_unique_id} and approve_type: ${approve_type}`
                    );
                }
            } else {
                const insertResult = await db.query(
                    `
                    INSERT INTO office_fund_approve (complaint_unique_id, approve_type, contact_person, contact_person_number, email, feedback, complaint_feedback, suggestion_feedback, created_by, complaint_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                    [
                        complaint_unique_id,
                        approve_type,
                        contact_person_name,
                        contact_person_no,
                        contact_person_email,
                        JSON.stringify(feedback),
                        complaints || null,
                        suggestions || null,
                        officeApprovedBy,
                        complaint_id,
                    ]
                );

                insertOrUpdateId = insertResult.insertId;
            }

            if (insertOrUpdateId) {
                results.push({ insertOrUpdateId, complaint_id, approve_type });
            } else {
                console.error(
                    `Failed to insert or update office_fund_approve for complaint_unique_id: ${complaint_unique_id} and approve_type: ${approve_type}`
                );
            }
        }

        return results;
    } catch (error) {
        throw new Error("Error while adding office inspection details: " + error.message);
    }
};

const getAllOutletsWithComplaintsApprovedForFund = async (req, res, next) => {
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

        // let selectQuery = `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.office_approved_qty * st.item_price) AS total_cost, c.*, complaint_types.complaint_type_name, s.office_approved_at AS approved_office_at, s.user_id as fund_user_id, st.request_by FROM complaints c INNER JOIN expense_punch_history s ON c.id = s.complaint_id INNER JOIN fund_requests st ON s.fund_id = st.id LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_qty IS NOT NULL AND s.office_approved_status = '2' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.office_approved_at `;

        let selectQuery = `
                SELECT 
                    DATE_FORMAT(s.approved_at, '%Y-%m') AS month,
                    c.outlet_id,
                    MAX(c.complaint_unique_id) AS complaint_unique_id,
                    COUNT(DISTINCT s.complaint_id) AS complaint_count,
                    SUM(s.office_approved_qty * st.item_price) AS total_cost,
                    MAX(complaint_types.complaint_type_name) AS complaint_type_name,
                    MAX(s.office_approved_at) AS approved_office_at,
                    MAX(s.user_id) AS fund_user_id,
                    MAX(st.request_by) AS request_by,
                    MAX(c.complaint_for) AS complaint_for,
                    MAX(c.energy_company_id) AS energy_company_id,
                    MAX(c.sale_area_id) AS sale_area_id,
                    MAX(c.district_id) AS district_id,
                    MAX(c.ro_id) AS ro_id
                FROM 
                    complaints c
                INNER JOIN 
                    expense_punch_history s ON c.id = s.complaint_id
                INNER JOIN 
                    fund_requests st ON s.fund_id = st.id
                LEFT JOIN 
                    complaint_types ON complaint_types.id = c.complaint_type
                WHERE 
                    s.office_approved_qty IS NOT NULL 
                    AND s.office_approved_status = '2' 
                    AND c.created_by = '${req.user.user_id}' 
                    ${whereConditions}
                    ${search_value}
                GROUP BY 
                    DATE_FORMAT(s.approved_at, '%Y-%m'), c.outlet_id
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
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of result) {
                let outletDetails;
                let company_name;
                let districtDetailsData = [];
                let regionalOfficeDetails;
                let saleAreaDetails;
                // const complaintType = await getComplaintTypeById(row.complaint_type);
                let order_by_name = "";

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                    regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    if (row.district_id != null && row.district_id != "") {
                        districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                    }
                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                    }
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                    order_by_name = row.order_by;
                }

                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                const [employeeDetails] = await getAdminAndUserDetail(row.request_by);
                const employeeType = await roleById(employeeDetails.user_type);
                employeeDetails.user_type = employeeType.name;

                finalData.push({
                    id: row.id,
                    user_id: row.fund_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    employee: employeeDetails,
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
                    approved_fund_punch: row.approved_office_at,
                    month: row.month,
                });
            }

            if (!pageSize) {
                finalData = finalData.map((item) => {
                    return {
                        ...item,
                        employee_id: item.employee?.employee_id,
                        username: item.employee?.username,
                        user_type: item.employee?.user_type,
                        outlet_name: item.outlet && item.outlet[0]?.outlet_name,
                        outlet_unique_id: item.outlet && item.outlet[0]?.outlet_unique_id,
                        regional_office_name: item.regionalOffice && item.regionalOffice[0]?.regional_office_name,
                        sales_area_name: item.saleAreaDetails && item.saleAreaDetails[0]?.sales_area_name,
                    };
                });

                let filePath;
                let message;
                if (type == "1") {
                    filePath = await exportToExcel(finalData, "office_fund", columns);
                    message = "excel exported successfully";
                } else {
                    filePath = await exportToPDF(finalData, "office_fund", "Office Fund Inspection", columns);
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

async function outletsWithComplaintsForFund(id, month) {
    const selectQuery = `SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_rate
    FROM expense_punch_history 
    LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id 
    LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id 
    LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id 
    WHERE  expense_punch_history.office_approved_at IS NOT NULL AND expense_punch_history.office_approved_status = '2' AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

    const result = await db.query(selectQuery);

    if (result.length > 0) {
        const transformedData = await transformDataForApproved(result);
        return Object.values(transformedData);
    } else {
        throw new Error("Data not found");
    }
}
const getAllOutletsWithComplaintsForFundByApprovedId = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        const data = await outletsWithComplaintsForFund(id, month);
        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Request fetched successfully",
            data: data,
        });
    } catch (error) {
        return next(error);
    }
};

async function transformDataForFundApproved(data) {
    const transformedData = {};
    const officeFundApproveCache = {};

    // Iterate through each entry in the data
    for (const entry of data) {
        const {
            user_id,
            complaint_id,
            energy_company_id,
            outlet_id,
            complaint_type,
            complaint_for,
            office_fund_approve_id,
        } = entry;
        let outletDetails;
        let company_name;

        try {
            // Call the asynchronous functions inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);
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

            // Use a combined key for user_id and complaint_id
            const key = `${user_id}_${complaint_id}`;

            if (!transformedData[key]) {
                transformedData[key] = {
                    user_id,
                    complaint_id,
                    userDetails,
                    outletDetails,
                    itemDetails: [],
                    total: 0,
                    total_office_amount: 0,
                    confirmDetails: [],
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
                total_office_approved_amount: entry.item_price * entry.office_approved_qty,
                office_fund_approve_id: entry.office_fund_approve_id,
            };

            // Add the total_approved_amount and total_office_approved_amount of this item to the total sum
            transformedData[key].total += itemDetail.total_approved_amount;
            transformedData[key].total_office_amount += itemDetail.total_office_approved_amount;

            transformedData[key].itemDetails.push(itemDetail);

            // Fetch office_fund_approve data only if not already in cache
            if (!officeFundApproveCache[office_fund_approve_id]) {
                const selectQuery = `SELECT * FROM office_fund_approve WHERE id = ${office_fund_approve_id}`;
                const result = await db.query(selectQuery);

                if (result.length > 0) {
                    officeFundApproveCache[office_fund_approve_id] = result[0];
                } else {
                    officeFundApproveCache[office_fund_approve_id] = null;
                }
            }

            // Add the fetched data to confirmDetails under transformedData if not already added
            if (
                officeFundApproveCache[office_fund_approve_id] &&
                !transformedData[key].confirmDetails.some((detail) => detail.id === office_fund_approve_id)
            ) {
                transformedData[key].confirmDetails.push(officeFundApproveCache[office_fund_approve_id]);
            }
        } catch (error) {
            console.error(
                `Error processing entry with user_id ${user_id} and complaint_id ${complaint_id}: ${error.message}`
            );
            throw error;
        }
    }

    return transformedData;
}

const getAllOutletsWithComplaintsPartialForFunds = async (req, res, next) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";

        const pageFirstResult = (currentPage - 1) * pageSize;
        let search_value = "";

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

        // const selectQuery = `SELECT DATE_FORMAT(s.approved_at, '%Y-%m') AS month, c.outlet_id, c.complaint_unique_id, COUNT(DISTINCT s.complaint_id) AS complaint_count, SUM(s.approved_qty * st.item_price) AS total_cost, c.*, complaint_types.complaint_type_name, s.office_approved_at AS approved_office_at, s.user_id as stock_user_id, st.request_by FROM complaints c INNER JOIN expense_punch_history s ON c.id = s.complaint_id INNER JOIN fund_requests st ON s.fund_id = st.id LEFT JOIN complaint_types ON complaint_types.id = c.complaint_type WHERE s.office_approved_status = '1' AND c.created_by = '${req.user.user_id}' ${whereConditions} ${search_value} GROUP BY month, c.outlet_id ORDER BY s.approved_at DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const selectQuery = `
                SELECT 
                    DATE_FORMAT(s.approved_at, '%Y-%m') AS month,
                    c.outlet_id,
                    MAX(c.complaint_unique_id) AS complaint_unique_id,
                    COUNT(DISTINCT s.complaint_id) AS complaint_count,
                    SUM(s.approved_qty * st.item_price) AS total_cost,
                    MAX(complaint_types.complaint_type_name) AS complaint_type_name,
                    MAX(s.office_approved_at) AS approved_office_at,
                    MAX(s.user_id) AS stock_user_id,
                    MAX(st.request_by) AS request_by
                FROM 
                    complaints c
                INNER JOIN 
                    expense_punch_history s ON c.id = s.complaint_id
                INNER JOIN 
                    fund_requests st ON s.fund_id = st.id
                LEFT JOIN 
                    complaint_types ON complaint_types.id = c.complaint_type
                WHERE 
                    s.office_approved_status = '1' 
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

        if (result.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of result) {
                let outletDetails;
                let company_name;
                let districtDetailsData = [];
                // const complaintType = await getComplaintTypeById(row.complaint_type);
                let order_by_name = "";
                let regionalOfficeDetails;
                let saleAreaDetails;

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                    regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    if (row.district_id != null && row.district_id != "") {
                        districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                    }
                    const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                    }
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = "";
                    order_by_name = row.order_by;
                }
                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                const [employeeDetails] = await getAdminAndUserDetail(row.request_by);
                const employeeType = await roleById(employeeDetails.user_type);
                employeeDetails.user_type = employeeType.name;

                finalData.push({
                    id: row.id,
                    user_id: row.stock_user_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    employee: employeeDetails,
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

const getAllOutletsWithComplaintsForFundByPartialId = async (req, res, next) => {
    try {
        const { id, month } = req.params;
        const selectQuery = `SELECT  expense_punch_history.*,  expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,  item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id  LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id WHERE  expense_punch_history.office_approved_qty IS NULL AND expense_punch_history.office_approved_status = '1' AND DATE_FORMAT(expense_punch_history.approved_at, '%m') = '${month}' AND FIND_IN_SET('[${id}]', complaints.outlet_id) > 0 `;

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

// listing for outlet, salesArea and regional office
const getOutletOfficeByIdForFund = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE eph.office_approved_status = '2' AND eph.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE eph.approved_qty != 0 AND eph.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(eph.punch_at, '%Y-%m') AS month, c.outlet_id FROM complaints c INNER JOIN expense_punch_history eph ON c.id = eph.complaint_id INNER JOIN fund_requests fr ON eph.fund_id = fr.id ${whereConditions} AND c.outlet_id != '[null]' GROUP BY month, c.outlet_id ORDER BY eph.punch_at DESC;`
        // );

        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(eph.punch_at, '%Y-%m') AS month, 
                c.outlet_id 
            FROM 
                complaints c 
            INNER JOIN 
                expense_punch_history eph ON c.id = eph.complaint_id 
            INNER JOIN 
                fund_requests fr ON eph.fund_id = fr.id 
            ${whereConditions} 
                AND c.outlet_id != '[null]' 
            GROUP BY 
                DATE_FORMAT(eph.punch_at, '%Y-%m'), c.outlet_id 
            ORDER BY 
                MAX(eph.punch_at) DESC;
        `);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.outlet_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getOutletById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();

            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getSalesAreaOfficeByIdForFund = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE eph.office_approved_status = '2' AND eph.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE eph.approved_qty != 0 AND eph.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(eph.approved_at, '%Y-%m') AS month, c.sale_area_id FROM complaints c INNER JOIN expense_punch_history eph ON c.id = eph.complaint_id INNER JOIN fund_requests fr ON eph.fund_id = fr.id ${whereConditions} AND c.sale_area_id != '[null]' GROUP BY month, c.outlet_id ORDER BY eph.approved_at DESC;`
        // );

        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(eph.approved_at, '%Y-%m') AS month, 
                c.sale_area_id, 
                c.outlet_id,
                COUNT(DISTINCT eph.complaint_id) AS complaint_count
            FROM 
                complaints c 
            INNER JOIN 
                expense_punch_history eph ON c.id = eph.complaint_id 
            INNER JOIN 
                fund_requests fr ON eph.fund_id = fr.id 
            ${whereConditions} AND c.sale_area_id != '[null]' 
            GROUP BY 
                month, c.sale_area_id, c.outlet_id 
            ORDER BY 
                DATE_FORMAT(eph.approved_at, '%Y-%m') DESC;
        `);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.sale_area_id);

            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getSaleAreaNameById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getRegionalOfficeExpenseByIdForFund = async (req, res, next) => {
    try {
        const { status, siteFor } = req.query;

        let whereConditions;
        if (siteFor) {
            whereConditions = ` WHERE eph.office_approved_status = '2' AND eph.site_approved_status = '${status}'`;
        } else {
            whereConditions = ` WHERE eph.approved_qty != 0 AND eph.office_approved_status = '${status}'`;
        }

        // let selectQuery = await db.query(
        //     `SELECT DATE_FORMAT(eph.approved_at, '%Y-%m') AS month, c.ro_id FROM complaints c INNER JOIN expense_punch_history eph ON c.id = eph.complaint_id INNER JOIN fund_requests fr ON eph.fund_id = fr.id ${whereConditions} AND c.ro_id != '[null]' GROUP BY month, c.outlet_id ORDER BY eph.approved_at DESC;`
        // );

        let selectQuery = await db.query(
            `SELECT 
                DATE_FORMAT(eph.approved_at, '%Y-%m') AS month, 
                c.ro_id, 
                c.outlet_id 
            FROM 
                complaints c 
            INNER JOIN 
                expense_punch_history eph ON c.id = eph.complaint_id 
            INNER JOIN 
                fund_requests fr ON eph.fund_id = fr.id 
            ${whereConditions} 
                AND c.ro_id != '[null]' 
            GROUP BY 
                DATE_FORMAT(eph.approved_at, '%Y-%m'), c.ro_id, c.outlet_id 
            ORDER BY 
                MAX(eph.approved_at) DESC;
            `);

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map((item) => item.ro_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index);

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getRegionalNameById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getComplaintIdToDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const selectQuery = await db.query(`SELECT * FROM complaints WHERE id = '${id}'`);
        let outletDetails;

        if (selectQuery.length > 0) {
            const finalData = [];
            const complaintType = await getComplaintTypeById(selectQuery[0].complaint_type);

            if (selectQuery[0].complaint_for == "1") {
                const energyCompanyName = await getEnergyCompaniesById(selectQuery[0].energy_company_id);
                company_name = energyCompanyName.name ? energyCompanyName.name : "";
                const selectedOutlets = await getOutletById(selectQuery[0].outlet_id);
                outletDetails = selectedOutlets;
            } else {
                const energyCompanyName = await getCompanyDetailsById(selectQuery[0].energy_company_id);
                company_name = energyCompanyName.company_name;
                outletDetails = "";
            }

            const selectedZones = await getZoneNameById(selectQuery[0].zone_id);
            const selectedRegionalOffices = await getRegionalNameById(selectQuery[0].ro_id);
            const selectedSaleAreas = await getSaleAreaNameById(selectQuery[0].sale_area_id);
            const selectedDistricts = await getDistrictById(selectQuery[0].district_id);

            finalData.push({
                id: selectQuery[0].id,
                complaint_unique_id: selectQuery[0].complaint_unique_id,
                regionalOffices: selectedRegionalOffices,
                saleAreas: selectedSaleAreas,
                outlets: outletDetails,
            });

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Request fetched successfully", data: finalData });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllApprovedData = async (req, res, next) => {
    try {
        const { complaintId } = req.params;

        const approvedStockQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE stock_punch_histories.office_approved_status = '2' AND stock_punch_histories.site_approved_status= '2' AND stock_punch_histories.complaint_id = '${complaintId}'`;

        const stockData = await db.query(approvedStockQuery);

        const approvedFundQuery = `SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,office_fund_approve.*, office_fund_approve.id as office_fund_approve_id, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id LEFT JOIN office_fund_approve ON office_fund_approve.id = expense_punch_history.office_fund_approve_id WHERE expense_punch_history.office_approved_status = '2' AND expense_punch_history.site_approved_status = '2' AND expense_punch_history.complaint_id = '${complaintId}'`;

        const fundData = await db.query(approvedFundQuery);
        let transformedDataFund;
        let transformedDataSite;
        if (fundData.length > 0) {
            transformedDataFund = await transformDataForFundApproveds(fundData);
        }

        if (stockData.length > 0) {
            transformedDataSite = await transformDataForApproved(stockData);
        }

        const dataSite = transformedDataSite ? Object.values(transformedDataSite) : "";
        const dataFund = transformedDataFund ? Object.values(transformedDataFund) : "";

        return res.status(StatusCodes.OK).json({ status: true, dataSite: dataSite, dataFund: dataFund });
    } catch (error) {
        return next(error);
    }
};

async function transformDataForFundApproveds(data) {
    const transformedData = {};
    const officeFundApproveCache = {};
    // Iterate through each entry in the data
    for (const entry of data) {
        const {
            user_id,
            complaint_id,
            energy_company_id,
            outlet_id,
            complaint_type,
            complaint_for,
            office_fund_approve_id,
        } = entry;
        let outletDetails;
        let company_name;

        try {
            // Call the asynchronous functions inside a try-catch block
            const userDetails = await getAdminAndUserDetail(user_id);
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

            // Use complaint_id as the key
            const key = `${complaint_id}`;

            if (!transformedData[key]) {
                transformedData[key] = {
                    user_id,
                    complaint_id,
                    userDetails,
                    outletDetails,
                    itemDetails: [],
                    total: 0,
                    total_office_amount: 0,
                    confirmDetails: [],
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
                total_office_approved_amount: entry.item_price * entry.office_approved_qty,
                office_fund_approve_id: entry.office_fund_approve_id,
            };

            // Add the total_approved_amount and total_office_approved_amount of this item to the total sum
            transformedData[key].total += itemDetail.total_approved_amount;
            transformedData[key].total_office_amount += itemDetail.total_office_approved_amount;

            transformedData[key].itemDetails.push(itemDetail);

            // Fetch office_fund_approve data only if not already in cache
            if (!officeFundApproveCache[office_fund_approve_id]) {
                const selectQuery = `SELECT * FROM office_fund_approve WHERE id = ${office_fund_approve_id}`;
                const result = await db.query(selectQuery);

                if (result.length > 0) {
                    officeFundApproveCache[office_fund_approve_id] = result[0];
                } else {
                    officeFundApproveCache[office_fund_approve_id] = null;
                }
            }

            // Add the fetched data to confirmDetails under transformedData if not already added
            if (
                officeFundApproveCache[office_fund_approve_id] &&
                !transformedData[key].confirmDetails.some((detail) => detail.id === office_fund_approve_id)
            ) {
                transformedData[key].confirmDetails.push(officeFundApproveCache[office_fund_approve_id]);
            }
        } catch (error) {
            console.error(
                `Error processing entry with user_id ${user_id} and complaint_id ${complaint_id}: ${error.message}`
            );
            throw error;
        }
    }

    return transformedData;
}

async function allApprovedComplaintsData(complaintId) {
    const selectQuery = `SELECT stock_punch_histories.*, stock_punch_histories.id AS stock_punch_history_id, stock_punch_histories.user_id as stock_user_id, complaints.*, item_masters.name as item_name, item_masters.image as item_image, stocks.rate as item_rate FROM stock_punch_histories LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id LEFT JOIN item_masters ON stock_punch_histories.item_id = item_masters.id LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id WHERE stock_punch_histories.office_approved_status = '2' AND stock_punch_histories.site_approved_status= '2' AND stock_punch_histories.complaint_id = '${complaintId}'`;

    const result = await db.query(selectQuery);

    const Query = `SELECT expense_punch_history.*, expense_punch_history.id AS expense_punch_history_id, expense_punch_history.user_id as fund_user_id, complaints.*,office_fund_approve.*, office_fund_approve.id as office_fund_approve_id, item_masters.name as item_name, item_masters.image as item_image, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id LEFT JOIN item_masters ON expense_punch_history.item_id = item_masters.id LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id LEFT JOIN office_fund_approve ON office_fund_approve.id = expense_punch_history.office_fund_approve_id WHERE expense_punch_history.office_approved_status = '2' AND expense_punch_history.site_approved_status = '2' AND expense_punch_history.complaint_id = '${complaintId}'`;

    const resultData = await db.query(Query);
    let transformedDataFund;
    let transformedDataSite;
    if (resultData.length > 0) {
        transformedDataFund = await transformDataForFundApproved(resultData);
    }
    if (result.length > 0) {
        transformedDataSite = await transformDataForApproved(result);
    }

    const dataSite = transformedDataSite ? Object.values(transformedDataSite) : "";
    const dataFund = transformedDataFund ? Object.values(transformedDataFund) : "";
    return { dataSite: dataSite, dataFund: dataFund };
}

/** function to save feedback form to approve office fund */
const feedbackForm = async (req, res, next) => {
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
        } = req.body;

        // check whether all feedback ratings are recived
        if (feedback.length < 7) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Please provide all feedback ratinds",
            });
        }

        // fetch feedback from client side
        const feedbackRatings = [
            {
                subject: `IN YOUR OPINION HOW IS THE BEHAVIOR OF OUR TEAM AT YOUR OUTLET DURING WORK ?`,
                rating: feedback[0],
            },
            {
                subject: `IN YOUR OPINION WHAT ABOUT THE WAY OF WORKING OF OUR TEAM ATYOUR OUTLET ?`,
                rating: feedback[1],
            },
            {
                subject: `IN YOUR OPINION WHAT IS THE STANDARDS OF QUALITY OF THE MATERIALS USED AT YOUR OUTLET?`,
                rating: feedback[2],
            },
            {
                subject: `IN YOUR OPINION HOW MUCH SAFETY CONCERN OUR TEAM DURING CARRYING OUT JOBS AT RETAIL OUTLET?`,
                rating: feedback[3],
            },
            {
                subject: `IN YOUR OPINION OUR TEAM TIMELY REPORT TO THE OUTLET ON RECEIPT OF COMPLAINTS?`,
                rating: feedback[4],
            },
            {
                subject: `IN YOUR OPINION HOW MUCH EFFECT COMES ON YOUR SALE DURING WORK EXICUTION AT YOUR OUTLET ?`,
                rating: feedback[5],
            },
            {
                subject: `HOW MUCH GRADE YOU WILL GIVE OVERALL OF OUR TEAM?`,
                rating: feedback[6],
            },
        ];

        const insertQuery = await db.query(
            `
            INSERT INTO office_expense_approve (area_manager, supervisor, supervisor_number, end_users, end_users_number, start_date, completion_date, complaint_number, outlet_owner_name, location, work_details, regional_office, sales_area, contact_person, contact_person_number, email, feedback, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                JSON.stringify(feedbackRatings, null, 2),
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

const employeeHistoryWithComplaints = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        // const pageStartResult = (currentPage - 1) * pageSize;
        const month = req.query.month || moment().format("YYYY-MM");

        let search_value = "";

        if (searchData) {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%'  OR u.name LIKE '%${searchData}%') `;
        }

        const selectQuery = `SELECT 
                                c.id AS complaint_id,
                                c.complaint_unique_id,
                                complaint_types.complaint_type_name,
                                c.status,
                                o.outlet_name,
                                o.outlet_unique_id,
                                u.id AS user_id,
                                u.name AS user_name,
                                u.employee_id,
                                ct.area_manager_id,
                                ct.supervisor_id,
                                ct.created_at
                                        FROM
                                            complaints c
                                                JOIN
                                            complaint_types ON complaint_types.id = c.complaint_type
                                                JOIN
                                            complaints_timeline ct ON c.id = ct.complaints_id
                                                JOIN
                                            users u ON u.id = ct.assign_to
                                                LEFT JOIN
                                            outlets o ON JSON_CONTAINS(c.outlet_id, CAST(o.id AS CHAR), '$') = 1
                                        WHERE
                                            c.status = '5'
                                                AND DATE_FORMAT(ct.created_at, '%Y-%m') = '2024-09'
                                                AND ct.area_manager_id IS NOT NULL
                                                AND ct.supervisor_id IS NOT NULL
                                        ORDER BY c.id DESC; `;
        const result = await db.query(selectQuery);
        if (result.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "No data found" });
        }
        const finalData = [];

        result.forEach((row) => {
            let user = finalData.find((u) => u.user_id === row.user_id);

            if (!user) {
                user = {
                    user_id: row.user_id,
                    name: row.user_name,
                    employee_id: row.employee_id,
                    role_id: row.role_id,
                    area_manager_id: row.area_manager_id,
                    supervisor_id: row.supervisor_id,
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    complaints: [],
                    outlets: [],
                };
                finalData.push(user);
            }

            user.complaints.push({
                complaint_id: row.complaint_id,
                complaint_unique_id: row.complaint_unique_id,
                complaint_type_name: row.complaint_type_name,
                status: row.status,
            });
            user.outlets.push({
                name: row.outlet_name,
                unique_id: row.outlet_unique_id,
            });
        });

        const pageStartResult = (currentPage - 1) * pageSize + 1;
        const total = finalData.length;
        const pageEndResult = Math.min(currentPage * pageSize, total);
        const totalPages = Math.ceil(total / pageSize);
        const pageDetails = {
            pageSize,
            currentPage,
            totalPages,
            total,
            pageStartResult,
            pageEndResult,
        };
        const paginatedData = finalData.slice(pageStartResult - 1, pageEndResult);

        res.status(StatusCodes.OK).json({
            status: true,
            message: "Data fetched successfully.",
            data: paginatedData,
            pageDetails,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllSaleAreaAndOutlet,
    getOutletComplaints,
    getApprovedUsedItemsOnComplaint,
    getPendingUsedItemsOnComplaint,
    approvedUsedItems,
    getAllApprovedExpenseList,
    approvedExpensesFromOffice,
    getAllApprovedOfficeExpenseList,
    getAllSaleAreaList,
    assignApprovedItems,
    assignApprovedExpense,
    getAllStockPunchedList,
    getSingleStockPunchedDetails,
    approvedPunchedStockDetails,
    assignApprovedItemStock,
    getAllOutletsWithComplaints,
    getAllOutletsWithComplaintsById,
    approveOfficeInspections,
    getAllOutletsWithComplaintsApproved,
    getAllOutletsWithComplaintsByApprovedId,
    getAllOutletsWithComplaintsPartial,
    getAllOutletsWithComplaintsByPartialId,
    getOutletOfficeById,
    getSalesAreaOfficeById,
    getRegionalOfficeExpenseById,
    getAllOutletsWithComplaintsForFunds,
    getAllOutletsWithComplaintsForFundsById,
    approveOfficeInspectionsForFund,
    getAllOutletsWithComplaintsApprovedForFund,
    getAllOutletsWithComplaintsPartialForFunds,
    getAllOutletsWithComplaintsForFundByApprovedId,
    getAllOutletsWithComplaintsForFundByPartialId,
    getRegionalOfficeExpenseByIdForFund,
    getOutletOfficeByIdForFund,
    getSalesAreaOfficeByIdForFund,
    getComplaintIdToDetails,
    getAllApprovedData,
    allApprovedComplaintsData,
    addOfficeInspectionsDetails,
    addOfficeInspectionsForFundDetails,
    outletsWithComplaintsForFund,
    outletsWithComplaintsById,
    employeeHistoryWithComplaints,
};

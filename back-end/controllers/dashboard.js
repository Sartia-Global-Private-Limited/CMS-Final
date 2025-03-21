require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const moment = require("moment");
const {
    calculatePagination,
    getComplaintDetails,
    complaintApprovedBy,
    getRegionalNameById,
    getSaleAreaNameById,
    getUserDetails,
    getEnergyCompaniesById,
    getOutletById,
    getCompanyDetailsById,
} = require("../helpers/general");
const { getComplaintTypeById } = require("../helpers/general");
const { addCreatedByCondition } = require("../helpers/commonHelper");
// const { getAllComplaints } = require('./contractorComplaintController');

const getTotalComplaintsCount = async (req, res, next) => {
    try {
        const financialYear = req.query.financialYear;
        const status = req.query.status;
        let date = req.query.date;
        const rangeType = req.query.rangeType; // Expecting 'Daily', 'Weekly', 'Monthly', 'Yearly'
        // Get today's date formatted as YYYY-MM-DD
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, "0");
        const todayDate = `${yyyy}-${mm}-${dd}`;

        let startDate = null,
            endDate = null;

        // Handle financial year
        if (financialYear && financialYear.trim() !== "") {
            const getYear = getFinancialYear(financialYear);
            startDate = getYear.startDate;
            endDate = getYear.endDate;
        }

        // Handle rangeType (Daily, Weekly, Monthly, Yearly)
        if (rangeType && rangeType.trim() !== "") {
            const range = getDateRange(rangeType);
            startDate = range.startDate;
            endDate = range.endDate;
        }

        let query = `SELECT COUNT(*) FROM complaints`;
        const queryParams = [];

        // Handle default date to today if no parameters are provided
        if (!financialYear && !status && !date && !rangeType) {
            query += ` WHERE DATE(created_at) = ?`;
            queryParams.push(todayDate);
        } else {
            // Handle specific date if provided
            if (date && date.trim() !== "") {
                query += queryParams.length > 0 ? ` AND DATE(created_at) = ?` : ` WHERE DATE(created_at) = ?`;
                queryParams.push(date);
            }

            // Handle financial year range if provided
            if (startDate && endDate) {
                query +=
                    queryParams.length > 0
                        ? ` AND created_at >= ? AND created_at <= ?`
                        : ` WHERE created_at >= ? AND created_at <= ?`;
                queryParams.push(startDate, endDate);
            }

            // Handle status if provided
            if (status && status.trim() !== "") {
                query += queryParams.length > 0 ? ` AND status = ?` : ` WHERE status = ?`;
                queryParams.push(status);
            }
        }

        const selectquery = await db.query(query, queryParams);
        const totalCount = selectquery[0]["COUNT(*)"];

        return res.status(StatusCodes.OK).json({ status: true, totalCount });
    } catch (error) {
        return next(error);
    }
};

function getFinancialYear(financialYear) {
    const [startYear] = financialYear.split("-");
    startDate = `${startYear}-04-01`;
    endDate = `${parseInt(startYear) + 1}-03-31`;

    return { startDate, endDate };
}

const getDateRange = (rangeType) => {
    const today = new Date();
    let startDate, endDate;

    switch (rangeType) {
        case "Daily":
            startDate = new Date(today);
            endDate = new Date(today);
            break;
        case "Weekly":
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startDate = startOfWeek;
            endDate = new Date(startOfWeek);
            endDate.setDate(startOfWeek.getDate() + 6);
            break;
        case "Monthly":
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case "Yearly":
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        default:
            throw new Error("Invalid range type");
    }

    return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
    };
};

const getTotalComplaints = async (req, res, next) => {
    try {
        let financialYearData = null;
        const ro_id = req.query.ro_id || "";

        let start_date = "";
        let end_date = "";

        // Fetch data based on Financial year
        let getPaymentData;
        // check whether final year is provided
        if (req.query.year_name && req.query.year_name !== "") {
            // fetch financial year dates
            const financialYearQuery = `SELECT start_date, end_date FROM financial_years WHERE year_name = ?`;

            const financialYearResponse = await db.query(financialYearQuery, [req.query.year_name]);

            //if financial year not found
            if (financialYearResponse.length === 0) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "Please Provide Valid Financial Year" });
            }

            start_date = financialYearResponse[0].start_date;
            end_date = financialYearResponse[0].end_date;
            const startDate = moment(start_date).format("YYYY-MM-DD");
            const endDate = moment(end_date).format("YYYY-MM-DD");

            let financialYearWhereConditions = `WHERE created_by = '${req.user.user_id}' AND created_at BETWEEN ? AND ?`;

            if (ro_id) {
                financialYearWhereConditions += ` AND complaints.ro_id = '[${ro_id}]'`;
            }

            let rows1Query = `
                SELECT
                    complaints.status,
                    COUNT(*) as totalComplaints
                FROM complaints
                ${financialYearWhereConditions}
                AND complaints.status IN (1, 2, 3, 4, 5, 6)
                GROUP BY complaints.status
            `;

            rows1Query = addCreatedByCondition(rows1Query, {
            table: "complaints",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

            const rows1 = await db.query(rows1Query, [startDate, endDate]);

            financialYearData = {
                financial_year: req.query.year_name,
                totalComplaints: 0,
                status: {
                    pending: 0,
                    approved: 0,
                    working: 0,
                    rejected: 0,
                    resolved: 0,
                    hold: 0,
                },
            };

            if (ro_id) {
                financialYearData.ro_id = parseInt(ro_id);
            }

            // if financial year data is found
            if (rows1.length > 0) {
                financialYearData.totalComplaints = rows1.reduce((sum, row) => sum + row.totalComplaints, 0);
                financialYearData.status = {
                    pending: rows1.find((row) => row.status === 1)?.totalComplaints || 0,
                    approved: rows1.find((row) => row.status === 2)?.totalComplaints || 0,
                    working: rows1.find((row) => row.status === 3)?.totalComplaints || 0,
                    rejected: rows1.find((row) => row.status === 4)?.totalComplaints || 0,
                    resolved: rows1.find((row) => row.status === 5)?.totalComplaints || 0,
                    hold: rows1.find((row) => row.status === 6)?.totalComplaints || 0,
                };
            }

            getPaymentData = await getTotalCountsOfPaymentReceive(startDate, endDate, req.user.user_id, req.user.user_type);
        } else {
            /**  if financial year is not provided in query */
            let financialYearWhereConditions = `WHERE created_by = '${req.user.user_id}' AND created_at BETWEEN ? AND ?`;

            if (ro_id) {
                financialYearWhereConditions += ` AND complaints.ro_id = '[${ro_id}]'`;
            }

            let rows1Query = `
                SELECT
                    complaints.status,
                    COUNT(*) as totalComplaints
                FROM complaints
                ${financialYearWhereConditions}
                AND complaints.status IN (1, 2, 3, 4, 5, 6)
                GROUP BY complaints.status
            `;

            rows1Query = addCreatedByCondition(rows1Query, {
                table: "complaints",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });

            // Fetch Current Financial Year when Financial Year in query is not provided
            const startDate = moment().format("YYYY-04-01");
            const endDate = moment().add(1, "year").format("YYYY-03-31");

            const financial_year = `${moment().format("YYYY")}-${moment().add(1, "year").format("YYYY").substring(2)}`;

            const rows1 = await db.query(rows1Query, [startDate, endDate]);

            financialYearData = {
                financial_year,
                totalComplaints: 0,
                status: {
                    pending: 0,
                    approved: 0,
                    working: 0,
                    rejected: 0,
                    resolved: 0,
                    hold: 0,
                },
            };

            if (ro_id) {
                financialYearData.ro_id = parseInt(ro_id);
            }

            // if financial year data is found
            if (rows1.length > 0) {
                financialYearData.totalComplaints = rows1.reduce((sum, row) => sum + row.totalComplaints, 0);
                financialYearData.status = {
                    pending: rows1.find((row) => row.status === 1)?.totalComplaints || 0,
                    approved: rows1.find((row) => row.status === 2)?.totalComplaints || 0,
                    working: rows1.find((row) => row.status === 3)?.totalComplaints || 0,
                    rejected: rows1.find((row) => row.status === 4)?.totalComplaints || 0,
                    resolved: rows1.find((row) => row.status === 5)?.totalComplaints || 0,
                    hold: rows1.find((row) => row.status === 6)?.totalComplaints || 0,
                };
            }
        }

        // Fetch Data for Current Month or based on Current Month of Financial Yea
        let getCurrentYear = "";

        const getCurrentMonth = moment().format("MM");

        if (start_date && end_date) {
            // Fetch Financial Year based on Current Month
            if (parseInt(getCurrentMonth) >= 4 && parseInt(getCurrentMonth) <= 12) {
                getCurrentYear = moment(start_date).format("YYYY");
            } else {
                getCurrentYear = moment(end_date).format("YYYY");
            }
        } else {
            getCurrentYear = moment().format("YYYY");
        }

        let currentMonthWhereConditions = `WHERE created_by = '${req.user.user_id}' AND created_at LIKE '${getCurrentYear}-${getCurrentMonth}%'`;

        if (ro_id) {
            currentMonthWhereConditions += ` AND complaints.ro_id = '[${ro_id}]'`;
        }

        let rows2Query = `
            SELECT
                complaints.status,
                COUNT(*) as totalComplaints
            FROM complaints
            ${currentMonthWhereConditions}
            AND complaints.status IN (1, 2, 3, 4, 5, 6)
            GROUP BY complaints.status
        `;

        rows2Query = addCreatedByCondition(rows2Query, {
            table: "complaints",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const rows2 = await db.query(rows2Query);

        let currentMonthData = {
            current_month_and_year: `${moment().format("MMMM")}-${getCurrentYear}`,
            totalComplaints: 0,
            status: {
                pending: 0,
                approved: 0,
                working: 0,
                rejected: 0,
                resolved: 0,
                hold: 0,
            },
        };

        if (ro_id) {
            currentMonthData.ro_id = parseInt(ro_id);
        }

        if (rows2.length > 0) {
            currentMonthData.totalComplaints = rows2.reduce((sum, row) => sum + row.totalComplaints, 0);
            currentMonthData.status = {
                pending: rows2.find((row) => row.status === 1)?.totalComplaints || 0,
                approved: rows2.find((row) => row.status === 2)?.totalComplaints || 0,
                working: rows2.find((row) => row.status === 3)?.totalComplaints || 0,
                rejected: rows2.find((row) => row.status === 4)?.totalComplaints || 0,
                resolved: rows2.find((row) => row.status === 5)?.totalComplaints || 0,
                hold: rows2.find((row) => row.status === 6)?.totalComplaints || 0,
            };
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Data Fetched successfully",
            data: {
                financialYearData,
                currentMonthData,
                getPaymentData,
            },
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * * ### Fetch Area Manager based on no. of Complaints they worked on
 */
const getAreaManagersDashboard = async (req, res, next) => {
    try {
        // get the Area Manager role id
        const managerRoleId = process.env.MANAGER_ROLE_ID;

        let financialYear = req.query.year_name;
        if (!financialYear) {
            // get the current financial year
            let currentDate = moment();
            let currentYear = currentDate.year();

            let startFinancialYear = `${currentYear}-04-01`;
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }
            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }
        const getYear = getFinancialYear(financialYear);

        let startDate = getYear.startDate;
        let endDate = getYear.endDate;

        // Prepare the query
        // let selectQuery = `
        //     SELECT 
        //     users.id, 
        //     users.name, 
        //     users.email, 
        //     users.image, 
        //     users.employee_id,
        //     GROUP_CONCAT(DISTINCT distinct_complaints_timeline.complaints_id) AS complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 1 THEN complaints.id ELSE NULL END) AS pending_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 2 THEN complaints.id ELSE NULL END) AS approved_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 3 THEN complaints.id ELSE NULL END) AS working_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 4 THEN complaints.id ELSE NULL END) AS rejected_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 5 THEN complaints.id ELSE NULL END) AS resolved_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 6 THEN complaints.id ELSE NULL END) AS hold_complaints_ids,
        //     COUNT(DISTINCT distinct_complaints_timeline.complaints_id) AS total_complaints,
        //     COALESCE(SUM(CASE WHEN complaints.status = 1 THEN 1 ELSE 0 END), 0) AS pending,
        //     COALESCE(SUM(CASE WHEN complaints.status = 2 THEN 1 ELSE 0 END), 0) AS approved,
        //     COALESCE(SUM(CASE WHEN complaints.status = 3 THEN 1 ELSE 0 END), 0) AS working,
        //     COALESCE(SUM(CASE WHEN complaints.status = 4 THEN 1 ELSE 0 END), 0) AS rejected,
        //     COALESCE(SUM(CASE WHEN complaints.status = 5 THEN 1 ELSE 0 END), 0) AS resolved,
        //     COALESCE(SUM(CASE WHEN complaints.status = 6 THEN 1 ELSE 0 END), 0) AS hold
        //     FROM users
        //     LEFT JOIN (
        //     SELECT DISTINCT complaints_id, area_manager_id 
        //     FROM complaints_timeline
        //     ) AS distinct_complaints_timeline ON distinct_complaints_timeline.area_manager_id = users.id
        //     LEFT JOIN complaints ON complaints.id = distinct_complaints_timeline.complaints_id
        //     WHERE users.user_type = ? AND distinct_complaints_timeline.complaints_id IS NOT NULL AND complaints.created_at BETWEEN ? AND ?
        //     GROUP BY users.id, users.name, users.email, users.image
        //     ORDER BY resolved DESC, users.id DESC;
        // `;

        // removed the part "WHERE users.user_type = ?"
        let selectQuery = `
            SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.image, 
            users.employee_id,
            GROUP_CONCAT(DISTINCT distinct_complaints_timeline.complaints_id) AS complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 1 THEN complaints.id ELSE NULL END) AS pending_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 2 THEN complaints.id ELSE NULL END) AS approved_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 3 THEN complaints.id ELSE NULL END) AS working_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 4 THEN complaints.id ELSE NULL END) AS rejected_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 5 THEN complaints.id ELSE NULL END) AS resolved_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 6 THEN complaints.id ELSE NULL END) AS hold_complaints_ids,
            COUNT(DISTINCT distinct_complaints_timeline.complaints_id) AS total_complaints,
            COALESCE(SUM(CASE WHEN complaints.status = 1 THEN 1 ELSE 0 END), 0) AS pending,
            COALESCE(SUM(CASE WHEN complaints.status = 2 THEN 1 ELSE 0 END), 0) AS approved,
            COALESCE(SUM(CASE WHEN complaints.status = 3 THEN 1 ELSE 0 END), 0) AS working,
            COALESCE(SUM(CASE WHEN complaints.status = 4 THEN 1 ELSE 0 END), 0) AS rejected,
            COALESCE(SUM(CASE WHEN complaints.status = 5 THEN 1 ELSE 0 END), 0) AS resolved,
            COALESCE(SUM(CASE WHEN complaints.status = 6 THEN 1 ELSE 0 END), 0) AS hold
            FROM users
            LEFT JOIN (
            SELECT DISTINCT complaints_id, area_manager_id 
            FROM complaints_timeline
            ) AS distinct_complaints_timeline ON distinct_complaints_timeline.area_manager_id = users.id
            LEFT JOIN complaints ON complaints.id = distinct_complaints_timeline.complaints_id
            WHERE distinct_complaints_timeline.complaints_id IS NOT NULL AND complaints.created_at BETWEEN ? AND ?
            GROUP BY users.id, users.name, users.email, users.image
            ORDER BY resolved DESC, users.id DESC;
        `;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "complaints_timeline",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // const queryResult = await db.query(selectQuery, [managerRoleId, startDate, endDate]);
        const queryResult = await db.query(selectQuery, [startDate, endDate]);

        const response = queryResult.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            image: row.image,
            employee_id: row.employee_id,
            total_complaints: row.total_complaints,
            status: {
                pending: row.pending,
                approved: row.approved,
                working: row.working,
                rejected: row.rejected,
                resolved: row.resolved,
                hold: row.hold,
            },
            complaint_ids: {
                pending: row.pending_complaints_ids,
                approved: row.approved_complaints_ids,
                working: row.working_complaints_ids,
                rejected: row.rejected_complaints_ids,
                resolved: row.resolved_complaints_ids,
                hold: row.hold_complaints_ids,
            },
        }));

        return res.status(StatusCodes.OK).json({ status: true, data: response });
    } catch (error) {
        return next(error);
    }
};

/**
 * * ### Fetch End Users based on no. of Complaints they worked on
 */
const getEndUsersDashboard = async (req, res, next) => {
    try {
        const endUserRoleId = process.env.SUB_USER_ROLE_ID;

        let financialYear = req.query.year_name;
        if (!financialYear) {
            // get the current financial year
            let currentDate = moment();
            let currentYear = currentDate.year();

            let startFinancialYear = `${currentYear}-04-01`;
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }
            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }
        const getYear = getFinancialYear(financialYear);

        var startDate = getYear.startDate;
        var endDate = getYear.endDate;

        // Prepare the query
        // const selectQuery = `
        //     SELECT 
        //     users.id, 
        //     users.name, 
        //     users.email, 
        //     users.image,
        //     users.employee_id, 
        //     GROUP_CONCAT(DISTINCT distinct_complaints_timeline.complaints_id) AS complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 1 THEN complaints.id ELSE NULL END) AS pending_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 2 THEN complaints.id ELSE NULL END) AS approved_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 3 THEN complaints.id ELSE NULL END) AS working_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 4 THEN complaints.id ELSE NULL END) AS rejected_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 5 THEN complaints.id ELSE NULL END) AS resolved_complaints_ids,
        //     GROUP_CONCAT(CASE WHEN complaints.status = 6 THEN complaints.id ELSE NULL END) AS hold_complaints_ids,
        //     COUNT (DISTINCT distinct_complaints_timeline.complaints_id) AS total_complaints,
        //     COALESCE(SUM(CASE WHEN complaints.status = 1 THEN 1 ELSE 0 END), 0) AS pending,
        //     COALESCE(SUM(CASE WHEN complaints.status = 2 THEN 1 ELSE 0 END), 0) AS approved,
        //     COALESCE(SUM(CASE WHEN complaints.status = 3 THEN 1 ELSE 0 END), 0) AS working,
        //     COALESCE(SUM(CASE WHEN complaints.status = 4 THEN 1 ELSE 0 END), 0) AS rejected,
        //     COALESCE(SUM(CASE WHEN complaints.status = 5 THEN 1 ELSE 0 END), 0) AS resolved,
        //     COALESCE(SUM(CASE WHEN complaints.status = 6 THEN 1 ELSE 0 END), 0) AS hold
        //     FROM users
        //     LEFT JOIN (
        //     SELECT DISTINCT complaints_id, assign_to 
        //     FROM complaints_timeline WHERE created_by = '${req.user.user_id}'
        //     ) AS distinct_complaints_timeline ON distinct_complaints_timeline.assign_to = users.id
        //     LEFT JOIN complaints ON complaints.id = distinct_complaints_timeline.complaints_id
        //     WHERE users.user_type = ? AND distinct_complaints_timeline.complaints_id IS NOT NULL AND complaints.created_at BETWEEN ? AND ?
        //     GROUP BY users.id, users.name, users.email, users.image
        //     ORDER BY resolved DESC, users.id DESC;
        // `;

        const selectQuery = `
            SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.image,
            users.employee_id, 
            GROUP_CONCAT(DISTINCT distinct_complaints_timeline.complaints_id) AS complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 1 THEN complaints.id ELSE NULL END) AS pending_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 2 THEN complaints.id ELSE NULL END) AS approved_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 3 THEN complaints.id ELSE NULL END) AS working_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 4 THEN complaints.id ELSE NULL END) AS rejected_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 5 THEN complaints.id ELSE NULL END) AS resolved_complaints_ids,
            GROUP_CONCAT(CASE WHEN complaints.status = 6 THEN complaints.id ELSE NULL END) AS hold_complaints_ids,
            COUNT (DISTINCT distinct_complaints_timeline.complaints_id) AS total_complaints,
            COALESCE(SUM(CASE WHEN complaints.status = 1 THEN 1 ELSE 0 END), 0) AS pending,
            COALESCE(SUM(CASE WHEN complaints.status = 2 THEN 1 ELSE 0 END), 0) AS approved,
            COALESCE(SUM(CASE WHEN complaints.status = 3 THEN 1 ELSE 0 END), 0) AS working,
            COALESCE(SUM(CASE WHEN complaints.status = 4 THEN 1 ELSE 0 END), 0) AS rejected,
            COALESCE(SUM(CASE WHEN complaints.status = 5 THEN 1 ELSE 0 END), 0) AS resolved,
            COALESCE(SUM(CASE WHEN complaints.status = 6 THEN 1 ELSE 0 END), 0) AS hold
            FROM users
            LEFT JOIN (
            SELECT DISTINCT complaints_id, assign_to 
            FROM complaints_timeline WHERE created_by = '${req.user.user_id}'
            ) AS distinct_complaints_timeline ON distinct_complaints_timeline.assign_to = users.id
            LEFT JOIN complaints ON complaints.id = distinct_complaints_timeline.complaints_id
            WHERE distinct_complaints_timeline.complaints_id IS NOT NULL AND complaints.created_at BETWEEN ? AND ?
            GROUP BY users.id, users.name, users.email, users.image
            ORDER BY resolved DESC, users.id DESC;
        `;

        // const queryResult = await db.query(selectQuery, [endUserRoleId, startDate, endDate]);
        const queryResult = await db.query(selectQuery, [startDate, endDate]);

        const response = queryResult.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            image: row.image,
            employee_id: row.employee_id,
            total_complaints: row.total_complaints,
            status: {
                pending: row.pending,
                approved: row.approved,
                working: row.working,
                rejected: row.rejected,
                resolved: row.resolved,
                hold: row.hold,
            },
            complaint_ids: {
                pending: row.pending_complaints_ids,
                approved: row.approved_complaints_ids,
                working: row.working_complaints_ids,
                rejected: row.rejected_complaints_ids,
                resolved: row.resolved_complaints_ids,
                hold: row.hold_complaints_ids,
            },
        }));

        return res.status(StatusCodes.OK).json({ status: true, data: response });
    } catch (error) {
        return next(error);
    }
};

const getTotalComplaintsCountEachMonth = async (req, res, next) => {
    try {
        let financialYear = req.query.year_name;

        const ro = req.query.ro;

        if (!financialYear) {
            // get the current financial year
            let currentDate = moment();
            let currentYear = currentDate.year();

            let startFinancialYear = `${currentYear}-04-01`;
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }
            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }
        const getYear = getFinancialYear(financialYear);

        var startDate = getYear.startDate;
        var endDate = getYear.endDate;

        let condition = "";
        if (ro) {
            condition = `AND ro_id = '[${ro}]'`;
        }

        const query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count FROM complaints WHERE
        created_by = '${req.user.user_id}' AND created_at BETWEEN '${startDate}' AND '${endDate}' ${condition}
        GROUP BY month ORDER BY month;
    `;

        const queryResult = await db.query(query);
        const monthlyCounts = {};
        const allMonths = [
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "January",
            "February",
            "March",
        ];

        allMonths.forEach((month) => {
            monthlyCounts[month] = 0;
        });

        queryResult.forEach((row) => {
            const monthName = moment(row.month, "YYYY-MM").format("MMMM");
            if (monthlyCounts.hasOwnProperty(monthName)) {
                monthlyCounts[monthName] = row.count;
            }
        });

        res.status(StatusCodes.OK).json({ status: true, data: monthlyCounts, message: "Fetched successfully" });
    } catch (error) {
        return next(error);
    }
};

const getMeasurementAmountEachMonth = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;
        const ro = req.query.ro;

        if (!financialYear) {
            financialYear = getCurrentFinancialYear();
        }

        let condition = "";
        if (ro) {
            condition = `AND ro_office_id = '${ro}'`;
        }

        const getYear = getFinancialYear(financialYear);
        const startDate = getYear.startDate;
        const endDate = getYear.endDate;

        const query = `
        SELECT DATE_FORMAT(measurement_date, '%Y-%m') AS month, sum(amount) AS amount FROM measurements WHERE created_by = '${req.user.user_id}' AND status = '5' AND
        measurement_date BETWEEN '${startDate}' AND '${endDate}' ${condition}
        GROUP BY month ORDER BY month;
    `;
        const queryResult = await db.query(query);
        const monthlyCounts = {};
        const allMonths = [
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "January",
            "February",
            "March",
        ];

        allMonths.forEach((month) => {
            monthlyCounts[month] = 0;
        });

        queryResult.forEach((row) => {
            const monthName = moment(row.month, "YYYY-MM").format("MMMM");
            if (monthlyCounts.hasOwnProperty(monthName)) {
                monthlyCounts[monthName] = row.amount;
            }
        });

        res.status(StatusCodes.OK).json({
            status: true,
            data: { financial_year: financialYear, amounts: monthlyCounts },
            message: "Fetched successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const getProformaInvoiceEachMonthAmount = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;
        const ro = req.query.ro;

        if (!financialYear) {
            financialYear = getCurrentFinancialYear();
        }

        const { startDate, endDate } = getFinancialYear(financialYear);

        let condition = "";
        if (ro) {
            condition = `AND billing_to_ro_office = '${ro}'`;
        }

        const query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, measurements, mpi_status, merged_pi_id 
        FROM proforma_invoices 
        WHERE created_by = '${req.user.user_id}' AND status IN (3, 5) 
        AND invoice_status = '2' 
        AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
        `;

        const queryResult = await db.query(query);

        const monthlyCounts = {
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
            January: 0,
            February: 0,
            March: 0,
        };

        for (let row of queryResult) {
            let merged = [];

            if (!row.mpi_status) {
                // Directly parse the measurements if mpi_status is null
                merged = JSON.parse(row.measurements);
            } else {
                const mergedPiIds = row.merged_pi_id.split(",");
                for (const id of mergedPiIds) {
                    const selectQuery = await db.query(
                        `SELECT measurements FROM proforma_invoices WHERE created_by = '${req.user.user_id}' AND id = ?`,
                        [id.trim()]
                    );
                    if (selectQuery.length > 0) {
                        merged.push(...JSON.parse(selectQuery[0].measurements));
                    }
                }
            }

            const parsedMeasurements = merged.map((measurement) => {
                return typeof measurement === "string" ? JSON.parse(measurement) : measurement;
            });

            const mergedMeasurements = parsedMeasurements.flat();

            // Calculate the amount based on the merged measurements
            const amount = await totalMeasurementAmount(mergedMeasurements, req.user.user_id);
            row.amount = amount || 0;

            // Accumulate the amount for the corresponding month
            const monthName = moment(row.month, "YYYY-MM").format("MMMM");
            if (monthlyCounts.hasOwnProperty(monthName)) {
                monthlyCounts[monthName] += parseFloat(row.amount); // Ensure numeric addition
            }
        }

        // Log the final counts for verification

        res.status(StatusCodes.OK).json({
            status: true,
            data: { financial_year: financialYear, amounts: monthlyCounts },
            message: "Fetched successfully",
        });
    } catch (error) {
        return next(error);
    }
};

async function totalMeasurementAmount(measurements, createdBy) {
    try {
        let measurement_amount = 0;
        for (let measurement of measurements) {
            const query = `SELECT amount FROM  measurements WHERE created_by = '${createdBy}' AND id = '${measurement.measurement_list}'`;
            const queryResult = await db.query(query);
            measurement_amount += queryResult[0].amount;
        }

        return measurement_amount.toFixed(2);
    } catch (error) {
        throw error;
    }
}

const getInvoiceEachMonthAmount = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;
        const ro = req.query.ro;

        if (!financialYear) {
            financialYear = getCurrentFinancialYear();
        }

        let condition = "";
        if (ro) {
            condition = `AND billing_ro = '${ro}'`;
        }

        const { startDate, endDate } = getFinancialYear(financialYear);

        // Fetch the invoices for the given period with correct condition grouping
        const invoiceQuery = `
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, pi_id 
            FROM invoices 
            WHERE created_by = '${req.user.user_id}' AND ( status = 1 AND payment_status = '2') 
            AND created_at BETWEEN '${startDate}' AND '${endDate}' 
            ${condition}
        `;

        const invoiceResults = await db.query(invoiceQuery);

        // Initialize the monthly counts
        const monthlyCounts = {
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
            January: 0,
            February: 0,
            March: 0,
        };

        for (let row of invoiceResults) {
            const piIds = row.pi_id.split(",").map((id) => id.trim());

            let totalAmount = 0;

            for (const piId of piIds) {
                // Fetch proforma invoice details
                const piQuery = `SELECT * FROM proforma_invoices WHERE created_by = '${req.user.user_id}' AND id = ?`;
                const piData = await db.query(piQuery, [piId]);

                if (piData.length > 0) {
                    const pi = piData[0];
                    let measurements = [];

                    if (pi.mpi_status == null) {
                        measurements = JSON.parse(pi.measurements);
                    } else {
                        const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());
                        for (const id of mergedPiIds) {
                            const selectQuery = await db.query(
                                `SELECT measurements FROM proforma_invoices WHERE created_by = '${req.user.user_id}' AND id = ?`,
                                [id]
                            );
                            if (selectQuery.length > 0) {
                                measurements.push(...JSON.parse(selectQuery[0].measurements));
                            }
                        }
                    }

                    const parsedMeasurements = measurements.flatMap((measurement) =>
                        typeof measurement === "string" ? JSON.parse(measurement) : measurement
                    );

                    // Calculate the total amount from measurements
                    const amount = await totalMeasurementAmount(parsedMeasurements, req.user.user_id);
                    totalAmount += amount;
                }
            }

            // Accumulate the total amount for the corresponding month
            const monthName = moment(row.month + "-01", "YYYY-MM-DD").format("MMMM");

            if (monthlyCounts.hasOwnProperty(monthName)) {
                monthlyCounts[monthName] += parseFloat(totalAmount); // Ensure numeric addition
            } else {
                console.warn(`Invalid month name parsed: ${monthName}`);
            }
        }

        res.status(StatusCodes.OK).json({
            status: true,
            data: { financial_year: financialYear, amounts: monthlyCounts },
            message: "Fetched successfully",
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * * ### Fetch All Complaints by Status for a Specific Area Manager
 */
const getAllComplaintsByStatus = async (req, res, next) => {
    try {
        let { complaint_ids } = req.body;
        const searchData = req.query.search || "";
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";

        if (searchData != null && searchData != "") {
            search_value = `AND complaint_type LIKE '%${searchData}%' OR complaint_unique_id LIKE '%${searchData}%'`;
        }

        if (!complaint_ids || complaint_ids.length == 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Please Provide Complaints", data: [] });
        }

        let selectQuery = `SELECT * FROM complaints WHERE id IN (${complaint_ids}) ${search_value} ORDER BY id`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "complaints",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // console.log('selectQuery: ', selectQuery);


        const result = await db.query(selectQuery);

        // const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        // const totalResult = await db.query(modifiedQueryString);

        if (result.length > 0) {
            let outletDetails;
            let company_name;
            let complaintRaiseType;
            let order_by_name = "";
            let finalData = [];

            // let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (const row of result) {
                // const complaintType = await getComplaintDetails(row.complaint_type);
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);

                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = "own";
                } else {
                    complaintRaiseType = "other";
                }

                if (row.complaint_for == "1") {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name;
                    outletDetails = await getOutletById(row.outlet_id);
                } else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                }
                let status;
                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = "PENDING";
                } else if (row.status == 2) {
                    status = "APPROVED";
                } else if (row.status == 3) {
                    status = "WORKING";
                } else if (row.status == 4) {
                    status = "REJECTED";
                } else if (row.status == 5) {
                    status = "RESOLVED";
                } else if (row.status == 6) {
                    status = "HOLD";
                }

                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }

                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    created_at: moment(row.created_at).format("YYYY-MM-DD"),
                    outlet: outletDetails ? outletDetails : null,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails,
                    order_via: row.order_by_id,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Complaints fetched successfully",
                data: finalData,
                // pageDetails,
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Complaints not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getBillingDashboard = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;

        if (!financialYear) {
            const currentDate = moment();
            const currentYear = currentDate.year();

            const startFinancialYear = moment(`${currentYear}-04-01`, "YYYY-MM-DD");
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }

            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }

        const { startDate, endDate } = getFinancialYear(financialYear);

        const selectQuery = await db.query(
            `SELECT * FROM payment_receive WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`
        );

        // if (selectQuery.length === 0) {
        //     return res.status(StatusCodes.OK).json({ status: true, message: "No data found", data: [] });
        // }

        const monthlyCounts = {
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
            January: 0,
            February: 0,
            March: 0,
        };

        for (const row of selectQuery) {
            const invoiceQuery = await db.query(
                `SELECT * FROM invoices WHERE created_by = '${req.user.user_id}' AND id = ?`,
                [row.invoice_id]
            );

            if (invoiceQuery.length === 0) continue;

            for (const invoiceRow of invoiceQuery) {
                const piIds = invoiceRow.pi_id.split(",").map((id) => id.trim());

                let totalAmount = 0;

                for (const piId of piIds) {
                    const piQuery = await db.query(
                        `SELECT * FROM proforma_invoices WHERE created_by = '${req.user.user_id}' AND id = ?`,
                        [piId]
                    );

                    if (piQuery.length === 0) continue;

                    const pi = piQuery[0];
                    let measurements = [];

                    if (!pi.mpi_status) {
                        measurements = JSON.parse(pi.measurements);
                    } else {
                        const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());

                        for (const mergedPiId of mergedPiIds) {
                            const mergedPiQuery = await db.query(
                                `SELECT measurements FROM proforma_invoices WHERE id = ?`,
                                [mergedPiId]
                            );

                            if (mergedPiQuery.length > 0) {
                                measurements.push(...JSON.parse(mergedPiQuery[0].measurements));
                            }
                        }
                    }

                    const parsedMeasurements = measurements.flatMap((measurement) =>
                        typeof measurement === "string" ? JSON.parse(measurement) : measurement
                    );

                    const amount = await totalMeasurementAmount(parsedMeasurements, req.user.user_id);
                    totalAmount += parseFloat(amount);
                }

                // Directly parse the `created_at` date to get the month
                const monthName = moment(row.created_at).format("MMMM");

                if (monthlyCounts.hasOwnProperty(monthName)) {
                    monthlyCounts[monthName] = parseFloat((monthlyCounts[monthName] + totalAmount).toFixed(2));
                } else {
                    console.warn(`Invalid month name parsed: ${monthName}`);
                }
            }
        }

        res.status(StatusCodes.OK).json({
            status: true,
            data: { financial_year: financialYear, amounts: monthlyCounts },
            message: "Fetched successfully",
        });
    } catch (error) {
        return next(error);
    }
};

const areaManagerDashboardforBilling = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;
        const ro = req.query.ro;
        if (!financialYear) {
            const currentDate = moment();
            const currentYear = currentDate.year();

            const startFinancialYear = moment(`${currentYear}-04-01`, "YYYY-MM-DD");
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }

            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }

        const { startDate, endDate } = getFinancialYear(financialYear);
        let condition = "";
        if (ro) {
            condition = `AND ro_office_id = '${ro}'`;
        }
        const createdBy = req.user.user_id;
        const measurementData = await measurementAmountforAreaManager(startDate, endDate, condition, createdBy);
        const performaData = await performaInvoiceAmount(startDate, endDate, condition, createdBy);
        const invoiceData = await getManagerInvoice(startDate, endDate, condition, createdBy);
        const paymentData = await getManagerPayment(startDate, endDate, condition, createdBy);

        const merged = consolidateAreaManagerData(measurementData, performaData, invoiceData, paymentData);

        return res.status(StatusCodes.OK).json({ status: true, data: merged });
    } catch (error) {
        return next(error);
    }
};

async function measurementAmountforAreaManager(startDate, endDate, condition, createdBy) {
    const query = `
        SELECT amount, complaint_id
        FROM measurements
        WHERE created_by = '${createdBy}' AND status = '5' 
        AND measurement_date BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const queryResult = await db.query(query);

    // Initialize a map to keep track of total amounts by area manager
    const areaManagerAmounts = {};

    // Iterate through the result set
    for (const row of queryResult) {
        // Get area manager details for the current complaint
        const checkAssign = await db.query(
            `
            SELECT complaints_timeline.area_manager_id, users.id, users.employee_id, users.name, users.username, users.image, users.employee_id 
            FROM complaints_timeline 
            LEFT JOIN users ON users.id = complaints_timeline.area_manager_id 
            WHERE complaints_timeline.created_by = '${createdBy}' AND complaints_timeline.complaints_id = ? 
            AND complaints_timeline.status = 'assigned'`,
            [row.complaint_id]
        );

        // If there are multiple area managers, choose the top one (first in the list)
        if (checkAssign.length > 0) {
            const topManager = checkAssign[0]; // Assuming the first one is the top

            // Initialize the area manager's total amount if not already
            if (!areaManagerAmounts[topManager.area_manager_id]) {
                areaManagerAmounts[topManager.area_manager_id] = {
                    manager: topManager,
                    measurement_amount: 0,
                };
            }

            // Add the measurement amount to the area manager's total
            areaManagerAmounts[topManager.area_manager_id].measurement_amount += parseFloat(row.amount);
        }
    }

    // Prepare the response
    const response = {
        area_managers: Object.values(areaManagerAmounts),
    };

    return response;
}

async function performaInvoiceAmount(startDate, endDate, condition, createdBy) {
    const query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, measurements, mpi_status, merged_pi_id 
        FROM proforma_invoices 
        WHERE created_by = '${createdBy}' AND status IN (3, 5) 
        AND invoice_status = '2' 
        AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const queryResult = await db.query(query);

    let totalMeasurementAmount = 0; // Initialize total amount
    let allAreaManagerAmounts = {}; // To store area manager details and their corresponding amounts

    for (let row of queryResult) {
        let merged = [];

        if (!row.mpi_status) {
            // Directly parse the measurements if mpi_status is null
            merged = JSON.parse(row.measurements);
        } else {
            const mergedPiIds = row.merged_pi_id.split(",");
            for (const id of mergedPiIds) {
                const selectQuery = await db.query("SELECT measurements FROM proforma_invoices WHERE id = ?", [
                    id.trim(),
                ]);
                if (selectQuery.length > 0) {
                    merged.push(...JSON.parse(selectQuery[0].measurements));
                }
            }
        }

        const parsedMeasurements = merged.map((measurement) => {
            return typeof measurement === "string" ? JSON.parse(measurement) : measurement;
        });

        const mergedMeasurements = parsedMeasurements.flat();

        // Get the total measurement amount and area manager details
        const { total_measurement_amount, area_manager_amounts } =
            await totalMeasurementAmountForAreaManager(mergedMeasurements);

        // Accumulate the total measurement amount
        totalMeasurementAmount += parseFloat(total_measurement_amount);

        // Merge area manager amounts into the final result
        for (let managerId in area_manager_amounts) {
            if (!allAreaManagerAmounts[managerId]) {
                allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
            } else {
                allAreaManagerAmounts[managerId].measurement_amount +=
                    area_manager_amounts[managerId].measurement_amount;
            }
        }
    }

    return {
        total_measurment_amount: totalMeasurementAmount.toFixed(2),
        area_manager_amounts: allAreaManagerAmounts,
    };
}

async function totalMeasurementAmountForAreaManager(measurements) {
    try {
        let measurement_amount = 0;
        let areaManagerAmounts = {}; // Initialize areaManagerAmounts here

        for (let measurement of measurements) {
            const query = `SELECT amount, complaint_id FROM measurements WHERE id = '${measurement.measurement_list}'`;
            const queryResult = await db.query(query);

            // Ensure queryResult has results before proceeding
            if (queryResult.length > 0) {
                const complaint_id = queryResult[0].complaint_id;
                const amount = parseFloat(queryResult[0].amount) || 0;

                // Get and accumulate manager measurement amount
                await getManagerMeasurementAmount(complaint_id, amount, areaManagerAmounts);

                // Accumulate the total measurement amount
                measurement_amount += amount;
            }
        }

        return {
            total_measurement_amount: measurement_amount.toFixed(2),
            area_manager_amounts: areaManagerAmounts,
        };
    } catch (error) {
        throw error;
    }
}

async function getManagerMeasurementAmount(complaint_id, amount, areaManagerAmounts) {
    const checkAssign = await db.query(
        `
        SELECT complaints_timeline.area_manager_id, users.id, users.name, users.username, users.image, users.employee_id 
        FROM complaints_timeline 
        LEFT JOIN users ON users.id = complaints_timeline.area_manager_id 
        WHERE complaints_timeline.complaints_id = ? 
        AND complaints_timeline.status = 'assigned'`,
        [complaint_id]
    );

    // If there are multiple area managers, choose the top one (first in the list)
    if (checkAssign.length > 0) {
        const topManager = checkAssign[0]; // Assuming the first one is the top

        // Initialize the area manager's total amount if not already
        if (!areaManagerAmounts[topManager.area_manager_id]) {
            areaManagerAmounts[topManager.area_manager_id] = {
                manager: topManager,
                measurement_amount: 0,
            };
        }

        // Add the measurement amount to the area manager's total
        areaManagerAmounts[topManager.area_manager_id].measurement_amount += amount;
    }

    return areaManagerAmounts;
}

async function getManagerInvoice(startDate, endDate, condition, createdBy) {
    const invoiceQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, pi_id 
        FROM invoices 
        WHERE created_by = '${createdBy}' AND (status = 2 AND payment_status = '2') 
        AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const invoiceResult = await db.query(invoiceQuery);

    let totalMeasurementAmount = 0; // To accumulate total measurement amount
    let allAreaManagerAmounts = {}; // To store area manager details and amounts

    for (let row of invoiceResult) {
        const piIds = row.pi_id.split(",").map((id) => id.trim());

        for (const piId of piIds) {
            // Fetch proforma invoice details
            const piQuery = `SELECT * FROM proforma_invoices WHERE id = ?`;
            const piData = await db.query(piQuery, [piId]);

            if (piData.length > 0) {
                const pi = piData[0];
                let measurements = [];

                if (pi.mpi_status == null) {
                    measurements = JSON.parse(pi.measurements);
                } else {
                    const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());
                    for (const id of mergedPiIds) {
                        const selectQuery = await db.query("SELECT measurements FROM proforma_invoices WHERE id = ?", [
                            id,
                        ]);
                        if (selectQuery.length > 0) {
                            measurements.push(...JSON.parse(selectQuery[0].measurements));
                        }
                    }
                }

                const parsedMeasurements = measurements.flatMap((measurement) =>
                    typeof measurement === "string" ? JSON.parse(measurement) : measurement
                );

                const mergedMeasurements = parsedMeasurements.flat();

                // Get the total measurement amount and area manager details
                const { total_measurement_amount, area_manager_amounts } =
                    await totalMeasurementAmountForAreaManager(mergedMeasurements);

                // Accumulate the total measurement amount
                totalMeasurementAmount += parseFloat(total_measurement_amount);

                // Merge area manager amounts into the final result
                for (let managerId in area_manager_amounts) {
                    if (!allAreaManagerAmounts[managerId]) {
                        allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
                    } else {
                        allAreaManagerAmounts[managerId].measurement_amount +=
                            area_manager_amounts[managerId].measurement_amount;
                    }
                }
            }
        }
    }

    return {
        totalMeasurementAmount,
        allAreaManagerAmounts,
    };
}

async function getManagerPayment(startDate, endDate, condition, createdBy) {
    const selectQuery = `SELECT * FROM payment_receive WHERE created_by = '${createdBy}' AND status = 2 AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition} `;

    const queryResult = await db.query(selectQuery);

    let totalMeasurementAmount = 0; // To accumulate total measurement amount
    let allAreaManagerAmounts = {}; // To store area manager details and amounts

    for (const data of queryResult) {
        const invoiceQuery = await db.query(
            `SELECT * FROM invoices WHERE created_by = '${createdBy}' AND id = ${data.invoice_id}`
        );

        for (const row of invoiceQuery) {
            const piIds = row.pi_id.split(",").map((id) => id.trim());

            for (const piId of piIds) {
                // Fetch proforma invoice details
                const piQuery = `SELECT * FROM proforma_invoices WHERE created_by = '${createdBy}' AND id = ?`;
                const piData = await db.query(piQuery, [piId]);

                if (piData.length > 0) {
                    const pi = piData[0];
                    let measurements = [];

                    if (pi.mpi_status == null) {
                        measurements = JSON.parse(pi.measurements);
                    } else {
                        const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());
                        for (const id of mergedPiIds) {
                            const selectQuery = await db.query(
                                `SELECT measurements FROM proforma_invoices WHERE created_by = '${createdBy}' AND id = ?`,
                                [id]
                            );
                            if (selectQuery.length > 0) {
                                measurements.push(...JSON.parse(selectQuery[0].measurements));
                            }
                        }
                    }

                    const parsedMeasurements = measurements.flatMap((measurement) =>
                        typeof measurement === "string" ? JSON.parse(measurement) : measurement
                    );

                    const mergedMeasurements = parsedMeasurements.flat();

                    // Calculate total measurement amount and area manager details
                    const { total_measurement_amount, area_manager_amounts } =
                        await totalMeasurementAmountForAreaManager(mergedMeasurements);

                    // Accumulate the total measurement amount
                    totalMeasurementAmount += parseFloat(total_measurement_amount);

                    // Merge area manager amounts into the final result
                    for (let managerId in area_manager_amounts) {
                        if (!allAreaManagerAmounts[managerId]) {
                            allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
                        } else {
                            allAreaManagerAmounts[managerId].measurement_amount +=
                                area_manager_amounts[managerId].measurement_amount;
                        }
                    }
                }
            }
        }
    }

    return {
        totalMeasurementAmount,
        allAreaManagerAmounts,
    };
}

function consolidateAreaManagerData(measurementData, performaData, invoiceData, paymentData) {
    const allAreaManagerAmounts = {};

    // Process measurement data
    if (measurementData && measurementData.area_managers) {
        measurementData.area_managers.forEach((am) => {
            const id = am.manager.area_manager_id;
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].measurements_amounts += am.measurement_amount || 0;
        });
    }

    // Process performa data
    if (performaData && performaData.area_manager_amounts) {
        Object.values(performaData.area_manager_amounts).forEach((am) => {
            const id = am.manager.area_manager_id;
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].performa_amounts += am.measurement_amount || 0;
        });
    }

    // Process invoice data
    if (invoiceData && invoiceData.allAreaManagerAmounts) {
        Object.values(invoiceData.allAreaManagerAmounts).forEach((am) => {
            const id = am.manager.area_manager_id;
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].invoices_amounts += am.measurement_amount || 0;
        });
    }

    // Process invoice data
    if (paymentData && paymentData.allAreaManagerAmounts) {
        Object.values(paymentData?.allAreaManagerAmounts).forEach((am) => {
            const id = am.manager.area_manager_id;
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].payment_amounts += am.measurement_amount || 0;
        });
    }

    // Convert the object to an array
    const consolidatedData = Object.values(allAreaManagerAmounts);

    consolidatedData.map((item) => {
        item.measurements_amounts = Math.round(item.measurements_amounts * 1e2) / 1e2;
        item.performa_amounts = Math.round(item.performa_amounts * 1e2) / 1e2;
        item.invoices_amounts = Math.round(item.invoices_amounts * 1e2) / 1e2;
        item.payment_amounts = Math.round(item.payment_amounts * 1e2) / 1e2;
        item.total =
            Math.round((item.measurements_amounts + item.performa_amounts + item.invoices_amounts) * 1e2) / 1e2;
    });

    consolidatedData.sort((a, b) => b.total - a.total); // Descending order
    return consolidatedData;
}

// async function getTotalCountsOfPaymentReceive(startDate, endDate) {
//     console.log(startDate, endDate)
//     // Fetching the count for the entire financial year
//     const financialYearQuery = `
//         SELECT COUNT(*) as count FROM payment_receive
//         WHERE status = 2
//         AND created_at BETWEEN '${startDate}' AND '${endDate}'
//     `;
//     console.log("financialYearQuery", financialYearQuery)
//     const financialYearResult = await db.query(financialYearQuery);
//     const financialYearCount = financialYearResult[0].count; // Extracting the count from the result

//     // Fetching the count for the current month within the financial year
//     const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
//     const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');

//     const currentMonthQuery = `
//         SELECT COUNT(*) as count FROM payment_receive
//         WHERE status = 2
//         AND created_at BETWEEN '${currentMonthStart}' AND '${currentMonthEnd}'
//     `;

//     console.log("currentMonthQuery", currentMonthQuery)
//     const currentMonthResult = await db.query(currentMonthQuery);
//     const currentMonthCount = currentMonthResult[0].count; // Extracting the count from the result

//     // Return the counts for both financial year and current month
//     return {
//         financialYearCount,
//         currentMonthCount
//     };
// }

async function getTotalCountsOfPaymentReceive(startDate, endDate, user_id, user_type) {
    // Fetching the count for the entire financial year
    let financialYearQuery = `
        SELECT COUNT(*) as count 
        FROM payment_receive 
        WHERE status = 2 
        AND created_at BETWEEN '${startDate}' AND '${endDate}'
    `;

    financialYearQuery = addCreatedByCondition(financialYearQuery, {
        table: "payment_receive",
        created_by: user_id,
        role: user_type,
    });

    const financialYearResult = await db.query(financialYearQuery);
    const financialYearCount = financialYearResult[0].count;

    // Determine the current month within the financial year
    const currentDate = moment();
    let currentMonthStart, currentMonthEnd;

    // Check if the current date is within the financial year range
    if (currentDate.isBetween(startDate, endDate, "days", "[]")) {
        currentMonthStart = currentDate.startOf("month").format("YYYY-MM-DD");
        currentMonthEnd = currentDate.endOf("month").format("YYYY-MM-DD");
    } else {
        // If the current date is outside the financial year, adjust the month accordingly
        const adjustedCurrentMonth = currentDate.month() + 1;
        currentMonthStart = moment(startDate)
            .month(adjustedCurrentMonth - 1) // Adjust month for 0-based index
            .startOf("month")
            .format("YYYY-MM-DD");
        currentMonthEnd = moment(startDate)
            .month(adjustedCurrentMonth - 1) // Adjust month for 0-based index
            .endOf("month")
            .format("YYYY-MM-DD");
    }

    let currentMonthQuery = `
        SELECT COUNT(*) as count 
        FROM payment_receive 
        WHERE status = 2 
        AND created_at BETWEEN '${currentMonthStart}' AND '${currentMonthEnd}'
    `;

    currentMonthQuery = addCreatedByCondition(currentMonthQuery, {
        table: "payment_receive",
        created_by: user_id,
        role: user_type,
    });

    const currentMonthResult = await db.query(currentMonthQuery);
    const currentMonthCount = currentMonthResult[0].count;

    // Return the counts for both financial year and current month
    return {
        financialYearCount,
        currentMonthCount,
    };
}

// ro billing dashboard

const roDashboardforBilling = async (req, res, next) => {
    try {
        let financialYear = req.query.financial_year;
        const ro = req.query.ro;
        if (!financialYear) {
            const currentDate = moment();
            const currentYear = currentDate.year();

            const startFinancialYear = moment(`${currentYear}-04-01`, "YYYY-MM-DD");
            let financialYearStart, financialYearEnd;

            if (currentDate.isBefore(startFinancialYear)) {
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear.toString().slice(2);
            } else {
                financialYearStart = currentYear;
                financialYearEnd = (currentYear + 1).toString().slice(2);
            }

            financialYear = `${financialYearStart}-${financialYearEnd}`;
        }

        const { startDate, endDate } = getFinancialYear(financialYear);
        let condition = "";
        if (ro) {
            condition = `AND ro_office_id = '${ro}'`;
        }
        const createdBy = req.user.user_id;
        const measurementData = await measurementAmountforRo(startDate, endDate, condition, createdBy);
        const performaData = await performaInvoiceAmountForRo(startDate, endDate, condition, createdBy);

        const invoiceData = await getRoInvoice(startDate, endDate, condition, createdBy);
        const paymentData = await getRoPayment(startDate, endDate, condition, createdBy);

        const merged = consolidateRoData(measurementData, performaData, invoiceData, paymentData);

        return res.status(StatusCodes.OK).json({ status: true, data: merged });
    } catch (error) {
        return next(error);
    }
};

async function measurementAmountforRo(startDate, endDate, condition, createdBy) {
    const query = `
        SELECT amount, complaint_id, ro_office_id  
        FROM measurements 
        WHERE created_by = '${createdBy}' AND status = '5' 
        AND measurement_date BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const queryResult = await db.query(query);

    // Initialize a map to keep track of total amounts by regional office
    const ro_office_amounts = {};

    // Iterate through the result set
    for (const row of queryResult) {
        // Get regional office details for the current complaint
        const regionalOffice = await getRegionalNameById(row.ro_office_id);
        // If regional office data is available
        if (regionalOffice.length > 0) {
            const topRegionalOffice = regionalOffice[0]; // Assuming the first one is the top office

            // Initialize the regional office's total amount if not already
            if (!ro_office_amounts[topRegionalOffice.id]) {
                ro_office_amounts[topRegionalOffice.id] = {
                    regional_office_name: topRegionalOffice.regional_office_name,
                    measurement_amount: 0,
                };
            }

            // Add the measurement amount to the regional office's total
            ro_office_amounts[topRegionalOffice.id].measurement_amount += parseFloat(row.amount);
        }
    }

    // Prepare the response
    const response = {
        ro_office: Object.values(ro_office_amounts),
    };

    return response;
}

async function performaInvoiceAmountForRo(startDate, endDate, condition, createdBy) {
    const query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, measurements, mpi_status, merged_pi_id 
        FROM proforma_invoices 
        WHERE created_by = '${createdBy}' AND status IN (3, 5) 
        AND invoice_status = '2' 
        AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const queryResult = await db.query(query);

    let totalMeasurementAmount = 0; // Initialize total amount
    let allAreaManagerAmounts = {}; // To store area manager details and their corresponding amounts

    for (let row of queryResult) {
        let merged = [];

        if (!row.mpi_status) {
            // Directly parse the measurements if mpi_status is null
            merged = JSON.parse(row.measurements);
        } else {
            const mergedPiIds = row.merged_pi_id?.split(",");
            for (const id of mergedPiIds) {
                const selectQuery = await db.query("SELECT measurements FROM proforma_invoices WHERE id = ?", [
                    id.trim(),
                ]);
                if (selectQuery.length > 0) {
                    merged.push(...JSON.parse(selectQuery[0].measurements));
                }
            }
        }

        const parsedMeasurements = merged.map((measurement) => {
            return typeof measurement === "string" ? JSON.parse(measurement) : measurement;
        });

        const mergedMeasurements = parsedMeasurements.flat();

        // Get the total measurement amount and area manager details
        const { total_measurement_amount, area_manager_amounts } =
            await totalMeasurementAmountForRo(mergedMeasurements);

        // Accumulate the total measurement amount
        totalMeasurementAmount += parseFloat(total_measurement_amount);

        // Merge area manager amounts into the final result
        for (let managerId in area_manager_amounts) {
            if (!allAreaManagerAmounts[managerId]) {
                allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
            } else {
                allAreaManagerAmounts[managerId].measurement_amount +=
                    area_manager_amounts[managerId].measurement_amount;
            }
        }
    }

    return {
        total_measurement_amount: totalMeasurementAmount.toFixed(2),
        ro_amounts: allAreaManagerAmounts,
    };
}

async function totalMeasurementAmountForRo(measurements) {
    try {
        let measurement_amount = 0;
        let areaManagerAmounts = {}; // Initialize areaManagerAmounts here

        for (let measurement of measurements) {
            const query = `SELECT amount, complaint_id, ro_office_id FROM measurements WHERE id = '${measurement.measurement_list}'`;
            const queryResult = await db.query(query);

            // Ensure queryResult has results before proceeding
            if (queryResult.length > 0) {
                const ro_id = queryResult[0].ro_office_id;
                const amount = parseFloat(queryResult[0].amount) || 0;

                // Get and accumulate manager measurement amount
                await getRoMeasurementAmount(ro_id, amount, areaManagerAmounts);

                // Accumulate the total measurement amount
                measurement_amount += amount;
            }
        }

        return {
            total_measurement_amount: measurement_amount.toFixed(2),
            area_manager_amounts: areaManagerAmounts,
        };
    } catch (error) {
        throw error;
    }
}

async function getRoMeasurementAmount(ro_id, amount, areaManagerAmounts) {
    const checkAssign = await getRegionalNameById(ro_id);

    // If there are multiple area managers, choose the top one (first in the list)
    if (checkAssign.length > 0) {
        const topManager = checkAssign[0]; // Assuming the first one is the top

        // Initialize the area manager's total amount if not already
        if (!areaManagerAmounts[topManager.id]) {
            areaManagerAmounts[topManager.id] = {
                manager: topManager,
                measurement_amount: 0,
            };
        }

        // Add the measurement amount to the area manager's total
        areaManagerAmounts[topManager.id].measurement_amount += amount;
    }

    return areaManagerAmounts;
}

async function getRoInvoice(startDate, endDate, condition, createdBy) {
    const invoiceQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, pi_id 
        FROM invoices 
        WHERE created_by = '${createdBy}' AND (status = 2 AND payment_status = '2') 
        AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition}
    `;

    const invoiceResult = await db.query(invoiceQuery);

    let totalMeasurementAmount = 0; // To accumulate total measurement amount
    let allAreaManagerAmounts = {}; // To store area manager details and amounts

    for (let row of invoiceResult) {
        const piIds = row.pi_id.split(",").map((id) => id.trim());

        for (const piId of piIds) {
            // Fetch proforma invoice details
            const piQuery = `SELECT * FROM proforma_invoices WHERE created_by = '${createdBy}' AND id = ?`;
            const piData = await db.query(piQuery, [piId]);

            if (piData.length > 0) {
                const pi = piData[0];
                let measurements = [];

                if (pi.mpi_status == null) {
                    measurements = JSON.parse(pi.measurements);
                } else {
                    const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());
                    for (const id of mergedPiIds) {
                        const selectQuery = await db.query(
                            `SELECT measurements FROM proforma_invoices WHERE created_by = '${createdBy}' AND id = ?`,
                            [id]
                        );
                        if (selectQuery.length > 0) {
                            measurements.push(...JSON.parse(selectQuery[0].measurements));
                        }
                    }
                }

                const parsedMeasurements = measurements.flatMap((measurement) =>
                    typeof measurement === "string" ? JSON.parse(measurement) : measurement
                );

                const mergedMeasurements = parsedMeasurements.flat();

                // Get the total measurement amount and area manager details
                const { total_measurement_amount, area_manager_amounts } =
                    await totalMeasurementAmountForRo(mergedMeasurements);

                // Accumulate the total measurement amount
                totalMeasurementAmount += parseFloat(total_measurement_amount);

                // Merge area manager amounts into the final result
                for (let managerId in area_manager_amounts) {
                    if (!allAreaManagerAmounts[managerId]) {
                        allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
                    } else {
                        allAreaManagerAmounts[managerId].measurement_amount +=
                            area_manager_amounts[managerId].measurement_amount;
                    }
                }
            }
        }
    }

    return { totalMeasurementAmount, allAreaManagerAmounts };
}

async function getRoPayment(startDate, endDate, condition, createdBy) {
    const selectQuery = `SELECT * FROM payment_receive WHERE created_by = '${createdBy}' AND status = 2 AND created_at BETWEEN '${startDate}' AND '${endDate}' 
        ${condition} `;

    const queryResult = await db.query(selectQuery);

    if (queryResult.length === 0) {
        return { status: false, message: "payment not found" };
    }

    let totalMeasurementAmount = 0; // To accumulate total measurement amount
    let allAreaManagerAmounts = {}; // To store area manager details and amounts

    for (const data of queryResult) {
        const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

        for (const row of invoiceQuery) {
            const piIds = row.pi_id.split(",").map((id) => id.trim());

            for (const piId of piIds) {
                // Fetch proforma invoice details
                const piQuery = `SELECT * FROM proforma_invoices WHERE  created_by = '${createdBy}' AND  id = ?`;
                const piData = await db.query(piQuery, [piId]);

                if (piData.length > 0) {
                    const pi = piData[0];
                    let measurements = [];

                    if (pi.mpi_status == null) {
                        measurements = JSON.parse(pi.measurements);
                    } else {
                        const mergedPiIds = pi.merged_pi_id.split(",").map((id) => id.trim());
                        for (const id of mergedPiIds) {
                            const selectQuery = await db.query(
                                `SELECT measurements FROM proforma_invoices WHERE created_by = '${createdBy}' AND id = ?`,
                                [id]
                            );
                            if (selectQuery.length > 0) {
                                measurements.push(...JSON.parse(selectQuery[0].measurements));
                            }
                        }
                    }

                    const parsedMeasurements = measurements.flatMap((measurement) =>
                        typeof measurement === "string" ? JSON.parse(measurement) : measurement
                    );

                    const mergedMeasurements = parsedMeasurements.flat();

                    // Calculate total measurement amount and area manager details
                    const { total_measurement_amount, area_manager_amounts } =
                        await totalMeasurementAmountForRo(mergedMeasurements);

                    // Accumulate the total measurement amount
                    totalMeasurementAmount += parseFloat(total_measurement_amount);

                    // Merge area manager amounts into the final result
                    for (let managerId in area_manager_amounts) {
                        if (!allAreaManagerAmounts[managerId]) {
                            allAreaManagerAmounts[managerId] = area_manager_amounts[managerId];
                        } else {
                            allAreaManagerAmounts[managerId].measurement_amount +=
                                area_manager_amounts[managerId].measurement_amount;
                        }
                    }
                }
            }
        }
    }

    return { totalMeasurementAmount, allAreaManagerAmounts };
}

function consolidateRoData(measurementData, performaData, invoiceData, paymentData) {
    const allAreaManagerAmounts = {};

    // Process measurement data
    if (measurementData && measurementData.ro_office) {
        measurementData.ro_office.forEach((ro) => {
            const id = ro.regional_office_name; // Use the correct key based on the provided output
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: {
                        id: id, // Assuming ID is represented by regional office name for consistency
                        regional_office_name: ro.regional_office_name,
                    },
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].measurements_amounts += ro.measurement_amount || 0;
        });
    }

    // Process performa data
    if (performaData && performaData.ro_amounts) {
        Object.values(performaData.ro_amounts).forEach((am) => {
            const id = am.manager.regional_office_name; // Use the correct key
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].performa_amounts += am.measurement_amount || 0;
        });
    }

    // Process invoice data
    if (invoiceData && invoiceData.allAreaManagerAmounts) {
        Object.values(invoiceData.allAreaManagerAmounts).forEach((am) => {
            const id = am.manager.regional_office_name; // Use the correct key
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].invoices_amounts += am.measurement_amount || 0;
        });
    }

    // Process payment data
    if (paymentData && paymentData.allAreaManagerAmounts) {
        Object.values(paymentData.allAreaManagerAmounts).forEach((am) => {
            const id = am.manager.regional_office_name; // Use the correct key
            if (!allAreaManagerAmounts[id]) {
                allAreaManagerAmounts[id] = {
                    manager: am.manager,
                    measurements_amounts: 0,
                    performa_amounts: 0,
                    invoices_amounts: 0,
                    payment_amounts: 0,
                };
            }
            allAreaManagerAmounts[id].payment_amounts += am.measurement_amount || 0;
        });
    }

    // Convert the object to an array
    const consolidatedData = Object.values(allAreaManagerAmounts);

    consolidatedData.map((item) => {
        item.measurements_amounts = Math.round(item.measurements_amounts * 1e2) / 1e2;
        item.performa_amounts = Math.round(item.performa_amounts * 1e2) / 1e2;
        item.invoices_amounts = Math.round(item.invoices_amounts * 1e2) / 1e2;
        item.payment_amounts = Math.round(item.payment_amounts * 1e2) / 1e2;
        item.total =
            Math.round((item.measurements_amounts + item.performa_amounts + item.invoices_amounts) * 1e2) / 1e2;
    });

    consolidatedData.sort((a, b) => a.total - b.total); //Ascending order

    return consolidatedData;
}

module.exports = {
    getTotalComplaintsCount,
    getTotalComplaints,
    getAreaManagersDashboard,
    getTotalComplaintsCountEachMonth,
    getEndUsersDashboard,
    getMeasurementAmountEachMonth,
    getInvoiceEachMonthAmount,
    getProformaInvoiceEachMonthAmount,
    getAllComplaintsByStatus,
    getBillingDashboard,
    areaManagerDashboardforBilling,
    getFinancialYear,
    roDashboardforBilling,
};

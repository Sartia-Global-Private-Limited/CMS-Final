const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const dashboardRouter = require("express").Router();

const {
    getTotalComplaintsCount,
    getTotalComplaints,
    getTotalComplaintsCountEachMonth,
    getAreaManagers,
    getAreaManagersDashboard,
    getEndUsersDashboard,
    getProformaInvoiceEachMonthAmount,
    getInvoiceEachMonthAmount,
    getMeasurementAmountEachMonth,
    getAllComplaintsByStatus,
    getBillingDashboard,
    areaManagerDashboardforBilling,
    roDashboardforBilling,
} = require("../../controllers/dashboard");

// dashboard

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Dashboard
 *     description: Routes for retrieving various dashboard metrics and statistics.
 *
 * /contractor/get-complaints-count:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get total count of complaints.
 *     description: Retrieve the total number of complaints in the system.
 *     responses:
 *       200:
 *         description: Total number of complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints count fetched successfully.
 *               data:
 *                 count: 150
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-total-complaints:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get all complaints.
 *     description: Retrieve a list of all complaints.
 *     responses:
 *       200:
 *         description: List of all complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   description: "Complaint description"
 *                   status: "Open"
 *                   created_at: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-complaints:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get total number of complaints each month.
 *     description: Retrieve the number of complaints reported each month.
 *     responses:
 *       200:
 *         description: Monthly complaints count.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly complaints count fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   count: 30
 *                 - month: "August 2024"
 *                   count: 25
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-area-managers:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for area managers.
 *     description: Retrieve dashboard information for area managers.
 *     responses:
 *       200:
 *         description: Dashboard data for area managers.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Area managers dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Manager A"
 *                   total_activities: 50
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-end-users-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for end users.
 *     description: Retrieve dashboard information for end users.
 *     responses:
 *       200:
 *         description: Dashboard data for end users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: End users dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "User A"
 *                   total_orders: 120
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-measurement-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly measurement amount.
 *     description: Retrieve the measurement amount recorded each month.
 *     responses:
 *       200:
 *         description: Measurement amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly measurement amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 10000
 *                 - month: "August 2024"
 *                   amount: 12000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-proforma-invoice-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly proforma invoice amount.
 *     description: Retrieve the proforma invoice amount recorded each month.
 *     responses:
 *       200:
 *         description: Proforma invoice amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly proforma invoice amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 15000
 *                 - month: "August 2024"
 *                   amount: 18000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-invoice-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly invoice amount.
 *     description: Retrieve the invoice amount recorded each month.
 *     responses:
 *       200:
 *         description: Invoice amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly invoice amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 20000
 *                 - month: "August 2024"
 *                   amount: 22000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-complaints-by-status:
 *   post:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get all complaints filtered by status.
 *     description: Retrieve all complaints based on their status.
 *     parameters:
 *       - in: body
 *         name: status
 *         description: Status to filter complaints.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "Open"
 *     responses:
 *       200:
 *         description: List of complaints filtered by status.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints filtered by status fetched successfully.
 *               data:
 *                 - id: 1
 *                   description: "Complaint description"
 *                   status: "Open"
 *                   created_at: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-payment-recieve-in-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for received payments.
 *     description: Retrieve dashboard information for received payments.
 *     responses:
 *       200:
 *         description: Dashboard data for received payments.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Payment dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   amount_received: 50000
 *                   date: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-area-manager-billing-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get billing dashboard data for area managers.
 *     description: Retrieve billing dashboard information for area managers.
 *     responses:
 *       200:
 *         description: Billing dashboard data for area managers.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Billing dashboard data for area managers fetched successfully.
 *               data:
 *                 - id: 1
 *                   total_billing: 100000
 *                   date: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dashboardRouter.get(
    "/get-complaints-count",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTotalComplaintsCount
);
dashboardRouter.get(
    "/get-total-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTotalComplaints
);
dashboardRouter.get(
    "/get-monthly-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTotalComplaintsCountEachMonth
);
dashboardRouter.get(
    "/get-area-managers",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAreaManagersDashboard
);
dashboardRouter.get(
    "/get-end-users-dashboard",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEndUsersDashboard
);
dashboardRouter.get(
    "/get-monthly-measurement-amount",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMeasurementAmountEachMonth
);
dashboardRouter.get(
    "/get-monthly-proforma-invoice-amount",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getProformaInvoiceEachMonthAmount
);
dashboardRouter.get(
    "/get-monthly-invoice-amount",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getInvoiceEachMonthAmount
);
dashboardRouter.post(
    "/get-all-complaints-by-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllComplaintsByStatus
);
dashboardRouter.get(
    "/get-all-payment-recieve-in-dashboard",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getBillingDashboard
);
dashboardRouter.get(
    "/get-area-manager-billing-dashboard",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    areaManagerDashboardforBilling
);

/**
 * @swagger
 * tags:
 *   name: Contractor - RO Billing Dashboard
 *   description: API routes for retrieving billing dashboard information for Regional Offices (RO).
 */

/**
 * @swagger
 * /contractor/get-ro-billing-dashboard:
 *   get:
 *     tags: [Contractor - RO Billing Dashboard]
 *     summary: Get RO Billing Dashboard
 *     description: Retrieve billing dashboard information for Regional Offices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RO billing dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               dashboard:
 *                 total_billed: 150000
 *                 total_paid: 100000
 *                 outstanding_amount: 50000
 *                 invoices:
 *                   - invoice_id: 101
 *                     amount: 50000
 *                     due_date: 2024-08-31
 *                   - invoice_id: 102
 *                     amount: 50000
 *                     due_date: 2024-09-15
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

dashboardRouter.get(
    "/get-ro-billing-dashboard",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    roDashboardforBilling
);

module.exports = dashboardRouter;

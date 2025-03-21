const {
    assignSiteInspectionComplaintModule,
    getSiteInspectionAssignComplaintModuleOnUserId,
    assignMultipleSiteInspectionComplaintModule,
} = require("../../controllers/assignSiteInspectionComplaintModuleController");
const {
    getRegionalOfficeExpenseById,
    getSalesAreaOfficeById,
    getOutletOfficeById,
    getAllApprovedData,
} = require("../../controllers/officeInspectionController");
const {
    getAllSiteInspectionPartial,
    getAllSiteInspection,
    verifiedUsedItems,
    verifiedExpensesFromSite,
    getAllVerifiedSiteExpenseList,
    assignComplaints,
    getAllVerifiedComplaintItems,
    getAllSiteInspectionApprovedById,
    getAllSiteInspectionPartialById,
    getAllSiteInspectionById,
    getAllSiteInspectionApproved,
    approveSiteInspections,
    assignComplaintsForFundSite,
    approveSiteInspectionsForFund,
    getAllOutletsWithComplaintsSiteForFunds,
    getOutletsWithComplaintsSiteForFundsById,
    getAllPendingOutletsWithComplaintsSiteForFunds,
    getAllApprovedOutletsWithComplaintsSiteForFunds,
    getPartialOutletsSiteForFundsById,
    getApprovedOutletsSiteForFundsById,
} = require("../../controllers/siteInspectionController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const siteInspectionRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection
 *   description: API endpoints for managing site inspection processes.
 */

/**
 * @swagger
 * /contractor/site-inspection/verified-used-items-on-site-inspector/{id}:
 *   post:
 *     summary: Verify used items on site by inspector.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the inspector verifying the used items.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of items to verify.
 *     responses:
 *       200:
 *         description: Items verified successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/verified-complaint-expense/{id}:
 *   post:
 *     summary: Verify complaint expense on site by inspector.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the expense to verify.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseDetails:
 *                 type: string
 *                 description: Details of the expense being verified.
 *     responses:
 *       200:
 *         description: Expense verified successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/verified-complaint-expense-list:
 *   get:
 *     summary: Retrieve all verified complaint expense lists.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verified complaint expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/assign-approved-site-inspection-stocks:
 *   post:
 *     summary: Assign approved stocks for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of approved stocks to assign for site inspection.
 *     responses:
 *       200:
 *         description: Stocks assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-assigned-site-inspection-stocks/{id}:
 *   get:
 *     summary: Get assigned stocks for site inspection by user ID.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to retrieve assigned stocks for site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned stocks retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/assign-multiple-inspection-stocks:
 *   post:
 *     summary: Assign multiple stocks for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of stocks to assign for multiple site inspections.
 *     responses:
 *       200:
 *         description: Multiple stocks assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/assign-complaints-in-site-inspection:
 *   post:
 *     summary: Assign complaints for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of complaint IDs to assign for site inspection.
 *     responses:
 *       200:
 *         description: Complaints assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-all-site-inspections:
 *   get:
 *     summary: Retrieve all site inspections.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Site Stock
 *   description: API endpoints for managing site inspections related to site stock.
 */

/**
 * @swagger
 * /contractor/site-inspection/approved-site-inspections:
 *   post:
 *     summary: Approve site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectionDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of site inspection details to approve.
 *     responses:
 *       200:
 *         description: Site inspections approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-partial-site-inspections:
 *   get:
 *     summary: Retrieve all partially completed site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-approved-site-inspections:
 *   get:
 *     summary: Retrieve all approved site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-site-inspections-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-site-inspections-partial-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve partially completed site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-site-inspections-approved-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve approved site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-office-outlet:
 *   get:
 *     summary: Retrieve office outlet details.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office outlet details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-office-sales-area:
 *   get:
 *     summary: Retrieve office sales area details.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office sales area details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-office-regional-list:
 *   get:
 *     summary: Retrieve office regional expense list.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office regional expense list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

siteInspectionRouter.post(
    "/verified-used-items-on-site-inspector/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    verifiedUsedItems
);

siteInspectionRouter.get(
    "/get-all-verified-complaint-items",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllVerifiedComplaintItems
);

siteInspectionRouter.post(
    "/verified-complaint-expense/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    verifiedExpensesFromSite
);

siteInspectionRouter.get(
    "/verified-complaint-expense-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllVerifiedSiteExpenseList
);

siteInspectionRouter.post(
    "/assign-approved-site-inspection-stocks",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    assignSiteInspectionComplaintModule
);

siteInspectionRouter.get(
    "/get-assigned-site-inspection-stocks/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getSiteInspectionAssignComplaintModuleOnUserId
);

siteInspectionRouter.post(
    "/assign-multiple-inspection-stocks",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    assignMultipleSiteInspectionComplaintModule
);

siteInspectionRouter.post(
    "/assign-complaints-in-site-inspection",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    assignComplaints
);

siteInspectionRouter.get(
    "/get-all-site-inspections",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspection
);

siteInspectionRouter.put(
    "/approved-site-inspections",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveSiteInspections
);
siteInspectionRouter.get(
    "/get-partial-site-inspections",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspectionPartial
);
siteInspectionRouter.get(
    "/get-approved-site-inspections",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspectionApproved
);
siteInspectionRouter.get(
    "/get-site-inspections-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspectionById
);
siteInspectionRouter.get(
    "/get-site-inspections-partial-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspectionPartialById
);
siteInspectionRouter.get(
    "/get-site-inspections-approved-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllSiteInspectionApprovedById
);
siteInspectionRouter.get(
    "/get-office-outlet",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getOutletOfficeById
);

//========================site fund inspection========================//

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Funds
 *   description: API endpoints for managing site inspections related to funds.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-pending-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all pending site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-pending-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve pending site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-partial-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all partially completed site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-approved-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all approved site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-partial-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve partially completed site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-approved-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve approved site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

siteInspectionRouter.get(
    "/get-pending-site-complaints-for-funds",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsSiteForFunds
);
siteInspectionRouter.get(
    "/get-pending-site-complaints-for-funds-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getOutletsWithComplaintsSiteForFundsById
);
siteInspectionRouter.get(
    "/get-partial-site-complaints-for-funds",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllPendingOutletsWithComplaintsSiteForFunds
);
siteInspectionRouter.get(
    "/get-approved-site-complaints-for-funds",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApprovedOutletsWithComplaintsSiteForFunds
);
siteInspectionRouter.get(
    "/get-partial-site-complaints-for-funds-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getPartialOutletsSiteForFundsById
);
siteInspectionRouter.get(
    "/get-approved-site-complaints-for-funds-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getApprovedOutletsSiteForFundsById
);

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Site Fund
 *   description: API endpoints for managing site inspections related to site funds.
 */

/**
 * @swagger
 * /contractor/site-inspection/approve-site-inspection-for-fund:
 *   post:
 *     summary: Approve a site inspection for fund.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspection for fund approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/get-all-approved-data/{complaintId}:
 *   get:
 *     summary: Retrieve all approved data related to a specific complaint ID.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     parameters:
 *       - name: complaintId
 *         in: path
 *         required: true
 *         description: ID of the complaint.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved data retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/site-inspection/assign-complaints-in-fund-site-inspection:
 *   post:
 *     summary: Assign complaints in a fund site inspection.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaints assigned in fund site inspection successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

siteInspectionRouter.post(
    "/approve-site-inspection-for-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveSiteInspectionsForFund
);
siteInspectionRouter.get(
    "/get-all-approved-data/:complaintId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApprovedData
);
siteInspectionRouter.put(
    "/assign-complaints-in-fund-site-inspection",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    assignComplaintsForFundSite
);

module.exports = siteInspectionRouter;

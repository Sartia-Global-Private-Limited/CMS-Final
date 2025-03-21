const {
    getAllOutletsWithComplaintsApproved,
    getAllOutletsWithComplaintsPartial,
    getAllOutletsWithComplaints,
    getAllOutletsWithComplaintsForFunds,
    getAllOutletsWithComplaintsPartialForFunds,
    getAllOutletsWithComplaintsApprovedForFund,
    getAllOutletsWithComplaintsById,
    approveOfficeInspections,
    getAllOutletsWithComplaintsByPartialId,
    getAllOutletsWithComplaintsByApprovedId,
    approveOfficeInspectionsForFund,
    getAllOutletsWithComplaintsForFundsById,
    getAllOutletsWithComplaintsForFundByApprovedId,
    getAllOutletsWithComplaintsForFundByPartialId,
    getOutletOfficeByIdForFund,
    getSalesAreaOfficeByIdForFund,
    getRegionalOfficeExpenseByIdForFund,
} = require("../../controllers/officeInspectionController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const officeInspectionRouter = require("express").Router();

/**
 * @swagger
 * /contractor/office-inspection/stock-office-expense-approved-by-office:
 *   get:
 *     summary: Retrieve all approved office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-office-approved-by-id/:id/:month:
 *   get:
 *     summary: Retrieve specific approved office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: specific approved office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/stock-office-expense-partial-by-office:
 *   get:
 *     summary: Retrieve all partial office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all partial office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-stock-office-partial-by-id/:id/:month:
 *   get:
 *     summary: Retrieve specific partial office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get partial office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-all-outlet-with-complaints:
 *   get:
 *     summary: Retrieve a list of all outlets with associated complaints.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-all-outlet-with-complaints-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve a list of all outlets with complaints for a specific ID and month.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the list of outlets.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month to filter the list of complaints.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints for the specified ID and month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/stock-punch-approve-by-office:
 *   post:
 *     summary: Approve stock punch by office.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvalData:
 *                 type: object
 *                 description: Data for approving the stock punch.
 *     responses:
 *       200:
 *         description: Stock punch approved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

officeInspectionRouter.post(
    "/stock-punch-approve-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveOfficeInspections
);

officeInspectionRouter.get(
    "/stock-office-expense-approved-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsApproved
);

officeInspectionRouter.get(
    "/get-office-approved-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsByApprovedId
);

officeInspectionRouter.get(
    "/stock-office-expense-partial-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsPartial
);

officeInspectionRouter.get(
    "/get-stock-office-partial-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsByPartialId
);

officeInspectionRouter.get(
    "/get-all-outlet-with-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaints
);

officeInspectionRouter.get(
    "/get-all-outlet-with-complaints-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsById
);

//======================== fund office expense ===========================//

/**
 * @swagger
 * /contractor/office-inspection/fund-punch-approve-by-office:
 *   post:
 *     summary: Approve office inspections related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspections:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of inspections to approve.
 *     responses:
 *       200:
 *         description: Office inspections approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-all-outlet-with-complaints-funds:
 *   get:
 *     summary: Retrieve a list of all outlets with complaints related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-all-outlet-with-complaints-funds-by-id/:id/:month:
 *   get:
 *     summary: Retrieve a specific outlets with complaints related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: specific outlets with complaints related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/fund-office-expense-partial-by-office:
 *   get:
 *     summary: Retrieve a list of partial office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of partial office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-fund-office-partial-by-id/:id/:month:
 *   get:
 *     summary: Retrieve a specific of partial office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: specific partial office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/fund-office-expense-approved-by-office:
 *   get:
 *     summary: Retrieve a list of approved office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-office-approved_fund-by-id/:id/:month:
 *   get:
 *     summary: Retrieve a specific of approved office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Specific approved office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-outlet-office-by-id-for-fund/:
 *   get:
 *     summary: Retrieve outlet office details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlet office details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-sales-area-office-by-id-for-fund:
 *   get:
 *     summary: Retrieve sales area office details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales area office details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/office-inspection/get-regional-office-expense-by-id-for-fund:
 *   get:
 *     summary: Retrieve regional office expense details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regional office expense details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

officeInspectionRouter.post(
    "/fund-punch-approve-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveOfficeInspectionsForFund
);

officeInspectionRouter.get(
    "/get-all-outlet-with-complaints-funds",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsForFunds
);

officeInspectionRouter.get(
    "/get-all-outlet-with-complaints-funds-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsForFundsById
);
officeInspectionRouter.get(
    "/fund-office-expense-partial-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsPartialForFunds
);

officeInspectionRouter.get(
    "/get-fund-office-partial-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsForFundByPartialId
);

officeInspectionRouter.get(
    "/fund-office-expense-approved-by-office",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsApprovedForFund
);

officeInspectionRouter.get(
    "/get-office-approved_fund-by-id/:id/:month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOutletsWithComplaintsForFundByApprovedId
);

officeInspectionRouter.get(
    "/get-outlet-office-by-id-for-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getOutletOfficeByIdForFund
);

officeInspectionRouter.get(
    "/get-sales-area-office-by-id-for-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getSalesAreaOfficeByIdForFund
);

officeInspectionRouter.get(
    "/get-regional-office-expense-by-id-for-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getRegionalOfficeExpenseByIdForFund
);

module.exports = officeInspectionRouter;

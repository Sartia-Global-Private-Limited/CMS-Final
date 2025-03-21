const {
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
} = require("../../controllers/earthingTestingController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const earthingTestingRouter = require("express").Router();

//-------------------Earthing testing routes----------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Earthing Testing
 *   description: API endpoints for managing earthing testing reports and related data.
 */

/**
 * @swagger
 * /contractor/get-all-complaint-list:
 *   get:
 *     summary: Retrieve a list of all complaints.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaint-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific complaint.
 *     tags: [Contractor Routes - Earthing Testing]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the complaint.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the complaint retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-outlet-list:
 *   get:
 *     summary: Retrieve a list of all outlets.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-end-user-details:
 *   get:
 *     summary: Retrieve a list of free end users.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of free end users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-earthing-testing-report:
 *   post:
 *     summary: Add a new earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportData:
 *                 type: string
 *                 description: Data for the earthing testing report.
 *     responses:
 *       201:
 *         description: Earthing testing report created successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-earthing-testing-lists:
 *   get:
 *     summary: Retrieve a list of all earthing testing reports.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all earthing testing reports retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-earthing-testing-detail/{id}:
 *   get:
 *     summary: Retrieve details of a specific earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the earthing testing report.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the earthing testing report retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-earthing-testing-detail:
 *   post:
 *     summary: Update an existing earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportData:
 *                 type: string
 *                 description: Updated data for the earthing testing report.
 *     responses:
 *       200:
 *         description: Earthing testing report updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-earthing-testing-status:
 *   post:
 *     summary: Change the status of an earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportId:
 *                 type: string
 *                 description: ID of the earthing testing report.
 *               status:
 *                 type: string
 *                 description: New status for the earthing testing report.
 *     responses:
 *       200:
 *         description: Status of the earthing testing report changed successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-earthing-testing-by-status:
 *   put:
 *     summary: Approve or reject an earthing testing report based on its status.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportId:
 *                 type: string
 *                 description: ID of the earthing testing report.
 *               status:
 *                 type: string
 *                 description: Status to set for the earthing testing report.
 *     responses:
 *       200:
 *         description: Earthing testing report status updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
earthingTestingRouter.get(
    "/get-all-complaint-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getAllComplaintList
);
earthingTestingRouter.get(
    "/get-complaint-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getComplaintDetailById
);
earthingTestingRouter.get(
    "/get-outlet-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getOutletDetails
);
earthingTestingRouter.get(
    "/get-end-user-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getFreeEndUsers
);
earthingTestingRouter.post(
    "/add-earthing-testing-report",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createEarthingTesting
);
earthingTestingRouter.get(
    "/get-earthing-testing-lists",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllEarthingTestingLists
);
earthingTestingRouter.get(
    "/get-earthing-testing-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEarthingTestingDetailById
);
earthingTestingRouter.post(
    "/update-earthing-testing-detail",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEarthingTesting
);
earthingTestingRouter.post(
    "/change-earthing-testing-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    changeEarthingTestingStatus
);
earthingTestingRouter.put(
    "/approve-reject-earthing-testing-by-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveRejectEarthingTestingsByStatus
);
earthingTestingRouter.post(
    "/assign-earthing-testing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    assignToEarthingTesting
);
earthingTestingRouter.post(
    "/earth-pit-reports",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    earthPitReport
);
module.exports = earthingTestingRouter;

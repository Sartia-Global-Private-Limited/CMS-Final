const {
    getAllLeaveApplications,
    updateLeaveApplication,
    applyLeave,
} = require("../../controllers/leaveApplicationController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const hrLeaveRouter = require("express").Router();

/**
 * @swagger
 * /contractor/all-apply-leave:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all leave applications
 *     description: Get a list of all leave applications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave applications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - leaveId: 1
 *                   userId: 1
 *                   leaveType: "Sick Leave"
 *                   leaveStatus: "Approved"
 *                 - leaveId: 2
 *                   userId: 2
 *                   leaveType: "Casual Leave"
 *                   leaveStatus: "Pending"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/leave-application-status-update:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Update leave application status
 *     description: Update the status of a leave application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Leave application status update details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: integer
 *                 description: The ID of the leave application.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the leave application.
 *                 example: "Approved"
 *               comments:
 *                 type: string
 *                 description: Optional comments on the status update.
 *                 example: "Leave approved for medical reasons."
 *     responses:
 *       200:
 *         description: Leave application status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/apply-leave:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Apply for leave
 *     description: Submit a leave application for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Leave application details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeId:
 *                 type: integer
 *                 description: The ID of the leave type being applied for.
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the leave.
 *                 example: "2024-08-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the leave.
 *                 example: "2024-08-22"
 *               reason:
 *                 type: string
 *                 description: The reason for the leave application.
 *                 example: "Flu and need to rest."
 *     responses:
 *       200:
 *         description: Leave application submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application submitted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
hrLeaveRouter.get(
    "/all-apply-leave",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllLeaveApplications
);
hrLeaveRouter.get(
    "/all-apply-leave/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllLeaveApplications
);
hrLeaveRouter.post(
    "/leave-application-status-update",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateLeaveApplication
);
hrLeaveRouter.post(
    "/apply-leave",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    applyLeave
);

module.exports = hrLeaveRouter;

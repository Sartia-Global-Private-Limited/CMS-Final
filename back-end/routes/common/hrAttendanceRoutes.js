const {
    checkTodayMarkBreakAndAttendance,
    checkTotalUsersTimeSheet,
    timeSheet,
    getAllUserTimeSheetInCalendarView,
    markAttendance,
    markAttendanceInBulk,
    createManuallyClockInClockOut,
    getAllUsersTodayClockIn,
    getAllUsersTodayClockOut,
    markUserClockInClockOutBySuperAdmin,
} = require("../../controllers/attendanceController");
const { getAdminUserById } = require("../../controllers/superAdminController");
const { getUserById } = require("../../controllers/userController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const attendanceRouter = require("express").Router();

/**
 * @swagger
 * /contractor/get-today-mark-login-and-break:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get today's login and break records
 *     description: Retrieve today's login, break, and attendance records for the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's login and break records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 clockIn: "08:00"
 *                 clockOut: "17:00"
 *                 breakStart: "12:00"
 *                 breakEnd: "12:30"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-time-sheet:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get time sheets for all users
 *     description: Retrieve time sheets for all users in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user time sheets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "08:00"
 *                       clockOut: "17:00"
 *                       breakStart: "12:00"
 *                       breakEnd: "12:30"
 *                 - userId: 2
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "09:00"
 *                       clockOut: "18:00"
 *                       breakStart: "13:00"
 *                       breakEnd: "13:30"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-time-sheet/{id}:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get user time sheet by ID
 *     description: Retrieve the time sheet for a specific user identified by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User time sheet retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 timeSheet:
 *                   - date: "2024-08-16"
 *                     clockIn: "08:00"
 *                     clockOut: "17:00"
 *                     breakStart: "12:00"
 *                     breakEnd: "12:30"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-users-attendance-in-calendar-view:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' attendance in calendar view
 *     description: Retrieve attendance records for all users in a calendar view.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   attendance:
 *                     - date: "2024-08-16"
 *                       clockIn: "08:00"
 *                       clockOut: "17:00"
 *                 - userId: 2
 *                   attendance:
 *                     - date: "2024-08-16"
 *                       clockIn: "09:00"
 *                       clockOut: "18:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-manual-attendance:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance manually
 *     description: Manually mark attendance for users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Attendance details to mark manually.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               clockIn:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-in time.
 *                 example: "2024-08-16T08:00:00Z"
 *               clockOut:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-out time.
 *                 example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-attendance-in-bulk:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance in bulk
 *     description: Mark attendance for multiple users in bulk.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Bulk attendance details for users.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user.
 *                   example: 1
 *                 clockIn:
 *                   type: string
 *                   format: date-time
 *                   description: Clock-in time.
 *                   example: "2024-08-16T08:00:00Z"
 *                 clockOut:
 *                   type: string
 *                   format: date-time
 *                   description: Clock-out time.
 *                   example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Bulk attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Bulk attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-manually-attendance-for-user:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance manually for a user
 *     description: Manually mark clock-in and clock-out times for a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Manual attendance details for a specific user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               clockIn:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-in time.
 *                 example: "2024-08-16T08:00:00Z"
 *               clockOut:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-out time.
 *                 example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Manual attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Manual attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-today-clock-in:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' today clock-in records
 *     description: Retrieve today's clock-in records for all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's clock-in records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   clockIn: "08:00"
 *                 - userId: 2
 *                   clockIn: "09:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-today-clock-out:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' today clock-out records
 *     description: Retrieve today's clock-out records for all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's clock-out records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   clockOut: "17:00"
 *                 - userId: 2
 *                   clockOut: "18:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-user-attendance-status-by-super-admin:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Change user attendance status by super admin
 *     description: Super admin can change the attendance status of users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details to update user attendance status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new attendance status (e.g., 'clockIn', 'clockOut').
 *                 example: "clockIn"
 *     responses:
 *       200:
 *         description: User attendance status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User attendance status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

attendanceRouter.get(
    "/get-today-mark-login-and-break",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    checkTodayMarkBreakAndAttendance
);
attendanceRouter.get(
    "/get-all-user-time-sheet",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    checkTotalUsersTimeSheet
);
attendanceRouter.get(
    "/get-user-time-sheet/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    timeSheet
);
attendanceRouter.get(
    "/get-all-users-attendance-in-calendar-view",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllUserTimeSheetInCalendarView
);
attendanceRouter.put(
    "/mark-manual-attendance",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    markAttendance
);
attendanceRouter.post(
    "/mark-attendance-in-bulk",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    markAttendanceInBulk
);
attendanceRouter.put(
    "/mark-manually-attendance-for-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createManuallyClockInClockOut
);

attendanceRouter.get(
    "/get-all-user-today-clock-in",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllUsersTodayClockIn
);
attendanceRouter.get(
    "/get-all-user-today-clock-out",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllUsersTodayClockOut
);
attendanceRouter.post(
    "/change-user-attendance-status-by-super-admin",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    markUserClockInClockOutBySuperAdmin
);
attendanceRouter.get(
    "/get-admin-user-by-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAdminUserById
);
attendanceRouter.get(
    "/get-user-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getUserById
);
module.exports = attendanceRouter;

const {
    updateSingleEmployeeDetailByIdForAdmins,
    createAdmin,
    changeAdminUserStatus,
} = require("../../controllers/adminController");
const {
    getAllStoredEmployeeDetails,
    updateEmployeeDetails,
    deleteEmployee,
    getEmployeeTaskById,
    getSingleEmployeeDetailById,
} = require("../../controllers/employeeController");
const { getMemberListWithoutTeam } = require("../../controllers/hrTeamController");
const {
    getSingleEmployeeDetailByIdForSuperAdmin,
    getAllStoredEmployeeDetailsForSuperAdmin,
    deleteSuperAdminEmployees,
} = require("../../controllers/superAdminController");
const { createUsers, updateUsers, importEmployee, changeUserStatus } = require("../../controllers/userController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const hrEmployeesRouter = require("express").Router();

/**
 * @swagger
 * /contractor/create-user:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Create a new user
 *     description: Add a new user to the contractor's system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User details for creating a new user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 description: The role assigned to the new user.
 *                 example: Employee
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing user data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-user:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update user details
 *     description: Update details for an existing user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated user details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to update.
 *                 example: 1
 *               username:
 *                 type: string
 *                 description: The updated username.
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 description: The updated email address.
 *                 example: john.doe_updated@example.com
 *               role:
 *                 type: string
 *                 description: The updated role of the user.
 *                 example: Manager
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing user data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-employees:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get all employees
 *     description: Retrieve a list of all employees stored in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   username: john_doe
 *                   email: john.doe@example.com
 *                   role: Employee
 *                 - id: 2
 *                   username: jane_doe
 *                   email: jane.doe@example.com
 *                   role: Manager
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-employee-detail/{id}:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get details of a single employee by ID
 *     description: Retrieve details for a specific employee identified by ID.
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
 *         description: Employee details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 username: john_doe
 *                 email: john.doe@example.com
 *                 role: Employee
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-single-employee-detail:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update details of a single employee
 *     description: Update details for a specific employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated employee details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee to update.
 *                 example: 1
 *               username:
 *                 type: string
 *                 description: The updated username.
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 description: The updated email address.
 *                 example: john.doe_updated@example.com
 *               role:
 *                 type: string
 *                 description: The updated role of the employee.
 *                 example: Manager
 *     responses:
 *       200:
 *         description: Employee details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-employee/{id}:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Delete an employee
 *     description: Remove an employee from the system by ID.
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
 *         description: Employee deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-employee-assign-tasks:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get assigned tasks for employees
 *     description: Retrieve a list of tasks assigned to employees.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned tasks retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - taskId: 1
 *                   employeeId: 1
 *                   taskName: Task A
 *                   status: In Progress
 *                 - taskId: 2
 *                   employeeId: 2
 *                   taskName: Task B
 *                   status: Completed
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-user-status:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update user status
 *     description: Change the status of a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for updating the user status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user whose status is to be updated.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the user.
 *                 example: active
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
hrEmployeesRouter.post(
    "/create-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createUsers
);
hrEmployeesRouter.put(
    "/update-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateUsers
);
hrEmployeesRouter.get(
    "/get-all-employees",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllStoredEmployeeDetails
);
hrEmployeesRouter.get(
    "/get-single-employee-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSingleEmployeeDetailById
);

hrEmployeesRouter.post(
    "/update-single-employee-detail",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEmployeeDetails
);
hrEmployeesRouter.delete(
    "/delete-employee/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteEmployee
);
hrEmployeesRouter.get(
    "/get-employee-assign-tasks",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEmployeeTaskById
);

hrEmployeesRouter.post(
    "/update-user-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    changeUserStatus
);

hrEmployeesRouter.get(
    "/get-users-list-without-team",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMemberListWithoutTeam
);

hrEmployeesRouter.post(
    "/import-employees",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    importEmployee
);

// SUPER-ADMIN ROUTES
hrEmployeesRouter.get(
    "/get-all-admin-employees",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllStoredEmployeeDetailsForSuperAdmin
);
hrEmployeesRouter.get(
    "/get-single-admin-employee-detail/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSingleEmployeeDetailByIdForSuperAdmin
);
hrEmployeesRouter.put(
    "/update-admin-user",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSingleEmployeeDetailByIdForAdmins
);
hrEmployeesRouter.post(
    "/create-admin-user",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createAdmin
);
hrEmployeesRouter.delete(
    "/delete-admin-employee/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteSuperAdminEmployees
);
hrEmployeesRouter.post(
    "/update-admin-user-status",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    changeAdminUserStatus
);

module.exports = hrEmployeesRouter;

const {
    createHrTeam,
    getAllHrTeamWithMember,
    getHrTeamDetailsById,
    updateHrTeamDetails,
    deleteHrTeam,
    addNewMemberInTeam,
    removeSpecificUserFromTeam,
    getMemberListWithoutTeam,
} = require("../../controllers/hrTeamController");
const {
    createTeam,
    getAllTeams,
    getTeamDetailsById,
    updateTeamDetails,
    deleteTeam,
    getAdminMemberListWithoutTeam,
    removeSpecificAdminUserFromTeam,
    addNewAdminMemberInTeam,
} = require("../../controllers/teamController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const hrTeamRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   - name: Contractor - HR Team Management
 *     description: Operations related to managing HR teams for contractors.
 *   - name: Contractor - HR Management
 *     description: Operations related to managing HR tasks, time sheets, and user attendance for contractors.
 */

/**
 * @swagger
 * /contractor/create-hr-team:
 *   post:
 *     tags: [Contractor - HR Team Management]
 *     summary: Create a new HR team
 *     description: Add a new HR team to the contractor's system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: HR team details for creation.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *                 description: The name of the HR team.
 *                 example: HR Team A
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: List of member IDs to be added to the HR team.
 *                   example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: HR team created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing HR team data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-hr-teams:
 *   get:
 *     tags: [Contractor - HR Team Management]
 *     summary: Get all HR teams
 *     description: Retrieve a list of all HR teams in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all HR teams retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - teamId: 1
 *                   teamName: HR Team A
 *                   members: [1, 2, 3]
 *                 - teamId: 2
 *                   teamName: HR Team B
 *                   members: [4, 5]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-hr-team-detail/{id}:
 *   get:
 *     tags: [Contractor - HR Team Management]
 *     summary: Get details of a single HR team by ID
 *     description: Retrieve details of a specific HR team identified by ID.
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
 *         description: HR team details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 teamId: 1
 *                 teamName: HR Team A
 *                 members: [1, 2, 3]
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-hr-team-details:
 *   post:
 *     tags: [Contractor - HR Team Management]
 *     summary: Update HR team details
 *     description: Update details for a specific HR team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated HR team details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *                 description: The ID of the HR team to update.
 *                 example: 1
 *               teamName:
 *                 type: string
 *                 description: The updated name of the HR team.
 *                 example: HR Team A Updated
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: List of updated member IDs.
 *                   example: [1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: HR team updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-hr-team/{team_id}:
 *   delete:
 *     tags: [Contractor - HR Team Management]
 *     summary: Delete an HR team
 *     description: Remove an HR team from the system by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HR team deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-specific-user-to-team:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Add a specific user to a team
 *     description: Add a specific user to a team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User and team details for adding user to team.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be added.
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 description: The ID of the team to which the user will be added.
 *                 example: 2
 *     responses:
 *       200:
 *         description: User added to team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User added to team successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/remove-specific-user-from-team:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Remove a specific user from a team
 *     description: Remove a specific user from a team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User and team details for removing user from team.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be removed.
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 description: The ID of the team from which the user will be removed.
 *                 example: 2
 *     responses:
 *       200:
 *         description: User removed from team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User removed from team successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

hrTeamRouter.post(
    "/create-hr-team",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createHrTeam
);
hrTeamRouter.get(
    "/get-all-hr-teams",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllHrTeamWithMember
);
hrTeamRouter.get(
    "/get-single-hr-team-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getHrTeamDetailsById
);
hrTeamRouter.put(
    "/update-hr-team-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateHrTeamDetails
);
hrTeamRouter.delete(
    "/delete-hr-team/:team_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteHrTeam
);
hrTeamRouter.put(
    "/add-specific-user-to-team",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addNewMemberInTeam
);
hrTeamRouter.put(
    "/remove-specific-user-from-team",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeSpecificUserFromTeam
);

// SUPER-ADMIN Routes
hrTeamRouter.get(
    "/get-all-admin-hr-teams",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    getAllHrTeamWithMember
);
hrTeamRouter.post("/create-admin-team", verifyToken(process.env.SUPER_ADMIN_ROLE_ID), checkPermission, createTeam);
hrTeamRouter.get("/get-all-teams", verifyToken(process.env.SUPER_ADMIN_ROLE_ID), checkPermission, getAllTeams);
hrTeamRouter.get(
    "/get-team-details-by-id/:id",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    getTeamDetailsById
);
hrTeamRouter.put(
    "/update-team-details",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    updateTeamDetails
);
hrTeamRouter.delete("/delete-team/:id", verifyToken(process.env.SUPER_ADMIN_ROLE_ID), checkPermission, deleteTeam);
hrTeamRouter.get(
    "/get-admin-users-list-without-team",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    getAdminMemberListWithoutTeam
);
hrTeamRouter.get(
    "/get-users-list-without-team",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMemberListWithoutTeam
);
hrTeamRouter.put(
    "/remove-specific-admin-user-from-team",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    removeSpecificAdminUserFromTeam
);
hrTeamRouter.put(
    "/add-specific-admin-user-to-team",
    verifyToken(process.env.SUPER_ADMIN_ROLE_ID),
    checkPermission,
    addNewAdminMemberInTeam
);
module.exports = hrTeamRouter;

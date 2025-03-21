const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const oilGasCompanyTeamRouter = require("express").Router();
const {
    createEnergyTeam,
    updateEnergyTeam,
    getEnergyTeamDetailsById,
    deleteEnergyTeam,
    getEnergyCompanySubSidiaries,
    getZonesForEnergyCompanyUsers,
    getRegionalAreaForEnergyCompanyUsers,
    getSalesAreaForEnergyCompanyUsers,
    getDistrictForEnergyCompanyUsers,
} = require("../../controllers/energyCompanyController");

//  energy company teams

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Energy Company Teams
 *     description: Routes for managing energy company team members.
 *
 * /contractor/create-energy-company-user:
 *   post:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Create a new energy company team user.
 *     description: Add a new user to the energy company team.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               role:
 *                 type: string
 *                 description: Role of the user in the team.
 *               energyCompanyId:
 *                 type: integer
 *                 description: ID of the energy company.
 *             required:
 *               - name
 *               - email
 *               - role
 *               - energyCompanyId
 *     responses:
 *       201:
 *         description: Energy company user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user created successfully.
 *               data:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 role: "Manager"
 *                 energyCompanyId: 123
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/update-energy-company-user:
 *   post:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Update an energy company team user.
 *     description: Modify the details of an existing energy company team user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user to update.
 *               name:
 *                 type: string
 *                 description: Updated name of the user.
 *               email:
 *                 type: string
 *                 description: Updated email of the user.
 *               role:
 *                 type: string
 *                 description: Updated role of the user.
 *               energyCompanyId:
 *                 type: integer
 *                 description: Updated energy company ID.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Energy company user updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/oil-and-gas/get-energy-company-users:
 *   get:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Get details of all energy company team users.
 *     description: Retrieve a list of all users in the energy company team.
 *     responses:
 *       200:
 *         description: List of energy company team users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   role: "Manager"
 *                   energyCompanyId: 123
 *                 - id: 2
 *                   name: "Jane Smith"
 *                   email: "jane.smith@example.com"
 *                   role: "Engineer"
 *                   energyCompanyId: 123
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-energy-company-user/{id}:
 *   delete:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Delete an energy company team user.
 *     description: Remove a user from the energy company team by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Energy company user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-area-data-for-energy/{energy_company_id}/{type}:
 *   get:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Get area data for an energy company.
 *     description: Retrieve area-specific data related to an energy company.
 *     parameters:
 *       - in: path
 *         name: energy_company_id
 *         required: true
 *         description: ID of the energy company.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         description: Company type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area data for the energy company.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Area data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Region A"
 *                   type: "Subsidiary"
 *                   energyCompanyId: 123
 *                 - id: 2
 *                   name: "Region B"
 *                   type: "Subsidiary"
 *                   energyCompanyId: 123
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
oilGasCompanyTeamRouter.post(
    "/create-energy-company-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createEnergyTeam
);
oilGasCompanyTeamRouter.post(
    "/update-energy-company-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEnergyTeam
);
oilGasCompanyTeamRouter.get(
    "/get-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEnergyTeamDetailsById
);
oilGasCompanyTeamRouter.get(
    "/get-zones-of-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getZonesForEnergyCompanyUsers
);
oilGasCompanyTeamRouter.get(
    "/get-regional-office-of-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRegionalAreaForEnergyCompanyUsers
);
oilGasCompanyTeamRouter.get(
    "/get-sales-area-of-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSalesAreaForEnergyCompanyUsers
);
oilGasCompanyTeamRouter.get(
    "/get-district-of-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getDistrictForEnergyCompanyUsers
);
oilGasCompanyTeamRouter.delete(
    "/delete-energy-company-user/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteEnergyTeam
);
oilGasCompanyTeamRouter.get(
    "/get-area-data-for-energy/:energy_company_id/:type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEnergyCompanySubSidiaries
);


module.exports = oilGasCompanyTeamRouter;

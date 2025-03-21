const {
    getAllCreatedEnergyCompanyWithSoftDelete,
    getEnergyCompanyDetailsById,
    updateEnergyCompanyDetails,
    deleteEnergyCompany,
    createEnergyCompanyUser,
    checkRelatedDataForEnergyCompany,
    deleteRelatedDataForEnergyCompany,
    getAllActiveEnergyCompany,
} = require("../../controllers/energyCompanyController");
const { createEnergyCompany } = require("../../controllers/superAdminController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const energyCompanyRouter = require("express").Router();

/**
 * @swagger
 * /super-admin/create-energy-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new energy company
 *     description: Create a new energy company with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - address
 *     responses:
 *       201:
 *         description: Energy company created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * @swagger
 * /super-admin/get-energy-company-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get energy company details by ID
 *     description: Retrieve details of a specific energy company by its ID.
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
 *         description: Energy company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Energy Company A"
 *                 contactEmail: "contact@energycompanya.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-energy-company-with-soft-delete:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all energy companies with soft delete status
 *     description: Retrieve a list of all energy companies, including those marked for soft deletion.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all energy companies with soft delete status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All energy companies with soft delete status fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Energy Company A"
 *                   deletedAt: null
 *                 - id: 2
 *                   name: "Energy Company B"
 *                   deletedAt: "2024-01-01T00:00:00Z"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/energy-company-delete/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Delete an energy company
 *     description: Soft delete an energy company by its ID.
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
 *         description: Energy company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-zone-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a new zone user
 *     description: Create a new user for an energy company zone.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new user.
 *               zone_id:
 *                 type: integer
 *                 description: The ID of the zone where the user will be assigned.
 *           example:
 *             username: john.doe
 *             email: john.doe@example.com
 *             password: securePassword123
 *             role: Zone Manager
 *             zone_id: 1
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *               user:
 *                 id: 1
 *                 username: john.doe
 *                 email: john.doe@example.com
 *                 role: Zone Manager
 *                 zone_id: 1
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-energy-company-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update energy company details
 *     description: Update the details of a specific energy company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Energy company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

energyCompanyRouter.post(
    "/create-energy-company",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createEnergyCompany
);
energyCompanyRouter.get(
    "/get-energy-company-details/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEnergyCompanyDetailsById
);
energyCompanyRouter.get(
    "/get-all-energy-company-with-soft-delete",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCreatedEnergyCompanyWithSoftDelete
);
energyCompanyRouter.post(
    "/energy-company-delete/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteEnergyCompany
);
energyCompanyRouter.post(
    "/create-zone-user",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createEnergyCompanyUser
);

energyCompanyRouter.post(
    "/update-energy-company-details",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    updateEnergyCompanyDetails
);

energyCompanyRouter.get(
    "/check-related-data-for-energy-company/:energy_company_id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    checkRelatedDataForEnergyCompany
);
energyCompanyRouter.post(
    "/delete-related-data-for-energy-company",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteRelatedDataForEnergyCompany
);
// energyCompanyRouter.get(
//     "/get-active-energy-companies",
//     verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
//     checkPermission,
//     getAllActiveEnergyCompany
// );


module.exports = energyCompanyRouter;

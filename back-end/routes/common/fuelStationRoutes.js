const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const fuelStationRouter = require("express").Router();

const {
    getOutletByDistrictId,
    getOutletByEnergyCompanyId,
    getAllOutletForDropdown,
    addOutlet,
    getAllOutlet,
    editOutlet,
    updateOutlet,
    removeOutletById,
    getOutletBySalesId,
    approveRejectOutletByStatus,
    getOutletById,
    importOutlet,
} = require("../../controllers/outletController");
// outlets

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/add-outlet:
 *   post:
 *     summary: Add a new outlet.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the outlet.
 *               address:
 *                 type: string
 *                 description: Address of the outlet.
 *               energyCompanyId:
 *                 type: string
 *                 description: ID of the energy company.
 *               districtId:
 *                 type: string
 *                 description: ID of the district.
 *               salesAreaId:
 *                 type: string
 *                 description: ID of the sales area.
 *     responses:
 *       200:
 *         description: Outlet added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/all-outlets:
 *   get:
 *     summary: Get all outlets.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet/{id}:
 *   get:
 *     summary: Get details of a specific outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet.
 *     responses:
 *       200:
 *         description: Details of the specified outlet.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/edit-outlet/{id}:
 *   get:
 *     summary: Get details for editing a specific outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet.
 *     responses:
 *       200:
 *         description: Details of the specified outlet for editing.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/update-outlet:
 *   post:
 *     summary: Update details of an existing outlet.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the outlet to be updated.
 *               name:
 *                 type: string
 *                 description: Updated name of the outlet.
 *               address:
 *                 type: string
 *                 description: Updated address of the outlet.
 *               energyCompanyId:
 *                 type: string
 *                 description: Updated ID of the energy company.
 *               districtId:
 *                 type: string
 *                 description: Updated ID of the district.
 *               salesAreaId:
 *                 type: string
 *                 description: Updated ID of the sales area.
 *     responses:
 *       200:
 *         description: Outlet updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/approve-reject-outlet-by-id:
 *   post:
 *     summary: Approve or reject an outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the outlet.
 *               status:
 *                 type: string
 *                 description: Status of the outlet (approved or rejected).
 *     responses:
 *       200:
 *         description: Outlet status updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/delete-outlet/{id}:
 *   delete:
 *     summary: Delete an outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet to be deleted.
 *     responses:
 *       200:
 *         description: Outlet deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-energy-company-id/{id}:
 *   get:
 *     summary: Get outlets by energy company ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the energy company.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified energy company.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-district-id/{id}:
 *   get:
 *     summary: Get outlets by district ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the district.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified district.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-sales-area-id/{id}:
 *   get:
 *     summary: Get outlets by sales area ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sales area.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified sales area.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-all-outlet-for-dropdown:
 *   get:
 *     summary: Get all outlets for dropdown selection.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets suitable for dropdown selection.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/import-outlet:
 *   post:
 *     summary: Import outlet data from a file.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File containing outlet data.
 *     responses:
 *       200:
 *         description: Outlet data imported successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
fuelStationRouter.post(
    "/add-outlet",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addOutlet
);
fuelStationRouter.get(
    "/all-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllOutlet
);
fuelStationRouter.get(
    "/get-outlet/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOutletById
);
fuelStationRouter.get(
    "/edit-outlet/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editOutlet
);
fuelStationRouter.post(
    "/update-outlet",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateOutlet
);
fuelStationRouter.put(
    "/approve-reject-outlet-by-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveRejectOutletByStatus
);
fuelStationRouter.delete(
    "/delete-outlet/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeOutletById
);
fuelStationRouter.get(
    "/get-outlet-by-energy-company-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOutletByEnergyCompanyId
);
fuelStationRouter.get(
    "/get-outlet-by-district-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOutletByDistrictId
);
fuelStationRouter.get(
    "/get-outlet-by-sales-area-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOutletBySalesId
);
fuelStationRouter.get(
    "/get-all-outlet-for-dropdown",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllOutletForDropdown
);
fuelStationRouter.post(
    "/import-outlet",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    importOutlet
);

module.exports = fuelStationRouter;

const zoneRouter = require("express").Router();
const {
    createZone,
    getAllActiveZones,
    editZone,
    updateZone,
    deleteZone,
    getAllZones,
} = require("../../controllers/zoneController");
const { permissionCheck, verifyToken, checkPermission } = require("../../helpers/verifyToken");

/*super-admin/create-zone:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new zone
 *     description: Create a new zone with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - zoneName
 *     responses:
 *       201:
 *         description: Zone created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-zone:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all zones
 *     description: Retrieve a list of all zones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "North Zone"
 *                 - id: 2
 *                   zoneName: "South Zone"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-active-zone:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active zones
 *     description: Retrieve a list of all active zones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All active zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "North Zone"
 *                 - id: 2
 *                   zoneName: "South Zone"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/edit-zone/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a specific zone
 *     description: Retrieve details of a specific zone by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the zone to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone details fetched successfully.
 *               data:
 *                 id: 1
 *                 zoneName: "North Zone"
 *                 description: "Description of North Zone"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/update-zone:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update an existing zone
 *     description: Update details of an existing zone.
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
 *               zoneName:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - zoneName
 *     responses:
 *       200:
 *         description: Zone updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/delete-zone/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a specific zone
 *     description: Remove a zone by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the zone to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

zoneRouter.post("/create-zone", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, createZone);
zoneRouter.get("/all-zone", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getAllZones);
zoneRouter.get("/all-zone/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getAllZones);
zoneRouter.get("/all-active-zone", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getAllActiveZones);
zoneRouter.get("/edit-zone/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, editZone);
zoneRouter.post("/update-zone", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, updateZone);
zoneRouter.delete("/delete-zone/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, deleteZone);

module.exports = zoneRouter;

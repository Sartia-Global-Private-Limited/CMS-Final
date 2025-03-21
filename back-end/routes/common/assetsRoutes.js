const {
    createAssets,
    getAllStoredAssets,
    getSingleStoredAssetDetails,
    updateStoredAssetDetails,
    deleteAssets,
    assignAssetToUsers,
    getAllAssignedAssets,
    approveRejectAssetsByStatusAndById,
    createAssetsRepairRequest,
} = require("../../controllers/assetController");
const { getAssetWithTimelineHistory } = require("../../controllers/assetTimelineController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const assetRouter = require("express").Router();

//--------------------------Assets Routes--------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Assets
 *   description: API endpoints for managing asset-related operations.
 */

/**
 * @swagger
 * /contractor/add-new-assets:
 *   post:
 *     summary: Add new assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetName:
 *                 type: string
 *                 description: Name of the asset.
 *               assetType:
 *                 type: string
 *                 description: Type of the asset.
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the asset.
 *               location:
 *                 type: string
 *                 description: Location where the asset is stored.
 *     responses:
 *       201:
 *         description: Asset added successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-stored-assets:
 *   get:
 *     summary: Retrieve all stored assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stored assets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-stored-assets-details/{id}:
 *   get:
 *     summary: Get details of a single stored asset.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the asset to retrieve details for.
 *     responses:
 *       200:
 *         description: Details of the stored asset retrieved successfully.
 *       400:
 *         description: Bad request, invalid asset ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-stored-assets:
 *   post:
 *     summary: Update details of stored assets.
 *     tags: [Contractor Routes - Assets]
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
 *                 description: ID of the asset to be updated.
 *               assetName:
 *                 type: string
 *                 description: Updated name of the asset.
 *               assetType:
 *                 type: string
 *                 description: Updated type of the asset.
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the asset.
 *               location:
 *                 type: string
 *                 description: Updated location of the asset.
 *     responses:
 *       200:
 *         description: Asset details updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-stored-assets/{id}:
 *   delete:
 *     summary: Delete a stored asset.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the asset to be deleted.
 *     responses:
 *       200:
 *         description: Asset deleted successfully.
 *       400:
 *         description: Bad request, invalid asset ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assigned-asset-to-user:
 *   post:
 *     summary: Assign an asset to a user.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be assigned.
 *               userId:
 *                 type: string
 *                 description: ID of the user to whom the asset will be assigned.
 *               assignedDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the asset is assigned.
 *     responses:
 *       201:
 *         description: Asset assigned to user successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-assigned-asset-to-users:
 *   get:
 *     summary: Retrieve all assets assigned to users.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assets assigned to users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-assets-by-status:
 *   put:
 *     summary: Approve or reject assets based on status.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be approved or rejected.
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: Status to update for the asset.
 *     responses:
 *       200:
 *         description: Asset status updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/repair-assets:
 *   post:
 *     summary: Create a repair request for assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be repaired.
 *               repairDescription:
 *                 type: string
 *                 description: Description of the repair needed.
 *               repairDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the repair request is made.
 *     responses:
 *       201:
 *         description: Asset repair request created successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
assetRouter.post("/add-new-assets", verifyToken([process.env.CONTRACTOR_ROLE_ID]), checkPermission, createAssets);
assetRouter.get(
    "/get-all-stored-assets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllStoredAssets
);
assetRouter.get(
    "/get-stored-assets-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getSingleStoredAssetDetails
);
assetRouter.post(
    "/update-stored-assets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateStoredAssetDetails
);
assetRouter.delete(
    "/delete-stored-assets/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    deleteAssets
);
assetRouter.put(
    "/assigned-asset-to-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    assignAssetToUsers
);
assetRouter.get(
    "/get-all-assigned-asset-to-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllAssignedAssets
);
assetRouter.put(
    "/approve-reject-assets-by-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveRejectAssetsByStatusAndById
);
assetRouter.post(
    "/repair-assets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    createAssetsRepairRequest
);
assetRouter.get(
    "/get-assets-with-timeline-history/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAssetWithTimelineHistory
);
module.exports = assetRouter;

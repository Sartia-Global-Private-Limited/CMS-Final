/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Item Master
 *   description: Routes for item master
 */

const { createBrand, updateBrand, deleteBrand, getAllBrands, getBrandById } = require("../../controllers/brandController");
const {
    deleteItemMaster,
    updateItemMaster,
    getSingleItemMaster,
    getAllItemMasters,
    createItemMaster,
    approveOrRejectItems,
    importItemMaster,
} = require("../../controllers/itemMasterController");
const {
    subCategoryList,
    subCategoryById,
    updateSubCategory,
    deleteSubCategory,
    addSubCategory,
} = require("../../controllers/subCategoryController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const itemMasterRouter = require("express").Router();

/**
 * @swagger
 * /contractor/item-master/create-item-master:
 *   post:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Create item master
 *     description: Create a new item master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: SSD
 *             supplier_id: 22
 *             hsncode: hsn44
 *             rucode: ru442
 *             item_unique_id: 1723550168990
 *             unit_id: 1
 *             description: <p>description of product</p>
 *             image: "/item_masters/1723550168990.jpg"
 *             category: 1
 *             rates: '[{"brand":"doms","brand_id":3,"rate":"5"},{"brand":"Natraj","brand_id":8,"rate":"8"}]'
 *     responses:
 *       200:
 *         description: Item master created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item and rates created successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.post(
    "/create-item-master",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createItemMaster
);

/**
 * @swagger
 * /contractor/item-master/get-all-item-masters:
 *   get:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Get all item masters
 *     description: Retrieve a list of all item masters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of item masters
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.get(
    "/get-all-item-masters",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllItemMasters
);

/**
 * @swagger
 * /contractor/item-master/get-item-master-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Get item master details
 *     description: Retrieve details of a specific item master by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item master
 *         example: 1
 *     responses:
 *       200:
 *         description: Item master details
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.get(
    "/get-item-master-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSingleItemMaster
);

/**
 * @swagger
 * /contractor/item-master/update-item-master-details:
 *   post:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Update item master details
 *     description: Update the details of an existing item master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             name: SSD
 *             supplier_id: 22
 *             hsncode: hsn44
 *             rucode: ru442
 *             item_unique_id: 1723550168990
 *             unit_id: 1
 *             description: <p>description of product</p>
 *             image: "/item_masters/1723550168990.jpg"
 *             category: 1
 *             rates: '[{"brand":"doms","brand_id":3,"rate":"5"},{"brand":"Natraj","brand_id":8,"rate":"8"}]'
 *     responses:
 *       200:
 *         description: Item master updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item and rates updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.post(
    "/update-item-master-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateItemMaster
);

/**
 * @swagger
 * /contractor/item-master/delete-item-master/{id}:
 *   delete:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Delete item master
 *     description: Delete an item master by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item master to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item master deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item deleted successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.delete(
    "/delete-item-master/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteItemMaster
);

/**
 * @swagger
 * /contractor/item-master/change-status-for-item-master:
 *   post:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Change status for item master
 *     description: Change status for item master
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             status: 1
 *     responses:
 *       200:
 *         description: Item master status changed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item master status changed successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
itemMasterRouter.put(
    "/change-status-for-item-master",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveOrRejectItems
); // method changed from POST to PUT
itemMasterRouter.post(
    "/create-brand",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createBrand
);
itemMasterRouter.post(
    "/update-brand",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateBrand
);
itemMasterRouter.delete(
    "/delete-brand/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteBrand
);
itemMasterRouter.get(
    "/get-all-brand",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllBrands
);
itemMasterRouter.post(
    "/add-sub-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addSubCategory
);
itemMasterRouter.get(
    "/get-all-sub-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    subCategoryList
);
itemMasterRouter.get(
    "/get-sub-category-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    subCategoryById
);
itemMasterRouter.post(
    "/edit-sub-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSubCategory
);
itemMasterRouter.delete(
    "/delete-sub-category/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteSubCategory
);
itemMasterRouter.post(
    "/import-item-master",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID, process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    importItemMaster
)
itemMasterRouter.get(
    "/get-brand-by-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID, process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getBrandById
)

module.exports = itemMasterRouter;

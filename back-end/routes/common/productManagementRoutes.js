const {
    createCategory,
    getAllCategory,
    getCategoryDetailById,
    updateCategory,
    deleteCategoryById,
} = require("../../controllers/categoryController");
const {
    addProduct,
    getAllProducts,
    getProductDetailById,
    updateProduct,
    removedProductById,
    publishedProduct,
} = require("../../controllers/productController");
const {
    createUnitData,
    updateUnitDataById,
    getAllUnitData,
    getUnitDataById,
    deleteUnitDataById,
    getAllUnitDataForDropdown,
} = require("../../controllers/unitController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const productManagementRouter = require("express").Router();

//---------------------category routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Category
 *   description: API endpoints for managing categories.
 */

/**
 * @swagger
 * /contractor/create-category:
 *   post:
 *     summary: Create a new category.
 *     tags: [Contractor Routes - Category]
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
 *                 description: The name of the category.
 *               description:
 *                 type: string
 *                 description: A brief description of the category.
 *     responses:
 *       200:
 *         description: Category created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-category:
 *   get:
 *     summary: Get a list of all categories.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all categories.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-category-detail/{id}:
 *   get:
 *     summary: Get category details by ID.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category.
 *     responses:
 *       200:
 *         description: Category details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-category-detail:
 *   post:
 *     summary: Update category details.
 *     tags: [Contractor Routes - Category]
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
 *                 description: The ID of the category.
 *               name:
 *                 type: string
 *                 description: The updated name of the category.
 *               description:
 *                 type: string
 *                 description: The updated description of the category.
 *     responses:
 *       200:
 *         description: Category details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-category-detail/{id}:
 *   delete:
 *     summary: Delete category details by ID.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category details deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
productManagementRouter.post(
    "/category/create-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    createCategory
);
productManagementRouter.get(
    "/category/get-all-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllCategory
);
productManagementRouter.get(
    "/category/get-category-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getCategoryDetailById
);
productManagementRouter.post(
    "/category/update-category-detail",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateCategory
);
productManagementRouter.delete(
    "/category/delete-category-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    deleteCategoryById
);

//----------------------unit data routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Unit Data
 *   description: API endpoints for managing unit data.
 */

/**
 * @swagger
 * /contractor/create-unit-data:
 *   post:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Create new unit data
 *     description: Add a new unit data entry to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *               unit_code:
 *                 type: string
 *             example:
 *               unit_name: "Meter"
 *               unit_code: "MTR"
 *     responses:
 *       201:
 *         description: Unit data created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-unit-data-by-id/{id}:
 *   put:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Update unit data by ID
 *     description: Update the details of an existing unit data entry using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *               unit_code:
 *                 type: string
 *             example:
 *               unit_name: "Kilogram"
 *               unit_code: "KG"
 *     responses:
 *       200:
 *         description: Unit data updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-unit-data:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get all unit data
 *     description: Retrieve a list of all unit data entries.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unit data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of unit data fetched successfully"
 *               data: [{ id: 1, unit_name: "Meter", unit_code: "MTR" }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-unit-data-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get unit data by ID
 *     description: Retrieve details of a specific unit data entry based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit data details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Unit data details fetched successfully"
 *               data: { id: 1, unit_name: "Meter", unit_code: "MTR" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-unit-data-by-id/{id}:
 *   delete:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Delete unit data by ID
 *     description: Remove a unit data entry from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit data deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-unit-data-list:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get all unit data for dropdown
 *     description: Retrieve a list of all unit data entries for use in dropdowns.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unit data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of unit data fetched successfully"
 *               data: [{ id: 1, unit_name: "Meter", unit_code: "MTR" }]
 *       500:
 *         description: Internal Server Error
 */
productManagementRouter.post(
    "/unit/create-unit-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    createUnitData
);
productManagementRouter.put(
    "/unit/update-unit-data-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateUnitDataById
);
productManagementRouter.get(
    "/unit/get-all-unit-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllUnitData
);
productManagementRouter.get(
    "/unit/get-unit-data-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUnitDataById
);
productManagementRouter.delete(
    "/unit/delete-unit-data-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    deleteUnitDataById
);
productManagementRouter.get(
    "/unit/get-all-unit-data-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllUnitDataForDropdown
);

//----------------------Product routes--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Product
 *   description: API endpoints for managing products.
 */

/**
 * @swagger
 * /contractor/product-add:
 *   post:
 *     summary: Add a new product.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: A brief description of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               category:
 *                 type: string
 *                 description: The category ID to which the product belongs.
 *     responses:
 *       200:
 *         description: Product added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-list:
 *   get:
 *     summary: Get a list of all products.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all products.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-detail/{id}:
 *   get:
 *     summary: Get product details by ID.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product.
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-detail-update:
 *   post:
 *     summary: Update product details.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The ID of the product.
 *               name:
 *                 type: string
 *                 description: The updated name of the product.
 *               description:
 *                 type: string
 *                 description: The updated description of the product.
 *               price:
 *                 type: number
 *                 description: The updated price of the product.
 *               category:
 *                 type: string
 *                 description: The updated category ID of the product.
 *     responses:
 *       200:
 *         description: Product details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-product/{id}:
 *   delete:
 *     summary: Delete a product by ID.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-publish-status-update:
 *   post:
 *     summary: Update the publish status of a product.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The ID of the product.
 *               status:
 *                 type: boolean
 *                 description: The publish status of the product.
 *     responses:
 *       200:
 *         description: Product publish status updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
productManagementRouter.post(
    "/product/product-add",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    addProduct
);
productManagementRouter.get(
    "/product/product-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllProducts
);
productManagementRouter.get(
    "/product/product-detail/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getProductDetailById
);
productManagementRouter.post(
    "/product/product-detail-update",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateProduct
);
productManagementRouter.delete(
    "/product/delete-product/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    removedProductById
);
productManagementRouter.put(
    "/product/product-publish-status-update",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    publishedProduct
);

module.exports = productManagementRouter;

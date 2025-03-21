const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const supplierRouter = require("express").Router();

const {
    createSuppliers,
    getSuppliers,
    getSuppliersById,
    updateSuppliers,
    deleteSuppliers,
    approveOrRejectSuppliersById,
    importSuppliers,
} = require("../../controllers/suppliersController");
//supplier controller

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Supplier
 *   description: Routes for managing suppliers
 */

/**
 * @swagger
 * /contractor/create-suppliers:
 *   post:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Create a new supplier
 *     description: Allows a contractor to create a new supplier.
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
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               name: "Supplier Name"
 *               contact: "123-456-7890"
 *               email: "supplier@example.com"
 *               address: "123 Supplier St, City, Country"
 *               status: "active"
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-suppliers:
 *   get:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Get all suppliers
 *     description: Retrieve a list of all suppliers for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Suppliers fetched successfully"
 *               data: [{ id: 1, name: "Supplier Name", contact: "123-456-7890", email: "supplier@example.com", address: "123 Supplier St", status: "active" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-suppliers-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Get supplier by ID
 *     description: Retrieve details of a specific supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Supplier details fetched successfully"
 *               data: { id: 1, name: "Supplier Name", contact: "123-456-7890", email: "supplier@example.com", address: "123 Supplier St", status: "active" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-suppliers/{id}:
 *   put:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Update a supplier
 *     description: Update the details of an existing supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               name: "Updated Supplier Name"
 *               contact: "987-654-3210"
 *               email: "updatedsupplier@example.com"
 *               address: "456 Supplier Ave, New City, Country"
 *               status: "inactive"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-suppliers/{id}:
 *   delete:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Delete a supplier
 *     description: Delete an existing supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/approve-reject-suppliers-by-id:
 *   post:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Approve or reject a supplier
 *     description: Approve or reject a supplier based on its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *             example:
 *               supplier_id: 1
 *               action: "approve"
 *     responses:
 *       200:
 *         description: Supplier approved or rejected successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */
supplierRouter.post(
    "/create-suppliers",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    createSuppliers
);
supplierRouter.get("/get-suppliers", verifyToken([process.env.CONTRACTOR_ROLE_ID]), checkPermission, getSuppliers);
supplierRouter.get(
    "/get-suppliers-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getSuppliersById
);
supplierRouter.put(
    "/update-suppliers/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateSuppliers
);
supplierRouter.delete(
    "/delete-suppliers/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    deleteSuppliers
);
supplierRouter.put(
    "/approve-reject-suppliers-by-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveOrRejectSuppliersById
);
supplierRouter.post(
    "/import-suppliers",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    importSuppliers
);

module.exports = supplierRouter;

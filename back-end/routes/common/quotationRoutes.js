const {
    createQuotation,
    getQuotation,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    sendEmailQuotation,
    approveOrRejectQuotationsById,
} = require("../../controllers/quotationController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const quotationRouter = require("express").Router();

//quotation controller

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Quotation
 *   description: Routes for managing quotations
 */

/**
 * @swagger
 * /contractor/create-quotation:
 *   post:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Create a new quotation
 *     description: Allows a contractor to create a new quotation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               details:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               item_id: 1
 *               price: 200.00
 *               details: "Quotation details"
 *               status: "pending"
 *     responses:
 *       201:
 *         description: Quotation created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-quotation:
 *   get:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Get all quotations
 *     description: Retrieve a list of all quotations for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quotations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Quotations fetched successfully"
 *               data: [{ id: 1, item_id: 1, price: 200.00, details: "Quotation details", status: "pending" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-quotation-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Get quotation by ID
 *     description: Retrieve details of a specific quotation by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quotation to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quotation details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Quotation details fetched successfully"
 *               data: { id: 1, item_id: 1, price: 200.00, details: "Quotation details", status: "pending" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-quotation/{id}:
 *   put:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Update a quotation
 *     description: Update the details of an existing quotation by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quotation to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               details:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               price: 220.00
 *               details: "Updated quotation details"
 *               status: "approved"
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-quotation/{id}:
 *   delete:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Delete a quotation
 *     description: Delete an existing quotation by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quotation to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quotation deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/quotation-send-by-email:
 *   post:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Send quotation by email
 *     description: Send a quotation to the recipient via email.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quotation_id:
 *                 type: integer
 *               email:
 *                 type: string
 *             example:
 *               quotation_id: 1
 *               email: "recipient@example.com"
 *     responses:
 *       200:
 *         description: Quotation sent by email successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/approve-rejected-quotation-by-id:
 *   post:
 *     tags: [Contractor Routes - Quotation]
 *     summary: Approve or reject a quotation
 *     description: Approve or reject a quotation based on its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quotation_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *             example:
 *               quotation_id: 1
 *               action: "approve"
 *     responses:
 *       200:
 *         description: Quotation approved or rejected successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal Server Error
 */
quotationRouter.post(
    "/create-quotation",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createQuotation
);
quotationRouter.get(
    "/get-quotation",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getQuotation
);
quotationRouter.get(
    "/get-quotation-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getQuotationById
);
quotationRouter.put(
    "/update-quotation/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateQuotation
);
quotationRouter.delete(
    "/delete-quotation/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteQuotation
);
quotationRouter.post(
    "/quotation-send-by-email",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    sendEmailQuotation
);
quotationRouter.put(
    "/approve-rejected-quotation-by-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveOrRejectQuotationsById
);
module.exports = quotationRouter;

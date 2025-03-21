/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Purchase Order
 *   description: Routes for managing purchase orders
 */

const { changePoInMeasurements } = require("../../controllers/proformaInvoiceController");
const {
    getPurchaseOrderItemsOnPo,
    changePoStatus,
    getAllGstType,
    getIncludePercentage,
    getPoListOnRoId,
    checkPONumberIsAlreadyExists,
    deletePurchaseOrder,
    updatePurchaseOrderDetails,
    getPurchaseOrderDetailsById,
    getSecurityUniqueId,
    approveAndUpdatePurchaseOrder,
    approvePurchaseOrder,
    getPoNumberForPurchaseOrder,
    getRoForPurchaseOrder,
    createPurchaseOrder,
    getAllGeneratedPurchaseOrder,
    downloadCsvFile,
} = require("../../controllers/purchaseOrderController");
const {
    getSoNumberForSalesOrder,
    getRoForSalesOrder,
    getSalesSecurityUniqueId,
    approveAndUpdateSalesOrder,
    approveSalesOrder,
    getSalesOrderItemsOnSo,
    changeSoStatus,
    getSoListOnRoId,
    checkSONumberIsAlreadyExists,
    deleteSalesOrder,
    getSalesOrderDetailsById,
    getAllGeneratedSalesOrder,
    updateSalesOrderDetails,
    createSalesOrder,
} = require("../../controllers/saleOrderController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const purchaseSaleRouter = require("express").Router();

/**
 * @swagger
 * /contractor/purchase-sale/create-po-order:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Create a new purchase order
 *     description: Allows a contractor to create a new purchase order.
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
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *             example:
 *               item_id: 1
 *               quantity: 100
 *               price: 50.00
 *               status: "pending"
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/purchase/get-all-generated-po:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get all generated purchase orders
 *     description: Retrieve a list of all generated purchase orders for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase orders retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase orders fetched successfully"
 *               data: [{ id: 1, item_id: 1, quantity: 100, price: 50.00, status: "pending" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-ro-for-po:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get RO (Release Order) for purchase order
 *     description: Retrieve the release order details for a specific purchase order.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Release order details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Release order details fetched successfully"
 *               data: { ro_id: 1, po_id: 1, details: "Release order details" }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-po-number-for-po:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get purchase order number
 *     description: Retrieve the purchase order number for a specific purchase order.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase order number fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase order number fetched successfully"
 *               data: { po_number: "PO12345" }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/approve-purchase-order:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Approve a purchase order
 *     description: Allows a contractor to approve a purchase order.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               po_id: 1
 *               status: "approved"
 *     responses:
 *       200:
 *         description: Purchase order approved successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/approve-update-purchase-order:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Approve and update a purchase order
 *     description: Allows a contractor to approve and update the details of a purchase order.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               po_id: 1
 *               quantity: 120
 *               status: "approved"
 *     responses:
 *       200:
 *         description: Purchase order approved and updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-security-unique-id:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get security unique ID
 *     description: Retrieve the unique security ID for a purchase order.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security unique ID fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Security unique ID fetched successfully"
 *               data: { security_id: "SEC12345" }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
purchaseSaleRouter.post(
    "/purchase/create-po-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createPurchaseOrder
);
purchaseSaleRouter.get(
    "/purchase/get-all-generated-po",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedPurchaseOrder
);
purchaseSaleRouter.get(
    "/get-ro-for-po",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRoForPurchaseOrder
);
purchaseSaleRouter.get(
    "/get-po-number-for-po",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPoNumberForPurchaseOrder
);
purchaseSaleRouter.post(
    "/approve-purchase-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approvePurchaseOrder
);
purchaseSaleRouter.post(
    "/purchase/approve-update-purchase-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveAndUpdatePurchaseOrder
);
purchaseSaleRouter.get(
    "/get-security-unique-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSecurityUniqueId
);

/**
 * @swagger
 * /contractor/purchase-sale/get-single-po-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get single purchase order details
 *     description: Retrieve details of a single purchase order by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the purchase order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase order details fetched successfully"
 *               data: { id: 1, item_id: 1, quantity: 100, price: 50.00, status: "pending" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/update-po-details:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Update purchase order details
 *     description: Update the details of an existing purchase order.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *             example:
 *               po_id: 1
 *               quantity: 120
 *               price: 55.00
 *               status: "updated"
 *     responses:
 *       200:
 *         description: Purchase order details updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/delete-po-details/{id}:
 *   delete:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Delete purchase order details
 *     description: Delete a purchase order by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the purchase order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/check-po-is-exists:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Check if purchase order number exists
 *     description: Check if a purchase order number already exists.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase order existence checked successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase order number exists"
 *               data: { exists: true }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-po-details-on-ro/{id}:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get purchase order details on RO
 *     description: Retrieve purchase order details based on the RO ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The RO ID to retrieve purchase orders
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase order details fetched successfully"
 *               data: [{ id: 1, item_id: 1, quantity: 100, price: 50.00, status: "pending" }]
 *       400:
 *         description: Bad Request
 *       404:
 *         description: RO not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-tax-calculation-type:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get tax calculation type
 *     description: Retrieve the type of tax calculation to be used.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *             example:
 *               type: "percentage"
 *     responses:
 *       200:
 *         description: Tax calculation type fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Tax calculation type fetched successfully"
 *               data: { calculation_type: "percentage" }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-all-gst-type:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get all GST types
 *     description: Retrieve a list of all GST types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GST types retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "GST types fetched successfully"
 *               data: [{ gst_type: "CGST", rate: 9 }, { gst_type: "SGST", rate: 9 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/change-po-status:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Change purchase order status
 *     description: Update the status of a purchase order.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               po_id: 1
 *               status: "completed"
 *     responses:
 *       200:
 *         description: Purchase order status changed successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/get-purchase-order-details-with-items/{id}:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Get purchase order details with items
 *     description: Retrieve purchase order details along with associated items.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the purchase order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order details with items fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase order details with items fetched successfully"
 *               data: { id: 1, item_id: 1, quantity: 100, price: 50.00, items: [{ id: 1, name: "Item 1", quantity: 10 }] }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/change-po-in-measurements:
 *   post:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Change purchase order in measurements
 *     description: Update purchase order details based on measurements.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: integer
 *               measurements:
 *                 type: object
 *             example:
 *               po_id: 1
 *               measurements: { length: 10, width: 5, height: 2 }
 *     responses:
 *       200:
 *         description: Purchase order measurements updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/purchase-sale/download-csv-purchase-order-items:
 *   get:
 *     tags: [Contractor Routes - Purchase Order]
 *     summary: Download CSV of purchase order items
 *     description: Download a CSV file containing purchase order items.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
purchaseSaleRouter.get(
    "/purchase/get-single-po-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPurchaseOrderDetailsById
);
purchaseSaleRouter.post(
    "/purchase/update-po-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePurchaseOrderDetails
);
purchaseSaleRouter.delete(
    "/purchase/delete-po-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deletePurchaseOrder
);
purchaseSaleRouter.get(
    "/check-po-is-exists",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    checkPONumberIsAlreadyExists
);
purchaseSaleRouter.get(
    "/get-po-details-on-ro/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPoListOnRoId
);
purchaseSaleRouter.post(
    "/get-tax-calculation-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getIncludePercentage
);
// purchaseSaleRouter.get(
//   "/get-all-gst-type",
//   verifyContractorToken,
//   checkPermission,
//   getAllGstType
// );
purchaseSaleRouter.post(
    "/purchase/change-po-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    changePoStatus
);
purchaseSaleRouter.get(
    "/get-purchase-order-details-with-items/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPurchaseOrderItemsOnPo
);
// purchaseSaleRouter.post(
//   "/change-po-in-measurements",
//   verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
//   checkPermission,
//   changePoInMeasurements
// );
purchaseSaleRouter.get("/download-csv-purchase-order-items", downloadCsvFile);

//=====================sales routes======================///

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Sales Orders
 *     description: Routes for managing sales orders.
 *
 * /contractor/purchase-sale/create-so-order:
 *   post:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Create a new sales order.
 *     description: Create a new sales order with the provided details.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: ID of the customer.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: Total amount of the sales order.
 *             required:
 *               - customerId
 *               - items
 *               - totalAmount
 *     responses:
 *       201:
 *         description: Sales order created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order created successfully.
 *               data:
 *                 id: 1
 *                 customerId: 123
 *                 items:
 *                   - productId: 456
 *                     quantity: 10
 *                 totalAmount: 1000.00
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/update-so-details:
 *   post:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Update sales order details.
 *     description: Update the details of an existing sales order.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the sales order to update.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product.
 *                     quantity:
 *                       type: integer
 *                       description: New quantity of the product.
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: New total amount of the sales order.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Sales order details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-all-generated-so:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get all generated sales orders.
 *     description: Retrieve a list of all generated sales orders.
 *     responses:
 *       200:
 *         description: List of all generated sales orders.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales orders fetched successfully.
 *               data:
 *                 - id: 1
 *                   customerId: 123
 *                   totalAmount: 1000.00
 *                   status: "Pending"
 *                 - id: 2
 *                   customerId: 124
 *                   totalAmount: 2000.00
 *                   status: "Completed"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-single-so-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get sales order details by ID.
 *     description: Retrieve details of a specific sales order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sales order to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales order details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order details fetched successfully.
 *               data:
 *                 id: 1
 *                 customerId: 123
 *                 items:
 *                   - productId: 456
 *                     quantity: 10
 *                 totalAmount: 1000.00
 *                 status: "Pending"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/delete-so-details/{id}:
 *   delete:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Delete a sales order.
 *     description: Remove a sales order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sales order to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales order deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/check-so-is-exists:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Check if sales order number already exists.
 *     description: Verify if a sales order number already exists.
 *     parameters:
 *       - in: query
 *         name: soNumber
 *         required: true
 *         description: Sales order number to check.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check sales order existence result.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order number exists.
 *               exists: true
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-so-details-on-ro/{id}:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get sales order details on RO ID.
 *     description: Retrieve sales orders associated with a specific RO ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: RO ID to retrieve sales orders for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales orders associated with the RO ID.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales orders fetched successfully.
 *               data:
 *                 - id: 1
 *                   customerId: 123
 *                   totalAmount: 1000.00
 *                   status: "Pending"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/change-so-status:
 *   post:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Change sales order status.
 *     description: Update the status of a sales order.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the sales order.
 *               status:
 *                 type: string
 *                 description: New status of the sales order.
 *             required:
 *               - id
 *               - status
 *     responses:
 *       200:
 *         description: Sales order status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-sales-order-details-with-items/{id}:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get sales order details with items.
 *     description: Retrieve sales order details along with items included in the order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sales order to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales order details with items.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order details with items fetched successfully.
 *               data:
 *                 id: 1
 *                 customerId: 123
 *                 items:
 *                   - productId: 456
 *                     quantity: 10
 *                 totalAmount: 1000.00
 *                 status: "Pending"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/approve-sales-order:
 *   post:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Approve a sales order.
 *     description: Approve the specified sales order.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the sales order to approve.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Sales order approved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order approved successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/approve-update-sales-order:
 *   post:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Approve and update a sales order.
 *     description: Approve and update the details of a sales order.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the sales order.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product.
 *                     quantity:
 *                       type: integer
 *                       description: New quantity of the product.
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: New total amount of the sales order.
 *             required:
 *               - id
 *               - items
 *               - totalAmount
 *     responses:
 *       200:
 *         description: Sales order approved and updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order approved and updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-sales-security-unique-id:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get sales security unique ID.
 *     description: Retrieve a unique ID for sales security purposes.
 *     responses:
 *       200:
 *         description: Unique ID for sales security.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Unique ID fetched successfully.
 *               data:
 *                 uniqueId: "ABC123456789"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-ro-for-so:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get RO for sales order.
 *     description: Retrieve RO information for a sales order.
 *     responses:
 *       200:
 *         description: RO details for sales order.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: RO details fetched successfully.
 *               data:
 *                 - id: 1
 *                   roNumber: "RO123456"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/purchase-sale/get-so-number-for-so:
 *   get:
 *     tags: [Contractor Routes - Sales Orders]
 *     summary: Get sales order number.
 *     description: Retrieve a new sales order number.
 *     responses:
 *       200:
 *         description: Sales order number.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales order number fetched successfully.
 *               data:
 *                 soNumber: "SO123456"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
purchaseSaleRouter.post(
    "/sales/create-so-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createSalesOrder
);
purchaseSaleRouter.post(
    "/sales/update-so-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSalesOrderDetails
);
purchaseSaleRouter.get(
    "/sales/get-all-generated-so",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedSalesOrder
);
purchaseSaleRouter.get(
    "/sales/get-single-so-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSalesOrderDetailsById
);
purchaseSaleRouter.delete(
    "/sales/delete-so-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteSalesOrder
);
purchaseSaleRouter.get(
    "/check-so-is-exists",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    checkSONumberIsAlreadyExists
);
// purchaseSaleRouter.get(
//   "/get-so-details-on-ro/:id",
//   verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
//   checkPermission,
//   getSoListOnRoId
// );
purchaseSaleRouter.post(
    "/sales/change-so-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    changeSoStatus
);
// purchaseSaleRouter.get(
//   "/get-sales-order-details-with-items/:id",
//   verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
//   checkPermission,
//   getSalesOrderItemsOnSo
// );
purchaseSaleRouter.post(
    "/approve-sales-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveSalesOrder
);
purchaseSaleRouter.post(
    "/approve-update-sales-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approveAndUpdateSalesOrder
);
purchaseSaleRouter.get(
    "/get-sales-security-unique-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSalesSecurityUniqueId
);
purchaseSaleRouter.get(
    "/get-ro-for-so",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRoForSalesOrder
);
purchaseSaleRouter.get(
    "/get-so-number-for-so",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSoNumberForSalesOrder
);

module.exports = purchaseSaleRouter;

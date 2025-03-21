const { getAllPurchaseOrder } = require("../../controllers/commonController");
const { getApprovedComplaintsDetailsById } = require("../../controllers/contractorComplaintController");
const { fetchAllFinancialYears } = require("../../controllers/financialYearController");
const {
    getAllInvoices,
    getAllMergedInvoices,
    getAllInvoicesListingInPayments,
    createInvoiceData,
    updateInvoiceData,
    getInvoiceDetailById,
    deleteInvoiceData,
    discardInvoice,
    mergeInvoice,
    getMergedInvoiceDetailById,
    discardMergedInvoice,
} = require("../../controllers/invoiceController");
const {
    saveIntoDraftMeasurement,
    getOutletByIdForPtm,
    getRegionalByIdForPtm,
    getOrderByIdForPtm,
    getSaleByIdNewForPtm,
    getCompaniesForPtm,
    getComplaintTypes,
    getPoInsideBilling,
    getResolvedComplaintsInBilling,
    getAllMeasurementsBasedOnStatus,
    getMeasurementsDetailsById,
    getComplaintTypesInsideBilling,
    getCompaniesInsideBilling,
    getAllOrderByForMeasurements,
    getRegionalByIdInsideBilling,
    getOutletByIdInsideBilling,
    getSalesByIdInsideBilling,
    updateMeasurementDetails,
    getMeasurementsTimeLineDetailsById,
    discardMeasurementDetails,
    updatePoInMeasurementDetails,
    createMeasurement,
} = require("../../controllers/measurementController");
const { getAllApprovedData } = require("../../controllers/officeInspectionController");
const {
    getAllPaymentReceive,
    listingOfPvNumber,
    getAllPaymentReceiveInPayment,
    getAllPaymentRetention,
    addPaymentReceive,
    getPaymentReceiveDetailsById,
    updatePaymentReceive,
    getPaymentRetentionDetailsById,
    updatePaymentReceiveInRetention,
    updatePaymentAmountRetention,
    approvePaymentRetention,
    discardPaymentRetention,
} = require("../../controllers/paymentReceived");
const { getPiAttachmentByComplaintId, filesUploadInBilling } = require("../../controllers/pi_attachment");
const {
    getSamePoExistsOrNot,
    getAllMeasurementsInPIStatus,
    getAllProformaInvoices,
    getAllProformaInvoicesInMergedPI,
    getAllMergedProformaInvoice,
    getAllProformaInvoicesInInvoice,
    generateProformaInvoice,
    getProformaInvoicesDetailsById,
    updateProformaInvoiceDetails,
    getMergedProformaInvoicesDetailsById,
    mergedPi,
    getPiList,
} = require("../../controllers/proformaInvoiceController");
const { getPurchaseOrderItemsOnPo } = require("../../controllers/purchaseOrderController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const billingRouter = require("express").Router();

// Billing Management -> Measurement

/**
 * @swagger
 * /contractor/billing/get-all-sale-in-ptm:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all sales in PTM
 *     description: Retrieve a list of all sales available in PTM.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Sales fetched successfully"
 *               data: [{ id: 1, sale_name: "Sale A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-outlets-in-ptm:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all outlets in PTM
 *     description: Retrieve a list of all outlets available in PTM.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlets retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Outlets fetched successfully"
 *               data: [{ id: 1, outlet_name: "Outlet A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-regionals-in-ptm:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all regionals in PTM
 *     description: Retrieve a list of all regional managers available in PTM.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regionals retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Regionals fetched successfully"
 *               data: [{ id: 1, regional_name: "Regional A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-order-by-in-ptm:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all order by in PTM
 *     description: Retrieve a list of all orders available in PTM.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Orders fetched successfully"
 *               data: [{ id: 1, order_name: "Order A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-companies-in-ptm:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all companies in PTM
 *     description: Retrieve a list of all companies available in PTM.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Companies fetched successfully"
 *               data: [{ id: 1, company_name: "Company A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-complaint-types:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get complaint types
 *     description: Retrieve a list of available complaint types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaint types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint types fetched successfully"
 *               data: [{ id: 1, type_name: "Type A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-po-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all po in billing
 *     description: Retrieve a list of all purchase orders available in billing.
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
 *               data: [{ id: 1, po_name: "PO A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-resolved-complaint-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get resolved complaints in billing
 *     description: Retrieve all resolved complaints that are in the billing phase.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resolved complaints retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Resolved complaints fetched successfully"
 *               data: [{ id: 1, complaint_details: "Complaint details" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-approved-complaints-details/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get approved complaints details by ID
 *     description: Retrieve details of approved complaints associated with a specific ID.
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
 *         description: Approved complaints details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 complaintType: Service Quality
 *                 description: Details of the approved complaint.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/billing/measurement/files-upload-in-billing:
 *   post:
 *     tags: [Contractor Routes - File Attachment]
 *     summary: Upload files for billing measurement
 *     description: Upload files related to billing measurements.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: file
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Files uploaded successfully"
 *               data: { fileUrls: ["http://example.com/file1.jpg", "http://example.com/file2.jpg"] }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/create-measurement:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Create a new measurement
 *     description: Allows a contractor to create a new measurement.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               measurement_name:
 *                 type: string
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *             example:
 *               measurement_name: "Length"
 *               value: 20.5
 *               unit: "meters"
 *     responses:
 *       201:
 *         description: Measurement created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-measurements-based-on-status:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all measurements based on status
 *     description: Retrieve a list of all measurements filtered by their status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Measurements based on status retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurements based on status fetched successfully"
 *               data: [{ id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
billingRouter.get(
    "/get-all-sale-in-ptm",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSaleByIdNewForPtm
);
billingRouter.get(
    "/get-all-outlets-in-ptm",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOutletByIdForPtm
);
billingRouter.get(
    "/get-all-regionals-in-ptm",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRegionalByIdForPtm
);
billingRouter.get(
    "/get-all-order-by-in-ptm",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOrderByIdForPtm
);
billingRouter.get(
    "/get-all-companies-in-ptm",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getCompaniesForPtm
);
// billingRouter.get("/get-complaint-types", verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getComplaintTypes);
billingRouter.get(
    "/get-all-po-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPoInsideBilling
);
billingRouter.get(
    "/get-resolved-complaint-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getResolvedComplaintsInBilling
);
billingRouter.get(
    "/measurement/get-approved-complaints-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getApprovedComplaintsDetailsById
);
billingRouter.post(
    "/measurement/files-upload-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    filesUploadInBilling
);
billingRouter.post(
    "/measurement/create-measurement",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createMeasurement
);
billingRouter.get(
    "/measurement/get-all-measurements-based-on-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMeasurementsBasedOnStatus
);

/**
 * @swagger
 * /contractor/billing/measurement/get-all-sales-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all sales in billing
 *     description: Retrieve a list of all sales available in billing.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Sales fetched successfully"
 *               data: [{ id: 1, sale_name: "Sale A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-outlet-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all outlets in billing
 *     description: Retrieve a list of all outlets available in billing.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlets retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Outlets fetched successfully"
 *               data: [{ id: 1, outlet_name: "Outlet A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-regional-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all regionals in billing
 *     description: Retrieve a list of all regional managers available in billing.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regionals retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Regionals fetched successfully"
 *               data: [{ id: 1, regional_name: "Regional A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-order-by-for-measurements:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all orders by measurement
 *     description: Retrieve a list of all orders filtered by measurements.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Orders fetched successfully"
 *               data: [{ id: 1, order_name: "Order A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-companies-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all companies in billing
 *     description: Retrieve a list of all companies available in billing.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Companies fetched successfully"
 *               data: [{ id: 1, company_name: "Company A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/measurement/get-all-complaint-types-in-billing:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all complaint types in billing
 *     description: Retrieve a list of all complaint types available in billing.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaint types retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint types fetched successfully"
 *               data: [{ id: 1, complaint_name: "Complaint A" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/measurement/get-all-sales-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getSalesByIdInsideBilling
);
billingRouter.get(
    "/measurement/get-all-outlet-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getOutletByIdInsideBilling
);
billingRouter.get(
    "/measurement/get-all-regional-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getRegionalByIdInsideBilling
);
billingRouter.get(
    "/measurement/get-all-order-by-for-measurements",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getAllOrderByForMeasurements
);
billingRouter.get(
    "/measurement/get-all-companies-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getCompaniesInsideBilling
);
billingRouter.get(
    "/measurement/get-all-complaint-types-in-billing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getComplaintTypesInsideBilling
);

/**
 * @swagger
 * /contractor/billing/get-measurements-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get measurement details by ID
 *     description: Retrieve details of a specific measurement by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the measurement to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Measurement details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurement details fetched successfully"
 *               data: { id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-pi-attachment-by-complaint-id/{complaint_id}:
 *   get:
 *     tags: [Contractor Routes - File Attachment]
 *     summary: Get PI attachment by complaint ID
 *     description: Retrieve PI attachments based on the complaint ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: The ID of the complaint to retrieve attachments for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PI attachment details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "PI attachment details fetched successfully"
 *               data: [{ attachment_id: 1, file_url: "http://example.com/file.jpg" }]
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-approved-data/{complaintId}:
 *   get:
 *     summary: Retrieve all approved data related to a specific complaint ID.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     parameters:
 *       - name: complaintId
 *         in: path
 *         required: true
 *         description: ID of the complaint.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved data retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/billing/fetch-all-financial-years:
 *   get:
 *     tags: [Contractor Routes - Financial Year]
 *     summary: Fetch all financial years
 *     description: Retrieve a list of all financial years.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of financial years fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of financial years fetched successfully"
 *               data: [{ id: 1, year: "2024", start_date: "2024-01-01", end_date: "2024-12-31" }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-po-details:
 *   get:
 *     summary: Retrieve all purchase order details
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all purchase order details.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/billing/get-purchase-order-details-with-items/{id}:
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
 * /contractor/billing/update-measurement-details:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Update measurement details
 *     description: Update the details of an existing measurement.
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
 *                 type: integer
 *               measurement_name:
 *                 type: string
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *             example:
 *               id: 1
 *               measurement_name: "Width"
 *               value: 15.5
 *               unit: "meters"
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-measurements-timeline-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get measurement timeline details by ID
 *     description: Retrieve the timeline details of a specific measurement by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the measurement to retrieve timeline details
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Measurement timeline details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurement timeline details fetched successfully"
 *               data: { id: 1, timeline_details: "Timeline details here" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/discard-measurement-details:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Discard measurement details
 *     description: Discard specific measurement details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               measurement_id:
 *                 type: integer
 *             example:
 *               measurement_id: 1
 *     responses:
 *       200:
 *         description: Measurement details discarded successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-po-exists-or-not:
 *   get:
 *     summary: Check if a Purchase Order (PO) exists.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmation of whether the PO exists or not.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/billing/change-po-details-by-same-po:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Update PO details by the same PO
 *     description: Change PO details using the same PO number.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_number:
 *                 type: string
 *               new_details:
 *                 type: object
 *             example:
 *               po_number: "PO001"
 *               new_details: { measurement_name: "Width", value: 15.5, unit: "meters" }
 *     responses:
 *       200:
 *         description: PO details updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: PO not found
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/measurement/get-measurements-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMeasurementsDetailsById
);
billingRouter.post(
    "/measurement/update-measurement-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateMeasurementDetails
);
billingRouter.get(
    "/measurement/get-pi-attachment-by-complaint-id/:complaint_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPiAttachmentByComplaintId
);
billingRouter.get(
    "/measurement/get-all-approved-data/:complaintId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllApprovedData
);
billingRouter.get(
    "/fetch-all-financial-years",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    // checkPermission,
    fetchAllFinancialYears
);
billingRouter.get(
    "/get-all-po-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllPurchaseOrder
);
billingRouter.get(
    "/get-purchase-order-details-with-items/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPurchaseOrderItemsOnPo
);
billingRouter.get(
    "/measurement/get-measurements-timeline-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMeasurementsTimeLineDetailsById
);
billingRouter.post(
    "/measurement/discard-measurement-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    discardMeasurementDetails
);
billingRouter.get(
    "/measurement/get-po-exists-or-not",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSamePoExistsOrNot
);
billingRouter.post(
    "/measurement/change-po-details-by-same-po",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePoInMeasurementDetails
);

// Billing Management -> Performa Invoice

/**
 * @swagger
 * /contractor/billing/performa-invoice/get-measurements-in-pi-status:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get measurements in PI status
 *     description: Retrieve a list of measurements in the PI status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of measurements in PI status fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of measurements in PI status fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-proforma-invoices:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all proforma invoices
 *     description: Retrieve a list of all proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of proforma invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of proforma invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/performa-invoice/get-measurements-in-pi-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMeasurementsInPIStatus
);
billingRouter.get(
    "/performa-invoice/get-all-proforma-invoices",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllProformaInvoices
);
billingRouter.post(
    "/performa-invoice/generate-proforma-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    generateProformaInvoice
);
billingRouter.get(
    "/performa-invoice/get-single-proforma-invoice/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getProformaInvoicesDetailsById
);
billingRouter.post(
    "/performa-invoice/update-proforma-invoice-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateProformaInvoiceDetails
);

// Billing Management -> Merged Performa Invoice

/**
 * @swagger
 * /contractor/billing/get-all-pi-merged-performa:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get all proforma invoices in merged PI
 *     description: Retrieve a list of all proforma invoices included in merged PI.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of proforma invoices in merged PI fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of proforma invoices in merged PI fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-merged-proforma-invoice:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all merged proforma invoices
 *     description: Retrieve a list of all merged proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of merged proforma invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of merged proforma invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/merged-performa/get-all-pi-merged-performa",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllProformaInvoicesInMergedPI
);
billingRouter.get(
    "/merged-performa/get-all-merged-proforma-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMergedProformaInvoice
);
billingRouter.get(
    "/merged-performa/get-merged-proforma-invoice/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMergedProformaInvoicesDetailsById
);
billingRouter.post(
    "/merged-performa/merged-proforma-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    mergedPi
);

// Billing Management -> Invoice

/**
 * @swagger
 * /contractor/billing/get-all-listing-pi-and-mpi:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get all listing PI and MPI
 *     description: Retrieve a list of all proforma invoices and merged proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all PI and MPI fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all PI and MPI fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-invoice-data:
 *   get:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Get all invoice data
 *     description: Retrieve a list of all invoice data.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all invoice data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all invoice data fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/invoice/get-all-listing-pi-and-mpi",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllProformaInvoicesInInvoice
);
billingRouter.get(
    "/invoice/get-all-invoice-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllInvoices
);
billingRouter.post(
    "/invoice/get-all-pi-listing",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPiList
);

billingRouter.post(
    "/invoice/create-invoice-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createInvoiceData
);
billingRouter.post(
    "/invoice/update-invoice-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateInvoiceData
);
billingRouter.get(
    "/invoice/get-all-invoice-data",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllInvoices
);
billingRouter.get(
    "/invoice/get-single-invoice-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getInvoiceDetailById
);
billingRouter.delete(
    "/invoice/delete-invoice-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteInvoiceData
);
billingRouter.post(
    "/invoice/discard-invoice/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    discardInvoice
);

// Billing Management -> Merge Invoice

/**
 * @swagger
 * /contractor/billing/get-all-merged-invoice:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all merged invoices
 *     description: Retrieve a list of all merged invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all merged invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all merged invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/merged-invoice/get-all-merged-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMergedInvoices
);
billingRouter.post(
    "/merged-invoice/merge-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    mergeInvoice
);
billingRouter.get(
    "/merged-invoice/get-merged-invoice-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMergedInvoiceDetailById
);
billingRouter.post(
    "/merged-invoice/discard-merged-invoice/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    discardMergedInvoice
);
// Billing Management -> Payments

/**
 * @swagger
 * /contractor/billing/get-all-invoice-in-payments:
 *   get:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Get all invoices in payments
 *     description: Retrieve a list of all invoices that are in the payments stage.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all invoices in payments fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all invoices in payments fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/payments/get-all-invoice-in-payments",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllInvoicesListingInPayments
);
billingRouter.post(
    "/payments/add-payment-to-invoice",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addPaymentReceive
);

// Billing Management -> Payment Received

/**
 * @swagger
 * /contractor/billing/listing-pv-number:
 *   get:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Listing PV Numbers
 *     description: Retrieve a list of payment voucher (PV) numbers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of PV numbers fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of PV numbers fetched successfully"
 *               data: [{ pv_number: 'PV001', // other fields }]
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /contractor/billing/get-payment-received-by-status:
 *   get:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Get Payment Received by Status
 *     description: Retrieve all payments received, filtered by status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments received by status fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payments received by status fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/payment-received/listing-pv-number",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    listingOfPvNumber
);
billingRouter.get(
    "/payment-received/get-payment-received-by-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllPaymentReceive
);
billingRouter.post(
    "/payment-received/update-payment-received-by-id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePaymentReceive
);

// Billing Management -> Retention Money

/**
 * @swagger
 * /contractor/billing/get-payment-received-in-retention-by-status:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get Payment Received in Retention by Status
 *     description: Retrieve all payments received in retention, filtered by status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments received in retention by status fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payments received in retention by status fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/billing/get-all-payment-retention:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get All Payment Retentions
 *     description: Retrieve all payment retention records.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payment retention records fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "All payment retention records fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

billingRouter.get(
    "/retention/get-payment-received-in-retention-by-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllPaymentReceiveInPayment
);
billingRouter.get(
    "/retention/get-all-payment-retention",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllPaymentRetention
);
billingRouter.get(
    "/retention/get-payment-retention-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPaymentRetentionDetailsById
);
billingRouter.post(
    "/retention/update-payment-retention",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePaymentReceiveInRetention
);
billingRouter.post(
    "/retention/update-payment-amount-retention",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePaymentAmountRetention
);
billingRouter.post(
    "/retention/approve-payment-retention",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approvePaymentRetention
);
billingRouter.post(
    "/retention/discard-payment-retention/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    discardPaymentRetention
);

module.exports = billingRouter;

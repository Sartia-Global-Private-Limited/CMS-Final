const {
    addAccountDetails,
    getAllAccountsDetails,
    accountDetailsbyId,
    updateAccountDetails,
    deleteAccountDetails,
    getTransactionByUser,
    addAmountToBankAccount,
} = require("../../controllers/accountsController");
const {
    getAllBankList,
    addBankDetails,
    bankList,
    bankDetailsById,
    updateBankDetails,
} = require("../../controllers/bankController");
const {
    createFinancialYears,
    fetchAllFinancialYears,
    updateFinancialYearById,
    fetchFinancialYearById,
    deleteFinancialYearById,
} = require("../../controllers/financialYearController");
const {
    createGstMasters,
    getAllGstMasterData,
    getGstMasterDetailsById,
    updateGstMasters,
    deleteGstMasterDetailsById,
    getGstDetailsOnStateId,
    getAllGstMasterDataForDropdown,
} = require("../../controllers/gstMasterController");
const {
    createOrder,
    updateOrder,
    getAllData,
    deleteOrderById,
    getAllOrderWithPagination,
    getOrderById,
} = require("../../controllers/orderController");

const {
    createInvoiceNumberFormat,
    getAllGeneratedInvoiceFormat,
    getAllGeneratedInvoiceFormatById,
    updateInvoiceNumberFormat,
    deleteGeneratedInvoiceFormatById,
    updateInvoiceNumberFormatStatus,
} = require("../../controllers/invoiceNumberFormatController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");
const {
    addPaymentMethod,
    getAllMethods,
    getAllMethodsForDropdown,
    deleteMethod,
    getMethodDetailById,
    updatePaymentMethod,
} = require("../../controllers/paymentMethodController");
const {
    createTutorial,
    getTutorials,
    getTutorialByFormat,
    updateTutorials,
    deleteTutorialsById,
    getTutorialById,
} = require("../../controllers/tutorialController");
const { updateProfile, getProfileDetails, changePassword } = require("../../controllers/superAdminController");
const { createEmployeeNumberFormat, getAllGeneratedEmployeeNumberFormat, getAllGeneratedEmployeeNumberFormatById, deleteEmployeeNumberFormatById, updateEmployeeNumberFormat, updateEmployeeNumberFormatStatus } = require("../../controllers/employeeNumberFormatController");
const { createClientVendorNumberFormat, getAllGeneratedClientVendorNumberFormat, getAllGeneratedClientVendorNumberFormatById, updateClientVendorNumberFormat, deleteClientVendorNumberFormatById, updateClientVendorNumberFormatStatus } = require("../../controllers/clientAndVendorNumberFormatController");
const { createItemNumberFormat, getAllGeneratedItemNumberFormat, getAllGeneratedItemNumberFormatById, updateItemNumberFormat, deleteItemNumberFormatById, updateItemNumberFormatStatus } = require("../../controllers/itemNumberFormatController");

const masterDataRouter = require("express").Router();

//-------------------------banks routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Banks
 *   description: API endpoints for managing bank details.
 */

/**
 * @swagger
 * /contractor/get-all-bank-list:
 *   get:
 *     summary: Get a list of all banks.
 *     tags: [Contractor Routes - Banks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all banks.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-bank-details:
 *   post:
 *     summary: Add new bank details.
 *     tags: [Contractor Routes - Banks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 description: Name of the bank.
 *               accountNumber:
 *                 type: string
 *                 description: Account number of the bank.
 *               branchCode:
 *                 type: string
 *                 description: Branch code of the bank.
 *               ifscCode:
 *                 type: string
 *                 description: IFSC code of the bank.
 *     responses:
 *       201:
 *         description: Bank details added successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-bank-list:
 *   get:
 *     summary: Get a filtered list of banks.
 *     tags: [Contractor Routes - Banks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A filtered list of banks.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-bank-details/{id}:
 *   get:
 *     summary: Get details of a specific bank by ID.
 *     tags: [Contractor Routes - Banks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bank to retrieve.
 *     responses:
 *       200:
 *         description: Bank details retrieved successfully.
 *       400:
 *         description: Bad request, invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Bank not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-bank-details:
 *   post:
 *     summary: Update bank details.
 *     tags: [Contractor Routes - Banks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankId:
 *                 type: string
 *                 description: ID of the bank to update.
 *               bankName:
 *                 type: string
 *                 description: Updated name of the bank.
 *               accountNumber:
 *                 type: string
 *                 description: Updated account number of the bank.
 *               branchCode:
 *                 type: string
 *                 description: Updated branch code of the bank.
 *               ifscCode:
 *                 type: string
 *                 description: Updated IFSC code of the bank.
 *     responses:
 *       200:
 *         description: Bank details updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Bank not found.
 *       500:
 *         description: Internal server error.
 */
masterDataRouter.get(
    "/bank/get-all-bank-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllBankList
);
masterDataRouter.post(
    "/bank/add-bank-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addBankDetails
);
masterDataRouter.get(
    "/bank/get-bank-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    bankList
);
masterDataRouter.get(
    "/bank/get-bank-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    bankDetailsById
);
masterDataRouter.post(
    "/bank/update-bank-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateBankDetails
);

//-------------------------Account management routes------------------------

/**
 * @swagger
 * /contractor/add-bank-account-details:
 *   post:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Add bank account details
 *     description: Endpoint to add bank account details for a contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The account number to add.
 *               bankName:
 *                 type: string
 *                 description: The name of the bank.
 *               ifscCode:
 *                 type: string
 *                 description: The IFSC code of the bank.
 *             required:
 *               - accountNumber
 *               - bankName
 *               - ifscCode
 *     responses:
 *       200:
 *         description: Bank account details added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Bank account details added successfully."
 *               data:
 *                 accountId: "12345"
 *                 accountNumber: "9876543210"
 *                 bankName: "ABC Bank"
 *       400:
 *         description: Bad request. Invalid or missing account details.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-account-details:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get all bank account details
 *     description: Retrieve a list of all bank account details for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bank accounts retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - accountId: "12345"
 *                   accountNumber: "9876543210"
 *                   bankName: "ABC Bank"
 *                 - accountId: "67890"
 *                   accountNumber: "1234567890"
 *                   bankName: "XYZ Bank"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/account-details-by-id/{id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get account details by ID
 *     description: Retrieve specific bank account details by account ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank account to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank account details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 accountId: "12345"
 *                 accountNumber: "9876543210"
 *                 bankName: "ABC Bank"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-account-details:
 *   post:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Update bank account details
 *     description: Endpoint to update existing bank account details for a contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: The ID of the account to update.
 *               accountNumber:
 *                 type: string
 *                 description: The new account number.
 *               bankName:
 *                 type: string
 *                 description: The new name of the bank.
 *               ifscCode:
 *                 type: string
 *                 description: The new IFSC code.
 *             required:
 *               - accountId
 *               - accountNumber
 *               - bankName
 *               - ifscCode
 *     responses:
 *       200:
 *         description: Bank account details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Bank account details updated successfully."
 *       400:
 *         description: Bad request. Invalid or missing account details.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-account-details/{id}:
 *   delete:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Delete bank account details
 *     description: Endpoint to delete bank account details for a contractor by account ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the account to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank account details deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Bank account details deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-account-transaction-history/{id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get transaction history
 *     description: Retrieve the transaction history for a specific bank account by account ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank account for which to retrieve transaction history.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - transactionId: "txn123"
 *                   amount: 500.00
 *                   date: "2024-08-20"
 *                 - transactionId: "txn124"
 *                   amount: 1000.00
 *                   date: "2024-08-21"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

masterDataRouter.post(
    "/accounts/add-bank-account-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addAccountDetails
);
masterDataRouter.get(
    "/accounts/get-all-account-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllAccountsDetails
);
masterDataRouter.get(
    "/accounts/account-details-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    accountDetailsbyId
);
masterDataRouter.post(
    "/accounts/update-account-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateAccountDetails
);
masterDataRouter.delete(
    "/accounts/delete-account-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteAccountDetails
);
masterDataRouter.get(
    "/accounts/get-account-transaction-history/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTransactionByUser
);

//financial year routes

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Financial Year
 *   description: API endpoints for managing financial years.
 */

/**
 * @swagger
 * /contractor/create-financial-year:
 *   post:
 *     tags: [Contractor Routes - Financial Year]
 *     summary: Create a new financial year
 *     description: Add a new financial year to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *             example:
 *               year: "2024"
 *               start_date: "2024-01-01"
 *               end_date: "2024-12-31"
 *     responses:
 *       201:
 *         description: Financial year created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-financial-year-by-id/{id}:
 *   put:
 *     tags: [Contractor Routes - Financial Year]
 *     summary: Update a financial year by ID
 *     description: Update details of an existing financial year using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the financial year to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *             example:
 *               year: "2024"
 *               start_date: "2024-01-01"
 *               end_date: "2024-12-31"
 *     responses:
 *       200:
 *         description: Financial year updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Financial year not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/fetch-all-financial-years:
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
 * /contractor/fetch-financial-year-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Financial Year]
 *     summary: Fetch a financial year by ID
 *     description: Retrieve details of a financial year based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the financial year to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Financial year details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Financial year details fetched successfully"
 *               data: { id: 1, year: "2024", start_date: "2024-01-01", end_date: "2024-12-31" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Financial year not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-financial-year-by-id/{id}:
 *   delete:
 *     tags: [Contractor Routes - Financial Year]
 *     summary: Delete a financial year by ID
 *     description: Remove a financial year from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the financial year to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Financial year deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Financial year not found
 *       500:
 *         description: Internal Server Error
 */
masterDataRouter.post(
    "/financial-year/create-financial-year",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createFinancialYears
);
masterDataRouter.put(
    "/financial-year/update-financial-year-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateFinancialYearById
);
masterDataRouter.get(
    "/financial-year/fetch-all-financial-years",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    fetchAllFinancialYears
);
masterDataRouter.get(
    "/financial-year/fetch-financial-year-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    fetchFinancialYearById
);
masterDataRouter.delete(
    "/financial-year/delete-financial-year-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteFinancialYearById
);

// -------------------------------- order via routes --------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Orders
 *   description: API endpoints for managing orders.
 */

/**
 * @swagger
 * /contractor/create-order:
 *   post:
 *     summary: Create a new order.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderData:
 *                 type: object
 *                 description: Data for the new order.
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-order:
 *   post:
 *     summary: Update an existing order.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to update.
 *               orderData:
 *                 type: object
 *                 description: Data to update the order with.
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-order:
 *   get:
 *     summary: Retrieve all orders.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-order-by-id/{id}:
 *   get:
 *     summary: Retrieve a specific order by its ID.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve.
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-order/{id}:
 *   delete:
 *     summary: Delete a specific order by its ID.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-order-pagination:
 *   get:
 *     summary: Retrieve all orders with pagination.
 *     tags: [Contractor Routes - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders with pagination retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
masterDataRouter.post(
    "/order-via/create-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createOrder
);
masterDataRouter.post(
    "/order-via/update-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateOrder
);
masterDataRouter.get(
    "/order-via/get-all-order",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllData
);
masterDataRouter.get(
    "/order-via/get-order-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getOrderById
);
masterDataRouter.delete(
    "/order-via/delete-order/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteOrderById
);
masterDataRouter.get(
    "/order-via/get-all-order-pagination",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllOrderWithPagination
);

//-------------------------------------Gst Masters routes--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - GST Masters
 *   description: API endpoints for managing GST master data.
 */

/**
 * @swagger
 * /contractor/save-gst-details:
 *   post:
 *     summary: Save GST details.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gstData:
 *                 type: object
 *                 description: GST details to be saved.
 *     responses:
 *       200:
 *         description: GST details saved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-saved-gst-masters:
 *   get:
 *     summary: Retrieve all saved GST master data.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all saved GST master data retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-saved-gst-details/{id}:
 *   get:
 *     summary: Retrieve GST master details by ID.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the GST master to retrieve details for.
 *     responses:
 *       200:
 *         description: GST master details retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: GST master not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-gst-details:
 *   post:
 *     summary: Update GST details.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gstData:
 *                 type: object
 *                 description: Updated GST details.
 *     responses:
 *       200:
 *         description: GST details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-gst-details/{id}:
 *   delete:
 *     summary: Delete GST master details by ID.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the GST master to delete.
 *     responses:
 *       200:
 *         description: GST master details deleted successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: GST master not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-gst-on-state-id/{id}:
 *   get:
 *     summary: Retrieve GST details based on state ID.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the state to retrieve GST details for.
 *     responses:
 *       200:
 *         description: GST details for the specified state retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: State or GST details not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-gst-list:
 *   get:
 *     summary: Retrieve all GST data for dropdown.
 *     tags: [Contractor Routes - GST Masters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all GST data for dropdown retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
masterDataRouter.post(
    "/tax/save-gst-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createGstMasters
);
masterDataRouter.get(
    "/tax/get-all-saved-gst-masters",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGstMasterData
);
masterDataRouter.get(
    "/tax/get-saved-gst-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getGstMasterDetailsById
);
masterDataRouter.post(
    "/tax/update-gst-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateGstMasters
);
masterDataRouter.delete(
    "/tax/delete-gst-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteGstMasterDetailsById
);
masterDataRouter.get(
    "/tax/get-gst-on-state-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getGstDetailsOnStateId
);
masterDataRouter.get(
    "/tax/get-all-gst-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGstMasterDataForDropdown
);

//---------------------------Invoice number format routes------------------------

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Invoice Number Format
 *     description: Routes for managing invoice number formats and related complaints.

 * /contractor/generate-invoice-number-format:
 *   post:
 *     summary: Generate a new invoice number format.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 description: The format for generating invoice numbers.
 *     responses:
 *       200:
 *         description: Invoice number format generated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-generate-invoice-formats:
 *   get:
 *     summary: Retrieve all generated invoice number formats.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all generated invoice number formats retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-invoice-number-format-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific invoice number format by ID.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the invoice number format to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the specific invoice number format retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-invoice-number-format:
 *   post:
 *     summary: Update an existing invoice number format.
 *     tags: [Contractor Routes - Invoice Number Format]
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
 *                 description: ID of the invoice number format to update.
 *               format:
 *                 type: string
 *                 description: The new format for generating invoice numbers.
 *     responses:
 *       200:
 *         description: Invoice number format updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-invoice-number-format-details/{id}:
 *   delete:
 *     summary: Delete a specific invoice number format by ID.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the invoice number format to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice number format deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

masterDataRouter.post(
    "/bill-format/generate-invoice-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createInvoiceNumberFormat
);
masterDataRouter.get(
    "/bill-format/get-all-generate-invoice-formats",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedInvoiceFormat
);
masterDataRouter.get(
    "/bill-format/get-invoice-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedInvoiceFormatById
);
masterDataRouter.post(
    "/bill-format/update-invoice-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateInvoiceNumberFormat
);
masterDataRouter.put(
    "/bill-format/update-invoice-number-format-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateInvoiceNumberFormatStatus
);
masterDataRouter.delete(
    "/bill-format/delete-invoice-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteGeneratedInvoiceFormatById
);

//-------------------------Employee Number Format Routes-----------------

masterDataRouter.post(
    "/employee-format/generate-employee-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createEmployeeNumberFormat,
    
);
masterDataRouter.get(
    "/employee-format/get-all-employee-number-formats",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedEmployeeNumberFormat,
    
);
masterDataRouter.get(
    "/employee-format/get-employee-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedEmployeeNumberFormatById,
);
masterDataRouter.post(
    "/employee-format/update-employee-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEmployeeNumberFormat,
    
);
masterDataRouter.put(
    "/employee-format/update-employee-number-format-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEmployeeNumberFormatStatus,
    
);
masterDataRouter.delete(
    "/employee-format/delete-employee-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteEmployeeNumberFormatById,
);

//-------------------------Client and Vendor Number Format Routes-----------------

masterDataRouter.post(
    "/client-vendor-format/generate-client-vendor-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createClientVendorNumberFormat,
);

masterDataRouter.get(
    "/client-vendor-format/get-all-client-vendor-number-formats",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedClientVendorNumberFormat,
);
masterDataRouter.get(
    "/client-vendor-format/get-client-vendor-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedClientVendorNumberFormatById,
);
masterDataRouter.post(
    "/client-vendor-format/update-client-vendor-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateClientVendorNumberFormat,
    
);
masterDataRouter.put(
    "/client-vendor-format/update-client-vendor-number-format-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateClientVendorNumberFormatStatus,
    
);
masterDataRouter.delete(
    "/client-vendor-format/delete-client-vendor-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteClientVendorNumberFormatById,
);


//-------------------------Item Number Format Routes-----------------
masterDataRouter.post(
    "/item-format/generate-item-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createItemNumberFormat,
);

masterDataRouter.get(
    "/item-format/get-all-item-number-formats",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedItemNumberFormat,
);
masterDataRouter.get(
    "/item-format/get-item-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGeneratedItemNumberFormatById,
);
masterDataRouter.post(
    "/item-format/update-item-number-format",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateItemNumberFormat,
);
masterDataRouter.put(
    "/item-format/update-item-number-format-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateItemNumberFormatStatus,
);
masterDataRouter.delete(
    "/item-format/delete-item-number-format-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteItemNumberFormatById,
);

//-------------------------Payment Methods routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Payment Methods
 *   description: API endpoints for managing payment methods.
 */

/**
 * @swagger
 * /contractor/add-payment-method:
 *   post:
 *     summary: Add a new payment method.
 *     tags: [Contractor Routes - Payment Methods]
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
 *                 description: Name of the payment method.
 *               details:
 *                 type: string
 *                 description: Details of the payment method.
 *     responses:
 *       200:
 *         description: Payment method added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-payment-methods:
 *   get:
 *     summary: Get a list of all payment methods.
 *     tags: [Contractor Routes - Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all payment methods.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-payment-methods-for-dropdown:
 *   get:
 *     summary: Get a list of payment methods for dropdown selection.
 *     tags: [Contractor Routes - Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of payment methods for dropdown.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-payment-methods/{id}:
 *   delete:
 *     summary: Delete a payment method by ID.
 *     tags: [Contractor Routes - Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment method to delete.
 *     responses:
 *       200:
 *         description: Payment method deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payment method not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-payment-method-details/{id}:
 *   get:
 *     summary: Get details of a single payment method by ID.
 *     tags: [Contractor Routes - Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment method.
 *     responses:
 *       200:
 *         description: Payment method details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payment method not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-payment-method:
 *   post:
 *     summary: Update details of a payment method.
 *     tags: [Contractor Routes - Payment Methods]
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
 *                 description: The ID of the payment method.
 *               name:
 *                 type: string
 *                 description: Updated name of the payment method.
 *               details:
 *                 type: string
 *                 description: Updated details of the payment method.
 *     responses:
 *       200:
 *         description: Payment method updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payment method not found.
 *       500:
 *         description: Internal server error.
 */
masterDataRouter.post(
    "/payment-method/add-payment-method",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addPaymentMethod
);
masterDataRouter.get(
    "/payment-method/get-all-payment-methods",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMethods
);
masterDataRouter.get(
    "/payment-method/get-all-payment-methods-for-dropdown",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllMethodsForDropdown
);
masterDataRouter.delete(
    "/payment-method/delete-payment-methods/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteMethod
);
masterDataRouter.get(
    "/payment-method/get-single-payment-method-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMethodDetailById
);
masterDataRouter.post(
    "/payment-method/update-payment-method",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePaymentMethod
);

masterDataRouter.post(
    "/add-balance/add-wallet-amount",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addAmountToBankAccount
);

module.exports = masterDataRouter;

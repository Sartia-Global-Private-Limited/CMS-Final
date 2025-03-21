const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const fundRouter = require("express").Router();

const {
    fundRequest,
    getAllFundRequests,
    getAllApprovedFundRequests,
    getAllRejectedFundRequests,
    getFundRequestById,
    updateFundRequest,
    deleteFundRequest,
    getFundRequestOnComplaintUniqueId,
    changeStatusOfFundRequest,
    getFundDetailsOnItemId,
    rejectFundRequest,
    getAllApprovedFundAndPartialTransfer,
    getPendingTransferFund,
    reActiveToRejectedFundRequest,
    getFundRequestFourLowPrice,
    getAllPreviousPrice,
    getAllOldItemInFunds,
    getLastThreePrevPrice,
    fundRequestImport,
    reschduleTransferFund,
} = require("../../controllers/fundRequestController");
const {
    getTransferFund,
    getALLTransferFund,
    getTotalTransferAmount,
    transferFundAmount,
    rescheduledTransferFund,
} = require("../../controllers/transferFundController");
const { getSupplierTransactions } = require("../../controllers/stockRequestController");
const { getItemPriceByBrand } = require("../../controllers/itemMasterController");
const {
    checklastBalanceOfWallets,
    checkLastBalanceOfEmployee,
    getBankTransactions,
    getUserTransactionHistory,
} = require("../../controllers/accountsController");

//-------------------------fund request routes-----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Fund Request
 *   description: Fund request routes
 */

/**
 * @swagger
 * /contractor/request-fund:
 *   post:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Request fund
 *     description: Create a new fund request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             request_data:
 *               - area_manager_id: 154
 *                 supervisor_id: 156
 *                 end_users_id: 191
 *                 request_fund:
 *                   - item_name:
 *                       label: new item
 *                       value: 16
 *                       unique_id: 123cms
 *                       rate: 23
 *                       description: '<p><strong><em>test for </em></strong><strong style="color: rgb(230, 0, 0);"><em>rahul</em></strong></p>'
 *                       image: "/item_masters/16989948490504k-2.jfif"
 *                     description: for this description
 *                     current_user_stock: 15
 *                     previous_price: 150
 *                     current_price: 23
 *                     request_quantity: 3
 *                     fund_amount: 69
 *                     price: 0
 *                     quantity: 0
 *                 total_request_amount: 69
 *
 *     responses:
 *       200:
 *         description: Fund request created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request created successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.post(
    "/fund-request/request-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    fundRequest
);

/**
 * @swagger
 * /contractor/get-all-fund-requested:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get all fund requests
 *     description: Retrieve a list of all fund requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of fund requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Request fetched successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.get(
    "/fund-request/get-all-fund-requested",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllFundRequests
);

/**
 * @swagger
 * /contractor/get-all-approved-fund-requested:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get all approved fund requests
 *     description: Retrieve a list of all approved fund requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of approved fund requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Request fetched successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.get(
    "/fund-request/get-all-approved-fund-requested",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApprovedFundRequests
);

/**
 * @swagger
 * /contractor/get-all-rejected-fund-requested:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get all rejected fund requests
 *     description: Retrieve a list of all rejected fund requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of rejected fund requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Request fetched successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.get(
    "/fund-request/get-all-rejected-fund-requested",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllRejectedFundRequests
);

/**
 * @swagger
 * /contractor/get-fund-request-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund request details
 *     description: Retrieve details of a specific fund request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the fund request
 *         example: 1
 *     responses:
 *       200:
 *         description: Fund request details
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
fundRouter.get(
    "/fund-request/get-fund-request-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getFundRequestById
);
fundRouter.post(
    "/contractor/import-fund-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    fundRequestImport
);

/**
 * @swagger
 * /contractor/update-fund-request-details:
 *   post:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Update fund request details
 *     description: Update the details of an existing fund request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fund_request_id:
 *                 type: integer
 *               complaint_id:
 *                 type: integer
 *               item_id:
 *                 type: integer
 *               amount_requested:
 *                 type: number
 *     responses:
 *       200:
 *         description: Fund request updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.post(
    "/fund-request/update-fund-request-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateFundRequest
);

/**
 * @swagger
 * /contractor/delete-fund-request/{id}:
 *   delete:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Delete fund request
 *     description: Delete a fund request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the fund request to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request deleted successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.delete(
    "/delete-fund-request/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    deleteFundRequest
);

/**
 * @swagger
 * /contractor/get-fund-request-by-complaint-id/{complaint_id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund request by complaint ID
 *     description: Retrieve a fund request associated with a specific complaint ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request by complaint ID
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
fundRouter.get(
    "/get-fund-request-by-complaint-id/:complaint_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getFundRequestOnComplaintUniqueId
);

/**
 * @swagger
 * /contractor/status-changed-of-request:
 *   post:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Change status of fund request
 *     description: Change the status of a fund request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fund_request_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, pending]
 *     responses:
 *       200:
 *         description: Fund request status changed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request status updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.post(
    "/fund-request/status-changed-of-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    changeStatusOfFundRequest
);

/**
 * @swagger
 * /contractor/get-fund-request-details-on-item-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund request details on item ID
 *     description: Retrieve fund request details based on a specific item ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request details on item ID
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
fundRouter.get(
    "/get-fund-request-details-on-item-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getFundDetailsOnItemId
);

/**
 * @swagger
 * /contractor/reject-fund-request/{id}:
 *   post:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Reject fund request
 *     description: Reject a specific fund request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the fund request to reject
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request rejected successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request rejected successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.put(
    "/fund-request/reject-fund-request/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    rejectFundRequest
);

/**
 * @swagger
 * /contractor/get-all-approved-fund-request-with-partial-fund-transfer:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get all approved fund requests with partial fund transfer
 *     description: Retrieve a list of approved fund requests with partial fund transfers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of approved fund requests with partial fund transfer
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
fundRouter.get(
    "/get-all-approved-fund-request-with-partial-fund-transfer",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApprovedFundAndPartialTransfer
);

/**
 * @swagger
 * /contractor/get-pending-transfer-fund:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get pending transfer fund
 *     description: Retrieve a list of fund requests with pending transfers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pending transfer funds
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ fund_request_id: 1, amount_pending: 100.00 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.get(
    "/fund-transfer/get-pending-transfer-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getPendingTransferFund
);
fundRouter.put(
    "/fund-transfer/reject-fund-request/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    rejectFundRequest
);

/**
 * @swagger
 * /contractor/transfer-fund:
 *   post:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Transfer fund
 *     description: Transfer a specific amount of funds from one account to another.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccountId:
 *                 type: string
 *                 description: The ID of the source account.
 *               toAccountId:
 *                 type: string
 *                 description: The ID of the destination account.
 *               amount:
 *                 type: number
 *                 description: The amount to transfer.
 *             required:
 *               - fromAccountId
 *               - toAccountId
 *               - amount
 *     responses:
 *       200:
 *         description: Fund transfer successful.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Fund transfer completed successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       400:
 *         description: Bad request. Insufficient funds or invalid account details.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/rescheduled-transfer-fund:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get all rescheduled fund transfers
 *     description: Retrieve a list of all rescheduled fund transfers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rescheduled fund transfers retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               rescheduledTransfers:
 *                 - transferId: "txn123"
 *                   fromAccountId: "12345"
 *                   toAccountId: "67890"
 *                   rescheduledDate: "2024-08-25"
 *                 - transferId: "txn124"
 *                   fromAccountId: "67890"
 *                   toAccountId: "12345"
 *                   rescheduledDate: "2024-08-26"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-transfer-fund:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get transfer fund
 *     description: Retrieve a list of funds that have been transferred.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transferred funds
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
fundRouter.post(
    "/fund-transfer/transfer-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    transferFundAmount
);
fundRouter.get(
    "/fund-transfer/rescheduled-transfer-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    reschduleTransferFund
);

fundRouter.get(
    "/fund-transfer/get-transfer-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getTransferFund
);

fundRouter.put(
    "/fund-transfer/rescheduled-transfer-fund/:id/:rescheduled_date",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    rescheduledTransferFund
);
/**
 * @swagger
 * /contractor/get-all-transfer-fund:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get all transfer funds
 *     description: Retrieve a list of all transfer funds.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all transfer funds
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

/**
 * @swagger
 * /contractor/get-check-last-balance/{bankId}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Check last balance of wallets
 *     description: Retrieve the last balance of wallets associated with a specific bank account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         description: The ID of the bank.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last balance of wallets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               lastBalance: 1500.00
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Wallet not found with the provided bank ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-check-last-balance-of-employee/{employeeId}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Check last balance of employee
 *     description: Retrieve the last balance of an employee's wallet.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         description: The ID of the employee.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last balance of employee's wallet retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               lastBalance: 200.00
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Employee wallet not found with the provided employee ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-bank-to-all-accounts-transaction/{id}/{type}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get bank to all accounts transaction details
 *     description: Retrieve all transaction details for a bank across all associated accounts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank.
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of transaction (e.g., "debit", "credit").
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank to all accounts transaction details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               transactions:
 *                 - transactionId: "txn123"
 *                   accountId: "12345"
 *                   amount: 500.00
 *                   date: "2024-08-20"
 *                 - transactionId: "txn124"
 *                   accountId: "67890"
 *                   amount: 1000.00
 *                   date: "2024-08-21"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank or transactions not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-transaction/{user_id}:
 *   get:
 *     summary: Retrieve transaction history for a specific user.
 *     tags: [Contractor Routes - Fund Management]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID of the user whose transaction history is to be retrieved.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's transaction history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

fundRouter.get(
    "/fund-transfer/get-all-transfer-fund",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getALLTransferFund
);
fundRouter.get(
    "/fund-balance/get-check-last-balance/:bankId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    checklastBalanceOfWallets
);
fundRouter.get(
    "/fund-balance/get-check-last-balance-of-employee/:employeeId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    checkLastBalanceOfEmployee
);
fundRouter.get(
    "/fund-transactions/get-bank-to-all-accounts-transaction/:id/:type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getBankTransactions
);
fundRouter.get(
    "/fund-transactions/get-user-transaction/:user_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUserTransactionHistory
);

/**
 * @swagger
 * /contractor/get-fund-request-details-by-request-for/{request_for_id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund request details by request for ID
 *     description: Retrieve fund request details by a specific request-for ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: request_for_id
 *         in: path
 *         required: true
 *         description: The ID of the request-for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request details by request-for ID
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: { fund_request_id: 1, amount_requested: 100.00, request_for_id: 1 }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
fundRouter.get(
    "/get-fund-request-details-by-request-for/:request_for_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllPreviousPrice
);

/**
 * @swagger
 * /contractor/get-fund-request-items-by-user-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund request items by user ID
 *     description: Retrieve a list of fund request items associated with a specific user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request items by user ID
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
fundRouter.get(
    "/fund-request/get-fund-request-items-by-user-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOldItemInFunds
);

module.exports = fundRouter;

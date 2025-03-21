const {
    checklastBalanceOfWallets,
    checkLastBalanceOfEmployee,
    getBankTransactions,
    getUserTransactionHistory,
} = require("../../controllers/accountsController");
const {
    getAllApprovedStockRequests,
    getAllStockRequests,
    getStockRequestsDetailsById,
    getAllOldItemInStocks,
    stockRequestDetailsUpdate,
    rejectStockRequest,
    updateStockRequestStatus,
    getAllRejectedStockRequests,
    getAllStocksRequests,
    getAllPendingStockTransfer,
    stocksAmountTransfer,
    getRescheduleTransferStock,
    getStockTransfer,
    updateBillNumber,
    rescheduledTransferstock,
    getAllStockTransfer,
    getSupplierTransactions,
    stockRequestSave,
} = require("../../controllers/stockRequestController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const stockRouter = require("express").Router();

// STOCK MANAGEMENT -> STOCK REQUEST

/**
 * @swagger
 * /contractor/stock/save-stock-request:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Save a new stock request
 *     description: Save a new stock request by the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Stock request details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { item_id: 1, quantity: 10, user_id: 1 }
 *     responses:
 *       200:
 *         description: Stock request saved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request saved successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-all-approved-requested-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all approved stock requests
 *     description: Retrieve a list of all approved stock requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all approved stock requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "approved" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-all-requested-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all requested stocks
 *     description: Retrieve a list of all requested stocks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all requested stocks
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "pending" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-single-requested-stock-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get single requested stock details
 *     description: Retrieve details of a specific stock request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the stock request
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock request details
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: { stock_request_id: 1, item_id: 1, quantity: 10, status: "approved" }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-all-items-in-stocks-by-userId/{id}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all items in stocks by user ID
 *     description: Retrieve all items in stocks for a specific user ID.
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
 *         description: Items in stocks by user ID
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ item_id: 1, quantity: 10 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/update-stock-request:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Update stock request details
 *     description: Update the details of an existing stock request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated stock request details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { stock_request_id: 1, item_id: 1, quantity: 15, status: "pending" }
 *     responses:
 *       200:
 *         description: Stock request updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/rejected-stock-request:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Reject a stock request
 *     description: Reject an existing stock request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Stock request rejection details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { stock_request_id: 1, reason: "Out of stock" }
 *     responses:
 *       200:
 *         description: Stock request rejected successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request rejected successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/change-stock-request:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Change stock request status
 *     description: Change the status of an existing stock request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Stock request status change details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { stock_request_id: 1, status: "approved" }
 *     responses:
 *       200:
 *         description: Stock request status changed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request status changed successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-all-rejected-requested-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all rejected stock requests
 *     description: Retrieve a list of all rejected stock requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all rejected stock requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "rejected" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/stock-request/get-all-stock-requests:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all stock requests
 *     description: Retrieve a list of all stock requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all stock requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "pending" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

stockRouter.post(
    "/save-stock-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    stockRequestSave
);
stockRouter.get(
    "/stock-request/get-all-approved-requested-stock",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApprovedStockRequests
);
stockRouter.get(
    "/stock-request/get-all-requested-stock",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllStockRequests
);
stockRouter.get(
    "/stock-request/get-single-requested-stock-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockRequestsDetailsById
);
stockRouter.get(
    "/stock-request/get-all-items-in-stocks-by-userId/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllOldItemInStocks
);
stockRouter.post(
    "/stock-request/update-stock-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    stockRequestDetailsUpdate
);
stockRouter.post(
    "/stock-request/rejected-stock-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    rejectStockRequest
);
stockRouter.post(
    "/stock-request/change-stock-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateStockRequestStatus
);
stockRouter.get(
    "/stock-request/get-all-rejected-requested-stock",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllRejectedStockRequests
);
stockRouter.get(
    "/stock-request/get-all-stock-requests",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllStocksRequests
);

// STOCK MANAGEMENT -> STOCK TRANSFER

/**
 * @swagger
 * /contractor/stock/transfer-stock/get-all-pending-stock-transfer-request:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all pending stock transfer requests
 *     description: Retrieve a list of all pending stock transfer requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all pending stock transfer requests
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "pending" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/stock-transfer:
 *   post:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Transfer stock amount
 *     description: Transfer the amount related to a stock transfer.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Stock amount transfer details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { stock_request_id: 1, amount: 1000, payment_method: "Bank Transfer" }
 *     responses:
 *       200:
 *         description: Stock amount transferred successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock amount transferred successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/get-reschedule-transfer-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Get rescheduled transfer stock details
 *     description: Retrieve details of rescheduled stock transfers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rescheduled transfer stock details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, rescheduled_date: "2024-08-01" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/get-transfer-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get transferred stock
 *     description: Retrieve a list of all transferred stock.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all transferred stock
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "transferred" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/update-transfer-bill-and-date:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Update transfer bill and date
 *     description: Update the transfer bill number and date for a stock transfer.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Transfer bill and date update details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { stock_request_id: 1, bill_number: "INV123", transfer_date: "2024-01-01" }
 *     responses:
 *       200:
 *         description: Transfer bill and date updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Transfer bill and date updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/rescheduled-stocks-transfer-stock/{id}/{rescheduled_date}:
 *   post:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Reschedule stock transfer
 *     description: Reschedule a stock transfer to a new date.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the stock transfer to reschedule
 *         schema:
 *           type: integer
 *       - name: rescheduled_date
 *         in: path
 *         required: true
 *         description: The new rescheduled date for the stock transfer
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Stock transfer rescheduled successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock transfer rescheduled successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock/transfer-stock/get-all-transfer-stock:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get all transferred stock
 *     description: Retrieve a list of all transferred stock.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all transferred stock
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ stock_request_id: 1, item_id: 1, quantity: 10, status: "transferred" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

stockRouter.get(
    "/transfer-stock/get-all-pending-stock-transfer-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllPendingStockTransfer
);
stockRouter.post(
    "/transfer-stock/stock-transfer",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    stocksAmountTransfer
);
stockRouter.get(
    "/transfer-stock/get-reschedule-transfer-stock", // api change
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getRescheduleTransferStock
);
stockRouter.get(
    "/transfer-stock/get-transfer-stock",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockTransfer
);
stockRouter.post(
    "/transfer-stock/update-transfer-bill-and-date",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateBillNumber
);
stockRouter.post(
    "/transfer-stock/rescheduled-stocks-transfer-stock/:id/:rescheduled_date",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    rescheduledTransferstock
);
stockRouter.get(
    "/transfer-stock/get-all-transfer-stock",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllStockTransfer
);

// STOCK MANAGEMENT -> STOCK BALANCE OVERVIEW

/**
 * @swagger
 * /contractor/stock/stock-balance/get-check-last-balance/{bankId}:
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
 * /contractor/stock/stock-balance/get-check-last-balance-of-employee/{employeeId}:
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
 * /contractor/stock/stock-balance/get-supplier-transaction/{id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get supplier transactions
 *     description: Retrieve a list of transactions made to a specific supplier ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier transactions
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

stockRouter.get(
    "/stock-balance/get-check-last-balance/:bankId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    checklastBalanceOfWallets
);
stockRouter.get(
    "/stock-balance/get-check-last-balance-of-employee/:employeeId",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    checkLastBalanceOfEmployee
);
stockRouter.get(
    "/get-supplier-transaction/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getSupplierTransactions
);

// STOCK MANAGEMENT -> STOCK TRANSACTIONS

/**
 * @swagger
 * /contractor/stock/stock-transactions/get-bank-to-all-accounts-transaction/{id}/{type}:
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
 * /contractor/stock/stock-transactions/get-user-transaction/{user_id}:
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

stockRouter.get(
    "/stock-transactions/get-bank-to-all-accounts-transaction/:id/:type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getBankTransactions
);
stockRouter.get(
    "/stock-transactions/get-user-transaction/:user_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUserTransactionHistory
);

module.exports = stockRouter;

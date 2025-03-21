const { lastBalanceOfEmployeeInExpense, getUserExpenseTransaction } = require("../../controllers/accountsController");
const {
    newStockTransfer,
    getStockTransferQuantity,
    getStockTransferQuantityById,
} = require("../../controllers/stockController");
const {
    getStockRequest,
    getStockRequestById,
    getAllStockPunchList,
    getAllApproveStockPunchList,
    getStockPunchById,
    approveStockPunch,
    getAllApproveStockPunchListById,
    stockPunch,
} = require("../../controllers/stockPunchController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const stockPunchRouter = require("express").Router();

// STOCK PUNCH MANAGEMENT -> STOCK PUNCH REQUEST

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-request/get-stock-request-month-wise:
 *   get:
 *     summary: Retrieve stock requests month-wise.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stock requests month-wise retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-request/get-all-stock-request-by-id/{id}:
 *   get:
 *     summary: Retrieve all stock requests by ID.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the stock request to retrieve.
 *     responses:
 *       200:
 *         description: List of stock requests by ID retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Stock request not found.
 *       500:
 *         description: Internal server error.
 */

stockPunchRouter.get(
    "/stock-punch-request/get-stock-request-month-wise",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockRequest
);
stockPunchRouter.get(
    "/stock-punch-request/get-all-stock-request-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getStockRequestById
);

// STOCK PUNCH MANAGEMENT -> STOCK PUNCH

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-request/get-all-stock-punch-list:
 *   get:
 *     summary: Retrieve all stock punches.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stock punches retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-approve/get-all-approve-stock-punch:
 *   get:
 *     summary: Retrieve a list of all approved stock punch.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved stock punch retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-approve/get-stock-punch-details/{id}/{complaint_id}:
 *   get:
 *     summary: Retrieve details of a specific stock punch.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the stock punch to retrieve.
 *       - in: path
 *         name: complaint_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID related to the stock punch.
 *     responses:
 *       200:
 *         description: Stock punch details retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Stock punch not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-approve/approve-stock-punch-quantity:
 *   post:
 *     summary: Approve stock punch quantity.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockId:
 *                 type: string
 *                 description: Stock ID to approve quantity for.
 *               quantity:
 *                 type: integer
 *                 description: Quantity to approve.
 *     responses:
 *       200:
 *         description: Stock punch quantity approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-approve/get-all-approve-stock-punch-by-id/{id}/{complaint_id}:
 *   get:
 *     summary: Retrieve approved stock punch list by ID and complaint ID.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the approved stock punch list.
 *         schema:
 *           type: string
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: Complaint ID to filter the approved stock punch list.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved stock punch list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/save-stock-punch:
 *   post:
 *     summary: Create a new stock punch.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockData:
 *                 type: object
 *                 description: Data for the stock punch.
 *     responses:
 *       201:
 *         description: Stock punch created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

stockPunchRouter.get(
    "/stock-punch-approve/get-all-stock-punch-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllStockPunchList
);
stockPunchRouter.get(
    "/stock-punch-approve/get-all-approve-stock-punch",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApproveStockPunchList
);
stockPunchRouter.get(
    "/stock-punch-approve/get-stock-punch-details/:id/:complaint_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockPunchById
);
stockPunchRouter.post(
    "/stock-punch-approve/approve-stock-punch-quantity",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    approveStockPunch
);
stockPunchRouter.get(
    "/stock-punch-approve/get-all-approve-stock-punch-by-id/:id/:complaint_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllApproveStockPunchListById
);
stockPunchRouter.post("/save-stock-punch", verifyToken([process.env.CONTRACTOR_ROLE_ID]), checkPermission, stockPunch); // api changed

// STOCK PUNCH MANAGEMENT -> STOCK PUNCH TRANSFER

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-transfer/get-stock-quantity-transfer:
 *   get:
 *     summary: Get the quantity of stock transferred.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock quantity transferred retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-transfer/get-stock-quantity-transfer-by-id/{transfered_by}/{transfered_to}:
 *   get:
 *     summary: Get the stock quantity transferred between two locations.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transfered_by
 *         schema:
 *           type: string
 *         required: true
 *         description: The location from which the stock was transferred.
 *       - in: path
 *         name: transfered_to
 *         schema:
 *           type: string
 *         required: true
 *         description: The location to which the stock was transferred.
 *     responses:
 *       200:
 *         description: Stock quantity transferred between the specified locations retrieved successfully.
 *       400:
 *         description: Bad request, invalid parameters.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Transfer record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-transfer/new-stock-transfer:
 *   post:
 *     summary: Perform a new stock transfer operation.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to transfer.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the item to transfer.
 *               sourceLocation:
 *                 type: string
 *                 description: The location from which the item is being transferred.
 *               destinationLocation:
 *                 type: string
 *                 description: The location to which the item is being transferred.
 *     responses:
 *       201:
 *         description: New stock transfer operation completed successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

stockPunchRouter.get(
    "/stock-punch-transfer/get-stock-quantity-transfer",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockTransferQuantity
); // function controller name change
stockPunchRouter.get(
    "/stock-punch-transfer/get-stock-quantity-transfer-by-id/:transfered_by/:transfered_to",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getStockTransferQuantityById
);
stockPunchRouter.post(
    "/stock-punch-transfer/new-stock-transfer",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    newStockTransfer
);

// STOCK PUNCH MANAGEMENT -> STOCK PUNCH BALANCE OVERVIEW

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-balance/get-last-balance-of-employee-in-stock-punch/{employeeId}:
 *   get:
 *     summary: Get the last balance of an employee in stock punch.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Employee ID to filter the last balance of an employee in stock punch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last balance of an employee in stock punch retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

stockPunchRouter.get(
    "/stock-punch-balance/get-last-balance-of-employee-in-stock-punch/:employeeId", // API change
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    lastBalanceOfEmployeeInExpense
);

// STOCK PUNCH MANAGEMENT -> VIEW STOCK PUNCH TRANSACTIONS

/**
 * @swagger
 * /contractor/stock-punch/stock-punch-transaction/get-expense-transaction-in-stock-punch/{user_id}:
 *   get:
 *     summary: Get expense transaction in stock punch.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: User ID to filter the expense transaction in stock punch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense transaction in stock punch retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

stockPunchRouter.get(
    "/stock-punch-transaction/get-expense-transaction-in-stock-punch/:user_id", // API change
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUserExpenseTransaction
);

module.exports = stockPunchRouter;

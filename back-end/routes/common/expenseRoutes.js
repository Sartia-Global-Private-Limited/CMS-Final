const {
    lastBalanceOfEmployeeInExpense,
    getUserExpenseTransaction,
    getUserWalletDetails,
} = require("../../controllers/accountsController");
const { getExpenseRequest, getExpenseRequestById } = require("../../controllers/expenseController");
const {
    getAllExpensePunchList,
    getListExpensePunchApprove,
    fundItemLists,
    getListExpensePunchApproveAccordingToItems,
    getExpensePunchById,
    updateExpensePunch,
    addExpensePunch,
} = require("../../controllers/expensePunchController");
const { getAllRegionalOfficeForDropdown } = require("../../controllers/regionalOfficeController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const expenseRouter = require("express").Router();

// EXPENSE MANAGEMENT -> EXPENSE REQUEST

/**
 * @swagger
 * /contractor/expense/expense-request/get-all-expense-request-by-month:
 *   get:
 *     summary: Retrieve all expense requests grouped by month.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all expense requests grouped by month.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-request/get-all-expense-request-by-id/{id}:
 *   get:
 *     summary: Retrieve all expense requests by ID.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense request.
 *     responses:
 *       200:
 *         description: Expense request details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense request not found.
 *       500:
 *         description: Internal server error.
 */

expenseRouter.get(
    "/expense-request/get-all-expense-request-by-month",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getExpenseRequest
);
expenseRouter.get(
    "/expense-request/get-all-expense-request-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getExpenseRequestById
);

// EXPENSE MANAGEMENT -> EXPENSE PUNCH

/**
 * @swagger
 * /contractor/expense/add-expense-punch:
 *   post:
 *     summary: Add a new expense punch.
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
 *               expenseData:
 *                 type: object
 *                 description: Data for the expense punch.
 *     responses:
 *       201:
 *         description: Expense punch added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/get-all-expense-punch-list:
 *   get:
 *     summary: Retrieve all expense punches.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all expense punches retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/get-list-expense-punch-approve:
 *   get:
 *     summary: Retrieve list of all expense punches approved.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved expense punches retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/get-user-fund-items-lists/{id}:
 *   get:
 *     summary: Retrieve fund items lists for a specific user.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve fund items lists for.
 *     responses:
 *       200:
 *         description: List of fund items for the user retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or fund items lists not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/get-user-wallet-details/{user_id}:
 *   get:
 *     summary: Retrieve wallet details for a specific user.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve wallet details for.
 *     responses:
 *       200:
 *         description: Wallet details for the user retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or wallet details not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/get-expense-punch-details/{id}/{user_id}:
 *   get:
 *     summary: Retrieve details of a specific expense punch.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense punch to retrieve.
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID related to the expense punch.
 *     responses:
 *       200:
 *         description: Expense punch details retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense punch not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/expense-punch/update-approve-qty:
 *   post:
 *     summary: Update approved quantity of an expense punch.
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
 *               expenseId:
 *                 type: string
 *                 description: ID of the expense punch to update.
 *               approvedQty:
 *                 type: number
 *                 description: Approved quantity for the expense punch.
 *     responses:
 *       200:
 *         description: Approved quantity updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/expense/get-list-expense-punch-approve_according_to_items:
 *   get:
 *     summary: Retrieve list of approved expense punches according to items.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved expense punches according to items retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

expenseRouter.post(
    "/add-expense-punch",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    addExpensePunch
);
expenseRouter.get(
    "/expense-punch/get-all-expense-punch-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllExpensePunchList
);
expenseRouter.get(
    "/expense-punch/get-list-expense-punch-approve",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getListExpensePunchApprove
);
expenseRouter.get(
    "/expense-punch/get-user-fund-items-lists/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    fundItemLists
);
expenseRouter.get(
    "/expense-punch/get-user-wallet-details/:user_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUserWalletDetails
);
expenseRouter.get(
    "/expense-punch/get-expense-punch-details/:id/:user_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getExpensePunchById
);
expenseRouter.put(
    "/expense-punch/update-approve-qty",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    updateExpensePunch
);

expenseRouter.get(
    "/expense-punch/get-all-regional-office-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getAllRegionalOfficeForDropdown
);
expenseRouter.get(
    "/expense-punch/get-list-expense-punch-approve_according_to_items",
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getListExpensePunchApproveAccordingToItems
);

// EXPENSE MANAGEMENT -> EXPENSE BALANCE OVERVIEW

/**
 * @swagger
 * /contractor/expense/expense-balance/get-last-balance-of-employee-in-expense/{employeeId}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get last balance of employee in expense
 *     description: Retrieve the last balance of an employee's wallet specifically in the context of expenses.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: false
 *         description: The ID of the employee (optional).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last balance of employee in expense retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               lastBalance: 200.00
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Employee wallet or expense record not found.
 *       500:
 *         description: Internal server error.
 */

expenseRouter.get(
    "/expense-balance/get-last-balance-of-employee-in-expense/:employeeId", // API CHANGE
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    lastBalanceOfEmployeeInExpense
);

// EXPENSE MANAGEMENT -> EXPENSE TRANSACTIONS

/**
 * @swagger
 * /contractor/expense/expense-transactions/get-expense-transaction-in-expense/{user_id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get user expense transactions
 *     description: Retrieve a list of all expense transactions for a specific user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User expense transactions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               transactions:
 *                 - transactionId: "txn123"
 *                   amount: 100.00
 *                   date: "2024-08-20"
 *                 - transactionId: "txn124"
 *                   amount: 50.00
 *                   date: "2024-08-21"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. User or transactions not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

expenseRouter.get(
    "/expense-transactions/get-expense-transaction-in-expense/:user_id", // API CHANGE
    verifyToken([process.env.CONTRACTOR_ROLE_ID]),
    checkPermission,
    getUserExpenseTransaction
);

module.exports = expenseRouter;

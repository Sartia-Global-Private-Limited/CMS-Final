const { getAllActivityLog, getActivityLogDetails } = require("../../controllers/activityLogController");
const { getAllCreatedAllowances, createAllowances } = require("../../controllers/allowanceController");
const { getAllCreatedDeductionTypes, createDeductionsType } = require("../../controllers/deductionsController");
const {
    getAllEmployeePromotionDemotion,
    employeeAddAction,
    getAllEmployeePromotionDemotionById,
    updateEmployeePromotionDemotionDetails,
} = require("../../controllers/employeePromotionDemotionController");
const {
    getPendingResignationRequests,
    getApprovedResignationRequests,
    getRejectedResignationRequests,
    getResignationDetailsById,
    resignationStatusUpdateByAdmin,
    updateResignationDetails,
    resignationRequestViewed,
    generateFnFStatement,
    getFnfStatement,
} = require("../../controllers/employeeResignationController");
const {
    registerPensionForEmployee,
    getAllRegisteredPension,
    getRegisteredPensionById,
    updatePensionDetails,
    deletePensionById,
} = require("../../controllers/employeeRetirementController");
const { trackEmployeeHistory } = require("../../controllers/employeeTrackingController");
const {
    createGroupInsurance,
    getAllGroupInsurance,
    getSingleGroupInsuranceDetails,
    updateGroupInsuranceDetails,
    deleteGroupInsurance,
} = require("../../controllers/groupInsuranceController");
const {
    getAllLoanRequests,
    createLoan,
    updateLoanStatus,
    getAllActiveLoan,
    getAllRejectedLoan,
    getAllClosedLoan,
    getLoanDetailById,
    updateLoanDetails,
    deleteLoanDetailById,
} = require("../../controllers/loanController");
const {
    getAllPayRollMasterSettings,
    updatePayrollSettings,
    updatePayrollSettingLabel,
    addPayrollMasterSettingLabel,
} = require("../../controllers/payrollMasterSettingController");
const { getUsersPaySlip, getUserPayslipDetailsById } = require("../../controllers/paySlipController");
const {
    getAllUserSalaryForDisbursal,
    getUserSalaryDisbursalDetailsById,
    markSalaryDisbursed,
} = require("../../controllers/salaryDisbursalController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const payrollRouter = require("express").Router();

/**
 * @swagger
 * /contractor/get-all-allowances:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all allowances
 *     description: Get a list of all created allowances.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of allowances retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - allowanceId: 1
 *                   allowanceName: "Housing Allowance"
 *                 - allowanceId: 2
 *                   allowanceName: "Transport Allowance"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-deductions:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all deductions
 *     description: Get a list of all created deduction types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deductions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - deductionId: 1
 *                   deductionName: "Tax"
 *                 - deductionId: 2
 *                   deductionName: "Social Security"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.get(
    "/get-payroll/get-all-allowances",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCreatedAllowances
);
payrollRouter.get(
    "/get-payroll/get-all-deductions",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCreatedDeductionTypes
);

/**
 * @swagger
 * /contractor/create-new-payroll-settings:
 *   post:
 *     tags: [Contractor - Payroll Master Settings]
 *     summary: Create a new payroll master setting label
 *     description: Create a new payroll master setting label for contractors.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Overtime Pay"
 *               defaultValue:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: New payroll master setting label created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "New payroll master setting label created successfully."
 *               setting:
 *                 id: "setting123"
 *                 label: "Overtime Pay"
 *                 defaultValue: 1000
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-payroll-master-settings:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all payroll master settings
 *     description: Get all payroll master settings.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payroll master settings retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - settingId: 1
 *                   settingName: "Payroll Frequency"
 *                   settingValue: "Monthly"
 *                 - settingId: 2
 *                   settingName: "Pay Period"
 *                   settingValue: "1st to 30th"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-payroll-master-settings:
 *   post:
 *     tags: [Contractor - Payroll Master Settings]
 *     summary: Update payroll master settings
 *     description: Update the payroll master settings for contractors.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settingName:
 *                 type: string
 *                 example: "Basic Salary"
 *               value:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       200:
 *         description: Payroll master settings updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payroll master settings updated successfully."
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-payroll-master-settings-label:
 *   post:
 *     tags: [Contractor - Payroll Master Settings]
 *     summary: Update payroll master settings label
 *     description: Update the label of a payroll master setting for contractors.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldLabel:
 *                 type: string
 *                 example: "Basic Salary"
 *               newLabel:
 *                 type: string
 *                 example: "Base Salary"
 *     responses:
 *       200:
 *         description: Payroll master settings label updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payroll master settings label updated successfully."
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/create-allowances:
 *   post:
 *     tags: [Contractor - Allowances and Deductions Management]
 *     summary: Create a new allowance
 *     description: Add a new allowance for contractors.
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
 *                 example: Housing Allowance
 *               amount:
 *                 type: number
 *                 example: 500.00
 *     responses:
 *       201:
 *         description: Allowance created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Allowance created successfully."
 *               allowance:
 *                 id: "allowance123"
 *                 name: "Housing Allowance"
 *                 amount: 500.00
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/create-deductions:
 *   post:
 *     tags: [Contractor - Allowances and Deductions Management]
 *     summary: Create a new deduction type
 *     description: Add a new deduction type for contractors.
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
 *                 example: Tax Deduction
 *               amount:
 *                 type: number
 *                 example: 150.00
 *     responses:
 *       201:
 *         description: Deduction type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Deduction type created successfully."
 *               deduction:
 *                 id: "deduction123"
 *                 name: "Tax Deduction"
 *                 amount: 150.00
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

payrollRouter.post(
    "/payroll-master/create-new-payroll-settings",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addPayrollMasterSettingLabel
);

payrollRouter.get(
    "/payroll-master/get-all-payroll-master-settings/:id?",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllPayRollMasterSettings
);

payrollRouter.post(
    "/payroll-master/update-payroll-master-settings",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePayrollSettings
);

payrollRouter.post(
    "/payroll-master/update-payroll-master-settings-label",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePayrollSettingLabel
);

payrollRouter.post(
    "/payroll-master/create-allowances",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createAllowances
);
payrollRouter.post(
    "/payroll-master/create-deductions",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createDeductionsType
);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Group Insurance Management
 *     description: Operations related to managing group insurance policies.
 */

/**
 * @swagger
 * /contractor/create-group-insurance:
 *   post:
 *     tags: [Contractor - Group Insurance Management]
 *     summary: Create a new group insurance policy
 *     description: Add a new group insurance policy to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the group insurance policy to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insuranceName:
 *                 type: string
 *                 description: The name of the insurance policy.
 *                 example: "Health Insurance"
 *               coverageDetails:
 *                 type: string
 *                 description: Details of the coverage provided by the insurance policy.
 *                 example: "Covers medical expenses up to $100,000."
 *               premium:
 *                 type: number
 *                 description: The premium amount for the insurance policy.
 *                 example: 500
 *               validityPeriod:
 *                 type: string
 *                 format: date
 *                 description: The validity period of the insurance policy.
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Group insurance policy created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group insurance policy created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-group-insurance-list:
 *   get:
 *     tags: [Contractor - Group Insurance Management]
 *     summary: Get all group insurance policies
 *     description: Retrieve a list of all group insurance policies available in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of group insurance policies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - insuranceId: 1
 *                   insuranceName: "Health Insurance"
 *                   coverageDetails: "Covers medical expenses up to $100,000."
 *                   premium: 500
 *                   validityPeriod: "2024-12-31"
 *                 - insuranceId: 2
 *                   insuranceName: "Life Insurance"
 *                   coverageDetails: "Covers life insurance up to $200,000."
 *                   premium: 1000
 *                   validityPeriod: "2024-12-31"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-group-insurance-single-details/{id}:
 *   get:
 *     tags: [Contractor - Group Insurance Management]
 *     summary: Get group insurance details by ID
 *     description: Retrieve details of a specific group insurance policy identified by its ID.
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
 *         description: Group insurance policy details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 insuranceId: 1
 *                 insuranceName: "Health Insurance"
 *                 coverageDetails: "Covers medical expenses up to $100,000."
 *                 premium: 500
 *                 validityPeriod: "2024-12-31"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-group-insurance-details:
 *   post:
 *     tags: [Contractor - Group Insurance Management]
 *     summary: Update group insurance policy details
 *     description: Update the details of an existing group insurance policy.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the group insurance policy.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insuranceId:
 *                 type: integer
 *                 description: The ID of the insurance policy to update.
 *                 example: 1
 *               insuranceName:
 *                 type: string
 *                 description: The updated name of the insurance policy.
 *                 example: "Health Insurance"
 *               coverageDetails:
 *                 type: string
 *                 description: Updated details of the coverage.
 *                 example: "Covers medical expenses up to $150,000."
 *               premium:
 *                 type: number
 *                 description: Updated premium amount.
 *                 example: 600
 *               validityPeriod:
 *                 type: string
 *                 format: date
 *                 description: Updated validity period of the policy.
 *                 example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Group insurance policy details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group insurance policy details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-group-insurance-details/{id}:
 *   delete:
 *     tags: [Contractor - Group Insurance Management]
 *     summary: Delete a group insurance policy
 *     description: Delete a specific group insurance policy identified by its ID.
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
 *         description: Group insurance policy deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group insurance policy deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.post(
    "/group-insurance/create-group-insurance",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createGroupInsurance
);
payrollRouter.get(
    "/group-insurance/get-group-insurance-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllGroupInsurance
);
payrollRouter.get(
    "/group-insurance/get-group-insurance-single-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSingleGroupInsuranceDetails
);
payrollRouter.post(
    "/group-insurance/update-group-insurance-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateGroupInsuranceDetails
);
payrollRouter.delete(
    "/group-insurance/delete-group-insurance-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteGroupInsurance
);

//loans modules

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/create-loans:
 *   post:
 *     summary: Create a new loan request.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount of the loan requested.
 *               term:
 *                 type: integer
 *                 description: Term of the loan in months.
 *               reason:
 *                 type: string
 *                 description: Reason for the loan request.
 *     responses:
 *       200:
 *         description: Loan request created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/get-all-loans-pending:
 *   get:
 *     summary: Get all pending loan requests.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pending loan requests.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/get-all-loans-active:
 *   get:
 *     summary: Get all active loans.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active loans.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/get-all-loans-reject:
 *   get:
 *     summary: Get all rejected loan requests.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rejected loan requests.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/get-all-loans-closed:
 *   get:
 *     summary: Get all closed loans.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all closed loans.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/get-loan-details/{id}:
 *   get:
 *     summary: Get details of a specific loan by ID.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the loan.
 *     responses:
 *       200:
 *         description: Details of the specified loan.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Loan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/update-loan-details:
 *   post:
 *     summary: Update details of an existing loan.
 *     tags: [Contractor Routes - Loans Management]
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
 *                 description: ID of the loan to be updated.
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Updated amount of the loan.
 *               term:
 *                 type: integer
 *                 description: Updated term of the loan in months.
 *               reason:
 *                 type: string
 *                 description: Updated reason for the loan.
 *     responses:
 *       200:
 *         description: Loan details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/changed-loan-status:
 *   post:
 *     summary: Change the status of a loan.
 *     tags: [Contractor Routes - Loans Management]
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
 *                 description: ID of the loan.
 *               status:
 *                 type: string
 *                 description: New status for the loan (e.g., approved, rejected).
 *     responses:
 *       200:
 *         description: Loan status changed successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Loans Management
 *     description: Routes for managing loan requests and statuses.

 * /contractor/delete-loan-details/{id}:
 *   post:
 *     summary: Delete a loan by ID.
 *     tags: [Contractor Routes - Loans Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the loan to be deleted.
 *     responses:
 *       200:
 *         description: Loan deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Loan not found.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.post(
    "/loan/create-loans",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createLoan
);
payrollRouter.get(
    "/loan/get-all-loans-pending",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllLoanRequests
);
payrollRouter.get(
    "/loan/get-all-loans-active",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllActiveLoan
);
payrollRouter.get(
    "/loan/get-all-loans-reject",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllRejectedLoan
);
payrollRouter.get(
    "/loan/get-all-loans-closed",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllClosedLoan
);
payrollRouter.get(
    "/loan/get-loan-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getLoanDetailById
);
payrollRouter.post(
    "/loan/update-loan-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateLoanDetails
);
payrollRouter.post(
    "/loan/changed-loan-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateLoanStatus
);
payrollRouter.post(
    "/loan/delete-loan-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteLoanDetailById
);

/**
 * @swagger
 * /contractor/get-users-pay-slip:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve users' pay slips
 *     description: Get a list of pay slips for users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users' pay slips retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - paySlipId: 1
 *                   userId: 1
 *                   payPeriod: "2024-07"
 *                   totalEarnings: 5000
 *                   totalDeductions: 1000
 *                   netPay: 4000
 *                 - paySlipId: 2
 *                   userId: 2
 *                   payPeriod: "2024-07"
 *                   totalEarnings: 5500
 *                   totalDeductions: 1200
 *                   netPay: 4300
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-pay-slip-details:
 *   get:
 *     tags: [Contractor - Salary Management]
 *     summary: Get pay slip details by user ID
 *     description: Retrieve the pay slip details for a specific user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pay slip details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 paySlipUrl: /files/pay-slips/2024-08-15/user1.pdf
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Pay slip details not found.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.get(
    "/pay-slip/get-users-pay-slip",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getUsersPaySlip
);
payrollRouter.get(
    "/pay-slip/get-user-pay-slip-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getUserPayslipDetailsById
);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Employee Promotion and Demotion
 *     description: Operations related to employee promotion and demotion.
 */

/**
 * @swagger
 * /contractor/employee-promotion-demotion-add:
 *   post:
 *     tags: [Contractor - Employee Promotion and Demotion]
 *     summary: Add an employee promotion or demotion
 *     description: Create a new record for employee promotion or demotion.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the employee promotion or demotion to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee.
 *                 example: 1
 *               actionType:
 *                 type: string
 *                 description: Type of action (Promotion or Demotion).
 *                 example: "Promotion"
 *               newPosition:
 *                 type: string
 *                 description: The new position of the employee.
 *                 example: "Senior Developer"
 *               effectiveDate:
 *                 type: string
 *                 format: date
 *                 description: The date when the promotion or demotion takes effect.
 *                 example: "2024-08-15"
 *     responses:
 *       200:
 *         description: Employee promotion or demotion added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee promotion/demotion added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/employee-promotion-demotion-get-all-list:
 *   get:
 *     tags: [Contractor - Employee Promotion and Demotion]
 *     summary: Retrieve all employee promotion and demotion records
 *     description: Get a list of all employee promotion and demotion records.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employee promotion and demotion records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - promotionDemotionId: 1
 *                   employeeId: 1
 *                   actionType: "Promotion"
 *                   newPosition: "Senior Developer"
 *                   effectiveDate: "2024-08-15"
 *                 - promotionDemotionId: 2
 *                   employeeId: 2
 *                   actionType: "Demotion"
 *                   newPosition: "Junior Developer"
 *                   effectiveDate: "2024-08-16"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/single-employee-promotion-demotion-details/{id}:
 *   get:
 *     tags: [Contractor - Employee Promotion and Demotion]
 *     summary: Retrieve a single employee promotion or demotion record
 *     description: Get details of a specific employee promotion or demotion record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the promotion or demotion record.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee promotion or demotion details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 promotionDemotionId: 1
 *                 employeeId: 1
 *                 actionType: "Promotion"
 *                 newPosition: "Senior Developer"
 *                 effectiveDate: "2024-08-15"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-employee-promotion-demotion-details:
 *   post:
 *     tags: [Contractor - Employee Promotion and Demotion]
 *     summary: Update an employee promotion or demotion record
 *     description: Update details of an existing employee promotion or demotion record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the employee promotion or demotion to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotionDemotionId:
 *                 type: integer
 *                 description: The ID of the promotion or demotion record.
 *                 example: 1
 *               actionType:
 *                 type: string
 *                 description: Type of action (Promotion or Demotion).
 *                 example: "Demotion"
 *               newPosition:
 *                 type: string
 *                 description: The new position of the employee.
 *                 example: "Junior Developer"
 *               effectiveDate:
 *                 type: string
 *                 format: date
 *                 description: The date when the promotion or demotion takes effect.
 *                 example: "2024-08-20"
 *     responses:
 *       200:
 *         description: Employee promotion or demotion updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee promotion/demotion updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.post(
    "/promotion-demotion/employee-promotion-demotion-add",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    employeeAddAction
);
payrollRouter.get(
    "/promotion-demotion/employee-promotion-demotion-get-all-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllEmployeePromotionDemotion
);
payrollRouter.get(
    "/promotion-demotion/single-employee-promotion-demotion-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getAllEmployeePromotionDemotionById
);
payrollRouter.post(
    "/promotion-demotion/update-employee-promotion-demotion-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateEmployeePromotionDemotionDetails
);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Resignation and FnF Statements
 *     description: Operations related to employee resignation requests and FnF statements.
 */

/**
 * @swagger
 * /contractor/get-resignations-pending-request:
 *   get:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Retrieve all pending resignation requests
 *     description: Get a list of all resignation requests that are pending.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending resignation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - resignationId: 1
 *                   employeeId: 1
 *                   requestDate: "2024-08-15"
 *                   status: "Pending"
 *                 - resignationId: 2
 *                   employeeId: 2
 *                   requestDate: "2024-08-16"
 *                   status: "Pending"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-resignations-approved-list:
 *   get:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Retrieve all approved resignation requests
 *     description: Get a list of all resignation requests that have been approved.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved resignation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - resignationId: 3
 *                   employeeId: 3
 *                   requestDate: "2024-08-10"
 *                   status: "Approved"
 *                 - resignationId: 4
 *                   employeeId: 4
 *                   requestDate: "2024-08-12"
 *                   status: "Approved"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-resignations-rejected-list:
 *   get:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Retrieve all rejected resignation requests
 *     description: Get a list of all resignation requests that have been rejected.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected resignation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - resignationId: 5
 *                   employeeId: 5
 *                   requestDate: "2024-08-08"
 *                   status: "Rejected"
 *                 - resignationId: 6
 *                   employeeId: 6
 *                   requestDate: "2024-08-11"
 *                   status: "Rejected"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-resignation-details/{id}:
 *   get:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Retrieve details of a single resignation request
 *     description: Get details of a specific resignation request by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the resignation request.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the resignation request retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 resignationId: 1
 *                 employeeId: 1
 *                 requestDate: "2024-08-15"
 *                 status: "Pending"
 *                 reason: "Personal reasons"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-resignations-details:
 *   post:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Update resignation request details
 *     description: Update details of an existing resignation request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the resignation request to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resignationId:
 *                 type: integer
 *                 description: The ID of the resignation request.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: Updated status of the resignation request.
 *                 example: "Approved"
 *               reason:
 *                 type: string
 *                 description: Updated reason for resignation.
 *                 example: "Health issues"
 *     responses:
 *       200:
 *         description: Resignation request updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/viewed-resignations-request/{id}:
 *   post:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Mark resignation request as viewed
 *     description: Update the status of a resignation request to 'viewed' by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the resignation request.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resignation request marked as viewed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request marked as viewed successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-resignations-request-by-admin/{id}/{status}:
 *   post:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Update resignation request status by admin
 *     description: Change the status of a resignation request by admin.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the resignation request.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: status
 *         in: path
 *         description: The new status of the resignation request.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Approved"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resignation request status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/generate-fnf-statements:
 *   post:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Generate FnF (Full and Final) statements
 *     description: Create FnF statements for employees who have resigned.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for generating FnF statements.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee.
 *                 example: 1
 *               resignationId:
 *                 type: integer
 *                 description: The ID of the resignation request.
 *                 example: 1
 *     responses:
 *       200:
 *         description: FnF statements generated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: FnF statements generated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-fnf-statements:
 *   get:
 *     tags: [Contractor - Resignation and FnF Statements]
 *     summary: Retrieve FnF statements
 *     description: Get a list of all generated FnF statements.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of FnF statements retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - fnfStatementId: 1
 *                   employeeId: 1
 *                   amount: 1000
 *                   generatedDate: "2024-08-20"
 *                 - fnfStatementId: 2
 *                   employeeId: 2
 *                   amount: 1500
 *                   generatedDate: "2024-08-21"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.get(
    "/resignation/get-resignations-pending-request",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getPendingResignationRequests
);
payrollRouter.get(
    "/resignation/get-resignations-approved-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getApprovedResignationRequests
);
payrollRouter.get(
    "/resignation/get-resignations-rejected-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRejectedResignationRequests
);
payrollRouter.get(
    "/resignation/get-single-resignation-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getResignationDetailsById
);
payrollRouter.post(
    "/resignation/update-resignations-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateResignationDetails
);
payrollRouter.post(
    "/resignation/viewed-resignations-request/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    resignationRequestViewed
);
payrollRouter.put(
    "/resignation/update-resignations-request-by-admin/:id/:status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    resignationStatusUpdateByAdmin
);
payrollRouter.post(
    "/resignation/generate-fnf-statements",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    generateFnFStatement
);
payrollRouter.get(
    "/resignation/get-fnf-statements",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getFnfStatement
);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Employee Pension
 *     description: Operations related to employee pension registration and management.
 */

/**
 * @swagger
 * /contractor/register-employee-pension:
 *   post:
 *     tags: [Contractor - Employee Pension]
 *     summary: Register pension for an employee
 *     description: Create a new pension record for an employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the pension to be registered.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee.
 *                 example: 1
 *               pensionAmount:
 *                 type: number
 *                 format: float
 *                 description: The amount of pension to be registered.
 *                 example: 2000.00
 *               registrationDate:
 *                 type: string
 *                 format: date
 *                 description: The date the pension is registered.
 *                 example: "2024-08-15"
 *     responses:
 *       200:
 *         description: Pension registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pension registered successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-registered-pension-list:
 *   get:
 *     tags: [Contractor - Employee Pension]
 *     summary: Retrieve all registered pensions
 *     description: Get a list of all registered pension records.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registered pensions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - pensionId: 1
 *                   employeeId: 1
 *                   pensionAmount: 2000.00
 *                   registrationDate: "2024-08-15"
 *                 - pensionId: 2
 *                   employeeId: 2
 *                   pensionAmount: 2500.00
 *                   registrationDate: "2024-08-16"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-registered-pension-details/{id}:
 *   get:
 *     tags: [Contractor - Employee Pension]
 *     summary: Retrieve details of a single registered pension
 *     description: Get details of a specific registered pension by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the pension record.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the registered pension retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 pensionId: 1
 *                 employeeId: 1
 *                 pensionAmount: 2000.00
 *                 registrationDate: "2024-08-15"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-registered-pension:
 *   post:
 *     tags: [Contractor - Employee Pension]
 *     summary: Update details of a registered pension
 *     description: Update the details of an existing pension record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the pension record to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pensionId:
 *                 type: integer
 *                 description: The ID of the pension record.
 *                 example: 1
 *               pensionAmount:
 *                 type: number
 *                 format: float
 *                 description: Updated amount of the pension.
 *                 example: 2200.00
 *               registrationDate:
 *                 type: string
 *                 format: date
 *                 description: Updated date of registration.
 *                 example: "2024-08-16"
 *     responses:
 *       200:
 *         description: Pension record updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pension record updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-register-employee-pension/{id}:
 *   delete:
 *     tags: [Contractor - Employee Pension]
 *     summary: Delete a registered pension record
 *     description: Remove a pension record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the pension record to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pension record deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pension record deleted successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.post(
    "/pension/register-employee-pension",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    registerPensionForEmployee
);
payrollRouter.get(
    "/pension/get-all-registered-pension-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllRegisteredPension
);
payrollRouter.get(
    "/pension/get-single-registered-pension-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getRegisteredPensionById
);
payrollRouter.post(
    "/pension/update-registered-pension",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePensionDetails
);
payrollRouter.delete(
    "/pension/delete-register-employee-pension/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deletePensionById
);

/**
 * @swagger
 * /contractor/get-employee-history-details/{id}:
 *   get:
 *     tags: [Contractor - Employee History & Activity Logs]
 *     summary: Get employee history details
 *     description: Retrieve the history details of a specific employee by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the employee whose history details are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee history details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 employeeId: 1
 *                 history:
 *                   - action: "Promotion"
 *                     date: "2024-08-10"
 *                     details: "Promoted to Senior Developer"
 *                   - action: "Salary Update"
 *                     date: "2024-08-15"
 *                     details: "Salary increased to $5000"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */
payrollRouter.get(
    "/employee-tracking/get-employee-history-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    trackEmployeeHistory
);

payrollRouter.get(
    "/employee-logs/get-all-activity-logs",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllActivityLog
);
payrollRouter.get(
    "/employee-logs/get-single-activity-logs/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getActivityLogDetails
);

/**
 * @swagger
 * /contractor/get-salary-disbursal:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve salary disbursal information
 *     description: Get a list of salaries scheduled for disbursal.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of salary disbursals retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - salaryId: 1
 *                   userId: 1
 *                   amount: 5000
 *                   disbursalDate: "2024-08-15"
 *                 - salaryId: 2
 *                   userId: 2
 *                   amount: 5500
 *                   disbursalDate: "2024-08-15"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-salary-disbursal-details:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve salary disbursal details
 *     description: Get detailed information about a specific salary disbursal.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salary disbursal details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 salaryId: 1
 *                 userId: 1
 *                 amount: 5000
 *                 disbursalDate: "2024-08-15"
 *                 details: "Regular salary for August."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-salary-disbursed:
 *   post:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Mark salary as disbursed
 *     description: Update the status of a salary to indicate it has been disbursed.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the salary to be marked as disbursed.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salaryId:
 *                 type: integer
 *                 description: The ID of the salary to be marked as disbursed.
 *                 example: 1
 *               disbursedDate:
 *                 type: string
 *                 format: date
 *                 description: The date the salary was disbursed.
 *                 example: "2024-08-15"
 *     responses:
 *       200:
 *         description: Salary marked as disbursed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Salary marked as disbursed successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

payrollRouter.get(
    "/salary-disbursal/get-salary-disbursal",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllUserSalaryForDisbursal
);

payrollRouter.get(
    "/salary-disbursal/get-salary-disbursal-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getUserSalaryDisbursalDetailsById
);

payrollRouter.put(
    "/salary-disbursal/mark-salary-disbursed",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    markSalaryDisbursed
);

module.exports = payrollRouter;

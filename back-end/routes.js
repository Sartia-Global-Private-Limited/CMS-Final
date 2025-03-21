const express = require("express");
const {
    PERMISSIONS: { CREATE, VIEW, UPDATE, DELETE },
    getAllClientAndVendorCompanies,
} = require("./helpers/commonHelper");
const {
    getComplaintTypes,
    measurementDetailsWithPo,
    ItemsOnMeasurementId,
} = require("./controllers/measurementController");
const { getAllComplaintList, getOutletDetails } = require("./controllers/earthingTestingController");
const { getAllPositionOfCompanyContacts } = require("./controllers/companyContactController");
const { getSuppliers } = require("./controllers/suppliersController");
const { getAllUnitDataForDropdown } = require("./controllers/unitController");
const { allCountries, getStates, allCities } = require("./controllers/generalController");
const { verify } = require("jsonwebtoken");
const {
    addSubCategory,
    updateSubCategory,
    subCategoryList,
    subCategoryById,
    deleteSubCategory,
} = require("./controllers/subCategoryController");
const { getAllBrandsMarkDown } = require("./controllers/brandController");
const {
    getRoForDropdown,
    getSalesAreaForDropdown,
    getOutletForDropdown,
    getComplaintTypeForDropdown,
    getBillingFromForDropdown,
    getBillingToForDropdown,
    getPoForDropdown,
    getRetentinIdForDropdown,
    getPaymentReceiveDetailsById,
    getListingofPaymentHistory,
} = require("./controllers/paymentReceived");

const {
    getAllBillingFromCompany,
    fromBillingToCompanyInInvoice,
    getAllPOForInvoices,
    getAllROForInvoices,
    getAllComplaintTypesForInvoices,
    getAllSalesAreaForInvoices,
    getMergedInvoiceDetailByIds,
} = require("./controllers/invoiceController");

/** * validation helper  */
const {
    getAllStateForDropdown,
    getAllPurchaseOrder,
    getOutletBySaleArea,
    getComplaintType,
} = require("./controllers/commonController");
const { getPurchaseOrderItemsOnPo, getAllGstType, getFromCompanies } = require("./controllers/purchaseOrderController");
const { getAllBankList } = require("./controllers/bankController");
const {
    getAllComplaintsInPI,
    getSalesAreaBasedOnRo,
    getOutletBasedOnSalesArea,
    getComplaintTypesFilter,
    getAllPOFilters,
    getAllROBasedOnPo,
    getAreaManagerForDropdown,
    getAllPOForProforma,
    getAllROFromProforma,
    getAllBillNumberFromProforma,
    getAllSalesAreaFromProforma,
    getAllOutletFromProforma,
    getFinancialYearFromProforma,
    getComplaintTypeFromProforma,
    roToBillingFromCompany,
    fromBillingToCompany,
} = require("./controllers/proformaInvoiceController");

const {
    verifySuperAdminToken,
    verifyContractorToken,
    verifyEnergyCompanyToken,
    verifyDealerToken,
    verifySubUserToken,
    permissionCheck,
    sideBarPermissionCheck,
    extraPermissionCheck,
    verifyToken,
} = require("./helpers/verifyToken");

/** * Super Admin Api Controller and Method  */
const {
    superAdminLogin,
    getProfileDetails,
    updateProfile,
    changePassword,
    createEnergyCompany,
    getAllSubUserForSuperAdmin,
    getAllSuperAdminAndUsersWithPendingAccountStatus,
    superAdminAccountStatusAction,
    markAsResolvedComplaints,
    getAllStoredEmployeeDetailsForSuperAdmin,
    getSingleEmployeeDetailByIdForSuperAdmin,
    deleteSuperAdminEmployees,
} = require("./controllers/superAdminController");

const {
    createRole,
    getAllRoles,
    editRole,
    updateRole,
    deleteRole,
    getAllRolesForDropdown,
} = require("./controllers/roleController");
const {
    createZone,
    getAllZones,
    getAllActiveZones,
    editZone,
    updateZone,
    deleteZone,
    getEnergyCompanyAssignZones,
} = require("./controllers/zoneController");
const {
    createRegionalOffice,
    getAllRegionalOffices,
    getRegionalOfficeById,
    getActiveRegionalOffices,
    editRegionalOffice,
    updateRegionalOffice,
    deleteRegionalOffice,
    getRegionalOfficesOnZoneId,
    getRegionalOfficersOnRo,
    getAllRegionalOfficeForDropdown,
} = require("./controllers/regionalOfficeController");
const {
    addSalesArea,
    getSalesArea,
    getSalesAreaById,
    getActiveSalesArea,
    editSalesArea,
    updateSalesArea,
    deleteSalesArea,
    getSaleAreaOnRoId,
} = require("./controllers/salesAreaController");
const {
    addDistrict,
    getDistricts,
    getDistrictById,
    getActiveDistricts,
    editDistrictById,
    updateDistrictById,
    removeDistrictById,
    getAllDistrictBySaleAreaId,
} = require("./controllers/districtController");
const {
    addOutlet,
    getAllOutlet,
    getOutletById,
    editOutlet,
    updateOutlet,
    removeOutletById,
    getOutletByDistrictId,
    getOutletByEnergyCompanyId,
    getOutletBySalesId,
} = require("./controllers/outletController");

const {
    addSaleCompany,
    getSaleCompanies,
    getSaleCompanyById,
    editSalesCompany,
    updateSalesCompany,
    removeSalesCompanyById,
} = require("./controllers/saleCompanyController");
const {
    addPurchaseCompany,
    getPurchaseCompany,
    getPurchaseCompanyById,
    editPurchaseCompany,
    updatePurchaseCompanyById,
    deletePurchaseCompanyById,
} = require("./controllers/purchaseCompanyController");

const {
    createCompany,
    getMyCompany,
    getMyCompanySingleDetailsById,
    updateMyCompanyDetails,
    deleteMyCompany,
    getCompanyTypes,
    getAllCompany,
    getCompanySingleDetailsById,
    updateCompanyDetails,
    getAllCompanyForDropdown,
    getCompanyDetailsById,
    companyImport,
} = require("./controllers/companyController");

const { getAllModule } = require("./controllers/moduleController");
const {
    getAllSubModule,
    getSubModuleWithModuleName,
    getSubModuleByModuleId,
} = require("./controllers/subModuleController");

const {
    setPermissionOnRoleBasis,
    setPermissionOnRole,
    checkPermittedModuleOnRoleBasis,
    getAllPermittedModuleNameOnRoleBasis,
    updatePermissionOnRoleBasis,
    setPermission,
} = require("./controllers/permissionController");

const {
    addComplaintType,
    getAllComplaintTypes,
    getComplaintTypeById,
    updateComplaintType,
    updateComplaintStatus,
    complaintFlitter,
    allNewComplaints,
    allPendingComplaints,
    allApprovedComplaints,
    allRejectedComplaints,
    allResolvedComplaints,
    complaintAssignTo,
    getApprovelList,
    setComplaintApproval,
    notApprovalSetComplaint,
    getComplaintsById,
} = require("./controllers/complaintTypeController");

const {
    addComplaintSubType,
    getAllComplaintSubTypes,
    getComplaintSubTypeById,
    updateComplaintSubType,
} = require("./controllers/complaintSubTypeController");

const {
    createTeam,
    getParentTeamHead,
    getTeamDetailsById,
    updateTeamDetails,
    getTeamGroup,
} = require("./controllers/teamController");

const {
    getAllPendingRequests,
    viewSinglePendingRequestDetails,
    approvedSoftwareActivationRequest,
    rejectedSoftwareActivationRequest,
    deleteSoftwareActivationRequest,
    getAllApprovedRequests,
    getAllRejectedRequests,
} = require("./controllers/softwareActivationRequestController");

const { getAllFeedbackAndSuggestions } = require("./controllers/feedbackAndSuggestionController");

const {
    getEnergyCompanies,
    getEnergyCompaniesContacts,
    getEnergyCompanyZoneSubUsers,
    getEnergyCompanyRegionalOfficeSubUsers,
    getEnergyCompanySaleAreaSubUsers,
    getEnergyCompanySubUserDetailById,
    getEnergyCompanyUserDetailsById,
    getContactsForChat,
} = require("./controllers/contactController");

const {
    createEnergyCompanyUser,
    createSubUsersForEnergyCompanyZoneUser,
    createSubUsersForEnergyCompanyRegionalOfficeUser,
    createSubUsersForEnergyCompanySaleAreaUser,
    getEnergyCompanyDetailsById,
    updateEnergyCompanyDetails,
    updateEnergyCompanyUserDetails,
    updateEnergyCompanySubUserDetails,
    deleteEnergyCompany,
    deleteEnergyCompanyUser,
    energyCompanyDeleteSubUser,
    getAllActiveEnergyCompany,
    getAllCreatedEnergyCompany,
    getAllCreatedEnergyCompanyWithSoftDelete,
    getAllEnergyCompanyAndUsersWithPendingAccountStatus,
    energyCompanyAccountStatusAction,
    getAllZoneByEnergyCompanyId,
    checkRelatedDataForEnergyCompany,
    deleteRelatedDataForEnergyCompany,
    getEnergyCompanySubSidiaries,
} = require("./controllers/energyCompanyController");

const {
    contractorCreate,
    getContractorById,
    updateContractorDetailsById,
    createContractorUser,
    getAllContractorAndUsers,
    getContractorAndUsersFullDetailByIdAndType,
    deleteContractorAndUsers,
    getAllContractorAndUsersWithPendingAccountStatus,
    contractorAccountStatusAction,
    getContractorSidebar,
} = require("./controllers/contractorController");

const {
    createTutorial,
    getTutorials,
    getTutorialByFormat,
    updateTutorials,
    deleteTutorialsById,
} = require("./controllers/tutorialController");
const {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlanDetails,
    deletePlan,
    buyPlan,
    buyOrUpgradePlan,
} = require("./controllers/planController");

const {
    createNotifications,
    getNotifications,
    getLoggedUserNotifications,
    countLoggedUserUnreadNotifications,
    markAsReadNotifications,
} = require("./controllers/notificationController");

const {
    createItemMaster,
    getAllItemMasters,
    getSingleItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getAllItemMastersForDropdown,
    addItemFromStockRequest,
    checkItemUniqueIdExist,
    addItemFromFundRequest,
    approvedAddItemFromFundRequest,
    byNameToHsnCode,
    getAllItemsBySupplierId,
    approveOrRejectItems,
} = require("./controllers/itemMasterController");

const {
    createPurposeMaster,
    getAllPurposeMaster,
    getSinglePurposeMasterById,
    updatePurposeMaster,
    deletePurposeMasterById,
} = require("./controllers/purposeMasterController");

const {
    createSurvey,
    getAllSurvey,
    getSurveyById,
    editSurveyDetails,
    updateSurveyDetails,
    deleteSurvey,
    getAssignedSurvey,
    getRequestedSurvey,
    getSurveyQuestionResponse,
    assignToSurvey,
    updateRequestedSurveyStatus,
    surveyQuestionFormResponse,
    otpSendSurvey,
    VerifyOtpSurvey,
    getSurveyResponseById,
    createSurveyResponse,
    getSurveyResponse,
} = require("./controllers/surveyController");

const {
    createDocumentCategory,
    getAllDocumentCategory,
    getDocumentCategoryById,
    updateDocumentCategory,
    removeDocumentCategoryById,
    addDocuments,
    getAllDocuments,
    viewDocuments,
    getDocumentOnCategoryById,
    removeDocumentById,
    updateDocuments,
} = require("./controllers/documentController");

const {
    createTask,
    getAllTaskList,
    getTaskById,
    updateTaskDetails,
    deleteTask,
    taskDashboard,
    updateMainTaskStatus,
    getAllTaskByStatus,
} = require("./controllers/taskManagerController");

const {
    createTaskCategory,
    getAllTaskCategory,
    getSingleTaskCategory,
    updateTaskCategoryDetails,
    removeTaskCategoryById,
} = require("./controllers/taskCategoryController");

const {
    createTaskComment,
    updateTaskComment,
    getTaskCommentDetailsById,
} = require("./controllers/taskActionController");

const {
    sendMessage,
    getMessages,
    getSenderAllMessages,
    addNewUserToChat,
    getTotalUnreadMessages,
    markAllMessagesRead,
    markReadSenderAllMessages,
    startChatWithNewUser,
} = require("./controllers/messageController");

//HR Management
const {
    createHrTeam,
    getAllHrTeamWithMember,
    getHrTeamDetailsById,
    updateHrTeamDetails,
    deleteHrTeam,
    removeSpecificUserFromTeam,
    addNewMemberInTeam,
    getMemberListToAddInTeam,
    getMemberListWithoutTeam,
    getLoggedUserDetails,
    getUsersOnRoleId,
    saveUserHierarchyLevel,
    importHrTeam,
} = require("./controllers/hrTeamController");

const { importData, importUserData } = require("./controllers/importDataController");

const {
    createBreaks,
    getAllBreaks,
    getBreakOnId,
    updateBreaks,
    deleteBreak,
} = require("./controllers/breakController");

const {
    getAllStoredEmployeeDetails,
    getSingleEmployeeDetailById,
    updateEmployeeDetails,
    deleteEmployee,
    getEmployeeTaskById,
} = require("./controllers/employeeController");

const {
    clockIn,
    clockOut,
    checkClockInToday,
    startBreak,
    endBreak,
    timeSheet,
    getAttendanceChartById,
    checkTodayMarkBreakAndAttendance,
    getMonthsTotalWorkHour,
    checkTotalUsersTimeSheet,
    checkTotalUsersTimeSheetNew,
    getAllUsersTodayClockIn,
    getAllUsersTodayClockOut,
    markUserClockInClockOutBySuperAdmin,
    createManuallyClockInClockOut,
    getTimeSheetOfAllUserForSuperAdmin,
    markAttendance,
    getAllUserTimeSheetInCalendarView,
    getSingleUserAttendanceTimeSheetInCalendarView,
    markAttendanceInBulk,
} = require("./controllers/attendanceController");

const {
    createLeaveType,
    getAllLeaveType,
    getAllActiveLeaveType,
    getAllLeaveTypeById,
    updateLeaveType,
    deleteLeaveType,
} = require("./controllers/leaveTypeController");

const {
    applyLeave,
    getAllLeaveApplications,
    updateLeaveApplication,
    getSingleLeaveApplication,
    leaveApplicationSoftDelete,
} = require("./controllers/leaveApplicationController");

const {
    registerInsuranceCompany,
    getAllInsuranceCompanyList,
    getSingleInsuranceCompanyDetails,
    updateInsuranceCompanyDetails,
    deleteInsuranceCompanyById,
} = require("./controllers/insuranceCompanyController");

const {
    registerInsuranceCompanyPlan,
    getAllInsurancePlans,
    getInsurancePlanById,
    updateInsurancePlanDetails,
    deleteInsurancePlanById,
    getInsuranceCompanyWithPlansById,
} = require("./controllers/insuranceCompanyPlanController");

const {
    employeeAddAction,
    getAllEmployeePromotionDemotion,
    getAllEmployeePromotionDemotionById,
    updateEmployeePromotionDemotionDetails,
} = require("./controllers/employeePromotionDemotionController");

const {
    registerResignation,
    getPendingResignationRequests,
    getApprovedResignationRequests,
    getRejectedResignationRequests,
    getResignationDetailsById,
    updateResignationDetails,
    resignationRequestViewed,
    resignationStatusUpdateByAdmin,
    generateFnFStatement,
    getFnfStatement,
} = require("./controllers/employeeResignationController");

const {
    registerPensionForEmployee,
    getAllRegisteredPension,
    getRegisteredPensionById,
    updatePensionDetails,
    deletePensionById,
} = require("./controllers/employeeRetirementController");

const {
    createGroupInsurance,
    getAllGroupInsurance,
    getSingleGroupInsuranceDetails,
    updateGroupInsuranceDetails,
    deleteGroupInsurance,
} = require("./controllers/groupInsuranceController");

const {
    createUsers,
    updateUsers,
    getAllManagerUsers,
    getEmployeeDocumentsById,
    getEmployeeLoginDetailsById,
    sendLoginCredentialsViaEmail,
    sendLoginCredentialsViaWhatsApp,
    changeUserStatus,
    getUsersByRoleId,
    getAdminsByRoleId,
    getUsersByAdminId,
    userStatusTimeLine,
    importEmployee,
} = require("./controllers/userController");

const {
    createTermsAndConditions,
    getAllCreateTermsAndConditions,
    getCreateTermsAndConditionsDetailsById,
    updateTermsConditionsDetails,
    deleteTermsAndConditions,
} = require("./controllers/termsAndConditionsController");

const {
    addDetailsSalary,
    getAllCreatedSalaryDetails,
    getCreatedSalaryDetailsById,
    updateSalaryDetails,
    deleteSalaryDetails,
} = require("./controllers/salaryController");

const {
    getAllUserSalaryForDisbursal,
    getUserSalaryDisbursalDetailsById,
    markSalaryDisbursed,
} = require("./controllers/salaryDisbursalController");

const { getUsersPaySlip, getUserPayslipDetailsById } = require("./controllers/paySlipController");

const {
    createLoan,
    getAllLoanRequests,
    getAllActiveLoan,
    getAllRejectedLoan,
    getAllClosedLoan,
    getLoanDetailById,
    updateLoanDetails,
    updateLoanStatus,
    deleteLoanDetailById,
} = require("./controllers/loanController");

const { getAllActivityLog, getActivityLogDetails } = require("./controllers/activityLogController");

const { trackEmployeeHistory } = require("./controllers/employeeTrackingController");

const {
    addPayrollMasterSettingLabel,
    getAllPayRollMasterSettings,
    updatePayrollSettings,
    updatePayrollSettingLabel,
} = require("./controllers/payrollMasterSettingController");

const {
    createAllowances,
    getAllCreatedAllowances,
    updateAllowances,
    deleteAllowance,
    getSingleAllowancesDetails,
} = require("./controllers/allowanceController");

const { createDeductionsType, getAllCreatedDeductionTypes } = require("./controllers/deductionsController");

const { reschduleTransferFund } = require("./controllers/fundRequestController");

/**Admin API Controller and Method */
const {
    adminLogin,
    getAdminProfileDetails,
    updateAdminProfile,
    adminChangePassword,
    getAllSideBarModules,
    createAdmin,
    changeAdminUserStatus,
    updateSingleEmployeeDetailByIdForAdmins,
} = require("./controllers/adminController");

const {
    createDealer,
    createDealerUser,
    getDealersAndUsers,
    getDealerAndUserSingleRecordByIdAndType,
    updateDealerDetails,
    deleteDealerAndUsers,
    getAllDealersAndUsersWithPendingAccountStatus,
    dealersAccountStatusAction,
} = require("./controllers/dealerController");

/** * user controller  */
const { createUser, login, getAllUsers, getUserById } = require("./controllers/userController");

/** Sub users Controller and method */
const {
    createSubUser,
    subUserLoggedIn,
    getSubUserProfileDetails,
    updateSubUserProfileDetails,
    subUserChangePassword,
} = require("./controllers/subUserController");

const {
    createOrder,
    updateOrder,
    getAllData,
    getOrderById,
    deleteOrderById,
    getAllOrderWithPagination,
} = require("./controllers/orderController");

const { contractorLogin, renewPlan } = require("./controllers/contractorLoginController");
const {
    getAllRequestedComplaints,
    getComplaintsDetailsById,
    getAllApprovedComplaints,
    getAllRejectedComplaints,
    getAllResolvedComplaints,
    getApprovedComplaintsDetailsById,
    approvedComplaints,
    getAllComplaints,
    getAllApprovedAssignComplaints,
    getAllApprovedUnAssignComplaints,
    reworkForResolvedComplaints,
    getOutletByIdNew,
    getRegionalByIdNew,
    getSaleByIdNew,
    getOrderByIdNew,
    reActiveToRejectedComplaints,
    getAreaManagerOfAssign,
    getSuperVisorOfAssign,
    getEndUsersOfAssign,
    holdAndTransferComplaints,
    allocateComplaintsToResolve,
    userToManagerArea,
    getManagerToComplaints,
    getRegionalOfficeToComplaints,
    assignedComplaintToUsers,
    getAllComplaintsExceptPending,
    getAllComplaintsById,
    getSupervisorDropdownList,
    getEndUserDropdownList,
    importComplaint,
} = require("./controllers/contractorComplaintController");

/** Bank account Details */
const {
    addAccountDetails,
    getAllAccountsDetails,
    updateAccountDetails,
    deleteAccountDetails,
    accountDetailsbyId,
    getTransactionByUser,
    deleteTransactionDetails,
    transactionList,
    addAmountToBankAccount,
    getBankBalance,
    bankAccountNumbertoBalance,
    getBankToAccount,
    getBankTransactions,
    getBankTransactionsForStock,
    checklastBalanceOfWallets,
    checkLastBalanceOfEmployee,
    lastBalanceOfEmployeeInExpense,
    getUserExpenseTransaction,
    getUserWalletDetails,
} = require("./controllers/accountsController");

const { transferFundAmount, rescheduledTransferFund } = require("./controllers/transferFundController");

const {
    getALLmanagersWithTeamMembers,
    getSuperVisorOnManagerId,
    getFreeEndUsersOnSuperVisorId,
    getALLSupervisors,
} = require("./controllers/assignController");
const { getFeedbackComplaint } = require("./controllers/feedbackComplaintController");
const { fetchAllFinancialYears } = require("./controllers/financialYearController");

const Router = express.Router();

/** * Super Admin Routes */

/**
 * @swagger
 * tags:
 *   - name: Super Admin Routes
 *     description: Routes for Super Admin functionalities including user management, roles, zones, and regional offices.
 *
 * /super-admin/login:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Super Admin login
 *     description: Authenticate Super Admin and return an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "superadmin1@gmail.com"
 *             password: "12345678"
 *     responses:
 *       200:
 *         description: Login successful and returns a token.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/profile:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get Super Admin profile details
 *     description: Retrieve profile details of the logged-in Super Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Super Admin"
 *                 email: "admin@example.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/profile-update:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update Super Admin profile
 *     description: Update profile details of the logged-in Super Admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/change-password:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Change Super Admin password
 *     description: Change the password of the logged-in Super Admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Password changed successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/create-energy-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new energy company
 *     description: Create a new energy company with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - address
 *     responses:
 *       201:
 *         description: Energy company created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-sub-users:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all sub-users for Super Admin
 *     description: Retrieve a list of all sub-users associated with the Super Admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sub-users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All sub-users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                 - id: 2
 *                   name: "Jane Smith"
 *                   email: "jane.smith@example.com"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/get-all-pending-account-status-of-admins-and-users-details:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all pending account status of admins and users
 *     description: Retrieve details of all admins and users with pending account statuses.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending account statuses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All pending account statuses fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Admin User"
 *                   status: "Pending"
 *                 - id: 2
 *                   name: "Regular User"
 *                   status: "Pending"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/update-account-status-of-admins-and-users:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update account status of admins and users
 *     description: Update the account status of admins and users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *             required:
 *               - userId
 *               - status
 *     responses:
 *       200:
 *         description: Account status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Account status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/roles:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all roles
 *     description: Retrieve a list of all roles available in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All roles fetched successfully.
 *               data:
 *                 - id: 1
 *                   roleName: "Administrator"
 *                 - id: 2
 *                   roleName: "User"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/get-all-roles-for-dropdown:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all roles for dropdown
 *     description: Retrieve all roles formatted for use in dropdown menus.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles for dropdown retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Roles for dropdown fetched successfully.
 *               data:
 *                 - id: 1
 *                   roleName: "Administrator"
 *                 - id: 2
 *                   roleName: "User"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/create-role:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new role
 *     description: Create a new role with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - roleName
 *     responses:
 *       201:
 *         description: Role created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Role created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/edit-role/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a specific role
 *     description: Retrieve details of a specific role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Role details fetched successfully.
 *               data:
 *                 id: 1
 *                 roleName: "Administrator"
 *                 permissions:
 *                   - "view_users"
 *                   - "edit_users"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/update-role:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update an existing role
 *     description: Update details of an existing role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               roleName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - id
 *               - roleName
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Role updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/delete-role/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a specific role
 *     description: Remove a role by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Role deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/create-zone:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new zone
 *     description: Create a new zone with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - zoneName
 *     responses:
 *       201:
 *         description: Zone created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-zone:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all zones
 *     description: Retrieve a list of all zones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "North Zone"
 *                 - id: 2
 *                   zoneName: "South Zone"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-active-zone:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active zones
 *     description: Retrieve a list of all active zones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All active zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "North Zone"
 *                 - id: 2
 *                   zoneName: "South Zone"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/edit-zone/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a specific zone
 *     description: Retrieve details of a specific zone by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the zone to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone details fetched successfully.
 *               data:
 *                 id: 1
 *                 zoneName: "North Zone"
 *                 description: "Description of North Zone"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/update-zone:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update an existing zone
 *     description: Update details of an existing zone.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               zoneName:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - zoneName
 *     responses:
 *       200:
 *         description: Zone updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/delete-zone/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a specific zone
 *     description: Remove a zone by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the zone to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/get-energy-company-assign-zones/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get zones assigned to an energy company
 *     description: Retrieve all zones assigned to a specific energy company.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the energy company to retrieve assigned zones.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zones assigned to the energy company retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "North Zone"
 *                 - id: 2
 *                   zoneName: "South Zone"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/create-regional-office:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new regional office
 *     description: Create a new regional office with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               officeName:
 *                 type: string
 *               address:
 *                 type: string
 *               zoneId:
 *                 type: integer
 *             required:
 *               - officeName
 *               - address
 *               - zoneId
 *     responses:
 *       201:
 *         description: Regional office created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/all-regional-offices:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all regional offices
 *     description: Retrieve a list of all regional offices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all regional offices retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All regional offices fetched successfully.
 *               data:
 *                 - id: 1
 *                   officeName: "Regional Office 1"
 *                   address: "Address of Regional Office 1"
 *                 - id: 2
 *                   officeName: "Regional Office 2"
 *                   address: "Address of Regional Office 2"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/get-regional-office/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a specific regional office
 *     description: Retrieve details of a specific regional office by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the regional office to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regional office details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office details fetched successfully.
 *               data:
 *                 id: 1
 *                 officeName: "Regional Office 1"
 *                 address: "Address of Regional Office 1"
 *                 zoneId: 1
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/active-regional-offices:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active regional offices
 *     description: Retrieve a list of all active regional offices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active regional offices retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All active regional offices fetched successfully.
 *               data:
 *                 - id: 1
 *                   officeName: "Active Regional Office 1"
 *                   address: "Address of Active Regional Office 1"
 *                 - id: 2
 *                   officeName: "Active Regional Office 2"
 *                   address: "Address of Active Regional Office 2"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/edit-regional-office/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a specific regional office
 *     description: Retrieve details of a specific regional office by its ID for editing.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the regional office to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regional office details retrieved successfully for editing.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office details fetched successfully for editing.
 *               data:
 *                 id: 1
 *                 officeName: "Regional Office 1"
 *                 address: "Address of Regional Office 1"
 *                 zoneId: 1
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/update-regional-office:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update an existing regional office
 *     description: Update details of an existing regional office.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               officeName:
 *                 type: string
 *               address:
 *                 type: string
 *               zoneId:
 *                 type: integer
 *             required:
 *               - id
 *               - officeName
 *               - address
 *     responses:
 *       200:
 *         description: Regional office updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/delete-regional-office/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a specific regional office
 *     description: Remove a regional office by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the regional office to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regional office deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/get-all-regional-office-on-zone-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all regional offices in a specific zone
 *     description: Retrieve all regional offices within a specified zone.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the zone to retrieve regional offices.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all regional offices in the specified zone retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All regional offices in the zone fetched successfully.
 *               data:
 *                 - id: 1
 *                   officeName: "Regional Office 1"
 *                   address: "Address of Regional Office 1"
 *                 - id: 2
 *                   officeName: "Regional Office 2"
 *                   address: "Address of Regional Office 2"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/add-sales-area:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a new sales area
 *     description: Create a new sales area with the provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               areaName:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - areaName
 *     responses:
 *       201:
 *         description: Sales area added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales area added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /super-admin/sales-area:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all sales areas
 *     description: Retrieve a list of all sales areas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales areas retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All sales areas fetched successfully.
 *               data:
 *                 - id: 1
 *                   areaName: "North Sales Area"
 *                 - id: 2
 *                   areaName: "South Sales Area"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/login", superAdminLogin);
Router.get("/super-admin/profile", verifySuperAdminToken, getProfileDetails);
Router.post("/super-admin/profile-update", verifySuperAdminToken, updateProfile);
Router.post("/super-admin/change-password", verifySuperAdminToken, changePassword);
Router.post("/super-admin/create-energy-company", verifySuperAdminToken, permissionCheck, createEnergyCompany);
Router.get("/super-admin/all-sub-users", verifySuperAdminToken, getAllSubUserForSuperAdmin);
Router.get(
    "/super-admin/get-all-pending-account-status-of-admins-and-users-details",
    verifySuperAdminToken,
    getAllSuperAdminAndUsersWithPendingAccountStatus
);
Router.post(
    "/super-admin/update-account-status-of-admins-and-users",
    verifySuperAdminToken,
    superAdminAccountStatusAction
);
Router.get("/super-admin/roles", verifySuperAdminToken, getAllRoles);
Router.get("/super-admin/get-all-roles-for-dropdown", verifySuperAdminToken, getAllRolesForDropdown);
Router.post("/super-admin/create-role", verifySuperAdminToken, permissionCheck, createRole);
Router.get("/super-admin/edit-role/:id", editRole);
Router.post("/super-admin/update-role", verifySuperAdminToken, permissionCheck, updateRole);
Router.delete("/super-admin/delete-role/:id", verifySuperAdminToken, permissionCheck, deleteRole);
Router.post("/super-admin/create-zone", verifySuperAdminToken, permissionCheck, createZone);
Router.get("/super-admin/all-zone", verifySuperAdminToken, getAllZones);
Router.get("/super-admin/all-active-zone", verifySuperAdminToken, getAllActiveZones);
Router.get("/super-admin/edit-zone/:id", verifySuperAdminToken, editZone);
Router.post("/super-admin/update-zone", verifySuperAdminToken, permissionCheck, updateZone);
Router.delete("/super-admin/delete-zone/:id", verifySuperAdminToken, permissionCheck, deleteZone);
Router.get("/super-admin/get-energy-company-assign-zones/:id", verifySuperAdminToken, getEnergyCompanyAssignZones);
Router.post("/super-admin/create-regional-office", verifySuperAdminToken, permissionCheck, createRegionalOffice);
Router.get("/super-admin/all-regional-offices", verifySuperAdminToken, getAllRegionalOffices);
Router.get("/super-admin/get-regional-office/:id", verifySuperAdminToken, getRegionalOfficeById);
Router.get("/super-admin/active-regional-offices", verifySuperAdminToken, getActiveRegionalOffices);
Router.get("/super-admin/edit-regional-office/:id", verifySuperAdminToken, editRegionalOffice);
Router.post("/super-admin/update-regional-office", verifySuperAdminToken, permissionCheck, updateRegionalOffice);
Router.delete("/super-admin/delete-regional-office/:id", verifySuperAdminToken, permissionCheck, deleteRegionalOffice);
Router.get("/super-admin/get-all-regional-office-on-zone-id/:id", verifySuperAdminToken, getRegionalOfficesOnZoneId);
Router.post("/super-admin/add-sales-area", verifySuperAdminToken, permissionCheck, addSalesArea);
Router.get("/super-admin/sales-area", verifySuperAdminToken, getSalesArea);
//global
Router.get("/super-admin/get-all-state-details", verifySuperAdminToken, getAllStateForDropdown);
Router.get("/super-admin/get-all-regional-office-details", verifySuperAdminToken, getAllRegionalOfficeForDropdown);
Router.get("/super-admin/get-all-po-details", verifySuperAdminToken, getAllPurchaseOrder);
Router.get("/super-admin/get-outlet-by-sale-area/:id", verifySuperAdminToken, getOutletBySaleArea);
Router.get("/super-admin/get-all-complaint-types", verifySuperAdminToken, getComplaintType);
Router.get("/super-admin/get-purchase-order-details-with-items/:id", verifySuperAdminToken, getPurchaseOrderItemsOnPo);
Router.get("/super-admin/get-all-gst-type", verifySuperAdminToken, getAllGstType);
Router.get("/super-admin/get-all-bank-list", verifySuperAdminToken, getAllBankList);
Router.get("/super-admin/get-complaint-types", verifySuperAdminToken, getComplaintTypes);
Router.get("/super-admin/get-all-complaints-in-pi", verifySuperAdminToken, getAllComplaintsInPI);
Router.get("/super-admin/get-all-sa-filters", verifySuperAdminToken, getSalesAreaBasedOnRo);
Router.get("/super-admin/get-all-outlet-filters", verifySuperAdminToken, getOutletBasedOnSalesArea);
Router.get("/super-admin/get-all-complaint-types-filters", verifySuperAdminToken, getComplaintTypesFilter);
Router.get("/super-admin/get-all-po-filters", verifySuperAdminToken, getAllPOFilters);
Router.get("/super-admin/get-all-ro-filters", verifySuperAdminToken, getAllROBasedOnPo);
Router.get("/super-admin/get-area-manager", verifySuperAdminToken, getAreaManagerForDropdown);
Router.get("/super-admin/get-all-po-from-proforma", verifySuperAdminToken, getAllPOForProforma);
Router.get("/super-admin/get-all-ro-from-proforma", verifySuperAdminToken, getAllROFromProforma);
Router.get("/super-admin/get-all-bill-from-proforma", verifySuperAdminToken, getAllBillNumberFromProforma);
Router.get("/super-admin/get-all-sales-area-from-proforma", verifySuperAdminToken, getAllSalesAreaFromProforma);
Router.get("/super-admin/get-all-outlet-from-proforma", verifySuperAdminToken, getAllOutletFromProforma);
Router.get("/super-admin/get-all-financial-year-from-proforma", verifySuperAdminToken, getFinancialYearFromProforma);
Router.get("/super-admin/get-all-complaint-types-from-proforma", verifySuperAdminToken, getComplaintTypeFromProforma);
Router.get("/super-admin/ro-to-billing-from-company", verifySuperAdminToken, roToBillingFromCompany);
Router.get("/super-admin/from-billing-to-company", verifySuperAdminToken, fromBillingToCompany);
Router.get("/super-admin/get-all-billing_from-company-invoice", verifySuperAdminToken, getAllBillingFromCompany);
Router.get("/super-admin/get-all-billing-to-company-invoice", verifySuperAdminToken, fromBillingToCompanyInInvoice);
Router.get("/super-admin/get-all-po-for-invoices", verifySuperAdminToken, getAllPOForInvoices);
Router.get("/super-admin/get-all-ro-for-invoice", verifySuperAdminToken, getAllROForInvoices);
Router.get("/super-admin/get-all-complaint-types-for-invoice", verifySuperAdminToken, getAllComplaintTypesForInvoices);
Router.get("/super-admin/get-all-sales-area-for-invoice", verifySuperAdminToken, getAllSalesAreaForInvoices);
Router.get("/super-admin/get-ro-for-dropdown", verifySuperAdminToken, getRoForDropdown);
Router.get("/super-admin/get-sales-area-for-dropdown", verifySuperAdminToken, getSalesAreaForDropdown);
Router.get("/super-admin/get-outlet-for-dropdown", verifySuperAdminToken, getOutletForDropdown);
Router.get("/super-admin/get-complaint-type-for-dropdown", verifySuperAdminToken, getComplaintTypeForDropdown);
Router.get("/super-admin/get-billing-from-for-dropdown", verifySuperAdminToken, getBillingFromForDropdown);
Router.get("/super-admin/get-billing-to-for-dropdown", verifySuperAdminToken, getBillingToForDropdown);
Router.get("/super-admin/get-po-for-payment-retention", verifySuperAdminToken, getPoForDropdown);
Router.get("/super-admin/get-retention-id-for-dropdown", verifySuperAdminToken, getRetentinIdForDropdown);
Router.get("/super-admin/get-all-complaint-list", verifySuperAdminToken, getAllComplaintList);
Router.get("/super-admin/get-outlet-list", verifySuperAdminToken, getOutletDetails);
Router.get(
    "/super-admin/get-all-stored-company-contact-positions",
    verifySuperAdminToken,
    getAllPositionOfCompanyContacts
);

Router.get("/super-admin/get-suppliers", verifySuperAdminToken, getSuppliers);
Router.get("/super-admin/get-all-unit-data-list", verifySuperAdminToken, getAllUnitDataForDropdown);
Router.get("/super-admin/get-all-brand-markdown", verifySuperAdminToken, getAllBrandsMarkDown);
Router.get("/super-admin/get-all-sub-category", verifySuperAdminToken, subCategoryList);
Router.get("/super-admin/fetch-all-financial-years", verifySuperAdminToken, fetchAllFinancialYears);
Router.get("/super-admin/get-measurements-detail-po", verifySuperAdminToken, measurementDetailsWithPo);
Router.get("/super-admin/get-items-on-measurement-id/:id", verifySuperAdminToken, ItemsOnMeasurementId);
Router.get("/super-admin/get-all-invoice-data-by-id/:id", verifySuperAdminToken, getMergedInvoiceDetailByIds);
Router.get("/super-admin/get-payment-received-by-id/:id", verifySuperAdminToken, getPaymentReceiveDetailsById);
Router.get("/super-admin/get-payment-history", verifySuperAdminToken, getListingofPaymentHistory);

/**
 * @swagger
 * /super-admin/sales-area-by-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get sales area by ID
 *     description: Retrieve details of a specific sales area by its ID.
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
 *         description: Sales area details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales area details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "North Region"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/active-sales-area:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active sales areas
 *     description: Retrieve a list of all active sales areas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active sales areas retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Active sales areas fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "North Region"
 *                 - id: 2
 *                   name: "South Region"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-sales-area/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit sales area details
 *     description: Retrieve the details needed to edit a specific sales area.
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
 *         description: Sales area details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales area details for editing fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "North Region"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-sales-area:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update sales area details
 *     description: Update the details of a specific sales area.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Sales area updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales area updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-sales-area/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a sales area
 *     description: Delete a specific sales area by its ID.
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
 *         description: Sales area deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales area deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-sales-area-on-ro-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all sales areas on regional office ID
 *     description: Retrieve all sales areas associated with a specific regional office.
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
 *         description: List of sales areas on regional office ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales areas on regional office ID fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "North Region"
 *                 - id: 2
 *                   name: "South Region"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-district:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a new district
 *     description: Create a new district in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               salesAreaId:
 *                 type: integer
 *             required:
 *               - name
 *               - salesAreaId
 *     responses:
 *       201:
 *         description: District added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: District added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-districts:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all districts
 *     description: Retrieve a list of all districts.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all districts retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All districts fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "District A"
 *                 - id: 2
 *                   name: "District B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-district/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get district by ID
 *     description: Retrieve details of a specific district by its ID.
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
 *         description: District details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: District details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "District A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/active-districts:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active districts
 *     description: Retrieve a list of all active districts.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active districts retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Active districts fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "District A"
 *                 - id: 2
 *                   name: "District B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-district/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit district details
 *     description: Retrieve the details needed to edit a specific district.
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
 *         description: District details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: District details for editing fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "District A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-district:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update district details
 *     description: Update the details of a specific district.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: District updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: District updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-district/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a district
 *     description: Delete a specific district by its ID.
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
 *         description: District deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: District deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-district-on-sale-area-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all districts on sales area ID
 *     description: Retrieve all districts associated with a specific sales area ID.
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
 *         description: List of districts on sales area ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Districts on sales area ID fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "District A"
 *                 - id: 2
 *                   name: "District B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-outlet:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a new outlet
 *     description: Create a new outlet in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               districtId:
 *                 type: integer
 *               energyCompanyId:
 *                 type: integer
 *             required:
 *               - name
 *               - districtId
 *               - energyCompanyId
 *     responses:
 *       201:
 *         description: Outlet added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlet added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-outlets:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all outlets
 *     description: Retrieve a list of all outlets.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All outlets fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Outlet A"
 *                 - id: 2
 *                   name: "Outlet B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-outlet/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get outlet by ID
 *     description: Retrieve details of a specific outlet by its ID.
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
 *         description: Outlet details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlet details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Outlet A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-outlet/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit outlet details
 *     description: Retrieve the details needed to edit a specific outlet.
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
 *         description: Outlet details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlet details for editing fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Outlet A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-outlet:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update outlet details
 *     description: Update the details of a specific outlet.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               districtId:
 *                 type: integer
 *               energyCompanyId:
 *                 type: integer
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Outlet updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlet updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-outlet/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete an outlet
 *     description: Delete a specific outlet by its ID.
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
 *         description: Outlet deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlet deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-outlet-by-district-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get outlets by district ID
 *     description: Retrieve all outlets associated with a specific district ID.
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
 *         description: List of outlets by district ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlets by district ID fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Outlet A"
 *                 - id: 2
 *                   name: "Outlet B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-outlet-by-energy-company-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get outlets by energy company ID
 *     description: Retrieve all outlets associated with a specific energy company ID.
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
 *         description: List of outlets by energy company ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Outlets by energy company ID fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Outlet A"
 *                 - id: 2
 *                   name: "Outlet B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-sale-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a new sales company
 *     description: Create a new sales company in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *             required:
 *               - name
 *               - contact
 *     responses:
 *       201:
 *         description: Sales company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales company added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-sale-companies:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all sales companies
 *     description: Retrieve a list of all sales companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All sales companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Company A"
 *                 - id: 2
 *                   name: "Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-sale-company/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get sales company by ID
 *     description: Retrieve details of a specific sales company by its ID.
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
 *         description: Sales company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-sale-company/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit sales company details
 *     description: Retrieve the details needed to edit a specific sales company.
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
 *         description: Sales company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales company details for editing fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-sale-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update sales company details
 *     description: Update the details of a specific sales company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Sales company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales company updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-sale-company/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a sales company
 *     description: Delete a specific sales company by its ID.
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
 *         description: Sales company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sales company deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new company
 *     description: Create a new company in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *             required:
 *               - name
 *               - contact
 *     responses:
 *       201:
 *         description: Company created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-my-company-list:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get list of my companies
 *     description: Retrieve a list of companies associated with the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies for the authenticated user retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Companies list fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Company A"
 *                 - id: 2
 *                   name: "Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin/sales-area-by-id/:id", verifySuperAdminToken, getSalesAreaById);
Router.get("/super-admin/active-sales-area", verifySuperAdminToken, getActiveSalesArea);
Router.get("/super-admin/edit-sales-area/:id", verifySuperAdminToken, editSalesArea);
Router.post("/super-admin/update-sales-area", verifySuperAdminToken, permissionCheck, updateSalesArea);
Router.delete("/super-admin/delete-sales-area/:id", verifySuperAdminToken, permissionCheck, deleteSalesArea);
Router.get("/super-admin/get-all-sales-area-on-ro-id/:id", verifySuperAdminToken, getSaleAreaOnRoId);
Router.post("/super-admin/add-district", verifySuperAdminToken, permissionCheck, addDistrict);
Router.get("/super-admin/all-districts", verifySuperAdminToken, getDistricts);
Router.get("/super-admin/get-district/:id", verifySuperAdminToken, getDistrictById);
Router.get("/super-admin/active-districts", verifySuperAdminToken, getActiveDistricts);
Router.get("/super-admin/edit-district/:id", verifySuperAdminToken, editDistrictById);
Router.post("/super-admin/update-district", verifySuperAdminToken, permissionCheck, updateDistrictById);
Router.delete("/super-admin/delete-district/:id", verifySuperAdminToken, permissionCheck, removeDistrictById);
Router.get("/super-admin/get-all-district-on-sale-area-id/:id", verifySuperAdminToken, getAllDistrictBySaleAreaId);
Router.post("/super-admin/add-outlet", verifySuperAdminToken, permissionCheck, addOutlet);
Router.get("/super-admin/all-outlets", verifySuperAdminToken, getAllOutlet);
Router.get("/super-admin/get-outlet/:id", verifySuperAdminToken, getOutletById);
Router.get("/super-admin/edit-outlet/:id", verifySuperAdminToken, editOutlet);
Router.post("/super-admin/update-outlet", verifySuperAdminToken, permissionCheck, updateOutlet);
Router.delete("/super-admin/delete-outlet/:id", verifySuperAdminToken, permissionCheck, removeOutletById);
Router.get("/super-admin/get-outlet-by-district-id/:id", verifySuperAdminToken, getOutletByDistrictId);
Router.get("/super-admin/get-outlet-by-energy-company-id/:id", verifySuperAdminToken, getOutletByEnergyCompanyId);
Router.post("/super-admin/add-sale-company", verifySuperAdminToken, permissionCheck, addSaleCompany);
Router.get("/super-admin/all-sale-companies", verifySuperAdminToken, getSaleCompanies);
Router.get("/super-admin/get-sale-company/:id", verifySuperAdminToken, getSaleCompanyById);
Router.get("/super-admin/edit-sale-company/:id", verifySuperAdminToken, editSalesCompany);
Router.post("/super-admin/update-sale-company", verifySuperAdminToken, permissionCheck, updateSalesCompany);
Router.delete("/super-admin/delete-sale-company/:id", verifySuperAdminToken, permissionCheck, removeSalesCompanyById);
Router.post("/super-admin/create-company", verifySuperAdminToken, permissionCheck, createCompany);
Router.get("/super-admin/get-my-company-list", verifySuperAdminToken, getMyCompany);

/**
 * @swagger
 * /super-admin-get-my-company-single-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get single company details by ID
 *     description: Retrieve details of a specific company by its ID for the currently authenticated user.
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
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-my-company-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update company details for the authenticated user
 *     description: Update details of the company associated with the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-my-company/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a company by ID
 *     description: Delete the company associated with the currently authenticated user by its ID.
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
 *         description: Company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-company-types:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all company types
 *     description: Retrieve a list of all company types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of company types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company types fetched successfully.
 *               data:
 *                 - id: 1
 *                   type: "Type A"
 *                 - id: 2
 *                   type: "Type B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-companies:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all companies
 *     description: Retrieve a list of all companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Company A"
 *                 - id: 2
 *                   name: "Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-company-details-by-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get company details by ID
 *     description: Retrieve details of a specific company by its ID.
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
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-all-company-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update details of all companies
 *     description: Update details of all companies in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *             required:
 *               - companies
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All company details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-company-details:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all company details for dropdown
 *     description: Retrieve all company details to populate dropdowns or select lists.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All company details fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Company A"
 *                 - id: 2
 *                   name: "Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-company-details-by-company-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get company details by company ID
 *     description: Retrieve details of a specific company by its company ID.
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
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-purchase-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a new purchase company
 *     description: Create a new purchase company in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *             required:
 *               - name
 *               - contact
 *     responses:
 *       201:
 *         description: Purchase company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-purchase-companies:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all purchase companies
 *     description: Retrieve a list of all purchase companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all purchase companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All purchase companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Purchase Company A"
 *                 - id: 2
 *                   name: "Purchase Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-purchase-company/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get purchase company by ID
 *     description: Retrieve details of a specific purchase company by its ID.
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
 *         description: Purchase company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Purchase Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-purchase-company/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit purchase company details
 *     description: Retrieve the details needed to edit a specific purchase company.
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
 *         description: Purchase company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company details for editing fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Purchase Company A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-purchase-company:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update purchase company details
 *     description: Update the details of a specific purchase company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Purchase company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-purchase-company/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a purchase company
 *     description: Delete a specific purchase company by its ID.
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
 *         description: Purchase company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-sub-user:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new sub-user
 *     description: Create a new sub-user under the super admin account.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: Sub-user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-user created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-module/{role_id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all modules for a specific role
 *     description: Retrieve a list of all modules associated with a specific role ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of modules for the specified role retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Modules for role fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Module A"
 *                 - id: 2
 *                   name: "Module B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-module:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all modules
 *     description: Retrieve a list of all available modules.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all modules retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All modules fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Module A"
 *                 - id: 2
 *                   name: "Module B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-sub-module:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all sub-modules
 *     description: Retrieve a list of all available sub-modules.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sub-modules retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All sub-modules fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub-Module A"
 *                 - id: 2
 *                   name: "Sub-Module B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-sub-module-with-module-name:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get sub-modules with module name
 *     description: Retrieve a list of sub-modules along with their associated module names.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sub-modules with module names retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-modules with module names fetched successfully.
 *               data:
 *                 - moduleName: "Module A"
 *                   subModules:
 *                     - id: 1
 *                       name: "Sub-Module A1"
 *                     - id: 2
 *                       name: "Sub-Module A2"
 *                 - moduleName: "Module B"
 *                   subModules:
 *                     - id: 3
 *                       name: "Sub-Module B1"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-sub-module-by-module-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get sub-modules by module ID
 *     description: Retrieve a list of sub-modules associated with a specific module ID.
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
 *         description: List of sub-modules for the specified module retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-modules for module fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub-Module A1"
 *                 - id: 2
 *                   name: "Sub-Module A2"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/set-permission-on-role-basis:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Set permissions on role basis
 *     description: Set permissions for roles based on role IDs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - roleId
 *               - permissions
 *     responses:
 *       200:
 *         description: Permissions set for role successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Permissions set for role successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/set-permission-on-role:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Set permissions for a role
 *     description: Set permissions for a specific role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - roleId
 *               - permissions
 *     responses:
 *       200:
 *         description: Permissions set for the role successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Permissions set for the role successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/set-permission:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Set permissions
 *     description: Set permissions for a user or role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - userId
 *               - roleId
 *               - permissions
 *     responses:
 *       200:
 *         description: Permissions set successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Permissions set successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin-get-my-company-single-details/:id", verifySuperAdminToken, getMyCompanySingleDetailsById);
Router.post("/super-admin/update-my-company-details", verifySuperAdminToken, permissionCheck, updateMyCompanyDetails);
Router.delete("/super-admin/delete-my-company/:id", verifySuperAdminToken, permissionCheck, deleteMyCompany);
Router.get("/super-admin/get-company-types", verifySuperAdminToken, getCompanyTypes);
Router.get("/super-admin/get-all-companies", verifySuperAdminToken, getAllCompany);
Router.get("/super-admin/get-company-details-by-id/:id", verifySuperAdminToken, getCompanySingleDetailsById);
Router.post("/super-admin/update-all-company-details", verifySuperAdminToken, permissionCheck, updateCompanyDetails);
// Router.get("/super-admin/get-all-company-details", verifySuperAdminToken, getAllCompanyForDropdown);
Router.get("/super-admin/get-all-company-details", verifySuperAdminToken, getAllClientAndVendorCompanies);
Router.get("/super-admin/get-company-details-by-company-id/:id", verifySuperAdminToken, getCompanyDetailsById);
Router.post("/super-admin/add-purchase-company", verifySuperAdminToken, permissionCheck, addPurchaseCompany);
Router.get("/super-admin/all-purchase-companies", verifySuperAdminToken, getPurchaseCompany);
Router.get("/super-admin/get-purchase-company/:id", verifySuperAdminToken, getPurchaseCompanyById);
Router.get("/super-admin/edit-purchase-company/:id", verifySuperAdminToken, editPurchaseCompany);
Router.post("/super-admin/update-purchase-company", verifySuperAdminToken, permissionCheck, updatePurchaseCompanyById);
Router.delete(
    "/super-admin/delete-purchase-company/:id",
    verifySuperAdminToken,
    permissionCheck,
    deletePurchaseCompanyById
);
Router.post("/super-admin/create-sub-user", verifySuperAdminToken, createSubUser);
Router.get("/super-admin/get-all-module/:role_id", verifySuperAdminToken, getAllModule);
Router.get("/super-admin/get-all-module", verifySuperAdminToken, getAllModule);
Router.get("/super-admin/get-all-sub-module", verifySuperAdminToken, getAllSubModule);
Router.get("/super-admin/get-sub-module-with-module-name", verifySuperAdminToken, getSubModuleWithModuleName);
Router.get("/super-admin/get-sub-module-by-module-id/:id", verifySuperAdminToken, getSubModuleByModuleId);
Router.post("/super-admin/set-permission-on-role-basis", verifySuperAdminToken, setPermissionOnRoleBasis);
Router.post("/super-admin/set-permission-on-role", verifySuperAdminToken, setPermissionOnRole);
Router.post("/super-admin/set-permission", verifySuperAdminToken, setPermission);

/**
 * @swagger
 * /super-admin/create-complaint-type:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new complaint type
 *     description: Add a new complaint type to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Complaint type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-complaint-types:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all complaint types
 *     description: Retrieve a list of all complaint types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaint types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All complaint types fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Complaint Type A"
 *                 - id: 2
 *                   name: "Complaint Type B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-complaint-type/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get complaint type by ID
 *     description: Retrieve details of a specific complaint type by its ID.
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
 *         description: Complaint type details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Complaint Type A"
 *                 description: "Description of Complaint Type A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-complaint-type:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update a complaint type
 *     description: Update the details of a specific complaint type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Complaint type updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-complaint-status:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update complaint status
 *     description: Update the status of a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *             required:
 *               - id
 *               - status
 *     responses:
 *       200:
 *         description: Complaint status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-complaint-sub-type:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new complaint sub-type
 *     description: Add a new complaint sub-type to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               complaintTypeId:
 *                 type: integer
 *             required:
 *               - name
 *               - complaintTypeId
 *     responses:
 *       201:
 *         description: Complaint sub-type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint sub-type created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-complaints-sub-types:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all complaint sub-types
 *     description: Retrieve a list of all complaint sub-types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaint sub-types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All complaint sub-types fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub-Type A"
 *                   complaintTypeId: 1
 *                 - id: 2
 *                   name: "Sub-Type B"
 *                   complaintTypeId: 1
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-complaint-sub-type/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get complaint sub-type by ID
 *     description: Retrieve details of a specific complaint sub-type by its ID.
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
 *         description: Complaint sub-type details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint sub-type details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Sub-Type A"
 *                 complaintTypeId: 1
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-complaint-sub-types-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update complaint sub-type details
 *     description: Update the details of a specific complaint sub-type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               complaintTypeId:
 *                 type: integer
 *             required:
 *               - id
 *               - name
 *               - complaintTypeId
 *     responses:
 *       200:
 *         description: Complaint sub-type updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint sub-type updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/complaint-flitter:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Filter complaints
 *     description: Apply filters to search for specific complaints.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *             required:
 *               - filters
 *     responses:
 *       200:
 *         description: Complaints filtered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints filtered successfully.
 *               data:
 *                 - id: 1
 *                   title: "Complaint A"
 *                 - id: 2
 *                   title: "Complaint B"
 *               totalCount: 2
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/complaint-assign:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Assign a complaint
 *     description: Assign a complaint to a user or team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *               assignedTo:
 *                 type: integer
 *             required:
 *               - complaintId
 *               - assignedTo
 *     responses:
 *       200:
 *         description: Complaint assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint assigned successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-approvel-member-list:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get approval member list
 *     description: Retrieve a list of members who can approve complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approval members retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Approval member list fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Member A"
 *                 - id: 2
 *                   name: "Member B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/set-complaint-approval:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Set complaint approval
 *     description: Approve or reject a complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *               approved:
 *                 type: boolean
 *             required:
 *               - complaintId
 *               - approved
 *     responses:
 *       200:
 *         description: Complaint approval status set successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint approval status set successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/not-approval-set-complaint:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get non-approved complaints
 *     description: Retrieve a list of complaints that have not been approved.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of non-approved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Non-approved complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Complaint A"
 *                 - id: 2
 *                   title: "Complaint B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   name: Contractor - Complaint Assignment
 *   description: API for assigning complaints to users.
 */

/**
 * @swagger
 * /super-admin/assign-complaint-to-user:
 *   post:
 *     tags: [Contractor - Complaint Assignment]
 *     summary: Assign a complaint to a user
 *     description: Assign a complaint to a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             required:
 *               - complaintId
 *               - userId
 *     responses:
 *       200:
 *         description: Complaint assigned to user successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint assigned to user successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-complaint-type", verifySuperAdminToken, permissionCheck, addComplaintType);
Router.get("/super-admin/all-complaint-types", verifySuperAdminToken, getAllComplaintTypes);
Router.get("/super-admin/get-complaint-type/:id", verifySuperAdminToken, getComplaintTypeById);
Router.post("/super-admin/update-complaint-type", verifySuperAdminToken, permissionCheck, updateComplaintType);
Router.post("/super-admin/update-complaint-status", verifySuperAdminToken, updateComplaintStatus);
Router.post("/super-admin/create-complaint-sub-type", verifySuperAdminToken, permissionCheck, addComplaintSubType);
Router.get("/super-admin/get-all-complaints-sub-types", verifySuperAdminToken, getAllComplaintSubTypes);
Router.get("/super-admin/get-single-complaint-sub-type/:id", verifySuperAdminToken, getComplaintSubTypeById);
Router.post(
    "/super-admin/update-complaint-sub-types-details",
    verifySuperAdminToken,
    permissionCheck,
    updateComplaintSubType
);
Router.post("/super-admin/complaint-flitter", verifySuperAdminToken, complaintFlitter);
Router.post("/super-admin/complaint-assign", verifySuperAdminToken, complaintAssignTo);
Router.get("/super-admin/get-approvel-member-list", verifySuperAdminToken, getApprovelList);
Router.post("/super-admin/set-complaint-approval", verifySuperAdminToken, setComplaintApproval);
Router.get("/super-admin/not-approval-set-complaint", verifySuperAdminToken, notApprovalSetComplaint);
Router.post("/super-admin/assign-complaint-to-user", verifyContractorToken, assignedComplaintToUsers);

/**
 * @swagger
 * /super-admin/create-team:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a new team
 *     description: Add a new team to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentTeamId:
 *                 type: integer
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Team created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Team created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-parent-team-head:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get parent team head
 *     description: Retrieve the parent team head details.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Parent team head details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Parent team head fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Team Head A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-team-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get team details by ID
 *     description: Retrieve details of a specific team by its ID.
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
 *         description: Team details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Team details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Team A"
 *                 parentTeamId: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-team-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update team details
 *     description: Update the details of a specific team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               parentTeamId:
 *                 type: integer
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Team details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Team details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-team-group:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get team groups
 *     description: Retrieve a list of team groups.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of team groups retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Team groups fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Group A"
 *                 - id: 2
 *                   name: "Group B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/pending-software-activation-request:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all pending software activation requests
 *     description: Retrieve a list of all pending software activation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending software activation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pending software activation requests fetched successfully.
 *               data:
 *                 - id: 1
 *                   requestName: "Request A"
 *                 - id: 2
 *                   requestName: "Request B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/view-pending-request-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: View pending request details by ID
 *     description: Retrieve details of a specific pending request by its ID.
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
 *         description: Pending request details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pending request details fetched successfully.
 *               data:
 *                 id: 1
 *                 requestName: "Request A"
 *                 description: "Description of Request A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/approved-software-activation-request/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Approve software activation request
 *     description: Approve a software activation request by its ID.
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
 *         description: Software activation request approved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Software activation request approved successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/rejected-software-activation-request/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Reject software activation request
 *     description: Reject a software activation request by its ID.
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
 *         description: Software activation request rejected successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Software activation request rejected successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-software-activation-request/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete software activation request
 *     description: Delete a software activation request by its ID.
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
 *         description: Software activation request deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Software activation request deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-approved-software-activation-requests:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all approved software activation requests
 *     description: Retrieve a list of all approved software activation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved software activation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Approved software activation requests fetched successfully.
 *               data:
 *                 - id: 1
 *                   requestName: "Approved Request A"
 *                 - id: 2
 *                   requestName: "Approved Request B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-rejected-software-activation-requests:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all rejected software activation requests
 *     description: Retrieve a list of all rejected software activation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected software activation requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Rejected software activation requests fetched successfully.
 *               data:
 *                 - id: 1
 *                   requestName: "Rejected Request A"
 *                 - id: 2
 *                   requestName: "Rejected Request B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/feedback-and-suggestions:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all feedback and suggestions
 *     description: Retrieve a list of all feedback and suggestions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of feedback and suggestions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback and suggestions fetched successfully.
 *               data:
 *                 - id: 1
 *                   feedback: "Feedback A"
 *                 - id: 2
 *                   feedback: "Feedback B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-energy-companies:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all energy companies
 *     description: Retrieve a list of all energy companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of energy companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Energy Company A"
 *                 - id: 2
 *                   name: "Energy Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/energy-companies-contacts-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get energy companies' contact details by ID
 *     description: Retrieve contact details of a specific energy company by its ID.
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
 *         description: Energy company contact details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company contact details fetched successfully.
 *               data:
 *                 id: 1
 *                 contacts:
 *                   - name: "Contact A"
 *                     phone: "1234567890"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-zone-sub-users/{zone_id}/{user_id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get zone sub-users of an energy company
 *     description: Retrieve sub-users of a specific energy company zone.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone sub-users of the energy company retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zone sub-users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub User A"
 *                 - id: 2
 *                   name: "Sub User B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-regional-office-sub-users/{regional_id}/{user_id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get regional office sub-users of an energy company
 *     description: Retrieve sub-users of a specific regional office of an energy company.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regional_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regional office sub-users of the energy company retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Regional office sub-users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub User A"
 *                 - id: 2
 *                   name: "Sub User B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-sale-area-sub-users/{sale_area_id}/{user_id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get sale area sub-users of an energy company
 *     description: Retrieve sub-users of a specific sale area of an energy company.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sale_area_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale area sub-users of the energy company retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale area sub-users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sub User A"
 *                 - id: 2
 *                   name: "Sub User B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-user-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get energy company user details by ID
 *     description: Retrieve details of a specific energy company user by its ID.
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
 *         description: Energy company user details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "User A"
 *                 email: "usera@example.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-sub-user-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get energy company sub-user details by ID
 *     description: Retrieve details of a specific energy company sub-user by its ID.
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
 *         description: Energy company sub-user details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company sub-user details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Sub User A"
 *                 email: "subusera@example.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get energy company details by ID
 *     description: Retrieve details of a specific energy company by its ID.
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
 *         description: Energy company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Energy Company A"
 *                 contactEmail: "contact@energycompanya.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-energy-company-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update energy company details
 *     description: Update the details of a specific energy company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Energy company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-energy-company-user-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update energy company user details
 *     description: Update the details of a specific energy company user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Energy company user details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-energy-company-sub-user-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update energy company sub-user details
 *     description: Update the details of a specific energy company sub-user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Energy company sub-user details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company sub-user details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/energy-company-delete/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Delete an energy company
 *     description: Soft delete an energy company by its ID.
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
 *         description: Energy company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/energy-company-delete-user/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Delete an energy company user
 *     description: Soft delete an energy company user by its ID.
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
 *         description: Energy company user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/energy-company-delete-sub-user/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete an energy company sub-user
 *     description: Hard delete an energy company sub-user by its ID.
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
 *         description: Energy company sub-user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company sub-user deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-active-energy-companies:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all active energy companies
 *     description: Retrieve a list of all active energy companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active energy companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Active energy companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Active Energy Company A"
 *                 - id: 2
 *                   name: "Active Energy Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-energy-company:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all energy companies
 *     description: Retrieve a list of all energy companies, including inactive ones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all energy companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All energy companies fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Energy Company A"
 *                 - id: 2
 *                   name: "Energy Company B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-energy-company-with-soft-delete:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all energy companies with soft delete status
 *     description: Retrieve a list of all energy companies, including those marked for soft deletion.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all energy companies with soft delete status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All energy companies with soft delete status fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Energy Company A"
 *                   deletedAt: null
 *                 - id: 2
 *                   name: "Energy Company B"
 *                   deletedAt: "2024-01-01T00:00:00Z"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-team", verifySuperAdminToken, createTeam);
Router.get("/super-admin/get-parent-team-head", verifySuperAdminToken, getParentTeamHead);
Router.get("/super-admin/get-team-details/:id", verifySuperAdminToken, getTeamDetailsById);
Router.post("/super-admin/update-team-details", verifySuperAdminToken, updateTeamDetails);
Router.get("/super-admin/get-team-group", verifySuperAdminToken, getTeamGroup);
Router.get("/super-admin/pending-software-activation-request", verifySuperAdminToken, getAllPendingRequests);
Router.get("/super-admin/view-pending-request-details/:id", verifySuperAdminToken, viewSinglePendingRequestDetails);
Router.post(
    "/super-admin/approved-software-activation-request/:id",
    verifySuperAdminToken,
    approvedSoftwareActivationRequest
);
Router.post(
    "/super-admin/rejected-software-activation-request/:id",
    verifySuperAdminToken,
    rejectedSoftwareActivationRequest
);
Router.delete(
    "/super-admin/delete-software-activation-request/:id",
    verifySuperAdminToken,
    deleteSoftwareActivationRequest
);
Router.get("/super-admin/get-all-approved-software-activation-requests", verifySuperAdminToken, getAllApprovedRequests);
Router.get("/super-admin/get-all-rejected-software-activation-requests", verifySuperAdminToken, getAllRejectedRequests);
Router.get("/super-admin/feedback-and-suggestions", verifySuperAdminToken, getFeedbackComplaint);
Router.get("/super-admin/get-all-energy-companies", verifySuperAdminToken, getEnergyCompanies);
Router.get("/super-admin/energy-companies-contacts-details/:id", verifySuperAdminToken, getEnergyCompaniesContacts);
Router.get(
    "/super-admin/get-energy-company-zone-sub-users/:zone_id/:user_id",
    verifySuperAdminToken,
    getEnergyCompanyZoneSubUsers
);
Router.get(
    "/super-admin/get-energy-company-regional-office-sub-users/:regional_id/:user_id",
    verifySuperAdminToken,
    getEnergyCompanyRegionalOfficeSubUsers
);
Router.get(
    "/super-admin/get-energy-company-sale-area-sub-users/:sale_area_id/:user_id",
    verifySuperAdminToken,
    getEnergyCompanySaleAreaSubUsers
);
Router.get("/super-admin/get-energy-company-user-details/:id", verifySuperAdminToken, getEnergyCompanyUserDetailsById);
Router.get(
    "/super-admin/get-energy-company-sub-user-details/:id",
    verifySuperAdminToken,
    getEnergyCompanySubUserDetailById
);
Router.get("/super-admin/get-energy-company-details/:id", verifySuperAdminToken, getEnergyCompanyDetailsById);
Router.post(
    "/super-admin/update-energy-company-details",
    verifySuperAdminToken,
    permissionCheck,
    updateEnergyCompanyDetails
);
Router.post("/super-admin/update-energy-company-user-details", verifySuperAdminToken, updateEnergyCompanyUserDetails);
Router.post(
    "/super-admin/update-energy-company-sub-user-details",
    verifySuperAdminToken,
    updateEnergyCompanySubUserDetails
);
Router.post("/super-admin/energy-company-delete/:id", verifySuperAdminToken, permissionCheck, deleteEnergyCompany);
Router.post("/super-admin/energy-company-delete-user/:id", verifySuperAdminToken, deleteEnergyCompanyUser);
Router.delete("/super-admin/energy-company-delete-sub-user/:id", verifySuperAdminToken, energyCompanyDeleteSubUser);
// Router.get("/super-admin/get-active-energy-companies", verifySuperAdminToken, getAllActiveEnergyCompany);
Router.get("/super-admin/get-active-energy-companies",  verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllActiveEnergyCompany);
Router.get("/super-admin/get-all-energy-company", verifySuperAdminToken, getAllCreatedEnergyCompany);
Router.get(
    "/super-admin/get-all-energy-company-with-soft-delete",
    verifySuperAdminToken,
    getAllCreatedEnergyCompanyWithSoftDelete
);

/**
 * @swagger
 * /super-admin/get-all-pending-account-status-of-energy-company-and-users:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all pending account statuses of energy companies and users
 *     description: Retrieve a list of all pending account statuses for energy companies and their users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending account statuses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pending account statuses fetched successfully.
 *               data:
 *                 - id: 1
 *                   companyName: "Energy Company A"
 *                   userName: "User A"
 *                   status: "Pending"
 *                 - id: 2
 *                   companyName: "Energy Company B"
 *                   userName: "User B"
 *                   status: "Pending"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-account-status-of-energy-company-and-users:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update account status of energy companies and users
 *     description: Update the account status for energy companies and their users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Pending]
 *             required:
 *               - id
 *               - status
 *     responses:
 *       200:
 *         description: Account status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Account status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-energy-company-zones/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all zones by energy company ID
 *     description: Retrieve all zones associated with a specific energy company by its ID.
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
 *         description: List of zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Zones fetched successfully.
 *               data:
 *                 - id: 1
 *                   zoneName: "Zone A"
 *                 - id: 2
 *                   zoneName: "Zone B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-contractor:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a contractor
 *     description: Add a new contractor to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Contractor created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-contractor-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a single contractor
 *     description: Retrieve details of a specific contractor by its ID.
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
 *         description: Contractor details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Contractor A"
 *                 email: "contractora@example.com"
 *                 contactNumber: "1234567890"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-contractor-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update contractor details
 *     description: Update the details of a specific contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Contractor details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-contractor-users:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create contractor users
 *     description: Add new users associated with a contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractorId:
 *                 type: integer
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *             required:
 *               - contractorId
 *               - users
 *     responses:
 *       201:
 *         description: Contractor users created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor users created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-contractors-and-users:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all contractors and users
 *     description: Retrieve a list of all contractors and their associated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contractors and users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractors and users fetched successfully.
 *               data:
 *                 - id: 1
 *                   contractorName: "Contractor A"
 *                   users:
 *                     - id: 1
 *                       name: "User A"
 *                     - id: 2
 *                       name: "User B"
 *                 - id: 2
 *                   contractorName: "Contractor B"
 *                   users:
 *                     - id: 3
 *                       name: "User C"
 *                     - id: 4
 *                       name: "User D"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-contractors-and-users-details/{id}/{type}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of contractors and users by ID and type
 *     description: Retrieve details of a specific contractor or user by ID and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [contractor, user]
 *     responses:
 *       200:
 *         description: Contractor or user details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Contractor/User A"
 *                 email: "example@example.com"
 *                 contactNumber: "1234567890"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-contractors-and-users/{id}/{type}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete contractors or users by ID and type
 *     description: Soft delete a contractor or user by ID and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [contractor, user]
 *     responses:
 *       200:
 *         description: Contractor or user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor or user deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-pending-account-status-contractors-and-users:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all pending account statuses of contractors and users
 *     description: Retrieve a list of all pending account statuses for contractors and their users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending account statuses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pending account statuses fetched successfully.
 *               data:
 *                 - id: 1
 *                   contractorName: "Contractor A"
 *                   userName: "User A"
 *                   status: "Pending"
 *                 - id: 2
 *                   contractorName: "Contractor B"
 *                   userName: "User B"
 *                   status: "Pending"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/contractors-and-users-set-account-status:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Set account status for contractors and users
 *     description: Update the account status for contractors and their users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Pending]
 *             required:
 *               - id
 *               - status
 *     responses:
 *       200:
 *         description: Account status set successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Account status set successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-dealer-account:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a dealer account
 *     description: Add a new dealer account to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Dealer account created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer account created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-dealer-users:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create dealer users
 *     description: Add new users associated with a dealer.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealerId:
 *                 type: integer
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *             required:
 *               - dealerId
 *               - users
 *     responses:
 *       201:
 *         description: Dealer users created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer users created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-dealers-and-users:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all dealers and users
 *     description: Retrieve a list of all dealers and their associated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of dealers and users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealers and users fetched successfully.
 *               data:
 *                 - id: 1
 *                   dealerName: "Dealer A"
 *                   users:
 *                     - id: 1
 *                       name: "User A"
 *                     - id: 2
 *                       name: "User B"
 *                 - id: 2
 *                   dealerName: "Dealer B"
 *                   users:
 *                     - id: 3
 *                       name: "User C"
 *                     - id: 4
 *                       name: "User D"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-dealers-and-users-details/{id}/{type}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of dealers and users by ID and type
 *     description: Retrieve details of a specific dealer or user by ID and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dealer, user]
 *     responses:
 *       200:
 *         description: Dealer or user details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Dealer/User A"
 *                 email: "example@example.com"
 *                 contactNumber: "1234567890"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-dealers-and-users-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update dealer and user details
 *     description: Update the details of a specific dealer or user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *     responses:
 *       200:
 *         description: Dealer or user details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer or user details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-pending-account-status-of-dealers-and-users-details:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all pending account statuses of dealers and users
 *     description: Retrieve a list of all pending account statuses for dealers and their users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending account statuses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pending account statuses fetched successfully.
 *               data:
 *                 - id: 1
 *                   dealerName: "Dealer A"
 *                   userName: "User A"
 *                   status: "Pending"
 *                 - id: 2
 *                   dealerName: "Dealer B"
 *                   userName: "User B"
 *                   status: "Pending"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-account-status-of-dealers-and-users:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update account status of dealers and users
 *     description: Update the account status for dealers and their users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Pending]
 *             required:
 *               - id
 *               - status
 *     responses:
 *       200:
 *         description: Account status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Account status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-dealer-and-user/{id}/{type}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete dealer or user by ID and type
 *     description: Soft delete a dealer or user by ID and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dealer, user]
 *     responses:
 *       200:
 *         description: Dealer or user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer or user deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-tutorial:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a tutorial
 *     description: Add a new tutorial to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Tutorial created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-tutorials:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all tutorials
 *     description: Retrieve a list of all tutorials.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tutorials retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorials fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Tutorial A"
 *                   content: "Content of tutorial A."
 *                 - id: 2
 *                   title: "Tutorial B"
 *                   content: "Content of tutorial B."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-tutorial-formats/{format}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get details of a single tutorial by format
 *     description: Retrieve details of a specific tutorial by its format.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial details fetched successfully.
 *               data:
 *                 id: 1
 *                 title: "Tutorial A"
 *                 content: "Content of tutorial A."
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-tutorial-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update tutorial details
 *     description: Update the details of a specific tutorial.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - id
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Tutorial details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-tutorial/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a tutorial by ID
 *     description: Remove a specific tutorial by its ID.
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
 *         description: Tutorial deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-plan:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a plan
 *     description: Add a new plan to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - description
 *               - price
 *     responses:
 *       201:
 *         description: Plan created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plan created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-plans:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all plans
 *     description: Retrieve a list of all plans.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of plans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plans fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Plan A"
 *                   description: "Description of Plan A."
 *                   price: 10.00
 *                 - id: 2
 *                   name: "Plan B"
 *                   description: "Description of Plan B."
 *                   price: 20.00
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-plan-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get plan details by ID
 *     description: Retrieve details of a specific plan by its ID.
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
 *         description: Plan details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plan details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Plan A"
 *                 description: "Description of Plan A."
 *                 price: 10.00
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-plan-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update plan details
 *     description: Update the details of a specific plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - id
 *               - name
 *               - description
 *               - price
 *     responses:
 *       200:
 *         description: Plan details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plan details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-plan/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a plan by ID
 *     description: Remove a specific plan by its ID.
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
 *         description: Plan deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plan deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.get(
    "/super-admin/get-all-pending-account-status-of-energy-company-and-users",
    verifySuperAdminToken,
    getAllEnergyCompanyAndUsersWithPendingAccountStatus
);
Router.post(
    "/super-admin/update-account-status-of-energy-company-and-users",
    verifySuperAdminToken,
    energyCompanyAccountStatusAction
);
Router.get("/super-admin/get-energy-company-zones/:id", verifySuperAdminToken, getAllZoneByEnergyCompanyId);
Router.post("/super-admin/create-contractor", verifySuperAdminToken, contractorCreate);
Router.get("/super-admin/get-single-contractor-details/:id", verifySuperAdminToken, getContractorById);
Router.post(
    "/super-admin/update-contractor-details",
    verifySuperAdminToken,
    permissionCheck,
    updateContractorDetailsById
);
Router.post("/super-admin/create-contractor-users", verifySuperAdminToken, permissionCheck, createContractorUser);
Router.get("/super-admin/get-all-contractors-and-users", verifySuperAdminToken, getAllContractorAndUsers);
Router.get(
    "/super-admin/get-contractors-and-users-details/:id/:type",
    verifySuperAdminToken,
    getContractorAndUsersFullDetailByIdAndType
);
Router.delete(
    "/super-admin/delete-contractors-and-users/:id/:type",
    verifySuperAdminToken,
    permissionCheck,
    deleteContractorAndUsers
);
Router.get(
    "/super-admin/get-all-pending-account-status-contractors-and-users",
    verifySuperAdminToken,
    getAllContractorAndUsersWithPendingAccountStatus
);
Router.post(
    "/super-admin/contractors-and-users-set-account-status",
    verifySuperAdminToken,
    contractorAccountStatusAction
);
Router.post("/super-admin/create-dealer-account", verifySuperAdminToken, createDealer);
Router.post("/super-admin/create-dealer-users", verifySuperAdminToken, createDealerUser);
Router.get("/super-admin/get-all-dealers-and-users", verifySuperAdminToken, getDealersAndUsers);
Router.get(
    "/super-admin/get-dealers-and-users-details/:id/:type",
    verifySuperAdminToken,
    getDealerAndUserSingleRecordByIdAndType
);
Router.post("/super-admin/update-dealers-and-users-details", verifySuperAdminToken, updateDealerDetails);
Router.get(
    "/super-admin/get-all-pending-account-status-of-dealers-and-users-details",
    verifySuperAdminToken,
    getAllDealersAndUsersWithPendingAccountStatus
);
Router.post(
    "/super-admin/update-account-status-of-dealers-and-users",
    verifySuperAdminToken,
    dealersAccountStatusAction
);
Router.delete("/super-admin/delete-dealer-and-user/:id/:type", verifySuperAdminToken, deleteDealerAndUsers);
Router.post("/super-admin/create-tutorial", verifySuperAdminToken, createTutorial);
Router.get("/super-admin/get-all-tutorials", verifySuperAdminToken, getTutorials);
Router.get("/super-admin/get-tutorial-formats/:format", verifySuperAdminToken, getTutorialByFormat);
Router.post("/super-admin/update-tutorial-details", verifySuperAdminToken, updateTutorials);
Router.delete("/super-admin/delete-tutorial/:id", verifySuperAdminToken, deleteTutorialsById);
Router.post("/super-admin/create-plan", verifySuperAdminToken, permissionCheck, createPlan);
Router.get("/super-admin/get-all-plans", verifySuperAdminToken, getAllPlans);
Router.get("/super-admin/get-plan-details/:id", verifySuperAdminToken, getPlanById);
Router.post("/super-admin/update-plan-details", verifySuperAdminToken, permissionCheck, updatePlanDetails);
Router.delete("/super-admin/delete-plan/:id", verifySuperAdminToken, permissionCheck, deletePlan);

/**
 * @swagger
 * /super-admin/create-notifications:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create notifications
 *     description: Add a new notification to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - title
 *               - message
 *     responses:
 *       201:
 *         description: Notification created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Notification created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-notifications:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all notifications
 *     description: Retrieve a list of all notifications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Notifications fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Notification A"
 *                   message: "Message of Notification A"
 *                 - id: 2
 *                   title: "Notification B"
 *                   message: "Message of Notification B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-logged-user-notifications:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get notifications for logged user
 *     description: Retrieve notifications for the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications for the logged user retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Logged user notifications fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Notification A"
 *                   message: "Message of Notification A"
 *                 - id: 2
 *                   title: "Notification B"
 *                   message: "Message of Notification B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/count-logged-user-unread-notifications:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Count unread notifications for logged user
 *     description: Get the count of unread notifications for the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notifications count retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Unread notifications count fetched successfully.
 *               data:
 *                 unreadCount: 5
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/mark-as-read-notifications:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Mark notifications as read
 *     description: Mark notifications as read for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Notifications marked as read successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-item-master:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create item master
 *     description: Add a new item master to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Item master created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Item master created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-item-masters:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all item masters
 *     description: Retrieve a list of all item masters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of item masters retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Item masters fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Item A"
 *                   description: "Description of Item A"
 *                 - id: 2
 *                   name: "Item B"
 *                   description: "Description of Item B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-item-master-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get item master details by ID
 *     description: Retrieve details of a specific item master by its ID.
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
 *         description: Item master details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Item master details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Item A"
 *                 description: "Description of Item A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-item-master-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update item master details
 *     description: Update the details of a specific item master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Item master details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Item master details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-item-master/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete an item master by ID
 *     description: Remove a specific item master by its ID.
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
 *         description: Item master deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Item master deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-purpose-master:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create purpose master
 *     description: Add a new purpose master to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Purpose master created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purpose master created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-purpose-master:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all purpose masters
 *     description: Retrieve a list of all purpose masters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purpose masters retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purpose masters fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Purpose A"
 *                   description: "Description of Purpose A"
 *                 - id: 2
 *                   name: "Purpose B"
 *                   description: "Description of Purpose B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-purpose-master/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get purpose master details by ID
 *     description: Retrieve details of a specific purpose master by its ID.
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
 *         description: Purpose master details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purpose master details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Purpose A"
 *                 description: "Description of Purpose A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-purpose-master:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update purpose master details
 *     description: Update the details of a specific purpose master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Purpose master details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purpose master details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-purpose-master/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a purpose master by ID
 *     description: Remove a specific purpose master by its ID.
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
 *         description: Purpose master deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purpose master deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-survey:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create survey
 *     description: Add a new survey to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       201:
 *         description: Survey created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-surveys:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all surveys
 *     description: Retrieve a list of all surveys.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Surveys fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Survey A"
 *                   description: "Description of Survey A"
 *                 - id: 2
 *                   title: "Survey B"
 *                   description: "Description of Survey B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-survey-by-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get survey details by ID
 *     description: Retrieve details of a specific survey by its ID.
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
 *         description: Survey details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey details fetched successfully.
 *               data:
 *                 id: 1
 *                 title: "Survey A"
 *                 description: "Description of Survey A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/edit-survey-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Edit survey details by ID
 *     description: Retrieve and edit details of a specific survey by its ID.
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
 *         description: Survey details retrieved for editing.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey details fetched successfully for editing.
 *               data:
 *                 id: 1
 *                 title: "Survey A"
 *                 description: "Description of Survey A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-survey-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update survey details
 *     description: Update the details of a specific survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Survey details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-survey-details/{id}:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Delete a survey by ID
 *     description: Remove a specific survey by its ID.
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
 *         description: Survey deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-assign-survey:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get assigned surveys
 *     description: Retrieve surveys assigned to the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Assigned surveys fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Survey A"
 *                   description: "Description of Survey A"
 *                 - id: 2
 *                   title: "Survey B"
 *                   description: "Description of Survey B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/assign-survey:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Assign survey
 *     description: Assign a survey to a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             required:
 *               - surveyId
 *               - userId
 *     responses:
 *       201:
 *         description: Survey assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey assigned successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/changed-survey-status:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Change survey status
 *     description: Update the status of a specific survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *               status:
 *                 type: string
 *             required:
 *               - surveyId
 *               - status
 *     responses:
 *       200:
 *         description: Survey status changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/submit-survey-question-response:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Submit survey question response
 *     description: Submit responses to survey questions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     answer:
 *                       type: string
 *             required:
 *               - surveyId
 *               - responses
 *     responses:
 *       201:
 *         description: Survey question responses submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Responses submitted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-requested-survey:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get requested surveys
 *     description: Retrieve surveys that have been requested.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Requested surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Requested surveys fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Requested Survey A"
 *                   description: "Description of Requested Survey A"
 *                 - id: 2
 *                   title: "Requested Survey B"
 *                   description: "Description of Requested Survey B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-survey-response:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all survey responses
 *     description: Retrieve all responses submitted for surveys.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of survey responses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey responses fetched successfully.
 *               data:
 *                 - surveyId: 1
 *                   responses:
 *                     - questionId: 1
 *                       answer: "Answer A"
 *                     - questionId: 2
 *                       answer: "Answer B"
 *                 - surveyId: 2
 *                   responses:
 *                     - questionId: 1
 *                       answer: "Answer C"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-document-category:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create document category
 *     description: Add a new document category to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Document category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-document-categories:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all document categories
 *     description: Retrieve a list of all document categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of document categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document categories fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Category A"
 *                   description: "Description of Category A"
 *                 - id: 2
 *                   name: "Category B"
 *                   description: "Description of Category B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-document-category-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get document category details by ID
 *     description: Retrieve details of a specific document category by its ID.
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
 *         description: Document category details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Category A"
 *                 description: "Description of Category A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-notifications", verifySuperAdminToken, createNotifications);
Router.get("/super-admin/get-all-notifications", verifySuperAdminToken, getNotifications);
Router.get("/super-admin/get-logged-user-notifications", verifySuperAdminToken, getLoggedUserNotifications);
Router.get(
    "/super-admin/count-logged-user-unread-notifications",
    verifySuperAdminToken,
    countLoggedUserUnreadNotifications
);
Router.post("/super-admin/mark-as-read-notifications", verifySuperAdminToken, markAsReadNotifications);
Router.post("/super-admin/create-item-master", verifySuperAdminToken, permissionCheck, createItemMaster);
Router.get("/super-admin/get-all-item-masters", verifySuperAdminToken, getAllItemMasters);
Router.get("/super-admin/get-item-master-details/:id", verifySuperAdminToken, getSingleItemMaster);
Router.post("/super-admin/update-item-master-details", verifySuperAdminToken, permissionCheck, updateItemMaster);
Router.delete("/super-admin/delete-item-master/:id", verifySuperAdminToken, permissionCheck, deleteItemMaster);
Router.post("/super-admin/create-purpose-master", verifySuperAdminToken, permissionCheck, createPurposeMaster);
Router.get("/super-admin/get-all-purpose-master", verifySuperAdminToken, getAllPurposeMaster);
Router.get("/super-admin/get-single-purpose-master/:id", verifySuperAdminToken, getSinglePurposeMasterById);
Router.post("/super-admin/update-purpose-master", verifySuperAdminToken, permissionCheck, updatePurposeMaster);
Router.delete(
    "/super-admin/delete-purpose-master/:id",
    verifySuperAdminToken,
    permissionCheck,
    deletePurposeMasterById
);
Router.post("/super-admin/create-survey", verifySuperAdminToken, permissionCheck, createSurvey);
Router.get("/super-admin/get-all-surveys", verifySuperAdminToken, getAllSurvey);
Router.get("/super-admin/get-survey-by-id/:id", verifySuperAdminToken, getSurveyById);
Router.get("/super-admin/edit-survey-details/:id", verifySuperAdminToken, editSurveyDetails);
Router.post("/super-admin/update-survey-details", verifySuperAdminToken, permissionCheck, updateSurveyDetails);
Router.post("/super-admin/delete-survey-details/:id", verifySuperAdminToken, deleteSurvey);
Router.get("/super-admin/get-assign-survey", verifySuperAdminToken, getAssignedSurvey);
Router.post("/super-admin/assign-survey", verifySuperAdminToken, assignToSurvey);
Router.post("/super-admin/changed-survey-status", verifySuperAdminToken, updateRequestedSurveyStatus);
Router.post("/super-admin/submit-survey-question-response", verifySuperAdminToken, surveyQuestionFormResponse);
Router.get("/super-admin/get-requested-survey", verifySuperAdminToken, getRequestedSurvey);
Router.get("/super-admin/get-all-survey-response", verifySuperAdminToken, getSurveyQuestionResponse);
Router.post("/super-admin/create-document-category", verifySuperAdminToken, createDocumentCategory);
Router.get("/super-admin/get-all-document-categories", verifySuperAdminToken, getAllDocumentCategory);
Router.get("/super-admin/get-document-category-details/:id", verifySuperAdminToken, getDocumentCategoryById);

/**
 * @swagger
 * /super-admin/update-document-category-details:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update document category details
 *     description: Update the details of a specific document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Document category details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-document-category/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a document category by ID
 *     description: Remove a specific document category by its ID.
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
 *         description: Document category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-documents:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add new documents
 *     description: Add new documents to the system.
 *     requestBody:
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
 *       201:
 *         description: Documents added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Documents added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-document:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all documents
 *     description: Retrieve a list of all documents.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Documents fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Document A"
 *                   category: "Category A"
 *                 - id: 2
 *                   name: "Document B"
 *                   category: "Category B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/view-document/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: View document by ID
 *     description: Retrieve details of a specific document by its ID.
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
 *         description: Document details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Document A"
 *                 category: "Category A"
 *                 fileUrl: "https://example.com/document-a.pdf"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-document-on-category-id/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get documents by category ID
 *     description: Retrieve documents associated with a specific category ID.
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
 *         description: Documents for the specified category retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Documents fetched successfully for category ID.
 *               data:
 *                 - id: 1
 *                   name: "Document A"
 *                   category: "Category A"
 *                 - id: 2
 *                   name: "Document B"
 *                   category: "Category A"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-document/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a document by ID
 *     description: Remove a specific document by its ID.
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
 *         description: Document deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-document:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update document details
 *     description: Update the details of a specific document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: Document details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-task:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create a task
 *     description: Add a new task to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *               - status
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-task-lists:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tasks fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Task A"
 *                   description: "Description of Task A"
 *                   status: "Pending"
 *                 - id: 2
 *                   title: "Task B"
 *                   description: "Description of Task B"
 *                   status: "Completed"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-task-single-list/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get a single task by ID
 *     description: Retrieve details of a specific task by its ID.
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
 *         description: Task details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task details fetched successfully.
 *               data:
 *                 id: 1
 *                 title: "Task A"
 *                 description: "Description of Task A"
 *                 status: "Pending"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-task-list:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update task details
 *     description: Update the details of a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - id
 *               - title
 *               - description
 *               - status
 *     responses:
 *       200:
 *         description: Task details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-task/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a task by ID
 *     description: Remove a specific task by its ID.
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
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-task-status-for-dashboard:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get task status for dashboard
 *     description: Retrieve task statuses for the dashboard view.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task status for the dashboard retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task statuses fetched successfully.
 *               data:
 *                 - status: "Pending"
 *                   count: 5
 *                 - status: "Completed"
 *                   count: 10
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-main-task-status:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update main task status
 *     description: Update the status of a main task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               status:
 *                 type: string
 *             required:
 *               - taskId
 *               - status
 *     responses:
 *       200:
 *         description: Main task status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Main task status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-task-by-status:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all tasks by status
 *     description: Retrieve a list of all tasks filtered by status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks by status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tasks fetched successfully by status.
 *               data:
 *                 - id: 1
 *                   title: "Task A"
 *                   description: "Description of Task A"
 *                   status: "Pending"
 *                 - id: 2
 *                   title: "Task B"
 *                   description: "Description of Task B"
 *                   status: "Completed"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/create-task-category:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Create task category
 *     description: Add a new task category to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Task category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task category created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-task-category:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all task categories
 *     description: Retrieve a list of all task categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of task categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task categories fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Category A"
 *                   description: "Description of Category A"
 *                 - id: 2
 *                   name: "Category B"
 *                   description: "Description of Category B"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-task-category/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get task category details by ID
 *     description: Retrieve details of a specific task category by its ID.
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
 *         description: Task category details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task category details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Category A"
 *                 description: "Description of Category A"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-task-category:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update task category details
 *     description: Update the details of a specific task category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - id
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Task category details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task category details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-task-category/{id}:
 *   delete:
 *     tags: [Super Admin Routes]
 *     summary: Delete a task category by ID
 *     description: Remove a specific task category by its ID.
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
 *         description: Task category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task category deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-task-comment:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Add a comment to a task
 *     description: Add a new comment to a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               comment:
 *                 type: string
 *             required:
 *               - taskId
 *               - comment
 *     responses:
 *       201:
 *         description: Task comment added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task comment added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-task-comment:
 *   post:
 *     tags: [Super Admin Routes]
 *     summary: Update a task comment
 *     description: Update an existing comment on a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               comment:
 *                 type: string
 *             required:
 *               - id
 *               - comment
 *     responses:
 *       200:
 *         description: Task comment updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task comment updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-task-comment-details/{id}:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get task comment details by ID
 *     description: Retrieve details of a specific task comment by its ID.
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
 *         description: Task comment details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Task comment details fetched successfully.
 *               data:
 *                 id: 1
 *                 taskId: 1
 *                 comment: "This is a comment"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-apply-leave:
 *   get:
 *     tags: [Super Admin Routes]
 *     summary: Get all leave applications
 *     description: Retrieve a list of all leave applications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave applications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave applications fetched successfully.
 *               data:
 *                 - id: 1
 *                   employeeId: 1
 *                   leaveType: "Sick Leave"
 *                   startDate: "2024-08-15"
 *                   endDate: "2024-08-16"
 *                 - id: 2
 *                   employeeId: 2
 *                   leaveType: "Vacation"
 *                   startDate: "2024-08-20"
 *                   endDate: "2024-08-25"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/update-document-category-details", verifySuperAdminToken, updateDocumentCategory);
Router.delete("/super-admin/delete-document-category/:id", verifySuperAdminToken, removeDocumentCategoryById);
Router.post("/super-admin/add-documents", addDocuments);
Router.get("/super-admin/get-all-document", verifySuperAdminToken, getAllDocuments);
Router.get("/super-admin/view-document/:id", verifySuperAdminToken, viewDocuments);
Router.get("/super-admin/get-document-on-category-id/:id", verifySuperAdminToken, getDocumentOnCategoryById);
Router.delete("/super-admin/delete-document/:id", verifySuperAdminToken, removeDocumentById);
Router.post("/super-admin/update-document", updateDocuments);
Router.post("/super-admin/create-task", verifySuperAdminToken, createTask);
Router.get("/super-admin/get-task-lists", verifySuperAdminToken, getAllTaskList);
Router.get("/super-admin/get-task-single-list/:id", verifySuperAdminToken, getTaskById);
Router.post("/super-admin/update-task-list", verifySuperAdminToken, updateTaskDetails);
Router.delete("/super-admin/delete-task/:id", verifySuperAdminToken, deleteTask);
Router.get("/super-admin/get-task-status-for-dashboard", verifySuperAdminToken, taskDashboard);
Router.post("/super-admin/update-main-task-status", verifySuperAdminToken, updateMainTaskStatus);
Router.get("/super-admin/get-all-task-by-status", verifySuperAdminToken, getAllTaskByStatus);
Router.post("/super-admin/create-task-category", verifySuperAdminToken, createTaskCategory);
Router.get("/super-admin/get-all-task-category", verifySuperAdminToken, getAllTaskCategory);
Router.get("/super-admin/get-single-task-category/:id", verifySuperAdminToken, getSingleTaskCategory);
Router.post("/super-admin/update-task-category", verifySuperAdminToken, updateTaskCategoryDetails);
Router.delete("/super-admin/delete-task-category/:id", verifySuperAdminToken, removeTaskCategoryById);
Router.post("/super-admin/add-task-comment", verifySuperAdminToken, createTaskComment);
Router.post("/super-admin/update-task-comment", verifySuperAdminToken, updateTaskComment);
Router.get("/super-admin/get-task-comment-details/:id", verifySuperAdminToken, getTaskCommentDetailsById);
Router.get("/super-admin/all-apply-leave", verifySuperAdminToken, getAllLeaveApplications);

//HR management

/**
 * @swagger
 * tags:
 *   - name: Super Admin - HR Team Management
 *     description: Operations related to HR team management.
 */

/**
 * @swagger
 * /super-admin/create-hr-team:
 *   post:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Create a new HR team
 *     description: Create a new HR team with members.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               teamName: Recruitment Team
 *               members: [1, 2, 3]
 *     responses:
 *       201:
 *         description: HR team created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-hr-teams:
 *   get:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Get all HR teams
 *     description: Retrieve a list of all HR teams with their members.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all HR teams.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data: [
 *                 {
 *                   teamId: 1,
 *                   teamName: Recruitment Team,
 *                   members: [1, 2, 3]
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-hr-team-detail/{id}:
 *   get:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Get details of a single HR team
 *     description: Retrieve details of a specific HR team by its ID.
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
 *         description: HR team details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data: {
 *                 teamId: 1,
 *                 teamName: Recruitment Team,
 *                 members: [1, 2, 3]
 *               }
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: HR team not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-hr-team-details:
 *   post:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Update HR team details
 *     description: Update the details of an existing HR team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *               teamName:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               teamId: 1
 *               teamName: Recruitment Team
 *               members: [1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: HR team updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-hr-team/{team_id}:
 *   delete:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Delete an HR team
 *     description: Delete a specific HR team by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HR team deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: HR team not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/remove-specific-user-from-team:
 *   post:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Remove a user from an HR team
 *     description: Remove a specific user from an HR team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             example:
 *               teamId: 1
 *               userId: 2
 *     responses:
 *       200:
 *         description: User removed from HR team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User removed from HR team successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or team not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-specific-user-to-team:
 *   post:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Add a user to an HR team
 *     description: Add a specific user to an HR team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             example:
 *               teamId: 1
 *               userId: 3
 *     responses:
 *       200:
 *         description: User added to HR team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User added to HR team successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or team not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-users-list-to-add-in-team/{team_id}:
 *   get:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Get list of users to add to an HR team
 *     description: Retrieve a list of users who can be added to a specific HR team.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data: [
 *                 {
 *                   userId: 4,
 *                   userName: Jane Doe
 *                 }
 *               ]
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: HR team not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-users-list-without-team:
 *   get:
 *     tags: [Super Admin - HR Team Management]
 *     summary: Get list of users without a team
 *     description: Retrieve a list of users who are not part of any HR team.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users without a team retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data: [
 *                 {
 *                   userId: 5,
 *                   userName: John Smith
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error
 */
Router.post("/super-admin/create-hr-team", verifySuperAdminToken, permissionCheck, createHrTeam);
Router.get("/super-admin/get-all-hr-teams", verifySuperAdminToken, getAllHrTeamWithMember);
Router.get("/super-admin/get-single-hr-team-detail/:id", verifySuperAdminToken, getHrTeamDetailsById);
Router.post("/super-admin/update-hr-team-details", verifySuperAdminToken, permissionCheck, updateHrTeamDetails);
Router.delete("/super-admin/delete-hr-team/:team_id", verifySuperAdminToken, permissionCheck, deleteHrTeam);
Router.post("/super-admin/remove-specific-user-from-team", verifySuperAdminToken, removeSpecificUserFromTeam);
Router.post("/super-admin/add-specific-user-to-team", verifySuperAdminToken, addNewMemberInTeam);
Router.get("/super-admin/get-users-list-to-add-in-team/:team_id", verifySuperAdminToken, getMemberListToAddInTeam);
Router.get("/super-admin/get-users-list-without-team", verifySuperAdminToken, getMemberListWithoutTeam);

//break hr

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Break Management
 *     description: Operations related to break management.
 */

/**
 * @swagger
 * /super-admin/create-break:
 *   post:
 *     tags: [Super Admin - Break Management]
 *     summary: Create a new break
 *     description: Add a new break to the system.
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
 *               duration:
 *                 type: integer
 *             example:
 *               name: Lunch Break
 *               duration: 30
 *     responses:
 *       201:
 *         description: Break created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Break created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-breaks:
 *   get:
 *     tags: [Super Admin - Break Management]
 *     summary: Get all breaks
 *     description: Retrieve a list of all breaks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all breaks.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               breaks:
 *                 - id: 1
 *                   name: Lunch Break
 *                   duration: 30
 *                 - id: 2
 *                   name: Coffee Break
 *                   duration: 15
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-break-details/{id}:
 *   get:
 *     tags: [Super Admin - Break Management]
 *     summary: Get details of a single break
 *     description: Retrieve details of a specific break by its ID.
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
 *         description: Details of the break.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               break:
 *                 id: 1
 *                 name: Lunch Break
 *                 duration: 30
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Break not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-break:
 *   post:
 *     tags: [Super Admin - Break Management]
 *     summary: Update a break
 *     description: Modify an existing break.
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
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *             example:
 *               id: 1
 *               name: Extended Lunch Break
 *               duration: 45
 *     responses:
 *       200:
 *         description: Break updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Break updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Break not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-breaks/{id}:
 *   delete:
 *     tags: [Super Admin - Break Management]
 *     summary: Delete a break
 *     description: Remove a specific break by its ID.
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
 *         description: Break deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Break deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Break not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-break", verifySuperAdminToken, createBreaks);
Router.get("/super-admin/get-all-breaks", verifySuperAdminToken, getAllBreaks);
Router.get("/super-admin/get-single-break-details/:id", verifySuperAdminToken, getBreakOnId);
Router.post("/super-admin/update-break", verifySuperAdminToken, updateBreaks);
Router.delete("/super-admin/delete-breaks/:id", verifySuperAdminToken, deleteBreak);

//HR management attendance management

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Attendance Management
 *     description: Operations related to employee attendance and breaks.
 */

/**
 * @swagger
 * /super-admin/clock-in:
 *   post:
 *     summary: Record clock-in time for an employee
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp123"
 *     responses:
 *       200:
 *         description: Clock-in recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/clock-out:
 *   post:
 *     summary: Record clock-out time for an employee
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp123"
 *     responses:
 *       200:
 *         description: Clock-out recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/check-full-month-clock-in:
 *   get:
 *     summary: Check clock-in times for the entire month
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of clock-in times for the month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-08-01"
 *                   clockInTime:
 *                     type: string
 *                     example: "08:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/mark-break:
 *   post:
 *     summary: Mark the start of a break
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp123"
 *     responses:
 *       200:
 *         description: Break start recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/break-end:
 *   post:
 *     summary: Mark the end of a break
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp123"
 *     responses:
 *       200:
 *         description: Break end recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
Router.post("/super-admin/clock-in", verifySuperAdminToken, clockIn);
Router.post("/super-admin/clock-out", verifySuperAdminToken, clockOut);
Router.get("/super-admin/check-full-month-clock-in", verifySuperAdminToken, checkClockInToday);
Router.post("/super-admin/mark-break", verifySuperAdminToken, startBreak);
Router.post("/super-admin/break-end", verifySuperAdminToken, endBreak);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Employee Management
 *     description: Operations related to employee details and tasks.
 */

/**
 * @swagger
 * /super-admin/get-all-employees:
 *   get:
 *     summary: Get all stored employee details
 *     tags: [Super Admin - Employee Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: string
 *                     example: "emp123"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "jdoe@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-single-employee-detail/{id}:
 *   get:
 *     summary: Get single employee detail by ID
 *     tags: [Super Admin - Employee Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the employee
 *         schema:
 *           type: string
 *           example: "emp123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Details of the specified employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeId:
 *                   type: string
 *                   example: "emp123"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "jdoe@example.com"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/update-single-employee-detail:
 *   post:
 *     summary: Update details of a single employee
 *     tags: [Super Admin - Employee Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "jdoe@example.com"
 *     responses:
 *       200:
 *         description: Employee details updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/delete-employee/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Super Admin - Employee Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the employee
 *         schema:
 *           type: string
 *           example: "emp123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-employee-assign-tasks:
 *   get:
 *     summary: Get assigned tasks for an employee
 *     tags: [Super Admin - Employee Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of tasks assigned to the employee
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   taskId:
 *                     type: string
 *                     example: "task123"
 *                   taskName:
 *                     type: string
 *                     example: "Complete report"
 *                   status:
 *                     type: string
 *                     example: "In Progress"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
Router.get("/super-admin/get-all-employees", verifySuperAdminToken, getAllStoredEmployeeDetailsForSuperAdmin);
Router.get(
    "/super-admin/get-single-employee-detail/:id",
    verifySuperAdminToken,
    getSingleEmployeeDetailByIdForSuperAdmin
);
Router.post("/super-admin/update-single-employee-detail", verifySuperAdminToken, updateEmployeeDetails);
Router.delete("/super-admin/delete-employee/:id", verifySuperAdminToken, permissionCheck, deleteSuperAdminEmployees);
Router.get("/super-admin/get-employee-assign-tasks", verifySuperAdminToken, getEmployeeTaskById);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Attendance Management
 *     description: Operations related to attendance management for super admin.
 */

/**
 * @swagger
 * /super-admin/get-user-time-sheet/{id}:
 *   get:
 *     summary: Get user's time sheet by ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Time sheet of the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 timeSheet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       clockIn:
 *                         type: string
 *                         example: "08:00:00"
 *                       clockOut:
 *                         type: string
 *                         example: "17:00:00"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-users-time-sheet-for-admin:
 *   get:
 *     summary: Get all users' time sheets for admin
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all users' time sheets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   timeSheet:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2024-08-01"
 *                         clockIn:
 *                           type: string
 *                           example: "08:00:00"
 *                         clockOut:
 *                           type: string
 *                           example: "17:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/mark-manual-attendance:
 *   post:
 *     summary: Mark manual attendance for a user
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               clockIn:
 *                 type: string
 *                 example: "08:00:00"
 *               clockOut:
 *                 type: string
 *                 example: "17:00:00"
 *     responses:
 *       200:
 *         description: Manual attendance marked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-users-attendance-in-calendar-view:
 *   get:
 *     summary: Get all users' attendance in a calendar view
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Calendar view of all users' attendance
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   attendance:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2024-08-01"
 *                         status:
 *                           type: string
 *                           example: "Present"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-single-user-attendance-in-calendar-view/{id}:
 *   get:
 *     summary: Get a single user's attendance in a calendar view
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Calendar view of the specified user's attendance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 attendance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       status:
 *                         type: string
 *                         example: "Present"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-user-attendance-in-chart/{id}:
 *   get:
 *     summary: Get user attendance in a chart view
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Attendance chart for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 chart:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "bar"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-08-01"
 *                           hoursWorked:
 *                             type: number
 *                             example: 8
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-today-mark-login-and-break:
 *   get:
 *     summary: Get today's marked login and break times
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Today's login and break times
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-08-16"
 *                 login:
 *                   type: string
 *                   example: "08:00:00"
 *                 break:
 *                   type: string
 *                   example: "12:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-total-month-work-hours:
 *   get:
 *     summary: Get total work hours for the month
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Total work hours for the current month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                   example: "August"
 *                 year:
 *                   type: number
 *                   example: 2024
 *                 totalHours:
 *                   type: number
 *                   example: 160
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-user-time-sheet:
 *   get:
 *     summary: Get all users' time sheets
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all users' time sheets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   timeSheet:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2024-08-01"
 *                         clockIn:
 *                           type: string
 *                           example: "08:00:00"
 *                         clockOut:
 *                           type: string
 *                           example: "17:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-user-today-clock-in:
 *   get:
 *     summary: Get all users' clock-in times for today
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all users' clock-in times for today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   clockInTime:
 *                     type: string
 *                     example: "08:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-user-today-clock-out:
 *   get:
 *     summary: Get all users' clock-out times for today
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all users' clock-out times for today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   clockOutTime:
 *                     type: string
 *                     example: "17:00:00"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/change-user-attendance-status-by-super-admin:
 *   post:
 *     summary: Change user attendance status by super admin
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               status:
 *                 type: string
 *                 example: "Clocked In"
 *     responses:
 *       200:
 *         description: User attendance status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/mark-manually-attendance-for-user:
 *   post:
 *     summary: Mark manual attendance for a user
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               clockIn:
 *                 type: string
 *                 example: "08:00:00"
 *               clockOut:
 *                 type: string
 *                 example: "17:00:00"
 *     responses:
 *       200:
 *         description: Manual attendance marked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-login-credentials/{id}:
 *   get:
 *     summary: Get login credentials by user ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Login credentials for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 username:
 *                   type: string
 *                   example: "jdoe"
 *                 password:
 *                   type: string
 *                   example: "password123"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/send-login-credentials-via-email:
 *   post:
 *     summary: Send login credentials via email
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "jdoe@example.com"
 *     responses:
 *       200:
 *         description: Login credentials sent via email successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/send-login-credentials-via-whatsapp/{id}:
 *   get:
 *     summary: Send login credentials via WhatsApp
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Login credentials sent via WhatsApp successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/update-user-status:
 *   post:
 *     summary: Update user status
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               status:
 *                 type: string
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-user-status-timeline/{id}:
 *   get:
 *     summary: Get user status timeline by ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Status timeline of the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-08-01"
 *                   status:
 *                     type: string
 *                     example: "Active"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-users-by-role/{id}:
 *   get:
 *     summary: Get users by role ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the role
 *         schema:
 *           type: string
 *           example: "role123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of users by role ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-admins-by-role/{id}:
 *   get:
 *     summary: Get admins by role ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the role
 *         schema:
 *           type: string
 *           example: "role123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of admins by role ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   adminId:
 *                     type: string
 *                     example: "admin123"
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-users-by-admin-id/{id}:
 *   get:
 *     summary: Get users by admin ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the admin
 *         schema:
 *           type: string
 *           example: "admin123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of users by admin ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-users:
 *   get:
 *     summary: Get all users
 *     tags: [Super Admin - Attendance Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "user123"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "jdoe@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-user-by-id/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Super Admin - Attendance Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *           example: "user123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User details by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "jdoe@example.com"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
Router.get("/super-admin/get-user-time-sheet/:id", verifySuperAdminToken, timeSheet);
Router.get(
    "/super-admin/get-all-users-time-sheet-for-admin",
    verifySuperAdminToken,
    getTimeSheetOfAllUserForSuperAdmin
);
Router.post("/super-admin/mark-manual-attendance", verifySuperAdminToken, markAttendance);
Router.get(
    "/super-admin/get-all-users-attendance-in-calendar-view",
    verifySuperAdminToken,
    getAllUserTimeSheetInCalendarView
);
Router.get(
    "/super-admin/get-single-user-attendance-in-calendar-view/:id",
    verifySuperAdminToken,
    getSingleUserAttendanceTimeSheetInCalendarView
);
Router.get("/super-admin/get-user-attendance-in-chart/:id", verifySuperAdminToken, getAttendanceChartById);
Router.get("/super-admin/get-today-mark-login-and-break", verifySuperAdminToken, checkTodayMarkBreakAndAttendance);
Router.get("/super-admin/get-total-month-work-hours", verifySuperAdminToken, getMonthsTotalWorkHour);
Router.get("/super-admin/get-all-user-time-sheet", verifySuperAdminToken, checkTotalUsersTimeSheet);
Router.get("/super-admin/get-all-user-today-clock-in", verifySuperAdminToken, getAllUsersTodayClockIn);
Router.get("/super-admin/get-all-user-today-clock-out", verifySuperAdminToken, getAllUsersTodayClockOut);
Router.post(
    "/super-admin/change-user-attendance-status-by-super-admin",
    verifySuperAdminToken,
    markUserClockInClockOutBySuperAdmin
);
Router.post(
    "/super-admin/mark-manually-attendance-for-user",
    verifySuperAdminToken,
    permissionCheck,
    createManuallyClockInClockOut
);
Router.get("/super-admin/get-login-credentials/:id", verifySuperAdminToken, getEmployeeLoginDetailsById);
Router.post("/super-admin/send-login-credentials-via-email", verifySuperAdminToken, sendLoginCredentialsViaEmail);
Router.get(
    "/super-admin/send-login-credentials-via-whatsapp/:id",
    verifySuperAdminToken,
    sendLoginCredentialsViaWhatsApp
);
Router.post("/super-admin/update-user-status", verifySuperAdminToken, changeAdminUserStatus);
Router.get("/super-admin/get-user-status-timeline/:id", verifySuperAdminToken, userStatusTimeLine);
Router.get("/super-admin/get-users-by-role/:id", verifySuperAdminToken, getUsersByRoleId);
Router.get("/super-admin/get-admins-by-role/:id", verifySuperAdminToken, getAdminsByRoleId);
Router.get("/super-admin/get-users-by-admin-id/:id", verifySuperAdminToken, getUsersByAdminId);
Router.get("/super-admin/get-all-users", verifySuperAdminToken, getAllUsers);
Router.get("/super-admin/get-all-contact-users", verifySuperAdminToken, getContactsForChat);
Router.get("/contractor/get-all-contact-users", verifyContractorToken, getContactsForChat);
Router.get("/super-admin/get-user-by-id/:id", verifySuperAdminToken, getUserById);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Leave Management
 *     description: Operations related to leave management for super admin.
 */

/**
 * @swagger
 * /super-admin/create-leave-type:
 *   post:
 *     summary: Create a new leave type
 *     tags: [Super Admin - Leave Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sick Leave"
 *               description:
 *                 type: string
 *                 example: "Leave taken due to illness"
 *               daysAllowed:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Leave type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "leave123"
 *                 name:
 *                   type: string
 *                   example: "Sick Leave"
 *                 description:
 *                   type: string
 *                   example: "Leave taken due to illness"
 *                 daysAllowed:
 *                   type: number
 *                   example: 10
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-all-leave-type:
 *   get:
 *     summary: Get list of all leave types
 *     tags: [Super Admin - Leave Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all leave types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "leave123"
 *                   name:
 *                     type: string
 *                     example: "Sick Leave"
 *                   description:
 *                     type: string
 *                     example: "Leave taken due to illness"
 *                   daysAllowed:
 *                     type: number
 *                     example: 10
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-active-leave-type:
 *   get:
 *     summary: Get list of all active leave types
 *     tags: [Super Admin - Leave Management]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of active leave types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "leave123"
 *                   name:
 *                     type: string
 *                     example: "Sick Leave"
 *                   description:
 *                     type: string
 *                     example: "Leave taken due to illness"
 *                   daysAllowed:
 *                     type: number
 *                     example: 10
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-leave-type-by-id/{id}:
 *   get:
 *     summary: Get leave type by ID
 *     tags: [Super Admin - Leave Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the leave type
 *         schema:
 *           type: string
 *           example: "leave123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Details of the specified leave type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "leave123"
 *                 name:
 *                   type: string
 *                   example: "Sick Leave"
 *                 description:
 *                   type: string
 *                   example: "Leave taken due to illness"
 *                 daysAllowed:
 *                   type: number
 *                   example: 10
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/update-leave-type-details:
 *   post:
 *     summary: Update leave type details
 *     tags: [Super Admin - Leave Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "leave123"
 *               name:
 *                 type: string
 *                 example: "Updated Sick Leave"
 *               description:
 *                 type: string
 *                 example: "Updated description for sick leave"
 *               daysAllowed:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Leave type details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "leave123"
 *                 name:
 *                   type: string
 *                   example: "Updated Sick Leave"
 *                 description:
 *                   type: string
 *                   example: "Updated description for sick leave"
 *                 daysAllowed:
 *                   type: number
 *                   example: 12
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/delete-leave-type/{id}:
 *   delete:
 *     summary: Delete a leave type
 *     tags: [Super Admin - Leave Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the leave type to delete
 *         schema:
 *           type: string
 *           example: "leave123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Leave type deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/apply-leave:
 *   post:
 *     summary: Apply for leave
 *     tags: [Super Admin - Leave Management]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               leaveTypeId:
 *                 type: string
 *                 example: "leave123"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-05"
 *               reason:
 *                 type: string
 *                 example: "Medical reasons"
 *     responses:
 *       200:
 *         description: Leave applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "leaveApplication123"
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 leaveTypeId:
 *                   type: string
 *                   example: "leave123"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-08-01"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-08-05"
 *                 reason:
 *                   type: string
 *                   example: "Medical reasons"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
Router.post("/super-admin/create-leave-type", verifySuperAdminToken, permissionCheck, createLeaveType);
Router.get("/super-admin/get-all-leave-type", verifySuperAdminToken, getAllLeaveType);
Router.get("/super-admin/get-active-leave-type", verifySuperAdminToken, getAllActiveLeaveType);
Router.get("/super-admin/get-leave-type-by-id/:id", verifySuperAdminToken, getAllLeaveTypeById);
Router.post("/super-admin/update-leave-type-details", verifySuperAdminToken, permissionCheck, updateLeaveType);
Router.delete("/super-admin/delete-leave-type/:id", verifySuperAdminToken, permissionCheck, deleteLeaveType);
Router.post("/super-admin/apply-leave", verifySuperAdminToken, permissionCheck, applyLeave);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Group Insurance
 *     description: Operations related to group insurance management for super admin.
 */

/**
 * @swagger
 * /super-admin/create-group-insurance:
 *   post:
 *     summary: Create a new group insurance
 *     tags: [Super Admin - Group Insurance]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Health Coverage Plan"
 *               coverage:
 *                 type: string
 *                 example: "Full medical coverage including hospitalization"
 *               premium:
 *                 type: number
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Group insurance created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   example: "Health Coverage Plan"
 *                 coverage:
 *                   type: string
 *                   example: "Full medical coverage including hospitalization"
 *                 premium:
 *                   type: number
 *                   example: 1200
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-group-insurance-list:
 *   get:
 *     summary: Get list of all group insurances
 *     tags: [Super Admin - Group Insurance]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all group insurances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "abc123"
 *                   name:
 *                     type: string
 *                     example: "Health Coverage Plan"
 *                   coverage:
 *                     type: string
 *                     example: "Full medical coverage including hospitalization"
 *                   premium:
 *                     type: number
 *                     example: 1200
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/get-group-insurance-single-details/{id}:
 *   get:
 *     summary: Get details of a single group insurance
 *     tags: [Super Admin - Group Insurance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group insurance
 *         schema:
 *           type: string
 *           example: "abc123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Details of the specified group insurance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   example: "Health Coverage Plan"
 *                 coverage:
 *                   type: string
 *                   example: "Full medical coverage including hospitalization"
 *                 premium:
 *                   type: number
 *                   example: 1200
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/update-group-insurance-details:
 *   post:
 *     summary: Update group insurance details
 *     tags: [Super Admin - Group Insurance]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "abc123"
 *               name:
 *                 type: string
 *                 example: "Updated Health Coverage Plan"
 *               coverage:
 *                 type: string
 *                 example: "Updated medical coverage including hospitalization"
 *               premium:
 *                 type: number
 *                 example: 1300
 *     responses:
 *       200:
 *         description: Group insurance details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   example: "Updated Health Coverage Plan"
 *                 coverage:
 *                   type: string
 *                   example: "Updated medical coverage including hospitalization"
 *                 premium:
 *                   type: number
 *                   example: 1300
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /super-admin/delete-group-insurance-details/{id}:
 *   delete:
 *     summary: Delete a group insurance
 *     tags: [Super Admin - Group Insurance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group insurance to delete
 *         schema:
 *           type: string
 *           example: "abc123"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Group insurance deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
Router.post("/super-admin/create-group-insurance", verifySuperAdminToken, permissionCheck, createGroupInsurance);
Router.get("/super-admin/get-group-insurance-list", verifySuperAdminToken, getAllGroupInsurance);
Router.get(
    "/super-admin/get-group-insurance-single-details/:id",
    verifySuperAdminToken,
    getSingleGroupInsuranceDetails
);
Router.post(
    "/super-admin/update-group-insurance-details",
    verifySuperAdminToken,
    permissionCheck,
    updateGroupInsuranceDetails
);
Router.delete(
    "/super-admin/delete-group-insurance-details/:id",
    verifySuperAdminToken,
    permissionCheck,
    deleteGroupInsurance
);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Insurance Company Management
 *     description: Operations related to insurance company management.
 */

/**
 * @swagger
 * /super-admin/register-insurance-company:
 *   post:
 *     tags: [Super Admin - Insurance Company Management]
 *     summary: Register a new insurance company
 *     description: Register a new insurance company with the provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the insurance company to register
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: ABC Insurance
 *             address: "123 Main Street, City, Country"
 *             phone: "+123456789"
 *             email: "contact@abcinsurance.com"
 *     responses:
 *       201:
 *         description: Insurance company registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company registered successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-insurance-company-list:
 *   get:
 *     tags: [Super Admin - Insurance Company Management]
 *     summary: Get all insurance companies
 *     description: Retrieve a list of all registered insurance companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of insurance companies.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: ABC Insurance
 *                   address: "123 Main Street, City, Country"
 *                   phone: "+123456789"
 *                   email: "contact@abcinsurance.com"
 *                 - id: 2
 *                   name: XYZ Insurance
 *                   address: "456 Another St, City, Country"
 *                   phone: "+987654321"
 *                   email: "info@xyzinsurance.com"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-insurance-company-single-details/{id}:
 *   get:
 *     tags: [Super Admin - Insurance Company Management]
 *     summary: Get details of a specific insurance company
 *     description: Retrieve detailed information about a specific insurance company by its ID.
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
 *         description: Details of the insurance company.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: ABC Insurance
 *                 address: "123 Main Street, City, Country"
 *                 phone: "+123456789"
 *                 email: "contact@abcinsurance.com"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance company not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-insurance-company-details:
 *   post:
 *     tags: [Super Admin - Insurance Company Management]
 *     summary: Update insurance company details
 *     description: Update the details of an existing insurance company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the insurance company
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             name: ABC Insurance
 *             address: "123 Main Street, City, Country"
 *             phone: "+123456789"
 *             email: "newcontact@abcinsurance.com"
 *     responses:
 *       200:
 *         description: Insurance company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance company not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-insurance-company/{id}:
 *   post:
 *     tags: [Super Admin - Insurance Company Management]
 *     summary: Delete an insurance company
 *     description: Remove a specific insurance company by its ID.
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
 *         description: Insurance company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance company not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/register-insurance-company", verifySuperAdminToken, registerInsuranceCompany);
Router.get("/super-admin/get-insurance-company-list", verifySuperAdminToken, getAllInsuranceCompanyList);
Router.get(
    "/super-admin/get-insurance-company-single-details/:id",
    verifySuperAdminToken,
    getSingleInsuranceCompanyDetails
);
Router.post("/super-admin/update-insurance-company-details", verifySuperAdminToken, updateInsuranceCompanyDetails);
Router.post("/super-admin/delete-insurance-company/:id", verifySuperAdminToken, deleteInsuranceCompanyById);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Insurance Company Plans Management
 *     description: Operations related to insurance company plans management.
 */

/**
 * @swagger
 * /super-admin/register-insurance-company-plans:
 *   post:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Register a new insurance company plan
 *     description: Register a new insurance plan for an insurance company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the insurance plan to register
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             companyId: 1
 *             planName: Gold Plan
 *             coverageAmount: 50000
 *             premium: 1500
 *     responses:
 *       201:
 *         description: Insurance plan registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance plan registered successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-insurance-plan-list:
 *   get:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Get all insurance plans
 *     description: Retrieve a list of all registered insurance plans.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of insurance plans.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   planName: Gold Plan
 *                   companyId: 1
 *                   coverageAmount: 50000
 *                   premium: 1500
 *                 - id: 2
 *                   planName: Silver Plan
 *                   companyId: 1
 *                   coverageAmount: 30000
 *                   premium: 1000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-insurance-plan-details/{id}:
 *   get:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Get details of a specific insurance plan
 *     description: Retrieve detailed information about a specific insurance plan by its ID.
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
 *         description: Details of the insurance plan.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 planName: Gold Plan
 *                 companyId: 1
 *                 coverageAmount: 50000
 *                 premium: 1500
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-insurance-plan-details:
 *   post:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Update insurance plan details
 *     description: Update the details of an existing insurance plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the insurance plan
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             planName: Platinum Plan
 *             companyId: 1
 *             coverageAmount: 100000
 *             premium: 2000
 *     responses:
 *       200:
 *         description: Insurance plan updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance plan details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-insurance-plan-details/{id}:
 *   post:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Delete an insurance plan
 *     description: Remove a specific insurance plan by its ID.
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
 *         description: Insurance plan deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance plan deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-plans-of-insurance-company/{id}:
 *   get:
 *     tags: [Super Admin - Insurance Company Plans Management]
 *     summary: Get plans of a specific insurance company
 *     description: Retrieve all insurance plans associated with a specific insurance company by its ID.
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
 *         description: A list of insurance plans for the specified company.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 companyId: 1
 *                 plans:
 *                   - id: 1
 *                     planName: Gold Plan
 *                     coverageAmount: 50000
 *                     premium: 1500
 *                   - id: 2
 *                     planName: Silver Plan
 *                     coverageAmount: 30000
 *                     premium: 1000
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Insurance company not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/register-insurance-company-plans", verifySuperAdminToken, registerInsuranceCompanyPlan);
Router.get("/super-admin/get-all-insurance-plan-list", verifySuperAdminToken, getAllInsurancePlans);
// Router.get("/super-admin/get-single-insurance-plan-details/:id", verifySuperAdminToken, getInsurancePlanById);
Router.get("/super-admin/get-single-insurance-plan-details/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getInsurancePlanById);
Router.post("/super-admin/update-insurance-plan-details", verifySuperAdminToken, updateInsurancePlanDetails);
Router.post("/super-admin/delete-insurance-plan-details/:id", verifySuperAdminToken, deleteInsurancePlanById);
Router.get("/super-admin/get-plans-of-insurance-company/:id", verifySuperAdminToken, getInsuranceCompanyWithPlansById);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Employee Promotion/Demotion Management
 *     description: Operations related to employee promotion and demotion management.
 */

/**
 * @swagger
 * /super-admin/employee-promotion-demotion-add:
 *   post:
 *     tags: [Super Admin - Employee Promotion/Demotion Management]
 *     summary: Add employee promotion/demotion action
 *     description: Add a new promotion or demotion action for an employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the promotion or demotion action to add
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             employeeId: 123
 *             actionType: Promotion
 *             newRole: Senior Developer
 *             effectiveDate: 2024-08-20
 *     responses:
 *       201:
 *         description: Employee promotion/demotion action added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee promotion/demotion action added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/employee-promotion-demotion-get-all-list:
 *   get:
 *     tags: [Super Admin - Employee Promotion/Demotion Management]
 *     summary: Get all employee promotion/demotion actions
 *     description: Retrieve a list of all employee promotion and demotion actions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of employee promotion/demotion actions.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   actionType: Promotion
 *                   newRole: Senior Developer
 *                   effectiveDate: 2024-08-20
 *                 - id: 2
 *                   employeeId: 124
 *                   actionType: Demotion
 *                   newRole: Junior Developer
 *                   effectiveDate: 2024-08-15
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/single-employee-promotion-demotion-details/{id}:
 *   get:
 *     tags: [Super Admin - Employee Promotion/Demotion Management]
 *     summary: Get details of a specific employee promotion/demotion action
 *     description: Retrieve detailed information about a specific employee promotion or demotion action by its ID.
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
 *         description: Details of the employee promotion/demotion action.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 employeeId: 123
 *                 actionType: Promotion
 *                 newRole: Senior Developer
 *                 effectiveDate: 2024-08-20
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Employee promotion/demotion action not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-employee-promotion-demotion-details:
 *   post:
 *     tags: [Super Admin - Employee Promotion/Demotion Management]
 *     summary: Update employee promotion/demotion details
 *     description: Update the details of an existing employee promotion or demotion action.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the promotion or demotion action
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             actionType: Demotion
 *             newRole: Junior Developer
 *             effectiveDate: 2024-08-25
 *     responses:
 *       200:
 *         description: Employee promotion/demotion details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee promotion/demotion details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Employee promotion/demotion action not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/employee-promotion-demotion-add", verifySuperAdminToken, permissionCheck, employeeAddAction);
Router.get(
    "/super-admin/employee-promotion-demotion-get-all-list",
    verifySuperAdminToken,
    getAllEmployeePromotionDemotion
);
Router.get(
    "/super-admin/single-employee-promotion-demotion-details/:id",
    verifySuperAdminToken,
    getAllEmployeePromotionDemotionById
);
Router.post(
    "/super-admin/update-employee-promotion-demotion-details",
    verifySuperAdminToken,
    permissionCheck,
    updateEmployeePromotionDemotionDetails
);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Resignation Management
 *     description: Operations related to resignation requests and their management.
 */

/**
 * @swagger
 * /super-admin/get-resignations-pending-request:
 *   get:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Get pending resignation requests
 *     description: Retrieve a list of all pending resignation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pending resignation requests.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   resignationDate: 2024-09-01
 *                   reason: Personal
 *                   status: Pending
 *                 - id: 2
 *                   employeeId: 124
 *                   resignationDate: 2024-09-05
 *                   reason: Relocation
 *                   status: Pending
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-resignations-approved-list:
 *   get:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Get approved resignation requests
 *     description: Retrieve a list of all approved resignation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of approved resignation requests.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   resignationDate: 2024-09-01
 *                   reason: Personal
 *                   status: Approved
 *                 - id: 2
 *                   employeeId: 124
 *                   resignationDate: 2024-09-05
 *                   reason: Relocation
 *                   status: Approved
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-resignations-rejected-list:
 *   get:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Get rejected resignation requests
 *     description: Retrieve a list of all rejected resignation requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of rejected resignation requests.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   resignationDate: 2024-09-01
 *                   reason: Personal
 *                   status: Rejected
 *                 - id: 2
 *                   employeeId: 124
 *                   resignationDate: 2024-09-05
 *                   reason: Relocation
 *                   status: Rejected
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-resignation-details/{id}:
 *   get:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Get details of a specific resignation request
 *     description: Retrieve detailed information about a specific resignation request by its ID.
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
 *         description: Details of the resignation request.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 employeeId: 123
 *                 resignationDate: 2024-09-01
 *                 reason: Personal
 *                 status: Pending
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resignation request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-resignations-details:
 *   post:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Update resignation details
 *     description: Update the details of an existing resignation request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the resignation request
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             employeeId: 123
 *             resignationDate: 2024-09-01
 *             reason: Personal
 *             status: Approved
 *     responses:
 *       200:
 *         description: Resignation details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resignation request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/viewed-resignations-request/{id}:
 *   post:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Mark resignation request as viewed
 *     description: Mark a specific resignation request as viewed by its ID.
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
 *         description: Resignation request marked as viewed.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request marked as viewed.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resignation request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-resignations-request-by-admin/{id}/{status}:
 *   post:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Update resignation request status by admin
 *     description: Update the status of a specific resignation request by its ID and new status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *     responses:
 *       200:
 *         description: Resignation request status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resignation request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/generate-fnf-statements:
 *   post:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Generate full and final (FnF) statements
 *     description: Generate FnF statements for resigned employees.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the FnF statement generation request
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             employeeId: 123
 *             resignationDate: 2024-09-01
 *     responses:
 *       201:
 *         description: FnF statement generated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: FnF statement generated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-fnf-statements:
 *   get:
 *     tags: [Super Admin - Resignation Management]
 *     summary: Get FnF statements
 *     description: Retrieve a list of all generated FnF statements.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of FnF statements.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   resignationDate: 2024-09-01
 *                   fnfAmount: 5000
 *                 - id: 2
 *                   employeeId: 124
 *                   resignationDate: 2024-09-05
 *                   fnfAmount: 4500
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin/get-resignations-pending-request", verifySuperAdminToken, getPendingResignationRequests);
Router.get("/super-admin/get-resignations-approved-list", verifySuperAdminToken, getApprovedResignationRequests);
Router.get("/super-admin/get-resignations-rejected-list", verifySuperAdminToken, getRejectedResignationRequests);
Router.get("/super-admin/get-single-resignation-details/:id", verifySuperAdminToken, getResignationDetailsById);
Router.post("/super-admin/update-resignations-details", verifySuperAdminToken, updateResignationDetails);
Router.post("/super-admin/viewed-resignations-request/:id", verifySuperAdminToken, resignationRequestViewed);
Router.post(
    "/super-admin/update-resignations-request-by-admin/:id/:status",
    verifySuperAdminToken,
    resignationStatusUpdateByAdmin
);
Router.post("/super-admin/generate-fnf-statements", verifySuperAdminToken, generateFnFStatement);
Router.get("/super-admin/get-fnf-statements", verifySuperAdminToken, getFnfStatement);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Pension Management
 *     description: Operations related to the management of employee pensions.
 */

/**
 * @swagger
 * /super-admin/register-employee-pension:
 *   post:
 *     tags: [Super Admin - Pension Management]
 *     summary: Register employee pension
 *     description: Register a pension for an employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Pension registration details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             employeeId: 123
 *             pensionAmount: 5000
 *             pensionStartDate: 2024-09-01
 *             pensionPlan: Retirement Plan A
 *     responses:
 *       201:
 *         description: Employee pension registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee pension registered successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-registered-pension-list:
 *   get:
 *     tags: [Super Admin - Pension Management]
 *     summary: Get all registered pensions
 *     description: Retrieve a list of all registered employee pensions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of registered employee pensions.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   employeeId: 123
 *                   pensionAmount: 5000
 *                   pensionStartDate: 2024-09-01
 *                   pensionPlan: Retirement Plan A
 *                 - id: 2
 *                   employeeId: 124
 *                   pensionAmount: 5500
 *                   pensionStartDate: 2024-10-01
 *                   pensionPlan: Retirement Plan B
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-registered-pension-details/{id}:
 *   get:
 *     tags: [Super Admin - Pension Management]
 *     summary: Get single registered pension details
 *     description: Retrieve detailed information about a specific registered pension by its ID.
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
 *         description: Details of the registered pension.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 employeeId: 123
 *                 pensionAmount: 5000
 *                 pensionStartDate: 2024-09-01
 *                 pensionPlan: Retirement Plan A
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Registered pension not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-registered-pension:
 *   post:
 *     tags: [Super Admin - Pension Management]
 *     summary: Update registered pension details
 *     description: Update the details of a registered employee pension.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated pension details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             employeeId: 123
 *             pensionAmount: 5500
 *             pensionStartDate: 2024-09-01
 *             pensionPlan: Retirement Plan A
 *     responses:
 *       200:
 *         description: Pension details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pension details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Registered pension not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-register-employee-pension/{id}:
 *   delete:
 *     tags: [Super Admin - Pension Management]
 *     summary: Delete a registered employee pension
 *     description: Remove a specific registered employee pension by its ID.
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
 *         description: Pension deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Pension deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Registered pension not found.
 *       500:
 *         description: Internal server error.
 */
Router.post(
    "/super-admin/register-employee-pension",
    verifySuperAdminToken,
    permissionCheck,
    registerPensionForEmployee
);
Router.get("/super-admin/get-all-registered-pension-list", verifySuperAdminToken, getAllRegisteredPension);
Router.get("/super-admin/get-single-registered-pension-details/:id", verifySuperAdminToken, getRegisteredPensionById);
Router.post("/super-admin/update-registered-pension", verifySuperAdminToken, permissionCheck, updatePensionDetails);
Router.delete(
    "/super-admin/delete-register-employee-pension/:id",
    verifySuperAdminToken,
    permissionCheck,
    deletePensionById
);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Leave Management
 *     description: Operations related to leave applications and their status.
 */

/**
 * @swagger
 * /super-admin/leave-application-status-update:
 *   post:
 *     tags: [Super Admin - Leave Management]
 *     summary: Update leave application status
 *     description: Update the status of a leave application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details to update the leave application status
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             applicationId: 1
 *             status: Approved
 *     responses:
 *       200:
 *         description: Leave application status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-leave-application-details/{id}:
 *   get:
 *     tags: [Super Admin - Leave Management]
 *     summary: Get single leave application details
 *     description: Retrieve detailed information about a specific leave application by its ID.
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
 *         description: Details of the leave application.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 employeeId: 123
 *                 leaveType: Sick Leave
 *                 startDate: 2024-08-01
 *                 endDate: 2024-08-07
 *                 status: Approved
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Leave application not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-leave-application-details/{id}:
 *   post:
 *     tags: [Super Admin - Leave Management]
 *     summary: Soft delete leave application
 *     description: Mark a leave application as deleted without actually removing it from the database.
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
 *         description: Leave application marked as deleted.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application marked as deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Leave application not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - User Management
 *     description: Operations related to user management, including creation, updating, and retrieval.
 */

/**
 * @swagger
 * /super-admin/create-user:
 *   post:
 *     tags: [Super Admin - User Management]
 *     summary: Create a new user
 *     description: Register a new user in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: jdoe
 *             password: securepassword
 *             email: jdoe@example.com
 *             role: Employee
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-user:
 *   post:
 *     tags: [Super Admin - User Management]
 *     summary: Update user details
 *     description: Update the details of an existing user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated user details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: 1
 *             email: newemail@example.com
 *             role: Manager
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-managers-users:
 *   get:
 *     tags: [Super Admin - User Management]
 *     summary: Get all manager users
 *     description: Retrieve a list of all users with the manager role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of manager users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   username: mgr1
 *                   role: Manager
 *                   email: mgr1@example.com
 *                 - id: 2
 *                   username: mgr2
 *                   role: Manager
 *                   email: mgr2@example.com
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-employee-documents/{id}:
 *   get:
 *     tags: [Super Admin - User Management]
 *     summary: Get employee documents
 *     description: Retrieve the documents of an employee by their ID.
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
 *         description: Employee documents retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - documentType: ID Proof
 *                   documentUrl: http://example.com/id-proof.pdf
 *                 - documentType: Resume
 *                   documentUrl: http://example.com/resume.pdf
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Terms and Conditions Management
 *     description: Operations related to the management of terms and conditions.
 */

/**
 * @swagger
 * /super-admin/create-terms-and-conditions:
 *   post:
 *     tags: [Super Admin - Terms and Conditions Management]
 *     summary: Create terms and conditions
 *     description: Create new terms and conditions for the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Terms and conditions details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: User Agreement
 *             content: Terms and conditions content here.
 *     responses:
 *       201:
 *         description: Terms and conditions created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Terms and conditions created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-created-terms-and-conditions:
 *   get:
 *     tags: [Super Admin - Terms and Conditions Management]
 *     summary: Get all created terms and conditions
 *     description: Retrieve a list of all created terms and conditions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of terms and conditions.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: User Agreement
 *                   content: Terms and conditions content here.
 *                 - id: 2
 *                   title: Privacy Policy
 *                   content: Privacy policy content here.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-created-terms-and-conditions-details/{id}:
 *   get:
 *     tags: [Super Admin - Terms and Conditions Management]
 *     summary: Get single terms and conditions details
 *     description: Retrieve detailed information about a specific terms and conditions entry by its ID.
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
 *         description: Details of the terms and conditions.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 title: User Agreement
 *                 content: Terms and conditions content here.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Terms and conditions not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-terms-and-conditions-details:
 *   post:
 *     tags: [Super Admin - Terms and Conditions Management]
 *     summary: Update terms and conditions details
 *     description: Update the details of an existing terms and conditions entry.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated terms and conditions details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             title: Updated User Agreement
 *             content: Updated terms and conditions content here.
 *     responses:
 *       200:
 *         description: Terms and conditions updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Terms and conditions updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Terms and conditions not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-terms-and-conditions-details/{id}:
 *   delete:
 *     tags: [Super Admin - Terms and Conditions Management]
 *     summary: Delete terms and conditions details
 *     description: Remove a specific terms and conditions entry by its ID.
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
 *         description: Terms and conditions deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Terms and conditions deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Terms and conditions not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Activity Logs
 *     description: Operations related to activity logs.
 */

/**
 * @swagger
 * /super-admin/get-all-activity-logs:
 *   get:
 *     tags: [Super Admin - Activity Logs]
 *     summary: Get all activity logs
 *     description: Retrieve a list of all activity logs in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of activity logs.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   action: User logged in
 *                   timestamp: 2024-08-16T10:00:00Z
 *                   userId: 123
 *                 - id: 2
 *                   action: User created
 *                   timestamp: 2024-08-16T10:30:00Z
 *                   userId: 124
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-activity-logs/{id}:
 *   get:
 *     tags: [Super Admin - Activity Logs]
 *     summary: Get single activity log details
 *     description: Retrieve detailed information about a specific activity log by its ID.
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
 *         description: Details of the activity log.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 action: User logged in
 *                 timestamp: 2024-08-16T10:00:00Z
 *                 userId: 123
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Activity log not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-employee-history-details/{id}:
 *   get:
 *     tags: [Super Admin - Activity Logs]
 *     summary: Get employee history details
 *     description: Retrieve the history details of an employee by their ID.
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
 *         description: Details of the employee history.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 123
 *                 employmentHistory:
 *                   - position: Developer
 *                     startDate: 2022-01-01
 *                     endDate: 2023-01-01
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Energy Company Data
 *     description: Operations related to energy company data management.
 */

/**
 * @swagger
 * /super-admin/check-related-data-for-energy-company/{energy_company_id}:
 *   get:
 *     tags: [Super Admin - Energy Company Data]
 *     summary: Check related data for energy company
 *     description: Check if there is related data for a specific energy company by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: energy_company_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Related data check completed.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               hasRelatedData: true
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Energy company not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-related-data-for-energy-company:
 *   post:
 *     tags: [Super Admin - Energy Company Data]
 *     summary: Delete related data for energy company
 *     description: Remove related data for a specific energy company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Energy company ID and data to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             energy_company_id: 1
 *     responses:
 *       200:
 *         description: Related data deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Related data deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Energy company not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-area-data-for-energy/{energy_company_id}/{type}:
 *   get:
 *     tags: [Super Admin - Energy Company Data]
 *     summary: Get area data for energy company
 *     description: Retrieve area data for a specific energy company based on its ID and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: energy_company_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [region, district]
 *     responses:
 *       200:
 *         description: Area data retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - areaId: 1
 *                   name: North Region
 *                 - areaId: 2
 *                   name: South Region
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Data not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/leave-application-status-update", verifySuperAdminToken, updateLeaveApplication);
Router.get("/super-admin/get-single-leave-application-details/:id", verifySuperAdminToken, getSingleLeaveApplication);
Router.post("/super-admin/delete-leave-application-details/:id", verifySuperAdminToken, leaveApplicationSoftDelete);
Router.post("/super-admin/create-user", verifySuperAdminToken, permissionCheck, createAdmin);
Router.post(
    "/super-admin/update-user",
    verifySuperAdminToken,
    permissionCheck,
    updateSingleEmployeeDetailByIdForAdmins
);
Router.get("/super-admin/get-all-managers-users", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllManagerUsers);
Router.get("/super-admin/get-employee-documents/:id", verifySuperAdminToken, getEmployeeDocumentsById);
Router.post("/super-admin/create-terms-and-conditions", verifySuperAdminToken, createTermsAndConditions);
Router.get("/super-admin/get-all-created-terms-and-conditions", verifySuperAdminToken, getAllCreateTermsAndConditions);
Router.get(
    "/super-admin/get-single-created-terms-and-conditions-details/:id",
    verifySuperAdminToken,
    getCreateTermsAndConditionsDetailsById
);
Router.post("/super-admin/update-terms-and-conditions-details", verifySuperAdminToken, updateTermsConditionsDetails);
Router.delete("/super-admin/delete-terms-and-conditions-details/:id", verifySuperAdminToken, deleteTermsAndConditions);
Router.get("/super-admin/get-all-activity-logs", verifySuperAdminToken, getAllActivityLog);
Router.get("/super-admin/get-single-activity-logs/:id", verifySuperAdminToken, getActivityLogDetails);
Router.get("/super-admin/get-employee-history-details/:id", verifySuperAdminToken, trackEmployeeHistory);
Router.get(
    "/super-admin/check-related-data-for-energy-company/:energy_company_id",
    verifySuperAdminToken,
    checkRelatedDataForEnergyCompany
);
Router.post(
    "/super-admin/delete-related-data-for-energy-company/",
    verifySuperAdminToken,
    permissionCheck,
    deleteRelatedDataForEnergyCompany
);
Router.get(
    "/super-admin/get-area-data-for-energy/:energy_company_id/:type",
    verifySuperAdminToken,
    getEnergyCompanySubSidiaries
);

//Payroll masters

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Payroll Management
 *     description: Operations related to payroll settings and labels.
 */

/**
 * @swagger
 * /super-admin/create-new-payroll-settings:
 *   post:
 *     tags: [Super Admin - Payroll Management]
 *     summary: Create new payroll settings
 *     description: Add new payroll master settings to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payroll master settings details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             settingName: Base Salary
 *             value: 50000
 *             label: Basic
 *     responses:
 *       201:
 *         description: Payroll settings created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Payroll settings created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-payroll-master-settings:
 *   post:
 *     tags: [Super Admin - Payroll Management]
 *     summary: Update payroll master settings
 *     description: Update existing payroll master settings.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated payroll settings details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             settingId: 1
 *             value: 55000
 *             label: Basic Updated
 *     responses:
 *       200:
 *         description: Payroll settings updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Payroll settings updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payroll settings not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-payroll-master-settings-label:
 *   post:
 *     tags: [Super Admin - Payroll Management]
 *     summary: Update payroll master settings label
 *     description: Update the label of an existing payroll master setting.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated payroll setting label
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             settingId: 1
 *             newLabel: Basic Salary Updated
 *     responses:
 *       200:
 *         description: Payroll settings label updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Payroll settings label updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payroll setting not found.
 *       500:
 *         description: Internal server error.
 */
Router.post(
    "/super-admin/create-new-payroll-settings",
    verifySuperAdminToken,
    permissionCheck,
    addPayrollMasterSettingLabel
);
Router.post(
    "/super-admin/update-payroll-master-settings",
    verifySuperAdminToken,
    permissionCheck,
    updatePayrollSettings
);
Router.post(
    "/super-admin/update-payroll-master-settings-label",
    verifySuperAdminToken,
    permissionCheck,
    updatePayrollSettingLabel
);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Allowances Management
 *     description: Operations related to allowances management.
 */

/**
 * @swagger
 * /super-admin/create-allowances:
 *   post:
 *     tags: [Super Admin - Allowances Management]
 *     summary: Create new allowances
 *     description: Add new allowances to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Allowance details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             allowanceName: Travel Allowance
 *             amount: 2000
 *             description: Monthly travel allowance for employees.
 *     responses:
 *       201:
 *         description: Allowance created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Allowance created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-allowances:
 *   get:
 *     tags: [Super Admin - Allowances Management]
 *     summary: Get all allowances
 *     description: Retrieve a list of all allowances in the system.
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
 *                 - id: 1
 *                   allowanceName: Travel Allowance
 *                   amount: 2000
 *                   description: Monthly travel allowance for employees.
 *                 - id: 2
 *                   allowanceName: Meal Allowance
 *                   amount: 1500
 *                   description: Monthly meal allowance for employees.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-allowance-details/{id}:
 *   get:
 *     tags: [Super Admin - Allowances Management]
 *     summary: Get single allowance details
 *     description: Retrieve details of a specific allowance by its ID.
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
 *         description: Allowance details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 allowanceName: Travel Allowance
 *                 amount: 2000
 *                 description: Monthly travel allowance for employees.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Allowance not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-allowances", verifySuperAdminToken, permissionCheck, createAllowances);
Router.get("/super-admin/get-all-allowances", verifySuperAdminToken, getAllCreatedAllowances);
Router.get("/super-admin/get-single-allowance-details/:id", verifySuperAdminToken, getSingleAllowancesDetails);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Deductions Management
 *     description: Operations related to deductions management.
 */

/**
 * @swagger
 * /super-admin/create-deductions:
 *   post:
 *     tags: [Super Admin - Deductions Management]
 *     summary: Create new deductions type
 *     description: Add new deductions type to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Deduction type details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             deductionName: Tax Deduction
 *             amount: 500
 *             description: Monthly tax deduction for employees.
 *     responses:
 *       201:
 *         description: Deduction type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Deduction type created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-deductions:
 *   get:
 *     tags: [Super Admin - Deductions Management]
 *     summary: Get all deductions types
 *     description: Retrieve a list of all deductions types in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deductions types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   deductionName: Tax Deduction
 *                   amount: 500
 *                   description: Monthly tax deduction for employees.
 *                 - id: 2
 *                   deductionName: Health Insurance
 *                   amount: 300
 *                   description: Monthly health insurance deduction for employees.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-deductions", verifySuperAdminToken, permissionCheck, createDeductionsType);
Router.get("/super-admin/get-all-deductions", verifySuperAdminToken, getAllCreatedDeductionTypes);

//salary modules

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Salary Management
 *     description: Operations related to salary management.
 */

/**
 * @swagger
 * /super-admin/add-salary-details:
 *   post:
 *     tags: [Super Admin - Salary Management]
 *     summary: Add new salary details
 *     description: Create and add new salary details for users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Salary details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: 1
 *             baseSalary: 5000
 *             bonuses: 500
 *             deductions: 200
 *             totalSalary: 5300
 *     responses:
 *       201:
 *         description: Salary details added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Salary details added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-users-salary-details:
 *   get:
 *     tags: [Super Admin - Salary Management]
 *     summary: Get all salary details
 *     description: Retrieve all salary details for users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all salary details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   baseSalary: 5000
 *                   bonuses: 500
 *                   deductions: 200
 *                   totalSalary: 5300
 *                 - userId: 2
 *                   baseSalary: 6000
 *                   bonuses: 600
 *                   deductions: 300
 *                   totalSalary: 6300
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-salary-details/{id}:
 *   get:
 *     tags: [Super Admin - Salary Management]
 *     summary: Get salary details by user ID
 *     description: Retrieve salary details for a specific user by their ID.
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
 *         description: Salary details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 baseSalary: 5000
 *                 bonuses: 500
 *                 deductions: 200
 *                 totalSalary: 5300
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Salary details not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-salary-details:
 *   post:
 *     tags: [Super Admin - Salary Management]
 *     summary: Update salary details
 *     description: Update the salary details for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated salary details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: 1
 *             baseSalary: 5500
 *             bonuses: 500
 *             deductions: 250
 *             totalSalary: 5750
 *     responses:
 *       200:
 *         description: Salary details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Salary details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-salary-details/{id}:
 *   post:
 *     tags: [Super Admin - Salary Management]
 *     summary: Delete salary details
 *     description: Remove salary details for a specific user by their ID.
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
 *         description: Salary details deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Salary details deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-salary-disbursal:
 *   get:
 *     tags: [Super Admin - Salary Management]
 *     summary: Get all salary disbursal details
 *     description: Retrieve details of all salary disbursals.
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
 *                 - userId: 1
 *                   amount: 5300
 *                   date: 2024-08-15
 *                 - userId: 2
 *                   amount: 6300
 *                   date: 2024-08-15
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-salary-disbursal-details:
 *   get:
 *     tags: [Super Admin - Salary Management]
 *     summary: Get salary disbursal details by ID
 *     description: Retrieve salary disbursal details for a specific user by their ID.
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
 *         description: Salary disbursal details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 amount: 5300
 *                 date: 2024-08-15
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Salary disbursal details not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/mark-salary-disbursed:
 *   post:
 *     tags: [Super Admin - Salary Management]
 *     summary: Mark salary as disbursed
 *     description: Update the status of salary to mark it as disbursed.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Salary disbursal details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: 1
 *             amount: 5300
 *             date: 2024-08-15
 *     responses:
 *       200:
 *         description: Salary marked as disbursed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Salary marked as disbursed successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-users-pay-slip:
 *   get:
 *     tags: [Super Admin - Salary Management]
 *     summary: Get users' pay slips
 *     description: Retrieve pay slips for all users.
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
 *                 - userId: 1
 *                   paySlipUrl: /files/pay-slips/2024-08-15/user1.pdf
 *                 - userId: 2
 *                   paySlipUrl: /files/pay-slips/2024-08-15/user2.pdf
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-user-pay-slip-details:
 *   get:
 *     tags: [Super Admin - Salary Management]
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
Router.post("/super-admin/add-salary-details", verifySuperAdminToken, addDetailsSalary);
Router.get("/super-admin/get-all-users-salary-details", verifySuperAdminToken, getAllCreatedSalaryDetails);
Router.get("/super-admin/get-salary-details/:id", verifySuperAdminToken, getCreatedSalaryDetailsById);
Router.post("/super-admin/update-salary-details", verifySuperAdminToken, updateSalaryDetails);
Router.post("/super-admin/delete-salary-details/:id", verifySuperAdminToken, deleteSalaryDetails);
Router.get("/super-admin/get-salary-disbursal", verifySuperAdminToken, getAllUserSalaryForDisbursal);
Router.get("/super-admin/get-salary-disbursal-details", verifySuperAdminToken, getUserSalaryDisbursalDetailsById);
// Router.post("/super-admin/mark-salary-disbursed", verifySuperAdminToken, markSalaryDisbursed);
Router.put("/super-admin/mark-salary-disbursed", verifySuperAdminToken, markSalaryDisbursed);
Router.get("/super-admin/get-users-pay-slip", verifySuperAdminToken, getUsersPaySlip);
Router.get("/super-admin/get-user-pay-slip-details", verifySuperAdminToken, getUserPayslipDetailsById);

//loans modules

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Loan Management
 *     description: Operations related to loan management.
 */

/**
 * @swagger
 * /super-admin/create-loans:
 *   post:
 *     tags: [Super Admin - Loan Management]
 *     summary: Create a new loan
 *     description: Add a new loan request with details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Loan details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             employeeId: 1
 *             loanAmount: 5000
 *             loanTerm: 12
 *             interestRate: 5
 *             status: "pending"
 *     responses:
 *       201:
 *         description: Loan created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Loan created successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-loans-pending:
 *   get:
 *     tags: [Super Admin - Loan Management]
 *     summary: Get all pending loan requests
 *     description: Retrieve all loan requests that are currently pending.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pending loans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - loanId: 1
 *                   employeeId: 1
 *                   loanAmount: 5000
 *                   status: "pending"
 *                 - loanId: 2
 *                   employeeId: 2
 *                   loanAmount: 3000
 *                   status: "pending"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-loans-active:
 *   get:
 *     tags: [Super Admin - Loan Management]
 *     summary: Get all active loans
 *     description: Retrieve all loans that are currently active.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active loans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - loanId: 1
 *                   employeeId: 1
 *                   loanAmount: 5000
 *                   status: "active"
 *                 - loanId: 2
 *                   employeeId: 2
 *                   loanAmount: 3000
 *                   status: "active"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-loans-reject:
 *   get:
 *     tags: [Super Admin - Loan Management]
 *     summary: Get all rejected loans
 *     description: Retrieve all loans that have been rejected.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rejected loans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - loanId: 1
 *                   employeeId: 1
 *                   loanAmount: 5000
 *                   status: "rejected"
 *                 - loanId: 2
 *                   employeeId: 2
 *                   loanAmount: 3000
 *                   status: "rejected"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-loans-closed:
 *   get:
 *     tags: [Super Admin - Loan Management]
 *     summary: Get all closed loans
 *     description: Retrieve all loans that have been closed.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all closed loans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - loanId: 1
 *                   employeeId: 1
 *                   loanAmount: 5000
 *                   status: "closed"
 *                 - loanId: 2
 *                   employeeId: 2
 *                   loanAmount: 3000
 *                   status: "closed"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-loan-details/{id}:
 *   get:
 *     tags: [Super Admin - Loan Management]
 *     summary: Get loan details by ID
 *     description: Retrieve details of a specific loan by its ID.
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
 *         description: Loan details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 loanId: 1
 *                 employeeId: 1
 *                 loanAmount: 5000
 *                 loanTerm: 12
 *                 interestRate: 5
 *                 status: "active"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Loan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-loan-details:
 *   post:
 *     tags: [Super Admin - Loan Management]
 *     summary: Update loan details
 *     description: Update the details of a specific loan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated loan details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             loanId: 1
 *             loanAmount: 6000
 *             loanTerm: 12
 *             interestRate: 5
 *             status: "active"
 *     responses:
 *       200:
 *         description: Loan details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Loan details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/changed-loan-status:
 *   post:
 *     tags: [Super Admin - Loan Management]
 *     summary: Change loan status
 *     description: Update the status of a specific loan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Loan status update
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             loanId: 1
 *             status: "closed"
 *     responses:
 *       200:
 *         description: Loan status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Loan status updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-loan-details/{id}:
 *   post:
 *     tags: [Super Admin - Loan Management]
 *     summary: Delete loan details
 *     description: Remove a specific loan by its ID.
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
 *         description: Loan details deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Loan details deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-loans", verifySuperAdminToken, permissionCheck, createLoan);
Router.get("/super-admin/get-all-loans-pending", verifySuperAdminToken, getAllLoanRequests);
Router.get("/super-admin/get-all-loans-active", verifySuperAdminToken, getAllActiveLoan);
Router.get("/super-admin/get-all-loans-reject", verifySuperAdminToken, getAllRejectedLoan);
Router.get("/super-admin/get-all-loans-closed", verifySuperAdminToken, getAllClosedLoan);
Router.get("/super-admin/get-loan-details/:id", verifySuperAdminToken, getLoanDetailById);
Router.post("/super-admin/update-loan-details", verifySuperAdminToken, permissionCheck, updateLoanDetails);
Router.post("/super-admin/changed-loan-status", verifySuperAdminToken, updateLoanStatus);
Router.post("/super-admin/delete-loan-details/:id", verifySuperAdminToken, deleteLoanDetailById);

//messages

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Message Management
 *     description: Operations related to message management.
 */

/**
 * @swagger
 * /super-admin/send-messages:
 *   post:
 *     tags: [Super Admin - Message Management]
 *     summary: Send a message
 *     description: Send a message to a specified user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Message details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             recipientId: 2
 *             content: "Hello, how are you?"
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Message sent successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-messages:
 *   get:
 *     tags: [Super Admin - Message Management]
 *     summary: Get all messages
 *     description: Retrieve all messages for the logged-in super admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all messages retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - messageId: 1
 *                   senderId: 2
 *                   recipientId: 1
 *                   content: "Hello, how are you?"
 *                   timestamp: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-single-sender-messages/{id}:
 *   get:
 *     tags: [Super Admin - Message Management]
 *     summary: Get messages from a specific sender
 *     description: Retrieve all messages sent by a specific sender.
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
 *         description: List of messages from the specified sender retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - messageId: 1
 *                   senderId: 2
 *                   recipientId: 1
 *                   content: "Hello, how are you?"
 *                   timestamp: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Sender not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/add-new-user-to-chat:
 *   get:
 *     tags: [Super Admin - Message Management]
 *     summary: Add a new user to chat
 *     description: Add a new user to an existing chat.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User added to chat successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User added to chat successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/start-chat-to-new-user/{id}:
 *   post:
 *     tags: [Super Admin - Message Management]
 *     summary: Start chat with a new user
 *     description: Initiate a chat with a new user.
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
 *         description: Chat started with the new user successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Chat started with the new user successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-total-unread-messages:
 *   get:
 *     tags: [Super Admin - Message Management]
 *     summary: Get total unread messages
 *     description: Retrieve the total number of unread messages for the logged-in super admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total unread messages count retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 unreadCount: 5
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/mark-all-messages-read:
 *   post:
 *     tags: [Super Admin - Message Management]
 *     summary: Mark all messages as read
 *     description: Mark all unread messages as read for the logged-in super admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All messages marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All messages marked as read successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/sender-messages-mark-read/{id}:
 *   post:
 *     tags: [Super Admin - Message Management]
 *     summary: Mark all messages from a specific sender as read
 *     description: Mark all messages from a specific sender as read.
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
 *         description: Messages from the specified sender marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Messages from the specified sender marked as read successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Sender not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/send-messages", verifySuperAdminToken, sendMessage);
Router.get("/super-admin/get-messages", verifySuperAdminToken, getMessages);
Router.get("/super-admin/get-single-sender-messages/:id", verifySuperAdminToken, getSenderAllMessages);
Router.get("/super-admin/add-new-user-to-chat", verifySuperAdminToken, addNewUserToChat);
Router.post("/super-admin/start-chat-to-new-user/:id", verifySuperAdminToken, startChatWithNewUser);
Router.get("/super-admin/get-total-unread-messages", verifySuperAdminToken, getTotalUnreadMessages);
Router.post("/super-admin/mark-all-messages-read", verifySuperAdminToken, markAllMessagesRead);
Router.post("/super-admin/sender-messages-mark-read/:id", verifySuperAdminToken, markReadSenderAllMessages);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Data Import
 *     description: Operations related to importing data.
 */

/**
 * @swagger
 * /super-admin/import-data:
 *   post:
 *     tags: [Super Admin - Data Import]
 *     summary: Import general data
 *     description: Import general data into the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data to be imported
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Data imported successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Data imported successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/import-user-data/{id}:
 *   post:
 *     tags: [Super Admin - Data Import]
 *     summary: Import user data
 *     description: Import user-specific data into the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User data to be imported
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User data imported successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User data imported successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/import-data", verifySuperAdminToken, importData);
Router.post("/super-admin/import-user-data/:id", verifySuperAdminToken, importUserData);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Regional Officers
 *     description: Operations related to regional officers.
 */

/**
 * @swagger
 * /super-admin/get-officers-list-on-ro/{id}:
 *   get:
 *     tags: [Super Admin - Regional Officers]
 *     summary: Get list of regional officers
 *     description: Retrieve a list of regional officers based on the given regional office (RO) ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the regional office to get officers for.
 *     responses:
 *       200:
 *         description: List of regional officers retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               officers:
 *                 - id: 1
 *                   name: John Doe
 *                   position: Regional Officer
 *                   email: john.doe@example.com
 *                 - id: 2
 *                   name: Jane Smith
 *                   position: Regional Officer
 *                   email: jane.smith@example.com
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Regional office not found.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin/get-officers-list-on-ro/:id", verifySuperAdminToken, getRegionalOfficersOnRo);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Energy Company Users
 *     description: Operations related to energy company users.
 */

/**
 * @swagger
 * /super-admin/create-zone-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a new zone user
 *     description: Create a new user for an energy company zone.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new user.
 *               zone_id:
 *                 type: integer
 *                 description: The ID of the zone where the user will be assigned.
 *           example:
 *             username: john.doe
 *             email: john.doe@example.com
 *             password: securePassword123
 *             role: Zone Manager
 *             zone_id: 1
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *               user:
 *                 id: 1
 *                 username: john.doe
 *                 email: john.doe@example.com
 *                 role: Zone Manager
 *                 zone_id: 1
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-zone-user", verifySuperAdminToken, createEnergyCompanyUser);

/*** Admins Route */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Admins
 *     description: Operations related to admin management.
 */

/**
 * @swagger
 * /admin/login-admin:
 *   post:
 *     tags: [Super Admin - Admins]
 *     summary: Admin login
 *     description: Authenticate an admin and receive an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Admin username.
 *               password:
 *                 type: string
 *                 description: Admin password.
 *           example:
 *             username: admin1
 *             password: password123
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               token: <access_token>
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/get-profile-details:
 *   get:
 *     tags: [Super Admin - Admins]
 *     summary: Get admin profile details
 *     description: Retrieve the profile details of the logged-in admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               username: admin1
 *               email: admin1@example.com
 *               role: Administrator
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/update-admin-profile-details:
 *   post:
 *     tags: [Super Admin - Admins]
 *     summary: Update admin profile details
 *     description: Update the profile details of the logged-in admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email address.
 *               password:
 *                 type: string
 *                 description: New password.
 *           example:
 *             email: newemail@example.com
 *             password: newPassword123
 *     responses:
 *       200:
 *         description: Admin profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile updated successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/admin-change-password:
 *   post:
 *     tags: [Super Admin - Admins]
 *     summary: Admin change password
 *     description: Change the password of the logged-in admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: Current password.
 *               new_password:
 *                 type: string
 *                 description: New password.
 *           example:
 *             old_password: oldPassword123
 *             new_password: newPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Password changed successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Energy Company Users
 *     description: Operations related to energy company users.
 */

/**
 * @swagger
 * /energy-company/create-zone-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a zone user
 *     description: Create a new user for an energy company zone.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new user.
 *               zone_id:
 *                 type: integer
 *                 description: The ID of the zone where the user will be assigned.
 *           example:
 *             username: jane.doe
 *             email: jane.doe@example.com
 *             password: securePassword456
 *             role: Zone Manager
 *             zone_id: 2
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /energy-company/create-sub_user-for-energy-company-zone-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a sub-user for an energy company zone user
 *     description: Create a new sub-user for a specific energy company zone user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new sub-user.
 *               email:
 *                 type: string
 *                 description: The email address of the new sub-user.
 *               password:
 *                 type: string
 *                 description: The password for the new sub-user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new sub-user.
 *               zone_user_id:
 *                 type: integer
 *                 description: The ID of the zone user for whom the sub-user is created.
 *           example:
 *             username: subuser1
 *             email: subuser1@example.com
 *             password: securePassword789
 *             role: Sub-user
 *             zone_user_id: 3
 *     responses:
 *       201:
 *         description: Sub-user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-user created successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /energy-company/create-sub_user-for-energy-company-regional-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a sub-user for an energy company regional user
 *     description: Create a new sub-user for a specific energy company regional user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new sub-user.
 *               email:
 *                 type: string
 *                 description: The email address of the new sub-user.
 *               password:
 *                 type: string
 *                 description: The password for the new sub-user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new sub-user.
 *               regional_user_id:
 *                 type: integer
 *                 description: The ID of the regional user for whom the sub-user is created.
 *           example:
 *             username: regionalsubuser1
 *             email: regionalsubuser1@example.com
 *             password: securePassword101
 *             role: Regional Sub-user
 *             regional_user_id: 4
 *     responses:
 *       201:
 *         description: Sub-user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-user created successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /energy-company/create-sub_user-for-energy-company-sale-area-user:
 *   post:
 *     tags: [Super Admin - Energy Company Users]
 *     summary: Create a sub-user for an energy company sale area user
 *     description: Create a new sub-user for a specific energy company sale area user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new sub-user.
 *               email:
 *                 type: string
 *                 description: The email address of the new sub-user.
 *               password:
 *                 type: string
 *                 description: The password for the new sub-user.
 *               role:
 *                 type: string
 *                 description: The role assigned to the new sub-user.
 *               sale_area_user_id:
 *                 type: integer
 *                 description: The ID of the sale area user for whom the sub-user is created.
 *           example:
 *             username: saleareasubuser2
 *             email: saleareasubuser2@example.com
 *             password: securePassword202
 *             role: Sale Area Sub-user
 *             sale_area_user_id: 5
 *     responses:
 *       201:
 *         description: Sub-user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sub-user created successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/admin/login-admin", adminLogin);
Router.get("/admin/get-profile-details", verifyEnergyCompanyToken, getAdminProfileDetails);
Router.post("/admin/update-admin-profile-details", verifyEnergyCompanyToken, updateAdminProfile);
Router.post("/admin/admin-change-password", verifyEnergyCompanyToken, adminChangePassword);
Router.post("/energy-company/create-zone-user", verifyEnergyCompanyToken, createEnergyCompanyUser);
Router.post(
    "/energy-company/create-sub_user-for-energy-company-zone-user",
    verifyEnergyCompanyToken,
    createSubUsersForEnergyCompanyZoneUser
);
Router.post(
    "/energy-company/create-sub_user-for-energy-company-regional-user",
    verifyEnergyCompanyToken,
    createSubUsersForEnergyCompanyRegionalOfficeUser
);
Router.post(
    "/energy-company/create-sub_user-for-energy-company-sale-area-user",
    verifyEnergyCompanyToken,
    createSubUsersForEnergyCompanySaleAreaUser
);

/** * Sub User Routes */

/**
 * @swagger
 * tags:
 *   - name: Sub User - Profile
 *     description: Operations related to sub-user profiles.
 */

/**
 * @swagger
 * /sub-user/login:
 *   post:
 *     tags: [Sub User - Profile]
 *     summary: Sub-user login
 *     description: Authenticate a sub-user and receive an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Sub-user username.
 *               password:
 *                 type: string
 *                 description: Sub-user password.
 *           example:
 *             username: subuser1
 *             password: subPassword123
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               token: <access_token>
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/profile-details:
 *   get:
 *     tags: [Sub User - Profile]
 *     summary: Get sub-user profile details
 *     description: Retrieve the profile details of the logged-in sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sub-user profile details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               username: subuser1
 *               email: subuser1@example.com
 *               role: Sub-user
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/profile-update:
 *   post:
 *     tags: [Sub User - Profile]
 *     summary: Update sub-user profile details
 *     description: Update the profile details of the logged-in sub-user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email address.
 *               password:
 *                 type: string
 *                 description: New password.
 *           example:
 *             email: newemail@example.com
 *             password: newPassword456
 *     responses:
 *       200:
 *         description: Sub-user profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile updated successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/changed-password:
 *   post:
 *     tags: [Sub User - Profile]
 *     summary: Sub-user change password
 *     description: Change the password of the logged-in sub-user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: Current password.
 *               new_password:
 *                 type: string
 *                 description: New password.
 *           example:
 *             old_password: oldPassword123
 *             new_password: newPassword789
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Password changed successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Permissions
 *     description: Operations related to permissions management.
 */

/**
 * @swagger
 * /super-admin/get-permissions-on-role-basis:
 *   get:
 *     tags: [Super Admin - Permissions]
 *     summary: Get permissions on role basis
 *     description: Retrieve permissions based on roles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               permissions: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Sub User - Permissions
 *     description: Operations related to sub-user permissions.
 */

/**
 * @swagger
 * /sub-user/get-permitted-module-name-on-role-basis:
 *   get:
 *     tags: [Sub User - Permissions]
 *     summary: Get permitted module names on role basis
 *     description: Retrieve the names of permitted modules based on the role of the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permitted module names retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               modules: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/update-permissions-on-role-basis:
 *   post:
 *     tags: [Sub User - Permissions]
 *     summary: Update permissions on role basis
 *     description: Update permissions for the sub-user based on their role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The role for which permissions are to be updated.
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permissions to be updated.
 *           example:
 *             role: Sales Manager
 *             permissions: [read, write, delete]
 *     responses:
 *       200:
 *         description: Permissions updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Permissions updated successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/sub-user/login", subUserLoggedIn);
Router.get("/sub-user/profile-details", verifySubUserToken, getSubUserProfileDetails);
Router.post("/sub-user/profile-update", verifySubUserToken, updateSubUserProfileDetails);
Router.post("/sub-user/changed-password", verifySubUserToken, subUserChangePassword);
Router.get("/super-admin/get-permissions-on-role-basis", verifySuperAdminToken, checkPermittedModuleOnRoleBasis);
Router.get(
    "/sub-user/get-permitted-module-name-on-role-basis",
    verifySubUserToken,
    getAllPermittedModuleNameOnRoleBasis
);
Router.post("/sub-user/update-permissions-on-role-basis", verifySubUserToken, updatePermissionOnRoleBasis);

//HR management

/**
 * @swagger
 * tags:
 *   - name: Sub User - HR Management
 *     description: Operations related to HR management for sub-users.
 */

/**
 * @swagger
 * /sub-user/mark-attendance:
 *   post:
 *     tags: [Sub User - HR Management]
 *     summary: Mark attendance
 *     description: Record the attendance of the sub-user (clock-in).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Attendance marked successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/clock-out:
 *   post:
 *     tags: [Sub User - HR Management]
 *     summary: Clock out
 *     description: Record the end of the working day for the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clock out recorded successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Clock out recorded successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/check-today-clock-in:
 *   get:
 *     tags: [Sub User - HR Management]
 *     summary: Check today's clock-in status
 *     description: Verify if the sub-user has clocked in today.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clock-in status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               clockedIn: true
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/mark-break:
 *   post:
 *     tags: [Sub User - HR Management]
 *     summary: Mark break
 *     description: Record the start of a break for the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Break marked successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/break-end:
 *   post:
 *     tags: [Sub User - HR Management]
 *     summary: End break
 *     description: Record the end of a break for the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break ended successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Break ended successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/get-user-time-sheet:
 *   get:
 *     tags: [Sub User - HR Management]
 *     summary: Get user time sheet
 *     description: Retrieve the time sheet of the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Time sheet retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               timeSheet: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Sub User - Leave Management
 *     description: Operations related to leave management.
 */

/**
 * @swagger
 * /sub-user/apply-leave:
 *   post:
 *     tags: [Sub User - Leave Management]
 *     summary: Apply for leave
 *     description: Submit a leave application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the leave.
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the leave.
 *               reason:
 *                 type: string
 *                 description: Reason for leave.
 *           example:
 *             start_date: '2024-08-01'
 *             end_date: '2024-08-05'
 *             reason: Personal reasons
 *     responses:
 *       200:
 *         description: Leave application submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application submitted successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sub-user/all-apply-leave:
 *   get:
 *     tags: [Sub User - HR Management]
 *     summary: Get all leave applications
 *     description: Retrieve all leave applications submitted by the sub-user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave applications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               leaves: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Sub User - Resignation Management
 *     description: Operations related to resignation management.
 */

/**
 * @swagger
 * /sub-user/register-employee-resignation:
 *   post:
 *     tags: [Sub User - Resignation Management]
 *     summary: Register employee resignation
 *     description: Submit a resignation request for an employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resignation_date:
 *                 type: string
 *                 format: date
 *                 description: Date of resignation.
 *               reason:
 *                 type: string
 *                 description: Reason for resignation.
 *           example:
 *             resignation_date: '2024-08-15'
 *             reason: Personal reasons
 *     responses:
 *       200:
 *         description: Resignation request submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Resignation request submitted successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/sub-user/mark-attendance", verifySubUserToken, clockIn);
Router.post("/sub-user/clock-out", verifySubUserToken, clockOut);
Router.get("/sub-user/check-today-clock-in", verifySubUserToken, checkClockInToday);
Router.post("/sub-user/mark-break", verifySubUserToken, startBreak);
Router.post("/sub-user/break-end", verifySubUserToken, endBreak);
Router.get("/sub-user/get-user-time-sheet", verifySubUserToken, timeSheet);
Router.post("/sub-user/apply-leave", verifySuperAdminToken, applyLeave);
Router.get("/sub-user/all-apply-leave", verifySubUserToken, getAllLeaveApplications);
Router.post("/sub-user/register-employee-resignation", verifyContractorToken, registerResignation);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Complaint Management
 *     description: Operations related to complaint management for super admins.
 */

/**
 * @swagger
 * /super-admin/all-new-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all new complaints
 *     description: Retrieve a list of all new complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of new complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-pending-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all pending complaints
 *     description: Retrieve a list of all pending complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-approved-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all approved complaints
 *     description: Retrieve a list of all approved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-rejected-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all rejected complaints
 *     description: Retrieve a list of all rejected complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-resolved-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all resolved complaints
 *     description: Retrieve a list of all resolved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resolved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/all-new-complains", verifySuperAdminToken, allNewComplaints);
Router.post("/super-admin/all-pending-complains", verifySuperAdminToken, allPendingComplaints);
Router.post("/super-admin/all-approved-complains", verifySuperAdminToken, allApprovedComplaints);
Router.post("/super-admin/all-rejected-complains", verifySuperAdminToken, allRejectedComplaints);
Router.post("/super-admin/all-resolved-complains", verifySuperAdminToken, allResolvedComplaints);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Survey Management
 *     description: Operations related to survey management for super admins.
 */

/**
 * @swagger
 * /super-admin/surveys-otp-send:
 *   post:
 *     tags: [Super Admin - Survey Management]
 *     summary: Send OTP for survey
 *     description: Send an OTP to verify the survey for a specific user or survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: ID of the survey for which OTP needs to be sent.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP sent successfully.
 *       400:
 *         description: Bad Request. Invalid or missing parameters.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/surveys-otp-verify:
 *   post:
 *     tags: [Super Admin - Survey Management]
 *     summary: Verify OTP for survey
 *     description: Verify the OTP sent for a survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: ID of the survey for which OTP needs to be verified.
 *               otp:
 *                 type: string
 *                 description: OTP sent to the user for verification.
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP verified successfully.
 *       400:
 *         description: Bad Request. Invalid or incorrect OTP.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-survey-response/{id}:
 *   get:
 *     tags: [Super Admin - Survey Management]
 *     summary: Get survey response by ID
 *     description: Retrieve the response of a specific survey using its ID.
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
 *         description: Survey response retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               response: {...}
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/surveys-otp-send", verifySuperAdminToken, otpSendSurvey);
Router.post("/super-admin/surveys-otp-verify", verifySuperAdminToken, VerifyOtpSurvey);
Router.get("/super-admin/get-survey-response/:id", verifySuperAdminToken, getSurveyResponseById);

// -------------------------------- order via routes --------------------------

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Order Management
 *     description: Operations related to order management for super admins.
 */

/**
 * @swagger
 * /super-admin/create-order:
 *   post:
 *     tags: [Super Admin - Order Management]
 *     summary: Create a new order
 *     description: Create a new order with the provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderDetails:
 *                 type: object
 *                 description: Details of the order to be created
 *                 example:
 *                   productId: 123
 *                   quantity: 10
 *                   price: 150
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Order created successfully.
 *       400:
 *         description: Bad Request. Invalid input.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/update-order:
 *   post:
 *     tags: [Super Admin - Order Management]
 *     summary: Update an existing order
 *     description: Update details of an existing order with the provided information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: ID of the order to be updated
 *                 example: 456
 *               updatedDetails:
 *                 type: object
 *                 description: Details to update the order
 *                 example:
 *                   quantity: 15
 *                   price: 200
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Order updated successfully.
 *       400:
 *         description: Bad Request. Invalid input.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-order:
 *   get:
 *     tags: [Super Admin - Order Management]
 *     summary: Retrieve all orders
 *     description: Get a list of all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               orders: [ Array of Orders ]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-order-by-id/{id}:
 *   get:
 *     tags: [Super Admin - Order Management]
 *     summary: Retrieve an order by ID
 *     description: Get details of a specific order using its ID.
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
 *         description: Order details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               order: { Order details }
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/delete-order/{id}:
 *   delete:
 *     tags: [Super Admin - Order Management]
 *     summary: Delete an order by ID
 *     description: Remove a specific order using its ID.
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
 *         description: Order deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Order deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-order-pagination:
 *   get:
 *     tags: [Super Admin - Order Management]
 *     summary: Retrieve all orders with pagination
 *     description: Get a paginated list of all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated list of all orders.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               orders: [ Array of orders ]
 *               pagination: { Pagination info }
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/super-admin/create-order", verifySuperAdminToken, permissionCheck, createOrder);
Router.post("/super-admin/update-order", verifySuperAdminToken, permissionCheck, updateOrder);
Router.get("/super-admin/get-all-order", verifySuperAdminToken, getAllData);
Router.get("/super-admin/get-order-by-id/:id", verifySuperAdminToken, getOrderById);
Router.delete("/super-admin/delete-order/:id", verifySuperAdminToken, permissionCheck, deleteOrderById);
Router.get("/super-admin/get-all-order-pagination", verifySuperAdminToken, getAllOrderWithPagination);

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Complaint Management
 *     description: Operations related to complaint management for super admins.
 */

/**
 * @swagger
 * /super-admin/get-complaints-details/{id}:
 *   get:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Retrieve complaint details by ID
 *     description: Get the details of a specific complaint using its ID.
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
 *         description: Complaint details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaint:
 *                 id: 1
 *                 title: "Complaint Title"
 *                 description: "Complaint Description"
 *                 status: "Pending"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-approved-complaints-details/{id}:
 *   get:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Retrieve approved complaint details by ID
 *     description: Get the details of a specific approved complaint using its ID.
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
 *         description: Approved complaint details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaint:
 *                 id: 1
 *                 title: "Approved Complaint Title"
 *                 description: "Approved Complaint Description"
 *                 status: "Approved"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-manager-list-with-total-free-end-users:
 *   get:
 *     tags: [Super Admin - User Management]
 *     summary: Get all managers with total free end users
 *     description: Retrieve a list of all managers along with the total number of free end users for each manager.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managers with total free end users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               managers:
 *                 - id: 1
 *                   name: "Manager Name"
 *                   totalFreeEndUsers: 10
 *                 - id: 2
 *                   name: "Another Manager"
 *                   totalFreeEndUsers: 5
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-supervisor-by-manager-with-count-free-end-users/{id}:
 *   get:
 *     tags: [Super Admin - User Management]
 *     summary: Get all supervisors by manager with count of free end users
 *     description: Retrieve a list of all supervisors under a specific manager along with the count of free end users for each supervisor.
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
 *         description: List of supervisors under a manager with count of free end users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               supervisors:
 *                 - id: 1
 *                   name: "Supervisor Name"
 *                   totalFreeEndUsers: 7
 *                 - id: 2
 *                   name: "Another Supervisor"
 *                   totalFreeEndUsers: 3
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/get-all-end-users-by-supervisor/{id}:
 *   get:
 *     tags: [Super Admin - User Management]
 *     summary: Get all end users by supervisor
 *     description: Retrieve a list of all end users under a specific supervisor.
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
 *         description: List of end users under a supervisor retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               endUsers:
 *                 - id: 1
 *                   name: "End User Name"
 *                   email: "user@example.com"
 *                 - id: 2
 *                   name: "Another End User"
 *                   email: "anotheruser@example.com"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin/get-complaints-details/:id", verifySuperAdminToken, getComplaintsDetailsById);
Router.get("/super-admin/get-approved-complaints-details/:id", verifySuperAdminToken, getApprovedComplaintsDetailsById);
Router.get(
    "/super-admin/get-all-manager-list-with-total-free-end-users",
    verifySuperAdminToken,
    getALLmanagersWithTeamMembers
);
Router.get(
    "/super-admin/get-all-supervisor-by-manager-with-count-free-end-users/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    getSuperVisorOnManagerId
);
Router.get("/super-admin/get-all-end-users-by-supervisor/:id", verifySuperAdminToken, getFreeEndUsersOnSuperVisorId);
Router.get("/super-admin/get-all-users/:role_name", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getALLSupervisors);

//------------------------------ Contractor Panel Routing ------------------------

/**
 * @swagger
 * /super-admin/mark-as-resolved:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Mark a complaint as resolved
 *     description: Mark a specific complaint as resolved based on its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Complaint ID to mark as resolved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to be marked as resolved.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Complaint marked as resolved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint marked as resolved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing complaint ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

Router.post("/super-admin/mark-as-resolved", verifySuperAdminToken, markAsResolvedComplaints);

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Login
 *   description: Route for Contractor Login
 */

/**
 * @swagger
 * /contractor/login:
 *   post:
 *     tags: [Contractor Routes - Login]
 *     summary: Contractor login
 *     description: Authenticates a contractor and returns a JWT token if credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "CONTRACTOR1@GMAIL.COM"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid username or password"
 *       500:
 *         description: Internal Server Error
 */
Router.post("/contractor/login", contractorLogin);

/**
 * @swagger
 * tags:
 *   name: Contractor - Sidebar Management
 *   description: API routes for managing and retrieving contractor sidebar modules.
 */

/**
 * @swagger
 * /contractor/get-contractor-sidebar:
 *   get:
 *     tags: [Contractor - Sidebar Management]
 *     summary: Get Contractor Sidebar
 *     description: Retrieves the sidebar modules available for the contractor.
 *     responses:
 *       200:
 *         description: Successfully retrieved the contractor's sidebar modules.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Contractor sidebar retrieved successfully.
 *               sidebar:
 *                 - module_id: 1
 *                   module_name: Dashboard
 *                   module_link: /contractor/dashboard
 *                 - module_id: 2
 *                   module_name: Projects
 *                   module_link: /contractor/projects
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Sidebar modules not found.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/get-contractor-sidebar", verifyContractorToken, getContractorSidebar);

/**
 * @swagger
 * tags:
 *   name: Contractor - Plan Management
 *   description: API routes for managing contractor plans including renewals.
 */

/**
 * @swagger
 * /contractor/renew-plan:
 *   post:
 *     tags: [Contractor - Plan Management]
 *     summary: Renew Contractor Plan
 *     description: Allows a contractor to renew their existing plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 description: The ID of the plan to renew.
 *               renewal_duration:
 *                 type: integer
 *                 description: Duration in months for which the plan is being renewed.
 *             required:
 *               - plan_id
 *               - renewal_duration
 *           example:
 *             plan_id: 123
 *             renewal_duration: 12
 *     responses:
 *       200:
 *         description: Plan renewed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Plan renewed successfully.
 *               plan_details:
 *                 plan_id: 123
 *                 renewal_duration: 12
 *                 new_expiry_date: 2025-08-17
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Plan not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/renew-plan", verifyContractorToken, renewPlan);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Company Management
 *     description: Operations related to managing companies for contractors.
 */

/**
 * @swagger
 * /contractor/create-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Create a new company
 *     description: Register a new company under the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Company details to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the company.
 *                 example: ABC Corp
 *               companyType:
 *                 type: string
 *                 description: The type of company.
 *                 example: IT Services
 *               contactEmail:
 *                 type: string
 *                 description: Contact email for the company.
 *                 example: contact@abccorp.com
 *     responses:
 *       201:
 *         description: Company created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-my-company-list:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get list of companies
 *     description: Retrieve a list of companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: ABC Corp
 *                   type: IT Services
 *                 - id: 2
 *                   name: XYZ Ltd
 *                   type: Consulting
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor-get-my-company-single-details/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get single company details
 *     description: Retrieve detailed information for a specific company by ID.
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
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: ABC Corp
 *                 type: IT Services
 *                 contactEmail: contact@abccorp.com
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-my-company-details:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update company details
 *     description: Update details of a company associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Company details to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the company.
 *                 example: ABC Technologies
 *               contactEmail:
 *                 type: string
 *                 description: Updated contact email for the company.
 *                 example: contact@abctech.com
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-my-company/{id}:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Delete a company
 *     description: Remove a company associated with the contractor by ID.
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
 *         description: Company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-company-types:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get company types
 *     description: Retrieve a list of available company types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of company types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - type: IT Services
 *                 - type: Consulting
 *                 - type: Manufacturing
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-companies:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all companies
 *     description: Retrieve a list of all companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: ABC Corp
 *                   type: IT Services
 *                 - id: 2
 *                   name: XYZ Ltd
 *                   type: Consulting
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-company-details-by-id/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get company details by ID
 *     description: Retrieve detailed information for a specific company by ID.
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
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: ABC Corp
 *                 type: IT Services
 *                 contactEmail: contact@abccorp.com
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-all-company-details:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update all company details
 *     description: Update details for multiple companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of companies to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the company.
 *                       example: 1
 *                     companyName:
 *                       type: string
 *                       description: The new name of the company.
 *                       example: XYZ Technologies
 *                     contactEmail:
 *                       type: string
 *                       description: Updated contact email for the company.
 *                       example: contact@xyztech.com
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-purchase-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Add a purchase company
 *     description: Add a company to the list of purchase companies.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the purchase company to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the purchase company.
 *                 example: DEF Ltd
 *               companyType:
 *                 type: string
 *                 description: The type of purchase company.
 *                 example: Supplier
 *     responses:
 *       201:
 *         description: Purchase company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-purchase-companies:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all purchase companies
 *     description: Retrieve a list of all purchase companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all purchase companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: DEF Ltd
 *                   type: Supplier
 *                 - id: 2
 *                   name: GHI Inc
 *                   type: Distributor
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-purchase-company/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get purchase company by ID
 *     description: Retrieve detailed information for a specific purchase company by ID.
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
 *         description: Purchase company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: DEF Ltd
 *                 type: Supplier
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-purchase-company/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Edit purchase company by ID
 *     description: Retrieve details for editing a specific purchase company by ID.
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
 *         description: Purchase company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: DEF Ltd
 *                 type: Supplier
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-purchase-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update purchase company
 *     description: Update details of a purchase company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the purchase company to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the purchase company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the purchase company.
 *                 example: DEF Technologies
 *               companyType:
 *                 type: string
 *                 description: Updated type of the purchase company.
 *                 example: Supplier
 *     responses:
 *       200:
 *         description: Purchase company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-purchase-company/{id}:
 *   delete:
 *     tags: [Contractor - Company Management]
 *     summary: Delete a purchase company
 *     description: Remove a purchase company from the list by ID.
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
 *         description: Purchase company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-company", verifyContractorToken, sideBarPermissionCheck(CREATE, 2, 1), createCompany);
Router.get(
    "/contractor/get-my-company-list",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 2, 1, 1),
    getMyCompany
);
Router.get(
    "/contractor-get-my-company-single-details/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 2, 1, 1),
    getMyCompanySingleDetailsById
);
Router.post(
    "/contractor/update-my-company-details",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 2, 1, 1),
    updateMyCompanyDetails
);
Router.post(
    "/contractor/delete-my-company/:id",
    verifyContractorToken,
    sideBarPermissionCheck(DELETE, 2, 1),
    deleteMyCompany
);
Router.get("/contractor/get-company-types", verifyContractorToken, getCompanyTypes);
Router.get(
    "/contractor/get-all-companies",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 2, 1, 4),
    getAllCompany
);
Router.get("/contractor/get-company-details-by-id/:id", verifyContractorToken, getCompanySingleDetailsById);
Router.post(
    "/contractor/update-all-company-details",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 2, 1, 4),
    updateCompanyDetails
);
Router.post("/contractor/add-purchase-company", verifyContractorToken, addPurchaseCompany);
Router.get(
    "/contractor/all-purchase-companies",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 2, 1, 3),
    getPurchaseCompany
);
Router.get("/contractor/get-purchase-company/:id", verifyContractorToken, getPurchaseCompanyById);
Router.get("/contractor/edit-purchase-company/:id", verifyContractorToken, editPurchaseCompany);
Router.post(
    "/contractor/update-purchase-company",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 2, 1, 3),
    updatePurchaseCompanyById
);
Router.delete(
    "/contractor/delete-purchase-company/:id",
    verifyContractorToken,
    sideBarPermissionCheck(DELETE, 2, 1, 3),
    deletePurchaseCompanyById
);
Router.post("/contractor/import-companies", verifyContractorToken, companyImport);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Sales Company Management
 *     description: Operations related to managing sales companies for contractors.
 */

/**
 * @swagger
 * /contractor/add-sale-company:
 *   post:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Add a sale company
 *     description: Add a company to the list of sale companies.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the sale company to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the sale company.
 *                 example: GHI Ltd
 *               companyType:
 *                 type: string
 *                 description: The type of sale company.
 *                 example: Retailer
 *     responses:
 *       201:
 *         description: Sale company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-sale-companies:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Get all sale companies
 *     description: Retrieve a list of all sale companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sale companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: GHI Ltd
 *                   type: Retailer
 *                 - id: 2
 *                   name: JKL Inc
 *                   type: Distributor
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-sale-company/{id}:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Get sale company by ID
 *     description: Retrieve detailed information for a specific sale company by ID.
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
 *         description: Sale company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: GHI Ltd
 *                 type: Retailer
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-sale-company/{id}:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Edit sale company by ID
 *     description: Retrieve details for editing a specific sale company by ID.
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
 *         description: Sale company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: GHI Ltd
 *                 type: Retailer
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-sale-company:
 *   post:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Update sale company
 *     description: Update details of a sale company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the sale company to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the sale company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the sale company.
 *                 example: GHI Technologies
 *               companyType:
 *                 type: string
 *                 description: Updated type of the sale company.
 *                 example: Supplier
 *     responses:
 *       200:
 *         description: Sale company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-sale-company/{id}:
 *   delete:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Delete a sale company
 *     description: Remove a sale company from the list by ID.
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
 *         description: Sale company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-energy-company:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all energy companies
 *     description: Retrieve a list of all energy companies created by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all energy companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Energy Corp
 *                   type: Energy Provider
 *                 - id: 2
 *                   name: Solar Solutions
 *                   type: Solar Energy
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-user-status:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update user status
 *     description: Change the status of a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for updating the user status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user whose status is to be updated.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the user.
 *                 example: active
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/add-sale-company", verifyContractorToken, addSaleCompany);
Router.get(
    "/contractor/all-sale-companies",
    verifyContractorToken,

    getSaleCompanies
);
Router.get(
    "/contractor/get-sale-company/:id",
    verifyContractorToken,

    getSaleCompanyById
);
Router.get("/contractor/edit-sale-company/:id", verifyContractorToken, editSalesCompany);
Router.post(
    "/contractor/update-sale-company",
    verifyContractorToken,

    updateSalesCompany
);
Router.delete(
    "/contractor/delete-sale-company/:id",
    verifyContractorToken,

    removeSalesCompanyById
);
Router.get("/contractor/get-all-energy-company", verifyContractorToken, getAllCreatedEnergyCompany);
Router.post("/contractor/update-user-status", verifyContractorToken, changeUserStatus);

/** * Contractor Survey routes */

/**
 * @swagger
 * tags:
 *   - name: Contractor - Survey Management
 *     description: Operations related to managing surveys for contractors.
 */

/**
 * @swagger
 * /contractor/create-survey:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Create a new survey
 *     description: Add a new survey to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the survey to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyTitle:
 *                 type: string
 *                 description: The title of the survey.
 *                 example: Customer Satisfaction Survey
 *               surveyDescription:
 *                 type: string
 *                 description: A brief description of the survey.
 *                 example: Survey to gauge customer satisfaction with our service.
 *     responses:
 *       201:
 *         description: Survey created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-surveys:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all surveys
 *     description: Retrieve a list of all surveys created by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Customer Satisfaction Survey
 *                   description: Survey to gauge customer satisfaction with our service.
 *                 - id: 2
 *                   title: Product Feedback Survey
 *                   description: Survey to collect feedback on our latest product.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-survey-by-id/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get survey by ID
 *     description: Retrieve detailed information for a specific survey by ID.
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
 *         description: Survey details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 title: Customer Satisfaction Survey
 *                 description: Survey to gauge customer satisfaction with our service.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-survey-details/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Edit survey details by ID
 *     description: Retrieve details of a specific survey for editing by ID.
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
 *         description: Survey details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 title: Customer Satisfaction Survey
 *                 description: Survey to gauge customer satisfaction with our service.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-survey-details:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Update survey details
 *     description: Update details of an existing survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the survey to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the survey to update.
 *                 example: 1
 *               title:
 *                 type: string
 *                 description: The new title of the survey.
 *                 example: Updated Survey Title
 *               description:
 *                 type: string
 *                 description: The new description of the survey.
 *                 example: Updated survey description.
 *     responses:
 *       200:
 *         description: Survey updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-survey-details/{id}:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Delete a survey
 *     description: Remove a survey from the system by ID.
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
 *         description: Survey deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-assign-survey:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get assigned surveys
 *     description: Retrieve a list of surveys assigned to the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Customer Satisfaction Survey
 *                   description: Survey to gauge customer satisfaction with our service.
 *                 - id: 2
 *                   title: Product Feedback Survey
 *                   description: Survey to collect feedback on our latest product.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-survey:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Assign a survey
 *     description: Assign a survey to a contractor or user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for assigning the survey.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey to assign.
 *                 example: 1
 *               assigneeId:
 *                 type: integer
 *                 description: The ID of the user or contractor to whom the survey is assigned.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Survey assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey assigned successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/changed-survey-status:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Change survey status
 *     description: Update the status of a survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for updating the survey status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey whose status is to be updated.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the survey.
 *                 example: completed
 *     responses:
 *       200:
 *         description: Survey status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/submit-survey-question-response:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Submit survey question response
 *     description: Submit responses to survey questions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Responses to the survey questions.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       description: The ID of the question.
 *                       example: 101
 *                     answer:
 *                       type: string
 *                       description: The response to the question.
 *                       example: Yes
 *     responses:
 *       200:
 *         description: Survey responses submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey responses submitted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-requested-survey:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get requested surveys
 *     description: Retrieve a list of surveys that have been requested by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requested surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Requested Survey 1
 *                   description: Survey requested by the contractor for feedback.
 *                 - id: 2
 *                   title: Requested Survey 2
 *                   description: Another survey requested by the contractor.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-survey-response:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all survey responses
 *     description: Retrieve all responses to surveys managed by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all survey responses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - surveyId: 1
 *                   responses:
 *                     - questionId: 101
 *                       answer: Yes
 *                     - questionId: 102
 *                       answer: No
 *                 - surveyId: 2
 *                   responses:
 *                     - questionId: 201
 *                       answer: Maybe
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/surveys-otp-send:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Send OTP for survey
 *     description: Send an OTP to verify the contractor's identity for survey actions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for sending OTP.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number to which OTP will be sent.
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP sent successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/surveys-otp-verify:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Verify OTP for survey
 *     description: Verify the OTP received for survey actions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: OTP verification details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               otp:
 *                 type: string
 *                 description: The OTP to verify.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP verified successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-survey-response/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get survey response by ID
 *     description: Retrieve responses to a specific survey by ID.
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
 *         description: Survey responses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 surveyId: 1
 *                 responses:
 *                   - questionId: 101
 *                     answer: Yes
 *                   - questionId: 102
 *                     answer: No
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-purpose-master:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all purpose master data
 *     description: Retrieve all purpose master data for surveys.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purpose master data retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Feedback
 *                 - id: 2
 *                   name: Review
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-survey", verifyContractorToken, createSurvey);
Router.get("/contractor/get-all-surveys", verifyContractorToken, getAllSurvey);
Router.get("/contractor/get-survey-by-id/:id", verifyContractorToken, getSurveyById);
Router.get("/contractor/edit-survey-details/:id", verifyContractorToken, editSurveyDetails);
Router.post("/contractor/update-survey-details", verifyContractorToken, updateSurveyDetails);
Router.post("/contractor/delete-survey-details/:id", verifyContractorToken, deleteSurvey);
Router.get("/contractor/get-assign-survey", verifyContractorToken, getAssignedSurvey);
Router.post("/contractor/assign-survey", verifyContractorToken, assignToSurvey);
Router.post("/contractor/changed-survey-status", verifyContractorToken, updateRequestedSurveyStatus);
Router.post("/contractor/submit-survey-question-response", verifyContractorToken, surveyQuestionFormResponse);
Router.get("/contractor/get-requested-survey", verifyContractorToken, getRequestedSurvey);
Router.get("/contractor/get-all-survey-response", verifyContractorToken, getSurveyQuestionResponse);
Router.post("/contractor/surveys-otp-send", verifyContractorToken, otpSendSurvey);
Router.post("/contractor/surveys-otp-verify", verifyContractorToken, VerifyOtpSurvey);
Router.get("/contractor/get-survey-response/:id", verifyContractorToken, getSurveyResponseById);
Router.get("/contractor/get-all-purpose-master", verifyContractorToken, getAllPurposeMaster);
Router.post("/contractor/send-survey-response", verifyContractorToken, createSurveyResponse);
Router.get("/contractor/get-survey-response", verifyContractorToken, getSurveyResponse);
Router.get("/contractor/get-survey-response/:id", verifyContractorToken, getSurveyResponse);
// --------- complaint modules --------------------

/**
 * @swagger
 * tags:
 *   - name: Contractor - Complaint Management
 *     description: Operations related to managing complaints for contractors.
 */

/**
 * @swagger
 * /contractor/complaint-assign:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Assign a complaint
 *     description: Assign a complaint to a contractor or team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for assigning a complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to assign.
 *                 example: 1
 *               assigneeId:
 *                 type: integer
 *                 description: The ID of the person or team to whom the complaint is assigned.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaint assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint assigned successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/create-complaint-type:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Create a new complaint type
 *     description: Add a new type of complaint to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint type to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeName:
 *                 type: string
 *                 description: The name of the complaint type.
 *                 example: Service Quality
 *     responses:
 *       201:
 *         description: Complaint type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-requested-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get requested complaints
 *     description: Retrieve a list of all complaints requested by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requested complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaints-details/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get complaint details by ID
 *     description: Retrieve detailed information for a specific complaint by ID.
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
 *         description: Complaint details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 type: Service Quality
 *                 description: Complaint about service quality.
 *                 status: Requested
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-approved-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get approved complaints
 *     description: Retrieve a list of all approved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-rejected-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get rejected complaints
 *     description: Retrieve a list of all rejected complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-resolved-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all resolved complaints
 *     description: Retrieve a list of all resolved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resolved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints
 *     description: Retrieve a list of all complaints, regardless of status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-assign-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all approved and assigned complaints
 *     description: Retrieve a list of all approved and assigned complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved and assigned complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-un-assign-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all approved but unassigned complaints
 *     description: Retrieve a list of all approved but unassigned complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved but unassigned complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/re-work-for-resolved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Rework for resolved complaints
 *     description: Mark a resolved complaint for rework.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint to rework.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to rework.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Complaint marked for rework successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint marked for rework successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all outlet details by ID
 *     description: Retrieve details of all outlets associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of outlet details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Outlet 1
 *                 - id: 2
 *                   name: Outlet 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-regional-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all regional office details by ID
 *     description: Retrieve details of all regional offices associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of regional office details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Regional Office 1
 *                 - id: 2
 *                   name: Regional Office 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-sales-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all sales details by ID
 *     description: Retrieve details of all sales associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Sale 1
 *                 - id: 2
 *                   name: Sale 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-order-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all order details by ID
 *     description: Retrieve details of all orders associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Order 1
 *                 - id: 2
 *                   name: Order 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/reactive-complaints-status-update/{id}:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Reactive complaint status update
 *     description: Update the status of a complaint from rejected back to active.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Details for reactivating the complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the complaint.
 *                 example: Active
 *     responses:
 *       200:
 *         description: Complaint status updated to active successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint status updated to active successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-area-manager-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get area manager assignments
 *     description: Retrieve a list of area managers assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of area manager assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Area Manager 1
 *                 - id: 2
 *                   name: Area Manager 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-supervisor-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get supervisor assignments
 *     description: Retrieve a list of supervisors assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supervisor assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Supervisor 1
 *                 - id: 2
 *                   name: Supervisor 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-end-user-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get end user assignments
 *     description: Retrieve a list of end users assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of end user assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: End User 1
 *                 - id: 2
 *                   name: End User 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-as-resolved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Mark complaints as resolved
 *     description: Update the status of complaints to resolved.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints to mark as resolved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of complaint IDs to mark as resolved.
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Complaints marked as resolved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints marked as resolved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/hold-and-transfer-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Hold and transfer complaints
 *     description: Hold a complaint and transfer it to another team or person.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for holding and transferring the complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to hold and transfer.
 *                 example: 1
 *               newAssigneeId:
 *                 type: integer
 *                 description: The ID of the new assignee for the complaint.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaint held and transferred successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint held and transferred successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-allocate-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update allocation of complaints
 *     description: Update the allocation of complaints for resolution.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints allocation update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newAssigneeId:
 *                 type: integer
 *                 description: The ID of the new assignee for the complaint.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaints allocation updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints allocation updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-to-supervisor-or-manager/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get user to supervisor or manager
 *     description: Retrieve details of a user assigned to a supervisor or manager.
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
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: User 1
 *                 assignedTo: Supervisor 1
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-area-manager-to-complaints/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get area manager assigned to complaints
 *     description: Retrieve details of the area manager assigned to a specific complaint.
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
 *         description: Area manager details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: Area Manager 1
 *                 assignedComplaints: [1, 2]
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-regional-office-to-complaints/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get regional office assigned to complaints
 *     description: Retrieve details of the regional office assigned to a specific complaint.
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
 *         description: Regional office details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: Regional Office 1
 *                 assignedComplaints: [1, 2]
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-expect-pending-status:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints except pending status
 *     description: Retrieve a list of all complaints except those with pending status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints except pending status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-by-id/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints by ID
 *     description: Retrieve a list of all complaints associated with a specific ID.
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
 *         description: List of complaints by ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/complaint-assign", sideBarPermissionCheck(UPDATE, 3, 6), complaintAssignTo);
Router.post(
    "/contractor/create-complaint-type",
    verifyContractorToken,
    sideBarPermissionCheck(CREATE, 3, 6),
    addComplaintType
);
Router.get(
    "/contractor/get-requested-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllRequestedComplaints
);
Router.get(
    "/contractor/get-complaints-details/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getComplaintsDetailsById
);
Router.get(
    "/contractor/get-approved-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllApprovedComplaints
);
Router.get(
    "/contractor/get-rejected-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllRejectedComplaints
);
Router.get(
    "/contractor/get-all-resolved-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllResolvedComplaints
);
Router.get(
    "/contractor/get-all-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllComplaints
);
Router.get(
    "/contractor/get-all-approved-assign-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllApprovedAssignComplaints
);
Router.get(
    "/contractor/get-all-approved-un-assign-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllApprovedUnAssignComplaints
);
Router.post(
    "/contractor/re-work-for-resolved-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    reworkForResolvedComplaints
);
Router.get("/contractor/get-all-outlet-by-id-new", verifyContractorToken, getOutletByIdNew);
Router.get("/contractor/get-all-regional-by-id-new", verifyContractorToken, getRegionalByIdNew);
Router.get("/contractor/get-all-sales-by-id-new", verifyContractorToken, getSaleByIdNew);
Router.get("/contractor/get-all-order-by-id-new", verifyContractorToken, getOrderByIdNew);
Router.post(
    "/contractor/reactive-complaints-status-update/:id",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    reActiveToRejectedComplaints
);
Router.get(
    "/contractor/get-area-manager-assign",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAreaManagerOfAssign
);
Router.get("/contractor/get-supervisor-assign", verifyContractorToken, getSuperVisorOfAssign);
Router.get("/contractor/get-end-user-assign", verifyContractorToken, getEndUsersOfAssign);
Router.post(
    "/contractor/mark-as-resolved-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    markAsResolvedComplaints
);
Router.post(
    "/contractor/hold-and-transfer-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    holdAndTransferComplaints
);
Router.post(
    "/contractor/update-allocate-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    allocateComplaintsToResolve
);
Router.get("/contractor/get-user-to-supervisor-or-manager/:id", verifyContractorToken, userToManagerArea);
Router.get("/contractor/get-area-manager-to-complaints/:id", verifyContractorToken, getManagerToComplaints);
Router.get("/contractor/get-regional-office-to-complaints/:id", verifyContractorToken, getRegionalOfficeToComplaints);
Router.get(
    "/contractor/get-all-complaints-expect-pending-status",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllComplaintsExceptPending
);
Router.get(
    "/contractor/get-all-complaints-by-id/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getAllComplaintsById
);
Router.post(
    "/contractor/import-complaint",
    verifyContractorToken,
    sideBarPermissionCheck(CREATE, 3, 6),
    importComplaint
);

/**
 * @swagger
 * /contractor/get-approved-complaints-details/{id}:
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
 * /contractor/approved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Approve complaints
 *     description: Approve one or more complaints.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints to approve.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of complaint IDs to approve.
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Complaints approved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints approved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaints/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get complaints by ID
 *     description: Retrieve details of complaints associated with a specific ID.
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
 *         description: Complaints details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 type: Billing Issue
 *                 description: Details of the complaint.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-complaint-type:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update complaint type
 *     description: Update the type of an existing complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint type to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newType:
 *                 type: string
 *                 description: The new type of the complaint.
 *                 example: Technical Issue
 *     responses:
 *       200:
 *         description: Complaint type updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-complaint-status:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update complaint status
 *     description: Update the status of an existing complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint status to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newStatus:
 *                 type: string
 *                 description: The new status of the complaint.
 *                 example: Resolved
 *     responses:
 *       200:
 *         description: Complaint status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get(
    "/contractor/get-approved-complaints-details/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getApprovedComplaintsDetailsById
);
Router.post(
    "/contractor/approved-complaints",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    approvedComplaints
);
Router.get(
    "/contractor/get-complaints/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getComplaintsById
);
Router.post(
    "/contractor/update-complaint-type",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    updateComplaintType
);
Router.post(
    "/contractor/update-complaint-status",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    updateComplaintStatus
);

/**
 * @swagger
 * /contractor/create-user:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Create a new user
 *     description: Add a new user to the contractor's system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User details for creating a new user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 description: The role assigned to the new user.
 *                 example: Employee
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing user data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-user:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update user details
 *     description: Update details for an existing user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated user details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to update.
 *                 example: 1
 *               username:
 *                 type: string
 *                 description: The updated username.
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 description: The updated email address.
 *                 example: john.doe_updated@example.com
 *               role:
 *                 type: string
 *                 description: The updated role of the user.
 *                 example: Manager
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing user data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-employees:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get all employees
 *     description: Retrieve a list of all employees stored in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   username: john_doe
 *                   email: john.doe@example.com
 *                   role: Employee
 *                 - id: 2
 *                   username: jane_doe
 *                   email: jane.doe@example.com
 *                   role: Manager
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-employee-detail/{id}:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get details of a single employee by ID
 *     description: Retrieve details for a specific employee identified by ID.
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
 *         description: Employee details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 username: john_doe
 *                 email: john.doe@example.com
 *                 role: Employee
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-single-employee-detail:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Update details of a single employee
 *     description: Update details for a specific employee.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated employee details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee to update.
 *                 example: 1
 *               username:
 *                 type: string
 *                 description: The updated username.
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 description: The updated email address.
 *                 example: john.doe_updated@example.com
 *               role:
 *                 type: string
 *                 description: The updated role of the employee.
 *                 example: Manager
 *     responses:
 *       200:
 *         description: Employee details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-employee/{id}:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Delete an employee
 *     description: Remove an employee from the system by ID.
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
 *         description: Employee deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Employee deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-employee-assign-tasks:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get assigned tasks for employees
 *     description: Retrieve a list of tasks assigned to employees.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned tasks retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - taskId: 1
 *                   employeeId: 1
 *                   taskName: Task A
 *                   status: In Progress
 *                 - taskId: 2
 *                   employeeId: 2
 *                   taskName: Task B
 *                   status: Completed
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-user", verifyContractorToken, createUsers);
Router.post("/contractor/update-user", verifyContractorToken, updateUsers);
Router.get("/contractor/get-all-employees", verifyContractorToken, getAllStoredEmployeeDetails);
Router.get("/contractor/get-single-employee-detail/:id", verifyContractorToken, getSingleEmployeeDetailById);
Router.post("/contractor/update-single-employee-detail", verifyContractorToken, updateEmployeeDetails);
Router.post("/contractor/delete-employee/:id", verifyContractorToken, deleteEmployee);
Router.get("/contractor/get-employee-assign-tasks", verifyContractorToken, getEmployeeTaskById);
Router.post("/contractor/import-employees", verifyContractorToken, importEmployee);

/**
 * @swagger
 * tags:
 *   - name: Contractor - HR Team Management
 *     description: Operations related to managing HR teams for contractors.
 *   - name: Contractor - HR Management
 *     description: Operations related to managing HR tasks, time sheets, and user attendance for contractors.
 */

/**
 * @swagger
 * /contractor/create-hr-team:
 *   post:
 *     tags: [Contractor - HR Team Management]
 *     summary: Create a new HR team
 *     description: Add a new HR team to the contractor's system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: HR team details for creation.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *                 description: The name of the HR team.
 *                 example: HR Team A
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: List of member IDs to be added to the HR team.
 *                   example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: HR team created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing HR team data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-hr-teams:
 *   get:
 *     tags: [Contractor - HR Team Management]
 *     summary: Get all HR teams
 *     description: Retrieve a list of all HR teams in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all HR teams retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - teamId: 1
 *                   teamName: HR Team A
 *                   members: [1, 2, 3]
 *                 - teamId: 2
 *                   teamName: HR Team B
 *                   members: [4, 5]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-hr-team-detail/{id}:
 *   get:
 *     tags: [Contractor - HR Team Management]
 *     summary: Get details of a single HR team by ID
 *     description: Retrieve details of a specific HR team identified by ID.
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
 *         description: HR team details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 teamId: 1
 *                 teamName: HR Team A
 *                 members: [1, 2, 3]
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-hr-team-details:
 *   post:
 *     tags: [Contractor - HR Team Management]
 *     summary: Update HR team details
 *     description: Update details for a specific HR team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated HR team details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *                 description: The ID of the HR team to update.
 *                 example: 1
 *               teamName:
 *                 type: string
 *                 description: The updated name of the HR team.
 *                 example: HR Team A Updated
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: List of updated member IDs.
 *                   example: [1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: HR team updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-hr-team/{team_id}:
 *   delete:
 *     tags: [Contractor - HR Team Management]
 *     summary: Delete an HR team
 *     description: Remove an HR team from the system by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HR team deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: HR team deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-time-sheet/{id}:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get user time sheet by ID
 *     description: Retrieve the time sheet for a specific user identified by ID.
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
 *         description: User time sheet retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 timeSheet:
 *                   - date: "2024-08-16"
 *                     clockIn: "08:00"
 *                     clockOut: "17:00"
 *                     breakStart: "12:00"
 *                     breakEnd: "12:30"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-today-mark-login-and-break:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get today's login and break records
 *     description: Retrieve today's login, break, and attendance records for the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's login and break records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 clockIn: "08:00"
 *                 clockOut: "17:00"
 *                 breakStart: "12:00"
 *                 breakEnd: "12:30"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-time-sheet:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get time sheets for all users
 *     description: Retrieve time sheets for all users in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user time sheets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "08:00"
 *                       clockOut: "17:00"
 *                       breakStart: "12:00"
 *                       breakEnd: "12:30"
 *                 - userId: 2
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "09:00"
 *                       clockOut: "18:00"
 *                       breakStart: "13:00"
 *                       breakEnd: "13:30"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-time-sheet-new:
 *   get:
 *     tags: [Contractor - HR Management]
 *     summary: Get time sheets for all users (new version)
 *     description: Retrieve time sheets for all users, new version.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user time sheets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "08:00"
 *                       clockOut: "17:00"
 *                       breakStart: "12:00"
 *                       breakEnd: "12:30"
 *                 - userId: 2
 *                   timeSheet:
 *                     - date: "2024-08-16"
 *                       clockIn: "09:00"
 *                       clockOut: "18:00"
 *                       breakStart: "13:00"
 *                       breakEnd: "13:30"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-hr-team", verifyContractorToken, createHrTeam);
Router.get("/contractor/get-all-hr-teams", verifyContractorToken, getAllHrTeamWithMember);
Router.get("/contractor/get-single-hr-team-detail/:id", verifyContractorToken, getHrTeamDetailsById);
Router.post("/contractor/update-hr-team-details", verifyContractorToken, updateHrTeamDetails);
Router.delete("/contractor/delete-hr-team/:team_id", verifyContractorToken, deleteHrTeam);
Router.get("/contractor/get-user-time-sheet/:id", verifyContractorToken, timeSheet);
Router.get("/contractor/get-today-mark-login-and-break", verifyContractorToken, checkTodayMarkBreakAndAttendance);
Router.get("/contractor/get-all-user-time-sheet", verifyContractorToken, checkTotalUsersTimeSheet);
Router.get("/contractor/get-all-user-time-sheet-new", verifyContractorToken, checkTotalUsersTimeSheetNew); // for testing purpose
Router.post("/contractor/import-hr-team", verifyContractorToken, importHrTeam); // for testing purpose

/**
 * @swagger
 * tags:
 *   - name: Contractor - Attendance Management
 *     description: Operations related to managing attendance and user details for contractors.
 *   - name: Contractor - User Management
 *     description: Operations related to managing users, teams, and hierarchies for contractors.
 */

/**
 * @swagger
 * /contractor/mark-manual-attendance:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance manually
 *     description: Manually mark attendance for users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Attendance details to mark manually.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               clockIn:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-in time.
 *                 example: "2024-08-16T08:00:00Z"
 *               clockOut:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-out time.
 *                 example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-users-attendance-in-calendar-view:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' attendance in calendar view
 *     description: Retrieve attendance records for all users in a calendar view.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   attendance:
 *                     - date: "2024-08-16"
 *                       clockIn: "08:00"
 *                       clockOut: "17:00"
 *                 - userId: 2
 *                   attendance:
 *                     - date: "2024-08-16"
 *                       clockIn: "09:00"
 *                       clockOut: "18:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-user-attendance-in-calendar-view/{id}:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get single user's attendance in calendar view
 *     description: Retrieve attendance records for a specific user in a calendar view.
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
 *         description: User attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 attendance:
 *                   - date: "2024-08-16"
 *                     clockIn: "08:00"
 *                     clockOut: "17:00"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-manually-attendance-for-user:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance manually for a user
 *     description: Manually mark clock-in and clock-out times for a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Manual attendance details for a specific user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               clockIn:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-in time.
 *                 example: "2024-08-16T08:00:00Z"
 *               clockOut:
 *                 type: string
 *                 format: date-time
 *                 description: Clock-out time.
 *                 example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Manual attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Manual attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-today-clock-in:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' today clock-in records
 *     description: Retrieve today's clock-in records for all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's clock-in records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   clockIn: "08:00"
 *                 - userId: 2
 *                   clockIn: "09:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-user-today-clock-out:
 *   get:
 *     tags: [Contractor - Attendance Management]
 *     summary: Get all users' today clock-out records
 *     description: Retrieve today's clock-out records for all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's clock-out records retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   clockOut: "17:00"
 *                 - userId: 2
 *                   clockOut: "18:00"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-user-attendance-status-by-super-admin:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Change user attendance status by super admin
 *     description: Super admin can change the attendance status of users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details to update user attendance status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new attendance status (e.g., 'clockIn', 'clockOut').
 *                 example: "clockIn"
 *     responses:
 *       200:
 *         description: User attendance status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User attendance status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-by-id/{id}:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get user details by ID
 *     description: Retrieve details of a specific user identified by ID.
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
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 name: John Doe
 *                 role: Developer
 *                 email: john.doe@example.com
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-users-list-to-add-in-team/{team_id}:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get list of users to add to a team
 *     description: Retrieve a list of users available to add to a specific team.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users to add to team retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   name: John Doe
 *                 - userId: 2
 *                   name: Jane Smith
 *       400:
 *         description: Bad Request. Invalid or missing team ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-specific-user-to-team:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Add a specific user to a team
 *     description: Add a specific user to a team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User and team details for adding user to team.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be added.
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 description: The ID of the team to which the user will be added.
 *                 example: 2
 *     responses:
 *       200:
 *         description: User added to team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User added to team successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/remove-specific-user-from-team:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Remove a specific user from a team
 *     description: Remove a specific user from a team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User and team details for removing user from team.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be removed.
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 description: The ID of the team from which the user will be removed.
 *                 example: 2
 *     responses:
 *       200:
 *         description: User removed from team successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User removed from team successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-logged-user-details-and-type:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get details and type of logged-in user
 *     description: Retrieve details and type of the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in user details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 userId: 1
 *                 name: John Doe
 *                 role: Contractor
 *                 email: john.doe@example.com
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-on-role-level-wise/{role_id?}:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get users based on role level
 *     description: Retrieve a list of users based on their role level.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         schema:
 *           type: integer
 *           required: false
 *     responses:
 *       200:
 *         description: Users based on role level retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   name: John Doe
 *                   role: Manager
 *                 - userId: 2
 *                   name: Jane Smith
 *                   role: Developer
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/save-user-hierarchy-level-wise:
 *   post:
 *     tags: [Contractor - User Management]
 *     summary: Save user hierarchy level-wise
 *     description: Save user hierarchy details level-wise.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User hierarchy details to be saved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userHierarchy:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: The ID of the user.
 *                       example: 1
 *                     hierarchyLevel:
 *                       type: integer
 *                       description: The hierarchy level of the user.
 *                       example: 2
 *     responses:
 *       200:
 *         description: User hierarchy saved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User hierarchy saved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-attendance-in-bulk:
 *   post:
 *     tags: [Contractor - Attendance Management]
 *     summary: Mark attendance in bulk
 *     description: Mark attendance for multiple users in bulk.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Bulk attendance details for users.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user.
 *                   example: 1
 *                 clockIn:
 *                   type: string
 *                   format: date-time
 *                   description: Clock-in time.
 *                   example: "2024-08-16T08:00:00Z"
 *                 clockOut:
 *                   type: string
 *                   format: date-time
 *                   description: Clock-out time.
 *                   example: "2024-08-16T17:00:00Z"
 *     responses:
 *       200:
 *         description: Bulk attendance marked successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Bulk attendance marked successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/mark-manual-attendance", verifyContractorToken, markAttendance);
Router.get(
    "/contractor/get-all-users-attendance-in-calendar-view",
    verifyContractorToken,
    getAllUserTimeSheetInCalendarView
);
Router.get(
    "/contractor/get-single-user-attendance-in-calendar-view/:id",
    verifyContractorToken,
    getSingleUserAttendanceTimeSheetInCalendarView
);
Router.post("/contractor/mark-manually-attendance-for-user", verifyContractorToken, createManuallyClockInClockOut);
Router.get("/contractor/get-all-user-today-clock-in", verifyContractorToken, getAllUsersTodayClockIn);
Router.get("/contractor/get-all-user-today-clock-out", verifyContractorToken, getAllUsersTodayClockOut);
Router.post(
    "/contractor/change-user-attendance-status-by-super-admin",
    verifyContractorToken,
    markUserClockInClockOutBySuperAdmin
);
Router.get("/contractor/get-user-by-id/:id", verifyContractorToken, getUserById);
Router.get("/contractor/get-users-list-to-add-in-team/:team_id", verifyContractorToken, getMemberListToAddInTeam);
Router.post("/contractor/add-specific-user-to-team", verifyContractorToken, addNewMemberInTeam);
Router.post("/contractor/remove-specific-user-from-team", verifyContractorToken, removeSpecificUserFromTeam);
Router.get("/contractor/get-logged-user-details-and-type", verifyContractorToken, getLoggedUserDetails);
Router.get("/contractor/get-user-on-role-level-wise/:role_id?", verifyContractorToken, getUsersOnRoleId);
Router.post("/contractor/save-user-hierarchy-level-wise", verifyContractorToken, saveUserHierarchyLevel);
Router.post("/contractor/mark-attendance-in-bulk", verifyContractorToken, markAttendanceInBulk);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Leave Management
 *     description: Operations related to managing leave types, applications, and statuses.
 */

/**
 * @swagger
 * /contractor/create-leave-type:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Create a new leave type
 *     description: Create a new type of leave that can be applied for by users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the leave type to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeName:
 *                 type: string
 *                 description: The name of the leave type.
 *                 example: "Sick Leave"
 *               description:
 *                 type: string
 *                 description: A brief description of the leave type.
 *                 example: "Leave taken due to illness."
 *     responses:
 *       200:
 *         description: Leave type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave type created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-leave-type:
 *   get:
 *     tags: [Contractor - Leave Management]
 *     summary: Get all leave types
 *     description: Retrieve a list of all leave types available in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All leave types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - leaveTypeId: 1
 *                   leaveTypeName: "Sick Leave"
 *                   description: "Leave taken due to illness."
 *                 - leaveTypeId: 2
 *                   leaveTypeName: "Annual Leave"
 *                   description: "Leave taken for personal time off."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-active-leave-type:
 *   get:
 *     tags: [Contractor - Leave Management]
 *     summary: Get all active leave types
 *     description: Retrieve a list of leave types that are currently active and available for application.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active leave types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - leaveTypeId: 1
 *                   leaveTypeName: "Sick Leave"
 *                   description: "Leave taken due to illness."
 *                 - leaveTypeId: 2
 *                   leaveTypeName: "Annual Leave"
 *                   description: "Leave taken for personal time off."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-leave-type-by-id/{id}:
 *   get:
 *     tags: [Contractor - Leave Management]
 *     summary: Get leave type by ID
 *     description: Retrieve details of a specific leave type identified by its ID.
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
 *         description: Leave type details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 leaveTypeId: 1
 *                 leaveTypeName: "Sick Leave"
 *                 description: "Leave taken due to illness."
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-leave-type-details:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Update leave type details
 *     description: Update the details of an existing leave type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the leave type.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeId:
 *                 type: integer
 *                 description: The ID of the leave type to update.
 *                 example: 1
 *               leaveTypeName:
 *                 type: string
 *                 description: The updated name of the leave type.
 *                 example: "Sick Leave"
 *               description:
 *                 type: string
 *                 description: Updated description of the leave type.
 *                 example: "Updated description of sick leave."
 *     responses:
 *       200:
 *         description: Leave type details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave type details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-leave-type/{id}:
 *   delete:
 *     tags: [Contractor - Leave Management]
 *     summary: Delete leave type
 *     description: Delete a specific leave type identified by its ID.
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
 *         description: Leave type deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave type deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/apply-leave:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Apply for leave
 *     description: Submit a leave application for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Leave application details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeId:
 *                 type: integer
 *                 description: The ID of the leave type being applied for.
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the leave.
 *                 example: "2024-08-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the leave.
 *                 example: "2024-08-22"
 *               reason:
 *                 type: string
 *                 description: The reason for the leave application.
 *                 example: "Flu and need to rest."
 *     responses:
 *       200:
 *         description: Leave application submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application submitted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-managers-users:
 *   get:
 *     tags: [Contractor - User Management]
 *     summary: Get all manager users
 *     description: Retrieve a list of all users with the role of manager.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of manager users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   name: John Doe
 *                   role: Manager
 *                 - userId: 2
 *                   name: Jane Smith
 *                   role: Manager
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/leave-application-status-update:
 *   post:
 *     tags: [Contractor - Leave Management]
 *     summary: Update leave application status
 *     description: Update the status of a leave application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Leave application status update details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: integer
 *                 description: The ID of the leave application.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the leave application.
 *                 example: "Approved"
 *               comments:
 *                 type: string
 *                 description: Optional comments on the status update.
 *                 example: "Leave approved for medical reasons."
 *     responses:
 *       200:
 *         description: Leave application status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Leave application status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-leave-type", verifyContractorToken, createLeaveType);
Router.get("/contractor/get-all-leave-type", verifyContractorToken, getAllLeaveType);
Router.get("/contractor/get-active-leave-type", verifyContractorToken, getAllActiveLeaveType);
Router.get("/contractor/get-leave-type-by-id/:id", verifyContractorToken, getAllLeaveTypeById);
Router.post("/contractor/update-leave-type-details", verifyContractorToken, updateLeaveType);
Router.delete("/contractor/delete-leave-type/:id", verifyContractorToken, deleteLeaveType);
Router.post("/contractor/apply-leave", verifyContractorToken, applyLeave);
Router.get("/contractor/get-all-managers-users", verifyContractorToken, getAllManagerUsers);
Router.post("/contractor/leave-application-status-update", verifyContractorToken, updateLeaveApplication);
Router.get("/contractor/get-from-companies", verifyToken([process.env.CONTRACTOR_ROLE_ID]), getFromCompanies);
Router.get("/super-admin/get-from-companies", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getFromCompanies);

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
Router.post("/contractor/create-group-insurance", verifyContractorToken, createGroupInsurance);
Router.get("/contractor/get-group-insurance-list", verifyContractorToken, getAllGroupInsurance);
Router.get("/contractor/get-group-insurance-single-details/:id", verifyContractorToken, getSingleGroupInsuranceDetails);
Router.post("/contractor/update-group-insurance-details", verifyContractorToken, updateGroupInsuranceDetails);
Router.delete("/contractor/delete-group-insurance-details/:id", verifyContractorToken, deleteGroupInsurance);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Insurance Company Management
 *     description: Operations related to managing insurance companies.
 */

/**
 * @swagger
 * /contractor/register-insurance-company:
 *   post:
 *     tags: [Contractor - Insurance Company Management]
 *     summary: Register a new insurance company
 *     description: Add a new insurance company to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the insurance company to be registered.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the insurance company.
 *                 example: "ABC Insurance"
 *               companyAddress:
 *                 type: string
 *                 description: The address of the insurance company.
 *                 example: "123 Insurance Street, City, Country"
 *               contactNumber:
 *                 type: string
 *                 description: The contact number of the insurance company.
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 description: The email address of the insurance company.
 *                 example: "contact@abcinsurance.com"
 *     responses:
 *       200:
 *         description: Insurance company registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company registered successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-insurance-company-list:
 *   get:
 *     tags: [Contractor - Insurance Company Management]
 *     summary: Get a list of all insurance companies
 *     description: Retrieve a list of all registered insurance companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of insurance companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - companyId: 1
 *                   companyName: "ABC Insurance"
 *                   companyAddress: "123 Insurance Street, City, Country"
 *                   contactNumber: "+1234567890"
 *                   email: "contact@abcinsurance.com"
 *                 - companyId: 2
 *                   companyName: "XYZ Insurance"
 *                   companyAddress: "456 Insurance Avenue, City, Country"
 *                   contactNumber: "+0987654321"
 *                   email: "info@xyzinsurance.com"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-insurance-company-single-details/{id}:
 *   get:
 *     tags: [Contractor - Insurance Company Management]
 *     summary: Get details of a specific insurance company by ID
 *     description: Retrieve detailed information of a specific insurance company identified by its ID.
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
 *         description: Insurance company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 companyId: 1
 *                 companyName: "ABC Insurance"
 *                 companyAddress: "123 Insurance Street, City, Country"
 *                 contactNumber: "+1234567890"
 *                 email: "contact@abcinsurance.com"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-insurance-company-details:
 *   post:
 *     tags: [Contractor - Insurance Company Management]
 *     summary: Update insurance company details
 *     description: Update the details of an existing insurance company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the insurance company.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: The ID of the insurance company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The updated name of the insurance company.
 *                 example: "ABC Insurance"
 *               companyAddress:
 *                 type: string
 *                 description: The updated address of the insurance company.
 *                 example: "123 Insurance Street, City, Country"
 *               contactNumber:
 *                 type: string
 *                 description: The updated contact number of the insurance company.
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 description: The updated email address of the insurance company.
 *                 example: "contact@abcinsurance.com"
 *     responses:
 *       200:
 *         description: Insurance company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-insurance-company/{id}:
 *   delete:
 *     tags: [Contractor - Insurance Company Management]
 *     summary: Delete an insurance company
 *     description: Delete a specific insurance company identified by its ID.
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
 *         description: Insurance company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/register-insurance-company", verifyContractorToken, registerInsuranceCompany);
Router.get("/contractor/get-insurance-company-list", verifyContractorToken, getAllInsuranceCompanyList);
Router.get(
    "/contractor/get-insurance-company-single-details/:id",
    verifyContractorToken,
    getSingleInsuranceCompanyDetails
);
Router.post("/contractor/update-insurance-company-details", verifyContractorToken, updateInsuranceCompanyDetails);
Router.post("/contractor/delete-insurance-company/:id", verifyContractorToken, deleteInsuranceCompanyById);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Insurance Company Plans Management
 *     description: Operations related to managing insurance company plans.
 */

/**
 * @swagger
 * /contractor/register-insurance-company-plans:
 *   post:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Register new insurance company plans
 *     description: Add new plans for a specific insurance company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the insurance company plans to be registered.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: The ID of the insurance company.
 *                 example: 1
 *               planName:
 *                 type: string
 *                 description: The name of the insurance plan.
 *                 example: "Premium Health Plan"
 *               planDetails:
 *                 type: string
 *                 description: The details of the insurance plan.
 *                 example: "Comprehensive coverage including hospitalization and outpatient care."
 *               coverageAmount:
 *                 type: number
 *                 format: float
 *                 description: The coverage amount of the insurance plan.
 *                 example: 500000
 *     responses:
 *       200:
 *         description: Insurance company plans registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance company plans registered successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-insurance-plan-list:
 *   get:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Get a list of all insurance plans
 *     description: Retrieve a list of all registered insurance plans.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of insurance plans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - planId: 1
 *                   companyId: 1
 *                   planName: "Premium Health Plan"
 *                   planDetails: "Comprehensive coverage including hospitalization and outpatient care."
 *                   coverageAmount: 500000
 *                 - planId: 2
 *                   companyId: 2
 *                   planName: "Basic Health Plan"
 *                   planDetails: "Basic coverage including emergency care."
 *                   coverageAmount: 200000
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-insurance-plan-details/{id}:
 *   get:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Get details of a specific insurance plan by ID
 *     description: Retrieve detailed information of a specific insurance plan identified by its ID.
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
 *         description: Insurance plan details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 planId: 1
 *                 companyId: 1
 *                 planName: "Premium Health Plan"
 *                 planDetails: "Comprehensive coverage including hospitalization and outpatient care."
 *                 coverageAmount: 500000
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-insurance-plan-details:
 *   post:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Update insurance plan details
 *     description: Update the details of an existing insurance plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the insurance plan.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: integer
 *                 description: The ID of the insurance plan to update.
 *                 example: 1
 *               companyId:
 *                 type: integer
 *                 description: The ID of the insurance company.
 *                 example: 1
 *               planName:
 *                 type: string
 *                 description: The updated name of the insurance plan.
 *                 example: "Updated Premium Health Plan"
 *               planDetails:
 *                 type: string
 *                 description: The updated details of the insurance plan.
 *                 example: "Updated comprehensive coverage including hospitalization and outpatient care."
 *               coverageAmount:
 *                 type: number
 *                 format: float
 *                 description: The updated coverage amount of the insurance plan.
 *                 example: 600000
 *     responses:
 *       200:
 *         description: Insurance plan details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance plan details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-insurance-plan-details/{id}:
 *   post:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Delete an insurance plan
 *     description: Delete a specific insurance plan identified by its ID.
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
 *         description: Insurance plan deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Insurance plan deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-plans-of-insurance-company/{id}:
 *   get:
 *     tags: [Contractor - Insurance Company Plans Management]
 *     summary: Get plans of a specific insurance company by ID
 *     description: Retrieve all plans associated with a specific insurance company identified by its ID.
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
 *         description: List of insurance plans for the specified company retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - planId: 1
 *                   companyId: 1
 *                   planName: "Premium Health Plan"
 *                   planDetails: "Comprehensive coverage including hospitalization and outpatient care."
 *                   coverageAmount: 500000
 *                 - planId: 2
 *                   companyId: 1
 *                   planName: "Basic Health Plan"
 *                   planDetails: "Basic coverage including emergency care."
 *                   coverageAmount: 200000
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/register-insurance-company-plans", verifyContractorToken, registerInsuranceCompanyPlan);
Router.get("/contractor/get-all-insurance-plan-list", verifyContractorToken, getAllInsurancePlans);
Router.get("/contractor/get-single-insurance-plan-details/:id", verifyContractorToken, getInsurancePlanById);
Router.post("/contractor/update-insurance-plan-details", verifyContractorToken, updateInsurancePlanDetails);
Router.post("/contractor/delete-insurance-plan-details/:id", verifyContractorToken, deleteInsurancePlanById);
Router.get("/contractor/get-plans-of-insurance-company/:id", verifyContractorToken, getInsuranceCompanyWithPlansById);

//---------------Documents routes contractors------------------------

/**
 * @swagger
 * /contractor/create-document-category:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Create a new document category
 *     description: Register a new document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the new document category.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: The name of the document category.
 *                 example: "Legal Documents"
 *               description:
 *                 type: string
 *                 description: A brief description of the document category.
 *                 example: "Category for storing all legal-related documents."
 *     responses:
 *       200:
 *         description: Document category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-document-categories:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve all document categories
 *     description: Get a list of all document categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of document categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - categoryId: 1
 *                   categoryName: "Legal Documents"
 *                   description: "Category for storing all legal-related documents."
 *                 - categoryId: 2
 *                   categoryName: "HR Documents"
 *                   description: "Category for storing HR-related documents."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-document-category-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Get details of a specific document category
 *     description: Retrieve detailed information about a document category by its ID.
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
 *         description: Document category details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 categoryId: 1
 *                 categoryName: "Legal Documents"
 *                 description: "Category for storing all legal-related documents."
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-document-category-details:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Update document category details
 *     description: Update the details of an existing document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the document category.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category to update.
 *                 example: 1
 *               categoryName:
 *                 type: string
 *                 description: The updated name of the document category.
 *                 example: "Updated Legal Documents"
 *               description:
 *                 type: string
 *                 description: The updated description of the document category.
 *                 example: "Updated category for storing all legal-related documents."
 *     responses:
 *       200:
 *         description: Document category details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-document-category/{id}:
 *   delete:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Delete a document category
 *     description: Remove a document category identified by its ID.
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
 *         description: Document category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-documents:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Add new documents
 *     description: Upload new documents and associate them with a document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the documents to be added.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category.
 *                 example: 1
 *               documentFile:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded.
 *     responses:
 *       200:
 *         description: Documents added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Documents added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-document:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve all documents
 *     description: Get a list of all uploaded documents.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - documentId: 1
 *                   categoryId: 1
 *                   documentName: "Contract.pdf"
 *                   documentUrl: "/documents/contract.pdf"
 *                 - documentId: 2
 *                   categoryId: 2
 *                   documentName: "HR Policy.docx"
 *                   documentUrl: "/documents/hr_policy.docx"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/view-document/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: View a specific document
 *     description: Retrieve and view a document identified by its ID.
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
 *         description: Document retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 documentId: 1
 *                 categoryId: 1
 *                 documentName: "Contract.pdf"
 *                 documentUrl: "/documents/contract.pdf"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-document-on-category-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve documents by category ID
 *     description: Get a list of documents associated with a specific category ID.
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
 *         description: List of documents for the specified category retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - documentId: 1
 *                   documentName: "Contract.pdf"
 *                   documentUrl: "/documents/contract.pdf"
 *                 - documentId: 2
 *                   documentName: "Legal Agreement.docx"
 *                   documentUrl: "/documents/legal_agreement.docx"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-document/{id}:
 *   delete:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Delete a document
 *     description: Remove a document identified by its ID.
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
 *         description: Document deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-document:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Update document details
 *     description: Update the details of an existing document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the document.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: integer
 *                 description: The ID of the document to update.
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category.
 *                 example: 1
 *               documentName:
 *                 type: string
 *                 description: The updated name of the document.
 *                 example: "Updated Contract.pdf"
 *     responses:
 *       200:
 *         description: Document details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-users-by-role/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Get users by role ID
 *     description: Retrieve users based on their role ID.
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
 *         description: List of users with the specified role retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   userName: "John Doe"
 *                   roleId: 2
 *                 - userId: 2
 *                   userName: "Jane Smith"
 *                   roleId: 2
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-document-category", verifyContractorToken, createDocumentCategory);
Router.get("/contractor/get-all-document-categories", verifyContractorToken, getAllDocumentCategory);
Router.get("/contractor/get-document-category-details/:id", verifyContractorToken, getDocumentCategoryById);
Router.post("/contractor/update-document-category-details", verifyContractorToken, updateDocumentCategory);
Router.delete("/contractor/delete-document-category/:id", verifyContractorToken, removeDocumentCategoryById);
Router.post("/contractor/add-documents", verifyContractorToken, addDocuments);
Router.get("/contractor/get-all-document", verifyContractorToken, getAllDocuments);
Router.get("/contractor/view-document/:id", verifyContractorToken, viewDocuments);
Router.get("/contractor/get-document-on-category-id/:id", verifyContractorToken, getDocumentOnCategoryById);
Router.delete("/contractor/delete-document/:id", verifyContractorToken, removeDocumentById);
Router.post("/contractor/update-document", verifyContractorToken, updateDocuments);
Router.get("/contractor/get-users-by-role/:id", verifyContractorToken, getUsersByRoleId);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Payroll and Module Management
 *     description: Operations related to modules, leave applications, allowances, deductions, payroll settings, and salary disbursal.
 */

/**
 * @swagger
 * /contractor/get-all-module:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all modules
 *     description: Get a list of all modules.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modules retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - moduleId: 1
 *                   moduleName: "HR"
 *                 - moduleId: 2
 *                   moduleName: "Finance"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-apply-leave:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all leave applications
 *     description: Get a list of all leave applications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave applications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - leaveId: 1
 *                   userId: 1
 *                   leaveType: "Sick Leave"
 *                   leaveStatus: "Approved"
 *                 - leaveId: 2
 *                   userId: 2
 *                   leaveType: "Casual Leave"
 *                   leaveStatus: "Pending"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /contractor/roles:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all roles
 *     description: Get a list of all roles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - roleId: 1
 *                   roleName: "Admin"
 *                 - roleId: 2
 *                   roleName: "Employee"
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

/**
 * @swagger
 * /contractor/get-all-loans-pending:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all pending loan requests
 *     description: Get a list of all loan requests that are pending.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending loan requests retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - loanId: 1
 *                   userId: 1
 *                   loanAmount: 2000
 *                   requestDate: "2024-08-01"
 *                   status: "Pending"
 *                 - loanId: 2
 *                   userId: 2
 *                   loanAmount: 1500
 *                   requestDate: "2024-08-02"
 *                   status: "Pending"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

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
Router.get("/contractor/get-all-module", verifyContractorToken, getAllModule);
Router.get("/contractor/all-apply-leave", verifyContractorToken, getAllLeaveApplications);
Router.get("/contractor/get-all-allowances", verifyContractorToken, getAllCreatedAllowances);
Router.get("/contractor/get-all-deductions", verifyContractorToken, getAllCreatedDeductionTypes);
Router.get("/contractor/roles", verifyContractorToken, getAllRoles);
Router.get("/contractor/get-all-payroll-master-settings", verifyContractorToken, getAllPayRollMasterSettings);
Router.get("/contractor/get-salary-disbursal", verifyContractorToken, getAllUserSalaryForDisbursal);
Router.get("/contractor/get-salary-disbursal-details", verifyContractorToken, getUserSalaryDisbursalDetailsById);
Router.post("/contractor/mark-salary-disbursed", verifyContractorToken, markSalaryDisbursed);
Router.get("/contractor/get-all-loans-pending", verifyContractorToken, getAllLoanRequests);
Router.get("/contractor/get-users-pay-slip", verifyContractorToken, getUsersPaySlip);

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
Router.post("/contractor/employee-promotion-demotion-add", verifyContractorToken, employeeAddAction);
Router.get(
    "/contractor/employee-promotion-demotion-get-all-list",
    verifyContractorToken,
    getAllEmployeePromotionDemotion
);
Router.get(
    "/contractor/single-employee-promotion-demotion-details/:id",
    verifyContractorToken,
    getAllEmployeePromotionDemotionById
);
Router.post(
    "/contractor/update-employee-promotion-demotion-details",
    verifyContractorToken,
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
Router.get("/contractor/get-resignations-pending-request", verifyContractorToken, getPendingResignationRequests);
Router.get("/contractor/get-resignations-approved-list", verifyContractorToken, getApprovedResignationRequests);
Router.get("/contractor/get-resignations-rejected-list", verifyContractorToken, getRejectedResignationRequests);
Router.get("/contractor/get-single-resignation-details/:id", verifyContractorToken, getResignationDetailsById);
Router.post("/contractor/update-resignations-details", verifyContractorToken, updateResignationDetails);
Router.post("/contractor/viewed-resignations-request/:id", verifyContractorToken, resignationRequestViewed);
Router.post(
    "/contractor/update-resignations-request-by-admin/:id/:status",
    verifyContractorToken,
    resignationStatusUpdateByAdmin
);
Router.post("/contractor/generate-fnf-statements", verifyContractorToken, generateFnFStatement);
Router.get("/contractor/get-fnf-statements", verifyContractorToken, getFnfStatement);

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
Router.post("/contractor/register-employee-pension", verifyContractorToken, registerPensionForEmployee);
Router.get("/contractor/get-all-registered-pension-list", verifyContractorToken, getAllRegisteredPension);
Router.get("/contractor/get-single-registered-pension-details/:id", verifyContractorToken, getRegisteredPensionById);
Router.post("/contractor/update-registered-pension", verifyContractorToken, updatePensionDetails);
Router.delete("/contractor/delete-register-employee-pension/:id", verifyContractorToken, deletePensionById);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Employee History & Activity Logs
 *     description: Operations related to tracking employee history and retrieving activity logs.
 */

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

/**
 * @swagger
 * /contractor/get-all-activity-logs:
 *   get:
 *     tags: [Contractor - Employee History & Activity Logs]
 *     summary: Get all activity logs
 *     description: Retrieve all activity logs within the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All activity logs retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - logId: 1
 *                   action: "Login"
 *                   userId: 1
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - logId: 2
 *                   action: "Create Document"
 *                   userId: 2
 *                   timestamp: "2024-08-17T11:00:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-activity-logs/{id}:
 *   get:
 *     tags: [Contractor - Employee History & Activity Logs]
 *     summary: Get details of a single activity log
 *     description: Retrieve details of a specific activity log by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the activity log to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity log details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 logId: 1
 *                 action: "Login"
 *                 userId: 1
 *                 timestamp: "2024-08-17T10:00:00Z"
 *                 details: "User logged in successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Log not found.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/get-employee-history-details/:id", verifyContractorToken, trackEmployeeHistory);
Router.get("/contractor/get-all-activity-logs", verifyContractorToken, getAllActivityLog);
Router.get("/contractor/get-single-activity-logs/:id", verifyContractorToken, getActivityLogDetails);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Item Master & Profile Management
 *     description: Operations related to item master details, stock requests, and user profile management.
 */

/**
 * @swagger
 * /contractor/get-item-master-details/{id}:
 *   get:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get item master details by ID
 *     description: Retrieve the details of a specific item master by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the item master.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item master details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 itemId: 1
 *                 name: "Item Name"
 *                 description: "Item Description"
 *                 price: 100
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Item master not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-item-master-for-dropdown:
 *   get:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get all item masters for dropdown
 *     description: Retrieve a list of all item masters formatted for a dropdown selection.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item masters retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - itemId: 1
 *                   name: "Item Name 1"
 *                 - itemId: 2
 *                   name: "Item Name 2"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-item-via-stock-request:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Add item via stock request
 *     description: Add an item to the inventory via a stock request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: "New Item"
 *               quantity:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Item added successfully via stock request.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item added successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/check-item-unique-id-exists:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Check if item unique ID exists
 *     description: Verify if a given item unique ID already exists in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *                 example: "ITEM12345"
 *     responses:
 *       200:
 *         description: Check completed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               exists: true
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/profile-update:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Update profile details
 *     description: Update the profile details of the logged-in contractor user.
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Profile updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/profile:
 *   get:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get profile details
 *     description: Retrieve the profile details of the logged-in contractor user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-password:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Change password
 *     description: Change the password for the logged-in contractor user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "old_password123"
 *               newPassword:
 *                 type: string
 *                 example: "new_password456"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Password changed successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-item-via-fund-request:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Add item via fund request
 *     description: Add an item to the inventory via a fund request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: "New Item"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Item added successfully via fund request.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item added successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approved-add-item-via-fund-request:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Approve and add item via fund request
 *     description: Approve and add an item to the inventory via a fund request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: "New Item"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Item approved and added successfully via fund request.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item approved and added successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/by-name-to-hsn-code:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get HSN code by item name
 *     description: Retrieve the HSN code corresponding to a specific item name.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: "Item Name"
 *     responses:
 *       200:
 *         description: HSN code retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 hsnCode: "123456"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-item-master-by-supplier-id/{id}:
 *   get:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get item masters by supplier ID
 *     description: Retrieve item masters associated with a specific supplier ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the supplier.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item masters retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - itemId: 1
 *                   name: "Item Name 1"
 *                   supplierId: 1
 *                 - itemId: 2
 *                   name: "Item Name 2"
 *                   supplierId: 1
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Supplier or items not found.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/get-item-master-details/:id", verifyContractorToken, getSingleItemMaster);
Router.get("/contractor/get-all-item-master-for-dropdown", verifyContractorToken, getAllItemMastersForDropdown);
Router.post("/contractor/add-item-via-stock-request", verifyContractorToken, addItemFromStockRequest);
Router.post("/contractor/check-item-unique-id-exists", verifyContractorToken, checkItemUniqueIdExist);
Router.post("/contractor/profile-update", verifyContractorToken, updateProfile);
Router.get("/contractor/profile", verifyContractorToken, getProfileDetails);
Router.post("/contractor/change-password", verifyContractorToken, changePassword);
Router.post("/contractor/add-item-via-fund-request", verifyContractorToken, addItemFromFundRequest);
Router.post("/contractor/approved-add-item-via-fund-request", verifyContractorToken, approvedAddItemFromFundRequest);
Router.post("/contractor/by-name-to-hsn-code", verifyContractorToken, byNameToHsnCode);
Router.get("/contractor/get-item-master-by-supplier-id/:id", verifyContractorToken, getAllItemsBySupplierId);
// new route
Router.post("/contractor/change-status-for-item-master", verifyContractorToken, approveOrRejectItems);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Plan Management
 *     description: Operations related to managing plans, including creation, updating, deletion, and purchasing of plans.
 */

/**
 * @swagger
 * /contractor/create-plan:
 *   post:
 *     tags: [Contractor - Plan Management]
 *     summary: Create a new plan
 *     description: Create a new plan with the specified details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *                 example: "Premium Plan"
 *               description:
 *                 type: string
 *                 example: "This is a premium plan offering advanced features."
 *               price:
 *                 type: number
 *                 example: 49.99
 *               duration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Plan created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Plan created successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-plans:
 *   get:
 *     tags: [Contractor - Plan Management]
 *     summary: Get all plans
 *     description: Retrieve a list of all available plans.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plans retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - planId: 1
 *                   planName: "Basic Plan"
 *                   price: 19.99
 *                   duration: 30
 *                 - planId: 2
 *                   planName: "Premium Plan"
 *                   price: 49.99
 *                   duration: 30
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-plan-details/{id}:
 *   get:
 *     tags: [Contractor - Plan Management]
 *     summary: Get plan details by ID
 *     description: Retrieve the details of a specific plan by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the plan.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plan details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 planId: 1
 *                 planName: "Premium Plan"
 *                 description: "This is a premium plan offering advanced features."
 *                 price: 49.99
 *                 duration: 30
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-plan-details:
 *   post:
 *     tags: [Contractor - Plan Management]
 *     summary: Update plan details
 *     description: Update the details of an existing plan.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: integer
 *                 example: 1
 *               planName:
 *                 type: string
 *                 example: "Updated Premium Plan"
 *               description:
 *                 type: string
 *                 example: "This is an updated description for the premium plan."
 *               price:
 *                 type: number
 *                 example: 59.99
 *               duration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Plan updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Plan updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-plan/{id}:
 *   delete:
 *     tags: [Contractor - Plan Management]
 *     summary: Delete a plan by ID
 *     description: Delete a specific plan by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the plan.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plan deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Plan deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Plan not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/buy-plan-details:
 *   post:
 *     tags: [Contractor - Plan Management]
 *     summary: Buy a plan
 *     description: Purchase a plan for the contractor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: integer
 *                 example: 1
 *               paymentDetails:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 49.99
 *                   transactionId:
 *                     type: string
 *                     example: "txn_123456789"
 *     responses:
 *       200:
 *         description: Plan purchased successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Plan purchased successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor - Plan Management
 *     description: Manage and interact with plans, including buying or upgrading.
 */

/**
 * @swagger
 * /contractor/buy-upgrade-plan:
 *   post:
 *     tags: [Contractor - Plan Management]
 *     summary: Buy or upgrade a plan
 *     description: Endpoint to purchase a new plan or upgrade an existing one.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             plan_id: 4
 *             plan_duration: year
 *     responses:
 *       200:
 *         description: Plan purchased or upgraded successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Plan purchased or upgraded successfully."
 *               data:
 *                 planId: "new_plan_id"
 *                 planName: "Premium Plan"
 *                 status: "Active"
 *       400:
 *         description: Bad request. Invalid or missing plan details.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-plan", verifyContractorToken, createPlan);
Router.get("/contractor/get-all-plans", verifyContractorToken, getAllPlans);
Router.get("/contractor/get-plan-details/:id", verifyContractorToken, getPlanById);
Router.post("/contractor/update-plan-details", verifyContractorToken, updatePlanDetails);
Router.delete("/contractor/delete-plan/:id", verifyContractorToken, deletePlan);
Router.post("/contractor/buy-plan-details", buyPlan);
Router.post("/contractor/buy-upgrade-plan", verifyContractorToken, buyOrUpgradePlan);

///------------Task routes contractors --------------------------------

/**
 * @swagger
 * tags:
 *   - name: Contractor - Task Management
 *     description: Operations related to managing tasks, including task creation, updating, deletion, and comments.
 */

/**
 * @swagger
 * /contractor/create-task:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Create a new task
 *     description: Create a new task with the specified details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *                 example: "Design Homepage"
 *               description:
 *                 type: string
 *                 example: "Create the main landing page for the website."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-01"
 *               assignedTo:
 *                 type: string
 *                 example: "user_id_123"
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task created successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/create-task-category:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Create a new task category
 *     description: Create a new task category with the specified details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: "Development"
 *               description:
 *                 type: string
 *                 example: "Tasks related to development."
 *     responses:
 *       201:
 *         description: Task category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category created successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-task-category:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get all task categories
 *     description: Retrieve a list of all available task categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - categoryId: 1
 *                   categoryName: "Development"
 *                   description: "Tasks related to development."
 *                 - categoryId: 2
 *                   categoryName: "Design"
 *                   description: "Tasks related to design."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-task-category/{id}:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get task category details by ID
 *     description: Retrieve the details of a specific task category by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task category.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task category details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 categoryId: 1
 *                 categoryName: "Development"
 *                 description: "Tasks related to development."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-task-category:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update task category details
 *     description: Update the details of an existing task category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               categoryName:
 *                 type: string
 *                 example: "Updated Development"
 *               description:
 *                 type: string
 *                 example: "Updated description for the development category."
 *     responses:
 *       200:
 *         description: Task category updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-task-category/{id}:
 *   delete:
 *     tags: [Contractor - Task Management]
 *     summary: Delete a task category by ID
 *     description: Delete a specific task category by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task category.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-task-comment:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Add a comment to a task
 *     description: Add a comment to a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               comment:
 *                 type: string
 *                 example: "This task is on track."
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Comment added successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-task-comment:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update a task comment
 *     description: Update an existing comment on a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: "comment_id_456"
 *               comment:
 *                 type: string
 *                 example: "Updating the comment to reflect the current status."
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Comment updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-task-comment-details/{id}:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get task comment details by ID
 *     description: Retrieve the details of a specific task comment by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task comment.
 *         required: true
 *         schema:
 *           type: string
 *           example: "comment_id_456"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task comment details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 commentId: "comment_id_456"
 *                 taskId: "task_id_123"
 *                 comment: "This is the comment content."
 *                 createdAt: "2024-08-17T12:34:56Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task comment not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-task-lists:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get all task lists
 *     description: Retrieve a list of all tasks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task lists retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - taskId: "task_id_123"
 *                   taskName: "Design Homepage"
 *                   assignedTo: "user_id_123"
 *                   status: "In Progress"
 *                   dueDate: "2024-09-01"
 *                 - taskId: "task_id_456"
 *                   taskName: "Develop API"
 *                   assignedTo: "user_id_456"
 *                   status: "Completed"
 *                   dueDate: "2024-08-25"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-task-single-list/{id}:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get task details by ID
 *     description: Retrieve the details of a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task.
 *         required: true
 *         schema:
 *           type: string
 *           example: "task_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 taskId: "task_id_123"
 *                 taskName: "Design Homepage"
 *                 description: "Create the main landing page for the website."
 *                 assignedTo: "user_id_123"
 *                 status: "In Progress"
 *                 dueDate: "2024-09-01"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-task/{id}:
 *   delete:
 *     tags: [Contractor - Task Management]
 *     summary: Delete a task by ID
 *     description: Delete a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task.
 *         required: true
 *         schema:
 *           type: string
 *           example: "task_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-main-task-status:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update main task status
 *     description: Update the status of the main task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               status:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Task status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task status updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-task-list:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update task details
 *     description: Update the details of an existing task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               taskName:
 *                 type: string
 *                 example: "Updated Task Name"
 *               description:
 *                 type: string
 *                 example: "Updated description of the task."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-05"
 *     responses:
 *       200:
 *         description: Task details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task details updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-task", verifyContractorToken, createTask);
Router.post("/contractor/create-task-category", verifyContractorToken, createTaskCategory);
Router.get("/contractor/get-all-task-category", verifyContractorToken, getAllTaskCategory);
Router.get("/contractor/get-single-task-category/:id", verifyContractorToken, getSingleTaskCategory);
Router.post("/contractor/update-task-category", verifyContractorToken, updateTaskCategoryDetails);
Router.delete("/contractor/delete-task-category/:id", verifyContractorToken, removeTaskCategoryById);
Router.post("/contractor/add-task-comment", verifyContractorToken, createTaskComment);
Router.post("/contractor/update-task-comment", verifyContractorToken, updateTaskComment);
Router.get("/contractor/get-task-comment-details/:id", verifyContractorToken, getTaskCommentDetailsById);
Router.get("/contractor/get-task-lists", verifyContractorToken, getAllTaskList);
Router.get("/contractor/get-task-single-list/:id", verifyContractorToken, getTaskById);
Router.delete("/contractor/delete-task/:id", verifyContractorToken, deleteTask);
Router.post("/contractor/update-main-task-status", verifyContractorToken, updateMainTaskStatus);
Router.post("/contractor/update-task-list", verifyContractorToken, updateTaskDetails);

//messages

/**
 * @swagger
 * tags:
 *   - name: Contractor - Messaging
 *     description: Operations related to messaging, including sending messages, retrieving messages, and managing chat participants.
 */

/**
 * @swagger
 * /contractor/send-messages:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Send a message
 *     description: Send a new message to a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: "user_id_123"
 *               messageContent:
 *                 type: string
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Message sent successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-messages:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Get all messages
 *     description: Retrieve all messages for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - messageId: "msg_id_1"
 *                   senderId: "user_id_456"
 *                   messageContent: "Hello, are you there?"
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - messageId: "msg_id_2"
 *                   senderId: "user_id_789"
 *                   messageContent: "Meeting at 3 PM."
 *                   timestamp: "2024-08-17T11:00:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-sender-messages/{id}:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Get all messages from a single sender
 *     description: Retrieve all messages sent by a specific sender.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the sender.
 *         required: true
 *         schema:
 *           type: string
 *           example: "user_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - messageId: "msg_id_1"
 *                   senderId: "user_id_123"
 *                   messageContent: "Hello, are you there?"
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - messageId: "msg_id_2"
 *                   senderId: "user_id_123"
 *                   messageContent: "Just checking in."
 *                   timestamp: "2024-08-17T10:30:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Sender not found or no messages found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-new-user-to-chat:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Add a new user to chat
 *     description: Add a new user to the chat, initiating a conversation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User added to chat successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "User added to chat successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/start-chat-to-new-user/{id}:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Start chat with a new user
 *     description: Start a chat with a new user by sending the first message.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the recipient.
 *         required: true
 *         schema:
 *           type: string
 *           example: "user_id_456"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageContent:
 *                 type: string
 *                 example: "Hi, I would like to discuss a new project."
 *     responses:
 *       201:
 *         description: Chat started and message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Chat started and message sent successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Recipient not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-total-unread-messages:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Get total unread messages
 *     description: Retrieve the total number of unread messages for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total unread messages retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 totalUnreadMessages: 5
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-all-messages-read:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Mark all messages as read
 *     description: Mark all messages for the logged-in user as read.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All messages marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "All messages marked as read successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/sender-messages-mark-read/{id}:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Mark all messages from a specific sender as read
 *     description: Mark all messages from a specific sender as read.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the sender.
 *         required: true
 *         schema:
 *           type: string
 *           example: "user_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All messages from the sender marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "All messages from the sender marked as read successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Sender not found or no messages found.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/send-messages", verifyContractorToken, sendMessage);
Router.get("/contractor/get-messages", verifyContractorToken, getMessages);
Router.get("/contractor/get-single-sender-messages/:id", verifyContractorToken, getSenderAllMessages);
Router.get("/contractor/add-new-user-to-chat", verifyContractorToken, addNewUserToChat);
Router.post("/contractor/start-chat-to-new-user/:id", verifyContractorToken, startChatWithNewUser);
Router.get("/contractor/get-total-unread-messages", verifyContractorToken, getTotalUnreadMessages);
Router.post("/contractor/mark-all-messages-read", verifyContractorToken, markAllMessagesRead);
Router.post("/contractor/sender-messages-mark-read/:id", verifyContractorToken, markReadSenderAllMessages);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Notifications
 *     description: Operations related to managing and retrieving notifications.
 */

/**
 * @swagger
 * /contractor/get-all-notifications:
 *   get:
 *     tags: [Contractor - Notifications]
 *     summary: Get all notifications
 *     description: Retrieve all notifications available in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - notificationId: "notif_id_1"
 *                   title: "New Policy Update"
 *                   message: "Please review the updated policy document."
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - notificationId: "notif_id_2"
 *                   title: "System Maintenance"
 *                   message: "Scheduled maintenance will occur at midnight."
 *                   timestamp: "2024-08-17T12:00:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-logged-user-notifications:
 *   get:
 *     tags: [Contractor - Notifications]
 *     summary: Get logged-in user's notifications
 *     description: Retrieve notifications specific to the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - notificationId: "notif_id_1"
 *                   title: "Your Leave Request Approved"
 *                   message: "Your leave request for 24th August has been approved."
 *                   timestamp: "2024-08-17T09:00:00Z"
 *                 - notificationId: "notif_id_2"
 *                   title: "New Task Assigned"
 *                   message: "You have been assigned a new task: Project XYZ."
 *                   timestamp: "2024-08-17T11:30:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/count-logged-user-unread-notifications:
 *   get:
 *     tags: [Contractor - Notifications]
 *     summary: Count unread notifications for logged-in user
 *     description: Retrieve the count of unread notifications specific to the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notifications count retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 unreadNotificationsCount: 3
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-as-read-notifications:
 *   post:
 *     tags: [Contractor - Notifications]
 *     summary: Mark notifications as read
 *     description: Mark specific notifications as read for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["notif_id_1", "notif_id_2"]
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Notifications marked as read successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/get-all-notifications", verifyContractorToken, getNotifications);
Router.get("/contractor/get-logged-user-notifications", verifyContractorToken, getLoggedUserNotifications);
Router.get(
    "/contractor/count-logged-user-unread-notifications",
    verifyContractorToken,
    countLoggedUserUnreadNotifications
);
Router.post("/contractor/mark-as-read-notifications", verifyContractorToken, markAsReadNotifications);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Feedback & Suggestions
 *     description: Routes for managing feedback and suggestions.
 *   - name: Contractor - Users Without Team
 *     description: Operations related to users not yet assigned to any team.
 */

/**
 * @swagger
 * /contractor/feedback-and-suggestions:
 *   get:
 *     tags: [Contractor - Feedback & Suggestions]
 *     summary: Get all feedback and suggestions
 *     description: Retrieve all feedback and suggestions provided by users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback and suggestions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - feedbackId: "fb_1"
 *                   userId: "user_123"
 *                   feedback: "It would be great to have more flexible working hours."
 *                   suggestion: "Consider implementing a remote work policy."
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - feedbackId: "fb_2"
 *                   userId: "user_456"
 *                   feedback: "The new system update is very helpful."
 *                   suggestion: "Add a dark mode feature."
 *                   timestamp: "2024-08-17T12:00:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-users-list-without-team:
 *   get:
 *     tags: [Contractor - Users Without Team]
 *     summary: Get users without a team
 *     description: Retrieve a list of users who are not assigned to any team.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users without a team retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: "user_123"
 *                   name: "John Doe"
 *                   email: "johndoe@example.com"
 *                   role: "Software Engineer"
 *                 - userId: "user_456"
 *                   name: "Jane Smith"
 *                   email: "janesmith@example.com"
 *                   role: "Product Manager"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/feedback-and-suggestions", verifyContractorToken, getAllFeedbackAndSuggestions);
Router.get("/contractor/get-users-list-without-team", verifyContractorToken, getMemberListWithoutTeam);

//---pupose master ---

/**
 * @swagger
 * tags:
 *   - name: Contractor - Purpose Master
 *     description: Manage purpose master entries.
 *   - name: Contractor - Task Dashboard
 *     description: Task status and dashboard information.
 */

/**
 * @swagger
 * /contractor/create-purpose-master:
 *   post:
 *     tags: [Contractor - Purpose Master]
 *     summary: Create a new purpose master entry
 *     description: Adds a new purpose master entry to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purposeName:
 *                 type: string
 *                 example: "Team Meeting"
 *               description:
 *                 type: string
 *                 example: "Purpose for regular team meetings"
 *     responses:
 *       201:
 *         description: Purpose master entry created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purpose master entry created successfully."
 *       400:
 *         description: Bad request. Missing required fields.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-purpose-master:
 *   get:
 *     tags: [Contractor - Purpose Master]
 *     summary: Get all purpose master entries
 *     description: Retrieve all purpose master entries.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purpose master entries retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: "pm_001"
 *                   purposeName: "Team Meeting"
 *                   description: "Purpose for regular team meetings"
 *                 - id: "pm_002"
 *                   purposeName: "Client Presentation"
 *                   description: "Purpose for client presentations"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-purpose-master/{id}:
 *   get:
 *     tags: [Contractor - Purpose Master]
 *     summary: Get single purpose master entry by ID
 *     description: Retrieve details of a specific purpose master entry by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the purpose master entry
 *     responses:
 *       200:
 *         description: Purpose master entry retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: "pm_001"
 *                 purposeName: "Team Meeting"
 *                 description: "Purpose for regular team meetings"
 *       404:
 *         description: Not found. Purpose master entry not found.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-purpose-master:
 *   post:
 *     tags: [Contractor - Purpose Master]
 *     summary: Update purpose master entry
 *     description: Update an existing purpose master entry.
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
 *                 example: "pm_001"
 *               purposeName:
 *                 type: string
 *                 example: "Updated Team Meeting"
 *               description:
 *                 type: string
 *                 example: "Updated description for team meetings"
 *     responses:
 *       200:
 *         description: Purpose master entry updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purpose master entry updated successfully."
 *       400:
 *         description: Bad request. Missing or invalid fields.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Purpose master entry not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-purpose-master/{id}:
 *   delete:
 *     tags: [Contractor - Purpose Master]
 *     summary: Delete purpose master entry
 *     description: Delete a purpose master entry by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the purpose master entry to delete
 *     responses:
 *       200:
 *         description: Purpose master entry deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purpose master entry deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Purpose master entry not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-task-status-for-dashboard:
 *   get:
 *     tags: [Contractor - Task Dashboard]
 *     summary: Get task status for dashboard
 *     description: Retrieve task status for the contractor dashboard.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 totalTasks: 100
 *                 completedTasks: 80
 *                 pendingTasks: 15
 *                 overdueTasks: 5
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-task-by-status:
 *   get:
 *     tags: [Contractor - Task Dashboard]
 *     summary: Get all tasks by status
 *     description: Retrieve all tasks filtered by status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - taskId: "task_001"
 *                   title: "Design the new website"
 *                   status: "Completed"
 *                 - taskId: "task_002"
 *                   title: "Client presentation preparation"
 *                   status: "Pending"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/create-purpose-master", verifyContractorToken, createPurposeMaster);
Router.get("/contractor/get-all-purpose-master", verifyContractorToken, getAllPurposeMaster);
Router.get("/contractor/get-single-purpose-master/:id", verifyContractorToken, getSinglePurposeMasterById);
Router.post("/contractor/update-purpose-master", verifyContractorToken, updatePurposeMaster);
Router.delete("/contractor/delete-purpose-master/:id", verifyContractorToken, deletePurposeMasterById);
Router.get("/contractor/get-task-status-for-dashboard", verifyContractorToken, taskDashboard);
Router.get("/contractor/get-all-task-by-status", verifyContractorToken, getAllTaskByStatus);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Zone Management
 *     description: Manage and retrieve information about zones.
 */

/**
 * @swagger
 * /contractor/all-active-zone:
 *   get:
 *     tags: [Contractor - Zone Management]
 *     summary: Get all active zones
 *     description: Retrieve a list of all active zones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active zones retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: "zone_001"
 *                   name: "North Zone"
 *                   status: "Active"
 *                 - id: "zone_002"
 *                   name: "South Zone"
 *                   status: "Active"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/all-active-zone", verifyContractorToken, getAllActiveZones);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Banking and Wallet Management
 *     description: Manage bank account details, transactions, and wallet balances for contractors.
 */

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
 * /contractor/add-wallet-amount:
 *   post:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Add amount to wallet
 *     description: Endpoint to add an amount to the contractor's wallet linked with a bank account.
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
 *                 description: The ID of the bank account to which the amount should be added.
 *               amount:
 *                 type: number
 *                 description: The amount to add to the wallet.
 *             required:
 *               - accountId
 *               - amount
 *     responses:
 *       200:
 *         description: Amount added to wallet successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Amount added to wallet successfully."
 *       400:
 *         description: Bad request. Invalid or missing amount or account ID.
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

/**
 * @swagger
 * /contractor/get-transaction-list:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get list of all transactions
 *     description: Retrieve a list of all transactions across all accounts.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction list retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
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
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-bank-balance/{bankId}/{id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get bank balance
 *     description: Retrieve the current balance for a specific bank account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         description: The ID of the bank.
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank account.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank balance retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               balance: 1500.00
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/select-bank-account-number-balance/{id}/{bankId}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Select bank account number and balance
 *     description: Retrieve the account number and balance for a specific bank account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank account.
 *         schema:
 *           type: string
 *       - in: path
 *         name: bankId
 *         required: true
 *         description: The ID of the bank.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank account number and balance retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               accountNumber: "9876543210"
 *               balance: 1500.00
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-bank-to-account/{id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get bank to account details
 *     description: Retrieve details of a bank to account relationship.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank account.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank to account details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               accountId: "12345"
 *               bankName: "ABC Bank"
 *               accountNumber: "9876543210"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Not found. Bank account not found with the provided ID.
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
 * /contractor/get-bank-to-all-accounts-transaction-via-stock/{id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get bank to all accounts transaction via stock
 *     description: Retrieve all transaction details for a bank across all associated accounts, specifically for stock-related transactions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank to all accounts transaction via stock details retrieved successfully.
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
 * /contractor/get-last-balance-of-employee/{employeeId}?:
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

/**
 * @swagger
 * /contractor/get-expense-transaction/{user_id}:
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

/**
 * @swagger
 * /contractor/get-user-wallet-details/{user_id}:
 *   get:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Get user wallet details
 *     description: Retrieve the details of a user's wallet, including balance and recent transactions.
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
 *         description: User wallet details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               walletBalance: 500.00
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
 *         description: Not found. User wallet or transactions not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */
Router.post("/contractor/add-bank-account-details", verifyContractorToken, addAccountDetails);
Router.get("/contractor/get-all-account-details", verifyContractorToken, getAllAccountsDetails);
Router.get("/contractor/account-details-by-id/:id", verifyContractorToken, accountDetailsbyId);
Router.post("/contractor/update-account-details", verifyContractorToken, updateAccountDetails);
Router.delete("/contractor/delete-account-details/:id", verifyContractorToken, deleteAccountDetails);
Router.post("/contractor/add-wallet-amount", verifyContractorToken, addAmountToBankAccount);
Router.get("/contractor/get-account-transaction-history/:id", verifyContractorToken, getTransactionByUser);
Router.get("/contractor/get-transaction-list", verifyContractorToken, transactionList);
Router.get("/contractor/get-bank-balance/:bankId/:id", verifyContractorToken, getBankBalance);
Router.get(
    "/contractor/select-bank-account-number-balance/:id/:bankId",
    verifyContractorToken,
    bankAccountNumbertoBalance
);
Router.get("/contractor/get-bank-to-account/:id", verifyContractorToken, getBankToAccount);
Router.get("/contractor/get-bank-to-all-accounts-transaction/:id/:type", verifyContractorToken, getBankTransactions);
Router.get(
    "/contractor/get-bank-to-all-accounts-transaction-via-stock/:id",
    verifyContractorToken,
    getBankTransactionsForStock
);
Router.get("/contractor/get-check-last-balance/:bankId", verifyContractorToken, checklastBalanceOfWallets);
Router.get(
    "/contractor/get-check-last-balance-of-employee/:employeeId",
    verifyContractorToken,
    checkLastBalanceOfEmployee
);
Router.get(
    "/contractor/get-last-balance-of-employee/:employeeId?",
    verifyContractorToken,
    lastBalanceOfEmployeeInExpense
);
Router.get("/contractor/get-expense-transaction/:user_id", verifyContractorToken, getUserExpenseTransaction);
Router.get("/contractor/get-user-wallet-details/:user_id", verifyContractorToken, getUserWalletDetails);

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
 * /contractor/rescheduled-transfer-fund/{id}/{rescheduled_date}:
 *   post:
 *     tags: [Contractor - Banking and Wallet Management]
 *     summary: Reschedule transfer fund
 *     description: Reschedule a previously planned fund transfer to a new date.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the fund transfer.
 *         schema:
 *           type: string
 *       - in: path
 *         name: rescheduled_date
 *         required: true
 *         description: The new date for the fund transfer.
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Fund transfer rescheduled successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Fund transfer rescheduled successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       400:
 *         description: Bad request. Invalid transfer ID or date.
 *       404:
 *         description: Not found. Fund transfer not found with the provided ID.
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
Router.post("/contractor/transfer-fund", verifyContractorToken, transferFundAmount);
Router.post(
    "/contractor/rescheduled-transfer-fund/:id/:rescheduled_date",
    verifyContractorToken,
    rescheduledTransferFund
);
Router.get("/contractor/rescheduled-transfer-fund", verifyContractorToken, reschduleTransferFund);

/**
 * @swagger
 * tags:
 *   name: Contractor - Sales and Regional Management
 *   description: API routes related to sales areas, regional offices, and outlets for contractors.
 */

/**
 * @swagger
 * /contractor/sales-area:
 *   get:
 *     tags: [Contractor - Sales and Regional Management]
 *     summary: Get all sales areas
 *     description: Retrieve a list of all sales areas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales areas retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               salesAreas:
 *                 - id: "area123"
 *                   name: "North Zone"
 *                   isActive: true
 *                 - id: "area124"
 *                   name: "South Zone"
 *                   isActive: true
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/active-sales-area:
 *   get:
 *     tags: [Contractor - Sales and Regional Management]
 *     summary: Get active sales areas
 *     description: Retrieve a list of active sales areas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active sales areas retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               activeSalesAreas:
 *                 - id: "area123"
 *                   name: "North Zone"
 *                   isActive: true
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-regional-offices:
 *   get:
 *     tags: [Contractor - Sales and Regional Management]
 *     summary: Get all regional offices
 *     description: Retrieve a list of all regional offices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regional offices retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               regionalOffices:
 *                 - id: "office123"
 *                   name: "North Regional Office"
 *                 - id: "office124"
 *                   name: "South Regional Office"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-outlets:
 *   get:
 *     tags: [Contractor - Sales and Regional Management]
 *     summary: Get all outlets
 *     description: Retrieve a list of all outlets.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               outlets:
 *                 - id: "outlet123"
 *                   name: "Outlet 1"
 *                   region: "North Zone"
 *                 - id: "outlet124"
 *                   name: "Outlet 2"
 *                   region: "South Zone"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/contractor/sales-area", verifyContractorToken, getSalesArea);
Router.get("/contractor/active-sales-area", verifyContractorToken, getActiveSalesArea);
Router.get("/contractor/all-regional-offices", verifyContractorToken, getAllRegionalOffices);
Router.get("/contractor/all-outlets", verifyContractorToken, getAllOutlet);

/**
 * @swagger
 * tags:
 *   name: Contractor - Allowances and Deductions Management
 *   description: API routes related to managing allowances and deductions for contractors.
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
Router.post("/contractor/create-allowances", verifyContractorToken, createAllowances);
Router.post("/contractor/create-deductions", verifyContractorToken, createDeductionsType);

/**
 * @swagger
 * tags:
 *   name: Contractor - Payroll Master Settings
 *   description: API routes related to managing payroll master settings for contractors.
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
Router.post("/contractor/update-payroll-master-settings", verifyContractorToken, updatePayrollSettings);
Router.post("/contractor/update-payroll-master-settings-label", verifyContractorToken, updatePayrollSettingLabel);
Router.post("/contractor/create-new-payroll-settings", verifyContractorToken, addPayrollMasterSettingLabel);

/**
 * @swagger
 * tags:
 *   name: Contractor - Location
 *   description: API routes for retrieving country, state, and city information.
 */

/**
 * @swagger
 * /get-all-countries:
 *   get:
 *     tags: [Contractor - Location]
 *     summary: Get all countries
 *     description: Retrieve a list of all countries.
 *     responses:
 *       200:
 *         description: List of countries retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               countries:
 *                 - id: "1"
 *                   name: "United States"
 *                 - id: "2"
 *                   name: "Canada"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /get-states/{id}:
 *   get:
 *     tags: [Contractor - Location]
 *     summary: Get states by country ID
 *     description: Retrieve a list of states for a given country ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the country.
 *     responses:
 *       200:
 *         description: List of states retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               states:
 *                 - id: "1"
 *                   name: "California"
 *                 - id: "2"
 *                   name: "Texas"
 *       400:
 *         description: Bad request. Invalid country ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /get-cities/{id}:
 *   get:
 *     tags: [Contractor - Location]
 *     summary: Get cities by state ID
 *     description: Retrieve a list of cities for a given state ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the state.
 *     responses:
 *       200:
 *         description: List of cities retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               cities:
 *                 - id: "1"
 *                   name: "Los Angeles"
 *                 - id: "2"
 *                   name: "San Francisco"
 *       400:
 *         description: Bad request. Invalid state ID.
 *       500:
 *         description: Internal server error.
 */
Router.get("/get-all-countries", allCountries);
Router.get("/get-states/:id", getStates);
Router.get("/get-cities/:id", allCities);

// dealer login API

/**
 * @swagger
 * tags:
 *   name: Dealer Routes - Login
 *   description: API routes for dealer login operations.
 */

/**
 * @swagger
 * /dealer/login-admin:
 *   post:
 *     tags: [Dealer Routes - Login]
 *     summary: Dealer admin login
 *     description: Authenticate dealer admin and provide access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: dealer@hotmail.com
 *             password: strongpassword
 *     responses:
 *       200:
 *         description: Login successful. Returns an access token.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
Router.post("/dealer/login-admin", adminLogin);

/**
 * @swagger
 * tags:
 *   name: Contractor - Sidebar Modules
 *   description: API routes for fetching sidebar modules.
 */

/**
 * @swagger
 * /contractor/get-all-sidebar-modules:
 *   get:
 *     tags: [Contractor - Sidebar Modules]
 *     summary: Get all sidebar modules
 *     description: Retrieve a list of all sidebar modules available to the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all sidebar modules.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               modules:
 *                 - id: 1
 *                   name: Dashboard
 *                   icon: dashboard-icon
 *                 - id: 2
 *                   name: Tasks
 *                   icon: tasks-icon
 *                 - id: 3
 *                   name: Messages
 *                   icon: messages-icon
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
Router.get("/super-admin/get-all-sidebar-modules", verifyContractorToken, getAllSideBarModules);

/** all sub category crud routes*/
Router.post("/contractor/add-sub-category", verifyContractorToken, addSubCategory);
Router.post("/contractor/edit-sub-category", verifyContractorToken, updateSubCategory);
Router.get("/contractor/get-all-sub-category", verifyContractorToken, subCategoryList);
Router.get("/contractor/get-sub-category-by-id/:id", verifyContractorToken, subCategoryById);
Router.delete("/contractor/delete-sub-category/:id", verifyContractorToken, deleteSubCategory);
module.exports = Router;

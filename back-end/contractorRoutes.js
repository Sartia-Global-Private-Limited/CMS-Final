const express = require("express");
const {
    PERMISSIONS: { CREATE, VIEW, UPDATE, DELETE },
    getAllClientAndVendorCompanies,
} = require("./helpers/commonHelper");
/** * validation helper  */

const { verifyContractorToken, verifySuperAdminToken, sideBarPermissionCheck } = require("./helpers/verifyToken");

const {
    getAllActiveEnergyCompany,
    createEnergyTeam,
    updateEnergyTeam,
    getEnergyTeamDetailsById,
    deleteEnergyTeam,
    getEnergyCompanySubSidiaries,
} = require("./controllers/energyCompanyController");
const { getEnergyCompanyAssignZones } = require("./controllers/zoneController");
const {
    getRegionalOfficesOnZoneId,
    getRegionalOfficersOnRo,
    getAllRegionalOfficers,
} = require("./controllers/regionalOfficeController");
const { getSaleAreaOnRoId } = require("./controllers/salesAreaController");
const { getAllDistrictBySaleAreaId } = require("./controllers/districtController");
const {
    getOutletByDistrictId,
    getOutletByEnergyCompanyId,
    getAllOutletForDropdown,
    addOutlet,
    getAllOutlet,
    editOutlet,
    updateOutlet,
    removeOutletById,
    getOutletBySalesId,
    approveRejectOutletByStatus,
    getOutletById,
    importOutlet,
} = require("./controllers/outletController");
const { getAllComplaintSubTypes } = require("./controllers/complaintSubTypeController");
/** * user controller  */
const {
    getAllUsers,
    getUserById,
    getEndUserManagerAndSupervisor,
    getAllSupervisorUsers,
    getAllDealerUsers,
    getAllAdmins,
    getDealerById,
    getAllUsersForExpenses,
} = require("./controllers/userController");

const {
    createRole,
    getAllRoles,
    editRole,
    updateRole,
    deleteRole,
    getAllRolesForDropdown,
} = require("./controllers/roleController");
const {
    getComplaintFullTimeline,
    getTotalFreeEndUsers,
    assignedComplaintToUsers,
    getManagerFreeTeamMember,
    countTotalMemberOnSingleComplaint,
    complaintStatusChanged,
    getAllComplaintListForDropdown,
    getUserByComplaintId,
    updateAssignedComplaintToUsers,
    rejectedAssignComplaintToUsers,
} = require("./controllers/contractorComplaintController");
const {
    createItemMaster,
    getAllItemMasters,
    getSingleItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getItemPriceByBrand,
} = require("./controllers/itemMasterController");
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
} = require("./controllers/fundRequestController");

const { createItem, updateItem, getAllItems, deleteItem, getItemById } = require("./controllers/itemController");

const {
    createQuotation,
    getQuotation,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    sendEmailQuotation,
    approveOrRejectQuotationsById,
} = require("./controllers/quotationController");

const {
    createSuppliers,
    getSuppliers,
    getSuppliersById,
    updateSuppliers,
    deleteSuppliers,
    approveOrRejectSuppliersById,
} = require("./controllers/suppliersController");

const {
    createFinancialYears,
    updateFinancialYearById,
    fetchAllFinancialYears,
    fetchFinancialYearById,
    deleteFinancialYearById,
} = require("./controllers/financialYearController");

const {
    createUnitData,
    updateUnitDataById,
    getAllUnitData,
    getUnitDataById,
    deleteUnitDataById,
    getAllUnitDataForDropdown,
} = require("./controllers/unitController");

const {
    createBillingType,
    getAllBillingTypes,
    getBillingTypesById,
    updateBillingType,
    removeBillingTypeById,
} = require("./controllers/billingTypeController");

const {
    createTaxDetails,
    getAllTaxes,
    getTaxesDetailById,
    updateTaxDetails,
    removeTaxById,
} = require("./controllers/taxController");

const {
    createInvoiceData,
    updateInvoiceData,
    getAllInvoices,
    getInvoiceDetailById,
    deleteInvoiceData,
    mergeInvoice,
    getAllMergedInvoices,
    discardInvoice,
    getMergedInvoiceDetailById,
    discardMergedInvoice,
    getAllPOForInvoices,
    getAllROForInvoices,
    getAllBillNumberForInvoice,
    fromBillingToCompanyInInvoice,
    getAllInvoicesListingInPayments,
    getMergedInvoiceDetailByIds,
    getAllComplaintViaInvoice,
    getRegionalOfficeInPaidPayment,
    getAreaManagerInPaidPayment,
    getAllComplaintViaInvoiceById,
    getAllComplaintViaInvoiceForRo,
    getPoNumberInPaidPayment,
    getAllSalesAreaForInvoices,
    getAllBillingFromCompany,
    getAllComplaintTypesForInvoices,
} = require("./controllers/invoiceController");

const {
    stockRequestSave,
    getAllStockRequests,
    getStockRequestsDetailsById,
    stockRequestDetailsUpdate,
    deleteStockRequest,
    updateStockRequestStatus,
    getStockDetailsOnItemId,
    getAllApprovedStockRequests,
    getAllRejectedStockRequests,
    transferStock,
    getSupplier,
    stocksAmountTransfer,
    rescheduledTransferstock,
    getAllPendingStockTransfer,
    getAllPreviousPriceOfStocks,
    getStockTransfer,
    getAllStockTransfer,
    rejectStockRequest,
    reActiveToRejectedStockRequest,
    getLastThreePrevPriceInStocks,
    getAllhistoryByToday,
    getAllStocksRequests,
    getSupplierTransactions,
    getAllOldItemInStocks,
    updateBillNumber,
    getLastThreePrevPriceBySuppliers,
    getRescheduleTransferStock,
} = require("./controllers/stockRequestController");

const {
    createPurchaseOrder,
    getAllGeneratedPurchaseOrder,
    getPurchaseOrderDetailsById,
    updatePurchaseOrderDetails,
    deletePurchaseOrder,
    checkPONumberIsAlreadyExists,
    getPoListOnRoId,
    getIncludePercentage,
    getAllGstType,
    changePoStatus,
    getPurchaseOrderItemsOnPo,
    downloadCsvFile,
    getRoForPurchaseOrder,
    getPoNumberForPurchaseOrder,
    approveAndUpdatePurchaseOrder,
    getSecurityUniqueId,
    approvePurchaseOrder,
} = require("./controllers/purchaseOrderController");

const {
    createMeasurement,
    getAllCreatedMeasurements,
    getMeasurementsDetailsById,
    updateMeasurementDetails,
    deleteMeasurementDetails,
    measurementDetailsWithPoAndComplaint,
    ItemsOnMeasurementId,
    getAllComplaintsFromSite,
    discardMeasurementDetails,
    getAllDiscardMeasurements,
    getDiscardMeasurementsDetailsById,
    getResolvedComplaintsInBilling,
    getAttachmentAndInspectionDetails,
    getAllMeasurements,
    getAllMeasurementsBasedOnStatus,
    // saveIntoDraftMeasurement,
    getOutletByIdForPtm,
    getRegionalByIdForPtm,
    getOrderByIdForPtm,
    getOutletByIdInsideBilling,
    getSalesByIdInsideBilling,
    getRegionalByIdInsideBilling,
    getSaleByIdNewForPtm,
    getAllOrderByForMeasurements,
    discardToReactiveMeasurement,
    getSimilarPurchaseOrders,
    measurementDetailsWithPo,
    getMeasurementsTimeLineDetailsById,
    getAllPoItem,
    updatePoInMeasurementDetails,
    getComplaintTypes,
    getCompanyInBilling,
    getCompaniesForPtm,
    getCompaniesInsideBilling,
    getComplaintTypesInsideBilling,
    getPoInsideBilling,
} = require("./controllers/measurementController");

const {
    getAllCompanyForDropdown,
    getCompanyDetailsById,
    getComplaintName,
    bulkInsertExcelData,
} = require("./controllers/companyController");
const { getAllRegionalOfficeForDropdown } = require("./controllers/regionalOfficeController");
const {
    getAllStateForDropdown,
    getAllPurchaseOrder,
    getComplaintType,
    getOutletBySaleArea,
    uploadImageWithWaterMark,
    convertBase64Image,
} = require("./controllers/commonController");

const {
    generateProformaInvoice,
    getAllProformaInvoices,
    getProformaInvoicesDetailsById,
    updateProformaInvoiceDetails,
    deleteProformaInvoices,
    getAllProformaInvoiceOnPoId,
    multiComplaints,
    getAllPOFilters,
    getAllMeasurementsInPIStatus,
    getAllROBasedOnPo,
    getAllROBasedOnComplaint,
    getAllROFromProforma,
    getAllPOForProforma,
    getAllBillNumberFromProforma,
    getSamePoExistsOrNot,
    changePoInMeasurements,
    discardProformaInvoices,
    reactiveToDiscardPi,
    roToBillingFromCompany,
    fromBillingToCompany,
    getMergedPiList,
    discardMergedPI,
    mergedPi,
    getAllProformaInvoicesInMergedPI,
    getMergedPerfomaInvoiceById,
    getAllComplaintsInPI,
    getAllProformaInvoice,
    getAllMergedProformaInvoice,
    getMergedProformaInvoicesDetailsById,
    getAllProformaInvoicesInInvoice,
    getPiList,
    getSABasedOnRo,
    getAreaManagerForDropdown,
    getSalesAreaBasedOnRo,
    getAllSalesAreaFromProforma,
    getOutletBasedOnSalesArea,
    getFinancialYearFromProforma,
    getComplaintTypesFilter,
    getComplaintTypeFromProforma,
    getAllOutletFromProforma,
} = require("./controllers/proformaInvoiceController");

const { mergePItoInvoice } = require("./controllers/mergeInvoiceController");

const {
    addSecurityMoney,
    getAllSecurityMoney,
    getSecurityMoneyDetailById,
    updateSecurityMoney,
    deleteSecurityMoneyDetailById,
} = require("./controllers/securityMoneyController");

const {
    createCategory,
    getAllCategory,
    getCategoryDetailById,
    updateCategory,
    deleteCategoryById,
} = require("./controllers/categoryController");

const {
    addProduct,
    getAllProducts,
    getProductDetailById,
    updateProduct,
    removedProductById,
    publishedProduct,
} = require("./controllers/productController");

const {
    requestCash,
    getAllLoggedUserCashRequested,
    getCashRequestedDetailById,
    updatedRequestedCashDetail,
    deleteRequestedCashDetail,
    cashRequestStatusAction,
    getAllCashRequestedList,
    getAllApprovedCashRequest,
    getAllRejectedCashRequest,
} = require("./controllers/cashRequestController");

const {
    addPaymentMethod,
    getAllMethods,
    deleteMethod,
    getMethodDetailById,
    updatePaymentMethod,
    getAllMethodsForDropdown,
} = require("./controllers/paymentMethodController");

const {
    addExpenseCategory,
    getExpenseCategory,
    deleteExpenseCategory,
    updateExpenseCategory,
    fetchExpenseCategory,
    getExpenseCategoryForDropdown,
} = require("./controllers/expenseCategoryController");

const {
    addExpenses,
    getLoggedUserAllExpenses,
    getExpensesDetailById,
    updateExpenses,
    deleteExpense,
    expenseApproveReject,
    viewRequestedExpenses,
    getExpenseRequest,
    getExpenseRequestById,
    itemsMasterToApprovePrice,
} = require("./controllers/expenseController");

const { getUserAllTransaction } = require("./controllers/transactionController");

const {
    userWalletBalance,
    userTransactionMonthlyReport,
    cashRequestTracked,
    userTransactionHistory,
    getUserAssetAndFundMonthlyReport,
    addFundtoUser,
} = require("./controllers/fundManagementController");

const {
    requestItems,
    getAllRequestedItemList,
    getRequestedItemDetailById,
    updateRequestItemsDetails,
    deleteRequestedItemById,
    requestStatusChanged,
    getAllApprovedRequestedItemList,
    getAllRejectedRequestedItemList,
    approvedItemRequestAssignTo,
    getApprovedRequestDetailById,
} = require("./controllers/itemRequestController");

const {
    getAllComplaintList,
    getComplaintDetailById,
    getOutletDetails,
    getFreeEndUsers,
    createEarthingTesting,
    getAllEarthingTestingLists,
    getEarthingTestingDetailById,
    updateEarthingTesting,
    changeEarthingTestingStatus,
    approveRejectEarthingTestingsByStatus,
    assignToEarthingTesting,
    earthPitReport,
    getEarthPitreport,
} = require("./controllers/earthingTestingController");

const {
    getAllSaleAreaAndOutlet,
    getOutletComplaints,
    getApprovedUsedItemsOnComplaint,
    getPendingUsedItemsOnComplaint,
    approvedUsedItems,
    getAllApprovedExpenseList,
    approvedExpensesFromOffice,
    getAllApprovedOfficeExpenseList,
    getAllSaleAreaList,
    assignApprovedItems,
    assignApprovedExpense,
    getAllStockPunchedList,
    getSingleStockPunchedDetails,
    approvedPunchedStockDetails,
    assignApprovedItemStock,
    getAllOutletsWithComplaints,
    getAllOutletsWithComplaintsById,
    approveOfficeInspections,
    getAllOutletsWithComplaintsApproved,
    getAllOutletsWithComplaintsByApprovedId,
    getAllOutletsWithComplaintsPartial,
    getAllOutletsWithComplaintsByPartialId,
    getOutletOfficeById,
    getSalesAreaOfficeById,
    getRegionalOfficeExpenseById,
    getAllOutletsWithComplaintsForFunds,
    getAllOutletsWithComplaintsForFundsById,
    getAllOutletsWithComplaintsPartialForFunds,
    approveOfficeInspectionsForFund,
    getAllOutletsWithComplaintsApprovedForFund,
    getAllOutletsWithComplaintsForFundByApprovedId,
    getAllOutletsWithComplaintsForFundByPartialId,
    getRegionalOfficeExpenseByIdForFund,
    getSalesAreaOfficeByIdForFund,
    getOutletOfficeByIdForFund,
    getComplaintIdToDetails,
    getAllApprovedData,
    employeeHistoryWithComplaints,
} = require("./controllers/officeInspectionController");

const {
    verifiedUsedItems,
    getAllVerifiedComplaintItems,
    verifiedExpensesFromSite,
    getAllVerifiedSiteExpenseList,
    assignComplaints,
    approveSiteInspections,
    getAllSiteInspectionPartial,
    getAllSiteInspectionApproved,
    getAllSiteInspection,
    getAllSiteInspectionById,
    getAllSiteInspectionPartialById,
    getAllSiteInspectionApprovedById,
    getAllOutletsWithComplaintsSiteForFunds,
    getOutletsWithComplaintsSiteForFundsById,
    getAllApprovedOutletsWithComplaintsSiteForFunds,
    getAllPendingOutletsWithComplaintsSiteForFunds,
    getApprovedOutletsSiteForFundsById,
    getPartialOutletsSiteForFundsById,
    approveSiteInspectionsForFund,
    assignComplaintsForFundSite,
} = require("./controllers/siteInspectionController");

const {
    assignSiteInspectionComplaintModule,
    getSiteInspectionAssignComplaintModuleOnUserId,
    assignMultipleSiteInspectionComplaintModule,
} = require("./controllers/assignSiteInspectionComplaintModuleController");

const { importBankDetailData, getSpecificColumnValueFromCsv } = require("./controllers/importDataController");

const {
    getAllBankList,
    addBankDetails,
    bankList,
    bankDetailsById,
    updateBankDetails,
} = require("./controllers/bankController");

const {
    assignComplaintModule,
    getAssignComplaintModuleOnUserId,
    assignMultipleComplaintModule,
} = require("./controllers/assignComplaintModuleController");

const {
    uploadComplaintImages,
    getAllUploadedImages,
    getSingleUploadedImagesById,
    updateComplaintImages,
    deleteComplaintWorkImages,
    getComplaintImagesForPPT,
    approveRejectComplaintImagesByStatus,
} = require("./controllers/complaintImagesController");

const {
    getAllItemStockReport,
    getItemDistributeReport,
    stockTransfer,
    newStockTransfer,
    stockPunchItemsMasterToApprovePrice,
    getStockTransferQuantityById,
    getUserStockItems,
    getStockTransferQuantity,
} = require("./controllers/stockController");

const {
    createAssets,
    getAllStoredAssets,
    getSingleStoredAssetDetails,
    updateStoredAssetDetails,
    deleteAssets,
    assignAssetToUsers,
    getAllAssignedAssets,
    getAllIdleAssets,
    approveRejectAssetsByStatusAndById,
    createAssetsRepairRequest,
} = require("./controllers/assetController");

const { getAssetTimelineHistory, getAssetWithTimelineHistory } = require("./controllers/assetTimelineController");

const {
    createRepairRequest,
    getAllRepairRequestedAssetList,
    getSingleRepairRequestedAssetListDetails,
    updateRepairRequestDetails,
    deleteRepairRequest,
    getAllAssignedAssetList,
    markRequestViewed,
    AssignedRequest,
} = require("./controllers/assetRepairRequireController");

const {
    createTutorial,
    getTutorials,
    getTutorialByFormat,
    updateTutorials,
    deleteTutorialsById,
    getTutorialById,
} = require("./controllers/tutorialController");

const {
    createContacts,
    getAllStoredContacts,
    getStoredContactDetailById,
    updateContacts,
    deleteContactDetailById,
    getAllPositionOfCompanyContacts,
    deleteMessage,
    getMessageById,
    getAllMessages,
    updateMessage,
    sendMessage,
} = require("./controllers/companyContactController");

const {
    createHolidayList,
    getAllHolidayList,
    getHolidayDetailById,
    updateHolidayList,
    deleteHolidayList,
    getHolidayListOfMonth,
    getTodayBirthdayList,
} = require("./controllers/holidayController");

const {
    getAllModules,
    getTableNameColumnNameOnModuleId,
    generateReport,
    makeDynamicQuery,
} = require("./controllers/reportController");

const {
    createOrder,
    updateOrder,
    getAllData,
    getOrderById,
    deleteOrderById,
    getAllOrderWithPagination,
} = require("./controllers/orderController");

const {
    stockPunch,
    getAllStockPunchList,
    getStockPunchById,
    verifyStockPunchOtp,
    getStockRequest,
    getStockRequestById,
    approveStockPunch,
    getAllApproveStockPunchList,
    getAllApproveStockPunchListById,
    stockItemList,
} = require("./controllers/stockPunchController");

const {
    addExpensePunch,
    getAllExpensePunchList,
    getExpensePunchById,
    getAllCheckAndApprove,
    updateExpensePunch,
    getListExpensePunchApprove,
    getListExpensePunchApproveAccordingToItems,
    fundItemLists,
} = require("./controllers/expensePunchController");

const {
    createGstMasters,
    getAllGstMasterData,
    getGstMasterDetailsById,
    updateGstMasters,
    deleteGstMasterDetailsById,
    getGstDetailsOnStateId,
    getAllGstMasterDataForDropdown,
} = require("./controllers/gstMasterController");

const {
    getALLmanagersWithTeamMembers,
    getSuperVisorOnManagerId,
    getFreeEndUsersOnSuperVisorId,
    getAreaManagerOfUser,
    getComplaintAssignUserManagerAndSupervisor,
    getALLSupervisors,
} = require("./controllers/assignController");

const { getFoodExpenses, setFoodExpenseMaxLimit, punchFoodExpense } = require("./controllers/foodExpenseController");

const {
    createInvoiceNumberFormat,
    getAllGeneratedInvoiceFormat,
    getAllGeneratedInvoiceFormatById,
    updateInvoiceNumberFormat,
    deleteGeneratedInvoiceFormatById,
} = require("./controllers/invoiceNumberFormatController");

const { importData, importUserData } = require("./controllers/importDataController");

const { getModuleByPlanId } = require("./controllers/moduleController");
const { registerResignation } = require("./controllers/employeeResignationController");
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
const { verify } = require("jsonwebtoken");
const { getTransferFund, getALLTransferFund, getTotalTransferAmount } = require("./controllers/transferFundController");
const { getUserTransactionHistory } = require("./controllers/accountsController");
const {
    filesUpload,
    getPiAttachmentByComplaintId,
    filesUploadInBilling,
    updatePiAttachmentInBilling,
} = require("./controllers/pi_attachment");
const {
    addPaymentReceive,
    getAllPaymentReceive,
    getPaymentReceiveDetailsById,
    updatePaymentReceive,
    getAllPaymentRetention,
    updatePaymentRetentionStatus,
    getAllPaymentReceiveInPayment,
    listingOfPvNumber,
    updatePaymentReceiveInRetention,
    getListingofPaymentHistory,
    discardPaymentRetention,
    updatePaymentAmountRetention,
    getRoForDropdown,
    approvePaymentRetention,
    getPaymentRetentionDetailsById,
    getPoForDropdown,
    getRetentinIdForDropdown,
    getSalesAreaForDropdown,
    getOutletForDropdown,
    getComplaintTypeForDropdown,
    getBillingFromForDropdown,
    getBillingToForDropdown,
} = require("./controllers/paymentReceived");
const {
    addPaymentSetting,
    getAllPaymentSettings,
    getPaymentSettingDetailsById,
    updatePaymentSetting,
    deletePaymentSetting,
    getExpensePunchAndStockTotalAmount,
    addPaymentPaid,
    getAreaManagerTransactions,
    getAreaManagerTransactionsById,
    createAreaManagerRatio,
    getAllAreaManager,
    getAreaManagerById,
    updateAreaManager,
    otpVerifyInPaymentPaid,
    getPaymentPaid,
    getPaymentPaidById,
    resendOtp,
    addPaymentPaidforRo,
    getRoPaymentPaid,
    getPaymentPaidRoById,
    updatePaymentRoPaid,
    roTransactions,
    getRoTransactionsById,
    getRoPaymentPaidByPoDetails,
    getPaymentPaidRoDetailsById,
    poTransactions,
    getPoTransactionsById,
    importPromotion,
    importAreaManagerRatio,
} = require("./controllers/paymentSettingController");
const {
    getTotalComplaintsCount,
    getTotalComplaints,
    getTotalComplaintsCountEachMonth,
    getAreaManagers,
    getAreaManagersDashboard,
    getEndUsersDashboard,
    getProformaInvoiceEachMonthAmount,
    getInvoiceEachMonthAmount,
    getMeasurementAmountEachMonth,
    getAllComplaintsByStatus,
    getBillingDashboard,
    areaManagerDashboardforBilling,
    roDashboardforBilling,
} = require("./controllers/dashboard");
const {
    createBrand,
    updateBrand,
    getAllBrands,
    getBrandById,
    deleteBrand,
    getAllBrandsMarkDown,
    getBrandsByItemId,
} = require("./controllers/brandController");
const {
    addUpdateFeedbackComplaint,
    addResponseToFeedbackComplaint,
    getFeedbackComplaint,
    deleteFeedbackComplaint,
    getFeedbackComplaintById,
} = require("./controllers/feedbackComplaintController");
const {
    createSalesOrder,
    updateSalesOrderDetails,
    getAllGeneratedSalesOrder,
    getSalesOrderDetailsById,
    deleteSalesOrder,
    checkSONumberIsAlreadyExists,
    getSoListOnRoId,
    changeSoStatus,
    getSalesOrderItemsOnSo,
    approveSalesOrder,
    approveAndUpdateSalesOrder,
    getSalesSecurityUniqueId,
    getRoForSalesOrder,
    getSoNumberForSalesOrder,
} = require("./controllers/saleOrderController");
// const { getOutletById } = require('./helpers/general');

const contractorRouter = express.Router();

/**
 * openapi: 3.0.0
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// ----------Related urls ----------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Related URLs
 *   description: Routes related to contractor
 */

/**
 * @swagger
 * /contractor/get-active-energy-companies:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all active energy companies
 *     description: Retrieve a list of all active energy companies available for contractors.
 *     security:
 *       - bearerAuth: []  # Assuming you're using bearer token for authentication
 *     responses:
 *       200:
 *         description: A list of active energy companies
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ energy_company_id: 8, user_id: 144, name: "Energy Company 1", status: 1 }, { energy_company_id: 9, user_id: 144, name: "Energy Company 2", status: 1 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-active-energy-companies", verifyContractorToken, getAllActiveEnergyCompany);

/**
 * @swagger
 * /contractor/get-energy-company-assign-zones/{id}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get assigned zones for an energy company
 *     description: Retrieve a list of zones assigned to a specific energy company.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the energy company
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of assigned zones
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ zone_id: 12, energy_company_id: 8, zone_name: "CENTRAL ZONE" }, { zone_id: 13, energy_company_id: 8, zone_name: "NORTH ZONE" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-energy-company-assign-zones/:id",
    verifyContractorToken,
    getEnergyCompanyAssignZones
);

/**
 * @swagger
 * /contractor/get-all-regional-office-on-zone-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all regional offices in a zone
 *     description: Retrieve a list of all regional offices within a specific zone.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the zone
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of regional offices
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Regional offices fetched successfully"
 *               data: [{ zone_id: 1, zone_name: "South Zone", ro_id: 1, regional_office_name: "Regional Office 1" }, { zone_id: 1, zone_name: "South Zone", ro_id: 2, regional_office_name: "Regional Office 2" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-all-regional-office-on-zone-id/:id",
    verifyContractorToken,
    getRegionalOfficesOnZoneId
);

/**
 * @swagger
 * /contractor/get-all-sales-area-on-ro-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all sales areas in a regional office
 *     description: Retrieve a list of all sales areas within a specific regional office.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the regional office
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of sales areas
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Sales area fetched successfully"
 *               data: [{ id: 1, regional_office_id: 1, sales_area_name: "South RO1 SALE AREA 1" }, { id: 2, regional_office_id: 1, sales_area_name: "South RO1 SALE AREA 2" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-sales-area-on-ro-id/:id", verifyContractorToken, getSaleAreaOnRoId);

/**
 * @swagger
 * /contractor/get-all-district-on-sale-area-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all districts in a sales area
 *     description: Retrieve a list of all districts within a specific sales area.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the sales area
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of districts
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ district_id: 1, district_name: "District 1", status: 1, sale_area_id: 1, sales_area_name: "South RO1 SALE AREA 1" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-all-district-on-sale-area-id/:id",
    verifyContractorToken,
    getAllDistrictBySaleAreaId
);

// contractorRouter.get('/contractor/get-outlet-by-district-id/:id', verifyContractorToken, getOutletByDistrictId);

/**
 * @swagger
 * /contractor/get-all-complaints-sub-types:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all complaint sub-types
 *     description: Retrieve a list of all complaint sub-types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of complaint sub-types
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  - id: 1
 *                    complaint_type_name: "Complaint Type 1"
 *                    energy_company_id: 8
 *                    status: 1
 *                    created_by: 1
 *                    created_at: "2024-03-21T05:26:05.000Z"
 *                    updated_at: null
 *                    energy_company_name: "HINDUSTAN PETROLEUM CORPORATION LIMITED"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-complaints-sub-types", verifyContractorToken, getAllComplaintSubTypes);

/**
 * @swagger
 * /contractor/get-all-users:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  - id: 1
 *                    name: "User 1"
 *                    image: "/user_images/1678362324518download.jpg"
 *                    employee_id: "CMS00011"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-users", verifyContractorToken, getAllUsers);
contractorRouter.get("/contractor/get-all-users-for-expenses", verifyContractorToken, getAllUsersForExpenses);

/**
 * @swagger
 * /contractor/get-all-roles-for-dropdown:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all roles for dropdown
 *     description: Retrieve a list of all roles for dropdown options.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Role Fetched successfully"
 *               data:
 *                  - id: 1
 *                    name: "Super Admin"
 *                  - id: 2
 *                    name: "Contractor"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-roles-for-dropdown", verifyContractorToken, getAllRolesForDropdown);

/**
 * @swagger
 * /contractor/get-officers-list-on-ro/{id}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get officers list on RO
 *     description: Retrieve a list of officers associated with a specific RO.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the RO
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of officers
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Data Fetched successfully"
 *               data:
 *                  - id: 1
 *                    name: "Officer 1"
 *                    image: "/user_images/1678362324518download.jpg"
 *                    employee_id: "CMS00011"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-officers-list-on-ro/:id", verifyContractorToken, getRegionalOfficersOnRo);

/**
 * @swagger
 * /contractor/get-user-manager-and-supervisor-details/{userId}:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get user manager and supervisor details
 *     description: Retrieve manager and supervisor details for a specific user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Manager and supervisor details
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "User related found"
 *               data:
 *                 supervisor_id: 1
 *                 supervisor_name: "Supervisor 1"
 *                 supervisor_employee_id: "CMS00011"
 *                 supervisor_image: ""
 *                 manager_id: 2
 *                 manager_name: "Manager 1"
 *                 manager_employee_id: "CMS00012"
 *                 manager_image: ""
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-user-manager-and-supervisor-details/:userId",
    verifyContractorToken,
    getEndUserManagerAndSupervisor
);

/**
 * @swagger
 * /contractor/get-all-outlet-for-dropdown:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all outlets for dropdown
 *     description: Retrieve a list of all outlets for dropdown options.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of outlets
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ id: 1, outlet_name: "Outlet 1" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-outlet-for-dropdown", verifyContractorToken, getAllOutletForDropdown);

/**
 * @swagger
 * /contractor/get-all-regional-order-by:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all regional officers
 *     description: Retrieve a list of all regional officers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of regional officers
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  - id: 1
 *                    name: "Regional Officer 1"
 *                    image: "/user_images/1678362324518download.jpg"
 *                    employee_id: "CMS00011"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-regional-order-by", verifyContractorToken, getAllRegionalOfficers);

/**
 * @swagger
 * /contractor/get-all-supervisors:
 *   get:
 *     tags: [Contractor Routes - Related URLs]
 *     summary: Get all supervisors
 *     description: Retrieve a list of all supervisors.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of supervisors
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  - id: 1
 *                    name: "Supervisor 1"
 *                    email: "supervisor@gmail.com"
 *                    employee_id: "CMS00011"
 *                    image: "/user_images/1678362324518download.jpg"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-supervisors", verifyContractorToken, getAllSupervisorUsers);

// ------------------Complaints module routes ----------------

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Complaint Module
 *     description: Routes for complaint management.
 */

/**
 * @swagger
 * /contractor/get-complaints-timeline/{id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get complaints timeline
 *     description: Retrieve the full timeline of a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The timeline of the complaint
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  complaintDetails:
 *                    complaint_id: 1
 *                    complaint_type: "TANK CLEANING WORK"
 *                    complaint_description: "ok"
 *                    complaint_generated_at: "2024-03-16 11:50:04 AM"
 *                  complaintRaiserDetails:
 *                    name: "CONTRACTOR 1"
 *                    image: "/super_admin_images/17218800209981000000082.jpg"
 *                  complaintApprovalData:
 *                    name: "CONTRACTOR 1"
 *                    image: "/super_admin_images/17218800209981000000082.jpg"
 *                    approve_title: "Complaint approved"
 *                    approve_remarks: "Complaint approved by Contractor"
 *                    approved_at: "2024-03-16 06:20:44 AM"
 *                  complaintAssignDetails:
 *                    assignData:
 *                      - id: 1
 *                        title: "Complaint Created."
 *                        remark: "New Complaint created by Contractor."
 *                        status: "created"
 *                        assigned_at: "2024-03-16 06:20:04 AM"
 *                        is_end_user_free: true
 *                  itemStockPunchHistory: []
 *                  fundExpensePunchHistory: []
 *                  areaManager:
 *                    status: true
 *                    message: "Area Manager found"
 *                    data:
 *                      - areaManagerDetails:
 *                          id: 148
 *                          name: "Altaf Ahmad"
 *                          employee_id: ""
 *                          image: "/user_images/1692263966479download (6).jpg"
 *                      - superVisorDetails:
 *                          id: 153
 *                          name: "supervisor"
 *                          employee_id: "CMS00014"
 *                          image: ""
 *                          manager_id: 148
 *
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-complaints-timeline/:id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    getComplaintFullTimeline
);

/**
 * @swagger
 * /contractor/get-free-end-users-count:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get free end users count
 *     description: Retrieve the count of free end users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of free end users
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "users fetched successfully"
 *               data:
 *                  - user_id: 2
 *                    admin_id: 125
 *                    name: "CONTRACTOR 1"
 *                    image: "/super_admin_images/17218800209981000000082.jpg"
 *                    freeEndUsersCount: 1
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-free-end-users-count", verifyContractorToken, getTotalFreeEndUsers);

/**
 * @swagger
 * /contractor/assign-complaint-to-user:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Assign complaint to user
 *     description: Assign a complaint to a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             complaint_id: 40
 *             user_id: 192
 *     responses:
 *       200:
 *         description: Assignment success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assigned successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post(
    "/contractor/assign-complaint-to-user",
    verifyContractorToken,
    sideBarPermissionCheck(UPDATE, 3, 6),
    assignedComplaintToUsers
);

/**
 * @swagger
 * /contractor/get-manager-free-team-members/{id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get manager's free team members
 *     description: Retrieve a list of free team members for a specific manager.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the manager
 *         example: 186
 *     responses:
 *       200:
 *         description: A list of free team members
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "members found"
 *               data:
 *                  - id: 199
 *                    name: "Rakesh"
 *                    employee_id: "CMS00001"
 *                    image: "/user_images/1692263966479download (6).jpg"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-manager-free-team-members/:id", verifyContractorToken, getManagerFreeTeamMember);

/**
 * @swagger
 * /contractor/get-total-member-on-single-complaint/{complaint_id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get total members on a single complaint
 *     description: Retrieve the total number of members assigned to a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         example: 14
 *     responses:
 *       200:
 *         description: Total number of members on the complaint
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "members count"
 *               data: 5
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-total-member-on-single-complaint/:complaint_id",
    verifyContractorToken,
    sideBarPermissionCheck(VIEW, 3, 6),
    countTotalMemberOnSingleComplaint
);

/**
 * @swagger
 * /contractor/get-all-complaints-list-dropdown:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get all complaints for dropdown
 *     description: Retrieve a list of all complaints for dropdown options.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of complaints
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ complaint_id: 1, complaint_unique_id: "RAH02242503OC0003", complaint_type_name: "TRANSPORT WORK" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-all-complaints-list-dropdown",
    verifyContractorToken,
    getAllComplaintListForDropdown
);

/**
 * @swagger
 * /contractor/get-user-details-by-complaint-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get user details by complaint ID
 *     description: Retrieve user details associated with a specific complaint ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         example: 12
 *     responses:
 *       200:
 *         description: User details by complaint ID
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "End user details found"
 *               data:
 *                 user_id: 192
 *                 name: "RANJIT TIWAR"
 *                 image: "/user_images/1678362324518download.jpg"
 *                 employee_id: "CMS00011"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-user-details-by-complaint-id/:id", verifyContractorToken, getUserByComplaintId);

/**
 * @swagger
 * /contractor/update-assign-complaint-to-user:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Update assigned complaint to user
 *     description: Update the assignment of a complaint to a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             complaints_id: 19
 *             action:
 *               - add:
 *                   assign_to: [20]
 *
 *     responses:
 *       200:
 *         description: Update success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assignment updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post(
    "/contractor/update-assign-complaint-to-user",
    verifyContractorToken,
    updateAssignedComplaintToUsers
);

/**
 * @swagger
 * /contractor/rejected-assign-complaint-users:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Reject assigned complaint users
 *     description: Reject the assignment of a complaint to users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: 14
 *             status: 4
 *             rejected_remark: "Assign user to reject testing"
 *     responses:
 *       200:
 *         description: Rejection success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assignment rejected successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post(
    "/contractor/rejected-assign-complaint-users",
    verifyContractorToken,
    rejectedAssignComplaintToUsers
);

//------------item master routes---------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Item Master
 *   description: Routes for item master
 */

/**
 * @swagger
 * /contractor/create-item-master:
 *   post:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Create item master
 *     description: Create a new item master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: SSD
 *             supplier_id: 22
 *             hsncode: hsn44
 *             rucode: ru442
 *             item_unique_id: 1723550168990
 *             unit_id: 1
 *             description: <p>description of product</p>
 *             image: "/item_masters/1723550168990.jpg"
 *             category: 1
 *             rates: '[{"brand":"doms","brand_id":3,"rate":"5"},{"brand":"Natraj","brand_id":8,"rate":"8"}]'
 *     responses:
 *       200:
 *         description: Item master created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item and rates created successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-item-master", verifyContractorToken, createItemMaster);

/**
 * @swagger
 * /contractor/get-all-item-masters:
 *   get:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Get all item masters
 *     description: Retrieve a list of all item masters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of item masters
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
contractorRouter.get("/contractor/get-all-item-masters", verifyContractorToken, getAllItemMasters);

/**
 * @swagger
 * /contractor/get-item-master-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Get item master details
 *     description: Retrieve details of a specific item master by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item master
 *         example: 1
 *     responses:
 *       200:
 *         description: Item master details
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
contractorRouter.get("/contractor/get-item-master-details/:id", verifyContractorToken, getSingleItemMaster);

/**
 * @swagger
 * /contractor/update-item-master-details:
 *   post:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Update item master details
 *     description: Update the details of an existing item master.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: 1
 *             name: SSD
 *             supplier_id: 22
 *             hsncode: hsn44
 *             rucode: ru442
 *             item_unique_id: 1723550168990
 *             unit_id: 1
 *             description: <p>description of product</p>
 *             image: "/item_masters/1723550168990.jpg"
 *             category: 1
 *             rates: '[{"brand":"doms","brand_id":3,"rate":"5"},{"brand":"Natraj","brand_id":8,"rate":"8"}]'
 *     responses:
 *       200:
 *         description: Item master updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item and rates updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/update-item-master-details", verifyContractorToken, updateItemMaster);

/**
 * @swagger
 * /contractor/delete-item-master/{id}:
 *   delete:
 *     tags: [Contractor Routes - Item Master]
 *     summary: Delete item master
 *     description: Delete an item master by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item master to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item master deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item deleted successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.delete("/contractor/delete-item-master/:id", verifyContractorToken, deleteItemMaster);

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
contractorRouter.post("/contractor/request-fund", verifyContractorToken, fundRequest);

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
contractorRouter.get("/contractor/get-all-fund-requested", verifyContractorToken, getAllFundRequests);

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
contractorRouter.get("/contractor/get-all-approved-fund-requested", verifyContractorToken, getAllApprovedFundRequests);

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
contractorRouter.get("/contractor/get-all-rejected-fund-requested", verifyContractorToken, getAllRejectedFundRequests);

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
contractorRouter.get("/contractor/get-fund-request-details/:id", verifyContractorToken, getFundRequestById);
contractorRouter.post("/contractor/import-fund-request", verifyContractorToken, fundRequestImport);

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
contractorRouter.post("/contractor/update-fund-request-details", verifyContractorToken, updateFundRequest);

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
contractorRouter.delete("/contractor/delete-fund-request/:id", verifyContractorToken, deleteFundRequest);

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
contractorRouter.get(
    "/contractor/get-fund-request-by-complaint-id/:complaint_id",
    verifyContractorToken,
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
contractorRouter.post("/contractor/status-changed-of-request", verifyContractorToken, changeStatusOfFundRequest);

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
contractorRouter.get(
    "/contractor/get-fund-request-details-on-item-id/:id",
    verifyContractorToken,
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
contractorRouter.post("/contractor/reject-fund-request/:id", verifyContractorToken, rejectFundRequest);

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
contractorRouter.get(
    "/contractor/get-all-approved-fund-request-with-partial-fund-transfer",
    verifyContractorToken,
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
contractorRouter.get("/contractor/get-pending-transfer-fund", verifyContractorToken, getPendingTransferFund);

/**
 * @swagger
 * /contractor/get-fund-request-4-low-price/{hsncode}/{category}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get fund requests for low price items
 *     description: Retrieve fund requests for items with low prices based on HSN code and category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hsncode
 *         in: path
 *         required: true
 *         description: The HSN code of the item
 *         schema:
 *           type: string
 *       - name: category
 *         in: path
 *         required: true
 *         description: The category of the item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fund requests for low price items
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ fund_request_id: 1, item_id: 1, amount_requested: 50.00 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-fund-request-4-low-price/:hsncode/:category",
    verifyContractorToken,
    getFundRequestFourLowPrice
);

/**
 * @swagger
 * /contractor/reactive-reject-fund-requestet/{id}:
 *   post:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Reactivate rejected fund request
 *     description: Reactivate a previously rejected fund request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the rejected fund request to reactivate
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fund request reactivated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fund request reactivated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post(
    "/contractor/reactive-reject-fund-requestet/:id",
    verifyContractorToken,
    reActiveToRejectedFundRequest
);

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
contractorRouter.get("/contractor/get-transfer-fund", verifyContractorToken, getTransferFund);

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
contractorRouter.get("/contractor/get-all-transfer-fund", verifyContractorToken, getALLTransferFund);

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
contractorRouter.get(
    "/contractor/get-fund-request-details-by-request-for/:request_for_id",
    verifyContractorToken,
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
contractorRouter.get("/contractor/get-fund-request-items-by-user-id/:id", verifyContractorToken, getAllOldItemInFunds);

/**
 * @swagger
 * /contractor/get-last-three-prev-price-of-items/{id}/{userId}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get last three previous prices of items
 *     description: Retrieve the last three previous prices of items associated with a specific user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Last three previous prices of items
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
contractorRouter.get(
    "/contractor/get-last-three-prev-price-of-items/:id/:userId",
    verifyContractorToken,
    getLastThreePrevPrice
);

/**
 * @swagger
 * /contractor/get-total-transfer-amount/{id}:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get total transfer amount
 *     description: Retrieve the total transfer amount for a specific fund request ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the fund request
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total transfer amount
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

contractorRouter.get("/contractor/get-total-transfer-amount/:id", verifyContractorToken, getTotalTransferAmount);

/**
 * @swagger
 * /contractor/get-supplier-transaction/{id}:
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
contractorRouter.get("/contractor/get-supplier-transaction/:id", verifyContractorToken, getSupplierTransactions);

/**
 * @swagger
 * /contractor/get-price-by-brand:
 *   get:
 *     tags: [Contractor Routes - Fund Request]
 *     summary: Get item price by brand
 *     description: Retrieve the price of an item based on its brand.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brand
 *         in: query
 *         required: true
 *         description: The brand of the item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item price by brand
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: { brand: "Brand A", price: 100.00 }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-price-by-brand", verifyContractorToken, getItemPriceByBrand);

/**stock request */

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Stock Request
 *   description: Routes for managing stock requests
 */

/**
 * @swagger
 * /contractor/save-stock-request:
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
 * /contractor/get-all-requested-stock:
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
 * /contractor/get-single-requested-stock-details/{id}:
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
 * /contractor/update-stock-request:
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
 * /contractor/delete-stock-request/{id}:
 *   delete:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Delete a stock request
 *     description: Delete an existing stock request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the stock request to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock request deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request deleted successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/change-stock-request:
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
 * /contractor/get-stock-details-on-item-id/{id}/{user_id}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get stock details by item ID and user ID
 *     description: Retrieve stock details for a specific item ID and user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *         schema:
 *           type: integer
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock details by item ID and user ID
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: { item_id: 1, user_id: 1, quantity: 10 }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-approved-requested-stock:
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
 * /contractor/get-all-rejected-requested-stock:
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
 * /contractor/get-all-pending-stock-transfer-request:
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
 * /contractor/get-transfer-stock:
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
 * /contractor/get-all-transfer-stock:
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

/**
 * @swagger
 * /contractor/rejected-stock-request:
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
 * /contractor/rejected-stock-request-to-reactive/{id}:
 *   post:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Reactivate a rejected stock request
 *     description: Reactivate a previously rejected stock request by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the rejected stock request
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock request reactivated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock request reactivated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-last-three-prev-price-for-stocks/{id}/{userId}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get last three previous prices for stocks
 *     description: Retrieve the last three previous prices for a specific stock based on item ID and user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Last three previous prices for stocks
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ price: 100.00, date: "2024-01-01" }, { price: 90.00, date: "2023-12-01" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-today-history-by-supplier/{supplier_id}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get today's history by supplier
 *     description: Retrieve all history for today based on supplier ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: supplier_id
 *         in: path
 *         required: true
 *         description: The ID of the supplier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Today's history by supplier
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ item_id: 1, quantity: 10, price: 100.00 }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-stock-requests:
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

/**
 * @swagger
 * /contractor/get-all-items-in-stocks-by-userId/{id}:
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
 * /contractor/update-transfer-bill-and-date:
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
 * /contractor/get-last-three-prev-price-by-supplier/{id}/{userId}:
 *   get:
 *     tags: [Contractor Routes - Stock Request]
 *     summary: Get last three previous prices by supplier
 *     description: Retrieve the last three previous prices for an item based on supplier ID and user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Last three previous prices by supplier
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ price: 100.00, date: "2024-01-01" }, { price: 90.00, date: "2023-12-01" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/save-stock-request", verifyContractorToken, stockRequestSave);
contractorRouter.get("/contractor/get-all-requested-stock", verifyContractorToken, getAllStockRequests);
contractorRouter.get(
    "/contractor/get-single-requested-stock-details/:id",
    verifyContractorToken,
    getStockRequestsDetailsById
);
contractorRouter.post("/contractor/update-stock-request", verifyContractorToken, stockRequestDetailsUpdate);
contractorRouter.delete("/contractor/delete-stock-request/:id", verifyContractorToken, deleteStockRequest);
contractorRouter.post("/contractor/change-stock-request", verifyContractorToken, updateStockRequestStatus);
contractorRouter.get(
    "/contractor/get-stock-details-on-item-id/:id/:user_id",
    verifyContractorToken,
    getStockDetailsOnItemId
);
contractorRouter.get(
    "/contractor/get-all-approved-requested-stock",
    verifyContractorToken,
    getAllApprovedStockRequests
);
contractorRouter.get(
    "/contractor/get-all-rejected-requested-stock",
    verifyContractorToken,
    getAllRejectedStockRequests
);
contractorRouter.get(
    "/contractor/get-all-pending-stock-transfer-request",
    verifyContractorToken,
    getAllPendingStockTransfer
);
contractorRouter.get("/contractor/get-transfer-stock", verifyContractorToken, getStockTransfer);
contractorRouter.get("/contractor/get-all-transfer-stock", verifyContractorToken, getAllStockTransfer);
contractorRouter.post("/contractor/rejected-stock-request", verifyContractorToken, rejectStockRequest);
contractorRouter.post(
    "/contractor/rejected-stock-request-to-reactive/:id",
    verifyContractorToken,
    reActiveToRejectedStockRequest
);
contractorRouter.get(
    "/contractor/get-last-three-prev-price-for-stocks/:id/:userId",
    verifyContractorToken,
    getLastThreePrevPriceInStocks
);
contractorRouter.get(
    "/contractor/get-all-today-history-by-supplier/:supplier_id",
    verifyContractorToken,
    getAllhistoryByToday
);
contractorRouter.get("/contractor/get-all-stock-requests", verifyContractorToken, getAllStocksRequests);
contractorRouter.get("/contractor/get-all-items-in-stocks-by-userId/:id", verifyContractorToken, getAllOldItemInStocks);
contractorRouter.post("/contractor/update-transfer-bill-and-date", verifyContractorToken, updateBillNumber);
contractorRouter.get(
    "/contractor/get-last-three-prev-price-by-supplier/:id/:userId",
    verifyContractorToken,
    getLastThreePrevPriceBySuppliers
);

/**stock transfer */

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Stock Transfer
 *   description: Routes for managing stock transfer.
 */

/**
 * @swagger
 * /contractor/transfer-stock:
 *   post:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Transfer stock
 *     description: Transfer stock from one location to another.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Stock transfer details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { item_id: 1, quantity: 10, from_location: "Warehouse A", to_location: "Warehouse B" }
 *     responses:
 *       200:
 *         description: Stock transferred successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Stock transferred successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-supplier-details:
 *   get:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Get supplier details
 *     description: Retrieve details of all suppliers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data: [{ supplier_id: 1, name: "Supplier A", contact: "123-456-7890" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/stock-transfer:
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
 * /contractor/get-reschdule-transfer-stock:
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
 * /contractor/rescheduled-stocks-transfer-stock/{id}/{rescheduled_date}:
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
 * /contractor/get-stock-request-details-by-request-for/{request_for_id}:
 *   get:
 *     tags: [Contractor Routes - Stock Transfer]
 *     summary: Get stock request details by request for ID
 *     description: Retrieve details of stock requests based on the request for ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: request_for_id
 *         in: path
 *         required: true
 *         description: The ID of the request for which details are being retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock request details fetched successfully
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
contractorRouter.post("/contractor/transfer-stock", verifyContractorToken, transferStock);
contractorRouter.get("/contractor/get-supplier-details", verifyContractorToken, getSupplier);
contractorRouter.post("/contractor/stock-transfer", verifyContractorToken, stocksAmountTransfer);
contractorRouter.get("/contractor/get-reschdule-transfer-stock", verifyContractorToken, getRescheduleTransferStock);
contractorRouter.post(
    "/contractor/rescheduled-stocks-transfer-stock/:id/:rescheduled_date",
    verifyContractorToken,
    rescheduledTransferstock
);
contractorRouter.get(
    "/contractor/get-stock-request-details-by-request-for/:request_for_id",
    verifyContractorToken,
    getAllPreviousPriceOfStocks
);

//item request routes

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Item Request
 *   description: Routes for item requests
 */

/**
 * @swagger
 * /contractor/items:
 *   post:
 *     tags: [Contractor Routes - Item Request]
 *     summary: Create a new item
 *     description: Allows a contractor to create a new item.
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
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               name: "Item 1"
 *               description: "Description of Item 1"
 *               quantity: 10
 *               status: "available"
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-items/{id}:
 *   put:
 *     tags: [Contractor Routes - Item Request]
 *     summary: Update an item
 *     description: Update the details of an existing item by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *             example:
 *               name: "Updated Item"
 *               description: "Updated Description"
 *               quantity: 15
 *               status: "unavailable"
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-items:
 *   get:
 *     tags: [Contractor Routes - Item Request]
 *     summary: Get all items
 *     description: Retrieve a list of all items for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Items fetched successfully"
 *               data: [{ id: 1, name: "Item 1", description: "Description of Item 1", quantity: 10, status: "available" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-item/{id}:
 *   delete:
 *     tags: [Contractor Routes - Item Request]
 *     summary: Delete an item
 *     description: Delete an existing item by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-complaint-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Item Request]
 *     summary: Get item by ID
 *     description: Retrieve the details of a specific item by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Item details fetched successfully"
 *               data: { id: 1, name: "Item 1", description: "Description of Item 1", quantity: 10, status: "available" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/items", verifyContractorToken, createItem);
contractorRouter.put("/contractor/update-items/:id", verifyContractorToken, updateItem);
contractorRouter.get("/contractor/get-items", verifyContractorToken, getAllItems);
contractorRouter.delete("/contractor/delete-item/:id", verifyContractorToken, deleteItem);
contractorRouter.get("/contractor/get-complaint-by-id/:id", verifyContractorToken, getItemById);

//------------------------Purchase order routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Purchase Order
 *   description: Routes for managing purchase orders
 */

/**
 * @swagger
 * /contractor/create-po-order:
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
 * /contractor/get-all-generated-po:
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
 * /contractor/get-ro-for-po:
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
 * /contractor/get-po-number-for-po:
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
 * /contractor/approve-purchase-order:
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
 * /contractor/approve-update-purchase-order:
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
 * /contractor/get-security-unique-id:
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
contractorRouter.post("/contractor/create-po-order", verifyContractorToken, createPurchaseOrder);
contractorRouter.get("/contractor/get-all-generated-po", verifyContractorToken, getAllGeneratedPurchaseOrder);
contractorRouter.get("/contractor/get-ro-for-po", verifyContractorToken, getRoForPurchaseOrder);
contractorRouter.get("/contractor/get-po-number-for-po", verifyContractorToken, getPoNumberForPurchaseOrder);
contractorRouter.post("/contractor/approve-purchase-order", verifyContractorToken, approvePurchaseOrder);
contractorRouter.post(
    "/contractor/approve-update-purchase-order",
    verifyContractorToken,
    approveAndUpdatePurchaseOrder
);
contractorRouter.get("/contractor/get-security-unique-id", verifyContractorToken, getSecurityUniqueId);

/**
 * @swagger
 * /contractor/get-single-po-details/{id}:
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
 * /contractor/update-po-details:
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
 * /contractor/delete-po-details/{id}:
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
 * /contractor/check-po-is-exists:
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
 * /contractor/get-po-details-on-ro/{id}:
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
 * /contractor/get-tax-calculation-type:
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
 * /contractor/get-all-gst-type:
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
 * /contractor/change-po-status:
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
 * /contractor/get-purchase-order-details-with-items/{id}:
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
 * /contractor/change-po-in-measurements:
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
 * /contractor/download-csv-purchase-order-items:
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
contractorRouter.get("/contractor/get-single-po-details/:id", verifyContractorToken, getPurchaseOrderDetailsById);
contractorRouter.post("/contractor/update-po-details", verifyContractorToken, updatePurchaseOrderDetails);
contractorRouter.delete("/contractor/delete-po-details/:id", verifyContractorToken, deletePurchaseOrder);
contractorRouter.get("/contractor/check-po-is-exists", verifyContractorToken, checkPONumberIsAlreadyExists);
contractorRouter.get("/contractor/get-po-details-on-ro/:id", verifyContractorToken, getPoListOnRoId);
contractorRouter.post("/contractor/get-tax-calculation-type", verifyContractorToken, getIncludePercentage);
contractorRouter.get("/contractor/get-all-gst-type", verifyContractorToken, getAllGstType);
contractorRouter.post("/contractor/change-po-status", verifyContractorToken, changePoStatus);
contractorRouter.get(
    "/contractor/get-purchase-order-details-with-items/:id",
    verifyContractorToken,
    getPurchaseOrderItemsOnPo
);
contractorRouter.post("/contractor/change-po-in-measurements", verifyContractorToken, changePoInMeasurements);
contractorRouter.get("/contractor/download-csv-purchase-order-items", downloadCsvFile);

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
contractorRouter.post("/contractor/create-quotation", verifyContractorToken, createQuotation);
contractorRouter.get("/contractor/get-quotation", verifyContractorToken, getQuotation);
contractorRouter.get("/contractor/get-quotation-by-id/:id", verifyContractorToken, getQuotationById);
contractorRouter.put("/contractor/update-quotation/:id", verifyContractorToken, updateQuotation);
contractorRouter.delete("/contractor/delete-quotation/:id", verifyContractorToken, deleteQuotation);
contractorRouter.post("/contractor/quotation-send-by-email", verifyContractorToken, sendEmailQuotation);
contractorRouter.post(
    "/contractor/approve-rejected-quotation-by-id",
    verifyContractorToken,
    approveOrRejectQuotationsById
);

//supplier controller

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Supplier
 *   description: Routes for managing suppliers
 */

/**
 * @swagger
 * /contractor/create-suppliers:
 *   post:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Create a new supplier
 *     description: Allows a contractor to create a new supplier.
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
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               name: "Supplier Name"
 *               contact: "123-456-7890"
 *               email: "supplier@example.com"
 *               address: "123 Supplier St, City, Country"
 *               status: "active"
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-suppliers:
 *   get:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Get all suppliers
 *     description: Retrieve a list of all suppliers for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Suppliers fetched successfully"
 *               data: [{ id: 1, name: "Supplier Name", contact: "123-456-7890", email: "supplier@example.com", address: "123 Supplier St", status: "active" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-suppliers-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Get supplier by ID
 *     description: Retrieve details of a specific supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Supplier details fetched successfully"
 *               data: { id: 1, name: "Supplier Name", contact: "123-456-7890", email: "supplier@example.com", address: "123 Supplier St", status: "active" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-suppliers/{id}:
 *   put:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Update a supplier
 *     description: Update the details of an existing supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               name: "Updated Supplier Name"
 *               contact: "987-654-3210"
 *               email: "updatedsupplier@example.com"
 *               address: "456 Supplier Ave, New City, Country"
 *               status: "inactive"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-suppliers/{id}:
 *   delete:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Delete a supplier
 *     description: Delete an existing supplier by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the supplier to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/approve-reject-suppliers-by-id:
 *   post:
 *     tags: [Contractor Routes - Supplier]
 *     summary: Approve or reject a supplier
 *     description: Approve or reject a supplier based on its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *             example:
 *               supplier_id: 1
 *               action: "approve"
 *     responses:
 *       200:
 *         description: Supplier approved or rejected successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-suppliers", verifyContractorToken, createSuppliers);
contractorRouter.get("/contractor/get-suppliers", verifyContractorToken, getSuppliers);
contractorRouter.get("/contractor/get-suppliers-by-id/:id", verifyContractorToken, getSuppliersById);
contractorRouter.put("/contractor/update-suppliers/:id", verifyContractorToken, updateSuppliers);
contractorRouter.delete("/contractor/delete-suppliers/:id", verifyContractorToken, deleteSuppliers);
contractorRouter.post(
    "/contractor/approve-reject-suppliers-by-id",
    verifyContractorToken,
    approveOrRejectSuppliersById
);

//----------------------------Measurement routes----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Measurement
 *   description: Routes for managing measurements
 */

/**
 * @swagger
 * /contractor/create-measurement:
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
 * /contractor/get-all-measurements:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all measurements
 *     description: Retrieve a list of all measurements for the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Measurements retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurements fetched successfully"
 *               data: [{ id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-measurements-details/{id}:
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
 * /contractor/update-measurement-details:
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
 * /contractor/delete-measurements-details/{id}:
 *   delete:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Delete measurement details
 *     description: Delete an existing measurement by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the measurement to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Measurement deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-measurements-detail-by-po/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get measurement details by PO ID
 *     description: Retrieve measurement details related to a specific PO ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The PO ID to retrieve measurement details for
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
 *               data: [{ id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }]
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-items-on-measurement-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get items by measurement ID
 *     description: Retrieve items associated with a specific measurement ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The measurement ID to retrieve associated items
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Items fetched successfully"
 *               data: [{ id: 1, item_name: "Item A", measurement_id: 1 }]
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-complaints-from-site:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all complaints from the site
 *     description: Retrieve all complaints reported from the site.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaints retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaints fetched successfully"
 *               data: [{ id: 1, complaint_details: "Complaint details" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-complaints-to-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get complaint details by ID
 *     description: Retrieve details of a specific complaint by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the complaint to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint details fetched successfully"
 *               data: { id: 1, complaint_details: "Complaint details" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-measurement-details:
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
 * /contractor/get-all-discard-measurements:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get all discarded measurements
 *     description: Retrieve a list of all discarded measurements.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discarded measurements retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Discarded measurements fetched successfully"
 *               data: [{ id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-discard-measurements-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get discarded measurement details by ID
 *     description: Retrieve details of a specific discarded measurement by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the discarded measurement to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discarded measurement details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Discarded measurement details fetched successfully"
 *               data: { id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Discarded measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-resolved-complaint-in-billing:
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
 * /contractor/get-measurment-details-by-status/{status}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get measurement details by status
 *     description: Retrieve measurement details filtered by status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         description: The status to filter measurements by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Measurement details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurement details fetched successfully"
 *               data: [{ id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-measurements-based-on-status:
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

/**
 * @swagger
 * /contractor/save-measurements-details:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Save measurement details into draft
 *     description: Save measurement details into a draft state for later review.
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
 *               details:
 *                 type: string
 *             example:
 *               measurement_id: 1
 *               details: "Measurement details for draft"
 *     responses:
 *       200:
 *         description: Measurement details saved into draft successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-outlets-in-ptm:
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
 * /contractor/get-all-regionals-in-ptm:
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
 * /contractor/get-all-order-by-in-ptm:
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
 * /contractor/get-all-sale-in-ptm:
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
 * /contractor/get-all-outlet-in-billing:
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
 * /contractor/get-all-sales-in-billing:
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
 * /contractor/get-all-regional-in-billing:
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
 * /contractor/get-all-order-by-for-measurements:
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
 * /contractor/reactive-to-discard-measurements:
 *   post:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Reactivate discarded measurement details
 *     description: Reactivate measurement details that were previously discarded.
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
 *         description: Measurement details reactivated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-same-purchase-order/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get similar purchase orders by ID
 *     description: Retrieve similar purchase orders based on a specific ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID to retrieve similar purchase orders
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Similar purchase orders fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Similar purchase orders fetched successfully"
 *               data: [{ id: 1, purchase_order_name: "PO A" }]
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Purchase orders not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-measurements-timeline-details/{id}:
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
 * /contractor/get-po-details-by-ro:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get PO details by RO
 *     description: Retrieve purchase order details based on RO.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PO details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "PO details fetched successfully"
 *               data: [{ id: 1, po_number: "PO001" }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/change-po-details-by-same-po:
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

/**
 * @swagger
 * /contractor/get-measurements-details-for-pdf/{id}:
 *   get:
 *     tags: [Contractor Routes - Measurement]
 *     summary: Get measurement details for PDF
 *     description: Retrieve measurement details for generating a PDF report.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the measurement to retrieve details for PDF
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Measurement details fetched successfully for PDF
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurement details fetched successfully for PDF"
 *               data: { id: 1, measurement_name: "Length", value: 20.5, unit: "meters" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-measurement", verifyContractorToken, createMeasurement);
contractorRouter.get("/contractor/get-all-measurements", verifyContractorToken, getAllCreatedMeasurements);
contractorRouter.get("/contractor/get-measurements-details/:id", verifyContractorToken, getMeasurementsDetailsById);
contractorRouter.post("/contractor/update-measurement-details", verifyContractorToken, updateMeasurementDetails);
contractorRouter.delete("/contractor/delete-measurements-details/:id", verifyContractorToken, deleteMeasurementDetails);
contractorRouter.get(
    "/contractor/get-measurements-detail-by-po/:id",
    verifyContractorToken,
    measurementDetailsWithPoAndComplaint
);
contractorRouter.get("/contractor/get-items-on-measurement-id/:id", verifyContractorToken, ItemsOnMeasurementId);
contractorRouter.get("/contractor/get-all-complaints-from-site", verifyContractorToken, getAllComplaintsFromSite);
contractorRouter.get("/contractor/get-complaints-to-details/:id", verifyContractorToken, getComplaintIdToDetails);
contractorRouter.post("/contractor/discard-measurement-details", verifyContractorToken, discardMeasurementDetails);
contractorRouter.get("/contractor/get-all-discard-measurements", verifyContractorToken, getAllDiscardMeasurements);
contractorRouter.get(
    "/contractor/get-discard-measurements-details/:id",
    verifyContractorToken,
    getDiscardMeasurementsDetailsById
);
contractorRouter.get(
    "/contractor/get-resolved-complaint-in-billing",
    verifyContractorToken,
    getResolvedComplaintsInBilling
);
contractorRouter.get("/contractor/get-measurment-details-by-status/:status", verifyContractorToken, getAllMeasurements);
contractorRouter.get(
    "/contractor/get-all-measurements-based-on-status",
    verifyContractorToken,
    getAllMeasurementsBasedOnStatus
);
// contractorRouter.post("/contractor/save-measurements-details", verifyContractorToken, saveIntoDraftMeasurement);
contractorRouter.get("/contractor/get-all-outlets-in-ptm", verifyContractorToken, getOutletByIdForPtm);
contractorRouter.get("/contractor/get-all-regionals-in-ptm", verifyContractorToken, getRegionalByIdForPtm);
contractorRouter.get("/contractor/get-all-order-by-in-ptm", verifyContractorToken, getOrderByIdForPtm);
contractorRouter.get("/contractor/get-all-sale-in-ptm", verifyContractorToken, getSaleByIdNewForPtm);
contractorRouter.get("/contractor/get-all-companies-in-ptm", verifyContractorToken, getCompaniesForPtm);
// contractorRouter.get('/contractor/get-all-companies-in-billing', verifyContractorToken, getCompanyInBilling)
contractorRouter.get("/contractor/get-all-outlet-in-billing", verifyContractorToken, getOutletByIdInsideBilling);
contractorRouter.get("/contractor/get-all-sales-in-billing", verifyContractorToken, getSalesByIdInsideBilling);
contractorRouter.get("/contractor/get-all-companies-in-billing", verifyContractorToken, getCompaniesInsideBilling);
contractorRouter.get("/contractor/get-all-regional-in-billing", verifyContractorToken, getRegionalByIdInsideBilling);
contractorRouter.get(
    "/contractor/get-all-complaint-types-in-billing",
    verifyContractorToken,
    getComplaintTypesInsideBilling
);
contractorRouter.get("/contractor/get-all-po-in-billing", verifyContractorToken, getPoInsideBilling);
contractorRouter.get(
    "/contractor/get-all-order-by-for-measurements",
    verifyContractorToken,
    getAllOrderByForMeasurements
);
contractorRouter.post(
    "/contractor/reactive-to-discard-measurements",
    verifyContractorToken,
    discardToReactiveMeasurement
);
contractorRouter.get("/contractor/get-same-purchase-order/:id", verifyContractorToken, getSimilarPurchaseOrders);
contractorRouter.get(
    "/contractor/get-measurements-timeline-details/:id",
    verifyContractorToken,
    getMeasurementsTimeLineDetailsById
);
contractorRouter.get("/contractor/get-po-details-by-ro", verifyContractorToken, getAllPoItem);
contractorRouter.post("/contractor/change-po-details-by-same-po", verifyContractorToken, updatePoInMeasurementDetails);
// contractorRouter.get('/contractor/get-measurements-details-for-pdf/:id', getMeasurementsDetailsById)
contractorRouter.get("/contractor/get-complaint-types", verifyContractorToken, getComplaintTypes);

// file attachment in billing measurement

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - File Attachment
 *   description: Routes for managing file attachments
 */

/**
 * @swagger
 * /contractor/files-upload-in-billing:
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
 * /contractor/get-pi-attachment-by-complaint-id/{complaint_id}:
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
 * /contractor/get-attachment-and-inspection-details/{id}:
 *   get:
 *     tags: [Contractor Routes - File Attachment]
 *     summary: Get attachment and inspection details by ID
 *     description: Retrieve attachment and inspection details based on the provided ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID to retrieve attachment and inspection details
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attachment and inspection details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Attachment and inspection details fetched successfully"
 *               data: { attachment_id: 1, inspection_details: "Inspection details here" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Details not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-pi-attachment-complaint:
 *   post:
 *     tags: [Contractor Routes - File Attachment]
 *     summary: Update PI attachment for a complaint
 *     description: Update the PI attachment details for a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaint_id:
 *                 type: integer
 *               attachment_id:
 *                 type: integer
 *               file_url:
 *                 type: string
 *             example:
 *               complaint_id: 1
 *               attachment_id: 1
 *               file_url: "http://example.com/updated_file.jpg"
 *     responses:
 *       200:
 *         description: PI attachment updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Complaint or attachment not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/files-upload-in-billing", verifyContractorToken, filesUploadInBilling);
contractorRouter.get(
    "/contractor/get-pi-attachment-by-complaint-id/:complaint_id",
    verifyContractorToken,
    getPiAttachmentByComplaintId
);
contractorRouter.get(
    "/contractor/get-attachment-and-inspection-details/:id",
    verifyContractorToken,
    getAttachmentAndInspectionDetails
);
contractorRouter.post("/contractor/update-pi-attachment-complaint", verifyContractorToken, updatePiAttachmentInBilling);

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
contractorRouter.post("/contractor/create-financial-year", verifyContractorToken, createFinancialYears);
contractorRouter.put("/contractor/update-financial-year-by-id/:id", verifyContractorToken, updateFinancialYearById);
contractorRouter.get("/contractor/fetch-all-financial-years", verifyContractorToken, fetchAllFinancialYears);
contractorRouter.get("/contractor/fetch-financial-year-by-id/:id", verifyContractorToken, fetchFinancialYearById);
contractorRouter.delete("/contractor/delete-financial-year-by-id/:id", verifyContractorToken, deleteFinancialYearById);

//----------------------unit data routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Unit Data
 *   description: API endpoints for managing unit data.
 */

/**
 * @swagger
 * /contractor/create-unit-data:
 *   post:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Create new unit data
 *     description: Add a new unit data entry to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *               unit_code:
 *                 type: string
 *             example:
 *               unit_name: "Meter"
 *               unit_code: "MTR"
 *     responses:
 *       201:
 *         description: Unit data created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-unit-data-by-id/{id}:
 *   put:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Update unit data by ID
 *     description: Update the details of an existing unit data entry using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *               unit_code:
 *                 type: string
 *             example:
 *               unit_name: "Kilogram"
 *               unit_code: "KG"
 *     responses:
 *       200:
 *         description: Unit data updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-unit-data:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get all unit data
 *     description: Retrieve a list of all unit data entries.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unit data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of unit data fetched successfully"
 *               data: [{ id: 1, unit_name: "Meter", unit_code: "MTR" }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-unit-data-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get unit data by ID
 *     description: Retrieve details of a specific unit data entry based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit data details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Unit data details fetched successfully"
 *               data: { id: 1, unit_name: "Meter", unit_code: "MTR" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-unit-data-by-id/{id}:
 *   delete:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Delete unit data by ID
 *     description: Remove a unit data entry from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the unit data to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit data deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Unit data not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-unit-data-list:
 *   get:
 *     tags: [Contractor Routes - Unit Data]
 *     summary: Get all unit data for dropdown
 *     description: Retrieve a list of all unit data entries for use in dropdowns.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unit data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of unit data fetched successfully"
 *               data: [{ id: 1, unit_name: "Meter", unit_code: "MTR" }]
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-unit-data", verifyContractorToken, createUnitData);
contractorRouter.put("/contractor/update-unit-data-by-id/:id", verifyContractorToken, updateUnitDataById);
contractorRouter.get("/contractor/get-all-unit-data", verifyContractorToken, getAllUnitData);
contractorRouter.get("/contractor/get-unit-data-by-id/:id", verifyContractorToken, getUnitDataById);
contractorRouter.delete("/contractor/delete-unit-data-by-id/:id", verifyContractorToken, deleteUnitDataById);
contractorRouter.get("/contractor/get-all-unit-data-list", verifyContractorToken, getAllUnitDataForDropdown);

//-----------------------Billing types routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Billing Types
 *   description: API endpoints for managing billing types.
 */

/**
 * @swagger
 * /contractor/create-billing-types:
 *   post:
 *     tags: [Contractor Routes - Billing Types]
 *     summary: Create new billing type
 *     description: Add a new billing type entry to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *               type_code:
 *                 type: string
 *             example:
 *               type_name: "Consulting"
 *               type_code: "CONS"
 *     responses:
 *       201:
 *         description: Billing type created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-billing-types:
 *   get:
 *     tags: [Contractor Routes - Billing Types]
 *     summary: Get all billing types
 *     description: Retrieve a list of all billing types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of billing types fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of billing types fetched successfully"
 *               data: [{ id: 1, type_name: "Consulting", type_code: "CONS" }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-single-billing-types/{id}:
 *   get:
 *     tags: [Contractor Routes - Billing Types]
 *     summary: Get billing type by ID
 *     description: Retrieve details of a specific billing type based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the billing type to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Billing type details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Billing type details fetched successfully"
 *               data: { id: 1, type_name: "Consulting", type_code: "CONS" }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Billing type not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-billing-types:
 *   post:
 *     tags: [Contractor Routes - Billing Types]
 *     summary: Update billing type
 *     description: Update the details of an existing billing type.
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
 *               type_name:
 *                 type: string
 *               type_code:
 *                 type: string
 *             example:
 *               id: 1
 *               type_name: "Consulting"
 *               type_code: "CONS"
 *     responses:
 *       200:
 *         description: Billing type updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Billing type not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-billing-type/{id}:
 *   delete:
 *     tags: [Contractor Routes - Billing Types]
 *     summary: Delete billing type by ID
 *     description: Remove a billing type entry from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the billing type to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Billing type deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Billing type not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-billing-types", verifyContractorToken, createBillingType);
contractorRouter.get("/contractor/get-all-billing-types", verifyContractorToken, getAllBillingTypes);
contractorRouter.get("/contractor/get-single-billing-types/:id", verifyContractorToken, getBillingTypesById);
contractorRouter.post("/contractor/update-billing-types", verifyContractorToken, updateBillingType);
contractorRouter.delete("/contractor/delete-billing-type/:id", verifyContractorToken, removeBillingTypeById);

//------------------------tax information routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Tax Information
 *   description: API endpoints for managing tax information.
 */

/**
 * @swagger
 * /contractor/create-tax:
 *   post:
 *     tags: [Contractor Routes - Tax Information]
 *     summary: Create new tax details
 *     description: Add new tax information to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tax_name:
 *                 type: string
 *               tax_rate:
 *                 type: number
 *             example:
 *               tax_name: "VAT"
 *               tax_rate: 18.5
 *     responses:
 *       201:
 *         description: Tax details created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-taxes:
 *   get:
 *     tags: [Contractor Routes - Tax Information]
 *     summary: Get all taxes
 *     description: Retrieve a list of all tax details.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of taxes fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of taxes fetched successfully"
 *               data: [{ id: 1, tax_name: "VAT", tax_rate: 18.5 }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-single-tax-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Tax Information]
 *     summary: Get tax details by ID
 *     description: Retrieve details of a specific tax entry based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the tax entry to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tax details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Tax details fetched successfully"
 *               data: { id: 1, tax_name: "VAT", tax_rate: 18.5 }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Tax entry not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-tax-details:
 *   post:
 *     tags: [Contractor Routes - Tax Information]
 *     summary: Update tax details
 *     description: Update the details of an existing tax entry.
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
 *               tax_name:
 *                 type: string
 *               tax_rate:
 *                 type: number
 *             example:
 *               id: 1
 *               tax_name: "VAT"
 *               tax_rate: 18.5
 *     responses:
 *       200:
 *         description: Tax details updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Tax entry not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-tax-details/{id}:
 *   delete:
 *     tags: [Contractor Routes - Tax Information]
 *     summary: Delete tax details by ID
 *     description: Remove a tax entry from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the tax entry to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tax details deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Tax entry not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-tax", verifyContractorToken, createTaxDetails);
contractorRouter.get("/contractor/get-all-taxes", verifyContractorToken, getAllTaxes);
contractorRouter.get("/contractor/get-single-tax-details/:id", verifyContractorToken, getTaxesDetailById);
contractorRouter.post("/contractor/update-tax-details", verifyContractorToken, updateTaxDetails);
contractorRouter.delete("/contractor/delete-tax-details/:id", verifyContractorToken, removeTaxById);

//-----------------Proforma invoices route----------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Proforma Invoices
 *   description: API endpoints for managing proforma invoices.
 */

/**
 * @swagger
 * /contractor/generate-proforma-invoice:
 *   post:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Generate a new proforma invoice
 *     description: Create a new proforma invoice in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Proforma invoice generated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-proforma-invoices:
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

/**
 * @swagger
 * /contractor/get-all-merged-proforma-invoice:
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

/**
 * @swagger
 * /contractor/get-single-proforma-invoice/{id}:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get proforma invoice by ID
 *     description: Retrieve details of a specific proforma invoice based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the proforma invoice to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma invoice details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Proforma invoice details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-merged-proforma-invoice/{id}:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get merged proforma invoice by ID
 *     description: Retrieve details of a merged proforma invoice based on its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the merged proforma invoice to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merged proforma invoice details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Merged proforma invoice details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Merged proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-proforma-invoice-details:
 *   post:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Update proforma invoice details
 *     description: Update the details of an existing proforma invoice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Proforma invoice details updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-proforma-invoice/{id}:
 *   delete:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Delete proforma invoice by ID
 *     description: Remove a proforma invoice from the system using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the proforma invoice to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma invoice deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-pi-on-po-number/{po_id}:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all proforma invoices on PO number
 *     description: Retrieve all proforma invoices associated with a specific PO number.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: po_id
 *         in: path
 *         required: true
 *         description: The PO number ID to filter proforma invoices
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of proforma invoices on PO number fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of proforma invoices on PO number fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-measurements-detail-po:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get measurements detail PO
 *     description: Retrieve measurement details associated with a PO.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Measurement details PO fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Measurement details PO fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-multi-measurement:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get multi-measurement details
 *     description: Retrieve multi-measurement details for complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Multi-measurement details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Multi-measurement details fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-po-filters:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all PO filters
 *     description: Retrieve a list of all PO filters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of PO filters fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of PO filters fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-ro-filters:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all RO filters
 *     description: Retrieve a list of all RO filters based on PO.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of RO filters fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of RO filters fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-complaints-in-pi:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all complaints in PI
 *     description: Retrieve a list of all complaints in proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints in PI fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of complaints in PI fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-measurements-in-pi-status:
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
 * /contractor/get-all-ro-based-on-complaint:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all RO based on complaint
 *     description: Retrieve a list of all RO based on a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of RO based on complaint fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of RO based on complaint fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-po-from-proforma:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all PO from proforma
 *     description: Retrieve a list of all PO numbers from proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of PO from proforma fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of PO from proforma fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-ro-from-proforma:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all RO from proforma
 *     description: Retrieve a list of all RO numbers from proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of RO from proforma fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of RO from proforma fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-bill-number-from-proforma:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Get all bill numbers from proforma
 *     description: Retrieve a list of all bill numbers from proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bill numbers from proforma fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of bill numbers from proforma fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-proforma-invoice/{id}:
 *   post:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Discard proforma invoice by ID
 *     description: Mark a proforma invoice as discarded using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the proforma invoice to discard
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma invoice discarded successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/reactive-to-discard-proforma-invoice/{id}:
 *   post:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: Reactivate discarded proforma invoice
 *     description: Reactivate a previously discarded proforma invoice using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the discarded proforma invoice to reactivate
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma invoice reactivated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/ro-to-billing-from-company:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: RO to billing from company
 *     description: Retrieve RO information for billing from the company.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RO information for billing fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "RO information for billing fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/from-billing-to-company:
 *   get:
 *     tags: [Contractor Routes - Proforma Invoices]
 *     summary: From billing to company
 *     description: Retrieve information from billing to the company.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Information from billing to company fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Information from billing to company fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/generate-proforma-invoice", verifyContractorToken, generateProformaInvoice);
contractorRouter.get("/contractor/get-all-proforma-invoices", verifyContractorToken, getAllProformaInvoices);
contractorRouter.get("/contractor/get-all-merged-proforma-invoice", verifyContractorToken, getAllMergedProformaInvoice);
contractorRouter.get(
    "/contractor/get-single-proforma-invoice/:id",
    verifyContractorToken,
    getProformaInvoicesDetailsById
);
contractorRouter.get(
    "/contractor/get-merged-proforma-invoice/:id",
    verifyContractorToken,
    getMergedProformaInvoicesDetailsById
);
contractorRouter.post(
    "/contractor/update-proforma-invoice-details",
    verifyContractorToken,
    updateProformaInvoiceDetails
);
contractorRouter.delete("/contractor/delete-proforma-invoice/:id", verifyContractorToken, deleteProformaInvoices);
contractorRouter.get("/contractor/get-all-pi-on-po-number/:po_id", verifyContractorToken, getAllProformaInvoiceOnPoId);
contractorRouter.get("/contractor/get-measurements-detail-po", verifyContractorToken, measurementDetailsWithPo);
contractorRouter.get("/contractor/get-multi-measurement", multiComplaints);
contractorRouter.get("/contractor/get-all-po-filters", verifyContractorToken, getAllPOFilters);
contractorRouter.get("/contractor/get-all-ro-filters", verifyContractorToken, getAllROBasedOnPo);
contractorRouter.get("/contractor/get-all-sa-filters", verifyContractorToken, getSalesAreaBasedOnRo);
contractorRouter.get("/contractor/get-all-outlet-filters", verifyContractorToken, getOutletBasedOnSalesArea);
contractorRouter.get("/contractor/get-all-complaint-types-filters", verifyContractorToken, getComplaintTypesFilter);
contractorRouter.get("/contractor/get-all-complaints-in-pi", verifyContractorToken, getAllComplaintsInPI);
contractorRouter.get("/contractor/get-measurements-in-pi-status", verifyContractorToken, getAllMeasurementsInPIStatus);
contractorRouter.get("/contractor/get-area-manager", verifyContractorToken, getAreaManagerForDropdown);
contractorRouter.get("/contractor/get-all-ro-based-on-complaint", verifyContractorToken, getAllROBasedOnComplaint);
contractorRouter.get("/contractor/get-all-po-from-proforma", verifyContractorToken, getAllPOForProforma);
contractorRouter.get("/contractor/get-all-ro-from-proforma", verifyContractorToken, getAllROFromProforma);
contractorRouter.get(
    "/contractor/get-all-sales-area-from-proforma",
    verifyContractorToken,
    getAllSalesAreaFromProforma
);
contractorRouter.get("/contractor/get-all-outlet-from-proforma", verifyContractorToken, getAllOutletFromProforma);
contractorRouter.get(
    "/contractor/get-all-financial-year-from-proforma",
    verifyContractorToken,
    getFinancialYearFromProforma
);
contractorRouter.get("/contractor/get-all-bill-from-proforma", verifyContractorToken, getAllBillNumberFromProforma);
contractorRouter.get(
    "/contractor/get-all-complaint-types-from-proforma",
    verifyContractorToken,
    getComplaintTypeFromProforma
);
contractorRouter.post("/contractor/discard-proforma-invoice/:id", verifyContractorToken, discardProformaInvoices);
contractorRouter.post(
    "/contractor/reactive-to-discard-proforma-invoice/:id",
    verifyContractorToken,
    reactiveToDiscardPi
);
contractorRouter.get("/contractor/ro-to-billing-from-company", verifyContractorToken, roToBillingFromCompany);
contractorRouter.get("/contractor/from-billing-to-company", verifyContractorToken, fromBillingToCompany);

// merged proforma invoice

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Merged Proforma Invoices
 *   description: API endpoints for managing merged proforma invoices.
 */

/**
 * @swagger
 * /contractor/get-all-pi-merged-performa:
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
 * /contractor/merged-proforma-invoice-list:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get merged proforma invoice list
 *     description: Retrieve a list of merged proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Merged proforma invoice list fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Merged proforma invoice list fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-merged-pi:
 *   post:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Discard merged proforma invoice
 *     description: Discard a merged proforma invoice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Merged proforma invoice discarded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/merged-proforma-invoice:
 *   post:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Merge proforma invoices
 *     description: Create a merged proforma invoice from multiple proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Proforma invoices merged successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/merged-proforma-invoice-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get merged proforma invoice by ID
 *     description: Retrieve details of a specific merged proforma invoice using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the merged proforma invoice to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merged proforma invoice details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Merged proforma invoice details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Merged proforma invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-listing-pi-and-mpi:
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
 * /contractor/get-all-pi-listing:
 *   post:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get all PI listing
 *     description: Retrieve a list of all proforma invoices.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: List of proforma invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of proforma invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get("/contractor/get-all-pi-merged-performa", verifyContractorToken, getAllProformaInvoicesInMergedPI);
contractorRouter.get("/contractor/merged-proforma-invoice-list", verifyContractorToken, getMergedPiList);
contractorRouter.post("/contractor/discard-merged-pi", verifyContractorToken, discardMergedPI);
contractorRouter.post("/contractor/merged-proforma-invoice", verifyContractorToken, mergedPi);
contractorRouter.get(
    "/contractor/merged-proforma-invoice-by-id/:id",
    verifyContractorToken,
    getMergedPerfomaInvoiceById
);
contractorRouter.get("/contractor/get-all-listing-pi-and-mpi", verifyContractorToken, getAllProformaInvoicesInInvoice);
contractorRouter.post("/contractor/get-all-pi-listing", verifyContractorToken, getPiList);

//invoice data routes

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Invoice Data
 *   description: API endpoints for managing invoice data.
 */

/**
 * @swagger
 * /contractor/create-invoice-data:
 *   post:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Create invoice data
 *     description: Create a new invoice entry.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Invoice data created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-invoice-data:
 *   post:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Update invoice data
 *     description: Update an existing invoice entry.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Invoice data updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-invoice-data:
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

/**
 * @swagger
 * /contractor/get-single-invoice-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Get single invoice details by ID
 *     description: Retrieve details of a specific invoice using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the invoice to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Invoice details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-invoice-details/{id}:
 *   delete:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Delete invoice data by ID
 *     description: Delete a specific invoice entry using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the invoice to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice data deleted successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-invoice/{id}:
 *   post:
 *     tags: [Contractor Routes - Invoice Data]
 *     summary: Discard invoice
 *     description: Mark an invoice as discarded.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the invoice to discard
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice discarded successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-invoice-in-payments:
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
contractorRouter.post("/contractor/create-invoice-data", verifyContractorToken, createInvoiceData);
contractorRouter.post("/contractor/update-invoice-data", verifyContractorToken, updateInvoiceData);
contractorRouter.get("/contractor/get-all-invoice-data", verifyContractorToken, getAllInvoices);
contractorRouter.get("/contractor/get-single-invoice-details/:id", verifyContractorToken, getInvoiceDetailById);
contractorRouter.delete("/contractor/delete-invoice-details/:id", verifyContractorToken, deleteInvoiceData);
contractorRouter.post("/contractor/discard-invoice/:id", verifyContractorToken, discardInvoice);
contractorRouter.get("/contractor/get-all-invoice-in-payments", verifyContractorToken, getAllInvoicesListingInPayments);

// merge invoice

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Merge Invoice
 *   description: API endpoints for managing merged invoices.
 */

/**
 * @swagger
 * /contractor/merge-invoice:
 *   post:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Merge invoices
 *     description: Merge multiple invoices into a single invoice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Invoices merged successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-merged-invoice:
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

/**
 * @swagger
 * /contractor/get-merged-invoice-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get merged invoice by ID
 *     description: Retrieve details of a specific merged invoice using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the merged invoice to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merged invoice details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Merged invoice details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Merged invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-merged-invoice/{id}:
 *   post:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Discard merged invoice
 *     description: Mark a merged invoice as discarded using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the merged invoice to discard
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Merged invoice discarded successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Merged invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-po-for-invoices:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all PO for invoices
 *     description: Retrieve a list of all POs associated with invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all POs for invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all POs for invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-ro-for-invoice:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all RO for invoices
 *     description: Retrieve a list of all ROs associated with invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all ROs for invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all ROs for invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-billing_from-company-invoice:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all billing from company invoices
 *     description: Retrieve a list of all billing entries from company invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all billing entries from company invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all billing entries from company invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-billing-to-company-invoice:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all billing to company invoices
 *     description: Retrieve a list of all billing entries to company invoices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all billing entries to company invoices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all billing entries to company invoices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-invoice-data-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Merge Invoice]
 *     summary: Get all invoice data by ID
 *     description: Retrieve details of all invoice data associated with the given ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the invoice data to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Invoice data fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Invoice data not found
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/merge-invoice", verifyContractorToken, mergeInvoice);
contractorRouter.get("/contractor/get-all-merged-invoice", verifyContractorToken, getAllMergedInvoices);
contractorRouter.get("/contractor/get-merged-invoice-by-id/:id", verifyContractorToken, getMergedInvoiceDetailById);
contractorRouter.post("/contractor/discard-merged-invoice/:id", verifyContractorToken, discardMergedInvoice);
contractorRouter.get("/contractor/get-all-po-for-invoices", verifyContractorToken, getAllPOForInvoices);
contractorRouter.get("/contractor/get-all-ro-for-invoice", verifyContractorToken, getAllROForInvoices);
contractorRouter.get("/contractor/get-all-sales-area-for-invoice", verifyContractorToken, getAllSalesAreaForInvoices);
contractorRouter.get(
    "/contractor/get-all-billing_from-company-invoice",
    verifyContractorToken,
    getAllBillingFromCompany
);
contractorRouter.get(
    "/contractor/get-all-billing-to-company-invoice",
    verifyContractorToken,
    fromBillingToCompanyInInvoice
);
contractorRouter.get(
    "/contractor/get-all-complaint-types-for-invoice",
    verifyContractorToken,
    getAllComplaintTypesForInvoices
);
contractorRouter.get("/contractor/get-all-invoice-data-by-id/:id", verifyContractorToken, getMergedInvoiceDetailByIds);

//------------------Merge proforma invoices----------------

/**
 * @swagger
 * /contractor/merge-pi-to-invoice:
 *   post:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Merge Proforma Invoice to Invoice
 *     description: Merge a proforma invoice into an invoice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Proforma invoice merged into invoice successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-ro-in-paid-payment:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get Regional Office in Paid Payment
 *     description: Retrieve a list of all regional offices involved in paid payments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all regional offices in paid payment fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all regional offices in paid payment fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-area-manager-in-paid-payment:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get Area Manager in Paid Payment
 *     description: Retrieve a list of all area managers involved in paid payments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all area managers in paid payment fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all area managers in paid payment fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-po-in-paid-payment:
 *   get:
 *     tags: [Contractor Routes - Merged Proforma Invoices]
 *     summary: Get PO in Paid Payment
 *     description: Retrieve a list of all POs involved in paid payments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all POs in paid payment fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "List of all POs in paid payment fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

contractorRouter.post("/contractor/merge-pi-to-invoice/", verifyContractorToken, mergePItoInvoice);
contractorRouter.get("/contractor/get-ro-in-paid-payment", verifyContractorToken, getRegionalOfficeInPaidPayment);
contractorRouter.get(
    "/contractor/get-area-manager-in-paid-payment",
    verifyContractorToken,
    getAreaManagerInPaidPayment
);
contractorRouter.get("/contractor/get-po-in-paid-payment", verifyContractorToken, getPoNumberInPaidPayment);

// ------------------------ payment Received ------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Payment Received
 *   description: API endpoints for managing payment received.
 */

/**
 * @swagger
 * /contractor/add-payment-to-invoice:
 *   post:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Add Payment to Invoice
 *     description: Record a payment received for an invoice.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Payment added to invoice successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-received-by-status:
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

/**
 * @swagger
 * /contractor/get-payment-received-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Get Payment Received by ID
 *     description: Retrieve details of a payment received by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment received
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-payment-received-by-id:
 *   post:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Update Payment Received by ID
 *     description: Update details of a payment received by its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/listing-pv-number:
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
 * /contractor/update-payment-retention:
 *   post:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Update Payment Retention
 *     description: Update the payment retention details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment retention updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-history:
 *   get:
 *     tags: [Contractor Routes - Payment Received]
 *     summary: Get Payment History
 *     description: Retrieve the payment history.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment history fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/add-payment-to-invoice", verifyContractorToken, addPaymentReceive);
contractorRouter.get("/contractor/get-payment-received-by-status", verifyContractorToken, getAllPaymentReceive);
contractorRouter.get("/contractor/get-payment-received-by-id/:id", verifyContractorToken, getPaymentReceiveDetailsById);
contractorRouter.post("/contractor/update-payment-received-by-id", verifyContractorToken, updatePaymentReceive);
contractorRouter.get("/contractor/listing-pv-number", verifyContractorToken, listingOfPvNumber);
contractorRouter.post("/contractor/update-payment-retention", verifyContractorToken, updatePaymentReceiveInRetention);
contractorRouter.get("/contractor/get-payment-history", verifyContractorToken, getListingofPaymentHistory);

// ----------------------- payment Retention -----------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Payment Retention
 *   description: API endpoints for managing payment retention.
 */

/**
 * @swagger
 * /contractor/get-payment-received-in-retention-by-status:
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
 * /contractor/get-all-payment-retention:
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

/**
 * @swagger
 * /contractor/update-payment-retention-status:
 *   post:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Update Payment Retention Status
 *     description: Update the status of a payment retention record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment retention status updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/approve-payment-retention:
 *   post:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Approve Payment Retention
 *     description: Approve a payment retention record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment retention approved successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/discard-payment-retention/{id}:
 *   post:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Discard Payment Retention
 *     description: Discard a payment retention record by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment retention record to discard
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment retention discarded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-payment-amount-retention:
 *   post:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Update Payment Amount Retention
 *     description: Update the amount retention details for a payment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment amount retention updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-ro-for-dropdown:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get RO for Dropdown
 *     description: Retrieve a list of regional offices for a dropdown.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of regional offices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Regional offices fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-retention-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get Payment Retention by ID
 *     description: Retrieve details of a payment retention record by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment retention record
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment retention details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment retention details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-po-for-payment-retention:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get PO for Payment Retention
 *     description: Retrieve a list of purchase orders for payment retention.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase orders fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Purchase orders fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-retention-id-for-dropdown:
 *   get:
 *     tags: [Contractor Routes - Payment Retention]
 *     summary: Get Retention ID for Dropdown
 *     description: Retrieve a list of retention IDs for a dropdown.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of retention IDs fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Retention IDs fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.get(
    "/contractor/get-payment-received-in-retention-by-status",
    verifyContractorToken,
    getAllPaymentReceiveInPayment
);
contractorRouter.get("/contractor/get-all-payment-retention", verifyContractorToken, getAllPaymentRetention);
contractorRouter.post(
    "/contractor/update-payment-retention-status",
    verifyContractorToken,
    updatePaymentRetentionStatus
);
contractorRouter.post("/contractor/approve-payment-retention", verifyContractorToken, approvePaymentRetention);
contractorRouter.post("/contractor/discard-payment-retention/:id", verifyContractorToken, discardPaymentRetention);
contractorRouter.post(
    "/contractor/update-payment-amount-retention",
    verifyContractorToken,
    updatePaymentAmountRetention
);

contractorRouter.get("/contractor/get-ro-for-dropdown", verifyContractorToken, getRoForDropdown);
contractorRouter.get("/contractor/get-sales-area-for-dropdown", verifyContractorToken, getSalesAreaForDropdown);
contractorRouter.get("/contractor/get-outlet-for-dropdown", verifyContractorToken, getOutletForDropdown);
contractorRouter.get("/contractor/get-complaint-type-for-dropdown", verifyContractorToken, getComplaintTypeForDropdown);
contractorRouter.get("/contractor/get-billing-from-for-dropdown", verifyContractorToken, getBillingFromForDropdown);
contractorRouter.get("/contractor/get-billing-to-for-dropdown", verifyContractorToken, getBillingToForDropdown);
contractorRouter.get(
    "/contractor/get-payment-retention-by-id/:id",
    verifyContractorToken,
    getPaymentRetentionDetailsById
);
contractorRouter.get("/contractor/get-po-for-payment-retention", verifyContractorToken, getPoForDropdown);
contractorRouter.get("/contractor/get-retention-id-for-dropdown", verifyContractorToken, getRetentinIdForDropdown);

//------------------------------------- Payment Setting routes--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Payment Settings
 *   description: API endpoints for managing payment settings.
 */

/**
 * @swagger
 * /contractor/create-payment-setting:
 *   post:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Create Payment Setting
 *     description: Add a new payment setting.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Payment setting created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-payment-setting:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get All Payment Settings
 *     description: Retrieve all payment settings.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payment settings fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "All payment settings fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-setting-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get Payment Setting by ID
 *     description: Retrieve details of a payment setting by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment setting
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment setting details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment setting details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-payment-setting:
 *   post:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Update Payment Setting
 *     description: Update details of an existing payment setting.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: Payment setting updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/delete-payment-setting/{id}:
 *   delete:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Delete Payment Setting
 *     description: Delete a payment setting by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment setting to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment setting deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-expense-punch-and-stock:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get Expense Punch and Stock Total Amount
 *     description: Retrieve the total amount for expense punch and stock.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense punch and stock total amount fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Expense punch and stock total amount fetched successfully"
 *               data: { total_amount: 12345.67 }
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/payment-paid:
 *   post:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Add Payment Paid
 *     description: Record a payment that has been paid.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/otp-verify-in-payment-paid:
 *   post:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: OTP Verification in Payment Paid
 *     description: Verify OTP for payment paid transactions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-area-manager-transactions:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get All Area Manager Transactions
 *     description: Retrieve all transactions for area managers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of area manager transactions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Area manager transactions fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-area-manager-transactions:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get Area Manager Transactions by ID
 *     description: Retrieve area manager transactions by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: The ID of the area manager transactions
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Area manager transactions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Area manager transactions fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-paid:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get Payment Paid
 *     description: Retrieve details of payment paid records.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment paid details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment paid details fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-payment-paid-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Get Payment Paid by ID
 *     description: Retrieve payment paid details by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the payment paid record
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment paid details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Payment paid details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/resend-otp-in-payment-paid:
 *   post:
 *     tags: [Contractor Routes - Payment Settings]
 *     summary: Resend OTP in Payment Paid
 *     description: Resend OTP for payment paid transactions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/create-payment-setting", verifyContractorToken, addPaymentSetting);
contractorRouter.get("/contractor/get-all-payment-setting", verifyContractorToken, getAllPaymentSettings);
contractorRouter.get("/contractor/get-payment-setting-by-id/:id", verifyContractorToken, getPaymentSettingDetailsById);
contractorRouter.post("/contractor/update-payment-setting", verifyContractorToken, updatePaymentSetting);
contractorRouter.delete("/contractor/delete-payment-setting/:id", verifyContractorToken, deletePaymentSetting);
contractorRouter.get(
    "/contractor/get-expense-punch-and-stock",
    verifyContractorToken,
    getExpensePunchAndStockTotalAmount
);
contractorRouter.post("/contractor/payment-paid", verifyContractorToken, addPaymentPaid);
contractorRouter.post("/contractor/otp-verify-in-payment-paid", verifyContractorToken, otpVerifyInPaymentPaid);
contractorRouter.get(
    "/contractor/get-all-area-manager-transactions",
    verifyContractorToken,
    getAreaManagerTransactions
);
contractorRouter.get(
    "/contractor/get-area-manager-transactions",
    verifyContractorToken,
    getAreaManagerTransactionsById
);
contractorRouter.get("/contractor/get-payment-paid", verifyContractorToken, getPaymentPaid);
contractorRouter.get("/contractor/get-payment-paid-by-id/:id", verifyContractorToken, getPaymentPaidById);
contractorRouter.post("/contractor/resend-otp-in-payment-paid", verifyContractorToken, resendOtp);
contractorRouter.post("/contractor/import-promotion", verifyContractorToken, importPromotion);

//------------------------------------payment routes for ro paid--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - RO Payment
 *   description: API endpoints for managing Regional Office (RO) payments.
 */

/**
 * @swagger
 * /contractor/add-ro-payment-paid:
 *   post:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Add RO Payment Paid
 *     description: Record a payment that has been paid for a Regional Office (RO).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       201:
 *         description: RO payment recorded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-ro-payment-paid:
 *   get:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Get All RO Payments Paid
 *     description: Retrieve details of all payments that have been paid for Regional Offices (RO).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RO payment details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "RO payment details fetched successfully"
 *               data: [{ id: 1, // other fields }]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-ro-payment-paid-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Get RO Payment by ID
 *     description: Retrieve payment details by ID for a Regional Office (RO).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the RO payment record
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: RO payment details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "RO payment details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-ro-payment-paid:
 *   post:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Update RO Payment Paid
 *     description: Update details of a payment that has been paid for a Regional Office (RO).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *             example:
 *               // Provide an example request body here
 *     responses:
 *       200:
 *         description: RO payment updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-transactions-balance-of-ro:
 *   get:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Get Transactions Balance of RO
 *     description: Retrieve the transactions balance for a Regional Office (RO).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RO transactions balance fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "RO transactions balance fetched successfully"
 *               data: { balance: 12345.67 }
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-transactions-ro-by-id:
 *   get:
 *     tags: [Contractor Routes - RO Payment]
 *     summary: Get RO Transactions by ID
 *     description: Retrieve details of transactions by ID for a Regional Office (RO).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: The ID of the RO transactions record
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: RO transactions details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "RO transactions details fetched successfully"
 *               data: { id: 1, // other fields }
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
contractorRouter.post("/contractor/add-ro-payment-paid", verifyContractorToken, addPaymentPaidforRo);
contractorRouter.get("/contractor/get-ro-payment-paid", verifyContractorToken, getRoPaymentPaid);
contractorRouter.get("/contractor/get-ro-payment-paid-by-id/:id", verifyContractorToken, getPaymentPaidRoById);
contractorRouter.get("/contractor/get-po-details-in-ro-payments", verifyContractorToken, getRoPaymentPaidByPoDetails);
contractorRouter.get("/contractor/get-po-details-in-ro-payments-by-id/:id", verifyContractorToken, getPoTransactionsById);
contractorRouter.post("/contractor/update-ro-payment-paid", verifyContractorToken, updatePaymentRoPaid);
contractorRouter.get("/contractor/get-transactions-balance-of-ro", verifyContractorToken, roTransactions);
contractorRouter.get("/contractor/get-transactions-balance-of-po", verifyContractorToken, poTransactions);
contractorRouter.get("/contractor/get-transactions-ro-by-id", verifyContractorToken, getRoTransactionsById);

//------------------------------------manager promotional routes--------------------------------

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Manager Promotional
 *     description: Routes for managing promotional managers.
 */

/**
 * @swagger
 * /contractor/add-promotional-manager:
 *   post:
 *     summary: Add a new promotional manager.
 *     tags: [Contractor Routes - Manager Promotional]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Data for creating a promotional manager.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerName:
 *                 type: string
 *                 example: "John Doe"
 *               ratio:
 *                 type: number
 *                 example: 0.15
 *     responses:
 *       201:
 *         description: Promotional manager created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /contractor/get-all-promotional-manager:
 *   get:
 *     summary: Get a list of all promotional managers.
 *     tags: [Contractor Routes - Manager Promotional]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of promotional managers.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /contractor/get-promotional-manager/{id}:
 *   get:
 *     summary: Get details of a specific promotional manager by ID.
 *     tags: [Contractor Routes - Manager Promotional]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the promotional manager to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotional manager details retrieved successfully.
 *       404:
 *         description: Promotional manager not found.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /contractor/update-promotional-manager:
 *   post:
 *     summary: Update an existing promotional manager.
 *     tags: [Contractor Routes - Manager Promotional]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Data for updating the promotional manager.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "60d5ec59e77f7b3a27c8a8f8"
 *               managerName:
 *                 type: string
 *                 example: "John Doe"
 *               ratio:
 *                 type: number
 *                 example: 0.20
 *     responses:
 *       200:
 *         description: Promotional manager updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Promotional manager not found.
 *       401:
 *         description: Unauthorized access.
 */

contractorRouter.post("/contractor/add-promotional-manager", verifyContractorToken, createAreaManagerRatio);
contractorRouter.get("/contractor/get-all-promotional-manager", verifyContractorToken, getAllAreaManager);
contractorRouter.get("/contractor/get-promotional-manager/:id", verifyContractorToken, getAreaManagerById);
contractorRouter.post("/contractor/update-promotional-manager", verifyContractorToken, updateAreaManager);
contractorRouter.post("/contractor/import-area-manager-ratio", verifyContractorToken, importAreaManagerRatio);

//-------------------------Company details routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Company Details
 *   description: API endpoints for managing company details.
 */

/**
 * @swagger
 * /contractor/get-all-company-details:
 *   get:
 *     summary: Retrieve all company details
 *     tags: [Contractor Routes - Company Details]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all company details.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-company-details-by-company-id/{id}:
 *   get:
 *     summary: Retrieve company details by company ID
 *     tags: [Contractor Routes - Company Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     responses:
 *       200:
 *         description: Successfully retrieved company details.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaints-to-company-details:
 *   post:
 *     summary: Get complaints related to company details
 *     tags: [Contractor Routes - Company Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: string
 *                 description: The ID of the complaint.
 *     responses:
 *       200:
 *         description: Successfully retrieved complaints related to the company.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
// contractorRouter.get("/contractor/get-all-company-details", verifyContractorToken, getAllCompanyForDropdown);
contractorRouter.get("/contractor/get-all-company-details", verifyContractorToken, getAllClientAndVendorCompanies);
contractorRouter.get("/contractor/get-company-details-by-company-id/:id", verifyContractorToken, getCompanyDetailsById);
contractorRouter.post("/contractor/get-complaints-to-company-details", verifyContractorToken, getComplaintName);

//-------------------------Regional office routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Regional Office
 *   description: API endpoints for managing regional office details.
 */

/**
 * @swagger
 * /contractor/get-all-regional-office-details:
 *   get:
 *     summary: Retrieve all regional office details
 *     tags: [Contractor Routes - Regional Office]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all regional office details.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

contractorRouter.get(
    "/contractor/get-all-regional-office-details",
    verifyContractorToken,
    getAllRegionalOfficeForDropdown
);

//-------------------------State routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - State
 *   description: API endpoints for managing state-related operations.
 */

/**
 * @swagger
 * /contractor/get-all-state-details:
 *   get:
 *     summary: Retrieve all state details
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all state details.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-po-details:
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
 * /contractor/get-all-complaint-types:
 *   get:
 *     summary: Retrieve all complaint types
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all complaint types.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-outlet-by-sale-area/{id}:
 *   get:
 *     summary: Retrieve outlets by sale area ID
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sale area ID
 *     responses:
 *       200:
 *         description: Successfully retrieved outlets by sale area ID.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Outlets not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/upload-image-with-watermark:
 *   post:
 *     summary: Upload an image with a watermark
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               watermark:
 *                 type: string
 *                 description: Watermark text
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/upload-image-in-base-64:
 *   post:
 *     summary: Upload an image in Base64 format
 *     tags: [Contractor Routes - State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-all-state-details", verifyContractorToken, getAllStateForDropdown);
contractorRouter.get("/contractor/get-all-po-details", verifyContractorToken, getAllPurchaseOrder);
contractorRouter.get("/contractor/get-all-complaint-types", verifyContractorToken, getComplaintType);
contractorRouter.get("/contractor/get-outlet-by-sale-area/:id", verifyContractorToken, getOutletBySaleArea);
contractorRouter.post("/contractor/upload-image-with-watermark", verifyContractorToken, uploadImageWithWaterMark);
contractorRouter.post("/contractor/upload-image-in-base-64", verifyContractorToken, convertBase64Image);

//---------------------Security money routes--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Security Money
 *   description: API endpoints for managing security money details.
 */

/**
 * @swagger
 * /contractor/add-security-money:
 *   post:
 *     summary: Add security money details.
 *     tags: [Contractor Routes - Security Money]
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
 *                 description: The amount of security money.
 *               contractorId:
 *                 type: string
 *                 description: The ID of the contractor.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the security money.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the security money.
 *     responses:
 *       200:
 *         description: Security money added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-security-money-list:
 *   get:
 *     summary: Get a list of all security money details.
 *     tags: [Contractor Routes - Security Money]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all security money details.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-security-money-details/{id}:
 *   get:
 *     summary: Get security money details by ID.
 *     tags: [Contractor Routes - Security Money]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the security money.
 *     responses:
 *       200:
 *         description: Security money details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Security money not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-security-money-details:
 *   post:
 *     summary: Update security money details.
 *     tags: [Contractor Routes - Security Money]
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
 *                 description: The ID of the security money.
 *               amount:
 *                 type: number
 *                 description: The updated amount of security money.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The updated start date of the security money.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The updated end date of the security money.
 *     responses:
 *       200:
 *         description: Security money details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Security money not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-security-money-details/{id}:
 *   delete:
 *     summary: Delete security money details by ID.
 *     tags: [Contractor Routes - Security Money]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the security money to delete.
 *     responses:
 *       200:
 *         description: Security money details deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Security money not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/add-security-money", verifyContractorToken, addSecurityMoney);
contractorRouter.get("/contractor/get-all-security-money-list", verifyContractorToken, getAllSecurityMoney);
contractorRouter.get("/contractor/get-security-money-details/:id", verifyContractorToken, getSecurityMoneyDetailById);
contractorRouter.post("/contractor/update-security-money-details", verifyContractorToken, updateSecurityMoney);
contractorRouter.delete(
    "/contractor/delete-security-money-details/:id",
    verifyContractorToken,
    deleteSecurityMoneyDetailById
);

//---------------------category routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Category
 *   description: API endpoints for managing categories.
 */

/**
 * @swagger
 * /contractor/create-category:
 *   post:
 *     summary: Create a new category.
 *     tags: [Contractor Routes - Category]
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
 *                 description: The name of the category.
 *               description:
 *                 type: string
 *                 description: A brief description of the category.
 *     responses:
 *       200:
 *         description: Category created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-category:
 *   get:
 *     summary: Get a list of all categories.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all categories.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-category-detail/{id}:
 *   get:
 *     summary: Get category details by ID.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category.
 *     responses:
 *       200:
 *         description: Category details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-category-detail:
 *   post:
 *     summary: Update category details.
 *     tags: [Contractor Routes - Category]
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
 *                 description: The ID of the category.
 *               name:
 *                 type: string
 *                 description: The updated name of the category.
 *               description:
 *                 type: string
 *                 description: The updated description of the category.
 *     responses:
 *       200:
 *         description: Category details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-category-detail/{id}:
 *   delete:
 *     summary: Delete category details by ID.
 *     tags: [Contractor Routes - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category details deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-category", verifyContractorToken, createCategory);
contractorRouter.get("/contractor/get-all-category", verifyContractorToken, getAllCategory);
contractorRouter.get("/contractor/get-category-detail/:id", verifyContractorToken, getCategoryDetailById);
contractorRouter.post("/contractor/update-category-detail", verifyContractorToken, updateCategory);
contractorRouter.delete("/contractor/delete-category-detail/:id", verifyContractorToken, deleteCategoryById);

//----------------------Product routes--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Product
 *   description: API endpoints for managing products.
 */

/**
 * @swagger
 * /contractor/product-add:
 *   post:
 *     summary: Add a new product.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: A brief description of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               category:
 *                 type: string
 *                 description: The category ID to which the product belongs.
 *     responses:
 *       200:
 *         description: Product added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-list:
 *   get:
 *     summary: Get a list of all products.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all products.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-detail/{id}:
 *   get:
 *     summary: Get product details by ID.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product.
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-detail-update:
 *   post:
 *     summary: Update product details.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The ID of the product.
 *               name:
 *                 type: string
 *                 description: The updated name of the product.
 *               description:
 *                 type: string
 *                 description: The updated description of the product.
 *               price:
 *                 type: number
 *                 description: The updated price of the product.
 *               category:
 *                 type: string
 *                 description: The updated category ID of the product.
 *     responses:
 *       200:
 *         description: Product details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-product/{id}:
 *   delete:
 *     summary: Delete a product by ID.
 *     tags: [Contractor Routes - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/product-publish-status-update:
 *   post:
 *     summary: Update the publish status of a product.
 *     tags: [Contractor Routes - Product]
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
 *                 description: The ID of the product.
 *               status:
 *                 type: boolean
 *                 description: The publish status of the product.
 *     responses:
 *       200:
 *         description: Product publish status updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/product-add", verifyContractorToken, addProduct);
contractorRouter.get("/contractor/product-list", verifyContractorToken, getAllProducts);
contractorRouter.get("/contractor/product-detail/:id", verifyContractorToken, getProductDetailById);
contractorRouter.post("/contractor/product-detail-update", verifyContractorToken, updateProduct);
contractorRouter.delete("/contractor/delete-product/:id", verifyContractorToken, removedProductById);
contractorRouter.post("/contractor/product-publish-status-update", verifyContractorToken, publishedProduct);

//------------------------Cash Request routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Cash Request
 *   description: API endpoints for managing cash requests.
 */

/**
 * @swagger
 * /contractor/request-cash:
 *   post:
 *     summary: Submit a cash request.
 *     tags: [Contractor Routes - Cash Request]
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
 *                 description: The amount of cash requested.
 *               reason:
 *                 type: string
 *                 description: The reason for the cash request.
 *     responses:
 *       200:
 *         description: Cash request submitted successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-logged-user-cash-requested:
 *   get:
 *     summary: Get all cash requests made by the logged-in user.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all cash requests made by the logged-in user.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-cash-requested-detail/{id}:
 *   get:
 *     summary: Get details of a specific cash request by ID.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cash request.
 *     responses:
 *       200:
 *         description: Cash request details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cash request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-cash-requested-detail:
 *   post:
 *     summary: Update details of a cash request.
 *     tags: [Contractor Routes - Cash Request]
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
 *                 description: The ID of the cash request.
 *               amount:
 *                 type: number
 *                 description: The updated amount of cash requested.
 *               reason:
 *                 type: string
 *                 description: The updated reason for the cash request.
 *     responses:
 *       200:
 *         description: Cash request details updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cash request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-cash-request/{id}:
 *   delete:
 *     summary: Delete a cash request by ID.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cash request to delete.
 *     responses:
 *       200:
 *         description: Cash request deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cash request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-cash-request-status:
 *   post:
 *     summary: Update the status of a cash request.
 *     tags: [Contractor Routes - Cash Request]
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
 *                 description: The ID of the cash request.
 *               status:
 *                 type: string
 *                 description: The new status of the cash request (e.g., approved, rejected).
 *     responses:
 *       200:
 *         description: Cash request status updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cash request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-cash-requested-list:
 *   get:
 *     summary: Get a list of all cash requests.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all cash requests.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-cash-request-list:
 *   get:
 *     summary: Get a list of all approved cash requests.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all approved cash requests.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-rejected-cash-request-list:
 *   get:
 *     summary: Get a list of all rejected cash requests.
 *     tags: [Contractor Routes - Cash Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all rejected cash requests.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/request-cash", verifyContractorToken, requestCash);
contractorRouter.get(
    "/contractor/get-all-logged-user-cash-requested",
    verifyContractorToken,
    getAllLoggedUserCashRequested
);
contractorRouter.get("/contractor/get-cash-requested-detail/:id", verifyContractorToken, getCashRequestedDetailById);
contractorRouter.post("/contractor/update-cash-requested-detail", verifyContractorToken, updatedRequestedCashDetail);
contractorRouter.delete("/contractor/delete-cash-request/:id", verifyContractorToken, deleteRequestedCashDetail);
contractorRouter.post("/contractor/update-cash-request-status", verifyContractorToken, cashRequestStatusAction);
contractorRouter.get("/contractor/get-all-cash-requested-list", verifyContractorToken, getAllCashRequestedList);
contractorRouter.get(
    "/contractor/get-all-approved-cash-request-list",
    verifyContractorToken,
    getAllApprovedCashRequest
);
contractorRouter.get(
    "/contractor/get-all-rejected-cash-request-list",
    verifyContractorToken,
    getAllRejectedCashRequest
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
contractorRouter.post("/contractor/add-payment-method", verifyContractorToken, addPaymentMethod);
contractorRouter.get("/contractor/get-all-payment-methods", verifyContractorToken, getAllMethods);
contractorRouter.get(
    "/contractor/get-all-payment-methods-for-dropdown",
    verifyContractorToken,
    getAllMethodsForDropdown
);
contractorRouter.delete("/contractor/delete-payment-methods/:id", verifyContractorToken, deleteMethod);
contractorRouter.get("/contractor/get-single-payment-method-details/:id", verifyContractorToken, getMethodDetailById);
contractorRouter.post("/contractor/update-payment-method", verifyContractorToken, updatePaymentMethod);

//-------------------------Expense category routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Expense Category
 *   description: API endpoints for managing expense categories.
 */

/**
 * @swagger
 * /contractor/add-expense-category:
 *   post:
 *     summary: Add a new expense category.
 *     tags: [Contractor Routes - Expense Category]
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
 *                 description: Name of the expense category.
 *               details:
 *                 type: string
 *                 description: Details of the expense category.
 *     responses:
 *       200:
 *         description: Expense category added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-expense-category:
 *   post:
 *     summary: Update an existing expense category.
 *     tags: [Contractor Routes - Expense Category]
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
 *                 description: ID of the expense category to update.
 *               name:
 *                 type: string
 *                 description: Updated name of the expense category.
 *               details:
 *                 type: string
 *                 description: Updated details of the expense category.
 *     responses:
 *       200:
 *         description: Expense category updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-expense-category/{id}:
 *   get:
 *     summary: Retrieve details of an expense category by ID.
 *     tags: [Contractor Routes - Expense Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense category.
 *     responses:
 *       200:
 *         description: Expense category details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-expense-category-for-dropdown:
 *   get:
 *     summary: Get a list of expense categories for dropdown selection.
 *     tags: [Contractor Routes - Expense Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expense categories for dropdown.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-expense-category:
 *   get:
 *     summary: Get a list of all expense categories.
 *     tags: [Contractor Routes - Expense Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all expense categories.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-expense-category/{id}:
 *   delete:
 *     summary: Delete an expense category by ID.
 *     tags: [Contractor Routes - Expense Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense category to delete.
 *     responses:
 *       200:
 *         description: Expense category deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense category not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/add-expense-category", verifyContractorToken, addExpenseCategory);
contractorRouter.post("/contractor/update-expense-category", verifyContractorToken, updateExpenseCategory);
contractorRouter.get("/contractor/get-expense-category/:id", verifyContractorToken, fetchExpenseCategory);
contractorRouter.get(
    "/contractor/get-expense-category-for-dropdown",
    verifyContractorToken,
    getExpenseCategoryForDropdown
);
contractorRouter.get("/contractor/get-all-expense-category", verifyContractorToken, getExpenseCategory);
contractorRouter.delete("/contractor/delete-expense-category/:id", verifyContractorToken, deleteExpenseCategory);

//------------------------Expense cash routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Expense Cash
 *   description: API endpoints for managing cash expenses.
 */

/**
 * @swagger
 * /contractor/add-expense-cash:
 *   post:
 *     summary: Add a new cash expense.
 *     tags: [Contractor Routes - Expense Cash]
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
 *                 description: Amount of the expense.
 *               description:
 *                 type: string
 *                 description: Description of the expense.
 *               category:
 *                 type: string
 *                 description: Category of the expense.
 *     responses:
 *       200:
 *         description: Expense added successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-logged-user-expenses:
 *   get:
 *     summary: Retrieve all expenses logged by the user.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all logged user expenses.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-expense-details/{id}:
 *   get:
 *     summary: Retrieve details of an expense by ID.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense.
 *     responses:
 *       200:
 *         description: Expense details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-expense-details:
 *   post:
 *     summary: Update details of an existing expense.
 *     tags: [Contractor Routes - Expense Cash]
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
 *                 description: ID of the expense to update.
 *               amount:
 *                 type: number
 *                 description: Updated amount of the expense.
 *               description:
 *                 type: string
 *                 description: Updated description of the expense.
 *               category:
 *                 type: string
 *                 description: Updated category of the expense.
 *     responses:
 *       200:
 *         description: Expense updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-expense-details/{id}:
 *   delete:
 *     summary: Delete an expense by ID.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense to delete.
 *     responses:
 *       200:
 *         description: Expense deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-expense-details:
 *   post:
 *     summary: Approve or reject an expense.
 *     tags: [Contractor Routes - Expense Cash]
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
 *                 description: ID of the expense to approve or reject.
 *               status:
 *                 type: string
 *                 description: Status to set for the expense (approved/rejected).
 *     responses:
 *       200:
 *         description: Expense status updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-requested-expenses:
 *   get:
 *     summary: Retrieve all requested expenses.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all requested expenses.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-expense-request-by-month:
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
 * /contractor/get-all-expense-request-by-id/{id}:
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

/**
 * @swagger
 * /contractor/get-approve-item-price/{id}/{request_by}:
 *   get:
 *     summary: Retrieve item prices for approval.
 *     tags: [Contractor Routes - Expense Cash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item.
 *       - in: path
 *         name: request_by
 *         required: true
 *         schema:
 *           type: string
 *         description: The person or entity requesting the item.
 *     responses:
 *       200:
 *         description: Item prices for approval retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/add-expense-cash", verifyContractorToken, addExpenses);
contractorRouter.get("/contractor/get-all-logged-user-expenses", verifyContractorToken, getLoggedUserAllExpenses);
contractorRouter.get("/contractor/get-expense-details/:id", verifyContractorToken, getExpensesDetailById);
contractorRouter.post("/contractor/update-expense-details", verifyContractorToken, updateExpenses);
contractorRouter.delete("/contractor/delete-expense-details/:id", verifyContractorToken, deleteExpense);
contractorRouter.post("/contractor/approve-reject-expense-details", verifyContractorToken, expenseApproveReject);
contractorRouter.get("/contractor/get-all-requested-expenses", verifyContractorToken, viewRequestedExpenses);
contractorRouter.get("/contractor/get-all-expense-request-by-month", verifyContractorToken, getExpenseRequest);
contractorRouter.get("/contractor/get-all-expense-request-by-id/:id", verifyContractorToken, getExpenseRequestById);
contractorRouter.get(
    "/contractor/get-approve-item-price/:id/:request_by",
    verifyContractorToken,
    itemsMasterToApprovePrice
);

//--------------------Transaction report routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Transaction Report
 *   description: API endpoints for retrieving transaction reports.
 */

/**
 * @swagger
 * /contractor/user-all-transaction-report:
 *   get:
 *     summary: Retrieve all transaction reports for the user.
 *     tags: [Contractor Routes - Transaction Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions for the user.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/user-all-transaction-report", verifyContractorToken, getUserAllTransaction);

//------------------Fund management routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Fund Management
 *   description: API endpoints for managing and tracking user funds and requests.
 */

/**
 * @swagger
 * /contractor/add-fund-user-wallet:
 *   post:
 *     summary: Add funds to the user's wallet.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Funds added successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-wallet-balance:
 *   get:
 *     summary: Retrieve the user's wallet balance.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wallet balance retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-transaction-monthly:
 *   get:
 *     summary: Get the user's monthly transaction report.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's monthly transaction report retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-cash-request-status-tracked:
 *   get:
 *     summary: Track the status of cash requests.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cash request status tracked successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-transaction-history:
 *   get:
 *     summary: Retrieve the user's transaction history.
 *     tags: [Contractor Routes - Fund Management]
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

/**
 * @swagger
 * /contractor/get-user-assets-and-funds-report:
 *   get:
 *     summary: Get the user's assets and funds monthly report.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's assets and funds report retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/request-item:
 *   post:
 *     summary: Request an item.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item requested successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-request-item-list:
 *   get:
 *     summary: Retrieve all requested items.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all requested items retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-request-item-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific requested item.
 *     tags: [Contractor Routes - Fund Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the requested item.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the requested item retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-requested-item-details:
 *   post:
 *     summary: Update details of a requested item.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Requested item details updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-request-item/{id}:
 *   delete:
 *     summary: Delete a requested item.
 *     tags: [Contractor Routes - Fund Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the requested item to delete.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Requested item deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-requested-item-status:
 *   post:
 *     summary: Update the status of a requested item.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Requested item status updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-items-request-list:
 *   get:
 *     summary: Retrieve all approved item requests.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved item requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-rejected-items-request-list:
 *   get:
 *     summary: Retrieve all rejected item requests.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rejected item requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
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
contractorRouter.post("/contractor/add-fund-user-wallet", verifyContractorToken, addFundtoUser);
contractorRouter.get("/contractor/get-user-wallet-balance", verifyContractorToken, userWalletBalance);
contractorRouter.get("/contractor/get-user-transaction-monthly", verifyContractorToken, userTransactionMonthlyReport);
contractorRouter.get("/contractor/get-cash-request-status-tracked", verifyContractorToken, cashRequestTracked);
contractorRouter.get("/contractor/get-user-transaction-history", verifyContractorToken, userTransactionHistory);
contractorRouter.get(
    "/contractor/get-user-assets-and-funds-report",
    verifyContractorToken,
    getUserAssetAndFundMonthlyReport
);
contractorRouter.post("/contractor/request-item", verifyContractorToken, requestItems);
contractorRouter.get("/contractor/get-all-request-item-list", verifyContractorToken, getAllRequestedItemList);
contractorRouter.get(
    "/contractor/get-single-request-item-details/:id",
    verifyContractorToken,
    getRequestedItemDetailById
);
contractorRouter.post("/contractor/update-requested-item-details", verifyContractorToken, updateRequestItemsDetails);
contractorRouter.delete("/contractor/delete-request-item/:id", verifyContractorToken, deleteRequestedItemById);
contractorRouter.post("/contractor/update-requested-item-status", verifyContractorToken, requestStatusChanged);
contractorRouter.get(
    "/contractor/get-all-approved-items-request-list",
    verifyContractorToken,
    getAllApprovedRequestedItemList
);
contractorRouter.get(
    "/contractor/get-all-rejected-items-request-list",
    verifyContractorToken,
    getAllRejectedRequestedItemList
);
contractorRouter.get("/contractor/get-user-transaction/:user_id", verifyContractorToken, getUserTransactionHistory);

/**
 * @swagger
 * /contractor/assigned-approved-items-request-to-user:
 *   post:
 *     summary: Assign approved item requests to a user.
 *     tags: [Contractor Routes - Fund Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved item request assigned to user successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-approved-item-detail/{id}:
 *   get:
 *     summary: Retrieve details of a single approved item request.
 *     tags: [Contractor Routes - Fund Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the approved item request.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the approved item request retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post(
    "/contractor/assigned-approved-items-request-to-user",
    verifyContractorToken,
    approvedItemRequestAssignTo
);
contractorRouter.get(
    "/contractor/get-single-approved-item-detail/:id",
    verifyContractorToken,
    getApprovedRequestDetailById
);

//-------------------Earthing testing routes----------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Earthing Testing
 *   description: API endpoints for managing earthing testing reports and related data.
 */

/**
 * @swagger
 * /contractor/get-all-complaint-list:
 *   get:
 *     summary: Retrieve a list of all complaints.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaint-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific complaint.
 *     tags: [Contractor Routes - Earthing Testing]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the complaint.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the complaint retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-outlet-list:
 *   get:
 *     summary: Retrieve a list of all outlets.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-end-user-details:
 *   get:
 *     summary: Retrieve a list of free end users.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of free end users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-earthing-testing-report:
 *   post:
 *     summary: Add a new earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportData:
 *                 type: string
 *                 description: Data for the earthing testing report.
 *     responses:
 *       201:
 *         description: Earthing testing report created successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-earthing-testing-lists:
 *   get:
 *     summary: Retrieve a list of all earthing testing reports.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all earthing testing reports retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-earthing-testing-detail/{id}:
 *   get:
 *     summary: Retrieve details of a specific earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the earthing testing report.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the earthing testing report retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-earthing-testing-detail:
 *   post:
 *     summary: Update an existing earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportData:
 *                 type: string
 *                 description: Updated data for the earthing testing report.
 *     responses:
 *       200:
 *         description: Earthing testing report updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-earthing-testing-status:
 *   post:
 *     summary: Change the status of an earthing testing report.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportId:
 *                 type: string
 *                 description: ID of the earthing testing report.
 *               status:
 *                 type: string
 *                 description: New status for the earthing testing report.
 *     responses:
 *       200:
 *         description: Status of the earthing testing report changed successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-earthing-testing-by-status:
 *   put:
 *     summary: Approve or reject an earthing testing report based on its status.
 *     tags: [Contractor Routes - Earthing Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportId:
 *                 type: string
 *                 description: ID of the earthing testing report.
 *               status:
 *                 type: string
 *                 description: Status to set for the earthing testing report.
 *     responses:
 *       200:
 *         description: Earthing testing report status updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-all-complaint-list", verifyContractorToken, getAllComplaintList);
contractorRouter.get("/contractor/get-complaint-details/:id", verifyContractorToken, getComplaintDetailById);
contractorRouter.get("/contractor/get-outlet-list", verifyContractorToken, getOutletDetails);
contractorRouter.get("/contractor/get-end-user-details", verifyContractorToken, getFreeEndUsers);
contractorRouter.post("/contractor/add-earthing-testing-report", verifyContractorToken, createEarthingTesting);
contractorRouter.get("/contractor/get-earthing-testing-lists", verifyContractorToken, getAllEarthingTestingLists);
contractorRouter.get(
    "/contractor/get-earthing-testing-detail/:id",
    verifyContractorToken,
    getEarthingTestingDetailById
);
contractorRouter.post("/contractor/update-earthing-testing-detail", verifyContractorToken, updateEarthingTesting);
contractorRouter.post("/contractor/change-earthing-testing-status", verifyContractorToken, changeEarthingTestingStatus);
contractorRouter.put(
    "/contractor/approve-reject-earthing-testing-by-status",
    verifyContractorToken,
    approveRejectEarthingTestingsByStatus
);
contractorRouter.post("/contractor/assign-earthing-testing", verifyContractorToken, assignToEarthingTesting);
contractorRouter.post("/contractor/earth-pit-reports", verifyContractorToken, earthPitReport);

//---------------------Office inspections--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Office Inspections
 *   description: API endpoints for managing office inspections, complaints, and expenses.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-and-sale-area-list/{id}:
 *   get:
 *     summary: Retrieve a list of all outlets and sale areas based on the given ID.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID for the outlet and sale area list.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets and sale areas retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-on-outlet/{outlet_id}:
 *   get:
 *     summary: Retrieve a list of all complaints associated with a specific outlet.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: outlet_id
 *         in: path
 *         required: true
 *         description: ID of the outlet to fetch complaints for.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints on the specified outlet retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-used-items-on-complaint/{complaint_id}:
 *   get:
 *     summary: Retrieve all approved used items for a specific complaint.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: ID of the complaint to fetch approved used items for.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved used items for the specified complaint retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-pending-used-items-on-complaint/{complaint_id}:
 *   get:
 *     summary: Retrieve all pending used items for a specific complaint.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: ID of the complaint to fetch pending used items for.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending used items for the specified complaint retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approved-used-items-on-complaint/{id}:
 *   post:
 *     summary: Approve used items for a specific complaint.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the complaint to approve used items for.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of used items to approve.
 *     responses:
 *       200:
 *         description: Used items approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-expense-list:
 *   get:
 *     summary: Retrieve a list of all approved expenses.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-expense-from-office/{id}:
 *   post:
 *     summary: Approve an expense from the office.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the expense to approve.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expense:
 *                 type: object
 *                 description: Details of the expense to approve.
 *     responses:
 *       200:
 *         description: Expense approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-office-approved-expense-list:
 *   get:
 *     summary: Retrieve a list of all office-approved expenses.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all office-approved expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-sales-area-list:
 *   get:
 *     summary: Retrieve a list of all sales areas.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales areas retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-approved-complaint-items:
 *   post:
 *     summary: Assign approved items to complaints.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: string
 *                 description: ID of the complaint to assign items to.
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of items to assign.
 *     responses:
 *       200:
 *         description: Approved complaint items assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-approved-complaint-expense:
 *   post:
 *     summary: Assign approved expenses to complaints.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: string
 *                 description: ID of the complaint to assign expenses to.
 *               expenses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of expenses to assign.
 *     responses:
 *       200:
 *         description: Approved complaint expenses assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-with-complaints:
 *   get:
 *     summary: Retrieve a list of all outlets with associated complaints.
 *     tags: [Contractor Routes - Office Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-with-complaints-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve a list of all outlets with complaints for a specific ID and month.
 *     tags: [Contractor Routes - Office Inspections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the list of outlets.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month to filter the list of complaints.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints for the specified ID and month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get(
    "/contractor/get-all-outlet-and-sale-area-list/:id",
    verifyContractorToken,
    getAllSaleAreaAndOutlet
);
contractorRouter.get("/contractor/get-all-complaints-on-outlet/:outlet_id", verifyContractorToken, getOutletComplaints);
contractorRouter.get(
    "/contractor/get-all-approved-used-items-on-complaint/:complaint_id",
    verifyContractorToken,
    getApprovedUsedItemsOnComplaint
);
contractorRouter.get(
    "/contractor/get-all-pending-used-items-on-complaint/:complaint_id",
    verifyContractorToken,
    getPendingUsedItemsOnComplaint
);
contractorRouter.post("/contractor/approved-used-items-on-complaint/:id", verifyContractorToken, approvedUsedItems);
contractorRouter.get("/contractor/get-all-approved-expense-list", verifyContractorToken, getAllApprovedExpenseList);
contractorRouter.post("/contractor/approve-expense-from-office/:id", verifyContractorToken, approvedExpensesFromOffice);
contractorRouter.get(
    "/contractor/get-all-office-approved-expense-list",
    verifyContractorToken,
    getAllApprovedOfficeExpenseList
);
contractorRouter.get("/contractor/get-sales-area-list", verifyContractorToken, getAllSaleAreaList);
contractorRouter.post("/contractor/assign-approved-complaint-items", verifyContractorToken, assignApprovedItems);
contractorRouter.post("/contractor/assign-approved-complaint-expense", verifyContractorToken, assignApprovedExpense);
contractorRouter.get("/contractor/get-all-outlet-with-complaints", verifyContractorToken, getAllOutletsWithComplaints);
contractorRouter.get(
    "/contractor/get-all-outlet-with-complaints-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsById
);
contractorRouter.get(
    "/contractor/get-employee-history-with-complaints",
    verifyContractorToken,
    employeeHistoryWithComplaints
);

//---------------------Office inspections for fund --------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Office Inspections for Fund
 *   description: API endpoints for managing office inspections related to fund management.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-with-complaints-funds:
 *   get:
 *     summary: Retrieve a list of all outlets with complaints related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets with complaints related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-with-complaints-funds-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve a list of all outlets with complaints related to fund management for a specific ID and month.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the list of outlets.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month to filter the list of complaints.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of outlets with complaints for the specified ID and month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/fund-office-expense-partial-by-office:
 *   get:
 *     summary: Retrieve a list of partial office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of partial office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/fund-punch-approve-by-office:
 *   post:
 *     summary: Approve office inspections related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspections:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of inspections to approve.
 *     responses:
 *       200:
 *         description: Office inspections approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/fund-office-expense-approved-by-office:
 *   get:
 *     summary: Retrieve a list of approved office expenses related to fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved office expenses related to fund management retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-office-approved_fund-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve a list of approved funds by ID and month.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the list of approved funds.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month to filter the list of approved funds.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved funds by ID and month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-fund-office-partial-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve a list of partial funds by ID and month.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter the list of partial funds.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month to filter the list of partial funds.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of partial funds by ID and month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-outlet-office-by-id-for-fund/:
 *   get:
 *     summary: Retrieve outlet office details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlet office details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-sales-area-office-by-id-for-fund:
 *   get:
 *     summary: Retrieve sales area office details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales area office details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-regional-office-expense-by-id-for-fund:
 *   get:
 *     summary: Retrieve regional office expense details by ID for fund management.
 *     tags: [Contractor Routes - Office Inspections for Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regional office expense details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get(
    "/contractor/get-all-outlet-with-complaints-funds",
    verifyContractorToken,
    getAllOutletsWithComplaintsForFunds
);
contractorRouter.get(
    "/contractor/get-all-outlet-with-complaints-funds-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsForFundsById
);
contractorRouter.get(
    "/contractor/fund-office-expense-partial-by-office",
    verifyContractorToken,
    getAllOutletsWithComplaintsPartialForFunds
);
contractorRouter.post(
    "/contractor/fund-punch-approve-by-office",
    verifyContractorToken,
    approveOfficeInspectionsForFund
);
contractorRouter.get(
    "/contractor/fund-office-expense-approved-by-office",
    verifyContractorToken,
    getAllOutletsWithComplaintsApprovedForFund
);
contractorRouter.get(
    "/contractor/get-office-approved_fund-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsForFundByApprovedId
);
contractorRouter.get(
    "/contractor/get-fund-office-partial-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsForFundByPartialId
);
contractorRouter.get(
    "/contractor/get-outlet-office-by-id-for-fund/",
    verifyContractorToken,
    getOutletOfficeByIdForFund
);
contractorRouter.get(
    "/contractor/get-sales-area-office-by-id-for-fund",
    verifyContractorToken,
    getSalesAreaOfficeByIdForFund
);
contractorRouter.get(
    "/contractor/get-regional-office-expense-by-id-for-fund",
    verifyContractorToken,
    getRegionalOfficeExpenseByIdForFund
);

//----------------------Stock punch routes for office inspection------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Stock Punch for Office Inspection
 *   description: API endpoints for managing stock punch operations during office inspections.
 */

/**
 * @swagger
 * /contractor/get-all-punch-stocks/{id}/{status}:
 *   get:
 *     summary: Retrieve all punched stock lists by ID and status.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter punched stock lists.
 *         schema:
 *           type: string
 *       - name: status
 *         in: path
 *         required: true
 *         description: Status to filter punched stock lists.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of punched stocks retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-punch-stocks-details/{id}/{status}:
 *   get:
 *     summary: Retrieve details of a single punched stock by ID and status.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID to filter punched stock details.
 *         schema:
 *           type: string
 *       - name: status
 *         in: path
 *         required: true
 *         description: Status to filter punched stock details.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Punched stock details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approved-punch-stocks-details/{id}:
 *   post:
 *     summary: Approve punched stock details by ID.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the punched stock to approve.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Punched stock details approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assigned-complaint-item-punch-stocks:
 *   post:
 *     summary: Assign approved complaint item to punched stocks.
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
 *               complaintId:
 *                 type: string
 *                 description: Complaint ID related to the punched stock.
 *               stockDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of stock details to assign.
 *     responses:
 *       200:
 *         description: Complaint item assigned to punched stocks successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-stock-punch-quantity:
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
 * /contractor/get-all-approve-stock-punch:
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
 * /contractor/get-all-approve-stock-punch-by-id/{id}/{complaint_id}:
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
 * /contractor/get-user-stock-items-lists/{id}:
 *   get:
 *     summary: Retrieve stock item lists by user ID.
 *     tags: [Contractor Routes - Stock Punch for Office Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to filter the stock item lists.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock item lists retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-all-punch-stocks/:id/:status", verifyContractorToken, getAllStockPunchedList);
contractorRouter.get(
    "/contractor/get-single-punch-stocks-details/:id/:status",
    verifyContractorToken,
    getSingleStockPunchedDetails
);
contractorRouter.post(
    "/contractor/approved-punch-stocks-details/:id",
    verifyContractorToken,
    approvedPunchedStockDetails
);
contractorRouter.post(
    "/contractor/assigned-complaint-item-punch-stocks",
    verifyContractorToken,
    assignApprovedItemStock
);
contractorRouter.post("/contractor/approve-stock-punch-quantity", verifyContractorToken, approveStockPunch);
contractorRouter.get("/contractor/get-all-approve-stock-punch", verifyContractorToken, getAllApproveStockPunchList);
contractorRouter.get(
    "/contractor/get-all-approve-stock-punch-by-id/:id/:complaint_id",
    verifyContractorToken,
    getAllApproveStockPunchListById
);
contractorRouter.get("/contractor/get-user-stock-items-lists/:id", verifyContractorToken, stockItemList);

//----------------------Site inspection routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection
 *   description: API endpoints for managing site inspection processes.
 */

/**
 * @swagger
 * /contractor/verified-used-items-on-site-inspector/{id}:
 *   post:
 *     summary: Verify used items on site by inspector.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the inspector verifying the used items.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of items to verify.
 *     responses:
 *       200:
 *         description: Items verified successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-verified-complaint-items:
 *   get:
 *     summary: Retrieve all verified complaint items.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verified complaint items retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/verified-complaint-expense/{id}:
 *   post:
 *     summary: Verify complaint expense on site by inspector.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the expense to verify.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseDetails:
 *                 type: string
 *                 description: Details of the expense being verified.
 *     responses:
 *       200:
 *         description: Expense verified successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/verified-complaint-expense-list:
 *   get:
 *     summary: Retrieve all verified complaint expense lists.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verified complaint expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-approved-site-inspection-stocks:
 *   post:
 *     summary: Assign approved stocks for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of approved stocks to assign for site inspection.
 *     responses:
 *       200:
 *         description: Stocks assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-assigned-site-inspection-stocks/{id}:
 *   get:
 *     summary: Get assigned stocks for site inspection by user ID.
 *     tags: [Contractor Routes - Site Inspection]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to retrieve assigned stocks for site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned stocks retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-multiple-inspection-stocks:
 *   post:
 *     summary: Assign multiple stocks for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of stocks to assign for multiple site inspections.
 *     responses:
 *       200:
 *         description: Multiple stocks assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-complaints-in-site-inspection:
 *   post:
 *     summary: Assign complaints for site inspection.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of complaint IDs to assign for site inspection.
 *     responses:
 *       200:
 *         description: Complaints assigned successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-site-inspections:
 *   get:
 *     summary: Retrieve all site inspections.
 *     tags: [Contractor Routes - Site Inspection]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post(
    "/contractor/verified-used-items-on-site-inspector/:id",
    verifyContractorToken,
    verifiedUsedItems
);
contractorRouter.get(
    "/contractor/get-all-verified-complaint-items",
    verifyContractorToken,
    getAllVerifiedComplaintItems
);
contractorRouter.post("/contractor/verified-complaint-expense/:id", verifyContractorToken, verifiedExpensesFromSite);
contractorRouter.get(
    "/contractor/verified-complaint-expense-list",
    verifyContractorToken,
    getAllVerifiedSiteExpenseList
);
contractorRouter.post(
    "/contractor/assign-approved-site-inspection-stocks",
    verifyContractorToken,
    assignSiteInspectionComplaintModule
);
contractorRouter.get(
    "/contractor/get-assigned-site-inspection-stocks/:id",
    verifyContractorToken,
    getSiteInspectionAssignComplaintModuleOnUserId
);
contractorRouter.post(
    "/contractor/assign-multiple-inspection-stocks",
    verifyContractorToken,
    assignMultipleSiteInspectionComplaintModule
);
contractorRouter.post("/contractor/assign-complaints-in-site-inspection", verifyContractorToken, assignComplaints);
contractorRouter.get("/contractor/get-all-site-inspections", verifyContractorToken, getAllSiteInspection);

// site inspection for site stock

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Site Stock
 *   description: API endpoints for managing site inspections related to site stock.
 */

/**
 * @swagger
 * /contractor/approved-site-inspections:
 *   post:
 *     summary: Approve site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectionDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of site inspection details to approve.
 *     responses:
 *       200:
 *         description: Site inspections approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-partial-site-inspections:
 *   get:
 *     summary: Retrieve all partially completed site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-approved-site-inspections:
 *   get:
 *     summary: Retrieve all approved site inspections.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-site-inspections-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-site-inspections-partial-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve partially completed site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-site-inspections-approved-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve approved site inspections by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site inspections retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-office-outlet:
 *   get:
 *     summary: Retrieve office outlet details.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office outlet details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-office-sales-area:
 *   get:
 *     summary: Retrieve office sales area details.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office sales area details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-office-regional-list:
 *   get:
 *     summary: Retrieve office regional expense list.
 *     tags: [Contractor Routes - Site Inspection for Site Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Office regional expense list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/approved-site-inspections", verifyContractorToken, approveSiteInspections);
contractorRouter.get("/contractor/get-partial-site-inspections", verifyContractorToken, getAllSiteInspectionPartial);
contractorRouter.get("/contractor/get-approved-site-inspections", verifyContractorToken, getAllSiteInspectionApproved);
contractorRouter.get(
    "/contractor/get-site-inspections-by-id/:id/:month",
    verifyContractorToken,
    getAllSiteInspectionById
);
contractorRouter.get(
    "/contractor/get-site-inspections-partial-by-id/:id/:month",
    verifyContractorToken,
    getAllSiteInspectionPartialById
);
contractorRouter.get(
    "/contractor/get-site-inspections-approved-by-id/:id/:month",
    verifyContractorToken,
    getAllSiteInspectionApprovedById
);
contractorRouter.get("/contractor/get-office-outlet", verifyContractorToken, getOutletOfficeById);
contractorRouter.get("/contractor/get-office-sales-area", verifyContractorToken, getSalesAreaOfficeById);
contractorRouter.get("/contractor/get-office-regional-list", verifyContractorToken, getRegionalOfficeExpenseById);

// site inspection for funds

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Funds
 *   description: API endpoints for managing site inspections related to funds.
 */

/**
 * @swagger
 * /contractor/get-pending-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all pending site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-pending-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve pending site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-partial-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all partially completed site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-approved-site-complaints-for-funds:
 *   get:
 *     summary: Retrieve all approved site complaints for funds.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-partial-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve partially completed site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partially completed site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-approved-site-complaints-for-funds-id/{id}/{month}:
 *   get:
 *     summary: Retrieve approved site complaints for funds by ID and month.
 *     tags: [Contractor Routes - Site Inspection for Funds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the site inspection.
 *         schema:
 *           type: string
 *       - name: month
 *         in: path
 *         required: true
 *         description: Month of the site inspection.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved site complaints for funds retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get(
    "/contractor/get-pending-site-complaints-for-funds",
    verifyContractorToken,
    getAllOutletsWithComplaintsSiteForFunds
);
contractorRouter.get(
    "/contractor/get-pending-site-complaints-for-funds-id/:id/:month",
    verifyContractorToken,
    getOutletsWithComplaintsSiteForFundsById
);
contractorRouter.get(
    "/contractor/get-partial-site-complaints-for-funds",
    verifyContractorToken,
    getAllPendingOutletsWithComplaintsSiteForFunds
);
contractorRouter.get(
    "/contractor/get-approved-site-complaints-for-funds",
    verifyContractorToken,
    getAllApprovedOutletsWithComplaintsSiteForFunds
);
contractorRouter.get(
    "/contractor/get-partial-site-complaints-for-funds-id/:id/:month",
    verifyContractorToken,
    getPartialOutletsSiteForFundsById
);
contractorRouter.get(
    "/contractor/get-approved-site-complaints-for-funds-id/:id/:month",
    verifyContractorToken,
    getApprovedOutletsSiteForFundsById
);

// site inspection for site fund

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Site Inspection for Site Fund
 *   description: API endpoints for managing site inspections related to site funds.
 */

/**
 * @swagger
 * /contractor/approve-site-inspection-for-fund:
 *   post:
 *     summary: Approve a site inspection for fund.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site inspection for fund approved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-data/{complaintId}:
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
 * /contractor/assign-complaints-in-fund-site-inspection:
 *   post:
 *     summary: Assign complaints in a fund site inspection.
 *     tags: [Contractor Routes - Site Inspection for Site Fund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaints assigned in fund site inspection successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post(
    "/contractor/approve-site-inspection-for-fund",
    verifyContractorToken,
    approveSiteInspectionsForFund
);
contractorRouter.get("/contractor/get-all-approved-data/:complaintId", verifyContractorToken, getAllApprovedData);
contractorRouter.post(
    "/contractor/assign-complaints-in-fund-site-inspection",
    verifyContractorToken,
    assignComplaintsForFundSite
);

//-------------------------import  bank data------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Import Bank Data
 *   description: API endpoints for importing and processing bank data.
 */

/**
 * @swagger
 * /contractor/import-bank-details:
 *   post:
 *     summary: Import bank details from a file.
 *     tags: [Contractor Routes - Import Bank Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file containing bank details to import.
 *     responses:
 *       200:
 *         description: Bank details imported successfully.
 *       400:
 *         description: Bad request, invalid file format.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-specific-columns-value-from-csv:
 *   post:
 *     summary: Retrieve specific column values from a CSV file.
 *     tags: [Contractor Routes - Import Bank Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to process.
 *               columns:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of column names to retrieve values from.
 *     responses:
 *       200:
 *         description: Specific column values retrieved successfully.
 *       400:
 *         description: Bad request, invalid file format or column names.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

contractorRouter.post("/contractor/import-bank-details", verifyContractorToken, importBankDetailData);
contractorRouter.post(
    "/contractor/get-specific-columns-value-from-csv",
    verifyContractorToken,
    getSpecificColumnValueFromCsv
);

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
contractorRouter.get("/contractor/get-all-bank-list", verifyContractorToken, getAllBankList);
contractorRouter.post("/contractor/add-bank-details", verifyContractorToken, addBankDetails);
contractorRouter.get("/contractor/get-bank-list", verifyContractorToken, bankList);
contractorRouter.get("/contractor/get-bank-details/:id", verifyContractorToken, bankDetailsById);
contractorRouter.post("/contractor/update-bank-details", verifyContractorToken, updateBankDetails);

//-------------------------Assign complaint module routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Assign Complaint Module
 *   description: API endpoints for assigning complaint modules to users.
 */

/**
 * @swagger
 * /contractor/assign-complaint-module-to-user:
 *   post:
 *     summary: Assign a complaint module to a user.
 *     tags: [Contractor Routes - Assign Complaint Module]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to assign the complaint module to.
 *               moduleId:
 *                 type: string
 *                 description: ID of the complaint module to assign.
 *     responses:
 *       201:
 *         description: Complaint module assigned successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-assign-complaint-module-by-user/{id}:
 *   get:
 *     summary: Get the complaint modules assigned to a specific user by ID.
 *     tags: [Contractor Routes - Assign Complaint Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve assigned complaint modules.
 *     responses:
 *       200:
 *         description: List of assigned complaint modules retrieved successfully.
 *       400:
 *         description: Bad request, invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-multiple-complaint-module-to-user:
 *   post:
 *     summary: Assign multiple complaint modules to a user.
 *     tags: [Contractor Routes - Assign Complaint Module]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to assign the complaint modules to.
 *               moduleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of complaint module IDs to assign.
 *     responses:
 *       201:
 *         description: Complaint modules assigned successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/assign-complaint-module-to-user", verifyContractorToken, assignComplaintModule);
contractorRouter.get(
    "/contractor/get-assign-complaint-module-by-user/:id",
    verifyContractorToken,
    getAssignComplaintModuleOnUserId
);
contractorRouter.post(
    "/contractor/assign-multiple-complaint-module-to-user",
    verifyContractorToken,
    assignMultipleComplaintModule
);

//-------------------------Upload complaint images routes-------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Upload Complaint Images
 *   description: API endpoints for managing complaint images.
 */

/**
 * @swagger
 * /contractor/upload-complaint-images:
 *   post:
 *     summary: Upload images related to a complaint.
 *     tags: [Contractor Routes - Upload Complaint Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: string
 *                 description: The ID of the complaint related to the images.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of images to upload.
 *     responses:
 *       201:
 *         description: Images uploaded successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-uploaded-complaint-images:
 *   get:
 *     summary: Get a list of all uploaded complaint images.
 *     tags: [Contractor Routes - Upload Complaint Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded images retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-uploaded-complaint-images/{id}:
 *   get:
 *     summary: Get details of a single uploaded complaint image by ID.
 *     tags: [Contractor Routes - Upload Complaint Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the uploaded image to retrieve.
 *     responses:
 *       200:
 *         description: Uploaded image details retrieved successfully.
 *       400:
 *         description: Bad request, invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Image not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-uploaded-complaint-images:
 *   post:
 *     summary: Update an uploaded complaint image.
 *     tags: [Contractor Routes - Upload Complaint Images]
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
 *                 description: The ID of the image to update.
 *               newImageData:
 *                 type: string
 *                 format: binary
 *                 description: The updated image data.
 *     responses:
 *       200:
 *         description: Image updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Image not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-uploaded-complaint-images/{id}:
 *   delete:
 *     summary: Delete an uploaded complaint image by ID.
 *     tags: [Contractor Routes - Upload Complaint Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the uploaded image to delete.
 *     responses:
 *       200:
 *         description: Image deleted successfully.
 *       400:
 *         description: Bad request, invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Image not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/complaint-images-prepare-ppt/{id}:
 *   get:
 *     summary: Prepare a PowerPoint presentation from complaint images.
 *     tags: [Contractor Routes - Upload Complaint Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the complaint to prepare the PPT for.
 *     responses:
 *       200:
 *         description: PowerPoint presentation prepared successfully.
 *       400:
 *         description: Bad request, invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Complaint not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-complaint-images-by-status:
 *   put:
 *     summary: Approve or reject complaint images by status.
 *     tags: [Contractor Routes - Upload Complaint Images]
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
 *                 description: The ID of the complaint image.
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: The status to update the image to.
 *     responses:
 *       200:
 *         description: Image status updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Image not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/upload-complaint-images", verifyContractorToken, uploadComplaintImages);
contractorRouter.get("/contractor/get-all-uploaded-complaint-images", verifyContractorToken, getAllUploadedImages);
contractorRouter.get(
    "/contractor/get-single-uploaded-complaint-images/:id",
    verifyContractorToken,
    getSingleUploadedImagesById
);
contractorRouter.post("/contractor/update-uploaded-complaint-images", verifyContractorToken, updateComplaintImages);
contractorRouter.delete(
    "/contractor/delete-uploaded-complaint-images/:id",
    verifyContractorToken,
    deleteComplaintWorkImages
);
contractorRouter.get("/contractor/complaint-images-prepare-ppt/:id", verifyContractorToken, getComplaintImagesForPPT); //correction done at "domplaint -> "complaint"
contractorRouter.put(
    "/contractor/approve-reject-complaint-images-by-status",
    verifyContractorToken,
    approveRejectComplaintImagesByStatus
);

//--------------------------Stocks routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Stocks
 *   description: API endpoints for managing stock-related operations.
 */

/**
 * @swagger
 * /contractor/get-all-items-stocks-report:
 *   get:
 *     summary: Get a report of all item stocks.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report of all item stocks retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-item-stock-distribution-report/{id}:
 *   get:
 *     summary: Get the stock distribution report for a specific item.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to retrieve the stock distribution report for.
 *     responses:
 *       200:
 *         description: Stock distribution report for the specified item retrieved successfully.
 *       400:
 *         description: Bad request, invalid item ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-transfer:
 *   post:
 *     summary: Transfer stock from one location to another.
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
 *                 description: The ID of the item being transferred.
 *               fromLocation:
 *                 type: string
 *                 description: The location from which the stock is being transferred.
 *               toLocation:
 *                 type: string
 *                 description: The location to which the stock is being transferred.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of stock being transferred.
 *     responses:
 *       201:
 *         description: Stock transfer completed successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/new-stock-transfer:
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

/**
 * @swagger
 * /contractor/stock-punch-get-approve-item-price/{id}/{request_by}:
 *   get:
 *     summary: Get the price for approval of a stock punch item.
 *     tags: [Contractor Routes - Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item.
 *       - in: path
 *         name: request_by
 *         schema:
 *           type: string
 *         required: true
 *         description: The user who requested the stock punch.
 *     responses:
 *       200:
 *         description: Price for the stock punch item retrieved successfully.
 *       400:
 *         description: Bad request, invalid parameters.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-stock-quantity-transfer:
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
 * /contractor/get-stock-quantity-transfer-by-id/{transfered_by}/{transfered_to}:
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
contractorRouter.get("/contractor/get-all-items-stocks-report", verifyContractorToken, getAllItemStockReport);
contractorRouter.get(
    "/contractor/get-item-stock-distribution-report/:id",
    verifyContractorToken,
    getItemDistributeReport
);
// contractorRouter.post("/contractor/stock-transfer", verifyContractorToken, stockTransfer);
contractorRouter.post("/contractor/new-stock-transfer", verifyContractorToken, newStockTransfer);
contractorRouter.get(
    "/contractor/stock-punch-get-approve-item-price/:id/:request_by",
    verifyContractorToken,
    stockPunchItemsMasterToApprovePrice
);
contractorRouter.get("/contractor/get-stock-quantity-transfer", verifyContractorToken, getStockTransferQuantity);
contractorRouter.get(
    "/contractor/get-stock-quantity-transfer-by-id/:transfered_by/:transfered_to",
    verifyContractorToken,
    getStockTransferQuantityById
);

//--------------------------Assets Routes--------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Assets
 *   description: API endpoints for managing asset-related operations.
 */

/**
 * @swagger
 * /contractor/add-new-assets:
 *   post:
 *     summary: Add new assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetName:
 *                 type: string
 *                 description: Name of the asset.
 *               assetType:
 *                 type: string
 *                 description: Type of the asset.
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the asset.
 *               location:
 *                 type: string
 *                 description: Location where the asset is stored.
 *     responses:
 *       201:
 *         description: Asset added successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-stored-assets:
 *   get:
 *     summary: Retrieve all stored assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stored assets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-stored-assets-details/{id}:
 *   get:
 *     summary: Get details of a single stored asset.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the asset to retrieve details for.
 *     responses:
 *       200:
 *         description: Details of the stored asset retrieved successfully.
 *       400:
 *         description: Bad request, invalid asset ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-stored-assets:
 *   post:
 *     summary: Update details of stored assets.
 *     tags: [Contractor Routes - Assets]
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
 *                 description: ID of the asset to be updated.
 *               assetName:
 *                 type: string
 *                 description: Updated name of the asset.
 *               assetType:
 *                 type: string
 *                 description: Updated type of the asset.
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the asset.
 *               location:
 *                 type: string
 *                 description: Updated location of the asset.
 *     responses:
 *       200:
 *         description: Asset details updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-stored-assets/{id}:
 *   delete:
 *     summary: Delete a stored asset.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the asset to be deleted.
 *     responses:
 *       200:
 *         description: Asset deleted successfully.
 *       400:
 *         description: Bad request, invalid asset ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assigned-asset-to-user:
 *   post:
 *     summary: Assign an asset to a user.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be assigned.
 *               userId:
 *                 type: string
 *                 description: ID of the user to whom the asset will be assigned.
 *               assignedDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the asset is assigned.
 *     responses:
 *       201:
 *         description: Asset assigned to user successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-assigned-asset-to-users:
 *   get:
 *     summary: Retrieve all assets assigned to users.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assets assigned to users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approve-reject-assets-by-status:
 *   put:
 *     summary: Approve or reject assets based on status.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be approved or rejected.
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: Status to update for the asset.
 *     responses:
 *       200:
 *         description: Asset status updated successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/repair-assets:
 *   post:
 *     summary: Create a repair request for assets.
 *     tags: [Contractor Routes - Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be repaired.
 *               repairDescription:
 *                 type: string
 *                 description: Description of the repair needed.
 *               repairDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the repair request is made.
 *     responses:
 *       201:
 *         description: Asset repair request created successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/add-new-assets", verifyContractorToken, createAssets);
contractorRouter.get("/contractor/get-all-stored-assets", verifyContractorToken, getAllStoredAssets);
contractorRouter.get("/contractor/get-stored-assets-details/:id", verifyContractorToken, getSingleStoredAssetDetails);
contractorRouter.post("/contractor/update-stored-assets", verifyContractorToken, updateStoredAssetDetails);
contractorRouter.delete("/contractor/delete-stored-assets/:id", verifyContractorToken, deleteAssets);
contractorRouter.post("/contractor/assigned-asset-to-user", verifyContractorToken, assignAssetToUsers);
contractorRouter.get("/contractor/get-all-assigned-asset-to-users", verifyContractorToken, getAllAssignedAssets);
contractorRouter.put(
    "/contractor/approve-reject-assets-by-status",
    verifyContractorToken,
    approveRejectAssetsByStatusAndById
);
contractorRouter.post("/contractor/repair-assets", verifyContractorToken, createAssetsRepairRequest);

//-------------------------Idle assets routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Idle Assets
 *   description: API endpoints for managing idle assets.
 */

/**
 * @swagger
 * /contractor/gat-all-idle-asset-list:
 *   get:
 *     summary: Retrieve all idle assets.
 *     tags: [Contractor Routes - Idle Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all idle assets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/gat-all-idle-asset-list", verifyContractorToken, getAllIdleAssets);

//--------------------------Assets timeline routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Assets Timeline
 *   description: API endpoints for retrieving asset timeline and history.
 */

/**
 * @swagger
 * /contractor/get-assets-timeline-history/{id}:
 *   get:
 *     summary: Retrieve the timeline history of a specific asset.
 *     tags: [Contractor Routes - Assets Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the asset.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset timeline history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-assets-with-timeline-history/{id}:
 *   get:
 *     summary: Retrieve asset details along with its timeline history.
 *     tags: [Contractor Routes - Assets Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the asset.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset details with timeline history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Asset not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-assets-timeline-history/:id", verifyContractorToken, getAssetTimelineHistory);
contractorRouter.get(
    "/contractor/get-assets-with-timeline-history/:id",
    verifyContractorToken,
    getAssetWithTimelineHistory
);

//--------------------------Assets repair require routes------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Assets Repair Request
 *   description: API endpoints for managing asset repair requests.
 */

/**
 * @swagger
 * /contractor/request-asset-repair:
 *   post:
 *     summary: Request a repair for an asset.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: ID of the asset to be repaired.
 *               description:
 *                 type: string
 *                 description: Description of the repair issue.
 *     responses:
 *       201:
 *         description: Repair request created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-repair-requested-asset-list:
 *   get:
 *     summary: Retrieve all repair requests for assets.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all repair requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-single-repair-requested-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific repair request.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the repair request.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repair request details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Repair request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-repair-requested-details:
 *   post:
 *     summary: Update details of a repair request.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the repair request.
 *               status:
 *                 type: string
 *                 description: New status of the repair request.
 *               comments:
 *                 type: string
 *                 description: Additional comments or notes.
 *     responses:
 *       200:
 *         description: Repair request updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-repair-requested-details/{id}:
 *   delete:
 *     summary: Delete a repair request.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the repair request.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repair request deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Repair request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-assigned-assets:
 *   get:
 *     summary: Retrieve all assigned assets.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assigned assets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-request-viewed/{id}:
 *   post:
 *     summary: Mark a repair request as viewed.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the repair request.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repair request marked as viewed successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Repair request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-asset-repair-request:
 *   post:
 *     summary: Assign a repair request to a user.
 *     tags: [Contractor Routes - Assets Repair Request]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the repair request.
 *               userId:
 *                 type: string
 *                 description: ID of the user to whom the request is assigned.
 *     responses:
 *       200:
 *         description: Repair request assigned successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/request-asset-repair", verifyContractorToken, createRepairRequest);
contractorRouter.get(
    "/contractor/get-all-repair-requested-asset-list",
    verifyContractorToken,
    getAllRepairRequestedAssetList
);
contractorRouter.get(
    "/contractor/get-single-repair-requested-details/:id",
    verifyContractorToken,
    getSingleRepairRequestedAssetListDetails
);
contractorRouter.post("/contractor/update-repair-requested-details", verifyContractorToken, updateRepairRequestDetails);
contractorRouter.delete("/contractor/delete-repair-requested-details/:id", verifyContractorToken, deleteRepairRequest);
contractorRouter.get("/contractor/get-all-assigned-assets", verifyContractorToken, getAllAssignedAssetList);
contractorRouter.post("/contractor/mark-request-viewed/:id", verifyContractorToken, markRequestViewed);
contractorRouter.post("/contractor/assign-asset-repair-request", verifyContractorToken, AssignedRequest);

//----------------------------Tutorials routes----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Tutorials
 *   description: API endpoints for managing tutorials.
 */

/**
 * @swagger
 * /contractor/create-tutorial:
 *   post:
 *     summary: Create a new tutorial.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the tutorial.
 *               content:
 *                 type: string
 *                 description: Content of the tutorial.
 *               format:
 *                 type: string
 *                 description: Format of the tutorial (e.g., video, text).
 *     responses:
 *       201:
 *         description: Tutorial created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-tutorials:
 *   get:
 *     summary: Retrieve all tutorials.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tutorials retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-tutorial-formats/{format}:
 *   get:
 *     summary: Retrieve details of a single tutorial by format.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: format
 *         in: path
 *         required: true
 *         description: Format of the tutorial (e.g., video, text).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-tutorial-details:
 *   post:
 *     summary: Update details of an existing tutorial.
 *     tags: [Contractor Routes - Tutorials]
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
 *                 description: ID of the tutorial to be updated.
 *               title:
 *                 type: string
 *                 description: New title of the tutorial.
 *               content:
 *                 type: string
 *                 description: Updated content of the tutorial.
 *               format:
 *                 type: string
 *                 description: Updated format of the tutorial.
 *     responses:
 *       200:
 *         description: Tutorial details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-tutorial/{id}:
 *   delete:
 *     summary: Delete a tutorial.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tutorial to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-tutorial-by-id/{id}:
 *   get:
 *     summary: Retrieve a tutorial by its ID.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tutorial.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-tutorial", verifyContractorToken, createTutorial);
contractorRouter.get("/contractor/get-all-tutorials", verifyContractorToken, getTutorials);
contractorRouter.get("/contractor/get-tutorial-formats/:format", verifyContractorToken, getTutorialByFormat);
contractorRouter.post("/contractor/update-tutorial-details", verifyContractorToken, updateTutorials);
contractorRouter.delete("/contractor/delete-tutorial/:id", verifyContractorToken, deleteTutorialsById);
contractorRouter.get("/contractor/get-tutorial-by-id/:id", verifyContractorToken, getTutorialById);

//-----------------------------Company contacts routes-----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Company Contacts
 *   description: API endpoints for managing company contact details.
 */

/**
 * @swagger
 * /contractor/store-company-contact-details:
 *   post:
 *     summary: Store new company contact details.
 *     tags: [Contractor Routes - Company Contacts]
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
 *                 description: Name of the contact person.
 *               phone:
 *                 type: string
 *                 description: Contact phone number.
 *               email:
 *                 type: string
 *                 description: Contact email address.
 *               position:
 *                 type: string
 *                 description: Position of the contact person in the company.
 *               companyId:
 *                 type: string
 *                 description: ID of the company this contact belongs to.
 *     responses:
 *       201:
 *         description: Contact details stored successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-stored-company-contact-details:
 *   get:
 *     summary: Retrieve all stored company contact details.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stored company contacts retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-stored-company-contact-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific company contact by ID.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-stored-company-contact-details:
 *   post:
 *     summary: Update details of an existing company contact.
 *     tags: [Contractor Routes - Company Contacts]
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
 *                 description: ID of the contact to be updated.
 *               name:
 *                 type: string
 *                 description: Updated name of the contact person.
 *               phone:
 *                 type: string
 *                 description: Updated contact phone number.
 *               email:
 *                 type: string
 *                 description: Updated contact email address.
 *               position:
 *                 type: string
 *                 description: Updated position of the contact person.
 *     responses:
 *       200:
 *         description: Contact details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-company-contact-details/{id}:
 *   delete:
 *     summary: Delete a company contact.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-stored-company-contact-positions:
 *   get:
 *     summary: Retrieve all stored company contact positions.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all company contact positions retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/store-company-contact-details", verifyContractorToken, createContacts);
contractorRouter.get("/contractor/get-all-stored-company-contact-details", verifyContractorToken, getAllStoredContacts);
contractorRouter.get(
    "/contractor/get-stored-company-contact-details/:id",
    verifyContractorToken,
    getStoredContactDetailById
);
contractorRouter.post("/contractor/update-stored-company-contact-details", verifyContractorToken, updateContacts);
contractorRouter.delete(
    "/contractor/delete-company-contact-details/:id",
    verifyContractorToken,
    deleteContactDetailById
);
contractorRouter.get(
    "/contractor/get-all-stored-company-contact-positions",
    verifyContractorToken,
    getAllPositionOfCompanyContacts
);

//-----------------------------Holidays CRUD routes-----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Holidays
 *   description: API endpoints for managing holidays.
 */

/**
 * @swagger
 * /contractor/create-holiday-list:
 *   post:
 *     summary: Create a new holiday entry.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               holidayName:
 *                 type: string
 *                 description: Name of the holiday.
 *               holidayDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the holiday.
 *               description:
 *                 type: string
 *                 description: Description of the holiday.
 *     responses:
 *       201:
 *         description: Holiday created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-holiday-list:
 *   get:
 *     summary: Retrieve all holiday entries.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all holidays retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-holiday-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific holiday by ID.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the holiday to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holiday details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Holiday not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-holiday-list:
 *   post:
 *     summary: Update details of an existing holiday.
 *     tags: [Contractor Routes - Holidays]
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
 *                 description: ID of the holiday to be updated.
 *               holidayName:
 *                 type: string
 *                 description: Updated name of the holiday.
 *               holidayDate:
 *                 type: string
 *                 format: date
 *                 description: Updated date of the holiday.
 *               description:
 *                 type: string
 *                 description: Updated description of the holiday.
 *     responses:
 *       200:
 *         description: Holiday updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Holiday not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-holiday-list/{id}:
 *   delete:
 *     summary: Delete a holiday entry.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the holiday to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holiday deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Holiday not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-holiday-list-of-months:
 *   get:
 *     summary: Retrieve holiday entries for the current month.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holidays for the current month retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-today-birthday-list:
 *   get:
 *     summary: Retrieve a list of birthdays for today.
 *     tags: [Contractor Routes - Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of today's birthdays retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-holiday-list", verifyContractorToken, createHolidayList);
contractorRouter.get("/contractor/get-all-holiday-list", verifyContractorToken, getAllHolidayList);
contractorRouter.get("/contractor/get-holiday-details/:id", verifyContractorToken, getHolidayDetailById);
contractorRouter.post("/contractor/update-holiday-list", verifyContractorToken, updateHolidayList);
contractorRouter.delete("/contractor/delete-holiday-list/:id", verifyContractorToken, deleteHolidayList);
contractorRouter.get("/contractor/get-holiday-list-of-months", verifyContractorToken, getHolidayListOfMonth);
contractorRouter.get("/contractor/get-today-birthday-list", verifyContractorToken, getTodayBirthdayList);

//------------------------------Reports routes------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Reports
 *   description: API endpoints for managing and generating reports.
 */

/**
 * @swagger
 * /contractor/reports/get-all-modules:
 *   get:
 *     summary: Retrieve a list of all report modules.
 *     tags: [Contractor Routes - Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all report modules retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/reports/get-module-columns:
 *   post:
 *     summary: Retrieve column names for a specific report module.
 *     tags: [Contractor Routes - Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleId:
 *                 type: string
 *                 description: ID of the module to retrieve columns for.
 *     responses:
 *       200:
 *         description: Column names for the specified module retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/reports/generate-report:
 *   post:
 *     summary: Generate a report based on specified parameters.
 *     tags: [Contractor Routes - Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportParams:
 *                 type: object
 *                 description: Parameters for generating the report.
 *     responses:
 *       200:
 *         description: Report generated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/reports/generate-dynamic-query:
 *   post:
 *     summary: Generate a dynamic query based on provided criteria.
 *     tags: [Contractor Routes - Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               queryCriteria:
 *                 type: object
 *                 description: Criteria for generating the dynamic query.
 *     responses:
 *       200:
 *         description: Dynamic query generated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/reports/get-all-modules", verifyContractorToken, getAllModules);
contractorRouter.post(
    "/contractor/reports/get-module-columns",
    verifyContractorToken,
    getTableNameColumnNameOnModuleId
);
contractorRouter.post("/contractor/reports/generate-report", verifyContractorToken, generateReport);
contractorRouter.post("/contractor/reports/generate-dynamic-query", verifyContractorToken, makeDynamicQuery);

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
contractorRouter.post("/contractor/create-order", verifyContractorToken, createOrder);
contractorRouter.post("/contractor/update-order", verifyContractorToken, updateOrder);
contractorRouter.get("/contractor/get-all-order", verifyContractorToken, getAllData);
contractorRouter.get("/contractor/get-order-by-id/:id", verifyContractorToken, getOrderById);
contractorRouter.delete("/contractor/delete-order/:id", verifyContractorToken, deleteOrderById);
contractorRouter.get("/contractor/get-all-order-pagination", verifyContractorToken, getAllOrderWithPagination);

//-----------------------------------Stock punch expense punch---------------------------   -----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Stock Punch and Expense Punch
 *   description: API endpoints for managing stock punch and expense punch operations.
 */

/**
 * @swagger
 * /contractor/stock-punch:
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

/**
 * @swagger
 * /contractor/get-all-stock-punch-list:
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
 * /contractor/get-stock-punch-details/{id}/{complaint_id}:
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
 * /contractor/add-expense-punch:
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
 * /contractor/verify-stock-punch:
 *   post:
 *     summary: Verify a stock punch using OTP.
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
 *               otp:
 *                 type: string
 *                 description: OTP for verifying the stock punch.
 *     responses:
 *       200:
 *         description: Stock punch verified successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-expense-punch-list:
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
 * /contractor/get-expense-punch-details/{id}/{user_id}:
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
 * /contractor/get-expense-check-and-approve:
 *   get:
 *     summary: Retrieve all expense punches pending for check and approval.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expense punches pending for check and approval retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-approve-qty:
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
 * /contractor/get-list-expense-punch-approve:
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
 * /contractor/get-list-expense-punch-approve_according_to_items:
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

/**
 * @swagger
 * /contractor/get-stock-request-month-wise:
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
 * /contractor/get-all-stock-request-by-id/{id}:
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

/**
 * @swagger
 * /contractor/get-user-stock-items/{id}:
 *   get:
 *     summary: Retrieve stock items for a specific user.
 *     tags: [Contractor Routes - Stock Punch and Expense Punch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve stock items for.
 *     responses:
 *       200:
 *         description: List of stock items for the user retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or stock items not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-fund-items-lists/{id}:
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
contractorRouter.post("/contractor/stock-punch", verifyContractorToken, stockPunch);
contractorRouter.get("/contractor/get-all-stock-punch-list", verifyContractorToken, getAllStockPunchList);
contractorRouter.get("/contractor/get-stock-punch-details/:id/:complaint_id", verifyContractorToken, getStockPunchById);
contractorRouter.post("/contractor/add-expense-punch", verifyContractorToken, addExpensePunch);
contractorRouter.post("/contractor/verify-stock-punch", verifyContractorToken, verifyStockPunchOtp);
contractorRouter.get("/contractor/get-all-expense-punch-list", verifyContractorToken, getAllExpensePunchList);
contractorRouter.get("/contractor/get-expense-punch-details/:id/:user_id", verifyContractorToken, getExpensePunchById);
contractorRouter.get("/contractor/get-expense-check-and-approve", verifyContractorToken, getAllCheckAndApprove);
contractorRouter.post("/contractor/update-approve-qty", verifyContractorToken, updateExpensePunch);
contractorRouter.get("/contractor/get-list-expense-punch-approve", verifyContractorToken, getListExpensePunchApprove);
contractorRouter.get(
    "/contractor/get-list-expense-punch-approve_according_to_items",
    verifyContractorToken,
    getListExpensePunchApproveAccordingToItems
);
contractorRouter.get("/contractor/get-stock-request-month-wise", verifyContractorToken, getStockRequest);
contractorRouter.get("/contractor/get-all-stock-request-by-id/:id", verifyContractorToken, getStockRequestById);
contractorRouter.get("/contractor/get-user-stock-items/:id", verifyContractorToken, getUserStockItems);
contractorRouter.get("/contractor/get-user-fund-items-lists/:id", verifyContractorToken, fundItemLists);

// office inspection stock

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Office Inspection Stock
 *   description: API endpoints for managing office inspection stock and related operations.
 */

/**
 * @swagger
 * /contractor/stock-punch-approve-by-office:
 *   post:
 *     summary: Approve stock punch by office.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvalData:
 *                 type: object
 *                 description: Data for approving the stock punch.
 *     responses:
 *       200:
 *         description: Stock punch approved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-office-expense-approved-by-office:
 *   get:
 *     summary: Retrieve all approved office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all approved office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-office-approved-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve approved office stock expenses by ID and month.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the office to retrieve approved expenses for.
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month to filter the approved expenses.
 *     responses:
 *       200:
 *         description: List of approved office stock expenses by ID and month retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Office or expenses not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/stock-office-expense-partial-by-office:
 *   get:
 *     summary: Retrieve all partial office stock expenses.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all partial office stock expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-stock-office-partial-by-id/{id}/{month}:
 *   get:
 *     summary: Retrieve partial office stock expenses by ID and month.
 *     tags: [Contractor Routes - Office Inspection Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the office to retrieve partial expenses for.
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month to filter the partial expenses.
 *     responses:
 *       200:
 *         description: List of partial office stock expenses by ID and month retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Office or expenses not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-po-exists-or-not:
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
contractorRouter.post("/contractor/stock-punch-approve-by-office", verifyContractorToken, approveOfficeInspections);
contractorRouter.get(
    "/contractor/stock-office-expense-approved-by-office",
    verifyContractorToken,
    getAllOutletsWithComplaintsApproved
);
contractorRouter.get(
    "/contractor/get-office-approved-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsByApprovedId
);
contractorRouter.get(
    "/contractor/stock-office-expense-partial-by-office",
    verifyContractorToken,
    getAllOutletsWithComplaintsPartial
);
contractorRouter.get(
    "/contractor/get-stock-office-partial-by-id/:id/:month",
    verifyContractorToken,
    getAllOutletsWithComplaintsByPartialId
);
contractorRouter.get("/contractor/get-po-exists-or-not", verifyContractorToken, getSamePoExistsOrNot);

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
contractorRouter.post("/contractor/save-gst-details", verifyContractorToken, createGstMasters);
contractorRouter.get("/contractor/get-all-saved-gst-masters", verifyContractorToken, getAllGstMasterData);
contractorRouter.get("/contractor/get-saved-gst-details/:id", verifyContractorToken, getGstMasterDetailsById);
contractorRouter.post("/contractor/update-gst-details", verifyContractorToken, updateGstMasters);
contractorRouter.delete("/contractor/delete-gst-details/:id", verifyContractorToken, deleteGstMasterDetailsById);
contractorRouter.get("/contractor/get-gst-on-state-id/:id", verifyContractorToken, getGstDetailsOnStateId);
contractorRouter.get("/contractor/get-all-gst-list", verifyContractorToken, getAllGstMasterDataForDropdown);

//---------------------------Assign manager and supervisor and free end users list--------------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Manager and Supervisor Assignment
 *   description: API endpoints for managing assignments of managers, supervisors, and free end users.
 */

/**
 * @swagger
 * /contractor/get-all-manager-list-with-total-free-end-users:
 *   get:
 *     summary: Retrieve all managers with their total free end users.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all managers with their total free end users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-supervisor-by-manager-with-count-free-end-users/{id}:
 *   get:
 *     summary: Retrieve all supervisors under a specific manager with count of free end users.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the manager to retrieve supervisors for.
 *     responses:
 *       200:
 *         description: List of all supervisors under the specified manager with count of free end users retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Manager not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-end-users-by-supervisor/{id}:
 *   get:
 *     summary: Retrieve all free end users under a specific supervisor.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the supervisor to retrieve end users for.
 *     responses:
 *       200:
 *         description: List of all free end users under the specified supervisor retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Supervisor not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-area-manager-of-user/{id}:
 *   get:
 *     summary: Retrieve the area manager for a specific user.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve the area manager for.
 *     responses:
 *       200:
 *         description: Area manager for the specified user retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User or area manager not found.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get(
    "/contractor/get-all-manager-list-with-total-free-end-users",
    verifyContractorToken,
    getALLmanagersWithTeamMembers
);
contractorRouter.get(
    "/contractor/get-all-supervisor-by-manager-with-count-free-end-users/:id",
    verifyContractorToken,
    getSuperVisorOnManagerId
);
contractorRouter.get(
    "/contractor/get-all-end-users-by-supervisor/:id",
    verifyContractorToken,
    getFreeEndUsersOnSuperVisorId
);
contractorRouter.get("/contractor/get-area-manager-of-user/:id", verifyContractorToken, getAreaManagerOfUser);
// contractorRouter.get('/contractor/get-assign-user-manager-and-supervisor/:complaintId', verifyContractorToken, getComplaintAssignUserManagerAndSupervisor);

/**
 * @swagger
 * /contractor/get-all-users/{role_id}:
 *   get:
 *     summary: Retrieve all users based on their role ID.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role to retrieve users for.
 *     responses:
 *       200:
 *         description: List of all users with the specified role retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */

contractorRouter.get("/contractor/get-all-users/:role_name", verifyContractorToken, getALLSupervisors);

//---------------------------Food expenses routes------------------------

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Food Expenses
 *     description: Routes related to food expenses management.

 * /contractor/get-food-expense:
 *   get:
 *     summary: Retrieve all food expenses.
 *     tags: [Contractor Routes - Food Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all food expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/set-food-expense-limit:
 *   post:
 *     summary: Set the maximum limit for food expenses.
 *     tags: [Contractor Routes - Food Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: number
 *                 format: float
 *                 description: The maximum limit for food expenses.
 *     responses:
 *       200:
 *         description: Food expense limit set successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/punch-food-expense:
 *   post:
 *     summary: Punch a new food expense.
 *     tags: [Contractor Routes - Food Expenses]
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
 *                 description: The amount of the food expense.
 *               description:
 *                 type: string
 *                 description: Description of the food expense.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the food expense.
 *     responses:
 *       200:
 *         description: Food expense punched successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-food-expense", verifyContractorToken, getFoodExpenses);
contractorRouter.post("/contractor/set-food-expense-limit", verifyContractorToken, setFoodExpenseMaxLimit);
contractorRouter.post("/contractor/punch-food-expense", verifyContractorToken, punchFoodExpense);

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

/**
 * @swagger
 * /contractor/get-all-complaints-via-invoice:
 *   get:
 *     summary: Retrieve all complaints associated with invoices.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints via invoices retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-by-id:
 *   get:
 *     summary: Retrieve all complaints associated with a specific invoice ID.
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: Invoice ID to filter complaints.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all complaints for the specific invoice ID retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-via-invoice-ro:
 *   get:
 *     summary: Retrieve all complaints associated with invoices for RO (Regional Office).
 *     tags: [Contractor Routes - Invoice Number Format]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints via invoices for RO retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/generate-invoice-number-format", verifyContractorToken, createInvoiceNumberFormat);
contractorRouter.get(
    "/contractor/get-all-generate-invoice-formats",
    verifyContractorToken,
    getAllGeneratedInvoiceFormat
);
contractorRouter.get(
    "/contractor/get-invoice-number-format-details/:id",
    verifyContractorToken,
    getAllGeneratedInvoiceFormatById
);
contractorRouter.post("/contractor/update-invoice-number-format", verifyContractorToken, updateInvoiceNumberFormat);
contractorRouter.delete(
    "/contractor/delete-invoice-number-format-details/:id",
    verifyContractorToken,
    deleteGeneratedInvoiceFormatById
);
contractorRouter.get("/contractor/get-all-complaints-via-invoice", verifyContractorToken, getAllComplaintViaInvoice);
contractorRouter.get("/contractor/get-all-complaints-by-id", verifyContractorToken, getAllComplaintViaInvoiceById);
contractorRouter.get(
    "/contractor/get-all-complaints-via-invoice-ro",
    verifyContractorToken,
    getAllComplaintViaInvoiceForRo
);

// hr employee import

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - HR Employee Import
 *     description: Routes for importing HR and user data.

 * /contractor/import-data:
 *   post:
 *     summary: Import HR employee data.
 *     tags: [Contractor Routes - HR Employee Import]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File containing HR employee data.
 *     responses:
 *       200:
 *         description: HR employee data imported successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/import-user-data/{id}:
 *   post:
 *     summary: Import user data for a specific ID.
 *     tags: [Contractor Routes - HR Employee Import]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user data to import.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File containing user data.
 *     responses:
 *       200:
 *         description: User data imported successfully for the specified ID.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/import-data", verifyContractorToken, importData);
contractorRouter.post("/contractor/import-user-data/:id", verifyContractorToken, importUserData);

// get module list by logged user plan id

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Module Management
 *     description: Routes for managing modules and user plans.

 * /contractor/get-logged-module-list-plan:
 *   get:
 *     summary: Get module list based on the logged user's plan ID.
 *     tags: [Contractor Routes - Module Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modules based on the user's plan ID.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Employee Management
 *     description: Routes for managing employee information and actions.

 * /Contractor/register-employee-resignation:
 *   post:
 *     summary: Register an employee resignation.
 *     tags: [Contractor Routes - Employee Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: ID of the employee resigning.
 *               resignationDate:
 *                 type: string
 *                 format: date
 *                 description: Date of resignation.
 *               reason:
 *                 type: string
 *                 description: Reason for resignation.
 *     responses:
 *       200:
 *         description: Employee resignation registered successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-logged-module-list-plan", verifyContractorToken, getModuleByPlanId);
contractorRouter.post("/Contractor/register-employee-resignation", verifyContractorToken, registerResignation);

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
contractorRouter.post("/contractor/create-loans", verifyContractorToken, createLoan);
contractorRouter.get("/contractor/get-all-loans-pending", verifyContractorToken, getAllLoanRequests);
contractorRouter.get("/contractor/get-all-loans-active", verifyContractorToken, getAllActiveLoan);
contractorRouter.get("/contractor/get-all-loans-reject", verifyContractorToken, getAllRejectedLoan);
contractorRouter.get("/contractor/get-all-loans-closed", verifyContractorToken, getAllClosedLoan);
contractorRouter.get("/contractor/get-loan-details/:id", verifyContractorToken, getLoanDetailById);
contractorRouter.post("/contractor/update-loan-details", verifyContractorToken, updateLoanDetails);
contractorRouter.post("/contractor/changed-loan-status", verifyContractorToken, updateLoanStatus);
contractorRouter.post("/contractor/delete-loan-details/:id", verifyContractorToken, deleteLoanDetailById);

// outlets

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/add-outlet:
 *   post:
 *     summary: Add a new outlet.
 *     tags: [Contractor Routes - Outlets Management]
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
 *                 description: Name of the outlet.
 *               address:
 *                 type: string
 *                 description: Address of the outlet.
 *               energyCompanyId:
 *                 type: string
 *                 description: ID of the energy company.
 *               districtId:
 *                 type: string
 *                 description: ID of the district.
 *               salesAreaId:
 *                 type: string
 *                 description: ID of the sales area.
 *     responses:
 *       200:
 *         description: Outlet added successfully.
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
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/all-outlets:
 *   get:
 *     summary: Get all outlets.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet/{id}:
 *   get:
 *     summary: Get details of a specific outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet.
 *     responses:
 *       200:
 *         description: Details of the specified outlet.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/edit-outlet/{id}:
 *   get:
 *     summary: Get details for editing a specific outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet.
 *     responses:
 *       200:
 *         description: Details of the specified outlet for editing.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/update-outlet:
 *   post:
 *     summary: Update details of an existing outlet.
 *     tags: [Contractor Routes - Outlets Management]
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
 *                 description: ID of the outlet to be updated.
 *               name:
 *                 type: string
 *                 description: Updated name of the outlet.
 *               address:
 *                 type: string
 *                 description: Updated address of the outlet.
 *               energyCompanyId:
 *                 type: string
 *                 description: Updated ID of the energy company.
 *               districtId:
 *                 type: string
 *                 description: Updated ID of the district.
 *               salesAreaId:
 *                 type: string
 *                 description: Updated ID of the sales area.
 *     responses:
 *       200:
 *         description: Outlet updated successfully.
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
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/approve-reject-outlet-by-id:
 *   post:
 *     summary: Approve or reject an outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
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
 *                 description: ID of the outlet.
 *               status:
 *                 type: string
 *                 description: Status of the outlet (approved or rejected).
 *     responses:
 *       200:
 *         description: Outlet status updated successfully.
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
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/delete-outlet/{id}:
 *   delete:
 *     summary: Delete an outlet by ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the outlet to be deleted.
 *     responses:
 *       200:
 *         description: Outlet deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Outlet not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-energy-company-id/{id}:
 *   get:
 *     summary: Get outlets by energy company ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the energy company.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified energy company.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-district-id/{id}:
 *   get:
 *     summary: Get outlets by district ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the district.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified district.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-outlet-by-sales-area-id/{id}:
 *   get:
 *     summary: Get outlets by sales area ID.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sales area.
 *     responses:
 *       200:
 *         description: List of outlets associated with the specified sales area.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/get-all-outlet-for-dropdown:
 *   get:
 *     summary: Get all outlets for dropdown selection.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all outlets suitable for dropdown selection.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Outlets Management
 *     description: Routes for managing outlet information.

 * /contractor/import-outlet:
 *   post:
 *     summary: Import outlet data from a file.
 *     tags: [Contractor Routes - Outlets Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File containing outlet data.
 *     responses:
 *       200:
 *         description: Outlet data imported successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/add-outlet", verifyContractorToken, addOutlet);
contractorRouter.get("/contractor/all-outlets", verifyContractorToken, getAllOutlet);
contractorRouter.get("/contractor/get-outlet/:id", verifyContractorToken, getOutletById);
contractorRouter.get("/contractor/edit-outlet/:id", verifyContractorToken, editOutlet);
contractorRouter.post("/contractor/update-outlet", verifyContractorToken, updateOutlet);
contractorRouter.post("/contractor/approve-reject-outlet-by-id", verifyContractorToken, approveRejectOutletByStatus);
contractorRouter.delete("/contractor/delete-outlet/:id", verifyContractorToken, removeOutletById);
contractorRouter.get(
    "/contractor/get-outlet-by-energy-company-id/:id",
    verifyContractorToken,
    getOutletByEnergyCompanyId
);
contractorRouter.get("/contractor/get-outlet-by-district-id/:id", verifyContractorToken, getOutletByDistrictId);
contractorRouter.get("/contractor/get-outlet-by-sales-area-id/:id", verifyContractorToken, getOutletBySalesId);
contractorRouter.get("/contractor/get-all-outlet-for-dropdown", verifyContractorToken, getAllOutletForDropdown);
contractorRouter.post("/contractor/import-outlet", verifyContractorToken, importOutlet);

// pdf

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Document Management
 *     description: Routes for managing and retrieving attached documents and PDFs.

 * /contractor/get-attached-documents-by-measurement-id/{id}:
 *   get:
 *     summary: Get all attached documents by measurement ID.
 *     tags: [Contractor Routes - Document Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the measurement to retrieve attached documents for.
 *     responses:
 *       200:
 *         description: List of attached documents for the specified measurement ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Measurement not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Document Management
 *     description: Routes for managing and retrieving attached documents and PDFs.

 * /contractor/get-attached-documents-by-proforma-id/{id}:
 *   get:
 *     summary: Get proforma invoice PDF by proforma ID.
 *     tags: [Contractor Routes - Document Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the proforma invoice to retrieve the PDF for.
 *     responses:
 *       200:
 *         description: PDF of the proforma invoice for the specified ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Proforma invoice not found.
 *       500:
 *         description: Internal server error.
 */
// contractorRouter.get("/contractor/get-attached-documents-by-measurement-id/:id", attachAllDocumentsByMeasurementId);

// dashboard
// contractorRouter.get("/contractor/get-total-complaints", verifyContractorToken, getTotalComplaintsCount)

// dashboard

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Dashboard
 *     description: Routes for retrieving various dashboard metrics and statistics.
 *
 * /contractor/get-complaints-count:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get total count of complaints.
 *     description: Retrieve the total number of complaints in the system.
 *     responses:
 *       200:
 *         description: Total number of complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints count fetched successfully.
 *               data:
 *                 count: 150
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-total-complaints:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get all complaints.
 *     description: Retrieve a list of all complaints.
 *     responses:
 *       200:
 *         description: List of all complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   description: "Complaint description"
 *                   status: "Open"
 *                   created_at: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-complaints:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get total number of complaints each month.
 *     description: Retrieve the number of complaints reported each month.
 *     responses:
 *       200:
 *         description: Monthly complaints count.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly complaints count fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   count: 30
 *                 - month: "August 2024"
 *                   count: 25
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-area-managers:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for area managers.
 *     description: Retrieve dashboard information for area managers.
 *     responses:
 *       200:
 *         description: Dashboard data for area managers.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Area managers dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Manager A"
 *                   total_activities: 50
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-end-users-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for end users.
 *     description: Retrieve dashboard information for end users.
 *     responses:
 *       200:
 *         description: Dashboard data for end users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: End users dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "User A"
 *                   total_orders: 120
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-measurement-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly measurement amount.
 *     description: Retrieve the measurement amount recorded each month.
 *     responses:
 *       200:
 *         description: Measurement amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly measurement amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 10000
 *                 - month: "August 2024"
 *                   amount: 12000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-proforma-invoice-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly proforma invoice amount.
 *     description: Retrieve the proforma invoice amount recorded each month.
 *     responses:
 *       200:
 *         description: Proforma invoice amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly proforma invoice amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 15000
 *                 - month: "August 2024"
 *                   amount: 18000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-monthly-invoice-amount:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get monthly invoice amount.
 *     description: Retrieve the invoice amount recorded each month.
 *     responses:
 *       200:
 *         description: Invoice amount each month.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Monthly invoice amounts fetched successfully.
 *               data:
 *                 - month: "July 2024"
 *                   amount: 20000
 *                 - month: "August 2024"
 *                   amount: 22000
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-complaints-by-status:
 *   post:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get all complaints filtered by status.
 *     description: Retrieve all complaints based on their status.
 *     parameters:
 *       - in: body
 *         name: status
 *         description: Status to filter complaints.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "Open"
 *     responses:
 *       200:
 *         description: List of complaints filtered by status.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints filtered by status fetched successfully.
 *               data:
 *                 - id: 1
 *                   description: "Complaint description"
 *                   status: "Open"
 *                   created_at: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-payment-recieve-in-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get dashboard data for received payments.
 *     description: Retrieve dashboard information for received payments.
 *     responses:
 *       200:
 *         description: Dashboard data for received payments.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Payment dashboard data fetched successfully.
 *               data:
 *                 - id: 1
 *                   amount_received: 50000
 *                   date: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-area-manager-billing-dashboard:
 *   get:
 *     tags: [Contractor Routes - Dashboard]
 *     summary: Get billing dashboard data for area managers.
 *     description: Retrieve billing dashboard information for area managers.
 *     responses:
 *       200:
 *         description: Billing dashboard data for area managers.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Billing dashboard data for area managers fetched successfully.
 *               data:
 *                 - id: 1
 *                   total_billing: 100000
 *                   date: "2024-08-16T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-complaints-count", verifyContractorToken, getTotalComplaintsCount);
contractorRouter.get("/contractor/get-total-complaints", verifyContractorToken, getTotalComplaints);
contractorRouter.get("/contractor/get-monthly-complaints", verifyContractorToken, getTotalComplaintsCountEachMonth);
contractorRouter.get("/contractor/get-area-managers", verifyContractorToken, getAreaManagersDashboard);
contractorRouter.get("/contractor/get-end-users-dashboard", verifyContractorToken, getEndUsersDashboard);
contractorRouter.get(
    "/contractor/get-monthly-measurement-amount",
    verifyContractorToken,
    getMeasurementAmountEachMonth
);
contractorRouter.get(
    "/contractor/get-monthly-proforma-invoice-amount",
    verifyContractorToken,
    getProformaInvoiceEachMonthAmount
);
contractorRouter.get("/contractor/get-monthly-invoice-amount", verifyContractorToken, getInvoiceEachMonthAmount);
contractorRouter.post("/contractor/get-all-complaints-by-status", verifyContractorToken, getAllComplaintsByStatus);
contractorRouter.get("/contractor/get-all-payment-recieve-in-dashboard", verifyContractorToken, getBillingDashboard);
contractorRouter.get(
    "/contractor/get-area-manager-billing-dashboard",
    verifyContractorToken,
    areaManagerDashboardforBilling
);

/**
 * @swagger
 * tags:
 *   name: Contractor - RO Billing Dashboard
 *   description: API routes for retrieving billing dashboard information for Regional Offices (RO).
 */

/**
 * @swagger
 * /contractor/get-ro-billing-dashboard:
 *   get:
 *     tags: [Contractor - RO Billing Dashboard]
 *     summary: Get RO Billing Dashboard
 *     description: Retrieve billing dashboard information for Regional Offices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RO billing dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               dashboard:
 *                 total_billed: 150000
 *                 total_paid: 100000
 *                 outstanding_amount: 50000
 *                 invoices:
 *                   - invoice_id: 101
 *                     amount: 50000
 *                     due_date: 2024-08-31
 *                   - invoice_id: 102
 *                     amount: 50000
 *                     due_date: 2024-09-15
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

contractorRouter.get("/contractor/get-ro-billing-dashboard", verifyContractorToken, roDashboardforBilling);

// brand

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Brand
 *     description: Routes for managing brands.
 *
 * /contractor/create-brand:
 *   post:
 *     tags: [Contractor Routes - Brand]
 *     summary: Create a new brand.
 *     description: Create a new brand with the provided details.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the brand.
 *               logo:
 *                 type: string
 *                 description: URL of the brand's logo.
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Brand created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brand created successfully.
 *               data:
 *                 id: 1
 *                 name: "New Brand"
 *                 logo: "brand_logo/new_brand_logo.jpg"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/update-brand:
 *   post:
 *     tags: [Contractor Routes - Brand]
 *     summary: Update an existing brand.
 *     description: Update the details of an existing brand.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the brand to update.
 *               name:
 *                 type: string
 *                 description: New name of the brand.
 *               logo:
 *                 type: string
 *                 description: New URL of the brand's logo.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Brand updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brand updated successfully.
 *               data:
 *                 id: 1
 *                 name: "Updated Brand"
 *                 logo: "brand_logo/updated_brand_logo.jpg"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-brand:
 *   get:
 *     tags: [Contractor Routes - Brand]
 *     summary: Get all brands.
 *     description: Retrieve a list of all brands.
 *     responses:
 *       200:
 *         description: List of all brands.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brands fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Brand A"
 *                   logo: "brand_logo/brand_a_logo.jpg"
 *                 - id: 2
 *                   name: "Brand B"
 *                   logo: "brand_logo/brand_b_logo.jpg"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-brand-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Brand]
 *     summary: Get a brand by ID.
 *     description: Retrieve details of a specific brand by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the brand to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Brand details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brand details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Brand A"
 *                 logo: "brand_logo/brand_a_logo.jpg"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-brand/{id}:
 *   delete:
 *     tags: [Contractor Routes - Brand]
 *     summary: Delete a brand.
 *     description: Remove a brand by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the brand to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Brand deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brand deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-brand-markdown:
 *   get:
 *     tags: [Contractor Routes - Brand]
 *     summary: Get all brands in Markdown format.
 *     description: Retrieve a list of all brands in Markdown format.
 *     responses:
 *       200:
 *         description: List of all brands in Markdown format.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Brands in Markdown format fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-brand", verifyContractorToken, createBrand);
contractorRouter.post("/contractor/update-brand", verifyContractorToken, updateBrand);
contractorRouter.get("/contractor/get-all-brand", verifyContractorToken, getAllBrands);
contractorRouter.get("/contractor/get-brand-by-id/:id", verifyContractorToken, getBrandById);
contractorRouter.delete("/contractor/delete-brand/:id", verifyContractorToken, deleteBrand);
contractorRouter.get("/contractor/get-all-brand-markdown", verifyContractorToken, getAllBrandsMarkDown);
contractorRouter.get("/contractor/get-brands-by-item-id/:id", verifyContractorToken, getBrandsByItemId);

// feedback and suggestions

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Feedback and Suggestions
 *     description: Routes for managing feedback and complaints.
 *
 * /contractor/create-feedback-and-complaint:
 *   post:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Create or update feedback and complaint.
 *     description: Create a new feedback or complaint, or update an existing one.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the feedback or complaint (e.g., 'feedback' or 'complaint').
 *               description:
 *                 type: string
 *                 description: Description of the feedback or complaint.
 *             required:
 *               - type
 *               - description
 *     responses:
 *       201:
 *         description: Feedback or complaint created or updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint created/updated successfully.
 *               data:
 *                 id: 1
 *                 type: "complaint"
 *                 description: "Detailed description of the complaint."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/add-response/{id}:
 *   post:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Add a response to a feedback or complaint.
 *     description: Add a response to the specified feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to respond to.
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *                 description: Response to the feedback or complaint.
 *             required:
 *               - response
 *     responses:
 *       200:
 *         description: Response added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Response added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-feedback-and-complaint:
 *   get:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Get all feedback and complaints.
 *     description: Retrieve a list of all feedback and complaints.
 *     responses:
 *       200:
 *         description: List of all feedback and complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback and complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   type: "complaint"
 *                   description: "Detailed description of the complaint."
 *                   response: "Response to the complaint."
 *                 - id: 2
 *                   type: "feedback"
 *                   description: "Detailed description of the feedback."
 *                   response: "Response to the feedback."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-feedback-and-complaint/{id}:
 *   get:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Get feedback or complaint by ID.
 *     description: Retrieve details of a specific feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback or complaint details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint details fetched successfully.
 *               data:
 *                 id: 1
 *                 type: "complaint"
 *                 description: "Detailed description of the complaint."
 *                 response: "Response to the complaint."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-feedback-and-complaint/{id}:
 *   delete:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Delete a feedback or complaint.
 *     description: Remove a feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback or complaint deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-feedback-and-complaint", verifyContractorToken, addUpdateFeedbackComplaint);
contractorRouter.post("/contractor/add-response/:id", verifyContractorToken, addResponseToFeedbackComplaint);
contractorRouter.get("/contractor/get-all-feedback-and-complaint", verifyContractorToken, getFeedbackComplaint);
contractorRouter.get("/contractor/get-feedback-and-complaint/:id", verifyContractorToken, getFeedbackComplaintById);
contractorRouter.delete(
    "/contractor/delete-feedback-and-complaint/:id",
    verifyContractorToken,
    deleteFeedbackComplaint
);

// sale orders

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Sales Orders
 *     description: Routes for managing sales orders.
 *
 * /contractor/create-so-order:
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
 * /contractor/update-so-details:
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
 * /contractor/get-all-generated-so:
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
 * /contractor/get-single-so-details/{id}:
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
 * /contractor/delete-so-details/{id}:
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
 * /contractor/check-so-is-exists:
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
 * /contractor/get-so-details-on-ro/{id}:
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
 * /contractor/change-so-status:
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
 * /contractor/get-sales-order-details-with-items/{id}:
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
 * /contractor/approve-sales-order:
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
 * /contractor/approve-update-sales-order:
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
 * /contractor/get-sales-security-unique-id:
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
 * /contractor/get-ro-for-so:
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
 * /contractor/get-so-number-for-so:
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
contractorRouter.post("/contractor/create-so-order", verifyContractorToken, createSalesOrder);
contractorRouter.post("/contractor/update-so-details", verifyContractorToken, updateSalesOrderDetails);
contractorRouter.get("/contractor/get-all-generated-so", verifyContractorToken, getAllGeneratedSalesOrder);
contractorRouter.get("/contractor/get-single-so-details/:id", verifyContractorToken, getSalesOrderDetailsById);
contractorRouter.delete("/contractor/delete-so-details/:id", verifyContractorToken, deleteSalesOrder);
contractorRouter.get("/contractor/check-so-is-exists", verifyContractorToken, checkSONumberIsAlreadyExists);
contractorRouter.get("/contractor/get-so-details-on-ro/:id", verifyContractorToken, getSoListOnRoId);
contractorRouter.post("/contractor/change-so-status", verifyContractorToken, changeSoStatus);
contractorRouter.get(
    "/contractor/get-sales-order-details-with-items/:id",
    verifyContractorToken,
    getSalesOrderItemsOnSo
);
contractorRouter.post("/contractor/approve-sales-order", verifyContractorToken, approveSalesOrder);
contractorRouter.post("/contractor/approve-update-sales-order", verifyContractorToken, approveAndUpdateSalesOrder);
contractorRouter.get("/contractor/get-sales-security-unique-id", verifyContractorToken, getSalesSecurityUniqueId);
contractorRouter.get("/contractor/get-ro-for-so", verifyContractorToken, getRoForSalesOrder);
contractorRouter.get("/contractor/get-so-number-for-so", verifyContractorToken, getSoNumberForSalesOrder);

//  energy company teams

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Energy Company Teams
 *     description: Routes for managing energy company team members.
 *
 * /contractor/create-energy-company-user:
 *   post:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Create a new energy company team user.
 *     description: Add a new user to the energy company team.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               role:
 *                 type: string
 *                 description: Role of the user in the team.
 *               energyCompanyId:
 *                 type: integer
 *                 description: ID of the energy company.
 *             required:
 *               - name
 *               - email
 *               - role
 *               - energyCompanyId
 *     responses:
 *       201:
 *         description: Energy company user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user created successfully.
 *               data:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 role: "Manager"
 *                 energyCompanyId: 123
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/update-energy-company-user:
 *   post:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Update an energy company team user.
 *     description: Modify the details of an existing energy company team user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user to update.
 *               name:
 *                 type: string
 *                 description: Updated name of the user.
 *               email:
 *                 type: string
 *                 description: Updated email of the user.
 *               role:
 *                 type: string
 *                 description: Updated role of the user.
 *               energyCompanyId:
 *                 type: integer
 *                 description: Updated energy company ID.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Energy company user updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company user updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-energy-company-users:
 *   get:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Get details of all energy company team users.
 *     description: Retrieve a list of all users in the energy company team.
 *     responses:
 *       200:
 *         description: List of energy company team users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   role: "Manager"
 *                   energyCompanyId: 123
 *                 - id: 2
 *                   name: "Jane Smith"
 *                   email: "jane.smith@example.com"
 *                   role: "Engineer"
 *                   energyCompanyId: 123
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-energy-company-user/{id}:
 *   delete:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Delete an energy company team user.
 *     description: Remove a user from the energy company team by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete.
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
 *
 * /contractor/get-area-data-for-energy/{energy_company_id}/{type}:
 *   get:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Get area data for an energy company.
 *     description: Retrieve area-specific data related to an energy company.
 *     parameters:
 *       - in: path
 *         name: energy_company_id
 *         required: true
 *         description: ID of the energy company.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: type
 *         required: true
 *         description: Company type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area data for the energy company.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Area data fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Region A"
 *                   type: "Subsidiary"
 *                   energyCompanyId: 123
 *                 - id: 2
 *                   name: "Region B"
 *                   type: "Subsidiary"
 *                   energyCompanyId: 123
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/create-energy-company-user", verifyContractorToken, createEnergyTeam);
contractorRouter.post("/contractor/update-energy-company-user", verifyContractorToken, updateEnergyTeam);
contractorRouter.get("/contractor/get-energy-company-users", verifyContractorToken, getEnergyTeamDetailsById);
contractorRouter.delete("/contractor/delete-energy-company-user/:id", verifyContractorToken, deleteEnergyTeam);
contractorRouter.get(
    "/contractor/get-area-data-for-energy/:energy_company_id/:type",
    verifyContractorToken,
    getEnergyCompanySubSidiaries
);

// messages

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Messages
 *     description: Routes for managing messages.
 *
 * /contractor/send-message:
 *   post:
 *     tags: [Contractor Routes - Messages]
 *     summary: Send a new message.
 *     description: Create and send a new message.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: integer
 *                 description: ID of the message recipient.
 *               subject:
 *                 type: string
 *                 description: Subject of the message.
 *               body:
 *                 type: string
 *                 description: Body content of the message.
 *             required:
 *               - recipientId
 *               - subject
 *               - body
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Message sent successfully.
 *               data:
 *                 id: 1
 *                 recipientId: 123
 *                 subject: "Meeting Reminder"
 *                 body: "Don't forget our meeting tomorrow at 10 AM."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/update-message:
 *   post:
 *     tags: [Contractor Routes - Messages]
 *     summary: Update an existing message.
 *     description: Modify the details of an existing message.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the message to update.
 *               subject:
 *                 type: string
 *                 description: Updated subject of the message.
 *               body:
 *                 type: string
 *                 description: Updated body content of the message.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Message updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Message updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-messages:
 *   get:
 *     tags: [Contractor Routes - Messages]
 *     summary: Get all messages.
 *     description: Retrieve a list of all messages.
 *     responses:
 *       200:
 *         description: List of all messages.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Messages fetched successfully.
 *               data:
 *                 - id: 1
 *                   recipientId: 123
 *                   subject: "Meeting Reminder"
 *                   body: "Don't forget our meeting tomorrow at 10 AM."
 *                 - id: 2
 *                   recipientId: 456
 *                   subject: "Project Update"
 *                   body: "The project is progressing well."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-message-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Messages]
 *     summary: Get a message by ID.
 *     description: Retrieve a specific message by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the message to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Message fetched successfully.
 *               data:
 *                 id: 1
 *                 recipientId: 123
 *                 subject: "Meeting Reminder"
 *                 body: "Don't forget our meeting tomorrow at 10 AM."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-message/{id}:
 *   delete:
 *     tags: [Contractor Routes - Messages]
 *     summary: Delete a message.
 *     description: Remove a message by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the message to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Message deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.post("/contractor/send-message", verifyContractorToken, sendMessage);
contractorRouter.post("/contractor/update-message", verifyContractorToken, updateMessage);
contractorRouter.get("/contractor/get-all-messages", verifyContractorToken, getAllMessages);
contractorRouter.get("/contractor/get-message-by-id/:id", verifyContractorToken, getMessageById);
contractorRouter.delete("/contractor/delete-message/:id", verifyContractorToken, deleteMessage);

// contacts

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Contacts
 *     description: Routes for managing and retrieving contact details.
 *
 * /contractor/get-dealer-users:
 *   get:
 *     tags: [Contractor Routes - Contacts]
 *     summary: Get all dealer users.
 *     description: Retrieve a list of all dealer users.
 *     responses:
 *       200:
 *         description: List of all dealer users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Alice Johnson"
 *                   email: "alice.johnson@example.com"
 *                   role: "Dealer"
 *                 - id: 2
 *                   name: "Bob Smith"
 *                   email: "bob.smith@example.com"
 *                   role: "Dealer"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-client-users:
 *   get:
 *     tags: [Contractor Routes - Contacts]
 *     summary: Get all client users.
 *     description: Retrieve a list of all client users.
 *     responses:
 *       200:
 *         description: List of all client users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Client users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Charlie Brown"
 *                   email: "charlie.brown@example.com"
 *                   role: "Client"
 *                 - id: 2
 *                   name: "Dana White"
 *                   email: "dana.white@example.com"
 *                   role: "Client"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-dealer-by-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Contacts]
 *     summary: Get a dealer by ID.
 *     description: Retrieve the details of a specific dealer by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the dealer to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dealer details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Dealer details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Alice Johnson"
 *                 email: "alice.johnson@example.com"
 *                 role: "Dealer"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.get("/contractor/get-dealer-users", verifyContractorToken, getAllDealerUsers);
contractorRouter.get("/contractor/get-client-users", verifyContractorToken, getAllAdmins);
contractorRouter.get("/contractor/get-dealer-by-id/:id", verifyContractorToken, getDealerById);
// contractorRouter.post("/contractor/import-excel-data", verifyContractorToken, bulkInsertExcelData);

module.exports = contractorRouter;

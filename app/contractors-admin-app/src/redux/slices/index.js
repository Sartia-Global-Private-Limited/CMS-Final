import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tokenAuthSlice from './tokenAuthSlice';
import getDarkModeSlice from './darkmode/getDarkModeSlice';
import getLanguageSlice from './languagelabel/getLanguageSlice';

/*import all  company slice here*/
import getCompanyListSlice from './company/getCompanyListSlice';
import companyDetailSlice from './company/companyDetailSlice';
import deleteCompanySlice from './company/deleteCompanySlice';
import createCompanySlice from './company/createCompanySlice';

/*import all  module submodule slice here*/
import moduleSlice from './module/moduleSlice';
import subModuleSlice from './submodule/subModuleSlice';

/*import all  complaints slice here*/
import getComplaintListSlice from './complaint/getComplaintListSlice';
import getAllComplaintListSlice from './complaint/getAllComplaintListSlice';
import getRequestComplaintListSlice from './complaint/getRequestComplaintListSlice';
import getRejectedComplaintListSlice from './complaint/getRejectedComplaintListSlice';
import getResolvedComplaintListSlice from './complaint/getResolvedComplaintListSlice';
import getAllocatedComplaintListSlice from './complaint/getAllocatedComplaintListSlice';
import getUnAssignComplaintListSlice from './complaint/getUnAssignComplaintListSlice';
import getAssignComplaintListSlice from './complaint/getAssignComplaintListSlice';
import getAllApprovedComplaintListSlice from './complaint/getAllApprovedComplaintListSlice';
import getComplaintTimelineSlice from './complaint/getComplaintTimelineSlice';
import getComplaintDetailSlice from './complaint/getComplaintDetailSlice';
import orederViaSlice from './order-via/orederViaSlice';

/*import all  teams slice here*/
import getTeamListSlice from './hr-management/teams/getTeamListSlice';
import getTeamDetailSlice from './hr-management/teams/getTeamDetailSlice';

/*import all  employees slice here*/
import getEmployeeListSlice from './hr-management/employees/getEmployeeListSlice';
import getEmployeeDetailSlice from './hr-management/employees/getEmployeeDetailSlice';

/*import all  attendance slice here*/
import getTimeSheetSlice from './hr-management/attendance/getTimeSheetSlice';
import getClockInSlice from './hr-management/attendance/getClockInSlice';
import getClockOutSlice from './hr-management/attendance/getClockOutSlice';
import getCalendarSlice from './hr-management/attendance/getCalendarSlice';
import getUserDetailSlice from './hr-management/attendance/getUserDetailSlice';
import getUserTimesheetSlice from './hr-management/attendance/getUserTimesheetSlice';

/*import all  leave slice here*/
import getLeaveListSlice from './hr-management/leave/getLeaveListSlice';

/*import all  payroll slice here*/
import getAllowanceListSlice from './hr-management/payroll/getAllowanceListSlice';
import getDeductionListSlice from './hr-management/payroll/getDeductionListSlice';

/*import all  payroll master slice here*/
import getSettingListSlice from './hr-management/payroll-master/getSettingListSlice';

/*import all insurance slice here*/
import getInsuranceListSlice from './hr-management/group-insurance/getInsuranceListSlice';
import getInsuranceDetailSlice from './hr-management/group-insurance/getInsuranceDetailSlice';
import getInsurancePlanDetailSlice from './hr-management/group-insurance/getInsurancePlanDetailSlice';

/*import all  Loans slice here*/
import getLoanListSlice from './hr-management/loan/getLoanListSlice';

/*import all Resignation slice here*/
import getPendingResignationSlice from './hr-management/resignation/getPendingResignationSlice';
import getRejectedResignationSlice from './hr-management/resignation/getRejectedResignationSlice';
import getApprovedResignationSlice from './hr-management/resignation/getApprovedResignationSlice';
import getFnfResignationSlice from './hr-management/resignation/getFnfResignationSlice';

/*import all  promotion demotion slice here*/
import getPromotioDemotionSlice from './hr-management/promotion-demotion/getPromotioDemotionSlice';
import getPromotionDemotionDetailSlice from './hr-management/promotion-demotion/getPromotionDemotionDetailSlice';

/*import all  Retirement slice here*/
import getRetirementListSlice from './hr-management/retirement/getRetirementListSlice';
import getRetirementDetailSlice from './hr-management/retirement/getRetirementDetailSlice';

/*import all  employees logs slice here*/
import getLogsListSlice from './hr-management/logs/getLogsListSlice';
import getLogDetailSlice from './hr-management/logs/getLogDetailSlice';

/*import all  Work Image Managemet  slice here*/
import getAllWorkImageListSlice from './work-images-mangement/getAllWorkImageListSlice';

/*import all  Ducument slice here*/
import getDocumentListSlice from './document/getDocumentListSlice';
import getDocCategoryListSlice from './document/getDocCategoryListSlice';

/*import all  Work Quotation slice here*/
import getWorkQuotationListSlice from './work-quotation/getWorkQuotationListSlice';
import getQuotationDetailSlice from './work-quotation/getQuotationDetailSlice';

/*import all Plan and Pricing slice here*/
import getPlanPricingListSlice from './plan-pricing/getPlanPricingListSlice';

/*import all  suppliers slice here*/
import getSupplierListSlice from './suppliers/getSupplierListSlice';
import getSupplierDetailSlice from './suppliers/getSupplierDetailSlice';

/*import all outlet management slice here */
import getOutletListSlice from './outlet management/getOutletListSlice';
import getOutletDetailSlice from './outlet management/getOutletDetailSlice';

/* import all assest slice here */
import getAssestListSlice from './assest mangement/getAssestListSlice';
import getAssestDetailSlice from './assest mangement/getAssestDetailSlice';
import getAssestTimelineSlice from './assest mangement/getAssestTimelineSlice';

/*import all  Category slice here*/
import getCategoryListSlice from './category&product/category/getCategoryListSlice';
import getCategoryDetailSlice from './category&product/category/getCategoryDetailSlice';

/*import all  Unit Data Slice here*/
import getUnitDataListSlice from './category&product/unitData/getUnitDataListSlice';
import getUnitDataDetailSlice from './category&product/unitData/getUnitDataDetailSlice';

/*import all  Product slice here*/
import getProductListSlice from './category&product/product/getProductListSlice';
import getProductDetailSlice from './category&product/product/getProductDetailSlice';

/* import all contact slices here*/
import getContactListSlice from './contacts/all contact/getContactListSlice';

/*import all Bulk message slice here*/
import getBulkMessageListSlice from './contacts/all message/getBulkMessageListSlice';
import getBulkMessageDetailSlice from './contacts/all message/getBulkMessageDetailSlice';

/* import all energy team slice here */
import getEnergyTeamListSlice from './energy team/getEnergyTeamListSlice';
import getEnergyTeamDetailSlice from './energy team/getEnergyTeamDetailSlice';

/*import all  Task management slice here*/
import getTaskDashboardDataSlice from './task-mangement/getTaskDashboardDataSlice';
import getTaskCategoryListSlice from './task-mangement/getTaskCategoryListSlice';
import getAllTaskListSlice from './task-mangement/getAllTaskListSlice';
import getTaskDetailSlice from './task-mangement/getTaskDetailSlice';

/*import all  Tutorial slice here*/
import getTutorialListSlice from './tutorials/getTutorialListSlice';

/*import all  profile slice here*/
import getProfileDetailSlice from './profile/getProfileDetailSlice';

/*import all  Earthing Testing slice here*/
import getAllETListSlice from './earthing testing/getAllETListSlice';

/*import all  Bank management slice here*/
import getBankListSlice from './master-data-management/bank-mangement/getBankListSlice';

/*import all  Finacial Year slice here*/
import getFinacialYearListSlice from './master-data-management/financial-year/getFinacialYearListSlice';

/*import all  Tax slice here*/
import getTaxListSlice from './master-data-management/tax/getTaxListSlice';

/*import all  Gst Tax  slice here*/
import getGstTaxListSlice from './master-data-management/gst-tax/getGstTaxListSlice';

/*import all  Pay Method slice here*/
import getPayMethodListSlice from './master-data-management/payment-method/getPayMethodListSlice';

/*import all  Bill Format slice here*/
import getBillFormatListSlice from './master-data-management/bill-format/getBillFormatListSlice';

/*import all  Account slice here*/
import getAccountListSlice from './master-data-management/account-mangement/getAccountListSlice';
import getAccountDetailSlice from './master-data-management/account-mangement/getAccountDetailSlice';
import getTransactionHistorySlice from './master-data-management/account-mangement/getTransactionHistorySlice';

/*******************    Fund Management Module  *************************/

/*import all Fund Request slice here*/
import getFundRequestListSlice from './fund-management/fund-request/getFundRequestListSlice';
import getFundRequestDetailSlice from './fund-management/fund-request/getFundRequestDetailSlice';
import getExistingItemListSlice from './fund-management/fund-request/getExistingItemListSlice';

/*import all Fund Transfer slice here*/
import getFundTransferListSlice from './fund-management/fund-transfer/getFundTransferListSlice';

/*import all  Fund balance overview slice here*/
import getBankBalanceListSlice from './fund-management/fund balance overview/getBankBalanceListSlice';
import getEmpBalanceListSlice from './fund-management/fund balance overview/getEmpBalanceListSlice';

/*import all Fund Transactions slice here*/
import getBankFundTransactionsListSlice from './fund-management/fund-transactions/getBankFundTransactionsListSlice';
import getEmpFundTransactionListSlice from './fund-management/fund-transactions/getEmpFundTransactionListSlice';

/*******************  Stock Management Module   *************************/

/*import all  Stock Request slice here*/
import getStockRequestListSlice from './stock-management/stock-request/getStockRequestListSlice';
import getStockRequestDetailSlice from './stock-management/stock-request/getStockRequestDetailSlice';
import getStockItemSlice from './stock-management/stock-request/getStockItemSlice';

/*import all  Stock Transfer slice here*/
import getStockTransferListSlice from './stock-management/stock-transfer/getStockTransferListSlice';

/*import all  Expense Request slice here*/
import getExpenseRequestListSlice from './expense-management/expense-request/getExpenseRequestListSlice';
import getExpenseRequestDetailSlice from './expense-management/expense-request/getExpenseRequestDetailSlice';

/*import all  Expense Punch slice here*/
import getExpensePunchListSlice from './expense-management/expense-punch/getExpensePunchListSlice';
import getExpensePunchDetailSlice from './expense-management/expense-punch/getExpensePunchDetailSlice';

/*import all  Expense balance slice here*/
import getExpenseBalanceSlice from './expense-management/expense-balance/getExpenseBalanceSlice';

/*import all Expense Transaction slice here*/
import getExpenseTransactionSlice from './expense-management/expense transaction/getExpenseTransactionSlice';

/*import all  Stock punch request  slice here*/
import getSPRequestListSlice from './stock-punch-management/stock-punch-request/getSPRequestListSlice';
import getSPRequestDetailSlice from './stock-punch-management/stock-punch-request/getSPRequestDetailSlice';

/*import all  Stock punch slice here*/
import getStockPunchListSlice from './stock-punch-management/stock-punch/getStockPunchListSlice';
import getStockPunchDetailSlice from './stock-punch-management/stock-punch/getStockPunchDetailSlice';

/*import all  Stock Punch Transfer slice here*/
import getSPTransferListSlice from './stock-punch-management/stock-transfer/getSPTransferListSlice';
import getSPTransferDetailSlice from './stock-punch-management/stock-transfer/getSPTransferDetailSlice';

/*import all  ------------ slice here*/

/*import all stock balance overview slice here*/
import getSupplierBalanceListSlice from './stock-management/stock-balance-overview/getSupplierBalanceListSlice';

/*******************  Office Inspection Management Module   *************************/
/*import all office stock inspection slice here*/
import getOfficeStockInspectionListSlice from './office-inspection/office-stock-inspection/getOfficeStockInspectionListSlice';
import getOfficeStockInspectionDetailSlice from './office-inspection/office-stock-inspection/getOfficeStockInspectionDetailSlice';

/*import all office Fund inspection slice here*/
import getOfficeFundInspectionListSlice from './office-inspection/office-fund-inspection/getOfficeFundInspectionListSlice';
import getOfficeFundInspectionDetailSlice from './office-inspection/office-fund-inspection/getOfficeFundInspectionDetailSlice';

/*******************  Site Management Module   *************************/
/*import all  Site stock inspection slice here*/
import getSiteStockInspectionListSlice from './site-inspection/site-stock-inspection/getSiteStockInspectionListSlice';
import getSiteStockInspectionDetailSlice from './site-inspection/site-stock-inspection/getSiteStockInspectionDetailSlice';

/*import all  Site stock inspection slice here*/
import getSiteFundInspectionListSlice from './site-inspection/site-fund-inspection/getSiteFundInspectionListSlice';
import getSiteFundInspectionDetailSlice from './site-inspection/site-fund-inspection/getSiteFundInspectionDetailSlice';

/*******************  Billing Management Module   *************************/
/*import all  Measurement slice here*/
import getMeasurementListSlice from './billing management/measurement/getMeasurementListSlice';
import getAttachementDetailSlice from './billing management/measurement/getAttachementDetailSlice';
import getMeasurementDetailSlice from './billing management/measurement/getMeasurementDetailSlice';
import getStockFundForMeasurementDetailSlice from './billing management/measurement/getStockFundForMeasurementDetailSlice';
import getMeasurementTimelineDetailSlice from './billing management/measurement/getMeasurementTimelineDetailSlice';

/*import all  Measurement slice here*/
import getPerformaInvoiceListSlice from './billing management/performa invoice/getPerformaInvoiceListSlice';
import getPerformaInvoiceDetailSlice from './billing management/performa invoice/getPerformaInvoiceDetailSlice';

/*import all  Merge to pi slice here*/
import getMTPIListSlice from './billing management/merge to pi/getMTPIListSlice';
import getMergedPIDetailSlice from './billing management/merge to pi/getMergedPIDetailSlice';

/*import all Invocie  slice here*/
import getInovoiceListSlice from './billing management/inovice/getInovoiceListSlice';
import getInvoiceDetailSlice from './billing management/inovice/getInvoiceDetailSlice';

/*import all merge to invoice slice here*/
import getMTIListSlice from './billing management/merge to invoice/getMTIListSlice';
import getMTIDetailSlice from './billing management/merge to invoice/getMTIDetailSlice';

/* import all payment update slice here */
import getPaymentUpdateListSlice from './billing management/payment update/getPaymentUpdateListSlice';
import addUpdatePayementSlice from './billing management/payment update/addUpdatePayementSlice';

/* import all payment  received slice here */
import getPaymentReceivedListSlice from './billing management/payment received/getPaymentReceivedListSlice';
import getPaymentReceivedDetailSlice from './billing management/payment received/getPaymentReceivedDetailSlice';
import getPaymentVoucherHistorySlice from './billing management/payment received/getPaymentVoucherHistorySlice';

/* import all payment retention slice here */
import getRetentionMoneyListSlice from './billing management/retention money/getRetentionMoneyListSlice';
import getRetentionMoneyDetailSlice from './billing management/retention money/getRetentionMoneyDetailSlice';

/* import all payment paid slices here */
import getPaymentPaidListSlice from './paid invoice/getPaymentPaidListSlice';
import getPaymentPaidDetailSlice from './paid invoice/getPaymentPaidDetailSlice';

/*import all area manager slices here*/
import getAreaManagerListSlice from './area manager/getAreaManagerListSlice';
import getAreaManagerTransactionDetailSlice from './area manager/getAreaManagerTransactionDetailSlice';

/*import all regional office slice here */
import getRegionalOfficeListSlice from './regional office/getRegionalOfficeListSlice';
import getROPaymentPaidDetailSlice from './regional office/getROPaymentPaidDetailSlice';
import getRoTransactionListSlice from './regional office/getRoTransactionListSlice';
import getRoTransactionDetailSlice from './regional office/getRoTransactionDetailSlice';

/* import all promotion overview slice here */
import getPromotionOverviewListSlice from './settings/promotion overview/getPromotionOverviewListSlice';
import getPromotionOverviewDetailSlice from './settings/promotion overview/getPromotionOverviewDetailSlice';

/* import all area manager ratio overview slice here*/
import getAreaManagerRatioOverviewListSlice from './settings/area manager ratio overview/getAreaManagerRatioOverviewListSlice';
import getAreaManagerRatioOverviewDetailSlice from './settings/area manager ratio overview/getAreaManagerRatioOverviewDetailSlice';

/*******************  Purchase and sale Management Module   *************************/
/*import all  Purchase order slice here*/
import getPurchaseOrderListSlice from './purchase & sale/purchase-order/getPurchaseOrderListSlice';
import getPurchaseOrderDetailSlice from './purchase & sale/purchase-order/getPurchaseOrderDetailSlice';
import getSecurityDepositListSlice from './purchase & sale/purchase-order/getSecurityDepositListSlice';
import getSecurityDetailSlice from './purchase & sale/purchase-order/getSecurityDetailSlice';

/*import all  Sales order slice here*/
import getSaleOrderListSlice from './purchase & sale/sale-order/getSaleOrderListSlice';
import getSaleOrderDetailSlice from './purchase & sale/sale-order/getSaleOrderDetailSlice';
import getSaleSecurityDepositListSlice from './purchase & sale/sale-order/getSaleSecurityDepositListSlice';
import getSaleSecurityDetailSlice from './purchase & sale/sale-order/getSaleSecurityDetailSlice';

/*******************  Item master Management Module   *************************/

/*import all  item master slice here*/
import getItemMasterListSlice from './item master/item master/getItemMasterListSlice';
import getItemMasterDetailSlice from './item master/item master/getItemMasterDetailSlice';

/*import all brand slice here */
import getBrandDetailSlice from './item master/brand/getBrandDetailSlice';

/*import all  feedback and suggestion slice here*/
import getFeedbackListSlice from './feedback suggestion/getFeedbackListSlice';
import getFeedbackDetailSlice from './feedback suggestion/getFeedbackDetailSlice';

/*******************  -------- Management Module   *************************/
/*import all  ------------ slice here*/

/*import all  ------------ slice here*/

import allRolesSlice from './allRolesSlice';
import { generalApi } from '../../services/generalapi';
import getSalaryDisbursalListSlice from './hr-management/salarydisbursal/getSalaryDisbursalListSlice';
import getSalaryDisbursalSlice from './hr-management/salarydisbursal/getSalaryDisbursalSlice';
import getPaySlipListSlice from './hr-management/payslip/getPaySlipListSlice';
import notificationsSlice from './notifications/notificationsSlice';
import getAllEmployeeHistorySlice from './stock-punch-management/employeeHistory/getAllEmployeeHistorySlice';
import getAllOutletHistoryListSlice from './site-inspection/outletHistory/getAllOutletHistoryListSlice';
import getPoTransactionListSlice from './regional office/getPoTransactionListSlice';
import getPoTransactionDetailSlice from './regional office/getPoTransactionDetailSlice';
import getMessageSlice from './communications/getMessageSlice';
import getUserForNewChatSlice from './communications/getUserForNewChatSlice';
import getAllSurveyListSlice from './survey/getAllSurveyListSlice';
import getSingleSurveySlice from './survey/getSingleSurveySlice';
import getSubCategoryListSlice from './item master/subCategory/getSubCategoryListSlice';
import getBrandListSlice from './item master/brand/getBrandListSlice';
import getSingleTutorialDetailSlice from './tutorials/getSingleTutorialDetailSlice';

import getAdminContactListSlice from './contacts/admin contacts/getAdminContactListSlice';
import getCompanyContactDetailSlice from './contacts/all contact/getCompanyContactDetailSlice';

import getEmployeeNoFormatListSlice from './master-data-management/bill-format/getEmployeeNoFormatListSlice';
import getCompanyNoFormatListSlice from './master-data-management/bill-format/getCompanyNoFormatListSlice';
import getItemNoFormatListSlice from './master-data-management/bill-format/getItemNoFormatListSlice';
// import other reducers as needed

const rootReducer = combineReducers({
  auth: authReducer,
  tokenAuth: tokenAuthSlice,
  getDarkMode: getDarkModeSlice,
  getLanguage: getLanguageSlice,

  /*add all company slice slice here*/
  getCompanyList: getCompanyListSlice,
  deleteCompany: deleteCompanySlice,
  companyDetail: companyDetailSlice,
  createCompany: createCompanySlice,

  /*add module submodule slice slice here*/
  moduleDetail: moduleSlice,
  subModuleDetail: subModuleSlice,

  /*add complaints slice slice here*/
  orederVia: orederViaSlice,
  getComplaintList: getComplaintListSlice,
  getAllComplaintList: getAllComplaintListSlice,
  getRequestComplaintList: getRequestComplaintListSlice,

  getResolvedComplaintList: getResolvedComplaintListSlice,
  getRejectedComplaintList: getRejectedComplaintListSlice,
  getAllocatedComplaintList: getAllocatedComplaintListSlice,
  getUnAssignComplaintList: getUnAssignComplaintListSlice,
  getAssignComplaintList: getAssignComplaintListSlice,
  getAllApprovedComplaintList: getAllApprovedComplaintListSlice,
  getComplaintDetail: getComplaintDetailSlice,
  getComplaintTimeline: getComplaintTimelineSlice,

  // add Slice for Notifications
  notification: notificationsSlice,

  /*add teams slice here*/
  getTeamList: getTeamListSlice,
  getTeamDetail: getTeamDetailSlice,

  /*add employee slice here*/
  getEmployeeList: getEmployeeListSlice,
  getEmployeeDetail: getEmployeeDetailSlice,

  /*add attendance slice here*/
  getTimeSheet: getTimeSheetSlice,
  getClockOut: getClockOutSlice,
  getClockIn: getClockInSlice,
  getCalendar: getCalendarSlice,
  getUserDetail: getUserDetailSlice,
  getUserTimesheet: getUserTimesheetSlice,

  /*add Leave slice here*/
  getLeaveList: getLeaveListSlice,

  /*add payroll slice here*/
  getDeductionList: getDeductionListSlice,
  getAllowanceList: getAllowanceListSlice,

  /*add payroll master slice here*/
  getSettingList: getSettingListSlice,

  /*add insurance slice here*/
  getInsuranceList: getInsuranceListSlice,
  getInsuranceDetail: getInsuranceDetailSlice,
  getInsurancePlanDetail: getInsurancePlanDetailSlice,

  /*add Loans slice here*/
  getLoanList: getLoanListSlice,

  /*add Resignation  slice here*/
  getPendingResignation: getPendingResignationSlice,
  getApprovedResignation: getApprovedResignationSlice,
  getRejectedResignation: getRejectedResignationSlice,
  getFnfResignation: getFnfResignationSlice,

  /*add Promotion demotion slice here*/
  getPromotioDemotion: getPromotioDemotionSlice,
  getPromotionDemotionDetail: getPromotionDemotionDetailSlice,

  /*add Retirement slice here*/
  getRetirementList: getRetirementListSlice,
  getRetirementDetail: getRetirementDetailSlice,

  /*add Salary Disbursal Slice slice here*/
  getSalaryDisbursalList: getSalaryDisbursalListSlice,
  getSalaryDisbursalDetail: getSalaryDisbursalSlice,

  //  add PaySlip Sceens Slice here
  getPaySlipList: getPaySlipListSlice,

  /*add employee logs slice here*/
  getLogsList: getLogsListSlice,
  getLogDetail: getLogDetailSlice,

  /*add Work Image slice here*/
  getAllWorkImageList: getAllWorkImageListSlice,

  /*add documnet slice here*/
  getDocumentList: getDocumentListSlice,
  getDocCategoryList: getDocCategoryListSlice,

  /*add Work Quotation slice here*/
  getWorkQuotationList: getWorkQuotationListSlice,
  getQuotationDetail: getQuotationDetailSlice,

  /*add plan and price slice here*/
  getPlanPricingList: getPlanPricingListSlice,

  /*add supplier slice here*/
  getSupplierList: getSupplierListSlice,
  getSupplierDetail: getSupplierDetailSlice,

  /*add outlet management slice here */
  getOutletList: getOutletListSlice,
  getOutletDetail: getOutletDetailSlice,

  /* add assest slice here */
  getAssestList: getAssestListSlice,
  getAssestDetail: getAssestDetailSlice,
  getAssestTimeline: getAssestTimelineSlice,

  /*add Category  slice here*/
  getCategoryList: getCategoryListSlice,
  getCategoryDetail: getCategoryDetailSlice,

  /*add Unit data slice here*/
  getUnitDataList: getUnitDataListSlice,
  getUnitDataDetail: getUnitDataDetailSlice,

  /*add Product slice here*/
  getProductList: getProductListSlice,
  getProductDetail: getProductDetailSlice,

  /* add contact slice here */
  getContactList: getContactListSlice,
  getCompanyContactDetail: getCompanyContactDetailSlice,

  /* add Bulk message slice here */
  getBulkMessageList: getBulkMessageListSlice,
  getBulkMessageDetail: getBulkMessageDetailSlice,

  /* add energy team list slice here*/
  getEnergyTeamList: getEnergyTeamListSlice,
  getEnergyTeamDetail: getEnergyTeamDetailSlice,

  /*add Task management slice here*/
  getTaskDashboardData: getTaskDashboardDataSlice,
  getTaskCategoryList: getTaskCategoryListSlice,
  getAllTaskList: getAllTaskListSlice,
  getTaskDetail: getTaskDetailSlice,

  // communication chats
  getMessageList: getMessageSlice,
  getUserForNewChat: getUserForNewChatSlice,

  /*add Tutorial slice here*/
  getTutorialList: getTutorialListSlice,

  /*add profile slice here*/
  getProfileDetail: getProfileDetailSlice,

  /*add Earthing testing slice here*/
  getAllETList: getAllETListSlice,

  // add Survey slices
  getSurveyList: getAllSurveyListSlice,
  getSingleSurveyDetail: getSingleSurveySlice,

  /*add Bank mangement slice here*/
  getBankList: getBankListSlice,

  /*add Financial year slice here*/
  getFinacialYearList: getFinacialYearListSlice,

  /*add Tax slice here*/
  getTaxList: getTaxListSlice,

  /*add Gst tax slice here*/
  getGstTaxList: getGstTaxListSlice,

  /*add Pay Method slice here*/
  getPayMethodList: getPayMethodListSlice,

  /*add Bill format slice here*/
  getBillFormatList: getBillFormatListSlice,

  /*add Employee No. format slice here*/
  getEmployeeNoFormatList: getEmployeeNoFormatListSlice,

  /*add Company No. format slice here*/
  getCompanyNoFormatList: getCompanyNoFormatListSlice,

  /*add Item No. format slice here*/
  getItemNoFormatList: getItemNoFormatListSlice,

  /*add account slice here*/
  getAccountList: getAccountListSlice,
  getAccountDetail: getAccountDetailSlice,
  getTransactionHistory: getTransactionHistorySlice,

  /*add Fund request slice here*/
  getFundRequestList: getFundRequestListSlice,
  getFundRequestDetail: getFundRequestDetailSlice,
  getExistingItemList: getExistingItemListSlice,

  /*add fund transfer slice here*/
  getFundTransferList: getFundTransferListSlice,

  /*add Fund Balance overview slice here*/
  getBankBalanceList: getBankBalanceListSlice,
  getEmpBalanceList: getEmpBalanceListSlice,

  /*add Fund Transaction slice here*/
  getBankFundTransactionsList: getBankFundTransactionsListSlice,
  getEmpFundTransactionList: getEmpFundTransactionListSlice,

  /*add Stock Request slice here*/
  getStockRequestList: getStockRequestListSlice,
  getStockRequestDetail: getStockRequestDetailSlice,
  getStockItem: getStockItemSlice,

  /*add Stock Request slice here*/
  getStockTransferList: getStockTransferListSlice,

  /*add Expense request   slice here*/
  getExpenseRequestList: getExpenseRequestListSlice,
  getExpenseRequestDetail: getExpenseRequestDetailSlice,

  /*add Expense Punch slice here*/
  getExpensePunchList: getExpensePunchListSlice,
  getExpensePunchDetail: getExpensePunchDetailSlice,

  /*add Expense Balance   slice here*/
  getExpenseBalance: getExpenseBalanceSlice,

  /*add Expense Transaction   slice here*/
  getExpenseTransaction: getExpenseTransactionSlice,

  /*add  Stock Punch request   slice here*/
  getSPRequestList: getSPRequestListSlice,
  getSPRequestDetail: getSPRequestDetailSlice,

  getAllEmployeeHistory: getAllEmployeeHistorySlice,
  getAllOutletHistory: getAllOutletHistoryListSlice,

  /*add Stock Punch slice here*/
  getStockPunchList: getStockPunchListSlice,
  getStockPunchDetail: getStockPunchDetailSlice,

  /*add Stock Punch Transfer slice here*/
  getSPTransferList: getSPTransferListSlice,
  getSPTransferDetail: getSPTransferDetailSlice,

  /*add Stock balance overview slice here*/
  getSupplierBalanceList: getSupplierBalanceListSlice,

  /*add office stock inspection slice here*/
  getOfficeStockInspectionList: getOfficeStockInspectionListSlice,
  getOfficeStockInspectionDetail: getOfficeStockInspectionDetailSlice,

  /*add office Fund inspection slice here*/
  getOfficeFundInspectionList: getOfficeFundInspectionListSlice,
  getOfficeFundInspectionDetail: getOfficeFundInspectionDetailSlice,

  /*add site stock inspection slice here*/
  getSiteStockInspectionList: getSiteStockInspectionListSlice,
  getSiteStockInspectionDetail: getSiteStockInspectionDetailSlice,

  /*add site fund inspection slice here*/
  getSiteFundInspectionList: getSiteFundInspectionListSlice,
  getSiteFundInspectionDetail: getSiteFundInspectionDetailSlice,

  /*add measurement slice here*/
  getMeasurementList: getMeasurementListSlice,
  getAttachementDetail: getAttachementDetailSlice,
  getMeasurementDetail: getMeasurementDetailSlice,
  getStockFundForMeasurementDetail: getStockFundForMeasurementDetailSlice,
  getMeasurementTimelineDetail: getMeasurementTimelineDetailSlice,

  /* add Performa Inovice slice here */
  getPerformaInvoiceList: getPerformaInvoiceListSlice,
  getPerformaInvoiceDetail: getPerformaInvoiceDetailSlice,

  /* add Merge to pi slice here */
  getMTPIList: getMTPIListSlice,
  getMergedPIDetail: getMergedPIDetailSlice,

  /* add Inovice slice here*/
  getInovoiceList: getInovoiceListSlice,
  getInvoiceDetail: getInvoiceDetailSlice,

  /*add Merge to invoice slice here*/
  getMTIList: getMTIListSlice,
  getMTIDetail: getMTIDetailSlice,

  /*add payment update slice here */
  getPaymentUpdateList: getPaymentUpdateListSlice,
  addUpdatePayement: addUpdatePayementSlice,

  /*add payment received slice here */
  getPaymentReceivedList: getPaymentReceivedListSlice,
  getPaymentReceivedDetail: getPaymentReceivedDetailSlice,
  getPaymentVoucherHistory: getPaymentVoucherHistorySlice,

  /* add payment retention money slice here*/
  getRetentionMoney: getRetentionMoneyListSlice,
  getRetentionMoneyDetail: getRetentionMoneyDetailSlice,

  /*add payment paid slice here */
  getPaymentPaidList: getPaymentPaidListSlice,
  getPaymentPaidDetail: getPaymentPaidDetailSlice,

  /* add area manager slice here */
  getAreaManagerList: getAreaManagerListSlice,
  getAreaManagerTransactionDetail: getAreaManagerTransactionDetailSlice,

  /*add regional office slice here */
  getRegionalOfficeList: getRegionalOfficeListSlice,
  getROPaymentPaidDetail: getROPaymentPaidDetailSlice,
  getRoTransactionList: getRoTransactionListSlice,
  getRoTransactionDetail: getRoTransactionDetailSlice,
  getPoTransactionList: getPoTransactionListSlice,
  getPoTransactionDetail: getPoTransactionDetailSlice,

  /* add promotion overview slice here*/
  getPromotionOverviewList: getPromotionOverviewListSlice,
  getPromotionOverviewDetail: getPromotionOverviewDetailSlice,

  /* add area manager ratio overview slice here*/
  getAreaManagerRatioOverviewList: getAreaManagerRatioOverviewListSlice,
  getAreaManagerRatioOverviewDetail: getAreaManagerRatioOverviewDetailSlice,

  /* add purchase order slice here */
  getPurchaseOrderList: getPurchaseOrderListSlice,
  getPurchaseOrderDetail: getPurchaseOrderDetailSlice,
  getSecurityDepositList: getSecurityDepositListSlice,
  getSecurityDetail: getSecurityDetailSlice,

  /* add sales order slice here */
  getSaleOrderList: getSaleOrderListSlice,
  getSaleOrderDetail: getSaleOrderDetailSlice,
  getSaleSecurityDepositList: getSaleSecurityDepositListSlice,
  getSaleSecurityDetail: getSaleSecurityDetailSlice,

  /* add item master  slice here */
  getItemMasterList: getItemMasterListSlice,
  getItemMasterDetail: getItemMasterDetailSlice,

  /* add Brand slice here */
  getBrandList: getBrandListSlice,
  getSubCategoryList: getSubCategoryListSlice,
  getBrandDetail: getBrandDetailSlice,
  getSingleTutorialDetail: getSingleTutorialDetailSlice,

  /* add feedback and suggestion slice here */
  getFeedbackList: getFeedbackListSlice,
  getFeedbackDetail: getFeedbackDetailSlice,

  allRoles: allRolesSlice,

  getAdminContactList: getAdminContactListSlice,

  // add other slices as needed

  // RTK Query files
  [generalApi.reducerPath]: generalApi.reducer,
});

export default rootReducer;

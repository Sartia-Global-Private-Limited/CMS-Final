import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tokenAuthSlice from './tokenAuthSlice';
import moduleSlice from './moduleSlice';
import subModuleSlice from './subModuleSlice';
import allRolesSlice from './allRolesSlice';
import getdarkModeSlice from './getdarkModeSlice';
import getLanguageSlice from './getLanguageSlice';
import getProfileDetailSlice from './profile/getProfileDetailSlice';
import getCompanyListSlice from './company/getCompanyListSlice';
import deleteCompanySlice from './company/deleteCompanySlice';
import createCompanySlice from './company/createCompanySlice';
import companyDetailSlice from './company/companyDetailSlice';
import orderViaSlice from './order-via/orderViaSlice';
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
import getAllComplaintTypeListSlice from './complaintType/getAllComplaintTypeListSlice';
import getAllZoneListSlice from './energyCompany/zones/getAllZoneListSlice';
import getAllSalesAreaListSlice from './energyCompany/sales-area/getAllSalesAreaListSlice';
import getallDistrictListSlice from './energyCompany/districts/getAllDistrictListSlice';
import getAllRegionalOfficeListSlice from './energyCompany/regionalOffice/getAllRegionalOfficeListSlice';
import getallOutletListSlice from './energyCompany/outlets/getAllOutletListSlice';
import getAdminOutletListSlice from './energyCompany/outlets/getAdminOutletListSlice';

import getAllEnergyCompanySlice from './energyCompany/company/getAllEnergyCompanySlice';
import getAllUserEnergyCompanySlice from './energyCompany/company/getAllUserEnergyCompanySlice';

import getAllContractorListSlice from './contractor/getAllContractorListSlice';

/* import all contact slices here*/
import getContactListSlice from './contacts/all contact/getContactListSlice';
import getAdminContactListSlice from './contacts/admin contacts/getAdminContactListSlice';
import getCompanyContactDetailSlice from './contacts/all contact/getCompanyContactDetailSlice';

/*import all Bulk message slice here*/
import getBulkMessageListSlice from './contacts/all message/getBulkMessageListSlice';
import getBulkMessageDetailSlice from './contacts/all message/getBulkMessageDetailSlice';

import getTutorialListSlice from './tutorials/getTutorialListSlice';
import getSingleTutorialDetailSlice from './tutorials/getSingleTutorialDetailSlice';

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

/*import all  Work Quotation slice here*/
import getWorkQuotationListSlice from './work-quotation/getWorkQuotationListSlice';
import getQuotationDetailSlice from './work-quotation/getQuotationDetailSlice';

/*import all  Task management slice here*/
import getTaskDashboardDataSlice from './task-mangement/getTaskDashboardDataSlice';
import getTaskCategoryListSlice from './task-mangement/getTaskCategoryListSlice';
import getAllTaskListSlice from './task-mangement/getAllTaskListSlice';
import getTaskDetailSlice from './task-mangement/getTaskDetailSlice';

import getMessageSlice from './communications/getMessageSlice';
import getUserForNewChatSlice from './communications/getUserForNewChatSlice';
// import other reducers as needed

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

import getSalaryDisbursalListSlice from './hr-management/salarydisbursal/getSalaryDisbursalListSlice';
import getSalaryDisbursalSlice from './hr-management/salarydisbursal/getSalaryDisbursalSlice';
import getPaySlipListSlice from './hr-management/payslip/getPaySlipListSlice';

/*import all  Ducument slice here*/
import getDocumentListSlice from './document/getDocumentListSlice';
import getDocCategoryListSlice from './document/getDocCategoryListSlice';

/*import all  feedback and suggestion slice here*/
import getFeedbackListSlice from './feedback suggestion/getFeedbackListSlice';
import getFeedbackDetailSlice from './feedback suggestion/getFeedbackDetailSlice';
// Survey Details
import getAllSurveyListSlice from './survey/getAllSurveyListSlice';
import getSingleSurveySlice from './survey/getSingleSurveySlice';

/*import all  Earthing Testing slice here*/
import getAllETListSlice from './earthing testing/getAllETListSlice';

/*import all Plan and Pricing slice here*/
import getPlanPricingListSlice from './plan-pricing/getPlanPricingListSlice';

// Admin Complaints
import getAllAdminComplaintListSlice from '../../redux/slices/adminComplaint/getAllAdminComplaintListSlice';
import getNotApprovedComplaintListSlice from '../../redux/slices/adminComplaint/getNotApprovedComplaintListSlice';

//Energy Teams
import getEnergyTeamListSlice from '../../redux/slices/energy team/getEnergyTeamListSlice';

/*import all  item master slice here*/
import getItemMasterListSlice from './item master/item master/getItemMasterListSlice';
import getItemMasterDetailSlice from './item master/item master/getItemMasterDetailSlice';

/*import all brand slice here */
import getBrandDetailSlice from './item master/brand/getBrandDetailSlice';
import getBrandListSlice from './item master/brand/getBrandListSlice';
import getSubCategoryListSlice from './item master/subCategory/getSubCategoryListSlice';

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
import notificationsSlice from './notifications/notificationsSlice';
import {generalApi} from '../../services/generalApi';
import getEmployeeNoFormatListSlice from './master-data-management/bill-format/getEmployeeNoFormatListSlice';
import getCompanyNoFormatListSlice from './master-data-management/bill-format/getCompanyNoFormatListSlice';
import getItemNoFormatListSlice from './master-data-management/bill-format/getItemNoFormatListSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tokenAuth: tokenAuthSlice,
  getLanguage: getLanguageSlice,
  getDarkMode: getdarkModeSlice,

  moduleDetail: moduleSlice,
  subModuleDetail: subModuleSlice,
  allRoles: allRolesSlice,
  getLanguage: getLanguageSlice,
  getProfileDetail: getProfileDetailSlice,

  // Energy Company
  getAllECList: getAllEnergyCompanySlice,
  getAllECUserList: getAllUserEnergyCompanySlice,

  // Contractor
  allContractor: getAllContractorListSlice,

  //company Slice
  getCompanyList: getCompanyListSlice,
  deleteCompany: deleteCompanySlice,
  companyDetail: companyDetailSlice,
  createCompany: createCompanySlice,

  // complaints
  orderVia: orderViaSlice,
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

  // Admin Complaints

  getAdminComplaint: getAllAdminComplaintListSlice,
  getNotApprovedComplaint: getNotApprovedComplaintListSlice,

  // Energy Company
  allZone: getAllZoneListSlice,
  allRegionalOffice: getAllRegionalOfficeListSlice,
  allComplaintType: getAllComplaintTypeListSlice,
  allSalesArea: getAllSalesAreaListSlice,
  allDistrict: getallDistrictListSlice,
  allOutlets: getallOutletListSlice,
  allAdminOutlets: getAdminOutletListSlice,

  // Energy Team
  getEnergyTeamList: getEnergyTeamListSlice,

  /* add contact slice here */
  getContactList: getContactListSlice,
  getCompanyContactDetail: getCompanyContactDetailSlice,

  getAdminContactList: getAdminContactListSlice,

  /* add Bulk message slice here */
  getBulkMessageList: getBulkMessageListSlice,
  getBulkMessageDetail: getBulkMessageDetailSlice,

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

  /*add Work Quotation slice here*/
  getWorkQuotationList: getWorkQuotationListSlice,

  getQuotationDetail: getQuotationDetailSlice,

  // communication chats
  getMessageList: getMessageSlice,
  getUserForNewChat: getUserForNewChatSlice,

  /*add Task management slice here*/
  getTaskDashboardData: getTaskDashboardDataSlice,
  getTaskCategoryList: getTaskCategoryListSlice,
  getAllTaskList: getAllTaskListSlice,
  getTaskDetail: getTaskDetailSlice,

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

  // add Slice for Notifications
  notification: notificationsSlice,

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

  /*add documnet slice here*/
  getDocumentList: getDocumentListSlice,
  getDocCategoryList: getDocCategoryListSlice,

  /* add feedback and suggestion slice here */
  getFeedbackList: getFeedbackListSlice,
  getFeedbackDetail: getFeedbackDetailSlice,

  /*add Tutorial slice here*/
  getSingleTutorialDetail: getSingleTutorialDetailSlice,
  getTutorialList: getTutorialListSlice,

  // add Survey slices
  getSurveyList: getAllSurveyListSlice,
  getSingleSurveyDetail: getSingleSurveySlice,

  /*add Earthing testing slice here*/
  getAllETList: getAllETListSlice,

  /* add item master  slice here */
  getItemMasterList: getItemMasterListSlice,
  getItemMasterDetail: getItemMasterDetailSlice,

  /* add Brand slice here */
  getBrandList: getBrandListSlice,
  getSubCategoryList: getSubCategoryListSlice,
  getBrandDetail: getBrandDetailSlice,
  getSingleTutorialDetail: getSingleTutorialDetailSlice,

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

  /*add plan and price slice here*/
  getPlanPricingList: getPlanPricingListSlice,

  [generalApi.reducerPath]: generalApi.reducer,
});

export default rootReducer;

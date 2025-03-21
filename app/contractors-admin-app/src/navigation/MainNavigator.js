import React, { useEffect } from 'react';
import Colors from '../constants/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
/* import all company screen*/
import CompaniesDetailsScreen from '../screens/companies/CompaniesDetailsScreen';
import CompaniesListingScreen from '../screens/companies/CompaniesListingScreen';
import AddUpdateCompaniesScreen from '../screens/companies/AddUpdateCompaniesScreen';

/* import all complaint screen*/
import RequestComplaintScreen from '../screens/complaints/RequestComplaintScreen';
import RejectedComplaintScreen from '../screens/complaints/RejectedComplaintScreen';
import ResolvedComplaintScreen from '../screens/complaints/ResolvedComplaintScreen';
import AllocatedComplaintScreenListScreen from '../screens/complaints/AllocatedComplaintScreenListScreen';
import AllComplaintScreen from '../screens/complaints/AllComplaintScreen';
import ApprovedComplaintTopnavigation from './ApprovedComplaintTopnavigation';
import AddUpdateAllocateComplaintScreen from '../screens/complaints/AddUpdateAllocateComplaintScreen';
import AddUpdateComplaintScreen from '../screens/complaints/AddUpdateComplaintScreen';
import ComplaintDetailScreen from '../screens/complaints/all complaints/ComplaintDetailScreen';
import ComplaintTimelineScreen from '../screens/complaints/all complaints/ComplaintTimelineScreen';
import ComplaintMoreDetails from '../screens/complaints/all complaints/ComplaintMoreDetails';
/* import all teams screens*/
import TemsDeatailScreen from '../screens/hr management/teams/TemsDeatailScreen';
import TeamListScreen from '../screens/hr management/teams/TeamListScreen';
import AddUpdateTeamScreen from '../screens/hr management/teams/AddUpdateTeamScreen';
import AddTeamMemeberScreen from '../screens/hr management/teams/AddTeamMemeberScreen';

/* import all employees screens*/
import EmployeesListScreen from '../screens/hr management/employees/EmployeesListScreen';
import EmployeeDetailScreen from '../screens/hr management/employees/EmployeeDetailScreen';
import AddUpdateEmployeesScreen from '../screens/hr management/employees/AddUpdateEmployeesScreen';
import EmpBankDetailScreen from '../screens/hr management/employees/EmpBankDetailScreen';
import EmpDocumentScreen from '../screens/hr management/employees/EmpDocumentScreen';
import EmpTimelineScreens from '../screens/hr management/employees/EmpTimelineScreens';

/* import all attendace screens*/
import AttendanceTopTab from './AttendanceTopTab';
import AddUpdateAttendanceScreen from '../screens/hr management/attendance/AddUpdateAttendanceScreen';
import AttendanceDetailScreen from '../screens/hr management/attendance/AttendanceDetailScreen';

/* import all leave screens*/
import LeaveTopTab from './LeaveTopTab';
import AddUpdateLeaveScreen from '../screens/hr management/leaves/AddUpdateLeaveScreen';
import LeaveDetailScreen from '../screens/hr management/leaves/LeaveDetailScreen';

/* import all payroal screens*/
import PayrollTopTab from './PayrollTopTab';

/* import all payroal master screens*/
import PayrollMasterTopTab from './PayrollMasterTopTab';
import CreateUpdateSettingScreen from '../screens/hr management/payrool master/CreateUpdateSettingScreen';

/* import all Group insurance screens*/
import GroupInsuranceListScreen from '../screens/hr management/group insurance/GroupInsuranceListScreen';
import AddUpdateInsuranceScreen from '../screens/hr management/group insurance/AddUpdateInsuranceScreen';
import InsuranceDetailScreen from '../screens/hr management/group insurance/InsuranceDetailScreen';

/* import all Loans screens*/
import LoanTopTab from './LoanTopTab';
import LoandDetailScreen from '../screens/hr management/loan/LoandDetailScreen';
import AddUpdateLoanScreen from '../screens/hr management/loan/AddUpdateLoanScreen';

/* import all Resignation screens*/
import EmpResignationTopTab from './EmpResignationTopTab';
import AddUpdateResignationScreen from '../screens/hr management/resingation/AddUpdateResignationScreen';
import ResignationDetailScreen from '../screens/hr management/resingation/ResignationDetailScreen';

/* import all Promotion and Demotion screens*/
import PromotionDemotionListScreen from '../screens/hr management/promotion demotion/PromotionDemotionListScreen';
import PromotionDemotionDetailScreens from '../screens/hr management/promotion demotion/PromotionDemotionDetailScreens';
import AddUpdatePromotionDemotionScreen from '../screens/hr management/promotion demotion/AddUpdatePromotionDemotionScreen';

/* import all Retirement screens*/
import RetirementListScreen from '../screens/hr management/retirement/RetirementListScreen';
import RetirementDetailScreen from '../screens/hr management/retirement/RetirementDetailScreen';
import AddUpdateRetirementScreen from '../screens/hr management/retirement/AddUpdateRetirementScreen';

/* import all employee log screens*/
import EmpLogsListScreen from '../screens/hr management/employees log/EmpLogsListScreen';
import EmpLogDetailScreen from '../screens/hr management/employees log/EmpLogDetailScreen';

/* import all tracking screens*/
import TrackingMapViewSreen from '../screens/hr management/tracking/TrackingMapViewSreen';

/* import all Work Image management screens*/
import AllWorkImageScreen from '../screens/work image management/AllWorkImageScreen';
import AddUpdateWorkImageScreen from '../screens/work image management/AddUpdateWorkImageScreen';

/* import all document screens*/
import DocumentListScreen from '../screens/document/DocumentListScreen';
import AddUpdateDocument from '../screens/document/AddUpdateDocument';
import DocumentCategoryListScreen from '../screens/document/DocumentCategoryListScreen';
import AddUpdateDocumentCategory from '../screens/document/AddUpdateDocumentCategory';

/* import all Work Qutotation screens*/
import WorkQuotationTopTab from './WorkQuotationTopTab';
import AddUpdateWorkQuotationScreen from '../screens/work quotation/AddUpdateWorkQuotationScreen';
import QuotationDetailScreen from '../screens/work quotation/QuotationDetailScreen';
import QuotationDetailItemListScreen from '../screens/work quotation/QuotationDetailItemListScreen';

/* import all Plain and Pricing screens*/
import PlanPricingListScreen from '../screens/plan & pricing/PlanPricingListScreen';
import AddUpdatePlainPricingScreen from '../screens/plan & pricing/AddUpdatePlainPricingScreen';

/* import all Supplier screens*/
import SupplierTopTab from './SupplierTopTab';
import AddUpdateSuplierScreen from '../screens/suppliers/AddUpdateSuplierScreen';
import SupplierDetailScreen from '../screens/suppliers/SupplierDetailScreen';

/* import all Outlet management screen */
import OutletTopTab from './OutletTopTab';
import AddUpdateOutletScreen from '../screens/outlet management/AddUpdateOutletScreen';
import OutletDetailScreen from '../screens/outlet management/OutletDetailScreen';

/* import all assest mangement screen  */
import AssestsTopTab from './AssestsTopTab';
import AddUpdateAssestScreen from '../screens/assests mangement/AddUpdateAssestScreen';
import AssestDetailScreen from '../screens/assests mangement/AssestDetailScreen';
import AssetsTimelineHistoryScreen from '../screens/assests mangement/AssetsTimelineHistoryScreen';

/* import all Category & Product screens*/
import CategoryListScreen from '../screens/category&product/category/CategoryListScreen';
import AddUpdateCategory from '../screens/category&product/category/AddUpdateCategory';
import UnitDataListScreen from '../screens/category&product/unitData/UnitDataListScreen';
import AddUpdateUnitData from '../screens/category&product/unitData/AddUpdateUnitData';
import ProductListScreen from '../screens/category&product/product/ProductListScreen';
import ProductDetailScreen from '../screens/category&product/product/ProductDetailScreen';
import AddUpdateProductScreen from '../screens/category&product/product/AddUpdateProductScreen';

/* import all Contact screens*/
import ContactTopTab from './ContactTopTab';
import AddUpdateContactScreen from '../screens/contacts/all contact/AddUpdateContactScreen';
import ContactDetailScreen from '../screens/contacts/all contact/ContactDetailScreen';

/* import all Bulk message screen */
import EnergyContactListScreen from '../screens/contacts/energy contact/EnergyContactListScreen';

/* import all Bulk message screen */
import CreateUpdateBulkMessageScreen from '../screens/contacts/all messages/CreateUpdateBulkMessageScreen';
import AllBulkMessageListScreen from '../screens/contacts/all messages/AllBulkMessageListScreen';
import BulkMessageDetailScreen from '../screens/contacts/all messages/BulkMessageDetailScreen';

/* import all energy team screens */
import EnergyTeamListScreen from '../screens/energy team/EnergyTeamListScreen';
import AddUpdateEnergyTeamScreen from '../screens/energy team/AddUpdateEnergyTeamScreen';
import EnergyCompanyDetailScreen from '../screens/energy team/EnergyCompanyDetailScreen';

/* import all feedback and suggestion screens */
import FeedbackSuggestionListScreen from '../screens/Feedback and suggestions/FeedbackSuggestionListScreen';
import FeedbackSuggestionDetailScreen from '../screens/Feedback and suggestions/FeedbackSuggestionDetailScreen';
import AddUpdateFeedbackSuggestionScreen from '../screens/Feedback and suggestions/AddUpdateFeedbackSuggestionScreen';
import AddResponseScreen from '../screens/Feedback and suggestions/AddResponseScreen';

/* import all Task Management  screens*/
import TaskDashBoardScreen from '../screens/task management/TaskDashBoardScreen';
import TaskCategoryListScreen from '../screens/task management/TaskCategoryListScreen';
import AddUpdateTaskCategoryScreen from '../screens/task management/AddUpdateTaskCategoryScreen';
import AllTaskListScreen from '../screens/task management/AllTaskListScreen';
import AddUpdateTaskScreen from '../screens/task management/AddUpdateTaskScreen';
import TaskDetailScreen from '../screens/task management/TaskDetailScreen';
import TaskActivityListScreen from '../screens/task management/TaskActivityListScreen';

/* import all Tutorial screens*/
import TutorialTopTab from './TutorialTopTab';
import VideoPlayerScreen from '../screens/tutorials/VideoPlayerScreen';
import AddUpdateTutorialScreen from '../screens/tutorials/AddUpdateTutorialScreen';

/* import all Profile screens*/
import ProfileScreen from '../screens/profile/ProfileScreen';
import UpdatePasswordScreen from '../screens/profile/UpdatePasswordScreen';
import UpdateProfileScreen from '../screens/profile/UpdateProfileScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';

/* import all Earthing testing screens*/
import AllETListScreen from '../screens/earthing testing/AllETListScreen';
import AddUpdateETScreen from '../screens/earthing testing/AddUpdateETScreen';

/* import all Bank management screens*/
import BankListScreen from '../screens/master data management/bank mangement/BankListScreen';
import AddUpdateBankScreen from '../screens/master data management/bank mangement/AddUpdateBankScreen';

/* import all Financial year screens*/
import FinancialYearListScreen from '../screens/master data management/financial year/FinancialYearListScreen';
import AddUpdateFinancialScreen from '../screens/master data management/financial year/AddUpdateFinancialScreen';

/* import all Tax screens*/
import TaxListScreen from '../screens/master data management/tax/TaxListScreen';
import AddUpdateTaxScreen from '../screens/master data management/tax/AddUpdateTaxScreen';

/* import all Gst Tax screen screens*/
import GstTaxListScreen from '../screens/master data management/GstTaxMangement/GstTaxListScreen';
import AddUpdateGstTaxScreen from '../screens/master data management/GstTaxMangement/AddUpdateGstTaxScreen';

/* import all Payment Method screens*/
import PaymentMethodListScreen from '../screens/master data management/paymet method/PaymentMethodListScreen';
import AddUpdatePaymentMethodScreen from '../screens/master data management/paymet method/AddUpdatePaymentMethodScreen';

/* import all Bill Format screens*/
import BillFormatListScreen from '../screens/master data management/bill format/BillFormatListScreen';
import AddUpdateBillFormatScreen from '../screens/master data management/bill format/AddUpdateBillFormatScreen';

/* import all Account Management screens*/
import AccountListScreen from '../screens/master data management/account management/AccountListScreen';
import AddUpdateAcoountScreen from '../screens/master data management/account management/AddUpdateAcoountScreen';
import AccountDetailScreen from '../screens/master data management/account management/AccountDetailScreen';

/* import all Add Bank balance screens*/
import AddUpdateBalanceScreen from '../screens/master data management/add bank balance/AddUpdateBalanceScreen';

/* import all Fund request screens*/
import FundRequestTopTab from './FundRequestTopTab';
import AddUpdateApproveFundRequestScreen from '../screens/fund management/fund request/AddUpdateApproveFundRequestScreen';
import ExistingItemListScreen from '../screens/fund management/fund request/ExistingItemListScreen';
import FundRequestDetailScreen from '../screens/fund management/fund request/FundRequestDetailScreen';

/* import all Fund Transfer screens*/
import FundTransferTopTab from './FundTransferTopTab';
import TransferFundRquestScreen from '../screens/fund management/fund transfer/TransferFundRquestScreen';

/* import all Fund balance overview screens*/
import FundBalanceOverViewScreen from '../screens/fund management/fund balance overview/FundBalanceOverViewScreen';

/* import all Fund transaction  screens*/
import ViewFundTransctionScreen from '../screens/fund management/fund transactions/ViewFundTransctionScreen';

/* import all stock Request screens*/
import StockRequestTopTab from './StockRequestTopTab';
import StockRequestDetailScreen from '../screens/stock management/stock request/StockRequestDetailScreen';
import AllExistingStockItemListScreen from '../screens/stock management/stock request/AllExistingStockItemListScreen';
import StockRequestApprovedDataScreen from '../screens/stock management/stock request/StockRequestApprovedDataScreen';
import StockRequestTransferDataScreen from '../screens/stock management/stock request/StockRequestTransferDataScreen';
import AddUpdateApproveStockRequestScreen from '../screens/stock management/stock request/AddUpdateApproveStockRequestScreen';

/* import all stock transfer screens*/
import StockTransferTopTab from './StockTransferTopTab';
import TransferStockRequestScreen from '../screens/stock management/stock transfer/TransferStockRequestScreen';

/* import all Stock Balance overview screens*/
import StockBalanceOverViewScreen from '../screens/stock management/stock balance overview/StockBalanceOverViewScreen';

/*import all stock transactions screen */
import ViewStockTransactionScreen from '../screens/stock management/stock transactions/ViewStockTransactionScreen';

/*import all Expense rquest screen */
import ExpenseRequestListingScreen from '../screens/expense mangement/expense request/ExpenseRequestListingScreen';
import ExpenseRequestDetailScreen from '../screens/expense mangement/expense request/ExpenseRequestDetailScreen';

/*import all Expense Punch screen */
import ExpensePunchTopTab from './ExpensePunchTopTab';
import ExpensePunchDetailScreen from '../screens/expense mangement/expense punch/ExpensePunchDetailScreen';
import AddUpdateApproveExpensePunchScreen from '../screens/expense mangement/expense punch/AddUpdateApproveExpensePunchScreen';
import ExpensePunchItemHistory from '../screens/expense mangement/expense punch/ExpensePunchItemHistory';

/*import all Expense Balance Overview  screen */
import ExpenseBalanceOverViewScreen from '../screens/expense mangement/expense balance overview/ExpenseBalanceOverViewScreen';

/*import all Expense Transaction screen */
import ViewExpenseTransactionScreen from '../screens/expense mangement/expense transactions/ViewExpenseTransactionScreen';

/*import all Stock punch request screen */
import SPRequestListingScreen from '../screens/stock punch management/stock punch request/SPRequestListingScreen';
import SPRequestDetailScreen from '../screens/stock punch management/stock punch request/SPRequestDetailScreen';

/*import all Stock punch screen */
import StockPunchTopTab from './StockPunchTopTab';
import SPDetailScreen from '../screens/stock punch management/stock punch/SPDetailScreen';
import SPItemHisory from '../screens/stock punch management/stock punch/SPItemHisory';
import AddUpdateApproveStockPunchScreen from '../screens/stock punch management/stock punch/AddUpdateApproveStockPunchScreen';

/*import all Stock punch balance screen */
import ViewSPBalanceScreen from '../screens/stock punch management/stock punch balance/ViewSPBalanceScreen';
/*import all stock punch transaction screen */
import ViewSPTranscationScreen from '../screens/stock punch management/stock punch transaction/ViewSPTranscationScreen';

/*import all Stock punch transfer screen */
import SPTransferListScreen from '../screens/stock punch management/stock punch transfer/SPTransferListScreen';
import SPTransferDetailScreen from '../screens/stock punch management/stock punch transfer/SPTransferDetailScreen';
import SPTransferScreen from '../screens/stock punch management/stock punch transfer/SPTransferScreen';

/*import all Office Stock Inspection screen */
import OfficeStockInspectionTopTab from './OfficeStockInspectionTopTab';
import OfficeStockInspectionDetailScreen from '../screens/office inspection/office stock inspection/OfficeStockInspectionDetailScreen';
import OfficeStockInspectionItemList from '../screens/office inspection/office stock inspection/OfficeStockInspectionItemList';

/*import all Office Fund Inspection screen */
import OfficeFundInspectionTopTab from './OfficeFundInspectionTopTab';
import OfficeFundInspectionDetailScreen from '../screens/office inspection/office fund inspection/OfficeFundInspectionDetailScreen';
import OfficeFundInspectionItemList from '../screens/office inspection/office fund inspection/OfficeFundInspectionItemList';

/*import all Site stock inspection screen */
import SiteStockInspectionTopTab from './SiteStockInspectionTopTab';
import SiteStockInspectionDetailScreen from '../screens/site inspection/site stock inspection/SiteStockInspectionDetailScreen';
import SiteStockInspectionItemList from '../screens/site inspection/site stock inspection/SiteStockInspectionItemList';

/*import all Site fund inspection screen */
import SiteFundInspectionTopTab from './SiteFundInspectionTopTab';
import SiteFundInspectionDetailScreen from '../screens/site inspection/site fund inspection/SiteFundInspectionDetailScreen';
import SiteFundInspectionItemList from '../screens/site inspection/site fund inspection/SiteFundInspectionItemList';

/*import all Measurement screen */
import MeasurementTopTab from './MeasurementTopTab';
import ViewMeasurementDetailScreen from '../screens/billing management/measurements/ViewMeasurementDetailScreen';
import ViewPTMDetailScreen from '../screens/billing management/measurements/ViewPTMDetailScreen';
import PtmDetailItemlListScreen from '../screens/billing management/measurements/PtmDetailItemlListScreen';
import AddUpdateMeasurementAttachement from '../screens/billing management/measurements/AddUpdateMeasurementAttachement';
import AddUpdateMeasurementScreen from '../screens/billing management/measurements/AddUpdateMeasurementScreen';
import PtmStockAndFundViewScreen from '../screens/billing management/measurements/PtmStockAndFundViewScreen';
import ViewMeasurementTimelineScreen from '../screens/billing management/measurements/ViewMeasurementTimelineScreen';

/* import all performa invoice screen*/
import PerformaInvoiceTopTab from './PerformaInvoiceTopTab';
import PerformaInvoiceListScreens from '../screens/billing management/performa invoice/PerformaInvoiceListScreen';
import AddUpdatePIScreen from '../screens/billing management/performa invoice/AddUpdatePIScreen';
import PerfromaInvoiceDetailScreen from '../screens/billing management/performa invoice/PerfromaInvoiceDetailScreen';
import PIDetailItemListScreen from '../screens/billing management/performa invoice/PIDetailItemListScreen';

/* import all Merge to Pi screen */
import MTPIToptab from './MTPIToptab';
import MTPIListScreen from '../screens/billing management/merge to pi/MTPIListScreen';
import MTPIDetailScreen from '../screens/billing management/merge to pi/MTPIDetailScreen';
import MTPIDetailItemListScreen from '../screens/billing management/merge to pi/MTPIDetailItemListScreen';

/* import all Invoice screen */
import InvoiceTopTab from './InvoiceTopTab';
import InovoiceDetailScreen from '../screens/billing management/invoice/InovoiceDetailScreen';
import InvoiceDetailItemListScreen from '../screens/billing management/invoice/InvoiceDetailItemListScreen';
import AddUpdateInvoiceScreen from '../screens/billing management/invoice/AddUpdateInvoiceScreen';

/*import all Merge to Inovice screen*/
import MTITopTab from './MTITopTab';
import MTIDetailScreen from '../screens/billing management/merge to invoice/MTIDetailScreen';
import MTIDetailItemListScreen from '../screens/billing management/merge to invoice/MTIDetailItemListScreen';

/*import all payment update screen */
import PaymentUpdateListScreen from '../screens/billing management/payment update/PaymentUpdateListScreen';
import AddUpdatePayment from '../screens/billing management/payment update/AddUpdatePayment';

/* import all payment received screen */
import PaymentReceivedTopTab from './PaymentReceivedTopTab';
import PaymentReceivedDetailScreen from '../screens/billing management/payment received/PaymentReceivedDetailScreen';
import PaymentVoucherHistory from '../screens/billing management/payment received/PaymentVoucherHistory';

/* import all payment retention money screen */
import RetentionMoneyTopTab from './RetentionMoneyTopTab';
import RetentioMoneyDetailScreen from '../screens/billing management/retention money/RetentioMoneyDetailScreen';
import ApporveRetentionMoneyScreen from '../screens/billing management/retention money/ApporveRetentionMoneyScreen';
import CreateRetentionScreen from '../screens/billing management/retention money/CreateRetentionScreen';

/* import all payment paid screens*/
import PaidInvoiceTopTab from './PaidInvoiceTopTab';
import PaymentPaidDetailScreen from '../screens/paid invoice/PaymentPaidDetailScreen';
import PaymentPaidOtpVerifyScreen from '../screens/paid invoice/PaymentPaidOtpVerifyScreen';

/*import all area manager screens*/
import AreaManagerListScreen from '../screens/area manager/AreaManagerListScreen';
import AreaManagerDetailScreen from '../screens/area manager/AreaManagerDetailScreen';

/* import all regional office screens*/
import RegionalOfficeTopTab from './RegionalOfficeTopTab';
import RegionalOfficeDetailScreen from '../screens/regional office/RegionalOfficeDetailScreen';
import CreateRegionalOfficePayment from '../screens/regional office/CreateRegionalOfficePayment';
import RegionalOfficeTransactionListScreen from '../screens/regional office/RegionalOfficeTransactionListScreen';
import ROTransactionDetailScreen from '../screens/regional office/ROTransactionDetailScreen';

/* import all Area manager overview screens */
import AreaManagerOverviewListScreen from '../screens/settings/area manager overview/AreaManagerOverviewListScreen';
import AddUpdateAreaManagerOverviewScreen from '../screens/settings/area manager overview/AddUpdateAreaManagerOverviewScreen';

/*import all Promotion overview screen */
import PromotionOverviewListScreen from '../screens/settings/promotion overview/PromotionOverviewListScreen';
import AddUpdatePromotionOverviewScreen from '../screens/settings/promotion overview/AddUpdatePromotionOverviewScreen';

/*import all Purchase order screen */
import PurchaseOrderTopTab from './PurchaseOrderTopTab';
import AddUpatePurchaseOrderScreen from '../screens/purchase & sale/purchase order/AddUpatePurchaseOrderScreen';
import PurchaseOrderDetailScreen from '../screens/purchase & sale/purchase order/PurchaseOrderDetailScreen';
import PoDetaiItemListScreen from '../screens/purchase & sale/purchase order/PoDetaiItemListScreen';
import SecurityDepositListScreen from '../screens/purchase & sale/purchase order/SecurityDepositListScreen';
import CreateSecurityScreen from '../screens/purchase & sale/purchase order/CreateSecurityScreen';
import SecurityDetailScreen from '../screens/purchase & sale/purchase order/SecurityDetailScreen';

/*import all Sales order screen */
import SalesOrderTopTab from './SalesOrderTopTab';
import AddUpateSalesOrderScreen from '../screens/purchase & sale/sale order/AddUpateSalesOrderScreen';
import SalesOrderDetailScreen from '../screens/purchase & sale/sale order/SalesOrderDetailScreen';
import SoDetaiItemListScreen from '../screens/purchase & sale/sale order/SoDetaiItemListScreen';
import CreateSOSecurityScreen from '../screens/purchase & sale/sale order/CreateSOSecurityScreen';
import SalesSecurityDetailScreen from '../screens/purchase & sale/sale order/SalesSecurityDetailScreen';

/*import all item master  screen */
import ItemMasterTopTab from './ItemMasterTopTab';
import AddUpdateItemMasterScreen from '../screens/item master/item list/AddUpdateItemMasterScreen';

/*import all brand  screen */
import BrandListScreen from '../screens/item master/brand/BrandListScreen';
import AddUpdateBrandScreen from '../screens/item master/brand/AddUpdateBrandScreen';

/*import all ------------- screen */

/* import all module submodule screen*/
import SubModuleScreen from '../screens/submodule/SubModuleScreen';

/* import all order via screen*/
import OrderViaListScreen from '../screens/master data management/order via/OrderViaListScreen';
import AddUpdateOrderViaScreen from '../screens/master data management/order via/AddUpdateOrderViaScreen';

import AllRolesScreen from '../screens/roles/AllRolesScreen';
import AddUpdateRoleScreen from '../screens/roles/AddUpdateRoleScreen';
import ViewPermissionsScreen from '../screens/roles/ViewPermissionsScreen';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import BottomTabNavigation from './BottomTabNavigation';
import SalaryDisbursalListScreen from '../screens/hr management/salarydisbursal/SalaryDisbursalListScreen';
import UpdateSalaryDisbursal from '../screens/hr management/salarydisbursal/UpdateSalaryDisbursal';
import ViewSalaryDisbursal from '../screens/hr management/salarydisbursal/ViewSalaryDisbursal';
import PaySlipListScreen from '../screens/hr management/payslips/PaySlipListScreen';
import WorkQuotationListScreen from '../screens/work quotation/WorkQuotationListScreen';
import SupplierListScreen from '../screens/suppliers/SupplierListScreen';
import CreateItemForm from '../screens/item master/item list/CreateItemForm';
import ItemMasterListScreen from '../screens/item master/item list/ItemMasterListScreen';
import AssetsListScreen from '../screens/assests mangement/AssetsListScreen';
import OutletListScreen from '../screens/outlet management/OutletListScreen';
import ContactListScreen from '../screens/contacts/all contact/ContactListScreen';
import NotificationsListScreen from '../screens/notifications/NotificationsListScreen';
import OfficeInspectionEmployeeHistoryList from '../screens/office inspection/office fund inspection/OfficeInspectionEmployeeHistoryList';
import SiteStockInspectionOutletHistory from '../screens/site inspection/SiteStockInspectionOutletHistory';
import PurchaseOrderTransctionListScreen from '../screens/regional office/PurchaseOrderTransctionListScreen';
import POTransactionDetailScreen from '../screens/regional office/POTransactionDetailScreen';
import ItemMasterFundTopTab from './ItemMasterFundTopTab';
import MessageTopTab from './MessageTopTab';
import Chats from '../screens/communication/Chats';
import NewChat from '../screens/communication/NewChat';
import MessageScreen from '../screens/communication/MessageScreen';
import Dashboard from '../screens/home dashboard/Dashboard';
import SurveyListScreen from '../screens/survey/SurveyListScreen';
import SurveyResponseForm from '../screens/survey/SurveyResponseForm';
import AddSurvey from '../screens/survey/AddSurvey';
import SurveyResponseDetailedView from '../screens/survey/SurveyResponseDetailedView';
import SubCategoryList from '../screens/item master/sub-category/SubCategoryList';
import AddUpdateSubCategory from '../screens/item master/sub-category/AddUpdateSubCategory';
import OverView from '../screens/companies/OverView';

import ClientContactList from '../screens/contacts/admin contacts/ClientContactList';
import CompanyContactsListScreen from '../screens/contacts/admin contacts/CompanyContactsListScreen';
import FuelStationContactLIst from '../screens/contacts/admin contacts/FuelStationContactLIst';
import OilAndGasCompanyContactList from '../screens/contacts/admin contacts/OilAndGasCompanyContactList';
import VendorContactList from '../screens/contacts/admin contacts/VendorContactList';
import OutletContactListScreen from '../screens/contacts/admin contacts/OutletContactListScreen';
import EmployeeNumberFormatListScreen from '../screens/master data management/employeeNoFormat/EmployeeNumberFormatListScreen';
import AddUpdateEmployeeNumberFormat from '../screens/master data management/employeeNoFormat/AddUpdateEmployeeNumberFormat';
import AddUpdateCompanyNoFormat from '../screens/master data management/companyNoFormat/AddUpdateCompanyNoFormat';
import CompanyNoFormatListScreen from '../screens/master data management/companyNoFormat/CompanyNoFormatListScreen';
import AddUpdateItemNumberFormat from '../screens/master data management/itemNoFormat/AddUpdateItemNumberFormat';
import ItemNumberFormatListScreen from '../screens/master data management/itemNoFormat/ItemNumberFormatList';
import SupplierContactList from '../screens/contacts/admin contacts/SupplierContactList';

const Stack = createNativeStackNavigator();

const MainNavigator = ({ navigation }) => {
  const { isAuthenticated } = useSelector(selectUser);
  const { isDarkMode } = useSelector(state => state.getDarkMode);

  useEffect(() => {}, [isDarkMode]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'BottomTabNavigation'}
        screenOptions={{
          headerShown: false,
          statusBarStyle: isDarkMode ? Colors().pureBlack : 'dark',
          statusBarColor: Colors().screenBackground,
        }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            {/*stack for bottom tab navigation screen*/}
            <Stack.Screen
              name="BottomTabNavigation"
              component={BottomTabNavigation}
            />
            {/* <Stack.Screen name="Home" component={Home} /> */}

            {/*stack for company screen*/}

            <Stack.Screen
              name="CompaniesListingScreen"
              component={CompaniesListingScreen}
            />
            <Stack.Screen
              name="AddUpdateCompaniesScreen"
              component={AddUpdateCompaniesScreen}
            />
            <Stack.Screen
              name="CompaniesDetailsScreen"
              component={CompaniesDetailsScreen}
            />
            <Stack.Screen name="OverView" component={OverView} />
            {/* stack for copmlaints screens */}
            <Stack.Screen
              name="RequestComplaintScreen"
              component={RequestComplaintScreen}
            />

            <Stack.Screen
              name="ResolvedComplaintScreen"
              component={ResolvedComplaintScreen}
            />
            <Stack.Screen
              name="RejectedComplaintScreen"
              component={RejectedComplaintScreen}
            />
            <Stack.Screen
              name="AllComplaintScreen"
              component={AllComplaintScreen}
            />

            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="ApprovedComplaintListing"
              component={ApprovedComplaintTopnavigation}
            />
            <Stack.Screen
              name="AddUpdateComplaintScreen"
              component={AddUpdateComplaintScreen}
            />
            <Stack.Screen
              name="ComplaintDetailScreen"
              component={ComplaintDetailScreen}
            />
            <Stack.Screen
              name="ComplaintTimelineScreen"
              component={ComplaintTimelineScreen}
            />
            <Stack.Screen
              name="AddUpdateAllocateComplaintScreen"
              component={AddUpdateAllocateComplaintScreen}
            />
            <Stack.Screen
              name="AllocatedComplaintScreenListScreen"
              component={AllocatedComplaintScreenListScreen}
            />
            <Stack.Screen
              name="ComplaintMoreDetails"
              component={ComplaintMoreDetails}
            />

            {/* stack for teams screens */}
            <Stack.Screen
              name="AddUpdateTeamScreen"
              component={AddUpdateTeamScreen}
            />
            <Stack.Screen name="TeamListScreen" component={TeamListScreen} />
            <Stack.Screen
              name="TemsDeatailScreen"
              component={TemsDeatailScreen}
            />
            <Stack.Screen
              name="AddTeamMemeberScreen"
              component={AddTeamMemeberScreen}
            />

            {/* Stack for employee screens */}
            <Stack.Screen
              name="EmployeesListScreen"
              component={EmployeesListScreen}
            />
            <Stack.Screen
              name="EmployeeDetailScreen"
              component={EmployeeDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateEmployeesScreen"
              component={AddUpdateEmployeesScreen}
            />
            <Stack.Screen
              name="EmpBankDetailScreen"
              component={EmpBankDetailScreen}
            />
            <Stack.Screen
              name="EmpDocumentScreen"
              component={EmpDocumentScreen}
            />
            <Stack.Screen
              name="EmpTimelineScreens"
              component={EmpTimelineScreens}
            />

            {/* Stack for attendace screens */}
            <Stack.Screen
              name="AttendaceListScreen"
              component={AttendanceTopTab}
            />
            <Stack.Screen
              name="AddUpdateAttendanceScreen"
              component={AddUpdateAttendanceScreen}
            />
            <Stack.Screen
              name="AttendanceDetailScreen"
              component={AttendanceDetailScreen}
            />

            {/* Stack for leave screens */}
            <Stack.Screen name="LeaveListingScreen" component={LeaveTopTab} />
            <Stack.Screen
              name="LeaveDetailScreen"
              component={LeaveDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateLeaveScreen"
              component={AddUpdateLeaveScreen}
            />

            {/* Stack for payroal screens */}
            <Stack.Screen
              name="PayrollListingScreen"
              component={PayrollTopTab}
            />

            {/* Stack for payroal master screens */}
            <Stack.Screen
              name="PayrollMasterListScreen"
              component={PayrollMasterTopTab}
            />
            <Stack.Screen
              name="CreateUpdateSettingScreen"
              component={CreateUpdateSettingScreen}
            />

            {/* Stack for PaySlip screens */}

            <Stack.Screen
              name="PaySlipListScreen"
              component={PaySlipListScreen}
            />

            {/* Stack for Salary Disbursal screens */}
            <Stack.Screen
              name="SalaryDisbursalListScreen"
              component={SalaryDisbursalListScreen}
            />
            <Stack.Screen
              name="UpdateSalaryDisbursal"
              component={UpdateSalaryDisbursal}
            />
            <Stack.Screen
              name="ViewSalaryDisbursal"
              component={ViewSalaryDisbursal}
            />

            {/* Stack for group insurance screens */}
            <Stack.Screen
              name="GroupInsuranceListScreen"
              component={GroupInsuranceListScreen}
            />
            <Stack.Screen
              name="AddUpdateInsuranceScreen"
              component={AddUpdateInsuranceScreen}
            />
            <Stack.Screen
              name="InsuranceDetailScreen"
              component={InsuranceDetailScreen}
            />

            {/* Stack for Loan screens */}
            <Stack.Screen name="LoanListingScreen" component={LoanTopTab} />
            <Stack.Screen
              name="LoandDetailScreen"
              component={LoandDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateLoanScreen"
              component={AddUpdateLoanScreen}
            />

            {/* Stack for Resignation screens */}
            <Stack.Screen
              name="ResignationListScreen"
              component={EmpResignationTopTab}
            />
            <Stack.Screen
              name="AddUpdateResignationScreen"
              component={AddUpdateResignationScreen}
            />
            <Stack.Screen
              name="ResignationDetailScreen"
              component={ResignationDetailScreen}
            />

            {/* Stack for Promotion and Demotion screens */}
            <Stack.Screen
              name="PromotionDemotionListScreen"
              component={PromotionDemotionListScreen}
            />
            <Stack.Screen
              name="PromotionDemotionDetailScreens"
              component={PromotionDemotionDetailScreens}
            />
            <Stack.Screen
              name="AddUpdatePromotionDemotionScreen"
              component={AddUpdatePromotionDemotionScreen}
            />

            {/* Stack for Retirement screens */}
            <Stack.Screen
              name="RetirementListScreen"
              component={RetirementListScreen}
            />
            <Stack.Screen
              name="RetirementDetailScreen"
              component={RetirementDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateRetirementScreen"
              component={AddUpdateRetirementScreen}
            />

            {/* Stack for Employee logs screens */}
            <Stack.Screen
              name="EmpLogsListScreen"
              component={EmpLogsListScreen}
            />
            <Stack.Screen
              name="EmpLogDetailScreen"
              component={EmpLogDetailScreen}
            />

            {/* Stack for tracking screens */}
            <Stack.Screen
              name="TrackingMapViewSreen"
              component={TrackingMapViewSreen}
            />

            {/* Stack for work management  screens */}
            <Stack.Screen
              name="AllWorkImageScreen"
              component={AllWorkImageScreen}
            />
            <Stack.Screen
              name="AddUpdateWorkImageScreen"
              component={AddUpdateWorkImageScreen}
            />

            {/* Stack for document screens */}
            <Stack.Screen
              name="DocumentListScreen"
              component={DocumentListScreen}
            />
            <Stack.Screen
              name="AddUpdateDocument"
              component={AddUpdateDocument}
            />
            <Stack.Screen
              name="DocumentCategoryListScreen"
              component={DocumentCategoryListScreen}
            />
            <Stack.Screen
              name="AddUpdateDocumentCategory"
              component={AddUpdateDocumentCategory}
            />

            {/* Stack for Work Quotation screens */}
            <Stack.Screen
              name="WorkQuotationTopTab"
              component={WorkQuotationTopTab}
            />
            <Stack.Screen
              name="AddUpdateWorkQuotationScreen"
              component={AddUpdateWorkQuotationScreen}
            />
            <Stack.Screen
              name="WorkQuotationListScreen"
              component={WorkQuotationListScreen}
            />

            {/* <Stack.Screen
              name="AllWorkQuotationScreen"
              component={AllWorkQuotationScreen}
            /> */}

            <Stack.Screen
              name="QuotationDetailScreen"
              component={QuotationDetailScreen}
            />
            <Stack.Screen
              name="QuotationDetailItemListScreen"
              component={QuotationDetailItemListScreen}
            />

            {/* Stack for Plain and Pricing screens */}
            <Stack.Screen
              name="PlanPricingListScreen"
              component={PlanPricingListScreen}
            />
            <Stack.Screen
              name="AddUpdatePlainPricingScreen"
              component={AddUpdatePlainPricingScreen}
            />

            {/* Stack for Supplier screens */}
            <Stack.Screen name="SupplierTopTab" component={SupplierTopTab} />
            <Stack.Screen
              name="SupplierListScreen"
              component={SupplierListScreen}
            />
            <Stack.Screen
              name="AddUpdateSuplierScreen"
              component={AddUpdateSuplierScreen}
            />
            <Stack.Screen
              name="SupplierDetailScreen"
              component={SupplierDetailScreen}
            />

            {/* Stack for outlet screens */}
            <Stack.Screen name="OutletTopTab" component={OutletTopTab} />
            <Stack.Screen
              name="OutletListScreen"
              component={OutletListScreen}
            />
            <Stack.Screen
              name="AddUpdateOutletScreen"
              component={AddUpdateOutletScreen}
            />
            <Stack.Screen
              name="OutletDetailScreen"
              component={OutletDetailScreen}
            />

            {/* Stack for Assest management screens */}
            <Stack.Screen name="AssestsTopTab" component={AssestsTopTab} />
            <Stack.Screen
              name="AssetsListScreen"
              component={AssetsListScreen}
            />
            <Stack.Screen
              name="AddUpdateAssestScreen"
              component={AddUpdateAssestScreen}
            />
            <Stack.Screen
              name="AssestDetailScreen"
              component={AssestDetailScreen}
            />
            <Stack.Screen
              name="AssetsTimelineHistoryScreen"
              component={AssetsTimelineHistoryScreen}
            />

            {/* Stack for Category & Product screens */}
            <Stack.Screen
              name="CategoryListScreen"
              component={CategoryListScreen}
            />
            <Stack.Screen
              name="AddUpdateCategory"
              component={AddUpdateCategory}
            />
            <Stack.Screen
              name="UnitDataListScreen"
              component={UnitDataListScreen}
            />
            <Stack.Screen
              name="AddUpdateUnitData"
              component={AddUpdateUnitData}
            />
            <Stack.Screen
              name="ProductListScreen"
              component={ProductListScreen}
            />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateProductScreen"
              component={AddUpdateProductScreen}
            />

            {/* Stack for all contact screens */}
            <Stack.Screen name="ContactTopTab" component={ContactTopTab} />
            {/* Stack for all contact screens */}
            <Stack.Screen
              name="ClientContactList"
              component={ClientContactList}
            />
            <Stack.Screen
              name="CompanyContactsListScreen"
              component={CompanyContactsListScreen}
            />
            <Stack.Screen
              name="FuelStationContactLIst"
              component={FuelStationContactLIst}
            />
            <Stack.Screen
              name="OilAndGasCompanyContactList"
              component={OilAndGasCompanyContactList}
            />
            <Stack.Screen
              name="OutletContactListScreen"
              component={OutletContactListScreen}
            />
            <Stack.Screen
              name="VendorContactList"
              component={VendorContactList}
            />
            <Stack.Screen
              name="SupplierContactList"
              component={SupplierContactList}
            />
            <Stack.Screen
              name="ContactDetailScreen"
              component={ContactDetailScreen}
            />
            <Stack.Screen
              name="ContactListScreen"
              component={ContactListScreen}
            />
            <Stack.Screen
              name="AddUpdateContactScreen"
              component={AddUpdateContactScreen}
            />

            {/* Stack for all contact screens */}
            <Stack.Screen
              name="EnergyContactListScreen"
              component={EnergyContactListScreen}
            />

            {/* Stack for all Bulk message screens */}
            <Stack.Screen
              name="CreateUpdateBulkMessageScreen"
              component={CreateUpdateBulkMessageScreen}
            />
            <Stack.Screen name="MessageTopTab" component={MessageTopTab} />
            <Stack.Screen
              name="AllBulkMessageListScreen"
              component={AllBulkMessageListScreen}
            />
            <Stack.Screen
              name="BulkMessageDetailScreen"
              component={BulkMessageDetailScreen}
            />

            {/* Stack for all energy company team screens */}
            <Stack.Screen
              name="EnergyTeamListScreen"
              component={EnergyTeamListScreen}
            />
            <Stack.Screen
              name="AddUpdateEnergyTeamScreen"
              component={AddUpdateEnergyTeamScreen}
            />
            <Stack.Screen
              name="EnergyCompanyDetailScreen"
              component={EnergyCompanyDetailScreen}
            />

            {/* Stack for feedback and suggestion screens */}
            <Stack.Screen
              name="FeedbackSuggestionListScreen"
              component={FeedbackSuggestionListScreen}
            />
            <Stack.Screen
              name="AddUpdateFeedbackSuggestionScreen"
              component={AddUpdateFeedbackSuggestionScreen}
            />
            <Stack.Screen
              name="FeedbackSuggestionDetailScreen"
              component={FeedbackSuggestionDetailScreen}
            />
            <Stack.Screen
              name="AddResponseScreen"
              component={AddResponseScreen}
            />

            {/* Chats */}

            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="NewChat" component={NewChat} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />
            {/* Stack for Task Managment screens */}
            <Stack.Screen
              name="TaskDashBoardScreen"
              component={TaskDashBoardScreen}
            />
            <Stack.Screen
              name="TaskCategoryListScreen"
              component={TaskCategoryListScreen}
            />
            <Stack.Screen
              name="AddUpdateTaskCategoryScreen"
              component={AddUpdateTaskCategoryScreen}
            />
            <Stack.Screen
              name="AllTaskListScreen"
              component={AllTaskListScreen}
            />
            <Stack.Screen
              name="AddUpdateTaskScreen"
              component={AddUpdateTaskScreen}
            />
            <Stack.Screen
              name="TaskDetailScreen"
              component={TaskDetailScreen}
            />
            <Stack.Screen
              name="TaskActivityListScreen"
              component={TaskActivityListScreen}
            />
            {/* Stack For Notifications  */}
            <Stack.Screen
              name="NotificationsListScreen"
              component={NotificationsListScreen}
            />

            {/* Stack for Tutorial screens */}
            <Stack.Screen name="TutorialTopTab" component={TutorialTopTab} />
            <Stack.Screen
              name="VideoPlayerScreen"
              component={VideoPlayerScreen}
            />
            <Stack.Screen
              name="AddUpdateTutorialScreen"
              component={AddUpdateTutorialScreen}
            />

            {/* Stack for Profile screens */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen
              name="UpdatePasswordScreen"
              component={UpdatePasswordScreen}
            />
            <Stack.Screen
              name="UpdateProfileScreen"
              component={UpdateProfileScreen}
            />
            {/* <Stack.Screen
              name="NotificationsListScreen"
              component={NotificationsListScreen}
            /> */}

            {/* Stack for Earthing testing screens */}
            <Stack.Screen name="AllETListScreen" component={AllETListScreen} />
            <Stack.Screen
              name="AddUpdateETScreen"
              component={AddUpdateETScreen}
            />

            {/* Stack for Survey screens */}
            <Stack.Screen
              name="SurveyListScreen"
              component={SurveyListScreen}
            />
            <Stack.Screen
              name="SurveyResponseForm"
              component={SurveyResponseForm}
            />
            <Stack.Screen name="AddSurvey" component={AddSurvey} />
            <Stack.Screen
              name="SurveyResponseDetailedView"
              component={SurveyResponseDetailedView}
            />

            {/* Stack for Bank Mangement screens */}
            <Stack.Screen name="BankListScreen" component={BankListScreen} />
            <Stack.Screen
              name="AddUpdateBankScreen"
              component={AddUpdateBankScreen}
            />

            {/* Stack for Finacial year screens */}
            <Stack.Screen
              name="FinancialYearListScreen"
              component={FinancialYearListScreen}
            />
            <Stack.Screen
              name="AddUpdateFinancialScreen"
              component={AddUpdateFinancialScreen}
            />

            {/* Stack for Tax screens */}
            <Stack.Screen name="TaxListScreen" component={TaxListScreen} />
            <Stack.Screen
              name="AddUpdateTaxScreen"
              component={AddUpdateTaxScreen}
            />

            {/* Stack for Gst Tax screens */}
            <Stack.Screen
              name="GstTaxListScreen"
              component={GstTaxListScreen}
            />
            <Stack.Screen
              name="AddUpdateGstTaxScreen"
              component={AddUpdateGstTaxScreen}
            />

            {/* Stack for Payment method screens */}
            <Stack.Screen
              name="PaymentMethodListScreen"
              component={PaymentMethodListScreen}
            />
            <Stack.Screen
              name="AddUpdatePaymentMethodScreen"
              component={AddUpdatePaymentMethodScreen}
            />

            {/* Stack for Bill format screens */}
            <Stack.Screen
              name="BillFormatListScreen"
              component={BillFormatListScreen}
            />
            <Stack.Screen
              name="AddUpdateBillFormatScreen"
              component={AddUpdateBillFormatScreen}
            />
            <Stack.Screen
              name="EmployeeNumberFormatListScreen"
              component={EmployeeNumberFormatListScreen}
            />
            <Stack.Screen
              name="AddUpdateEmployeeNumberFormat"
              component={AddUpdateEmployeeNumberFormat}
            />

            <Stack.Screen
              name="AddUpdateCompanyNoFormats"
              component={AddUpdateCompanyNoFormat}
            />
            <Stack.Screen
              name="CompanyNoFormatListScreen"
              component={CompanyNoFormatListScreen}
            />
            <Stack.Screen
              name="AddUpdateItemNumberFormat"
              component={AddUpdateItemNumberFormat}
            />
            <Stack.Screen
              name="ItemNumberFormatListScreen"
              component={ItemNumberFormatListScreen}
            />

            {/* Stack for Bank Account  screens */}
            <Stack.Screen
              name="AccountListScreen"
              component={AccountListScreen}
            />
            <Stack.Screen
              name="AccountDetailScreen"
              component={AccountDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateAcoountScreen"
              component={AddUpdateAcoountScreen}
            />

            {/* Stack for Add Bank balance screens */}
            <Stack.Screen
              name="AddUpdateBalanceScreen"
              component={AddUpdateBalanceScreen}
            />

            {/* Stack for Fund Request  screens */}
            <Stack.Screen
              name="FundRequestTopTab"
              component={FundRequestTopTab}
            />
            <Stack.Screen
              name="AddUpdateApproveFundRequestScreen"
              component={AddUpdateApproveFundRequestScreen}
            />
            <Stack.Screen
              name="ExistingItemListScreen"
              component={ExistingItemListScreen}
            />
            <Stack.Screen
              name="FundRequestDetailScreen"
              component={FundRequestDetailScreen}
            />

            {/* Stack for Fund Transfer screens */}
            <Stack.Screen
              name="FundTransferTopTab"
              component={FundTransferTopTab}
            />
            <Stack.Screen
              name="TransferFundRquestScreen"
              component={TransferFundRquestScreen}
            />

            {/* Stack for Fund balance overview screens */}
            <Stack.Screen
              name="FundBalanceOverViewScreen"
              component={FundBalanceOverViewScreen}
            />

            {/* Stack for Fund Transaction screens */}
            <Stack.Screen
              name="ViewFundTransctionScreen"
              component={ViewFundTransctionScreen}
            />

            {/* stack for stock request screens */}
            <Stack.Screen
              name="StockRequestTopTab"
              component={StockRequestTopTab}
            />
            <Stack.Screen
              name="StockRequestDetailScreen"
              component={StockRequestDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateApproveStockRequestScreen"
              component={AddUpdateApproveStockRequestScreen}
            />
            <Stack.Screen
              name="AllExistingStockItemListScreen"
              component={AllExistingStockItemListScreen}
            />
            <Stack.Screen
              name="StockRequestApprovedDataScreen"
              component={StockRequestApprovedDataScreen}
            />
            <Stack.Screen
              name="StockRequestTransferDataScreen"
              component={StockRequestTransferDataScreen}
            />

            {/* stack for stock Transfer screens */}
            <Stack.Screen
              name="StockTransferTopTab"
              component={StockTransferTopTab}
            />
            <Stack.Screen
              name="TransferStockRequestScreen"
              component={TransferStockRequestScreen}
            />

            {/* stack for stock balance overview screens */}
            <Stack.Screen
              name="StockBalanceOverViewScreen"
              component={StockBalanceOverViewScreen}
            />

            {/* stack for stock transaction screens */}
            <Stack.Screen
              name="ViewStockTransactionScreen"
              component={ViewStockTransactionScreen}
            />

            {/* stack for expense request screens */}
            <Stack.Screen
              name="ExpenseRequestListingScreen"
              component={ExpenseRequestListingScreen}
            />
            <Stack.Screen
              name="ExpenseRequestDetailScreen"
              component={ExpenseRequestDetailScreen}
            />

            {/* stack for Expense Punch screens */}
            <Stack.Screen
              name="ExpensePunchTopTab"
              component={ExpensePunchTopTab}
            />
            <Stack.Screen
              name="ExpensePunchDetailScreen"
              component={ExpensePunchDetailScreen}
            />
            <Stack.Screen
              name="AddUpdateApproveExpensePunchScreen"
              component={AddUpdateApproveExpensePunchScreen}
            />
            <Stack.Screen
              name="ExpensePunchItemHistory"
              component={ExpensePunchItemHistory}
            />

            {/* stack for Expense balance overview screens */}
            <Stack.Screen
              name="ExpenseBalanceOverViewScreen"
              component={ExpenseBalanceOverViewScreen}
            />

            {/* stack for Expense  Transaction screens */}
            <Stack.Screen
              name="ViewExpenseTransactionScreen"
              component={ViewExpenseTransactionScreen}
            />

            {/* stack for Stock punch request screens */}
            <Stack.Screen
              name="SPRequestListingScreen"
              component={SPRequestListingScreen}
            />
            <Stack.Screen
              name="SPRequestDetailScreen"
              component={SPRequestDetailScreen}
            />

            {/* stack for Stock Punch screens */}
            <Stack.Screen
              name="StockPunchTopTab"
              component={StockPunchTopTab}
            />
            <Stack.Screen name="SPDetailScreen" component={SPDetailScreen} />
            <Stack.Screen name="SPItemHisory" component={SPItemHisory} />
            <Stack.Screen
              name="AddUpdateApproveStockPunchScreen"
              component={AddUpdateApproveStockPunchScreen}
            />

            {/* stack for Stock punch balance screens */}
            <Stack.Screen
              name="ViewSPBalanceScreen"
              component={ViewSPBalanceScreen}
            />

            {/* stack for Stock punch transaction  screens */}
            <Stack.Screen
              name="ViewSPTranscationScreen"
              component={ViewSPTranscationScreen}
            />

            {/* stack for stock punch transfer screens */}
            <Stack.Screen
              name="SPTransferListScreen"
              component={SPTransferListScreen}
            />
            <Stack.Screen
              name="SPTransferDetailScreen"
              component={SPTransferDetailScreen}
            />
            <Stack.Screen
              name="SPTransferScreen"
              component={SPTransferScreen}
            />

            {/* stack for Office stock inspection screens */}
            <Stack.Screen
              name="OfficeStockInspectionTopTab"
              component={OfficeStockInspectionTopTab}
            />
            <Stack.Screen
              name="OfficeStockInspectionDetailScreen"
              component={OfficeStockInspectionDetailScreen}
            />
            <Stack.Screen
              name="OfficeStockInspectionItemList"
              component={OfficeStockInspectionItemList}
            />

            {/* stack for Office Fund inspection screens */}
            <Stack.Screen
              name="OfficeFundInspectionTopTab"
              component={OfficeFundInspectionTopTab}
            />
            <Stack.Screen
              name="OfficeFundInspectionDetailScreen"
              component={OfficeFundInspectionDetailScreen}
            />
            <Stack.Screen
              name="OfficeFundInspectionItemList"
              component={OfficeFundInspectionItemList}
            />

            <Stack.Screen
              name="OfficeInspectionEmployeeHistory"
              component={OfficeInspectionEmployeeHistoryList}
            />

            {/* stack for Site Stock Inspection screens */}
            <Stack.Screen
              name="SiteStockInspectionTopTab"
              component={SiteStockInspectionTopTab}
            />
            <Stack.Screen
              name="SiteStockInspectionDetailScreen"
              component={SiteStockInspectionDetailScreen}
            />
            <Stack.Screen
              name="SiteStockInspectionItemList"
              component={SiteStockInspectionItemList}
            />

            <Stack.Screen
              name="SiteStockInspectionOutletHistory"
              component={SiteStockInspectionOutletHistory}
            />

            {/* stack for Site Fund inspection screens */}
            <Stack.Screen
              name="SiteFundInspectionTopTab"
              component={SiteFundInspectionTopTab}
            />
            <Stack.Screen
              name="SiteFundInspectionDetailScreen"
              component={SiteFundInspectionDetailScreen}
            />
            <Stack.Screen
              name="SiteFundInspectionItemList"
              component={SiteFundInspectionItemList}
            />

            {/* stack for Measurement screens */}
            <Stack.Screen
              name="MeasurementTopTab"
              component={MeasurementTopTab}
            />
            <Stack.Screen
              name="ViewMeasurementDetailScreen"
              component={ViewMeasurementDetailScreen}
            />
            <Stack.Screen
              name="ViewPTMDetailScreen"
              component={ViewPTMDetailScreen}
            />
            <Stack.Screen
              name="PtmDetailItemlListScreen"
              component={PtmDetailItemlListScreen}
            />
            <Stack.Screen
              name="AddUpdateMeasurementAttachement"
              component={AddUpdateMeasurementAttachement}
            />
            <Stack.Screen
              name="AddUpdateMeasurementScreen"
              component={AddUpdateMeasurementScreen}
            />
            <Stack.Screen
              name="PtmStockAndFundViewScreen"
              component={PtmStockAndFundViewScreen}
            />
            <Stack.Screen
              name="ViewMeasurementTimelineScreen"
              component={ViewMeasurementTimelineScreen}
            />

            {/* stack for Performa Invoice screens */}
            <Stack.Screen
              name="PerformaInvoiceTopTab"
              component={PerformaInvoiceTopTab}
            />
            <Stack.Screen
              name="PerformaInvoiceListScreens"
              component={PerformaInvoiceListScreens}
            />
            <Stack.Screen
              name="AddUpdatePIScreen"
              component={AddUpdatePIScreen}
            />
            <Stack.Screen
              name="PerfromaInvoiceDetailScreen"
              component={PerfromaInvoiceDetailScreen}
            />
            <Stack.Screen
              name="PIDetailItemListScreen"
              component={PIDetailItemListScreen}
            />

            {/* stack for Merge to Pi screens */}
            <Stack.Screen name="MTPIToptab" component={MTPIToptab} />
            <Stack.Screen name="MTPIListScreen" component={MTPIListScreen} />
            <Stack.Screen
              name="MTPIDetailScreen"
              component={MTPIDetailScreen}
            />
            <Stack.Screen
              name="MTPIDetailItemListScreen"
              component={MTPIDetailItemListScreen}
            />

            {/* stack for Invoice screens */}
            <Stack.Screen name="InvoiceTopTab" component={InvoiceTopTab} />
            <Stack.Screen
              name="InovoiceDetailScreen"
              component={InovoiceDetailScreen}
            />
            <Stack.Screen
              name="InvoiceDetailItemListScreen"
              component={InvoiceDetailItemListScreen}
            />
            <Stack.Screen
              name="AddUpdateInvoiceScreen"
              component={AddUpdateInvoiceScreen}
            />

            {/* stack for Merge to invoice screens*/}
            <Stack.Screen name="MTITopTab" component={MTITopTab} />
            <Stack.Screen name="MTIDetailScreen" component={MTIDetailScreen} />
            <Stack.Screen
              name="MTIDetailItemListScreen"
              component={MTIDetailItemListScreen}
            />

            {/* stack for Payement update screens*/}
            <Stack.Screen
              name="PaymentUpdateListScreen"
              component={PaymentUpdateListScreen}
            />
            <Stack.Screen
              name="AddUpdatePayment"
              component={AddUpdatePayment}
            />

            {/* stack for Payement Received screens*/}
            <Stack.Screen
              name="PaymentReceivedTopTab"
              component={PaymentReceivedTopTab}
            />
            <Stack.Screen
              name="PaymentReceivedDetailScreen"
              component={PaymentReceivedDetailScreen}
            />
            <Stack.Screen
              name="PaymentVoucherHistory"
              component={PaymentVoucherHistory}
            />

            {/* stack for Retention money */}
            <Stack.Screen
              name="RetentionMoneyTopTab"
              component={RetentionMoneyTopTab}
            />
            <Stack.Screen
              name="RetentioMoneyDetailScreen"
              component={RetentioMoneyDetailScreen}
            />
            <Stack.Screen
              name="ApporveRetentionMoneyScreen"
              component={ApporveRetentionMoneyScreen}
            />
            <Stack.Screen
              name="CreateRetentionScreen"
              component={CreateRetentionScreen}
            />

            {/*stack for payment paid */}
            <Stack.Screen
              name="PaidInvoiceTopTab"
              component={PaidInvoiceTopTab}
            />
            <Stack.Screen
              name="PaymentPaidOtpVerifyScreen"
              component={PaymentPaidOtpVerifyScreen}
            />
            <Stack.Screen
              name="PaymentPaidDetailScreen"
              component={PaymentPaidDetailScreen}
            />
            {/* <Stack.Screen
              name="PaymentPaidListScreen"
              component={PaymentPaidListScreen}
            /> */}

            {/* stack for area manager */}
            <Stack.Screen
              name="AreaManagerListScreen"
              component={AreaManagerListScreen}
            />
            <Stack.Screen
              name="AreaManagerDetailScreen"
              component={AreaManagerDetailScreen}
            />

            {/* stack for regional office */}
            <Stack.Screen
              name="RegionalOfficeTopTab"
              component={RegionalOfficeTopTab}
            />
            <Stack.Screen
              name="RegionalOfficeDetailScreen"
              component={RegionalOfficeDetailScreen}
            />
            <Stack.Screen
              name="CreateRegionalOfficePayment"
              component={CreateRegionalOfficePayment}
            />
            <Stack.Screen
              name="RegionalOfficeTransactionListScreen"
              component={RegionalOfficeTransactionListScreen}
            />
            <Stack.Screen
              name="ROTransactionDetailScreen"
              component={ROTransactionDetailScreen}
            />
            <Stack.Screen
              name="PurchaseOrderTransctionListScreen"
              component={PurchaseOrderTransctionListScreen}
            />
            <Stack.Screen
              name="POTransactionDetailScreen"
              component={POTransactionDetailScreen}
            />

            {/* stack for Area manager overview screns */}
            <Stack.Screen
              name="AreaManagerOverviewListScreen"
              component={AreaManagerOverviewListScreen}
            />
            <Stack.Screen
              name="AddUpdateAreaManagerOverviewScreen"
              component={AddUpdateAreaManagerOverviewScreen}
            />

            {/* stack for Promotion overview screns */}
            <Stack.Screen
              name="PromotionOverviewListScreen"
              component={PromotionOverviewListScreen}
            />
            <Stack.Screen
              name="AddUpdatePromotionOverviewScreen"
              component={AddUpdatePromotionOverviewScreen}
            />

            {/* stack for purchase order screens */}
            <Stack.Screen
              name="PurchaseOrderTopTab"
              component={PurchaseOrderTopTab}
            />
            <Stack.Screen
              name="AddUpatePurchaseOrderScreen"
              component={AddUpatePurchaseOrderScreen}
            />
            <Stack.Screen
              name="PurchaseOrderDetailScreen"
              component={PurchaseOrderDetailScreen}
            />
            <Stack.Screen
              name="PoDetaiItemListScreen"
              component={PoDetaiItemListScreen}
            />
            <Stack.Screen
              name="SecurityDepositListScreen"
              component={SecurityDepositListScreen}
            />
            <Stack.Screen
              name="CreateSecurityScreen"
              component={CreateSecurityScreen}
            />
            <Stack.Screen
              name="SecurityDetailScreen"
              component={SecurityDetailScreen}
            />

            {/* stack for sales order screens */}
            <Stack.Screen
              name="SalesOrderTopTab"
              component={SalesOrderTopTab}
            />
            <Stack.Screen
              name="AddUpateSalesOrderScreen"
              component={AddUpateSalesOrderScreen}
            />
            <Stack.Screen
              name="SalesOrderDetailScreen"
              component={SalesOrderDetailScreen}
            />
            <Stack.Screen
              name="SoDetaiItemListScreen"
              component={SoDetaiItemListScreen}
            />
            <Stack.Screen
              name="CreateSOSecurityScreen"
              component={CreateSOSecurityScreen}
            />
            <Stack.Screen
              name="SalesSecurityDetailScreen"
              component={SalesSecurityDetailScreen}
            />

            {/* stack for item master screens */}
            <Stack.Screen
              name="ItemMasterFundTopTab"
              component={ItemMasterFundTopTab}
            />
            <Stack.Screen
              name="ItemMasterTopTab"
              component={ItemMasterTopTab}
            />
            <Stack.Screen
              name="ItemMasterListScreen"
              component={ItemMasterListScreen}
            />
            <Stack.Screen name="CreateItemForm" component={CreateItemForm} />
            <Stack.Screen
              name="AddUpdateItemMasterScreen"
              component={AddUpdateItemMasterScreen}
            />

            {/* stack for Brand screens */}
            <Stack.Screen name="BrandListScreen" component={BrandListScreen} />
            <Stack.Screen name="SubCategoryList" component={SubCategoryList} />
            <Stack.Screen
              name="AddUpdateSubCategory"
              component={AddUpdateSubCategory}
            />
            <Stack.Screen
              name="AddUpdateBrandScreen"
              component={AddUpdateBrandScreen}
            />

            {/* stack for ------- screens */}
            {/* <Stack.Screen
              name=""
              component={}
            /> */}

            {/* stack for module and submodule screens */}
            <Stack.Screen name="SubModuleScreen" component={SubModuleScreen} />

            {/* stack for ordervia screen */}
            <Stack.Screen
              name="OrderViaListScreen"
              component={OrderViaListScreen}
            />
            <Stack.Screen
              name="AddUpdateOrderViaScreen"
              component={AddUpdateOrderViaScreen}
            />

            {/* stack for roles and permissions */}
            <Stack.Screen name="AllRolesScreen" component={AllRolesScreen} />
            <Stack.Screen
              name="AddUpdateRoleScreen"
              component={AddUpdateRoleScreen}
            />
            <Stack.Screen
              name="ViewPermissionsScreen"
              component={ViewPermissionsScreen}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/LoginScreen';
import Home from '../screens/dashboard/Home';
import Colors from '../constants/Colors';
import SubModuleScreen from '../screens/submodule/SubModuleScreen';
import {selectUser} from '../redux/slices/authSlice';
import {useSelector} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CompaniesListingScreen from '../screens/companies/CompaniesListingScreen';
import AddUpdateCompaniesScreen from '../screens/companies/AddUpdateCompaniesScreen';
import CompaniesDetailsScreen from '../screens/companies/CompaniesDetailsScreen';
import OrderViaListScreen from '../screens/complaints/order via/OrderViaListScreen';
import AddUpdateOrderViaScreen from '../screens/complaints/order via/AddUpdateOrderViaScreen';
import RequestComplaintScreen from '../screens/complaints/RequestComplaintScreen';
import ResolvedComplaintScreen from '../screens/complaints/ResolvedComplaintScreen';
import RejectedComplaintScreen from '../screens/complaints/RejectedComplaintScreen';
import AllComplaintScreen from '../screens/complaints/AllComplaintScreen';
import AddUpdateComplaintScreen from '../screens/complaints/AddUpdateComplaintScreen';
import ComplaintTimelineScreen from '../screens/complaints/all complaints/ComplaintTimelineScreen';
import AddUpdateAllocateComplaintScreen from '../screens/complaints/AddUpdateAllocateComplaintScreen';
import AllocatedComplaintScreenListScreen from '../screens/complaints/AllocatedComplaintScreenListScreen';
import ComplaintMoreDetails from '../screens/complaints/all complaints/ComplaintMoreDetails';
import ComplaintTypeListScreen from '../screens/complaints/complaintType/ComplaintTypeListScreen';
import AddUpdateComplaintTypeScreen from '../screens/complaints/complaintType/AddUpdateComplaintTypeScreen';
import AllContractorList from '../screens/contractors/AllContractorList';
import AddUpdateContractorsForm from '../screens/contractors/AddUpdateContractorsForm';
import ContractorDetails from '../screens/contractors/ContractorDetails';
import AddUpdateContractUsersScreen from '../screens/contractors/AddUpdateContractUsersScreen';
import BottomTabNavigation from './BottomTabNavigation';
import ComplaintsTopTab from './ComplaintsTopTab';
import CreateUpdateBulkMessageScreen from '../screens/contacts/all messages/CreateUpdateBulkMessageScreen';
import AllBulkMessageListScreen from '../screens/contacts/all messages/AllBulkMessageListScreen';
import BulkMessageDetailScreen from '../screens/contacts/all messages/BulkMessageDetailScreen';
import EnergyContactListScreen from '../screens/contacts/energy contact/EnergyContactListScreen';
import ContactListScreen from '../screens/contacts/all contact/ContactListScreen';
import ContactDetailScreen from '../screens/contacts/all contact/ContactDetailScreen';
import AddUpdateContactScreen from '../screens/contacts/all contact/AddUpdateContactScreen';
import Dashboard from '../screens/home dashboard/Dashboard';
import MessageTopTab from './MessageTopTab';
import MeasurementTopTab from './MeasurementTopTab';
import ViewMeasurementDetailScreen from '../screens/billing management/measurements/ViewMeasurementDetailScreen';
import ViewPTMDetailScreen from '../screens/billing management/measurements/ViewPTMDetailScreen';
import PtmDetailItemlListScreen from '../screens/billing management/measurements/PtmDetailItemlListScreen';
import AddUpdateMeasurementAttachement from '../screens/billing management/measurements/AddUpdateMeasurementAttachement';
import AddUpdateMeasurementScreen from '../screens/billing management/measurements/AddUpdateMeasurementScreen';
import PtmStockAndFundViewScreen from '../screens/billing management/measurements/PtmStockAndFundViewScreen';
import ViewMeasurementTimelineScreen from '../screens/billing management/measurements/ViewMeasurementTimelineScreen';
import PerformaInvoiceTopTab from './PerformaInvoiceTopTab';
import AddUpdatePIScreen from '../screens/billing management/performa invoice/AddUpdatePIScreen';
import PerfromaInvoiceDetailScreen from '../screens/billing management/performa invoice/PerfromaInvoiceDetailScreen';
import PIDetailItemListScreen from '../screens/billing management/performa invoice/PIDetailItemListScreen';
import MTPIListScreen from '../screens/billing management/merge to pi/MTPIListScreen';
import MTPIDetailScreen from '../screens/billing management/merge to pi/MTPIDetailScreen';
import MTPIDetailItemListScreen from '../screens/billing management/merge to pi/MTPIDetailItemListScreen';
import InovoiceDetailScreen from '../screens/billing management/invoice/InovoiceDetailScreen';
import InvoiceDetailItemListScreen from '../screens/billing management/invoice/InvoiceDetailItemListScreen';
import AddUpdateInvoiceScreen from '../screens/billing management/invoice/AddUpdateInvoiceScreen';
import MTIDetailScreen from '../screens/billing management/merge to invoice/MTIDetailScreen';
import MTIDetailItemListScreen from '../screens/billing management/merge to invoice/MTIDetailItemListScreen';
import PaymentUpdateListScreen from '../screens/billing management/payment update/PaymentUpdateListScreen';
import AddUpdatePayment from '../screens/billing management/payment update/AddUpdatePayment';
import PaymentReceivedDetailScreen from '../screens/billing management/payment received/PaymentReceivedDetailScreen';
import PaymentVoucherHistory from '../screens/billing management/payment received/PaymentVoucherHistory';
import RetentioMoneyDetailScreen from '../screens/billing management/retention money/RetentioMoneyDetailScreen';
import ApporveRetentionMoneyScreen from '../screens/billing management/retention money/ApporveRetentionMoneyScreen';
import CreateRetentionScreen from '../screens/billing management/retention money/CreateRetentionScreen';
import PerformaInvoiceListScreen from '../screens/billing management/performa invoice/PerformaInvoiceListScreen';
import MTPIToptab from './MTPIToptab';
import InvoiceTopTab from './InvoiceTopTab';
import MTITopTab from './MTITopTab';
import PaymentReceivedTopTab from './PaymentReceivedTopTab';
import RetentionMoneyTopTab from './RetentionMoneyTopTab';
import PaidInvoiceTopTab from './PaidInvoiceTopTab';
import SurveyListScreen from '../screens/survey/SurveyListScreen';
import SurveyResponseForm from '../screens/survey/SurveyResponseForm';
import AddSurvey from '../screens/survey/AddSurvey';
import SurveyResponseDetailedView from '../screens/survey/SurveyResponseDetailedView';

/* import all Task Management  screens*/
import TaskDashBoardScreen from '../screens/task management/TaskDashBoardScreen';
import TaskCategoryListScreen from '../screens/task management/TaskCategoryListScreen';
import AddUpdateTaskCategoryScreen from '../screens/task management/AddUpdateTaskCategoryScreen';
import AllTaskListScreen from '../screens/task management/AllTaskListScreen';
import AddUpdateTaskScreen from '../screens/task management/AddUpdateTaskScreen';
import TaskDetailScreen from '../screens/task management/TaskDetailScreen';
import TaskActivityListScreen from '../screens/task management/TaskActivityListScreen';
import Chats from '../screens/communication/Chats';
import NewChat from '../screens/communication/NewChat';
import MessageScreen from '../screens/communication/MessageScreen';

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
import PaySlipListScreen from '../screens/hr management/payslips/PaySlipListScreen';
import SalaryDisbursalListScreen from '../screens/hr management/salarydisbursal/SalaryDisbursalListScreen';
import UpdateSalaryDisbursal from '../screens/hr management/salarydisbursal/UpdateSalaryDisbursal';
import ViewSalaryDisbursal from '../screens/hr management/salarydisbursal/ViewSalaryDisbursal';

/* import all document screens*/
import DocumentListScreen from '../screens/document/DocumentListScreen';
import AddUpdateDocument from '../screens/document/AddUpdateDocument';
import DocumentCategoryListScreen from '../screens/document/DocumentCategoryListScreen';
import AddUpdateDocumentCategory from '../screens/document/AddUpdateDocumentCategory';

/* import all feedback and suggestion screens */
import FeedbackSuggestionListScreen from '../screens/Feedback and suggestions/FeedbackSuggestionListScreen';
import FeedbackSuggestionDetailScreen from '../screens/Feedback and suggestions/FeedbackSuggestionDetailScreen';
import AddUpdateFeedbackSuggestionScreen from '../screens/Feedback and suggestions/AddUpdateFeedbackSuggestionScreen';
import AddResponseScreen from '../screens/Feedback and suggestions/AddResponseScreen';

/* import all Tutorial screens*/
import TutorialTopTab from './TutorialTopTab';
import VideoPlayerScreen from '../screens/tutorials/VideoPlayerScreen';
import AddUpdateTutorialScreen from '../screens/tutorials/AddUpdateTutorialScreen';

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
import AddUpdateWorkQuotationScreen from '../screens/work quotation/AddUpdateWorkQuotationScreen';
import WorkQuotationListScreen from '../screens/work quotation/WorkQuotationListScreen';
import WorkQuotationTopTab from './WorkQuotationTopTab';
import AllRolesScreen from '../screens/roles/AllRolesScreen';
import AddUpdateRoleScreen from '../screens/roles/AddUpdateRoleScreen';
import ViewPermissionsScreen from '../screens/roles/ViewPermissionsScreen';

/* import all Plain and Pricing screens*/
import PlanPricingListScreen from '../screens/plan & pricing/PlanPricingListScreen';
import AddUpdatePlainPricingScreen from '../screens/plan & pricing/AddUpdatePlainPricingScreen';

/* import all Earthing testing screens*/
import AllETListScreen from '../screens/earthing testing/AllETListScreen';
import AddUpdateETScreen from '../screens/earthing testing/AddUpdateETScreen';
import AllApprovedComplaintScreen from '../screens/complaints/AllApprovedComplaintScreen';
import ApprovedComplaintTopnavigation from './ApprovedComplaintTopnavigation';
import ZoneListScreen from '../screens/energyCompanies/zones/ZoneListScreen';
import AddUpdateZoneScreen from '../screens/energyCompanies/zones/AddUpdateZoneScreen';
import RegionalOfficeListScreen from '../screens/energyCompanies/regional/RegionalOfficeListScreen';
import AddUpdateRegionalOfficeScreen from '../screens/energyCompanies/regional/AddUpdateRegionalOfficeScreen';
import SalesAreaListScreen from '../screens/energyCompanies/salesArea/SalesAreaListScreen';
import AddUpdateSalesAreaScreen from '../screens/energyCompanies/salesArea/AddUpdataSalesAreaScreen';
import DistrictListScreen from '../screens/energyCompanies/district/DistrictListScreen';
import AddUpdateDistrictScreen from '../screens/energyCompanies/district/AddUpdateDistrictScreen';
import OutletsListScreen from '../screens/energyCompanies/outlets/OutletsListScreen';
import AddUpdateOutletScreen from '../screens/energyCompanies/outlets/AddUpdateOutletScreen';
import UpdateProfileScreen from '../screens/profile/UpdateProfileScreen';
import OutletDetailScreen from '../screens/energyCompanies/outlets/OutletDetailScreen';
import AddUpdateEnergyTeamScreen from '../screens/energy team/AddUpdateEnergyTeamScreen';
import EnergyCompanyDetailsScreen from '../screens/energyCompanies/company/EnergyCompanyDetailsScreen';
import EnergyCompanyListScreen from '../screens/energyCompanies/company/EnergyCompanyListScreen';
import EnergyCompanyUserList from '../screens/energyCompanies/company/EnergyCompanyUserList';
import AddUpdateEnegyCompanyScreen from '../screens/energyCompanies/company/AddUpdateEnegyCompanyScreen';
import AssignUserToEnergyCompanies from '../screens/energyCompanies/company/AssignUserToEnergyCompanies';
import AdminOutletTopTab from './AdminOutletTopTab';
import AdminOutletListScreen from '../screens/energyCompanies/outlets/AdminOutletsListScreen';
import EnergyTeamListScreen from '../screens/energy team/EnergyTeamListScreen';
import ClientContactList from '../screens/contacts/admin contacts/ClientContactList';
import CompanyContactsListScreen from '../screens/contacts/admin contacts/CompanyContactsListScreen';
import FuelStationContactLIst from '../screens/contacts/admin contacts/FuelStationContactLIst';
import OilAndGasCompanyContactList from '../screens/contacts/admin contacts/OilAndGasCompanyContactList';
import VendorContactList from '../screens/contacts/admin contacts/VendorContactList';
import OutletContactListScreen from '../screens/contacts/admin contacts/OutletContactListScreen';

/*import all item master  screen */
import ItemMasterTopTab from './ItemMasterTopTab';
import AddUpdateItemMasterScreen from '../screens/item master/item list/AddUpdateItemMasterScreen';
import CreateItemForm from '../screens/item master/item list/CreateItemForm';
import ItemMasterListScreen from '../screens/item master/item list/ItemMasterListScreen';
import ItemMasterFundTopTab from './ItemMasterFundTopTab';

/*import all brand  screen */
import BrandListScreen from '../screens/item master/brand/BrandListScreen';
import AddUpdateBrandScreen from '../screens/item master/brand/AddUpdateBrandScreen';
import SubCategoryList from '../screens/item master/sub-category/SubCategoryList';
import AddUpdateSubCategory from '../screens/item master/sub-category/AddUpdateSubCategory';

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
import OverView from '../screens/companies/OverView';
import NotificationsListScreen from '../screens/notifications/NotificationsListScreen';
import SetApprovalComplaints from '../screens/AllComplaints/SetApprovalComplaints';
import UpdatePasswordScreen from '../screens/profile/UpdatePasswordScreen';
import EmployeeNumberFormatListScreen from '../screens/master data management/employeeNoFormat/EmployeeNumberFormatListScreen';
import AddUpdateEmployeeNumberFormat from '../screens/master data management/employeeNoFormat/AddUpdateEmployeeNumberFormat';
import AddUpdateCompanyNoFormat from '../screens/master data management/companyNoFormat/AddUpdateCompanyNoFormat';
import CompanyNoFormatListScreen from '../screens/master data management/companyNoFormat/CompanyNoFormatListScreen';
import AddUpdateItemNumberFormat from '../screens/master data management/itemNoFormat/AddUpdateItemNumberFormat';
import ItemNumberFormatListScreen from '../screens/master data management/itemNoFormat/ItemNumberFormatList';

const Stack = createNativeStackNavigator();

const MainNavigator = ({navigation}) => {
  const {isAuthenticated} = useSelector(selectUser);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomTabNavigation"
        screenOptions={{
          headerShown: false,
          statusBarStyle: 'dark',
          statusBarColor: Colors().screenBackground,
        }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen
              name="BottomTabNavigation"
              component={BottomTabNavigation}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

            {/* Stack For Notifications  */}
            <Stack.Screen
              name="NotificationsListScreen"
              component={NotificationsListScreen}
            />
            <Stack.Screen
              name="UpdateProfileScreen"
              component={UpdateProfileScreen}
            />
            <Stack.Screen
              name="UpdatePasswordScreen"
              component={UpdatePasswordScreen}
            />

            {/* stack for coplaints */}
            {/* <Stack.Screen
              name="CompalintTypeDashboard"
              component={CompalintTypeDashboard}
            />
            <Stack.Screen
              name="ComplaintDashboard"
              component={ComplaintDashboard}
            />
            <Stack.Screen
              name="ComplaintListing"
              component={ComplaintListing}
            />
            <Stack.Screen name="AddComplaint" component={AddComplaint} /> */}

            {/* stack for companies */}
            {/* <Stack.Screen
              name="CompaniesTypeDashboardScreen"
              component={CompaniesTypeDashboardScreen}
            /> */}

            <Stack.Screen name="Dashboard" component={Dashboard} />

            <Stack.Screen
              name="CompaniesListingScreen"
              component={CompaniesListingScreen}
            />
            <Stack.Screen name="OverView" component={OverView} />
            <Stack.Screen
              name="AddUpdateCompaniesScreen"
              component={AddUpdateCompaniesScreen}
            />
            <Stack.Screen
              name="CompaniesDetailsScreen"
              component={CompaniesDetailsScreen}
            />

            {/*  Energy Teams */}
            <Stack.Screen
              name="EnergyTeamListScreen"
              component={EnergyTeamListScreen}
            />

            {/* Contractors */}
            <Stack.Screen
              name="AllContractorList"
              component={AllContractorList}
            />
            <Stack.Screen
              name="AddUpdateContractorForm"
              component={AddUpdateContractorsForm}
            />
            <Stack.Screen
              name="ContractorDetails"
              component={ContractorDetails}
            />
            <Stack.Screen
              name="AddUpdateContractUsersScreen"
              component={AddUpdateContractUsersScreen}
            />

            {/* Complaints  */}
            <Stack.Screen
              name="OrderViaListScreen"
              component={OrderViaListScreen}
            />
            <Stack.Screen
              name="AddUpdateOrderViaScreen"
              component={AddUpdateOrderViaScreen}
            />
            <Stack.Screen
              name="ApprovedComplaintTopnavigation"
              component={ApprovedComplaintTopnavigation}
            />

            <Stack.Screen
              name="RequestComplaintScreen"
              component={RequestComplaintScreen}
            />
            <Stack.Screen
              name="AllApprovedComplaintScreen"
              component={AllApprovedComplaintScreen}
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
            <Stack.Screen
              name="ComplaintsTopTab"
              component={ComplaintsTopTab}
            />
            <Stack.Screen
              name="AddUpdateComplaintScreen"
              component={AddUpdateComplaintScreen}
            />
            {/* <Stack.Screen
              name="ComplaintDetailScreen"
              component={ComplaintDetailScreen}
            /> */}
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
            <Stack.Screen
              name="ComplaintTypeListScreen"
              component={ComplaintTypeListScreen}
            />
            <Stack.Screen
              name="SetApprovalComplaints"
              component={SetApprovalComplaints}
            />
            <Stack.Screen
              name="AddUpdateComplaintTypeScreen"
              component={AddUpdateComplaintTypeScreen}
            />

            {/* Energy Companies */}

            <Stack.Screen
              name="AddUpdateEnergyTeamScreen"
              component={AddUpdateEnergyTeamScreen}
            />
            <Stack.Screen
              name="AddUpdateEnegyCompanyScreen"
              component={AddUpdateEnegyCompanyScreen}
            />
            <Stack.Screen
              name="EnergyCompanyDetailsScreen"
              component={EnergyCompanyDetailsScreen}
            />
            <Stack.Screen
              name="EnergyCompanyListScreen"
              component={EnergyCompanyListScreen}
            />
            <Stack.Screen
              name="EnergyCompanyUserList"
              component={EnergyCompanyUserList}
            />
            <Stack.Screen
              name="AssignUserToEnergyCompanies"
              component={AssignUserToEnergyCompanies}
            />

            <Stack.Screen name="ZoneListScreen" component={ZoneListScreen} />
            <Stack.Screen
              name="AddUpdateZoneScreen"
              component={AddUpdateZoneScreen}
            />
            <Stack.Screen
              name="RegionalOfficeListScreen"
              component={RegionalOfficeListScreen}
            />
            <Stack.Screen
              name="AddUpdateRegionalOfficeScreen"
              component={AddUpdateRegionalOfficeScreen}
            />

            <Stack.Screen
              name="SalesAreaListScreen"
              component={SalesAreaListScreen}
            />
            <Stack.Screen
              name="AddUpdateSalesAreaScreen"
              component={AddUpdateSalesAreaScreen}
            />
            <Stack.Screen
              name="DistrictListScreen"
              component={DistrictListScreen}
            />
            <Stack.Screen
              name="AddUpdateDistrictScreen"
              component={AddUpdateDistrictScreen}
            />
            <Stack.Screen
              name="OutletsListScreen"
              component={OutletsListScreen}
            />
            <Stack.Screen
              name="OutletDetailScreen"
              component={OutletDetailScreen}
            />
            <Stack.Screen
              name="AdminOutletTopTab"
              component={AdminOutletTopTab}
            />
            <Stack.Screen
              name="AdminOutletListScreen"
              component={AdminOutletListScreen}
            />
            <Stack.Screen
              name="AddUpdateOutletScreen"
              component={AddUpdateOutletScreen}
            />

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
              name="AddUpdateContactScreen"
              component={AddUpdateContactScreen}
            />
            <Stack.Screen
              name="ContactDetailScreen"
              component={ContactDetailScreen}
            />
            <Stack.Screen
              name="ContactListScreen"
              component={ContactListScreen}
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
              component={PerformaInvoiceListScreen}
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

            {/*stack for payment paid */}
            <Stack.Screen
              name="PaidInvoiceTopTab"
              component={PaidInvoiceTopTab}
            />
            {/* <Stack.Screen
              name="PaymentPaidOtpVerifyScreen"
              component={PaymentPaidOtpVerifyScreen}
            />
            <Stack.Screen
              name="PaymentPaidDetailScreen"
              component={PaymentPaidDetailScreen}
            /> */}

            {/* stack for roles and permissions */}
            {/* <Stack.Screen name="AllRolesScreen" component={AllRolesScreen} />
            <Stack.Screen
              name="AddUpdateRoleScreen"
              component={AddUpdateRoleScreen}
            />
            <Stack.Screen
              name="ViewPermissionsScreen"
              component={ViewPermissionsScreen}
            /> */}

            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="NewChat" component={NewChat} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />

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

            {/* Stack for Plain and Pricing screens */}
            <Stack.Screen
              name="PlanPricingListScreen"
              component={PlanPricingListScreen}
            />
            <Stack.Screen
              name="AddUpdatePlainPricingScreen"
              component={AddUpdatePlainPricingScreen}
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

            <Stack.Screen name="SubModuleScreen" component={SubModuleScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </Stack.Group>
        )}
        {/* <Stack.Screen name="formikdummyscreen" component={formikdummyscreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

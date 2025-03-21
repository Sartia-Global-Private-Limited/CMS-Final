import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import {Neomorph} from 'react-native-neomorph-shadows';
import Images from '../../constants/Images';
import {WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {apiBaseUrl} from '../../../config';
import ScreensLabel from '../../constants/ScreensLabel';
import {useDispatch} from 'react-redux';
import {setActiveTab} from '../../redux/slices/authSlice';
import ChartCard from '../../component/ChartCard';

const SubModuleScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const headerTitle = route?.params?.title;
  const module_id = route?.params?.module_id;
  const moduleLabel = ScreensLabel();
  const subModuleDetailData = route?.params?.submodulesData;

  const navigationFunctionWithPath = path => {
    const navigationMap = {
      //Companies
      '/client': {
        screen: 'CompaniesListingScreen',
        title: 'Sales Company',
        type: 'sales',
      },
      '/my-companies': {
        screen: 'CompaniesListingScreen',
        title: 'MY Company',
        type: 'my',
      },
      '/vendor': {
        screen: 'CompaniesListingScreen',
        title: 'Purchase Company',
        type: 'purchase',
      },
      '/all-companies': {
        screen: 'OverView',
        title: 'All Company',
        type: 'all',
      },
      '/order-via': {
        screen: 'OrderViaListScreen',
        type: 'all',
      },
      // Energy Team
      '/create-team': {
        screen: 'AddUpdateEnergyTeamScreen',
      },
      '/all-energy-members': {
        screen: 'EnergyTeamListScreen',
      },
      // Energy Company
      '/energy-company': {
        screen: 'EnergyCompanyListScreen',
      },
      '/energy-zone': {
        screen: 'ZoneListScreen',
      },
      '/regional-office': {
        screen: 'RegionalOfficeListScreen',
      },
      '/sales-area': {
        screen: 'SalesAreaListScreen',
      },
      '/district': {
        screen: 'DistrictListScreen',
      },
      '/OutletsMasterdata': {
        screen: 'OutletsListScreen',
      },
      '/requested-fuel-station': {
        screen: 'AdminOutletListScreen',
        type: 1,
      },
      '/approved-fuel-station': {
        screen: 'AdminOutletListScreen',
        type: 2,
      },
      '/rejected-fuel-station': {
        screen: 'AdminOutletListScreen',
        type: 3,
      },
      '/all-fuel-station': {
        screen: 'AdminOutletListScreen',
        type: '',
      },
      '/create-outlet': {
        screen: 'AddUpdateOutletScreen',
      },
      //Master Data
      '/create-complaint/new': {
        screen: 'AddUpdateComplaintScreen',
      },
      '/AllComplaintsMasterdata': {
        screen: 'ComplaintsTopTab',
      },
      '/ComplaintTypesMasterdata': {
        screen: 'ComplaintTypeListScreen',
      },
      '/request-complaint': {
        screen: 'RequestComplaintScreen',
      },
      '/ApprovedComplaints': {
        screen: 'ApprovedComplaintListing',
      },
      '/rejected-complaints': {
        screen: 'RejectedComplaintScreen',
      },
      '/resolved-complaints': {
        screen: 'ResolvedComplaintScreen',
      },
      '/Allocate': {
        screen: 'AllocatedComplaintScreenListScreen',
      },
      // Complaints
      '/create-complaint': {
        screen: 'AddUpdateComplaintScreen',
      },
      '/all-complaints': {
        screen: 'AllComplaintScreen',
      },
      '/ComplaintTypesMasterdata': {
        screen: 'ComplaintTypeListScreen',
      },
      '/requested-complaint': {
        screen: 'RequestComplaintScreen',
      },
      '/approved-complaint': {
        screen: 'ApprovedComplaintTopnavigation',
      },
      '/rejected-complaint': {
        screen: 'RejectedComplaintScreen',
      },
      '/resolved-complaint': {
        screen: 'ResolvedComplaintScreen',
      },
      '/allocate-complaint': {
        screen: 'AllocatedComplaintScreenListScreen',
      },
      '/stock-request': {
        screen: 'StockRequestTopTab',
        title: 'STOCK REQUEST',
      },
      // hr management
      '/Teams': {screen: 'TeamListScreen', title: 'Teams'},
      '/Employees': {screen: 'EmployeesListScreen', title: 'Teams'},
      '/Attendance': {screen: 'AttendaceListScreen', title: 'Teams'},
      '/Leaves': {screen: 'LeaveListingScreen', title: 'Teams'},
      '/Payroll': {screen: 'PayrollListingScreen', title: 'Teams'},
      '/PaySlip': {screen: 'PaySlipListScreen', title: 'Teams'},
      '/PayrollMaster': {screen: 'PayrollMasterListScreen', title: 'Teams'},
      '/GroupInsurance': {screen: 'GroupInsuranceListScreen', title: 'Teams'},
      '/Loan': {screen: 'LoanListingScreen', title: 'Teams'},
      '/SalaryDisbursal': {
        screen: 'SalaryDisbursalListScreen',
        title: 'Teams',
      },
      '/EmployeeResignation': {
        screen: 'ResignationListScreen',
        title: 'Teams',
      },
      '/EmployeeRetirement': {screen: 'RetirementListScreen', title: 'Teams'},
      '/EmployeePromotionDemotion': {
        screen: 'PromotionDemotionListScreen',
        title: 'Teams',
      },
      '/EmployeeLogs': {screen: 'EmpLogsListScreen', title: 'Teams'},
      '/EmployeeTracking': {screen: 'TrackingMapViewSreen', title: 'Teams'},
      '/purchase-order': {
        screen: 'PurchaseOrderTopTab',
        title: 'Purchase Order List',
      },
      '/sale-order': {
        screen: 'SalesOrderTopTab',
        title: 'Sale Order List',
      },
      '/all-work-image': {
        screen: 'AllWorkImageScreen',
        title: 'all work image',
      },
      '/document-category': {
        screen: 'DocumentCategoryListScreen',
        title: 'document category',
      },
      '/document-list': {
        screen: 'DocumentListScreen',
        title: 'Document list',
      },
      '/request-supplier': {
        screen: 'SupplierListScreen',
        type: 'requested',
      },
      '/Suppliers/create-supplier/new': {
        screen: 'AddUpdateSuplierScreen',
      },
      '/approved-supplier': {
        screen: 'SupplierListScreen',
        type: 'approved',
      },
      '/rejected-supplier': {
        screen: 'SupplierListScreen',
        type: 'reject',
      },
      '/all-suppliers-overview': {
        screen: 'SupplierListScreen',
        type: 'all',
      },
      '/ItemMaster/add-item-master/new': {
        screen: 'AddUpdateItemMasterScreen',
      },
      '/ItemMaster/all-item-overview': {
        screen: 'ItemMasterListScreen',
        type: 'all',
      },
      '/ItemMaster/fund-item': {
        screen: 'ItemMasterFundTopTab',
        type: 'fund',
      },
      '/ItemMaster/stock-item': {
        screen: 'ItemMasterFundTopTab',
        type: 'stock',
      },
      '/ItemMaster/all-brand-overview': {
        screen: 'BrandListScreen',
      },
      '/ItemMaster/all-sub-category-overview': {
        screen: 'SubCategoryList',
      },
      '/product-category': {
        screen: 'CategoryListScreen',
      },
      '/unit-data': {
        screen: 'UnitDataListScreen',
      },
      '/ProductService': {
        screen: 'ProductListScreen',
      },
      '/AllAssets/CreateAssets/new': {
        screen: 'AddUpdateAssestScreen',
      },
      'assets/all-requested': {
        screen: 'AssetsListScreen',
        type: 'requested',
      },
      'assets/all-approved': {
        screen: 'AssetsListScreen',
        type: 'approved',
      },
      'assets/all-rejected': {
        screen: 'AssetsListScreen',
        type: 'reject',
      },
      'assets/all-assigned': {
        screen: 'AssetsListScreen',
        type: 'assigned',
      },
      'assets/repair': {
        screen: 'AssetsListScreen',
        type: 'repair',
      },
      'assets/scrap': {
        screen: 'AssetsListScreen',
        type: 'scrap',
      },
      'assets/all': {
        screen: 'AssetsListScreen',
        type: 'all',
      },
      'team/all-energy-team-overview': {
        screen: 'EnergyTeamListScreen',
      },
      '/team/create-energy-team/new': {
        screen: 'AddUpdateEnergyTeamScreen',
      },
      '/outlet/all-outlet-overview': {
        screen: 'OutletListScreen',
        type: 'all',
      },
      '/outlet/approved': {
        screen: 'OutletListScreen',
        type: 'approved',
      },
      '/outlet/rejected': {
        screen: 'OutletListScreen',
        type: 'reject',
      },
      '/outlet/request': {
        screen: 'OutletListScreen',
        type: 'requested',
      },
      '/outlet/create/new': {
        screen: 'AddUpdateOutletScreen',
      },
      '/WorkImages/all': {
        screen: 'AllWorkImageScreen',
        type: 'all',
      },
      'workImages/rejected': {
        screen: 'AllWorkImageScreen',
        type: 'reject',
      },
      'workImages/approved': {
        screen: 'AllWorkImageScreen',
        type: 'approved',
      },
      'workImages/request': {
        screen: 'AllWorkImageScreen',
        type: 'requested',
      },
      '/WorkImages/create/new': {
        screen: 'AddUpdateWorkImageScreen',
      },
      '/survey/create': {
        screen: 'AddSurvey',
      },
      '/survey/request': {
        screen: 'SurveyListScreen',
        type: 'requested',
      },
      '/survey/approved': {
        screen: 'SurveyListScreen',
        type: 'approved',
      },
      '/survey/rejected': {
        screen: 'SurveyListScreen',
        type: 'reject',
      },
      '/survey/assigned-survey': {
        screen: 'SurveyListScreen',
        type: 'allocated',
      },
      '/survey/all-survey-overview': {
        screen: 'SurveyListScreen',
        type: 'all',
      },
      '/survey/response-survey': {
        screen: 'SurveyResponseDetailedView',
      },

      '/earthing-testing/create/new': {
        screen: 'AddUpdateETScreen',
      },
      '/earthing-testing/all': {
        screen: 'AllETListScreen',
        type: 'all',
      },
      '/earthing-testing/request': {
        screen: 'AllETListScreen',
        type: 'requested',
      },
      '/earthing-testing/rejected': {
        screen: 'AllETListScreen',
        type: 'reject',
      },
      '/earthing-testing/allocate': {
        screen: 'AllETListScreen',
        type: 'allocated',
      },
      '/earthing-testing/approved': {
        screen: 'AllETListScreen',
        type: 'approved',
      },
      '/earthing-testing/report': {
        screen: 'AllETListScreen',
        type: 'report',
      },
      '/create-contact': {
        screen: 'AddUpdateContactScreen',
        type: 'company',
      },
      '/company-contacts': {
        screen: 'CompanyContactsListScreen',
        type: 'company',
      },
      '/oil-and-gas-contacts': {
        screen: 'OilAndGasCompanyContactList',
        type: 'energy-company',
      },
      '/fuel-station-contacts': {
        screen: 'OutletContactListScreen',
        type: 'outlet',
      },
      'contacts/dealer': {
        screen: 'ContactListScreen',
        type: 'dealer',
      },
      '/vendor-contacts': {
        screen: 'VendorContactList',
        type: 'supplier',
      },
      '/client-contacts': {
        screen: 'ClientContactList',
        type: 'client',
      },
      'contacts/create': {
        screen: 'AddUpdateContactScreen',
        type: 'company',
      },
      '/company-contacts': {
        screen: 'CompanyContactsListScreen',
        type: 'company',
      },
      '/dealers-contacts': {
        screen: 'ContactListScreen',
        type: 'dealer',
      },
      '/super-admin-contacts': {
        screen: 'ContactListScreen',
        type: 'super-admin',
      },
      '/contractors-contacts': {
        screen: 'ContactListScreen',
        type: 'contractor',
      },
      '/contacts/all-energy-company-contact': {
        screen: 'EnergyContactListScreen',
      },
      '/all-messages': {
        screen: 'Chats',
      },
      '/DocumentCategory': {
        screen: 'DocumentCategoryListScreen',
      },
      '/AddDocument': {
        screen: 'AddUpdateDocument',
      },
      '/DocumentsLists': {
        screen: 'DocumentListScreen',
      },
      '/task-dahboard': {
        screen: 'TaskDashBoardScreen',
      },
      '/task/create/new': {
        screen: 'AddUpdateTaskScreen',
      },
      '/TaskCategory': {
        screen: 'TaskCategoryListScreen',
      },
      '/task/request': {
        screen: 'AllTaskListScreen',
      },
      '/bank-management': {
        screen: 'BankListScreen',
      },
      '/financial-year': {
        screen: 'FinancialYearListScreen',
      },
      '/Taxes': {screen: 'GstTaxListScreen'},
      '/TaxManagement': {
        screen: 'GstTaxListScreen',
      },
      '/payment-method': {
        screen: 'PaymentMethodListScreen',
      },
      '/bill-no-format': {
        screen: 'BillFormatListScreen',
      },
      '/account-management': {
        screen: 'AccountListScreen',
      },
      '/addBankBalance': {
        screen: 'AddUpdateBalanceScreen',
      },
      '/fund-request': {
        screen: 'FundRequestTopTab',
      },
      '/fund-transfer': {
        screen: 'FundTransferTopTab',
      },
      '/fund-balance-overview': {
        screen: 'FundBalanceOverViewScreen',
      },
      '/view-fund-transactions': {
        screen: 'ViewFundTransctionScreen',
      },
      '/stock-request': {
        screen: 'StockRequestTopTab',
      },
      '/stock-transfer': {
        screen: 'StockTransferTopTab',
      },
      '/stock-balance-overview': {
        screen: 'StockBalanceOverViewScreen',
      },
      '/view-stock-transactions': {
        screen: 'ViewStockTransactionScreen',
      },
      '/expense-request': {
        screen: 'ExpenseRequestListingScreen',
      },
      '/expense-punch': {
        screen: 'ExpensePunchTopTab',
        title: 'All Expense Punch',
      },
      '/expense-balance-overview': {
        screen: 'ExpenseBalanceOverViewScreen',
        title: 'All Expense Punch',
      },
      '/view-expense-transaction': {
        screen: 'ViewExpenseTransactionScreen',
        title: 'All Expense Punch',
      },
      '/stock-punch-request': {
        screen: 'SPRequestListingScreen',
        title: 'All Expense Punch',
      },
      '/stock-punch': {
        screen: 'StockPunchTopTab',
        title: 'All Expense Punch',
      },
      '/stock-punch-balance-overview': {
        screen: 'ViewSPBalanceScreen',
        title: 'All Expense Punch',
      },
      '/view-stock-transaction': {
        screen: 'ViewSPTranscationScreen',
        title: 'All Expense Punch',
      },
      '/stock-punch-transfer': {
        screen: 'SPTransferListScreen',
        title: 'All Expense Punch',
      },
      '/office-expense': {
        screen: 'OfficeStockInspectionTopTab',
        title: 'All Expense Punch',
      },
      '/office-fund-inspection': {
        screen: 'OfficeFundInspectionTopTab',
        title: 'All Expense Punch',
      },
      '/office-inspection/employee-history': {
        screen: 'OfficeInspectionEmployeeHistory',
        title: 'All Expense Punch',
      },
      '/site-inspection/outlet-history': {
        screen: 'SiteStockInspectionOutletHistory',
        title: 'All Expense Punch',
      },
      '/site-expense-inspection': {
        screen: 'SiteStockInspectionTopTab',
        title: 'All Expense Punch',
      },
      '/site-fund-inspection': {
        screen: 'SiteFundInspectionTopTab',
        title: 'All Expense Punch',
      },

      // billing Management

      '/billing-measurement': {
        screen: 'MeasurementTopTab',
        title: 'Mesurement',
      },
      '/performa-invoice': {
        screen: 'PerformaInvoiceTopTab',
        title: 'PerformaInvoiceTopTab',
      },
      '/merged-performa': {screen: 'MTPIToptab', title: 'Merge to pi'},
      '/billing-invoice': {screen: 'InvoiceTopTab', title: 'inovice'},
      '/merged-invoice': {screen: 'MTITopTab', title: 'merge inovice'},
      '/billing-payments': {
        screen: 'PaymentUpdateListScreen',
        title: 'payment update',
      },
      '/payment-received': {
        screen: 'PaymentReceivedTopTab',
        title: 'payment received',
      },
      '/retention': {
        screen: 'RetentionMoneyTopTab',
        title: 'retention money',
      },
      //purchase and sale Order
      '/purchase-order': {
        screen: 'PurchaseOrderTopTab',
        title: 'Purchase Order List',
      },
      '/sale-order': {
        screen: 'SalesOrderTopTab',
        title: 'Sale Order List',
      },

      // Work Quatations

      '/all-work-quotations': {
        screen: 'WorkQuotationListScreen',
        title: 'All quotation list',
        type: 'all',
      },
      '/requested-work-quotations': {
        screen: 'WorkQuotationListScreen',
        title: 'All quotation list',
        type: 'requested',
      },
      '/approved-work-quotations': {
        screen: 'WorkQuotationListScreen',
        type: 'approved',
      },
      '/rejected-work-quotations': {
        screen: 'WorkQuotationListScreen',
        type: 'reject',
      },
      '/payment-paid/all': {screen: 'PaidInvoiceTopTab'},
      '/area-manager/all': {screen: 'AreaManagerListScreen'},
      '/regional-office/all': {screen: 'RegionalOfficeTopTab'},
      '/regional-office/ro-transactions': {
        screen: 'RegionalOfficeTransactionListScreen',
      },
      '/regional-office/po-transactions': {
        screen: 'PurchaseOrderTransctionListScreen',
      },
      '/setting/create/new': {screen: 'AddUpdatePromotionOverviewScreen'},
      '/setting/all-setting-overview': {
        screen: 'PromotionOverviewListScreen',
      },
      '/setting/area-manager/all': {screen: 'AreaManagerSettingScreen'},
      '/setting/area-manager-ratio/all-area-overview': {
        screen: 'AreaManagerOverviewListScreen',
      },
      '/setting/area-manager-ratio/new': {
        screen: 'AddUpdateAreaManagerOverviewScreen',
      },
      '/setting/company': {screen: 'CompanySettingListScreen'},
      '/setting/employee': {screen: 'EmployeeSettingListScreen'},
      '/employee-no-format': {screen: 'EmployeeNumberFormatListScreen'},
      '/client-vendor-no-format': {screen: 'CompanyNoFormatListScreen'},
      '/item-no-format': {screen: 'ItemNumberFormatListScreen'},
      '/setting/unit': {screen: 'UnitListScreen'},
      '/setting/designation': {screen: 'DesignationListScreen'},
      '/setting/all-asset-category': {screen: 'AllAssetCategoryListScreen'},
      '/setting/all-asset': {screen: 'AllAssetListScreen'},
      '/setting/all-sub-asset': {screen: 'AllSubAssetListScreen'},
      '/setting/all-equipment': {screen: 'AllEquipmentListScreen'},
      '/setting/all-sub-equipment': {screen: 'AllSubEquipmentListScreen'},
      '/setting/all-accessories': {screen: 'AllAccessoriesListScreen'},
      '/setting/all-work-type': {screen: 'AllWorkTypeListScreen'},
      '/setting/work-sub-type': {screen: 'WorkSubTypeListScreen'},
      '/setting/work-category': {screen: 'WorkCategoryListScreen'},
      '/setting/budget/all-budget': {screen: 'BudgetListScreen'},
      '/setting/super-budget/all': {screen: 'SuperBudgetListScreen'},
      '/setting/super-budget/area-manager/all': {
        screen: 'AreaManagerSuperBudgetSettingScreen',
      },
      '/setting/super-budget/regional-office/all': {
        screen: 'RegionalOfficeSuperBudgetSettingScreen',
      },
      '/MyProfile': {
        screen: 'ProfileScreen',
      },
      '/Tutorials': {
        screen: 'TutorialTopTab',
      },
      '/AllRoles': {
        screen: 'AllRolesScreen',
        title: 'All Roles',
      },
      '/setting/budget/all-setting': {screen: 'BudgetSettingScreen'},
      '/setting/super-budget/all': {screen: 'SuperBudgetSettingScreen'},
      '/asset/allocation': {screen: 'AssetAllocationTopTab'},
      '/asset/approved/all': {screen: 'ApprovedAssetAllocationListScreen'},
      '/asset/rejected/all': {screen: 'RejectedAssetAllocationListScreen'},
      '/asset/reallocate/all': {screen: 'ReallocateAssetListScreen'},
      '/asset/return/all': {screen: 'ReturnAssetListScreen'},
      '/asset/request': {screen: 'AssetRequestListScreen'},
      '/work-inspection': {screen: 'WorkInspectionTopTab'},
      '/attendance-mapping': {screen: 'AttendanceMappingTopTab'},
      '/attendance/facial-recognition': {screen: 'FacialRecognitionTab'},
      '/attendance/facial-recognition-site': {
        screen: 'FacialRecognitionTopTab',
      },
      '/PlanPricing': {screen: 'PlanPricingListScreen'},
      '/ContractorsMasterdata': {screen: 'AllContractorList'},
      '/set-approval': {screen: 'SetApprovalComplaints'},
    };

    const destination = navigationMap[path];

    if (destination) {
      dispatch(setActiveTab(path));
      navigation.navigate(destination.screen, {
        title: destination.title,
        type: destination.type,
      });
    } else {
      navigation.navigate('NotFoundScreen');
    }
  };

  const submoduleRender2 = item => {
    return (
      <TouchableOpacity
        disabled={item?.status === 0}
        onPress={() => navigationFunctionWithPath(item?.path, item?.title)}>
        <Neomorph
          darkShadowColor={Colors().darkShadow} // <- set this
          lightShadowColor={Colors().lightShadow} // <- this
          style={{
            marginTop: 0,
            margin: 7,
            shadowRadius: 5,
            shadowOpacity: 0.8,
            borderRadius: 5,
            backgroundColor: Colors().cardBackground,
            width: WINDOW_WIDTH * 0.25,
            height: WINDOW_WIDTH * 0.25,
          }}>
          <View
            style={{
              height: '70%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={
                item?.icon
                  ? {
                      uri: `${apiBaseUrl}${item?.icon}`,
                    }
                  : Images.DEFAULT
              }
              style={{height: 60, width: 60}}
            />
          </View>
          <Text
            numberOfLines={2}
            style={[
              styles.textStyle,
              {
                color: Colors().pureBlack,
                maxWidth: '100%',
                alignSelf: 'center',
              },
            ]}>
            {' '}
            {item?.title}
          </Text>
        </Neomorph>
      </TouchableOpacity>
    );
  };

  const submoduleRender = item => {
    return (
      <View>
        {item?.modulesOfSubModule?.length <= 0 && (
          <TouchableOpacity
            onPress={() => {
              navigationFunctionWithPath(item?.path, item?.title);
            }}>
            <Neomorph
              darkShadowColor={Colors().darkShadow} // <- set this
              lightShadowColor={Colors().lightShadow} // <- this
              style={{
                marginTop: 5,
                margin: 7,
                shadowRadius: 5,
                shadowOpacity: 0.8,
                borderRadius: 5,
                backgroundColor: Colors().cardBackground,
                width: WINDOW_WIDTH * 0.275,
                height: WINDOW_WIDTH * 0.275,
              }}>
              <View
                style={{
                  height: '70%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={
                    item?.icon
                      ? {
                          uri: `${apiBaseUrl}${item?.icon}`,
                        }
                      : Images.DEFAULT
                  }
                  style={{height: 60, width: 60}}
                />
              </View>
              <Text
                numberOfLines={2}
                style={[
                  styles.textStyle,
                  {
                    color: Colors().pureBlack,
                    maxWidth: '100%',
                    alignSelf: 'center',
                  },
                ]}>
                {item?.title}
              </Text>
            </Neomorph>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={headerTitle} />
      <ScrollView style={{}}>
        {subModuleDetailData?.length >= 0 && (
          <FlatList
            data={subModuleDetailData}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              margin: 10,
              padding: 5,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            renderItem={item => submoduleRender(item?.item)}
          />
        )}

        {subModuleDetailData?.map((item, index) =>
          item?.modulesOfSubModule?.length > 0 ? (
            <View style={{marginBottom: 5}}>
              <ChartCard
                key={index}
                headerName={`${item?.title} ${moduleLabel.MANAGEMENT}`}
                data={[
                  {
                    component: (
                      <FlatList
                        data={item?.modulesOfSubModule}
                        keyExtractor={item => item.id}
                        scrollEnabled={true}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          padding: 5,
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                        renderItem={item => submoduleRender2(item?.item)}
                      />
                    ),
                  },
                ]}
              />
            </View>
          ) : null,
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubModuleScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 0.5,
    shadowRadius: 0,
    borderRadius: 8,
    width: 109,
    height: 109,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  headinText: {
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: WINDOW_WIDTH * 0.05,
  },
});

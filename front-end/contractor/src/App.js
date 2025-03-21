import React, { useEffect, Suspense, lazy, useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/customizer.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { PublicRoutes, RequireAuth } from "./components/AuthChecker";
import { socket } from "./context/sockets";
import { useSelector } from "react-redux";
import { selectUser } from "./features/auth/authSlice";

import Index from "./pages/ItemMaster";
import AssetManagement from "./pages/AssetManagement/AssetManagementIndex";
import CompanyTeam from "./pages/EnergyCompany/CompanyTeam";
import WorkImagesIndex from "./pages/WorkImages/WorkImagesIndex";
import CreateStockTransfer from "./pages/StockTransfer/CreateStockTransfer";
import ViewStockTransactions from "./pages/StockRequest/ViewStockTransactions";
import { ViewStockPunchRequest } from "./pages/StockPunchManagement/ViewStockPunchRequest";
import ApproveExpenseRequest from "./pages/ExpenseManagement/ApproveExpenseRequest";
import ApproveStockPunchRequest from "./pages/StockPunchManagement/ApproveStockPunch";
import { ViewExpenseRequest } from "./pages/ExpenseManagement/ViewExpenseRequest";
import OutletIndex from "./pages/Outlet/OutletIndex";
import SurveyIndex from "./pages/Survey";
import ViewAssignedSurvey from "./pages/Survey/CreateResponse";
import TaskIndex from "./pages/TaskManager/TaskIndex";
import ReportsIndex from "./pages/Reports/ReportsIndex";
import ViewResponseSurvey1 from "./pages/Survey/ViewResponseSurvey1";
// import CreateReports from "./pages/Reports/CreateReports";

// import ViewExpenseRequest from "./pages/ExpenseManagement/ViewExpenseRequest";

const Home = lazy(() => import("./pages/Home"));
const MyCompanies = lazy(() =>
  import("./pages/Companies/MyCompanies/MyCompanies")
);
const AllCompanies = lazy(() => import("./pages/Companies/AllCompanies"));
const AddAllCompanies = lazy(() => import("./pages/Companies/AddAllCompanies"));
const AllCompanyImport = lazy(() =>
  import("./pages/Companies/AllCompaniesImport")
);
const ComplaintImport = lazy(() =>
  import("./pages/Complaints/ComplaintImport")
);
const AddMyCompany = lazy(() =>
  import("./pages/Companies/MyCompanies/AddMyCompany")
);
const ViewAllCompanies = lazy(() =>
  import("./pages/Companies/ViewAllCompanies")
);
const ViewCompany = lazy(() => import("./pages/Companies/ViewCompany"));

const SaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/SaleCompanies")
);
const AddSaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/AddSaleCompanies")
);
const CompanyManagement = lazy(() => import("./pages/Companies"));
const OilAndGas = lazy(() => import("./pages/EnergyCompany"));
const Complaints = lazy(() => import("./pages/Complaints/index"));
const ViewExpenseManagement = lazy(() =>
  import("./pages/ExpenseManagement/index")
);
const ViewStockManagement = lazy(() => import("./pages/StockRequest/index"));
const ViewStockPunchManagement = lazy(() =>
  import("./pages/StockPunchManagement/index")
);
const BillingManagement = lazy(() => import("./pages/BillingManagement/index"));
const ViewOfficeInspection = lazy(() =>
  import("./pages/OfficeInspectionNew/index")
);
const ViewSiteInspection = lazy(() =>
  import("./pages/SiteInspectionNew/index")
);
const FuelStation = lazy(() => import("./pages/Outlet/index"));
const PurchaseSale = lazy(() => import("./pages/PurchaseOrder/index"));
const ProductManagement = lazy(() => import("./pages/ProductService/index"));
const AssetsManagement = lazy(() => import("./pages/AssetManagement/index"));
const PurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/PurchaseCompanies")
);
const AddPurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/AddPurchaseCompanies")
);
const NoPage = lazy(() => import("./pages/Authentication/NoPage"));
const NotAllowed = lazy(() => import("./pages/Authentication/NotAllowed"));
const Layout = lazy(() => import("./components/Layout"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SuggestionsFeedbacks = lazy(() => import("./pages/SuggestionsFeedbacks"));
const FeedbackSuggestion = lazy(() =>
  import("./pages/Feedback&Suggestion/FeedbackSuggestion")
);
const AllFeedbackSuggestion = lazy(() =>
  import("./pages/Feedback&Suggestion/AllFeedbackSuggestion")
);
const ViewFeedbackSuggestion = lazy(() =>
  import("./pages/Feedback&Suggestion/ViewFeedbackSuggestion")
);
const Response = lazy(() => import("./pages/Feedback&Suggestion/Response"));
const SignIn = lazy(() => import("./pages/Authentication/SignIn"));
const AllNotifications = lazy(() => import("./pages/AllNotifications"));
const Analytics = lazy(() => import("./pages/Analytics"));
const MasterDataManagement = lazy(() => import("./pages/MasterDataManagement"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const CreateTutorial = lazy(() => import("./pages/CreateTutorial"));
const PlanPricing = lazy(() => import("./pages/PlanPricing"));
const OrderVia = lazy(() => import("./pages/Complaints/OrderVia/OrderVia"));

const PendingExpense = lazy(() =>
  import("./pages/OfficeInspectionNew/OfficeInspectionStock/PendingExpense")
);
const EmployeeHistory = lazy(() =>
  import("./pages/OfficeInspectionNew/EmployeeHistory/EmployeeHistory")
);
const ViewOfficeExpense = lazy(() =>
  import("./pages/OfficeInspectionNew/OfficeInspectionStock/ViewOfficeExpense")
);

const ViewOfficeFund = lazy(() =>
  import("./pages/OfficeInspectionNew/OfficeInspectionFund/ViewOfficeFund")
);

const ApproveOfficeExpense = lazy(() =>
  import(
    "./pages/OfficeInspectionNew/OfficeInspectionStock/ApproveOfficeExpense"
  )
);

const ApproveOfficeFund = lazy(() =>
  import("./pages/OfficeInspectionNew/OfficeInspectionFund/ApproveOfficeFund")
);

const PendingFundInspection = lazy(() =>
  import("./pages/OfficeInspectionNew/OfficeInspectionFund/PendingFund")
);

const OutletHistory = lazy(() =>
  import("./pages/SiteInspectionNew/OutletHistory/OutletHistory")
);
const SiteExpenseInspection = lazy(() =>
  import("./pages/SiteInspectionNew/StockInspection/PendingExpense")
);

const AllMessages = lazy(() => import("./pages/Messages/AllMessages"));
const AddMessagesUser = lazy(() => import("./pages/Messages/AddMessagesUser"));

const SiteFundInspection = lazy(() =>
  import("./pages/SiteInspectionNew/FundInspection/PendingFund")
);

const ApproveSiteExpenseInspection = lazy(() =>
  import("./pages/SiteInspectionNew/StockInspection/ApproveSiteInspection")
);

const ApproveFund = lazy(() =>
  import("./pages/SiteInspectionNew/FundInspection/ApproveFundInSite")
);

const AssignEmployee = lazy(() =>
  import("./pages/SiteInspectionNew/StockInspection/AssignEmployee")
);

const ViewSiteExpenseInspection = lazy(() =>
  import("./pages/SiteInspectionNew/StockInspection/ViewSiteExpense")
);

const ViewFundDetails = lazy(() =>
  import("./pages/SiteInspectionNew/FundInspection/ViewFundDetails")
);

const AssignSiteInspection = lazy(() =>
  import("./pages/SiteInspectionNew/StockInspection/AssignSiteInspection")
);

const AssignSiteInspectionFund = lazy(() =>
  import("./pages/SiteInspectionNew/FundInspection/AssignSiteInspectionFund")
);
const CreateOrderVia = lazy(() =>
  import("./pages/Complaints/OrderVia/CreateOrderVia")
);

const ViewStockPunchTransfer = lazy(() =>
  import("./pages/StockPunchManagement/ViewStockPunchTransfer")
);

const CreateComplaint = lazy(() =>
  import("./pages/Complaints/CreateComplaint")
);
const RequestsComplaint = lazy(() =>
  import("./pages/Complaints/RequestsComplaint")
);
const ViewRequestsComplaint = lazy(() =>
  import("./pages/Complaints/ViewRequestsComplaint")
);
const Allocate = lazy(() => import("./pages/Complaints/Allocate"));

// StockManagement
const StockManagement = lazy(() =>
  import("./pages/StockRequest/StockManagement")
);
const StockTransfer = lazy(() => import("./pages/StockRequest/StockTransfer"));
const StockCategory = lazy(() => import("./pages/StockRequest/StockCategory"));
const StockBalanceOverview = lazy(() =>
  import("./pages/StockRequest/StockBalanceOverview")
);
const StockRequest = lazy(() => import("./pages/StockRequest/StockRequest"));
const CreateStockRequest = lazy(() =>
  import("./pages/StockRequest/CreateStockRequest")
);

// StockPunchManagement
const StockPunch = lazy(() =>
  import("./pages/StockPunchManagement/StockPunch")
);
const CreateStockPunch = lazy(() =>
  import("./pages/Complaints/CreateStockPunch")
);
const StockPunchManagement = lazy(() =>
  import("./pages/StockPunchManagement/StockPunchManagement")
);
const StockPunchRequest = lazy(() =>
  import("./pages/StockPunchManagement/StockPunchRequest")
);
const StockPunchTransfer = lazy(() =>
  import("./pages/StockPunchManagement/StockPunchTransfer")
);

const CreateStockPunchRequest = lazy(() =>
  import("./pages/StockPunchManagement/CreateStockPunch")
);

const AllStockTransferPunch = lazy(() =>
  import("./pages/StockPunchManagement/AllStockTransferPunch")
);

const StockPunchBalanceOverview = lazy(() =>
  import("./pages/StockPunchManagement/StockPunchBalanceOverview")
);

const ViewStockTransaction = lazy(() =>
  import("./pages/StockPunchManagement/ViewStockTransaction")
);

const ExpenseManagement = lazy(() =>
  import("./pages/ExpenseManagement/ExpenseManagement")
);
const ExpenseRequest = lazy(() =>
  import("./pages/ExpenseManagement/ExpenseRequest")
);
const ExpensePunch = lazy(() =>
  import("./pages/ExpenseManagement/ExpensePunch")
);
const ExpenseTransfer = lazy(() =>
  import("./pages/ExpenseManagement/ExpenseTransfer")
);
const ExpenseBalanceOverview = lazy(() =>
  import("./pages/ExpenseManagement/ExpenseBalanceOverview")
);
const ViewExpenseTransaction = lazy(() =>
  import("./pages/ExpenseManagement/ViewExpenseTransaction")
);
const CreateExpensePunch = lazy(() =>
  import("./pages/ExpenseManagement/CreateExpensePunch")
);
const ApprovedComplaints = lazy(() =>
  import("./pages/Complaints/ApprovedComplaints")
);
const RejectedComplaints = lazy(() =>
  import("./pages/Complaints/RejectedComplaints")
);
const ResolvedComplaints = lazy(() =>
  import("./pages/Complaints/ResolvedComplaints")
);
const AllComplaints = lazy(() => import("./pages/Complaints/AllComplaints"));
const CreateAllocate = lazy(() => import("./pages/Complaints/CreateAllocate"));
const HoldComplaints = lazy(() => import("./pages/Complaints/HoldComplaints"));
const UpdateAllocate = lazy(() => import("./pages/Complaints/UpdateAllocate"));

// WorkQuotations
const ApprovedWorkQuotation = lazy(() =>
  import("./pages/WorkQuotations/ApprovedWorkQuotation")
);
const RejectedWorkQuotation = lazy(() =>
  import("./pages/WorkQuotations/RejectedWorkQuotation")
);

const RequestedWorkQuotations = lazy(() =>
  import("./pages/WorkQuotations/RequestedWorkQuotations")
);
const WorkQuotation = lazy(() =>
  import("./pages/WorkQuotations/WorkQuotations")
);
const WorkQuotations = lazy(() => import("./pages/WorkQuotations/index"));
const CreateQuotation = lazy(() =>
  import("./pages/WorkQuotations/CreateQuotation")
);
const SendWorkQuotationByEmail = lazy(() =>
  import("./pages/WorkQuotations/SendWorkQuotationByEmail")
);
const PoViewDetails = lazy(() => import("./pages/PurchaseOrder/PoViewDetails"));
const ViewSalesOrder = lazy(() =>
  import("./pages/SalesOrderNew/ViewSalesOrder")
);
const SaleOrder = lazy(() => import("./pages/SalesOrderNew/SalesOrder"));
const PurchaseOrder = lazy(() => import("./pages/PurchaseOrder/PurchaseOrder"));
const CreateSecurityDeposit = lazy(() =>
  import("./pages/PurchaseOrder/CreateSecurityDeposit")
);
const ViewSecurityDeposit = lazy(() =>
  import("./pages/PurchaseOrder/ViewSecurityDeposit")
);
const ViewSalesSecurityDeposit = lazy(() =>
  import("./pages/SalesOrderNew/ViewSecurityDeposit")
);
const ApproveSecurityRefund = lazy(() =>
  import("./pages/PurchaseOrder/ApproveSecurityRefund")
);
const ApproveSecurityRefundInSo = lazy(() =>
  import("./pages/SalesOrderNew/ApproveSecurityRefundInSo")
);
const SecurityEligible = lazy(() =>
  import("./pages/PurchaseOrder/SecurityEligible")
);
const CreateBillingType = lazy(() =>
  import("./pages/PurchaseOrder/CreateBillingType")
);
const CreatePurchaseOrder = lazy(() =>
  import("./pages/PurchaseOrder/CreatePurchaseOrder")
);

const CreateSalesOrder = lazy(() =>
  import("./pages/SalesOrderNew/CreateSalesOrder")
);
// const BillingType = lazy(() => import("./pages/Billings/BillingType"));
const Taxes = lazy(() => import("./pages/Billings/Taxes"));
const CreateTaxes = lazy(() => import("./pages/Billings/CreateTaxes"));
const FinancialYear = lazy(() => import("./pages/Billings/FinancialYear"));
const CreateFinancialYear = lazy(() =>
  import("./pages/Billings/CreateFinancialYear")
);
const CreateMeasurement = lazy(() =>
  import("./pages/Billings/CreateMeasurement")
);
const ViewMeasurement = lazy(() => import("./pages/Billings/ViewMeasurement"));
const EditMeasurements = lazy(() => import("./pages/Billings/Measurements"));
const Measurements = lazy(() =>
  import("./pages/BillingManagement/AllComplaints")
);

const HardCopyAttachment = lazy(() =>
  import("./pages/BillingManagement/HardCopyAttachment")
);

const ViewMeasurementDetails = lazy(() =>
  import("./pages/BillingManagement/ViewMeasurementDetails")
);

const ViewTimeLine = lazy(() =>
  import("./pages/BillingManagement/ViewTimeLine")
);

const ChangePoNumber = lazy(() =>
  import("./pages/BillingManagement/ChangePoInMeasurement")
);

const ViewPTM = lazy(() => import("./pages/BillingManagement/ViewPTM"));
const ViewFinalExpenseDetails = lazy(() =>
  import("./pages/BillingManagement/ViewExpenseDetails")
);

const ViewDiscardDetails = lazy(() =>
  import("./pages/BillingManagement/ViewDiscardsDetails")
);

// const MergetoInvoice = lazy(() => import("./pages/Billings/MergetoInvoice"));
const MergetoInvoice = lazy(() =>
  import("./pages/Billings/MergeToInvoice/AllInvoices")
);
const ViewMergeInvoice = lazy(() =>
  import("./pages/Billings/MergeToInvoice/ViewMergedInvoice")
);
const ViewFinalMergeToPI = lazy(() =>
  import("./pages/Billings/MergeToPI/ViewFinalMergePi")
);

const PiToMerge = lazy(() => import("./pages/Billings/PiToMerge"));
const Merge = lazy(() => import("./pages/Billings/Merge"));
const MergedPi = lazy(() => import("./pages/Billings/MergeToPI/MergedPi"));
const Payments = lazy(() => import("./pages/Billings/Payments"));
const PaymentPaidIndex = lazy(() =>
  import("./pages/Billings/PaymentPaid/PaymentPaidIndex")
);
const ItemMasterIndex = lazy(() =>
  import("./pages/ItemMaster/ItemMasterIndex")
);

const AreaManager = lazy(() => import("./pages/PaidInvoices/AreaManager"));
const ViewAllManager = lazy(() =>
  import("./pages/PaidInvoices/AreaManager/ViewAllManager")
);

const RegionalOffice = lazy(() =>
  import("./pages/PaidInvoices/RegionalOffice")
);
const ViewROTransations = lazy(() =>
  import("./pages/PaidInvoices/RegionalOffice/ViewROTransations")
);
const ViewRegionalofficeDetails = lazy(() =>
  import("./pages/PaidInvoices/RegionalOffice/ViewRegionalofficeDetails")
);
const ViewPOTransactions = lazy(() =>
  import("./pages/PaidInvoices/RegionalOffice/ViewPOTransactions")
);

const ImportFile = lazy(() => import("./pages/ImportExcelFile"));
const ExportFile = lazy(() => import("./utils/ExportExcelFile"));

const PaidInvoiceSetting = lazy(() => import("./pages/PaidInvoices/Setting"));
const CreatePromotion = lazy(() =>
  import("./pages/PaidInvoices/Setting/CreatePromotion")
);
const CreateAreaManagerRatio = lazy(() =>
  import("./pages/PaidInvoices/Setting/CreateAreaManagerRatio")
);
const AreaManagerRatioOverview = lazy(() =>
  import("./pages/PaidInvoices/Setting/AreaManagerRatioOverview")
);
const PromotionOverview = lazy(() =>
  import("./pages/PaidInvoices/Setting/PromotionOverview")
);
const CreateNewPayments = lazy(() =>
  import("./components/ModalContent/CreateNewPayments")
);

const PaymentIndex = lazy(() =>
  import("./pages/Billings/PaymentModule/PaymentIndex")
);
const PerformaInvoice = lazy(() => import("./pages/Billings/PerformaInvoice"));
const CreatePerformaInvoice = lazy(() =>
  import("./pages/Billings/CreatePerformaInvoice")
);

const AllReadyToPI = lazy(() =>
  import("./pages/BillingManagement/Performa Invoice/AllReadyToPi")
);
const ViewPerforma = lazy(() =>
  import("./pages/BillingManagement/Performa Invoice/ViewPerforma")
);
// const Invoice = lazy(() => import("./pages/Billings/Invoice"));
const AllFinalPerformaInvoices = lazy(() =>
  import("./pages/Billings/Invoices/AllFinalPI")
);

const ViewInvoiceDetails = lazy(() =>
  import("./pages/Billings/Invoices/ViewInvoiceDetails")
);
// const CreateInvoice = lazy(() => import("./pages/Billings/CreateInvoice"));
const CreateInvoice = lazy(() =>
  import("./pages/Billings/Invoices/CreateInvoice")
);
// const Retention = lazy(() => import("./pages/Billings/Retention"));
const Retention = lazy(() =>
  import("./pages/Billings/RetentionMoney/AllPaidBills")
);

const ApproveRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/ApproveRetentionMoney")
);
const CreateRetention = lazy(() =>
  import("./components/ModalContent/CreateRetention")
);

const CreateRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/CreateRetentionMoney")
);

const ViewRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/ViewRetentionMoney")
);
const ProductCategory = lazy(() =>
  import("./pages/ProductService/ProductCategory")
);
const CreateProductCategory = lazy(() =>
  import("./pages/ProductService/CreateProductCategory")
);
const UnitData = lazy(() => import("./pages/ProductService/UnitData"));
const CreateUnitData = lazy(() =>
  import("./pages/ProductService/CreateUnitData")
);
const AddProducts = lazy(() => import("./pages/ProductService/AddProducts"));
const ProductService = lazy(() =>
  import("./pages/ProductService/ProductService")
);

// survey
const AllSurvey = lazy(() => import("./pages/Survey/AllSurvey"));
const PurposeMaster = lazy(() => import("./pages/Survey/PurposeMaster"));
const CreatePurposeMaster = lazy(() =>
  import("./pages/Survey/CreatePurposeMaster")
);
const ImportItems = lazy(() => import("./pages/ItemMaster/ImportItems"));
const SurveyItemMaster = lazy(() => import("./pages/Survey/SurveyItemMaster"));
const CreateSurveyItemMaster = lazy(() =>
  import("./pages/Survey/CreateSurveyItemMaster")
);
const RejectedSurvey = lazy(() => import("./pages/Survey/RejectedSurvey"));
const CreateSurvey = lazy(() => import("./pages/Survey/CreateSurvey"));
// const ViewSurvey = lazy(() => import("./pages/Survey/ViewSurvey"));
const ResponseSurvey = lazy(() => import("./pages/Survey/ResponseSurvey"));
const ViewResponseSurvey = lazy(() =>
  import("./pages/Survey/ViewResponseSurvey")
);
const AssignedSurvey = lazy(() => import("./pages/Survey/AssignedSurvey"));
const ApprovedSurvey = lazy(() => import("./pages/Survey/ApprovedSurvey"));
const RequestSurvey = lazy(() => import("./pages/Survey/RequestSurvey"));

const CreateTask = lazy(() => import("./pages/TaskManager/CreateTask"));
const CreateTaskCategory = lazy(() =>
  import("./pages/TaskManager/CreateTaskCategory")
);

const CreateReports = lazy(() => import("./pages/Reports/CreateReports"));

const CreateEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/CreateEarthingTesting")
);
const ViewEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/ViewEarthingTesting")
);
const RejectedEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/RejectedEarthingTesting")
);
const RequestedEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/RequestedEarthingTesting")
);
const ApprovedEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/ApprovedEarthingTesting")
);
const ReportEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/ReportEarthingTesting")
);
const AllocateEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/AllocateEarthingTesting")
);
const EarthingTesting = lazy(() => import("./pages/EarthingTesting"));

const OfficeSiteStocks = lazy(() =>
  import("./pages/OfficeInspection/SiteStocks")
);
const OfficeExpense = lazy(() =>
  import("./pages/OfficeInspection/expense/OfficeExpense")
);
const FoodExpensePunch = lazy(() =>
  import("./pages/OfficeInspection/expense/FoodExpensePunch")
);
const OfficeComplaintsOnOutlet = lazy(() =>
  import("./pages/OfficeInspection/expense/OfficeComplaintsOnOutlet")
);
const OfficeExpensePendingComplaints = lazy(() =>
  import("./pages/OfficeInspection/expense/OfficeExpensePendingComplaints")
);
const ComplaintsOnOutlet = lazy(() =>
  import("./pages/OfficeInspection/ComplaintsOnOutlet")
);
const PendingComplaints = lazy(() =>
  import("./pages/OfficeInspection/PendingComplaints")
);
const ViewPendingComplaints = lazy(() =>
  import("./pages/OfficeInspection/ViewPendingComplaints")
);
const SiteExpense = lazy(() => import("./pages/SiteInspection/SiteExpense"));
const SiteStocks = lazy(() => import("./pages/SiteInspection/SiteStocks"));
// Outlet
const RequestOutlet = lazy(() => import("./pages/Outlet/RequestOutlet"));
const ApprovedOutlet = lazy(() => import("./pages/Outlet/ApprovedOutlet"));
const RejectedOutlet = lazy(() => import("./pages/Outlet/RejectedOutlet"));
const CreateOutlet = lazy(() => import("./pages/Outlet/CreateOutlet"));
const DealerOutlet = lazy(() => import("./pages/Outlet/DealerOutlet"));
const AllOutletOverview = lazy(() =>
  import("./pages/Outlet/AllOutletOverview")
);

// WorkImages
const WorkImages = lazy(() => import("./pages/WorkImages/WorkImages"));
const RequestWorkImage = lazy(() =>
  import("./pages/WorkImages/RequestWorkImage")
);
const ApprovedWorkImage = lazy(() =>
  import("./pages/WorkImages/ApprovedWorkImage")
);
const RejectedWorkImage = lazy(() =>
  import("./pages/WorkImages/RejectedWorkImage")
);
const CreateWorkImages = lazy(() =>
  import("./pages/WorkImages/CreateWorkImages")
);

const CreateSales = lazy(() =>
  import("./pages/PurchaseOrder/SaleOrder/CreateSales")
);
const ItemMaster = lazy(() => import("./pages/ItemMaster"));
const AddItemMaster = lazy(() =>
  import("./components/ModalContent/AddItemMaster")
);
const AddBrandName = lazy(() => import("./pages/ItemMaster/AddBrandName"));
const CreateSubCategory = lazy(() =>
  import("./pages/ItemMaster/CreateSubCategory")
);
const Stock = lazy(() => import("./pages/Stocks/Stock"));
// const StockTransfer = lazy(() => import("./pages/Stocks/StockTransfer"));
const ViewStock = lazy(() => import("./pages/Stocks/ViewStock"));
const AddStock = lazy(() => import("./components/ModalContent/AddStock"));
const Vendor = lazy(() => import("./pages/Vendor"));

// Suppliers
const Suppliers = lazy(() => import("./pages/Suppliers/index"));
const CreateSupplier = lazy(() => import("./pages/Suppliers/CreateSupplier"));
const ImportSuppliers = lazy(() => import("./pages/Suppliers/ImportSuppliers"));
const RequestSupplier = lazy(() => import("./pages/Suppliers/RequestSupplier"));
const ApprovedSupplier = lazy(() =>
  import("./pages/Suppliers/ApprovedSupplier")
);
const RejectedSupplier = lazy(() =>
  import("./pages/Suppliers/RejectedSupplier")
);
const AllSuppliersOverview = lazy(() =>
  import("./pages/Suppliers/AllSuppliersOverview")
);

const AllAssets = lazy(() => import("./pages/AssetManagement/AllAssets"));
const CreateAssets = lazy(() => import("./pages/AssetManagement/CreateAssets"));
const IdleAssets = lazy(() => import("./pages/AssetManagement/IdleAssets"));
const AssetsRepairRequire = lazy(() =>
  import("./pages/AssetManagement/AssetsRepairRequire")
);
const AssignedAssets = lazy(() =>
  import("./pages/AssetManagement/AssignedAssets")
);
const IndividualAssetProfile = lazy(() =>
  import("./pages/AssetManagement/IndividualAssetProfile")
);
const AssetTimeline = lazy(() =>
  import("./pages/AssetManagement/AssetTimeline")
);
const TimelineAssignedAssets = lazy(() =>
  import("./pages/AssetManagement/TimelineAssignedAssets")
);

const ContactsIndex = lazy(() =>
  import("./pages/ContactManagement/ContactsIndex")
);
const Contacts = lazy(() => import("./pages/ContactManagement/index"));
const CreateContacts = lazy(() => import("./pages/Contacts/CreateContacts"));
const Documents = lazy(() => import("./pages/Documents"));
const DocumentCategoryView = lazy(() =>
  import("./pages/Documents/DocumentCategoryView")
);
const DocumentCategory = lazy(() =>
  import("./pages/Documents/DocumentCategory")
);
const CreateDocumentCategory = lazy(() =>
  import("./pages/Documents/CreateDocumentCategory")
);
const AddDocument = lazy(() => import("./pages/Documents/AddDocument"));
const Communication = lazy(() => import("./pages/Communication"));
const Reports = lazy(() => import("./pages/Reports"));
const EnergyCompanyTeam = lazy(() => import("./pages/EnergyCompanyTeam"));
const CreateTeam = lazy(() => import("./pages/EnergyCompany/CreateTeam"));
const SendMessages = lazy(() =>
  import("./pages/ContactManagement/SendMessages")
);
const TaskDashboard = lazy(() => import("./pages/TaskManager/TaskDashboard"));
const TaskCategory = lazy(() => import("./pages/TaskManager/TaskCategory"));
const TaskView = lazy(() => import("./pages/TaskManager/TaskView"));
const AllTask = lazy(() => import("./pages/TaskManager/AllTask"));
const OutletManagement = lazy(() => import("./pages/OutletManagement"));
const CreateOutletManagement = lazy(() =>
  import("./components/ModalContent/CreateOutletManagement")
);
const DesignationPermissions = lazy(() =>
  import("./pages/HRManagement/DesignationPermissions")
);
// const AllRoles = lazy(() => import('./pages/AllRoles'))
const Teams = lazy(() => import("./pages/HRManagement/Teams/Teams"));
const CreateTeams = lazy(() =>
  import("./pages/HRManagement/Teams/CreateTeams")
);
const ViewTeamLevelWise = lazy(() =>
  import("./pages/HRManagement/Teams/ViewTeamLevelWise")
);
const HrTeamMembers = lazy(() => import("./pages/HRManagement/HrTeamMembers"));
const TeamMemberForm = lazy(() =>
  import("./pages/HRManagement/TeamMemberForm")
);
const Employees = lazy(() => import("./pages/HRManagement/Employees"));
const AddEmployee = lazy(() => import("./components/ModalContent/AddEmployee"));
const ViewEmployee = lazy(() =>
  import("./pages/HRManagement/ViewEmployee/ViewEmployee")
);
const Attendance = lazy(() => import("./pages/HRManagement/Attendance"));
const CreateAttendance = lazy(() =>
  import("./pages/HRManagement/Attendance/CreateAttendance")
);
const UserAttendance = lazy(() =>
  import("./pages/HRManagement/ViewTimeCardsAttendance/UserAttendance")
);
const Leaves = lazy(() => import("./pages/HRManagement/Leaves/Leaves"));
const ViewLeave = lazy(() => import("./pages/HRManagement/Leaves/ViewLeave"));
const CreateLeave = lazy(() =>
  import("./pages/HRManagement/Leaves/CreateLeave")
);
const LeavesType = lazy(() => import("./pages/HRManagement/Leaves/LeavesType"));
const CreateLeavesType = lazy(() =>
  import("./pages/HRManagement/Leaves/CreateLeavesType")
);
const ViewEmployeeLeave = lazy(() =>
  import("./pages/HRManagement/ViewEmployee/ViewEmployeeLeave")
);
const Payroll = lazy(() => import("./pages/HRManagement/Payroll"));
const PayrollMaster = lazy(() =>
  import("./pages/HRManagement/Payroll/PayrollMaster")
);
const CreatePayroll = lazy(() =>
  import("./pages/HRManagement/Payroll/CreatePayroll")
);
const TimeSheet = lazy(() => import("./pages/HRManagement/Payroll/TimeSheet"));
const InsuranceCompany = lazy(() =>
  import("./pages/HRManagement/Payroll/InsuranceCompany")
);
const InsuranceCompanyPlans = lazy(() =>
  import("./pages/HRManagement/Payroll/InsuranceCompanyPlans")
);
const GroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/GroupInsurance")
);
const AddGroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/AddGroupInsurance")
);
const ViewGroupInsurance = lazy(() =>
  import("./pages/HRManagement/Payroll/ViewGroupInsurance")
);
const SalaryDisbursal = lazy(() =>
  import("./pages/HRManagement/Payroll/SalaryDisbursal")
);
const ViewSalaryDisbursal = lazy(() =>
  import("./pages/HRManagement/Payroll/ViewSalaryDisbursal")
);
const PaySlip = lazy(() =>
  import("./pages/HRManagement/Payroll/PaySlip/PaySlip")
);
const ViewPaySlipDetails = lazy(() =>
  import("./pages/HRManagement/Payroll/PaySlip/ViewPaySlipDetails")
);
const ViewPaySlip = lazy(() => import("./components/ModalContent/ViewPaySlip"));
const Loan = lazy(() => import("./pages/HRManagement/Payroll/Loan"));
const ViewLoan = lazy(() => import("./pages/HRManagement/Payroll/ViewLoan"));
const CreateLoan = lazy(() =>
  import("./pages/HRManagement/Payroll/CreateLoan")
);
const EmployeePromotionDemotion = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeePromotionDemotion/EmployeePromotionDemotion"
  )
);
const AddEmployeePromotionDemotion = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeePromotionDemotion/AddEmployeePromotionDemotion"
  )
);
const ViewEmployeePromotionDemotion = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeePromotionDemotion/ViewEmployeePromotionDemotion"
  )
);
const EmployeeResignation = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeResignation")
);
const CreateEmployeeResignation = lazy(() =>
  import("./pages/HRManagement/Payroll/CreateEmployeeResignation")
);
const ViewEmployeeResignation = lazy(() =>
  import("./pages/HRManagement/Payroll/ViewEmployeeResignation")
);
const EmployeeRetirement = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeRetirement/EmployeeRetirement")
);
const AddEmployeeRetirement = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeeRetirement/AddEmployeeRetirement"
  )
);
const ViewEmployeeRetirement = lazy(() =>
  import(
    "./pages/HRManagement/Payroll/EmployeeRetirement/ViewEmployeeRetirement"
  )
);
const EmployeeTracking = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeTracking")
);
const EmployeeLogs = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeLogs")
);
const EmployeeActivity = lazy(() =>
  import("./pages/HRManagement/Payroll/EmployeeActivity")
);
const FundManagement = lazy(() => import("./pages/FundManagement"));
const AddFunds = lazy(() => import("./pages/FundManagement/AddFunds"));
const FundRequest = lazy(() =>
  import("./pages/FundManagement/FundRequest/FundRequest")
);
const FundTransfer = lazy(() =>
  import("./pages/FundManagement/fund-transfer/FundTransfer")
);
const CreateFundTransfer = lazy(() =>
  import("./pages/FundManagement/fund-transfer/CreateFundTransfer")
);
const CreateFundRequest = lazy(() =>
  import("./pages/FundManagement/FundRequest/CreateFundRequest")
);
const FundCategory = lazy(() =>
  import("./pages/FundManagement/FundRequest/FundCategory")
);
const FundBalanceOverview = lazy(() =>
  import("./pages/FundManagement/FundRequest/FundBalanceOverview")
);
const ViewFundTransactions = lazy(() =>
  import("./pages/FundManagement/ViewFundTransactions")
);
const RequestCash = lazy(() =>
  import("./pages/FundManagement/DailyCash/RequestCash")
);
const CreateRequestCash = lazy(() =>
  import("./pages/FundManagement/DailyCash/CreateRequestCash")
);
const ExpensesCash = lazy(() =>
  import("./pages/FundManagement/DailyCash/ExpensesCash/ExpensesCash")
);
const CreateExpensesCash = lazy(() =>
  import("./pages/FundManagement/DailyCash/ExpensesCash/CreateExpensesCash")
);
const ExpenseCategory = lazy(() =>
  import("./pages/FundManagement/DailyCash/ExpenseCategory/ExpenseCategory")
);
const CreateExpenseCategory = lazy(() =>
  import(
    "./pages/FundManagement/DailyCash/ExpenseCategory/CreateExpenseCategory"
  )
);
const ViewRequestExpenses = lazy(() =>
  import("./pages/FundManagement/DailyCash/ViewRequestExpenses")
);
const Balance = lazy(() => import("./pages/FundManagement/DailyCash/Balance"));
const CompanyItemStock = lazy(() =>
  import("./pages/FundManagement/SiteItemsGoods/CompanyItemStock")
);
const AssignItems = lazy(() =>
  import("./pages/FundManagement/SiteItemsGoods/AssignItems")
);
const RequestItems = lazy(() =>
  import("./pages/FundManagement/SiteItemsGoods/RequestItems")
);
const CreateRequestItems = lazy(() =>
  import("./pages/FundManagement/SiteItemsGoods/CreateRequestItems")
);
const EditDashboard = lazy(() => import("./pages/EditDashboard"));

// Master data manage
const BankManagement = lazy(() =>
  import("./pages/MasterDataManagement/BankManagement/BankManagement")
);
const CreateBankManagement = lazy(() =>
  import("./pages/MasterDataManagement/BankManagement/CreateBankManagement")
);
const AccountManagement = lazy(() =>
  import("./pages/MasterDataManagement/AccountManagement/AccountManagement")
);
const CreateAccountManagement = lazy(() =>
  import(
    "./pages/MasterDataManagement/AccountManagement/CreateAccountManagement"
  )
);
const MasterOutletManagement = lazy(() =>
  import("./pages/MasterDataManagement/MasterOutletManagement")
);
const MasterEnergyCompanyTeam = lazy(() =>
  import("./pages/MasterDataManagement/MasterEnergyCompanyTeam")
);
const MasterSupplierManagement = lazy(() =>
  import("./pages/MasterDataManagement/MasterSupplierManagement")
);
const MasterItemManagement = lazy(() =>
  import("./pages/MasterDataManagement/MasterItemManagement")
);

const AddWalletBalance = lazy(() =>
  import("./pages/MasterDataManagement/AddWalletBalance")
);
const TaxManagement = lazy(() =>
  import("./pages/MasterDataManagement/TaxManagement/TaxManagement")
);
const CreateTaxManagement = lazy(() =>
  import("./pages/MasterDataManagement/TaxManagement/CreateTaxManagement")
);
const BillNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/BillNoFormat/BillNoFormat")
);
const CreateBillNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/BillNoFormat/CreateBillNoFormat")
);

const EmployeeNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/EmployeeNoFormat/EmployeeNoFormat")
);
const CreateEmployeeNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/EmployeeNoFormat/CreateEmployeeNoFormat")
);
const ClientNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/ClientAndVendorNoFormat/ClientNoFormat")
);
const CreateClientNoFormat = lazy(() =>
  import(
    "./pages/MasterDataManagement/ClientAndVendorNoFormat/CreateClientNoFormat"
  )
);
const ItemNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/ItemNoFormat/ItemNoFormat")
);
const CreateItemNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/ItemNoFormat/CreateItemNoFormat")
);

const PaymentMethod = lazy(() =>
  import("./pages/MasterDataManagement/PaymentMethod/PaymentMethod")
);
const CreatePaymentMethod = lazy(() =>
  import("./pages/MasterDataManagement/PaymentMethod/CreatePaymentMethod")
);

const CodeTesting = lazy(() => import("./pages/CodeTesting"));

const App = () => {
  const { user } = useSelector(selectUser);
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  AOS.init();

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("body-bg"));
    const bg = `rgba(${selected?.r || 233},${selected?.g || 233},${
      selected?.b || 240
    },${selected?.a || 1})`;
    document.documentElement.style.setProperty("--bs-indigo", bg);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log(socket.id);
    });
    if (user) {
      socket.emit("newUser", { user_id: user.unique_id });
    }
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="vh-100 d-align">
              <img
                className="img-fluid"
                src="/assets/images/Curve-Loading.gif"
                alt="Loading"
              />
            </div>
          }
        >
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<SignIn />} />
            </Route>
            {/* <Route path="/" element={<Layout changeBg={changeBg} checked={color} />}> */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/Analytics" element={<Analytics />} />
              {/* All Companies */}
              <Route path="/MyCompanies" element={<MyCompanies />} />
              <Route path="/AllCompanies" element={<AllCompanies />} />
              <Route
                path="/MyCompanies/AddMyCompany/:id"
                element={<AddMyCompany />}
              />
              <Route
                path="/AllCompanies/AddAllCompany/:id"
                element={<AddAllCompanies />}
              />
              <Route
                path="/allCompanies/import"
                element={<AllCompanyImport />}
              />
              <Route
                path="/all-complaints/import"
                element={<ComplaintImport />}
              />
              <Route
                path="/company-management"
                element={<CompanyManagement />}
              />
              <Route path="/fuel-station" element={<FuelStation />} />
              <Route
                path="/SaleCompanies/AddSaleCompanies/:id"
                element={<AddSaleCompanies />}
              />
              <Route
                path="/PurchaseCompanies/AddPurchaseCompanies/:id"
                element={<AddPurchaseCompanies />}
              />
              <Route
                path="/:ViewCompany/ViewCompany/:id"
                element={<ViewCompany />}
              />
              <Route
                path="/AllCompanies/ViewAllCompanies/:id"
                element={<ViewAllCompanies />}
              />
              <Route path="/SaleCompanies" element={<SaleCompanies />} />
              <Route
                path="/PurchaseCompanies"
                element={<PurchaseCompanies />}
              />
              <Route path="/order-via" element={<OrderVia />} />
              <Route
                path="/order-via/create-order-via/:id"
                element={<CreateOrderVia />}
              />
              <Route
                path="/create-complaint/:id"
                element={<CreateComplaint />}
              />
              <Route
                path="/RequestsComplaint"
                element={<RequestsComplaint />}
              />
              <Route
                path="/:title/ViewRequestsComplaint/:id"
                element={<ViewRequestsComplaint />}
              />
              <Route path="/Complaints" element={<Complaints />} />
              <Route
                path="/ApprovedComplaints"
                element={<ApprovedComplaints />}
              />
              <Route
                path="/ApprovedComplaints/CreateAllocate/:id"
                element={<CreateAllocate />}
              />
              <Route
                path="/ApprovedComplaints/HoldComplaints/:id"
                element={<HoldComplaints />}
              />
              <Route
                path="/ApprovedComplaints/UpdateAllocate/:id"
                element={<UpdateAllocate />}
              />
              <Route
                path="/rejected-complaints"
                element={<RejectedComplaints />}
              />
              <Route
                path="/resolved-complaints"
                element={<ResolvedComplaints />}
              />
              <Route path="/all-complaints" element={<AllComplaints />} />
              <Route path="/Allocate" element={<Allocate />} />
              <Route path="/fund-request" element={<FundRequest />} />
              <Route path="/fund-transfer" element={<FundTransfer />} />
              <Route
                path="/fund-transfer/create-fund-transfer/:id"
                element={<CreateFundTransfer />}
              />
              <Route
                path="/stock-transfer/create-stock-transfer/:id"
                element={<CreateStockTransfer />}
              />
              <Route
                path="/fund-request/create-fund-request/:id"
                element={<CreateFundRequest />}
              />
              <Route path="/fund-category" element={<FundCategory />} />
              <Route path="/stock-management" element={<StockManagement />} />
              <Route
                path="/StockManagement"
                element={<ViewStockManagement />}
              />
              <Route path="/stock-transfer" element={<StockTransfer />} />
              <Route path="/stock-category" element={<StockCategory />} />
              <Route
                path="/stock-balance-overview"
                element={<StockBalanceOverview />}
              />
              <Route
                path="/view-stock-transactions"
                element={<ViewStockTransactions />}
              />
              <Route path="/stock-request" element={<StockRequest />} />
              <Route
                path="/stock-request/create-stock-request/:id"
                element={<CreateStockRequest />}
              />
              <Route path="/stock-punch" element={<StockPunch />} />
              {/* <Route
                path="/stock-punch/create-stock-punch/:id"
                element={<CreateStockPunch />}
              /> */}
              <Route
                path="/expense-management"
                element={<ExpenseManagement />}
              />
              <Route
                path="/ExpenseManagement"
                element={<ViewExpenseManagement />}
              />
              <Route path="/expense-request" element={<ExpenseRequest />} />
              <Route
                path="/view-expense-request/:id"
                element={<ViewExpenseRequest />}
              />
              <Route path="/expense-punch" element={<ExpensePunch />} />
              <Route path="/expense-transfer" element={<ExpenseTransfer />} />
              <Route
                path="/approve-expense-request/:id"
                element={<ApproveExpenseRequest />}
              />
              <Route
                path="/expense-balance-overview"
                element={<ExpenseBalanceOverview />}
              />
              <Route
                path="/view-expense-transaction"
                element={<ViewExpenseTransaction />}
              />
              <Route
                path="/expense-punch/create-expense-punch/:id"
                element={<CreateExpensePunch />}
              />
              {/* StockPunchManagement */}
              <Route
                path="/StockPunchManagement"
                element={<ViewStockPunchManagement />}
              />
              <Route
                path="/stock-punch-request"
                element={<StockPunchRequest />}
              />
              {/* 123 */}
              <Route
                path="/stock-punch-transfer"
                element={<AllStockTransferPunch />}
              />
              <Route
                path="/create-stock-punch-transfer"
                element={<StockPunchTransfer />}
              />
              <Route
                path="/stock-punch/create-stock-punch/:id"
                element={<CreateStockPunchRequest />}
              />
              <Route
                path="/stock-punch-balance-overview"
                element={<StockPunchBalanceOverview />}
              />
              <Route
                path="/view-stock-punch-request/:id"
                element={<ViewStockPunchRequest />}
              />
              <Route
                path="/approve-stock-punch-request/:id"
                element={<ApproveStockPunchRequest />}
              />
              <Route
                path="/view-stock-transaction"
                element={<ViewStockTransaction />}
              />
              <Route
                path="/view-stock-punch-transfer"
                element={<ViewStockPunchTransfer />}
              />
              {/* WorkQuotations */}
              <Route
                path="/approved-work-quotation"
                element={<ApprovedWorkQuotation />}
              />
              <Route
                path="/rejected-work-quotation"
                element={<RejectedWorkQuotation />}
              />
              <Route
                path="/requested-work-quotation"
                element={<RequestedWorkQuotations />}
              />
              <Route path="/WorkQuotation" element={<WorkQuotation />} />
              <Route path="/WorkQuotations" element={<WorkQuotations />} />
              <Route
                path="/create-quotation/:id"
                element={<CreateQuotation />}
              />
              <Route
                path="/WorkQuotations/send-work-quotation-by-email/:id"
                element={<SendWorkQuotationByEmail />}
              />
              <Route path="/sale-order" element={<SaleOrder />} />
              <Route path="/sale-order/create/:id" element={<CreateSales />} />
              <Route path="/PurchaseOrder" element={<PurchaseOrder />} />
              <Route path="/PurchaseSale" element={<PurchaseSale />} />
              <Route
                path="/PurchaseOrder/view-details/:id"
                element={<PoViewDetails />}
              />
              <Route
                path="/sale-order/view-details/:id"
                element={<ViewSalesOrder />}
              />
              <Route
                path="/PurchaseOrder/CreatePurchaseOrder/:id"
                element={<CreatePurchaseOrder />}
              />
              <Route
                path="/createSalesOrder/:id"
                element={<CreateSalesOrder />}
              />
              <Route
                path="/PurchaseOrder/create-security-deposit/:id"
                element={<CreateSecurityDeposit />}
              />
              <Route
                path="/PurchaseOrder/security-deposit/view"
                element={<ViewSecurityDeposit />}
              />
              <Route
                path="/sales-Order/security-deposit/view"
                element={<ViewSalesSecurityDeposit />}
              />

              <Route
                path="/purchaseOrder/security-eligible/approve"
                element={<ApproveSecurityRefund />}
              />
              <Route
                path="/sales-order/security-eligible/approve"
                element={<ApproveSecurityRefundInSo />}
              />
              <Route
                path="/purchaseOrder/securityEligible/approve"
                element={<SecurityEligible />}
              />
              <Route path="BillingManagement" element={<BillingManagement />} />
              <Route
                path="/PurchaseOrder/create-billing-type/:id"
                element={<CreateBillingType />}
              />
              <Route path="/Taxes" element={<Taxes />} />
              <Route path="/Taxes/create-taxes/:id" element={<CreateTaxes />} />
              <Route path="/financial-year" element={<FinancialYear />} />
              <Route
                path="/financial-year/create-financial-year/:id"
                element={<CreateFinancialYear />}
              />
              <Route
                path="/Measurements/CreateMeasurement/:id"
                element={<CreateMeasurement />}
              />
              <Route
                path="/view-final-expense/:type/:id"
                element={<ViewFinalExpenseDetails />}
              />
              <Route path="/view-measurement-details" element={<ViewPTM />} />
              <Route
                path="/create/measurement"
                element={<EditMeasurements />}
              />
              <Route
                path="/view-discard-details"
                element={<ViewDiscardDetails />}
              />
              <Route
                path="/Measurements/ViewMeasurement/:id"
                element={<ViewMeasurement />}
              />
              <Route path="/Measurements" element={<Measurements />} />
              <Route
                path="/attach-hard-copies"
                element={<HardCopyAttachment />}
              ></Route>
              <Route
                path="/view-measurements/:complaint_id"
                element={<ViewMeasurementDetails />}
              ></Route>
              <Route
                path="/view-measurement-timeline"
                element={<ViewTimeLine />}
              ></Route>
              <Route
                path="/change-po-number/:id"
                element={<ChangePoNumber />}
              ></Route>
              <Route path="/Merge" element={<Merge />} />
              <Route path="/merged-pi" element={<MergedPi />} />
              <Route path="/merge-to-invoice" element={<MergetoInvoice />} />
              <Route
                path="/view-merge-invoice"
                element={<ViewMergeInvoice />}
              />
              <Route
                path="/view-merge-to-pi"
                element={<ViewFinalMergeToPI />}
              />
              <Route path="/view-invoice" element={<ViewInvoiceDetails />} />
              <Route
                path="/merge-to-invoice/Pi-to-merge/:id"
                element={<PiToMerge />}
              />
              <Route path="/Payments" element={<Payments />} />
              <Route
                path="/payment-paid/:page"
                element={<PaymentPaidIndex />}
              />
              <Route path="/ItemMaster/:page" element={<ItemMasterIndex />} />

              <Route path="/area-manager" element={<AreaManager />} />
              <Route path="/area-manager/:id" element={<ViewAllManager />} />
              <Route path="/regional-office" element={<RegionalOffice />} />
              <Route
                path="/regional-office/view/:id"
                element={<ViewRegionalofficeDetails />}
              />
              <Route
                path="/regional-office/:id"
                element={<ViewROTransations />}
              />
              <Route
                path="/regional-office/view-po-details/:id"
                element={<ViewPOTransactions />}
              />
              <Route path="/setting/create/:id" element={<CreatePromotion />} />
              <Route
                path="/paid-invoice-setting"
                element={<PaidInvoiceSetting />}
              />
              <Route
                path="/setting/all-setting-overview"
                element={<PromotionOverview />}
              />
              <Route
                path="/setting/area-manager-ratio/:id"
                element={<CreateAreaManagerRatio />}
              />
              <Route
                path="/setting/area-manager-ratio/all-area-overview"
                element={<AreaManagerRatioOverview />}
              />
              <Route
                path="/CreateNewPayments"
                element={<CreateNewPayments />}
              />
              <Route path="/payments/:page" element={<PaymentIndex />} />
              <Route path="/PerformaInvoice" element={<AllReadyToPI />} />
              <Route
                path="/PerformaInvoice/CreatePerformaInvoice/:id"
                element={<CreatePerformaInvoice />}
              />
              <Route path="/view-performa-invoice" element={<ViewPerforma />} />
              <Route path="/Invoice" element={<AllFinalPerformaInvoices />} />
              <Route
                path="/Invoice/CreateInvoice/:id"
                element={<CreateInvoice />}
              />
              <Route path="/retention" element={<Retention />} />
              <Route
                path="/create-retention"
                element={<CreateRetentionMoney />}
              />
              <Route
                path="/approve-retention"
                element={<ApproveRetentionMoney />}
              />
              <Route
                path="/view-retention-money"
                element={<ViewRetentionMoney />}
              />
              <Route path="/CreateRetention" element={<CreateRetention />} />
              <Route path="/all-messages" element={<AllMessages />} />
              <Route
                path="/all-messages/add-user"
                element={<AddMessagesUser />}
              />
              <Route path="/product-category" element={<ProductCategory />} />
              <Route
                path="/product-category/create-product-category/:id"
                element={<CreateProductCategory />}
              />
              <Route path="/ItemMaster" element={<Index />} />
              <Route path="/assets/:page" element={<AssetManagement />} />
              <Route path="/team/:page" element={<CompanyTeam />} />
              <Route path="/unit-data" element={<UnitData />} />
              <Route
                path="/ProductManagement"
                element={<ProductManagement />}
              />
              <Route
                path="/unit-data/create-unit-data/:id"
                element={<CreateUnitData />}
              />
              <Route path="/ProductService" element={<ProductService />} />
              <Route
                path="/ProductService/AddProducts/:id"
                element={<AddProducts />}
              />
              <Route
                path="/DesignationPermissions"
                element={<DesignationPermissions />}
              />
              <Route path="/Teams" element={<Teams />} />
              <Route path="/Teams/create-teams/:id" element={<CreateTeams />} />
              <Route
                path="/team/create-energy-team/:id"
                element={<CreateTeam />}
              />
              <Route
                path="/Teams/view-team-level-wise/:id"
                element={<ViewTeamLevelWise />}
              />
              <Route
                path="/Teams/HrTeamMembers/:id"
                element={<HrTeamMembers />}
              />
              <Route
                path="/Teams/HrTeamMembers/:id/add"
                element={<TeamMemberForm />}
              />
              <Route path="/Employees" element={<Employees />} />
              <Route
                path="/Employees/ViewEmployee/:id"
                element={<ViewEmployee />}
              />
              <Route
                path="/Employees/AddEmployee/:id"
                element={<AddEmployee />}
              />
              <Route path="/Attendance" element={<Attendance />} />
              <Route path="/Attendance/create" element={<CreateAttendance />} />
              <Route
                path="/Attendance/UserAttendance/:id"
                element={<UserAttendance />}
              />
              <Route path="/Leaves" element={<Leaves />} />
              <Route path="/Leaves/view/:id" element={<ViewLeave />} />
              <Route path="/Leaves/create" element={<CreateLeave />} />

              <Route path="/leave-type" element={<LeavesType />} />
              <Route
                path="/leave-type/create/:id"
                element={<CreateLeavesType />}
              />
              <Route
                path="/ViewEmployeeLeave/:id"
                element={<ViewEmployeeLeave />}
              />
              <Route path="/Loan" element={<Loan />} />
              <Route path="/Loan/view/:id" element={<ViewLoan />} />
              <Route path="/Loan/create/:id" element={<CreateLoan />} />
              <Route path="/Payroll" element={<Payroll />} />
              <Route path="/PayrollMaster" element={<PayrollMaster />} />
              <Route
                path="/PayrollMaster/create/:id"
                element={<CreatePayroll />}
              />
              <Route path="/TimeSheet" element={<TimeSheet />} />
              <Route path="/TimeSheet" element={<TimeSheet />} />
              <Route path="/InsuranceCompany" element={<InsuranceCompany />} />
              <Route
                path="/InsuranceCompanyPlans"
                element={<InsuranceCompanyPlans />}
              />
              <Route path="/GroupInsurance" element={<GroupInsurance />} />
              <Route
                path="/GroupInsurance/AddGroupInsurance/:id"
                element={<AddGroupInsurance />}
              />
              <Route
                path="/GroupInsurance/ViewGroupInsurance/:id"
                element={<ViewGroupInsurance />}
              />
              <Route path="/SalaryDisbursal" element={<SalaryDisbursal />} />
              <Route
                path="/SalaryDisbursal/ViewSalaryDisbursal/:id/:month"
                element={<ViewSalaryDisbursal />}
              />
              <Route path="/PaySlip" element={<PaySlip />} />
              <Route
                path="/PaySlip/ViewPaySlipDetails/:id/:month"
                element={<ViewPaySlipDetails />}
              />
              <Route path="/ViewPaySlip" element={<ViewPaySlip />} />
              <Route
                path="/EmployeePromotionDemotion"
                element={<EmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeePromotionDemotion/AddEmployeePromotionDemotion/:id"
                element={<AddEmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeePromotionDemotion/view/:id"
                element={<ViewEmployeePromotionDemotion />}
              />
              <Route
                path="/EmployeeResignation"
                element={<EmployeeResignation />}
              />
              <Route
                path="/EmployeeResignation/create/:id"
                element={<CreateEmployeeResignation />}
              />
              <Route
                path="/EmployeeResignation/view/:id"
                element={<ViewEmployeeResignation />}
              />
              <Route
                path="/EmployeeRetirement"
                element={<EmployeeRetirement />}
              />
              <Route
                path="/EmployeeRetirement/AddEmployeeRetirement/:id"
                element={<AddEmployeeRetirement />}
              />
              <Route
                path="/EmployeeRetirement/view/:id"
                element={<ViewEmployeeRetirement />}
              />
              <Route path="/EmployeeTracking" element={<EmployeeTracking />} />
              <Route path="/EmployeeLogs" element={<EmployeeLogs />} />
              <Route
                path="/EmployeeLogs/EmployeeActivity/:id"
                element={<EmployeeActivity />}
              />
              <Route path="/FundManagement" element={<FundManagement />} />
              <Route path="/FundManagement/add-funds" element={<AddFunds />} />
              <Route
                path="/fund-balance-overview"
                element={<FundBalanceOverview />}
              />
              <Route
                path="/view-fund-transactions"
                element={<ViewFundTransactions />}
              />
              <Route path="/RequestCash" element={<RequestCash />} />
              <Route path="/:id/:id/:id" element={<CreateRequestCash />} />
              <Route path="/ExpensesCash" element={<ExpensesCash />} />
              <Route
                path="/ExpensesCash/create-expenses-cash/:id"
                element={<CreateExpensesCash />}
              />
              <Route path="/expense-category" element={<ExpenseCategory />} />
              <Route
                path="/expense-category/create-expense-category/:id"
                element={<CreateExpenseCategory />}
              />
              <Route
                path="/ViewRequestExpenses"
                element={<ViewRequestExpenses />}
              />
              <Route path="/Balance" element={<Balance />} />
              <Route path="/CompanyItemStock" element={<CompanyItemStock />} />
              <Route path="/AssignItems" element={<AssignItems />} />
              <Route path="/RequestItems" element={<RequestItems />} />
              <Route
                path="/RequestItems/create-request-items/:id"
                element={<CreateRequestItems />}
              />
              <Route path="/task/create/:id" element={<CreateTask />} />
              <Route
                path="/create/task-category/:id"
                element={<CreateTaskCategory />}
              />
              <Route path="/task/:page" element={<TaskIndex />} />
              <Route path="/reports/create/:id" element={<CreateReports />} />
              <Route path="/reports/:page" element={<ReportsIndex />} />
              <Route
                path="/earthing-testing/create/:id"
                element={<CreateEarthingTesting />}
              />
              <Route
                path="/earthing-testing/view"
                element={<ViewEarthingTesting />}
              />
              <Route path="/outlet/create/:id" element={<CreateOutlet />} />
              <Route path="/survey" element={<SurveyIndex />} />
              <Route
                path="/survey/view-response"
                element={<ViewAssignedSurvey />}
              />
              {/* <Route path="/AllSurvey" element={<AllSurvey />} /> */}
              <Route path="/SurveyItemMaster" element={<SurveyItemMaster />} />
              <Route
                path="/SurveyItemMaster/create-survey-item-master/:id"
                element={<CreateSurveyItemMaster />}
              />
              <Route
                path="/ItemMaster/import-item-master"
                element={<ImportItems />}
              />
              <Route path="/EarthingTesting" element={<EarthingTesting />} />
              {/* <Route path="/PurposeMaster" element={<PurposeMaster />} /> */}
              <Route
                path="/PurposeMaster/create-purpose-master/:id"
                element={<CreatePurposeMaster />}
              />
              <Route path="/survey/create" element={<CreateSurvey />} />
              {/* <Route path="/ResponseSurvey" element={<ResponseSurvey />} /> */}
              {/* <Route
                path="/ResponseSurvey/ViewResponseSurvey/:id"
                element={<ViewResponseSurvey />}
              /> */}
              <Route
                path="/ResponseSurvey/ViewResponseSurvey/:id"
                element={<ViewResponseSurvey1 />}
              />
              {/* <Route path="/AssignedSurvey" element={<AssignedSurvey />} /> */}
              {/* <Route path="/RequestSurvey" element={<RequestSurvey />} /> */}
              <Route path="/stock-management" element={<OfficeSiteStocks />} />
              <Route
                path="/stock-management/complaints-on-outlet/:id"
                element={<ComplaintsOnOutlet />}
              />
              <Route
                path="/stock-management/pending-complaints/:id"
                element={<PendingComplaints />}
              />
              <Route
                path="/stock-management/view-pending-complaints/:id/:status"
                element={<ViewPendingComplaints />}
              />
              <Route
                path="/office-inspection/employee-history"
                element={<EmployeeHistory />}
              />
              <Route
                path="/office-inspection"
                element={<ViewOfficeInspection />}
              />
              <Route path="/site-inspection" element={<ViewSiteInspection />} />
              <Route path="/office-expense" element={<PendingExpense />} />
              <Route
                path="/view-office-expense"
                element={<ViewOfficeExpense />}
              />
              <Route path="/view-office-fund" element={<ViewOfficeFund />} />
              <Route
                path="/site-expense-inspection"
                element={<SiteExpenseInspection />}
              />
              <Route
                path="/approve-site-expense-inspection"
                element={<ApproveSiteExpenseInspection />}
              />
              <Route
                path="/approve-fund-site-Inspection"
                element={<ApproveFund />}
              />
              <Route path="/assign-employee" element={<AssignEmployee />} />
              <Route
                path="/site-inspection/outlet-history"
                element={<OutletHistory />}
              />
              <Route
                path="/view-site-expense-inspection"
                element={<ViewSiteExpenseInspection />}
              />
              <Route
                path="/view-fund-inspection"
                element={<ViewFundDetails />}
              />
              <Route
                path="/assign-site-expense-inspection/"
                element={<AssignSiteInspection />}
              />
              <Route
                path="/assign-site-fund-inspection"
                element={<AssignSiteInspectionFund />}
              />
              <Route
                path="/approve-office-expense"
                element={<ApproveOfficeExpense />}
              />
              {/* site insection for fund */}
              <Route
                path="/site-fund-inspection"
                element={<SiteFundInspection />}
              />
              <Route
                path="/approve-office-fund"
                element={<ApproveOfficeFund />}
              />
              {/* Office Fund Inspection */}
              <Route
                path="/office-fund-inspection"
                element={<PendingFundInspection />}
              />
              <Route
                path="/office-expense/food-expense-punch"
                element={<FoodExpensePunch />}
              />
              <Route
                path="/office-expense/office-complaints-on-outlet/:id"
                element={<OfficeComplaintsOnOutlet />}
              />
              <Route
                path="/office-expense/office-expense-pending-complaints/:id"
                element={<OfficeExpensePendingComplaints />}
              />
              <Route path="/site-expense" element={<SiteExpense />} />
              <Route path="/SiteStocks" element={<SiteStocks />} />
              <Route path="/outlet/:page/" element={<OutletIndex />} />
              <Route path="/workImages/:page" element={<WorkImagesIndex />} />
              <Route
                path="/WorkImages/create/:id"
                element={<CreateWorkImages />}
              />
              {/* <Route
                path="/WorkImages/ViewWorkImages/:id"
                element={<ViewWorkImages />}
              /> */}
              {/* WorkImages */}
              {/* <Route path="/WorkImages" element={<WorkImages />} />
              <Route
                path="/request-work-image"
                element={<RequestWorkImage />}
              />
              <Route
                path="/approved-work-image"
                element={<ApprovedWorkImage />}
              />
              <Route
                path="/rejected-work-image"
                element={<RejectedWorkImage />}
              />
              <Route
                path="/WorkImages/create-work-image/:id"
                element={<CreateWorkImages />}
              />
              */}
              <Route path="/ItemMaster" element={<ItemMaster />} />
              <Route
                path="/ItemMaster/add-item-master/:id"
                element={<AddItemMaster />}
              />
              <Route
                path="/ItemMaster/create-sub-category/:id"
                element={<CreateSubCategory />}
              />
              <Route
                path="/ItemMaster/add-brand/:id"
                element={<AddBrandName />}
              />
              <Route path="/Stock" element={<Stock />} />
              {/* <Route
                path="/Stock/stock-transfer/new"
                element={<StockTransfer />}
              /> */}
              <Route path="/Stock/view-stock/:id" element={<ViewStock />} />
              <Route path="/AddStock" element={<AddStock />} />
              <Route path="/vendor" element={<Vendor />} />
              {/* Suppliers */}
              <Route path="Suppliers" element={<Suppliers />} />
              <Route
                path="/Suppliers/create-supplier/:id"
                element={<CreateSupplier />}
              />
              <Route path="/Suppliers/import" element={<ImportSuppliers />} />
              <Route path="/request-supplier" element={<RequestSupplier />} />
              <Route path="/approved-supplier" element={<ApprovedSupplier />} />
              <Route path="/rejected-supplier" element={<RejectedSupplier />} />
              <Route
                path="/all-suppliers-overview"
                element={<AllSuppliersOverview />}
              />
              <Route
                path="/AllAssets/CreateAssets/:id"
                element={<CreateAssets />}
              />
              <Route path="AssetsManagement" element={<AssetsManagement />} />
              <Route
                path="/IndividualAssetProfile"
                element={<IndividualAssetProfile />}
              />
              <Route path="/AssetTimeline/:id" element={<AssetTimeline />} />
              <Route
                path="/AssignedAssets/timeline-assigned-assets/:id"
                element={<TimelineAssignedAssets />}
              />
              <Route path="/contacts/:page" element={<ContactsIndex />} />
              <Route path="/Contacts" element={<Contacts />} />
              <Route
                path="/Contacts/CreateContacts/:id"
                element={<CreateContacts />}
              />
              <Route path="/DocumentCategory" element={<DocumentCategory />} />
              <Route
                path="/DocumentCategory/CreateDocumentCategory/:id"
                element={<CreateDocumentCategory />}
              />
              <Route path="/Documents" element={<Documents />} />
              <Route
                path="/DocumentCategory/DocumentCategoryView/:id"
                element={<DocumentCategoryView />}
              />
              <Route path="/AddDocument" element={<AddDocument />} />
              <Route path="/AddDocument/:id" element={<AddDocument />} />
              <Route path="/Communication" element={<Communication />} />
              <Route path="/Reports" element={<Reports />} />
              <Route
                path="/EnergyCompanyTeam"
                element={<EnergyCompanyTeam />}
              />
              <Route path="/oil-and-gas" element={<OilAndGas />} />
              <Route
                path="/contacts/energy/send-messages/:id"
                element={<SendMessages />}
              />
              <Route path="/TaskDashboard" element={<TaskDashboard />} />
              <Route path="/TaskCategory" element={<TaskCategory />} />
              <Route path="/AllTask" element={<AllTask />} />
              <Route path="/AllTask/TaskView/:id" element={<TaskView />} />
              <Route path="/OutletManagement" element={<OutletManagement />} />
              <Route
                path="/CreateOutletManagement"
                element={<CreateOutletManagement />}
              />
              <Route path="/MasterData" element={<MasterDataManagement />} />
              <Route
                path="/SuggestionsFeedbacks"
                element={<SuggestionsFeedbacks />}
              />
              <Route
                path="/FeedbackSuggestion/create"
                element={<FeedbackSuggestion />}
              />
              <Route
                path="/FeedbackSuggestion"
                element={<AllFeedbackSuggestion />}
              />
              <Route
                path="/FeedbackSuggestion/view"
                element={<ViewFeedbackSuggestion />}
              />
              <Route
                path="/FeedbackSuggestion/response"
                element={<Response />}
              />
              <Route path="/Tutorials" element={<Tutorials />} />
              <Route
                path="/Tutorials/create/:id"
                element={<CreateTutorial />}
              />
              <Route path="/PlanPricing" element={<PlanPricing />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/AllNotifications" element={<AllNotifications />} />
              <Route path="/EditDashboard" element={<EditDashboard />} />
              <Route path="/bank-management" element={<BankManagement />} />
              <Route
                path="/bank-management/create-bank-management/:id"
                element={<CreateBankManagement />}
              />
              <Route
                path="/account-management"
                element={<AccountManagement />}
              />
              <Route
                path="/account-management/:id/:id"
                element={<CreateAccountManagement />}
              />
              <Route
                path="/MasterOutletManagement"
                element={<MasterOutletManagement />}
              />
              <Route
                path="/MasterEnergyCompanyTeam"
                element={<MasterEnergyCompanyTeam />}
              />
              <Route
                path="/MasterSupplierManagement"
                element={<MasterSupplierManagement />}
              />
              <Route
                path="/MasterItemManagement"
                element={<MasterItemManagement />}
              />
              <Route path="/addBankBalance" element={<AddWalletBalance />} />
              <Route path="/CodeTesting" element={<CodeTesting />} />
              <Route path="/TaxManagement" element={<TaxManagement />} />
              <Route
                path="/TaxManagement/CreateTaxManagement/:id"
                element={<CreateTaxManagement />}
              />
              <Route path="/import-file" element={<ImportFile />} />
              <Route path="/export-file" element={<ExportFile />} />
              <Route path="/bill-no-format" element={<BillNoFormat />} />
              <Route
                path="/bill-no-format/create-bill-no-format/:id"
                element={<CreateBillNoFormat />}
              />

              <Route
                path="/employee-no-format"
                element={<EmployeeNoFormat />}
              />
              <Route
                path="/employee-no-format/create-employee-no-format/:id"
                element={<CreateEmployeeNoFormat />}
              />

              <Route path="/client-and-vendor" element={<ClientNoFormat />} />
              <Route
                path="/client-and-vendor/create-client-and-vendor-no-format/:id"
                element={<CreateClientNoFormat />}
              />

              <Route path="/item-no-format" element={<ItemNoFormat />} />
              <Route
                path="/item-no-format/create-item-no-format/:id"
                element={<CreateItemNoFormat />}
              />

              <Route path="/payment-method" element={<PaymentMethod />} />
              <Route
                path="/payment-method/create-payment-method/:id"
                element={<CreatePaymentMethod />}
              />
            </Route>
            {/* <Route path="/ViewSurvey/:id" element={<ViewSurvey />} /> */}
            <Route path="*" element={<NoPage />} />
            <Route path="/not-allowed" element={<NotAllowed />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
export default App;

import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import CompanyTeam from "./pages/EnergyCompany/CompanyTeam";
// import ViewTimeCard from "./pages/HRManagement/ViewTimeCard";
import ViewAssignedSurvey from "./pages/Survey/CreateResponse";
import OutletIndex from "./pages/Outlet/OutletIndex";
// import ForgetPassword from './pages/Authentication/ForgetPassword';

const Home = lazy(() => import("./pages/Home"));
const Analytics = lazy(() => import("./pages/Analytics"));
const CompanyManagement = lazy(() => import("./pages/Companies"));
const MyCompanies = lazy(() =>
  import("./pages/Companies/MyCompanies/MyCompanies")
);
const AllCompanies = lazy(() => import("./pages/Companies/AllCompanies"));
const AddAllCompanies = lazy(() => import("./pages/Companies/AddAllCompanies"));
const AddMyCompany = lazy(() =>
  import("./pages/Companies/MyCompanies/AddMyCompany")
);
const ViewAllCompanies = lazy(() =>
  import("./pages/Companies/ViewAllCompanies")
);
const AllCompanyImport = lazy(() =>
  import("./pages/Companies/AllCompaniesImport")
);
const ComplaintImport = lazy(() =>
  import("./pages/Complaints/ComplaintImport")
);
const ViewCompany = lazy(() => import("./pages/Companies/ViewCompany"));

const SaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/SaleCompanies")
);
const AddSaleCompanies = lazy(() =>
  import("./pages/Companies/SaleCompanies/AddSaleCompanies")
);

const PurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/PurchaseCompanies")
);
const AddPurchaseCompanies = lazy(() =>
  import("./pages/Companies/PurchaseCompanies/AddPurchaseCompanies")
);

const EnergyMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/EnergyMasterdata")
);
const CreateBankManagement = lazy(() =>
  import("./pages/MasterDataManagement/BankManagement/CreateBankManagement")
);
const CreateFinancialYear = lazy(() =>
  import("./pages/Billings/CreateFinancialYear")
);
const ViewEnergyCompanyDetails = lazy(() =>
  import("./pages/MasterData/EnergyCompany/ViewEnergyCompanyDetails")
);
const AddEnergyCompany = lazy(() =>
  import("./pages/MasterData/EnergyCompany/AddEnergyCompany")
);
const ZoneMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/ZoneMasterdata")
);
const ZoneForm = lazy(() =>
  import("./pages/MasterData/EnergyCompany/ZoneForm")
);
const RegionalMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/RegionalMasterdata")
);
const RegionalForm = lazy(() =>
  import("./pages/MasterData/EnergyCompany/RegionalForm")
);
const SalesAreaMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/SalesAreaMasterdata")
);
const SalesAreaForm = lazy(() =>
  import("./pages/MasterData/EnergyCompany/SalesAreaForm")
);
const DistrictMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/DistrictMasterdata")
);
const DistrictForm = lazy(() =>
  import("./pages/MasterData/EnergyCompany/DistrictForm")
);
const OutletsMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyCompany/OutletsMasterdata")
);

const AddOutlet = lazy(() =>
  import("./pages/MasterData/EnergyCompany/AddOutlet")
);
const EnergyTeamMasterdata = lazy(() =>
  import("./pages/MasterData/EnergyTeamMasterdata")
);
const EnergyTeamMembers = lazy(() =>
  import("./pages/MasterData/EnergyTeamMembers")
);
const DealersMasterdata = lazy(() =>
  import("./pages/MasterData/DealersMasterdata")
);
const DealerUsers = lazy(() => import("./pages/MasterData/DealerUsers"));
const ContractorUsers = lazy(() =>
  import("./pages/MasterData/ContractorUsers")
);
const ClientUserForm = lazy(() => import("./pages/MasterData/ClientUserForm"));
const ContractorsMasterdata = lazy(() =>
  import("./pages/MasterData/ContractorsMasterdata")
);
const ContractorForm = lazy(() => import("./pages/MasterData/ContractorForm"));
const ComplaintTypesMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/ComplaintTypesMasterdata")
);
const CreateComplaintType = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/CreateComplaintType")
);
const CreateOrderVia = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/OrderVia/CreateOrderVia")
);
const CreateTaxManagement = lazy(() =>
  import("./pages/MasterDataManagement/TaxManagement/CreateTaxManagement")
);
const AllComplaintsMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/AllComplaintsMasterdata")
);
const UpdateResolved = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/UpdateResolved")
);
const AddComplaintsMasterdata = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/AddComplaintsMasterdata")
);
const ViewUserComplaint = lazy(() =>
  import("./pages/MasterData/ComplaintTypesMasterdata/ViewUserComplaint")
);
const User = lazy(() => import("./pages/UserManagement/User"));
const MyTeamManagement = lazy(() =>
  import("./pages/UserManagement/MyTeamManagement")
);
const EnergyManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/EnergyManagement")
);
const DealersManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/DealersManagement")
);
const ContractorManagement = lazy(() =>
  import("./pages/UserManagement/CompanyRolesManagement/ContractorManagement")
);
const RolesPermissions = lazy(() =>
  import("./pages/UserManagement/RolesPermissions")
);
const ViewRolesPermissions = lazy(() =>
  import("./pages/UserManagement/ViewRolesPermissions")
);
const TeamMembers = lazy(() => import("./pages/UserManagement/TeamMembers"));
const NoPage = lazy(() => import("./pages/Authentication/NoPage"));
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
const ViewFeedback = lazy(() =>
  import("./components/ModalContent/ViewFeedback")
);
const SignIn = lazy(() => import("./pages/Authentication/SignIn"));
const AllNotifications = lazy(() => import("./pages/AllNotifications"));
const AllMessages = lazy(() => import("./pages/AllMessages"));
const AddMessagesUser = lazy(() => import("./pages/AddMessagesUser"));

//EarthingTesting
const EarthingTesting = lazy(() => import("./pages/EarthingTesting"));
const CreateEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/CreateEarthingTesting")
);
const ViewEarthingTesting = lazy(() =>
  import("./pages/EarthingTesting/ViewEarthingTesting")
);

//Oil And Gas
const OilAndGas = lazy(() => import("./pages/EnergyCompany"));
const CreateTeam = lazy(() => import("./pages/EnergyCompany/CreateTeam"));

// const OilAndGas = lazy(() => import("./pages/MasterData/EnergyCompany"));
// survey
const SurveyIndex = lazy(() => import("./pages/Survey"));
const AllSurvey = lazy(() => import("./pages/Survey/AllSurvey"));
const PurposeMaster = lazy(() => import("./pages/Survey/PurposeMaster"));
const CreatePurposeMaster = lazy(() =>
  import("./pages/Survey/CreatePurposeMaster")
);

const ViewResponseSurvey1 = lazy(() =>
  import("./pages/Survey/ViewResponseSurvey1")
);
const AddItemMaster = lazy(() =>
  import("./components/ModalContent/AddItemMaster")
);
const ImportItems = lazy(() => import("./pages/ItemMaster/ImportItems"));
const SurveyItemMaster = lazy(() => import("./pages/Survey/SurveyItemMaster"));
const CreateSurveyItemMaster = lazy(() =>
  import("./pages/Survey/CreateSurveyItemMaster")
);
const AddBrandName = lazy(() => import("./pages/ItemMaster/AddBrandName"));
const CreateSubCategory = lazy(() =>
  import("./pages/ItemMaster/CreateSubCategory")
);
const ItemMasterIndex = lazy(() =>
  import("./pages/ItemMaster/ItemMasterIndex")
);
// Complaints
const Complaints = lazy(() => import("./pages/Complaints/index"));
const CreateComplaint = lazy(() =>
  import("./pages/Complaints/CreateComplaint")
);
const RequestsComplaint = lazy(() =>
  import("./pages/Complaints/RequestsComplaint")
);
const ViewRequestsComplaint = lazy(() =>
  import("./pages/Complaints/ViewRequestsComplaint")
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

// Fuel Station Management
const FuelStation = lazy(() => import("./pages/Outlet/index"));
const CreateOutlet = lazy(() => import("./pages/Outlet/CreateOutlet"));

// Contacts
const Contacts = lazy(() => import("./pages/ContactManagement/index"));
const CreateContacts = lazy(() =>
  import("./pages/ContactManagement/CreateContacts")
);
const SendMessages = lazy(() =>
  import("./pages/ContactManagement/SendMessages")
);

// const ItemMaster = lazy(() => import("./pages/Survey/ItemMaster"));

// MasterDataManagement
const MasterDataManagement = lazy(() => import("./pages/MasterDataManagement"));
const CreateAccountManagement = lazy(() =>
  import(
    "./pages/MasterDataManagement/AccountManagement/CreateAccountManagement"
  )
);
const AccountManagement = lazy(() =>
  import("./pages/MasterDataManagement/AccountManagement/AccountManagement")
);
const CreateBillNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/BillNoFormat/CreateBillNoFormat")
);
const CreateEmployeeNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/EmployeeNoFormat/CreateEmployeeNoFormat")
);
const CreateClientNoFormat = lazy(() =>
  import(
    "./pages/MasterDataManagement/ClientAndVendorNoFormat/CreateClientNoFormat"
  )
);
const CreateItemNoFormat = lazy(() =>
  import("./pages/MasterDataManagement/ItemNoFormat/CreateItemNoFormat")
);

const CreatePaymentMethod = lazy(() =>
  import("./pages/MasterDataManagement/PaymentMethod/CreatePaymentMethod")
);

// ItemMaster
const ItemMaster = lazy(() => import("./pages/ItemMaster"));

// billing
const HardCopyAttachment = lazy(() =>
  import("./pages/BillingManagement/HardCopyAttachment")
);
const CreateMeasurement = lazy(() =>
  import("./pages/Billings/CreateMeasurement")
);
const ViewMeasurementDetails = lazy(() =>
  import("./pages/BillingManagement/ViewMeasurementDetails")
);
const CreatePerformaInvoice = lazy(() =>
  import("./pages/Billings/CreatePerformaInvoice")
);
const ViewFinalExpenseDetails = lazy(() =>
  import("./pages/BillingManagement/ViewExpenseDetails")
);
const ViewTimeLine = lazy(() =>
  import("./pages/BillingManagement/ViewTimeLine")
);
const ViewPTM = lazy(() => import("./pages/BillingManagement/ViewPTM"));
const ViewPerforma = lazy(() =>
  import("./pages/BillingManagement/Performa Invoice/ViewPerforma")
);
const CreateInvoice = lazy(() =>
  import("./pages/Billings/Invoices/CreateInvoice")
);
const ViewInvoiceDetails = lazy(() =>
  import("./pages/Billings/Invoices/ViewInvoiceDetails")
);
const ViewFinalMergeToPI = lazy(() =>
  import("./pages/Billings/MergeToPI/ViewFinalMergePi")
);
const ViewMergeInvoice = lazy(() =>
  import("./pages/Billings/MergeToInvoice/ViewMergedInvoice")
);
const PaymentIndex = lazy(() =>
  import("./pages/Billings/PaymentModule/PaymentIndex")
);
const ViewRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/ViewRetentionMoney")
);
const CreateRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/CreateRetentionMoney")
);
const ApproveRetentionMoney = lazy(() =>
  import("./pages/Billings/RetentionMoney/ApproveRetentionMoney")
);
// PurchaseSale
const CreateSalesOrder = lazy(() =>
  import("./pages/SalesOrderNew/CreateSalesOrder")
);
const ViewSalesOrder = lazy(() =>
  import("./pages/SalesOrderNew/ViewSalesOrder")
);
const ViewSalesSecurityDeposit = lazy(() =>
  import("./pages/SalesOrderNew/ViewSecurityDeposit")
);
const ViewSecurityDeposit = lazy(() =>
  import("./pages/PurchaseOrder/ViewSecurityDeposit")
);
const PurchaseSale = lazy(() => import("./pages/PurchaseOrder/index"));
const CreatePurchaseOrder = lazy(() =>
  import("./pages/PurchaseOrder/CreatePurchaseOrder")
);
const PoViewDetails = lazy(() => import("./pages/PurchaseOrder/PoViewDetails"));

const SecurityEligible = lazy(() =>
  import("./pages/PurchaseOrder/SecurityEligible")
);
const ApproveSecurityRefundInSo = lazy(() =>
  import("./pages/SalesOrderNew/ApproveSecurityRefundInSo")
);
const ApproveSecurityRefund = lazy(() =>
  import("./pages/PurchaseOrder/ApproveSecurityRefund")
);
const SaleOrder = lazy(() => import("./pages/SalesOrderNew/SalesOrder"));

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

const CreateSurvey = lazy(() => import("./pages/Survey/CreateSurvey"));
// const ViewSurvey = lazy(() => import("./pages/Survey/ViewSurvey"));
const ResponseSurvey = lazy(() => import("./pages/Survey/ResponseSurvey"));
const ViewResponseSurvey = lazy(() =>
  import("./pages/Survey/ViewResponseSurvey")
);
const AssignedSurvey = lazy(() => import("./pages/Survey/AssignedSurvey"));
const RequestSurvey = lazy(() => import("./pages/Survey/RequestSurvey"));
const Documents = lazy(() => import("./pages/Documents"));

const DocumentsLists = lazy(() => import("./pages/Documents/DocumentsLists"));
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

const TaskIndex = lazy(() => import("./pages/TaskManager/TaskIndex"));
const CreateTask = lazy(() => import("./pages/TaskManager/CreateTask"));
const CreateTaskCategory = lazy(() =>
  import("./pages/TaskManager/CreateTaskCategory")
);
const TaskDashboard = lazy(() => import("./pages/TaskManager/TaskDashboard"));
const TaskCategory = lazy(() => import("./pages/TaskManager/TaskCategory"));

const TaskView = lazy(() => import("./pages/TaskManager/TaskView"));
const AllTask = lazy(() => import("./pages/TaskManager/AllTask"));
const SoftwareActivation = lazy(() =>
  import("./pages/SoftwareActivation/SoftwareActivation")
);
const ViewSoftwareDetails = lazy(() =>
  import("./pages/SoftwareActivation/ViewSoftwareDetails")
);
const AllContacts = lazy(() => import("./pages/Contacts/AllContacts"));
const ContractorsContacts = lazy(() =>
  import("./pages/Contacts/ContractorsContacts")
);
const EnergyCompaniesContacts = lazy(() =>
  import("./pages/Contacts/EnergyCompaniesContacts")
);
const DealersContacts = lazy(() => import("./pages/Contacts/DealersContacts"));
const SuperAdminContacts = lazy(() =>
  import("./pages/Contacts/SuperAdminContacts")
);
const ViewContact = lazy(() => import("./pages/Contacts/ViewContact"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const CreateTutorial = lazy(() => import("./pages/CreateTutorial"));
const PlanPricing = lazy(() => import("./pages/PlanPricing"));
const PlanPricingForm = lazy(() =>
  import("./pages/PlanPricing/PlanPricingForm")
);
const Billings = lazy(() => import("./pages/Billings"));
const BillingManagement = lazy(() => import("./pages/BillingManagement/index"));

const EnableDisableFeatures = lazy(() =>
  import("./pages/EnableDisableFeatures")
);
const TermConditions = lazy(() =>
  import("./pages/TermConditions/TermConditions")
);
const ViewTermConditions = lazy(() =>
  import("./pages/TermConditions/ViewTermConditions")
);
const AddTermConditions = lazy(() =>
  import("./pages/TermConditions/AddTermConditions")
);
const DesignationPermissions = lazy(() =>
  import("./pages/HRManagement/DesignationPermissions")
);

const AllRoles = lazy(() => import("./pages/AllRoles"));
const CreateRoles = lazy(() => import("./pages/CreateRoles"));

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
const LeavesType = lazy(() => import("./pages/HRManagement/Leaves/LeavesType"));
const CreateLeavesType = lazy(() =>
  import("./pages/HRManagement/Leaves/CreateLeavesType")
);
const CreateLeave = lazy(() =>
  import("./pages/HRManagement/Leaves/CreateLeave")
);
const ViewEmployeeLeave = lazy(() =>
  import("./pages/HRManagement/ViewEmployee/ViewEmployeeLeave")
);
const Payroll = lazy(() => import("./pages/HRManagement/Payroll/Payroll"));
const HrPayroll = lazy(() => import("./pages/HRManagement/Payroll/index"));

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
const CreateLoan = lazy(() =>
  import("./pages/HRManagement/Payroll/CreateLoan")
);
const ViewLoan = lazy(() => import("./pages/HRManagement/Payroll/ViewLoan"));

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
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/Analytics" element={<Analytics />} />
              <Route
                path="/company-management"
                element={<CompanyManagement />}
              />
              <Route path="/MyCompanies" element={<MyCompanies />} />
              <Route path="/AllCompanies" element={<AllCompanies />} />
              <Route
                path="/MyCompanies/AddMyCompany"
                element={<AddMyCompany />}
              />
              <Route
                path="/MyCompanies/AddMyCompany/:id"
                element={<AddMyCompany />}
              />
              <Route
                path="/AllCompanies/AddAllCompany/:id"
                element={<AddAllCompanies />}
              />
              <Route
                path="/SaleCompanies/AddSaleCompanies"
                element={<AddSaleCompanies />}
              />
              <Route
                path="/SaleCompanies/AddSaleCompanies/:id"
                element={<AddSaleCompanies />}
              />
              <Route
                path="/PurchaseCompanies/AddPurchaseCompanies"
                element={<AddPurchaseCompanies />}
              />
              <Route
                path="/PurchaseCompanies/AddPurchaseCompanies/:id"
                element={<AddPurchaseCompanies />}
              />
              {/* <Route path="/ViewCompany" element={<ViewCompany />} /> */}
              <Route
                path="/:ViewCompany/ViewCompany/:id"
                element={<ViewCompany />}
              />
              <Route
                path="/AllCompanies/ViewAllCompanies/:id"
                element={<ViewAllCompanies />}
              />
              <Route
                path="/allCompanies/import"
                element={<AllCompanyImport />}
              />
              <Route
                path="/all-complaints/import"
                element={<ComplaintImport />}
              />
              <Route path="/SaleCompanies" element={<SaleCompanies />} />
              <Route
                path="/PurchaseCompanies"
                element={<PurchaseCompanies />}
              />
              <Route path="/oil-and-gas" element={<OilAndGas />} />
              <Route
                path="/team/create-energy-team/:id"
                element={<CreateTeam />}
              />
              <Route path="/team/:page" element={<CompanyTeam />} />
              <Route path="/EnergyMasterdata" element={<EnergyMasterdata />} />
              <Route
                path="/bank-management/create-bank-management/:id"
                element={<CreateBankManagement />}
              />
              <Route
                path="/financial-year/create-financial-year/:id"
                element={<CreateFinancialYear />}
              />
              <Route
                path="/EnergyMasterdata/ViewEnergyCompanyDetails/:id"
                element={<ViewEnergyCompanyDetails />}
              />
              <Route
                path="/EnergyMasterdata/AddEnergyCompany/:id"
                element={<AddEnergyCompany />}
              />
              <Route path="/ZoneMasterdata" element={<ZoneMasterdata />} />
              <Route path="/ZoneMasterdata/add" element={<ZoneForm />} />
              <Route path="/ZoneMasterdata/edit/:id" element={<ZoneForm />} />
              <Route
                path="/RegionalMasterdata"
                element={<RegionalMasterdata />}
              />
              <Route
                path="/RegionalMasterdata/add"
                element={<RegionalForm />}
              />
              <Route
                path="/RegionalMasterdata/edit/:id"
                element={<RegionalForm />}
              />
              <Route
                path="/SalesAreaMasterdata"
                element={<SalesAreaMasterdata />}
              />
              <Route
                path="/SalesAreaMasterdata/add"
                element={<SalesAreaForm />}
              />
              <Route
                path="/SalesAreaMasterdata/edit/:id"
                element={<SalesAreaForm />}
              />
              <Route
                path="/DistrictMasterdata"
                element={<DistrictMasterdata />}
              />
              <Route
                path="/DistrictMasterdata/add"
                element={<DistrictForm />}
              />
              <Route
                path="/DistrictMasterdata/edit/:id"
                element={<DistrictForm />}
              />
              <Route
                path="/OutletsMasterdata"
                element={<OutletsMasterdata />}
              />
              <Route path="/outlet/:page/" element={<OutletIndex />} />
              <Route
                path="/OutletsMasterdata/AddOutlet"
                element={<AddOutlet />}
              />
              <Route
                path="/OutletsMasterdata/AddOutlet/:id"
                element={<AddOutlet />}
              />
              <Route
                path="/EnergyTeamMasterdata"
                element={<EnergyTeamMasterdata />}
              />
              <Route
                path="/EnergyTeamMasterdata/EnergyTeamMembers:id"
                element={<EnergyTeamMembers />}
              />
              <Route
                path="/DealersMasterdata"
                element={<DealersMasterdata />}
              />
              <Route
                path="/DealersMasterdata/DealerUsers/:id"
                element={<DealerUsers />}
              />
              {/* <Route path="/DealerUsers" element={<DealerUsers />} /> */}
              <Route
                path="/ContractorsMasterdata/ContractorUsers/:id"
                element={<ContractorUsers />}
              />
              <Route
                path="/ContractorsMasterdata/client-user-form/add"
                element={<ClientUserForm />}
              />
              <Route
                path="/ContractorsMasterdata/client-user-form/edit/:id"
                element={<ClientUserForm />}
              />
              <Route
                path="/ContractorsMasterdata"
                element={<ContractorsMasterdata />}
              />
              <Route
                path="/ContractorsMasterdata/add"
                element={<ContractorForm />}
              />
              <Route
                path="/ContractorsMasterdata/edit/:id"
                element={<ContractorForm />}
              />
              <Route
                path="/AllComplaintsMasterdata"
                element={<AllComplaintsMasterdata />}
              />
              <Route
                path="/AllComplaintsMasterdata/update-resolved/:id"
                element={<UpdateResolved />}
              />
              <Route
                path="/ComplaintTypesMasterdata"
                element={<ComplaintTypesMasterdata />}
              />
              <Route
                path="/ComplaintTypes/create/:id"
                element={<CreateComplaintType />}
              />
              <Route
                path="/order-via/create-order-via/:id"
                element={<CreateOrderVia />}
              />
              <Route
                path="/TaxManagement/CreateTaxManagement/:id"
                element={<CreateTaxManagement />}
              />
              <Route
                path="/bill-no-format/create-bill-no-format/:id"
                element={<CreateBillNoFormat />}
              />
              <Route
                path="/employee-no-format/create-employee-no-format/:id"
                element={<CreateEmployeeNoFormat />}
              />
              <Route
                path="/client-and-vendor/create-client-and-vendor-no-format/:id"
                element={<CreateClientNoFormat />}
              />
              <Route
                path="/item-no-format/create-item-no-format/:id"
                element={<CreateItemNoFormat />}
              />
              <Route
                path="/payment-method/create-payment-method/:id"
                element={<CreatePaymentMethod />}
              />
              <Route
                path="/AllComplaintsMasterdata/AddComplaintsMasterdata/:id"
                element={<AddComplaintsMasterdata />}
              />
              <Route
                path="/AllComplaintsMasterdata/ViewUserComplaint/:id"
                element={<ViewUserComplaint />}
              />
              <Route path="/User" element={<User />} />
              <Route path="/MyTeamManagement" element={<MyTeamManagement />} />
              <Route path="/EnergyManagement" element={<EnergyManagement />} />
              <Route
                path="/DealersManagement"
                element={<DealersManagement />}
              />
              <Route
                path="/ContractorManagement"
                element={<ContractorManagement />}
              />
              <Route path="/RolesPermissions" element={<RolesPermissions />} />
              <Route
                path="/AllRoles/ViewRolesPermissions/:id"
                element={<ViewRolesPermissions />}
              />
              <Route path="/TeamMembers" element={<TeamMembers />} />
              <Route
                path="/SoftwareActivation"
                element={<SoftwareActivation />}
              />
              <Route
                path="/SoftwareActivation/ViewSoftwareDetails/:id"
                element={<ViewSoftwareDetails />}
              />
              <Route path="/fuel-station" element={<FuelStation />} />
              <Route path="/outlet/create/:id" element={<CreateOutlet />} />
              <Route path="/Contacts" element={<Contacts />} />
              <Route
                path="/Contacts/CreateContacts/:id"
                element={<CreateContacts />}
              />
              <Route
                path="/contacts/energy/send-messages/:id"
                element={<SendMessages />}
              />
              {/* Complaints */}
              <Route path="/Complaints" element={<Complaints />} />
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
              {/* Survey */}
              <Route path="/AllSurvey" element={<AllSurvey />} />
              <Route path="/survey" element={<SurveyIndex />} />
              <Route path="/SurveyItemMaster" element={<SurveyItemMaster />} />
              <Route
                path="/SurveyItemMaster/create-survey-item-master/:id"
                element={<CreateSurveyItemMaster />}
              />
              <Route
                path="/ItemMaster/add-brand/:id"
                element={<AddBrandName />}
              />
              <Route
                path="/ItemMaster/create-sub-category/:id"
                element={<CreateSubCategory />}
              />
              <Route path="/ItemMaster/:page" element={<ItemMasterIndex />} />
              <Route
                path="/ResponseSurvey/ViewResponseSurvey/:id"
                element={<ViewResponseSurvey1 />}
              />
              <Route
                path="/ItemMaster/add-item-master/:id"
                element={<AddItemMaster />}
              />
              <Route
                path="/ItemMaster/import-item-master"
                element={<ImportItems />}
              />
              {/* EarthingTesting */}
              <Route path="/EarthingTesting" element={<EarthingTesting />} />
              <Route
                path="/earthing-testing/create/:id"
                element={<CreateEarthingTesting />}
              />
              <Route
                path="/earthing-testing/view"
                element={<ViewEarthingTesting />}
              />
              {/* <Route path="/ItemMaster" element={<ItemMaster />} /> */}
              <Route path="/PurposeMaster" element={<PurposeMaster />} />
              <Route
                path="/PurposeMaster/create-purpose-master/:id"
                element={<CreatePurposeMaster />}
              />
              {/* Setting MasterDataManagement */}
              <Route path="/MasterData" element={<MasterDataManagement />} />
              <Route
                path="/account-management/:id/:id"
                element={<CreateAccountManagement />}
              />
              <Route
                path="/account-management"
                element={<AccountManagement />}
              />
              {/* Setting ItemMaster */}
              <Route path="/ItemMaster" element={<ItemMaster />} />
              {/* Sales & Billing PurchaseSale */}
              <Route
                path="/attach-hard-copies"
                element={<HardCopyAttachment />}
              />
              <Route
                path="/Measurements/CreateMeasurement/:id"
                element={<CreateMeasurement />}
              />
              <Route
                path="/view-measurements/:complaint_id"
                element={<ViewMeasurementDetails />}
              />
              <Route
                path="/PerformaInvoice/CreatePerformaInvoice/:id"
                element={<CreatePerformaInvoice />}
              />
              <Route
                path="/view-final-expense/:type/:id"
                element={<ViewFinalExpenseDetails />}
              />
              <Route
                path="/view-measurement-timeline"
                element={<ViewTimeLine />}
              />
              <Route
                path="/Invoice/CreateInvoice/:id"
                element={<CreateInvoice />}
              />
              <Route
                path="/view-merge-to-pi"
                element={<ViewFinalMergeToPI />}
              />
              <Route
                path="/view-merge-invoice"
                element={<ViewMergeInvoice />}
              />
              <Route path="/payments/:page" element={<PaymentIndex />} />
              <Route
                path="/view-retention-money"
                element={<ViewRetentionMoney />}
              />{" "}
              <Route
                path="/create-retention"
                element={<CreateRetentionMoney />}
              />
              <Route
                path="/approve-retention"
                element={<ApproveRetentionMoney />}
              />
              <Route path="/view-invoice" element={<ViewInvoiceDetails />} />
              <Route path="/view-measurement-details" element={<ViewPTM />} />
              <Route path="/view-performa-invoice" element={<ViewPerforma />} />
              <Route
                path="/createSalesOrder/:id"
                element={<CreateSalesOrder />}
              />
              <Route
                path="/PurchaseOrder/security-deposit/view"
                element={<ViewSecurityDeposit />}
              />
              <Route
                path="/sale-order/view-details/:id"
                element={<ViewSalesOrder />}
              />
              <Route
                path="/sales-Order/security-deposit/view"
                element={<ViewSalesSecurityDeposit />}
              />
              <Route path="/PurchaseSale" element={<PurchaseSale />} />
              <Route
                path="/PurchaseOrder/CreatePurchaseOrder/:id"
                element={<CreatePurchaseOrder />}
              />
              <Route
                path="/sale-order/view-details/:id"
                element={<ViewSalesOrder />}
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
                path="/purchaseOrder/securityEligible/approve"
                element={<SecurityEligible />}
              />
              <Route
                path="/sales-order/security-eligible/approve"
                element={<ApproveSecurityRefundInSo />}
              />
              <Route
                path="/purchaseOrder/security-eligible/approve"
                element={<ApproveSecurityRefund />}
              />
              <Route path="/sale-order" element={<SaleOrder />} />
              <Route
                path="/PurchaseOrder/view-details/:id"
                element={<PoViewDetails />}
              />
              <Route
                path="/createSalesOrder/:id"
                element={<CreateSalesOrder />}
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
              {/* <Route
                path="/AllSurvey/CreateSurvey/:id"
                element={<CreateSurvey />}
              /> */}
              <Route path="/survey/create" element={<CreateSurvey />} />
              <Route path="/ResponseSurvey" element={<ResponseSurvey />} />
              <Route
                path="/ResponseSurvey/ViewResponseSurvey/:id"
                element={<ViewResponseSurvey />}
              />
              <Route
                path="/survey/view-response"
                element={<ViewAssignedSurvey />}
              />
              <Route path="/AssignedSurvey" element={<AssignedSurvey />} />
              <Route path="/RequestSurvey" element={<RequestSurvey />} />
              <Route path="/DocumentCategory" element={<DocumentCategory />} />
              <Route
                path="/DocumentCategory/CreateDocumentCategory/:id"
                element={<CreateDocumentCategory />}
              />
              <Route path="/Documents" element={<Documents />} />
              <Route path="/DocumentsLists" element={<DocumentsLists />} />
              <Route
                path="/DocumentCategory/DocumentCategoryView/:id"
                element={<DocumentCategoryView />}
              />
              <Route path="/AddDocument" element={<AddDocument />} />
              <Route path="/AddDocument/:id" element={<AddDocument />} />
              <Route path="/task/create/:id" element={<CreateTask />} />
              <Route
                path="/create/task-category/:id"
                element={<CreateTaskCategory />}
              />
              <Route path="/task/:page" element={<TaskIndex />} />
              <Route path="/TaskDashboard" element={<TaskDashboard />} />
              <Route path="/TaskCategory" element={<TaskCategory />} />
              <Route path="/AllTask" element={<AllTask />} />
              <Route path="/AllTask/TaskView/:id" element={<TaskView />} />
              <Route
                path="/SuggestionFeedback"
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
              <Route path="/ViewFeedback" element={<ViewFeedback />} />
              <Route path="/AllContacts" element={<AllContacts />} />
              <Route
                path="/contractors-contacts"
                element={<ContractorsContacts />}
              />
              <Route
                path="/energy-companies-contacts"
                element={<EnergyCompaniesContacts />}
              />
              <Route path="/dealers-contacts" element={<DealersContacts />} />
              <Route path="/CreateContacts" element={<CreateContacts />} />
              <Route path="/ViewContact" element={<ViewContact />} />
              <Route
                path="/super-admin-contacts"
                element={<SuperAdminContacts />}
              />
              <Route path="/Tutorials" element={<Tutorials />} />
              <Route
                path="/Tutorials/create/:id"
                element={<CreateTutorial />}
              />
              <Route path="/PlanPricing" element={<PlanPricing />} />
              <Route path="/PlanPricing/add" element={<PlanPricingForm />} />
              <Route
                path="/PlanPricing/edit/:id"
                element={<PlanPricingForm />}
              />
              <Route path="/Billings" element={<Billings />} />
              <Route
                path="/BillingManagement"
                element={<BillingManagement />}
              />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/AllNotifications" element={<AllNotifications />} />
              <Route path="/all-messages" element={<AllMessages />} />
              <Route
                path="/all-messages/add-user"
                element={<AddMessagesUser />}
              />
              <Route
                path="/EnableDisableFeatures"
                element={<EnableDisableFeatures />}
              />
              <Route path="/TermConditions" element={<TermConditions />} />
              <Route
                path="/TermConditions/ViewTermConditions/:id"
                element={<ViewTermConditions />}
              />
              <Route
                path="/TermConditions/AddTermConditions/:id"
                element={<AddTermConditions />}
              />
              <Route
                path="/DesignationPermissions"
                element={<DesignationPermissions />}
              />
              <Route path="/Teams" element={<Teams />} />
              <Route path="/Teams/create-teams/:id" element={<CreateTeams />} />
              <Route
                path="/Teams/view-team-level-wise/:id"
                element={<ViewTeamLevelWise />}
              />
              <Route path="/AllRoles" element={<AllRoles />} />
              <Route path="/AllRoles/create/:id" element={<CreateRoles />} />
              <Route
                path="/Teams/HrTeamMembers/:id"
                element={<HrTeamMembers />}
              />
              <Route
                path="/Teams/HrTeamMembers/:id/add"
                element={<TeamMemberForm />}
              />
              <Route path="/Employees" element={<Employees />} />
              <Route path="/Employees/AddEmployee" element={<AddEmployee />} />
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
                path="/Attendance/edit/:id"
                element={<CreateAttendance />}
              />
              <Route
                path="/Attendance/UserAttendance/:id"
                element={<UserAttendance />}
              />
              <Route path="/Leaves" element={<Leaves />} />
              <Route path="/leave-type" element={<LeavesType />} />
              <Route path="/Leaves/view/:id" element={<ViewLeave />} />
              <Route
                path="/leave-type/create/:id"
                element={<CreateLeavesType />}
              />
              <Route path="/Leaves/create/:id" element={<CreateLeave />} />
              <Route
                path="/ViewEmployeeLeave/:id"
                element={<ViewEmployeeLeave />}
              />
              <Route path="/Loan" element={<Loan />} />
              <Route path="/Loan/view/:id" element={<ViewLoan />} />
              <Route path="/Loan/create/:id" element={<CreateLoan />} />
              <Route path="/Payroll" element={<HrPayroll />} />
              <Route path="/Payrolls" element={<Payroll />} />
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
              <Route
                path="/GroupInsurance/AddGroupInsurance"
                element={<AddGroupInsurance />}
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
              <Route path="/CodeTesting" element={<CodeTesting />} />
            </Route>
            {/* <Route path="/SignIn" element={<SignIn />} /> */}
            {/* <Route path="/ViewSurvey/:id" element={<ViewSurvey />} /> */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
export default App;

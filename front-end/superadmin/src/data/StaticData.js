import {
  BsSpeedometer,
  BsBell,
  BsEmojiSmile,
  BsBarChart,
  BsCollectionPlay,
  BsListCheck,
  BsBuilding,
  BsTelephoneInbound,
  BsChatLeftQuote,
  BsCartCheck,
  BsReceiptCutoff,
  BsShopWindow,
  BsDiagram3,
  BsJoystick,
  BsCardChecklist,
  BsSearch,
  BsImages,
  BsUiChecks,
  BsCart,
  BsServer,
  BsReverseLayoutTextSidebarReverse,
  BsFiles,
  BsMegaphone,
  BsFileMedical,
  BsPeople,
  BsListTask,
  BsOutlet,
  BsPerson,
  BsPersonLinesFill,
  BsCashStack,
  BsHourglassSplit,
} from "react-icons/bs";

export const HEADER_TITLE_DEFAULT = "CMS Electricals";

export const CONTRACTOR_MENUBAR = [
  {
    id: 1,
    title: "dashboard",
    icon: <BsSpeedometer className="text-orange" />,
    url: "/",
  },
  {
    id: 2,
    title: "Companies",
    icon: <BsBuilding className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "My Companies",
        url: "/MyCompanies",
      },
      {
        id: 2,
        title: "Sale Companies",
        url: "/SaleCompanies",
      },
      {
        id: 3,
        title: "Purchase Companies",
        url: "/PurchaseCompanies",
      },
      {
        id: 4,
        title: "All Companies",
        url: "/AllCompanies",
      },
    ],
  },
  {
    id: 3,
    title: "Complaint Management",
    icon: <BsTelephoneInbound className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Complaint",
        url: "/create-complaint/new",
      },
      {
        id: 2,
        title: "Requests Complaint",
        url: "/RequestsComplaint",
      },
      {
        id: 3,
        title: "Approved Complaints",
        url: "/ApprovedComplaints",
      },
      {
        id: 4,
        title: "Rejected Complaints",
        url: "/rejected-complaints",
      },
      {
        id: 5,
        title: "Allocate Complaints",
        url: "/Allocate",
      },
      {
        id: 6,
        title: "Resolved Complaints",
        url: "/resolved-complaints",
      },
      {
        id: 7,
        title: "All Complaints",
        url: "/all-complaints",
      },
    ],
  },
  {
    id: 4,
    title: "fund management",
    icon: <BsDiagram3 className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "fund request",
        url: "/fund-request",
      },
      {
        id: 2,
        title: "fund transfer",
        url: "/fund-transfer",
      },
      {
        id: 3,
        title: "fund balance overview",
        url: "/fund-balance-overview",
      },
      {
        id: 4,
        title: "view fund transactions",
        url: "/view-fund-transactions",
      },
    ],
  },
  {
    id: 5,
    title: "stock management",
    icon: <BsSearch className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "stock request",
        url: "/stock-request",
      },
      {
        id: 2,
        title: "stock transfer",
        url: "/stock-transfer",
      },

      {
        id: 3,
        title: "stock balance overview",
        url: "/stock-balance-overview",
      },
      {
        id: 4,
        title: "view stock transactions",
        url: "/view-stock-transactions",
      },
    ],
  },
  {
    id: 6,
    title: "expense management",
    icon: <BsSearch className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "expense request",
        url: "/expense-request",
      },
      {
        id: 2,
        title: "expense punch",
        url: "/expense-punch",
      },

      {
        id: 3,
        title: "expense balance overview",
        url: "/expense-balance-overview",
      },
      {
        id: 4,
        title: "view expense transaction",
        url: "/view-expense-transaction",
      },
    ],
  },
  {
    id: 7,
    title: "stock punch management",
    icon: <BsSearch className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "stock punch request",
        url: "/stock-punch-request",
      },
      {
        id: 2,
        title: "stock punch",
        url: "/stock-punch",
      },
      {
        id: 3,
        title: "stock punch transfer",
        url: "/stock-punch-transfer",
      },
      {
        id: 4,
        title: "stock punch balance overview",
        url: "/stock-punch-balance-overview",
      },

      {
        id: 1,
        title: "view stock transaction",
        url: "/view-stock-transaction",
      },
    ],
  },
  {
    id: 8,
    title: "office inspection",
    icon: <BsSearch className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "office stock inspection",
        url: "/office-expense",
      },
      {
        id: 2,
        title: "office fund inspection",
        url: "/office-fund-inspection",
      },
    ],
  },
  {
    id: 9,
    title: "site inspection",
    icon: <BsSearch className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "site stock inspection",
        url: "/site-expense-inspection",
      },
      {
        id: 2,
        title: "site fund inspection",
        url: "/site-fund-inspection",
      },
    ],
  },
  {
    id: 10,
    title: "billing management",
    icon: <BsReceiptCutoff className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "measurement",
        url: "/Measurements",
      },
      {
        id: 2,
        title: "Performa Invoice",
        url: "/PerformaInvoice",
      },
      {
        id: 3,
        title: "merged performa invoice",
        url: "/merged-pi",
      },
      {
        id: 4,
        title: "Invoice",
        url: "/Invoice",
      },
      {
        id: 5,
        title: "merge invoice",
        url: "/merge-to-invoice",
      },
      {
        id: 6,
        title: "payments",
        url: "/payments/all",
      },
      {
        id: 7,
        title: "payment received",
        url: "/payments/recieved",
      },
      {
        id: 8,
        title: "Retention money",
        url: "/retention",
      },
    ],
  },
  {
    id: 11,
    title: "Paid Invoices",
    icon: <BsReceiptCutoff className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Area Manager",
        icon: <BsReceiptCutoff className="text-orange" />,
        submodules: [
          { id: 1, title: "payment paid", url: "/payment-paid/all" },
          { id: 2, title: "All Manager", url: "/area-manager/all" },
        ],
      },
      {
        id: 2,
        title: "Regional Office",
        icon: <BsReceiptCutoff className="text-orange" />,
        submodules: [
          {
            id: 1,
            title: "All Regional Office",
            url: "/regional-office/all",
          },
          {
            id: 2,
            title: "RO transactions",
            url: "/regional-office/ro-transactions",
          },
          {
            id: 3,
            title: "PO transactions",
            url: "/regional-office/po-transactions",
          },
        ],
      },

      {
        submodules: [
          {
            id: 94,
            title: "Setting",
            icon: <BsReceiptCutoff className="text-orange" />,
            submodules: [
              {
                title: "Create Promotion",
                url: "/setting/create/new",
              },
              {
                title: "Promotion Overview",
                url: "/setting/all-setting-overview",
              },
              {
                title: "Area Manager Ratio",
                url: "/setting/area-manager-ratio/new",
              },
              {
                title: "Area Manager Ratio Overview",
                url: "/setting/area-manager-ratio/all-area-overview",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 12,
    title: "Hr Management",
    icon: <BsPersonLinesFill className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Teams",
        url: "/Teams",
      },
      {
        id: 2,
        title: "Employees",
        url: "/Employees",
      },
      {
        id: 3,
        title: "Attendance",
        url: "/Attendance",
      },
      {
        id: 4,
        title: "Leaves",
        url: "/Leaves",
      },
      {
        id: 5,
        title: "Payroll",
        icon: <BsCashStack className="text-orange" />,
        submodules: [
          { id: 1, title: "Payroll", url: "/Payroll" },
          { id: 2, title: "Payroll Master", url: "/PayrollMaster" },
          { id: 3, title: "Group Insurance", url: "/GroupInsurance" },
          { id: 4, title: "Salary Disbursal", url: "/SalaryDisbursal" },
          { id: 5, title: "Loan", url: "/Loan" },
          { id: 6, title: "PaySlip", url: "/PaySlip" },
          {
            id: 7,
            title: "Employee Promotion Demotion",
            url: "/EmployeePromotionDemotion",
          },
          {
            id: 8,
            title: "Employee Resignation",
            url: "/EmployeeResignation",
          },
          {
            id: 9,
            title: "Employee Retirement",
            url: "/EmployeeRetirement",
          },
          { id: 10, title: "Employee Tracking", url: "/EmployeeTracking" },
          { id: 11, title: "Employee Logs", url: "/EmployeeLogs" },
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Purchase / Sale",
    icon: <BsCartCheck className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Purchase Order",
        url: "/PurchaseOrder",
      },
      {
        id: 2,
        title: "Sale order",
        url: "/sale-order",
      },
    ],
  },
  {
    id: 14,
    title: "Work Quotations",
    icon: <BsChatLeftQuote className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Work Quotation",
        url: "/create-quotation/new",
      },
      {
        id: 2,
        title: "Requested Work Quotation",
        url: "/requested-work-quotation",
      },
      {
        id: 3,
        title: "Approved Work Quotation",
        url: "/approved-work-quotation",
      },
      {
        id: 4,
        title: "Rejected Work Quotation",
        url: "/rejected-work-quotation",
      },
      {
        id: 5,
        title: "All Work Quotation Overview",
        url: "/WorkQuotations",
      },
    ],
  },
  {
    id: 15,
    title: "Suppliers",
    icon: <BsCart className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Supplier",
        url: "/Suppliers/create-supplier/new",
      },
      {
        id: 2,
        title: "Request Supplier",
        url: "/request-supplier",
      },
      {
        id: 3,
        title: "Approved Supplier",
        url: "/approved-supplier",
      },
      {
        id: 4,
        title: "Rejected Supplier",
        url: "/rejected-supplier",
      },
      {
        id: 5,
        title: "All Suppliers Overview",
        url: "/all-suppliers-overview",
      },
    ],
  },
  {
    id: 16,
    title: "Item Master",
    icon: <BsShopWindow className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Item",
        url: `/ItemMaster/add-item-master/new`,
      },
      {
        id: 2,
        title: "Fund Item",
        url: `/ItemMaster/fund-item`,
      },
      {
        id: 3,
        title: "stock Item",
        url: `/ItemMaster/stock-item`,
      },
      {
        id: 4,
        title: "All Items",
        url: `ItemMaster/all-item-overview`,
      },
      {
        id: 5,
        title: "All Brands",
        url: `ItemMaster/all-brand-overview`,
      },
    ],
  },
  {
    id: 17,
    title: "product management",
    icon: <BsShopWindow className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "All Category",
        url: "/product-category",
      },
      {
        id: 2,
        title: "Unit Data",
        url: "/unit-data",
      },
      {
        id: 3,
        title: "Product",
        url: "/ProductService",
      },
    ],
  },
  {
    id: 18,
    title: "Asset Management",
    icon: <BsServer className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Assets",
        url: `/AllAssets/CreateAssets/new`,
      },
      {
        id: 2,
        title: "Request Assets",
        url: `assets/all-requested`,
      },
      {
        id: 3,
        title: "Approved Assets",
        url: `assets/all-approved`,
      },
      {
        id: 4,
        title: "Rejected Assets",
        url: `assets/all-rejected`,
      },
      {
        id: 5,
        title: "Assigned Assets",
        url: `assets/all-assigned`,
      },
      {
        id: 6,
        title: "Repair assets",
        url: `assets/repair`,
      },
      {
        id: 7,
        title: "Scrap assets",
        url: `assets/scrap`,
      },
      {
        id: 8,
        title: "All Assets",
        url: `assets/all`,
      },
    ],
  },
  {
    id: 19,
    title: "Energy Company Team",
    icon: <BsPeople className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Energy team",
        url: `/team/create-energy-team/new`,
      },
      {
        id: 2,
        title: "All Energy Team Overview",
        url: `team/all-energy-team-overview`,
      },
    ],
  },
  {
    id: 20,
    title: "Outlet Management",
    icon: <BsOutlet className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Outlet",
        url: "/outlet/create/new",
      },
      {
        id: 2,
        title: "Requested Outlet",
        url: "/outlet/request",
      },
      {
        id: 3,
        title: "Approved Outlet",
        url: "/outlet/approved",
      },
      {
        id: 4,
        title: "Rejected Outlet",
        url: "/outlet/rejected",
      },
      {
        id: 5,
        title: "All Outlet Overview",
        url: "/outlet/all-outlet-overview",
      },
    ],
  },
  {
    id: 21,
    title: "Work Image Management",
    icon: <BsImages className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Work Image",
        url: "/WorkImages/create/new",
      },
      {
        id: 2,
        title: "Request Work Image",
        url: "workImages/request",
      },
      {
        id: 3,
        title: "Approved Work Image",
        url: "workImages/approved",
      },
      {
        id: 4,
        title: "Rejected Work Image",
        url: "workImages/rejected",
      },
      {
        id: 5,
        title: "All Work Image",
        url: "/WorkImages/all",
      },
    ],
  },
  {
    id: 22,
    title: "Survey",
    icon: <BsCardChecklist className="text-orange" />,
    submodules: [
      { id: 1, title: "Create Survey", url: "/survey/create" },
      { id: 2, title: "Request Survey", url: "/survey/request" },
      { id: 3, title: "Approved Survey", url: "/survey/approved" },
      { id: 4, title: "Rejected Survey", url: "/survey/rejected" },
      {
        id: 5,
        title: "Assigned Survey",
        url: "/survey/assigned-survey",
      },
      {
        id: 6,
        title: "Purpose Master",
        url: "/survey/purpose-master",
      },
      {
        id: 7,
        title: "Response Survey",
        url: "/survey/response-survey",
      },
      {
        id: 8,
        title: "All Survey Overview",
        url: "/survey/all-survey-overview",
      },
    ],
  },
  {
    id: 23,
    title: "Earthing Testing",
    icon: <BsJoystick className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Earthing Testing",
        url: "/earthing-testing/create/new",
      },
      {
        id: 2,
        title: "Request Earthing Testing",
        url: "/earthing-testing/request",
      },
      {
        id: 3,
        title: "Approved Earthing Testing",
        url: "/earthing-testing/approved",
      },
      {
        id: 4,
        title: "Rejected Earthing Testing",
        url: "/earthing-testing/rejected",
      },
      {
        id: 5,
        title: "Allocate Earthing Testing",
        url: "/earthing-testing/allocate",
      },
      {
        id: 6,
        title: "All Earthing Testing",
        url: "/earthing-testing/all",
      },
      {
        id: 7,
        title: "Report Earthing Testing",
        url: "/earthing-testing/report",
      },
    ],
  },
  {
    id: 24,
    title: "company contacts",
    icon: <BsReverseLayoutTextSidebarReverse className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "create contacts",
        url: "contacts/create",
      },

      {
        id: 1,
        title: "company contacts",
        url: "contacts/energy",
      },
      {
        id: 2,
        title: "Dealer Company Contacts",
        url: "contacts/dealer",
      },
      {
        id: 3,
        title: "Supplier Company Contacts",
        url: "contacts/supplier",
      },
      {
        id: 4,
        title: "Client Contacts",
        url: "contacts/client",
      },
      {
        id: 5,
        title: "All Energy company Contacts",
        url: "contacts/all-energy-company-contact",
      },
      {
        id: 6,
        title: "All Messages",
        url: "contacts/all-messages",
      },
    ],
  },
  {
    id: 25,
    title: "Documents",
    icon: <BsFiles className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Document Category",
        url: "/DocumentCategory",
      },
      {
        id: 2,
        title: "Add Document",
        url: "/AddDocument",
      },
      {
        id: 3,
        title: "Documents List",
        url: "/DocumentsLists",
      },
    ],
  },
  {
    id: 26,
    title: "Communication",
    url: "/all-messages",
    icon: <BsMegaphone className="text-orange" />,
  },
  {
    id: 27,
    title: "Reports",
    icon: <BsFileMedical className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Create Reports",
        url: "/reports/create/new",
      },
      {
        id: 2,
        title: "Requested Reports",
        url: "/reports/requested",
      },
      {
        id: 3,
        title: "Approved Reports",
        url: "/reports/approved",
      },
      {
        id: 4,
        title: "Rejected Reports",
        url: "/reports/rejected",
      },
      {
        id: 5,
        title: "All Reports Overview",
        url: "/reports/all-reports-overview",
      },
    ],
  },
  {
    id: 28,
    title: "Task Manager",
    icon: <BsListTask className="text-orange" />,
    submodules: [
      { id: 1, title: "Create Task", url: "/task/create/new" },
      { id: 2, title: "Request Task", url: "/task/request" },
      {
        id: 3,
        title: "Task Category",
        url: "/TaskCategory",
      },
    ],
  },
  {
    id: 29,
    title: "My Profile",
    url: "MyProfile",
    icon: <BsPerson className="text-orange" />,
  },
  {
    id: 30,
    title: "Notifications",
    url: "/AllNotifications",
    icon: <BsBell className="text-orange" />,
  },
  {
    id: 31,
    title: "Feedbacks & Suggestion",
    url: "/FeedbackSuggestion",
    icon: <BsEmojiSmile className="text-orange" />,
  },
  {
    id: 32,
    title: "Tutorials",
    url: "Tutorials",
    icon: <BsCollectionPlay className="text-orange" />,
  },
  {
    id: 33,
    title: "Master Data Manage",
    icon: <BsServer className="text-orange" />,
    submodules: [
      {
        id: 1,
        title: "Bank Management",
        url: "/bank-management",
      },
      {
        id: 2,
        title: "Account Management",
        url: "/account-management",
      },
      {
        id: 3,
        title: "Financial Year",
        url: "/financial-year",
      },
      {
        id: 4,
        title: "Order Via",
        url: "/order-via",
      },
      {
        id: 5,
        title: "Taxes",
        url: "/Taxes",
      },
      {
        id: 6,
        title: "Tax Management",
        url: "/TaxManagement",
      },
      {
        id: 7,
        title: "Bill No. Format",
        url: "/bill-no-format",
      },
      {
        id: 8,
        title: "Employee No. Format",
        url: "/employee-no-format",
      },
      {
        id: 9,
        title: "Client & Vendor No. Format",
        url: "/client-and-vendor-no-format",
      },
      {
        id: 10,
        title: "Item No. Format",
        url: "/item-no-format",
      },
      {
        id: 11,
        title: "Payment Method",
        url: "/payment-method",
      },
      {
        id: 12,
        title: "Add Bank Balance",
        url: "/addBankBalance",
      },
    ],
  },
];

export const FREQUENCY = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Quarter", value: "thisQuarter" },
  { label: "Last Quarter", value: "lastQuarter" },
  { label: "Last 6 Months", value: "last6Months" },
  { label: "Last 12 Months", value: "last12Months" },
];
export const GST_TREATMENT_TYPE = [
  {
    label: "Registered Business – Regular",
    value: "Registered Business – Regular",
  },
  {
    label: "Registered Business – Composition",
    value: "Registered Business – Composition",
  },
  {
    label: "Unregistered Business",
    value: "Unregistered Business",
  },
  { label: "Consumer", value: "Consumer" },
];
export const CONTACTS_TYPE = [
  {
    label: "My Company",
    value: "my_company",
  },
  {
    label: "Oil and Gas",
    value: "oil_and_gas",
  },
  {
    label: "Outlet",
    value: "outlet",
  },
  { label: "Client", value: "client" },
  { label: "Vendor", value: "vendor" },
];
export const STATUS_TYPE = [
  { label: "Active", value: "1" },
  { label: "InActive", value: "0" },
];

export const ACCEPT_ALL_FORMAT = [
  "image/*",
  ".pdf",
  ".txt",
  ".csv",
  ".docx",
  ".xlsx",
];

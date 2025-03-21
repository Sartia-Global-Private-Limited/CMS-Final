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

export const menubar = [
  {
    id: 1,
    nav: [
      {
        menu: "dashboard",
        url: "/",
        icon: <BsSpeedometer className="text-orange" />,
      },
    ],
  },
  {
    id: 2,
    drop: [
      {
        title: "Companies",
        nesicon: <BsBuilding className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "My Companies",
                url: "/MyCompanies",
              },
              {
                nestitle: "Sale Companies",
                url: "/SaleCompanies",
              },
              {
                nestitle: "Purchase Companies",
                url: "/PurchaseCompanies",
              },
              {
                nestitle: "All Companies",
                url: "/AllCompanies",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    drop: [
      {
        title: "Complaint Management",
        nesicon: <BsTelephoneInbound className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Complaint",
                url: "/create-complaint/new",
              },
              {
                nestitle: "Requests Complaint",
                url: "/RequestsComplaint",
              },
              {
                nestitle: "Approved Complaints",
                url: "/ApprovedComplaints",
              },
              {
                nestitle: "Rejected Complaints",
                url: "/rejected-complaints",
              },
              {
                nestitle: "Allocate Complaints",
                url: "/Allocate",
              },
              {
                nestitle: "Resolved Complaints",
                url: "/resolved-complaints",
              },
              {
                nestitle: "All Complaints",
                url: "/all-complaints",
              },
              // {
              //   nestitle: "Stock Request",
              //   url: "/stock-request",
              // },
              // {
              //   nestitle: "Stock Punch",
              //   url: "/stock-punch",
              // },
              // {
              //   nestitle: "Expense Punch",
              //   url: "/expense-punch",
              // },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    drop: [
      {
        title: "fund management",
        nesicon: <BsDiagram3 className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "fund request",
                url: "/fund-request",
              },
              {
                nestitle: "fund transfer",
                url: "/fund-transfer",
              },

              {
                nestitle: "fund balance overview",
                url: "/fund-balance-overview",
              },
            ],
          },
          // {
          //   submenu: [
          //     {
          //       id: 81,
          //       title: "Daily Cash",
          //       icon: <BsCashStack className="text-orange" />,
          //       className: "",
          //       smenu2: [
          //         { title2: "Request Cash", url2: "/RequestCash" },
          //         { title2: "Expense Category", url2: "/expense-category" },
          //         { title2: "Expenses Cash", url2: "/ExpensesCash" },
          //         {
          //           title2: "View Request Expenses",
          //           url2: "/ViewRequestExpenses",
          //         },
          //         { title2: "Balance", url2: "/Balance" },
          //       ],
          //     },
          //     {
          //       id: 82,
          //       title: "Site Items / Goods",
          //       icon: <BsHourglassSplit className="text-orange" />,
          //       className: "my-2",
          //       smenu2: [
          //         { title2: "Request Items", url2: "/RequestItems" },
          //         { title2: "Company Item Stock", url2: "/CompanyItemStock" },
          //         { title2: "Assign Items", url2: "/AssignItems" },
          //       ],
          //     },
          //   ],
          // },
          {
            smenu: [
              {
                nestitle: "view fund transactions",
                url: "/view-fund-transactions",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    drop: [
      {
        title: "stock management",
        nesicon: <BsSearch className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "stock request",
                url: "/stock-request",
              },
              {
                nestitle: "stock transfer",
                url: "/stock-transfer",
              },

              {
                nestitle: "stock balance overview",
                url: "/stock-balance-overview",
              },
              {
                nestitle: "view stock transactions",
                url: "/view-stock-transactions",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    drop: [
      {
        title: "expense management",
        nesicon: <BsSearch className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "expense request",
                url: "/expense-request",
              },
              {
                nestitle: "expense punch",
                url: "/expense-punch",
              },

              {
                nestitle: "expense balance overview",
                url: "/expense-balance-overview",
              },
              {
                nestitle: "view expense transaction",
                url: "/view-expense-transaction",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    drop: [
      {
        title: "stock punch management",
        nesicon: <BsSearch className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "stock punch request",
                url: "/stock-punch-request",
              },
              {
                nestitle: "stock punch",
                url: "/stock-punch",
              },
              {
                nestitle: "stock punch transfer",
                url: "/stock-punch-transfer",
              },
              {
                nestitle: "stock punch balance overview",
                url: "/stock-punch-balance-overview",
              },

              {
                nestitle: "view stock transaction",
                url: "/view-stock-transaction",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 8,
    drop: [
      {
        title: "office inspection",
        nesicon: <BsSearch className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "office stock inspection",
                url: "/office-expense",
              },
              {
                nestitle: "office fund inspection",
                url: "/office-fund-inspection",
              },
              {
                nestitle: "Employee History",
                url: "/office-inspection/employee-history",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 19,
    drop: [
      {
        title: "site inspection",
        nesicon: <BsSearch className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "site stock inspection",
                url: "/site-expense-inspection",
              },
              {
                nestitle: "site fund inspection",
                url: "/site-fund-inspection",
              },
              {
                nestitle: "Outlet History",
                url: "/site-inspection/outlet-history",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 11,
    drop: [
      {
        title: "billing management",
        nesicon: <BsReceiptCutoff className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "measurement",
                url: "/Measurements",
              },
              {
                nestitle: "Performa Invoice",
                url: "/PerformaInvoice",
              },

              {
                nestitle: "merged performa invoice",
                url: "/merged-pi",
              },
              {
                nestitle: "Invoice",
                url: "/Invoice",
              },
              {
                nestitle: "merge invoice",
                url: "/merge-to-invoice",
              },
              {
                nestitle: "payments",
                url: "/payments/all",
              },
              {
                nestitle: "payment received",
                url: "/payments/recieved",
              },
              {
                nestitle: "Retention money",
                url: "/retention",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 35,
    drop: [
      {
        title: "Paid Invoices",
        nesicon: <BsReceiptCutoff className="text-orange" />,
        dropmenu: [
          // {
          //   smenu: [
          //     {
          //       nestitle: "payment paid",
          //       url: "/payment-paid/all",
          //     },
          //   ],
          // },

          {
            submenu: [
              {
                id: 92,
                title: "Area Manager",
                icon: <BsReceiptCutoff className="text-orange" />,
                smenu2: [
                  { title2: "payment paid", url2: "/payment-paid/all" },
                  { title2: "All Manager", url2: "/area-manager/all" },
                ],
              },
            ],
          },

          {
            submenu: [
              {
                id: 93,
                title: "Regional Office",
                icon: <BsReceiptCutoff className="text-orange" />,
                smenu2: [
                  {
                    title2: "All Regional Office",
                    url2: "/regional-office/all",
                  },
                  {
                    title2: "RO transactions",
                    url2: "/regional-office/ro-transactions",
                  },
                  {
                    title2: "PO transactions",
                    url2: "/regional-office/po-transactions",
                  },
                ],
              },
            ],
          },

          {
            submenu: [
              {
                id: 94,
                title: "Setting",
                icon: <BsReceiptCutoff className="text-orange" />,
                smenu2: [
                  {
                    title2: "Create Promotion",
                    url2: "/setting/create/new",
                  },
                  {
                    title2: "Promotion Overview",
                    url2: "/setting/all-setting-overview",
                  },
                  {
                    title2: "Area Manager Ratio",
                    url2: "/setting/area-manager-ratio/new",
                  },
                  {
                    title2: "Area Manager Ratio Overview",
                    url2: "/setting/area-manager-ratio/all-area-overview",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   id: 36,
  //   drop: [
  //     {
  //       title: "Area Manager",
  //       nesicon: <BsReceiptCutoff className="text-orange" />,
  //       dropmenu: [
  //         {
  //           smenu: [
  //             {
  //               nestitle: "All Manager",
  //               url: "/area-manager/all",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 37,
  //   drop: [
  //     {
  //       title: "Setting",
  //       nesicon: <BsReceiptCutoff className="text-orange" />,
  //       dropmenu: [
  //         {
  //           smenu: [
  //             {
  //               nestitle: "Create Promotion",
  //               url: "/setting/create/new",
  //             },
  //             {
  //               nestitle: "Promotion Overview",
  //               url: "/setting/all-setting-overview",
  //             },
  //             {
  //               nestitle: "Create Area Manager Ratio",
  //               url: "/setting/area-manager-ratio/new",
  //             },
  //             {
  //               nestitle: "Area Manager Ratio Overview",
  //               url: "/setting/area-manager-ratio/all-area-overview",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 38,
  //   drop: [
  //     {
  //       title: "Setting",
  //       nesicon: <BsReceiptCutoff className="text-orange" />,
  //       dropmenu: [
  //         {
  //           smenu: [
  //             {
  //               nestitle: "Create Promotion",
  //               url: "/setting/create/new",
  //             },
  //             {
  //               nestitle: "Promotion Overview",
  //               url: "/setting/all-setting-overview",
  //             },
  //             {
  //               nestitle: "Create Area Manager Ratio",
  //               url: "/setting/area-manager-ratio/new",
  //             },
  //             {
  //               nestitle: "Area Manager Ratio Overview",
  //               url: "/setting/area-manager-ratio/all-area-overview",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

  {
    id: 9,
    drop: [
      {
        title: "Hr Management",
        nesicon: <BsPersonLinesFill className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              // {
              //     nestitle: 'Designation & Permissions',
              //     url: '/DesignationPermissions',
              // },
              {
                nestitle: "Teams",
                url: "/Teams",
              },
              {
                nestitle: "Employees",
                url: "/Employees",
              },
              {
                nestitle: "Attendance",
                url: "/Attendance",
              },
              {
                nestitle: "Leaves",
                url: "/Leaves",
              },
            ],
          },

          {
            submenu: [
              {
                id: 91,
                title: "Payroll",
                icon: <BsCashStack className="text-orange" />,
                smenu2: [
                  { title2: "Payroll", url2: "/Payroll" },
                  { title2: "Payroll Master", url2: "/PayrollMaster" },
                  // { title2: "Time-Sheet", url2: "/TimeSheet" },
                  { title2: "Group Insurance", url2: "/GroupInsurance" },
                  { title2: "Salary Disbursal", url2: "/SalaryDisbursal" },
                  { title2: "Loan", url2: "/Loan" },
                  { title2: "PaySlip", url2: "/PaySlip" },
                  {
                    title2: "Employee Promotion Demotion",
                    url2: "/EmployeePromotionDemotion",
                  },
                  {
                    title2: "Employee Resignation",
                    url2: "/EmployeeResignation",
                  },
                  {
                    title2: "Employee Retirement",
                    url2: "/EmployeeRetirement",
                  },
                  { title2: "Employee Tracking", url2: "/EmployeeTracking" },
                  { title2: "Employee Logs", url2: "/EmployeeLogs" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 10,
    drop: [
      {
        title: "Purchase / Sale",
        nesicon: <BsCartCheck className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Purchase Order",
                url: "/PurchaseOrder",
              },
              {
                nestitle: "Sale order",
                url: "/sale-order",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 27,
    drop: [
      {
        title: "Work Quotations",
        nesicon: <BsChatLeftQuote className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Work Quotation",
                url: "/create-quotation/new",
              },
              {
                nestitle: "Requested Work Quotation",
                url: "/requested-work-quotation",
              },
              {
                nestitle: "Approved Work Quotation",
                url: "/approved-work-quotation",
              },
              {
                nestitle: "Rejected Work Quotation",
                url: "/rejected-work-quotation",
              },
              {
                nestitle: "All Work Quotation Overview",
                url: "/WorkQuotations",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 12,
    drop: [
      {
        title: "Suppliers",
        nesicon: <BsCart className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Supplier",
                url: "/Suppliers/create-supplier/new",
              },
              {
                nestitle: "Request Supplier",
                url: "/request-supplier",
              },
              {
                nestitle: "Approved Supplier",
                url: "/approved-supplier",
              },
              {
                nestitle: "Rejected Supplier",
                url: "/rejected-supplier",
              },
              {
                nestitle: "All Suppliers Overview",
                url: "/all-suppliers-overview",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 14,
    drop: [
      {
        title: "Item Master",
        nesicon: <BsShopWindow className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Item",
                url: `/ItemMaster/add-item-master/new`,
              },
              {
                nestitle: "Fund Item",
                url: `/ItemMaster/fund-item`,
              },
              {
                nestitle: "stock Item",
                url: `/ItemMaster/stock-item`,
              },

              {
                nestitle: "All Items",
                url: `ItemMaster/all-item-overview`,
              },
              {
                nestitle: "All Brands",
                url: `ItemMaster/all-brand-overview`,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 39,
    drop: [
      {
        title: "product management",
        nesicon: <BsShopWindow className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "All Category",
                url: "/product-category",
              },
              {
                nestitle: "Unit Data",
                url: "/unit-data",
              },
              {
                nestitle: "Product",
                url: "/ProductService",
              },
            ],
          },
        ],
      },
    ],
  },

  // {
  //   id: 14,
  //   drop: [
  //     {
  //       title: "Category / Product",
  //       nesicon: <BsShopWindow className="text-orange" />,
  //       dropmenu: [
  //         {
  //           submenu: [
  //             {
  //               id: 92,
  //               title: "Item Master",
  //               icon: <BsUiChecks className="text-orange" />,
  //               smenu2: [
  //                 {
  //                   title2: "Create Item",
  //                   url2: `/ItemMaster/add-item-master/new`,
  //                 },
  //                 {
  //                   title2: "Fund Item",
  //                   url2: `/ItemMaster/request-item`,
  //                 },
  //                 {
  //                   title2: "stock Item",
  //                   url2: `/ItemMaster/request-item`,
  //                 },

  //                 {
  //                   title2: "All Items",
  //                   url2: `ItemMaster/all-item-overview`,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           smenu: [
  //             {
  //               nestitle: "All Category",
  //               url: "/product-category",
  //             },
  //             {
  //               nestitle: "Unit Data",
  //               url: "/unit-data",
  //             },
  //             {
  //               nestitle: "Product",
  //               url: "/ProductService",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: 15,
    drop: [
      {
        title: "Asset Management",
        nesicon: <BsServer className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Assets",
                url: `/AllAssets/CreateAssets/new`,
              },
              {
                nestitle: "Request Assets",
                url: `assets/all-requested`,
              },
              {
                nestitle: "Approved Assets",
                url: `assets/all-approved`,
              },
              {
                nestitle: "Rejected Assets",
                url: `assets/all-rejected`,
              },
              {
                nestitle: "Assigned Assets",
                url: `assets/all-assigned`,
              },

              {
                nestitle: "Repair assets",
                url: `assets/repair`,
              },

              {
                nestitle: "Scrap assets",
                url: `assets/scrap`,
              },
              {
                nestitle: "All Assets",
                url: `assets/all`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 16,
    drop: [
      {
        title: "Energy Company Team",
        nesicon: <BsPeople className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Energy team",
                url: `/team/create-energy-team/new`,
              },
              {
                nestitle: "All Energy Team Overview",
                url: `team/${"all-energy-team-overview"}`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 17,
    drop: [
      {
        title: "Outlet Management",
        nesicon: <BsOutlet className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Outlet",
                url: "/outlet/create/new",
              },
              {
                nestitle: "Requested Outlet",
                url: "/outlet/request",
              },
              {
                nestitle: "Approved Outlet",
                url: "/outlet/approved",
              },
              {
                nestitle: "Rejected Outlet",
                url: "/outlet/rejected",
              },
              // {
              //   nestitle: "Dealer Outlet",
              //   url: "/outlet/dealer-outlet",
              // },
              {
                nestitle: "All Outlet Overview",
                url: "/outlet/all-outlet-overview",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 18,
    drop: [
      {
        title: "Work Image Management",
        nesicon: <BsImages className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Work Image",
                url: "/WorkImages/create/new",
              },
              {
                nestitle: "Request Work Image",
                url: "workImages/request",
              },
              {
                nestitle: "Approved Work Image",
                url: "workImages/approved",
              },
              {
                nestitle: "Rejected Work Image",
                url: "workImages/rejected",
              },
              {
                nestitle: "All Work Image",
                url: "/WorkImages/all",
              },
            ],
          },
        ],
      },
    ],
  },

  // {
  //   id: 18,
  //   drop: [
  //     {
  //       title: "Work Image Management",
  //       nesicon: <BsImages className="text-orange" />,
  //       dropmenu: [
  //         {
  //           smenu: [
  //             {
  //               nestitle: "Create Work Image",
  //               url: "/WorkImages/create-work-image/new",
  //             },
  //             {
  //               nestitle: "Request Work Image",
  //               url: "/request-work-image",
  //             },
  //             {
  //               nestitle: "Approved Work Image",
  //               url: "/approved-work-image",
  //             },
  //             {
  //               nestitle: "Rejected Work Image",
  //               url: "/rejected-work-image",
  //             },
  //             {
  //               nestitle: "All Work Image",
  //               url: "/WorkImages",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

  {
    id: 20,
    drop: [
      {
        title: "Survey",
        nesicon: <BsCardChecklist className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              { nestitle: "Create Survey", url: "/survey/create" },
              { nestitle: "Request Survey", url: "/survey/request" },
              { nestitle: "Approved Survey", url: "/survey/approved" },
              { nestitle: "Rejected Survey", url: "/survey/rejected" },
              {
                nestitle: "Assigned Survey",
                url: "/survey/assigned-survey",
              },
              {
                nestitle: "Purpose Master",
                url: "/survey/purpose-master",
              },
              {
                nestitle: "Response Survey",
                url: "/survey/response-survey",
              },
              {
                nestitle: "All Survey Overview",
                url: "/survey/all-survey-overview",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 21,
    drop: [
      {
        title: "Earthing Testing",
        nesicon: <BsJoystick className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Earthing Testing",
                url: "/earthing-testing/create/new",
              },
              {
                nestitle: "Request Earthing Testing",
                url: "/earthing-testing/request",
              },
              {
                nestitle: "Approved Earthing Testing",
                url: "/earthing-testing/approved",
              },
              {
                nestitle: "Rejected Earthing Testing",
                url: "/earthing-testing/rejected",
              },
              {
                nestitle: "Allocate Earthing Testing",
                url: "/earthing-testing/allocate",
              },
              {
                nestitle: "All Earthing Testing",
                url: "/earthing-testing/all",
              },

              {
                nestitle: "Report Earthing Testing",
                url: "/earthing-testing/report",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 22,
    drop: [
      {
        title: "company contacts",
        nesicon: <BsReverseLayoutTextSidebarReverse className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "create contacts",
                url: "contacts/create",
              },

              {
                nestitle: "company contacts",
                url: "contacts/energy",
              },
              {
                nestitle: "Dealer Company Contacts",
                url: "contacts/dealer",
              },
              {
                nestitle: "Supplier Company Contacts",
                url: "contacts/supplier",
              },
              {
                nestitle: "Client Contacts",
                url: "contacts/client",
              },
              {
                nestitle: "All Energy company Contacts",
                url: "contacts/all-energy-company-contact",
              },
              {
                nestitle: "All Messages",
                url: "contacts/allmessages",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 23,
    drop: [
      {
        title: "Documents",
        nesicon: <BsFiles className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Document Category",
                url: "/DocumentCategory",
              },
              {
                nestitle: "Add Document",
                url: "/AddDocument",
              },
              {
                nestitle: "Documents List",
                url: "/DocumentsLists",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 24,
    nav: [
      {
        menu: "Communication",
        url: "/all-messages",
        icon: <BsMegaphone className="text-orange" />,
      },
    ],
  },
  {
    id: 25,
    drop: [
      {
        title: "Reports",
        nesicon: <BsFileMedical className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Create Reports",
                url: "/reports/create/new",
              },
              {
                nestitle: "Requested Reports",
                url: "/reports/requested",
              },
              {
                nestitle: "Approved Reports",
                url: "/reports/approved",
              },
              {
                nestitle: "Rejected Reports",
                url: "/reports/rejected",
              },
              {
                nestitle: "All Reports Overview",
                url: "/reports/all-reports-overview",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 26,
    drop: [
      {
        title: "Task Manager",
        nesicon: <BsListTask className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              { nestitle: "Create Task", url: "/task/create/new" },
              { nestitle: "Request Task", url: "/task/request" },
              // { nestitle: "Approved Task", url: "task/approved-task" },
              // { nestitle: "Rejected Task", url: "task/rejected-task" },
              // { nestitle: "Assigned Task", url: "task/assigned-task" },
              {
                nestitle: "Task Category",
                url: "/TaskCategory",
              },
              // { nestitle: "All Task Overview", url: "/task/all-task-overview" },
            ],
          },
        ],
      },
    ],
  },

  // {
  //   id: 28,
  //   nav: [
  //     {
  //       menu: "Stocks",
  //       url: "/Stock",
  //       icon: <BsBarChart className="text-orange" />,
  //     },
  //   ],
  // },
  // {
  //   id: 125,
  //   nav: [
  //     {
  //       menu: "Vendor",
  //       url: "/vendor",
  //       icon: <BsCart className="text-orange" />,
  //     },
  //   ],
  // },
  {
    id: 29,
    nav: [
      {
        menu: "My Profile",
        url: "MyProfile",
        icon: <BsPerson className="text-orange" />,
      },
    ],
  },
  {
    id: 30,
    nav: [
      {
        menu: "Notifications",
        url: "/AllNotifications",
        icon: <BsBell className="text-orange" />,
      },
    ],
  },
  {
    id: 31,
    nav: [
      {
        menu: "Feedbacks & Suggestion",
        url: "/FeedbackSuggestion",
        icon: <BsEmojiSmile className="text-orange" />,
      },
    ],
  },
  {
    id: 32,
    nav: [
      {
        menu: "Tutorials",
        url: "Tutorials",
        icon: <BsCollectionPlay className="text-orange" />,
      },
    ],
  },
  // {
  //   id: 33,
  //   nav: [
  //     {
  //       menu: "Plan & Pricing",
  //       url: "PlanPricing",
  //       icon: <BsListCheck className="text-orange" />,
  //     },
  //   ],
  // },
  {
    id: 34,
    drop: [
      {
        title: "Master Data Manage",
        nesicon: <BsServer className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Bank Management",
                url: "/bank-management",
              },
              {
                nestitle: "Account Management",
                url: "/account-management",
              },
              {
                nestitle: "Financial Year",
                url: "/financial-year",
              },
              {
                nestitle: "Order Via",
                url: "/order-via",
              },
              {
                nestitle: "Taxes",
                url: "/Taxes",
              },
              {
                nestitle: "Tax Management",
                url: "/TaxManagement",
              },
              {
                nestitle: "Bill No. Format",
                url: "/bill-no-format",
              },
              {
                nestitle: "Employee No. Format",
                url: "/employee-no-format",
              },
              {
                nestitle: "Client & Vendor No. Format",
                url: "/client-and-vendor-no-format",
              },
              {
                nestitle: "Item No. Format",
                url: "/item-no-format",
              },
              {
                nestitle: "Payment Method",
                url: "/payment-method",
              },

              {
                nestitle: "Add Bank Balance",
                url: "/addBankBalance",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const findActiveDropdownId = (menuArray, targetUrl) => {
  for (const menu of menuArray) {
    if (menu.nav && menu.nav[0].url === targetUrl) {
      return menu.id;
    }

    if (menu.drop) {
      for (const content of menu.drop) {
        for (const submenu of content.dropmenu) {
          if (Array.isArray(submenu.smenu)) {
            for (const smenuItem of submenu.smenu) {
              if (smenuItem.url === targetUrl) {
                return menu.id;
              }
            }
          }
          if (Array.isArray(submenu.submenu)) {
            for (const submenu2 of submenu.submenu) {
              if (Array.isArray(submenu2.smenu2)) {
                for (const smenu2Item of submenu2.smenu2) {
                  if (smenu2Item.url2 === targetUrl) {
                    return menu.id;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return null; // Return null if the URL is not found
};
export const findActiveSubDropdownId = (body, targetUrl) => {
  let menuid = null;
  body?.submenu?.map((item) => {
    item?.smenu2?.filter((sub) => {
      if (sub.url2 === targetUrl) {
        menuid = item.id;
      }
    });
  });
  return menuid;
};

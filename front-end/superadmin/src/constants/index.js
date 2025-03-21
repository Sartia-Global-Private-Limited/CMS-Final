import {
  BsSpeedometer,
  BsPeopleFill,
  BsEmojiSmileFill,
  BsFillCollectionPlayFill,
  BsCardChecklist,
  BsBarChart,
  BsGlobe,
  BsToggles2,
  BsHandIndexThumbFill,
  BsHeadphones,
  BsListCheck,
  BsReceipt,
  BsBellFill,
  BsFiles,
  BsListTask,
  BsBuilding,
  BsPersonLinesFill,
  BsCashStack,
  BsExclamationDiamond,
  BsGenderTrans,
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
    nav: [
      {
        menu: "Analytics",
        url: "/Analytics",
        icon: <BsBarChart className="text-orange" />,
      },
    ],
  },
  {
    id: 3,
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
    id: 4,
    drop: [
      {
        title: "Master Data",
        nesicon: <BsGlobe className="text-orange" />,
        dropmenu: [
          {
            submenu: [
              {
                title: "Energy Company",
                icon: <BsBuilding className="text-orange" />,
                smenu2: [
                  { title2: "Energy", url2: "EnergyMasterdata" },
                  { title2: "Zone", url2: "ZoneMasterdata" },
                  { title2: "Regional", url2: "RegionalMasterdata" },
                  { title2: "Sales Area", url2: "SalesAreaMasterdata" },
                  { title2: "District", url2: "DistrictMasterdata" },
                  { title2: "Outlets", url2: "OutletsMasterdata" },
                ],
              },
            ],
          },
          {
            smenu: [
              {
                nestitle: "Energy Team",
                url: "/EnergyTeamMasterdata",
              },
              {
                nestitle: "Dealers",
                url: "/DealersMasterdata",
              },
              {
                nestitle: "Contractors",
                url: "/ContractorsMasterdata",
              },
            ],
          },
          {
            submenu: [
              {
                title: "Complaints",
                icon: <BsExclamationDiamond className="text-orange" />,
                smenu2: [
                  {
                    title2: "Order Via",
                    url2: "order-via",
                  },
                  {
                    title2: "Complaint Types",
                    url2: "ComplaintTypesMasterdata",
                  },
                  //   { title2: "All Complaints", url2: "AllComplaintsMasterdata" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    nav: [
      {
        menu: "All Complaints",
        url: "/AllComplaintsMasterdata",
        icon: <BsPeopleFill className="text-orange" />,
      },
    ],
  },
  {
    id: 6,
    nav: [
      {
        menu: "Enable & Disable Features",
        url: "/EnableDisableFeatures",
        icon: <BsToggles2 className="text-orange" />,
      },
    ],
  },
  {
    id: 7,
    nav: [
      {
        menu: "Software Activation",
        url: "/SoftwareActivation",
        icon: <BsHandIndexThumbFill className="text-orange" />,
      },
    ],
  },
  {
    id: 8,
    nav: [
      {
        menu: "Feedbacks & Suggestions",
        url: "/SuggestionsFeedbacks",
        icon: <BsEmojiSmileFill className="text-orange" />,
      },
    ],
  },
  {
    id: 9,
    drop: [
      {
        title: "Contacts",
        nesicon: <BsHeadphones className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              // {
              //     nestitle: 'Create Contacts',
              //     url: '/CreateContacts',
              // },
              // {
              //     nestitle: 'All Contacts',
              //     url: '/AllContacts',
              // },
              {
                nestitle: "Contractors",
                url: "/contractors-contacts",
              },
              {
                nestitle: "Energy Companies",
                url: "/energy-companies-contacts",
              },
              {
                nestitle: "Dealers",
                url: "/dealers-contacts",
              },
              {
                nestitle: "Super Admin",
                url: "/super-admin-contacts",
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
        title: "Task Manager",
        nesicon: <BsListTask className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "Task Dashboard",
                url: "/TaskDashboard",
              },
              {
                nestitle: "Task Category",
                url: "/TaskCategory",
              },
              {
                nestitle: "All Task",
                url: "/AllTask",
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
        title: "Survey",
        nesicon: <BsCardChecklist className="text-orange" />,
        dropmenu: [
          {
            smenu: [
              {
                nestitle: "All Survey",
                url: "/AllSurvey",
              },
              {
                nestitle: "Item Master",
                url: "/ItemMaster",
              },
              {
                nestitle: "Purpose Master",
                url: "/PurposeMaster",
              },
              {
                nestitle: "Assigned Survey",
                url: "/AssignedSurvey",
              },
              {
                nestitle: "Request Survey",
                url: "/RequestSurvey",
              },
              {
                nestitle: "Response Survey",
                url: "/ResponseSurvey",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 12,
    nav: [
      {
        menu: "All Roles",
        url: "/AllRoles",
        icon: <BsGenderTrans className="text-orange" />,
      },
    ],
  },
  {
    id: 13,
    nav: [
      {
        menu: "Term & Conditions",
        url: "/TermConditions",
        icon: <BsFillCollectionPlayFill className="text-orange" />,
      },
    ],
  },
  {
    id: 14,
    drop: [
      {
        title: "HR Management",
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
                nestitle: "Leaves Type",
                url: "/LeavesType",
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
                title: "Payroll",
                icon: <BsCashStack className="text-orange" />,
                smenu2: [
                  // { title2: 'Payroll', url2: 'Payroll' },
                  { title2: "Payroll Master", url2: "PayrollMaster" },
                  // { title2: 'Time-Sheet', url2: 'TimeSheet' },
                  { title2: "Group Insurance", url2: "GroupInsurance" },
                  { title2: "Salary Disbursal", url2: "SalaryDisbursal" },
                  { title2: "Loan", url2: "Loan" },
                  { title2: "PaySlip", url2: "PaySlip" },
                  {
                    title2: "Employee Promotion Demotion",
                    url2: "EmployeePromotionDemotion",
                  },
                  {
                    title2: "Employee Resignation",
                    url2: "EmployeeResignation",
                  },
                  { title2: "Employee Retirement", url2: "EmployeeRetirement" },
                  { title2: "Employee Tracking", url2: "EmployeeTracking" },
                  { title2: "Employee Logs", url2: "EmployeeLogs" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    nav: [
      {
        menu: "Notifications",
        url: "AllNotifications",
        icon: <BsBellFill className="text-orange" />,
      },
    ],
  },
  {
    id: 16,
    nav: [
      {
        menu: "Messages",
        url: "AllMessages",
        icon: <BsBellFill className="text-orange" />,
      },
    ],
  },
  {
    id: 17,
    nav: [
      {
        menu: "Tutorials",
        url: "/Tutorials",
        icon: <BsFillCollectionPlayFill className="text-orange" />,
      },
    ],
  },
  {
    id: 18,
    nav: [
      {
        menu: "Plan & Pricing",
        url: "/PlanPricing",
        icon: <BsListCheck className="text-orange" />,
      },
    ],
  },
  {
    id: 19,
    nav: [
      {
        menu: "Billings",
        url: "/Billings",
        icon: <BsReceipt className="text-orange" />,
      },
    ],
  },
  {
    id: 20,
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
];

export const findActiveDropdownId = (menuArray, targetUrl) => {
  for (const menu of menuArray) {
    if (menu.path === targetUrl) {
      return menu.id;
    }

    for (const submodule of menu.submodules) {
      if (submodule.path === targetUrl) {
        return menu.id;
        // return console.log("first", submodule.id);
      }

      for (const moduleOfSubModule of submodule?.modulesOfSubModule) {
        if (moduleOfSubModule.path === targetUrl) {
          return menu.id;
        }
      }
    }
  }

  return null; // Return null if the URL is not found
};

export const findActiveSubDropdownId = (body, targetUrl) => {
  // if (!body) return null;
  let menuid = null;
  const acb = body.modulesOfSubModule.find((item) => item.path === targetUrl);
  menuid = acb?.sub_module_id || null;
  // console.log("abc", acb);
  // body?.modulesOfSubModule?.map((item) => {

  // });
  return menuid;
};

const allRoutes = {
    dashboard: require("./dashboardRoutes"),
    company: require("./companyRoutes"),
    "oil-and-gas": require("./oilGasCompanyTeamRoutes"),
    "fuel-station": require("./fuelStationRoutes"),
    suppliers: require("./supplierRoutes"),
    billing: require("./billingRoutes"),
    complaints: require("./complaintRoutes"),
    billing: require("./billingRoutes"),
    fund: require("./fundRoutes"),
    expense: require("./expenseRoutes"),
    stock: require("./stockRoutes"),
    "stock-punch": require("./stockPunchRoutes"),
    "office-inspection": require("./officeInspectionRoutes"),
    "site-inspection": require("./siteInspectionRoutes"),
    quotations: require("./quotationRoutes"),
    "feedback-suggestion": require("./feedbackSuggestionRoutes"),
    "master-data": require("./masterDataRoutes"),
    "item-master": require("./itemMasterRoutes"),
    "purchase-sale": require("./purchaseSaleRoutes"),
    profile: require("./profileRoutes"),
    tutorials: require("./tutorialRoutes"),
    "product-management": require("./productManagementRoutes"),
    communication: require("./communicationRoutes"),
    task: require("./taskRoutes"),
    assets: require("./assetsRoutes"),
    "hr-teams": require("./hrTeamsRoutes"),
    "hr-employees": require("./hrEmployeesRoutes"),
    "hr-attendance": require("./hrAttendanceRoutes"),
    "hr-leaves": require("./hrLeaveRoutes"),
    "hr-leave-type": require("./hrLeaveTypeRoutes"),
    payroll: require("./payrollRoutes"),
    survey: require("./surveyRoutes"),
    "earthing-testing": require("./earthingTestingRoutes"),
    documents: require("./documentRoutes"),
    "energy-company": require("./energyCompanyRoutes"),
    zone: require("./zoneRoutes"),
    "regional-office": require("./regionalOfficeRoutes"),
    "sales-area": require("./salesAreaRoutes"),
    district: require("./districtRoutes"),
    outlets: require("./outletRoutes"),
    contractor: require("./contractorRoutes"),
    "complaint-subtype": require("./complaintSubTypeRoutes"),
    contacts: require("./contactRoutes"),
    "roles-permission": require("./rolePermissionRoutes"),
    plan: require("./planRoutes"),
};

function setupRoutes(router, prefix, routeKeys) {
    routeKeys.forEach((key) => {
        // console.log(`${prefix}/${key}`);
        if (allRoutes[key]) {
            router.use(`${prefix}/${key}`, allRoutes[key]);
        }
    });
}

module.exports = {
    allRoutes,
    setupRoutes,
};

// const allRoutes = {
//     dashboard: { routeName: "/dashboard", module: require("./dashboardRoutes") },
//     // superAdminDashboard: { routeName: "/dashboard", module: require("./superadminDashboardRoutes") }, // Superadmin-specific dashboard
//     company: { routeName: "/company", module: require("./companyRoutes") },
//     oilAndGas: { routeName: "/oil-gas", module: require("./oilGasCompanyTeamRoutes") },
//     fuelStation: { routeName: "/fuel-station", module: require("./fuelStationRoutes") },
//     suppliers: { routeName: "/suppliers", module: require("./supplierRoutes") },
//     complaints: { routeName: "/complaints", module: require("./complaintRoutes") },
//     fund: { routeName: "/fund", module: require("./fundRoutes") },
//     expense: { routeName: "/expense", module: require("./expenseRoutes") },
//     stock: { routeName: "/stock", module: require("./stockRoutes") },
//     officeInspection: { routeName: "/office-inspection", module: require("./officeInspectionRoutes") },
//     siteInspection: { routeName: "/site-inspection", module: require("./siteInspectionRoutes") },
//     quotations: { routeName: "/quotations", module: require("./quotationRoutes") },
//     feedbackAndSuggestion: { routeName: "/feedback-suggestion", module: require("./feedbackSuggestionRoutes") },
//     masterData: { routeName: "/master-data", module: require("./masterDataRoutes") },
//     profile: { routeName: "/profile", module: require("./profileRoutes") },
//     tutorials: { routeName: "/tutorials", module: require("./tutorialRoutes") },
//     productManagement: { routeName: "/product-management", module: require("./productManagementRoutes") },
//     assets: { routeName: "/assets", module: require("./assetsRoutes") },
//     hrTeams: { routeName: "/hr-teams", module: require("./hrTeamsRoutes") },
//     hrEmployees: { routeName: "/hr-employees", module: require("./hrEmployeesRoutes") },
//     hrAttendance: { routeName: "/hr-attendance", module: require("./hrAttendanceRoutes") },
//     hrLeaves: { routeName: "/hr-leaves", module: require("./hrLeaveRoutes") },
//     payroll: { routeName: "/payroll", module: require("./payrollRoutes") },
//     survey: { routeName: "/survey", module: require("./surveyRoutes") },
//     earthingTesting: { routeName: "/earthing-testing", module: require("./earthingTestingRoutes") },
//     documents: { routeName: "/documents", module: require("./documentRoutes") },
// };

// // Updated setupRoutes function
// function setupRoutes(router, prefix, routeKeys) {
//     routeKeys.forEach((key) => {
//         const route = allRoutes[key];

//         // If the route exists, check if it's an object with `routeName` and `module`
//         if (route) {
//             const path = route.routeName || `/${key}`; // Default to the key if routeName is not defined
//             const module = route.module || route; // If it's an object, use the module, otherwise use the route itself

//             router.use(`${prefix}${path}`, module);
//         }
//     });
// }

// // Usage Example
// module.exports = {
//     allRoutes,
//     setupRoutes,
// };

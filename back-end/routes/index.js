const router = require("express").Router();
const { setupRoutes, allRoutes } = require("./common/commonRoutes");

//contractor
const excludeRoutesForContractor = [
    "energy-company",
    "zone",
    "regional-office",
    "sales-area",
    "district",
    // "outlets",
    "contractor",
    "complaint-subtype",
    "plan",
];
const contractorRoutes = Object.keys(allRoutes).filter((route) => !excludeRoutesForContractor.includes(route));

setupRoutes(router, "/contractor", contractorRoutes);

//super admin
const excludeRoutesForSuperAdmin = [
    "suppliers",
    "fund",
    "expense",
    "stock",
    "stock-punch",
    "office-inspection",
    "site-inspection",
    "product-management",
    "assets",
];

const superAdminRoutes = Object.keys(allRoutes).filter((route) => !excludeRoutesForSuperAdmin.includes(route));
setupRoutes(router, "/super-admin", superAdminRoutes);

module.exports = router;

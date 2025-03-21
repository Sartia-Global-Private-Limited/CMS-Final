const {
    addOutlet,
    getAllOutlet,
    editOutlet,
    updateOutlet,
    removeOutletById,
    getOutletByDistrictId,
    getOutletByEnergyCompanyId,
    getOutletById,
    getZonesForOutlets,
    getRegionalOfficeOnZoneForOutlets,
    getSalesAreaOnRegionalForOutlets,
    getDistrictOnSalesAreaForOutlets,
} = require("../../controllers/outletController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const outletRouter = require("express").Router();

outletRouter.post("/add-outlet", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), addOutlet);
outletRouter.get("/all-outlets", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllOutlet);
outletRouter.get("/get-outlet/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getOutletById);
outletRouter.get("/edit-outlet/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), editOutlet);
outletRouter.post("/update-outlet", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), updateOutlet);
outletRouter.delete("/delete-outlet/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), removeOutletById);
outletRouter.get(
    "/get-outlet-by-district-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    getOutletByDistrictId
);
outletRouter.get(
    "/get-outlet-by-energy-company-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    getOutletByEnergyCompanyId
);
outletRouter.get(
    "/get-all-zone-for-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getZonesForOutlets
);
outletRouter.get(
    "/get-all-regional-office-for-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getRegionalOfficeOnZoneForOutlets
);
outletRouter.get(
    "/get-all-sales-area-for-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getSalesAreaOnRegionalForOutlets
);
outletRouter.get(
    "/get-all-district-for-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getDistrictOnSalesAreaForOutlets
);
module.exports = outletRouter;

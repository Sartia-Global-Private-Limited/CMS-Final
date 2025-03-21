const {
    addDistrict,
    getDistricts,
    getActiveDistricts,
    editDistrictById,
    updateDistrictById,
    removeDistrictById,
    getAllDistrictBySaleAreaId,
    getDistrictById,
} = require("../../controllers/districtController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const districtRouter = require("express").Router();

districtRouter.post("/add-district", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, addDistrict);
districtRouter.get("/all-districts", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getDistricts);
districtRouter.get(
    "/get-district/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getDistrictById
);
districtRouter.get(
    "/active-districts",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getActiveDistricts
);
districtRouter.get(
    "/edit-district/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editDistrictById
);
districtRouter.post(
    "/update-district",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateDistrictById
);
districtRouter.delete(
    "/delete-district/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeDistrictById
);
districtRouter.get(
    "/get-all-district-on-sale-area-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllDistrictBySaleAreaId
);

module.exports = districtRouter;

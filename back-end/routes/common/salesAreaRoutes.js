const {
    addSalesArea,
    getSalesArea,
    getSalesAreaById,
    getActiveSalesArea,
    editSalesArea,
    updateSalesArea,
    deleteSalesArea,
} = require("../../controllers/salesAreaController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const salesAreaRouter = require("express").Router();

salesAreaRouter.post("/add-sales-area", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, addSalesArea);
salesAreaRouter.get("/sales-area", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, getSalesArea);
salesAreaRouter.get(
    "/sales-area-by-id/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSalesAreaById
);
salesAreaRouter.get(
    "/active-sales-area",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getActiveSalesArea
);
salesAreaRouter.get(
    "/edit-sales-area/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editSalesArea
);
salesAreaRouter.post(
    "/update-sales-area",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSalesArea
);
salesAreaRouter.delete(
    "/delete-sales-area/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteSalesArea
);

module.exports = salesAreaRouter;

const { applyLeave } = require("../../controllers/leaveApplicationController");
const { createLeaveType, getAllLeaveType, getAllActiveLeaveType, getAllLeaveTypeById, updateLeaveType, deleteLeaveType } = require("../../controllers/leaveTypeController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const hrLeaveTypeRouter = require("express").Router();

hrLeaveTypeRouter.post(
    "/create-leave-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createLeaveType
);
hrLeaveTypeRouter.get(
    "/get-all-leave-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllLeaveType
);
hrLeaveTypeRouter.get(
    "/get-active-leave-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllActiveLeaveType
);
hrLeaveTypeRouter.get(
    "/get-leave-type-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllLeaveTypeById
);
hrLeaveTypeRouter.post(
    "/update-leave-type-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateLeaveType
);
hrLeaveTypeRouter.delete(
    "/delete-leave-type/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteLeaveType
);
hrLeaveTypeRouter.post(
    "/apply-leave",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    applyLeave
);

module.exports = hrLeaveTypeRouter;

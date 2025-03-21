const {
    addComplaintSubType,
    getAllComplaintSubTypes,
    getComplaintSubTypeById,
    updateComplaintSubType,
} = require("../../controllers/complaintSubTypeController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const complaintSubTypeRouter = require("express").Router();

complaintSubTypeRouter.post(
    "/create-complaint-sub-type",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addComplaintSubType
);
complaintSubTypeRouter.get(
    "/get-all-complaints-sub-types",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllComplaintSubTypes
);
complaintSubTypeRouter.get(
    "/get-single-complaint-sub-type/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getComplaintSubTypeById
);
complaintSubTypeRouter.post(
    "/update-complaint-sub-types-details",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateComplaintSubType
);

module.exports = complaintSubTypeRouter;

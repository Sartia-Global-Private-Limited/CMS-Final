const {
    createRegionalOffice,
    getAllRegionalOffices,
    getActiveRegionalOffices,
    editRegionalOffice,
    updateRegionalOffice,
    deleteRegionalOffice,
    getRegionalOfficeById,
} = require("../../controllers/regionalOfficeController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const regionalOfficeRouter = require("express").Router();

regionalOfficeRouter.post(
    "/create-regional-office",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createRegionalOffice
);
regionalOfficeRouter.get(
    "/all-regional-offices",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllRegionalOffices
);
regionalOfficeRouter.get(
    "/get-regional-office/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRegionalOfficeById
);
regionalOfficeRouter.get(
    "/active-regional-offices",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getActiveRegionalOffices
);
regionalOfficeRouter.get(
    "/edit-regional-office/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editRegionalOffice
);
regionalOfficeRouter.post(
    "/update-regional-office",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateRegionalOffice
);
regionalOfficeRouter.delete(
    "/delete-regional-office/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteRegionalOffice
);

module.exports = regionalOfficeRouter;

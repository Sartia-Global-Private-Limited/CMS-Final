const { getAllModule, getAllModuleForSuperAdminUser } = require("../../controllers/moduleController");
const { setPermission } = require("../../controllers/permissionController");
const {
    getAllRoles,
    getAllRolesForDropdown,
    createRole,
    updateRole,
    deleteRole,
    editRole,
} = require("../../controllers/roleController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const rolePermissionRouter = require("express").Router();

rolePermissionRouter.get("/roles", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllRoles);
rolePermissionRouter.get("/roles/:role_id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllRoles);
rolePermissionRouter.get(
    "/get-all-roles-for-dropdown",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    getAllRolesForDropdown
);
rolePermissionRouter.post("/create-role", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, createRole);
rolePermissionRouter.get("/edit-role/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, editRole);
rolePermissionRouter.post("/update-role", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), checkPermission, updateRole);
rolePermissionRouter.delete(
    "/delete-role/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteRole
);
rolePermissionRouter.get(
    "/get-all-module/:role_id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    // checkPermission,
    getAllModule
);
rolePermissionRouter.get(
    "/get-all-module",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllModule
);
// rolePermissionRouter.get(
//     "/get-module-for-superadmin-user",
//     verifyToken(),
//     checkPermission,
//     getAllModuleForSuperAdminUser
// );
rolePermissionRouter.post(
    "/set-permission",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    setPermission
);

module.exports = rolePermissionRouter;

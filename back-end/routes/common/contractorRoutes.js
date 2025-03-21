const {
    contractorCreate,
    getContractorById,
    updateContractorDetailsById,
    createContractorUser,
    getAllContractorAndUsers,
    getContractorAndUsersFullDetailByIdAndType,
    deleteContractorAndUsers,
} = require("../../controllers/contractorController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const contractorRouter = require("express").Router();

contractorRouter.post("/create-contractor", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), contractorCreate);
contractorRouter.get(
    "/get-single-contractor-details/:id",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getContractorById
);
contractorRouter.put(
    "/update-contractor-details",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateContractorDetailsById
);
contractorRouter.post(
    "/create-contractor-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createContractorUser
);
contractorRouter.get(
    "/get-all-contractors-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllContractorAndUsers
);
contractorRouter.get(
    "/get-contractors-and-users-details/:id/:type",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getContractorAndUsersFullDetailByIdAndType
);
contractorRouter.delete(
    "/delete-contractors-and-users/:id/:type",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteContractorAndUsers
);

module.exports = contractorRouter;

const { getAllSideBarModules } = require("../../controllers/adminController");
const { getAllModule } = require("../../controllers/moduleController");
const {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlanDetails,
    deletePlan,
} = require("../../controllers/planController");
const { verifyToken } = require("../../helpers/verifyToken");

const planRouter = require("express").Router();

planRouter.post("/create-plan", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), createPlan);
planRouter.get("/get-all-plans", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllPlans);
planRouter.get("/get-plan-details/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getPlanById);
planRouter.post("/update-plan-details", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), updatePlanDetails);
planRouter.delete("/delete-plan/:id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), deletePlan);
// planRouter.get("/get-all-sidebar-modules", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllModule);
planRouter.get("/get-all-module/:role_id", verifyToken([process.env.SUPER_ADMIN_ROLE_ID]), getAllModule);

module.exports = planRouter;

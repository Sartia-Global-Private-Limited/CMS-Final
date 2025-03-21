const { getAllModule } = require("../../controllers/moduleController");
const { verifyToken } = require("../../helpers/verifyToken");

const contractorRouter = require("express").Router();

contractorRouter.use("/billing", require("./billingRoutes"));
contractorRouter.use("/expense", require("./expenseRoutes"));
contractorRouter.use("/stock", require("./stockRoutes"));
contractorRouter.use("/stock-punch", require("./stockPunchRoutes"));
contractorRouter.use("/contacts", require("./contactRoutes"));
contractorRouter.use("/communication", require("./communicationRoutes"));
contractorRouter.use("/task", require("./taskRoutes"));

contractorRouter.use("/dashboard", require("./dashboardRoutes"));
contractorRouter.use("/company", require("./companyRoutes"));
contractorRouter.use("/oil-and-gas", require("./oilGasCompanyTeamRoutes"));
contractorRouter.use("/fuel-station", require("./fuelStationRoutes"));
contractorRouter.use("/suppliers", require("./supplierRoutes"));
contractorRouter.use("/complaints", require("./complaintRoutes"));
contractorRouter.use("/fund", require("./fundRoutes"));
contractorRouter.use("/office-inspection", require("./officeInspectionRoutes"));
contractorRouter.use("/site-inspection", require("./siteInspectionRoutes"));
contractorRouter.use("/item-master", require("./itemMasterRoutes"));
contractorRouter.use("/purchase-sale", require("./purchaseSaleRoutes"));
contractorRouter.use("/quotations", require("./quotationRoutes"));
contractorRouter.use("/feedback-suggestion", require("./feedbackSuggestionRoutes"));
contractorRouter.use("/master-data", require("./masterDataRoutes"));
contractorRouter.use("/tutorials", require("./tutorialRoutes"));
contractorRouter.use("/profile", require("./profileRoutes"));
contractorRouter.use("/product-management", require("./productManagementRoutes"));
contractorRouter.use("/assets", require("./assetsRoutes"));
contractorRouter.use("/hr-teams", require("./hrTeamsRoutes"));
contractorRouter.use("/hr-employees", require("./hrEmployeesRoutes"));
contractorRouter.use("/hr-attendance", require("./hrAttendanceRoutes"));
contractorRouter.use("/hr-leaves", require("./hrLeaveRoutes"));
contractorRouter.use("/payroll", require("./payrollRoutes"));
contractorRouter.use("/survey", require("./surveyRoutes"));
contractorRouter.use("/earthing-testing", require("./earthingTestingRoutes"));
contractorRouter.use("/documents", require("./documentRoutes"));

/**
 * @swagger
 * /contractor/get-all-module:
 *   get:
 *     tags: [Contractor - Payroll and Module Management]
 *     summary: Retrieve all modules
 *     description: Get a list of all modules.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modules retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - moduleId: 1
 *                   moduleName: "HR"
 *                 - moduleId: 2
 *                   moduleName: "Finance"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
contractorRouter.use("/get-all-module", verifyToken([process.env.CONTRACTOR_ROLE_ID]), getAllModule);

module.exports = contractorRouter;

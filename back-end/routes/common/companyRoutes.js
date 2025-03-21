const companyRouter = require("express").Router();
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");
const {
    createCompany,
    getMyCompany,
    getMyCompanySingleDetailsById,
    updateMyCompanyDetails,
    deleteMyCompany,
    getCompanyTypes,
    getAllCompany,
    getCompanySingleDetailsById,
    updateCompanyDetails,
    getAllCompanyForDropdown,
    getCompanyDetailsById,
    companyImport,
    getCompanyCounts,
    getAllStates,
    getAllCities,
    getCitiesBasedOnState,
    getCityBasedOnCompanies,
    getAllCompanyDataForChart,
} = require("../../controllers/companyController");
const {
    addPurchaseCompany,
    getPurchaseCompany,
    getPurchaseCompanyById,
    editPurchaseCompany,
    updatePurchaseCompanyById,
    deletePurchaseCompanyById,
} = require("../../controllers/purchaseCompanyController");

const {
    addSaleCompany,
    getSaleCompanies,
    getSaleCompanyById,
    editSalesCompany,
    updateSalesCompany,
    removeSalesCompanyById,
} = require("../../controllers/saleCompanyController");
const { getAllCreatedEnergyCompany } = require("../../controllers/energyCompanyController");
/**
 * @swagger
 * tags:
 *   - name: Contractor - Company Management
 *     description: Operations related to managing companies for contractors.
 */

/**
 * @swagger
 * /contractor/create-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Create a new company
 *     description: Register a new company under the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Company details to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the company.
 *                 example: ABC Corp
 *               companyType:
 *                 type: string
 *                 description: The type of company.
 *                 example: IT Services
 *               contactEmail:
 *                 type: string
 *                 description: Contact email for the company.
 *                 example: contact@abccorp.com
 *     responses:
 *       201:
 *         description: Company created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-my-company-list:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get list of companies
 *     description: Retrieve a list of companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: ABC Corp
 *                   type: IT Services
 *                 - id: 2
 *                   name: XYZ Ltd
 *                   type: Consulting
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor-get-my-company-single-details/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get single company details
 *     description: Retrieve detailed information for a specific company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: ABC Corp
 *                 type: IT Services
 *                 contactEmail: contact@abccorp.com
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-my-company-details:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update company details
 *     description: Update details of a company associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Company details to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the company.
 *                 example: ABC Technologies
 *               contactEmail:
 *                 type: string
 *                 description: Updated contact email for the company.
 *                 example: contact@abctech.com
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-my-company/{id}:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Delete a company
 *     description: Remove a company associated with the contractor by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-company-types:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get company types
 *     description: Retrieve a list of available company types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of company types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - type: IT Services
 *                 - type: Consulting
 *                 - type: Manufacturing
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-companies:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all companies
 *     description: Retrieve a list of all companies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: ABC Corp
 *                   type: IT Services
 *                 - id: 2
 *                   name: XYZ Ltd
 *                   type: Consulting
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-company-details-by-id/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get company details by ID
 *     description: Retrieve detailed information for a specific company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: ABC Corp
 *                 type: IT Services
 *                 contactEmail: contact@abccorp.com
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-all-company-details:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update all company details
 *     description: Update details for multiple companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of companies to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the company.
 *                       example: 1
 *                     companyName:
 *                       type: string
 *                       description: The new name of the company.
 *                       example: XYZ Technologies
 *                     contactEmail:
 *                       type: string
 *                       description: Updated contact email for the company.
 *                       example: contact@xyztech.com
 *     responses:
 *       200:
 *         description: Company details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Company details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-purchase-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Add a purchase company
 *     description: Add a company to the list of purchase companies.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the purchase company to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the purchase company.
 *                 example: DEF Ltd
 *               companyType:
 *                 type: string
 *                 description: The type of purchase company.
 *                 example: Supplier
 *     responses:
 *       201:
 *         description: Purchase company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-purchase-companies:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all purchase companies
 *     description: Retrieve a list of all purchase companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all purchase companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: DEF Ltd
 *                   type: Supplier
 *                 - id: 2
 *                   name: GHI Inc
 *                   type: Distributor
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-purchase-company/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get purchase company by ID
 *     description: Retrieve detailed information for a specific purchase company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: DEF Ltd
 *                 type: Supplier
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-purchase-company/{id}:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Edit purchase company by ID
 *     description: Retrieve details for editing a specific purchase company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: DEF Ltd
 *                 type: Supplier
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-purchase-company:
 *   post:
 *     tags: [Contractor - Company Management]
 *     summary: Update purchase company
 *     description: Update details of a purchase company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the purchase company to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the purchase company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the purchase company.
 *                 example: DEF Technologies
 *               companyType:
 *                 type: string
 *                 description: Updated type of the purchase company.
 *                 example: Supplier
 *     responses:
 *       200:
 *         description: Purchase company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-purchase-company/{id}:
 *   delete:
 *     tags: [Contractor - Company Management]
 *     summary: Delete a purchase company
 *     description: Remove a purchase company from the list by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Purchase company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
companyRouter.post(
    "/my-company/create-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createCompany
);
companyRouter.get(
    "/my-company/get-my-company-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMyCompany
);
companyRouter.get(
    "/my-company/get-my-company-single-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getMyCompanySingleDetailsById
);
companyRouter.post(
    "/my-company/update-my-company-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateMyCompanyDetails
);
//changes in method - post to delete
companyRouter.delete(
    "/my-company/delete-my-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteMyCompany
);
companyRouter.get(
    "/get-company-types",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getCompanyTypes
);
companyRouter.get(
    "/all-company/get-all-companies",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCompany
);
companyRouter.get(
    "/all-company/get-all-companies-for-chart",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCompanyDataForChart
);
companyRouter.post(
    "/all-company/create-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createCompany
);
companyRouter.get(
    "/all-company/get-company-details-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getCompanySingleDetailsById
);
companyRouter.post(
    "/all-company/update-all-company-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateCompanyDetails
);
companyRouter.delete(
    "/all-company/delete-my-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteMyCompany
);
companyRouter.get(
    "/all-company/get-company-counts",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getCompanyCounts
);
companyRouter.post(
    "/vendor/create-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createCompany
);
companyRouter.post(
    "/vendor/add-purchase-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addPurchaseCompany
);
companyRouter.get(
    "/vendor/all-purchase-companies",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPurchaseCompany
);
companyRouter.get(
    "/vendor/get-purchase-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getPurchaseCompanyById
);
companyRouter.get(
    "/vendor/edit-purchase-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editPurchaseCompany
);
companyRouter.delete(
    "/vendor/delete-my-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteMyCompany
);
companyRouter.post(
    "/vendor/update-purchase-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updatePurchaseCompanyById
);
companyRouter.delete(
    "/vendor/delete-purchase-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deletePurchaseCompanyById
);
companyRouter.post(
    "/import-companies",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    companyImport
);

/**
 * @swagger
 * tags:
 *   - name: Contractor - Sales Company Management
 *     description: Operations related to managing sales companies for contractors.
 */

/**
 * @swagger
 * /contractor/add-sale-company:
 *   post:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Add a sale company
 *     description: Add a company to the list of sale companies.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the sale company to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the sale company.
 *                 example: GHI Ltd
 *               companyType:
 *                 type: string
 *                 description: The type of sale company.
 *                 example: Retailer
 *     responses:
 *       201:
 *         description: Sale company added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/all-sale-companies:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Get all sale companies
 *     description: Retrieve a list of all sale companies associated with the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sale companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: GHI Ltd
 *                   type: Retailer
 *                 - id: 2
 *                   name: JKL Inc
 *                   type: Distributor
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-sale-company/{id}:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Get sale company by ID
 *     description: Retrieve detailed information for a specific sale company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale company details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: GHI Ltd
 *                 type: Retailer
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-sale-company/{id}:
 *   get:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Edit sale company by ID
 *     description: Retrieve details for editing a specific sale company by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale company details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: GHI Ltd
 *                 type: Retailer
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-sale-company:
 *   post:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Update sale company
 *     description: Update details of a sale company.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the sale company to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the sale company to update.
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: The new name of the sale company.
 *                 example: GHI Technologies
 *               companyType:
 *                 type: string
 *                 description: Updated type of the sale company.
 *                 example: Supplier
 *     responses:
 *       200:
 *         description: Sale company updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-sale-company/{id}:
 *   delete:
 *     tags: [Contractor - Sales Company Management]
 *     summary: Delete a sale company
 *     description: Remove a sale company from the list by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale company deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Sale company deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-energy-company:
 *   get:
 *     tags: [Contractor - Company Management]
 *     summary: Get all energy companies
 *     description: Retrieve a list of all energy companies created by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all energy companies retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Energy Corp
 *                   type: Energy Provider
 *                 - id: 2
 *                   name: Solar Solutions
 *                   type: Solar Energy
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

companyRouter.post(
    "/client/create-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createCompany
);
companyRouter.post(
    "/client/add-sale-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addSaleCompany
);
companyRouter.get(
    "/client/all-sale-companies",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSaleCompanies
);
companyRouter.get(
    "/client/get-sale-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSaleCompanyById
);
companyRouter.get(
    "/client/edit-sale-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    editSalesCompany
);
companyRouter.post(
    "/client/update-sale-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSalesCompany
);
companyRouter.delete(
    "/client/delete-sale-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeSalesCompanyById
);
companyRouter.delete(
    "/client/delete-my-company/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteMyCompany
);
companyRouter.get(
    "/client/get-all-energy-company",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCreatedEnergyCompany
);
companyRouter.get(
    "/get-all-states",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllStates
);
companyRouter.get(
    "/get-all-cities",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllCities
);
companyRouter.get(
    "/get-cities-based-on-state/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getCitiesBasedOnState
);
companyRouter.get("/get-cities-based-on-company", 
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getCityBasedOnCompanies
)

module.exports = companyRouter;

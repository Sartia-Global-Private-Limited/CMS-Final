const {
    createContacts,
    getAllStoredContacts,
    getStoredContactDetailById,
    updateContacts,
    deleteContactDetailById,
    sendMessage,
} = require("../../controllers/companyContactController");
const {
    getAllContractorAndUsersWithPendingAccountStatus,
    contractorAccountStatusAction,
} = require("../../controllers/contractorController");
const {
    getAllDealersAndUsersWithPendingAccountStatus,
    dealersAccountStatusAction,
} = require("../../controllers/dealerController");
const {
    getEnergyTeamDetailsById,
    getAllEnergyCompanyAndUsersWithPendingAccountStatus,
    energyCompanyAccountStatusAction,
} = require("../../controllers/energyCompanyController");
const { getAllOutlet } = require("../../controllers/outletController");
const {
    getAllSuperAdminAndUsersWithPendingAccountStatus,
    superAdminAccountStatusAction,
} = require("../../controllers/superAdminController");
const { getSuppliers } = require("../../controllers/suppliersController");
const { getAllClientAndPurchaseCompanyContacts } = require("../../controllers/userController");
// const { getAllAdmins } = require("../../controllers/userController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const contactRouter = require("express").Router();

/**
 * @swagger
 * /contractor/contacts/store-company-contact-details:
 *   post:
 *     summary: Store new company contact details.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the contact person.
 *               phone:
 *                 type: string
 *                 description: Contact phone number.
 *               email:
 *                 type: string
 *                 description: Contact email address.
 *               position:
 *                 type: string
 *                 description: Position of the contact person in the company.
 *               companyId:
 *                 type: string
 *                 description: ID of the company this contact belongs to.
 *     responses:
 *       201:
 *         description: Contact details stored successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/get-all-stored-company-contact-details:
 *   get:
 *     summary: Retrieve all stored company contact details.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stored company contacts retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/send-messages:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Send a message
 *     description: Send a new message to a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: "user_id_123"
 *               messageContent:
 *                 type: string
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Message sent successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/get-stored-company-contact-details/{id}:
 *   get:
 *     summary: Retrieve details of a specific company contact by ID.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/update-stored-company-contact-details:
 *   post:
 *     summary: Update details of an existing company contact.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the contact to be updated.
 *               name:
 *                 type: string
 *                 description: Updated name of the contact person.
 *               phone:
 *                 type: string
 *                 description: Updated contact phone number.
 *               email:
 *                 type: string
 *                 description: Updated contact email address.
 *               position:
 *                 type: string
 *                 description: Updated position of the contact person.
 *     responses:
 *       200:
 *         description: Contact details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/delete-company-contact-details/{id}:
 *   delete:
 *     summary: Delete a company contact.
 *     tags: [Contractor Routes - Company Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Contact not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/get-energy-company-users:
 *   get:
 *     tags: [Contractor Routes - Energy Company Teams]
 *     summary: Get details of all energy company team users.
 *     description: Retrieve a list of all users in the energy company team.
 *     responses:
 *       200:
 *         description: List of energy company team users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Energy company users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   role: "Manager"
 *                   energyCompanyId: 123
 *                 - id: 2
 *                   name: "Jane Smith"
 *                   email: "jane.smith@example.com"
 *                   role: "Engineer"
 *                   energyCompanyId: 123
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/all-outlets:
 *   get:
 *     tags: [Contractor - Sales and Regional Management]
 *     summary: Get all outlets
 *     description: Retrieve a list of all outlets.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outlets retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               outlets:
 *                 - id: "outlet123"
 *                   name: "Outlet 1"
 *                   region: "North Zone"
 *                 - id: "outlet124"
 *                   name: "Outlet 2"
 *                   region: "South Zone"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/get-client-users:
 *   get:
 *     tags: [Contractor Routes - Contacts]
 *     summary: Get all client users.
 *     description: Retrieve a list of all client users.
 *     responses:
 *       200:
 *         description: List of all client users.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Client users fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Charlie Brown"
 *                   email: "charlie.brown@example.com"
 *                   role: "Client"
 *                 - id: 2
 *                   name: "Dana White"
 *                   email: "dana.white@example.com"
 *                   role: "Client"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/contacts/get-suppliers:
 *   get:
 *     tags: [Contractor Routes - Contacts]
 *     summary: Get all suppliers.
 *     description: Retrieve a list of all suppliers.
 *     responses:
 *       200:
 *         description: List of all suppliers.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Suppliers fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Supplier 1"
 *                   email: "supplier1@example.com"
 *                   contact: "123-456-7890"
 *                 - id: 2
 *                   name: "Supplier 2"
 *                   email: "supplier2@example.com"
 *                   contact: "987-654-3210"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

contactRouter.post(
    "/store-company-contact-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createContacts
);
contactRouter.get(
    "/get-all-stored-company-contact-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllStoredContacts
);
contactRouter.post(
    "/send-message",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    sendMessage
);
contactRouter.get(
    "/get-stored-company-contact-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getStoredContactDetailById
);
contactRouter.post(
    "/update-stored-company-contact-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateContacts
);
contactRouter.delete(
    "/delete-company-contact-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteContactDetailById
);
contactRouter.get(
    "/get-energy-company-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getEnergyTeamDetailsById
);
contactRouter.get(
    "/all-outlets",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllOutlet
);
contactRouter.get(
    "/get-client-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllClientAndPurchaseCompanyContacts
);
contactRouter.get(
    "/get-suppliers",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSuppliers
);

//super admin routes
contactRouter.get(
    "/get-all-pending-account-status-contractors-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllContractorAndUsersWithPendingAccountStatus
);

contactRouter.post(
    "/contractors-and-users-set-account-status",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    contractorAccountStatusAction
);

contactRouter.get(
    "/get-all-pending-account-status-of-energy-company-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllEnergyCompanyAndUsersWithPendingAccountStatus
);

contactRouter.post(
    "/update-account-status-of-energy-company-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    energyCompanyAccountStatusAction
);

contactRouter.get(
    "/get-all-pending-account-status-of-dealers-and-users-details",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllDealersAndUsersWithPendingAccountStatus
);

contactRouter.get(
    "/get-all-pending-account-status-of-admins-and-users-details",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllSuperAdminAndUsersWithPendingAccountStatus
);

contactRouter.post(
    "/update-account-status-of-dealers-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    dealersAccountStatusAction
);

contactRouter.post(
    "/update-account-status-of-admins-and-users",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    superAdminAccountStatusAction
);
module.exports = contactRouter;

const {
    getAllDocumentCategory,
    createDocumentCategory,
    getDocumentCategoryById,
    updateDocumentCategory,
    removeDocumentCategoryById,
    addDocuments,
    getAllDocuments,
    viewDocuments,
    getDocumentOnCategoryById,
    removeDocumentById,
    updateDocuments,
} = require("../../controllers/documentController");
const { getUsersByRoleId } = require("../../controllers/userController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const documentRouter = require("express").Router();

//---------------Documents routes contractors------------------------

/**
 * @swagger
 * /contractor/create-document-category:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Create a new document category
 *     description: Register a new document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the new document category.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: The name of the document category.
 *                 example: "Legal Documents"
 *               description:
 *                 type: string
 *                 description: A brief description of the document category.
 *                 example: "Category for storing all legal-related documents."
 *     responses:
 *       200:
 *         description: Document category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-document-categories:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve all document categories
 *     description: Get a list of all document categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of document categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - categoryId: 1
 *                   categoryName: "Legal Documents"
 *                   description: "Category for storing all legal-related documents."
 *                 - categoryId: 2
 *                   categoryName: "HR Documents"
 *                   description: "Category for storing HR-related documents."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-document-category-details/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Get details of a specific document category
 *     description: Retrieve detailed information about a document category by its ID.
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
 *         description: Document category details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 categoryId: 1
 *                 categoryName: "Legal Documents"
 *                 description: "Category for storing all legal-related documents."
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-document-category-details:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Update document category details
 *     description: Update the details of an existing document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the document category.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category to update.
 *                 example: 1
 *               categoryName:
 *                 type: string
 *                 description: The updated name of the document category.
 *                 example: "Updated Legal Documents"
 *               description:
 *                 type: string
 *                 description: The updated description of the document category.
 *                 example: "Updated category for storing all legal-related documents."
 *     responses:
 *       200:
 *         description: Document category details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-document-category/{id}:
 *   delete:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Delete a document category
 *     description: Remove a document category identified by its ID.
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
 *         description: Document category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document category deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/add-documents:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Add new documents
 *     description: Upload new documents and associate them with a document category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the documents to be added.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category.
 *                 example: 1
 *               documentFile:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded.
 *     responses:
 *       200:
 *         description: Documents added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Documents added successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-document:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve all documents
 *     description: Get a list of all uploaded documents.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - documentId: 1
 *                   categoryId: 1
 *                   documentName: "Contract.pdf"
 *                   documentUrl: "/documents/contract.pdf"
 *                 - documentId: 2
 *                   categoryId: 2
 *                   documentName: "HR Policy.docx"
 *                   documentUrl: "/documents/hr_policy.docx"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/view-document/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: View a specific document
 *     description: Retrieve and view a document identified by its ID.
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
 *         description: Document retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 documentId: 1
 *                 categoryId: 1
 *                 documentName: "Contract.pdf"
 *                 documentUrl: "/documents/contract.pdf"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-document-on-category-id/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Retrieve documents by category ID
 *     description: Get a list of documents associated with a specific category ID.
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
 *         description: List of documents for the specified category retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - documentId: 1
 *                   documentName: "Contract.pdf"
 *                   documentUrl: "/documents/contract.pdf"
 *                 - documentId: 2
 *                   documentName: "Legal Agreement.docx"
 *                   documentUrl: "/documents/legal_agreement.docx"
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-document/{id}:
 *   delete:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Delete a document
 *     description: Remove a document identified by its ID.
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
 *         description: Document deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-document:
 *   post:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Update document details
 *     description: Update the details of an existing document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Updated details of the document.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: integer
 *                 description: The ID of the document to update.
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the document category.
 *                 example: 1
 *               documentName:
 *                 type: string
 *                 description: The updated name of the document.
 *                 example: "Updated Contract.pdf"
 *     responses:
 *       200:
 *         description: Document details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Document details updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-users-by-role/{id}:
 *   get:
 *     tags: [Contractor Routes - Document Management]
 *     summary: Get users by role ID
 *     description: Retrieve users based on their role ID.
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
 *         description: List of users with the specified role retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - userId: 1
 *                   userName: "John Doe"
 *                   roleId: 2
 *                 - userId: 2
 *                   userName: "Jane Smith"
 *                   roleId: 2
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
documentRouter.post(
    "/document-category/create-document-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createDocumentCategory
);
documentRouter.get(
    "/document-category/get-all-document-categories",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllDocumentCategory
);
documentRouter.get(
    "/document-category/get-document-category-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getDocumentCategoryById
);
documentRouter.post(
    "/document-category/update-document-category-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateDocumentCategory
);
documentRouter.delete(
    "/document-category/delete-document-category/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeDocumentCategoryById
);
documentRouter.post(
    "/add-documents",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addDocuments
);
documentRouter.get(
    "/get-all-document",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllDocuments
);
documentRouter.get(
    "/view-document/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    viewDocuments
);
documentRouter.get(
    "/get-document-on-category-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getDocumentOnCategoryById
);
documentRouter.delete(
    "/delete-document/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeDocumentById
);
documentRouter.post(
    "/update-document",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateDocuments
);
documentRouter.get(
    "/get-users-by-role/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getUsersByRoleId
);

module.exports = documentRouter;

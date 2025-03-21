const {
    createTutorial,
    getTutorials,
    getTutorialByFormat,
    updateTutorials,
    deleteTutorialsById,
    getTutorialById,
} = require("../../controllers/tutorialController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const tutorialRouter = require("express").Router();

//----------------------------Tutorials routes----------------------------

/**
 * @swagger
 * tags:
 *   name: Contractor Routes - Tutorials
 *   description: API endpoints for managing tutorials.
 */

/**
 * @swagger
 * /contractor/create-tutorial:
 *   post:
 *     summary: Create a new tutorial.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the tutorial.
 *               content:
 *                 type: string
 *                 description: Content of the tutorial.
 *               format:
 *                 type: string
 *                 description: Format of the tutorial (e.g., video, text).
 *     responses:
 *       201:
 *         description: Tutorial created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-tutorials:
 *   get:
 *     summary: Retrieve all tutorials.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tutorials retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-tutorial-formats/{format}:
 *   get:
 *     summary: Retrieve details of a single tutorial by format.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: format
 *         in: path
 *         required: true
 *         description: Format of the tutorial (e.g., video, text).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-tutorial-details:
 *   post:
 *     summary: Update details of an existing tutorial.
 *     tags: [Contractor Routes - Tutorials]
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
 *                 description: ID of the tutorial to be updated.
 *               title:
 *                 type: string
 *                 description: New title of the tutorial.
 *               content:
 *                 type: string
 *                 description: Updated content of the tutorial.
 *               format:
 *                 type: string
 *                 description: Updated format of the tutorial.
 *     responses:
 *       200:
 *         description: Tutorial details updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-tutorial/{id}:
 *   delete:
 *     summary: Delete a tutorial.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tutorial to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-tutorial-by-id/{id}:
 *   get:
 *     summary: Retrieve a tutorial by its ID.
 *     tags: [Contractor Routes - Tutorials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tutorial.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Tutorial not found.
 *       500:
 *         description: Internal server error.
 */
tutorialRouter.post(
    "/create-tutorial",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createTutorial
);
tutorialRouter.get(
    "/get-all-tutorials",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTutorials
);
tutorialRouter.get(
    "/get-tutorial-formats",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTutorialByFormat
);
tutorialRouter.post(
    "/update-tutorial-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateTutorials
);
tutorialRouter.delete(
    "/delete-tutorial/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteTutorialsById
);
tutorialRouter.get(
    "/get-tutorial-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.ENERGY_COMPANY_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTutorialById
);

module.exports = tutorialRouter;

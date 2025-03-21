const {
    deleteFeedbackComplaint,
    addUpdateFeedbackComplaint,
    addResponseToFeedbackComplaint,
    getFeedbackComplaint,
    getFeedbackComplaintById,
} = require("../../controllers/feedbackComplaintController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const feedbackSuggestionRouter = require("express").Router();

// feedback and suggestions

/**
 * @swagger
 * tags:
 *   - name: Contractor Routes - Feedback and Suggestions
 *     description: Routes for managing feedback and complaints.
 *
 * /contractor/create-feedback-and-complaint:
 *   post:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Create or update feedback and complaint.
 *     description: Create a new feedback or complaint, or update an existing one.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the feedback or complaint (e.g., 'feedback' or 'complaint').
 *               description:
 *                 type: string
 *                 description: Description of the feedback or complaint.
 *             required:
 *               - type
 *               - description
 *     responses:
 *       201:
 *         description: Feedback or complaint created or updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint created/updated successfully.
 *               data:
 *                 id: 1
 *                 type: "complaint"
 *                 description: "Detailed description of the complaint."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/add-response/{id}:
 *   post:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Add a response to a feedback or complaint.
 *     description: Add a response to the specified feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to respond to.
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *                 description: Response to the feedback or complaint.
 *             required:
 *               - response
 *     responses:
 *       200:
 *         description: Response added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Response added successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-all-feedback-and-complaint:
 *   get:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Get all feedback and complaints.
 *     description: Retrieve a list of all feedback and complaints.
 *     responses:
 *       200:
 *         description: List of all feedback and complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback and complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   type: "complaint"
 *                   description: "Detailed description of the complaint."
 *                   response: "Response to the complaint."
 *                 - id: 2
 *                   type: "feedback"
 *                   description: "Detailed description of the feedback."
 *                   response: "Response to the feedback."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/get-feedback-and-complaint/{id}:
 *   get:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Get feedback or complaint by ID.
 *     description: Retrieve details of a specific feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback or complaint details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint details fetched successfully.
 *               data:
 *                 id: 1
 *                 type: "complaint"
 *                 description: "Detailed description of the complaint."
 *                 response: "Response to the complaint."
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /contractor/delete-feedback-and-complaint/{id}:
 *   delete:
 *     tags: [Contractor Routes - Feedback and Suggestions]
 *     summary: Delete a feedback or complaint.
 *     description: Remove a feedback or complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the feedback or complaint to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback or complaint deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Feedback or complaint deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
feedbackSuggestionRouter.post(
    "/create-feedback-and-complaint",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addUpdateFeedbackComplaint
);
feedbackSuggestionRouter.put(
    "/add-response/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addResponseToFeedbackComplaint
);
feedbackSuggestionRouter.get(
    "/get-all-feedback-and-complaint",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getFeedbackComplaint
);
feedbackSuggestionRouter.get(
    "/get-feedback-and-complaint/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getFeedbackComplaintById
);
feedbackSuggestionRouter.delete(
    "/delete-feedback-and-complaint/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteFeedbackComplaint
);

module.exports = feedbackSuggestionRouter;

const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const surveyRouter = require("express").Router();

const {
    createSurvey,
    getAllSurvey,
    getSurveyById,
    editSurveyDetails,
    updateSurveyDetails,
    deleteSurvey,
    getAssignedSurvey,
    getRequestedSurvey,
    getSurveyQuestionResponse,
    assignToSurvey,
    updateRequestedSurveyStatus,
    surveyQuestionFormResponse,
    otpSendSurvey,
    VerifyOtpSurvey,
    getSurveyResponseById,
    createSurveyResponse,
    getSurveyResponse,
} = require("../../controllers/surveyController");
/** * Contractor Survey routes */

/**
 * @swagger
 * tags:
 *   - name: Contractor - Survey Management
 *     description: Operations related to managing surveys for contractors.
 */

/**
 * @swagger
 * /contractor/create-survey:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Create a new survey
 *     description: Add a new survey to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the survey to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyTitle:
 *                 type: string
 *                 description: The title of the survey.
 *                 example: Customer Satisfaction Survey
 *               surveyDescription:
 *                 type: string
 *                 description: A brief description of the survey.
 *                 example: Survey to gauge customer satisfaction with our service.
 *     responses:
 *       201:
 *         description: Survey created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-surveys:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all surveys
 *     description: Retrieve a list of all surveys created by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Customer Satisfaction Survey
 *                   description: Survey to gauge customer satisfaction with our service.
 *                 - id: 2
 *                   title: Product Feedback Survey
 *                   description: Survey to collect feedback on our latest product.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-survey-by-id/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get survey by ID
 *     description: Retrieve detailed information for a specific survey by ID.
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
 *         description: Survey details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 title: Customer Satisfaction Survey
 *                 description: Survey to gauge customer satisfaction with our service.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/edit-survey-details/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Edit survey details by ID
 *     description: Retrieve details of a specific survey for editing by ID.
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
 *         description: Survey details for editing retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 title: Customer Satisfaction Survey
 *                 description: Survey to gauge customer satisfaction with our service.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-survey-details:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Update survey details
 *     description: Update details of an existing survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the survey to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the survey to update.
 *                 example: 1
 *               title:
 *                 type: string
 *                 description: The new title of the survey.
 *                 example: Updated Survey Title
 *               description:
 *                 type: string
 *                 description: The new description of the survey.
 *                 example: Updated survey description.
 *     responses:
 *       200:
 *         description: Survey updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/delete-survey-details/{id}:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Delete a survey
 *     description: Remove a survey from the system by ID.
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
 *         description: Survey deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey deleted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-assign-survey:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get assigned surveys
 *     description: Retrieve a list of surveys assigned to the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Customer Satisfaction Survey
 *                   description: Survey to gauge customer satisfaction with our service.
 *                 - id: 2
 *                   title: Product Feedback Survey
 *                   description: Survey to collect feedback on our latest product.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-survey:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Assign a survey
 *     description: Assign a survey to a contractor or user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for assigning the survey.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey to assign.
 *                 example: 1
 *               assigneeId:
 *                 type: integer
 *                 description: The ID of the user or contractor to whom the survey is assigned.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Survey assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey assigned successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/changed-survey-status:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Change survey status
 *     description: Update the status of a survey.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for updating the survey status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey whose status is to be updated.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the survey.
 *                 example: completed
 *     responses:
 *       200:
 *         description: Survey status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/submit-survey-question-response:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Submit survey question response
 *     description: Submit responses to survey questions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Responses to the survey questions.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       description: The ID of the question.
 *                       example: 101
 *                     answer:
 *                       type: string
 *                       description: The response to the question.
 *                       example: Yes
 *     responses:
 *       200:
 *         description: Survey responses submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Survey responses submitted successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-requested-survey:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get requested surveys
 *     description: Retrieve a list of surveys that have been requested by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requested surveys retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   title: Requested Survey 1
 *                   description: Survey requested by the contractor for feedback.
 *                 - id: 2
 *                   title: Requested Survey 2
 *                   description: Another survey requested by the contractor.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-survey-response:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all survey responses
 *     description: Retrieve all responses to surveys managed by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all survey responses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - surveyId: 1
 *                   responses:
 *                     - questionId: 101
 *                       answer: Yes
 *                     - questionId: 102
 *                       answer: No
 *                 - surveyId: 2
 *                   responses:
 *                     - questionId: 201
 *                       answer: Maybe
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/surveys-otp-send:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Send OTP for survey
 *     description: Send an OTP to verify the contractor's identity for survey actions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for sending OTP.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number to which OTP will be sent.
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP sent successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/surveys-otp-verify:
 *   post:
 *     tags: [Contractor - Survey Management]
 *     summary: Verify OTP for survey
 *     description: Verify the OTP received for survey actions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: OTP verification details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyId:
 *                 type: integer
 *                 description: The ID of the survey.
 *                 example: 1
 *               otp:
 *                 type: string
 *                 description: The OTP to verify.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: OTP verified successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-survey-response/{id}:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get survey response by ID
 *     description: Retrieve responses to a specific survey by ID.
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
 *         description: Survey responses retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 surveyId: 1
 *                 responses:
 *                   - questionId: 101
 *                     answer: Yes
 *                   - questionId: 102
 *                     answer: No
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-purpose-master:
 *   get:
 *     tags: [Contractor - Survey Management]
 *     summary: Get all purpose master data
 *     description: Retrieve all purpose master data for surveys.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purpose master data retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Feedback
 *                 - id: 2
 *                   name: Review
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
surveyRouter.post(
    "/create-survey",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createSurvey
);
surveyRouter.get(
    "/get-all-surveys",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllSurvey
);
surveyRouter.get(
    "/get-survey-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSurveyById
);
surveyRouter.get(
    "/edit-survey-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    editSurveyDetails
);
surveyRouter.post(
    "/update-survey-details",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateSurveyDetails
);
surveyRouter.post(
    "/delete-survey-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteSurvey
);
surveyRouter.get(
    "/get-assign-survey",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAssignedSurvey
);
surveyRouter.put(
    "/assign-survey",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    assignToSurvey
);
surveyRouter.put(
    "/changed-survey-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateRequestedSurveyStatus
);
surveyRouter.post(
    "/submit-survey-question-response",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    surveyQuestionFormResponse
);
surveyRouter.get(
    "/get-requested-survey",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getRequestedSurvey
);
surveyRouter.get(
    "/get-all-survey-response",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSurveyQuestionResponse
);
surveyRouter.post(
    "/surveys-otp-send",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    otpSendSurvey
);
surveyRouter.post(
    "/surveys-otp-verify",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    VerifyOtpSurvey
);
surveyRouter.get(
    "/get-survey-response/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSurveyResponseById
);
// surveyRouter.get("/get-all-purpose-master", verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]), getAllPurposeMaster);
surveyRouter.post(
    "/send-survey-response",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createSurveyResponse
);
surveyRouter.get(
    "/get-survey-response",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSurveyResponse
);
surveyRouter.get(
    "/get-survey-response/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getSurveyResponse
);

module.exports = surveyRouter;

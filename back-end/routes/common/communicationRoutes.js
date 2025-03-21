const { getAllMessages } = require("../../controllers/companyContactController");
const { getContactsForChat } = require("../../controllers/contactController");
const { addNewUserToChat, getMessages, startChatWithNewUser } = require("../../controllers/messageController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const communicationRouter = require("express").Router();

/**
 * @swagger
 * /contractor/communication/add-new-user-to-chat:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Add a new user to chat
 *     description: Add a new user to the chat, initiating a conversation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User added to chat successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "User added to chat successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/communication/get-messages:
 *   get:
 *     tags: [Contractor - Messaging]
 *     summary: Get all messages
 *     description: Retrieve all messages for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - messageId: "msg_id_1"
 *                   senderId: "user_id_456"
 *                   messageContent: "Hello, are you there?"
 *                   timestamp: "2024-08-17T10:00:00Z"
 *                 - messageId: "msg_id_2"
 *                   senderId: "user_id_789"
 *                   messageContent: "Meeting at 3 PM."
 *                   timestamp: "2024-08-17T11:00:00Z"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/communication/start-chat-to-new-user/{id}:
 *   post:
 *     tags: [Contractor - Messaging]
 *     summary: Start chat with a new user
 *     description: Start a chat with a new user by sending the first message.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the recipient.
 *         required: true
 *         schema:
 *           type: string
 *           example: "user_id_456"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageContent:
 *                 type: string
 *                 example: "Hi, I would like to discuss a new project."
 *     responses:
 *       201:
 *         description: Chat started and message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Chat started and message sent successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Recipient not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/communication/get-all-messages:
 *   get:
 *     tags: [Contractor Routes - Messages]
 *     summary: Get all messages.
 *     description: Retrieve a list of all messages.
 *     responses:
 *       200:
 *         description: List of all messages.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Messages fetched successfully.
 *               data:
 *                 - id: 1
 *                   recipientId: 123
 *                   subject: "Meeting Reminder"
 *                   body: "Don't forget our meeting tomorrow at 10 AM."
 *                 - id: 2
 *                   recipientId: 456
 *                   subject: "Project Update"
 *                   body: "The project is progressing well."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

communicationRouter.get(
    "/add-new-user-to-chat",
    verifyToken(),
    checkPermission,
    addNewUserToChat
);
communicationRouter.get(
    "/get-messages",
    verifyToken(),
    checkPermission,
    getMessages
);
communicationRouter.post(
    "/start-chat-to-new-user/:id",
    verifyToken(),
    checkPermission,
    startChatWithNewUser
);
communicationRouter.get(
    "/get-all-messages",
    verifyToken(),
    checkPermission,
    getAllMessages
);
communicationRouter.get(
    "/get-all-users",
    verifyToken(),
    checkPermission,
    getContactsForChat
);

module.exports = communicationRouter;

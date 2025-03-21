const { updateProfile, getProfileDetails, changePassword } = require("../../controllers/superAdminController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const profileRouter = require("express").Router();

/**
 * @swagger
 * /contractor/profile-update:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Update profile details
 *     description: Update the profile details of the logged-in contractor user.
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Profile updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/profile:
 *   get:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Get profile details
 *     description: Retrieve the profile details of the logged-in contractor user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/change-password:
 *   post:
 *     tags: [Contractor - Item Master & Profile Management]
 *     summary: Change password
 *     description: Change the password for the logged-in contractor user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "old_password123"
 *               newPassword:
 *                 type: string
 *                 example: "new_password456"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Password changed successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

profileRouter.put(
    "/profile-update",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    // checkPermission,
    updateProfile
);
profileRouter.get(
    "/get-profile",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getProfileDetails
);
profileRouter.put(
    "/change-password",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    // checkPermission,
    changePassword
);

module.exports = profileRouter;

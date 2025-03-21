const express = require('express');
const { verifyDealerToken } = require('./helpers/verifyToken');

const {getProfileDetails, updateProfile, changePassword} = require('./controllers/superAdminController');
const { createTutorial, getTutorials, updateTutorials, deleteTutorialsById, getTutorialByFormat } = require('./controllers/tutorialController');
const { getAllModule } = require('./controllers/moduleController');
const { getAllRolesForDropdown } = require('./controllers/roleController');
const { getApprovedComplaintsDetailsById, getAllApprovedComplaints, getAllRequestedComplaints } = require('./controllers/contractorComplaintController');
const { uploadComplaintImages, getAllUploadedImages, getSingleUploadedImagesById, updateComplaintImages, deleteComplaintWorkImages, getComplaintImagesForPPT } = require('./controllers/complaintImagesController');
const { getNotifications, getLoggedUserNotifications, countLoggedUserUnreadNotifications, markAsReadNotifications } = require('./controllers/notificationController');
const { getDealerSidebar } = require('./controllers/dealerController');

const dealerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Profile
 *     description: Routes for managing dealer profiles.
 */

/**
 * @swagger
 * /dealer/profile-update:
 *   post:
 *     tags: [Dealer Routes - Profile]
 *     summary: Update dealer profile.
 *     description: Update the profile information of a dealer.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the dealer.
 *               email:
 *                 type: string
 *                 description: Updated email of the dealer.
 *               phoneNumber:
 *                 type: string
 *                 description: Updated phone number of the dealer.
 *               address:
 *                 type: string
 *                 description: Updated address of the dealer.
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/profile:
 *   get:
 *     tags: [Dealer Routes - Profile]
 *     summary: Get dealer profile details.
 *     description: Retrieve the profile details of the currently authenticated dealer.
 *     responses:
 *       200:
 *         description: Dealer profile details.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Profile details fetched successfully.
 *               data:
 *                 id: 1
 *                 name: "Alice Johnson"
 *                 email: "alice.johnson@example.com"
 *                 phoneNumber: "123-456-7890"
 *                 address: "123 Main St, Cambridge, USA"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/change-password:
 *   post:
 *     tags: [Dealer Routes - Profile]
 *     summary: Change dealer password.
 *     description: Change the password for the dealer account.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the dealer.
 *               newPassword:
 *                 type: string
 *                 description: New password for the dealer.
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Password changed successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.post('/dealer/profile-update', verifyDealerToken, updateProfile);
dealerRouter.get('/dealer/profile', verifyDealerToken, getProfileDetails);
dealerRouter.post('/dealer/change-password', verifyDealerToken, changePassword);


//----------------------------Module routes----------------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Modules
 *     description: Routes for managing and retrieving dealer modules.
 *
 * /dealer/get-all-module:
 *   get:
 *     tags: [Dealer Routes - Modules]
 *     summary: Get all dealer modules.
 *     description: Retrieve a list of all modules available to the dealer.
 *     responses:
 *       200:
 *         description: List of all dealer modules.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Modules fetched successfully.
 *               data:
 *                 - id: 1
 *                   name: "Sales"
 *                   description: "Module for managing sales."
 *                 - id: 2
 *                   name: "Inventory"
 *                   description: "Module for managing inventory."
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.get('/dealer/get-all-module', verifyDealerToken, getAllModule);                         


//----------------------------Roles For Dropdown routes----------------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Roles
 *     description: Routes for managing and retrieving roles for dropdown options.
 *
 * /dealer/get-all-roles-for-dropdown:
 *   get:
 *     tags: [Dealer Routes - Roles]
 *     summary: Get all roles for dropdown.
 *     description: Retrieve a list of all roles available for use in dropdown menus.
 *     responses:
 *       200:
 *         description: List of all roles for dropdown.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Roles fetched successfully.
 *               data:
 *                 - id: 1
 *                   roleName: "Administrator"
 *                 - id: 2
 *                   roleName: "Manager"
 *                 - id: 3
 *                   roleName: "User"
 *               totalCount: 3
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.get('/dealer/get-all-roles-for-dropdown', verifyDealerToken, getAllRolesForDropdown);


//----------------------------Tutorials routes----------------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Tutorials
 *     description: Routes for managing and retrieving tutorials.
 *
 * /dealer/create-tutorial:
 *   post:
 *     tags: [Dealer Routes - Tutorials]
 *     summary: Create a new tutorial.
 *     description: Add a new tutorial to the system.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the tutorial.
 *               description:
 *                 type: string
 *                 description: Detailed description of the tutorial.
 *               content:
 *                 type: string
 *                 description: The main content or body of the tutorial.
 *               format:
 *                 type: string
 *                 description: Format or type of the tutorial (e.g., video, article).
 *             required:
 *               - title
 *               - description
 *               - content
 *               - format
 *     responses:
 *       201:
 *         description: Tutorial created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial created successfully.
 *               data:
 *                 id: 1
 *                 title: "How to Use the Dashboard"
 *                 description: "A comprehensive guide to using the dashboard."
 *                 content: "Detailed steps and screenshots..."
 *                 format: "Article"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-all-tutorials:
 *   get:
 *     tags: [Dealer Routes - Tutorials]
 *     summary: Get all tutorials.
 *     description: Retrieve a list of all tutorials.
 *     responses:
 *       200:
 *         description: List of all tutorials.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorials fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "How to Use the Dashboard"
 *                   description: "A comprehensive guide to using the dashboard."
 *                   format: "Article"
 *                 - id: 2
 *                   title: "Dashboard Overview"
 *                   description: "An overview of the dashboard features."
 *                   format: "Video"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-tutorial-formats/{format}:
 *   get:
 *     tags: [Dealer Routes - Tutorials]
 *     summary: Get tutorial details by format.
 *     description: Retrieve the details of a specific tutorial by its format.
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         description: Format of the tutorial to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial details by format.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial details fetched successfully.
 *               data:
 *                 id: 2
 *                 title: "Dashboard Overview"
 *                 description: "An overview of the dashboard features."
 *                 content: "Detailed video content..."
 *                 format: "Video"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.post('/dealer/create-tutorial', verifyDealerToken, createTutorial);
dealerRouter.get('/dealer/get-all-tutorials', verifyDealerToken, getTutorials);
dealerRouter.get('/dealer/get-tutorial-formats/:format', verifyDealerToken, getTutorialByFormat);

/**
 * @swagger
 * /dealer/update-tutorial-details:
 *   post:
 *     tags: [Dealer Routes - Tutorials]
 *     summary: Update tutorial details.
 *     description: Update the details of an existing tutorial.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the tutorial to update.
 *               title:
 *                 type: string
 *                 description: Updated title of the tutorial.
 *               description:
 *                 type: string
 *                 description: Updated description of the tutorial.
 *               content:
 *                 type: string
 *                 description: Updated content or body of the tutorial.
 *               format:
 *                 type: string
 *                 description: Updated format or type of the tutorial (e.g., video, article).
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Tutorial details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial updated successfully.
 *               data:
 *                 id: 1
 *                 title: "Updated Tutorial Title"
 *                 description: "Updated tutorial description."
 *                 content: "Updated content..."
 *                 format: "Article"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/delete-tutorial/{id}:
 *   delete:
 *     tags: [Dealer Routes - Tutorials]
 *     summary: Delete a tutorial by ID.
 *     description: Remove a specific tutorial from the system by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tutorial to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutorial deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Tutorial deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.post('/dealer/update-tutorial-details', verifyDealerToken, updateTutorials);
dealerRouter.delete('/dealer/delete-tutorial/:id', verifyDealerToken, deleteTutorialsById);


// --------- complaint modules --------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Complaints
 *     description: Routes for managing and retrieving approved complaints.
 *
 * /dealer/get-approved-complaints-details/{id}:
 *   get:
 *     tags: [Dealer Routes - Complaints]
 *     summary: Get approved complaint details by ID.
 *     description: Retrieve the details of an approved complaint by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the approved complaint to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the approved complaint.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Approved complaint details fetched successfully.
 *               data:
 *                 id: 1
 *                 complaintTitle: "Product Issue"
 *                 complaintDescription: "Details about the issue with the product."
 *                 status: "Approved"
 *                 resolvedDate: "2024-08-01"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-approved-complaints:
 *   get:
 *     tags: [Dealer Routes - Complaints]
 *     summary: Get all approved complaints.
 *     description: Retrieve a list of all approved complaints.
 *     responses:
 *       200:
 *         description: List of all approved complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Approved complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   complaintTitle: "Product Issue"
 *                   complaintDescription: "Details about the issue with the product."
 *                   status: "Approved"
 *                   resolvedDate: "2024-08-01"
 *                 - id: 2
 *                   complaintTitle: "Service Delay"
 *                   complaintDescription: "Details about the delay in service."
 *                   status: "Approved"
 *                   resolvedDate: "2024-08-05"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.get('/dealer/get-approved-complaints-details/:id', verifyDealerToken, getApprovedComplaintsDetailsById)
dealerRouter.get('/dealer/get-approved-complaints', verifyDealerToken, getAllApprovedComplaints);


// --------- Notification modules --------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Notifications
 *     description: Routes for managing and retrieving dealer notifications.
 *
 * /dealer/get-all-notifications:
 *   get:
 *     tags: [Dealer Routes - Notifications]
 *     summary: Get all notifications.
 *     description: Retrieve a list of all notifications for the dealer.
 *     responses:
 *       200:
 *         description: List of all notifications.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Notifications fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "New Update Available"
 *                   description: "A new update is available for your application."
 *                   date: "2024-08-15"
 *                   read: false
 *                 - id: 2
 *                   title: "System Maintenance"
 *                   description: "System maintenance scheduled for tomorrow."
 *                   date: "2024-08-14"
 *                   read: true
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-logged-user-notifications:
 *   get:
 *     tags: [Dealer Routes - Notifications]
 *     summary: Get notifications for the logged-in user.
 *     description: Retrieve notifications specific to the currently logged-in dealer.
 *     responses:
 *       200:
 *         description: List of notifications for the logged-in user.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Logged-in user notifications fetched successfully.
 *               data:
 *                 - id: 1
 *                   title: "Reminder"
 *                   description: "Don't forget to review your latest orders."
 *                   date: "2024-08-15"
 *                   read: false
 *               totalCount: 1
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/count-logged-user-unread-notifications:
 *   get:
 *     tags: [Dealer Routes - Notifications]
 *     summary: Count unread notifications for the logged-in user.
 *     description: Get the number of unread notifications for the currently logged-in dealer.
 *     responses:
 *       200:
 *         description: Number of unread notifications.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Unread notifications count fetched successfully.
 *               data:
 *                 unreadCount: 5
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/mark-as-read-notifications:
 *   post:
 *     tags: [Dealer Routes - Notifications]
 *     summary: Mark notifications as read.
 *     description: Mark specified notifications as read.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of notification IDs to mark as read.
 *             required:
 *               - notificationIds
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Notifications marked as read successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.get('/dealer/get-all-notifications', verifyDealerToken, getNotifications)
dealerRouter.get('/dealer/get-logged-user-notifications', verifyDealerToken, getLoggedUserNotifications)
dealerRouter.get('/dealer/count-logged-user-unread-notifications', verifyDealerToken, countLoggedUserUnreadNotifications)
dealerRouter.post('/dealer/mark-as-read-notifications', verifyDealerToken, markAsReadNotifications)


//-------------------------Upload complaint images routes-------------------------

/**
 * @swagger
 * tags:
 *   - name: Dealer Routes - Complaint Images
 *     description: Routes for managing and uploading complaint images.
 *
 * /dealer/upload-complaint-images:
 *   post:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Upload complaint images.
 *     description: Upload one or more images related to a complaint.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images to upload.
 *               complaintId:
 *                 type: integer
 *                 description: ID of the complaint related to the images.
 *             required:
 *               - images
 *               - complaintId
 *     responses:
 *       201:
 *         description: Images uploaded successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Images uploaded successfully.
 *               data:
 *                 - imageId: 1
 *                   url: "http://example.com/images/image1.jpg"
 *                 - imageId: 2
 *                   url: "http://example.com/images/image2.jpg"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-all-uploaded-complaint-images:
 *   get:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Get all uploaded complaint images.
 *     description: Retrieve a list of all uploaded images for complaints.
 *     responses:
 *       200:
 *         description: List of all uploaded complaint images.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: All uploaded complaint images fetched successfully.
 *               data:
 *                 - id: 1
 *                   url: "http://example.com/images/image1.jpg"
 *                   complaintId: 1
 *                 - id: 2
 *                   url: "http://example.com/images/image2.jpg"
 *                   complaintId: 1
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-single-uploaded-complaint-images/{id}:
 *   get:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Get a single uploaded complaint image by ID.
 *     description: Retrieve details of a specific uploaded complaint image by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complaint image to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the single uploaded complaint image.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint image details fetched successfully.
 *               data:
 *                 id: 1
 *                 url: "http://example.com/images/image1.jpg"
 *                 complaintId: 1
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/update-uploaded-complaint-images:
 *   post:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Update uploaded complaint images.
 *     description: Update details of an uploaded complaint image.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the image to update.
 *               url:
 *                 type: string
 *                 description: Updated URL of the image.
 *               complaintId:
 *                 type: integer
 *                 description: Updated complaint ID associated with the image.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Complaint image updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint image updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/delete-uploaded-complaint-images/{id}:
 *   delete:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Delete an uploaded complaint image by ID.
 *     description: Remove a specific complaint image by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complaint image to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint image deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint image deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/complaint-images-prepare-ppt/{id}:
 *   get:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Prepare PPT from complaint images.
 *     description: Generate a PowerPoint presentation from the images related to a specific complaint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complaint to generate the PPT.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PPT generated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: PPT prepared successfully.
 *               data:
 *                 pptUrl: "http://example.com/ppts/complaint_ppt.pptx"
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *
 * /dealer/get-requested-complaints:
 *   get:
 *     tags: [Dealer Routes - Complaint Images]
 *     summary: Get all requested complaints.
 *     description: Retrieve a list of all complaints that have been requested.
 *     responses:
 *       200:
 *         description: List of all requested complaints.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Requested complaints fetched successfully.
 *               data:
 *                 - id: 1
 *                   complaintTitle: "Product Issue"
 *                   requestDate: "2024-08-01"
 *                 - id: 2
 *                   complaintTitle: "Service Delay"
 *                   requestDate: "2024-08-05"
 *               totalCount: 2
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
dealerRouter.post('/dealer/upload-complaint-images', verifyDealerToken, uploadComplaintImages);
dealerRouter.get('/dealer/get-all-uploaded-complaint-images', verifyDealerToken, getAllUploadedImages);
dealerRouter.get('/dealer/get-single-uploaded-complaint-images/:id', verifyDealerToken, getSingleUploadedImagesById);
dealerRouter.post('/dealer/update-uploaded-complaint-images', verifyDealerToken, updateComplaintImages);
dealerRouter.delete('/dealer/delete-uploaded-complaint-images/:id', verifyDealerToken, deleteComplaintWorkImages);
dealerRouter.get('/dealer/complaint-images-prepare-ppt/:id', verifyDealerToken, getComplaintImagesForPPT); // corrected "domplaint" -> "complaint"
dealerRouter.get('/dealer/complaint-images-prepare-ppt/:id', verifyDealerToken, getComplaintImagesForPPT); // corrected "domplaint" -> "complaint"
dealerRouter.get('/dealer/get-requested-complaints', verifyDealerToken, getAllRequestedComplaints);
dealerRouter.get('/dealer/get-dealer-sidebar/:role_id', verifyDealerToken, getAllModule);


module.exports = dealerRouter;
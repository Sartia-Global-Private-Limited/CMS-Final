const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const complaintRouter = require("express").Router();

const {
    getComplaintsById,
    updateComplaintType,
    addComplaintType,
    complaintAssignTo,
    updateComplaintStatus,
    allNewComplaints,
    allPendingComplaints,
    allApprovedComplaints,
    allRejectedComplaints,
    allResolvedComplaints,
    complaintFlitter,
    getApprovelList,
    setComplaintApproval,
    notApprovalSetComplaint,
} = require("../../controllers/complaintTypeController");
const {
    getAllRequestedComplaints,
    getComplaintsDetailsById,
    getAllApprovedComplaints,
    getAllRejectedComplaints,
    getAllResolvedComplaints,
    getApprovedComplaintsDetailsById,
    approvedComplaints,
    getAllComplaints,
    getAllApprovedAssignComplaints,
    getAllApprovedUnAssignComplaints,
    reworkForResolvedComplaints,
    getOutletByIdNew,
    getRegionalByIdNew,
    getSaleByIdNew,
    getOrderByIdNew,
    reActiveToRejectedComplaints,
    getAreaManagerOfAssign,
    getSuperVisorOfAssign,
    getEndUsersOfAssign,
    holdAndTransferComplaints,
    allocateComplaintsToResolve,
    userToManagerArea,
    getManagerToComplaints,
    getRegionalOfficeToComplaints,
    assignedComplaintToUsers,
    getAllComplaintsExceptPending,
    getAllComplaintsById,

    importComplaint,
    getComplaintFullTimeline,
    getTotalFreeEndUsers,
    countTotalMemberOnSingleComplaint,
    getAllComplaintListForDropdown,
    getUserByComplaintId,
    updateAssignedComplaintToUsers,
    rejectedAssignComplaintToUsers,
} = require("../../controllers/contractorComplaintController");
const { markAsResolvedComplaints } = require("../../controllers/superAdminController");
const {
    getALLmanagersWithTeamMembers,
    getSuperVisorOnManagerId,
    getFreeEndUsersOnSuperVisorId,
} = require("../../controllers/assignController");
// --------- complaint modules --------------------
/**
 * @swagger
 * tags:
 *   - name: Contractor - Complaint Management
 *     description: Operations related to managing complaints for contractors.
 */

/**
 * @swagger
 * /contractor/complaint-assign:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Assign a complaint
 *     description: Assign a complaint to a contractor or team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for assigning a complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to assign.
 *                 example: 1
 *               assigneeId:
 *                 type: integer
 *                 description: The ID of the person or team to whom the complaint is assigned.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaint assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint assigned successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/create-complaint-type:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Create a new complaint type
 *     description: Add a new type of complaint to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint type to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeName:
 *                 type: string
 *                 description: The name of the complaint type.
 *                 example: Service Quality
 *     responses:
 *       201:
 *         description: Complaint type created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type created successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-requested-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get requested complaints
 *     description: Retrieve a list of all complaints requested by the contractor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requested complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaints-details/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get complaint details by ID
 *     description: Retrieve detailed information for a specific complaint by ID.
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
 *         description: Complaint details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 type: Service Quality
 *                 description: Complaint about service quality.
 *                 status: Requested
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-approved-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get approved complaints
 *     description: Retrieve a list of all approved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-rejected-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get rejected complaints
 *     description: Retrieve a list of all rejected complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-resolved-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all resolved complaints
 *     description: Retrieve a list of all resolved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resolved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints
 *     description: Retrieve a list of all complaints, regardless of status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-assign-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all approved and assigned complaints
 *     description: Retrieve a list of all approved and assigned complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved and assigned complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-approved-un-assign-complaints:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all approved but unassigned complaints
 *     description: Retrieve a list of all approved but unassigned complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved but unassigned complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/re-work-for-resolved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Rework for resolved complaints
 *     description: Mark a resolved complaint for rework.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint to rework.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to rework.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Complaint marked for rework successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint marked for rework successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-outlet-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all outlet details by ID
 *     description: Retrieve details of all outlets associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of outlet details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Outlet 1
 *                 - id: 2
 *                   name: Outlet 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-regional-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all regional office details by ID
 *     description: Retrieve details of all regional offices associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of regional office details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Regional Office 1
 *                 - id: 2
 *                   name: Regional Office 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-sales-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all sales details by ID
 *     description: Retrieve details of all sales associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Sale 1
 *                 - id: 2
 *                   name: Sale 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-order-by-id-new:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all order details by ID
 *     description: Retrieve details of all orders associated with a specific ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Order 1
 *                 - id: 2
 *                   name: Order 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/reactive-complaints-status-update/{id}:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Reactive complaint status update
 *     description: Update the status of a complaint from rejected back to active.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Details for reactivating the complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the complaint.
 *                 example: Active
 *     responses:
 *       200:
 *         description: Complaint status updated to active successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint status updated to active successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-area-manager-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get area manager assignments
 *     description: Retrieve a list of area managers assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of area manager assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Area Manager 1
 *                 - id: 2
 *                   name: Area Manager 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-supervisor-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get supervisor assignments
 *     description: Retrieve a list of supervisors assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supervisor assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: Supervisor 1
 *                 - id: 2
 *                   name: Supervisor 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-end-user-assign:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get end user assignments
 *     description: Retrieve a list of end users assigned to complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of end user assignments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   name: End User 1
 *                 - id: 2
 *                   name: End User 2
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/mark-as-resolved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Mark complaints as resolved
 *     description: Update the status of complaints to resolved.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints to mark as resolved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of complaint IDs to mark as resolved.
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Complaints marked as resolved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints marked as resolved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/hold-and-transfer-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Hold and transfer complaints
 *     description: Hold a complaint and transfer it to another team or person.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details for holding and transferring the complaint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to hold and transfer.
 *                 example: 1
 *               newAssigneeId:
 *                 type: integer
 *                 description: The ID of the new assignee for the complaint.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaint held and transferred successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint held and transferred successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-allocate-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update allocation of complaints
 *     description: Update the allocation of complaints for resolution.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints allocation update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newAssigneeId:
 *                 type: integer
 *                 description: The ID of the new assignee for the complaint.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Complaints allocation updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints allocation updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-user-to-supervisor-or-manager/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get user to supervisor or manager
 *     description: Retrieve details of a user assigned to a supervisor or manager.
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
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: User 1
 *                 assignedTo: Supervisor 1
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-area-manager-to-complaints/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get area manager assigned to complaints
 *     description: Retrieve details of the area manager assigned to a specific complaint.
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
 *         description: Area manager details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 name: Area Manager 1
 *                 assignedComplaints: [1, 2]
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-expect-pending-status:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints except pending status
 *     description: Retrieve a list of all complaints except those with pending status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints except pending status retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-complaints-by-id/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get all complaints by ID
 *     description: Retrieve a list of all complaints associated with a specific ID.
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
 *         description: List of complaints by ID retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - id: 1
 *                   type: Service Quality
 *                   description: Complaint about service quality.
 *                 - id: 2
 *                   type: Billing Issue
 *                   description: Complaint regarding billing issues.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/assign-complaint-to-user:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Assign complaint to user
 *     description: Assign a complaint to a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             complaint_id: 40
 *             user_id: 192
 *     responses:
 *       200:
 *         description: Assignment success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assigned successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-all-manager-list-with-total-free-end-users:
 *   get:
 *     summary: Retrieve all managers with their total free end users.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all managers with their total free end users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-supervisor-by-manager-with-count-free-end-users/{id}:
 *   get:
 *     summary: Retrieve all supervisors under a specific manager with count of free end users.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the manager to retrieve supervisors for.
 *     responses:
 *       200:
 *         description: List of all supervisors under the specified manager with count of free end users retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Manager not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-all-end-users-by-supervisor/{id}:
 *   get:
 *     summary: Retrieve all free end users under a specific supervisor.
 *     tags: [Contractor Routes - Manager and Supervisor Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the supervisor to retrieve end users for.
 *     responses:
 *       200:
 *         description: List of all free end users under the specified supervisor retrieved successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Supervisor not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/rejected-assign-complaint-users:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Reject assigned complaint users
 *     description: Reject the assignment of a complaint to users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: 14
 *             status: 4
 *             rejected_remark: "Assign user to reject testing"
 *     responses:
 *       200:
 *         description: Rejection success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assignment rejected successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/update-assign-complaint-to-user:
 *   post:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Update assigned complaint to user
 *     description: Update the assignment of a complaint to a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             complaints_id: 19
 *             action:
 *               - add:
 *                   assign_to: [20]
 *
 *     responses:
 *       200:
 *         description: Update success
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Complaint assignment updated successfully"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-total-member-on-single-complaint/{complaint_id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get total members on a single complaint
 *     description: Retrieve the total number of members assigned to a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: complaint_id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         example: 14
 *     responses:
 *       200:
 *         description: Total number of members on the complaint
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "members count"
 *               data: 5
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /contractor/get-complaints-timeline/{id}:
 *   get:
 *     tags: [Contractor Routes - Complaint Module]
 *     summary: Get complaints timeline
 *     description: Retrieve the full timeline of a specific complaint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the complaint
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The timeline of the complaint
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Fetched successfully"
 *               data:
 *                  complaintDetails:
 *                    complaint_id: 1
 *                    complaint_type: "TANK CLEANING WORK"
 *                    complaint_description: "ok"
 *                    complaint_generated_at: "2024-03-16 11:50:04 AM"
 *                  complaintRaiserDetails:
 *                    name: "CONTRACTOR 1"
 *                    image: "/super_admin_images/17218800209981000000082.jpg"
 *                  complaintApprovalData:
 *                    name: "CONTRACTOR 1"
 *                    image: "/super_admin_images/17218800209981000000082.jpg"
 *                    approve_title: "Complaint approved"
 *                    approve_remarks: "Complaint approved by Contractor"
 *                    approved_at: "2024-03-16 06:20:44 AM"
 *                  complaintAssignDetails:
 *                    assignData:
 *                      - id: 1
 *                        title: "Complaint Created."
 *                        remark: "New Complaint created by Contractor."
 *                        status: "created"
 *                        assigned_at: "2024-03-16 06:20:04 AM"
 *                        is_end_user_free: true
 *                  itemStockPunchHistory: []
 *                  fundExpensePunchHistory: []
 *                  areaManager:
 *                    status: true
 *                    message: "Area Manager found"
 *                    data:
 *                      - areaManagerDetails:
 *                          id: 148
 *                          name: "Altaf Ahmad"
 *                          employee_id: ""
 *                          image: "/user_images/1692263966479download (6).jpg"
 *                      - superVisorDetails:
 *                          id: 153
 *                          name: "supervisor"
 *                          employee_id: "CMS00014"
 *                          image: ""
 *                          manager_id: 148
 *
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

complaintRouter.post(
    "/complaint-assign",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    complaintAssignTo
);
complaintRouter.post(
    "/create-complaint-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    addComplaintType
);
complaintRouter.get(
    "/get-requested-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllRequestedComplaints
);
complaintRouter.get(
    "/get-complaints-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getComplaintsDetailsById
);
complaintRouter.get(
    "/get-approved-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllApprovedComplaints
);
complaintRouter.get(
    "/get-rejected-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllRejectedComplaints
);
complaintRouter.get(
    "/get-all-resolved-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllResolvedComplaints
);
complaintRouter.get(
    "/get-all-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllComplaints
);
complaintRouter.get(
    "/get-all-approved-assign-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllApprovedAssignComplaints
);
complaintRouter.get(
    "/get-all-approved-un-assign-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllApprovedUnAssignComplaints
);
complaintRouter.put(
    "/re-work-for-resolved-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    reworkForResolvedComplaints
);
complaintRouter.get(
    "/get-all-outlet-by-id-new",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getOutletByIdNew
);
complaintRouter.get(
    "/get-all-regional-by-id-new",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getRegionalByIdNew
);
complaintRouter.get(
    "/get-all-sales-by-id-new",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getSaleByIdNew
);
complaintRouter.get(
    "/get-all-order-by-id-new",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getOrderByIdNew
);
complaintRouter.put(
    "/reactive-complaints-status-update/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    reActiveToRejectedComplaints
);
complaintRouter.get(
    "/get-area-manager-assign",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getAreaManagerOfAssign
);
complaintRouter.get(
    "/get-supervisor-assign",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getSuperVisorOfAssign
);
complaintRouter.get(
    "/get-end-user-assign",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getEndUsersOfAssign
);
complaintRouter.post(
    "/mark-as-resolved-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    markAsResolvedComplaints
);
complaintRouter.put(
    "/hold-and-transfer-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    holdAndTransferComplaints
);
complaintRouter.put(
    "/update-allocate-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allocateComplaintsToResolve
);

complaintRouter.get(
    "/get-all-complaints-expect-pending-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllComplaintsExceptPending
);
complaintRouter.get(
    "/get-all-complaints-by-id/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllComplaintsById
);

complaintRouter.put(
    "/assign-complaint-to-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    assignedComplaintToUsers
);

complaintRouter.get(
    "/get-all-manager-list-with-total-free-end-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getALLmanagersWithTeamMembers
);
complaintRouter.get(
    "/get-all-supervisor-by-manager-with-count-free-end-users/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getSuperVisorOnManagerId
);
complaintRouter.get(
    "/get-all-end-users-by-supervisor/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    getFreeEndUsersOnSuperVisorId
);
complaintRouter.post(
    "/rejected-assign-complaint-users",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    rejectedAssignComplaintToUsers
);
complaintRouter.put(
    "/update-assign-complaint-to-user",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateAssignedComplaintToUsers
);
complaintRouter.get(
    "/get-total-member-on-single-complaint/:complaint_id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    countTotalMemberOnSingleComplaint
);
complaintRouter.get(
    "/get-complaints-timeline/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getComplaintFullTimeline
);

complaintRouter.post(
    "/import-complaint",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    importComplaint
);
/**
 * @swagger
 * /contractor/get-approved-complaints-details/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get approved complaints details by ID
 *     description: Retrieve details of approved complaints associated with a specific ID.
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
 *         description: Approved complaints details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 complaintType: Service Quality
 *                 description: Details of the approved complaint.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/approved-complaints:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Approve complaints
 *     description: Approve one or more complaints.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaints to approve.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of complaint IDs to approve.
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Complaints approved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaints approved successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/get-complaints/{id}:
 *   get:
 *     tags: [Contractor - Complaint Management]
 *     summary: Get complaints by ID
 *     description: Retrieve details of complaints associated with a specific ID.
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
 *         description: Complaints details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 id: 1
 *                 type: Billing Issue
 *                 description: Details of the complaint.
 *       400:
 *         description: Bad Request. Invalid or missing ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-complaint-type:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update complaint type
 *     description: Update the type of an existing complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint type to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newType:
 *                 type: string
 *                 description: The new type of the complaint.
 *                 example: Technical Issue
 *     responses:
 *       200:
 *         description: Complaint type updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint type updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/update-complaint-status:
 *   post:
 *     tags: [Contractor - Complaint Management]
 *     summary: Update complaint status
 *     description: Update the status of an existing complaint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the complaint status to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 description: The ID of the complaint to update.
 *                 example: 1
 *               newStatus:
 *                 type: string
 *                 description: The new status of the complaint.
 *                 example: Resolved
 *     responses:
 *       200:
 *         description: Complaint status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Complaint status updated successfully.
 *       400:
 *         description: Bad Request. Invalid or missing data.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
complaintRouter.get(
    "/get-approved-complaints-details/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getApprovedComplaintsDetailsById
);
complaintRouter.put(
    "/approved-complaints",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    approvedComplaints
);
complaintRouter.get(
    "/get-complaints/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getComplaintsById
);
complaintRouter.post(
    "/update-complaint-type",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateComplaintType
);
complaintRouter.post(
    "/update-complaint-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateComplaintStatus
);

// super admin

/**
 * @swagger
 * tags:
 *   - name: Super Admin - Complaint Management
 *     description: Operations related to complaint management for super admins.
 */

/**
 * @swagger
 * /super-admin/all-new-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all new complaints
 *     description: Retrieve a list of all new complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of new complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-pending-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all pending complaints
 *     description: Retrieve a list of all pending complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-approved-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all approved complaints
 *     description: Retrieve a list of all approved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-rejected-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all rejected complaints
 *     description: Retrieve a list of all rejected complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /super-admin/all-resolved-complains:
 *   post:
 *     tags: [Super Admin - Complaint Management]
 *     summary: Get all resolved complaints
 *     description: Retrieve a list of all resolved complaints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resolved complaints retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               complaints: [...]
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
complaintRouter.post(
    "/all-new-complains",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allNewComplaints
);
complaintRouter.post(
    "/all-pending-complains",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allPendingComplaints
);
complaintRouter.post(
    "/all-approved-complains",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allApprovedComplaints
);
complaintRouter.post(
    "/all-rejected-complains",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allRejectedComplaints
);
complaintRouter.post(
    "/all-resolved-complains",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    allResolvedComplaints
);

complaintRouter.post(
    "/complaint-flitter",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    complaintFlitter
);
complaintRouter.get(
    "/get-approvel-member-list",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getApprovelList
);
complaintRouter.post(
    "/set-complaint-approval",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    setComplaintApproval
);
complaintRouter.get(
    "/not-approval-set-complaint",
    verifyToken([process.env.SUPER_ADMIN_ROLE_ID]),
    notApprovalSetComplaint
);
module.exports = complaintRouter;

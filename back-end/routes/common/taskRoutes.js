const { createTaskComment } = require("../../controllers/taskActionController");
const {
    getAllTaskCategory,
    createTaskCategory,
    updateTaskCategoryDetails,
    removeTaskCategoryById,
} = require("../../controllers/taskCategoryController");
const {
    createTask,
    getAllTaskList,
    getTaskById,
    updateMainTaskStatus,
    updateTaskDetails,
    deleteTask,
} = require("../../controllers/taskManagerController");
const { verifyToken, checkPermission } = require("../../helpers/verifyToken");

const taskRouter = require("express").Router();

/**
 * @swagger
 * /contractor/task/create-task:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Create a new task
 *     description: Create a new task with the specified details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *                 example: "Design Homepage"
 *               description:
 *                 type: string
 *                 example: "Create the main landing page for the website."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-01"
 *               assignedTo:
 *                 type: string
 *                 example: "user_id_123"
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task created successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/get-task-lists:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get all task lists
 *     description: Retrieve a list of all tasks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task lists retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - taskId: "task_id_123"
 *                   taskName: "Design Homepage"
 *                   assignedTo: "user_id_123"
 *                   status: "In Progress"
 *                   dueDate: "2024-09-01"
 *                 - taskId: "task_id_456"
 *                   taskName: "Develop API"
 *                   assignedTo: "user_id_456"
 *                   status: "Completed"
 *                   dueDate: "2024-08-25"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/get-task-single-list/{id}:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get task details by ID
 *     description: Retrieve the details of a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task.
 *         required: true
 *         schema:
 *           type: string
 *           example: "task_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 taskId: "task_id_123"
 *                 taskName: "Design Homepage"
 *                 description: "Create the main landing page for the website."
 *                 assignedTo: "user_id_123"
 *                 status: "In Progress"
 *                 dueDate: "2024-09-01"
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/update-main-task-status:
 *   put:
 *     tags: [Contractor - Task Management]
 *     summary: Update main task status
 *     description: Update the status of the main task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               status:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Task status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task status updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/add-task-comment:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Add a comment to a task
 *     description: Add a comment to a specific task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               comment:
 *                 type: string
 *                 example: "This task is on track."
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Comment added successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/update-task-list:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update task details
 *     description: Update the details of an existing task.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "task_id_123"
 *               taskName:
 *                 type: string
 *                 example: "Updated Task Name"
 *               description:
 *                 type: string
 *                 example: "Updated description of the task."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-05"
 *     responses:
 *       200:
 *         description: Task details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task details updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/delete-task/{id}:
 *   delete:
 *     tags: [Contractor - Task Management]
 *     summary: Delete a task by ID
 *     description: Delete a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task.
 *         required: true
 *         schema:
 *           type: string
 *           example: "task_id_123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */

taskRouter.post(
    "/create-task",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createTask
);
taskRouter.get(
    "/get-task-lists",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllTaskList
);
taskRouter.get(
    "/get-task-single-list/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getTaskById
);
taskRouter.put(
    "/update-main-task-status",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateMainTaskStatus
); // method changed from post to put
taskRouter.post(
    "/add-task-comment",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createTaskComment
);
taskRouter.post(
    "/update-task-list",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateTaskDetails
);
taskRouter.delete(
    "/delete-task/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    deleteTask
);

// TASK MANAGER -> TASK CATEGORY

/**
 * @swagger
 * /contractor/task/task-category/get-all-task-category:
 *   get:
 *     tags: [Contractor - Task Management]
 *     summary: Get all task categories
 *     description: Retrieve a list of all available task categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task categories retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               data:
 *                 - categoryId: 1
 *                   categoryName: "Development"
 *                   description: "Tasks related to development."
 *                 - categoryId: 2
 *                   categoryName: "Design"
 *                   description: "Tasks related to design."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/task-category/create-task-category:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Create a new task category
 *     description: Create a new task category with the specified details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: "Development"
 *               description:
 *                 type: string
 *                 example: "Tasks related to development."
 *     responses:
 *       201:
 *         description: Task category created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category created successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/task-category/update-task-category:
 *   post:
 *     tags: [Contractor - Task Management]
 *     summary: Update task category details
 *     description: Update the details of an existing task category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               categoryName:
 *                 type: string
 *                 example: "Updated Development"
 *               description:
 *                 type: string
 *                 example: "Updated description for the development category."
 *     responses:
 *       200:
 *         description: Task category updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category updated successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /contractor/task/task-category/delete-task-category/{id}:
 *   delete:
 *     tags: [Contractor - Task Management]
 *     summary: Delete a task category by ID
 *     description: Delete a specific task category by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task category.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task category deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Task category deleted successfully."
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Task category not found.
 *       500:
 *         description: Internal server error.
 */

taskRouter.get(
    "/task-category/get-all-task-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    getAllTaskCategory
);
taskRouter.post(
    "/task-category/create-task-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    createTaskCategory
);
taskRouter.post(
    "/task-category/update-task-category",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    updateTaskCategoryDetails
);
taskRouter.delete(
    "/task-category/delete-task-category/:id",
    verifyToken([process.env.CONTRACTOR_ROLE_ID, process.env.SUPER_ADMIN_ROLE_ID]),
    checkPermission,
    removeTaskCategoryById
);

module.exports = taskRouter;

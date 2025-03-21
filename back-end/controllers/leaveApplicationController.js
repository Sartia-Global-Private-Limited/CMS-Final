require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, leaveApplicationValidations } = require("../helpers/validation");
const { getDifferenceBetweenTwoDays, calculatePagination } = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const requestIp = require("request-ip");
const { insertEmployeeActivityLog } = require("../helpers/activityLog");
const { insertNotifications } = require("../helpers/notifications");
const { addCreatedByCondition } = require("../helpers/commonHelper");

const applyLeave = async (req, res, next) => {
    try {
        const { leave_type_id, start_date, end_date, reason, user_id } = req.body;
        const { error } = leaveApplicationValidations.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
        var response = "";
        var applicant_id = 0;

        if (user_id != null) {
            applicant_id = user_id;
        } else {
            applicant_id = req.user.user_id;
        }

        const createdBy = req.user.user_id;

        const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date);
        if (totalDays >= 0) {
            // const totalHours = totalDays * 8;
            let totalHours;
            if (totalDays == 0) {
                totalHours = 8;
            } else {
                totalHours = totalDays * 8;
            }

            var storePath = "";

            if (req.files != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + "/public/leave_application/" + imageName;
                storePath = "/leave_application/" + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                    }
                });
            }

            const insertQuery = `INSERT INTO leave_applications SET leave_type_id = '${leave_type_id}', start_date = '${start_date}', end_date = '${end_date}', total_hours = ${totalHours}, total_days = ${totalDays}, applicant_id = '${applicant_id}', reason = '${reason}', supporting_documents = '${storePath}', created_by = '${createdBy}'`;

            const queryResult = await db.query(insertQuery, [
                leave_type_id,
                start_date,
                end_date,
                totalHours,
                totalDays,
                applicant_id,
                reason,
                storePath,
                createdBy,
            ]);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                response = "Leave apply successfully";
                res.status(StatusCodes.OK).json({ status: true, message: response });

                // Notifications
                const notificationData = [
                    {
                        userId: req.user.user_id,
                        roleId: req.user.user_type,
                        title: "Leave Application",
                        message: req.body.reason,
                    },
                ];

                const notificationsSave = await insertNotifications(notificationData);
            } else {
                response = "Error! Leave not applied";
                res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: " Start date cannot be after the end date." });
        }
    } catch (error) {
        return next(error);
        response = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    // Log user activity
    const logData = [
        {
            userId: req.user.user_id,
            roleId: req.user.user_type,
            timestamp: moment().unix(),
            action: "applyLeave method of leaveApplicationController",
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: "response",
        },
    ];

    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const getAllLeaveApplications = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;

        const searchData = req.query.search || "";
        const status = req.query.status || null;
        const role_id = req.user.user_type;

        const pageFirstResult = (currentPage - 1) * pageSize;

        // Base query and conditions
        let whereConditions = "1=1"; // Default condition to avoid empty WHERE clause
        let orderBy = "ORDER BY leave_applications.id DESC";
        let limit = `LIMIT ${pageFirstResult}, ${pageSize}`;

        // Add conditions dynamically
        if (id) whereConditions += ` AND leave_applications.id = ${id}`;
        if (status) whereConditions += ` AND leave_applications.status = '${status}'`;

        if (searchData) {
            whereConditions += ` AND (
                leave_applications.reason LIKE '%${searchData}%' OR 
                users.name LIKE '%${searchData}%' OR 
                leave_types.leave_type LIKE '%${searchData}%' OR 
                leave_applications.status LIKE '%${searchData}%'
            )`;
        }
        let selectQuery;
        // Construct the query
        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            selectQuery = `
            SELECT 
                leave_applications.*, 
                leave_types.leave_type, 
                admins.name as applicant_name, 
                admins.image as user_image,
                admins.employee_id
            FROM 
                leave_applications 
            LEFT JOIN 
                leave_types ON leave_types.id = leave_applications.leave_type_id 
            LEFT JOIN 
                admins ON admins.id = leave_applications.applicant_id
            WHERE 
                ${whereConditions} 
            ${orderBy} 
            ${limit}
        `;
        } else {
            selectQuery = `
            SELECT 
                leave_applications.*, 
                leave_types.leave_type, 
                users.name as applicant_name, 
                users.image as user_image,
                users.employee_id
            FROM 
                leave_applications 
            LEFT JOIN 
                leave_types ON leave_types.id = leave_applications.leave_type_id 
            LEFT JOIN 
                users ON users.id = leave_applications.applicant_id
            WHERE 
                ${whereConditions} 
            ${orderBy} 
            ${limit}
        `;
        }

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "leave_applications",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // Execute the query
        const queryResults = await db.query(selectQuery);

        // Handle response
        if (queryResults.length > 0) {
            let countSelectQuery;
            if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
                countSelectQuery = `
                SELECT COUNT(*) as total 
                FROM leave_applications 
                LEFT JOIN leave_types ON leave_types.id = leave_applications.leave_type_id 
                LEFT JOIN admins ON admins.id = leave_applications.applicant_id 
                WHERE leave_applications.deleted = ?`;
            } else {
                countSelectQuery = `
                SELECT COUNT(*) as total 
                FROM leave_applications 
                LEFT JOIN leave_types ON leave_types.id = leave_applications.leave_type_id 
                LEFT JOIN users ON users.id = leave_applications.applicant_id 
                WHERE leave_applications.deleted = ?`;
            }

            countSelectQuery = addCreatedByCondition(countSelectQuery, {
                table: "leave_applications",
                created_by: req.user.user_id,
                role: req.user.user_type,
            });

            constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
            if (constTotalLength.length > 0) totalPages = Math.round(constTotalLength[0].total / pageSize);
            const total = constTotalLength[0].total;

            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);

            let pageDetails = [];
            pageDetails.push({
                pageSize,
                currentPage,
                totalPages,
                total,
                pageStartResult,
                pageEndResult,
            });
            if (id) {
                res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: queryResults[0],
                    pageDetails: pageDetails[0],
                });
            } else {
                res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Fetched successfully",
                    data: queryResults,
                    pageDetails: pageDetails[0],
                });
            }

        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

// const updateLeaveApplication = async (req, res, next) => {
//     try {
//         const { status, id } = req.body;
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

//         const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`;
//         const queryResult = await db.query(updateQuery, [status, id]);

//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Leave application status changed to " + status + " successfully",
//             });
//         } else {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({ status: false, message: "Something went wrong, please try again later" });
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

// const updateLeaveApplication = async (req, res, next) => {
//     try {
//         const { status, id } = req.body;

//         // Validate input parameters
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res.status(StatusCodes.FORBIDDEN).json({ 
//                 status: false, 
//                 message: error.message 
//             });
//         }

//         // Validate status value
//         const validStatuses = ['pending','approved','rejected','assigned'];
//         if (!validStatuses.includes(status)) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: false,
//                 message: "Invalid status value. Must be 'pending', 'approved', 'rejected', or 'assigned'",
//             });
//         }

//         // Get the leave application details first
//         const getLeaveQuery = `
//             SELECT la.*, u.employee_id 
//             FROM leave_applications la
//             JOIN users u ON la.applicant_id = u.id
//             WHERE la.id = ? AND la.deleted = 0
//         `;
//         const [leaveApplication] = await db.query(getLeaveQuery, [id]);

//         if (!leaveApplication) {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 status: false,
//                 message: "Leave application not found"
//             });
//         }

//         // Check if leave is already processed
//         if (leaveApplication.status === 'approved' || leaveApplication.status === 'rejected') {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: false,
//                 message: "Leave application is already processed"
//             });
//         }

//         // Update leave application status
//         const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`;
//         const updateResult = await db.query(updateQuery, [status, id]);

//         if (updateResult.affectedRows === 0) {
//             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//                 status: false,
//                 message: "Failed to update leave application"
//             });
//         }

//         // If status is approved, create attendance records
//         if (status === 'approved') {
//             const startDate = moment(leaveApplication.start_date);
//             const endDate = moment(leaveApplication.end_date);

//             // Check for existing attendance records
//             const checkAttendanceQuery = `
//                 SELECT DATE(in_time) as date
//                 FROM attendances 
//                 WHERE user_id = ? 
//                 AND DATE(in_time) BETWEEN ? AND ?
//                 AND status = 'incomplete'
//             `;
//             const existingAttendance = await db.query(
//                 checkAttendanceQuery,
//                 [leaveApplication.applicant_id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
//             );

//             // Prepare dates to process (excluding dates with existing attendance)
//             const datesToProcess = [];
//             let currentDate = startDate.clone();
//             while (currentDate.isSameOrBefore(endDate)) {
//                 if (!existingAttendance.some(record => 
//                     moment(record.date).isSame(currentDate, 'day'))) {
//                     datesToProcess.push(currentDate.format('YYYY-MM-DD'));
//                 }
//                 currentDate.add(1, 'day');
//             }
//             console.log('datesToProcess: ', datesToProcess);


//             // Insert attendance records if there are dates to process
//             if (datesToProcess.length > 0) {
//                 const insertAttendanceQuery = `
//                     INSERT INTO attendances 
//                     (user_id, in_time, out_time, status, attendance_status, note, created_at, updated_at)
//                     VALUES ?
//                 `;

//                 const attendanceValues = datesToProcess.map(date => [
//                     leaveApplication.applicant_id,
//                     `${date} 09:00:00`,
//                     `${date} 18:00:00`,
//                     'incomplete',
//                     '0',  // Leave status
//                     'LEAVE',
//                     new Date(),
//                     new Date()
//                 ]);

//                 await db.query(insertAttendanceQuery, [attendanceValues]);
//             }
//         }

//         // Send success response
//         res.status(StatusCodes.OK).json({
//             status: true,
//             message: `Leave application ${status} successfully`,
//             datesProcessed: status === 'approved' ? datesToProcess : []
//         });

//     } catch (error) {
//         console.error('Error in updateLeaveApplication:', error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "Something went wrong, please try again later"
//         });
//     }
// };

const updateLeaveApplication = async (req, res, next) => {
    // Declare datesToProcess in a broader scope
    let datesToProcess = [];

    try {
        const { status, id } = req.body;

        // Validate input parameters
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message
            });
        }

        // Validate status value
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid status value. Must be 'pending', 'approved', or 'rejected'"
            });
        }

        // Get the leave application details first
        const getLeaveQuery = `
            SELECT la.*, u.employee_id 
            FROM leave_applications la
            JOIN users u ON la.applicant_id = u.id
            WHERE la.id = ? AND la.deleted = 0
        `;
        const [leaveApplication] = await db.query(getLeaveQuery, [id]);

        if (!leaveApplication) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "Leave application not found"
            });
        }

        // Check if leave is already processed
        if (leaveApplication.status === 'approved' || leaveApplication.status === 'rejected') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Leave application is already processed"
            });
        }

        // Update leave application status
        const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`;
        const updateResult = await db.query(updateQuery, [status, id]);

        if (updateResult.affectedRows === 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Failed to update leave application"
            });
        }

        // If status is approved, create attendance records
        // if (status === 'approved') {
        //     const startDate = moment(leaveApplication.start_date);
        //     const endDate = moment(leaveApplication.end_date);

        //     // Check for existing attendance records
        //     const checkAttendanceQuery = `
        //         SELECT DATE(in_time) as date
        //         FROM attendances 
        //         WHERE user_id = ? 
        //         AND DATE(in_time) BETWEEN ? AND ?
        //         AND status = 'incomplete'
        //     `;
        //     const existingAttendance = await db.query(
        //         checkAttendanceQuery,
        //         [leaveApplication.applicant_id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
        //     );

        //     // Prepare dates to process (excluding dates with existing attendance)
        //     datesToProcess = [];
        //     let currentDate = startDate.clone();
        //     while (currentDate.isSameOrBefore(endDate)) {
        //         if (!existingAttendance.some(record => 
        //             moment(record.date).isSame(currentDate, 'day'))) {
        //             datesToProcess.push(currentDate.format('YYYY-MM-DD'));
        //         }
        //         currentDate.add(1, 'day');
        //     }

        //     // Insert attendance records if there are dates to process
        //     if (datesToProcess.length > 0) {
        //         const insertAttendanceQuery = `
        //             INSERT INTO attendances 
        //             (user_id, in_time, out_time, status, attendance_type, attendance_status, note, created_at, updated_at)
        //             VALUES ?
        //         `;

        //         const attendanceValues = datesToProcess.map(date => [
        //             leaveApplication.applicant_id,
        //             `${date} 09:00:00`,
        //             `${date} 18:00:00`,
        //             'incomplete',
        //             '2', // Attendance type
        //             '0',  // Leave status
        //             "LEAVE",
        //             new Date(),
        //             new Date()
        //         ]);

        //         await db.query(insertAttendanceQuery, [attendanceValues]);
        //     }
        // }


        // If status is approved, create or update attendance records
        if (status === 'approved') {
            const startDate = moment(leaveApplication.start_date);
            const endDate = moment(leaveApplication.end_date);

            let currentDate = startDate.clone();
            while (currentDate.isSameOrBefore(endDate)) {
                const attendanceDate = currentDate.format('YYYY-MM-DD');

                // Check if attendance data already exists for this date
                const existingRecord = await db.query(
                    `SELECT id FROM attendances WHERE user_id = ? AND DATE(in_time) = ?`,
                    [leaveApplication.applicant_id, attendanceDate]
                );

                if (existingRecord.length > 0) {
                    // Update existing record to reflect leave
                    await db.query(
                        `UPDATE attendances
                            SET status = ?, attendance_type = ?, attendance_status = ?, note = ?, updated_at = ?
                            WHERE user_id = ? AND DATE(in_time) = ?`,
                        [
                            'incomplete', // status - consistent with insert logic
                            '2',          // attendance_type - consistent with insert logic
                            '0',          // attendance_status - Leave status (consistent with insert logic comment)
                            "LEAVE",      // note - consistent with insert logic
                            new Date(),
                            leaveApplication.applicant_id,
                            attendanceDate
                        ]
                    );
                } else {
                    // Insert new attendance record for leave
                    const insertAttendanceQuery = `
                INSERT INTO attendances
                (user_id, in_time, out_time, status, attendance_type, attendance_status, note, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
                    const attendanceValues = [
                        leaveApplication.applicant_id,
                        `${attendanceDate} 09:00:00`, // Default in_time
                        `${attendanceDate} 18:00:00`, // Default out_time
                        'incomplete',
                        '2',          // Attendance type
                        '0',          // Leave status
                        "LEAVE",
                        new Date(),
                        new Date()
                    ];
                    await db.query(insertAttendanceQuery, attendanceValues);
                }
                currentDate.add(1, 'day');
            }
        }

        // Send success response
        res.status(StatusCodes.OK).json({
            status: true,
            message: `Leave application ${status} successfully`,
            datesProcessed: datesToProcess
        });

    } catch (error) {
        console.error('Error in updateLeaveApplication:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Something went wrong, please try again later"
        });
    }
};

const getSingleLeaveApplication = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name, users.image as user_image, users.mobile as phone, users.email FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id WHERE leave_applications.id = ?;`;
        const queryResults = await db.query(selectQuery, [id]);

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults[0] });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong" });
        }
    } catch (error) {
        return next(error);
    }
};

const leaveApplicationSoftDelete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `UPDATE leave_applications SET deleted = ? WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [1, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Leave application deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    applyLeave,
    getAllLeaveApplications,
    updateLeaveApplication,
    getSingleLeaveApplication,
    leaveApplicationSoftDelete,
};

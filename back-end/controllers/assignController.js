var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const {
    getManagerFreeTeamMember,
    getSuperVisorUsers,
    checkUserHasNoActiveComplaints,
    addCreatedByCondition,
    getAdminSuperVisorUsers,
} = require("../helpers/commonHelper");
const { getUserDetails, getAdminDetails } = require("../helpers/general");

const getALLmanagersWithTeamMembers = async (req, res, next) => {
    try {
        const complaintId = req.query.complaintId;
        const createdBy = req.user.user_id;
        const role_id = req.user.user_type;

        let selectQuery;
        if (role_id == 1) {
            selectQuery = `
                SELECT hr_teams.manager_id, hr_teams.supervisor_id, a.id AS id, a.name AS manager_name, a.employee_id, a.image AS admin_image, r.name AS role_name
                FROM hr_teams 
                LEFT JOIN admins a ON a.id = hr_teams.manager_id
                LEFT JOIN roles r ON r.id = hr_teams.manager_id
                WHERE hr_teams.created_by = ? AND hr_teams.is_deleted = '0'`;
        } else {
            selectQuery = `
                SELECT hr_teams.manager_id, hr_teams.supervisor_id, u.id AS id, u.name AS manager_name, u.employee_id, u.image AS admin_image, r.name AS role_name
                FROM hr_teams 
                LEFT JOIN users u ON u.id = hr_teams.manager_id
                LEFT JOIN roles r ON r.id = hr_teams.manager_id
                WHERE hr_teams.created_by = ? AND hr_teams.is_deleted = '0'`;
        }

        const queryResult = await db.query(selectQuery, [createdBy]);
        let finalData = [];
        let isManagerAssigned = false;
        let managerDetails;
        if (queryResult.length > 0) {
            if (complaintId != null && complaintId != undefined) {
                const checkManagerAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(
                    complaintId,
                    "manager",
                    role_id
                );
                managerDetails = checkManagerAssignedOrNot;
            }

            let allSupervisorUsers = [];
            let supervisorUsers;
            for (const row of queryResult) {
                // console.log("queryResult: ", queryResult);
                let type;
                if (role_id == 1) {
                    type = 1;
                    supervisorUsers = await db.query(
                        `
                        SELECT a.id, a.name, a.employee_id, a.image, r.name AS role_name
                        FROM admins a
                        LEFT JOIN hr_teams ht ON ht.supervisor_id = a.id
                        LEFT JOIN roles r ON r.id = a.user_type
                        WHERE a.id = ? AND a.is_deleted = '0' AND ht.is_deleted = '0' `,
                        [row.supervisor_id]
                    );
                } else {
                    supervisorUsers = await db.query(
                        `
                        SELECT u.id, u.name, u.employee_id, u.image, r.name AS role_name 
                        FROM users u
                        LEFT JOIN hr_teams ht ON ht.supervisor_id = u.id
                        LEFT JOIN roles r ON r.id = u.user_type
                        WHERE u.id = ? AND u.is_deleted = '0' AND ht.is_deleted = '0' `,
                        [row.supervisor_id]
                    );
                }
                allSupervisorUsers = [...supervisorUsers];
                // console.log('allSupervisorUsers: ', allSupervisorUsers);

                // const freeEndUsersCount = await getManagerFreeTeamMember(row.id);
                let free_supervisor_users = 0;
                let free_users = 0;
                const supervisorUsersWithNoComplaints = [];
                for (let supervisorUser of allSupervisorUsers) {
                    // console.log('supervisorUser: ', supervisorUser);
                    // console.log('supervisorUser.id: ', supervisorUser.id);
                    const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);
                    // console.log('userComplaints: ', userComplaints);
                    const endUser = await getSuperVisorUsers(supervisorUser.id, type);
                    // console.log('endUser: ', endUser);
                    const { free_end_users } = await getEndUsers(endUser);
                    // console.log('free_end_users: ', free_end_users);

                    if (free_end_users > 0) {
                        free_supervisor_users += 1;
                        free_users += free_end_users;
                    }
                    // // Check if userComplaints is an array before using filter
                    if (Array.isArray(userComplaints) && userComplaints.length === 0) {
                        supervisorUsersWithNoComplaints.push(supervisorUser);
                    }
                }
                if (managerDetails != null && managerDetails != undefined) {
                    if (managerDetails.manager_id == row.id) {
                        isManagerAssigned = true;
                    }
                }
                finalData.push({
                    id: row.id,
                    employee_id: row?.employee_id || "",
                    name: row?.manager_name || "",
                    image: row?.admin_image || "",
                    user_type: row?.role_name || "",
                    isManagerAssigned: isManagerAssigned,
                    // free_end_users: freeEndUsersCount.finalData?.length,
                    // users: freeEndUsersCount.finalData
                    supervisorUsers: supervisorUsersWithNoComplaints,
                    free_supervisor_users: free_supervisor_users,
                    free_end_users: free_users,
                });
            }

            finalData = finalData.reduce((acc, row) => {
                // Check if an entry with the same 'id' already exists
                const existingEntry = acc.find((item) => item.id === row.id);

                if (existingEntry) {
                    // Merge supervisorUsers
                    existingEntry.supervisorUsers = [...existingEntry.supervisorUsers, ...row.supervisorUsers];

                    // Sum up free_supervisor_users and free_end_users
                    existingEntry.free_supervisor_users += row.free_supervisor_users;
                    existingEntry.free_end_users += row.free_end_users;
                } else {
                    // Add a new unique entry
                    acc.push({ ...row });
                }

                return acc;
            }, []);

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        // const managerRoleId = process.env.MANAGER_ROLE_ID;
        // const createdBy = req.user.user_id;
        // let selectQuery = `SELECT * FROM users WHERE user_type = ?`;
        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "users",
        //     created_by: createdBy,
        //     role: req.user.user_type,
        // });
        // const queryResult = await db.query(selectQuery, [managerRoleId]);
        // if (queryResult.length > 0) {
        //     var finalData = [];
        //     var isManagerAssigned = false;
        //     let managerDetails;

        //     if (complaintId != null && complaintId != undefined) {
        //         const checkManagerAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(
        //             complaintId,
        //             "manager"
        //         );
        //         managerDetails = checkManagerAssignedOrNot;
        //     }

        //     for (const row of queryResult) {
        //         const supervisorUsers = await db.query(
        //             `SELECT id, name, employee_id, image FROM users WHERE manager_id = ?`,
        //             [row.id]
        //         );

        //         // const freeEndUsersCount = await getManagerFreeTeamMember(row.id);
        //         let free_supervisor_users = 0;
        //         let free_users = 0;
        //         const supervisorUsersWithNoComplaints = [];
        //         for (let supervisorUser of supervisorUsers) {
        //             // console.log('supervisorUser: ', supervisorUser);
        //             // console.log('supervisorUser.id: ', supervisorUser.id);
        //             const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);
        //             const endUser = await getSuperVisorUsers(supervisorUser.id);
        //             // console.log('endUser: ', endUser);
        //             const { free_end_users } = await getEndUsers(endUser);

        //             if (free_end_users > 0) {
        //                 free_supervisor_users += 1;
        //                 free_users += free_end_users;
        //             }
        //             // Check if userComplaints is an array before using filter
        //             if (Array.isArray(userComplaints) && userComplaints.length === 0) {
        //                 supervisorUsersWithNoComplaints.push(supervisorUser);
        //             }
        //         }
        //         if (managerDetails != null && managerDetails != undefined) {
        //             if (managerDetails.manager_id == row.id) {
        //                 isManagerAssigned = true;
        //             }
        //         }
        //         finalData.push({
        //             id: row.id,
        //             employee_id: row.employee_id,
        //             name: row.name,
        //             image: row.image,
        //             user_type: row.user_type,
        //             isManagerAssigned: isManagerAssigned,
        //             // free_end_users: freeEndUsersCount.finalData?.length,
        //             // users: freeEndUsersCount.finalData
        //             supervisorUsers: supervisorUsersWithNoComplaints,
        //             free_supervisor_users: free_supervisor_users,
        //             free_end_users: free_users,
        //         });
        //     }
        //     res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData });
        // } else {
        //     res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        // }
    } catch (error) {
        return next(error);
    }
};

const getALLSupervisors = async (req, res, next) => {
    try {
        const type = req.query.type || 0;
        const roleName = req.params.role_name.trim();
        let selectQuery;
        let role_condition;
        if (type == 1) {
            if (roleName == "Manager") {
                role_condition = `hr_teams.manager_id = admins.id`;
            } else if (roleName == "Supervisor") {
                role_condition = `hr_teams.supervisor_id = admins.id`;
            }
            selectQuery = `SELECT admins.id, admins.name, admins.employee_id, admins.user_type, admins.image 
                FROM admins 
                LEFT JOIN hr_teams ON ${role_condition}
                WHERE hr_teams.is_deleted = '0' AND hr_teams.created_by = '${req.user.user_id}' AND admins.is_deleted = '0'`;
        } else {
            if (roleName == "Manager") {
                role_condition = `hr_teams.manager_id = users.id`;
            } else if (roleName == "Supervisor") {
                role_condition = `hr_teams.supervisor_id = users.id`;
            }
            selectQuery = `SELECT users.*
                FROM users 
                LEFT JOIN hr_teams ON ${role_condition} 
                WHERE hr_teams.is_deleted = '0' AND hr_teams.created_by = '${req.user.user_id}' AND users.is_deleted = '0'`;
        }
        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0) {
            let finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    employee_id: row.employee_id,
                    name: row.name,
                    image: row.image,
                    user_type: row.user_type,
                    user_role: row.role_name,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

        // if (type == 1) {
        //     selectQuery = `SELECT admins.id, admins.name, admins.employee_id, admins.user_type, admins.image, roles.name as role_name
        //     FROM admins
        //     LEFT JOIN roles ON roles.id = admins.user_type
        //     WHERE roles.name = ?`;
        // } else {
        //     selectQuery = `SELECT users.*, roles.name as role_name
        //     FROM users
        //     LEFT JOIN roles ON roles.id = users.user_type
        //     WHERE roles.name = ?`;
        // }
        // const queryResult = await db.query(selectQuery, [roleName]);

        // if (queryResult.length > 0) {
        //     let finalData = [];

        //     for (const row of queryResult) {
        //         finalData.push({
        //             id: row.id,
        //             employee_id: row.employee_id,
        //             name: row.name,
        //             image: row.image,
        //             user_type: row.user_type,
        //             user_role: row.role_name,
        //         });
        //     }
        //     res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData });
        // } else {
        //     res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        // }
    } catch (error) {
        return next(error);
    }
};

// const getSuperVisorOnManagerId = async (req,res,next) => {
//     try {
//         const id = req.params.id;
//         const complaintId = req.query.complaintId;
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE manager_id = ?`, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var finalData = [];
//             var isSupervisorAssigned = false;
//             let supervisorDetails;

//             if (complaintId != null && complaintId != undefined) {
//                 const checkSupervisorAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(complaintId, "supervisor");
//                 supervisorDetails = checkSupervisorAssignedOrNot;
//             }

//             for (const row of queryResult) {
//                 const supervisorUsers = await getSuperVisorUsers(row.id);

//                 if (supervisorUsers.length > process.env.VALUE_ZERO) {
//                     const usersWithNoComplaints = [];

//                     for (const supervisorUser of supervisorUsers) {
//                         const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);

//                         // Check if userComplaints is an array before using filter
//                         if (Array.isArray(userComplaints) && userComplaints.length === 0) {
//                             usersWithNoComplaints.push({
//                                 ...supervisorUser,
//                             });
//                         }
//                     }
//                     if (supervisorDetails != null && supervisorDetails != undefined) {
//                         if (supervisorDetails.supervisor_id == row.id) {
//                             isSupervisorAssigned = true;
//                         }
//                     }

//                     finalData.push({
//                         id: row.id,
//                         name: row.name,
//                         employee_id: row.employee_id,
//                         image: row.image,
//                         isSupervisorAssigned: isSupervisorAssigned,
//                         free_end_users: usersWithNoComplaints.length,
//                         users: usersWithNoComplaints
//                     });
//                 }
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Supervisors found",
//                     data: finalData
//                 });
//         } else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Supervisors not found"
//                 });
//         }
//     } catch (error) {next(error)
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// };

// const getFreeEndUsersOnSuperVisorId = async (req,res,next) => {

//     try {
//         const id = req.params.id;
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var finalData = [];

//             for (const row of queryResult) {
//                 const userComplaints = await checkUserHasNoActiveComplaints(row.id);
//                 const isAssigned = userComplaints.length > 0 && userComplaints.some(complaint => complaint.assign_to === row.id);
//                 finalData.push({
//                     id: row.id,
//                     name: row.name,
//                     employee_id: row.employee_id,
//                     image: row.image,
//                     isAssigned: isAssigned
//                 });
//             }

//             console.log("fialData", finalData);

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "end users found",
//                     data: finalData
//                 });
//         } else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "end users not found"
//                 });
//         }
//     } catch (error) {next(error)
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }

const getSuperVisorOnManagerId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const type = req.query.type || "";
        const role_id = req.user.user_type;

        if (role_id == 1) {
            if (!type) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: false,
                    message: "Type is required",
                });
            }
        }
        const complaintId = req.query.complaintId;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }
        let queryResult;
        if (type == 1) {
            queryResult = await db.query(
                `
            SELECT admins.id, admins.name, admins.employee_id, admins.image, admins.created_by  
            FROM admins 
            LEFT JOIN hr_teams ht ON ht.supervisor_id = admins.id
            WHERE  (admins.is_deleted = '0' AND ht.is_deleted = '0' AND ht.manager_id = ?)  
            ORDER BY id 
            `,
                [id]
            );
        } else {
            queryResult = await db.query(
                `
                SELECT users.id, users.name, users.employee_id, users.image, users.created_by  
                FROM users 
                LEFT JOIN hr_teams ht ON ht.supervisor_id = users.id
                WHERE  (users.is_deleted = '0' AND ht.is_deleted = '0' AND ht.manager_id = ?)  
                ORDER BY id `,
                [id]
            );
        }

        if (queryResult.length > process.env.VALUE_ZERO) {
            // console.log('queryResult: ', queryResult);
            let finalData = [];
            let isSupervisorAssigned = false;
            let supervisorDetails;
            if (complaintId != null && complaintId != undefined) {
                const checkSupervisorAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(
                    complaintId,
                    "supervisor"
                );
                supervisorDetails = checkSupervisorAssignedOrNot;
            }

            for (const row of queryResult) {
                let supervisorUsers;
                if (type == 1) {
                    // supervisorUsers = await getAdminSuperVisorUsers(row.id);
                    supervisorUsers = await getSuperVisorUsers(row.id, type);
                } else {
                    supervisorUsers = await getSuperVisorUsers(row.id);
                }
                // console.log('supervisorUsers: ', supervisorUsers);
                if (supervisorUsers.length > process.env.VALUE_ZERO) {
                    // console.log('supervisorUsers: ', supervisorUsers);
                    const { usersWithNoComplaints, free_end_users } = await getEndUsers(supervisorUsers);

                    if (supervisorDetails != null && supervisorDetails != undefined) {
                        if (supervisorDetails.supervisor_id == row.id) {
                            isSupervisorAssigned = true;
                        }
                    }
                    finalData.push({
                        id: row.id,
                        name: row.name,
                        employee_id: row.employee_id,
                        image: row.image,
                        isSupervisorAssigned: isSupervisorAssigned,
                        free_end_users: free_end_users,
                        users: usersWithNoComplaints,
                    });
                }
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Supervisors found",
                data: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Supervisors not found",
            });
        }

        // if (type == 1) {
        //     queryResult = await db.query(`
        //     SELECT admins.id, admins.name, admins.employee_id, admins.image, admins.created_by
        //     FROM admins
        //     WHERE  (admins.is_deleted = '0')
        //     ORDER BY id
        // `);
        //     // hrQuery = await db.query(`
        //     //     SELECT supervisor_id AS id, name, employee_id, image
        //     //     FROM admins
        //     //     WHERE id = ?`
        //     // );
        // } else {
        //     queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE manager_id = ?`, [id]);
        // }
        // if (queryResult.length > process.env.VALUE_ZERO) {
        //     let finalData = [];
        //     let isSupervisorAssigned = false;
        //     let supervisorDetails;
        //     if (complaintId != null && complaintId != undefined) {
        //         const checkSupervisorAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(
        //             complaintId,
        //             "supervisor"
        //         );
        //         supervisorDetails = checkSupervisorAssignedOrNot;
        //     }
        //     for (const row of queryResult) {
        //         let supervisorUsers;
        //         if (type == 1) {
        //             supervisorUsers = await getAdminSuperVisorUsers(row.id);
        //         } else {
        //             supervisorUsers = await getSuperVisorUsers(row.id);
        //         }
        //         if (supervisorUsers.length > process.env.VALUE_ZERO) {
        //             // console.log('supervisorUsers: ', supervisorUsers);
        //             const { usersWithNoComplaints, free_end_users } = await getEndUsers(supervisorUsers);

        //             if (supervisorDetails != null && supervisorDetails != undefined) {
        //                 if (supervisorDetails.supervisor_id == row.id) {
        //                     isSupervisorAssigned = true;
        //                 }
        //             }
        //             finalData.push({
        //                 id: row.id,
        //                 name: row.name,
        //                 employee_id: row.employee_id,
        //                 image: row.image,
        //                 isSupervisorAssigned: isSupervisorAssigned,
        //                 free_end_users: free_end_users,
        //                 users: usersWithNoComplaints,
        //             });
        //         }
        //     }
        //     return res.status(StatusCodes.OK).json({
        //         status: true,
        //         message: "Supervisors found",
        //         data: finalData,
        //     });
        // } else {
        //     return res.status(StatusCodes.OK).json({
        //         status: false,
        //         message: "Supervisors not found",
        //     });
        // }
    } catch (error) {
        return next(error);
    }
};

async function getEndUsers(supervisorUsers) {
    try {
        const usersWithNoComplaints = [];
        for (const supervisorUser of supervisorUsers) {
            const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);
            // Check if userComplaints is an array before using filter
            if (Array.isArray(userComplaints) && userComplaints.length === 0) {
                usersWithNoComplaints.push({
                    ...supervisorUser,
                });
            }
        }
        return { usersWithNoComplaints, free_end_users: usersWithNoComplaints.length };
    } catch (error) {
        throw error;
    }
}

const getFreeEndUsersOnSuperVisorId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }
        const role_id = req.user.user_type || 0;
        let queryResult;
        let usersBySupervisorId;
        if (role_id == 1) {
            // usersBySupervisorId = await getSuperVisorUsers(id, role_id);
            // console.log('usersBySupervisorId: ', usersBySupervisorId);
            queryResult = await getSuperVisorUsers(id, role_id);
        } else {
            // usersBySupervisorId = await getSuperVisorUsers(id);
            queryResult = await getSuperVisorUsers(id);
        }

        // console.log('queryResult: ', queryResult);
        if (queryResult.length > process.env.VALUE_ZERO) {
            let finalData = [];
            for (const row of queryResult) {
                // console.log('row: ', row);
                const userComplaints = await checkUserHasNoActiveComplaints(row.id);
                // const isAssigned = userComplaints.length > 0 && userComplaints.some(complaint => complaint.assign_to === row.id);
                const isAssigned =
                    Array.isArray(userComplaints) &&
                    userComplaints.length > 0 &&
                    userComplaints.some((complaint) => complaint.assign_to === row.id);
                finalData.push({
                    id: row.id,
                    name: row.name,
                    employee_id: row.employee_id,
                    image: row.image,
                    isAssigned: isAssigned,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "end users found",
                data: finalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "end users not found",
            });
        }

        // if (error) {
        //     return res.status(StatusCodes.FORBIDDEN).json({
        //         status: false,
        //         message: error.message,
        //     });
        // }
        // const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [
        //     id,
        // ]);
        // if (queryResult.length > process.env.VALUE_ZERO) {
        //     let finalData = [];
        //     for (const row of queryResult) {
        //         const userComplaints = await checkUserHasNoActiveComplaints(row.id);
        //         // const isAssigned = userComplaints.length > 0 && userComplaints.some(complaint => complaint.assign_to === row.id);
        //         const isAssigned =
        //             Array.isArray(userComplaints) &&
        //             userComplaints.length > 0 &&
        //             userComplaints.some((complaint) => complaint.assign_to === row.id);
        //         finalData.push({
        //             id: row.id,
        //             name: row.name,
        //             employee_id: row.employee_id,
        //             image: row.image,
        //             isAssigned: isAssigned,
        //         });
        //     }
        //     return res.status(StatusCodes.OK).json({
        //         status: true,
        //         message: "end users found",
        //         data: finalData,
        //     });
        // } else {
        //     return res.status(StatusCodes.OK).json({
        //         status: false,
        //         message: "end users not found",
        //     });
        // }
    } catch (error) {
        return next(error);
    }
};

const getAreaManagerOfUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const queryResult = await db.query(
            `SELECT id, name, employee_id, image, supervisor_id FROM users WHERE id = ?`,
            [id]
        );
        if (queryResult.length > process.env.VALUE_ZERO) {
            const supervisor_id = queryResult[0].supervisor_id;
            const getManagerDetailsQueryResult = await db.query(
                `SELECT id, name, employee_id, image, manager_id FROM users WHERE id = ?`,
                [supervisor_id]
            );

            if (getManagerDetailsQueryResult.length > process.env.VALUE_ZERO) {
                const manager_id = getManagerDetailsQueryResult[0].manager_id;
                const areaManagerDetails = await db.query(
                    `SELECT id, name, employee_id, image FROM users WHERE id = ?`,
                    [manager_id]
                );

                if (areaManagerDetails.length > process.env.VALUE_ZERO) {
                    return res.status(StatusCodes.OK).json({
                        status: true,
                        message: "Area Manager found",
                        data: areaManagerDetails[0],
                    });
                } else {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: "Area Manager not found",
                    });
                }
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Area Manager not found",
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Area Manager not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function getComplaintAssignUserManagerAndSupervisor(complaintId, userType, role_id) {
    // console.log('complaintId, userType, role_id: ', complaintId, userType, role_id);
    try {
        const { error } = checkPositiveInteger.validate({ id: complaintId });

        if (error) {
            return error.message;
        }

        const assignComplaintDetails = await db.query(
            `SELECT * FROM complaints_timeline WHERE complaints_id = '${complaintId}' AND status = 'assigned' ORDER BY id DESC LIMIT 1`
        );

        if (assignComplaintDetails.length > 0) {
            let finalData = [];
            let getAssignUserDetails;
            const assignTo = assignComplaintDetails[0].assign_to;
            // console.log("assignTo: ", assignTo);
            if (assignTo) {
                // get assign user details
                if (role_id == 1) getAssignUserDetails = await getAdminDetails(assignTo);
                else getAssignUserDetails = await getUserDetails(assignTo);
                // console.log("getAssignUserDetails: ", getAssignUserDetails);
                if (getAssignUserDetails.length > 0) {
                    const supervisorId = getAssignUserDetails[0].supervisor_id;
                    // get assign user supervisor details
                    const getAssignUserSupervisorDetails = await getUserDetails(supervisorId);

                    if (getAssignUserSupervisorDetails.length > 0) {
                        const assignUserSupervisorDetails = {
                            supervisor_id: getAssignUserSupervisorDetails[0].id,
                            supervisor_name: getAssignUserSupervisorDetails[0].name,
                            supervisor_employee_id: getAssignUserSupervisorDetails[0].employee_id,
                            supervisor_image: getAssignUserSupervisorDetails[0].image,
                        };

                        if (userType == "supervisor") {
                            return assignUserSupervisorDetails;
                        }

                        const managerId = getAssignUserSupervisorDetails[0].manager_id;
                        // get assign user manager details
                        const getAssignUserManagerDetails = await getUserDetails(managerId);

                        if (getAssignUserManagerDetails.length > 0) {
                            const assignUserManagerDetails = {
                                manager_id: getAssignUserManagerDetails[0].id,
                                manager_name: getAssignUserManagerDetails[0].name,
                                manager_employee_id: getAssignUserManagerDetails[0].employee_id,
                                manager_image: getAssignUserManagerDetails[0].image,
                            };

                            if (userType == "manager") {
                                return assignUserManagerDetails;
                            }
                        }
                    }
                    return finalData;
                }
            }
            // return res.status(StatusCodes.OK).json({
            //     status: true,
            //     message: "Assign Complaint Details found",
            //     data: finalData,
            // });
            return finalData;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getALLmanagersWithTeamMembers,
    getSuperVisorOnManagerId,
    getFreeEndUsersOnSuperVisorId,
    getAreaManagerOfUser,
    getALLSupervisors,
};

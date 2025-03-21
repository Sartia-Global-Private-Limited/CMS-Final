var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const {
    getPermissionOfModulesUsingRoleId,
    getSubModuleWithSubModulesWithPermission,
    getAdminDetailsById,
    getUserDetails,
    roleById,
    getAllStoredActiveRoles,
} = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");

// const getAllModule = async (req, res, next) => {
//     try {
//         // get the type of user fetching side-bar permissions
//         const role_id = req.params?.role_id || "";
//         let selectQuery;
//         let whereConditions = "";
//         let loggedInUserType = "";
//         let moduleGranted = [];

//         // console.log('role_id: ', role_id);
//         let getRoleDetail;
//         let createdForJSON;
//         if (role_id != "") {
//             getRoleDetail = await roleById(role_id);
//             if (getRoleDetail.length == 0) {
//                 return res.status(403).json({
//                     status: false,
//                     message: "Role Not Found, Access Denied",
//                 });
//             } else {
//                 createdForJSON = JSON.parse(`[${getRoleDetail?.created_for}]`) || [];
//                 console.log("createdForJSON: ", createdForJSON);
//                 if (role_id != 1 && getRoleDetail.created_by == 1) {
//                     if (Array.isArray(createdForJSON) && createdForJSON.length > 0 && createdForJSON.includes(1)) {
//                         loggedInUserType = "ADMIN";
//                         whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;

//                         moduleGranted =
//                             getRoleDetail?.modules != null && getRoleDetail?.modules.length > 0
//                                 ? JSON.parse(getRoleDetail?.modules)
//                                 : [];

//                         if (moduleGranted.length > 0) {
//                             moduleGranted = moduleGranted.join(",");
//                             whereConditions += ` AND id IN (${moduleGranted})`;
//                         } else {
//                             return res.status(StatusCodes.OK).json({
//                                 status: false,
//                                 message: "No modules are allowed OR Modules not assigned",
//                             });
//                         }
//                     } else {
//                         if (Array.isArray(createdForJSON) && createdForJSON.length > 0) {
//                             // ENERGY-COMPANY
//                             if (createdForJSON.includes(2)) {
//                                 loggedInUserType = "ENERGY-COMPANY";
//                                 whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                                 // CONTRACTOR
//                             } else if (createdForJSON.includes(3)) {
//                                 loggedInUserType = "CONTRACTOR";
//                                 whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                                 // DEALER
//                             } else if (createdForJSON.includes(4)) {
//                                 loggedInUserType = "DEALER";
//                                 whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                             } else {
//                                 if (role_id == 2) {
//                                     loggedInUserType = "ENERGY-COMPANY";
//                                     whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                                 } else if (role_id == 3) {
//                                     loggedInUserType = "CONTRACTOR";
//                                     whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                                 } else if (role_id == 4) {
//                                     loggedInUserType = "DEALER";
//                                     whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                                 } else {
//                                     throw new Error("No Panel Found for this user");
//                                 }
//                             }
//                         }

//                         if (role_id == 1) {
//                                     loggedInUserType = "ADMIN";
//                                     whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//                         }
//                     }
//                 }
//             }
//         } else {
//             selectQuery = `SELECT * FROM modules WHERE is_deleted = '0' ORDER BY id`;
//         }

//         if (whereConditions != "" && role_id != "") {
//             selectQuery = `SELECT * FROM modules ${whereConditions} AND is_deleted = '0' ORDER BY id`;
//         } else {
//             selectQuery = `SELECT * FROM modules WHERE is_deleted = '0' ORDER BY id`;
//         }

//         if (role_id != "" && createdForJSON.includes(1)) {
//             loggedInUserType = "ADMIN";
//             moduleGranted =
//                 getRoleDetail?.modules != null && getRoleDetail?.modules.length > 0
//                     ? JSON.parse(getRoleDetail?.modules)
//                     : [];
//         }

//         let getModulesQuery;
//         let purchasedModulesId = [];
//         if (moduleGranted.length > 0) {
//             purchasedModulesId = moduleGranted;
//         }
//         const parentModuleObj = {};
//         purchasedModulesId.forEach((element) => {
//             parentModuleObj[element] = element;
//         });

//         console.log("whereConditions: ", whereConditions);
//         getModulesQuery = `SELECT * FROM modules ${whereConditions} AND is_deleted = 0 ORDER BY id`;
//         console.log('getModulesQuery: ', getModulesQuery);

//         const modules = await db.query(getModulesQuery);
//         const moduleIds = modules.map((e) => e.id);
//         const modulesObj = {};
//         for (const module of modules) {
//             modulesObj[module.id] = module;
//             module.submodules = [];
//         }
//         const getSubModulesQuery = `SELECT * FROM sub_modules ${whereConditions} AND module_id IN (${moduleIds}) AND is_deleted = 0 ORDER BY id`;
//         const subModules = moduleIds.length === 0 ? [] : await db.query(getSubModulesQuery);
//         const subModulesObj = {};
//         for (const subMod of subModules) {
//             subModulesObj[subMod.id] = subMod;
//             subMod.modulesOfSubModule = [];
//         }
//         const subModIds = subModules.map((subMod) => subMod.id);
//         const getSubSubModulesQuery = `SELECT * FROM module_of_sub_modules ${whereConditions} AND sub_module_id IN (${subModIds}) AND is_deleted = 0 ORDER BY id`;
//         const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
//         const subSubModulesObj = {};
//         for (const subSubMod of subSubModules) {
//             subSubModulesObj[subSubMod.id] = subSubMod;
//         }

//         for (const module in modulesObj) {
//             modulesObj[module].submodules = subModules.filter((e) => e.module_id == module);
//         }

//         for (const subMod in subModulesObj) {
//             subModulesObj[subMod].modulesOfSubModule = subSubModules.filter((e) => e.sub_module_id == subMod);
//         }

//         let create_permission = 0;
//         let view_permission = 0;
//         let update_permission = 0;
//         let delete_permission = 0;
//         let submodules;

//         let sidebarList = Object.values(modulesObj);

//         const finalResult = sidebarList.map(async (element) => {
//             const modulePermissionData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, role_id);
//             if (modulePermissionData.length > 0) {
//                 create_permission = modulePermissionData[0].created;
//                 view_permission = modulePermissionData[0].viewed;
//                 update_permission = modulePermissionData[0].updated;
//                 delete_permission = modulePermissionData[0].deleted;
//             }

//             element.create = create_permission;
//             element.view = view_permission;
//             element.update = update_permission;
//             element.delete = delete_permission;

//             submodules = await getSubModuleWithSubModulesWithPermission(
//                 element.id,
//                 req.user.user_type,
//                 loggedInUserType
//             );

//             // if role is SUPER-ADMIN
//             if (role_id == 1) {
//                 return {
//                     ...element,
//                     status: 1,
//                     create: 1,
//                     view: 1,
//                     delete: 1,
//                     update: 1,
//                     submodules,
//                 };
//             } else {
//                 if (parentModuleObj[element.id]) {
//                     element.status = 1;
//                     element.submodules.map(async (submodule) => {
//                         submodule.status = 1;
//                         submodule.modulesOfSubModule.map((subSubModule) => {
//                             subSubModule.status = 1;
//                             return subSubModule;
//                         });
//                         return submodule;
//                     });

//                     return {
//                         ...element,
//                         create: create_permission,
//                         view: view_permission,
//                         update: update_permission,
//                         delete: delete_permission,
//                         submodules: await getSubModuleWithSubModulesWithPermission(
//                             element.id,
//                             req.user.user_type,
//                             role_id
//                         ),
//                     };
//                 } else {
//                     element.status = 0;
//                     element.submodules.map((submodule) => {
//                         submodule.status = 0;
//                         submodule.create = 0;
//                         submodule.view = 0;
//                         submodule.update = 0;
//                         submodule.delete = 0;
//                         submodule.modulesOfSubModule.forEach((subSubModule) => {
//                             subSubModule.status = 0;
//                             subSubModule.create = 0;
//                             subSubModule.view = 0;
//                             subSubModule.update = 0;
//                             subSubModule.delete = 0;
//                             return subSubModule;
//                         });
//                         return submodule;
//                     });
//                     return {
//                         ...element,
//                         create: 0,
//                         view: 0,
//                         update: 0,
//                         delete: 0,
//                     };
//                 }
//             }
//         });
//         const values = await Promise.all(finalResult);
//         return res.status(200).json({ status: true, message: "Sidebar Fetched successfully", data: values });
//     } catch (error) {
//         return next(error);
//     }
// };

// const getAllModuleForSuperAdminUser = async (req, res, next) => {
//     try {
//         let selectQuery;
//         let whereConditions;
//         let loggedInUserType;
//         let moduleGranted;

//         // get the type of user fetching side-bar permissions
//         // const role_id = req.params.role_id || "";
//         const role_id = req.user.user_type || "";
//         const getRoleDetail = await roleById(role_id);
//         if (getRoleDetail.length == 0) {
//             return res.status(403).json({
//                 status: false,
//                 message: "Role Not Found, Access Denied",
//             });
//         } else {
//             if (getRoleDetail.created_by == 1 && getRoleDetail.created_for == 1) {
//                 loggedInUserType = "ADMIN";
//                 whereConditions = `WHERE type LIKE '%${loggedInUserType}%'`;
//             } else {
//                 throw new Error("Invalid Access");
//             }
//         }

//         moduleGranted =
//             getRoleDetail?.modules != null && getRoleDetail?.modules.length > 0
//                 ? JSON.parse(getRoleDetail?.modules)
//                 : [];
//         if (moduleGranted.length > 0) {
//             moduleGranted = moduleGranted.join(",");
//             whereConditions += ` AND id IN (${moduleGranted})`;
//         } else {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: "No modules are allowed to access",
//             });
//         }

//         selectQuery = `SELECT * FROM modules ${whereConditions} AND is_deleted = '0' ORDER BY id`;

//         await db.query(selectQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message });

//             if (result.length > process.env.VALUE_ZERO) {
//                 const final = result.map(async (element) => {
//                     const modulePermissionData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, role_id);

//                     let view_permission = 0;
//                     let delete_permission = 0;
//                     let update_permission = 0;
//                     let create_permission = 0;
//                     let submodules;

//                     if (modulePermissionData.length > 0) {
//                         create_permission = modulePermissionData[0].created;
//                         view_permission = modulePermissionData[0].viewed;
//                         delete_permission = modulePermissionData[0].deleted;
//                         update_permission = modulePermissionData[0].updated;
//                     }
//                     submodules = await getSubModuleWithSubModulesWithPermission(element.id, role_id, loggedInUserType);

//                     return {
//                         ...element,
//                         create: create_permission,
//                         view: view_permission,
//                         delete: delete_permission,
//                         update: update_permission,
//                         submodules,
//                     };
//                 });

//                 Promise.all(final).then((values) => {
//                     res.status(200).json({ status: true, message: "Modules fetched successfully", data: values });
//                 });
//             } else {
//                 return res.status(200).json({ status: false, message: "No data found" });
//             }
//         });
//     } catch (error) {
//         return next(error);
//     }
// };

const getAllModule = async (req, res, next) => {
    try {
        const role_id = req.params?.role_id || ""; // Get role_id from request
        let whereConditions = "WHERE is_deleted = 0";
        let loggedInUserType = "";
        let moduleGranted = [];
        let createdForJSON = [];
        let selectQuery;

        if (role_id) {
            const getRoleDetail = await roleById(role_id);

            if (![getRoleDetail].length) {
                return res.status(403).json({
                    status: false,
                    message: "Role Not Found, Access Denied",
                });
            }

            // Parse `created_for` and `modules`
            createdForJSON = JSON.parse(`[${getRoleDetail?.created_for}]`) || [];
            moduleGranted =
                getRoleDetail?.modules != null && getRoleDetail?.modules.length > 0
                    ? JSON.parse(getRoleDetail.modules)
                    : [];

            // Determine panel type and apply conditions
            if (role_id == 1 || createdForJSON.includes(1)) {
                // Superadmin panel: Fetch all ADMIN modules
                loggedInUserType = "ADMIN";
                whereConditions += ` AND type LIKE '%${loggedInUserType}%'`;
            } else if (role_id == 2 || createdForJSON.includes(2)) {
                // Energy-Company panel
                loggedInUserType = "ENERGY-COMPANY";
                whereConditions += ` AND type LIKE '%${loggedInUserType}%'`;
            } else if (role_id == 3 || createdForJSON.includes(3)) {
                // Contractor panel
                loggedInUserType = "CONTRACTOR";
                whereConditions += ` AND type LIKE '%${loggedInUserType}%'`;
            } else if (role_id == 4 || createdForJSON.includes(4)) {
                // Dealer panel
                loggedInUserType = "DEALER";
                whereConditions += ` AND type LIKE '%${loggedInUserType}%'`;
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No panel found for this role",
                });
            }


            if (createdForJSON.includes(1) && moduleGranted.length > 0) {
                // Modules are assigned, restrict to granted modules
                whereConditions += ` AND id IN (${moduleGranted.join(",")})`;
            } else if (createdForJSON.includes(1) && moduleGranted.length == 0) {
                // No modules assigned for this role
                return res.status(200).json({
                    status: false,
                    message: "No modules are allowed OR Modules not assigned",
                });
            }
        }

        // if(req.user.user_type == 1) {
        //     loggedInUserType = "ADMIN";
        // } else if (req.user.user_type == 2) {
        //     loggedInUserType = "ENERGY-COMPANY";
        // } else if (req.user.user_type == 3) {
        //     loggedInUserType = "CONTRACTOR";
        // } else if (req.user.user_type == 4) {
        //     loggedInUserType = "DEALER";
        // }

        // Construct query to fetch modules
        // selectQuery = `SELECT * FROM modules ${whereConditions} ORDER BY id`;
        selectQuery = `SELECT * FROM modules WHERE type LIKE '%${loggedInUserType}%' AND is_deleted = 0 ORDER BY id`;
        // console.log("selectQuery: ", selectQuery);

        // Fetch parent modules
        const modules = await db.query(selectQuery);
        const moduleIds = modules.map((module) => module.id);

        let purchasedModulesId = [];
        if (moduleGranted.length > 0) {
            purchasedModulesId = moduleGranted;
        }

        const parentModuleObj = {};
        purchasedModulesId.forEach((element) => {
            parentModuleObj[element] = element;
        });
        let whereConditionForSubAndSubModules = "";
        // let type = "";
        // if (createdForJSON.includes(0)) {
        //     type = loggedInUserType;
        //     whereConditionForSubAndSubModules = `AND type LIKE '%${type}%'`;
        // } else if (!createdForJSON.includes(0)) {
            whereConditionForSubAndSubModules = `AND type LIKE '%${loggedInUserType}%'`;
        // }
        // Fetch submodules and sub-submodules
        const subModules = moduleIds.length
            ? await db.query(
                  `SELECT * FROM sub_modules WHERE module_id IN (${moduleIds}) AND is_deleted = 0 ${whereConditionForSubAndSubModules} ORDER BY id`
                )
            : [];
        const subModuleIds = subModules.map((subMod) => subMod.id);

        const subSubModules = subModuleIds.length
            ? await db.query(
                  `SELECT * FROM module_of_sub_modules WHERE sub_module_id IN (${subModuleIds}) AND is_deleted = 0 ${whereConditionForSubAndSubModules} ORDER BY id`
                )
            : [];

        // Structure data
        const modulesObj = modules.reduce((acc, module) => {
            module.submodules = [];
            acc[module.id] = module;
            return acc;
        }, {});

        const subModulesObj = subModules.reduce((acc, subModule) => {
            subModule.modulesOfSubModule = [];
            acc[subModule.id] = subModule;
            return acc;
        }, {});

        subSubModules.forEach((subSubModule) => {
            if (subModulesObj[subSubModule.sub_module_id]) {
                subModulesObj[subSubModule.sub_module_id].modulesOfSubModule.push(subSubModule);
            }
        });

        subModules.forEach((subModule) => {
            if (modulesObj[subModule.module_id]) {
                modulesObj[subModule.module_id].submodules.push(subModule);
            }
        });

        // Assign permissions and prepare final response
        // const sidebarList = Object.values(modulesObj).map((module) => {
        //     module.create = 0;
        //     module.view = 0;
        //     module.update = 0;
        //     module.delete = 0;

        //     module.submodules.forEach((subModule) => {
        //         subModule.create = 0;
        //         subModule.view = 0;
        //         subModule.update = 0;
        //         subModule.delete = 0;

        //         subModule.modulesOfSubModule.forEach((subSubModule) => {
        //             subSubModule.create = 0;
        //             subSubModule.view = 0;
        //             subSubModule.update = 0;
        //             subSubModule.delete = 0;
        //         });
        //     });

        //     // If superadmin, allow all permissions
        //     if (role_id == 1) {
        //         module.create = 1;
        //         module.view = 1;
        //         module.update = 1;
        //         module.delete = 1;
        //         module.submodules.forEach((subModule) => {
        //             subModule.create = 1;
        //             subModule.view = 1;
        //             subModule.update = 1;
        //             subModule.delete = 1;

        //             subModule.modulesOfSubModule.forEach((subSubModule) => {
        //                 subSubModule.create = 1;
        //                 subSubModule.view = 1;
        //                 subSubModule.update = 1;
        //                 subSubModule.delete = 1;
        //             });
        //         });
        //     }

        //     return module;
        // });

        // return res.status(200).json({
        //     status: true,
        //     message: "Sidebar fetched successfully",
        //     data: sidebarList,
        // });

        let create_permission = 0;
        let view_permission = 0;
        let update_permission = 0;
        let delete_permission = 0;
        let submodules;

        let sidebarList = Object.values(modulesObj);

        const finalResult = sidebarList.map(async (element) => {
            const modulePermissionData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, role_id);
            if (modulePermissionData.length > 0) {
                // if(modulePermissionData[0].module_id == 1) console.log('modulePermissionData[0]: ', modulePermissionData[0]);
                // console.log('modulePermissionData[0]: ', modulePermissionData[0]);
                create_permission = modulePermissionData[0].created;
                view_permission = modulePermissionData[0].viewed;
                update_permission = modulePermissionData[0].updated;
                delete_permission = modulePermissionData[0].deleted;
            }

            element.create = create_permission;
            element.view = view_permission;
            element.update = update_permission;
            element.delete = delete_permission;

            submodules = await getSubModuleWithSubModulesWithPermission(
                element.id,
                role_id,
                loggedInUserType
            );
            
            // if role is SUPER-ADMIN
            if (role_id == 1) {
                // return {
                //     ...element,
                //     status: 1,
                //     create: 1,
                //     view: 1,
                //     delete: 1,
                //     update: 1,
                //     submodules,
                // };

                element.status = 1;
                element.submodules.map((submodule) => {
                    submodule.status = 1;
                    submodule.create = 1;
                    submodule.view = 1;
                    submodule.update = 1;
                    submodule.delete = 1;
                    submodule.modulesOfSubModule.forEach((subSubModule) => {
                        subSubModule.status = 1;
                        subSubModule.create = 1;
                        subSubModule.view = 1;
                        subSubModule.update = 1;
                        subSubModule.delete = 1;
                        return subSubModule;
                    });
                    return submodule;
                });
                return {
                    ...element,
                    create: 1,
                    view: 1,
                    update: 1,
                    delete: 1,
                };
            } else {
                // if superadmin's employee and has module access
                // console.log('moduleGranted: ', moduleGranted);
                if (moduleGranted.length > 0) {
                    // console.log("parentModuleObj: ", parentModuleObj);
                    if (parentModuleObj[element.id]) {
                        // console.log("element: ", element);
                        element.status = 1;
                        element.submodules.map( (submodule) => {
                            // console.log('submodule: ', submodule.create);
                            submodule.status = 1;
                            submodule.modulesOfSubModule.map((subSubModule) => {
                                subSubModule.status = 1;
                                return subSubModule;
                            });
                            return submodule;
                        });

                        return {
                            ...element,
                            // create: create_permission,
                            // view: view_permission,
                            // update: update_permission,
                            // delete: delete_permission,
                            submodules
                        };
                    } else {
                        element.status = 0;
                        element.submodules.map((submodule) => {
                            submodule.status = 0;
                            submodule.create = 0;
                            submodule.view = 0;
                            submodule.update = 0;
                            submodule.delete = 0;
                            submodule.modulesOfSubModule.forEach((subSubModule) => {
                                subSubModule.status = 0;
                                subSubModule.create = 0;
                                subSubModule.view = 0;
                                subSubModule.update = 0;
                                subSubModule.delete = 0;
                                return subSubModule;
                            });
                            return submodule;
                        });
                        return {
                            ...element,
                            create: 0,
                            view: 0,
                            update: 0,
                            delete: 0,
                        };
                    }
                } else {
                    // console.log("element: ", element);
                    element.status = 1;
                    element.submodules.map((submodule) => {
                        submodule.status = 1;
                        submodule.modulesOfSubModule.map((subSubModule) => {
                            subSubModule.status = 1;
                            return subSubModule;
                        });
                        return submodule;
                    });

                    return {
                        ...element,
                        // create: create_permission,
                        // view: view_permission,
                        // update: update_permission,
                        // delete: delete_permission,
                        submodules,
                    };
                }
            }
        });
        const values = await Promise.all(finalResult);
        return res.status(200).json({ status: true, message: "Sidebar Fetched successfully", data: values });
    } catch (error) {
        return next(error);
    }
};

const getModuleByPlanId = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        var getLoggedUserDetails;

        if (loggedUserType == process.env.CONTRACTOR_ROLE_ID) {
            getLoggedUserDetails = await getAdminDetailsById(loggedUserId);
        } else {
            const usersDetails = await getUserDetails(loggedUserId);
            getLoggedUserDetails = usersDetails[0];
        }

        if (Object.keys(getLoggedUserDetails).length > 0) {
            const plan_id = getLoggedUserDetails.plan_id;
            const { error } = checkPositiveInteger.validate({ id: plan_id });

            if (error) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: error.message,
                });
            }

            const getPlainModules = await db.query("SELECT id as plan_id, module FROM plans WHERE id = ?", [plan_id]);
            const planModules = JSON.parse(JSON.parse(getPlainModules[0].module)).join(",");

            const selectQuery = `SELECT * FROM modules WHERE is_deleted = '0' AND id IN(${planModules}) ORDER BY order_number`;

            await db.query(selectQuery, async (err, result) => {
                if (err) return res.status(500).json({ status: false, message: err.message });

                if (result.length > process.env.VALUE_ZERO) {
                    const final = result.map(async (element) => {
                        const modulePermissionData = await getPermissionOfModulesUsingRoleId(
                            element.id,
                            0,
                            0,
                            loggedUserType
                        );

                        let create_permission = 0;
                        let view_permission = 0;
                        let delete_permission = 0;
                        let update_permission = 0;
                        if (modulePermissionData.length > 0) {
                            create_permission = modulePermissionData[0].created;
                            view_permission = modulePermissionData[0].viewed;
                            delete_permission = modulePermissionData[0].deleted;
                            update_permission = modulePermissionData[0].updated;
                        }
                        return {
                            ...element,
                            create: create_permission,
                            view: view_permission,
                            delete: delete_permission,
                            update: update_permission,
                            submodules: await getSubModuleWithSubModulesWithPermission(element.id, loggedUserType),
                        };
                    });

                    Promise.all(final).then((values) => {
                        res.status(200).json({ status: true, message: "Module fetched successfully", data: values });
                    });
                } else {
                    return res.status(200).json({ status: false, message: "No data found" });
                }
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Sorry! users details not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAllModule, getModuleByPlanId };

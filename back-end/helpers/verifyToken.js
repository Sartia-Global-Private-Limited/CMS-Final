const jwt = require("jsonwebtoken");
const {
    getAllStoredActiveRoles,
    getAndCheckModulePermissionForAction,
    getPermissionOfModulesUsingRoleId,
    roleById,
} = require("./general");
const { StatusCodes } = require("http-status-codes");
const { makeDb } = require("../db");

const db = makeDb();

const verifyToken = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
            const token = (authHeader && authHeader.split(" ")[1]) || authHeader;

            if (!token) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: false,
                    message: `Token missing, please login first`,
                });
            }

            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        status: false,
                        message: err.message,
                    });
                }

                if (allowedRoles && allowedRoles.length > 0) {
                    // console.log("allowedRoles: ", allowedRoles);
                    const allStoredActiveRoles = await getAllStoredActiveRoles();

                    if (allStoredActiveRoles.status) {
                        const userRoleExists = allStoredActiveRoles.data.some(
                            (role) => role.id == decoded.user_type && allowedRoles.includes(role.id.toString())
                        );

                        if (!userRoleExists) {
                            const roleExists = allStoredActiveRoles.data.some((role) => role.id == decoded.user_type);
                            // console.log("roleExists: ", roleExists);
                            if (roleExists) {
                                const getSingleRoleDetail = await roleById(decoded.user_type);

                                // check if logged in user is Super Admin's Employee
                                if (getSingleRoleDetail.created_by == 1 && getSingleRoleDetail.created_for == 1) {
                                    req.user = decoded;
                                    return next();
                                }
                            } else {
                                return res.status(StatusCodes.FORBIDDEN).json({
                                    status: false,
                                    message: "Forbidden access - invalid role",
                                });
                            }
                        }
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({
                            status: false,
                            message: "Forbidden access - role check failed",
                        });
                    }
                }

                // console.log('decoded: ', decoded);
                const userData = {
                    status: decoded.user_data.status,
                    is_deleted: decoded.user_data.is_deleted,
                }
                // console.log('userData: ', userData);
                if (userData?.status == process.env.INACTIVE_STATUS) {
                    return res.status(400).json({
                        status: false,
                        message: "Your account is not activated yet. Please contact our support team for assistance.",
                    });
                } else if (userData?.status === process.env.ACCOUNT_SUSPENDED) {
                    return res.status(403).json({
                        status: false,
                        message: "Your account is suspended, please contact with super administrator",
                    });
                }

                if (userData?.is_deleted === process.env.ACTIVE_STATUS) {
                    return res.status(403).json({ status: false, message: "Your account is deleted with us" });
                }
                req.user = decoded;
                next();
            });
        } catch (error) {
            return next(error);
        }
    };
};

const verifySuperAdminToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
        const token = (authHeader && authHeader.split(" ")[1]) || authHeader;

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Super Admin not verified",
            });
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });

                if (decoded.user_type != process.env.SUPER_ADMIN_ROLE_ID) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
                }
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        return next(error);
    }
};

const verifyContractorToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
        const token = (authHeader && authHeader.split(" ")[1]) || authHeader;

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ status: false, message: "Contractor not verified" });
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });

                // get all stored active roles and then check for user type
                const allStoredActiveRoles = await getAllStoredActiveRoles();
                if (allStoredActiveRoles.status) {
                    // Check if userTypeId exists in the list of role IDs
                    const userRoleExists = allStoredActiveRoles.data.some((role) => role.id == decoded.user_type);

                    if (userRoleExists) {
                        // check whether user is active while accessing using contractor token routes
                        const userData = {
                            status: decoded.user_data.status,
                            is_deleted: decoded.user_data.is_deleted,
                        }
                        // console.log('userData: ', userData);
                        if (userData?.status == process.env.INACTIVE_STATUS) {
                            return res.status(400).json({
                                status: false,
                                message: "Your account is not activated yet. Please contact our support team for assistance.",
                            });
                        } else if (userData?.status === process.env.ACCOUNT_SUSPENDED) {
                            return res.status(403).json({
                                status: false,
                                message: "Your account is suspended, please contact with super administrator",
                            });
                        }
        
                        if (userData?.is_deleted === process.env.ACTIVE_STATUS) {
                            return res.status(403).json({ status: false, message: "Your account is deleted with us" });
                        }
                        req.user = decoded;
                        next();
                        return;
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
                    }
                }
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
            });
        }
    } catch (error) {
        return next(error);
    }
};

const verifyDealerToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Dealer not verified",
            });
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });

                if (decoded.user_type != process.env.DEALER_ROLE_ID) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
                }
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        return next(error);
    }
};

const verifyEnergyCompanyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Energy company admin not verified",
            });
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                if (decoded.user_type != process.env.ENERGY_COMPANY_ROLE_ID) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
                }
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        return next(error);
    }
};

const verifySubUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["cookie"]?.split("=")[1];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Sub user not verified",
            });
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });

                if (decoded.user_type != process.env.SUB_USER_ROLE_ID) {
                    return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Forbidden access" });
                }
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        return next(error);
    }
};

const permissionCheck = async (req, res, next) => {
    try {
        const role_id = req.user.user_type;
        const module_id = req.query.module_id;
        const sub_module_id = req.query.sub_module_id;
        const module_of_sub_module_id = req.query.module_of_sub_module_id ?? null;
        const action = req.query.action;
        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            return next();
        }
        const checkPermissionAction = await getAndCheckModulePermissionForAction(
            module_id,
            sub_module_id,
            module_of_sub_module_id,
            role_id,
            action
        );

        if (checkPermissionAction.length > 0) {
            const dbData = checkPermissionAction[0];
            if (dbData[action] > 0) {
                next();
            } else {
                return res.status(403).json({
                    status: false,
                    message: "Access Denied",
                });
            }
        } else {
            return res.status(403).json({
                status: false,
                message: "Access Denied",
            });
        }
    } catch (error) {
        return next(error);
    }
};

// This is a Permission Check MIDDLEWARE for All modules and for all User Types
const sideBarPermissionCheck = (accessType, moduleId, subModuleID, subSubModuleId) => async (req, res, next) => {
    try {
        // Fetch the user's role ID from req.user
        const role_id = req.user.user_type;

        // If the user is a super admin, allow access without permission checks
        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            return next();
        }

        // Check for permissions in the specific module and action
        const checkPermissionAction = await getPermissionOfModulesUsingRoleId(
            moduleId,
            subModuleID,
            subSubModuleId,
            role_id
        );

        // console.log("checkPermissionAction", checkPermissionAction);

        // If permission is found and the action is allowed
        if (checkPermissionAction.length > 0) {
            const dbData = checkPermissionAction[0];
            if (dbData[accessType] > 0) {
                return next(); // Permission granted, proceed to the next middleware
            } else {
                // Permission denied, action not allowed
                return res.status(403).json({
                    status: false,
                    message: "Access Denied",
                });
            }
        } else {
            // No permission record found for the module
            return res.status(403).json({
                status: false,
                message: "Access Denied",
            });
        }
    } catch (error) {
        // Handle errors by passing them to the next error-handling middleware
        return next(error);
    }
};

const checkPermission = async (req, res, next) => {
    try {
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

        const method = req.method;
        console.log("method: ", method);
        const role_id = req.user.user_type;
        const MODULE_OF_SUB_MODULE = "module_of_sub_modules";
        const SUB_MODULE = "sub_modules";
        const MODULE = "modules";

        // If the user is a super admin, allow access without permission checks
        if (role_id == process.env.SUPER_ADMIN_ROLE_ID) {
            return next();
        } 
        // else {
        //     const getRoleDetail = await roleById(role_id);
        //     if (getRoleDetail.length == 0) {
        //         return res.status(403).json({
        //             status: false,
        //             message: "Role Not Found, Access Denied",
        //         });
        //     } else {
        //         // check if logged in user is Super Amin's Employee
        //         if (getRoleDetail.created_by == 1 && getRoleDetail.created_for == 1) {
        //             return next();
        //         }
        //     }
        // }

        const actionMap = {
            GET: "viewed",
            DELETE: "deleted",
            PUT: "updated",
        };

        const action = actionMap[method] || (method === "POST" ? (req.body.id ? "updated" : "created") : null);
        console.log("action: ", action);

        const { pathname } = new URL(fullUrl);
        // console.log('pathname: ', pathname);

        const dynamicParams = Object.values(req.params);
        // console.log('dynamicParams: ', dynamicParams);
        let routes = pathname.split("/");
        for (let param of dynamicParams) {
            routes.splice(routes.lastIndexOf(param), 1);
        }
        // console.log('routes: ', routes);
        routes = routes.slice(3, -1);
        console.log("routes: ", routes);

        if (!routes.length) {
            return res.status(400).json({ status: false, message: "Invalid route" });
        }

        const tables = [MODULE_OF_SUB_MODULE, SUB_MODULE, MODULE];
        let moduleId = 0,
            subModuleID = 0,
            subSubModuleId = 0;

        for (const route of routes) {
            let module, subModule, subSubModule;
            let moduleFound = false;

            for (const table of tables) {
                const query = `SELECT * FROM ${table} WHERE route = ?`;
                const result = await db.query(query, [route]);

                if (result.length) {
                    moduleFound = true;

                    if (table === MODULE_OF_SUB_MODULE) {
                        subSubModule = result[0];
                        subModule = await db.query(`SELECT * FROM sub_modules WHERE id = ? AND is_deleted = 0`, [
                            subSubModule.sub_module_id,
                        ]);
                        module = await db.query(`SELECT * FROM modules WHERE id = ? AND is_deleted = 0`, [
                            subModule[0].module_id,
                        ]);

                        moduleId = module[0].id;
                        subModuleID = subModule[0].id;
                        subSubModuleId = subSubModule.id;
                    } else if (table === SUB_MODULE) {
                        subModule = result[0];
                        module = await db.query(`SELECT * FROM modules WHERE id = ? AND is_deleted = 0`, [
                            subModule.module_id,
                        ]);

                        moduleId = module[0].id;
                        subModuleID = subModule.id;
                    } else {
                        module = result[0];
                        moduleId = module.id;
                    }
                    break;
                }
            }

            if (!moduleFound) {
                return res
                    .status(403)
                    .json({ status: false, message: `Permission denied. Route '${route}' not found.` });
            }

            // Check permission for the current module
            const checkPermissionAction = await getPermissionOfModulesUsingRoleId(
                moduleId,
                subModuleID,
                subSubModuleId,
                role_id
            );

            // console.log("moduleId: ", moduleId);
            // console.log("subModuleID: ", subModuleID);
            // console.log("subSubModuleId: ", subSubModuleId);
            // console.log("checkPermissionAction: ", checkPermissionAction);

            if (checkPermissionAction.length == 0) {
                return res.status(403).json({ status: false, message: "Access Denied." });
            }

            const dbData = checkPermissionAction[0];

            if(dbData.module_id == 11 && dbData.sub_module_id == 42) {
                dbData.viewed = 1;
            }

            if (dbData[action] <= 0) {
                return res.status(403).json({ status: false, message: "Access Denied." });
            }
        }

        return next();
    } catch (error) {
        console.error("Error in checkPermission middleware:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error", error });
    }
};

module.exports = {
    verifyToken,
    verifySuperAdminToken,
    verifyContractorToken,
    verifyDealerToken,
    verifyEnergyCompanyToken,
    verifySubUserToken,
    permissionCheck,
    sideBarPermissionCheck,
    checkPermission,
};

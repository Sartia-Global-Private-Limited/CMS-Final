var moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { validatePermissionOnRoleBassi } = require("../helpers/validation");
//const { checkAlreadyExistOrNot, insertOrUpdatePermission } = require('../helpers/general');
const {
    getSubModuleWithSubModules,
    getPermissionOfModulesUsingRoleId,
    getSubModuleWithSubModulesWithPermission,
    checkAlreadyExistOrNot,
    insertOrUpdatePermission,
    getSubModuleWithSubModulesWithForPermissionCheck,
} = require("../helpers/general");

const setPermissionOnRoleBasis = async (req, res, next) => {
    try {
        if (req.body != null) {
            const role = req.body.panel_type;
            let userId;
            const adminId = req.body.admin_name;

            if (adminId != null) {
                userId = adminId;
            } else {
                const subUserId = req.body.user_name;
                userId = subUserId;
            }
            const moduleData = JSON.stringify(req.body.moduleName);

            const created_by = req.user.user_id;

            const insertQuery = `INSERT INTO new_permissions(user_id, permission, created_by) VALUES(?, ?, ?)`;

            const insertValues = [userId, moduleData, created_by];

            const queryResult = await db.query(insertQuery, insertValues);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Permission set successfully" });
            } else {
                res.status(403).json({ status: false, message: "Error! permission not set" });
            }
        } else {
            return res
                .status(500)
                .json({ status: false, message: "Error! Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const checkPermittedModuleOnRoleBasisOld = async (req, res, next) => {
    try {
        const role_id = req.user.user_type;

        const selectQuery = `SELECT * FROM permissions WHERE role_id = '${role_id}'`;
        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetch permissions successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "No permissions found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllPermittedModuleNameOnRoleBasis = async (req, res, next) => {
    try {
        const role_id = req.user.user_type;
        const selectQuery = `SELECT modules.title as module_title, sub_modules.title as sub_module_title, permissions.id as permitted_id, permissions.created, permissions.viewed, permissions.updated, permissions.deleted FROM permissions LEFT JOIN modules ON permissions.module_id = modules.id LEFT JOIN sub_modules ON permissions.sub_module_id = sub_modules.id WHERE permissions.role_id = '${role_id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Fetch permissions successfully", data: result });
            } else {
                return res.status(400).json({ status: false, message: "No permissions found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const updatePermissionOnRoleBasis = async (req, res, next) => {
    try {
        const { module_id, sub_module_id, role_id, user_id, created, viewed, updated, deleted } = req.body;

        const { error } = validatePermissionOnRoleBassi.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        const id = req.body.id;
        const updateQuery = `UPDATE permissions SET module_id = '${module_id}', sub_module_id = '${sub_module_id}', role_id = '${role_id}', user_id = '${user_id}', created = '${created}', viewed = '${viewed}', updated = '${updated}', deleted = '${deleted}' WHERE id = '${id}'`;

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Permission updated successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const setPermissionOnRole = async (req, res, next) => {
    try {
        if (req.body.length > process.env.VALUE_ZERO) {
            const formData = req.body;
            let promises = [];

            for (let index = 0; index < formData.length; index++) {
                const element = formData[index];
                const module_id = element.module_id;
                const sub_module_id = element.sub_module_id;
                const role_id = element.role_id;
                const user_id = element.user_id;
                const created = element.created;
                const viewed = element.viewed;
                const updated = element.updated;
                const deleted = element.deleted;

                const { error } = validatePermissionOnRoleBassi.validate({
                    module_id: module_id,
                    role_id: role_id,
                });

                if (error) return res.status(403).json({ status: false, message: error.message });

                const insertQuery = `INSERT INTO permissions (module_id, sub_module_id, role_id, user_id, created, viewed, updated, deleted) VALUES ('${module_id}', '${sub_module_id}', '${role_id}', '${user_id}', '${created}', '${viewed}', '${updated}', '${deleted}')`;

                const promise = new Promise((resolve, reject) => {
                    db.query(insertQuery, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                promises.push(promise);
            }

            Promise.all(promises)
                .then((results) => {
                    const submittedStatus = results.some((result) => result.affectedRows > process.env.VALUE_ZERO);
                    if (submittedStatus) {
                        res.status(200).json({ status: true, message: "Permission set successfully" });
                    } else {
                        res.status(400).json({ status: false, message: "Something went wrong, please try again" });
                    }
                })
                .catch((err) => {
                    res.status(500).json({ status: false, message: err });
                });
        } else {
            return res
                .status(500)
                .json({ status: false, message: "Error! Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const setPermission = async (req, res, next) => {
    try {
        if (req.body.moduleName.length > process.env.VALUE_ZERO) {
            const formData = req.body.moduleName;
            const role_id = req.body.role_id;

            const user_type = await db.query(`SELECT name FROM roles WHERE id = '${role_id}'`);

            for (let index = 0; index < formData.length; index++) {
                const element = formData[index];

                let module_res = await checkAlreadyExistOrNot(element.id, 0, 0, role_id);
                await insertOrUpdatePermission(
                    element.id,
                    0,
                    0,
                    role_id,
                    module_res,
                    element.create,
                    element.view,
                    element.update,
                    element.delete
                );

                if (element.submodules && Array.isArray(element.submodules)) {
                    const submodules = element.submodules;
                    if (submodules.length > 0) {
                        for (let ind = 0; ind < submodules.length; ind++) {
                            const modulesOfSubModule = submodules[ind].modulesOfSubModule;
                            var submodule_res = await checkAlreadyExistOrNot(
                                element.id,
                                submodules[ind].id,
                                0,
                                role_id
                            );

                            await insertOrUpdatePermission(
                                element.id,
                                submodules[ind].id,
                                0,
                                role_id,
                                submodule_res,
                                submodules[ind].create,
                                submodules[ind].view,
                                submodules[ind].update,
                                submodules[ind].delete
                            );

                            if (modulesOfSubModule.length > 0) {
                                for (let mod_ind = 0; mod_ind < modulesOfSubModule.length; mod_ind++) {
                                    const modSubMod = modulesOfSubModule[mod_ind];
                                    var modOdSub_res = await checkAlreadyExistOrNot(
                                        element.id,
                                        modSubMod.sub_module_id,
                                        modSubMod.id,
                                        role_id
                                    );

                                    const getSubModulePermissions = await getPermissionOfModulesUsingRoleId(element.id,
                                        modSubMod.sub_module_id, 0, role_id)

                                    await insertOrUpdatePermission(
                                        element.id,
                                        modSubMod.sub_module_id,
                                        modSubMod.id,
                                        role_id,
                                        modOdSub_res,
                                        modSubMod.create,
                                        modSubMod.view,
                                        modSubMod.update,
                                        modSubMod.delete
                                    );
                                }
                            }
                        }
                    }
                }
            }
            return res.status(200).json({ status: true, message: `${user_type[0].name} permissions updated` });
        } else {
            return res
                .status(500)
                .json({ status: false, message: "Error! Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const checkPermittedModuleOnRoleBasis = async (req, res, next) => {
    try {
        const module_id = req.query.module_id;
        const sub_module_id = req.query.sub_module_id ?? 0;
        const module_of_sub_module_id = req.query.module_of_sub_module_id ?? 0;
        const role_id = 41; //req.user.user_type;

        if (module_id != "" && module_id > 0) {
            var selectQuery = `SELECT * FROM modules WHERE is_deleted = '0' AND id = '${module_id}'`;

            await db.query(selectQuery, async (err, result) => {
                if (err) return res.status(500).json({ status: false, message: err.message });

                if (result.length > process.env.VALUE_ZERO) {
                    var create_permission = 0;
                    var view_permission = 0;
                    var delete_permission = 0;
                    var update_permission = 0;
                    var finalData = [];

                    for (const element of result) {
                        const modulePermissData = await getPermissionOfModulesUsingRoleId(
                            element.id,
                            sub_module_id,
                            module_of_sub_module_id,
                            role_id
                        );
                        if (modulePermissData.length > 0) {
                            create_permission = modulePermissData[0].created;
                            view_permission = modulePermissData[0].viewed;
                            delete_permission = modulePermissData[0].deleted;
                            update_permission = modulePermissData[0].updated;
                        }
                        finalData.push({
                            ...element,
                            create: create_permission,
                            view: view_permission,
                            delete: delete_permission,
                            update: update_permission,
                            submodules: await getSubModuleWithSubModulesWithForPermissionCheck(
                                sub_module_id,
                                module_of_sub_module_id,
                                role_id
                            ),
                        });
                    }
                    return res.status(200).json({ status: true, message: "data found", data: finalData });
                } else {
                    return res.status(200).json({ status: false, message: "No data found" });
                }
            });
        } else {
            return res.status(500).json({ status: false, message: "No module found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    setPermissionOnRoleBasis,
    checkPermittedModuleOnRoleBasis,
    setPermissionOnRole,
    getAllPermittedModuleNameOnRoleBasis,
    updatePermissionOnRoleBasis,
    setPermission,
};

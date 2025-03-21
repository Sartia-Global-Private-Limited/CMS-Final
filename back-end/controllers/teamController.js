var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const {
    subUserFormValidation,
    teamValidations,
    checkPositiveInteger,
    hrTeamValidations,
} = require("../helpers/validation");
const {
    getTeamMemberList,
    roleById,
    calculatePagination,
    getAdminTeamMemberOnId,
    getAdminDetails,
} = require("../helpers/general");
const { StatusCodes } = require("http-status-codes");
const { addCreatedByCondition } = require("../helpers/commonHelper");
const Joi = require("joi");

const createTeam = async (req, res, next) => {
    try {
        // const { manager_id, team_name, description, members } = req.body;

        // type -> team type superadmin (1) or other(2)
        const { team_name, team_short_description, manager_id, supervisor_id, members, type } = req.body;
        const { error } = teamValidations.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.message });

        if (manager_id == supervisor_id)
            return res.status(400).json({
                status: false,
                message: "Manager and Supervisor cannot be same",
            });

        const existingTeamNameQuery = await db.query(
            `SELECT * FROM hr_teams WHERE team_name = '${team_name}' AND type = '${type}' AND is_deleted = '0'`
        );
        if (existingTeamNameQuery.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Team Name already exists" });
        }

        const get_existing_supervisor_detail = await db.query(
            `SELECT supervisor_id, team_name AS team FROM hr_teams WHERE supervisor_id = '${supervisor_id}' AND created_by = '${req.user.user_id}' AND is_deleted = '0'`
        );

        if (get_existing_supervisor_detail.length > 0)
            return res.status(400).json({
                status: false,
                message: `Supervisor Already exists in '${get_existing_supervisor_detail[0].team}' team`,
            });

        const createdBy = req.user.user_id;

        let insertTeamQuery = `
            INSERT INTO hr_teams (manager_id, supervisor_id, team_name, team_short_description, team_member, created_by, type)
            VALUES('${manager_id}', '${supervisor_id}', '${team_name}', '${team_short_description}', '${JSON.stringify(members)}', '${createdBy}', '${type}')`;

        // if existing team found deleted
        const deletedTeamQuery = `
            SELECT * FROM hr_teams 
            WHERE manager_id = '${manager_id}' AND supervisor_id = '${supervisor_id}' AND type = '${type}' AND is_deleted = '1'`;

        const deletedTeamResult = await db.query(deletedTeamQuery);
        // then SET is_deleted = '0' AND activate that team
        if (deletedTeamResult.length > process.env.VALUE_ZERO) {
            insertTeamQuery = `
            UPDATE hr_teams SET 
            manager_id = '${manager_id}',
            supervisor_id = '${supervisor_id}',
            team_name = '${team_name}',
            team_short_description = '${team_short_description}',
            team_member = '${JSON.stringify(members)}',
            created_by = '${createdBy}',
            type = '${type}',
            is_deleted = '0'
            WHERE id = '${deletedTeamResult[0].id}'`;
        }

        db.query(insertTeamQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Team created successfully" });
            } else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });
        // } else {
        //     return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
        // }
        // });
    } catch (error) {
        return next(error);
    }
};

const getParentTeamHead = async (req, res, next) => {
    try {
        const selectQuery = `SELECT users.id as team_head_id, users.name as team_head_name FROM users INNER JOIN teams ON teams.user_id = users.id;`;

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                return res.status(200).json({ status: true, message: "Team head fetched successfully", data: result });
            } else {
                return res.status(403).json({ status: false, message: "No team head found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getTeamDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const search = req.query.search || "";
        const { error } = checkPositiveInteger.validate({ id });
        if (error) res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // let selectQuery = `SELECT teams.id as team_id, teams.team_head AS manager_id, teams.team_name, teams.description, teams.members, teams.created_by, admins.name AS manager_name, admins.image AS manager_image, admins.user_type, admins.employee_id FROM teams LEFT JOIN admins ON admins.id=teams.team_head  WHERE teams.id = ? AND teams.is_deleted = 0`;

        let selectQuery = `
        SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, 
        hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, admins.name as manager_name,admins.image, 
        admins.employee_id as manager_employee_id, admins.user_type 
        FROM hr_teams 
        LEFT JOIN admins ON admins.id=hr_teams.manager_id  
        WHERE hr_teams.id = '${id}'`;

        selectQuery = addCreatedByCondition(selectQuery, {
            table: "teams",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            let values = [];
            for (const row of queryResult) {
                const teamMember = await getAdminTeamMemberOnId(row.team_member, search);
                const getSupervisorDetail = row.supervisor_id > 0 && (await getAdminDetails(row.supervisor_id));

                // push role name in team members
                if (teamMember.length > process.env.VALUE_ZERO) {
                    for (const element of teamMember) {
                        const getTeamMemberRole = await roleById(element.role_id);
                        element.role = getTeamMemberRole.name;
                    }
                }

                const getUserTypeName = await roleById(row.user_type);

                // values.push({
                //     team_id: row.team_id,
                //     team_name: row?.team_name || "",
                //     team_short_description: row?.description || "",
                //     manager_id: row?.manager_id || "",
                //     manager_name: row?.manager_name || "",
                //     manager_image: row?.manager_image || "",
                //     manager_employee_id: row?.employee_id || "",
                //     team_head_role: getUserTypeName ? getUserTypeName.name : "",
                //     total_members: teamMember.length,
                //     members: teamMember,
                // });

                values.push({
                    team_id: row?.team_id || "",
                    team_name: row?.team_name || "",
                    team_short_description: row?.team_short_description || "",
                    manager_id: row?.manager_id || "",
                    manager_name: row?.manager_name || "",
                    manager_image: row?.image || "",
                    supervisor_id: getSupervisorDetail ? getSupervisorDetail[0].id : "",
                    supervisor_name: getSupervisorDetail ? getSupervisorDetail[0].name : "",
                    supervisor_image: getSupervisorDetail ? getSupervisorDetail[0].image : "",
                    supervisor_employee_id: getSupervisorDetail ? getSupervisorDetail[0].employee_id : "",
                    manager_employee_id: row.manager_employee_id ? row.manager_employee_id : "",
                    members: teamMember,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: values[0],
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No Team found" });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const updateTeamDetails = async (req, res, next) => {
    try {
        // const { team_id, team_head, team_name, description, members } = req.body;
        const { team_name, team_short_description, manager_id, members, team_id, supervisor_id, type } = req.body;
        const { error } = hrTeamValidations.validate({ manager_id, team_name, supervisor_id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (!team_id) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Team id is required" });
        }
        const teamMember = JSON.stringify(members);
        const updatedBy = req.user.user_id;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

        if (manager_id == supervisor_id)
            return res.status(400).json({
                status: false,
                message: "Manager and Supervisor cannot be same",
            });

        const existingTeamNameQuery = await db.query(
            `SELECT * FROM hr_teams WHERE team_name = '${team_name}' AND type = '${type}' AND is_deleted = 0 AND id != '${team_id}'`
        );
        if (existingTeamNameQuery.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Team Name already exists" });
        }

        const get_existing_supervisor_detail = await db.query(
            `SELECT supervisor_id, team_name AS team FROM hr_teams WHERE supervisor_id = '${supervisor_id}' AND type = '${type}' AND created_by = '${req.user.user_id}' AND is_deleted = 0 AND id != '${team_id}'`
        );

        if (get_existing_supervisor_detail.length > 0)
            return res.status(400).json({
                status: false,
                message: `Supervisor Already exists in '${get_existing_supervisor_detail[0].team}' team`,
            });
        const updateQuery = `
            UPDATE hr_teams SET manager_id=?, supervisor_id=?, team_name=?, team_short_description=?, team_member=?, updated_at=?, updated_by=? 
            WHERE id=? AND type=?`;

        const queryResult = await db.query(updateQuery, [
            manager_id,
            supervisor_id,
            team_name,
            team_short_description,
            teamMember,
            updatedAt,
            updatedBy,
            team_id,
            type,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Team updated successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later." });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const deleteTeam = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `UPDATE hr_teams SET is_deleted=? WHERE id=?`;
        const queryResult = await db.query(deleteQuery, [process.env.VALUE_ONE, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Team deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        next(error);
    }
};

const getTeamGroup = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;

        const getAllTeamHead = `SELECT users.name as team_head_name, teams.team_name, teams.team_short_description, COUNT(teams.parent_id) as number_of_member, teams.parent_id, teams.user_id FROM users INNER JOIN teams ON teams.parent_id = users.id GROUP BY team_head_name`;

        db.query(getAllTeamHead, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return { ...element, member_name: await getTeamMemberList(element.parent_id) };
                });
                Promise.all(final).then((values) => {
                    return res.status(200).json({ status: true, data: values });
                });
            } else {
                return res.status(403).json({ status: false, message: "No team found" });
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getAllTeams = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        let whereCondition = `WHERE hr_teams.created_by = '1' AND hr_teams.is_deleted = 0`;
        let searchCondition = ``;
        const isDropdown = req.query.isDropdown ?? null;

        if (searchData != null && searchData != "") {
            searchCondition += ` AND (hr_teams.team_name LIKE '%${searchData}%' OR hr_teams.team_short_description LIKE '%${searchData}%' OR admins.name LIKE '%${searchData}%') `;
        }
        // let selectQuery = `SELECT teams.id as team_id, teams.team_head AS team_head_id, teams.team_name, teams.description, teams.members, teams.created_by, admins.name AS team_head_name, admins.image AS team_head_image, admins.user_type, admins.employee_id FROM teams LEFT JOIN admins ON admins.id=teams.team_head ${whereCondition} ${searchCondition} ORDER BY team_id DESC`;
        let selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, admins.name as manager_name, admins.employee_id as manager_employee_id, admins.image, admins.user_type FROM hr_teams LEFT JOIN admins ON admins.id=hr_teams.manager_id ${whereCondition} ${searchCondition} ORDER BY team_id DESC`;

        // selectQuery = addCreatedByCondition(selectQuery, {
        //     table: "teams",
        //     created_by: req.user.user_id,
        //     role: req.user.user_type,
        // });

        if (pageSize && !isDropdown) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        // console.log('selectQuery: ', selectQuery);
        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const values = [];
            for (const row of queryResult) {
                const teamMember = await getAdminTeamMemberOnId(row.team_member);

                // push role name in team members
                if (teamMember.length > process.env.VALUE_ZERO) {
                    for (const row of teamMember) {
                        const getTeamMemberRole = await roleById(row.role_id);
                        row.role = getTeamMemberRole.name;
                    }
                }
                const getUserTypeName = await roleById(row.user_type);
                const getSupervisorDetail = row.supervisor_id > 0 && (await getAdminDetails(row.supervisor_id));

                // values.push({
                //     team_id: row.team_id,
                //     team_name: row?.team_name || "",
                //     team_short_description: row?.description || "",
                //     manager_id: row?.team_head_id || "",
                //     team_head_name: row?.team_head_name || "",
                //     team_head_image: row?.team_head_image || "",
                //     team_head_employee_id: row?.employee_id || "",
                //     team_head_role_id: row.user_type || "",
                //     team_head_role: getUserTypeName ? getUserTypeName.name : "",
                //     total_members: teamMember.length,
                //     members: teamMember,
                // });
                values.push({
                    team_id: row.team_id,
                    team_name: row?.team_name || "",
                    team_short_description: row?.team_short_description || "",
                    manager_id: row?.manager_id || "",
                    manager_employee_id: row?.manager_employee_id || "",
                    manager_name: row?.manager_name || "",
                    manager_image: row?.image || "",
                    manager_role: getUserTypeName ? getUserTypeName.name : "",
                    supervisor_id: getSupervisorDetail[0] ? getSupervisorDetail[0]?.id : "",
                    supervisor_employee_id: getSupervisorDetail[0] ? getSupervisorDetail[0]?.employee_id : "",
                    supervisor_name: getSupervisorDetail[0] ? getSupervisorDetail[0]?.name : "",
                    supervisor_image: getSupervisorDetail[0] ? getSupervisorDetail[0]?.image : "",
                    total_members: teamMember.length,
                    members: teamMember,
                });
            }
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched data successfully",
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Teams not found" });
        }
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
};

const getAdminMemberListWithoutTeam = async (req, res, next) => {
    try {
        let team_member_lists = [];
        const user_id = req.user.user_id;
        let combinedMembers;
        // get all teams and members
        const getTeamMemberList = await db.query(
            "SELECT id, supervisor_id, team_name, team_member FROM hr_teams WHERE created_by= ? AND is_deleted = '0'",
            [user_id]
        );

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            for (const row of getTeamMemberList) {
                const teamDbData = row.team_member; // Assuming row.team_member is the JSON-encoded string
                const teamDbMembers = JSON.parse(teamDbData); // Parse the JSON-encoded string directly
                const members = teamDbMembers.map((member) => member.toString().trim()); // Split and clean up the member IDs
                team_member_lists.push(...members); // Push individual members into the array
                team_member_lists.push(row.supervisor_id);
            }
            // combinedMembers = team_member_lists.join(', '); // Join all the members with a comma and a space
            // combinedMembers = combinedMembers.slice(0, -2); // Remove the last two characters (comma and space)
            combinedMembers = team_member_lists.map((member) => member?.toString().trim()).join(", ");
        }

        let membersQuery;
        if (combinedMembers != null) {
            membersQuery = `SELECT id, name, employee_id, email, contact_no AS mobile, joining_date, image, status, user_type, created_by FROM admins WHERE (is_deleted = '0' AND status = '1' AND created_by = '1') AND id NOT IN(${combinedMembers})`;
        } else {
            membersQuery = `SELECT id, name, employee_id, email, contact_no AS mobile, joining_date, image, status, user_type, created_by FROM admins WHERE  (is_deleted = '0' AND status = '1' AND created_by = '1')`;
        }

        membersQuery = addCreatedByCondition(membersQuery, {
            table: "admins",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });

        // console.log("membersQuery: ", membersQuery);
        const queryResult = await db.query(membersQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (let result of queryResult) {
                const getTeamMemberRole = await roleById(result.user_type);
                result.user_role = getTeamMemberRole.name;
                if (result.employee_id) {
                    result.name = `${result.name} (${result.employee_id})`;
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Members fetched successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Members not found",
            });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const removeSpecificAdminUserFromTeam = async (req, res, next) => {
    try {
        const { team_id, user_id } = req.body;
        const validationSchema = Joi.object({
            team_id: Joi.number().required(),
            user_id: Joi.number().required(),
        });
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get team members for remove specific member

        const getTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [team_id]);

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = teamDbData?.team_member || [];
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object
            let teamMemberList = JSON.parse(teamDbMembers);
            // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
            const team_member_ids = teamMemberList.map(Number);
            const valueToRemove = parseInt(user_id);
            if (team_member_ids.length <= process.env.VALUE_ONE) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Sorry! you can't delete the last member of team`,
                });
            }
            const updatedTeamMembers = team_member_ids.filter((member) => member !== valueToRemove);

            //Convert the modified JavaScript object back to a JSON string
            teamMemberList = updatedTeamMembers;
            const updatedJsonString = JSON.stringify(teamMemberList);

            // update team members with new members
            const updateQuery = await db.query("UPDATE hr_teams SET team_member = ? WHERE id = ?", [
                updatedJsonString,
                teamDbId,
            ]);

            const removeTeamIdFromAdminUser = await db.query("UPDATE admins SET team_id = ? WHERE id = ?", [
                null,
                user_id,
            ]);
            if (removeTeamIdFromAdminUser.affectedRows > process.env.VALUE_ZERO) {
                console.log("Team id removed from admin user successfully");
            }

            if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Team member removed successfully",
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Error! Something went wrong, please try again later",
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid team member details.",
            });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const addNewAdminMemberInTeam = async (req, res, next) => {
    try {
        const { team_id, user_id } = req.body;

        const validationSchema = Joi.object({
            team_id: Joi.string().required().messages({
                "number.base": "Team id must be a number",
                "number.empty": "Team id is required",
            }),
            user_id: Joi.array().required().messages({
                "any.required": "User id is required",
                "array.base": "User id must be an array",
            }),
        });
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // Get team members to add the new one
        const getTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [team_id]);
        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = teamDbData?.team_member || [];
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object (or array)
            let teamMemberList = JSON.parse(teamDbMembers);

            // Get the array of team member IDs and convert them to numbers
            const team_member_ids = teamMemberList.map(Number);

            // check if provided ids provided in user_id doesn't contains null or empty
            user_id.forEach((id) => {
                if (!id || id === 0 || id == null || typeof id !== "number") {
                    throw new Error("Invalid user id");
                }
            });

            // Check if the user_id already exists in the team_member_ids array
            if (team_member_ids.includes(Number(user_id))) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Part of the Users is already a member of the team",
                });
            }

            // Add the new user ids to the list
            user_id.forEach(async (id) => {
                team_member_ids.push(Number(id));
                const addTeamIdToAdminUser = await db.query("UPDATE admins SET team_id = ? WHERE id = ?", [
                    team_id,
                    id,
                ]);
                if (addTeamIdToAdminUser.affectedRows > process.env.VALUE_ZERO) {
                    console.log("Team id added to admin user successfully");
                }
            });

            // Convert the modified JavaScript object back to a JSON string
            const updatedJsonString = JSON.stringify(team_member_ids);

            // Update team members with the new member
            const updateQuery = await db.query("UPDATE hr_teams SET team_member = ? WHERE id = ?", [
                updatedJsonString,
                teamDbId,
            ]);

            if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Team member added successfully",
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: "Error! Something went wrong, please try again later",
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Invalid team member details.",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createTeam,
    getParentTeamHead,
    getTeamDetailsById,
    updateTeamDetails,
    getTeamGroup,
    getAllTeams,
    deleteTeam,
    getAdminMemberListWithoutTeam,
    removeSpecificAdminUserFromTeam,
    addNewAdminMemberInTeam,
};

var moment = require("moment");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { promisify } = require("util");
const Joi = require("joi");
const xlsx = require("xlsx");
const path = require("path");
const { hrTeamValidations, checkPositiveInteger, importHrTeamValidations } = require("../helpers/validation");
const {
    getTeamMemberOnId,
    getUsersById,
    calculatePagination,
    roleById,
    getUserDetails,
    getRecord,
} = require("../helpers/general");
const { uploadFile, getRecordWithConditions } = require("../helpers/commonHelper");

const createHrTeam = async (req, res, next) => {
    try {
        const { team_name, team_short_description, manager_id, supervisor_id, members } = req.body;
        const { error } = hrTeamValidations.validate({ manager_id, supervisor_id, team_name });
        if (error)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });

        if (manager_id == supervisor_id)
            return res.status(400).json({
                status: false,
                message: "Manager and Supervisor cannot be same",
            });

        const existingTeamNameQuery = await db.query(
            `SELECT * FROM hr_teams WHERE team_name = '${team_name}' AND is_deleted = 0`
        );
        if (existingTeamNameQuery.length > process.env.VALUE_ZERO) {
            return res.status(403).json({ status: false, message: "Team Name already exists" });
        }

        const get_existing_supervisor_detail = await db.query(
            `SELECT supervisor_id, team_name AS team FROM hr_teams WHERE supervisor_id = '${supervisor_id}' AND created_by = '${req.user.user_id}' AND is_deleted = 0`
        );

        if (get_existing_supervisor_detail.length > 0)
            return res.status(400).json({
                status: false,
                message: `Supervisor Already exists in '${get_existing_supervisor_detail[0].team}' team`,
            });

        const createdBy = req.user.user_id;
        const teamMember = JSON.stringify({ team_member: members.join(",") });

        // let insertQuery = `INSERT INTO hr_teams (manager_id, supervisor_id, team_name, team_short_description, team_member, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

        let insertTeamQuery = `
        INSERT INTO hr_teams (manager_id, supervisor_id, team_name, team_short_description, team_member, created_by)
        VALUES('${manager_id}', '${supervisor_id}', '${team_name}', '${team_short_description}', '${teamMember}', '${createdBy}')`;

        // if existing team found deleted
        const deletedTeamQuery = `
            SELECT * FROM hr_teams 
            WHERE manager_id = '${manager_id}' AND supervisor_id = '${supervisor_id}' AND is_deleted = '1'`;

        const deletedTeamResult = await db.query(deletedTeamQuery);
        // then SET is_deleted = '0' AND activate that team
        if (deletedTeamResult.length > process.env.VALUE_ZERO) {
            insertTeamQuery = `
            UPDATE hr_teams SET 
            manager_id = '${manager_id}',
            supervisor_id = '${supervisor_id}',
            team_name = '${team_name}',
            team_short_description = '${team_short_description}',
            team_member = '${teamMember}',
            created_by = '${createdBy}',
            is_deleted = '0'
            WHERE id = '${deletedTeamResult[0].id}'`;
        }

        const queryResult = await db.query(insertTeamQuery);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Team created successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const getAllHrTeamWithMember = async (req, res, next) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        const user_id = req.user.user_id;
        const pageFirstResult = (currentPage - 1) * pageSize;
        let whereCondition = "";
        // var searchCondition = `WHERE hr_teams.created_by= '${user_id}'`;
        let searchCondition = ``;
        const isDropdown = req.query.isDropdown ?? null;

        whereCondition = `WHERE hr_teams.created_by= '${user_id}' AND hr_teams.is_deleted = 0`;

        if (searchData != null && searchData != "") {
            searchCondition += ` AND (hr_teams.team_name LIKE '%${searchData}%' OR hr_teams.team_short_description LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%') `;
        }
        let selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, users.name as manager_name, users.employee_id as manager_employee_id, users.image, users.user_type FROM hr_teams LEFT JOIN users ON users.id=hr_teams.manager_id ${whereCondition} ${searchCondition} ORDER BY team_id DESC`;

        if (pageSize && !isDropdown) {
            selectQuery += ` LIMIT ${pageFirstResult}, ${pageSize}`;
        }

        const queryResult = await promisify(db.query)(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const values = [];
            for (const element of queryResult) {
                const teamMember = await getTeamMemberOnId(element.team_member);
                const getSupervisorDetail = await getUserDetails(element.supervisor_id);
                const getUserTypeName = await roleById(element.user_type);

                values.push({
                    team_id: element.team_id,
                    team_name: element.team_name,
                    team_short_description: element.team_short_description,
                    manager_id: element.manager_id,
                    manager_employee_id: element.manager_employee_id,
                    manager_name: element.manager_name,
                    manager_image: element.image,
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
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

const getHrTeamDetailsById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const search = req.query.search || "";
        const { error } = checkPositiveInteger.validate({ id });
        if (error) res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        let selectQuery = `
        SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, 
        hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, users.name as manager_name,users.image, 
        users.employee_id as manager_employee_id, users.user_type 
        FROM hr_teams 
        LEFT JOIN users ON users.id=hr_teams.manager_id  
        WHERE hr_teams.id = ? AND hr_teams.is_deleted = 0`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                const teamMember = row.team_member && (await getTeamMemberOnId(row.team_member, search));
                const getSupervisorDetail = row.supervisor_id && (await getUserDetails(row.supervisor_id));

                // push role name in team members
                if (teamMember.length > process.env.VALUE_ZERO) {
                    for (const row of teamMember) {
                        const getTeamMemberRole =
                            (row.role_id && (await roleById(row.role_id))) || (await roleById(row.user_type));
                        row.role = getTeamMemberRole?.name || "";
                    }
                }

                values.push({
                    team_id: row.team_id,
                    team_name: row.team_name,
                    team_short_description: row.team_short_description,
                    manager_id: row.manager_id,
                    manager_name: row.manager_name,
                    manager_image: row.image,
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
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
    } catch (error) {
        return next(error);
    }
};

const updateHrTeamDetails = async (req, res, next) => {
    try {
        const { team_name, team_short_description, manager_id, members, team_id, supervisor_id } = req.body;
        const { error } = hrTeamValidations.validate({ manager_id, team_name, supervisor_id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (manager_id == supervisor_id)
            return res.status(400).json({
                status: false,
                message: "Manager and Supervisor cannot be same",
            });

        const get_existing_supervisor_detail = await db.query(
            `SELECT supervisor_id, team_name AS team FROM hr_teams WHERE supervisor_id = '${supervisor_id}' AND id != ? AND is_deleted = 0`,
            [team_id]
        );

        if (get_existing_supervisor_detail.length > 0)
            return res.status(400).json({
                status: false,
                message: `Supervisor Already exists in '${get_existing_supervisor_detail[0].team}' team`,
            });

        // Fetch the existing team data by ID (assuming `team_id` is provided in req.body)
        const existingTeamQuery = await db.query(`SELECT team_name FROM hr_teams WHERE id = ? AND is_deleted = 0`, [
            team_id,
        ]);

        if (existingTeamQuery.length === 0) {
            return res.status(404).json({ status: false, message: "Team not found" });
        }

        // Extract the existing team name
        const existing_team_name = existingTeamQuery[0].team_name;

        // Check if the provided team name is different from the existing team name
        if (team_name !== existing_team_name) {
            // Check if the new team name already exists in another record
            const duplicateTeamNameQuery = await db.query(
                `SELECT * FROM hr_teams WHERE team_name = ? AND id != ? AND is_deleted = 0`,
                [team_name, team_id]
            );

            if (duplicateTeamNameQuery.length > 0) {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Team Name already exists" });
            }
        }

        const teamMember = JSON.stringify({ team_member: members.join(",") });
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE hr_teams SET manager_id=?, supervisor_id =?, team_name=?, team_short_description=?, team_member=?, updated_at=? WHERE id=?`;
        const queryResult = await db.query(updateQuery, [
            manager_id,
            supervisor_id,
            team_name,
            team_short_description,
            teamMember,
            updatedAt,
            team_id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Team updated successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later." });
        }
    } catch (error) {
        return next(error);
    }
};

const deleteHrTeam = async (req, res, next) => {
    try {
        const team_id = req.params.team_id;
        const { error } = checkPositiveInteger.validate({ id: team_id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        // const deleteQuery = `DELETE FROM hr_teams WHERE id=?`;
        const deleteQuery = `UPDATE hr_teams SET is_deleted = 1 WHERE id=?`;
        const queryResult = await db.query(deleteQuery, [team_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Team deleted successfully" });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: "Something went wrong, please try again later" });
        }
    } catch (error) {
        return next(error);
    }
};

const removeSpecificUserFromTeam = async (req, res, next) => {
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
            const teamDbMembers = teamDbData.team_member;
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object
            const teamMemberList = JSON.parse(teamDbMembers);
            // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
            const team_member_ids = teamMemberList.team_member.split(",").map(Number);
            const valueToRemove = parseInt(user_id);
            if (team_member_ids.length <= process.env.VALUE_ONE) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Sorry! you can't delete the last member of team`,
                });
            }
            const updatedTeamMembers = team_member_ids.filter((member) => member !== valueToRemove);

            //Convert the modified JavaScript object back to a JSON string
            teamMemberList.team_member = updatedTeamMembers.join(",");
            const updatedJsonString = JSON.stringify(teamMemberList);

            // update team members with new members
            const updateQuery = await db.query("UPDATE hr_teams SET team_member = ? WHERE id = ?", [
                updatedJsonString,
                teamDbId,
            ]);

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
        return next(error);
    }
};

const addNewMemberInTeam = async (req, res, next) => {
    try {
        const { team_id, user_id } = req.body;

        const validationSchema = Joi.object({
            team_id: Joi.number().required(),
            user_id: Joi.required(),
        });
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get team members to add new one
        const getTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [team_id]);
        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = teamDbData.team_member;
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object
            const teamMemberList = JSON.parse(teamDbMembers);
            // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
            const team_member_ids = teamMemberList.team_member.split(",").map(Number);
            const valueToAdd = user_id; //JSON.parse(user_id);
            team_member_ids.push(...valueToAdd);

            //Convert the modified JavaScript object back to a JSON string
            teamMemberList.team_member = team_member_ids.join(",");
            const updatedJsonString = JSON.stringify(teamMemberList);

            // update team members with new members
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

const getMemberListToAddInTeam = async (req, res, next) => {
    try {
        const team_id = req.params.team_id;
        const { error } = checkPositiveInteger.validate({ id: team_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get already added members from team
        const getTeamMemberList = await db.query("SELECT id, team_member FROM hr_teams WHERE id= ?", [team_id]);

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = JSON.parse(teamDbData.team_member);
            const teamDbId = teamDbData.id;

            // get users which is not in that team already
            const sql = `SELECT id, name, image FROM users WHERE id NOT IN(${teamDbMembers.team_member})`;
            const queryResult = await db.query(sql);

            if (queryResult.length > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "New member found to add in team",
                    data: queryResult,
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "New member not found to add in team",
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Error! in loading, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getMemberListWithoutTeam = async (req, res, next) => {
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
                const members = teamDbMembers.team_member.split(",").map((member) => member.trim()); // Split and clean up the member IDs
                team_member_lists.push(...members); // Push individual members into the array
                team_member_lists.push(row.supervisor_id);
            }
            // combinedMembers = team_member_lists.join(', '); // Join all the members with a comma and a space
            // combinedMembers = combinedMembers.slice(0, -2); // Remove the last two characters (comma and space)
            combinedMembers = team_member_lists.map((member) => member?.toString().trim()).join(", ");
        }

        let membersQuery;
        if (combinedMembers != null) {
            membersQuery = `SELECT id, name, employee_id, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE (is_deleted = '0' AND created_by ='${user_id}' AND status = '1' AND outlet_id IS NULL) AND id NOT IN(${combinedMembers})`;
        } else {
            membersQuery = `SELECT id, name, employee_id, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE  (is_deleted = '0' AND created_by ='${user_id}' AND status = '1' AND outlet_id IS NULL)`;
        }

        const queryResult = await db.query(membersQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (let result of queryResult) {
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
        return next(error);
    }
};

const getLoggedUserDetails = async (req, res, next) => {
    try {
        const loggedUserId = req.user.user_id;
        const loggedUserRoleId = req.user.user_type;
        var finalData = [];

        if (loggedUserRoleId == process.env.CONTRACTOR_ROLE_ID) {
            const getLoggedUserDetails = await db.query(
                `SELECT admins.id, admins.name, admins.employee_id, admins.image, roles.name as role_name FROM admins INNER JOIN roles ON roles.id = admins.user_type WHERE admins.id = ?`,
                [loggedUserId]
            );

            if (getLoggedUserDetails.length > process.env.VALUE_ZERO) {
                for (const row of getLoggedUserDetails) {
                    row["level"] = 1;
                }
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Members fetched successfully",
                    data: getLoggedUserDetails[0],
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "You are not authorized to perform this action",
                });
            }
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "You are not authorized to perform this action",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const getUsersOnRoleId = async (req, res, next) => {
    try {
        const role_id = req.params.role_id || "";
        let usersFinalData = [];

        const { error } = checkPositiveInteger.validate({ id: role_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get users on roles
        const usersDetailsOnRoleId = await db.query(
            `SELECT users.id, users.name, users.employee_id, users.image, roles.name as role_name FROM users INNER JOIN roles ON roles.id = users.user_type WHERE users.user_type = ?`,
            [role_id]
        );

        if (usersDetailsOnRoleId.length > process.env.VALUE_ZERO) {
            for (const row of usersDetailsOnRoleId) {
                usersFinalData.push({
                    id: row.id,
                    name: row.name,
                    employee_id: row.employee_id,
                    image: row.image,
                    role_name: row.role_name,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Members fetched successfully",
                data: usersFinalData,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Members not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

const saveUserHierarchyLevel = async (req, res, next) => {
    try {
        return console.log(req.body);
    } catch (error) {
        return next(error);
    }
};

const importHrTeam = async (req, res, next) => {
    try {
        if (!req?.files?.excel) {
            return res.status(400).json({
                status: false,
                message: "Excel file is required",
            });
        }

        // Upload file and get the path
        const filePath = await uploadFile("importData", req.files.excel);
        const completePath = path.join(process.cwd(), "public", filePath);

        // Read the Excel file
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = xlsx.utils.sheet_to_json(sheet);

        //get team members which is not assigned to any team
        var team_member_lists = [];
        const user_id = req.user.user_id;
        let combinedMembers;
        // get all teams and members
        const getTeamMemberList = await db.query(
            "SELECT id, team_name, team_member FROM hr_teams WHERE created_by= ?",
            [user_id]
        );

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            for (const row of getTeamMemberList) {
                const teamDbData = row.team_member; // Assuming row.team_member is the JSON-encoded string
                const teamDbMembers = JSON.parse(teamDbData); // Parse the JSON-encoded string directly
                const members = teamDbMembers.team_member.split(",").map((member) => member.trim()); // Split and clean up the member IDs
                team_member_lists.push(...members); // Push individual members into the array
            }
            // combinedMembers = team_member_lists.join(', '); // Join all the members with a comma and a space
            // combinedMembers = combinedMembers.slice(0, -2); // Remove the last two characters (comma and space)
            combinedMembers = team_member_lists.map((member) => member.trim()).join(", ");
        }

        let membersQuery;
        if (combinedMembers != null) {
            membersQuery = `SELECT id FROM users WHERE (is_deleted = '0' AND created_by ='${user_id}') AND id NOT IN(${combinedMembers})`;
        } else {
            membersQuery = `SELECT id FROM users WHERE  (is_deleted = '0' AND created_by ='${user_id}')`;
        }

        const queryResult = await db.query(membersQuery);

        let errorMessage = [];

        for (let i = 0; i < rows.length; i++) {
            const item = rows[i];
            let { manager_id, supervisor_id } = item;
            item.team_member = item?.team_member ? JSON.parse(item?.team_member) : [];
            const { error } = importHrTeamValidations.validate(item);
            if (error) {
                const errMsg = error.message.replace(/"(.*?)"/g, "$1");
                errorMessage.push(`${errMsg} in the ${i + 1} record`);
            }

            const recordCheck = [
                {
                    table: "users",
                    conditions: { id: manager_id, user_type: process.env.MANAGER_ROLE_ID },
                    key: "manager_id",
                },
                {
                    table: "users",
                    conditions: { id: supervisor_id },
                    key: "supervisor_id",
                },
            ];

            for (let record of recordCheck) {
                const recordExists = await getRecordWithConditions(record.table, record.conditions);
                if (recordExists.length == 0) {
                    errorMessage.push(`${record.conditions.id} is not valid ${record.key} in the ${i + 1} record`);
                }
            }

            // Check if all members are valid
            let errs = "";
            item.team_member.forEach((memberId) => {
                if (!queryResult.some((user) => user.id === memberId)) {
                    // If memberId not found in queryResult, store an error
                    errs += `${memberId}, `;
                } else {
                    // If memberId found, remove the matching user from queryResult
                    const index = queryResult.findIndex((user) => user.id === memberId);
                    if (index !== -1) {
                        queryResult.splice(index, 1); // Remove the matched user
                    }
                }
            });

            if (errs) {
                errs += `is not valid member ids in the ${i + 1} record`;
                errorMessage.push(errs);
            }
        }

        if (errorMessage.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Failed to import data.", errorMessage });
        }

        for (let item of rows) {
            item.created_by = req.user.user_id;
            item.team_member = JSON.stringify({ team_member: item.team_member.join(",") });
            const query = `INSERT INTO hr_teams SET ?`;
            await db.query(query, item);
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Data imported successfully!" });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createHrTeam,
    getAllHrTeamWithMember,
    getHrTeamDetailsById,
    updateHrTeamDetails,
    deleteHrTeam,
    removeSpecificUserFromTeam,
    addNewMemberInTeam,
    getMemberListToAddInTeam,
    getMemberListWithoutTeam,
    getLoggedUserDetails,
    getUsersOnRoleId,
    saveUserHierarchyLevel,
    importHrTeam,
};

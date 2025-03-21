var moment = require("moment");
const { con, makeDb } = require("../db");
const db = makeDb();

async function generatePanelIdForAdmin(role_id, userName) {
    const roleData = await db.query(`SELECT name FROM roles WHERE id='${role_id}'`);
    if (roleData.length > 0) {
        const str = roleData[0].name;
        const initials = str
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        var firstFourLetters = initials + "-" + userName.substr(0, 4).toUpperCase();
        return firstFourLetters + String(1).padStart(5, "0");
    } else {
        return "";
    }
}

async function generatePanelIdForUser(user_type, user_id) {
    let adminPanelDataQuery = ``;
    if (user_type) {
        adminPanelDataQuery = `SELECT panel_id FROM admins WHERE user_type='${user_type}' AND id='${user_id}'`;
    } else {
        adminPanelDataQuery = `SELECT panel_id FROM admins WHERE id ='${user_id}'`;
    }
    const adminPanelData = await db.query(adminPanelDataQuery);

    const panel_id = adminPanelData[0]?.panel_id || "SA-CHAN00001";

    const secondPart = panel_id.slice(-5);
    const firstPart = panel_id.slice(0, -5);
    const userPanelData = await db.query(
        `SELECT panel_id FROM users WHERE panel_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
    );
    if (userPanelData.length > 0) {
        const userPanelId = userPanelData[0].panel_id;
        const userSecondPart = userPanelId.slice(-5);
        const userFirstPart = userPanelId.slice(0, -5);
        return userFirstPart + String(parseInt(userSecondPart) + 1).padStart(5, "0");
    } else {
        return firstPart + String(parseInt(secondPart) + 1).padStart(5, "0");
    }
}

async function generateSuperAdminEmpId() {
    const adminPanelData = await db.query(`SELECT employee_id FROM admins WHERE user_type='1' AND id='1'`);
    const panel_id = adminPanelData[0].employee_id;
    const secondPart = panel_id.slice(-4);
    const firstPart = panel_id.slice(0, -4);
    const userData = await db.query(
        `SELECT employee_id FROM users WHERE employee_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
    );
    if (userData.length > 0) {
        const employee_id = userData[0].employee_id;
        const userSecondPart = employee_id.slice(-4);
        const userFirstPart = employee_id.slice(0, -4);
        return userFirstPart + String(parseInt(userSecondPart) + 1).padStart(4, "0");
    } else {
        return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
    }
}

//-----------------OLD GENERATE EMP ID FOR SUPER ADMIN USERS-----------------
// async function generateEmpIdForSuperAdminUsers() {
//     try {
//         let firstPart = "";
//         let secondPart = "";
//         const adminPanelData = await db.query(`SELECT employee_id FROM admins WHERE user_type='1' AND id='1'`);
//         if (adminPanelData.length > 0) {
//             const panel_id = adminPanelData[0].employee_id;
//             secondPart = panel_id.slice(-4);
//             firstPart = panel_id.slice(0, -4);
//         } else {
//             const panel_id = "CMS0001";
//             secondPart = panel_id.slice(-4);
//             firstPart = panel_id.slice(0, -4);
//         }
//         const userData = await db.query(
//             `SELECT employee_id FROM admins WHERE employee_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
//         );
//         if (userData.length > 0) {
//             const employee_id = userData[0].employee_id;
//             const userSecondPart = employee_id.slice(-4);
//             const userFirstPart = employee_id.slice(0, -4);
//             return userFirstPart + String(parseInt(userSecondPart) + 1).padStart(4, "0");
//         } else {
//             return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
//         }
//     } catch (error) {
//         throw error;
//     }
// }

async function generateEmpIdForSuperAdminUsers(createdBy) {
    // console.log('createdBy: ', createdBy);
    try {
        let firstPart = "";
        let secondPart = "";

        if (!createdBy) {
            console.log("Please provide Created By");
            throw new Error("Something went wrong");
        }

        // Fetch the employee number format from the database
        const formatData = await db.query(
            `SELECT sample_format FROM employee_no_format WHERE status = '1' AND is_deleted = '0' AND created_by = '${createdBy}'`
        );

        // formatData[0].sample_format = ""
        const format = formatData[0]?.sample_format || "CMS0001";

        // Ensure proper replacement of the numeric part
        const defaultPanelId = format.replace(/^(([^/-]+[/-][^/-]+[/-]))\d+$/, "$10001");
        // console.log("After replacement:", defaultPanelId);

        // Properly split into `firstPart` and `secondPart`
        const lastSeparatorIndex = Math.max(defaultPanelId.lastIndexOf("/"), defaultPanelId.lastIndexOf("-"));
        firstPart = defaultPanelId.slice(0, lastSeparatorIndex + 1); // Include the last separator
        secondPart = defaultPanelId.slice(lastSeparatorIndex + 1); // Everything after the last separator

        // console.log("First part:", firstPart);
        // console.log("Second part:", secondPart);

        // Query the latest employee ID with the same prefix
        const userData = await db.query(
            `SELECT employee_id FROM admins WHERE employee_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
        );
        if (userData.length > 0) {
            const employee_id = userData[0].employee_id;
            const userSecondPart = employee_id.slice(-4); // Extract the last 4 digits of the existing ID
            const userFirstPart = employee_id.slice(0, -4); // Extract the prefix
            return userFirstPart + String(parseInt(userSecondPart) + 1).padStart(4, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
        }
    } catch (error) {
        throw error;
    }
}

async function generateEmpIdForContractorUsers() {
    try {
        const adminPanelData = await db.query(`SELECT employee_id FROM admins WHERE user_type='1' AND id='1'`);
        const panel_id = adminPanelData[0].employee_id;
        const secondPart = panel_id.slice(-4);
        const firstPart = panel_id.slice(0, -4);
        const userData = await db.query(
            `SELECT employee_id FROM users WHERE employee_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
        );
        if (userData.length > 0) {
            const employee_id = userData[0].employee_id;
            const userSecondPart = employee_id.slice(-5);
            const userFirstPart = employee_id.slice(0, -5);
            return userFirstPart + String(parseInt(userSecondPart) + 1).padStart(5, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(5, "0");
        }
    } catch (error) {
        throw error;
    }
}

async function generateEmpIdForOutletUsers() {
    try {
        const firstPart = `OUTLET`;

        // Fetch last employee ID matching the pattern
        const rows = await db.query(
            `SELECT employee_id FROM users WHERE employee_id LIKE '${firstPart}%' ORDER BY id DESC LIMIT 1`
        );
        // console.log('rows: ', rows);

        if (Array.isArray(rows) && rows.length > 0 && rows[0].employee_id) {
            const employee_id = rows[0].employee_id;
            const match = employee_id.match(/OUTLET-(\d{5})$/);

            if (match) {
                const userSecondPart = match[1]; // Extract last 5 digits
                const newSecondPart = String(parseInt(userSecondPart, 10) + 1).padStart(5, "0");
                return `${firstPart}-${newSecondPart}`;
            }
        }

        // If no previous record exists, or if format is incorrect, start with "00001"
        return `${firstPart}-00001`;

    } catch (error) {
        console.error("Error generating Employee ID:", error);
        throw error;
    }
}


module.exports = {
    generatePanelIdForAdmin,
    generatePanelIdForUser,
    generateSuperAdminEmpId,
    generateEmpIdForSuperAdminUsers,
    generateEmpIdForContractorUsers,
    generateEmpIdForOutletUsers
};

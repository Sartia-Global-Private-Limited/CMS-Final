const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, itemSchema } = require("./validation");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");
const sharp = require("sharp");
const fs = require("fs");
const { getCompanyName, getDbLastComplaintUniqueId, getDbLastComplaintUniqueIdInPi, roleById } = require("./general");
const PDFDocument = require("pdfkit");
const path = require("path");
const { states } = require("../controllers/states");
const xlsx = require("xlsx");
const { body, validationResult } = require("express-validator");
const { logger } = require("./logger");

async function getUsedQty(po_for, po_id) {
    try {
        const check = await db.query(
            `SELECT poi.purchase_order_id, poi.order_line_number,  poi.qty AS total_quantity, IFNULL(used.used_qty, 0) AS used_quantity, poi.qty - IFNULL(used.used_qty, 0) AS remaining_quantity FROM purchase_order_item poi LEFT JOIN (SELECT po_id, order_line_number, SUM(used_qty) AS used_qty FROM used_po_details GROUP BY po_id, order_line_number) AS used ON poi.purchase_order_id = used.po_id AND poi.order_line_number = used.order_line_number WHERE poi.po_for = '${po_for}' AND poi.purchase_order_id = '${po_id}'`
        );
        return {
            status: true,
            data: check,
        };
    } catch (error) {
        throw new Error(error);
    }
}
async function getCompanyDetailsById(companyId) {
    try {
        const { error } = checkPositiveInteger.validate({ id: companyId });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = "SELECT * FROM companies WHERE company_id = ?";

        const queryResult = await db.query(selectQuery, [companyId]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return { company_name: "", company_id: "", company_address: "", gst_number: "" };
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function getStateById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        const selectQuery = "SELECT * FROM states WHERE id = ?";

        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return { name: "" };
        }
    } catch (error) {
        return error.message;
    }
}

async function getRegionalOfficeById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const selectQuery = "SELECT * FROM regional_offices WHERE id = ?";

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function manageUserWallet(user_id, amount, type) {
    console.log('user_id, amount, type: ', user_id, amount, type);
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = "SELECT * FROM user_wallets WHERE user_id = ?";
        const queryResult = await db.query(selectQuery, [user_id]);
        const walletDbData = queryResult[0];
        const dbWalletBalance = walletDbData.balance;
        // console.log('dbWalletBalance: ==========> in manageUserWallet', dbWalletBalance);
        var finalAmount = 0;

        if (type === "deduct") {
            finalAmount = dbWalletBalance - amount;
        } else {
            finalAmount = dbWalletBalance + amount;
        }

        // update user wallet balance

        const walletBalance = await db.query("UPDATE user_wallets SET balance = ? WHERE user_id = ?", [
            finalAmount,
            user_id,
        ]);

        if (walletBalance.affectedRows > process.env.VALUE_ZERO) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return error.message;
    }
}

async function generateRandomNumber(length) {
    const min = 10 ** (length - 1); // Minimum value of the random number (e.g., for length 4, min = 1000)
    const max = 10 ** length - 1; // Maximum value of the random number (e.g., for length 4, max = 9999)

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getUserExpenseDetailById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = "SELECT * FROM expenses WHERE id = ?";
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return {};
        }
    } catch (error) {
        return error.message;
    }
}

async function saveTransactionDetails(transactionData) {
    try {
        if (Object.keys(transactionData).length !== process.env.VALUE_ZERO) {
            const data = {
                user_id: transactionData.user_id,
                transaction_type: transactionData.transaction_type,
                transaction_date: transactionData.transaction_date,
                amount: transactionData.amount,
                balance: transactionData.balance,
                description: transactionData.description,
                created_by: transactionData.created_by,
                complaints_id: transactionData.complaints_id,
            };

            const result = await db.query("INSERT INTO transactions SET ?", [data]);

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return {
                    status: true,
                    data: result.insertId,
                };
            } else {
                return false;
            }
        } else {
            return "Transactions not save due to empty data";
        }
    } catch (error) {
        return error.message;
    }
}

async function getUserCashRequestDetailById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = "SELECT * FROM cash_requests WHERE id = ?";
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return {};
        }
    } catch (error) {
        return error.message;
    }
}

async function getUserWalletBalance(user_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });

        if (error) {
            return error.message;
        }
        // get user wallet balance and details
        const selectQuery = "SELECT balance FROM user_wallets WHERE user_id = ?";
        const queryResult = await db.query(selectQuery, [user_id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return 0;
        }
    } catch (error) {
        return error.message;
    }
}

async function getSupplierAddresses(supplier_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: supplier_id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery =
            `   SELECT supplier_addresses.id, supplier_addresses.supplier_id, supplier_addresses.shop_office_number, supplier_addresses.street_name, supplier_addresses.city AS city, cities.name AS city_name, supplier_addresses.state AS state, states.name AS state_name, supplier_addresses.pin_code, supplier_addresses.landmark, supplier_addresses.gst_number, supplier_addresses.is_default 
                FROM supplier_addresses 
                LEFT JOIN states ON states.id = supplier_addresses.state
                LEFT JOIN cities ON cities.id = supplier_addresses.city
                WHERE supplier_id = ? 
                ORDER BY id DESC`;
        const queryResult = await db.query(selectQuery, [supplier_id]);
        // console.log('queryResult: ', queryResult);
        if (queryResult.length > process.env.VALUE_ZERO) {
            // queryResult.map((row) => {
            //     row.city = (row.city && JSON.parse(row.city) && (typeof row.city) === "number") ? JSON.parse(row.city) : row.city;
            //     row.state = row.state && JSON.parse(row.state) && typeof row.state === "number" ? JSON.parse(row.state) : row.state;
            // })
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

async function getItemUsedDetailsInComplaint(itemId) {
    try {
        const query = `SELECT items_used.item_id, items_used.complaint_id, items_used.quantity, items_used.item_price, items_used.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM items_used LEFT JOIN complaints ON complaints.complaint_unique_id = items_used.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE items_used.used_item = ?`;

        return await db.query(query, [itemId]);
    } catch (error) {
        return error.message;
    }
}

async function getSubModuleForReports(module_id) {
    const sql = `SELECT id as sub_module_id, title as sub_module_name FROM sub_modules WHERE module_id='${module_id}' AND is_deleted = 0`;
    return await db.query(sql);
}

async function getModuleOfSubModuleForReports(sub_module_id) {
    const sql = `SELECT id as module_of_sub_module_id, title as module_of_sub_module_name, path as module_of_sub_module_path, status as module_of_sub_module_status, app_icon  FROM module_of_sub_modules WHERE sub_module_id='${sub_module_id}' AND is_deleted = 0`;
    return await db.query(sql);
}

async function isPlural(str) {
    // Remove leading and trailing spaces and convert to lowercase
    str = str.trim().toLowerCase();

    // Check if the string ends with 's'
    return str.endsWith("s");
}

async function makePlural(str) {
    // Remove leading and trailing spaces and convert to lowercase
    str = str.trim().toLowerCase();

    // Check if the string ends with 's', 'x', 'z', 'sh', or 'ch'
    if (str.endsWith("s") || str.endsWith("x") || str.endsWith("z") || str.endsWith("sh") || str.endsWith("ch")) {
        return str + "es"; // Add 'es' to make it plural
    } else if (str.endsWith("y") && str.length > 1) {
        // If the word ends with 'y' preceded by a consonant, replace 'y' with 'ies'
        return str.slice(0, -1) + "ies";
    } else {
        return str + "s"; // Add 's' in other cases
    }
}

async function getUserSalaryDisburseHistory(user_id, monthYear) {
    try {
        if (user_id != null && monthYear != null) {
            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            const sqlQuery = await db.query(
                `SELECT date, amount, transaction_number, transaction_mode, opening_balance, due_amount FROM salary_disburse_histories WHERE user_id = '${user_id}' AND YEAR(date) = '${year}' AND MONTH(date) = '${month}' ORDER BY ID ASC`
            );

            if (sqlQuery.length > process.env.VALUE_ZERO) {
                for (row of sqlQuery) {
                    values.push({
                        date: moment(row.date).format("DD-MM-YYYY"),
                        amount: row.amount,
                        transaction_number: row.transaction_number,
                        transaction_mode: row.transaction_mode,
                        opening_balance: row.opening_balance,
                        due_amount: row.due_amount,
                    });
                }

                return values;
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getUserSalaryDueAmount(userId, monthYear) {
    try {
        if (userId != null && monthYear != null) {
            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            // get user due for all previous month
            const sqlQuery = await db.query(
                `SELECT due_amount, date FROM salary_disburse_histories WHERE user_id = '${userId}' ORDER BY ID DESC LIMIT 1`
            );
            if (sqlQuery.length > process.env.VALUE_ZERO) {
                return sqlQuery[0];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    } catch (error) {
        return error.message;
    }
}

async function getUserSalaryDisbursedAmount(userId, monthYear) {
    try {
        if (userId != null && monthYear != null) {
            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            const sqlQuery = await db.query(
                // `SELECT gross_salary FROM salary_disburses WHERE user_id = '${userId}' AND YEAR(month) = '${year}' AND MONTH(month) = '${month}' ORDER BY ID DESC LIMIT 1`
                `SELECT SUM(amount) AS amount FROM salary_disburse_histories WHERE user_id = '${userId}' AND YEAR(date) = '${year}' AND MONTH(date) = '${month}' ORDER BY id DESC`
            );

            if (sqlQuery.length > process.env.VALUE_ZERO) {
                return sqlQuery[0].amount;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    } catch (error) {
        return error.message;
    }
}

async function getItemDetailsById(id) {
    try {
        const sqlQuery = await db.query(`SELECT * FROM item_masters WHERE id = '${id}'`);

        if (sqlQuery.length > process.env.VALUE_ZERO) {
            return sqlQuery[0];
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function measurementDetailsWithPoAndComplaint(po_id) {
    try {
        const selectQuery =
            "SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id FROM measurements LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.po_id = ?";

        const queryResult = await db.query(selectQuery, [po_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [
                    row.sale_area_id,
                ]);

                //get outlet details
                const outletDetails = await db.query(
                    "SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );

                //get regional office details
                const regionalOfficeDetails = await db.query(
                    "SELECT id, regional_office_name FROM regional_offices WHERE id = ?",
                    [row.ro_office_id]
                );

                // get location details
                const locationDetails = await db.query(
                    "SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );

                // order by details
                //const orderByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    measurement_id: row.id,
                    measurement_date: moment(row.measurement_date).format("DD-MM-YYYY"),
                    measurement_no: row.measurement_unique_id,
                    po_number: row.po_number,
                    title: row.work,
                    po_limit: row.po_limit,
                    po_amount: row.po_amount,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_id: row.complaint_id,
                    work: "",
                    area_manager: "",
                    team_technician: "",
                    letter_status: "",
                    attachments: "",
                    outlet_name: outletDetails[0].outlet_name,
                    outlet_id: outletDetails[0].id,
                    ro_office: regionalOfficeDetails[0].regional_office_name,
                    sale_area: saleArea[0].sales_area_name,
                    location: locationDetails[0].district_name,
                    //order_by: orderByDetails.name,
                    financial_year: row.financial_year,
                });
            }
            // all items list
            const itemLists = await getFullItemList();
            return { data: finalData[0], items: itemLists };
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function measurementDetailsWithPoAndComplaints(po_id) {
    try {
        const selectQuery = `
            SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id 
            FROM measurements 
            LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id 
            LEFT JOIN complaints ON complaints.id = measurements.complaint_id 
            WHERE measurements.po_id = ? AND measurements.status = '5'`;

        const queryResult = await db.query(selectQuery, [po_id]);

        if (queryResult.length > 0) {
            var finalData = [];
            var allComplaints = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [
                    row.sale_area_id,
                ]);
                //get outlet details
                const outletDetails = await db.query(
                    "SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );
                //get regional office details
                const regionalOfficeDetails = await db.query(
                    "SELECT id, regional_office_name FROM regional_offices WHERE id = ?",
                    [row.ro_office_id]
                );
                // get location details
                const locationDetails = await db.query(
                    "SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?",
                    [row.ro_office_id, row.sale_area_id]
                );

                finalData.push({
                    measurement_id: row.id,
                    measurement_date: moment(row.measurement_date).format("DD-MM-YYYY"),
                    measurement_no: row.measurement_unique_id,
                    po_number: row.po_number,
                    title: row.work,
                    po_limit: row.po_limit,
                    po_amount: row.po_amount,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_id: row.complaint_id,
                    work: "",
                    area_manager: "",
                    team_technician: "",
                    letter_status: "",
                    attachments: "",
                    outlet_name: outletDetails[0].outlet_name,
                    outlet_id: outletDetails[0].id,
                    ro_office: regionalOfficeDetails[0].regional_office_name,
                    sale_area: saleArea[0].sales_area_name,
                    location: locationDetails[0].district_name,
                    financial_year: row.financial_year,
                });

                if (row.complaint_id) {
                    // If a complaint is linked
                    allComplaints.push({
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id,
                        // Add other complaint details if needed
                    });
                }
            }
            // all items list
            const itemLists = await getFullItemList();
            return { data: finalData, items: itemLists, complaints: allComplaints };
        } else {
            return { data: [], items: [], complaints: [] }; // No data found
        }
    } catch (error) {
        return { error: error.message, complaints: [] }; // Return error message
    }
}

// get all items listed in measurement details with PO
async function getFullItemList() {
    try {
        const selectQuery = `SELECT id, name, rate FROM item_masters`;
        const queryResult = await db.query(selectQuery);
        return queryResult;
    } catch (error) {
        // Re-throw the error so the caller can handle it appropriately
        return error.message;
    }
}

async function getMeasurementsItemsById(measurementId) {
    try {
        const selectQuery = `
            SELECT DISTINCT measurement_items.id AS measurement_id_item_id, measurement_items.measurement_id, measurement_items.unit_id AS unit_name, measurement_items.length, measurement_items.number, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate As measurement_item_rate, measurement_items.amount, measurement_items.created_by, measurements.id AS measurement_id, measurements.po_for, measurements.po_id, purchase_orders.po_number, complaints.complaint_unique_id AS complaint_id, measurement_items.order_line_number AS order_line_number, purchase_order_item.name AS item_name, purchase_order_item.rate, purchase_order_item.hsn_code, purchase_order_item.unit FROM measurement_items LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN purchase_orders ON purchase_orders.id = measurement_items.po_id LEFT JOIN complaints ON complaints.id = measurement_items.complaint_id LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = measurement_items.order_line_number WHERE measurement_items.measurement_id = ?`;

        const queryResult = await db.query(selectQuery, [measurementId]);

        if (queryResult.length > 0) {
            // Fetch remaining quantity for each order line number
            for (const row of queryResult) {
                const remainingQuantity = await getUsedQty(row.po_for, row.po_id);
                const remainingQtyForOrderLine = remainingQuantity.data.find(
                    (entry) => entry.order_line_number === row.order_line_number
                );
                if (remainingQtyForOrderLine) {
                    row.remaining_quantity = remainingQtyForOrderLine.remaining_quantity;
                } else {
                    row.remaining_quantity = null; // Set null if remaining quantity not found
                }
            }
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getMeasurementsItemsSubChildById(measurement_id, item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(
            `SELECT  description, number as no, length, breadth, depth, quantity as qty, order_line_number FROM measurement_items WHERE measurement_id = ${measurement_id} AND order_line_number = ${item_id}`
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getManagerFreeTeamMember(manager_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: manager_id });

        if (error) {
            return error.message;
        }

        // get manager team and his members
        const teamMembers = await db.query(
            "SELECT id, manager_id, team_name, team_member FROM hr_teams WHERE manager_id = ?",
            [manager_id]
        );
        if (teamMembers.length > process.env.VALUE_ZERO) {
            const members = teamMembers[0];
            const member_list = JSON.parse(members.team_member);
            // get member details
            const sql = `SELECT id, name, employee_id, image FROM users WHERE id IN(${member_list.team_member})`;
            const membersDetails = await db.query(sql);

            if (membersDetails.length > process.env.VALUE_ZERO) {
                var finalData = [];
                for (let member of membersDetails) {
                    const complaintQuery = `SELECT complaints.id, complaints.description, complaints_timeline.complaints_id, complaints_timeline.title, complaints_timeline.assign_to FROM complaints INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to = ? GROUP BY complaints_timeline.complaints_id`;

                    const queryResult = await db.query(complaintQuery, [member.id]);
                    if (!queryResult || queryResult.length === 0) {
                        // If queryResult is empty, meaning no unresolved complaints for the member
                        finalData.push({
                            id: member.id,
                            name: member.name,
                            employee_id: member.employee_id,
                            image: member.image,
                        });
                    }
                }

                return { finalData };
            } else {
                return { message: "members not found" };
            }
        } else {
            return { message: "Manager has no teams available" };
        }
    } catch (error) {
        return error.message;
    }
}

async function getSuperVisorUsers(supervisor_id, type) {
    try {
        const { error } = checkPositiveInteger.validate({ id: supervisor_id });
        if (error) {
            return error.message;
        }

        // const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [
        //     supervisor_id,
        // ]);
        let queryResult;
        let teamQuery;
        let members;
        if (type && type == 1) {
            teamQuery = `SELECT id, manager_id, supervisor_id, team_member FROM hr_teams WHERE supervisor_id = ?`;
            const teamResult = await db.query(teamQuery, [supervisor_id]);
            // console.log('teamResult: ', teamResult);
            if(teamResult.length > process.env.VALUE_ZERO) {
                const parsedMembers = teamResult[0].team_member && JSON.parse(teamResult[0].team_member);
                members = parsedMembers.join(",");
                // console.log('members: ', members);
            }
            queryResult = await db.query(`SELECT id, name, employee_id, image FROM admins WHERE id IN(${members})`, [
                supervisor_id,
            ]);
        } else {
            teamQuery = `SELECT id, manager_id, supervisor_id, team_member FROM hr_teams WHERE supervisor_id = ?`;
            const teamResult = await db.query(teamQuery, [supervisor_id]);
            // console.log('teamResult: ', teamResult);
            if(teamResult.length > process.env.VALUE_ZERO) {
                const parsedMembers = teamResult[0].team_member && JSON.parse(teamResult[0].team_member);
                // console.log('parsedMembers: ', parsedMembers);
                members = parsedMembers?.team_member;
                // console.log('members: ', members);
            }
            queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE id IN(${members})`, [
                supervisor_id,
            ]);
        }

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            // return "end users not found";
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getAdminSuperVisorUsers(supervisor_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: supervisor_id });
        if (error) {
            return error.message;
        }

        const queryResult = await db.query(
            `SELECT id, name, employee_id, image FROM admins WHERE supervisor_id = '${supervisor_id}'`
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            // return "end users not found";
            return [];
        }
        // const { error } = checkPositiveInteger.validate({ id: supervisor_id });
        // if (error) {
        //     return error.message;
        // }

        // const queryResult = await db.query(
        //     `SELECT id, name, employee_id, image FROM admins WHERE supervisor_id = '${supervisor_id}'`
        // );

        // if (queryResult.length > process.env.VALUE_ZERO) {
        //     return queryResult;
        // } else {
        //     // return "end users not found";
        //     return [];
        // }
    } catch (error) {
        return error.message;
    }
}

async function checkUserHasNoActiveComplaints(assign_to) {
    // console.log('assign_to: ', assign_to);

    try {
        const { error } = checkPositiveInteger.validate({ id: assign_to });
        if (error) {
            throw error;
        }

        // const complaintQuery = `
        //     SELECT complaints.id, complaints.description, complaints_timeline.complaints_id, complaints_timeline.title, complaints_timeline.assign_to
        //     FROM complaints
        //     INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id
        //     WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to = ? AND free_end_users = 1
        //     GROUP BY complaints_timeline.complaints_id`;
        const complaintQuery = `
            SELECT 
            complaints.id, 
            complaints.description, 
            complaints_timeline.complaints_id, 
            complaints_timeline.title, 
            complaints_timeline.assign_to 
            FROM complaints 
            INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id 
            WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to = ? AND free_end_users = 1 
            GROUP BY 
            complaints.id, 
            complaints.description, 
            complaints_timeline.complaints_id, 
            complaints_timeline.title, 
            complaints_timeline.assign_to;
            `;

        const queryResult = await db.query(complaintQuery, [assign_to]);
        if (queryResult.length > 0) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function todayFoodExpensePunch(date, user_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });
        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM expenses WHERE user_id =? AND expense_date =?`, [
            user_id,
            date,
        ]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function convertBase64Image(base64File, imageFullDirectory, path) {
    try {
        // Convert the Base64 string to a buffer
        const imageBuffer = Buffer.from(base64File, "base64");
        // Specify the output directory path
        const outputDir = imageFullDirectory;

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const imageName = Date.now() + "_output_resized.jpg"; // Include a file name here
        const imagePath = outputDir + imageName;
        const dbImagePath = path + imageName;
        // Use sharp to process the image
        sharp(imageBuffer).toFile(outputDir + imageName, (err, info) => {
            if (err) {
                return err;
            } else {
                return imageName;
            }
        });

        return dbImagePath;
    } catch (error) {
        return error.message;
    }
}

// async function purchaseOrderItemsOnPoId(po_id) {
//     try {

//         const id = po_id;

//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return error.message;
//         }

//         const queryResult = await db.query(`SELECT purchase_order_item.id as po_item_id,  purchase_order_item.po_for,  purchase_order_item.order_line_number, purchase_order_item.hsn_code,  purchase_order_item.name,  purchase_order_item.rate,  purchase_order_item.qty, purchase_order_item.unit as unit FROM  purchase_order_item WHERE  purchase_order_item.purchase_order_id = ?
//         `, [id])
//         if (queryResult.length > process.env.VALUE_ZERO) {
//             return queryResult;
//         }
//         else {
//             return [];
//         }
//     } catch (error) {next(error)

//         return error.message;
//     }
// }

async function purchaseOrderItemsOnPoId(po_id) {
    try {
        const id = po_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            throw new Error(error.message);
        }

        const queryResult = await db.query(
            `SELECT purchase_order_item.id as po_item_id, purchase_order_item.po_for, purchase_order_item.order_line_number, purchase_order_item.hsn_code, purchase_order_item.name, purchase_order_item.rate, purchase_order_item.qty, purchase_order_item.unit as unit FROM purchase_order_item WHERE purchase_order_item.purchase_order_id = ?`,
            [id]
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getPoUsedAmount(po_id, amount) {
    try {
        const id = po_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM purchase_orders WHERE id =?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const poData = queryResult[0];

            const po_remaining_amount = poData.po_limit - poData.po_amount;
            if (poData.po_limit < amount) {
                return true;
            } else if (po_remaining_amount < amount) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return error.message;
    }
}

async function getAllGeneratedInvoiceNumberFormat() {
    try {
        const queryResult = await db.query(`SELECT * FROM invoice_no_format`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

function convertFinancialYear(financialYear) {
    const parts = financialYear.split("-");
    const startYear = parts[0].slice(-2);
    const endYear = parts[1].slice(-2);
    return startYear + endYear;
}

async function getLastFinancialYearBillNoForPI(financial_year) {
    try {
        if (financial_year != null && financial_year != "") {
            const queryResult = await db.query(
                `SELECT bill_no FROM proforma_invoices WHERE financial_year = ? ORDER BY id DESC LIMIT 1`,
                [financial_year]
            );
            if (queryResult.length > process.env.VALUE_ZERO) {
                const lastBillNumber = queryResult[0].bill_no;

                if (lastBillNumber) {
                    // Extract the last character
                    const lastDigit = lastBillNumber.slice(-1);
                    // Increment the last digit
                    const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                    // Replace the last digit in the string
                    const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                    return resultString;
                } else {
                    return "No numeric part found in the input string";
                }
            } else {
                const prefix = "CMS";
                const financial_year_format = financial_year;
                const start_bill_number = "0001";
                const finalFormat = prefix + financial_year_format + start_bill_number;
                return finalFormat;
            }
        } else {
            return "Financial year not in correct format";
        }
    } catch (error) {
        return error.message;
    }
}

async function generatePINumber(energy_company_id, complaint_for) {
    const companyId = energy_company_id.toString().padStart(2, "0");

    const dbCompanyName = await getCompanyName(energy_company_id);

    const trimmedDbCompanyName = dbCompanyName?.trim();
    const charactersOfCompanyName = trimmedDbCompanyName?.substring(0, 3)?.toUpperCase();

    const complaintPrefix = charactersOfCompanyName + companyId + "PI" + "00";

    const selectQuery = await db.query(
        `SELECT bill_no FROM proforma_invoices WHERE bill_no LIKE "${complaintPrefix}%" ORDER BY bill_no DESC LIMIT 1`
    );

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].bill_no;
        const lastNumber = parseInt(lastBillNo.slice(-2), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }

    const padLength = 2;
    const paddedNumber = nextPiId.toString().padStart(padLength, "0");
    const newBillNo = complaintPrefix + paddedNumber;

    return newBillNo;
}

async function generateInvoiceNumber(financial_year, billing_to, companies_for) {
    const formattedFinancialYear = convertFinancialYear(financial_year);
    const companyId = billing_to.toString().padStart(2, "0");
    const dbCompanyName = await getCompanyName(billing_to, companies_for);

    // Trim and extract the first three characters of the company name
    const trimmedDbCompanyName = dbCompanyName?.trim();
    const charactersOfCompanyName = trimmedDbCompanyName?.substring(0, 3).toUpperCase();

    // Construct the prefix for the complaint number
    const complaintPrefix = `${formattedFinancialYear}-${companyId}`;
    // Check for the latest bill number with the prefix
    const selectQuery = await db.query(
        `SELECT invoice_no FROM invoices WHERE invoice_no LIKE "${complaintPrefix}%" ORDER BY invoice_no DESC LIMIT 1`
    );

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].invoice_no;
        const lastNumber = parseInt(lastBillNo.split("-").pop(), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }
    // Pad the incremented number with leading zeros to a length of 4
    const padLength = 4;
    const paddedNumber = nextPiId.toString().padStart(padLength, "0");
    // Construct the new bill number
    const newBillNo = `${formattedFinancialYear}-${companyId}-${paddedNumber}`;

    return newBillNo;
}

async function generateMPINumber(energy_company_id, complaint_for) {
    const companyId = energy_company_id.toString().padStart(2, "0");
    // const complaintExist = await db.query(`SELECT energy_company_id FROM complaints WHERE id = '${energy_company_id}'  `)
    const dbCompanyName = await getCompanyName(energy_company_id);

    const trimmedDbCompanyName = dbCompanyName.trim();
    const charactersOfCompanyName = trimmedDbCompanyName.substring(0, 3).toUpperCase();

    const complaintPrefix = charactersOfCompanyName + companyId + "MPI" + "00";

    const selectQuery = await db.query(
        `SELECT bill_no FROM proforma_invoices WHERE bill_no LIKE "${complaintPrefix}%" ORDER BY bill_no DESC LIMIT 1`
    );

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].bill_no;
        const lastNumber = parseInt(lastBillNo.slice(-2), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }

    const padLength = 2;
    const paddedNumber = nextPiId.toString().padStart(padLength, "0");
    const newBillNo = complaintPrefix + paddedNumber;
    return newBillNo;
}

async function getLastBillNoForMergedPI(financial_year) {
    try {
        const queryResult = await db.query(`SELECT merged_bill_number FROM merged_pi ORDER BY id DESC LIMIT 1`);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const lastBillNumber = queryResult[0].merged_bill_number;

            if (lastBillNumber) {
                // Extract the last character
                const lastDigit = lastBillNumber.slice(-1);
                // Increment the last digit
                const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                // Replace the last digit in the string
                const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                return resultString;
            } else {
                return "No numeric part found in the input string";
            }
        } else {
            const prefix = "CMS-MPI";
            // const financial_year_format = financial_year;
            const start_bill_number = "0001";
            const finalFormat = prefix + start_bill_number;
            return finalFormat;
        }
    } catch (error) {
        return error.message;
    }
}

async function getLastFinancialYearBillNoForInvoice(financial_year, energy_company_id, complaint_for) {
    try {
        if (financial_year != null && financial_year != "") {
            const queryResult = await db.query(
                `SELECT invoice_no FROM invoices WHERE financial_year = ? AND billing_to = ? ORDER BY id DESC LIMIT 1`,
                [financial_year, energy_company_id]
            );

            if (queryResult.length > process.env.VALUE_ZERO) {
                const lastBillNumber = queryResult[0].invoice_no;

                if (lastBillNumber) {
                    // Extract the last character
                    const lastDigit = lastBillNumber.slice(-1);
                    // Increment the last digit
                    const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                    // Replace the last digit in the string
                    const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                    return resultString;
                } else {
                    return "No numeric part found in the input string";
                }
            } else {
                const allGeneratedInvoiceNumberFormat = await getAllGeneratedInvoiceNumberFormat();
                const matchedData = allGeneratedInvoiceNumberFormat.filter(
                    (item) => item.financial_year == financial_year
                );

                if (matchedData != null && matchedData.length > process.env.VALUE_ZERO) {
                    const finalFormat = matchedData[0].sample_format;
                    return finalFormat;
                } else {
                    const prefix = "CMS";
                    const financial_year_format = financial_year;
                    const start_bill_number = "0001";
                    const finalFormat = prefix + "-" + financial_year_format + "-" + start_bill_number;
                    return finalFormat;
                }
            }
        } else {
            return "Financial year not in correct format";
        }
    } catch (error) {
        return error.message;
    }
}

async function getItemsDetailsByMeasurementId(measurement_id) {
    try {
        const queryResult = await db.query(
            `SELECT measurement_items.*, item_masters.image as item_image, item_masters.name as item_name, units.name as unit_name FROM measurement_items LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id WHERE measurement_items.measurement_id = ${measurement_id}`
        );
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getProformaInvoiceItemsDetailsById(id) {
    try {
        const ids = JSON.parse(id);

        //var stringWithoutQuotes = ids.replace(/"/g, '');

        const queryResult = await db.query(
            `SELECT measurement_items.*, item_masters.image as item_image, item_masters.name as item_name, units.name as unit_name FROM measurement_items LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id WHERE measurement_items.id IN (${ids})`
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function calculatedPercentage(percentage, totalValue) {
    try {
        const calculatedValue = (totalValue * percentage) / 100;
        return calculatedValue;
    } catch (error) {
        throw error;
    }
}

async function getPlanDetailById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `SELECT * FROM plans WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > 0) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function AllSubModuleOfEnergyCompany(index) {
    try {
        const subModuleArray = ["", "zone_id", "regional_id", "sale_area_id", "district_id", "outlet_id"];
        const { error } = checkPositiveInteger.validate({ id: index });

        if (error) {
            return error.message;
        }
        return subModuleArray[index];
    } catch (error) {
        return error.message;
    }
}

async function checkCompanyGstDefaultMarkOrNot(gst_details) {
    try {
        const hasDefault = gst_details.some((item) => item.is_default === "1");
        return hasDefault;
    } catch (error) {
        return error.message;
    }
}

async function checkAlreadyExistGst(gst_details) {
    for (let gst of gst_details) {
        const query = `SELECT * FROM company_gst_details WHERE gst_number = '${gst.gst_number}'`;
        const result = await db.query(query);

        if (result.length > 0) {
            return {
                status: true,
                gst: gst.gst_number,
                deleted: result[0].is_deleted,
                id: result[0].id,
                company_id: result[0].company_id,
                created_by: result[0].created_by,
                shipping_address: result[0].shipping_address,
                billing_address: result[0].billing_address,
                is_default: result[0].is_default,
            };
        }
    }
    return { status: false };
}

async function getOutLetUserDetailsByOutletId(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT id, email, password FROM users WHERE outlet_id = ?`, [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function generateSupplierCode(supplier_id) {
    let selectQuery = `SELECT suppliers.id, suppliers.supplier_code, supplier_addresses.state FROM suppliers JOIN supplier_addresses ON supplier_addresses.supplier_id = suppliers.id WHERE suppliers.id = ${supplier_id}`;
    const results = await db.query(selectQuery);

    let counter;

    if (results.length > 0) {
        const result = results[0];

        const supplierCodeQuery = `SELECT supplier_code FROM suppliers WHERE supplier_code IS NOT NULL AND supplier_code != '' ORDER BY id DESC LIMIT 1`;
        const supplierCodeResult = await db.query(supplierCodeQuery);

        if (supplierCodeResult.length) {
            counter = parseInt(supplierCodeResult[0].supplier_code.slice(-2));
            if (isNaN(counter)) {
                counter = 1;
            } else {
                counter += 1;
            }
        } else {
            counter = 1;
        }

        let id = counter < 10 ? `0${counter}` : counter;
        let state = states[result.state];

        const currentFinancialYear = moment().format("YY") + moment().add(1, "year").format("YY");

        return `${currentFinancialYear}${state}0${id}`;
    }
}

const supplier_status = {
    1: "request",
    2: "approved",
    3: "rejected",
};

/** Helper function for get QuotationItems by id */
async function getQuotationItemsById(quotationId) {
    try {
        const selectQuery = `
            SELECT DISTINCT 
            quotation_items.order_line_number AS order_line_number, 
            purchase_order_item.name AS item_name, 
            purchase_order_item.hsn_code, 
            quotation_items.rate, 
            quotation_items.unit AS unit_name, 
            quotations.id AS quotation_id, 
            quotation_items.length, 
            quotation_items.number, 
            quotation_items.breadth, 
            quotation_items.depth, 
            quotation_items.quantity, 
            quotation_items.amount, 
            quotation_items.created_by, 
            quotations.po_number,
            quotation_items.quantity, 
            purchase_order_item.rate,
            sq.total_qty 
            FROM quotation_items 
            LEFT JOIN quotations ON quotations.id = quotation_items.quotation_id 
            LEFT JOIN purchase_orders p ON p.id = quotation_items.po_id 
            LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = quotation_items.order_line_number LEFT JOIN ( SELECT order_line_number, SUM(quantity) AS total_qty  FROM quotation_items Where quotation_id = ? GROUP BY order_line_number ) sq ON sq.order_line_number = quotation_items.order_line_number 
            WHERE quotation_items.quotation_id = ?`;

        const queryResult = await db.query(selectQuery, [quotationId, quotationId]);
        if (queryResult.length > 0) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

/** get measurements items sub child by id for Quotation */
async function getQuotationItemsSubChildById(quotation_id, item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(
            `SELECT  description, number as no, length, breadth, depth, quantity as qty, order_line_number FROM quotation_items WHERE quotation_id = ${quotation_id} AND order_line_number = ${item_id}`
        );

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function getExpensePunchAndStockTotalAmounts(id) {
    try {
        const selectQuery = `
                        SELECT 
                            SUM(CASE WHEN Type = 'Total Stock' THEN Total ELSE 0 END) AS Total_Stock,
                            SUM(CASE WHEN Type = 'Total Expense' THEN Total ELSE 0 END) AS Total_Expense
                        FROM (
                            SELECT 
                                'Total Stock' AS Type,
                                SUM(stocks.rate * stock_punch_histories.site_approved_qty) AS Total
                            FROM
                                stock_punch_histories
                                LEFT JOIN complaints ON stock_punch_histories.complaint_id = complaints.id
                                LEFT JOIN stocks ON stock_punch_histories.stock_id = stocks.id
                            WHERE 
                                stock_punch_histories.site_approved_status = 2 
                                AND stock_punch_histories.complaint_id =  ${id}

                            UNION ALL

                            SELECT 
                                'Total Expense' AS Type,
                                SUM(expense_punch_history.site_approved_qty * fund_requests.item_price) AS Total
                            FROM
                                expense_punch_history
                                LEFT JOIN complaints ON expense_punch_history.complaint_id = complaints.id
                                LEFT JOIN fund_requests ON expense_punch_history.fund_id = fund_requests.id
                            WHERE 
                                expense_punch_history.site_approved_status = 2 
                                AND expense_punch_history.complaint_id = ${id}
                        ) AS combined_totals`;

        const queryResult = await db.query(selectQuery);

        return {
            complaint_id: id,
            Total_Stock: queryResult[0].Total_Stock,
            Total_Expense: queryResult[0].Total_Expense,
        };
    } catch (error) {
        return error.message;
    }
}

async function insertIntoRoWallets(ro_id, po_id, received_amount) {
    try {
        // Fetch the current balance for the area manager
        const selectQuery = `SELECT balance FROM ro_wallet WHERE ro_id = '${ro_id}' ORDER BY id DESC LIMIT 1`;
        const queryResult = await db.query(selectQuery);

        let newBalance = parseFloat(received_amount);

        // If there's an existing balance, update the new balance
        if (queryResult.length > 0) {
            const currentBalance = parseFloat(queryResult[0].balance);
            newBalance += currentBalance;
        } else {
            newBalance = received_amount;
        }

        // Insert the new record with the updated balance
        const insertQuery = `INSERT INTO ro_wallet (ro_id, po_id, amount_received, balance) VALUES ('${ro_id}', '${po_id}', '${received_amount}', '${newBalance}')`;
        await db.query(insertQuery);
    } catch (error) {
        throw new Error(error.message);
    }
}

// // Function to import data from an Excel file and insert into the database
// const importExcelData = async (filePath, tableName, user_id) => {
//     try {
//         // Get the column names and types from the specified table
//         const columns = await db.query(`SHOW COLUMNS FROM ${tableName}`);
//         // console.log('columns', columns);
//         const tableFields = columns.map((col) => ({
//             name: col.Field,
//             validation: getValidationForColumnType(col.Type),
//         }));

//         // Determine the file format
//         const fileExtension = filePath.name.split(".").pop();

//         const uploadPath =  process.cwd() +'/public/importData/' + filePath.name;
//         // const storePath = '/importData/' + filePath.name;
//         filePath.mv(uploadPath, async(err) => {

//             if (err) return res.status(400).json({status: false, message: err.message});
//             console.log('Excel File Imported Successfully');

//             let rows;
//             if (fileExtension === "csv") {
//                 // Read CSV file
//                 const worksheet = xlsx.readFile(uploadPath, { type: "string" }).Sheets.Sheet1;
//                 rows = xlsx.utils.sheet_to_json(worksheet, { defval: "", rawNumbers: true });
//             } else {
//                 // Read Excel file
//                 const workbook = xlsx.readFile(uploadPath);
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];
//                 rows = xlsx.utils.sheet_to_json(worksheet, { defval: "", rawNumbers: true });
//             }

//             for (const row of rows) {
//                 const columnsToInsert = [];
//                 const valuesToInsert = [];
//                 const validations = [];

//                 for (const field of tableFields) {
//                     // console.log('tableFields', tableFields)
//                     if (row.hasOwnProperty(field.name)) {
//                         columnsToInsert.push(field.name);
//                         valuesToInsert.push(row[field.name]);

//                         // Add validation based on the field type provided
//                         if (field.validation) {
//                             validations.push(body(field.name).custom(field.validation).run({ body: row }));
//                         }
//                     }
//                 }
//                 // add the created by using the logged in user id
//                 columnsToInsert.push("created_by");
//                 valuesToInsert.push(user_id);

//                 await Promise.all(validations);
//                 const errors = validationResult({ body: row });
//                 if (!errors.isEmpty()) {
//                     console.log("Validation failed for row:", row, errors.array());
//                     continue;
//                 }

//                 const query = `INSERT INTO ${tableName} (${columnsToInsert.join(", ")}) VALUES (${columnsToInsert.map(() => "?").join(", ")})`;
//                 console.log('Query', query)
//                 console.log('Columns', columnsToInsert)
//                 console.log('Values', valuesToInsert)

//                 // insert one row each into the database
//                 // await db.query(query, valuesToInsert);
//             }
//         })

//         console.log("Data imported successfully!");
//         return true;
//     } catch (error) {next(error)
//         console.error("Error importing data:", error.message);
//         return false;
//     }
// };

// // Generic validation based on MySQL data types (simplified)
const getValidationForColumnType = (type) => {
    if (type.includes("int")) return (value) => !isNaN(value);
    if (type.includes("varchar") || type.includes("text")) return (value) => typeof value === "string";
    if (type.includes("enum") || type.includes("set")) return (value) => typeof value === "string";
    if (type.includes("datetime")) return (value) => typeof value === "string";
    // Add more cases as needed
    return () => true; // Default to always passing validation
};

async function getBrandsByItemId(id) {
    const selectQuery = `SELECT
                        brands.id AS brand_id,
                        brands.brand_name,
                        brands.status AS brand_status
                    FROM
                        item_rates 
                    JOIN
                        brands ON item_rates.brand_id = brands.id
                    WHERE
                        item_rates.item_id = '${id}'`;
    const result = await db.query(selectQuery);
    return result;
}

(""); /**Function to upload file */
const uploadFile = async (folder, file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(__dirname, `../public/${folder}/`, fileName);
    const folderPath = path.join(__dirname, `../public/${folder}/`);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    const storePath = `${folder}/${fileName}`;
    await file.mv(uploadPath);
    return storePath;
};
async function calculateGstAmount(measurement_id) {
    try {
        const selectQuery = await db.query(`SELECT * FROM measurement_items WHERE measurement_id = ${measurement_id}`);

        let totalGst = 0;

        if (selectQuery.length > 0) {
            for (const row of selectQuery) {
                const select = await db.query(
                    `SELECT * FROM purchase_order_item WHERE purchase_order_id = ${row.po_id} AND order_line_number = ${row.order_line_number}`
                );

                if (select.length > 0) {
                    const quantity = row.quantity; // Get the quantity from the measurement_items table
                    const rate = select[0].rate;
                    const gstPercent = select[0].gst_percent;

                    // Calculate the GST amount for this item
                    const gstAmount = (quantity * rate * gstPercent) / 100;
                    totalGst += gstAmount;
                }
            }
        }

        return totalGst;
    } catch (error) {
        console.error("Error calculating GST amount:", error);
        throw error;
    }
}

const uploadAndValidateData = async (file, validationSchema, calculateAdditionalFields) => {
    try {
        // Upload file
        const filePath = await uploadFile("importData", file);
        const completePath = path.join(process.cwd(), "public", filePath);

        // Read and parse Excel file
        const workbook = xlsx.readFile(completePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);

        let errorMessage = [];
        let validData = [];

        // Validate each row
        for (let i = 0; i < rows.length; i++) {
            const item = rows[i];

            // Calculate additional fields dynamically
            const additionalFields = calculateAdditionalFields ? calculateAdditionalFields(item) : {};
            Object.assign(item, additionalFields);

            // Validate item
            const { error } = validationSchema.validate(item);
            if (error) {
                const errMsg = error.message.replace(/"(.*?)"/g, "$1");
                errorMessage.push(`${errMsg} in the ${i + 1} record`);
            } else {
                validData.push(item);
            }
        }

        return {
            status: errorMessage.length === 0,
            data: validData,
            errorMessage,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const performRecordChecks = async (rows, table, key) => {
    for (let i = 0; i < rows.length; i++) {
        const roExists = await getRecord("users", "id", item.manager_id, process.env.MANAGER_ROLE_ID);
        if (roExists.length == 0) {
            errorMessage.push(`${item.manager_id} is not valid manager id in the ${i + 1} record`);
        }
    }

    return errorMessage;
};

const getRecordWithConditions = async (table, conditions) => {
    try {
        let query = `SELECT * FROM ?? WHERE `;
        const values = [table];
        const conditionClauses = [];
        for (const [key, value] of Object.entries(conditions)) {
            conditionClauses.push(`?? = ?`);
            values.push(key, value);
        }

        query += conditionClauses.join(" AND ");
        console.log('query: ', query);
        const result = await db.query(query, values);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

async function generateCompanyUniqueId() {
    const query = `SELECT unique_id FROM companies ORDER BY company_id DESC LIMIT 1`;
    const uniqueIdResult = await db.query(query);

    if (uniqueIdResult.length > 0) {
        const lastUniqueId = uniqueIdResult[0].unique_id;
        const lastNumber = parseInt(lastUniqueId?.split("_")[1]);

        const newNumber = lastNumber + 1;
        return `OC_${newNumber}`;
    } else {
        return "OC_1";
    }
}

const addCreatedByCondition = (query, data) => {
    const { table, created_by, role } = data;

    if (
        role == process.env.SUPER_ADMIN_ROLE_ID ||
        (role == process.env.ENERGY_COMPANY_ROLE_ID && table === "tutorials")
    ) {
        return query;
    }

    // Function to add condition to the appropriate query segment (main or subquery)
    const addConditionToSegment = (segment, table) => {
        // Regex to match 'FROM' or 'JOIN' clauses and extract the table name
        const fromRegex = /\b(FROM|JOIN)\s+([a-zA-Z0-9_]+)(\s+[a-zA-Z0-9_]+)?/g;
        let match;

        // Flag to determine if the main table is involved in this segment
        let isTableInvolved = false;

        // Search for all table names in the segment (FROM and JOIN clauses)
        while ((match = fromRegex.exec(segment)) !== null) {
            const tableName = match[2]; // Extract the table name after 'FROM' or 'JOIN'

            // Check for exact table match (case-sensitive) to avoid partial matches
            if (tableName === table) {
                isTableInvolved = true;
                break; // Exit loop as soon as the main table is found
            }
        }

        // If the table is involved, proceed to add the condition
        if (isTableInvolved) {
            const whereIndex = segment.indexOf("WHERE");
            const orderByIndex = segment.indexOf("ORDER BY");

            // Case 1: WHERE clause exists
            if (whereIndex !== -1) {
                const beforeWhere = segment.slice(0, whereIndex + 5); // includes "WHERE"
                const afterWhere = segment.slice(whereIndex + 5);
                return `${beforeWhere} ${table}.created_by = '${created_by}' AND ${afterWhere}`;
            }

            // Case 2: ORDER BY exists but no WHERE clause
            if (orderByIndex !== -1) {
                const beforeOrderBy = segment.slice(0, orderByIndex);
                const afterOrderBy = segment.slice(orderByIndex);
                return `${beforeOrderBy} WHERE ${table}.created_by = '${created_by}' ${afterOrderBy}`;
            }

            // Case 3: Neither WHERE nor ORDER BY exists
            return `${segment} WHERE ${table}.created_by = '${created_by}'`;
        }

        return segment; // Return unmodified if no matching table
    };

    // Regular expression to match subqueries within parentheses
    const subqueryRegex = /\(([^()]+)\)/g;
    let match;
    let modifiedQuery = query;

    // Iterate through each subquery and modify only if it involves the main table
    while ((match = subqueryRegex.exec(query)) !== null) {
        const subquery = match[1]; // Extract the subquery inside parentheses
        const modifiedSubquery = addConditionToSegment(subquery, table);

        // Replace subquery with modified version, if any changes were made
        modifiedQuery = modifiedQuery.replace(subquery, modifiedSubquery);
    }

    // Modify the main query (outside subqueries)
    modifiedQuery = addConditionToSegment(modifiedQuery, table);

    return modifiedQuery;
};

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, Try again `;
        err = new ErrorHandler(httpStatus.UNAUTHORIZED, message);
    }

    // JWT EXPIRE ERROR
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired, Try again `;
        err = new ErrorHandler(httpStatus.UNAUTHORIZED, message);
    }
    logger.error("Error:", { message: err.message, stack: err.stack });
    return res.status(err.statusCode).json({
        status: false,
        message: err.message,
    });
};

const PERMISSIONS = {
    CREATE: "created",
    VIEW: "viewed",
    UPDATE: "updated",
    DELETE: "deleted",
};

const fetchStates = async () => {
    const selectQuery = `SELECT * FROM states WHERE country_id = '101'`;
    const result = await db.query(selectQuery);
    if (result.length > process.env.VALUE_ZERO) {
        return result;
    } else {
        return [];
    }
};
const fetchCities = async () => {
    const selectQuery = `SELECT * FROM cities`;
    const result = await db.query(selectQuery);
    if (result.length > process.env.VALUE_ZERO) {
        return result;
    } else {
        return [];
    }
};

const fetchCitiesBasedOnState = async (stateId) => {
    const selectQuery = `SELECT * FROM cities WHERE state_id = '${stateId}'`;
    const result = await db.query(selectQuery);
    if (result.length > process.env.VALUE_ZERO) {
        return result;
    } else {
        return [];
    }
};

const fetchFormatById = async (id, table) => {
    const format_id = id || "";
    const table_name = table || "";
    if (format_id == "") {
        throw new Error("Please provide format id");
    }
    if (table_name == "") {
        throw new Error("Please provide table name");
    }
    const selectQuery = `SELECT * FROM ${table_name} WHERE id = '${id}' AND is_deleted = '0'`;
    const result = await db.query(selectQuery);
    if (result.length > process.env.VALUE_ZERO) {
        return result;
    } else {
        return [];
    }
};

const getAllClientAndVendorCompanies = async (req, res, next) => {
    try {
        let selectQuery = `SELECT company_id, company_name FROM companies WHERE is_superadmin_company = "0" AND company_type IN ("1", "2") AND is_deleted = "0"`;
        selectQuery = addCreatedByCondition(selectQuery, {
            table: "companies",
            created_by: req.user.user_id,
            role: req.user.user_type,
        });
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetch successfully",
                data: queryResult,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return next(error);
    }
};

async function generateItemMasterId(type) {
    try {
        let firstPart = "";
        let secondPart = "";

        if (!type) {
            console.log("Please provide item master type");
            throw new Error("Something went wrong");
        }

        // Fetch the employee number format from the database
        const formatData = await db.query(
            `SELECT sample_format FROM item_no_format WHERE status = '1' AND is_deleted = '0' AND type = '${type}'`
        );

        const randomNumber = await generateRandomNumber(10);
        const format = formatData[0]?.sample_format || `${randomNumber}`;

        // Ensure proper replacement of the numeric part
        const defaultPanelId = format.replace(/^(([^/-]+[/-][^/-]+[/-]))\d+$/, "$10001");

        // Properly split into `firstPart` and `secondPart`
        const lastSeparatorIndex = Math.max(defaultPanelId.lastIndexOf("/"), defaultPanelId.lastIndexOf("-"));
        firstPart = defaultPanelId.slice(0, lastSeparatorIndex + 1); // Include the last separator
        secondPart = defaultPanelId.slice(lastSeparatorIndex + 1); // Everything after the last separator

        // Query the latest employee ID with the same prefix
        const itemData = await db.query(
            `SELECT unique_id FROM item_masters WHERE unique_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
        );
        if (itemData.length > 0) {
            const unique_id = itemData[0].unique_id;
            const itemSecondPart = unique_id.slice(-4); // Extract the last 4 digits of the existing ID
            const itemFirstPart = unique_id.slice(0, -4); // Extract the prefix
            return itemFirstPart + String(parseInt(itemSecondPart) + 1).padStart(4, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
        }
    } catch (error) {
        throw error;
    }
}

// Client and Vendor No. format
async function generateClientVendorId(type, createdBy) {
    try {
        let firstPart = "";
        let secondPart = "";

        if (!type || !createdBy) {
            console.log("Please provide company type and company created By");
            throw new Error("Something went wrong");
        }

        // Fetch the employee number format from the database
        const formatData = await db.query(
            `SELECT sample_format FROM client_vendor_no_format WHERE status = '1' AND is_deleted = '0' AND type = '${type}' AND created_by = '${createdBy}'`
        );

        // formatData[0].sample_format = ""
        const randomNumber = await generateRandomNumber(10);
        const format = formatData[0]?.sample_format || `${randomNumber}`;

        // Ensure proper replacement of the numeric part
        const defaultPanelId = format.replace(/^(([^/-]+[/-][^/-]+[/-]))\d+$/, "$10001");

        // Properly split into `firstPart` and `secondPart`
        const lastSeparatorIndex = Math.max(defaultPanelId.lastIndexOf("/"), defaultPanelId.lastIndexOf("-"));
        firstPart = defaultPanelId.slice(0, lastSeparatorIndex + 1); // Include the last separator
        console.log('firstPart: ', firstPart);
        secondPart = defaultPanelId.slice(lastSeparatorIndex + 1); // Everything after the last separator

        // Query the latest ID with the same prefix
        let companyData;
        // if type is supplier
        if (type == 4) {
            companyData = await db.query(
                `SELECT supplier_code FROM suppliers WHERE supplier_code LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
            );
        } else {
            companyData = await db.query(
                `SELECT company_unique_id FROM companies WHERE company_unique_id LIKE '%${firstPart}%' AND is_deleted = '0' ORDER BY company_id DESC LIMIT 1`
            );
        }

        if (companyData.length > 0) {
            const unique_id = companyData[0]?.company_unique_id || companyData[0]?.supplier_code;
            const itemSecondPart = unique_id.slice(-4); // Extract the last 4 digits of the existing ID
            const itemFirstPart = unique_id.slice(0, -4); // Extract the prefix
            console.log('itemFirstPart: ', itemFirstPart);
            return itemFirstPart + String(parseInt(itemSecondPart) + 1).padStart(4, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
        }
    } catch (error) {
        throw error;
    }
}

async function generateEmployeeId(type, createdBy) {
    try {
        let firstPart = "";
        let secondPart = "";

        if (!type) {
            console.log("Please provide employee type");
            throw new Error("Something went wrong");
        }

        const employee_type = [
            { id: 1, name: "admins" },
            { id: 2, name: "users" },
        ];
        let table;
        employee_type.forEach((item) => {
            if (item.id == type) {
                table = item.name;
            } else if (item.id == type) {
                table = item.name;
            }
        });

        // Fetch the employee number format from the database
        const formatData = await db.query(
            `SELECT sample_format FROM employee_no_format WHERE status = '1' AND is_deleted = '0' AND created_by = '${createdBy}'`
        );

        // formatData[0].sample_format = ""
        const randomNumber = await generateRandomNumber(10);
        const format = formatData[0]?.sample_format || `${randomNumber}`;

        // Ensure proper replacement of the numeric part
        const defaultPanelId = format.replace(/^(([^/-]+[/-][^/-]+[/-]))\d+$/, "$10001");

        // Properly split into `firstPart` and `secondPart`
        const lastSeparatorIndex = Math.max(defaultPanelId.lastIndexOf("/"), defaultPanelId.lastIndexOf("-"));
        firstPart = defaultPanelId.slice(0, lastSeparatorIndex + 1); // Include the last separator
        secondPart = defaultPanelId.slice(lastSeparatorIndex + 1); // Everything after the last separator

        // Query the latest ID with the same prefix
        let employeeData = await db.query(
            `SELECT employee_id FROM ${table} WHERE employee_id LIKE '%${firstPart}%' AND is_deleted = '0' ORDER BY id DESC LIMIT 1`
        );

        if (employeeData.length > 0) {
            const unique_id = employeeData[0].employee_id;
            const itemSecondPart = unique_id.slice(-4); // Extract the last 4 digits of the existing ID
            const itemFirstPart = unique_id.slice(0, -4); // Extract the prefix
            return itemFirstPart + String(parseInt(itemSecondPart) + 1).padStart(4, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
        }
    } catch (error) {
        throw error;
    }
}

async function generateInvoiceId(createdBy) {
    try {
        let firstPart = "";
        let secondPart = "";

        // Fetch the employee number format from the database
        const formatData = await db.query(
            `SELECT sample_format FROM invoice_no_format WHERE status = '1' AND is_deleted = '0' AND created_by = '${createdBy}'`
        );

        // formatData[0].sample_format = ""
        const randomNumber = await generateRandomNumber(10);
        const format = formatData[0]?.sample_format || `${randomNumber}`;

        // Ensure proper replacement of the numeric part
        const defaultPanelId = format.replace(/^(([^/-]+[/-][^/-]+[/-]))\d+$/, "$10001") || "";
        console.log("After replacement:", defaultPanelId);

        if (!defaultPanelId) {
            console.error("defaultPanelId is undefined or empty. Check the input format.");
            return;
        }

        // Properly split into `firstPart` and `secondPart`
        const lastSeparatorIndex = Math.max(defaultPanelId.lastIndexOf("/"), defaultPanelId.lastIndexOf("-"));
        if (lastSeparatorIndex === -1) {
            console.error("No valid separator found in defaultPanelId.");
            return;
        }
        firstPart = defaultPanelId.slice(0, lastSeparatorIndex + 1); // Include the last separator
        secondPart = defaultPanelId.slice(lastSeparatorIndex + 1); // Everything after the last separator

        // console.log("First part:", firstPart);
        // console.log("Second part:", secondPart);

        // Query the latest employee ID with the same prefix
        const itemData = await db.query(
            `SELECT invoice_no FROM invoices WHERE invoice_no LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`
        );
        if (itemData.length > 0) {
            const unique_id = itemData[0].unique_id;
            const itemSecondPart = unique_id.slice(-4); // Extract the last 4 digits of the existing ID
            const itemFirstPart = unique_id.slice(0, -4); // Extract the prefix
            return itemFirstPart + String(parseInt(itemSecondPart) + 1).padStart(4, "0");
        } else {
            return firstPart + String(parseInt(secondPart) + 1).padStart(4, "0");
        }
    } catch (error) {
        throw error;
    }
}

const insertLoanEmis = async (loan_id, user_id, emi, payment_date, loan_term, createdBy, createdAt) => {
    try {
        // Validation: Check for required fields
        if (!loan_id || !user_id || !emi || !payment_date || !loan_term || !createdBy || !createdAt) {
            throw new Error("Missing required fields for EMI insertion.");
        }

        // Ensure loan_term is a positive integer
        loan_term = parseInt(loan_term);
        if (!Number.isInteger(loan_term) || loan_term <= 0) {
            throw new Error("Loan term must be a positive integer.");
        }

        // Start with the initial payment date
        let emiDate = new Date(payment_date);

        // Validate initial date
        if (isNaN(emiDate)) {
            throw new Error("Invalid payment date format.");
        }

        // Loop through the loan term to generate EMI entries
        for (let i = 0; i < loan_term; i++) {
            // Format the date to a MySQL-compatible format (YYYY-MM-DD)
            const formattedEmiDate = emiDate.toISOString().split("T")[0];

            // Prepare the query for each EMI
            const insertEmiQuery = `
                INSERT INTO loan_emis (loan_id, user_id, amount, emi_date, status, created_by, created_at) 
                VALUES ('${loan_id}', '${user_id}', '${emi}', '${formattedEmiDate}', 'pending', '${createdBy}', '${createdAt}')
            `;

            // Execute the query
            await db.query(insertEmiQuery);

            // Increment the EMI date by one month
            emiDate.setMonth(emiDate.getMonth() + 1);
        }

        console.log(`${loan_term} EMIs successfully inserted.`);
        return true;
    } catch (error) {
        console.error("Error inserting EMIs:", error.message);
        throw error;
    }
};

const fetchLoanEmis = async (loan_id, user_id) => {
    try {
        // Validation: Check if both loan_id and user_id are provided
        if (!loan_id) {
            throw new Error("Loan ID is required to fetch EMIs.");
        }
        if (!user_id) {
            throw new Error("User ID is required to fetch EMIs.");
        }

        // Prepare the query to fetch EMIs for the given loan_id and user_id
        const fetchEmisQuery = `
            SELECT * FROM loan_emis 
            WHERE loan_id = '${loan_id}' AND user_id = '${user_id}'
            ORDER BY emi_date ASC
        `;

        // Execute the query
        const results = await db.query(fetchEmisQuery);

        // Check if EMIs exist for the given loan_id and user_id
        if (results.length === 0) {
            return [];
        }

        // Return the fetched EMI details
        return results;
    } catch (error) {
        console.error("Error fetching EMIs:", error.message);
        throw error;
    }
};

const updateLoanEmis = async (loan_id, user_id, emi, payment_date, new_loan_term, createdBy, createdAt) => {
    try {
        // Validation: Check if all required parameters are provided
        if (!loan_id || !user_id || !emi || !payment_date || !new_loan_term || !createdBy || !createdAt) {
            throw new Error("Missing required fields for updating loan EMIs.");
        }

        new_loan_term = parseInt(new_loan_term);
        if (!Number.isInteger(new_loan_term) || new_loan_term <= 0) {
            throw new Error("Loan term must be a positive integer.");
        }

        // Delete existing EMIs for the loan
        const deleteEmisQuery = `
            DELETE FROM loan_emis 
            WHERE loan_id = '${loan_id}' AND user_id = '${user_id}'
        `;
        await db.query(deleteEmisQuery);
        console.log(`Existing EMIs for Loan ID ${loan_id} deleted.`);

        // Insert new EMIs based on the updated loan term
        let emiDate = new Date(payment_date);
        for (let i = 0; i < new_loan_term; i++) {
            const formattedEmiDate = emiDate.toISOString().split("T")[0];
            const insertEmiQuery = `
                INSERT INTO loan_emis (loan_id, user_id, amount, emi_date, status, created_by, created_at) 
                VALUES ('${loan_id}', '${user_id}', '${emi}', '${formattedEmiDate}', 'pending', '${createdBy}', '${createdAt}')
            `;
            await db.query(insertEmiQuery);
            emiDate.setMonth(emiDate.getMonth() + 1);
        }
        console.log(`${new_loan_term} new EMIs inserted.`);

        return true;
    } catch (error) {
        console.error("Error updating loan EMIs:", error.message);
        throw error;
    }
};

const checkUserWithDisabledStatus = async (name, email, aadhar, mobile, id = null) => {
    console.log('name, email, aadhar, mobile, id: ', name, email, aadhar, mobile, id);
    try {
        if (!name && !email && !aadhar && !mobile) {
            throw new Error("Missing required fields for checking user with disabled status.");
        }
        let users_query;
        let admins_query;

        if (id) {
            users_query = `SELECT id, name, email, aadhar, mobile, created_by, status FROM users WHERE (name = ? AND email = ? AND aadhar = ? AND mobile LIKE '%${mobile}%' AND id = '${id}')`;
            admins_query = `SELECT id, name, email, aadhar, contact_no, created_by, status FROM admins WHERE (name = ? AND email = ? AND aadhar = ? AND contact_no LIKE '%${mobile}%' AND id = '${id}')`;
        } else {
            users_query = `SELECT id, name, email, aadhar, mobile, created_by, status FROM users WHERE (name = ? AND email = ? AND aadhar = ? AND mobile LIKE '%${mobile}%')`;
            admins_query = `SELECT id, name, email, aadhar, contact_no, created_by, status FROM admins WHERE (name = ? AND email = ? AND aadhar = ? AND contact_no LIKE '%${mobile}%')`;
        }
        // find in users table
        const user = await db.query(users_query, [name, email, aadhar]);
        if (user.length > 0) {
            return user[0];
        } else {
            // fund in admins table
            const user = await db.query(admins_query, [name, email, aadhar]);
            if (user.length > 0) {
                return user[0];
            } else return false;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    checkUserWithDisabledStatus,
    generateEmployeeId,
    updateLoanEmis,
    insertLoanEmis,
    fetchLoanEmis,
    PERMISSIONS,
    errorMiddleware,
    getCompanyDetailsById,
    getStateById,
    getRegionalOfficeById,
    manageUserWallet,
    generateRandomNumber,
    getUserExpenseDetailById,
    saveTransactionDetails,
    getUserCashRequestDetailById,
    getUserWalletBalance,
    getSupplierAddresses,
    getItemUsedDetailsInComplaint,
    getSubModuleForReports,
    getModuleOfSubModuleForReports,
    isPlural,
    makePlural,
    getUserSalaryDisburseHistory,
    getUserSalaryDueAmount,
    getUserSalaryDisbursedAmount,
    getItemDetailsById,
    measurementDetailsWithPoAndComplaint,
    getMeasurementsItemsById,
    getMeasurementsItemsSubChildById,
    getManagerFreeTeamMember,
    getSuperVisorUsers,
    getAdminSuperVisorUsers,
    checkUserHasNoActiveComplaints,
    todayFoodExpensePunch,
    convertBase64Image,
    getPoUsedAmount,
    getAllGeneratedInvoiceNumberFormat,
    getLastFinancialYearBillNoForPI,
    getLastFinancialYearBillNoForInvoice,
    getItemsDetailsByMeasurementId,
    getProformaInvoiceItemsDetailsById,
    calculatedPercentage,
    getPlanDetailById,
    AllSubModuleOfEnergyCompany,
    checkCompanyGstDefaultMarkOrNot,
    getOutLetUserDetailsByOutletId,
    measurementDetailsWithPoAndComplaints,
    getLastBillNoForMergedPI,
    purchaseOrderItemsOnPoId,
    generatePINumber,
    generateMPINumber,
    generateInvoiceNumber,
    convertFinancialYear,
    supplier_status,
    generateSupplierCode,
    getQuotationItemsById,
    getQuotationItemsSubChildById,
    getExpensePunchAndStockTotalAmounts,
    insertIntoRoWallets,
    getUsedQty,
    // importExcelData,
    getBrandsByItemId,
    uploadFile,
    calculateGstAmount,
    uploadAndValidateData,
    performRecordChecks,
    getRecordWithConditions,
    checkAlreadyExistGst,
    generateCompanyUniqueId,
    addCreatedByCondition,
    fetchStates,
    fetchCities,
    fetchCitiesBasedOnState,
    fetchFormatById,
    getAllClientAndVendorCompanies,
    generateItemMasterId,
    generateClientVendorId,
    generateInvoiceId,
};

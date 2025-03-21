require("dotenv").config();
var moment = require("moment");
const { con, makeDb } = require("../db");
const { promisify } = require("util");
const db = makeDb();
const { checkPositiveInteger, messageValidation } = require("../helpers/validation");
const { StatusCodes } = require("http-status-codes");
const { getRecipientMessages } = require("../helpers/general");

async function fetchUsersData(id) {
    const prefix = id.charAt(0);

    let user_data = "";

    if (prefix === "U") {
        user_data = await db.query(`SELECT unique_id AS id, name, image FROM users WHERE unique_id = ?`, [id]);
    }
    if (prefix === "A") {
        user_data = await db.query(`SELECT unique_id AS id, name, image FROM admins WHERE unique_id = ?`, [id]);
    }
    return user_data.length > 0 ? user_data[0] : null;
}

const sendMessage = async (req, res, next) => {
    try {
        const { sender_id, recipient_id, message_content } = req.body;

        const { error } = messageValidation.validate(req.body);
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        let storePath = null;
        const now = new Date();
        const timestamp = now.getTime();

        if (req.files != null) {
            const image = req.files.attachment;
            const imageName = Date.now() + image.name;
            const uploadPath = process.cwd() + "/public/message_attachments/" + imageName;
            storePath = "/message_attachments/" + imageName;

            image.mv(uploadPath, (error, response) => {
                if (error) return res.status(403).json({ status: false, message: error.message });
            });
        }

        const insertQuery = `INSERT INTO messages(sender_id, recipient_id, message_content, attachment, timestamp) VALUES(?, ?, ?, ?, ?)`;

        const insertValues = [sender_id, recipient_id, message_content, storePath, timestamp];
        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "message send successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Failed! message not sent" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/get-messages
 */
const getMessages = async (req, res, next) => {
    const id = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id || null;

    try {
        // Separate queries for sender_id and recipient_id
        const senderQuery = `SELECT DISTINCT recipient_id as user_id FROM messages WHERE sender_id = '${id}'`;
        const recipientQuery = `SELECT DISTINCT sender_id as sender_id FROM messages WHERE recipient_id = '${id}'`;

        const senderResults = await db.query(senderQuery);
        const recipientResults = await db.query(recipientQuery);

        // Combine and deduplicate the results ensuring no duplicates
        const combinedResultsMap = new Map();

        senderResults.forEach((result) => combinedResultsMap.set(result.user_id, result));
        recipientResults.forEach((result) => combinedResultsMap.set(result.user_id, result));

        const combinedResults = Array.from(combinedResultsMap.values());

        if (combinedResults.length > 0) {
            const values = [];

            for (let index = 0; index < combinedResults.length; index++) {
                let recipient_id = combinedResults[index]?.user_id || null;

                const getMessages = await getRecipientMessages(recipient_id, id); // recipient id

                if (getMessages.length > 0) {
                    let getSenderDetails = await fetchUsersData(getMessages[0]?.recipient_id);
                    let getReceiverDetails = await fetchUsersData(getMessages[0]?.sender_id);

                    if (getSenderDetails === null) {
                        getSenderDetails = {}; // Initialize as an empty object
                        getSenderDetails.id = getMessages[0]?.recipient_id || null;
                    }
                    if (getReceiverDetails === null) {
                        getReceiverDetails = {}; // Initialize as an empty object
                        getReceiverDetails.id = getMessages[0]?.sender_id || null;
                    }
                    

                    values.push({
                        message_id: getMessages[0].message_id,
                        sender_id: getMessages[0].sender_id,
                        recipient_id: getMessages[0].recipient_id,
                        message_content: getMessages[0].message_content,
                        attachment: getMessages[0].attachment,
                        is_read: getMessages[0].is_read,
                        timestamp: getMessages[0].timestamp,
                        total_unread: getMessages[0].total_unread,
                        sender_details: {
                            id: getSenderDetails?.id || null,
                            name: getSenderDetails?.name || null,
                            image: getSenderDetails?.image || null,
                        },
                        receiver_details: {
                            id: getReceiverDetails?.id || null,
                            name: getReceiverDetails?.name || null,
                            image: getReceiverDetails?.image || null,
                        },
                    });
                }
            }
            values.sort((a, b) => b.message_id - a.message_id);

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

/**
 * API - /contractor/get-single-sender-messages/:id
 */
const getSenderAllMessages = async (req, res, next) => {
    try {
        const sender_id = req.params.id;
        const recipient_id = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id;

        if (sender_id == "null") {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Id is required" });
        }
        if (sender_id === recipient_id)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Sender and Receiver cannot be same",
            });

        if (!sender_id || !recipient_id)
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Id is required" });

        const pageSize = parseInt(req.query.pageSize) || 30;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(*) as total FROM messages WHERE (sender_id = '${sender_id}' AND recipient_id = '${recipient_id}') OR (sender_id = '${recipient_id}' AND recipient_id = '${sender_id}') ORDER BY timestamp DESC`;

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const queryParams = [pageFirstResult, pageSize];

        const selectQuery = `
        SELECT * FROM messages 
        WHERE (sender_id = '${sender_id}' AND recipient_id = '${recipient_id}') OR (sender_id = '${recipient_id}' AND recipient_id = '${sender_id}') 
        ORDER BY timestamp ASC LIMIT ?, ?
        `;

        const queryResult = await db.query(selectQuery, queryParams);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });

            var values = [];
            const loggedUserId = recipient_id;

            for (const row of queryResult) {
                const getSenderDetails = await fetchUsersData(loggedUserId);
                const getRecipientDetails = await fetchUsersData(sender_id);

                values.push({
                    message_id: row.message_id,
                    sender_id: row.sender_id,
                    recipient_id: row.recipient_id,
                    message_content: row.message_content,
                    attachment: row.attachment,
                    is_read: row.is_read,
                    timestamp: row.timestamp,
                    total_unread: row.total_unread,
                    sender_details: {
                        id: getSenderDetails?.id || null,
                        name: getSenderDetails?.name || null,
                        image: getSenderDetails?.image || null,
                    },
                    recipient_details: {
                        id: getRecipientDetails?.id || null,
                        name: getRecipientDetails?.name || null,
                        image: getRecipientDetails?.image || null,
                    },
                });
            }
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: values,
                pageDetails: pageDetails[0],
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/add-new-user-to-chat
 */
const addNewUserToChat = async (req, res, next) => {
    try {
        const selectQuery = `
            SELECT unique_id AS id, name, email, image, user_type FROM users
            UNION
            SELECT unique_id AS id, name, email, image, user_type FROM admins
            `;

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/start-chat-to-new-user/{id}
 */
const startChatWithNewUser = async (req, res, next) => {
    try {
        const recipientId = req.params.id;
        const recipient_name = req.query.name;

        if (!recipientId)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Please provide recipient id",
            });

        const insertQuery = `INSERT INTO messages (sender_id, recipient_id, message_content, timestamp) VALUES (?, ?, ?, ?)`;

        const senderId = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id || null;
        // console.log('req.user.user_data: ', req.user.user_data);
        const timestamp = Date.now();

        if (!senderId) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Please provide sender id" });
        }

        if (senderId === recipientId) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "You can't chat with yourself" });
        }

        const selectQuery = `
            SELECT * 
            FROM messages
            WHERE (sender_id = '${senderId}' AND recipient_id = '${recipientId}') 
            OR (sender_id = '${recipientId}' AND recipient_id = '${senderId}') 
        `;
        const alreadyExistingChat = await db.query(selectQuery);

        if (alreadyExistingChat.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Chat already exists" });
        }

        // Insert the original message
        const queryResult = await db.query(insertQuery, [senderId, recipientId, "hello", timestamp]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // Insert the opposite message (roles swapped)
            const oppositeQueryResult = await db.query(insertQuery, [recipientId, senderId, "hello", timestamp]);

            if (oppositeQueryResult.affectedRows > process.env.VALUE_ZERO) {
                res.status(StatusCodes.OK).json({
                    status: true,
                    message: "User added for chat successfully, and opposite data inserted",
                });
            } else {
                res.status(StatusCodes.FORBIDDEN).json({
                    status: false,
                    message: "Error! Opposite data not added for chat",
                });
            }
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! User not added for chat" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/get-total-unread-messages
 */
const getTotalUnreadMessages = async (req, res, next) => {
    try {
        const id = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id;

        const selectQuery = `SELECT COUNT(*) as total FROM messages WHERE recipient_id = ? AND is_read = ?`;
        const queryResult = await db.query(selectQuery, [id, process.env.VALUE_ZERO]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        } else {
            res.status(StatusCodes.OK).json({ status: true, message: "Data not found" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/mark-all-messages-read
 */
const markAllMessagesRead = async (req, res, next) => {
    try {
        const id = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id;
        const now = new Date();
        const timestamp = now.getTime();

        if (!id) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Please provide id" });

        const updateQuery = `UPDATE messages SET is_read = ?, read_at = ? WHERE recipient_id = ?`;
        const queryResult = await db.query(updateQuery, [process.env.VALUE_ONE, timestamp, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "messages read successfully" });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Messages read failed" });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * API - /contractor/sender-messages-mark-read/:id
 */
const markReadSenderAllMessages = async (req, res, next) => {
    try {
        const sender_id = req.params.id;
        const recipient_id = req.user.user_data[0]?.unique_id || req.user.user_data?.unique_id;

        const now = new Date();
        const timestamp = now.getTime();

        if (!sender_id)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Please provide sender_id",
            });

        const updateQuery = `UPDATE messages SET is_read = ?, read_at = ? WHERE sender_id = ? AND recipient_id = ?`;
        const queryResult = await db.query(updateQuery, [process.env.VALUE_ONE, timestamp, sender_id, recipient_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Messages read successfully" });
        } else {
            res.status(StatusCodes.OK).json({ status: true, message: "Nothing to read." });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getSenderAllMessages,
    addNewUserToChat,
    getTotalUnreadMessages,
    markAllMessagesRead,
    markReadSenderAllMessages,
    startChatWithNewUser,
};

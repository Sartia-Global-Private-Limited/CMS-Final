const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { con } = require("./db");
const Router = require("./routes");
const contractorRouter = require("./contractorRoutes");
const dealerRouter = require("./dealerRoutes");
const useragent = require("express-useragent");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;
const { saveMessages, getUserDetails } = require("./helpers/general");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swaggerConfig.js");
const { routeNotFoundLogger } = require("./helpers/logger.js");
const { errorMiddleware } = require("./helpers/commonHelper.js");
const energyCompanyRouter = require("./energyCompanyRoutes.js");
const { cronJob } = require("./helpers/cron.js");

cronJob(); // Execute cronjobs at start of app

const app = express();
//socket events
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.json({ limit: "2000mb" }));  // Allowed 2000MB payload in request
app.use(fileUpload());
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.static(path.resolve("./public"))); // to serve static files into the frontend

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/swagger-json", (req, res, next) => {
    res.json(swaggerSpec);
});

const socketIds = [];

//socket connection and events
io.on("connection", async (socket) => {
    console.log("\nNew client connected, socket id:", socket.id);
    // io.emit("chat", `*User connected* -> ${socket.id}`);

    // Listen for user disconnection event
    socket.on("disconnect", () => {
        console.log("User disconnected, socket id:", socket.id);
        // io.emit("chat", `*User disconnected* -> ${socket.id}`);
    });

    // Listen for new user registration
    socket.on("newUser", async (user_id) => {
        // console.log("user_id: ", user_id);
        if (typeof user_id.user_id !== "string") return;
        const ids = {
            user_id: user_id.user_id,
            socket_id: socket.id,
        };

        const existingSocketIndex = socketIds.findIndex((s) => s.user_id == user_id.user_id);
        console.log("existingSocketIndex in user_id chat:", existingSocketIndex);

        if (existingSocketIndex > -1) {
            // Update socket_id if user already exists in array
            socketIds[existingSocketIndex].socket_id = socket.id;
        } else {
            // Add new user to the array
            socketIds.push(ids);
        }
    });

    // Listen for chat messages
    socket.on("chat", async (data) => {
        try {
            // Find receiver's socket ID
            const existingSocketIndex = socketIds.findIndex((s) => s.user_id == data.receiverId);
            console.log("existingSocketIndex: ", existingSocketIndex);

            // if (existingSocketIndex > -1) {
            //     const receiverSocketId = socketIds[existingSocketIndex].socket_id;

            //     // Ensure the message is successfully saved before sending it
            //     try {
            //         const saveMessage = await saveMessages(data);

            //         if (saveMessage) {
            //             io.to(receiverSocketId).emit("chat", data.message);
            //             io.to(receiverSocketId).emit("message_recieved", data.message);
            //         } else {
            //             console.log("Failed to save message");
            //         }
            //     } catch (error) {
            //         console.error("Error saving message:", error.message);
            //     }
            // } else {
            //     console.log(`Receiver with ID ${data.receiverId} not found`);
            // }
            const receiverSocketId = socketIds[existingSocketIndex]?.socket_id;
            console.log('receiverSocketId: ', receiverSocketId);

            // Ensure the message is successfully saved before sending it
            const saveMessage = await saveMessages(data);

            if (saveMessage && existingSocketIndex != -1) {
                io.to(receiverSocketId).emit("chat", data.message);
                io.to(receiverSocketId).emit("message_recieved", data.message);
            } else {
                console.log("Failed to save message");
            }
        } catch (error) {
            console.log("error: ", error);
        }
    });
});

app.use(useragent.express());

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
app.get("/", function (request, response, next) {
    try {
        response.send("welcome");
    } catch (error) {
        return next(error);
    }
});

app.use("/api", Router);
app.use("/api", contractorRouter);
app.use("/api", dealerRouter);
app.use("/api", energyCompanyRouter);
app.use("/api", require("./routes/index"));

app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.status = 404;

    routeNotFoundLogger.warn({
        message: error.message,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    res.status(error.status).json({
        status: false,
        message: error.message,
    });
});

app.use(errorMiddleware);

server.listen(port, function () {
    console.log("Started application on port %d", port);
});

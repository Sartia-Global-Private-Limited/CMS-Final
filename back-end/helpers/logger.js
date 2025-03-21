const winston = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

// Create a winston logger instance
const logger = winston.createLogger({
    level: "error",
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}\nStack: ${stack}\n`;
        })
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(process.cwd(), "public/logs/error-%DATE%.log"), // Rotates the log file based on date
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "7d",
            level: "error",
        }),
    ],
    // transports: [
    //     new winston.transports.File({ filename: path.join(process.cwd(), "public/logs/error.log"), level: "error" }),
    //     // new winston.transports.Console({ format: winston.format.simple() }),
    // ],
});

const routeNotFoundLogger = winston.createLogger({
    level: "warn",
    format: winston.format.combine(winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: path.join(process.cwd(), "public/logs/route_not_found.log") }),
    ],
});

module.exports = { logger, routeNotFoundLogger };

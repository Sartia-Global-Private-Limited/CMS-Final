const swaggerJSDoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CMS API Documentation",
            version: "1.0.0",
            description: "API documentation for CMS Electricals using Swagger",
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
                description: "Development server",
            },
        ],
    },
    apis: [
            "./contractorRoutes.js", 
            "./dealerRoutes.js", 
            "./routes.js"
        ],      // Use the array of file paths
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };

import app from "./app.js";
import pool from "./config/database.js";
import logger from "./config/logger.js";
import config from "./config/app-config.js";

const PORT = config.port || 1234;

(async () => {
    try {
        await pool.query("SELECT 1");
        logger.info("Database connected");

        const server = app.listen(PORT, () => {
            const serverInfo = [
                "\n" + "=".repeat(50),
                "🚀  SERVER STARTED SUCCESSFULLY",
                "=".repeat(50),
                `📦 Environment:     ${config.nodeEnv.toUpperCase()}`,
                `🌐 Port:            ${PORT}`,
                `🔗 API Prefix:      ${config.apiPrefix}`,
                `📌 API Version:     ${config.apiVersion}`,
                `🌍 Client URL:      ${config.clientUrl}`,
                `📡 API Endpoint:    http://localhost:${PORT}${config.apiPrefix}/${config.apiVersion}`,
                "=".repeat(50) + "\n",
            ].join("\n");

            logger.info(serverInfo);
        });

        const gracefulShutdown = (signal) => {
            logger.info(`Received ${signal}, shutting down gracefully...`);

            server.close(() => {
                logger.info("HTTP server closed");
                pool.end()
                    .then(() => {
                        logger.info("Database pool closed");
                        process.exit(0);
                    })
                    .catch(() => process.exit(1));
            });

            setTimeout(() => {
                logger.warn("Forcing shutdown after timeout");
                process.exit(1);
            }, 10000);
        };

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
})();

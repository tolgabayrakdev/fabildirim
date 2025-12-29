import app from "./app.js";
import pool from "./config/database.js";
import logger from "./config/logger.js";
import config from "./config/app-config.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("Database connected");

    const server = app.listen(config.port, () => {
      const serverInfo = [
        "\n" + "=".repeat(50),
        "🚀  SERVER STARTED SUCCESSFULLY",
        "=".repeat(50),
        `📦 Environment:     ${config.nodeEnv.toUpperCase()}`,
        `🌐 Port:            ${config.port}`,
        `🔗 API Prefix:      ${config.apiPrefix}`,
        `📌 API Version:     ${config.apiVersion}`,
        `🌍 Client URL:      ${config.clientUrl}`,
        `📡 API Endpoint:    http://localhost:${config.port}${config.apiPrefix}/${config.apiVersion}`,
        "=".repeat(50) + "\n"
      ].join("\n");
      
      logger.info(serverInfo);
      logger.info(`Server running on port ${config.port}`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(() => {
        logger.info("HTTP server closed");
        pool.end(() => {
          logger.info("Database pool closed");
          process.exit(0);
        });
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
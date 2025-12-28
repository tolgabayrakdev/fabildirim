import app from "./app.js";
import pool from "./config/database.js";
import logger from "./config/logger.js";
import config from "./config/app-config.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("Database connected");

    const server = app.listen(config.port, () => {
      console.log("\n" + "=".repeat(50));
      console.log("🚀  SERVER STARTED SUCCESSFULLY");
      console.log("=".repeat(50));
      console.log(`📦 Environment:     ${config.nodeEnv.toUpperCase()}`);
      console.log(`🌐 Port:            ${config.port}`);
      console.log(`🔗 API Prefix:      ${config.apiPrefix}`);
      console.log(`📌 API Version:     ${config.apiVersion}`);
      console.log(`🌍 Client URL:      ${config.clientUrl}`);
      console.log(`📡 API Endpoint:    http://localhost:${config.port}${config.apiPrefix}/${config.apiVersion}`);
      console.log("=".repeat(50) + "\n");
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
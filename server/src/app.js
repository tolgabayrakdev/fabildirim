import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import config from "./config/app-config.js";
import logger from "./config/logger.js";
import errorHandler from "./middleware/error-handler.js";
import { generalRateLimiter } from "./middleware/rate-limiter.js";

// api routes imports
import authRoutes from "./routes/auth-routes.js";
import subscriptionRoutes from "./routes/subscription-routes.js";
import contactRoutes from "./routes/contact-routes.js";
import debtTransactionRoutes from "./routes/debt-transaction-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import dashboardRoutes from "./routes/dashboard-routes.js";
import activityLogRoutes from "./routes/activity-log-routes.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: config.clientUrl,
        credentials: true,
    })
);

// Morgan HTTP request logger - winston ile entegre
const morganFormat = config.nodeEnv === "production" ? "combined" : "dev";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.json({
        message: "Nazpara API",
        version: "1.0.0",
    });
});

// Genel API rate limiter - tüm API route'ları için geçerli
app.use(`${config.apiPrefix}`, generalRateLimiter);

//api routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/subscriptions`, subscriptionRoutes);
app.use(`${config.apiPrefix}/contacts`, contactRoutes);
app.use(`${config.apiPrefix}/debt-transactions`, debtTransactionRoutes);
app.use(`${config.apiPrefix}/payments`, paymentRoutes);
app.use(`${config.apiPrefix}/dashboard`, dashboardRoutes);
app.use(`${config.apiPrefix}/activity-logs`, activityLogRoutes);

app.use(errorHandler);

export default app;

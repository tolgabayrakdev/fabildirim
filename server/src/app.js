import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config/app-config.js";
import logger from "./config/logger.js";
import errorHandler from "./middleware/error-handler.js";

// api routes imports
import authRoutes from "./routes/auth-routes.js";

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

app.get("/", (_req, res) => {
    res.json({
        message: "FaBildirim API",
        version: "1.0.0",
    });
});

//api routes
app.use(`${config.apiPrefix}/auth`, authRoutes);

app.use(errorHandler);

export default app;

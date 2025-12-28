import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config/app-config.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get("/", (_req, res) => {
  res.json({
    message: 'FaBildirim API',
    version: '1.0.0'
  });
});

app.use(errorHandler);

export default app;
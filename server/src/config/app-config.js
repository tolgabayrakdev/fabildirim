import dotenv from "dotenv";

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "1234", 10),
  apiPrefix: "/api",
  apiVersion: "v1",
  clientUrl: "http://localhost:3000",
};
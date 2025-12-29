import dotenv from "dotenv";

dotenv.config();

export default {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "1234", 10),
    apiPrefix: "/api",
    clientUrl: "http://localhost:5173",
};

import express from "express";
import AuthController from "../controller/auth-controller.js";

const router = express.Router();
const authController = new AuthController();


router.post("/register", authController.signUp.bind(authController));




export default router;
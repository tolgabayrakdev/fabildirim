import express from "express";
import AuthController from "../controller/auth-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import { signUpSchema, signInSchema } from "../schema/auth-schema.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register", schemaValidation(signUpSchema), authController.signUp.bind(authController));
router.post("/login", schemaValidation(signInSchema), authController.signIn.bind(authController));
router.post("/logout", authController.signOut.bind(authController));

export default router;
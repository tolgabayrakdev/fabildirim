import express from "express";
import AuthController from "../controller/auth-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import {
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    verifyResetTokenSchema,
    resetPasswordSchema,
    verifyEmailOtpSchema,
    verifySmsOtpSchema,
    resendEmailVerificationSchema,
    resendSmsVerificationSchema,
} from "../schema/auth-schema.js";

const router = express.Router();
const authController = new AuthController();

router.post(
    "/register",
    schemaValidation(signUpSchema),
    authController.signUp.bind(authController)
);
router.post("/login", schemaValidation(signInSchema), authController.signIn.bind(authController));
router.post("/logout", authController.signOut.bind(authController));
router.post(
    "/forgot-password",
    schemaValidation(forgotPasswordSchema),
    authController.forgotPassword.bind(authController)
);
router.post(
    "/verify-reset-token",
    schemaValidation(verifyResetTokenSchema),
    authController.verifyResetToken.bind(authController)
);
router.post(
    "/reset-password",
    schemaValidation(resetPasswordSchema),
    authController.resetPassword.bind(authController)
);
router.post(
    "/verify-email-otp",
    schemaValidation(verifyEmailOtpSchema),
    authController.verifyEmailOtp.bind(authController)
);
router.post(
    "/verify-sms-otp",
    schemaValidation(verifySmsOtpSchema),
    authController.verifySmsOtp.bind(authController)
);
router.post(
    "/resend-email-verification",
    schemaValidation(resendEmailVerificationSchema),
    authController.resendEmailVerification.bind(authController)
);
router.post(
    "/resend-sms-verification",
    schemaValidation(resendSmsVerificationSchema),
    authController.resendSmsVerification.bind(authController)
);

export default router;

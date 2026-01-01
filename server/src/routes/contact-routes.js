import express from "express";
import ContactController from "../controller/contact-controller.js";
import { schemaValidation } from "../middleware/schema-validation.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import { createContactSchema, updateContactSchema } from "../schema/contact-schema.js";

const router = express.Router();
const contactController = new ContactController();

router.get("/", verifyToken, contactController.getAllContacts.bind(contactController));
router.get("/:id", verifyToken, contactController.getContactById.bind(contactController));
router.post(
    "/",
    verifyToken,
    schemaValidation(createContactSchema),
    contactController.createContact.bind(contactController)
);
router.put(
    "/:id",
    verifyToken,
    schemaValidation(updateContactSchema),
    contactController.updateContact.bind(contactController)
);
router.delete("/:id", verifyToken, contactController.deleteContact.bind(contactController));

export default router;


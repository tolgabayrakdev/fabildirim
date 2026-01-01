import ContactService from "../service/contact-service.js";

export default class ContactController {
    constructor() {
        this.contactService = new ContactService();
    }

    async getAllContacts(req, res, next) {
        try {
            const userId = req.user.id;
            const contacts = await this.contactService.getAllContacts(userId);
            res.status(200).json({
                success: true,
                data: contacts,
            });
        } catch (error) {
            next(error);
        }
    }

    async getContactById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const contact = await this.contactService.getContactById(id, userId);
            res.status(200).json({
                success: true,
                data: contact,
            });
        } catch (error) {
            next(error);
        }
    }

    async createContact(req, res, next) {
        try {
            const userId = req.user.id;
            const contactData = req.body;
            const contact = await this.contactService.createContact(userId, contactData);
            res.status(201).json({
                success: true,
                message: "Kişi/Firma başarıyla oluşturuldu.",
                data: contact,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateContact(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const contactData = req.body;
            const contact = await this.contactService.updateContact(id, userId, contactData);
            res.status(200).json({
                success: true,
                message: "Kişi/Firma başarıyla güncellendi.",
                data: contact,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteContact(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await this.contactService.deleteContact(id, userId);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}


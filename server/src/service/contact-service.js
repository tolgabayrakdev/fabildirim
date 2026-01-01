import HttpException from "../exception/http-exception.js";
import ContactRepository from "../respository/contact-repository.js";
import ActivityLogService from "./activity-log-service.js";

export default class ContactService {
    constructor() {
        this.contactRepository = new ContactRepository();
        this.activityLogService = new ActivityLogService();
    }

    async getAllContacts(userId) {
        const contacts = await this.contactRepository.findAll(userId);
        return contacts;
    }

    async getContactById(id, userId) {
        const contact = await this.contactRepository.findById(id, userId);
        if (!contact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }
        return contact;
    }

    async createContact(userId, contactData) {
        const contact = await this.contactRepository.create({
            ...contactData,
            user_id: userId,
        });
        
        // Activity log kaydet
        await this.activityLogService.createActivityLog(userId, {
            category: "contact",
            action: "created",
            entity_type: "contact",
            entity_id: contact.id,
            description: `Yeni kişi/firma eklendi: ${contact.name}`,
            metadata: {
                contact_name: contact.name,
            },
        });
        
        return contact;
    }

    async updateContact(id, userId, contactData) {
        const existingContact = await this.contactRepository.findById(id, userId);
        if (!existingContact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }

        const updatedContact = await this.contactRepository.update(id, userId, contactData);
        
        // Activity log kaydet
        await this.activityLogService.createActivityLog(userId, {
            category: "contact",
            action: "updated",
            entity_type: "contact",
            entity_id: updatedContact.id,
            description: `Kişi/firma güncellendi: ${updatedContact.name}`,
            metadata: {
                contact_name: updatedContact.name,
            },
        });
        
        return updatedContact;
    }

    async deleteContact(id, userId) {
        const existingContact = await this.contactRepository.findById(id, userId);
        if (!existingContact) {
            throw new HttpException(404, "Kişi/Firma bulunamadı.");
        }

        await this.contactRepository.delete(id, userId);
        
        // Activity log kaydet
        await this.activityLogService.createActivityLog(userId, {
            category: "contact",
            action: "deleted",
            entity_type: "contact",
            entity_id: id,
            description: `Kişi/firma silindi: ${existingContact.name}`,
            metadata: {
                contact_name: existingContact.name,
            },
        });
        
        return { message: "Kişi/Firma başarıyla silindi." };
    }
}


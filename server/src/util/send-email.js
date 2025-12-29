import nodemailer from 'nodemailer';
import { BRAND_NAME } from './email-templates.js';
import logger from '../config/logger.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendEmail(to, subject, options = {}) {
        const { text, html } = options;
        
        const mailOptions = {
            from: {
                name: BRAND_NAME,
                address: process.env.EMAIL_USER
            },
            to,
            subject,
            ...(html && { html }),
            ...(text && { text }),
            headers: {
                'X-Entity-Ref-ID': BRAND_NAME.toLowerCase(),
                'X-Mailer': `${BRAND_NAME} Mailer`,
                'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            }
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${to}: ${info.response}`);
            return info;
        } catch (error) {
            logger.error(`Error sending email to ${to}:`, error);
            throw error;
        }
    }
}

export default EmailService;
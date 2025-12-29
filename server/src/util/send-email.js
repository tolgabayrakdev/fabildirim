import nodemailer from 'nodemailer';

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

    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: {
                name: 'Your App Name',
                address: process.env.EMAIL_USER
            },
            to,
            subject,
            text,
            headers: {
                'X-Entity-Ref-ID': 'your app name',
                'X-Mailer': `Your App Name Mailer`,
                'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            }
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export default EmailService;
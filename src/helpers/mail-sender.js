import config from "../../config.js";
import nodemailer from "nodemailer";
class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.MAIL_TRAP_HOST,
            port: config.MAIL_TRAP_PORT,
            auth: {
                user: config.MAIL_TRAP_USER,
                pass: config.MAIL_TRAP_PASS,
            },
        });
    }

    sendResetPasswordEmail(email, token) {
        const mailOptions = {
            from: config.MAIL_TRAP_USER,
            to: email,
            subject: "Reset Password",
            text: `Click here to reset your password: ${config.CLIENT_URL}/reset-password/${token}`,
        };

        return this.transporter.sendMail(mailOptions);
    }
}

export default MailSender;

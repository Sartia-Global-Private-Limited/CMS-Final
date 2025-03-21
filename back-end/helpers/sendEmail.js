let nodemailer = require("nodemailer");

async function mailSent(from, to, subject, html) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // service: "gmail",
        host: process.env.HOST,
        port: 587, // Use 587 for STARTTLS or 465 for SSL
        secure: false, // Use false for STARTTLS, true for SSL
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        // Disable certificate validation
        logger: false, // Logs SMTP communication
        debug: false, // Enables detailed debugging
        tls: {
            rejectUnauthorized: false, // Disables strict SSL validation
        },
    });

    // email template
    let applicantMailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html,
    };

    try {
        // send mail with defined transport object and wait for it to complete
        const info = await transporter.sendMail(applicantMailOptions);

        // Return the response when the mail is sent successfully

        if (info.messageId) {
            return {
                status: true,
                message: "Mail sent successfully",
            };
        } else {
            return {
                status: true,
                message: "Unable to send email",
            };
        }
    } catch (error) {
        // Return an error response if the mail sending fails
        return {
            status: false,
            message: error?.message || "Unable to send email",
            error: error,
        };
    }
}

module.exports = { mailSent };

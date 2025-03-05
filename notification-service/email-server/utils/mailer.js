const nodemailer = require('nodemailer');

const sendEmail = async (notification) => {
    try {
        // todo: configure mail for usage
        const { from, to, content } = notification;
        console.log(from, to, content.msg, content.subject);

        var transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        });

        const emailHTML = `<p>${content.msg}</p>`;

        console.log(to.join('.'));
        const mailOptions = {
            from: from,
            to: to.join(','),
            subject: content.subject,
            html: emailHTML,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = sendEmail;
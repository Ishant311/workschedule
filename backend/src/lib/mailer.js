const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.ethereal.email" for testing
  auth: {
    user: process.env.MAIL_USER, // e.g., your@gmail.com
    pass: process.env.MAIL_PASS  // app password
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  await exports.transporter.sendMail({
    from: `"Workforce System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
};

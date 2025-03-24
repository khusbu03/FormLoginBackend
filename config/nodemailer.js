const nodemailer = require("nodemailer");
const ApiError = require("../utils/apiError1");
const ApiResponse = require("../utils/apiResponse1");

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_KEY_NAME,
        pass: process.env.SMTP_KEY_VALUE
      }
    });

    const emailResponse = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email Sent!",
      data: emailResponse.envelope
    };
  } catch (error) {
    return { success: false, message: "Couldn't send email" };
  }
}

module.exports = sendEmail;

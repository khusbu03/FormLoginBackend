const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/apiResponse");

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "87a05f002@smtp-brevo.com",
        pass: "xsmtpsib-eebf19f06657ba5d47a4cd9cad8a68f6ac02b9becafe28260cafb77aeabb2670-VQJ8kpFKmGW7SxvC"
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

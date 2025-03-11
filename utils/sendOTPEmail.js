const { Error } = require("mongoose");
const sendEmail = require("../config/nodemailer");
const ApiError = require("./ApiError");
const ApiResponse = require("./apiResponse");

const sendOTPEmail = async (data) => {
  try {
    const { receiverEmail, OTP } = data;

    const mailOptions = {
      from: "kphulara@innow8apps.com",
      to: receiverEmail,
      subject: "Verification code for signup ",
      text: `OTP for the verification of email id is ${OTP}.This OTP is valid for 10 minutes`
    };

    const emailResponse = await sendEmail(mailOptions);

    if (!emailResponse.success) throw new Error("Can't sent email!");

    return emailResponse;
  } catch (error) {
    return {
      success: false,
      message: "Error occurred while sending email!"
    };
  }
};

module.exports = sendOTPEmail;

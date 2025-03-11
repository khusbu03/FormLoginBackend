const User = require("../models/User");
const { setCookie } = require("../utils/cookie");
const { createToken } = require("../utils/token");
const {
  validatePassword,
  createPasswordHash
} = require("../utils/Validation/passwordValidation");
const { generateOTP, verifyOTP, hashOTP } = require("../utils/OTP");
const sendOTPEmail = require("../utils/sendOTPEmail");
const OTP = require("../models/OTP");

async function loginService(req, res) {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) throw new Error("All fields are required");

    const existingUser = await User.findOne({ emailId });
    if (!existingUser) throw new Error("User not found!");

    const isPasswordValid = await validatePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) throw new Error("Invalid credentials!");

    const token = createToken({ _id: existingUser._id });

    setCookie(res, "token", token);

    existingUser.password = undefined;
    return {
      success: true,
      data: existingUser,
      token: token
    };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
}

async function signupService(req) {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !emailId || !password)
      throw new Error("All fields are required");

    const existingUser = await User.findOne({ emailId });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await createPasswordHash(password);

    const newUser = await User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });

    await newUser.save();
    return { success: true, data: newUser };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
}

async function forgotPasswordService(req, res) {
  try {
    const { emailId } = req.body;
    if (!emailId) throw new Error("EmailId is required");

    const existingUser = await User.findOne({ emailId });

    console.log("existingUser:", existingUser);
    if (!existingUser) throw new Error("Invalid credentials");

    // genserate otp
    const otp = generateOTP();
    console.log("otp", otp);

    //send email
    const emailResponse = await sendOTPEmail({
      receiverEmail: emailId,
      OTP: otp
    });

    console.log("emailResponse:", emailResponse);

    if (!emailResponse.success) throw new Error("Couldn't send email");

    const hashedOTP = await hashOTP(otp);
    console.log("hashed otp", hashedOTP);

    const newOTP = new OTP({
      emailId: emailId,
      otp: hashedOTP,
      expiresAt: Date.now() + 10 * 60
    });

    await newOTP.save();
    return {
      success: true,
      message: `OTP sent successfully on ${emailId}`,
      data: emailResponse.data,
      OTP: otp
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

async function verifyOTPSevice(req, res) {
  try {
    const { otp } = req.body;
    if (!otp) throw new Error("otp is required");

    const otpHash = await hashOTP(otp);
    console.log("hashed otp", otpHash);

    const existingOTP = await OTP.findOne({ otp: otpHash });
    if (!existingOTP) throw new Error("Invalid otp");
    console.log("existingOTP", existingOTP);

    const resetPasswordToken = createToken({ emailId: existingOTP.emailId });
    //set COOKie
    setCookie(res, "resetPasswordToken", resetPasswordToken);

    //find user by emaiId and save the user info with the token
    const existingUser = await User.findOneAndUpdate(
      { emailId: existingOTP.emailId },
      { resetPasswordToken }
    );
    console.log("existing User", existingUser);

    return {
      success: true,
      message: "OTP verified!",
      token: resetPasswordToken
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

async function updatePasswordService(req) {
  try {
    const { newPassword,resetPasswordTokenk} = req.body;

    if (!resetPasswordToken) throw new Error("Token is missing");
    if (!newPassword) throw new Error("new Password is required");

    const existingUser = await User.findOne({ token: resetPasswordToken });
    if (!existingUser) throw new Error("Invalid Token");

    const newPasswordHash = await createPasswordHash(newPassword);

    const updatedUser = await User.findOneAndUpdate(
      { emailId: existingUser.emailId },
      { password: newPasswordHash },
      { new: true }
    );
    updatedUser.password = undefined;
    updatedUser.token = undefined;

    return {
      success: true,
      message: "password updated!",
      user: updatedUser
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = {
  signupService,
  loginService,
  forgotPasswordService,
  verifyOTPSevice,
  updatePasswordService
};

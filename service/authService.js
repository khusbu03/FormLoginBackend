const User = require("../models/User");
const { setTokenInHeader, getTokenFromHeader } = require("../utils/header");

const { createToken } = require("../utils/token");

const {
  validatePassword,
  createPasswordHash
} = require("../utils/Validation/passwordValidation");
const { generateOTP, verifyOTP, hashOTP } = require("../utils/OTP");
const sendOTPEmail = require("../utils/sendOTPEmail");

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

    setTokenInHeader(res, token);

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

    const updatedUser = await User.findOneAndUpdate(
      { emailId },
      { otp: hashedOTP }
    );
    console.log("updatedUser User", updatedUser);

    return {
      success: true,
      message: `OTP sent successfully on ${emailId}`,
      data: emailResponse.data
      /*  OTP: otp */
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
    const { otp, emailId } = req.body;
    if (!otp) throw new Error("otp is required");
    if (!emailId) throw new Error("emailId is required");

    const existingUser = await User.findOne({ emailId });
    if (!existingUser) throw new Error("Invalid credentials");
    console.log("existingUser", existingUser);

    console.log("otp", otp);
    // verify otp
    const isValidOtp = verifyOTP(otp, existingUser.otp);
    console.log("isValidOtp", isValidOtp);
    if (!isValidOtp) throw new Error("Invalid credentials");

    const token = createToken({ emailId: existingUser.emailId });
    //set header
    setTokenInHeader(res, token);

    //find user by emaiId and save the user info with the token
    const updatedUser = await User.findOneAndUpdate(
      { emailId: existingUser.emailId },
      { token: token, otp: "" },
      { new: true }
    );

    console.log("updatedUser User", updatedUser);

    return {
      success: true,
      message: "OTP verified!",
      token: token
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: error.message
    };
  }
}

async function updatePasswordService(req) {
  try {
    const { newPassword } = req.body;
    const token = getTokenFromHeader(req);
    /* console.log("token",token) */

    if (!token) throw new Error("Token is missing");
    if (!newPassword) throw new Error("new Password is required");

    const existingUser = await User.findOne({ token });
    if (!existingUser) throw new Error("Invalid Token");

    const newPasswordHash = await createPasswordHash(newPassword);

    const updatedUser = await User.findOneAndUpdate(
      { emailId: existingUser.emailId },
      { password: newPasswordHash, token: "" },
      { new: true }
    );

    return {
      success: true,
      message: "password updated!"
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

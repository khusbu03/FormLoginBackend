const User = require("../models/User");
const { createToken } = require("../utils/token");
const {validatePassword,createPasswordHash} = require("../utils/Validation/passwordValidation");
const { setCookie, removeTokenFromCookie } = require("../utils/cookie");

async function loginService(req,res) {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password)throw new Error("All fields are required")

    const existingUser = await User.findOne({ emailId });
    if (!existingUser)throw new Error("User not found!")

    const isPasswordValid = await validatePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid)throw new Error("Invalid credentials!");

    const payloadData = { _id: existingUser._id };
    const token = createToken(payloadData);

    setCookie(res, "token", token);

    existingUser.password = undefined;
    return{
      success: true,
      data: existingUser,
      token: token
    }
  } catch (error) {
    return{
      success: false,
      error: error
    }
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
    return { success: true,data:newUser };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
}

module.exports = {
  signupService,
  loginService
};

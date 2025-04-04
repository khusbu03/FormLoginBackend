const {
  signupService,
  loginService,
  forgotPasswordService,
  verifyOTPSevice,
  updatePasswordService
} = require("../service/auth.Service");

async function login(req, res) {
  try {
    const response = await loginService(req, res);

    if (!response.success) throw response.error;

    console.log("User loggedIn", response.data);

    return res.status(200).json({
      message: "User LoggedIn!",
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false
    });
  }
}

async function logout(req, res) {
  try {
    res.status(200).json({ message: "Logged out!", success: true });
  } catch (error) {
    console.log("error ", error);
    return res.status(400).json({ message: "Can't logout!", success: false });
  }
}

const signup = async (req, res) => {
  try {
    const response = await signupService(req);
    if (!response.success) throw response.error;

    return res.status(200).json({
      message: "User registered successfully!",
      success: true
    });
  } catch (error) {
    res.status(400).json({
      message: "Error occurred while registering!",
      success: false,
      error: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const response = await forgotPasswordService(req);
    if (!response.success) throw response;
    console.log("response:", response);

    return res.status(200).json({
      message: response.message,
      success: true,
      otp: response.OTP
    });
  } catch (error) {
    res.status(400).json({
      message: "Error occurred while sending otp!",
      success: false,
      error: error.message
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const response = await verifyOTPSevice(req, res);
    if (!response.success) throw response;
    console.log("response:", response);

    return res.status(200).json({
      message: response.message,
      success: true,
      token: response.token
    });
  } catch (error) {
    res.status(400).json({
      message: "Cant't verify otp!",
      success: false,
      error: error.message
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const response = await updatePasswordService(req);
    if (!response.success) throw response;
    console.log("response:", response);

    return res.status(200).json({
      message: response.message,
      success: true,
      data: response.user
    });
  } catch (error) {
    res.status(400).json({
      message: "Cant't update the paswword!",
      success: false,
      error: error.message
    });
  }
};
module.exports = {
  login,
  logout,
  signup,
  forgotPassword,
  verifyOTP,
  updatePassword
};

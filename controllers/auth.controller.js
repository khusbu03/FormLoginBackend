const {removeTokenFromCookie}=require("../utils/cookie")

const { signupService, loginService } = require("../service/authService");

async function login(req, res) {
  try {
    const response = await loginService(req,res);

    if (!response.success) throw response.error;

    console.log("User loggedIn", response.data);
    return res.status(200).json({
      message: "User LoggedIn!",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed!",
      success: false,
      error: error.message
    });
  }
}

async function logout(req, res) {
  try {
    removeTokenFromCookie(res);

    res.status(200).json({ message: "Logout hogaya!", success: true });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({ message: "Can't logout!", success: false });
  }
}

const signup = async (req, res) => {
  try {
    const response = await signupService(req);
    if (!response.success) throw response.error;

    console.log("User registered successfully", response.data);
    return res.status(200).json({
      message: "User registered successfully!",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while registering!",
      success: false,
      error: error.message
    });
  }
};

module.exports = { login, logout, signup };

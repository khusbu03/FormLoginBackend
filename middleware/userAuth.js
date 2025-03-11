const User = require("../models/User");
const { verifyToken } = require("../utils/token");

const getTokenFromHeaders = (req) => {
  const authHeader = req.headers["authorization"]; // Get the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // Return null if the token is missing or improperly formatted
  }
  return authHeader.split(" ")[1]; // Extract the token (Bearer <token>)
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(404)
        .json({ message: "Token is missing!", success: false });

    req.body.user = verifyToken(token);
    next();
  } catch (error) {
    console.error("Authentication failed!", error);
    res.status(402).json({
      message: "Authentication failed!Please login again!",
      success: false
    });
  }
};

module.exports = userAuth;

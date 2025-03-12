const User = require("../models/User");
const { verifyToken } = require("../utils/token");
const { getTokenFromHeaders } = require("../utils/header");

const userAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    console.log("token", token);

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

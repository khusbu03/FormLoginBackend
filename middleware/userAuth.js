const User = require("../models/User");
const { verifyToken, createToken } = require("../utils/token");
const { getTokenFromHeader } = require("../utils/header");

const userAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    console.log("token", token);

    if (!token)
      return res
        .status(404)
        .json({ message: " Access Token is missing!", success: false });

    const isValidAccessToken = verifyToken(token);
    console.log("isValidAccessToken", isValidAccessToken);

    if (!isValidAccessToken.success)
      throw new Error(isValidAccessToken.message);

    req.body.user = { _id: isValidAccessToken.data._id };

    next();
  } catch (error) {
    console.error("Authentication failed!", error);
    res.status(402).json({
      message: "Authentication failed!Please login again!",
      success: false,
      error: error.message
    });
  }
};

const generateAccessToken = (req, res) => {
  try {
    const authHeader = req.headers;
    const refreshToken = authHeader["authorization"].replace("Bearer ", "");

    if (!refreshToken) {
      throw new Error("Please login again!");
    }

    const isValidRefreshToken = verifyToken(refreshToken);
    console.log("refresh token", refreshToken);
    if (!isValidRefreshToken) throw new Error("Refresh token is not valid");

    const accessToken = createToken({ _id: refreshToken._id });
    return res.status(200).json({
      success: true,
      message: "Access token created",
      data: accessToken
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false
    });
  }
};

module.exports = { userAuth, generateAccessToken };

const User = require("../models/User");
const {verifyToken} = require("../utils/token");

const getTokenFromHeaders = (req) => {
  const authHeader = req.headers["authorization"]; // Get the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // Return null if the token is missing or improperly formatted
  }
  return authHeader.split(" ")[1]; // Extract the token (Bearer <token>)
};

const userAuth = async (req, res, next) => {
  try {
    /* const token = getTokenFromHeaders(req); */
    const cookie=req.cookies;
    const {token}=cookie;
   /*  console.log("token:",token) */

    if (!token)
      return res
        .status(404)
        .json({ message: "Token is missing!", success: false });

    const decodedObject = verifyToken(token);
    console.log("User is authenticated!");

    // add userId to the body
    req.body.user = { _id: decodedObject._id };
    next();
  } catch (error) {
    console.log("Authentication failed!Please login again!");
    res.status(402).json({
      message: "Authentication failed!Please login again!",
      success: false
    });
  }
};

module.exports = userAuth;

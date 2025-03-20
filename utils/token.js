const jwt = require("jsonwebtoken");

function createToken(payloadData) {
  try {
    const token = jwt.sign(payloadData, process.env.SECRET_KEY, {
      expiresIn: "1d"
    });
    return token;
  } catch (error) {
    return new Error("Error occurred while creating token");
  }
}

function createRefreshToken(payloadData) {
  try {
    const token = jwt.sign(payloadData, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });
    return token;
  } catch (error) {
    return new Error("Error occurred while creating refresh token");
  }
}

function verifyToken(payloadData) {
  try {
    const response = jwt.verify(payloadData, process.env.SECRET_KEY);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    return {
      message: "error occurred while verifying Token",
      success: false
    };
  }
}

module.exports = {
  verifyToken,
  createToken,
  createRefreshToken
};

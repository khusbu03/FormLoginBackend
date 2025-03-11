const jwt = require("jsonwebtoken");

function createToken(payloadData) {
  return jwt.sign(payloadData, process.env.SECRET_KEY, { expiresIn: "1d" });
}

function verifyToken(payloadData) {
  return jwt.verify(payloadData, process.env.SECRET_KEY);
}

module.exports = {
  verifyToken,
  createToken
};

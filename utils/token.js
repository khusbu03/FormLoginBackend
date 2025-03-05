const jwt = require("jsonwebtoken");
const SECRET_KEY = "Khushi@098";

function createToken(payloadData) {
  return jwt.sign(payloadData, SECRET_KEY, { expiresIn: "1d" });
}

function verifyToken(payloadData) {
  return jwt.verify(payloadData, SECRET_KEY);
}


module.exports = {
    verifyToken,
    createToken,
}


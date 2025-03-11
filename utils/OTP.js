const crypto = require("crypto");

function generateOTP(length = 6) {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
}

function verifyOTP(inputOTP, storedHash) {
  const hashedInputOTP = hashOTP(inputOTP);
  return hashedInputOTP === storedHash;
}

function hashOTP(otp) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(otp)
    .digest("hex");
}

module.exports = { generateOTP, hashOTP, verifyOTP };

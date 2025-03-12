const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true,
    expires: 600
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600
  }
});

module.exports = mongoose.model("OTP", otpSchema);

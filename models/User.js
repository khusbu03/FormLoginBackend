const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    emailId: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      expires: 600
    },
    token: {
      type: String,
      expires: 60 * 60
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

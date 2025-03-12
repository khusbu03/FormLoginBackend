const express = require("express");
const rateLimit = require("express-rate-limit");

const emailLimiter = rateLimit({
  keyGenerator: (req) => req.body.emailId,
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: { error: "Too many requests, please try again later." },
  headers: true
});

module.exports = emailLimiter;

const mongoose = require("mongoose");

const UserOTPSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserOTP = mongoose.model("UserOTP", UserOTPSchema);
module.exports = UserOTP;

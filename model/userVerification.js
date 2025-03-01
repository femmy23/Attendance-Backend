const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserVerify = mongoose.model("UserVerify", UserVerificationSchema);
module.exports = UserVerify;

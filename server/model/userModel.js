const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  marriageAnniversary: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "attendee", "user"],
    default: "user",
    required: true,
  },
  cell: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cell",
    // required: true,
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    // required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    // required: true,
  },
  verified: Boolean,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

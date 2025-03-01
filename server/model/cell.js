const mongoose = require("mongoose");

const CellSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    address: {
      type: String,
      default: "Lagos",
      required: true,
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    attendees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Attendee", default: [""] },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cell", CellSchema);

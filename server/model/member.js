const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee",
      required: true,
    },
    cell: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cell",
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);
module.exports = Member;

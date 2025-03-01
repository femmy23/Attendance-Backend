const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    attendees: [
      {
        attendee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attendee",
          required: true,
        },
        status: { type: String, enum: ["present", "absent"], required: true },
      },
    ],
    cell: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cell",
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;

const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dateOfBirth: {
    type: Date,
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
  membership: {
    type: Boolean,
    // enum: [true, false],
    default: false,
    required: true,
  },
  cell: { type: mongoose.Schema.Types.ObjectId, ref: "Cell", required: true },
});

const Attendee = mongoose.model("Attendee", AttendeeSchema);
module.exports = Attendee;

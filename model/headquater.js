const mongoose = require("mongoose");

const HeadquarterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, default: "Church" },

    state: { type: String, default: "Lagos" },

    superior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    branch: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Headquarter = mongoose.model("Headquarter", HeadquarterSchema);
module.exports = Headquarter;

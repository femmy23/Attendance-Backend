const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    state: { type: String, default: "Lagos", required: true },

    headquarter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Headquarter",
    },

    superAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch;

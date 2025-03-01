const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    region: { type: String, default: "Ikeja" },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    cells: [
      { type: mongoose.Schema.Types.ObjectId, ref: "cells", required: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);

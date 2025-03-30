// Contains flowchart model for the database

const mongoose = require("mongoose");

const flowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flowName: { type: String, required: true },
  nodes: [
    {
      id: { type: String, required: true },
      type: {
        type: String,
        enum: ["coldEmail", "waitDelay", "leadSource"],
        required: true,
      },
      data: mongoose.Schema.Types.Mixed,
    },
  ],
  edges: [
    {
      id: { type: String, required: true },
      source: { type: String, required: true },
      target: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Flow", flowSchema);

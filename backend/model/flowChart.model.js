import mongoose from "mongoose";
import coldEmailSchema from "./nodes/coldEmail.js";
import waitDelaySchema from "./nodes/waitDelay.js";
import leadSourceSchema from "./nodes/leadSource.js";

// Define edge schema
const edgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
  },
  { _id: false }
);

// Main flow schema
const flowSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flowName: { type: String, required: true },

    // Store nodes based on their type
    nodes: [mongoose.Schema.Types.Mixed], // Will store all node types

    // Connections between nodes
    edges: [edgeSchema],

    // For tracking scheduled jobs
    scheduledJobs: [String],
  },
  { timestamps: true }
);

const Flow = mongoose.model("Flow", flowSchema);

export { ColdEmail, WaitDelay, LeadSource };
export default Flow;

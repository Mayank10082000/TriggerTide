import mongoose from "mongoose";
import coldEmailSchema from "./coldEmail.model.js";
import waitDelaySchema from "./waitDelay.model.js";
import leadSourceSchema from "./leadSource.model.js";

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

// Create the models from the schemas
const ColdEmail = mongoose.model("ColdEmail", coldEmailSchema);
const WaitDelay = mongoose.model("WaitDelay", waitDelaySchema);
const LeadSource = mongoose.model("LeadSource", leadSourceSchema);

// Create the Flow model
const Flow = mongoose.model("Flow", flowSchema);

// Export all models
export { ColdEmail, WaitDelay, LeadSource };
export default Flow;

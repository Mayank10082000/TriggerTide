import mongoose from "mongoose";
import { validateFlowNodes } from "../middleware/nodeValidation.middleware.js";

// Define the base node schema shape
const baseNodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["coldEmail", "waitDelay", "leadSource"],
      required: true,
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

// Define the flow schema with embedded nodes
const FlowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flowName: { type: String, required: true },
    nodes: [baseNodeSchema],
    edges: [
      {
        id: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
      },
    ],
    scheduledJobs: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

// Apply the node validation middleware
FlowSchema.pre("validate", validateFlowNodes);

const Flow = mongoose.model("Flow", FlowSchema);

export default Flow;

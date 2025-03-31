import mongoose from "mongoose";

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
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // Data type mixed gives flexibility for different format of data from the frontend
  },
  { _id: false } // Don't create _id for embedded documents as it will take extra space and we wont be accessing them individually
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

// Add validation for the specific node types
FlowSchema.pre("validate", function (next) {
  // Validate each node based on its type
  if (this.nodes) {
    for (const node of this.nodes) {
      if (node.type === "coldEmail") {
        // Validate cold email nodes
        if (!node.data || !node.data.subject || !node.data.body) {
          return next(
            new Error(`Cold email node requires subject and body: ${node.id}`)
          );
        }
      } else if (node.type === "waitDelay") {
        // Validate wait/delay nodes
        if (!node.data || typeof node.data.delayTime !== "number") {
          return next(
            new Error(
              `Wait/delay node requires a numeric delayTime: ${node.id}`
            )
          );
        }
        // Validate delayUnit if provided
        if (
          node.data.delayUnit &&
          !["minutes", "hours", "days"].includes(node.data.delayUnit)
        ) {
          return next(new Error(`Invalid delay unit in node: ${node.id}`));
        }
      } else if (node.type === "leadSource") {
        // Validate lead source nodes
        if (!node.data || !node.data.sourceName) {
          return next(
            new Error(`Lead source node requires a sourceName: ${node.id}`)
          );
        }
      }
    }
  }
  next();
});

const Flow = mongoose.model("Flow", FlowSchema);

export default Flow;

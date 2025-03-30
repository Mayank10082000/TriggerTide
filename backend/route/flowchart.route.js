import mongoose from "mongoose";

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
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // explicitly add this
  },
  { discriminatorKey: "type", _id: false }
);

const BaseNode = mongoose.model("Node", baseNodeSchema);

const ColdEmailNode = BaseNode.discriminator(
  "coldEmail",
  new mongoose.Schema({
    data: {
      subject: { type: String, required: true },
      body: { type: String, required: true },
      recipient: { type: String },
    },
  })
);

const WaitDelayNode = BaseNode.discriminator(
  "waitDelay",
  new mongoose.Schema({
    data: {
      delayTime: { type: Number, required: true },
      delayUnit: {
        type: String,
        enum: ["minutes", "hours", "days"],
        default: "minutes",
      },
    },
  })
);

const LeadSourceNode = BaseNode.discriminator(
  "leadSource",
  new mongoose.Schema({
    data: {
      sourceName: { type: String, required: true },
      email: { type: String, required: true },
    },
  })
);

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
    scheduledJobs: [String],
  },
  { timestamps: true }
);

const Flow = mongoose.model("Flow", FlowSchema);

export default Flow;

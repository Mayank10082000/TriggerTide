import mongoose from "mongoose";
import baseNodeSchema from "./baseNode.model.js";

const waitDelaySchema = new mongoose.Schema({
  ...baseNodeSchema,
  type: { type: String, default: "waitDelay" },
  data: {
    delayTime: { type: Number, required: true }, // in minutes
    delayUnit: {
      type: String,
      enum: ["minutes", "hours", "days"],
      default: "minutes",
    },
  },
});

export default waitDelaySchema;

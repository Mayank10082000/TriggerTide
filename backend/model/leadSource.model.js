import mongoose from "mongoose";
import baseNodeSchema from "./baseNode.js";

const leadSourceSchema = new mongoose.Schema({
  ...baseNodeSchema,
  type: { type: String, default: "leadSource" },
  data: {
    sourceName: { type: String, required: true },
    email: { type: String },
  },
});

export default leadSourceSchema;

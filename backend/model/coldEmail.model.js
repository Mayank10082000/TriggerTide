import mongoose from "mongoose";
import baseNodeSchema from "./baseNode.model.js";

const coldEmailSchema = new mongoose.Schema({
  ...baseNodeSchema,
  type: { type: String, default: "coldEmail" },
  data: {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    recipient: String,
  },
});

export default coldEmailSchema;

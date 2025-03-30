import mongoose from "mongoose";

// Simple base schema with common fields for all node types
const baseNodeSchema = {
  id: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  // Additional common properties can be added here
};

export default baseNodeSchema;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createFlowchart,
  updateFlowchart,
  deleteFlowchart,
} from "../controller/flowchart.controller.js";

const router = express.Router();

// router.post("/send/:id", protectRoute, sendMessage);

router.post("/create", protectRoute, createFlowchart);

export default router;

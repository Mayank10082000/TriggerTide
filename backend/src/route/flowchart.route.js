// backend/route/flowchart.route.js
import express from "express";
import {
  createFlowchart,
  updateFlowchart,
  deleteFlowchart,
} from "../controller/flowchart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createFlowchart);
router.put("/update/:id", protectRoute, updateFlowchart);
router.delete("/delete/:id", protectRoute, deleteFlowchart);

export default router;

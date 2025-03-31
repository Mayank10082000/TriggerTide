// backend/route/flowchart.route.js
import express from "express";
import {
  createFlowchart,
  updateFlowchart,
  getAllFlowcharts,
  getFlowChartById,
  deleteFlowChart,
} from "../controller/flowchart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createFlowchart);
router.put("/update/:flowId", protectRoute, updateFlowchart);
router.delete("/delete/:flowId", protectRoute, deleteFlowChart);
router.get("/all", protectRoute, getAllFlowcharts);
router.get("/:flowId", protectRoute, getFlowChartById);

export default router;

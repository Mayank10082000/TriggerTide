// Create flow, update flow, delete flow, get all flows, get flow by id

import Flow from "../model/flowChart.model.js";
import agenda from "../lib/emailScheduler.js";
import { scheduleFlowEmails } from "../lib/emailScheduler.js";

export const createFlowchart = async (req, res) => {
  try {
    // Validate required fields
    const userId = req.user._id; // Extract user ID from the request object
    const { flowName, nodes, edges } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (!flowName)
      return res.status(400).json({ message: "Flow name is required" });
    if (!nodes || !Array.isArray(nodes))
      return res.status(400).json({ message: "Nodes array is required" });
    if (!edges || !Array.isArray(edges))
      return res.status(400).json({ message: "Edges array is required" });

    const flow = await Flow.create({
      userId,
      flowName,
      nodes,
      edges,
      scheduledJobs: [], // Initialize with empty array
    });

    const jobIds = await scheduleFlowEmails(flow);

    flow.scheduledJobs = jobIds;
    await flow.save();

    res.status(200).json({
      message: "Flow created and saved successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Error in createFlow controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateFlowchart = async (req, res) => {
  try {
    // Validate required fields
    const userId = req.user._id; // Extract user ID from the request object
    const { flowId } = req.params; // This should match the :id in your route
    const { flowName, nodes, edges } = req.body;

    if (!id) return res.status(400).json({ message: "Flow ID is required" });
    if (!flowName)
      return res.status(400).json({ message: "Flow name is required" });
    if (!nodes || !Array.isArray(nodes))
      return res.status(400).json({ message: "Nodes array is required" });
    if (!edges || !Array.isArray(edges))
      return res.status(400).json({ message: "Edges array is required" });

    // First fetch the existing flow
    const existingFlow = await Flow.findById({ _id: flowId, userId });

    if (!existingFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    // Cancel existing jobs
    if (existingFlow.scheduledJobs && existingFlow.scheduledJobs.length > 0) {
      for (const jobId of existingFlow.scheduledJobs) {
        await agenda.cancel({ _id: jobId });
      }
    }

    // Update flow with new data
    existingFlow.flowName = flowName;
    existingFlow.nodes = nodes;
    existingFlow.edges = edges;

    // Schedule new jobs
    const jobIds = await scheduleFlowEmails(existingFlow);
    existingFlow.scheduledJobs = jobIds;

    // Save the updated flow
    await existingFlow.save();

    res.status(200).json({
      message: "Flow updated successfully",
      data: existingFlow,
    });
  } catch (error) {
    console.error("Error in updateFlow controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteFlowChart = async (req, res) => {
  try {
    const { flowId } = req.params;
    const userId = req.user._id;

    // Find the specific flow
    const flow = await Flow.findOne({ _id: flowId, userId });

    // Check if flow exists and belongs to the user
    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    // Cancel all scheduled jobs for this flow
    if (flow.scheduledJobs && flow.scheduledJobs.length > 0) {
      for (const jobId of flow.scheduledJobs) {
        await agenda.cancel({ _id: jobId });
      }
    }

    // Delete the specific flow
    await Flow.findByIdAndDelete(flowId);

    res.status(200).json({ message: "Flow deleted successfully" });
  } catch (error) {
    console.log("Error in deleteFlow controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAllFlowcharts = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the request object

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const flows = await Flow.find({ userId });

    if (flows.length === 0) {
      return res.status(404).json({ message: "No flows found for this user" });
    }

    res.status(200).json({
      message: "Flows fetched successfully",
      data: flows,
    });
  } catch (error) {
    console.error("Error in getAllFlows controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getFlowChartById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ message: "Flow ID is required" });
    }

    const flow = await Flow.findOne({ _id: id, userId });

    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    res.status(200).json({
      message: "Flow fetched successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Error in getFlowById controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

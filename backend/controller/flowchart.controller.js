// Create flow, update flow, delete flow, get all flows, get flow by id

import Flow from "../model/flowChart.model.js";
import agenda from "../lib/emailScheduler.js";
import { scheduleFlowEmails } from "../lib/emailScheduler.js";

export const createFlowchart = async (req, res) => {
  try {
    // Validate required fields
    const { userId, flowName, nodes, edges } = req.body;

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
    const { flowId, flowName, nodes, edges } = req.body;

    if (!flowId)
      return res.status(400).json({ message: "Flow ID is required" });
    if (!flowName)
      return res.status(400).json({ message: "Flow name is required" });
    if (!nodes || !Array.isArray(nodes))
      return res.status(400).json({ message: "Nodes array is required" });
    if (!edges || !Array.isArray(edges))
      return res.status(400).json({ message: "Edges array is required" });

    // Update flow directly from req.body
    const flow = await Flow.findByIdAndUpdate(
      flowId,
      {
        flowName,
        nodes,
        edges,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Flow updated successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Error in updateFlow controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteFlowchart = async (req, res) => {
  try {
    // Validate required fields
    const { flowId } = req.body;

    if (!flowId)
      return res.status(400).json({ message: "Flow ID is required" });

    // Find the flow first to check if it exists and to get access to its data
    const flow = await Flow.findById(flowId);

    // Check if flow exists
    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    // Cancel any scheduled jobs associated with this flow
    if (flow.scheduledJobs && flow.scheduledJobs.length > 0) {
      for (const jobId of flow.scheduledJobs) {
        await agenda.cancel({ _id: jobId });
      }
    }

    // Delete the flow
    await Flow.findByIdAndDelete(flowId);

    res.status(200).json({
      message: "Flow deleted successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Error in deleteFlow controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

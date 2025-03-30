// Create flow, update flow, delete flow, get all flows, get flow by id

import Flow from "../model/flowChart.model.js";

export const createFlow = async (req, res) => {
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

    // Create flow directly from req.body
    const flow = await Flow.create({
      userId,
      flowName,
      nodes,
      edges,
    });

    res.status(200).json({
      message: "Flow created and saved successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Error in createFlow controller:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateFlow = async (req, res) => {
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

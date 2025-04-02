import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import {
  Save,
  Undo,
  Home,
  PlusCircle,
  Mail,
  Clock,
  Users,
  Loader,
  X,
  AlertTriangle,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";

// Import custom node types (we'll implement these next)
import ColdEmailNode from "../components/ColdEmailNode";
import LeadSourceNode from "../components/LeadSourceNode";
import WaitDelayNode from "../components/WaitDelayNode";
import CanvasSidebar from "../components/CanvasSidebar";

// Define node types for React Flow
const nodeTypes = {
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  leadSource: LeadSourceNode,
};

const CreateFlowCanvas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState("New Email Sequence");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFlowId, setEditingFlowId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // First define fetchFlowData with useCallback
  const fetchFlowData = useCallback(
    async (flowId) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/flowchart/${flowId}`);
        const flowData = response.data.data;

        // Set flow name
        setFlowName(flowData.flowName || "My Email Sequence");

        // Load nodes and edges
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);

        toast.success("Flowchart loaded successfully");
      } catch (error) {
        console.error("Error fetching flowchart:", error);
        toast.error("Failed to load flowchart");
      } finally {
        setIsLoading(false);
      }
    },
    [setNodes, setEdges]
  );

  // Then use it in useEffect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      setEditingFlowId(id);
      fetchFlowData(id);
    }
  }, [location, fetchFlowData]);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node dragging from sidebar to canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Get drop position
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Return if no valid node type
      if (!type) return;

      // Calculate the position where the node was dropped
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate IDs
      const id = `${type}-${uuidv4()}`;

      // Create default data based on node type
      let data = {};
      switch (type) {
        case "coldEmail":
          data = {
            subject: "Email Subject",
            body: "Email Content",
            recipient: "",
          };
          break;
        case "waitDelay":
          data = {
            delayTime: 24,
            delayUnit: "hours",
          };
          break;
        case "leadSource":
          data = {
            sourceName: "New Lead Source",
            email: "",
          };
          break;
      }

      // Create new node
      const newNode = {
        id,
        type,
        position,
        data,
      };

      // Add the new node
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Save flowchart to backend
  const handleSaveFlow = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    // Validate flow structure
    const hasLeadSource = nodes.some((node) => node.type === "leadSource");
    const hasEmail = nodes.some((node) => node.type === "coldEmail");

    if (!hasLeadSource) {
      toast.error("Flow must have at least one Lead Source");
      return;
    }

    if (!hasEmail) {
      toast.error("Flow must have at least one Email");
      return;
    }

    // Check that lead sources have email data
    const invalidLeadSources = nodes.filter(
      (node) =>
        node.type === "leadSource" &&
        (!node.data.email || node.data.email.trim() === "")
    );

    if (invalidLeadSources.length > 0) {
      toast.error("All Lead Sources must have an email address");
      return;
    }

    try {
      setIsSaving(true);

      const flowData = {
        flowName,
        nodes,
        edges,
      };

      let response;

      // Update or create flow
      if (editingFlowId) {
        response = await axiosInstance.put(
          `/flowchart/update/${editingFlowId}`,
          flowData
        );
      } else {
        response = await axiosInstance.post("/flowchart/create", flowData);
        // Set the ID for future saves
        setEditingFlowId(response.data.data._id);
      }

      toast.success("Flowchart saved successfully");
    } catch (error) {
      console.error("Error saving flowchart:", error);
      toast.error(error.response?.data?.message || "Failed to save flowchart");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle node deletion
  const onNodesDelete = (deleted) => {
    // Handle any cleanup or validation when nodes are deleted
    console.log("Nodes deleted:", deleted);
  };

  // Return to home page
  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading flowchart...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen pt-16 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-white shadow-md border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen && <CanvasSidebar />}
      </div>

      {/* Toggle sidebar button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-0 top-20 z-10 bg-white shadow-md p-2 rounded-r-md border border-l-0 border-gray-200"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <PlusCircle className="h-5 w-5 text-blue-500" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-grow flex flex-col h-full">
        {/* Top toolbar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoHome}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
              title="Go to Dashboard"
            >
              <Home className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Flow Name"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveFlow}
              disabled={isSaving}
              className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Flow
                </>
              )}
            </button>
          </div>
        </div>

        {/* Flow canvas */}
        <div className="flex-grow" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodesDelete={onNodesDelete}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Control"
            selectionKeyCode="Shift"
          >
            <Controls />
            <MiniMap />
            <Background color="#aaa" gap={16} />

            {/* Node type legend */}
            <Panel
              position="top-right"
              className="bg-white p-3 rounded-md shadow-md border border-gray-200"
            >
              <div className="text-sm font-medium text-gray-700 mb-2">
                Node Types
              </div>
              <div className="flex flex-col space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <Mail className="h-3 w-3 mr-1 text-blue-500" />
                  <span>Email</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <Clock className="h-3 w-3 mr-1 text-purple-500" />
                  <span>Delay</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <Users className="h-3 w-3 mr-1 text-green-500" />
                  <span>Lead Source</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default CreateFlowCanvas;

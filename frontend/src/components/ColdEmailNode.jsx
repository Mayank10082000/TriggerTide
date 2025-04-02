import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Trash2,
} from "lucide-react";

const ColdEmailNode = ({ id, data, isConnectable, selected }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recipientError, setRecipientError] = useState("");

  // Add this line to get the reactFlow instance
  const { deleteElements } = useReactFlow();

  // Add a method to handle node deletion
  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  // Create local state for inputs to ensure UI updates immediately
  const [localData, setLocalData] = useState({
    subject: data.subject || "",
    body: data.body || "",
    recipient: data.recipient || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update local state for immediate UI feedback
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Also update the node data
    data[name] = value;

    // Validate email format if provided
    if (name === "recipient" && value && !/\S+@\S+\.\S+/.test(value)) {
      setRecipientError("Please enter a valid email address");
    } else if (name === "recipient") {
      setRecipientError("");
    }
  };

  // Prevent node dragging when interacting with inputs
  const preventDrag = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`rounded-lg shadow-md border transition-shadow ${
        selected ? "shadow-lg border-blue-400" : "border-gray-200"
      }`}
      style={{ minWidth: 280, maxWidth: 320 }}
    >
      {/* Node Header - This will be the draggable handle */}
      <div className="node-drag-handle bg-gradient-to-r from-blue-500 to-sky-600 p-2 rounded-t-lg flex items-center justify-between text-white cursor-move">
        <div className="flex items-center space-x-2">
          <Mail size={18} />
          <span className="font-medium text-sm">Cold Email</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add delete button */}
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-white/20 rounded"
            onMouseDown={(e) => e.stopPropagation()} // Prevent dragging
            title="Delete Node"
          >
            <Trash2 size={16} className="text-white hover:text-red-300" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded"
            onMouseDown={(e) => e.stopPropagation()} // Don't trigger drag from the button
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Node Content - Make this entire section non-draggable */}
      {isExpanded && (
        <div
          className="p-3 bg-white rounded-b-lg nodrag"
          onMouseDown={preventDrag}
          onClick={preventDrag}
        >
          <div className="space-y-3">
            {/* Subject Line */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                name="subject"
                value={localData.subject}
                onChange={handleChange}
                onMouseDown={preventDrag}
                onClick={preventDrag}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
                placeholder="Enter email subject"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Body
              </label>
              <textarea
                name="body"
                value={localData.body}
                onChange={handleChange}
                onMouseDown={preventDrag}
                onClick={preventDrag}
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-800"
                placeholder="Write your email content here..."
              />
            </div>

            {/* Recipient (Optional) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Specific Recipient (Optional)
              </label>
              <div className="relative">
                <input
                  name="recipient"
                  value={localData.recipient}
                  onChange={handleChange}
                  onMouseDown={preventDrag}
                  onClick={preventDrag}
                  className={`w-full px-3 py-2 text-sm border ${
                    recipientError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800`}
                  placeholder="recipient@example.com (optional)"
                />
                {recipientError && (
                  <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                    <AlertCircle size={16} className="text-red-500" />
                  </div>
                )}
              </div>
              {recipientError ? (
                <p className="mt-1 text-xs text-red-500">{recipientError}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  If empty, will use the lead source email
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#3b82f6", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#3b82f6", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ColdEmailNode;

import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Mail, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const ColdEmailNode = ({ data, isConnectable, selected }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recipientError, setRecipientError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    data[name] = value;

    // Validate email format if provided
    if (name === "recipient" && value && !/\S+@\S+\.\S+/.test(value)) {
      setRecipientError("Please enter a valid email address");
    } else if (name === "recipient") {
      setRecipientError("");
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md border transition-shadow ${
        selected ? "shadow-lg border-blue-400" : "border-gray-200"
      }`}
      style={{ minWidth: 280, maxWidth: 320 }}
    >
      {/* Node Header */}
      <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-2 rounded-t-lg flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Mail size={18} />
          <span className="font-medium text-sm">Cold Email</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/20 rounded"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Node Content */}
      {isExpanded && (
        <div className="p-3 bg-white rounded-b-lg">
          <div className="space-y-3">
            {/* Subject Line */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                name="subject"
                value={data.subject || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={data.body || ""}
                onChange={handleChange}
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                  value={data.recipient || ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    recipientError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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

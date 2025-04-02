import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Users, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const LeadSourceNode = ({ data, isConnectable, selected }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    data[name] = value;

    // Validate email format
    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md border transition-shadow ${
        selected ? "shadow-lg border-green-400" : "border-gray-200"
      }`}
      style={{ minWidth: 240, maxWidth: 280 }}
    >
      {/* Node Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-t-lg flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Users size={18} />
          <span className="font-medium text-sm">Lead Source</span>
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
            {/* Source Name Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Source Name
              </label>
              <input
                name="sourceName"
                value={data.sourceName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Website Leads"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Lead Email
              </label>
              <div className="relative">
                <input
                  name="email"
                  value={data.email || ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="user@example.com"
                />
                {error && (
                  <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                    <AlertCircle size={16} className="text-red-500" />
                  </div>
                )}
              </div>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              <p className="mt-1 text-xs text-gray-500">
                This is the starting point of your email sequence
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Only add the output handle - Lead Sources are starting points */}
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#10b981", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default LeadSourceNode;

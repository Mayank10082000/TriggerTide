import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const WaitDelayNode = ({ data, isConnectable, selected }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Create local state for inputs
  const [localData, setLocalData] = useState({
    delayTime: data.delayTime || 24,
    delayUnit: data.delayUnit || "hours",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update local state for immediate UI feedback
    setLocalData((prev) => ({
      ...prev,
      [name]: name === "delayTime" ? Number(value) : value,
    }));

    // Also update the node data
    data[name] = name === "delayTime" ? Number(value) : value;
  };

  return (
    <div
      className={`rounded-lg shadow-md border transition-shadow ${
        selected ? "shadow-lg border-purple-400" : "border-gray-200"
      }`}
      style={{ minWidth: 220, maxWidth: 260 }}
    >
      {/* Node Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-t-lg flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Clock size={18} />
          <span className="font-medium text-sm">Wait/Delay</span>
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
            {/* Delay Time Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Delay Duration
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="delayTime"
                  value={localData.delayTime}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-800"
                  placeholder="24"
                />
                <select
                  name="delayUnit"
                  value={localData.delayUnit}
                  onChange={handleChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-800"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Wait this long before sending the next email
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#8b5cf6", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#8b5cf6", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default WaitDelayNode;

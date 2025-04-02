import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock } from "lucide-react";

const WaitDelayNode = ({ data, isConnectable, selected }) => {
  const [localData, setLocalData] = React.useState({
    delayTime: data.delayTime || 24,
    delayUnit: data.delayUnit || "hours",
    sourceName: data.sourceName || "Wait/Delay",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalData((prev) => ({
      ...prev,
      [name]: name === "delayTime" ? Number(value) : value,
    }));

    data[name] = name === "delayTime" ? Number(value) : value;
  };

  // Prevent node dragging when interacting with inputs
  const preventDrag = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`rounded-lg shadow-md border transition-shadow ${
        selected ? "shadow-lg border-purple-400" : "border-gray-200"
      }`}
      style={{ minWidth: 220, maxWidth: 260 }}
    >
      {/* Node Header - This will be the draggable handle */}
      <div className="node-drag-handle bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-t-lg flex items-center justify-between text-white cursor-move">
        <div className="flex items-center space-x-2">
          <Clock size={18} />
          <input
            type="text"
            value={localData.sourceName}
            onChange={(e) => {
              setLocalData((prev) => ({
                ...prev,
                sourceName: e.target.value,
              }));
              data.sourceName = e.target.value;
            }}
            className="bg-transparent text-white text-sm font-medium w-full focus:outline-none placeholder-white/70"
            placeholder="Wait/Delay"
            onMouseDown={preventDrag}
            onClick={preventDrag}
          />
        </div>
      </div>

      {/* Node Content */}
      <div
        className="p-3 bg-white rounded-b-lg nodrag"
        onMouseDown={preventDrag}
        onClick={preventDrag}
      >
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
                onMouseDown={preventDrag}
                onClick={preventDrag}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-800 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                placeholder="24"
              />
              <select
                name="delayUnit"
                value={localData.delayUnit}
                onChange={handleChange}
                onMouseDown={preventDrag}
                onClick={preventDrag}
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

import React from "react";
import { Mail, Clock, Users, GripHorizontal, Info } from "lucide-react";

const CanvasSidebar = () => {
  // Handle drag start for node types
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Nodes</h3>
      <p className="text-sm text-gray-500 mb-6">
        Drag and drop nodes onto the canvas to build your email sequence.
      </p>

      <div className="space-y-4">
        {/* Lead Source Node */}
        <div
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 cursor-grab hover:shadow-md transition-shadow flex items-center justify-between"
          draggable
          onDragStart={(e) => onDragStart(e, "leadSource")}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white mr-3">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Lead Source</h4>
              <p className="text-xs text-gray-500">Starting point for leads</p>
            </div>
          </div>
          <GripHorizontal className="text-gray-400" size={18} />
        </div>

        {/* Wait/Delay Node */}
        <div
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 cursor-grab hover:shadow-md transition-shadow flex items-center justify-between"
          draggable
          onDragStart={(e) => onDragStart(e, "waitDelay")}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white mr-3">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Wait/Delay</h4>
              <p className="text-xs text-gray-500">Add time between emails</p>
            </div>
          </div>
          <GripHorizontal className="text-gray-400" size={18} />
        </div>

        {/* Cold Email Node */}
        <div
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 cursor-grab hover:shadow-md transition-shadow flex items-center justify-between"
          draggable
          onDragStart={(e) => onDragStart(e, "coldEmail")}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 flex items-center justify-center text-white mr-3">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Cold Email</h4>
              <p className="text-xs text-gray-500">Email content to send</p>
            </div>
          </div>
          <GripHorizontal className="text-gray-400" size={18} />
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <h4 className="text-sm font-medium text-blue-700">Quick Tips</h4>
              <ul className="text-xs text-blue-600 mt-1 space-y-1 list-disc list-inside">
                <li>Start with a Lead Source node</li>
                <li>Connect nodes by dragging between handles</li>
                <li>Use Wait nodes between emails</li>
                <li>Save often!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSidebar;

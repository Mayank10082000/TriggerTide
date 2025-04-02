import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Users } from "lucide-react";

const LeadSourceNode = ({ data, selected }) => {
  // Format email list for display
  const formatEmails = () => {
    if (!data.email) return "";

    // Handle both string and array formats
    let emails = data.email;
    if (typeof emails === "string") {
      // Split by commas if it's a string
      emails = emails
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    if (Array.isArray(emails)) {
      if (emails.length === 0) return "";
      if (emails.length === 1) return emails[0];
      return `${emails[0]} +${emails.length - 1} more`;
    }

    return emails;
  };

  return (
    <div
      className={`p-3 rounded-md bg-white border-2 ${
        selected ? "border-emerald-500 shadow-md" : "border-emerald-200"
      } w-60 transition-all duration-200`}
    >
      {/* No input handle for lead source - it's always the starting point */}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-emerald-500 border-2 border-white"
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="flex justify-center items-center bg-emerald-100 text-emerald-800 rounded-full p-1.5">
          <Users size={16} />
        </div>
        <div className="font-medium text-sm text-emerald-800">Lead Source</div>
      </div>

      <div className="border-t border-gray-200 pt-2 space-y-2">
        {data.sourceName || data.email ? (
          <>
            {data.sourceName && (
              <div>
                <span className="text-xs text-gray-500 block">Source:</span>
                <p className="text-sm font-medium">{data.sourceName}</p>
              </div>
            )}

            {data.email && (
              <div>
                <span className="text-xs text-gray-500 block">Email(s):</span>
                <p className="text-xs">{formatEmails()}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-gray-500 italic">
            Click to configure lead source
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(LeadSourceNode);

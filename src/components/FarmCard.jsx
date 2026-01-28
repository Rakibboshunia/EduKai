import React from "react";
import { Eye, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FarmCard({ farm, onStatusChange }) {
  const navigate = useNavigate();

  const statusConfig = {
    Active: "bg-green-100 text-green-600",
    Trial: "bg-yellow-100 text-yellow-600",
    Suspended: "bg-red-100 text-red-600",
  };

  const badgeClass =
    statusConfig[farm.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] flex flex-col gap-4 shadow-sm hover:shadow-md transition col-span-12 md:col-span-4">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{farm.name}</h3>
          <p className="text-sm text-gray-500">{farm.email}</p>
        </div>

        <span className={`px-3 py-1 text-xs rounded-full font-medium ${badgeClass}`}>
          {farm.status}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <Info label="Plan" value={farm.plan} />
        <Info label="Users" value={farm.users} />
        <Info label="Country" value={farm.country} />
        <Info label="Created" value={farm.createdAt} />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => navigate(`/owner/farm/management/details/${farm.id}`)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-50 text-indigo-600 py-2 text-sm font-medium hover:bg-indigo-100 cursor-pointer"
        >
          <Eye size={16} />
          View Details
        </button>

        {farm.status !== "Trial" && onStatusChange && (
          <button
            onClick={() => onStatusChange?.(farm.id)}
            className={`p-2 rounded-lg border transition cursor-pointer
              ${
                farm.status === "Active"
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-green-600 hover:bg-green-50"
              }
            `}
          >
            {farm.status === "Active" ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="text-[#0A0A0A]">{value}</p>
  </div>
);

export default React.memo(FarmCard);

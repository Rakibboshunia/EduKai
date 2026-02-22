import StatusBadge from "./StatusBadge";
import DummyCVViewer from "./DummyCVViewer";
import {
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CVCard({
  data,
  onStatusChange,
  onAvailabilityChange,
}) {
  const navigate = useNavigate();
  const [openCV, setOpenCV] = useState(false);

  const {
    name,
    email,
    phone,
    experience,
    skills = [],
    status,
    reviewType,
    availability,
    createdAt,
  } = data;

  const qualityOptions = {
    passed: {
      label: "Quality Passed",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    failed: {
      label: "Quality Failed",
      icon: XCircle,
      className: "bg-red-100 text-red-700",
    },
    manual_review: {
      label: "Manual Review",
      icon: AlertCircle,
      className: "bg-yellow-100 text-yellow-700",
    },
  };

  const availabilityOptions = {
    available: {
      label: "Available",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    not_available: {
      label: "Not Available",
      icon: XCircle,
      className: "bg-red-100 text-red-700",
    },
  };

  const finalStatus =
    status === "failed" && reviewType === "manual"
      ? "manual_review"
      : status;

  /* 🔵 Generate CV */
  const handleGenerateCV = () => {
    navigate("/ai/re-writer", {
      state: { candidate: data },
    });
  };

  /* ⚪ View Original CV */
  const handleViewCV = () => {
    setOpenCV(true);
  };

  return (
    <>
      <div className="bg-white/60 text-black rounded-2xl p-6 border border-gray-300">

        {/* Header */}
        <div className="flex justify-between items-start pb-2">
          <div className="space-y-2">
            <h3 className="text-blue-600 font-semibold">{name}</h3>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail size={16} /> {email}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={16} /> {phone}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Briefcase size={16} /> Experience: {experience} years
            </div>
          </div>

          <div className="text-xs text-gray-500">{createdAt}</div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <p className="text-sm text-black mb-2">Skills</p>
          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-[#E8EDFB] rounded-full text-sm text-black"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex gap-3 flex-wrap items-center">
          <StatusBadge
            value={finalStatus}
            options={qualityOptions}
            onChange={onStatusChange}
          />

          {availability && (
            <StatusBadge
              value={availability}
              options={availabilityOptions}
              onChange={onAvailabilityChange}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={handleGenerateCV}
            className="px-6 py-2 rounded-xl text-sm bg-[#2D468A] text-white hover:bg-[#243a73] cursor-pointer"
          >
            Generate CV
          </button>

          <button
            onClick={handleViewCV}
            className="px-6 py-2 border rounded-xl text-sm text-gray-600 hover:bg-[#2D468A] hover:text-white cursor-pointer transition"
          >
            View CV
          </button>
        </div>
      </div>

      {/* Dummy CV Modal */}
      <DummyCVViewer
        open={openCV}
        onClose={() => setOpenCV(false)}
        candidate={data}
      />
    </>
  );
}
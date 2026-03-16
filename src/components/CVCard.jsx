import StatusBadge from "./StatusBadge";
import {
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getCandidateById } from "../api/candidateApi";

export default function CVCard({
  data,
  onStatusChange,
  onAvailabilityChange,
}) {

  const navigate = useNavigate();

  const {
    name,
    email,
    phone,
    experience,
    skills = [],
    status,
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

  const showGenerateCV = status === "passed";

  const handleGenerateCV = () => {
    navigate("/ai/re-writer", {
      state: { candidate: data },
    });
  };

  const handleViewCV = async () => {

    try {

      const res = await getCandidateById(data.id);

      if (!res.original_cv_url) {
        alert("CV not available");
        return;
      }

      window.open(res.original_cv_url, "_blank");

    } catch (error) {
      console.error("CV fetch error:", error);
    }

  };

  return (
    <div className="bg-white/60 text-black rounded-2xl p-6 border border-gray-300">

      <div className="flex justify-between items-start pb-2">

        <div className="space-y-2">

          <h3 className="text-blue-600 font-semibold">
            {name}
          </h3>

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

        <div className="text-xs text-gray-500">
          {createdAt}
        </div>

      </div>

      <div className="mt-4">

        <p className="text-sm mb-2">
          Skills
        </p>

        <div className="flex gap-2 flex-wrap">

          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-[#E8EDFB] rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      <div className="mt-4 flex gap-3 flex-wrap items-center">

        <StatusBadge
          value={status}
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

      <div className="mt-5 flex justify-end gap-3">

        {showGenerateCV && (
          <button
            onClick={handleGenerateCV}
            className="px-2 py-1 rounded-xl text-sm bg-[#2D468A] text-white hover:bg-[#1B2A5B] cursor-pointer transition-all"
          >
            Generate CV
          </button>
        )}

        <button
          onClick={handleViewCV}
          className="px-2 py-1 border rounded-xl text-sm text-gray-600 hover:bg-[#2D468A] hover:text-white cursor-pointer transition-all"
        >
          View CV
        </button>

      </div>

    </div>
  );
}
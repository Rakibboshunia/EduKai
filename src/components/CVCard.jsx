import { useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getCandidateById } from "../api/candidateApi";
import toast from "react-hot-toast";

export default function CVCard({
  data,
  onStatusChange,
  onAvailabilityChange,
}) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const {
    name,
    name_without_surname,
    email,
    phone,
    experience,
    skills = [],
    status,
    availability,
    createdAt,
    photo,
    location,
    job_titles = [],
  } = formData;

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

  /* ================= HANDLERS ================= */

  const handleGenerateCV = () => {
    navigate("/ai/re-writer", {
      state: { candidate: data },
    });
  };

  const handleViewCV = async () => {
    try {
      const res = await getCandidateById(data.id);

      if (!res.original_cv_url) {
        toast.error("CV not available");
        return;
      }

      window.open(res.original_cv_url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      skills: value.split(",").map((s) => s.trim()),
    }));
  };

  const handleJobTitlesChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      job_titles: value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Updated locally (connect API to persist)");
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white/60 text-black rounded-2xl p-6 border border-gray-300">

      <div className="flex justify-between items-start pb-2">

        <div className="space-y-2">

          {/* NAME + IMAGE */}
          <div className="flex items-center gap-3">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#2D468A] text-white flex items-center justify-center">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div className="flex flex-col gap-1">

              {isEditing ? (
                <>
                  <input
                    value={name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    value={name_without_surname || ""}
                    onChange={(e) =>
                      handleChange(
                        "name_without_surname",
                        e.target.value
                      )
                    }
                    placeholder="Name without surname"
                    className="border px-2 py-1 rounded text-xs"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-blue-600 font-semibold">
                    {name}
                  </h3>

                  {name_without_surname && (
                    <p className="text-xs text-gray-500">
                      ({name_without_surname})
                    </p>
                  )}
                </>
              )}

            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} />
            {isEditing ? (
              <input
                value={email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              email
            )}
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} />
            {isEditing ? (
              <input
                value={phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              phone
            )}
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            {isEditing ? (
              <input
                value={location || ""}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              location || "No location"
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="flex items-center gap-2 text-sm">
            <Briefcase size={16} />
            {isEditing ? (
              <input
                value={experience}
                onChange={(e) =>
                  handleChange("experience", e.target.value)
                }
                className="border px-2 py-1 rounded w-20"
              />
            ) : (
              `Experience: ${experience} years`
            )}
          </div>

          {/* JOB TITLES */}
          <div className="text-sm text-gray-700">
            {isEditing ? (
              <input
                value={job_titles.join(", ")}
                onChange={(e) =>
                  handleJobTitlesChange(e.target.value)
                }
                className="border px-2 py-1 rounded w-full"
                placeholder="Job titles (comma separated)"
              />
            ) : (
              job_titles.length > 0 && `💼 ${job_titles.join(", ")}`
            )}
          </div>

        </div>

        <div className="text-xs text-gray-500">{createdAt}</div>

      </div>

      {/* SKILLS */}
      <div className="mt-4">
        <p className="text-sm mb-2">Skills</p>

        {isEditing ? (
          <input
            value={skills.join(", ")}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Skills (comma separated)"
          />
        ) : (
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
        )}
      </div>

      {/* STATUS */}
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

      {/* ACTIONS */}
      <div className="mt-5 flex justify-end gap-3">

        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-600 text-white rounded-xl"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-red-500 text-white rounded-xl"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 border rounded-xl text-sm"
            >
              Edit
            </button>

            {showGenerateCV && (
              <button
                onClick={handleGenerateCV}
                className="px-2 py-1 rounded-xl text-sm bg-[#2D468A] text-white"
              >
                Generate CV
              </button>
            )}

            <button
              onClick={handleViewCV}
              className="px-2 py-1 border rounded-xl text-sm"
            >
              View CV
            </button>
          </>
        )}

      </div>

    </div>
  );
}
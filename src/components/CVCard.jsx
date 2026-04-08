import { useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  MapPin,
  Trash2,
  Clock,
  Eye,
  Camera,
  Loader2,
} from "lucide-react";
import { useRef } from "react";

import { useNavigate } from "react-router-dom";
import { getCandidateById, deleteCandidate, updateCandidateStatus } from "../api/candidateApi";
import toast from "react-hot-toast";

export default function CVCard({ data, onStatusChange, onAvailabilityChange, onDelete }) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState(data);
  const fileInputRef = useRef(null);

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
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-gray-100 text-gray-700",
    },
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
    manual: {
      label: "Manual Review",
      icon: Eye,
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Upload photo separately if it was changed during this edit session
      if (formData.new_photo_file) {
        const fd = new FormData();
        fd.append("profile_photo", formData.new_photo_file);
        await updateCandidateStatus(data.id, fd);
      }

      // Only send fields that actually changed to avoid backend validation errors (like unique email)
      const payload = {};
      if (formData.name !== data.name) payload.name = formData.name;
      if (formData.name_without_surname !== data.name_without_surname) {
        payload.name_without_surname = formData.name_without_surname ? formData.name_without_surname.trim().split(" ").pop() : "";
      }
      if (formData.email !== data.email) payload.email = formData.email;
      if (formData.phone !== data.phone) payload.whatsapp_number = formData.phone;
      if (Number(formData.experience) !== Number(data.experience)) payload.years_of_experience = formData.experience;
      if (formData.location !== data.location) payload.location = formData.location;

      const origSkills = Array.isArray(data.skills) ? data.skills.join(",") : "";
      const newSkills = Array.isArray(formData.skills) ? formData.skills.join(",") : "";
      if (origSkills !== newSkills) payload.skills = formData.skills;

      const origTitles = Array.isArray(data.job_titles) ? data.job_titles.join(",") : "";
      const newTitles = Array.isArray(formData.job_titles) ? formData.job_titles.join(",") : "";
      if (origTitles !== newTitles) payload.job_titles = formData.job_titles;

      if (Object.keys(payload).length > 0) {
        await updateCandidateStatus(data.id, payload);
      } else if (!formData.new_photo_file) {
        // Nothing changed at all
        setIsEditing(false);
        setIsSaving(false);
        return;
      }
      setFormData((prev) => ({ 
        ...prev, 
        photo: prev.photo_preview || prev.photo,
        new_photo_file: null,
        photo_preview: null
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCandidate(data.id);
      toast.success("Candidate deleted successfully");
      if (onDelete) {
        onDelete(data.id);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete candidate");
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  const handleQualityChange = async (newVal) => {
    try {
      await updateCandidateStatus(data.id, { quality_status: newVal });
      setFormData((prev) => ({ ...prev, status: newVal }));
      toast.success("Quality status updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update quality status");
      throw e;
    }
  };

  const handleAvailabilityChange = async (newVal) => {
    try {
      await updateCandidateStatus(data.id, { availability_status: newVal });
      setFormData((prev) => ({ ...prev, availability: newVal }));
      toast.success("Availability updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update availability");
      throw e;
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      new_photo_file: file,
      photo_preview: URL.createObjectURL(file)
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= UI ================= */

  // the image to show: preview if available, else saved photo
  const currentPhoto = formData.photo_preview || photo;

  return (
    <div className="bg-white/60 text-black rounded-2xl p-6 border border-gray-300">
      <div className="flex justify-between items-start pb-2">
        <div className="space-y-2">
          {/* NAME + IMAGE */}
          <div className="flex items-center gap-3">
            <div 
              className={`relative w-10 h-10 rounded-full ${isEditing ? "group cursor-pointer" : ""}`}
              onClick={() => isEditing && fileInputRef.current?.click()}
              title={isEditing ? "Click to upload profile photo" : ""}
            >
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={name}
                  className={`w-10 h-10 rounded-full object-cover border ${isEditing ? "group-hover:opacity-70 transition-opacity" : ""}`}
                />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-[#2D468A] text-white flex items-center justify-center ${isEditing ? "group-hover:opacity-70 transition-opacity" : ""}`}>
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} className="text-white" />
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoSelect}
              />
            </div>

            <div className="flex flex-col gap-1">
              {isEditing ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    value={name_without_surname || ""}
                    onChange={(e) =>
                      handleChange("name_without_surname", e.target.value)
                    }
                    placeholder="Name without surname"
                    className="border px-2 py-1 rounded text-xs"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-blue-600 font-semibold">{name}</h3>

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
                onChange={(e) => handleChange("email", e.target.value)}
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
                onChange={(e) => handleChange("phone", e.target.value)}
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
                onChange={(e) => handleChange("location", e.target.value)}
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
                onChange={(e) => handleChange("experience", e.target.value)}
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
                onChange={(e) => handleJobTitlesChange(e.target.value)}
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
          value={status || "pending"}
          options={qualityOptions}
          onChange={handleQualityChange}
        />

        <StatusBadge
          value={availability || "not_available"}
          options={availabilityOptions}
          onChange={handleAvailabilityChange}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex flex-wrap justify-between gap-3">
  {isEditing ? (
    <>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isSaving ? "⏳ Saving..." : "✅ Save"}
      </button>

      <button
        onClick={handleCancel}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        ❌ Cancel
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        ✏️ Edit
      </button>

      {showGenerateCV && (
        <button
          onClick={handleGenerateCV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-[#2D468A] to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          ⚡ Generate CV
        </button>
      )}

      <button
        onClick={handleViewCV}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white hover:bg-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        👁️ View CV
      </button>

      {isConfirmingDelete ? (
        <div className="flex items-center gap-2 px-3 py-1.5 border border-red-300 rounded-xl text-sm bg-red-50 text-red-600 shadow-sm animate-in fade-in zoom-in duration-200">
          <span className="font-medium">Sure to delete?</span>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm text-xs cursor-pointer disabled:opacity-50"
          >
             {isDeleting ? "⏳" : "Yes"}
          </button>
          <button 
            onClick={() => setIsConfirmingDelete(false)}
            disabled={isDeleting}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition shadow-sm text-xs cursor-pointer disabled:opacity-50"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsConfirmingDelete(true)}
          className="flex items-center gap-2 px-4 py-2 border border-red-300 rounded-xl text-sm bg-red-50 text-red-600 hover:bg-red-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <Trash2 size={16} />
          Delete
        </button>
      )}
    </>
  )}
</div>
    </div>
  );
}

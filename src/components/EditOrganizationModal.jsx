import { useEffect, useState } from "react";
import InputField from "./InputField";

const EditOrganizationModal = ({ open, organization, onClose, onSave }) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPerson: "",
    industry: "",
    phase: "",
    jobTitle: "",
    location: "",
    radius: "",
    skills: "",
  });

  /* -------- Load organization data -------- */
  useEffect(() => {

    if (organization) {
      setFormData({
        name: organization.name || "",
        email: organization.email || "",
        contactPerson: organization.contactPerson || "",
        industry: organization.industry || "",
        phase: organization.phase || "",
        jobTitle: organization.jobTitle || "",
        location: organization.location || "",
        radius: organization.radius || "",
        skills: organization.skills?.join(", ") || "",
      });
    }

  }, [organization]);

  if (!open) return null;

  /* -------- Input Change -------- */
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* -------- Save -------- */
  const handleSubmit = (e) => {

    e.preventDefault();

    onSave({
      ...organization,
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    onClose();

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white w-full max-w-3xl rounded-xl p-8 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold text-[#2D468A]">
            Edit Organization
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl cursor-pointer"
          >
            ✕
          </button>

        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <InputField
            label="Organization Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />

          <InputField
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />

          <InputField
            label="Phase"
            name="phase"
            value={formData.phase}
            onChange={handleChange}
          />

          <InputField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
          />

          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <InputField
            label="Radius"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
          />

          <div className="col-span-2">

            <InputField
              label="Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js"
            />

          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black hover:bg-[#40599c] border border-gray-300 rounded-md hover:text-white cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#2D468B] text-white rounded-md hover:bg-[#40599c] cursor-pointer"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditOrganizationModal;
import { useEffect, useState } from "react";
import InputField from "./InputField";

const EditOrganizationModal = ({ open, organization, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    location: "",
    skills: "",
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        email: organization.email || "",
        industry: organization.industry || "",
        location: organization.location || "",
        skills: organization.skills?.join(", ") || "",
      });
    }
  }, [organization]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...organization,
      name: formData.name,
      email: formData.email,
      industry: formData.industry,
      location: formData.location,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg p-10 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold text-[#2D468A]">
            Edit Organization
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Organization Name"
            name="name"
            type="text"
            placeholder="Enter organization name"
            value={formData.name}
            onChange={handleChange}
            inputClass="border border-gray-300"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            inputClass="border border-gray-300"
          />

          <InputField
            label="Industry"
            name="industry"
            type="text"
            placeholder="Enter industry"
            value={formData.industry}
            onChange={handleChange}
            inputClass="border border-gray-300"
          />

          <InputField
            label="Location"
            name="location"
            type="text"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            inputClass="border border-gray-300"
          />

          <InputField
            label="Skills"
            name="skills"
            type="text"
            placeholder="JavaScript, React, Node.js"
            value={formData.skills}
            onChange={handleChange}
            inputClass="border border-gray-300"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#2D468B] text-white rounded-md hover:bg-[#354e92] cursor-pointer"
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

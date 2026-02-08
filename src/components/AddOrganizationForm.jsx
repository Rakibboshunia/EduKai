import { useState } from "react";
import InputField from "./InputField";
import { FiPlus } from "react-icons/fi";

const AddOrganizationForm = ({
  initialValues = {
    name: "",
    email: "",
    industry: "",
    location: "",
    skills: "",
  },
  submitLabel = "Add Organization",
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Organization Name *"
        name="name"
        type="text"
        placeholder="Enter organization name"
        value={formData.name}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <InputField
        label="Email Name *"
        name="email"
        type="email"
        placeholder="Enter organization email"
        value={formData.email}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Industry *"
          name="industry"
          type="text"
          placeholder="Enter industry name"
          value={formData.industry}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <InputField
          label="Location *"
          name="location"
          type="text"
          placeholder="Enter location name"
          value={formData.location}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />
      </div>

      <InputField
        label="Skill Requirements (comma separated)"
        name="skills"
        type="text"
        placeholder="e.g. JavaScript, React, Node.js"
        value={formData.skills}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          className="bg-[#2D468B] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#354e90] cursor-pointer"
        >
          <FiPlus />
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-md border border-gray-300 text-black hover:text-white hover:bg-[#2D468B]  cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddOrganizationForm;

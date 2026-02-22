import { useState } from "react";
import InputField from "./InputField";
import { FiPlus } from "react-icons/fi";

const AddOrganizationForm = ({
  initialValues = {
    name: "",
    email: "",
    contactPerson: "",
    phase: "Active",
    industry: "",
    location: "",
    jobTitle: "",
    radius: "0 km",
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Organization Name */}
      <InputField
        label="Organization Name *"
        name="name"
        type="text"
        placeholder="Enter organization name"
        value={formData.name}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      {/* Email */}
      <InputField
        label="Email Name *"
        name="email"
        type="email"
        placeholder="Enter organization email"
        value={formData.email}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      {/* Contact Person + Phase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Contact Person *"
          name="contactPerson"
          type="text"
          placeholder="Enter contact person name"
          value={formData.contactPerson}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <div>
          <label className="block mb-1 font-medium">
            Phase *
          </label>
          <select
            name="phase"
            value={formData.phase}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Industry + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* Job Title + Radius */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Add job title *"
          name="jobTitle"
          type="text"
          placeholder="Enter job title"
          value={formData.jobTitle}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <div>
          <label className="block mb-1 font-medium">
            Radius *
          </label>
          <select
            name="radius"
            value={formData.radius}
            onChange={handleChange}
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2 cursor-pointer"
          >
            <option value="0 km">0 km</option>
            <option value="5 km">5 km</option>
            <option value="10 km">10 km</option>
            <option value="20 km">20 km</option>
          </select>
        </div>

      </div>

      <InputField
          label="Skills Requirements *"
          name="Skills"
          type="text"
          placeholder="e.g Javascript, React, Vue.js"
          value={formData.jobTitle}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

      {/* Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          className="bg-[#2D468B] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#354e90] transition cursor-pointer"
        >
          <FiPlus />
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-md border border-gray-300 text-black hover:bg-[#2D468B] hover:text-white transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddOrganizationForm;
import { useState } from "react";
import InputField from "./InputField";
import { FiPlus } from "react-icons/fi";

const AddContactForm = ({
  initialValues = {
    contact_person: "",
    job_title: "",
    work_email: "",
  },
  submitLabel = "Add Contact",
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

  if (!formData.contact_person || !formData.work_email) {
    alert("Contact Person & Email required");
    return;
  }

  onSubmit(formData);
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <InputField
        label="Contact Person *"
        name="contact_person"
        type="text"
        placeholder="Enter contact person name"
        value={formData.contact_person}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <InputField
        label="Work Email *"
        name="work_email"
        type="email"
        placeholder="Enter work email"
        value={formData.work_email}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <InputField
        label="Job Title *"
        name="job_title"
        type="text"
        placeholder="Enter job title"
        value={formData.job_title}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

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

export default AddContactForm;
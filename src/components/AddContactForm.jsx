"use client";
import { useState } from "react";
import InputField from "./InputField";
import { FiPlus } from "react-icons/fi";
import OrganizationSelect from "./OrganizationSelect";

const AddContactForm = ({
  initialValues = {
    contact_person: "",
    job_title: "",
    work_email: "",
    organization: "",
  },
  submitLabel = "Add Contact",
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialValues);

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

      {/* 🔥 Organization Select */}
      <div>
        <label className="block text-black mb-1 text-sm font-medium">
          Organization Name*
        </label>

        <OrganizationSelect
          value={formData.organization}
          className=" text-black "
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              organization: selected ? selected.value : "",
            }))
          }
        />
      </div>

      <InputField
        label="Contact Person *"
        name="contact_person"
        type="text"
        placeholder="Enter contact person name"
        value={formData.contact_person}
        onChange={(e) =>
          setFormData({ ...formData, contact_person: e.target.value })
        }
        inputClass="border border-gray-300"
      />

      <InputField
        label="Work Email *"
        name="work_email"
        type="email"
        placeholder="Enter work email"
        value={formData.work_email}
        onChange={(e) =>
          setFormData({ ...formData, work_email: e.target.value })
        }
        inputClass="border border-gray-300"
      />

      <InputField
        label="Job Title *"
        name="job_title"
        type="text"
        placeholder="Enter job title"
        value={formData.job_title}
        onChange={(e) =>
          setFormData({ ...formData, job_title: e.target.value })
        }
        inputClass="border border-gray-300"
      />

      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          className="bg-[#2D468B] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#354e90] transition"
        >
          <FiPlus />
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-md border border-gray-300 text-black hover:bg-[#2D468B] hover:text-white transition"
        >
          Cancel
        </button>
      </div>

    </form>
  );
};

export default AddContactForm;
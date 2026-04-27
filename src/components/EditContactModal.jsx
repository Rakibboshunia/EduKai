import { useEffect, useState } from "react";
import InputField from "./InputField";

const EditContactModal = ({
  open,
  contact,
  onClose,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    contact_person: "",
    job_title: "",
    work_email: "",
  });

  /* -------- Load Data -------- */
  useEffect(() => {
    if (contact) {
      setFormData({
        contact_person: contact.contact_person || "",
        job_title: contact.job_title || "",
        work_email: contact.work_email || "",
      });
    }
  }, [contact]);

  if (!open) return null;

  /* -------- Handle Change -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------- Submit -------- */
  const handleSubmit = (e) => {
  e.preventDefault();

  onSave({
    ...contact,
    contact_person: formData.contact_person,
    job_title: formData.job_title,
    work_email: formData.work_email,
  });

  onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white w-full max-w-lg rounded-xl p-8 shadow-lg">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold text-brand-primary">
            Edit Contact
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
          />

          <InputField
            label="Work Email"
            name="work_email"
            type="email"
            value={formData.work_email}
            onChange={handleChange}
          />

          <InputField
            label="Job Title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-md hover:shadow-lg transition font-bold"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditContactModal;
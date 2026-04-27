import { useEffect, useState } from "react";
import InputField from "./InputField";

const EditOrganizationModal = ({
  open,
  organization,
  onClose,
  onSave,
}) => {

  const [formData, setFormData] = useState({
    urn: "",
    name: "",
    local_authority: "",
    phase: "",
    gender: "",
    telephone: "",
    street: "",
    address_line_1: "",
    address_line_2: "",
    town: "",
    county: "",
    postcode: "",
  });

  /* -------- Load Data -------- */
  useEffect(() => {
    if (organization) {
      setFormData({
        urn: organization.urn || "",
        name: organization.name || "",
        local_authority: organization.local_authority || "",
        phase: organization.phase || "",
        gender: organization.gender || "",
        telephone: organization.telephone || "",
        street: organization.street || "",
        address_line_1: organization.address_line_1 || "",
        address_line_2: organization.address_line_2 || "",
        town: organization.town || "",
        county: organization.county || "",
        postcode: organization.postcode || "",
      });
    }
  }, [organization]);

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
      ...organization,
      ...formData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-xl p-8 shadow-lg">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold text-brand-primary">
            Edit Organization
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <InputField label="URN" name="urn" value={formData.urn} onChange={handleChange} />
          <InputField label="Organization Name" name="name" value={formData.name} onChange={handleChange} />

          <InputField label="Local Authority" name="local_authority" value={formData.local_authority} onChange={handleChange} />
          <InputField label="Phase" name="phase" value={formData.phase} onChange={handleChange} />

          <InputField label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
          <InputField label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} />

          <InputField label="Street" name="street" value={formData.street} onChange={handleChange} />
          <InputField label="Postcode" name="postcode" value={formData.postcode} onChange={handleChange} />

          <InputField label="Address Line 1" name="address_line_1" value={formData.address_line_1} onChange={handleChange} />
          <InputField label="Address Line 2" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />

          <InputField label="Town" name="town" value={formData.town} onChange={handleChange} />
          <InputField label="County" name="county" value={formData.county} onChange={handleChange} />

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 pt-4">

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

export default EditOrganizationModal;
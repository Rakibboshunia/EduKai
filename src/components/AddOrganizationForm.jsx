import { useState } from "react";
import InputField from "./InputField";
import { FiPlus } from "react-icons/fi";

const AddOrganizationForm = ({
  initialValues = {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField
        label="URN *"
        name="urn"
        type="text"
        placeholder="Enter URN"
        value={formData.urn}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />

      <InputField
        label="Organization Name *"
        name="name"
        type="text"
        placeholder="Enter organization name"
        value={formData.name}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Local Authority *"
          name="local_authority"
          type="text"
          placeholder="Enter local authority"
          value={formData.local_authority}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <InputField
          label="Phase *"
          name="phase"
          type="text"
          placeholder="Enter phase"
          value={formData.phase}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Gender *"
          name="gender"
          type="text"
          placeholder="Enter gender"
          value={formData.gender}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <InputField
          label="Telephone *"
          name="telephone"
          type="text"
          placeholder="Enter telephone"
          value={formData.telephone}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField
        label="Street *"
        name="street"
        type="text"
        placeholder="Enter street"
        value={formData.street}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />
      
      <InputField
        label="Postcode *"
        name="postcode"
        type="text"
        placeholder="Enter postcode"
        value={formData.postcode}
        onChange={handleChange}
        inputClass="border border-gray-300"
      />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Address Line 1"
          name="address_line_1"
          type="text"
          placeholder="Enter address line 1"
          value={formData.address_line_1}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <InputField
          label="Address Line 2"
          name="address_line_2"
          type="text"
          placeholder="Enter address line 2"
          value={formData.address_line_2}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Town *"
          name="town"
          type="text"
          placeholder="Enter town"
          value={formData.town}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />

        <InputField
          label="County"
          name="county"
          type="text"
          placeholder="Enter county"
          value={formData.county}
          onChange={handleChange}
          inputClass="border border-gray-300"
        />
      </div>

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
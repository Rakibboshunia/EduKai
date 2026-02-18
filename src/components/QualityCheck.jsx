import React from "react";
import Dropdown from "./Dropdown";
import InputField from "./InputField";

const QualityCheck = () => {
  return (
    <div className="bg-white/60 p-8 rounded-xl">
      <h3 className="text-[#2D468A] text-2xl font-semibold">
        Automated Quality Check Rules
      </h3>

      {/* ===== Main Grid ===== */}
      <div className="mt-6 grid grid-cols-12 gap-6">

        {/* Experience */}
        <Dropdown
          label="Minimum Years of Experience"
          placeholder="Select Experience"
          options={["1", "2", "3", "4", "5"]}
          inputClass="border border-[#D9D9D9] rounded-lg w-full"
          className="col-span-12 md:col-span-6"
        />

        {/* Required Skills */}
        <InputField
          label="Required Skills (comma separated)"
          labelClass="font-semibold"
          type="text"
          placeholder="e.g. JavaScript, React, Node.js"
          className="col-span-12 md:col-span-6"
          inputClass="rounded-lg"
        />

        {/* Primary Role */}
        <InputField
          label="Current Job Role"
          labelClass="font-semibold"
          type="text"
          placeholder="e.g. Math Teacher, English Teacher"
          className="col-span-12 md:col-span-6"
          inputClass="rounded-lg"
        />

        {/* Secondary Role */}
        <InputField
          label="Current Location"
          labelClass="font-semibold"
          type="text"
          placeholder="e.g. M10, Block-B, Rumpura, Dhaka"
          className="col-span-12 md:col-span-6"
          inputClass="rounded-lg"
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 mt-8">
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 accent-[#2D468A]"
        />
        <p className="text-black text-sm">
          Check formatting and completeness
        </p>
      </div>
    </div>
  );
};

export default QualityCheck;

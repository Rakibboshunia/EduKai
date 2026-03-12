import React from "react";
import Dropdown from "./Dropdown";
import InputField from "./InputField";

const QualityCheck = ({
  experience,
  setExperience,
  skills,
  setSkills,
  jobRole,
  setJobRole,
}) => {

  return (
    <div className="bg-white/60 p-8 rounded-xl">

      <h3 className="text-[#2D468A] text-2xl font-semibold">
        Automated Quality Check Rules
      </h3>

      <div className="mt-6 grid grid-cols-12 gap-6">

        <Dropdown
          label="Minimum Years of Experience**"
          placeholder="Select Experience"
          options={["1", "2", "3", "4", "5"]}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="col-span-12 md:col-span-6"
        />

        <InputField
          label="Required Skills (comma separated)**"
          type="text"
          placeholder="e.g. React, Node.js"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="col-span-12 md:col-span-6"
        />

        <InputField
          label="Job Role**"
          type="text"
          placeholder="e.g. Math Teacher"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="col-span-12 md:col-span-6"
        />

      </div>

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
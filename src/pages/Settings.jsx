import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import Password from "../components/Password";

const Settings = () => {
  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <Breadcrumb />

        {/* Optional subtitle (kept commented as before) */}
        {/*
        <p className="text-black/70 text-sm md:text-base mt-1.5">
          Configure settings for Farm check
        </p>
        */}
      </div>

      {/* ================= FORM ================= */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-5 mt-10">
        {/* First Name */}
        <InputField
          label="First Name"
          name="first_name"
          type="text"
          placeholder="Your First Name"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
        />

        {/* Last Name */}
        <InputField
          label="Last Name"
          name="last_name"
          type="text"
          placeholder="Your Last Name"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
        />

        {/* Gender */}
        <Dropdown
          label="Gender"
          placeholder="Select Gender"
          className="col-span-12 md:col-span-6"
          inputClass="text-black"
          options={["Male", "Female", "Other"]}
        />

        {/* Country */}
        <Dropdown
          label="Country"
          placeholder="Select Country"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
          options={["USA", "Canada", "UK", "Australia"]}
        />

        {/* Language */}
        <Dropdown
          label="Language"
          placeholder="Select Language"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
          options={["English", "Spanish", "French", "German"]}
        />

        {/* Time Zone */}
        <Dropdown
          label="Time Zone"
          placeholder="Select Time Zone"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
          options={["GMT", "EST", "PST", "CST"]}
        />

        {/* Password */}
        <Password
          label="Password"
          name="password"
          placeholder="Enter your password"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
        />

        {/* Confirm Password */}
        <Password
          label="Confirm Password"
          name="confirm_password"
          placeholder="Confirm your password"
          className="col-span-12 md:col-span-6"
          inputClass="bg-white"
        />
      </div>
    </div>
  );
};

export default Settings;

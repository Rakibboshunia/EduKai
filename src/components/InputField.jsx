import React from "react";

const InputField = ({
  label,
  className,
  placeholder,
  inputClass,
  labelClass,
  value,
  onChange,
  type,
  name,          // ✅ ADD THIS
}) => {
  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      <label className={`font-inter text-[#000000] ${labelClass}`}>
        {label}
      </label>

      <input
        type={type}
        name={name}          // ✅ ADD THIS
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`outline-none p-4 text-[#000000] placeholder:text-[#0A0A0A]/50 rounded-lg focus:ring-2 focus:ring-[#2D468A] ${inputClass}`}
      />
    </div>
  );
};

export default InputField;

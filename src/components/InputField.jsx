import React from "react";

const InputField = ({
  label,
  className = "",
  placeholder = "",
  inputClass = "",
  labelClass = "",
  value,
  onChange,
  type = "text",
  name,
}) => {
  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      {label && (
        <label className={`font-inter text-black ${labelClass}`}>
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`outline-none p-2 text-black placeholder:text-black/50 rounded-lg 
        focus:ring-2 focus:ring-[#2D468A] bg-white border border-gray-300 ${inputClass}`}
      />
    </div>
  );
};

export default InputField;

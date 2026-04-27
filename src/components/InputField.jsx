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
  disabled = false,
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
        disabled={disabled}
        className={`outline-none p-3 text-black placeholder:text-black/40 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary bg-white border border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm ${inputClass}`}
      />
    </div>
  );
};

export default InputField;

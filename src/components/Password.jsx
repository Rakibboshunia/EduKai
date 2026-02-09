"use client";
import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const Password = ({
  label,
  placeholder = "",
  className = "",
  labelClass = "",
  icon = "",
  inputClass = "",
  value,
  onChange,
  name,
}) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className={`font-inter text-black ${labelClass}`}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type={showPass ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full outline-none p-4 text-black placeholder:text-black/50 
          font-inter text-[16px] rounded-lg bg-white ${inputClass}`}
          aria-label={label || "password"}
          autoComplete={name === "password" ? "new-password" : "off"}
        />

        <button
          type="button"
          onClick={() => setShowPass((s) => !s)}
          aria-pressed={showPass}
          aria-label={showPass ? "Hide password" : "Show password"}
          className={`w-8 h-8 flex items-center justify-center absolute 
          top-1/2 -translate-y-1/2 right-3 text-black ${icon}`}
        >
          {showPass ? (
            <IoEyeOutline className="w-5 h-5" />
          ) : (
            <FaRegEyeSlash className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Password;

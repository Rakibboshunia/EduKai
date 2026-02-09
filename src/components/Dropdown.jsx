"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Dropdown = ({
  label = "",
  placeholder = "",
  options = [],
  value = null,
  onSelect,
  className = "",
  inputClass = "",
  optionClass = "",
  labelClass = "",
}) => {
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value && options.length) {
      const found =
        options.find(
          (o) => typeof o === "object" && o.value === value
        ) || value;
      setSelected(found);
    }
  }, [value, options]);

  const handleSelect = (item) => {
    setSelected(item);
    setShow(false);
    if (onSelect) {
      onSelect(typeof item === "object" ? item.value : item);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue =
    selected && typeof selected === "object"
      ? selected.label
      : selected ?? "";

  return (
    <div ref={dropdownRef} className={`relative text-black ${className} `}>
      {label && (
        <label className={`block mb-2 text-sm text-gray-800 ${labelClass}`}>
          {label}
        </label>
      )}

      <div onClick={() => setShow((s) => !s)} className="relative cursor-pointer">
        <input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={`w-full outline-none p-4 
          bg-[#F9FAFB] text-gray-900 placeholder:text-gray-400
          rounded-lg border border-gray-300 ${inputClass}`}
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600">
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </div>
      </div>

      <div
        className={`absolute left-0 top-[105%] w-full bg-white border border-gray-300 
        rounded-md shadow-md z-30 transition-all ${optionClass} ${
          show
            ? "opacity-100 visible max-h-52 overflow-auto"
            : "opacity-0 invisible max-h-0 overflow-hidden"
        }`}
      >
        {options.map((item, index) => {
          const label =
            typeof item === "object" ? item.label : item;

          return (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer text-gray-900 hover:bg-[#015093] hover:text-white"
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;

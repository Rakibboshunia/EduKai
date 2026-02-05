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
        ) || null;
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      : selected || "";

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className={`text-sm text-black ${labelClass}`}>
          {label}
        </label>
      )}

      <div onClick={() => setShow(!show)} className="relative">
        <input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={`w-full cursor-pointer outline-none ${inputClass}`}
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-3">
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </div>
      </div>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 top-[105%] w-full bg-white border border-gray-300 rounded-md shadow-md z-30 transition-all ${optionClass} ${
          show
            ? "opacity-100 visible max-h-52 overflow-auto"
            : "opacity-0 invisible max-h-0 overflow-hidden"
        }`}
      >
        {options.map((item, index) => {
          const label =
            typeof item === "object" ? item.label : item;
          const cls =
            typeof item === "object" ? item.className : "";

          return (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className={`px-4 py-2 cursor-pointer hover:bg-[#015093] hover:text-white ${cls}`}
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

import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Dropdown = ({
  label = "",
  placeholder = "",
  options = [],
  value = "",
  onSelect,
  disabled = false,
  className = "",
}) => {

  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (item) => {

    const val = typeof item === "object" ? item.value : item;

    setSelected(val);
    setShow(false);

    if (onSelect) {
      onSelect(val);
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

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>

      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setShow(!show)}
        className={`relative cursor-pointer group ${disabled ? "opacity-50" : ""}`}
      >

        <input
          readOnly
          value={selected}
          placeholder={placeholder}
          className="w-full outline-none px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm transition-all text-sm text-gray-800 cursor-pointer group-hover:border-gray-300"
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 group-hover:text-gray-600 transition-colors">
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </div>

      </div>

      {show && (
        <div className="absolute left-0 top-[105%] w-full bg-white border border-gray-100 rounded-xl shadow-lg z-30 max-h-52 overflow-auto py-1 animate-in fade-in zoom-in-95 duration-200">

          {options.map((item, index) => {

            const label =
              typeof item === "object" ? item.label : item;

            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2.5 cursor-pointer text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-brand-primary transition-colors"
              >
                {label}
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Dropdown;
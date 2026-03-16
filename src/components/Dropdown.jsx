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
        <label className="block mb-2 text-sm text-gray-800">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setShow(!show)}
        className={`relative cursor-pointer ${disabled ? "opacity-50" : ""}`}
      >

        <input
          readOnly
          value={selected}
          placeholder={placeholder}
          className="w-full outline-none p-2 bg-[#F9FAFB] rounded-lg border border-gray-300"
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-3">
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </div>

      </div>

      {show && (
        <div className="absolute left-0 top-[105%] w-full bg-white border border-gray-300 rounded-md shadow-md z-30 max-h-52 overflow-auto">

          {options.map((item, index) => {

            const label =
              typeof item === "object" ? item.label : item;

            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-[#015093] hover:text-white"
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
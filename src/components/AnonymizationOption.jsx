import React from "react";

const AnonymizationOption = ({
  checked,
  onChange,
  title,
  description,
}) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2D468B] focus:ring-[#2D468B]"
      />

      {/* Text */}
      <div>
        <p className="text-sm font-medium text-[#0A0A0A]">
          {title}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </label>
  );
};

export default AnonymizationOption;

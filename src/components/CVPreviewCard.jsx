import React from "react";

const CVPreviewCard = ({
  title,
  subtitle,
  status, // optional: "Processed"
  content,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-md flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border">
        <div>
          <h3 className="text-sm font-semibold text-[#0A0A0A]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {status && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
            ✓ {status}
          </span>
        )}
      </div>

      {/* Content (Scrollable) */}
      <div
        className="
          p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line
          overflow-y-auto
          max-h-[420px]
        "
      >
        {content}
      </div>
    </div>
  );
};

export default CVPreviewCard;

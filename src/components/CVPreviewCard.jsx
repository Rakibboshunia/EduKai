import React from "react";

const CVPreviewCard = ({
  title,
  subtitle,
  status,          
  content,         
  maxHeight = 420, 
  selectable = false,   
  selected = false,    
  footerSlot,           
}) => {
  return (
    <div
      className={`bg-white/60 rounded-xl border shadow-md flex flex-col
        ${selected ? "border-[#2D468A] ring-1 ring-[#2D468A]" : "border-gray-200"}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-[#0A0A0A]">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">
            {subtitle}
          </p>
        )}

        {status && (
          <div className="mt-2 text-xs font-medium text-green-600 flex justify-between gap-1">
            ✓ {status}
          </div>
        )}
      </div>

      {/* ---------- Content (Scrollable CV) ---------- */}
      <div
        style={{ maxHeight }}
        className="
          p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line overflow-y-auto flex justify-center
        "
      >
        {content}
      </div>

      {/* ---------- Footer (AI page only) ---------- */}
      {footerSlot && (
        <div className="border-t px-4 py-3">
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default CVPreviewCard;

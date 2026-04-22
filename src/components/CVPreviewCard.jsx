import React from "react";

const CVPreviewCard = ({
  title,
  subtitle,
  status,          
  content,         
  maxHeight = "none", 
  selectable = false,   
  selected = false,    
  footerSlot,           
}) => {
  return (
    <div
      className={`bg-white/60 rounded-2xl flex flex-col overflow-hidden transition-all duration-300 h-full w-full
        ${selected 
            ? "border-2 border-[#2D468A] shadow-lg shadow-blue-900/10 scale-[1.01]" 
            : "border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200"
        }
      `}
    >
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 flex flex-col gap-2 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-[#2D468A]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {status && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-[#2D468A] text-[10px] font-bold tracking-wide uppercase border border-blue-100">
              {status}
            </div>
          )}
        </div>
      </div>

      <div
        style={{ maxHeight: maxHeight === 'none' ? 'none' : `${maxHeight}px` }}
        className="
          p-5 text-sm text-gray-700 leading-relaxed overflow-y-auto flex flex-1 justify-center items-start scrollbar-thin scrollbar-thumb-gray-200 h-full
        "
      >
        <div className="w-full h-full">
          {content}
        </div>
      </div>

      {footerSlot && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 mt-auto">
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default CVPreviewCard;

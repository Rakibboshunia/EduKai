import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock } from "lucide-react";

export default function StatusBadge({
  value,
  options = {},
  readOnly = false,
  onChange,
  width = "w-48",
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const ref = useRef(null);

  const currentValue = value ?? internalValue;

  const current =
    options[currentValue] || {
      label: "Unknown",
      icon: Clock,
      className: "bg-gray-200 text-gray-600",
    };

  const Icon = current.icon;

  /* ===== close dropdown on outside click ===== */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= READ ONLY ================= */
  if (readOnly) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
      >
        <Icon size={14} />
        {current.label}
      </span>
    );
  }

  /* ================= DROPDOWN ================= */
  return (
    <div ref={ref} className="relative inline-block text-right">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
      >
        <Icon size={14} />
        {current.label}
        <ChevronDown size={12} className="ml-1" />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 ${width} bg-white border border-gray-200 rounded-md shadow-lg z-50`}
        >
          {Object.entries(options).map(([key, item]) => {
            const ItemIcon = item.icon;

            return (
              <button
                key={key}
                onClick={() => {
                  if (!value) setInternalValue(key); // uncontrolled
                  onChange?.(key);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <ItemIcon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

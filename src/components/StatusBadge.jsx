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
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const currentValue = value ?? internalValue;

  const current =
    options[currentValue] || {
      label: "Unknown",
      icon: Clock,
      className: "bg-slate-100 text-slate-600",
    };

  const Icon = current.icon;

  // click outside close
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const handleChange = async (key) => {
    if (loading) return;

    setLoading(true);

    try {
      if (!value) setInternalValue(key);

      await onChange?.(key);

    } catch (error) {
      console.error("Status change failed:", error);
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">

      <button
        disabled={loading}
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
      >
        {loading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Icon size={14} />
        )}

        {current.label}

        <ChevronDown size={12} className="ml-1" />
      </button>

      {open && (
        <div
          className={`absolute left-0 mt-2 ${width} bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden`}
        >
          {Object.entries(options).map(([key, item]) => {

            const ItemIcon = item.icon;

            return (
              <button
                key={key}
                onClick={() => handleChange(key)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-900 hover:bg-slate-50 transition-colors text-left font-semibold border-b border-slate-50 last:border-0"
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
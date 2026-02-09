import { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  MailCheck,
  ChevronDown,
} from "lucide-react";

export default function StatusBadge({ status, variant = "availability" }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* ================= AVAILABILITY STATUS ================= */
  const availabilityMap = {
    available: {
      label: "Available",
      icon: MailCheck,
      className: "bg-green-100 text-green-700",
    },
    not_available: {
      label: "Not available",
      icon: XCircle,
      className: "bg-red-100 text-red-600",
    },
    follow_up: {
      label: "Follow-up",
      icon: AlertCircle,
      className: "bg-yellow-100 text-yellow-700",
    },
    na: {
      label: "N/A",
      icon: Clock,
      className: "bg-gray-200 text-gray-600",
    },
  };

  /* ================= TRACKING STATUS ================= */
  const trackingMap = {
    opened: {
      label: "Opened",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-700",
    },
    responded: {
      label: "Responded",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    sent: {
      label: "Sent",
      icon: MailCheck,
      className: "bg-blue-100 text-blue-700",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      className: "bg-purple-100 text-purple-700",
    },
  };

  /* ================= QUALITY STATUS ================= */
  const qualityMap = {
    passed: {
      label: "Quality Passed",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    failed: {
      label: "Quality Failed",
      icon: XCircle,
      className: "bg-red-100 text-red-700",
    },
    manual_review: {
      label: "Quality Failed",
      icon: AlertCircle,
      className: "bg-yellow-100 text-yellow-700",
    },
    awaiting_response: {
      label: "Awaiting Response",
      icon: Clock,
      className: "bg-gray-200 text-gray-600",
    },
  };

  /* ================= VARIANT MAP ================= */
  const variantMap = {
    availability: availabilityMap,
    tracking: trackingMap,
    quality: qualityMap,
  };

  const map = variantMap[variant] || {};
  const current =
    map[currentStatus] || {
      label: "Unknown",
      icon: Clock,
      className: "bg-gray-300 text-gray-600",
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

  /* ================= READ ONLY (QUALITY) ================= */
  if (variant === "quality") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
      >
        <Icon size={14} />
        {current.label}
      </span>
    );
  }

  /* ================= DROPDOWN (AVAILABILITY + TRACKING) ================= */
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
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {Object.entries(map).map(([key, item]) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  setCurrentStatus(key);
                  setOpen(false);
                  console.log(`${variant} status changed to:`, key);
                  // 🔥 API call later
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 ${item.className}`}
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

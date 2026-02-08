import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  MailCheck,
} from "lucide-react";

export default function StatusBadge({ status, variant = "availability" }) {
  // ================= AVAILABILITY STATUS =================
  const availabilityMap = {
    active: {
      label: "Active",
      icon: MailCheck,
      className: "bg-green-100 text-green-700",
    },
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

  // ================= TRACKING STATUS =================
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

  // ================= QUALITY STATUS (SCREENSHOT MATCHED) =================
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

  // ================= VARIANT MAP =================
  const variantMap = {
    availability: availabilityMap,
    tracking: trackingMap,
    quality: qualityMap,
  };

  const map = variantMap[variant] || {};
  const current =
    map[status] || {
      label: "Unknown",
      icon: Clock,
      className: "bg-gray-300 text-gray-600",
    };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
    >
      <Icon size={14} />
      {current.label}
    </span>
  );
}

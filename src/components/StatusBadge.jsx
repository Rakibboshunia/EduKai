export default function StatusBadge({ status, variant = "availability" }) {
  // ================= AVAILABILITY STATUS =================
  const availabilityMap = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700",
    },
    not_available: {
      label: "Not available",
      className: "bg-red-100 text-red-600",
    },
    follow_up: {
      label: "Follow-up",
      className: "bg-yellow-100 text-yellow-700",
    },
    na: {
      label: "N/A",
      className: "bg-gray-200 text-gray-600",
    },
  };

  // ================= TRACKING STATUS =================
  const trackingMap = {
    opened: {
      label: "Opened",
      className: "bg-yellow-100 text-yellow-700",
    },
    responded: {
      label: "Responded",
      className: "bg-green-100 text-green-700",
    },
    sent: {
      label: "Sent",
      className: "bg-blue-100 text-blue-700",
    },
    delivered: {
      label: "Delivered",
      className: "bg-purple-100 text-purple-700",
    },
  };

  // ================= PICK MAP =================
  const map =
    variant === "tracking" ? trackingMap : availabilityMap;

  const current =
    map[status] || {
      label: "Unknown",
      className: "bg-gray-100 text-gray-600",
    };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${current.className}`}
    >
      {current.label}
    </span>
  );
}

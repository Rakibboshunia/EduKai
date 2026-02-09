import { useEffect, useRef } from "react";
import { IoNotifications } from "react-icons/io5";

export default function NotificationsDropdown({ open, onClose }) {
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="
        absolute right-0 top-14 z-50
        w-[90vw] sm:w-[360px]
        max-h-[80vh]
        bg-white rounded-2xl
        shadow-xl border border-gray-300
        overflow-hidden
      "
    >
      {/* ================= HEADER ================= */}
      <div className="bg-[#2D468A] text-white flex items-center justify-center gap-2 py-3 text-base sm:text-lg font-medium">
        <IoNotifications />
        Notifications
      </div>

      {/* ================= LIST ================= */}
      <div className="divide-y divide-gray-200 overflow-y-auto max-h-[65vh]">
        <NotificationItem
          title="Bulk CV import completed successfully"
          time="30m ago"
          description="125 CVs added to the processing queue"
        />

        <NotificationItem
          title="Bulk import failed"
          time="45m ago"
          description="Some CVs could not be processed"
        />

        <NotificationItem
          title="Availability confirmation sent (Email)"
          time="1h ago"
          description="Email sent to selected candidates"
        />
      </div>
    </div>
  );
}

/* ================= SINGLE ITEM ================= */

function NotificationItem({ title, description, time }) {
  return (
    <div className="px-4 py-3 sm:py-4 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex justify-between items-start gap-3">
        <p className="font-medium text-sm text-gray-900 leading-snug">
          {title}
        </p>

        <span className="text-xs text-gray-400 whitespace-nowrap">
          {time}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-1 leading-snug">
        {description}
      </p>
    </div>
  );
}

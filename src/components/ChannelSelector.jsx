import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ChannelSelector({
  value,
  onChange,
}) {
  const [channels, setChannels] = useState(
    value || { email: true, whatsapp: true }
  );

  const toggle = (key) => {
    const updated = {
      ...channels,
      [key]: !channels[key],
    };
    setChannels(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">

      {/* Channels */}
      <div className="flex gap-4 flex-wrap">
        {/* Email */}
        <ChannelButton
          active={channels.email}
          color="blue"
          icon={<FiMail className="text-lg" />}
          label="Email"
          onClick={() => toggle("email")}
        />

        {/* WhatsApp */}
        <ChannelButton
          active={channels.whatsapp}
          color="green"
          icon={<FaWhatsapp className="text-lg" />}
          label="what’s app"
          onClick={() => toggle("whatsapp")}
        />
      </div>
    </div>
  );
}

/* ---------------- Single Button ---------------- */

function ChannelButton({ active, icon, label, onClick, color }) {
  const styles = {
    blue: {
      active: "border-blue-500 bg-blue-50 text-blue-600",
      inactive: "border-gray-300 text-gray-500",
    },
    green: {
      active: "border-green-500 bg-green-50 text-green-600",
      inactive: "border-gray-300 text-gray-500",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border
        transition font-medium
        ${
          active
            ? styles[color].active
            : styles[color].inactive
        }
      `}
    >
      {/* Checkbox */}
      <span
        className={`
          w-5 h-5 flex items-center justify-center rounded border
          ${
            active
              ? `bg-${color}-500 border-${color}-500 text-white`
              : "border-gray-400"
          }
        `}
      >
        {active && "✓"}
      </span>

      {/* Icon + Label */}
      {icon}
      <span>{label}</span>
    </button>
  );
}

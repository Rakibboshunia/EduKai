import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../Image";
import { FiX } from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  /* 🔥 Special Group Logic */
  const isAIActive = location.pathname.startsWith("/ai");

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    {
      name: "Dashboard",
      path: "/",
      icon: "material-symbols:dashboard-outline",
    },
    {
      name: "Bulk Import",
      path: "/cv/automation/platform",
      icon: "iconoir:import",
    },
    {
      name: "Availability Check",
      path: "/availability",
      icon: "material-symbols:check-circle-outline",
    },
    {
      name: "CV Queue",
      path: "/cv/queue",
      icon: "radix-icons:file-text",
    },
    {
      name: "AI Re-writer",
      path: "/ai/re-writer",
      icon: "lineicons:open-ai",
      isGroup: true, // 🔥 mark as grouped route
    },
    {
      name: "Organizations",
      path: "/organizations",
      icon: "ph:building-office",
    },
    {
      name: "Tracking",
      path: "/tracking",
      icon: "ant-design:reload-time-outline",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 2xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white text-[#364153]
        border-r border-[#E5E7EB]
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        2xl:static 2xl:translate-x-0`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-md bg-[#2D468A] text-white 2xl:hidden"
        >
          <FiX size={20} />
        </button>

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-6 py-6 flex items-center gap-4">
            <Image src="/logo.png" alt="Company Logo" />
            <div>
              <p className="text-2xl text-[#423B3B] font-medium">Edukai</p>
              <p className="text-xs mt-1 text-[#626262]">
                Automation Engine
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navLinks.map((item) => {
              const active =
                item.isGroup
                  ? isAIActive // 🔥 grouped route logic
                  : isActivePath(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    window.innerWidth < 1536 && onClose()
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                    ${
                      active
                        ? "bg-[#2D468A] text-[#E9E9E9]"
                        : "hover:bg-[#2D468A] hover:text-white"
                    }`}
                >
                  <Icon icon={item.icon} width="20" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
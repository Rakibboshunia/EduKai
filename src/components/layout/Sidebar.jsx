import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../Image";
import { FiX } from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isAIActive = location.pathname.startsWith("/ai");

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { name: "Dashboard", path: "/", icon: "material-symbols:dashboard-outline" },
    { name: "Bulk Import", path: "/cv/automation/platform", icon: "iconoir:import" },
    { name: "Availability Check", path: "/availability", icon: "material-symbols:check-circle-outline" },
    { name: "CV Queue", path: "/cv/queue", icon: "radix-icons:file-text" },
    // { name: "AI Re-writer", path: "/ai/re-writer", icon: "lineicons:open-ai", isGroup: true },
    { name: "Organizations", path: "/organizations", icon: "ph:building-office" },
    { name: "Contact", path: "/contact", icon: "ant-design:reload-time-outline" },
  ];

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm 2xl:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-70 bg-gradient-to-b from-white/80 to-white/60
        bg-white/80 backdrop-blur-xl
        border-r border-gray-200 shadow-xl
        transform transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        2xl:static 2xl:translate-x-0`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 z-40 p-2 rounded-lg bg-[#2D468A] text-white 2xl:hidden"
        >
          <FiX size={20} />
        </button>

        <div className="flex h-full flex-col">

          {/* LOGO */}
          <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-200">
            <Image src="/logo.png" alt="Company Logo" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Edukai</p>
              <p className="text-xs text-gray-500">Automation Engine</p>
            </div>
          </div>

          {/* NAV */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map((item) => {
              const active = item.isGroup
                ? isAIActive
                : isActivePath(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1536 && onClose()}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-[#2D468A] to-[#4F6EDB] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {/* ACTIVE INDICATOR */}
                  {active && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
                  )}

                  <Icon icon={item.icon} width="20" />

                  <span className="flex-1">{item.name}</span>

                  {/* HOVER ARROW */}
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* FOOTER (optional) */}
          <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-400">
            © 2026 Edukai
          </div>
        </div>
      </aside>
    </>
  );
}
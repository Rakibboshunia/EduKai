import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import Image from "../Image";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import NotificationsDropdown from "../../components/NotificationsDropdown";

import logo from "../../assets/logo1.avif"

export default function Header({ onMenuClick }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setOpenDropdown(false);
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="bg-[#E3E8F5] flex items-center px-4 sm:px-6 py-3 sm:py-4 relative">
      {/* ☰ Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="2xl:hidden p-2 rounded bg-[#2D468A] text-white cursor-pointer"
      >
        <FiMenu size={22} />
      </button>

      {/* Right section */}
      <div className="flex items-center justify-end ml-auto gap-2 sm:gap-4 relative">
        {/* 🔔 Notifications */}
        <div className="relative">
          <IoNotifications
            className="w-8 h-8 sm:w-8 sm:h-8 text-[#2D468A] cursor-pointer"
            onClick={() => {
              setOpenNotifications((prev) => !prev);
              setOpenDropdown(false);
            }}
          />

          <NotificationsDropdown
            open={openNotifications}
            onClose={() => setOpenNotifications(false)}
          />
        </div>

        {/* 👤 Profile */}
        <div className="relative">
          <div
            className="flex items-center gap-2 sm:gap-3 bg-[#2D468A] px-2 sm:px-3 py-2 border border-[#A0A0A0] rounded-lg cursor-pointer"
            onClick={() => {
              setOpenDropdown((prev) => !prev);
              setOpenNotifications(false);
            }}
          >
            {/* Avatar */}
            <Image
              src={logo}
              alt="User Avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />

            {/* User info (hide on small screens) */}
            <div className="hidden sm:block">
              <p className="text-sm sm:text-base text-white font-medium">
                Olivia Macdona
              </p>
              <p className="text-[10px] sm:text-xs text-white">
                Admin
              </p>
            </div>

            {/* Arrow */}
            <FaAngleDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-200 ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border z-50">
              <Link
                to="/settings"
                onClick={() => setOpenDropdown(false)}
              >
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg text-[#0A0A0A] hover:bg-[#2D468A] hover:text-white transition">
                  <Icon
                    icon="material-symbols:settings"
                    width="18"
                  />
                  Settings
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg text-[#E7000B] hover:bg-[#2D468A] hover:text-white transition"
              >
                <Icon
                  icon="material-symbols:logout"
                  width="18"
                />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

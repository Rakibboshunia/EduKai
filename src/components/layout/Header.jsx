import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useCallback } from "react";
import NotificationsDropdown from "../../components/NotificationsDropdown";
import { AuthContext } from "../../provider/AuthProvider";

function Header({ onMenuClick }) {

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const navigate = useNavigate();

  const { user, logOutUser } = useContext(AuthContext);

  /* ================= LOGOUT ================= */

  const handleLogout = useCallback(() => {

    logOutUser();

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    navigate("/auth/login", { replace: true });

  }, [logOutUser, navigate]);

  const toggleDropdown = useCallback(() => {
    setOpenDropdown((prev) => !prev);
    setOpenNotifications(false);
  }, []);

  return (
    <header className="bg-bg-dashboard flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
      {/* ================= MENU BUTTON ================= */}

      <button
        onClick={onMenuClick}
        className="2xl:hidden p-2 rounded bg-brand-primary text-white"
      >
        <FiMenu size={22} />
      </button>

      <div className="flex items-center justify-end ml-auto gap-4">

        <div className="relative">
          <div
            className="flex items-center gap-3 bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-3 rounded-lg cursor-pointer"
            onClick={toggleDropdown}
          >
            {/* USER IMAGE */}

            <img
              src={user?.profile_pic_url || "/avatar.png"}
              alt="User Avatar"
              className="w-11 h-11 scale-[1.25] rounded-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src.includes("avatar.png")) return;
                e.currentTarget.src = "/avatar.png";
              }}
            />

            {/* USER INFO */}

            <div className="hidden sm:block">
              <p className="text-md text-white font-medium">
                {user?.full_name}
              </p>

              <p className="text-xs text-white">{user?.role}</p>
            </div>

            {/* ARROW */}

            <FaAngleDown
              className={`w-4 h-4 text-white transition ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* ================= DROPDOWN ================= */}

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-54 bg-white rounded-lg shadow-lg border border-gray-300 z-50">
              <Link to="/settings">
                <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-brand-primary hover:text-white transition-colors">
                  <Icon icon="material-symbols:settings" width="18" />
                  Settings
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-brand-primary hover:text-white transition-colors"
              >
                <Icon icon="material-symbols:logout" width="18" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
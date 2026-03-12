import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import Image from "../Image";
import NotificationsDropdown from "../../components/NotificationsDropdown";
import { AuthContext } from "../../provider/AuthProvider";

export default function Header({ onMenuClick }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

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

      {/* Right Section */}
      <div className="flex items-center justify-end ml-auto gap-4">
        <div className="relative">
          <IoNotifications
            className="w-8 h-8 text-[#2D468A] cursor-pointer"
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

        <div className="relative">
          <div
            className="flex items-center gap-3 bg-[#2D468A] px-3 py-2 rounded-lg cursor-pointer"
            onClick={() => {
              setOpenDropdown((prev) => !prev);
              setOpenNotifications(false);
            }}
          >
            <Image
              src={user?.profile_pic_url || "https://i.pravatar.cc/150"}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="hidden sm:block">
              <p className="text-sm text-white font-medium">
                {user?.full_name}
              </p>
              <p className="text-xs text-white">{user?.role}</p>
            </div>

            <FaAngleDown
              className={`w-4 h-4 text-white transition ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-47 bg-white rounded-lg shadow-lg border border-gray-400 z-50">
              <Link to="/settings" onClick={() => setOpenDropdown(false)}>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-lg hover:bg-[#2D468A] hover:rounded-lg hover:text-white cursor-pointer">
                  <Icon icon="material-symbols:settings" width="18" />
                  Settings
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-lg text-red-600 hover:bg-[#2D468A] hover:rounded-lg hover:text-white cursor-pointer"
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

import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import Image from "../Image";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <header className="bg-[#E3E8F5] flex items-center px-6 py-4 relative">
      <button
        onClick={onMenuClick}
        className="2xl:hidden p-2 rounded bg-[#2D468A] text-white cursor-pointer"
      >
        <FiMenu size={22} />
      </button>

      <div className="flex items-center justify-end ml-auto gap-4">
        <IoNotifications className="w-10 h-10 text-[#2D468A] cursor-pointer" />

        {/* Profile Section */}
        <div className="relative">
          <div
            className="flex items-center gap-3 bg-[#2D468A] px-3 py-2 border border-[#A0A0A0] rounded-lg cursor-pointer"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <Image
              src="/logo.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="text-xl text-white font-medium">John Doe</p>
              <p className="text-xs text-white">Admin</p>
            </div>

            <FaAngleDown
              className={`w-5 h-5 text-white transition-transform duration-200 ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute w-full right-0 mt-2  bg-white rounded-lg shadow-lg border border-[#A0A0A0] z-50">
              {/* <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button> */}
              <Link to="/settings" onClick={() => setOpenDropdown(false)}>
              <button className="flex w-full items-center gap-3 px-4 py-4 rounded-lg text-[#0A0A0A] hover:bg-[#2D468A] hover:text-white transition cursor-pointer">
                <Icon
                  icon="material-symbols:settings"
                  width="20"
                />
                Settings
              </button>
              </Link>
              <button onClick={() => setOpenDropdown(false)} className="flex w-full items-center gap-3 px-4 py-4 rounded-lg text-[#E7000B] hover:bg-[#2D468A] hover:text-white transition cursor-pointer">
                <Icon icon="material-symbols:logout" width="20" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

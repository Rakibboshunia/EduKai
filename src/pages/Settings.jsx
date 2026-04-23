import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";

import ProfileSection from "../components/SettingSections/ProfileSection";
import PasswordSection from "../components/SettingSections/PasswordSection";

const Settings = () => {

  const { user, updateUser } = useContext(AuthContext);

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="p-4 sm:p-8 space-y-8 mb-10">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72  bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
              Account Settings
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
              Manage your profile information, email integrations, and security settings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="bg-white/80 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden transition-all duration-300">
          <ProfileSection />
        </div>

        {/* Password Section */}
        <div className="bg-white/80 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden transition-all duration-300">
          <PasswordSection
            openSection={openSection}
            toggleSection={toggleSection}
          />
        </div>
      </div>
    </main>
  );
};

export default Settings;
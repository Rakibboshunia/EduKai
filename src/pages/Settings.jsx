import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";

import ProfileSection from "../components/SettingSections/ProfileSection";
import EmailIntegration from "../components/SettingSections/EmailIntegration";
import PasswordSection from "../components/SettingSections/PasswordSection";

const Settings = () => {

  const { user, updateUser } = useContext(AuthContext);

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="p-6 md:p-10 bg-[#f1f6ff] rounded-2xl min-h-screen">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-semibold text-[#2D468A]">
            Account Settings
          </h2>

          <p className="text-gray-500 text-sm">
            Manage your profile information, integrations and security settings.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <ProfileSection
            user={user}
            updateUser={updateUser}
          />
        </div>

        {/* Email Integration */}
        <div className="bg-white rounded-2xl shadow-sm">
          <EmailIntegration
            openSection={openSection}
            toggleSection={toggleSection}
          />
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl shadow-sm">
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
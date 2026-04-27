import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Password from "../../components/Password";
import toast from "react-hot-toast";
import { updatePasswordApi } from "../../api/settingsApi.js";

const PasswordSection = ({ openSection, toggleSection }) => {

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {

    if (!passwordData.old_password) {
      toast.error("Old password is required");
      return;
    }

    if (!passwordData.new_password) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const res = await updatePasswordApi(passwordData);

      toast.success(res.message || "Password updated successfully");

      setPasswordData({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Password update failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="overflow-hidden transition-all duration-300">
      <button
        onClick={() => toggleSection("password")}
        className={`w-full flex justify-between items-center px-8 py-6 font-bold text-lg transition-all duration-300 cursor-pointer ${
          openSection === "password" 
            ? "bg-slate-50 text-brand-primary border-b border-gray-100" 
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${openSection === "password" ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-400"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          Password Security
        </div>

        <FiChevronDown
          size={20}
          className={`transition-transform duration-300 ${
            openSection === "password" ? "rotate-180" : ""
          }`}
        />
      </button>

      {openSection === "password" && (
        <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Password
              label="Old Password"
              value={passwordData.old_password}
              placeholder="Enter current password"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value
                })
              }
            />

            <Password
              label="New Password"
              value={passwordData.new_password}
              placeholder="Enter new password"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value
                })
              }
            />

            <Password
              label="Confirm New Password"
              value={passwordData.new_password_confirm}
              placeholder="Re-type new password"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirm: e.target.value
                })
              }
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-medium rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              {loading ? "Updating Security..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordSection;
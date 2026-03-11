import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Password from "../../components/Password";
import toast from "react-hot-toast";
import { updatePasswordApi } from "../../api/settingsApi";

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
    <div className="bg-white rounded-xl overflow-hidden">

      <button
        onClick={() => toggleSection("password")}
        className="w-full flex text-black justify-between items-center px-6 py-4 font-semibold cursor-pointer"
      >
        Password Settings

        <FiChevronDown
          className={`transition ${
            openSection === "password" ? "rotate-180" : ""
          }`}
        />
      </button>

      {openSection === "password" && (

        <div className="px-6 pb-6 space-y-6">

          <div className="grid grid-cols-12 gap-6">

            <Password
              label="Old Password"
              value={passwordData.old_password}
              placeholder="Enter old password"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value
                })
              }
              className="col-span-12 md:col-span-6"
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
              className="col-span-12 md:col-span-6"
            />

            <Password
              label="Confirm Password"
              value={passwordData.new_password_confirm}
              placeholder="Enter Confirm password"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirm: e.target.value
                })
              }
              className="col-span-12 md:col-span-6"
            />

          </div>

          <div className="flex justify-end">

            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="px-4 py-2 bg-[#2D468A] text-white rounded-lg disabled:opacity-50 cursor-pointer hover:bg-[#3a5ab3] transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default PasswordSection;
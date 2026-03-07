import React, { useContext, useState } from "react";
import { FiChevronDown, FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../provider/AuthProvider";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import Password from "../components/Password";

import { updateProfileApi, updatePasswordApi } from "../Api/settingsApi";

const Settings = () => {

  const { user, updateUser } = useContext(AuthContext);

  const [openSection, setOpenSection] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "",
    country: user?.country || "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!user) {
    return (
      <div className="p-6">
        Loading user data...
      </div>
    );
  }

  const handleProfileUpdate = async () => {

    try {

      const res = await updateProfileApi(profileData);

      updateUser(res.data.data);

      setIsEdit(false);

    } catch (error) {

      console.log(error);

    }

  };

  const handlePasswordUpdate = async () => {

    try {

      await updatePasswordApi(passwordData);

      setPasswordData({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="p-6 space-y-6">
      {/* PROFILE */}
      <div className="bg-white/60 rounded-2xl p-6 space-y-6">
        <h3 className="font-semibold text-lg text-black">
          Profile Information
        </h3>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150"}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />

              {isEdit && (
                <>
                  <span className="absolute bottom-0 right-0 bg-[#2D468A] p-1.5 rounded-full text-white">
                    <FiEdit2 size={14} />
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      updateUser({
                        avatar: URL.createObjectURL(file),
                      });
                    }}
                  />
                </>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-black">{user?.name}</h4>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {!isEdit && (
            <button
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 bg-[#2D468A] text-white rounded-lg cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <InputField
            label="First Name"
            value={profileData.first_name}
            onChange={(e) =>
              setProfileData({ ...profileData, first_name: e.target.value })
            }
            placeholder="Alexa"
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <InputField
            label="Last Name"
            value={profileData.last_name}
            onChange={(e) =>
              setProfileData({ ...profileData, last_name: e.target.value })
            }
            placeholder="Rawles"
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Gender"
            value={profileData.gender}
            onChange={(value) =>
              setProfileData({ ...profileData, gender: value })
            }
            placeholder="Male"
            options={["Male", "Female", "Other"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Country"
            value={profileData.country}
            onChange={(value) =>
              setProfileData({ ...profileData, country: value })
            }
            placeholder="Canada"
            options={["USA", "UK", "Canada"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />
        </div>

        {isEdit && (
          <div className="flex justify-end">
            <button
              onClick={handleProfileUpdate}
              className="px-6 py-2 bg-[#2D468A] text-white rounded-lg cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* EMAIL INTEGRATION */}
      <div className="bg-white/60 text-black rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection("email")}
          className="w-full flex justify-between items-center px-6 py-4 font-semibold"
        >
          Email Integration
          <FiChevronDown
            className={`transition ${
              openSection === "email" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSection === "email" && (
          <div className="px-6 pb-6 space-y-6">
            <div className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Microsoft Outlook</h4>
                <p className="text-sm text-gray-500">
                  Connected as user@example.com
                </p>
              </div>

              <button className="px-4 py-2 bg-[#2D468A] text-white rounded-md cursor-pointer">
                Connect
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Gmail</h4>
                <p className="text-sm text-gray-500">Not Connected</p>
              </div>

              <button className="px-4 py-2 bg-[#2D468A] text-white rounded-md cursor-pointer">
                Connect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="bg-white/60 text-black rounded-2xl overflow-hidden">
        <button
          onClick={() => toggleSection("password")}
          className="w-full flex justify-between items-center px-6 py-4 font-semibold"
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
                placeholder="Enter Old Password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
                className="col-span-12 md:col-span-6"
              />

              <Password
                label="New Password"
                placeholder="Enter New Password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
                className="col-span-12 md:col-span-6"
              />

              <Password
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                value={passwordData.new_password_confirm}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password_confirm: e.target.value,
                  })
                }
                className="col-span-12 md:col-span-6"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePasswordUpdate}
                className="px-6 py-2 bg-[#2D468A] text-white rounded-lg cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
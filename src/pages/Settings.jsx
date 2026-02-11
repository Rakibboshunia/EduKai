import React, { useContext, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import Password from "../components/Password";
import { FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../provider/AuthProvider";

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="w-full space-y-8">
      <Breadcrumb />

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white/60 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
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
            <h3 className="font-semibold text-lg text-[#0A0A0A]">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
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

      {/* ================= PERSONAL INFO ================= */}
      <div className="bg-white/60 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-[#0A0A0A] mb-6">
          Personal Information
        </h4>

        <div className="grid grid-cols-12 gap-6">
          <InputField
            label="Name"
            value={user.name}
            disabled={!isEdit}
            onChange={(e) => updateUser({ name: e.target.value })}
            className="col-span-12 md:col-span-6"
          />

          <InputField
            label="Email"
            value={user.email}
            disabled={!isEdit}
            onChange={(e) => updateUser({ email: e.target.value })}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Gender"
            placeholder="Select Gender"
            options={["Male", "Female", "Other"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Country"
            placeholder="Select Country"
            options={["USA", "Canada", "UK"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Language"
            placeholder="Select Your Language"
            className="col-span-12 md:col-span-6"
            options={["English", "Spanish", "French"]}
            disabled={!isEdit}
          />

          <Dropdown
            label="Time Zone"
            placeholder="Select Your Time Zone"
            className="col-span-12 md:col-span-6"
            options={["GMT", "EST", "PST"]}
            disabled={!isEdit}
          />

        </div>
      </div>

      {/* ================= MICROSOFT OUTLOOK ================= */}
      <div className="bg-white/60 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-[#0A0A0A]">
              Microsoft Outlook
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Connect your Outlook account to sync emails
            </p>
          </div>

          {!isEdit && (
            <button className="px-5 py-2 bg-[#2D468A] text-white rounded-lg cursor-pointer">
              Connect
            </button>
          )}
        </div>

        <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
          Connected successfully · Last checked 2 minutes ago
        </div>
      </div>

      {/* ================= SECURITY ================= */}
      {isEdit && (
        <div className="bg-white/60 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-[#0A0A0A] mb-6">
            Security
          </h4>

          <div className="grid grid-cols-12 gap-6">
            <Password
              label="Current Password"
              placeholder="Enter your current password"
              className="col-span-12 md:col-span-6"
            />
            <Password
              label="New Password"
              placeholder="Enter your new password"
              className="col-span-12 md:col-span-6"
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setIsEdit(false)}
              className="px-6 py-2 bg-[#2D468A] text-white rounded-lg cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

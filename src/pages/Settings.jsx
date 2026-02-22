import React, { useContext, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../provider/AuthProvider";
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import Password from "../components/Password";

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="p-6 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white/60 rounded-2xl p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
            <h3 className="font-semibold text-lg text-black">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 bg-[#2D468A] text-white rounded-lg"
          >
            Edit
          </button>
        )}
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="bg-white/60 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-12 gap-6">

          <InputField
            label="Full Name"
            placeholder="Your First Name"
            value={user.firstName || ""}
            disabled={!isEdit}
            onChange={(e) => updateUser({ firstName: e.target.value })}
            className="col-span-12 md:col-span-6"
          />

          <InputField
            label="Last Name"
            placeholder="Last Name"
            value={user.lastName || ""}
            disabled={!isEdit}
            onChange={(e) => updateUser({ lastName: e.target.value })}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Gender"
            placeholder="Select Your Gender"
            options={["Male", "Female", "Other"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Country"
            placeholder="Select Your Country"
            options={["USA", "UK", "Canada"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Language"
            placeholder="Select your Language"
            options={["English", "Spanish"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

          <Dropdown
            label="Time Zone"
            placeholder="Select your Time zone"
            options={["GMT", "EST"]}
            disabled={!isEdit}
            className="col-span-12 md:col-span-6"
          />

        </div>
      </div>

      {/* ================= MICROSOFT OUTLOOK ================= */}
      <div className="bg-white/60 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-black">Microsoft Outlook</h4>
            <p className="text-sm text-gray-500">
              Connected as user@example.com
            </p>
          </div>

          <button className="px-5 py-2 bg-[#2D468A] text-white rounded-lg">
            Connect
          </button>
        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
          Connection successful. Last tested: 2 minutes ago
        </div>
      </div>

      {/* ================= EMAIL ================= */}
      <div className="bg-white/60 rounded-2xl p-6">
        <InputField
          label="Email"
          placeholder="Enter Your Email"
          disabled={!isEdit}
        />
      </div>

      {/* ================= PASSWORD ================= */}
      <div className="bg-white/60 rounded-2xl p-6 space-y-6">
        <h4 className="font-semibold text-black">Password</h4>

        <div className="grid grid-cols-12 gap-6">
          <Password
            label="Current Password"
            placeholder="Enter Your Old Password"
            className="col-span-12 md:col-span-6"
          />
          <Password
            label="New Password"
            placeholder="Enter Your New Password"
            className="col-span-12 md:col-span-6"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsEdit(false)}
            className="px-6 py-2 bg-[#2D468A] text-white rounded-lg"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
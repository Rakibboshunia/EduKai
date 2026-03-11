import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import toast from "react-hot-toast";
import { updateProfileApi } from "../../api/settingsApi";

const ProfileSection = ({ user, updateUser }) => {

  const [isEdit, setIsEdit] = useState(false);

  const [previewImage, setPreviewImage] = useState(
    user?.profile_pic_url || "https://i.pravatar.cc/150"
  );

  const [imageFile, setImageFile] = useState(null);

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "",
    country: user?.country || "",
  });

  // image change
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setPreviewImage(preview);

  };

  // update profile
  const handleProfileUpdate = async () => {

    try {

      const payload = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        gender: profileData.gender || null,
        country: profileData.country || null,
      };

      if (imageFile) {
        payload.profile_pic = imageFile;
      }

      const res = await updateProfileApi(payload);

      updateUser(res.data);

      toast.success(res.message || "Profile updated successfully");

      setIsEdit(false);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Profile update failed"
      );

    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">

      <h3 className="font-semibold text-lg text-black">
        Profile Information
      </h3>

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="relative">

            <img
              src={previewImage}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover"
            />

            {isEdit && (
              <label className="absolute bottom-0 right-0 bg-[#2D468A] p-1.5 rounded-full text-white cursor-pointer">

                <FiEdit2 size={14} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

              </label>
            )}

          </div>

          <div>

            <h4 className="font-semibold text-black">
              {user?.full_name}
            </h4>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>

          </div>

        </div>

        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="px-5 py-2 bg-[#2D468A] hover:bg-[#3a5ab3] text-white rounded-lg transition cursor-pointer"
          >
            Edit
          </button>
        )}

      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-12 gap-6">

        <InputField
          label="First Name"
          value={profileData.first_name}
          placeholder="Enter first name"
          onChange={(e) =>
            setProfileData({
              ...profileData,
              first_name: e.target.value
            })
          }
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

        <InputField
          label="Last Name"
          value={profileData.last_name}
          placeholder="Enter last name"
          onChange={(e) =>
            setProfileData({
              ...profileData,
              last_name: e.target.value
            })
          }
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

        <Dropdown
          label="Gender"
          value={profileData.gender}
          placeholder="Select"
          onChange={(value) =>
            setProfileData({
              ...profileData,
              gender: value
            })
          }
          options={["Male", "Female", "Other"]}
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

        <Dropdown
          label="Country"
          value={profileData.country}
          placeholder="Select"
          onChange={(value) =>
            setProfileData({
              ...profileData,
              country: value
            })
          }
          options={["USA", "UK", "Canada"]}
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

      </div>

      {isEdit && (
        <div className="flex justify-end gap-3">

          <button
            onClick={() => setIsEdit(false)}
            className="px-6 py-2 text-black border border-gray-300 rounded-lg hover:bg-[#2D468A] hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleProfileUpdate}
            className="px-4 py-2 bg-[#2D468A] hover:bg-[#3a5ab3] text-white cursor-pointer rounded-lg"
          >
            Save Changes
          </button>

        </div>
      )}

    </div>
  );
};

export default ProfileSection;
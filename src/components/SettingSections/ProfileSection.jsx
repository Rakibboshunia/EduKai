import { useState, useContext, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import InputField from "../../components/InputField";
import toast from "react-hot-toast";
import { updateProfileApi } from "../../api/settingsApi";
import { AuthContext } from "../../provider/AuthProvider";

const ProfileSection = () => {

  const { user, updateUser } = useContext(AuthContext);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState(
    user?.profile_pic_url || ""
  );

  const [imageFile, setImageFile] = useState(null);

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "",
    country: user?.country || "",
  });

  /* sync image if user changes */

  useEffect(() => {
    setPreviewImage(user?.profile_pic_url || "");
  }, [user]);

  /* IMAGE CHANGE */

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);

  };

  /* PROFILE UPDATE */

  const handleProfileUpdate = async () => {

    try {

      setLoading(true);

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

      const updatedUser = {
  ...user,
  ...res.data,
  profile_pic_url: res.data.profile_pic_url
    ? `${res.data.profile_pic_url}?t=${Date.now()}`
    : user?.profile_pic_url || "/avatar.png",
};

updateUser(updatedUser);

      toast.success(res.message || "Profile updated successfully");

      setIsEdit(false);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Profile update failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className=" rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-lg text-black">Profile Information</h3>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={previewImage || "/avatar.png"}
              alt="avatar"
              className="w-16 h-16 text-black rounded-full object-cover"
              loading="lazy"
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
            <h4 className="font-semibold text-black">{user?.full_name}</h4>

            <p className="text-sm text-gray-500">{user?.email}</p>
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

      <div className="grid grid-cols-12 gap-6">
        <InputField
          label="First Name"
          value={profileData.first_name}
          placeholder="Enter first name"
          onChange={(e) =>
            setProfileData({
              ...profileData,
              first_name: e.target.value,
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
              last_name: e.target.value,
            })
          }
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

        <InputField
          label="Gender"
          value={profileData.gender}
          placeholder="Enter gender"
          onChange={(e) =>
            setProfileData({
              ...profileData,
              gender: e.target.value,
            })
          }
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />

        <InputField
          label="Country"
          value={profileData.country}
          placeholder="Enter country"
          onChange={(e) =>
            setProfileData({
              ...profileData,
              country: e.target.value,
            })
          }
          disabled={!isEdit}
          className="col-span-12 md:col-span-6"
        />
      </div>

      {isEdit && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEdit(false)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="px-4 py-2 bg-[#2D468A] text-white rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
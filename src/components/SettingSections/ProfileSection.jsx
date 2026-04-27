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
        profile_pic_url:
          res.data.profile_pic_url || user?.profile_pic_url || "/avatar.png",
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
    <div className="p-8 sm:p-10 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <h3 className="font-bold text-xl text-brand-primary">Profile Information</h3>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-medium rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-slate-50/50 p-6 rounded-2xl border border-blue-50/50">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-brand-primary to-brand-accent shadow-xl overflow-hidden">>
            <img
              src={previewImage || "/avatar.png"}
              alt="avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white"
              loading="lazy"
            />
          </div>

          {isEdit && (
            <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full text-brand-primary cursor-pointer shadow-lg hover:scale-110 transition-transform border border-blue-100">
              <FiEdit2 size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left">
          <h4 className="text-2xl font-bold text-brand-primary">{user?.full_name}</h4>
          <p className="text-gray-500 font-medium">{user?.email}</p>
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-blue-100/50 text-brand-primary text-xs font-bold rounded-full border border-blue-200">
              Active Member
            </span>
            <span className="px-3 py-1 bg-indigo-100/50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
              {user?.role || "User"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        />
      </div>

      {isEdit && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => setIsEdit(false)}
            className="w-full sm:w-auto px-8 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium cursor-pointer hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all duration-300"
          >
            Cancel
          </button>

          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                Saving Changes...
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
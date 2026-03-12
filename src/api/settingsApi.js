import axiosInstance from "../api/axiosInstance"

export const getProfileApi = async () => {
  const res = await axiosInstance.get("/api/auth/me/");
  return res.data;
};

export const updateProfileApi = async (data) => {

  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  const res = await axiosInstance.patch(
    "/api/auth/profile/update/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updatePasswordApi = async (data) => {

  const res = await axiosInstance.post(
    "/api/auth/password/update/",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );

  return res.data;

};
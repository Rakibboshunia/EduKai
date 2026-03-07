import axiosInstance from "./axiosInstance";

// get logged in user
export const getProfileApi = () => {
  return axiosInstance.get("/api/auth/me/");
};

// update profile
export const updateProfileApi = (data) => {
  return axiosInstance.patch("/api/auth/profile/update/", data);
};

// update password
export const updatePasswordApi = (data) => {
  return axiosInstance.post("/api/auth/password/update/", data);
};
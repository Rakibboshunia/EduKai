import axiosInstance from "./axiosInstance";

/* ===== GET PROFILE ===== */

export const getProfileApi = async () => {

  const res = await axiosInstance.get("/api/auth/me/");

  return res.data;

};


/* ===== UPDATE PROFILE ===== */

export const updateProfileApi = async (data) => {

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {

    if (value !== null && value !== undefined && value !== "") {

      const cleanedValue =
        typeof value === "string"
          ? value.replace(/"/g, "")
          : value;

      formData.append(key, cleanedValue);

    }

  });

  const res = await axiosInstance.patch(
    "/api/auth/profile/update/",
    formData
  );

  return res.data;

};


/* ===== UPDATE PASSWORD ===== */

export const updatePasswordApi = async (data) => {

  const res = await axiosInstance.post(
    "/api/auth/password/update/",
    data
  );

  return res.data;

};
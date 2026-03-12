import axiosInstance from "./axiosInstance";

export const uploadCandidates = async (formData) => {

  const res = await axiosInstance.post(
    "/api/candidates/upload/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
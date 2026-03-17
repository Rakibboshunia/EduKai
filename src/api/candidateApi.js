import axiosInstance from "./axiosInstance";

export const uploadCandidates = async (formData) => {
  const res = await axiosInstance.post(
    "/api/candidates/upload/",
    formData
  );

  return res.data;
};

export const getCandidates = async () => {
  const res = await axiosInstance.get("/api/candidates/");
  return res.data;
};

export const updateCandidateStatus = async (id, data) => {
  const res = await axiosInstance.patch(
    `/api/candidates/${id}/update/`,
    data
  );

  return res.data;
};

export const getCandidateById = async (id) => {
  const res = await axiosInstance.get(`/api/candidates/${id}/`);
  return res.data;
};
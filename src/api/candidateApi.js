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

export const getCandidates = async () => {
  const res = await axiosInstance.get("/api/candidates/");
  return res.data;
};

export const updateCandidateStatus = async (id, status) => {
  const res = await axiosInstance.patch(
    `/api/candidates/${id}/update/`,
    {
      availability_status: status,
    }
  );

  return res.data;
};
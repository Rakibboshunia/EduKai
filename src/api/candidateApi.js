import axiosInstance from "./axiosInstance";

/* ================= UPLOAD ================= */
export const uploadCandidates = async (formData) => {
  const res = await axiosInstance.post(
    "/api/candidates/upload/",
    formData
  );
  return res.data;
};

/* ================= GET CANDIDATES ================= */
export const getCandidates = async (params = {}) => {
  const res = await axiosInstance.get("/api/candidates/", {
    params: params,
  });

  return res.data;
};

/* ================= UPDATE STATUS ================= */
export const updateCandidateStatus = async (id, data) => {
  const res = await axiosInstance.patch(
    `/api/candidates/${id}/update/`,
    data
  );
  return res.data;
};

/* ================= REWRITE CV ================= */
export const rewriteCandidateCV = async (candidateId, options) => {
  const res = await axiosInstance.post(
    `/api/candidates/${candidateId}/rewrite/`,
    options
  );
  return res.data;
};

/* ================= REWRITE STATUS ================= */
export const getRewriteStatus = async (candidateId) => {
  const res = await axiosInstance.get(
    `/api/candidates/${candidateId}/rewrite/status/`
  );
  return res.data;
};

/* ================= GET SINGLE ================= */
export const getCandidateById = async (id) => {
  const res = await axiosInstance.get(`/api/candidates/${id}/`);
  return res.data;
};

/* ================= NEARBY CONTACTS ================= */
export const getNearbyContacts = async (candidateId, params = {}) => {
  const res = await axiosInstance.get(
    `/api/candidates/${candidateId}/nearby-contacts/`,
    { params }
  );
  return res.data;
};

/* ================= NEARBY ORGANIZATIONS (FIXED) ================= */
export const getNearbyOrganizations = async (candidateId, params = {}) => {
  const res = await axiosInstance.get(
    `/api/candidates/${candidateId}/nearby-organizations/`,
    { params }
  );
  return res.data;
};

/* ================= SEND EMAIL ================= */
export const sendToContacts = async (candidateId, data) => {
  const res = await axiosInstance.post(
    `/api/candidates/${candidateId}/send-to-contacts/`,
    data
  );
  return res.data;
};

/* ================= SEND STATUS ================= */
export const getSendStatus = async (taskId) => {
  const res = await axiosInstance.get(
    `/api/candidates/send-status/${taskId}/`
  );
  return res.data;
};
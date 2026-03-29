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



/* ================= REWRITE CV ================= */
export const rewriteCandidateCV = async (candidateId, options) => {
  const res = await axiosInstance.post(
    `/api/candidates/${candidateId}/rewrite/`,
    options
  );

  return res.data;
};

/* ================= GET REWRITE STATUS ================= */
export const getRewriteStatus = async (candidateId) => {
  const res = await axiosInstance.get(
    `/api/candidates/${candidateId}/rewrite/status/`
  );

  return res.data;
};

/* ================= GET CANDIDATE ================= */
export const getCandidateById = async (id) => {
  const res = await axiosInstance.get(`/api/candidates/${id}/`);
  return res.data;
};


/* ================= GET NEARBY CONTACTS ================= */
export const getNearbyContacts = async (candidateId, params = {}) => {
  const res = await axiosInstance.get(
    `/api/candidates/${candidateId}/nearby-contacts/`,
    { params }
  );

  return res.data;
};

/* ================= GET NEARBY ORGANIZATIONS ================= */
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

/* ================= CHECK SEND STATUS ================= */
export const getSendStatus = async (taskId) => {
  const res = await axiosInstance.get(
    `/api/candidates/send-status/${taskId}/`
  );
  return res.data;
};



// export const getCandidateById = async (id) => {
//   const res = await axiosInstance.get(`/api/candidates/${id}/`);
//   return res.data;
// };

// export const rewriteCandidateCV = async (id, data) => {
//   const res = await axiosInstance.post(`/api/candidates/${id}/rewrite/`, data);
//   return res.data;
// };

// export const getNearbyOrganizations = async (candidateId, radius_km) => {
//   const params = {};
//   if (radius_km) params.radius_km = radius_km;
  
//   const res = await axiosInstance.get(`/api/candidates/${candidateId}/nearby-organizations/`, { params });
//   return res.data;
// };

// export const getNearbyContacts = async (candidateId, params) => {
//   const res = await axiosInstance.get(`/api/candidates/${candidateId}/nearby-contacts/`, { params });
//   return res.data;
// };

// export const sendToContacts = async (candidateId, payload) => {
//   const res = await axiosInstance.post(`/api/candidates/${candidateId}/send-to-contacts/`, payload);
//   return res.data;
// };
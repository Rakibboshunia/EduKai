import axiosInstance from "./axiosInstance";

/* ================= GET ================= */
export const getOrganizations = async (
  url = "/api/organizations/?page=1&page_size=100"
) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export const getOrganizationById = async (id) => {
  const res = await axiosInstance.get(`/api/organizations/${id}/`);
  return res.data;
};

/* ================= CREATE ================= */
export const createOrganization = async (data) => {
  return axiosInstance.post("/api/organizations/", data);
};

/* ================= UPDATE ================= */
export const updateOrganization = async (id, data) => {
  return axiosInstance.patch(`/api/organizations/${id}/`, data);
};

/* ================= DELETE ================= */
export const deleteOrganization = async (id) => {
  return axiosInstance.delete(`/api/organizations/${id}/`);
};

/* ================= IMPORT ================= */
export const importOrganizations = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    "/api/organizations/import/",
    formData
  );

  return res.data;
};
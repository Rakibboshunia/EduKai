import axiosInstance from "./axiosInstance";

/* ================= GET ================= */
export const getOrganizations = async (url = "/api/organizations/") => {
  const res = await axiosInstance.get(url);
  return res.data; // ✅ full response
};

/* ================= CREATE ================= */
export const createOrganization = async (data) => {
  const res = await axiosInstance.post("/api/organizations/", data);
  return res.data;
};

/* ================= UPDATE ================= */
export const updateOrganization = async (id, data) => {
  const res = await axiosInstance.patch(`/api/organizations/${id}/`, data);
  return res.data;
};

/* ================= DELETE ================= */
export const deleteOrganization = async (id) => {
  const res = await axiosInstance.delete(`/api/organizations/${id}/`);
  return res.data;
};

/* ================= IMPORT ================= */
export const importOrganizations = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    "/api/organizations/import/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
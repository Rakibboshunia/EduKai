import axiosInstance from "./axiosInstance";

/* ================= GET ================= */
export const getContacts = async (
  url = "/api/organizations/contacts/?page=1&page_size=100"
) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

/* ================= CREATE ================= */
export const createContact = async (orgId, payload) => {
  if (!orgId) throw new Error("Organization ID missing ❌");

  const { organization, ...cleanPayload } = payload;

  return axiosInstance.post(
    `/api/organizations/${orgId}/contacts/`,
    cleanPayload
  );
};

/* ================= UPDATE ================= */
export const updateContact = async (id, payload) => {
  return axiosInstance.patch(
    `/api/organizations/contacts/${id}/`,
    payload
  );
};

/* ================= DELETE ================= */
export const deleteContact = async (id) => {
  return axiosInstance.delete(
    `/api/organizations/contacts/${id}/`
  );
};

/* ================= IMPORT ================= */
export const importContacts = async (file, orgId) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("organization", orgId);

  const res = await axiosInstance.post(
    "/api/organizations/import/contacts/",
    formData
  );

  return res.data;
};
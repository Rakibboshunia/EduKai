import axiosInstance from "./axiosInstance";

/* ================= GET CONTACTS ================= */
export const getContacts = async (url = "/api/organizations/contacts/") => {
  const res = await axiosInstance.get(url);
  return res.data; // ✅ full response
};

/* ================= CREATE ================= */
export const createContact = async (orgId, payload) => {
  const res = await axiosInstance.post(
    `/api/organizations/${orgId}/contacts/`,
    payload
  );
  return res.data;
};

/* ================= UPDATE ================= */
export const updateContact = async (contactId, payload) => {
  const res = await axiosInstance.patch(
    `/api/organizations/contacts/${contactId}/`,
    payload
  );
  return res.data;
};

/* ================= DELETE ================= */
export const deleteContact = async (contactId) => {
  const res = await axiosInstance.delete(
    `/api/organizations/contacts/${contactId}/`
  );
  return res.data;
};

/* ---------------- IMPORT (Excel) ---------------- */
export const importContacts = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    "/api/organizations/import/contacts/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
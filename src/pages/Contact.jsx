"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import DynamicSearch from "../components/DynamicSearch";
import AddOrganizationModal from "../components/AddOrganizationModal";
import EditContactModal from "../components/EditContactModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ImportExcelButton from "../components/ImportExcelButton";
import ContactCard from "../components/ContactCard";

import axiosInstance from "../api/axiosInstance";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
} from "../api/contactApi";

import { getOrganizations } from "../api/organizationApi";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);

  const [jobFilter, setJobFilter] = useState("");

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [importing, setImporting] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH CONTACTS ================= */
  const fetchContacts = async (pageNumber = 1) => {
    try {
      const res = await getContacts(
        `/api/organizations/contacts/?page=${pageNumber}&page_size=100`
      );

      const results = res?.results || [];

      setContacts(results);
      setFilteredData(results);
      setSearchResult([]);

      setPage(res?.pagination?.page || 1);
      setTotalPages(res?.pagination?.total_pages || 1);
      setTotalContacts(res?.pagination?.total || 0);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Fetch Contacts Error:", err);
    }
  };

  /* ================= FETCH ORGANIZATIONS ================= */
  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations(
        "/api/organizations/?page=1&page_size=100"
      );

      const data = res?.results || [];

      setOrganizations(data);

      if (data.length > 0) {
        setSelectedOrg(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  /* ================= IMPORT STATUS POLLING ================= */
  const checkImportStatus = async (taskId) => {
    try {
      const res = await axiosInstance.get(
        `/api/organizations/import/status/${taskId}/`
      );

      console.log("Polling status response:", res.data);
      
      // Fallback to state or status and handle casing differences
      const status = res.data?.status || res.data?.state || "";
      const statusStr = status.toLowerCase();

      if (statusStr === "completed" || statusStr === "success" || statusStr === "done") {
        setImporting(false);
        const summary = res.data?.summary;
        if (summary && summary.contacts_skipped > 0) {
           toast.error(`Import Finished: ${summary.contacts_created} created, ${summary.contacts_skipped} skipped.\n\nPlease fix the validation errors in your Excel file. Your backend rejected the rows.`, { duration: 6000 });
        } else {
           toast.success("Import completed\n" + (res.data?.message || ""));
        }
        fetchContacts(page);
      } else if (statusStr === "failed" || statusStr === "failure" || statusStr === "error") {
        setImporting(false);
        toast.error("Import failed\n" + (res.data?.error || res.data?.message || ""));
      } else {
        // Still processing (status: pending, processing, started, etc.)
        setTimeout(() => checkImportStatus(taskId), 2000);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setImporting(false);
      toast.error("Error checking import status. " + (err.response?.data?.error || err.message));
    }
  };

  /* ================= IMPORT ================= */
  const handleImportContacts = async (file) => {
    try {
      setImporting(true);

      const res = await importContacts(file);

      if (!res?.task_id) throw new Error("Task ID missing");

      // No alert here, checkImportStatus handles it
      checkImportStatus(res.task_id);
    } catch (err) {
      console.error(err);
      setImporting(false);
      toast.error("Import failed");
    }
  };

  /* ================= SEARCH ================= */
  const handleSearchFilter = (filtered) => {
    setSearchResult(filtered);
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...(searchResult.length ? searchResult : contacts)];

    if (jobFilter) {
      data = data.filter(
        (item) =>
          item.job_title &&
          item.job_title.toLowerCase().includes(jobFilter.toLowerCase())
      );
    }

    setFilteredData(data);
  }, [searchResult, jobFilter, contacts, selectedOrg]);

  /* ================= ADD ================= */
  const handleAddContact = async (formData) => {
    try {
      if (!selectedOrg) {
        toast.error("Select organization first");
        return;
      }

      await createContact(selectedOrg, formData);

      fetchContacts(page);
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    const contact = contacts.find((c) => c.id === id);
    setSelectedContact(contact);
    setOpenEdit(true);
  };

  const handleUpdateContact = async (data) => {
    try {
      await updateContact(data.id, data);
      fetchContacts(page);
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await deleteContact(deleteId);
      setDeleteId(null);
      fetchContacts(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= JOB OPTIONS ================= */
  const jobOptions = [
    ...new Set(contacts.map((c) => c.job_title).filter(Boolean)),
  ];

  return (
    <div className="p-5">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D468A]">
            Contacts Management
          </h1>
          <p className="text-gray-600 mt-1">
            Total records in database: {totalContacts}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add Contact
          </button>

          <ImportExcelButton onFileUpload={handleImportContacts} />
        </div>
      </div>

      {/* IMPORT STATUS */}
      {importing && (
        <p className="text-blue-600 mb-4 font-medium">
          Importing... Please wait ⏳
        </p>
      )}

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <DynamicSearch
            data={contacts}
            searchKeys={[
              "contact_person",
              "job_title",
              "work_email",
              "organization.name",
              "organization.town",
            ]}
            onFilter={handleSearchFilter}
          />
        </div>

        {/* ORGANIZATION FILTER */}
        {/* <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="text-black pl-4 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">All Organizations</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name || `Org ${org.id}`}
            </option>
          ))}
        </select> */}

        {/* JOB FILTER */}
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="text-black pl-4 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">All Jobs</option>
          {jobOptions.map((job) => (
            <option key={job}>{job}</option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className="max-h-250 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredData.map((contact) => (
            <ContactCard
              key={contact.id}
              data={contact}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-[#2D468A] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
        >
          Prev
        </button>

        <span className="text-[#2D468A] font-medium flex items-center">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-[#2D468A] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
        >
          Next
        </button>
      </div>

      {/* MODALS */}
      <AddOrganizationModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddContact}
        type="contact"
      />

      <EditContactModal
        open={openEdit}
        contact={selectedContact}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateContact}
      />

      <ConfirmDeleteModal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
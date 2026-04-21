"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);

  const [jobFilter, setJobFilter] = useState("");
  const [knownJobs, setKnownJobs] = useState(new Set());

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
      let url = `/api/organizations/contacts/?page=${pageNumber}&page_size=100`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (jobFilter) {
        url += `&job_title=${encodeURIComponent(jobFilter)}`;
      }
      
      const res = await getContacts(url);

      const results = res?.results || [];

      setContacts(results);

      setPage(res?.pagination?.page || 1);
      setTotalPages(res?.pagination?.total_pages || 1);
      setTotalContacts(res?.pagination?.total || 0);

      setKnownJobs(prev => {
        const next = new Set(prev);
        results.forEach(r => r.job_title && next.add(r.job_title));
        return next;
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Fetch Contacts Error:", err);
    }
  };

  /* ================= FETCH ALL JOBS FOR DROPDOWN ================= */
  const fetchAllJobs = async () => {
    try {
      // 1. Fetch first page to get total pages
      const res = await getContacts("/api/organizations/contacts/?page=1&page_size=100");
      
      let jobs = new Set();
      const firstResults = res?.results || [];
      firstResults.forEach(r => r.job_title && jobs.add(r.job_title));
      
      // Update with first page immediately
      setKnownJobs(new Set(jobs));

      const totalPages = res?.pagination?.total_pages || 1;

      // 2. Fetch the remaining pages concurrently (cap at 50 to avoid overloading backend)
      if (totalPages > 1) {
        const maxPages = Math.min(totalPages, 50);
        const promises = [];
        for (let p = 2; p <= maxPages; p++) {
          promises.push(getContacts(`/api/organizations/contacts/?page=${p}&page_size=100`));
        }

        const responses = await Promise.all(promises.map(p => p.catch(() => null)));
        
        responses.forEach(response => {
          if (response && response.results) {
            response.results.forEach(r => r.job_title && jobs.add(r.job_title));
          }
        });

        // 3. Final update with all collected jobs
        setKnownJobs(new Set(jobs));
      }

    } catch (err) {
      console.error("Fetch All Jobs Error:", err);
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
    fetchAllJobs();
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page, jobFilter, searchQuery]);

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

      const res = await importContacts(file, selectedOrg);

      if (!res?.task_id) throw new Error("Task ID missing");

      // No alert here, checkImportStatus handles it
      checkImportStatus(res.task_id);
    } catch (err) {
      console.error(err);
      setImporting(false);
      toast.error("Import failed");
    }
  };



  /* ================= ADD ================= */
  const handleAddContact = async (formData) => {
    try {
      if (!selectedOrg) {
        toast.error("Select organization first");
        return;
      }

      await createContact(selectedOrg, formData);
      toast.success("Contact added successfully!");

      fetchContacts(page);
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add contact");
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
      toast.success("Contact updated successfully!");
      fetchContacts(page);
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update contact");
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await deleteContact(deleteId);
      toast.success("Contact deleted successfully!");
      setDeleteId(null);
      fetchContacts(page);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* ================= JOB OPTIONS ================= */
  const jobOptions = [...knownJobs].sort();

  return (
    <div className="p-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2D468A]">
            Contacts Management
          </h1>
          <p className="text-gray-600 mt-2 md:mt-4">
            Total records in database: {totalContacts}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-3">
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] hover:bg-[#1a3060] text-white px-4 py-2.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto transition font-medium text-sm sm:text-base whitespace-nowrap"
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
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <FiSearch className="absolute left-3 top-[14px] text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search contacts..."
            className="w-full text-black pl-10 pr-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
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
          onChange={(e) => {
            setJobFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-1/2 text-black pl-4 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">All Jobs</option>
          {jobOptions.map((job) => (
            <option key={job}>{job}</option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className="max-h-250 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {contacts.map((contact) => (
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
          className="bg-[#2D468A] hover:bg-[#1a3060] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
        >
          Prev
        </button>

        <span className="text-[#2D468A] font-medium flex items-center">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-[#2D468A] hover:bg-[#1a3060] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
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
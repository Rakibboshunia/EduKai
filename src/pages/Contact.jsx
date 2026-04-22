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
import Pagination from "../components/Pagination";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);

  const [jobFilter, setJobFilter] = useState("");
  const [knownJobs, setKnownJobs] = useState(new Set());

  const [phaseFilter, setPhaseFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [laFilter, setLaFilter] = useState("");

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
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (jobFilter) {
        url += `&job_title=${encodeURIComponent(jobFilter)}`;
      }
      if (phaseFilter) {
        url += `&phase=${encodeURIComponent(phaseFilter)}`;
      }
      if (townFilter) {
        url += `&town=${encodeURIComponent(townFilter)}`;
      }
      if (genderFilter) {
        url += `&gender=${encodeURIComponent(genderFilter)}`;
      }
      if (laFilter) {
        url += `&local_authority=${encodeURIComponent(laFilter)}`;
      }

      const res = await getContacts(url);

      const results = res?.results || [];

      setContacts(results);

      setPage(res?.pagination?.page || 1);
      setTotalPages(res?.pagination?.total_pages || 1);
      setTotalContacts(res?.pagination?.total || 0);

      setKnownJobs((prev) => {
        const next = new Set(prev);
        results.forEach((r) => r.job_title && next.add(r.job_title));
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
      const res = await getContacts(
        "/api/organizations/contacts/?page=1&page_size=100",
      );

      let jobs = new Set();
      const firstResults = res?.results || [];
      firstResults.forEach((r) => r.job_title && jobs.add(r.job_title));

      // Update with first page immediately
      setKnownJobs(new Set(jobs));

      const totalPages = res?.pagination?.total_pages || 1;

      // 2. Fetch the remaining pages concurrently (cap at 50 to avoid overloading backend)
      if (totalPages > 1) {
        const maxPages = Math.min(totalPages, 50);
        const promises = [];
        for (let p = 2; p <= maxPages; p++) {
          promises.push(
            getContacts(`/api/organizations/contacts/?page=${p}&page_size=100`),
          );
        }

        const responses = await Promise.all(
          promises.map((p) => p.catch(() => null)),
        );

        responses.forEach((response) => {
          if (response && response.results) {
            response.results.forEach(
              (r) => r.job_title && jobs.add(r.job_title),
            );
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
        "/api/organizations/?page=1&page_size=100",
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
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchContacts(page);
  }, [
    page,
    jobFilter,
    debouncedSearch,
    phaseFilter,
    townFilter,
    genderFilter,
    laFilter,
  ]);

  /* ================= IMPORT STATUS POLLING ================= */
  const checkImportStatus = async (taskId) => {
    try {
      const res = await axiosInstance.get(
        `/api/organizations/import/status/${taskId}/`,
      );

      console.log("Polling status response:", res.data);

      // Fallback to state or status and handle casing differences
      const status = res.data?.status || res.data?.state || "";
      const statusStr = status.toLowerCase();

      if (
        statusStr === "completed" ||
        statusStr === "success" ||
        statusStr === "done"
      ) {
        setImporting(false);
        const summary = res.data?.summary;
        if (summary && summary.contacts_skipped > 0) {
          toast.error(
            `Import Finished: ${summary.contacts_created} created, ${summary.contacts_skipped} skipped.\n\nPlease fix the validation errors in your Excel file. Your backend rejected the rows.`,
            { duration: 6000 },
          );
        } else {
          toast.success("Import completed\n" + (res.data?.message || ""));
        }
        fetchContacts(page);
      } else if (
        statusStr === "failed" ||
        statusStr === "failure" ||
        statusStr === "error"
      ) {
        setImporting(false);
        toast.error(
          "Import failed\n" + (res.data?.error || res.data?.message || ""),
        );
      } else {
        // Still processing (status: pending, processing, started, etc.)
        setTimeout(() => checkImportStatus(taskId), 2000);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setImporting(false);
      toast.error(
        "Error checking import status. " +
          (err.response?.data?.error || err.message),
      );
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

  /* ================= OPTIONS ================= */
  const jobOptions = [...knownJobs].sort();
  const phaseOptions = [
    ...new Set(organizations.map((o) => o.phase).filter(Boolean)),
  ].sort();
  const townOptions = [
    ...new Set(organizations.map((o) => o.town).filter(Boolean)),
  ].sort();
  const laOptions = [
    ...new Set(organizations.map((o) => o.local_authority).filter(Boolean)),
  ].sort();

  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between w-full h-full relative z-10 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
                Contacts Management
              </h1>
              <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
                Maintain and structure all your key personnel and client
                contacts.
              </p>
            </div>
            <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-3 w-fit">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">
                  Total Contacts
                </span>
                <span className="text-2xl font-extrabold leading-none">
                  {totalContacts}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end lg:items-center gap-3 w-full lg:w-auto h-fit mt-auto lg:pb-1">
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-r from-[#2D468A] to-[#1a3060] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-medium px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md w-full sm:w-auto whitespace-nowrap"
            >
              <FiPlus size={18} /> Add Contact
            </button>
            <div className="w-full sm:w-auto">
              <ImportExcelButton onFileUpload={handleImportContacts} />
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT STATUS ALERT */}
      {importing && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-pulse">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2D468A]"></div>
          <p className="text-[#2D468A] font-semibold">
            Importing your contacts... Please do not close the window.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        {/* Filters Area */}
        <div className="p-10 border-b border-gray-100 bg-slate-50/50">
          <label className="text-xs font-bold tracking-wider uppercase text-[#2D468A] mb-3 block">
            Search & Filter Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-[14px] text-[#2D468A]/60"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search contacts..."
                className="w-full text-gray-800 pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm"
              />
            </div>

            <select
              value={jobFilter}
              onChange={(e) => {
                setJobFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Jobs</option>
              {jobOptions.map((job) => (
                <option key={job}>{job}</option>
              ))}
            </select>

            <select
              value={phaseFilter}
              onChange={(e) => {
                setPhaseFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Phases</option>
              {phaseOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={townFilter}
              onChange={(e) => {
                setTownFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Towns</option>
              {townOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Genders</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="mixed">Mixed</option>
            </select>

            <select
              value={laFilter}
              onChange={(e) => {
                setLaFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Local Authority</option>
              {laOptions.map((la) => (
                <option key={la} value={la}>
                  {la}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-6 sm:p-8 bg-gray-50/30">
          {contacts.length > 0 ? (
            <div className="max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-gray-700">
                No Contacts Found
              </h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                There are no contacts matching the current filter or search
                criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white/70 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}
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




"use client";

import { useMemo, useState, useEffect } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { getNearbyContacts } from "../api/candidateApi";
import Pagination from "../components/Pagination";
import Table from "../components/Table";

export default function MailSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate || {};

  const [filters, setFilters] = useState({});
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [organizations, setOrganizations] = useState([]);

  const PER_PAGE = 100;

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!candidate.id) return;

    const fetchAllContacts = async () => {
      try {
        // Fetch first page to get total pages
        const res = await getNearbyContacts(candidate.id, { page: 1, page_size: 100 });
        let allResults = [...(res?.results || [])];
        
        let totalPages = 1;
        if (res?.pagination?.total_pages) {
          totalPages = res.pagination.total_pages;
        } else if (res?.count) {
          totalPages = Math.ceil(res.count / 100);
        }

        // Fetch remaining pages concurrently
        if (totalPages > 1) {
          const promises = [];
          for (let p = 2; p <= totalPages; p++) {
            promises.push(getNearbyContacts(candidate.id, { page: p, page_size: 100 }));
          }

          const responses = await Promise.all(promises.map((p) => p.catch(() => null)));
          responses.forEach((r) => {
            if (r && r.results) {
              allResults = [...allResults, ...r.results];
            }
          });
        }

        const mapped = allResults.map((item) => ({
          // ✅ UNIQUE ID FIX
          id: `${item.contact_id}-${item.contact_email}`,
          name: item.organization_name || "N/A",
          email: item.contact_email || "N/A",
          contact_person: item.contact_person || "N/A",
          job_title: item.contact_job_title || "N/A",
          industry: item.organization_local_authority || "N/A",
          location: item.organization_town || "N/A",
          radius: item.distance_km || "N/A",
          phase: item.organization_phase || "N/A",
        }));

        setOrganizations(mapped);
      } catch (err) {
        console.error(err);
        setOrganizations([]);
      }
    };

    fetchAllContacts();
  }, [candidate.id]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, orgSearch]);

  /* ================= DYNAMIC OPTIONS ================= */
  const getUnique = (key) => {
    return [...new Set(organizations.map((o) => o[key]).filter(Boolean))];
  };

  const cityOptions = getUnique("location");
  const jobOptions = getUnique("job_title");
  const phaseOptions = getUnique("phase");
  
  // Parse numeric radii, round up, deduplicate, and sort ascending
  const rawRadius = getUnique("radius");
  const radiusOptions = [...new Set(
    rawRadius
      .map((r) => (r === "N/A" ? null : Math.ceil(Number(r))))
      .filter((r) => r !== null && !isNaN(r))
  )].sort((a, b) => a - b);

  /* ================= FILTER ================= */
  const filteredOrganizations = useMemo(() => {
    let data = [...organizations];

    if (orgSearch) {
      const search = orgSearch.toLowerCase();
      data = data.filter((org) =>
        [
          org.name,
          org.location,
          org.contact_person,
          org.job_title,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
    }

    if (filters.city) {
      data = data.filter((o) => o.location === filters.city);
    }

    if (filters.job) {
      data = data.filter((o) => o.job_title === filters.job);
    }

    if (filters.phase) {
      data = data.filter((o) => o.phase === filters.phase);
    }

    if (filters.radius) {
      data = data.filter((o) => o.radius <= Number(filters.radius));
    }

    return data;
  }, [organizations, orgSearch, filters]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredOrganizations.length / PER_PAGE);

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  /* ================= SELECT ================= */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedOrganizations.map((o) => o.id);

    const isAllSelected = pageIds.every((id) =>
      selectedIds.includes(id)
    );

    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pageIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      header: "Select",
      accessor: "select",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelect(row.id)}
        />
      ),
    },
    { header: "Organization Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Contact Person", accessor: "contact_person" },
    { header: "Job Title", accessor: "job_title" },
    { header: "Industry", accessor: "industry" },
    { header: "Location", accessor: "location" },
    { header: "Radius (KM)", accessor: "radius" },
    { header: "Phase", accessor: "phase" },
  ];

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between w-full h-full relative z-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
              Mail Submission Queue
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
              Select contacts and automatically distribute candidate applications dynamically.
            </p>
          </div>
          <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between gap-6 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">Loaded Contacts</span>
              <span className="text-xl font-extrabold leading-none">{organizations.length}</span>
            </div>
            <div className="w-px h-8 bg-blue-200/50 hidden sm:block"></div>
            <div className="flex flex-col pl-2 sm:pl-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">Selected</span>
              <span className="text-xl font-extrabold leading-none text-green-600">{selectedIds.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        
        {/* Filters Area */}
        <div className="p-6 border-b border-gray-100 bg-slate-50/50">
          <label className="text-xs font-bold tracking-wider uppercase text-[#2D468A] mb-3 block">
            Search & Filter Audience
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* SEARCH */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-[14px] text-[#2D468A]/60" size={18} />
              <input
                type="text"
                placeholder="Search keywords..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="w-full text-gray-800 pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm"
              />
            </div>

            {/* LOCATION */}
            <select
              value={filters.city || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              {cityOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* JOB */}
            <select
              value={filters.job || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, job: e.target.value }))
              }
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Job Titles</option>
              {jobOptions.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>

            {/* PHASE */}
            <select
              value={filters.phase || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, phase: e.target.value }))
              }
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Phases</option>
              {phaseOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            {/* RADIUS */}
            <select
              value={filters.radius || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, radius: e.target.value }))
              }
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Radius Data</option>
              {radiusOptions.map((r) => (
                <option key={r} value={r}>Up to {r} KM</option>
              ))}
            </select>

          </div>
        </div>

        {/* Data Container */}
        <div className="p-6 sm:p-8 bg-gray-50/30 font-medium">
          
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-3 text-sm font-bold text-[#2D468A] bg-white border border-blue-100 shadow-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors w-max">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#2D468A] rounded border-gray-300 focus:ring-[#2D468A]"
                checked={
                  paginatedOrganizations.length > 0 &&
                  paginatedOrganizations.every((o) =>
                    selectedIds.includes(o.id)
                  )
                }
                onChange={toggleSelectAll}
              />
              Select All on Current Page
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table columns={columns} data={paginatedOrganizations} />
            </div>
          </div>
          
          {organizations.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300 mt-4">
               <div className="bg-gray-50 p-4 rounded-full mb-4">
                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <h3 className="text-xl font-bold tracking-tight text-gray-700">No Contacts Found</h3>
               <p className="text-gray-500 text-sm mt-2 max-w-sm">
                 Please adjust your search and filters to discover candidates.
               </p>
             </div>
          )}

        </div>

        {/* Pagination & Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="w-full lg:w-auto">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
          
          <button
            disabled={selectedIds.length === 0}
            onClick={() =>
              navigate("/ai/mail-submission/compose", {
                state: { contactIds: selectedIds, candidate },
              })
            }
            className={`w-full lg:w-auto px-10 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300
              ${
                selectedIds.length
                  ? "bg-gradient-to-r from-[#2D468A] to-[#1a3060] text-white hover:scale-[1.02] hover:shadow-lg shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
          >
            <FiSend size={18} />
            <span>Proceed to Email Submission Configuration →</span>
          </button>
          
        </div>

      </div>
    </div>
  );
}
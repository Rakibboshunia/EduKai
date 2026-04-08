"use client";

import { useMemo, useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
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

    // Fetch a large pool of nearby contacts once. Client-side will handle all searching and filtering.
    const params = {
      page: 1,
      page_size: 1000, 
    };

    getNearbyContacts(candidate.id, params)
      .then((res) => {
        const mapped = (res?.results || []).map((item) => ({
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
      })
      .catch((err) => {
        console.error(err);
        setOrganizations([]);
      });

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
    <div className="p-6 space-y-8">

      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission
        </h2>

        <p className="text-sm text-gray-600">
          Generate and send candidate application emails automatically
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">

        {/* SEARCH & FILTERS ON ONE LINE */}
        <div>
          <label className="text-sm font-medium text-[#2D468A] mb-2 block">
            Search & Filter Organizations
          </label>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* SEARCH */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-[14px] text-gray-400" />
              <input
                type="text"
                placeholder="Search keywords..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
              />
            </div>

            {/* LOCATION */}
            <select
              value={filters.city || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full text-black px-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
            >
              <option value="">All Location</option>
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
              className="w-full text-black px-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
            >
              <option value="">All Job Title</option>
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
              className="w-full text-black px-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
            >
              <option value="">All Phase</option>
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
              className="w-full text-black px-4 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
            >
              <option value="">All Radius</option>
              {radiusOptions.map((r) => (
                <option key={r} value={r}>Up to {r} KM</option>
              ))}
            </select>

          </div>
        </div>

        {/* SELECT ALL */}
        <label className="flex items-center gap-2 text-sm text-[#2D468A]">
          <input
            type="checkbox"
            checked={
              paginatedOrganizations.length > 0 &&
              paginatedOrganizations.every((o) =>
                selectedIds.includes(o.id)
              )
            }
            onChange={toggleSelectAll}
          />
          Select All (This Page)
        </label>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <Table columns={columns} data={paginatedOrganizations} />
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* BUTTON */}
        <button
          disabled={selectedIds.length === 0}
          onClick={() =>
            navigate("/ai/mail-submission/compose", {
              state: { contactIds: selectedIds, candidate },
            })
          }
          className={`w-full py-3 rounded-lg font-medium text-sm hover:bg-[#1a3060]
            ${
              selectedIds.length
                ? "bg-[#2D468A] text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          ✈️ Proceed to Email Submission
        </button>

      </div>
    </div>
  );
}
"use client";

import { useMemo, useState, useEffect } from "react";
import { FiCheckCircle, FiSearch } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { getNearbyContacts } from "../api/candidateApi";
import Pagination from "../components/Pagination";
import Table from "../components/Table";

const FILTERS = [
  {
    name: "city",
    label: "Location",
    options: ["London", "New York", "Helsinki", "Copenhagen", "Stockholm"],
  },
  {
    name: "job",
    label: "Job Title",
    options: [
      "Flutter Developer",
      "Science Teacher",
      "Maths Teacher",
      "English Teacher",
      "ICT Teacher",
    ],
  },
];

export default function MailSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate || {};

  const [filters, setFilters] = useState({});
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [organizations, setOrganizations] = useState([]);

  const PER_PAGE = 10;

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!candidate.id) return;

    const params = {
      page: 1,
      page_size: 100,
    };

    if (filters.city) params.town = filters.city;
    if (filters.job) params.job_title = filters.job;
    if (orgSearch) params.search = orgSearch;

    getNearbyContacts(candidate.id, params)
      .then((res) => {
        console.log("API RESPONSE:", res);

        const mapped = (res?.results || []).map((item) => ({
          id: item.contact_id, // 🔥 IMPORTANT
          name: item.organization_name,
          email: item.contact_email,
          contact_person: item.contact_person,
          job_title: item.contact_job_title,
          industry: item.organization_local_authority || "-",
          location: item.organization_town,
          radius: item.distance_km,
          phase: item.organization_phase,
        }));

        setOrganizations(mapped);
      })
      .catch((err) => {
        console.error(err);
        setOrganizations([]);
      });

  }, [candidate.id, filters, orgSearch]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, orgSearch]);

  /* ================= SEARCH ================= */
  const filteredOrganizations = useMemo(() => {
    if (!orgSearch) return organizations;

    const search = orgSearch.toLowerCase();

    return organizations.filter((org) =>
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
  }, [organizations, orgSearch]);

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

        {/* SEARCH */}
        <div>
          <label className="text-sm font-medium text-[#2D468A] mb-2 block">
            Search Organizations
          </label>

          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={orgSearch}
              onChange={(e) => setOrgSearch(e.target.value)}
              className="w-full text-black border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FILTERS.map((filter) => (
            <div key={filter.name}>
              <label className="text-xs text-[#2D468A] font-medium">
                {filter.label}
              </label>

              <select
                value={filters[filter.name] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.name]: e.target.value,
                  }))
                }
                className="w-full text-black border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
          className={`w-full py-3 rounded-lg font-medium text-sm
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
import { useMemo, useState } from "react";
import { FiCheckCircle, FiUser, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Pagination from "../components/Pagination";
import Table from "../components/Table";

/* ================= FILTER CONFIG ================= */

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
      "HOD Science",
      "Science Teacher",
      "Maths Teacher",
      "English Teacher",
      "ICT Teacher",
    ],
  },
  {
    name: "phase",
    label: "Phase",
    options: ["Active", "Inactive"],
  },
  {
    name: "radius",
    label: "Radius",
    options: ["5 KM", "10 KM", "25 KM", "50 KM"],
  },
];

/* ================= ORGANIZATION DATA ================= */

const ORGANIZATIONS = [
  {
    id: 1,
    name: "Greenfield Academy",
    email: "hr@greenfieldacademy.uk",
    contact_person: "Sarah Mitchell",
    industry: "School",
    location: "London",
    job_title: "HOD Science",
    phase: "Active",
    radius: "10 KM",
  },
  {
    id: 2,
    name: "Bright Future School",
    email: "careers@brightfuture.edu",
    contact_person: "James Walker",
    industry: "School",
    location: "Manchester",
    job_title: "Maths Teacher",
    phase: "Active",
    radius: "5 KM",
  },
  {
    id: 3,
    name: "Nordic Learning Center",
    email: "jobs@nordiclearning.fi",
    contact_person: "Emma Laine",
    industry: "School",
    location: "Helsinki",
    job_title: "Science Teacher",
    phase: "Inactive",
    radius: "25 KM",
  },
  {
    id: 4,
    name: "Global Scholars Institute",
    email: "hr@globalscholars.org",
    contact_person: "William Anderson",
    industry: "School",
    location: "New York",
    job_title: "Humanities Teacher",
    phase: "Active",
    radius: "25 KM",
  },
];

/* ================= PAGE ================= */

export default function MailSubmission() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 5;

  /* ================= FILTER LOGIC ================= */

  const filteredOrganizations = useMemo(() => {
    return ORGANIZATIONS.filter((org) => {
      // Dropdown Filters
      if (filters.city && org.location !== filters.city) return false;
      if (filters.job && org.job_title !== filters.job) return false;
      if (filters.phase && org.phase !== filters.phase) return false;
      if (filters.radius && org.radius !== filters.radius) return false;

      // 🔍 Search (Job Title + Contact Person + Location)
      if (orgSearch) {
        const search = orgSearch.toLowerCase();

        return (
          org.job_title.toLowerCase().includes(search) ||
          org.contact_person.toLowerCase().includes(search) ||
          org.location.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [filters, orgSearch]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredOrganizations.length / PER_PAGE);

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  /* ================= SELECTION ================= */

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrganizations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrganizations.map((o) => o.id));
    }
  };

  /* ================= TABLE COLUMNS ================= */

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
    { header: "Radius", accessor: "radius" },
    { header: "Phase", accessor: "phase" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission & Outlook Integration
        </h2>

        <p className="text-sm text-gray-600">
          Generate and send candidate application emails automatically
        </p>

        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-md w-fit">
          <FiCheckCircle />
          Outlook Account Connected — recruiter@company.com
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">

        {/* 🔍 Organization Search */}
        <div>
          <label className="text-sm font-medium text-[#2D468A] mb-2 block">
            Search Organizations
          </label>

          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Job Title, Contact Person, or Location..."
              value={orgSearch}
              onChange={(e) => {
                setOrgSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-black border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#2D468A] focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FILTERS.map((filter) => (
            <div key={filter.name}>
              <label className="text-xs text-[#2D468A] font-medium">
                {filter.label}
              </label>

              <select
                value={filters[filter.name] || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    [filter.name]: e.target.value,
                  }));
                  setCurrentPage(1);
                }}
                className="w-full text-black border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
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

        {/* Select All */}
        <label className="flex items-center gap-2 text-sm text-[#2D468A]">
          <input
            type="checkbox"
            checked={
              filteredOrganizations.length > 0 &&
              selectedIds.length === filteredOrganizations.length
            }
            onChange={toggleSelectAll}
          />
          Select All
        </label>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table columns={columns} data={paginatedOrganizations} />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Submit Button */}
        <button
          disabled={selectedIds.length === 0}
          onClick={() =>
            navigate("/ai/mail-submission/compose", {
              state: {
                organizations: selectedIds,
              },
            })
          }
          className={`w-full py-3 rounded-lg font-medium text-sm transition cursor-pointer
            ${
              selectedIds.length
                ? "bg-[#2D468A] text-white hover:bg-[#243a73]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          ✈️ Proceed to Email Submission
        </button>
      </div>
    </div>
  );
}
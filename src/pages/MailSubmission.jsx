import { useMemo, useState, useEffect } from "react";
import { FiCheckCircle, FiUser, FiSearch } from "react-icons/fi";
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
    options: ["Nursery", "Primary", "Secondary", "Higher Secondary"],
  },
  {
    name: "radius",
    label: "Radius",
    options: ["5", "10", "15", "20", "25", "30", "50"], 
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
    if (candidate.id) {
      const params = {};

      // ✅ radius
      const rad = parseInt(filters.radius);
      if (!isNaN(rad)) params.radius_km = rad;

      // ✅ phase
      if (filters.phase && filters.phase !== "All") {
        params.phase = filters.phase;
      }

      // ✅ city → backend uses town
      if (filters.city && filters.city !== "All") {
        params.town = filters.city;
      }

      // ✅ job_title
      if (filters.job && filters.job !== "All") {
        params.job_title = filters.job;
      }

      console.log("API PARAMS:", params);

      getNearbyContacts(candidate.id, params)
        .then((res) => {
          console.log("API contacts:", res);

          // ✅ SAFE handling
          const fetchedData = Array.isArray(res?.results)
            ? res.results
            : [];

          setOrganizations(fetchedData);
        })
        .catch((err) => {
          console.error("API error:", err);
          setOrganizations([]);
        });
    }
  }, [candidate.id, filters]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, orgSearch]);

  /* ================= SEARCH FILTER ================= */
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (orgSearch) {
        const search = orgSearch.toLowerCase();

        const match =
          (org.job_title &&
            org.job_title.toLowerCase().includes(search)) ||
          (org.contact_person &&
            org.contact_person.toLowerCase().includes(search)) ||
          (org.location &&
            org.location.toLowerCase().includes(search)) ||
          (org.name && org.name.toLowerCase().includes(search));

        if (!match) return false;
      }

      return true;
    });
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

    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
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
    { header: "Radius", accessor: "radius" },
    { header: "Phase", accessor: "phase" },
  ];

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">

      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission & Outlook Integration
        </h2>

        <p className="text-sm text-gray-600">
          Generate and send candidate application emails automatically
        </p>

        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-md w-fit">
          <FiCheckCircle />
          Outlook Account Connected
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">

        {/* Search */}
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
              onChange={(e) => setOrgSearch(e.target.value)}
              className="w-full text-black border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#2D468A]"
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
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.name]: e.target.value,
                  }))
                }
                className="w-full text-black border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {filter.name === "radius" ? `${opt} KM` : opt}
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
              paginatedOrganizations.length > 0 &&
              paginatedOrganizations.every((o) =>
                selectedIds.includes(o.id)
              )
            }
            onChange={toggleSelectAll}
          />
          Select All (This Page)
        </label>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table columns={columns} data={paginatedOrganizations} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Next Button */}
        <button
          disabled={selectedIds.length === 0}
          onClick={() =>
            navigate("/ai/mail-submission/compose", {
              state: { contactIds: selectedIds, candidate },
            })
          }
          className={`w-full py-3 rounded-lg font-medium text-sm transition
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
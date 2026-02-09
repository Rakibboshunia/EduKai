import { useMemo, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import FilterBar from "../components/FilterBar";
import OrganizationCard from "../components/OrganizationCard";
import Pagination from "../components/Pagination";

/* ================= FILTER CONFIG ================= */

const FILTERS = [
  { name: "city", label: "City", options: ["London", "New York", "Helsinki", "Copenhagen", "San Francisco"] },
  { name: "town", label: "Town", options: ["Central London", "Camden", "Greenwich", "Hackney", "Westminster"] },
  { name: "postcode", label: "Post Code", options: ["EC1A", "W1A", "SW1A", "NW1", "E1"] },
  { name: "job", label: "Job Title", options: ["HR Manager", "Recruitment Officer", "Talent Acquisition", "People Operations", "HR Executive"] },
  { name: "phase", label: "Phase", options: ["Active", "Inactive", "Interviewing", "On Hold", "Closed"] },
  { name: "radius", label: "Radius", options: ["0 KM", "5 KM", "10 KM", "25 KM", "50 KM"] },
];

/* ================= ORGANIZATION DATA ================= */

const ORGANIZATIONS = [
  { id: 1, name: "TechCorp Solutions", email: "recruitment@techcorp.com", location: "London", skills: ["Technology", "London"] },
  { id: 2, name: "NordicSoft", email: "careers@nordicsoft.fi", location: "Helsinki", skills: ["Software", "Finland"] },
  { id: 3, name: "Denmark Systems", email: "jobs@dksystems.dk", location: "Copenhagen", skills: ["IT", "Denmark"] },
  { id: 4, name: "USA Tech Group", email: "hr@usatech.com", location: "New York", skills: ["Technology", "USA"] },
  { id: 5, name: "London Recruiters", email: "contact@londonrec.co.uk", location: "London", skills: ["HR", "UK"] },
  { id: 6, name: "Scandi Talent", email: "talent@scandi.com", location: "Stockholm", skills: ["Recruitment", "Nordic"] },
  { id: 7, name: "London Recruiters", email: "contact@londonrec.co.uk", location: "London", skills: ["HR", "UK"] },
  { id: 8, name: "Scandi Talent", email: "talent@scandi.com", location: "Stockholm", skills: ["Recruitment", "Nordic"] },
  { id: 9, name: "London Recruiters", email: "contact@londonrec.co.uk", location: "London", skills: ["HR", "UK"] },
  { id: 10, name: "Scandi Talent", email: "talent@scandi.com", location: "Stockholm", skills: ["Recruitment", "Nordic"] },
];

/* ================= PAGE ================= */

export default function MailSubmission() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 6;

  /* ---------- Filter Logic ---------- */
  const filteredOrganizations = useMemo(() => {
    return ORGANIZATIONS.filter((org) => {
      if (filters.city && org.location !== filters.city) return false;
      return true;
    });
  }, [filters]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredOrganizations.length / PER_PAGE);

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  /* ---------- Selection ---------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredOrganizations.length
        ? []
        : filteredOrganizations.map((o) => o.id)
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-4 sm:p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission & Outlook Integration
        </h2>

        <p className="text-sm text-gray-700 max-w-2xl">
          Generate and send candidate application emails automatically
        </p>

        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-md w-fit">
          <FiCheckCircle />
          Outlook Account Connected — recruiter@company.com
        </div>
      </div>

      {/* ================= MAIN WRAPPER ================= */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-10">

        {/* ================= CANDIDATE ================= */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2D468A]">
            Candidate Name
          </label>
          <input
            readOnly
            value="John Smith"
            className="w-full border text-[#2D468A] rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>

        {/* ================= SELECT ORGANIZATIONS ================= */}
        <div className="space-y-6">
          <h3 className="font-medium text-[#2D468A]">
            Select Organizations
          </h3>

          <FilterBar
            filters={FILTERS}
            values={filters}
            onChange={(name, value) => {
              setFilters((prev) => ({ ...prev, [name]: value }));
              setCurrentPage(1);
            }}
          />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                id={org.id}
                name={org.name}
                email={org.email}
                skills={org.skills}
                selectable
                selected={selectedIds.includes(org.id)}
                onSelect={() => toggleSelect(org.id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* ================= SUBMIT ================= */}
        <div className="flex justify-center pt-4">
          <button
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (selectedIds.length === 0) return;

              navigate("/mail/submission/compose", {
                state: {
                  candidate: "John Smith",
                  organizations: selectedIds,
                },
              });
            }}
            className={`px-8 sm:px-10 py-3 rounded-lg font-medium transition cursor-pointer
              ${
                selectedIds.length
                  ? "bg-[#2D468A] text-white hover:bg-[#243a73]"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            Proceed to Email Submission
          </button>
        </div>

      </div>
    </div>
  );
}

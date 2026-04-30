import { useMemo, useState, useEffect, useCallback } from "react";
import { FiSearch, FiSend, FiMapPin, FiBriefcase, FiLayers, FiRadio, FiMail, FiUser } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getNearbyContacts } from "../api/candidateApi";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { useUIState } from "../provider/UIStateProvider";

export default function MailSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate || {};

  const { mailSubmission, updateMailSubmission } = useUIState();
  const [filters, setFilters] = useState(mailSubmission.filters || {});
  const [orgSearch, setOrgSearch] = useState(mailSubmission.orgSearch || "");
  const [selectedIds, setSelectedIds] = useState(mailSubmission.selectedIds || []);

  const [currentPage, setCurrentPage] = useState(mailSubmission.page || 1);
  const [organizations, setOrganizations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 100;

  /* ================= API CALL ================= */
  const fetchContacts = useCallback(async () => {
    if (!candidate.id) return;

    try {
      setLoading(true);
      const res = await getNearbyContacts(candidate.id, {
        page: currentPage,
        page_size: PER_PAGE,
        radius: filters.radius || undefined, // ✅ backend filtering
      });

      const mapped = (res?.results || []).map((item) => ({
        id: `${item.contact_id}-${item.contact_email}`,
        name: item.organization_name || "N/A",
        email: item.contact_email || "N/A",
        contact_person: item.contact_person || "N/A",
        job_title: item.contact_job_title || "N/A",
        industry: item.organization_local_authority || "N/A",
        location: item.organization_town || "N/A",
        radius:
          item.distance_km !== null && item.distance_km !== undefined
            ? Number(item.distance_km)
            : null, // ✅ always number or null
        phase: item.organization_phase || "N/A",
      }));

      setOrganizations(mapped);
      setTotalPages(res?.pagination?.total_pages || 1);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setOrganizations([]);
      setLoading(false);
    }
  }, [candidate.id, currentPage, filters.radius]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

  const radiusOptions = useMemo(() => {
    const staticValues = [1, 3, 5, 7];
    const everyFive = [];
    for (let i = 10; i <= 1000; i += 5) {
      everyFive.push(i);
    }
    return [...staticValues, ...everyFive];
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredOrganizations = useMemo(() => {
    let data = [...organizations];

    if (orgSearch) {
      const search = orgSearch.toLowerCase();
      data = data.filter((org) =>
        [org.name, org.location, org.contact_person, org.job_title]
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

    // ✅ Safe radius filter
    if (filters.radius) {
      const selectedRadius = Number(filters.radius);
      data = data.filter(
        (o) => o.radius !== null && o.radius <= selectedRadius
      );
    }

    return data;
  }, [organizations, orgSearch, filters]);

  /* ================= SELECT ================= */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = filteredOrganizations.map((o) => o.id);
    const isAllSelected = pageIds.every((id) => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  // ✅ Persist state on change
  useEffect(() => {
    updateMailSubmission({ 
      selectedIds, 
      filters, 
      orgSearch, 
      page: currentPage 
    });
  }, [selectedIds, filters, orgSearch, currentPage, updateMailSubmission]);

  /* ================= TABLE ================= */
  const columns = [
    {
      header: "Select",
      accessor: "select",
      render: (_, row) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelect(row.id)}
        />
      ),
    },
    { 
      header: "Organization & Local Authority", 
      accessor: "name",
      render: (val, row) => (
        <div className="flex flex-col gap-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <HiOutlineOfficeBuilding className="text-brand-primary" size={14} />
            <span className="font-bold text-gray-900 text-[14px] leading-tight">{val}</span>
          </div>
          <span className="text-[12px] text-gray-500 font-medium">{row.industry}</span>
        </div>
      )
    },
    
    { 
      header: "Contact Person & Job Title", 
      accessor: "contact_person",
      render: (val, row) => (
        <div className="flex flex-col gap-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[12px]">
            <FiUser className="text-brand-primary/70" size={12} />
            <span>{val}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-[12px] font-medium">
            <FiBriefcase size={11} />
            <span>{row.job_title}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Email & Location", 
      accessor: "email",
      render: (val, row) => (
        <div className="flex flex-col gap-1 min-w-[220px]">
          <div className="flex items-center gap-1.5 text-black text-[12px] font-medium">
            <FiMail size={12} />
            <span className="">{val}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <FiMapPin size={11} />
            <span className="">{row.location}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Phase", 
      accessor: "phase",
      render: (val) => (
        <span className="px-2 py-1 bg-blue-50 text-brand-primary rounded text-[12px] font-bold uppercase border border-blue-100">
          {val}
        </span>
      )
    },
    {
      header: "Radius",
      accessor: "radius",
      render: (val) => (
        <div className="flex items-center gap-1 text-[12px]">
          <span className="font-bold text-brand-primary">{val !== null ? `${val} KM` : "N/A"}</span>
        </div>
      ),
    }
  ];

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto mb-10 text-black">

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-brand-primary hover:border-blue-200 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />AI Re-writer
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between w-full relative z-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-brand-primary">
              Mail Submission Queue
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-4">
              Select contacts and automatically distribute candidate
              applications dynamically.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 text-brand-primary px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between gap-6 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary/70">
                Loaded Contacts
              </span>
              <span className="text-xl font-extrabold leading-none">
                {organizations.length}
              </span>
            </div>

            <div className="w-px h-8 bg-blue-200/50 hidden sm:block"></div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary/70">
                Selected
              </span>
              <span className="text-xl font-extrabold leading-none text-green-600">
                {selectedIds.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-blue-50 shadow-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-slate-50/50">
          <label className="text-xs font-bold tracking-wider uppercase text-brand-primary mb-3 block">
            Search & Filter Audience
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* SEARCH */}
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-[14px] text-brand-primary/60"
                size={18}
              />
              <input
                type="text"
                placeholder="Search keywords..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="w-full text-gray-800 pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary shadow-sm transition-all text-sm"
              />
            </div>

            {/* LOCATION */}
            <select
              value={filters.city || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary shadow-sm text-sm cursor-pointer"
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
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary shadow-sm text-sm cursor-pointer"
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
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary shadow-sm text-sm cursor-pointer"
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
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary shadow-sm text-sm cursor-pointer"
            >
              <option value="">All Radius</option>
              {radiusOptions.map((r) => (
                <option key={r} value={r}>
                  {r} KM
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-5 sm:p-7 space-y-5">
          {/* SELECT ALL */}
          <label className="flex items-center gap-3 text-sm font-bold text-brand-primary border border-blue-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition w-max">
            <input type="checkbox" onChange={toggleSelectAll} />
            Select All
          </label>

          {/* TABLE */}
          <div className="max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
                <h3 className="text-xl font-bold tracking-tight text-brand-primary">Loading Contacts...</h3>
                <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the data.</p>
              </div>
            ) : (
              <Table columns={columns} data={filteredOrganizations} />
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* ACTION BUTTON */}
          <div className="flex justify-center pt-2">
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
                  ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:scale-[1.02] hover:shadow-lg shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiSend size={18} />
              <span>Proceed to Email Submission Configuration →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
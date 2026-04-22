"use client";

import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import DynamicSearch from "../components/DynamicSearch";
import OrganizationCard from "../components/OrganizationCard";
import AddOrganizationModal from "../components/AddOrganizationModal";
import EditOrganizationModal from "../components/EditOrganizationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ImportExcelButton from "../components/ImportExcelButton";
import Pagination from "../components/Pagination";

import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  importOrganizations,
} from "../api/organizationApi";

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [phaseFilter, setPhaseFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [laFilter, setLaFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [jobFilter, setJobFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [knownPhases, setKnownPhases] = useState(new Set());
  const [knownTowns, setKnownTowns] = useState(new Set());
  const [knownLas, setKnownLas] = useState(new Set());

  /* ================= FETCH ================= */
  const fetchOrganizations = async (pageNumber = 1) => {
    try {
      let url = `/api/organizations/?page=${pageNumber}&page_size=100`;

      if (debouncedSearch)
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (phaseFilter) url += `&phase=${encodeURIComponent(phaseFilter)}`;
      if (townFilter) url += `&town=${encodeURIComponent(townFilter)}`;
      if (genderFilter) url += `&gender=${encodeURIComponent(genderFilter)}`;
      if (laFilter) url += `&local_authority=${encodeURIComponent(laFilter)}`;

      const data = await getOrganizations(url);

      const results = data?.results || [];
      const pagination = data?.pagination || {};

      setOrganizations(results);
      setPage(pagination?.page || 1);
      setTotalPages(pagination?.total_pages || 1);
      setTotalOrganizations(pagination?.total || 0);

      setKnownPhases((prev) => {
        const next = new Set(prev);
        results.forEach((r) => r.phase && next.add(r.phase));
        return next;
      });
      setKnownTowns((prev) => {
        const next = new Set(prev);
        results.forEach((r) => r.town && next.add(r.town));
        return next;
      });
      setKnownLas((prev) => {
        const next = new Set(prev);
        results.forEach(
          (r) => r.local_authority && next.add(r.local_authority),
        );
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchOrganizations(1);
  }, [
    debouncedSearch,
    phaseFilter,
    townFilter,
    genderFilter,
    laFilter,
    jobFilter,
  ]);

  /* ================= SEARCH ================= */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /* ================= ADD ================= */
  const handleAddOrganization = async (formData) => {
    try {
      await createOrganization(formData);
      toast.success("Organization added successfully!");
      fetchOrganizations(page);
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add organization");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    const org = organizations.find((o) => o.id === id);
    setSelectedOrg(org);
    setOpenEdit(true);
  };

  const handleUpdateOrganization = async (data) => {
    try {
      await updateOrganization(data.id, data);
      toast.success("Organization updated successfully!");
      fetchOrganizations(page);
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update organization",
      );
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await deleteOrganization(deleteId);
      toast.success("Organization deleted successfully!");
      setDeleteId(null);
      fetchOrganizations(page);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to delete organization",
      );
    }
  };

  /* ================= IMPORT ================= */
  const handleImport = async (file) => {
    try {
      await importOrganizations(file);
      toast.success("Import successful");
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    }
  };

  const phaseOptions = useMemo(() => [...knownPhases].sort(), [knownPhases]);
  const townOptions = useMemo(() => [...knownTowns].sort(), [knownTowns]);
  const laOptions = useMemo(() => [...knownLas].sort(), [knownLas]);

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
                Organization Management
              </h1>
              <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
                Maintain and structure all your educational institutions and
                organizations.
              </p>
            </div>
            <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-3 w-fit">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">
                  Total Organizations
                </span>
                <span className="text-2xl font-extrabold leading-none">
                  {totalOrganizations}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end lg:items-center gap-3 w-full lg:w-auto h-fit mt-auto lg:pb-1">
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-gradient-to-r from-[#2D468A] to-[#1a3060] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-medium px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md w-full sm:w-auto whitespace-nowrap"
            >
              <FiPlus size={18} /> Add Organization
            </button>
            <div className="w-full sm:w-auto">
              <ImportExcelButton onFileUpload={handleImport} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        {/* Filters Area */}
        <div className="p-10 border-b border-gray-100 bg-slate-50/50">
          <label className="text-xs font-bold tracking-wider uppercase text-[#2D468A] mb-3 block">
            Search & Filter Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-[14px] text-[#2D468A]/60"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search organizations..."
                className="w-full text-gray-800 pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm"
              />
            </div>

            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
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
              onChange={(e) => setTownFilter(e.target.value)}
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
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full text-gray-800 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D468A]/40 focus:border-[#2D468A] shadow-sm transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Genders</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="mixed">Mixed</option>
            </select>

            <select
              value={laFilter}
              onChange={(e) => setLaFilter(e.target.value)}
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
          {organizations.length > 0 ? (
            <div className="max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    data={org}
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-gray-700">
                No Organizations Found
              </h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                There are no organizations matching the current filter or search
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
              onPageChange={fetchOrganizations}
            />
          </div>
        )}
      </div>

      <AddOrganizationModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddOrganization}
      />

      <EditOrganizationModal
        open={openEdit}
        organization={selectedOrg}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateOrganization}
      />

      <ConfirmDeleteModal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

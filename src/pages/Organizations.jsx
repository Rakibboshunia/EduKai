"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import DynamicSearch from "../components/DynamicSearch";
import OrganizationCard from "../components/OrganizationCard";
import AddOrganizationModal from "../components/AddOrganizationModal";
import EditOrganizationModal from "../components/EditOrganizationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ImportExcelButton from "../components/ImportExcelButton";

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
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ================= */
  const fetchOrganizations = async (pageNumber = 1) => {
    try {
      let url = `/api/organizations/?page=${pageNumber}&page_size=100`;
      
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (phaseFilter) url += `&phase=${encodeURIComponent(phaseFilter)}`;
      if (townFilter) url += `&town=${encodeURIComponent(townFilter)}`;
      if (genderFilter) url += `&gender=${encodeURIComponent(genderFilter)}`;

      const data = await getOrganizations(url);

      const results = data?.results || [];
      const pagination = data?.pagination || {};

      setOrganizations(results);

      setPage(pagination?.page || 1);
      setTotalPages(pagination?.total_pages || 1);
      setTotalOrganizations(pagination?.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrganizations(1);
  }, [searchQuery, phaseFilter, townFilter, genderFilter]);

  /* ================= SEARCH ================= */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /* ================= ADD ================= */
  const handleAddOrganization = async (formData) => {
    await createOrganization(formData);
    fetchOrganizations(page);
    setOpenAdd(false);
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    const org = organizations.find((o) => o.id === id);
    setSelectedOrg(org);
    setOpenEdit(true);
  };

  const handleUpdateOrganization = async (data) => {
    await updateOrganization(data.id, data);
    fetchOrganizations(page);
    setOpenEdit(false);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await deleteOrganization(deleteId);
    setDeleteId(null);
    fetchOrganizations(page);
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

  const phaseOptions = [
    ...new Set(organizations.map((o) => o.phase).filter(Boolean)),
  ];

  const townOptions = [
    ...new Set(organizations.map((o) => o.town).filter(Boolean)),
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D468A]">
            Organization Management
          </h1>
          <p className="text-gray-600 mt-1">
            Total organizations: {totalOrganizations}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add Organization
          </button>

          <ImportExcelButton onFileUpload={handleImport} />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search all organizations..."
            className="w-full text-black pl-10 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
          />
        </div>

        {/* PHASE */}
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="text-black pl-10 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">Phase</option>
          {phaseOptions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        {/* TOWN */}
        <select
          value={townFilter}
          onChange={(e) => setTownFilter(e.target.value)}
          className="text-black pl-10 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">Town</option>
          {townOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* GENDER */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="text-black pl-10 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
        >
          <option value="">Gender</option>
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="max-h-250 overflow-y-auto pr-2">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="mt-8 flex justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => fetchOrganizations(page - 1)}
          className="bg-[#2D468A] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
        >
          Prev
        </button>

        <span className="text-[#2D468A] font-medium flex items-center">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchOrganizations(page + 1)}
          className="bg-[#2D468A] px-4 py-2 rounded-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
        >
          Next
        </button>
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
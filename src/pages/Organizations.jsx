import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
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
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const [industry, setIndustry] = useState("");

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ================= */
  const fetchOrganizations = async (url) => {
    try {
      const data = await getOrganizations(url);
      const results = data?.results || [];

      setOrganizations(results);
      setSearchData(results);
      setFilteredData(results);

      setNext(data?.pagination?.next);
      setPrevious(data?.pagination?.previous);

      setPage(data?.pagination?.page || 1);
      setTotalPages(data?.pagination?.total_pages || 1);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearchFilter = (data) => {
    setSearchData(data);
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let result = [...searchData];

    if (industry) {
      result = result.filter(
        (org) =>
          org.phase?.toLowerCase() === industry.toLowerCase()
      );
    }

    setFilteredData(result);
  }, [searchData, industry]);

  /* ================= ADD ================= */
  const handleAddOrganization = async (formData) => {
    try {
      await createOrganization(formData);
      fetchOrganizations();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    const org = organizations.find((o) => o.id === id);
    setSelectedOrg(org);
    setOpenEdit(true);
  };

  const handleUpdateOrganization = async (updatedOrg) => {
    try {
      await updateOrganization(updatedOrg.id, updatedOrg);
      fetchOrganizations();
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteOrganization(deleteId);
      setDeleteId(null);
      fetchOrganizations();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ================= IMPORT ================= */
  const handleImport = async (file) => {
    try {
      await importOrganizations(file);
      fetchOrganizations();
    } catch (err) {
      console.error("Import error:", err);
    }
  };

  /* ================= PAGINATION ================= */
  const getVisiblePages = () => {
    let start = Math.max(page - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-3 sm:p-5 md:p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D468A]">
            Organization & Client Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage recipient organizations and track relationships.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <FiPlus /> Add Organization
          </button>

          <ImportExcelButton onFileUpload={handleImport} />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white/70 p-4 sm:p-5 rounded-xl border mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <DynamicSearch
          data={organizations}
          searchKeys={["name", "local_authority", "town"]}
          onFilter={handleSearchFilter}
        />

        {/* <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full md:w-60 border rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base"
        >
          <option value="">All Phase</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select> */}
      </div>

      {/* Cards */}
      <div className="
        grid gap-4 sm:gap-5 md:gap-6
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
      ">
        {filteredData.map((org) => (
          <OrganizationCard
            key={org.id}
            data={org}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
        
        <button
          disabled={!previous}
          onClick={() => fetchOrganizations(previous)}
          className="px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base hover:bg-[#2D468A] hover:text-white disabled:opacity-40"
        >
          Prev
        </button>

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() =>
              fetchOrganizations(`/api/organizations/?page=${p}`)
            }
            className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base ${
              page === p
                ? "bg-[#2D468A] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={!next}
          onClick={() => fetchOrganizations(next)}
          className="px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base hover:bg-[#2D468A] hover:text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modals */}
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
        title="Delete Organization"
        description="Are you sure?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
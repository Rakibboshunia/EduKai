import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import DynamicSearch from "../components/DynamicSearch";
import OrganizationCard from "../components/OrganizationCard";
import AddOrganizationModal from "../components/AddOrganizationModal";
import EditOrganizationModal from "../components/EditOrganizationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";
import ImportExcelButton from "../components/ImportExcelButton";

/* ---------------- Dummy Data ---------------- */
const initialOrganizations = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "info@techcorp.com",
    contactPerson: "Anik",
    industry: "Technology",
    phase: "Primary",
    jobTitle: "Teacher",
    location: "Dhaka",
    radius: "5 KM",
    totalSubmissions: 23,
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: 2,
    name: "Innova Labs",
    email: "contact@innovalabs.com",
    contactPerson: "Rahim",
    industry: "Software",
    phase: "Secondary",
    jobTitle: "Software Engineer",
    location: "Chittagong",
    radius: "10 KM",
    totalSubmissions: 15,
    skills: ["Python", "Django", "PostgreSQL"],
  },
];

export default function Contact() {

  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [filteredData, setFilteredData] = useState(initialOrganizations);

  const [industry, setIndustry] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 6;

  /* ---------------- Reset Page On Filter ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  /* ---------------- Search ---------------- */
  const handleSearchFilter = (data) => {
    setFilteredData(data);
  };

  /* ---------------- Industry Filter ---------------- */
  const handleIndustryFilter = (value) => {

    setIndustry(value);

    if (!value) {
      setFilteredData(organizations);
      return;
    }

    const filtered = organizations.filter(
      (org) => org.industry === value
    );

    setFilteredData(filtered);

  };

  /* ---------------- Add Organization ---------------- */
  const handleAddOrganization = (data) => {

    const newOrg = {
      id: Date.now(),
      ...data,
      totalSubmissions: 0,
    };

    const updated = [newOrg, ...organizations];

    setOrganizations(updated);
    setFilteredData(updated);

  };

  /* ---------------- Open Edit Modal ---------------- */
  const handleEdit = (id) => {

    const org = organizations.find((o) => o.id === id);

    setSelectedOrg(org);
    setOpenEdit(true);

  };

  /* ---------------- Update Organization ---------------- */
  const handleUpdateOrganization = (updatedOrg) => {

    const updated = organizations.map((org) =>
      org.id === updatedOrg.id ? updatedOrg : org
    );

    setOrganizations(updated);
    setFilteredData(updated);

  };

  /* ---------------- Delete Organization ---------------- */
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {

    const updated = organizations.filter(
      (org) => org.id !== deleteId
    );

    setOrganizations(updated);
    setFilteredData(updated);
    setDeleteId(null);

  };

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);

  const paginatedData = useMemo(() => {

    const start = (currentPage - 1) * PER_PAGE;

    return filteredData.slice(start, start + PER_PAGE);

  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {

    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

  };

  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-10">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D468A]">
            Contacts Management
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Manage recipient contacts and track relationships.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#354e92] cursor-pointer transition-all w-full sm:w-auto justify-center"
          >
            <FiPlus />
            Add Contact
          </button>

          <ImportExcelButton
            onFileUpload={(file) => {
              console.log("Uploaded Excel:", file);
            }}
          />

        </div>

      </div>

      <div className="bg-white/70 backdrop-blur p-5 rounded-xl shadow-sm border mb-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <div className="w-full md:w-1/2">

          <DynamicSearch
            data={organizations}
            searchKeys={["name", "email", "industry", "location"]}
            onFilter={handleSearchFilter}
          />

        </div>

        <div className="w-full md:w-60">

          <select
            value={industry}
            onChange={(e) => handleIndustryFilter(e.target.value)}
            className="w-full text-black bg-white border border-gray-300 rounded-lg px-4 py-3"
          >

            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Software">Software</option>
            <option value="AI">AI</option>

          </select>

        </div>

      </div>

      {/* Organization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {paginatedData.length > 0 ? (

          paginatedData.map((org) => (

            <OrganizationCard
              key={org.id}
              {...org}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          ))

        ) : (

          <div className="col-span-full text-center py-20 text-gray-500">
            No organizations found.
          </div>

        )}

      </div>

      {/* Pagination */}
      {totalPages > 1 && (

        <div className="mt-10 flex justify-center">

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>

      )}

      {/* Edit Modal */}
      <EditOrganizationModal
        open={openEdit}
        organization={selectedOrg}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateOrganization}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={deleteId !== null}
        title="Delete Organization"
        description="Are you sure you want to delete this organization? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Add Modal */}
      <AddOrganizationModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddOrganization}
      />

    </div>
  );
}
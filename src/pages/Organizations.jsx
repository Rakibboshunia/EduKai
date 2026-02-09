import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import DynamicSearch from "../components/DynamicSearch";
import OrganizationCard from "../components/OrganizationCard";
import AddOrganizationModal from "../components/AddOrganizationModal"; // ✅ ADD

/* ---------------- Dummy Data ---------------- */
const initialOrganizations = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "info@techcorp.com",
    industry: "Technology",
    totalSubmissions: 23,
    location: "Dhaka",
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: 2,
    name: "Innova Labs",
    email: "contact@innovalabs.com",
    industry: "Software",
    totalSubmissions: 15,
    location: "Chittagong",
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 3,
    name: "BlueWave Tech",
    email: "hr@bluewave.com",
    industry: "Technology",
    totalSubmissions: 30,
    location: "Dhaka",
    skills: ["Vue", "Laravel", "MySQL"],
  },
  {
    id: 4,
    name: "StartupX",
    email: "careers@startupx.ai",
    industry: "AI",
    totalSubmissions: 12,
    location: "Sylhet",
    skills: ["AI", "ML", "Python"],
  },
];

export default function Organizations() {
  /* ---------------- State ---------------- */
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [filteredData, setFilteredData] = useState(initialOrganizations);
  const [industry, setIndustry] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  /* ---------------- Search Sync ---------------- */
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

  /* ---------------- Edit (Update) ---------------- */
  const handleUpdate = (updatedOrg) => {
    const updatedList = organizations.map((org) =>
      org.id === updatedOrg.id ? updatedOrg : org
    );

    setOrganizations(updatedList);
    setFilteredData(updatedList);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = (id) => {
    const updatedList = organizations.filter(
      (org) => org.id !== id
    );

    setOrganizations(updatedList);
    setFilteredData(updatedList);
  };

  /* ---------------- Add Organization ---------------- */
  const handleAddOrganization = (data) => {
    const newOrg = {
      id: Date.now(),
      ...data,
      totalSubmissions: 0,
    };

    setOrganizations((prev) => [newOrg, ...prev]);
    setFilteredData((prev) => [newOrg, ...prev]);
  };

  return (
    <div className="p-4">
      {/* 🔹 Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D468A]">
            Organization & Client Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage recipient organizations and track relationships.
          </p>
        </div>

        {/* ✅ CHANGE: Link → Button (popup open) */}
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#2D468B] text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-[#354e92] cursor-pointer transition hover:shadow-md"
        >
          <FiPlus />
          Add Organization
        </button>
      </div>

      {/* 🔹 Search & Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-10 flex-col md:flex-row gap-4 flex justify-between items-center">
        <DynamicSearch
          data={organizations}
          searchKeys={["name", "email", "industry", "location"]}
          onFilter={handleSearchFilter}
        />

        <div className="relative w-full md:w-60">
          <select
            value={industry}
            onChange={(e) => handleIndustryFilter(e.target.value)}
            className="
              w-full appearance-none
              bg-white
              border border-gray-300
              rounded-lg
              px-4 py-3
              text-md text-gray-800
              shadow-sm
              cursor-pointer
              focus:outline-none
              focus:ring-2 focus:ring-[#2D468B]
              focus:border-[#2D468B]
              hover:border-gray-400"
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Software">Software</option>
            <option value="AI">AI</option>
          </select>

          {/* Dropdown Arrow */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
          </span>
        </div>
      </div>

      {/* 🔹 Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((org) => (
            <OrganizationCard
              key={org.id}
              {...org}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No organizations found.</p>
        )}
      </div>

      {/* ✅ ADD ORGANIZATION POPUP */}
      <AddOrganizationModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddOrganization}
      />
    </div>
  );
}

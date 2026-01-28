import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa6";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";

const SopManagement = () => {
  // ===== STATE =====
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ===== SOP DATA =====
const [sopData, setSopData] = useState([
    {
      id: 1,
      title: "Safety Protocols",
      category: "Milking",
      uploadDate: "2026-01-05",
      details: "doc 01",
      fileUrl: "/docs/safety-protocols.pdf",
    },
    {
      id: 2,
      title: "Equipment Maintenance",
      category: "Health",
      uploadDate: "2026-01-03",
      details: "doc 02",
      fileUrl: "/docs/equipment-maintenance.pdf",
    },
    {
      id: 3,
      title: "Compliance Checklist",
      category: "Calves",
      uploadDate: "2026-01-04",
      details: "doc 03",
      fileUrl: "/docs/compliance-checklist.pdf",
    },
    {
      id: 4,
      title: "Worker Training Guide",
      category: "Feeding",
      uploadDate: "2026-01-06",
      details: "doc 04",
      fileUrl: "/docs/training-guide.pdf",
    },
    {
      id: 5,
      title: "Safety Protocols",
      category: "Health",
      uploadDate: "2026-01-05",
      details: "doc 01",
      fileUrl: "/docs/safety-protocols.pdf",
    },
    {
      id: 6,
      title: "Equipment Maintenance",
      category: "Calves",
      uploadDate: "2026-01-03",
      details: "doc 02",
      fileUrl: "/docs/equipment-maintenance.pdf",
    },
    {
      id: 7,
      title: "Compliance Checklist",
      category: "Maintenance",
      uploadDate: "2026-01-04",
      details: "doc 03",
      fileUrl: "/docs/compliance-checklist.pdf",
    },
    {
      id: 8,
      title: "Worker Training Guide",
      category: "Emergencies",
      uploadDate: "2026-01-06",
      details: "doc 04",
      fileUrl: "/docs/training-guide.pdf",
    },
  ]);

  // ===== DOWNLOAD HANDLER =====
  const handleDownload = (fileUrl, title) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = title.replaceAll(" ", "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

   const deleteSOP = (id) => {
    setSopData((prev) => prev.filter((u) => u.id !== id));
  };

  // ===== FILTER LOGIC (SEARCH + CATEGORY) =====
  const filteredData = sopData.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ===== TABLE HEADS =====
  const TableHeads = [
    {
      Title: "SOP Title",
      key: "title",
      width: "25%",
    },
    {
      Title: "Category",
      key: "category",
      width: "15%",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            row.category === "Milking"
              ? "bg-[#E6F4EA] text-[#137333]"
              : row.category === "Feeding"
                ? "bg-[#E6F4EA] text-[#137333]"
                : row.category === "Calves"
                ? "bg-[#F3E8FF] text-[#8200DB]"
                : row.category === "Health"
                ? "bg-[#F3E8FF] text-[#8200DB]"
                : "bg-[#FFF4E5] text-[#B54708]"
          }`}
        >
          {row.category}
        </span>
      ),
    },
    {
      Title: "Document",
      key: "document",
      width: "20%",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <FaFilePdf className="text-red-500" />
          <span className="text-sm">Item doc</span>
          <HiOutlineDocumentDownload
            className="cursor-pointer"
            title="Download document"
            onClick={() => handleDownload(row.fileUrl, row.title)}
          />
        </div>
      ),
    },
    {
      Title: "Upload Date",
      key: "uploadDate",
      width: "15%",
    },
    {
      Title: "Details",
      key: "details",
      width: "15%",
      
    },
    {
      Title: "Actions",
      key: "actions",
      width: "10%",
      render: (row) => (
        <div className="flex items-center justify-center gap-4">
          <Link to={`/admin/sop/management/edit/sop/${row.id}`}>
            <button
              title="Edit"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => console.log("Edit SOP", row.id)}
            >
              <FiEdit />
            </button>
          </Link>
          <button
            title="Delete"
            className="text-red-600 hover:text-red-800"
            // onClick={() => console.log("Delete", row.id)}
            onClick={() => deleteSOP(row.id)}
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
         <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage all SOP documents in one place
          </p>
        </div>

        <Link to="/admin/sop/management/upload/sop">
          <button className="bg-[#F6A62D] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer">
            <FaPlus />
            Upload New SOP
          </button>
        </Link>
      </div>

      {/* ===== CATEGORY FILTER ===== */}
      <div className="flex my-6 gap-4 overflow-x-auto">
        {[
          { label: "All Categories", value: "all" },
          { label: "Milking", value: "milking" },
          { label: "Feeding", value: "feeding" },
          { label: "Health", value: "health" },
          { label: "Calves", value: "calves" },
          { label: "Maintenance", value: "maintenance" },
          { label: "Emergencies", value: "emergencies" },
        ].map((cat) => (
          <button
            key={cat.value}
            onClick={() =>
              setCategoryFilter(
                categoryFilter === cat.value ? "all" : cat.value,
              )
            }
            className={`border px-4 py-2 rounded-lg text-sm cursor-pointer
              ${
                categoryFilter === cat.value
                  ? "bg-[#F6A62D] text-white"
                  : "border-black/10 text-[#0A0A0A]"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ===== SEARCH ===== */}
      <div className="relative">
        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#99A1AF]" />
        <input
          type="text"
          placeholder="Search SOP..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-[100%] md:w-[40%] pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
        />
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] mt-6 overflow-x-scroll md:overflow-hidden">
        <Table TableHeads={TableHeads} TableRows={paginatedData} />
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-center mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SopManagement;

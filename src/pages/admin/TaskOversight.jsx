import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import Table from "../../components/Table";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import Pagination from "../../components/Pagination";

const TaskOversight = () => {
  
  const tasks = [
    {
      id: 1,
      name: "Feed Management Review",
      assignedTo: "Jan de Vries",
      assignedBy: "Tom Wilson (Manager)",
      status: "Completed",
      dueTime: "10:00 AM",
      created: "2024-01-10",
    },
    {
      id: 2,
      name: "Health Check Audit",
      assignedTo: "Sarah Johnson",
      assignedBy: "Tom Wilson (Manager)",
      status: "Pending",
      dueTime: "10:00 AM",
      created: "2024-01-12",
    },
    {
      id: 3,
      name: "Vaccination Schedule",
      assignedTo: "Mike Brown",
      assignedBy: "Tom Wilson (Manager)",
      status: "Progress",
      dueTime: "10:00 AM",
      created: "2024-01-15",
    },
     {
      id: 1,
      name: "Feed Management Review",
      assignedTo: "Jan de Vries",
      assignedBy: "Tom Wilson (Manager)",
      status: "Completed",
      dueTime: "10:00 AM",
      created: "2024-01-10",
    },
    {
      id: 2,
      name: "Health Check Audit",
      assignedTo: "Sarah Johnson",
      assignedBy: "Tom Wilson (Manager)",
      status: "Pending",
      dueTime: "10:00 AM",
      created: "2024-01-12",
    },
    {
      id: 3,
      name: "Vaccination Schedule",
      assignedTo: "Mike Brown",
      assignedBy: "Tom Wilson (Manager)",
      status: "Progress",
      dueTime: "10:00 AM",
      created: "2024-01-15",
    },
     
  ];

  // 🔍 Search state
  const [search, setSearch] = useState("");

  // 🔹 Filtered rows (TableRows)
  const filteredData = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Status style helper
  const statusStyle = {
    completed: "bg-[#DCFCE7] text-[#008236]",
    pending: "bg-[#FFEDD4] text-[#CA3500]",
    progress: "bg-blue-100 text-blue-600",
  };

  // 🔹 TableHeads (EXACT Table contract)
  const TableHeads = [
    {
      Title: "Task",
      key: "name",
      width: "20%",
    },
    {
      Title: "Assigned To",
      key: "assignedTo",
      width: "20%",
    },
    {
      Title: "Assigned By",
      key: "assignedBy",
      width: "15%",
    },
    {
      Title: "Status",
      key: "status",
      width: "15%",
      render: (row) => {
        const key = row.status.toLowerCase();
        return (
          <span
            className={`px-2 py-1 rounded text-sm ${
              statusStyle[key] || "bg-gray-100 text-gray-600"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      Title: "Due Time",
      key: "dueTime",
      width: "15%",
    },
    {
      Title: "Created",
      key: "created",
      width: "15%",
    },
    
  ];

   
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  return (
    <div>
      {/* ===== Header ===== */}
      <div>
        <Breadcrumb />
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Monitor all tasks across your farm operations
        </p>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Total Tasks</p>
          <p className="text-xl font-semibold text-[#0A0A0A] my-1">
            {tasks.length}
          </p>
        </div>

        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Completed</p>
          <p className="text-xl font-semibold text-[#00A63E] my-1">
            {tasks.filter((t) => t.status === "Completed").length}
          </p>
        </div>

        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Pending</p>
          <p className="text-xl font-semibold text-[#F59E0B] my-1">
            {tasks.filter((t) => t.status === "Pending").length}
          </p>
        </div>

        <div className="col-span-6 md:col-span-3 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">In Progress</p>
          <p className="text-xl font-semibold text-[#3B82F6] my-1">
            {tasks.filter((t) => t.status === "Progress").length}
          </p>
        </div>

        {/* ===== Search ===== */}
        <div className="relative col-span-12">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#99A1AF]" />
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
          />
        </div>

        {/* ===== Table ===== */}
        <div className="col-span-12 bg-white rounded-lg border-2 border-[#E5E7EB] text-black overflow-x-scroll md:overflow-hidden">
          <Table TableHeads={TableHeads} TableRows={paginatedData} />
        </div>
      </div>
      {/* ===== Pagination ===== */}
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

export default TaskOversight;
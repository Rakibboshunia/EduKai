import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Table from "../../components/Table";
import { Link } from "react-router-dom";

// Action icons
import { FiEdit, FiUserCheck, FiUserX } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import Pagination from "../../components/Pagination";

const UserManagement = ({ user, setUser }) => {
  // 🔹 Raw users data (API later)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 4,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 5,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 6,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 7,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 8,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 9,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 10,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 11,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 12,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
    {
      id: 13,
      name: "John Doe",
      email: "john@gmail.com",
      role: "Manager",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 14,
      name: "Jane Smith",
      email: "jane@gmail.com",
      role: "Employee",
      status: "Inactive",
      joinDate: "2022-11-22",
    },
  ]);

  // 🔍 Search & pagination state
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // 🔹 Filtered data (single source of truth)
  const filteredData = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Inactive" : "Active",
            }
          : u,
      ),
    );
  };

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 🔹 TableHeads (Table contract respected)
  const TableHeads = [
    {
      Title: "Name",
      key: "name",
      width: "15%",
    },
    {
      Title: "Email",
      key: "email",
      width: "15%",
    },
    {
      Title: "Role",
      key: "role",
      width: "15%",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            row.status === "Active"
              ? "bg-[#F3E8FF] text-[#8200DB]"
              : "bg-[#DBEAFE] text-[#1447E6]"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      Title: "Status",
      key: "status",
      width: "15%",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            row.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      Title: "Join Date",
      key: "joinDate",
      width: "15%",
    },
    {
      Title: "Actions",
      key: "actions",
      width: "15%",
      render: (row) => (
        <div className="flex items-center justify-center gap-4">
          {/* Edit */}
          <Link to={`/admin/user/management/edit/user/${row.id}`}>
            <button
              title="Edit"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => console.log("Edit SOP", row.id)}
            >
              <FiEdit />
            </button>
          </Link>

          <button
            title={row.status === "Active" ? "Deactivate" : "Activate"}
            className={`cursor-pointer ${
              row.status === "Active" ? "text-[#F54900]" : "text-[#00A63E]"
            }`}
            onClick={() => toggleUserStatus(row.id)}
          >
            {row.status === "Active" ? <FiUserX /> : <FiUserCheck />}
          </button>

          {/* Delete */}
          <button
            title="Delete"
            className="text-[#E7000B] cursor-pointer"
            // onClick={() => console.log("Delete", row.id)}
            onClick={() => deleteUser(row.id)}
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage employees and managers for Farm check
          </p>
        </div>

        <Link to="/admin/user/management/add/user">
          <button className="bg-[#F6A62D] text-white px-1 md:px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer">
            <FaPlus />
            Add User
          </button>
        </Link>
      </div>

      {/* ===== Search ===== */}
      <div className="relative mt-6">
        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#99A1AF]" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="md:w-[40%] w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
        />
      </div>

      {/* ===== Stats + Table ===== */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Total Users</p>
          <p className="text-xl font-semibold text-[#0A0A0A] my-1">
            {users.length}
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Active Users</p>
          <p className="text-xl font-semibold text-[#00A63E] my-1">
            {users.filter((u) => u.status === "Active").length}
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <p className="text-[#4A5565]">Managers</p>
          <p className="text-xl font-semibold text-[#155DFC] my-1">
            {users.filter((u) => u.role === "Manager").length}
          </p>
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

export default UserManagement;

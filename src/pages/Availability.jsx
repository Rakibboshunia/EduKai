"use client";

import { useEffect, useState } from "react";
import { MailCheck, XCircle } from "lucide-react";

import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import DynamicSearch from "../components/DynamicSearch";
import Pagination from "../components/Pagination"; // 🔥 add

import { getCandidates, updateCandidateStatus } from "../api/candidateApi";

export default function Availability() {
  const availabilityOptions = {
    available: {
      label: "available",
      icon: MailCheck,
      className: "bg-green-100 text-green-700",
    },
    not_available: {
      label: "not_available",
      icon: XCircle,
      className: "bg-red-100 text-red-600",
    },
  };

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // 🔥 pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const fetchCandidates = async (pageNumber = 1) => {
    try {
      const res = await getCandidates({
        page: pageNumber,
        page_size: 100,
      });

      const list = Array.isArray(res?.results) ? res.results : [];

      const formattedData = list.map((item) => ({
        id: item.id,
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "N/A",
        name: item.name || "N/A",
        email: item.email || "N/A",
        jobTitle: Array.isArray(item.job_titles)
          ? item.job_titles.join(", ")
          : item.job_titles || "N/A",
        whatsapp: item.whatsapp_number || "N/A",
        status: item.availability_status || "not_available",
      }));

      setData(formattedData);
      setFilteredData(formattedData);

      // 🔥 backend pagination
      setTotalPages(res?.pagination?.total_pages || 1);
      setTotalCandidates(res?.pagination?.total || 0);

    } catch (error) {
      console.error("Candidate fetch error:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCandidateStatus(id, {
        availability_status: newStatus,
      });

      const updated = data.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );

      setData(updated);
      setFilteredData(updated);

    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const columns = [
    { header: "Date & Time", accessor: "date" },
    { header: "Candidate Name", accessor: "name" },
    { header: "Email Address", accessor: "email" },
    { header: "Job Title", accessor: "jobTitle" },
    { header: "WhatsApp", accessor: "whatsapp" },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (value, row) => (
        <StatusBadge
          value={value}
          options={availabilityOptions}
          onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2D468A]">
          Availability Check
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-5">
          Track candidate availability via Email and WhatsApp.
        </p>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Total records in database: {totalCandidates}
        </p>
      </div>

      <div className="mb-5">
        <DynamicSearch
          data={data}
          searchKeys={["name", "email", "whatsapp", "jobTitle"]}
          onFilter={setFilteredData}
        />
      </div>

      <div className="w-full rounded-xl">
          <div className="max-h-[90vh] overflow-y-auto overflow-x-auto">
            <Table columns={columns} data={filteredData} />
          </div>
      </div>

      {/* 🔥 PAGINATION HERE */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

    </div>
  );
}
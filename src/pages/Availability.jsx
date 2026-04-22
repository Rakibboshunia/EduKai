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
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-50 pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
            Availability Check
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
            Track and update candidate availability status in real-time.
          </p>
        </div>

        <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-6 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 w-fit">
          <div className="bg-[#2D468A] text-white p-2 rounded-lg shadow-sm">
            <MailCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">Total Candidates</span>
            <span className="text-2xl font-extrabold leading-none">{totalCandidates}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        
        {/* Search Bar Area */}
        <div className="p-6 border-b border-gray-100 bg-slate-50/50">
          <div className="w-full sm:max-w-md">
            <DynamicSearch
              data={data}
              searchKeys={["name", "email", "whatsapp", "jobTitle"]}
              onFilter={setFilteredData}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full">
          <div className="max-h-[90vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filteredData.length > 0 ? (
              <Table columns={columns} data={filteredData} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <XCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-700">No Candidates Found</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm">
                  We couldn't find any candidates matching your criteria. Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Section */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import DynamicSearch from "../components/DynamicSearch";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

import { getCandidates, updateCandidateStatus } from "../api/candidateApi";

export default function CVQueuePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cvs, setCVs] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCvs, setTotalCvs] = useState(0);

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const fetchCandidates = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getCandidates({
        page: pageNumber,
        page_size: 100,
      });

      const list = Array.isArray(res?.results) ? res.results : [];

      const formatted = list.map((item) => {
        const fullName = item.name || "Unknown";
        let rawSurname = item.name_without_surname || "";
        let finalSurname = "";
        
        if (rawSurname) {
          finalSurname = rawSurname.trim().split(" ").pop() || "";
        } else {
          const parts = fullName.trim().split(" ");
          finalSurname = parts.length > 1 ? parts.pop() : "";
        }

        return {
          id: item.id,
          name: fullName,
          email: item.email || "No email",
          phone: item.whatsapp_number || "No phone",
          experience: Number(item.years_of_experience) || 0,
          skills: Array.isArray(item.skills)
            ? item.skills
            : item.skills?.split(",") || [],
          status: item.quality_status || "failed",
          availability: item.availability_status || "not_available",
          createdAt: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : "N/A",
          photo: item.profile_photo_url || null,
          name_without_surname: finalSurname,
          location: item.location || "",
          job_titles: item.job_titles || [],
        };
      });

      setCVs(formatted);
      setSearchData(formatted);

      setTotalPages(res?.pagination?.total_pages || 1);
      setTotalCvs(res?.pagination?.total || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateDelete = (id) => {
    setCVs((prev) => prev.filter((cv) => cv.id !== id));
    setSearchData((prev) => prev.filter((cv) => cv.id !== id));
    setTotalCvs((prev) => Math.max(0, prev - 1));
  };

  const tabs = useMemo(
    () => [
      { key: "all", label: "All CVs", count: searchData.length },
      {
        key: "pending",
        label: "Pending",
        count: searchData.filter((c) => c.status === "pending").length,
      },
      {
        key: "passed",
        label: "Quality Passed",
        count: searchData.filter((c) => c.status === "passed").length,
      },
      {
        key: "failed",
        label: "Quality Failed",
        count: searchData.filter((c) => c.status === "failed").length,
      },
      {
        key: "manual",
        label: "Manual Review",
        count: searchData.filter((c) => c.status === "manual").length,
      },
    ],
    [searchData],
  );

  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return searchData;
    return searchData.filter((c) => c.status === activeTab);
  }, [activeTab, searchData]);

  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
            CV Processing Queue
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
            Manage, review, and organize incoming candidate resumes effortlessly.
          </p>
        </div>

        <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-6 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 w-fit">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">Total CVs Loaded</span>
            <span className="text-2xl font-extrabold leading-none">{totalCvs}</span>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        
        {/* Search & Tabs Area */}
        <div className="p-6 border-b border-gray-100 bg-slate-50/50 space-y-5">
          <div className="w-full sm:max-w-md">
            <DynamicSearch
              data={cvs}
              searchKeys={["name", "email", "phone"]}
              onFilter={setSearchData}
            />
          </div>
          <div>
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D468A]"></div>
              <p className="text-gray-500 font-medium mt-4">Loading candidate CVs...</p>
            </div>
          ) : tabFiltered.length > 0 ? (
            <div className="max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {tabFiltered.map((cv) => (
                  <CVCard key={cv.id} data={cv} onDelete={handleCandidateDelete} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-gray-700">No CVs Found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                There are no candidates matching the current filter or search criteria.
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
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );

}

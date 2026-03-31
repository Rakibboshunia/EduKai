"use client";

import { useEffect, useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import DynamicSearch from "../components/DynamicSearch";
import Pagination from "../components/Pagination"; // 🔥 add
import toast from "react-hot-toast";

import {
  getCandidates,
  updateCandidateStatus,
} from "../api/candidateApi";

export default function CVQueuePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cvs, setCVs] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

      const formatted = list.map((item) => ({
        id: item.id,
        name: item.name || "Unknown",
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
      }));

      setCVs(formatted);
      setSearchData(formatted);

      // 🔥 backend pagination
      setTotalPages(res?.pagination?.total_pages || 1);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  const tabs = useMemo(
    () => [
      { key: "all", label: "All CVs", count: searchData.length },
      {
        key: "passed",
        label: "Quality Passed",
        count: searchData.filter(
          (c) => c.status === "passed"
        ).length,
      },
      {
        key: "failed",
        label: "Quality Failed",
        count: searchData.filter(
          (c) => c.status === "failed"
        ).length,
      },
    ],
    [searchData]
  );

  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return searchData;
    return searchData.filter((c) => c.status === activeTab);
  }, [activeTab, searchData]);

  return (
    <div className="p-4 space-y-6">

      <h1 className="text-2xl font-semibold">
        CV Processing Queue
      </h1>

      <DynamicSearch
        data={cvs}
        searchKeys={["name", "email", "phone"]}
        onFilter={setSearchData}
      />

      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
  <div className="text-center py-10">Loading...</div>
) : (
  <div className="max-h-[90vh] overflow-y-auto pr-2">
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tabFiltered.map((cv) => (
        <CVCard key={cv.id} data={cv} />
      ))}
    </div>

  </div>
)}

      {/* 🔥 PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

    </div>
  );
}
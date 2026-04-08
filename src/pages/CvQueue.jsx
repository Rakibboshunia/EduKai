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
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D468A]">
          CV Processing Queue
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Total records in database: {totalCvs}
        </p>
      </div>

      <DynamicSearch
        data={cvs}
        searchKeys={["name", "email", "phone"]}
        onFilter={setSearchData}
      />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="max-h-[90vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tabFiltered.map((cv) => (
              <CVCard key={cv.id} data={cv} onDelete={handleCandidateDelete} />
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

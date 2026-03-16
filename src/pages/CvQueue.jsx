import { useEffect, useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import Pagination from "../components/Pagination";

import {
  getCandidates,
  updateCandidateStatus,
} from "../api/candidateApi";

export default function CVQueuePage() {

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [cvs, setCVs] = useState([]);

  const PER_PAGE = 12;

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {

      const res = await getCandidates();

      const formatted = res.map((item) => ({
        id: item.id,
        name: item.name || "Unknown",
        email: item.email || "No email",
        phone: item.whatsapp_number || "No phone",
        experience: item.years_of_experience || 0,
        skills: item.skills || [],
        status: item.quality_status,
        availability: item.availability_status,
        createdAt: new Date(item.created_at).toLocaleString(),
        originalCV: item.original_cv_url,
        enhancedCV: item.enhanced_cv_url,
      }));

      setCVs(formatted);

    } catch (error) {
      console.error("CV fetch error:", error);
    }
  };

  /* UPDATE QUALITY STATUS */

  const updateStatus = async (id, newStatus) => {

    try {

      await updateCandidateStatus(id, {
        quality_status: newStatus,
      });

      const updated = cvs.map((cv) =>
        cv.id === id ? { ...cv, status: newStatus } : cv
      );

      setCVs(updated);

    } catch (error) {
      console.error("Status update error:", error);
    }

  };

  /* UPDATE AVAILABILITY */

  const updateAvailability = async (id, newAvailability) => {

    try {

      await updateCandidateStatus(id, {
        availability_status: newAvailability,
      });

      const updated = cvs.map((cv) =>
        cv.id === id
          ? { ...cv, availability: newAvailability }
          : cv
      );

      setCVs(updated);

    } catch (error) {
      console.error("Availability update error:", error);
    }

  };

  const tabs = useMemo(
    () => [
      { key: "all", label: "All CVs", count: cvs.length },
      {
        key: "passed",
        label: "Quality Passed",
        count: cvs.filter((c) => c.status === "passed").length,
      },
      {
        key: "failed",
        label: "Quality Failed",
        count: cvs.filter((c) => c.status === "failed").length,
      },
    ],
    [cvs]
  );

  const filtered = useMemo(() => {

    if (activeTab === "all") return cvs;

    return cvs.filter((c) => c.status === activeTab);

  }, [activeTab, cvs]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginatedData = useMemo(() => {

    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);

  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 min-h-screen">

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D468A]">
          CV Processing Queue
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          Monitor automated quality checks and availability confirmations
        </p>
      </div>

      <div className="overflow-x-auto">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {paginatedData.length > 0 ? (

          paginatedData.map((cv) => (
            <CVCard
              key={cv.id}
              data={cv}
              onStatusChange={(newStatus) =>
                updateStatus(cv.id, newStatus)
              }
              onAvailabilityChange={(newAvailability) =>
                updateAvailability(cv.id, newAvailability)
              }
            />
          ))

        ) : (

          <div className="text-center py-12 text-gray-500">
            No CVs found
          </div>

        )}

      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import Pagination from "../components/Pagination";
import { getCandidates } from "../api/candidateApi";

export default function CVQueuePage() {

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [cvs, setCVs] = useState([]);

  const PER_PAGE = 12;

  /* ================= FETCH API ================= */

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {

      const res = await getCandidates();

      const formatted = res.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.whatsapp_number,
        experience: item.years_of_experience,
        skills: item.skills || [],
        status: item.quality_status,
        availability: item.availability_status,
        createdAt: new Date(item.created_at).toLocaleString(),
      }));

      setCVs(formatted);

    } catch (error) {
      console.error("CV fetch error:", error);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = (id, newStatus) => {

    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, status: newStatus } : cv
    );

    setCVs(updated);
  };

  const updateAvailability = (id, newAvailability) => {

    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, availability: newAvailability } : cv
    );

    setCVs(updated);
  };

  /* ================= TABS ================= */

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
      {
        key: "manual_review",
        label: "Manual Review",
        count: cvs.filter((c) => c.status === "manual_review").length,
      },
    ],
    [cvs]
  );

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    if (activeTab === "all") return cvs;

    return cvs.filter((c) => c.status === activeTab);

  }, [activeTab, cvs]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginatedData = useMemo(() => {

    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);

  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* ================= RENDER ================= */

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

      {/* Tabs */}
      <div className="overflow-x-auto">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Cards */}
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

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

    </div>
  );
}
import { useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import Pagination from "../components/Pagination";

export default function CVQueuePage() {

  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const initialCVs = useMemo(
  () => [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+44 7700 900123",
      experience: 5,
      skills: ["JavaScript", "React", "Node.js"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 09:30",
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily.johnson@email.com",
      phone: "+44 7711 223344",
      experience: 1,
      skills: ["JavaScript"],
      status: "failed",
      reviewType: "auto",
      awaitingResponse: true,
      createdAt: "2025-01-23 10:15",
      issues: ["Insufficient experience (<2 years)", "Missing required skills"],
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "+44 7722 334455",
      experience: 3,
      skills: ["React"],
      status: "failed",
      reviewType: "manual",
      awaitingResponse: true,
      createdAt: "2025-01-23 11:00",
      issues: ["Incomplete formatting", "Missing employment dates"],
    },
    {
      id: 4,
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      phone: "+44 7755 667788",
      experience: 6,
      skills: ["JavaScript", "React"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 13:10",
    },
    {
      id: 5,
      name: "Daniel Wilson",
      email: "daniel.wilson@email.com",
      phone: "+44 7733 112233",
      experience: 4,
      skills: ["Node.js", "MongoDB", "Express"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 14:05",
    },
    {
      id: 6,
      name: "Sophia Davis",
      email: "sophia.davis@email.com",
      phone: "+44 7744 556677",
      experience: 2,
      skills: ["HTML", "CSS", "JavaScript"],
      status: "passed",
      availability: "not_available",
      createdAt: "2025-01-23 14:40",
    },
    {
      id: 7,
      name: "James Anderson",
      email: "james.anderson@email.com",
      phone: "+44 7755 112244",
      experience: 7,
      skills: ["React", "TypeScript", "Redux"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 15:20",
    },
    {
      id: 8,
      name: "Isabella Thomas",
      email: "isabella.thomas@email.com",
      phone: "+44 7766 223355",
      experience: 1,
      skills: ["CSS", "Figma"],
      status: "failed",
      reviewType: "auto",
      awaitingResponse: true,
      createdAt: "2025-01-23 16:05",
      issues: ["Missing coding experience", "Portfolio not provided"],
    },
    {
      id: 9,
      name: "William Taylor",
      email: "william.taylor@email.com",
      phone: "+44 7777 334466",
      experience: 3,
      skills: ["Python", "Django"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 16:45",
    },
    {
      id: 10,
      name: "Charlotte Moore",
      email: "charlotte.moore@email.com",
      phone: "+44 7788 445577",
      experience: 2,
      skills: ["React", "Next.js"],
      status: "failed",
      reviewType: "manual",
      awaitingResponse: true,
      createdAt: "2025-01-23 17:10",
      issues: ["Incomplete work history"],
    },
    {
      id: 11,
      name: "Benjamin Harris",
      email: "benjamin.harris@email.com",
      phone: "+44 7799 556688",
      experience: 5,
      skills: ["Java", "Spring Boot"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 17:50",
    },
    {
      id: 12,
      name: "Amelia Clark",
      email: "amelia.clark@email.com",
      phone: "+44 7701 667799",
      experience: 4,
      skills: ["Vue", "JavaScript"],
      status: "passed",
      availability: "not_available",
      createdAt: "2025-01-23 18:20",
    },
    {
      id: 13,
      name: "Henry Lewis",
      email: "henry.lewis@email.com",
      phone: "+44 7702 778800",
      experience: 2,
      skills: ["Angular", "TypeScript"],
      status: "passed",
      availability: "available",
      createdAt: "2025-01-23 19:05",
    },
  ],
  [],
);

  const [cvs, setCVs] = useState(initialCVs);

  const updateStatus = (id, newStatus) => {
    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, status: newStatus } : cv,
    );
    setCVs(updated);
  };

  const updateAvailability = (id, newAvailability) => {
    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, availability: newAvailability } : cv,
    );
    setCVs(updated);
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
      {
        key: "manual",
        label: "Manual Review",
        count: cvs.filter((c) => c.reviewType === "manual").length,
      },
    ],
    [cvs],
  );

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    if (activeTab === "all") return cvs;
    if (activeTab === "manual") {
      return cvs.filter((c) => c.reviewType === "manual");
    }
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

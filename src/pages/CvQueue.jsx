import { useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";

export default function CVQueuePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCV, setSelectedCV] = useState(null);

  /* ================= INITIAL DATA ================= */

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
        issues: [
          "Insufficient experience (<2 years)",
          "Missing required skills",
        ],
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
    ],
    [],
  );

  const [cvs, setCVs] = useState(initialCVs);

  /* ================= HANDLERS ================= */

  const updateStatus = (id, newStatus) => {
    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, status: newStatus } : cv,
    );
    setCVs(updated);

    // 🔥 Future API call
    console.log("Quality status updated:", id, newStatus);
  };

  const updateAvailability = (id, newAvailability) => {
    const updated = cvs.map((cv) =>
      cv.id === id ? { ...cv, availability: newAvailability } : cv,
    );
    setCVs(updated);

    console.log("Availability updated:", id, newAvailability);
  };

  /* ================= TABS (AUTO UPDATE COUNT) ================= */

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

  /* ================= RENDER ================= */

  return (
    <div className="p-4 sm:p-6 space-y-8 min-h-screen">
      {/* Header */}
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

      {/* CV Cards */}
      <div
       className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((cv) => (
            <CVCard
              key={cv.id}
              data={cv}
              onView={() => setSelectedCV(cv)}
              onStatusChange={(newStatus) => updateStatus(cv.id, newStatus)}
              onAvailabilityChange={(newAvailability) =>
                updateAvailability(cv.id, newAvailability)
              }
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No CVs found for this category
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {selectedCV && (
        <PDFCVPreview data={selectedCV} onClose={() => setSelectedCV(null)} />
      )}
    </div>
  );
}

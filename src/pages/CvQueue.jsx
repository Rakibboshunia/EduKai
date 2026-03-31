"use client";

import { useEffect, useMemo, useState } from "react";
import Tabs from "../components/Tabs";
import CVCard from "../components/CVCard";
import DynamicSearch from "../components/DynamicSearch";
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

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const res = await getCandidates(); // backend pagination handled
      console.log("CV Queue:", res);

      const list = Array.isArray(res?.results)
        ? res.results
        : [];

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

    } catch (error) {
      console.error(error);
      toast.error("Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateCandidateStatus(id, {
        quality_status: newStatus,
      });

      const updated = cvs.map((cv) =>
        cv.id === id ? { ...cv, status: newStatus } : cv
      );

      setCVs(updated);
      setSearchData(updated);

    } catch {
      toast.error("Status update failed");
    }
  };

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
      setSearchData(updated);

    } catch {
      toast.error("Availability update failed");
    }
  };

  const tabs = useMemo(
    () => [
      { key: "all", label: "All CVs", count: searchData.length },
      {
        key: "passed",
        label: "Quality Passed",
        count: searchData.filter(
          (c) => c.status?.toLowerCase() === "passed"
        ).length,
      },
      {
        key: "failed",
        label: "Quality Failed",
        count: searchData.filter(
          (c) => c.status?.toLowerCase() === "failed"
        ).length,
      },
    ],
    [searchData]
  );

  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return searchData;

    return searchData.filter(
      (c) => c.status?.toLowerCase() === activeTab
    );
  }, [activeTab, searchData]);

  return (
    <div className="p-4 sm:p-6 space-y-8">

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D468A]">
          CV Processing Queue
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          Monitor automated quality checks and availability confirmations
        </p>
      </div>

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
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabFiltered.length > 0 ? (
            tabFiltered.map((cv) => (
              <CVCard
                key={cv.id}
                data={cv}
                onStatusChange={(s) => updateStatus(cv.id, s)}
                onAvailabilityChange={(a) =>
                  updateAvailability(cv.id, a)
                }
              />
            ))
          ) : (
            <div className="text-center col-span-full">
              No CV found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/Tabs";
import DynamicSearch from "../components/DynamicSearch";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";

import {
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  ArrowRight,
  Users,
} from "lucide-react";

import { getCandidates, updateCandidateStatus } from "../api/candidateApi";
import { useUIState } from "../provider/UIStateProvider";


const qualityOptions = {
  pending: { label: "Pending",        icon: Clock,        className: "bg-gray-100 text-gray-700" },
  passed:  { label: "Quality Passed", icon: CheckCircle,  className: "bg-green-100 text-green-700" },
  failed:  { label: "Quality Failed", icon: XCircle,      className: "bg-red-100 text-red-700" },
  manual:  { label: "Manual Review",  icon: Eye,          className: "bg-yellow-100 text-yellow-700" },
};

const availabilityOptions = {
  available:     { label: "Available",     icon: CheckCircle, className: "bg-green-100 text-green-700" },
  not_available: { label: "Not Available", icon: XCircle,     className: "bg-red-100 text-red-700"   },
};


function CandidateAvatar({ photo, name, size = "w-10 h-10" }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${size} rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white font-bold text-base flex items-center justify-center flex-shrink-0 shadow-sm`}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function CVQueuePage() {
  const navigate = useNavigate();

  const { cvQueue, updateCvQueue } = useUIState();
  const [activeTab, setActiveTab] = useState(cvQueue.activeTab || "all");
  const [cvs, setCVs] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(cvQueue.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCvs, setTotalCvs] = useState(0);

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const fetchCandidates = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getCandidates({ page: pageNumber, page_size: 100 });
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
            : item.skills?.split(",").map((s) => s.trim()).filter(Boolean) || [],
          status: item.quality_status || "failed",
          availability: item.availability_status || "not_available",
          createdAt: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "N/A",
          photo: item.profile_photo_url || null,
          name_without_surname: finalSurname,
          location: item.location || "",
          job_titles: Array.isArray(item.job_titles)
            ? item.job_titles
            : item.job_titles?.split(",").map((s) => s.trim()).filter(Boolean) || [],
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

  /* ─── Inline status changes (list-level) ─── */
  const handleQualityChange = async (id, newVal) => {
    try {
      await updateCandidateStatus(id, { quality_status: newVal });
      const update = (list) =>
        list.map((c) => (c.id === id ? { ...c, status: newVal } : c));
      setCVs(update);
      setSearchData(update);
      toast.success("Quality status updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update");
    }
  };

  const handleAvailabilityChange = async (id, newVal) => {
    try {
      await updateCandidateStatus(id, { availability_status: newVal });
      const update = (list) =>
        list.map((c) => (c.id === id ? { ...c, availability: newVal } : c));
      setCVs(update);
      setSearchData(update);
      toast.success("Availability updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update");
    }
  };

  /* ─── Tabs ─── */
  const tabs = useMemo(
    () => [
      { key: "all",     label: "All CVs",        count: searchData.length },
      { key: "pending", label: "Pending",         count: searchData.filter((c) => c.status === "pending").length },
      { key: "passed",  label: "Quality Passed",  count: searchData.filter((c) => c.status === "passed").length },
      { key: "failed",  label: "Quality Failed",  count: searchData.filter((c) => c.status === "failed").length },
      { key: "manual",  label: "Manual Review",   count: searchData.filter((c) => c.status === "manual").length },
    ],
    [searchData],
  );

  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return searchData;
    return searchData.filter((c) => c.status === activeTab);
  }, [activeTab, searchData]);

  /* ─── Navigate to profile ─── */
  const goToProfile = (id) => navigate(`/cv/queue/${id}`);

  // Update global state whenever tab or page changes
  useEffect(() => {
    updateCvQueue({ activeTab, page });
  }, [activeTab, page, updateCvQueue]);

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none" />

        <div className="space-y-2 z-10">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brand-primary">
            CV Processing Queue
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
            Manage, review, and organize incoming candidate resumes effortlessly.
          </p>
        </div>

        <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-brand-primary px-6 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 w-fit">
          <div className="bg-brand-primary text-white p-2 rounded-lg shadow-sm">
            <Users size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary/70">
              Total Candidates
            </span>
            <span className="text-2xl font-extrabold leading-none">{totalCvs}</span>
          </div>
        </div>
      </div>

      {/* ── Controls + List ── */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col border-t-4 border-t-brand-primary">

        {/* Search & Tabs */}
        <div className="p-6 border-b border-gray-100 bg-slate-50/50 space-y-5">
          <div className="w-full sm:max-w-md">
            <DynamicSearch
              data={cvs}
              searchKeys={["name", "email", "phone"]}
              onFilter={setSearchData}
              initialSearch={cvQueue.searchTerm}
              onSearchChange={(val) => updateCvQueue({ searchTerm: val })}
            />
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
              <p className="text-gray-500 font-medium mt-4">Loading candidates…</p>
            </div>
          ) : tabFiltered.length > 0 ? (

            /* ── Desktop Table ── */
            <>
              <div className="hidden md:block rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider w-[260px]">Candidate Name</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Job Title</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Quality Check</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Availability Check</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tabFiltered.map((cv) => (
                      <tr
                        key={cv.id}
                        className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                        onClick={() => goToProfile(cv.id)}
                      >
                        {/* Candidate */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <CandidateAvatar photo={cv.photo} name={cv.name} />
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 text-[14px] leading-tight truncate">{cv.name}</p>
                              {cv.name_without_surname && (
                                <p className="text-xs text-gray-400 truncate">({cv.name_without_surname})</p>
                              )}
                              <p className="text-[11px] text-gray-400 mt-0.5">{cv.createdAt}</p>
                            </div>
                          </div>
                        </td>

                        {/* Job Title */}
                        <td className="px-4 py-3">
                          {cv.job_titles.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {cv.job_titles.slice(0, 2).map((t) => (
                                <span key={t} className="px-2 py-0.5 bg-blue-50 text-brand-primary text-xs font-semibold rounded-full border border-blue-100">
                                  {t}
                                </span>
                              ))}
                              {cv.job_titles.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                                  +{cv.job_titles.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">—</span>
                          )}
                        </td>

                        {/* Quality Status */}
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <StatusBadge
                            value={cv.status}
                            options={qualityOptions}
                            onChange={(val) => handleQualityChange(cv.id, val)}
                          />
                        </td>

                        {/* Availability */}
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <StatusBadge
                            value={cv.availability}
                            options={availabilityOptions}
                            onChange={(val) => handleAvailabilityChange(cv.id, val)}
                          />
                        </td>

                        {/* View Profile */}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); goToProfile(cv.id); }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold hover:shadow-lg transition-all duration-200 group-hover:shadow-md"
                          >
                            View
                            <ArrowRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden space-y-3">
                {tabFiltered.map((cv) => (
                  <div
                    key={cv.id}
                    onClick={() => goToProfile(cv.id)}
                    className="group bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-3">
                      <CandidateAvatar photo={cv.photo} name={cv.name} size="w-12 h-12" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm leading-tight">{cv.name}</p>
                            {cv.name_without_surname && (
                              <p className="text-xs text-gray-400">({cv.name_without_surname})</p>
                            )}
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-primary transition-colors flex-shrink-0 mt-0.5" />
                        </div>

                        {cv.job_titles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {cv.job_titles.slice(0, 2).map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-blue-50 text-brand-primary text-[11px] font-semibold rounded-full border border-blue-100">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="text-gray-400">{cv.createdAt}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          <StatusBadge value={cv.status} options={qualityOptions} onChange={(val) => handleQualityChange(cv.id, val)} />
                          <StatusBadge value={cv.availability} options={availabilityOptions} onChange={(val) => handleAvailabilityChange(cv.id, val)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>

          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-gray-700">No CVs Found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                No candidates match the current filter or search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
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

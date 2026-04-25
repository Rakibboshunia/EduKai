import { useState, useEffect } from "react";
import { FiSearch, FiSend, FiMail, FiCheckCircle, FiXCircle, FiClock, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";
import { getRecentActivities, getDashboardStats } from "../api/dashboardApi";
import Table from "../components/Table";
import Tabs from "../components/Tabs";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";

export default function Tracking() {
  const [activeTab, setActiveTab] = useState("all");
  const [activities, setActivities] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNumber,
        page_size: 100,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      // Fetch both dashboard stats and recent activities
      const [statsRes, activityRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(params)
      ]);

      setStatsData(statsRes);

      const list = activityRes?.results || [];
      
      const formatted = list.map((item) => ({
        id: item.id,
        title: item.title || item.message || "Activity",
        user: item.user_name || "System",
        time: item.time_ago || new Date(item.created_at).toLocaleString(),
        status: item.severity === "error" ? "failed" : "success",
        type: item.title?.toLowerCase().includes("email") ? "email" : "submission",
        description: item.message || item.description || ""
      }));

      setActivities(formatted);
      setTotalPages(activityRes?.pagination?.total_pages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tracking data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, debouncedSearch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Simulate API update (or call real one if backend supports it)
      // await updateActivityStatus(id, newStatus);
      
      const updated = activities.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );

      setActivities(updated);
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  const tabs = [
    { key: "all", label: "All Activities", count: activities.length },
    { key: "email", label: "Email Logs", count: activities.filter(a => a.type === "email").length },
    { key: "submission", label: "CV Submissions", count: activities.filter(a => a.type === "submission").length },
  ];

  const filteredData = activities.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns = [
    {
      header: "Activity Type",
      accessor: "type",
      render: (val) => (
        <div className="flex items-center gap-2">
          {val === "email" ? (
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <FiMail size={16} />
            </div>
          ) : (
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <FiSend size={16} />
            </div>
          )}
          <span className="capitalize font-semibold">{val}</span>
        </div>
      )
    },
    {
      header: "Title & Description",
      accessor: "title",
      render: (val, row) => (
        <div className="flex flex-col max-w-md">
          <span className="font-bold text-gray-900">{val}</span>
          <span className="text-sm text-gray-500 truncate">{row.description}</span>
        </div>
      )
    },
    {
      header: "Triggered By",
      accessor: "user",
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            {val.charAt(0).toUpperCase()}
          </div>
          <span>{val}</span>
        </div>
      )
    },
    {
      header: "Timestamp",
      accessor: "time",
      render: (val) => (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FiClock size={14} />
          {val}
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val, row) => {
        const options = {
          success: { label: "Completed", icon: FiCheckCircle, className: "bg-green-100 text-green-700" },
          // failed: { label: "Failed", icon: FiXCircle, className: "bg-red-100 text-red-700" },
          // pending: { label: "Pending", icon: FiClock, className: "bg-yellow-100 text-yellow-700" }
        };
        return (
          <StatusBadge 
            value={val} 
            options={options} 
            onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
          />
        );
      }
    }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
            Activity Tracking
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
            Monitor and track email deliveries, CV submissions, and automated system processes in real-time.
          </p>
        </div>

        <div className="z-10 bg-gradient-to-r from-blue-50 to-blue-100/50 text-[#2D468A] px-6 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 w-fit">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/70">Current System Status</span>
            <span className="text-lg font-extrabold text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex flex-col gap-1 border-t-4 border-t-[#2D468A]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total CV Imports</span>
          <span className="text-3xl font-black text-[#2D468A]">{statsData?.summary?.total_candidates || 0}</span>
          <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full w-fit">Database</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex flex-col gap-1 border-t-4 border-t-blue-500">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Sent</span>
          <span className="text-3xl font-black text-blue-600">{statsData?.summary?.total_processed || 0}</span>
          <div className="mt-2 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full w-fit">Success</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex flex-col gap-1 border-t-4 border-t-purple-500">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">CV Submissions</span>
          <span className="text-2xl font-black text-purple-600">{statsData?.summary?.total_processed || 0}</span>
          <div className="mt-2 text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full w-fit">Completed</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex flex-col gap-1 border-t-4 border-t-emerald-500">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quality Rate</span>
          <span className="text-3xl font-black text-emerald-600">
            {statsData?.summary?.success_rate || 0}%
          </span>
          <div className="mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">Optimized</div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
        
        {/* Search & Tabs */}
        <div className="p-6 border-b border-gray-100 bg-slate-50/50 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D468A]/50" />
              <input
                type="text"
                placeholder="Search logs, candidates, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-black bg-white border border-blue-200 rounded-2xl focus:ring-4 focus:ring-[#2D468A]/10 focus:border-[#2D468A] outline-none transition-all text-sm shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <button 
                onClick={fetchData}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-blue-200 rounded-2xl text-sm font-bold text-[#2D468A] hover:bg-blue-50 transition-all shadow-sm"
               >
                 Refresh Logs
               </button>
               
            </div>
          </div>

          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Table Content */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D468A]"></div>
              <p className="text-gray-500 font-medium mt-4">Fetching tracking logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={filteredData} />
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white/70 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

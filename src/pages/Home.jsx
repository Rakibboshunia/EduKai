import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClockRotateLeft,
  FaRegCircleCheck,
} from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { CiImport } from "react-icons/ci";

import StatCard from "../components/StatCard";
import {
  getDashboardStats,
  getRecentActivities,
  markActivitiesAsRead,
} from "../api/dashboardApi";
import toast from "react-hot-toast";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " min ago" : " mins ago");
  
  return "Just now";
};

const ActivitiesCard = ({
  title,
  name,
  time,
  dotColor = "bg-[#00C950]",
  is_read = true,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl transition ${is_read ? "bg-[#f4f7fc]" : "bg-[#E8EDFB] border border-[#d6e0f5]"}`}>
      <div className="flex items-start sm:items-center gap-4">
        <span className={`w-2 h-2 mt-2 sm:mt-0 rounded-full ${dotColor}`} />
        <div>
          <p className="text-[#000000] font-medium text-base sm:text-lg">
            {title}
          </p>
          <p className="text-[#767676] text-sm">{name}</p>
        </div>
      </div>

      <p className="text-[#767676] text-xs sm:text-sm whitespace-nowrap">
        {time}
      </p>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fetchActivities = async () => {
    try {
      const activity = await getRecentActivities();
      const activityList = activity?.results || [];
      setActivities(
        activityList.map((item) => ({
          id: item.id,
          title: item.title || item.message,
          name: item.user_name || "System",
          time: item.time_ago || formatTimeAgo(item.created_at),
          dotColor: item.severity === "error" ? "bg-[#FB2C36]" : "bg-[#00C950]",
          is_read: item.is_read !== false // assumes true if missing
        })),
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboardStats();
        console.log("dashboard:", dashboard);

        const activity = await getRecentActivities();
        console.log("activity:", activity);

        setStats([
          {
            title: "Total CV Import",
            value: dashboard?.summary?.total_candidates || 0,
            icon: IoDocumentTextOutline,
            iconBg: "bg-[#2B7FFF]",
          },
          {
            title: "Quality Passed",
            value: dashboard?.quality?.passed || 0,
            icon: FaRegCircleCheck,
            iconBg: "bg-[#00C950]",
          },
          {
            title: "Quality Failed",
            value: dashboard?.quality?.failed || 0,
            icon: MdOutlineCancel,
            iconBg: "bg-[#FB2C36]",
          },
          {
            title: "Pending Review",
            value: dashboard?.quality?.pending || 0,
            icon: FaClockRotateLeft,
            iconBg: "bg-[#F0B100]",
          },
          {
            title: "CV Submitted",
            value: dashboard?.summary?.total_processed || 0,
            icon: FiSend,
            iconBg: "bg-[#AD46FF]",
          },
          {
            title: "Success Rate",
            value: `${dashboard?.summary?.success_rate || 0}%`,
            icon: GoGraph,
            iconBg: "bg-[#2B7FFF]",
          },
        ]);

        await fetchActivities();
        
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await markActivitiesAsRead();
      toast.success("Activities marked as read");
      await fetchActivities();
    } catch (error) {
      toast.error("Failed to mark activities as read");
      console.error(error);
    }
  };

  const visibleActivities = isExpanded ? activities : activities.slice(0, 5);

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-8 mb-5 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ">
        <div>
          <h3 className="text-[#2D468A] text-2xl sm:text-2xl lg:text-3xl font-semibold">
            Dashboard Overview
          </h3>
          <p className="text-[#4A5565] text-sm sm:text-base mt-1.5 max-w-xl">
            Monitor your CV automation workflow in real-time
          </p>
        </div>

        <Link to="cv/automation/platform">
          <button className="bg-[#2D468B] hover:bg-[#1a3060] text-white px-6 py-3.5 rounded-md flex items-center gap-2 transition shadow-sm">
            <CiImport className="w-6 h-6" />
            Bulk Import
          </button>
        </Link>
      </div>
    </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center mt-8 bg-white/70 p-8 rounded-2xl border border-blue-50 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D468A] mb-4"></div>
          <h3 className="text-xl font-bold tracking-tight text-[#2D468A]">Loading Dashboard...</h3>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest statistics and activities.</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8 mt-8 bg-white/70 p-8 sm:p-8 rounded-2xl border border-blue-50 shadow-sm">
            {stats.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>

          {/* Activities */}
          <div className="mt-8 bg-white/70 p-8 sm:p-8 rounded-xl border border-[#E5E7EB]">
            
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h3 className="text-[#2D468A] text-xl sm:text-2xl font-semibold">
                Recent Automated Activities
              </h3>
              <button 
                onClick={handleMarkAsRead}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 transition shadow-sm cursor-pointer"
              >
                ✓ Mark all as read
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {visibleActivities.map((activity, index) => (
                <ActivitiesCard key={index} {...activity} />
              ))}
              {activities.length === 0 && (
                 <p className="text-gray-500 text-sm italic py-4">No recent activities found.</p>
              )}
            </div>

            {activities.length > 5 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 text-[#2D468A] flex items-center gap-2 font-semibold hover:underline cursor-pointer"
              >
                {isExpanded ? (
                   <>View Less</>
                ) : (
                   <>See More <FaArrowRight /></>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
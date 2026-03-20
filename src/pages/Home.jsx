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
} from "../api/dashboardApi";

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
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#E8EDFB] p-4 rounded-xl">
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
            value: dashboard.total_cv || 0,
            icon: IoDocumentTextOutline,
            iconBg: "bg-[#2B7FFF]",
          },
          {
            title: "Quality Passed",
            value: dashboard.passed || 0,
            icon: FaRegCircleCheck,
            iconBg: "bg-[#00C950]",
          },
          {
            title: "Quality Failed",
            value: dashboard.failed || 0,
            icon: MdOutlineCancel,
            iconBg: "bg-[#FB2C36]",
          },
          {
            title: "Pending Review",
            value: dashboard.pending || 0,
            icon: FaClockRotateLeft,
            iconBg: "bg-[#F0B100]",
          },
          {
            title: "CV Submitted",
            value: dashboard.submitted || 0,
            icon: FiSend,
            iconBg: "bg-[#AD46FF]",
          },
          {
            title: "Success Rate",
            value: `${dashboard.success_rate || 0}%`,
            icon: GoGraph,
            iconBg: "bg-[#2B7FFF]",
          },
        ]);

        // ✅ FIXED HERE
        const activityList = activity?.results || [];

        setActivities(
          activityList.map((item) => ({
            title: item.title || item.message,
            name: item.user_name || "Unknown",
            time: item.time_ago || formatTimeAgo(item.created_at),
            dotColor:
              item.severity === "error" ? "bg-[#FB2C36]" : "bg-[#00C950]",
          })),
        );
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-[#2D468A] text-2xl sm:text-3xl font-semibold">
            Dashboard Overview
          </h3>
          <p className="text-[#4A5565] text-sm sm:text-base mt-1.5 max-w-xl">
            Monitor your CV automation workflow in real-time
          </p>
        </div>

        <Link to="cv/automation/platform">
          <button className="bg-[#2D468B] text-white px-5 py-2.5 rounded-md flex items-center gap-2">
            <CiImport className="w-5 h-5" />
            Bulk Import
          </button>
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <p className="mt-6">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-8">
          {stats.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>
      )}

      {/* Activities */}
      <div className="mt-10 bg-white/60 p-4 sm:p-6 rounded-xl border border-[#E5E7EB]">
        <h3 className="text-[#2D468A] text-xl sm:text-2xl font-semibold">
          Recent Automated Activities
        </h3>

        <div className="mt-6 flex flex-col gap-4">
          {activities.map((activity, index) => (
            <ActivitiesCard key={index} {...activity} />
          ))}
        </div>

        <button className="mt-6 text-[#2D468A] flex items-center gap-2 font-semibold">
          View All Activities <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Home;
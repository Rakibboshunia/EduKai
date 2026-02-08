import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaClockRotateLeft, FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { CiImport } from "react-icons/ci";

import StatCard from "../components/StatCard";

/* ---------------- Activities Card ---------------- */
const ActivitiesCard = ({ title, name, time, dotColor = "bg-[#00C950]" }) => {
  return (
    <div className="flex items-center justify-between bg-[#E8EDFB] p-4 rounded-xl">
      <div className="flex items-center gap-4">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <div>
          <p className="text-[#000000] font-medium text-xl">{title}</p>
          <p className="text-[#767676] text-sm">{name}</p>
        </div>
      </div>
      <p className="text-[#767676] text-sm">{time}</p>
    </div>
  );
};

/* ---------------- Home Page ---------------- */
const Home = () => {
  /* 🔹 Stats Data */
  const stats = [
    {
      title: "Total CV Import",
      value: 1247,
      icon: IoDocumentTextOutline,
      iconBg: "bg-[#2B7FFF]",
    },
    {
      title: "Quality Passed",
      value: 847,
      icon: FaRegCircleCheck,
      iconBg: "bg-[#00C950]",
    },
    {
      title: "Quality Failed",
      value: 124,
      icon: MdOutlineCancel,
      iconBg: "bg-[#FB2C36]",
    },
    {
      title: "Pending Review",
      value: 1247,
      icon: FaClockRotateLeft,
      iconBg: "bg-[#F0B100]",
    },
    {
      title: "CV Submitted",
      value: 247,
      icon: FiSend,
      iconBg: "bg-[#AD46FF]",
    },
    {
      title: "Success Rate",
      value: "84%",
      icon: GoGraph,
      iconBg: "bg-[#2B7FFF]",
    },
  ];

  /* 🔹 Activities Data */
  const activities = [
    {
      title: "CV Quality Check Passed",
      name: "John Smith",
      time: "5 mins ago",
    },
    {
      title: "Availability Confirmed (Email)",
      name: "Devid Miller",
      time: "12 mins ago",
    },
    {
      title: "CV Submitted to TechCorp Ltd",
      name: "Johnson Lee",
      time: "25 mins ago",
    },
    {
      title: "WhatsApp Response Received",
      name: "Sarah Johnson",
      time: "40 mins ago",
    },
    {
      title: "Quality Check Failed",
      name: "Michael Brown",
      time: "1 hour ago",
      dotColor: "bg-[#FB2C36]",
    },
  ];

  return (
    <div>
      {/* 🔹 Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[#2D468A] text-3xl whitespace-nowrap">
            Dashboard Overview
          </h3>
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Monitor your CV automation workflow in real-time
          </p>
        </div>

        <Link to="cv/automation/platform">
          <button className="bg-[#2D468B] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#354e92] cursor-pointer transition">
            <CiImport className="w-6 h-6" />
            Bulk Import
          </button>
        </Link>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {stats.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      {/* 🔹 Activities Section */}
      <div className="mt-10 bg-white p-5 rounded-lg border-2 border-[#E5E7EB]">
        <h3 className="text-[#2D468A] text-2xl font-semibold">
          Recent Automated Activities
        </h3>

        <div className="mt-6 flex flex-col gap-6">
          {activities.map((activity, index) => (
            <ActivitiesCard key={index} {...activity} />
          ))}
        </div>

        <button className="mt-6 text-[#2D468A] flex items-center gap-2 font-semibold hover:underline">
          View All Activities <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Home;

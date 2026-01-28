import React from "react";
import Breadcrumb from "../../components/Bredcumb";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaArrowTrendDown, FaArrowTrendUp, FaUsers } from "react-icons/fa6";
import { LiaCheckCircle } from "react-icons/lia";
import { MdAccessTime, MdOutlineErrorOutline } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuDollarSign } from "react-icons/lu";
import Table from "../../components/Table";
import RecentFarms from "../../components/RecentFarms";
import SystemAlerts from "../../components/SystemAlerts";

const Dashboard = () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      message: 'Farm "Sunset Ranch" subscription expires in 3 days',
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "error",
      message: 'Payment failed for "Riverside Farm"',
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "info",
      message: "2 trial farms will expire tomorrow",
      time: "1 day ago",
    },
  ];

  return (
    <div>
      <div>
      <h3 className=" text-[#0A0A0A] text-3xl whitespace-nowrap">
        Dashboard
      </h3>
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Complete system health at a glance
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">Total Farms</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">5</h2>
            </div>

            <div className="bg-[#2B7FFF] p-3 rounded-lg w-fit">
              <HiOutlineOfficeBuilding className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendUp className="text-[#00A63E]" />
            <p className="text-[#00A63E]">
              +12%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">Active Subscriptions</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">38</h2>
            </div>

            <div className="bg-[#00C950] p-3 rounded-lg w-fit">
              <LiaCheckCircle className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendUp className="text-[#00A63E]" />
            <p className="text-[#00A63E]">
              +8%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">Trial Farms</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">9</h2>
            </div>

            <div className="bg-[#F0B100] p-3 rounded-lg w-fit">
              <MdAccessTime className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendUp className="text-[#00A63E]" />
            <p className="text-[#00A63E]">
              +3%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">Total Users</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">1247</h2>
            </div>

            <div className="bg-[#AD46FF] p-3 rounded-lg w-fit">
              <FiUsers className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendUp className="text-[#00A63E]" />
            <p className="text-[#00A63E]">
              +156%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">Monthly Revenue</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">$24,850</h2>
            </div>

            <div className="bg-[#00BC7D] p-3 rounded-lg w-fit">
              <LuDollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendUp className="text-[#00A63E]" />
            <p className="text-[#00A63E]">
              +15%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#4A5565] ">System Alerts</p>
              <h2 className="text-3xl text-[#0A0A0A] my-1">5</h2>
            </div>

            <div className="bg-[#FB2C36] p-3 rounded-lg w-fit">
              <MdOutlineErrorOutline className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <FaArrowTrendDown className="text-[#E7000B]" />
            <p className="text-[#E7000B]">
              -2%
              <span className="text-[#6A7282]"> vs last month</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6 overflow-x-scroll hide-scrollbar">
          <h3 className="text-2xl mb-4 text-[#0A0A0A]">
           Recent Farms
          </h3>
          <RecentFarms />
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border-2 border-[#E5E7EB]  p-6">
          <h3 className="text-2xl mb-4 text-[#0A0A0A]">
            System Alerts
          </h3>
          <SystemAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

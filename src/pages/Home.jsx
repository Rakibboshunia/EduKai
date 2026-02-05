import React from "react";
import { FaArrowRight, FaArrowTrendUp, FaClockRotateLeft, FaRegCircleCheck } from "react-icons/fa6";
import {
  FiCheckSquare,
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineCancel, MdOutlineErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import Bredcumb from "../components/Breadcrumb";
import { CiImport } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { GoGraph } from "react-icons/go";

let ActivitiesCard = ({  title, name, time }) => {
  return (
    <div className="flex items-center justify-between bg-[#E8EDFB] p-4 rounded-xl">  
      <div className="flex items-center gap-4">
        <span className="bg-[#00C950] w-2 h-2 rounded-full">
         
        </span>
        <div>
          <p className="text-[#000000] font-medium text-2xl">{title}</p>
          <p className="text-[#767676]">{name}</p>
        </div>
      </div>
      <div>
        <p className="text-[#767676]">{time}</p>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
         <h3 className="text-[#2D468A] text-3xl whitespace-nowrap">
        Dashboard Overview
      </h3>
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
           Monitor your CV automation workflow in real-time
          </p>
        </div>

        <Link to="cv/automation/platform">
          <button className="bg-[#2D468B] text-white px-10 py-2 rounded-md flex items-center gap-2 hover:bg-[#354e92] cursor-pointer">
            <CiImport className="w-8 h-8" />
            Bulk Import
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">Total CV Import </p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#2B7FFF] p-3 rounded-lg w-fit">
            <IoDocumentTextOutline className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">Quality Passed</p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#00C950] p-3 rounded-lg w-fit">
            <FaRegCircleCheck className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">Quality Failed</p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#FB2C36] p-3 rounded-lg w-fit">
            <MdOutlineCancel className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">Pending Review</p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#F0B100] p-3 rounded-lg w-fit">
           <FaClockRotateLeft className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">CV Submitted</p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#AD46FF] p-3 rounded-lg w-fit">
            <FiSend className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white  p-10 rounded-lg border-2 border-[#E5E7EB] flex  items-center justify-between ">
          <div>
            <p className="text-[#4A5565]">Success Rate</p>
            <h2 className="text-3xl font-semibold text-[#0A0A0A] my-1">24</h2>
          </div>
          <div className="bg-[#2B7FFF] p-3 rounded-lg w-fit">
           <GoGraph className="w-6 h-6 text-white " />
          </div>
        </div>

        <div className="col-span-12  bg-white  p-5 rounded-lg border-2 border-[#E5E7EB]">
         <h3 className="text-[#2D468A] text-2xl font-semibold">
          Recent Automated Activities
         </h3>

          <div className="mt-6 flex flex-col gap-7">
           <ActivitiesCard
             
              title="CV Quality Check Passed"
              name="John Smith"
              time="5 mins ago"
            />

            <ActivitiesCard
             
              title="Availability Confirmed (Email)"
              name="John Smith"
              time="5 mins ago"
            />
            <ActivitiesCard
             
              title="CV Submitted to TechCorp Ltd"
              name="John Smith"
              time="5 mins ago"
            />
            <ActivitiesCard
             
              title="WhatsApp Response Received"
              name="John Smith"
              time="5 mins ago"
            />
            <ActivitiesCard
             
              title="Quality Check Failed"
              name="John Smith"
              time="5 mins ago"
            />
             
          </div>

          <button className="mt-6  text-[#2D468A]  py-3 rounded-lg  flex items-center gap-2 cursor-pointer  font-semibold">
            View All Activities <FaArrowRight />
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default Home;

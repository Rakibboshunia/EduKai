import React from "react";
import { FaArrowTrendUp, FaClockRotateLeft, FaRegCircleCheck } from "react-icons/fa6";
import {
  FiCheckSquare,
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineCancel, MdOutlineErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import Bredcumb from "../../components/Bredcumb";
import { CiImport } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { GoGraph } from "react-icons/go";

const Home = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Bredcumb />
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage all SOP documents in one place
          </p>
        </div>

        <Link to="/admin/sop/management/upload/sop">
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

        <div className="col-span-12  bg-white  p-10 rounded-lg border-2 border-[#E5E7EB]">
          <div className="flex justify-between  pb-4">
            <span className="text-xl text-[#0A0A0A]">Subscription Status</span>
            <span className="text-[#00A63E]">
              <FaArrowTrendUp />
            </span>
          </div>

          <div className="flex justify-between  py-3">
            <span className="text-[#4A5565] text-base">Current Plan</span>
            <span className="font-normal text-base text-[#00A63E] bg-[#DCFCE7] py-1 px-2 rounded">
              Professional
            </span>
          </div>

          <div className="flex justify-between  py-3">
            <span className="text-[#4A5565] text-base">Employee Count</span>
            <span className="font-normal text-base text-[#4A5565]">24/50</span>
          </div>

          <div className="flex justify-between  py-3">
            <span className="text-[#4A5565] text-base">Next Billing Date</span>
            <span className="font-normal text-base text-[#4A5565]">
              February 15,2026
            </span>
          </div>

          <div className="border-t border-[#E5E7EB] mt-4 pt-4">
            <p className="text-[#4A5565] flex items-center gap-2">
              <MdOutlineErrorOutline />
              26 employees remaining in your plan
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Home;

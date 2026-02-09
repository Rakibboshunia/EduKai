import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import UploadPDF from "../components/UploadPDF";
import { CiExport } from "react-icons/ci";
import { BiCoinStack } from "react-icons/bi";
import { BsFolder } from "react-icons/bs";
import ExistingCRM from "../components/ExistingCRM";
import PreviousDatabase from "../components/PreviousDatabase";
import QualityCheck from "../components/QualityCheck";
import ChannelSelector from "../components/ChannelSelector";

const BulkImport = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="p-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Recruitment Management System
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 rounded-lg p-1.5 w-full mt-6  ">
        <button
          onClick={() => setActiveTab("upload")}
          className={`md:px-20 px-[38px] py-6 rounded-md cursor-pointer flex items-center flex-col gap-1 text-2xl ${
            activeTab === "upload"
              ? "border border-[#2D468A] text-[#000000]"
              : "bg-[#FFFFFF] text-[#0A0A0A]"
          }`}
        >
          <CiExport className="w-11 h-11" />
          Local Upload
          <p className="text-[#7C7C7C] text-xs">Upload files from computer</p>
        </button>

        <button
          onClick={() => setActiveTab("crm")}
          className={`md:px-20 px-[38px] py-6 rounded-md cursor-pointer flex items-center flex-col gap-1 text-2xl ${
            activeTab === "crm"
              ? "border border-[#2D468A] text-[#000000]"
              : "bg-[#FFFFFF] text-[#0A0A0A]"
          }`}
        >
          <BiCoinStack className="w-11 h-11" />
          Existing CRM
          <p className="text-[#7C7C7C] text-xs">Import from existing CRM</p>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`md:px-20 px-[38px] py-6 rounded-md cursor-pointer flex items-center flex-col gap-1 text-2xl ${
            activeTab === "database"
              ? "border border-[#2D468A] text-[#000000]"
              : "bg-[#FFFFFF] text-[#0A0A0A]"
          }`}
        >
          <BsFolder className="w-11 h-11" />
          Previous Database
          <p className="text-[#7C7C7C] text-xs">
            Import from previous database
          </p>
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 col-span-12">
        {activeTab === "upload" && (
          <UploadPDF
            onFileSelect={(file) => {
              console.log("Selected PDF:", file);
            }}
          />
        )}
        {activeTab === "crm" && <ExistingCRM />}

        {activeTab === "database" && <PreviousDatabase />}
      </div>

      <div className="mt-6 ">
        <QualityCheck />
      </div>

      <div className="mt-6 bg-white p-8 rounded-md space-y-4">
        <h2 className="text-2xl font-semibold text-[#2D468A]">
          Availability Check Workflow
        </h2>

        <p className="text-sm font-medium text-gray-700">Select Channels</p>

        <div>
          <ChannelSelector />
        </div>
      </div>
    </div>
  );
};

export default BulkImport;

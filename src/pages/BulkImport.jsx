import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import UploadPDF from "../components/UploadPDF";
import { CiExport } from "react-icons/ci";
import { BiCoinStack } from "react-icons/bi";
import ExistingCRM from "../components/ExistingCRM";
import QualityCheck from "../components/QualityCheck";
import ChannelSelector from "../components/ChannelSelector";
import { uploadCandidates } from "../api/candidateApi";

const BulkImport = () => {

  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState([]);

  // dynamic state
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobRole, setJobRole] = useState("");

  const handleSubmit = async () => {

    if (!files.length) {
      alert("Please upload at least one PDF");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("experience", experience);
    formData.append("skills", JSON.stringify(skills.split(",")));
    formData.append("job_role", JSON.stringify(jobRole.split(",")));

    // console debug
    console.log("Files:", files);
    console.log("Experience:", experience);
    console.log("Skills:", skills);
    console.log("Job Role:", jobRole);

    try {

      const res = await uploadCandidates(formData);

      console.log("API Response:", res);

      alert("CV uploaded successfully");

    } catch (error) {

      console.error("Upload error:", error.response?.data || error);

      alert("Upload failed");

    }
  };

  return (
    <div className="p-4">

      <div className="flex items-center justify-between">

        <div>
          <Breadcrumb />

          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Recruitment Management System
          </p>
        </div>

      </div>

      {/* Tabs */}

      <div className="grid md:grid-cols-2 gap-6 rounded-lg p-1.5 w-full mt-6">

        <button
          onClick={() => setActiveTab("upload")}
          className={`md:px-20 px-10 py-6 rounded-md flex items-center flex-col gap-1 text-2xl ${
            activeTab === "upload"
              ? "border border-[#2D468A]"
              : "bg-white/60"
          }`}
        >

          <CiExport className="w-11 h-11" />

          Local Upload

          <p className="text-[#7C7C7C] text-xs">
            Upload files from computer
          </p>

        </button>

        <button
          onClick={() => setActiveTab("crm")}
          className={`md:px-20 px-10 py-6 rounded-md flex items-center flex-col gap-1 text-2xl ${
            activeTab === "crm"
              ? "border border-[#2D468A]"
              : "bg-white/60"
          }`}
        >

          <BiCoinStack className="w-11 h-11" />

          Existing CRM

          <p className="text-[#7C7C7C] text-xs">
            Import from existing CRM
          </p>

        </button>

      </div>

      {/* Upload Section */}

      <div className="mt-6 col-span-12">

        {activeTab === "upload" && (

          <UploadPDF
            onFileSelect={(file) => {
              console.log("Selected files:", file);
              setFiles(file);
            }}
          />

        )}

        {activeTab === "crm" && <ExistingCRM />}

      </div>

      {/* Quality Check */}

      <div className="mt-6">

        <QualityCheck
          experience={experience}
          setExperience={setExperience}
          skills={skills}
          setSkills={setSkills}
          jobRole={jobRole}
          setJobRole={setJobRole}
        />

      </div>

      {/* Channel Selector */}

      <div className="mt-6 bg-white/60 p-8 rounded-xl space-y-4">

        <h2 className="text-2xl font-semibold text-[#2D468A]">
          Availability Check Workflow
        </h2>

        <p className="text-sm font-medium text-gray-700">
          Select Channels
        </p>

        <ChannelSelector />

        <div className="pt-4 flex justify-end">

          <button
            className="bg-[#2D468A] text-white px-8 py-3 rounded-md hover:bg-[#354e92]"
            onClick={handleSubmit}
          >
            Submit CV
          </button>

        </div>

      </div>

    </div>
  );
};

export default BulkImport;
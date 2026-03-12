import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import UploadPDF from "../components/UploadPDF";
import { CiExport } from "react-icons/ci";
import ExistingCRM from "../components/ExistingCRM";
import QualityCheck from "../components/QualityCheck";
import { uploadCandidates } from "../api/candidateApi";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const BulkImport = () => {

  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState([]);

  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobRole, setJobRole] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!files.length) {
      toast.error("Please upload at least one PDF");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("experience", experience);
    formData.append("skills", JSON.stringify(skills.split(",")));
    formData.append("job_role", JSON.stringify(jobRole.split(",")));

    console.log("Files:", files);
    console.log("Experience:", experience);
    console.log("Skills:", skills);
    console.log("Job Role:", jobRole);

    try {

      setLoading(true);

      const res = await uploadCandidates(formData);

      console.log("API Response:", res);

      toast.success("CV uploaded successfully");

    } catch (error) {

      console.error("Upload error:", error.response?.data || error);

      toast.error("Upload failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-4">

      <Toaster position="top-right" />

      <div className="flex items-center justify-between">

        <div>
          <Breadcrumb />

          <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Recruitment Management System
          </p>
        </div>

      </div>


      <div className="grid md:grid-cols-1 gap-6 rounded-lg p-1.5 w-full mt-6">

        <button
          onClick={() => setActiveTab("upload")}
          className={`md:px-20 px-10 py-6 rounded-md flex items-center flex-col gap-1 text-2xl ${
            activeTab === "upload"
              ? "border border-[#2D468A]"
              : "bg-white/60"
          }`}
        >

          <CiExport className="w-10 h-10" />

          Local Upload

          <p className="text-[#686868] text-xs">
            Upload files from computer
          </p>

        </button>

      </div>

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

      <div className="pt-4 flex justify-center">

        <button
          className="bg-[#2D468A] text-white px-28 py-3 text-xl rounded-md hover:bg-[#354e92] cursor-pointer flex items-center gap-2 transition-all"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" />
              Uploading...
            </>
          ) : (
            "Submit CV"
          )}
        </button>

      </div>

    </div>
  );
};

export default BulkImport;
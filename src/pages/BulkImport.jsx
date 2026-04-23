import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import UploadPDF from "../components/UploadPDF";
import QualityCheck from "../components/QualityCheck";
import { uploadCandidates } from "../api/candidateApi";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const BulkImport = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState([]);

  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobRole, setJobRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  const CHUNK_SIZE = 20;
  const PARALLEL_UPLOADS = 1;

  const uploadChunk = async (chunk) => {

    const formData = new FormData();

    chunk.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("experience", experience || "");

    formData.append(
      "skills",
      JSON.stringify(
        skills
          ? skills.split(",").map((s) => s.trim())
          : []
      )
    );

    formData.append(
      "job_role",
      JSON.stringify(
        jobRole
          ? jobRole.split(",").map((r) => r.trim())
          : []
      )
    );

    return uploadCandidates(formData);
  };

  const handleSubmit = async () => {

    if (!files.length) {
      toast.error("Please upload at least one PDF");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);

      const chunks = [];

      for (let i = 0; i < files.length; i += CHUNK_SIZE) {
        chunks.push(files.slice(i, i + CHUNK_SIZE));
      }

      const totalChunks = chunks.length;
      let uploaded = 0;

      for (let i = 0; i < chunks.length; i += PARALLEL_UPLOADS) {

        const batch = chunks.slice(i, i + PARALLEL_UPLOADS);

        await Promise.all(
          batch.map(async (chunk) => {

            await uploadChunk(chunk);

            uploaded++;

            const percent = Math.floor((uploaded / totalChunks) * 100);

            setProgress(percent);
            setUploadStatus(`Uploading batch ${uploaded} / ${totalChunks}`);

          })
        );

      }

      toast.success(`${files.length} CV uploaded successfully`);
      navigate("/cv/queue");

    } catch (error) {

      console.error("Upload error:", error);
      toast.error("Upload failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">

        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>
        
        <div className="space-y-4 z-10 w-full">
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
              Bulk CV Import
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
              Upload multiple candidate CVs at once and enforce automated AI quality checks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col p-6 sm:p-10 space-y-10">
        
        {/* Upload Container */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="bg-[#2D468A]/10 p-2 rounded-lg text-[#2D468A] font-bold text-lg">1</div>
             <h2 className="text-xl font-bold tracking-tight text-[#2D468A]">Upload Documents</h2>
          </div>
          {activeTab === "upload" && (
            <UploadPDF
              onFileSelect={(file) => {
                console.log("Selected files:", file);
                setFiles(file);
              }}
            />
          )}
        </div>

        {/* Quality Check Controls */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="bg-[#2D468A]/10 p-2 rounded-lg text-[#2D468A] font-bold text-lg">2</div>
             <h2 className="text-xl font-bold tracking-tight text-[#2D468A]">Configure Quality Checks</h2>
          </div>
          <div className="bg-gray-50/50 rounded-2xl">
            <QualityCheck
              experience={experience}
              setExperience={setExperience}
              skills={skills}
              setSkills={setSkills}
              jobRole={jobRole}
              setJobRole={setJobRole}
            />
          </div>
        </div>

        {/* Upload Progress UI */}
        {loading && (
          <div className="w-full max-w-2xl mx-auto bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col gap-3 font-medium">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#2D468A] flex items-center gap-2">
                <AiOutlineLoading3Quarters className="animate-spin" /> {uploadStatus}
              </span>
              <span className="text-[#2D468A] font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 border border-blue-100 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#5a7bd4] to-[#2D468A] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500">Please do not close this window while the upload is in progress.</p>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button
            className={`w-full sm:w-auto px-12 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 ${
              loading 
                ? "bg-gray-400 text-white cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-[#2D468A] to-[#1a3060] text-white hover:shadow-xl hover:-translate-y-1"
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                Processing Upload...
              </>
            ) : (
              "Analyze & Import CVs"
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default BulkImport;
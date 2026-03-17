import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import UploadPDF from "../components/UploadPDF";
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

    } catch (error) {

      console.error("Upload error:", error);
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

      <div className="mt-6 col-span-12">

        {activeTab === "upload" && (

          <UploadPDF
            onFileSelect={(file) => {
              console.log("Selected files:", file);
              setFiles(file);
            }}
          />

        )}

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

      {loading && (

        <div className="mt-6 w-full max-w-xl mx-auto">

          <div className="text-center mb-2 text-sm text-gray-600">
            {uploadStatus}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

            <div
              className="bg-[#2D468A] h-4 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

          </div>

          <div className="text-center text-xs mt-2 text-gray-500">
            {progress}% completed
          </div>

        </div>

      )}

      <div className="pt-6 flex justify-center">

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
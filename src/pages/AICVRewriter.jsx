import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiSend,
  FiDownload,
  FiBriefcase,
  FiEdit,
  FiSave,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import toast from "react-hot-toast";

import CVPreviewCard from "../components/CVPreviewCard";
import { rewriteCandidateCV, getCandidateById } from "../api/candidateApi";

export default function AICVRewriter() {

  const navigate = useNavigate();
  const location = useLocation();

  const [candidate, setCandidate] = useState(
    location.state?.candidate || {
      id: null,
      name: "John Smith",
      job_title: "Senior Software Developer",
    }
  );

  const [isRewriting, setIsRewriting] = useState(false);

  const [options, setOptions] = useState({
    removeSurname: true,
    removeEmployer: false,
  });

  const [originalCV, setOriginalCV] = useState("Loading original CV...");

  const [aiCV, setAiCV] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [tempCV, setTempCV] = useState("");

  useEffect(() => {
    if (candidate.id) {
      getCandidateById(candidate.id)
        .then((res) => {
          console.log("Candidate full data:", res);
          // Attempting to use likely keys for the parsed CV text
          const cvText = res.parsed_cv || res.parsed_text || res.cv_text || res.original_text || res.resume_text || res.text || JSON.stringify(res, null, 2);
          setOriginalCV(typeof cvText === 'string' ? cvText : JSON.stringify(cvText, null, 2));
        })
        .catch((err) => {
          console.error("Failed to load original CV text", err);
          setOriginalCV("Error loading original CV.");
        });
    } else {
      setOriginalCV("No candidate ID provided.");
    }
  }, [candidate.id]);

  const handleRewriteWithAI = async () => {

    if (!candidate.name) {
      toast.error("Candidate name missing");
      return;
    }
    
    if (!candidate.id) {
      toast.error("Candidate ID missing. No real candidate selected.");
      return;
    }

    try {

      setIsRewriting(true);

      const response = await rewriteCandidateCV(candidate.id, {
        removeSurname: options.removeSurname,
        removeEmployer: options.removeEmployer,
      });

      const rewrittenCV = typeof response === 'object' && response !== null
        ? (response.rewritten_cv || response.cv || response.data || response.message || JSON.stringify(response))
        : String(response || "No content returned");

      setAiCV(rewrittenCV);
      setTempCV(rewrittenCV); 

      toast.success("CV rewritten successfully");

    } catch (error) {

      console.error(error);
      toast.error("Rewrite failed");

    } finally {

      setIsRewriting(false);

    }
  };

  const handleEdit = () => {
    if (!aiCV) {
      toast.error("Generate CV first");
      return;
    }
    setTempCV(aiCV);
    setEditMode(true);
  };

  const handleSave = () => {
    setAiCV(tempCV);
    setEditMode(false);
    toast.success("CV updated");
  };

  const handleCancel = () => {
    setEditMode(false);
    setTempCV(aiCV);
  };

  const handleDownload = () => {

    if (!aiCV) {
      toast.error("No AI CV to download");
      return;
    }

    const blob = new Blob([aiCV], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_CV.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const renderCandidateDetails = (cand) => {
    if (cand.original_cv_url) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <iframe 
            src={`${cand.original_cv_url}#toolbar=0&navpanes=0`} 
            title="Original CV PDF View" 
            className="w-full rounded-md border border-gray-200" 
            style={{ minHeight: '550px' }}
          />
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-4 text-left">
        <div className="border-b pb-4 mb-2">
          <h2 className="text-xl font-bold text-[#2D468A]">{cand.name || "Unknown Candidate"}</h2>
          {cand.job_title && <p className="text-gray-600 font-medium mt-1">{cand.job_title}</p>}
        </div>
        
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
          {cand.email && (
             <p className="flex items-center gap-2"><FiMail className="text-gray-500" /> {cand.email}</p>
          )}
          {cand.phone && (
             <p className="flex items-center gap-2"><FiPhone className="text-gray-500" /> {cand.phone}</p>
          )}
          {cand.experience !== undefined && cand.experience !== null && (
             <p className="flex items-center gap-2"><FiBriefcase className="text-gray-500" /> {cand.experience} years experience</p>
          )}
        </div>
        
        {cand.skills && cand.skills.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cand.skills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-[#E8EDFB] text-[#2D468A] rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* PDF Link is no longer needed below since we embed it directly, but we can keep a fallback button if iframe fails */}
        {cand.original_cv_url && (
          <div className="mt-4 pt-4 border-t">
            <a href={cand.original_cv_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
              View Original PDF Document
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderOriginalCVContent = () => {
    if (!originalCV) return "Loading original CV...";
    if (typeof originalCV === "string") {
      try {
        const parsed = JSON.parse(originalCV);
        if (typeof parsed === "object" && parsed !== null) {
          return renderCandidateDetails(parsed);
        }
      } catch(e) {
        return originalCV;
      }
    }
    return renderCandidateDetails(originalCV);
  };

  return (
    <div className="p-4 sm:p-6">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D468A]">
          AI CV Rewriter & Anonymization
        </h1>

        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Enhance CVs with AI and apply anonymization settings
        </p>
      </div>

      <div className="bg-white/60 p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 gap-4">

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiUser className="text-gray-400" />
              Candidate
            </label>

            <input
              type="text"
              value={candidate.name}
              readOnly
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700"
            />
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiBriefcase className="text-gray-400" />
              Job Title
            </label>

            <input
              type="text"
              value={candidate.job_title}
              readOnly
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700"
            />
          </div> */}

        </div>
      </div>

      <div className="bg-white/60 p-4 sm:p-6 md:p-8 mb-8 rounded-lg shadow-sm">

        <div className="inline-block border border-gray-100 rounded-xl p-3 bg-white">
          <button
            onClick={handleRewriteWithAI}
            disabled={isRewriting}
            className={`px-4 py-3 rounded-md text-sm flex items-center gap-2 cursor-pointer transition
              ${
                isRewriting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#2D468A] text-white hover:bg-[#243a73]"
              }`}
          >
            <SiOpenai />
            {isRewriting ? "AI is rewriting..." : "Rewrite with AI"}
          </button>
        </div>

        <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-6 mb-6 pt-6 sm:pt-8">

          <CVPreviewCard
            title="Original CV"
            status="Before AI processing"
            content={renderOriginalCVContent()}
          />

          <div className="relative">

            <CVPreviewCard
              title="AI-Enhanced CV"
              status="Processed by ChatGPT"
              content={
                editMode
                  ? tempCV
                  : aiCV || "Click 'Rewrite with AI' to generate"
              }
            />

            <div className="absolute top-3 right-3 flex gap-2 z-20">

              {!editMode ? (
                <button
                  onClick={handleEdit}
                  className="bg-[#2D468B] hover:bg-[#3b56a1] transition shadow text-white border border-gray-300 px-3 py-2 text-sm rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <FiEdit /> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#354b88] text-green-400 px-2 py-1 text-md rounded flex items-center gap-1 cursor-pointer hover:bg-green-600 hover:text-white transition"
                  >
                    <FiSave /> Save
                  </button>

                  <button
                    onClick={handleCancel}
                    className="bg-[#354b88] text-red-400 px-2 py-1 text-md rounded cursor-pointer hover:bg-red-600 hover:text-white transition flex items-center gap-1"
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>

            {editMode && (
              <textarea
                value={tempCV}
                onChange={(e) => setTempCV(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 border rounded-lg bg-white text-sm z-10"
              />
            )}

          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 sm:pt-8">

          <button
            onClick={() => navigate("/ai/mail-submission", { state: { candidate } })}
            className="flex-1 bg-[#2D468B] text-white px-6 py-3 rounded-md hover:bg-[#354e92] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FiSend />
            Mail Submission
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 border border-gray-300 px-6 py-3 rounded-md text-sm text-black hover:text-white hover:bg-[#2D468B] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiDownload />
            Download CV
          </button>

        </div>

      </div>

    </div>
  );
}
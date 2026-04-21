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
import {
  rewriteCandidateCV,
  getCandidateById,
  getRewriteStatus,
} from "../api/candidateApi";

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

  // 🔥 NEW STATE (PDF edit support)
  const [isEditingPDF, setIsEditingPDF] = useState(false);

  /* ================= LOAD ORIGINAL + ENHANCED ================= */
  useEffect(() => {
    if (candidate.id) {
      getCandidateById(candidate.id)
        .then((res) => {
          // ORIGINAL
          if (res.original_cv_url) {
            setOriginalCV({ type: "pdf", url: res.original_cv_url });
          }

          // 🔥 ENHANCED AUTO LOAD
          if (res.enhanced_cv_url) {
            setAiCV({ type: "pdf", url: res.enhanced_cv_url });
          } else if (res.ai_enhanced_cv_content) {
            const content =
              typeof res.ai_enhanced_cv_content === "string"
                ? res.ai_enhanced_cv_content
                : JSON.stringify(res.ai_enhanced_cv_content, null, 2);

            setAiCV({ type: "text", content });
            setTempCV(content);
          }
        })
        .catch(() => {
          setOriginalCV("Error loading original CV.");
        });
    }
  }, [candidate.id]);

  /* ================= REWRITE ================= */
  const handleRewriteWithAI = async () => {
    if (!candidate.id) {
      toast.error("Candidate ID missing");
      return;
    }

    try {
      setIsRewriting(true);

      const startRes = await rewriteCandidateCV(candidate.id, options);

      if (startRes.rewrite_status !== "processing") {
        toast.error("Rewrite failed to start");
        return;
      }

      toast.success("AI rewriting started...");

      let retries = 0;
      let finalData = null;

      while (retries < 15) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusRes = await getRewriteStatus(candidate.id);

        if (statusRes.rewrite_status === "completed") {
          finalData = statusRes;
          break;
        }

        retries++;
      }

      if (!finalData) {
        toast.error("AI rewrite timeout");
        return;
      }

      const enhancedUrl = finalData?.candidate?.enhanced_cv_url;

      if (enhancedUrl) {
        setAiCV({ type: "pdf", url: enhancedUrl });
      } else {
        const aiContent =
          finalData?.candidate?.ai_enhanced_cv_content ||
          JSON.stringify(finalData, null, 2);

        const finalText =
          typeof aiContent === "string"
            ? aiContent
            : JSON.stringify(aiContent, null, 2);

        setAiCV({ type: "text", content: finalText });
        setTempCV(finalText);
      }

      toast.success("CV rewritten successfully ✅");
    } catch (error) {
      console.error(error);
      toast.error("Rewrite failed");
    } finally {
      setIsRewriting(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const handleDownload = () => {
    if (!aiCV) {
      toast.error("No AI CV to download");
      return;
    }

    if (aiCV.type === "pdf") {
      window.open(aiCV.url, "_blank");
    } else {
      const blob = new Blob([aiCV.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "AI_CV.txt";
      a.click();

      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2D468A]">
          AI CV Rewriter & Anonymization
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-4 max-w-2xl">
          Enhance CVs with AI and apply anonymization settings
        </p>
      </div>

      <div className="bg-white/60 p-4 rounded-lg border mb-6">
        <input
          type="text"
          value={candidate.name}
          readOnly
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700"
        />
      </div>

      <div className="bg-white/60 p-4 sm:p-6 md:p-8 mb-8 rounded-lg shadow-sm">
        <button
          onClick={handleRewriteWithAI}
          disabled={isRewriting}
          className={`px-4 py-3 rounded-md text-sm flex items-center gap-2
            ${
              isRewriting
                ? "bg-gray-400 text-white"
                : "bg-[#2D468A] text-white hover:bg-[#243a73]"
            }`}
        >
          <SiOpenai />
          {isRewriting ? "AI is rewriting..." : "Rewrite with AI"}
        </button>

        <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-6 pt-8">
          {/* ORIGINAL */}
          <CVPreviewCard
            title="Original CV"
            status="Before AI processing"
            content={
              originalCV?.type === "pdf" ? (
                <iframe
                  src={`${originalCV.url}#toolbar=0&navpanes=0`}
                  className="w-full rounded-md border"
                  style={{ minHeight: "650px" }}
                />
              ) : (
                originalCV
              )
            }
          />

          {/* AI */}
          <div className="relative">
            <CVPreviewCard
              title="AI-Enhanced CV"
              status="Processed by AI"
              content={
                isEditingPDF ? (
                  <textarea
                    value={tempCV}
                    onChange={(e) => setTempCV(e.target.value)}
                    className="absolute inset-0 w-full h-full p-4 border rounded-lg bg-white text-sm z-10"
                  />
                ) : aiCV?.type === "pdf" ? (
                  <iframe
                    src={`${aiCV.url}#toolbar=0&navpanes=0`}
                    className="w-full rounded-md border"
                    style={{ minHeight: "650px" }}
                  />
                ) : editMode ? (
                  tempCV
                ) : (
                  aiCV?.content || "Click 'Rewrite with AI' to generate"
                )
              }
            />

            {/* 🔥 EDIT BUTTON */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              {!isEditingPDF ? (
                <button
                  onClick={() => {
                    if (aiCV?.type === "pdf") {
                      setTempCV("Paste or edit CV content here...");
                    } else {
                      setTempCV(aiCV?.content || "");
                    }
                    setIsEditingPDF(true);
                  }}
                  className="bg-[#2D468B] text-white px-3 py-2 text-sm rounded-lg flex items-center gap-1"
                >
                  <FiEdit /> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAiCV({ type: "text", content: tempCV });
                      setIsEditingPDF(false);
                      toast.success("CV updated");
                    }}
                    className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <FiSave /> Save
                  </button>

                  <button
                    onClick={() => setIsEditingPDF(false)}
                    className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            onClick={() =>
              navigate("/ai/mail-submission", { state: { candidate } })
            }
            className="flex-1 bg-[#2D468B] hover:bg-[#1a3060] text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
          >
            <FiSend />
            Mail Submission
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 border text-[#2D468B] hover:text-white hover:bg-[#2D468B] px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all"
          >
            <FiDownload />
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
}
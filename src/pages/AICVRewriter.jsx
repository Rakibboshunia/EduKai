import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiSend,
  FiDownload,
  FiBriefcase,
  FiEdit,
  FiSave,
} from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import toast from "react-hot-toast";

import CVPreviewCard from "../components/CVPreviewCard";

export default function AICVRewriter() {

  const navigate = useNavigate();

  const [candidate, setCandidate] = useState({
    name: "John Smith",
    job_title: "Senior Software Developer",
  });

  const [isRewriting, setIsRewriting] = useState(false);

  const [options, setOptions] = useState({
    removeSurname: true,
    removeEmployer: false,
  });

  const [originalCV, setOriginalCV] = useState(`
JOHN SMITH
Senior Software Developer

Email: john.smith@email.com | Phone: +44 7700 900123

PROFESSIONAL SUMMARY
Experienced software developer with 5+ years of expertise in building scalable applications.
Proven track record at TechCorp International delivering high-quality solutions.

WORK EXPERIENCE
Senior Developer – TechCorp International (2021–Present)
- Led development of microservices architecture
- Improved application performance by 40%

EDUCATION
BSc Computer Science – University of Technology
`);

  const [aiCV, setAiCV] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [tempCV, setTempCV] = useState("");

  const handleRewriteWithAI = async () => {

    if (!candidate.name) {
      toast.error("Candidate name missing");
      return;
    }

    try {

      setIsRewriting(true);

      await new Promise((res) => setTimeout(res, 1200));

      const firstName = candidate.name
        ? candidate.name.split(" ")[0].toUpperCase()
        : "UNKNOWN";

      const fullName = candidate.name?.toUpperCase() || "UNKNOWN";

      const displayName = options.removeSurname
        ? firstName
        : fullName;

      const rewrittenCV = `
${displayName}
${candidate.job_title}

Email: anonymized@email.com | Phone: +44 7700 900123

PROFESSIONAL SUMMARY
AI-enhanced CV focusing on clarity, impact, and recruiter-friendly structure.

WORK EXPERIENCE
Senior Developer – ${
        options.removeEmployer
          ? "Leading Technology Company"
          : "TechCorp International"
      } (2021–Present)

- Architected scalable systems
- Improved performance and maintainability
- Collaborated with cross-functional teams

EDUCATION
BSc Computer Science – University of Technology
`;

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
            content={originalCV}
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
            onClick={() => navigate("/ai/mail-submission")}
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
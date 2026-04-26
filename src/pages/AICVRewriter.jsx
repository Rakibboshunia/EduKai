import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-[#2D468A] hover:border-blue-200 transition-all shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Candidate Profile
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-60 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between w-full h-full relative z-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2D468A]">
              AI CV Rewriter
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mt-5">
              Enhance CVs with AI context understanding and apply anonymization frameworks.
            </p>
          </div>
          
          <div className="z-10 bg-[#2D468A]/5 text-[#2D468A] px-5 py-4 rounded-xl border border-blue-200 flex items-center gap-4 min-w-[280px]">
            {/* <div className="bg-blue-100/50 p-2.5 rounded-full text-[#2D468A]">
              <FiUser size={20} />
            </div> */}
            <div className="flex flex-col border-l border-[#2D468A]/20 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D468A]/60">Candidate Profile</span>
              <span className="text-base sm:text-lg font-bold truncate max-w-[200px]">{candidate.name || "Unknown Candidate"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/70 rounded-3xl border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col p-6 sm:p-10">
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-gray-100 mb-8">
          <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
             <button
               onClick={handleRewriteWithAI}
               disabled={isRewriting}
               className={`px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto shadow-md ${
                 isRewriting
                   ? "bg-gray-400 text-white cursor-not-allowed shadow-none"
                   : "bg-gradient-to-r from-[#2D468A] to-[#1a3060] text-white hover:scale-[1.02] hover:shadow-lg"
               }`}
             >
               <SiOpenai size={18} className={isRewriting ? "animate-spin" : ""} />
               {isRewriting ? "AI is Processing..." : "Rewrite Profile with AI"}
             </button>
             {isRewriting && (
               <span className="text-sm font-medium text-[#2D468A] animate-pulse">
                 Optimizing resume format and content...
               </span>
             )}
          </div>

        </div>

        {/* CV Preview Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-black">
          
          {/* ORIGINAL CV */}
          <div className="flex flex-col gap-3 group">
             <div className="flex items-center gap-2 px-1">
               <div className="h-2 w-2 rounded-full bg-gray-400"></div>
               <h3 className="text-gray-600 font-bold tracking-tight text-sm uppercase">Original Document</h3>
             </div>
             <div className="flex-1 border-2 border-gray-100 rounded-2xl bg-gray-50 overflow-hidden shadow-sm transition-all group-hover:border-gray-300">
               <CVPreviewCard
                 status="Unprocessed Original Copy"
                 content={
                   originalCV?.type === "pdf" ? (
                     <iframe
                       src={`${originalCV.url}#toolbar=0&navpanes=0`}
                       className="w-full h-full min-h-[700px] border-none"
                     />
                   ) : (
                     <div className="p-8 text-gray-500 font-medium">
                       {originalCV}
                     </div>
                   )
                 }
               />
             </div>
          </div>

          {/* AI ENHANCED CV */}
          <div className="flex flex-col gap-3 group relative">
             <div className="flex items-center gap-2 px-1 justify-between">
               <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-[#2D468A] animate-pulse"></div>
                 <h3 className="text-[#2D468A] font-bold tracking-tight text-sm uppercase">AI Enhanced Version</h3>
               </div>
               
               {/* Edit Output Control */}
               {/* <div className="flex gap-2">
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
                     className="text-xs font-semibold text-[#2D468A] hover:bg-[#2D468A]/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                   >
                     <FiEdit /> Edit Result
                   </button>
                 ) : (
                   <div className="flex gap-2 bg-white shadow-sm border rounded-lg p-1 animate-fade-in z-30">
                     <button
                       onClick={() => setIsEditingPDF(false)}
                       className="text-xs font-bold text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded flex items-center gap-1"
                     >
                       Discard
                     </button>
                     <button
                       onClick={() => {
                         setAiCV({ type: "text", content: tempCV });
                         setIsEditingPDF(false);
                         toast.success("CV Manual Updates Saved");
                       }}
                       className="text-xs font-bold bg-[#2D468A] text-white hover:bg-[#1a3060] px-3 py-1.5 rounded flex items-center gap-1"
                     >
                       <FiSave /> Save Changes
                     </button>
                   </div>
                 )}
               </div> */}
             </div>
             
             <div className="flex-1 border-2 border-blue-100 rounded-2xl bg-white overflow-hidden shadow-md shadow-blue-900/5 transition-all group-hover:shadow-xl group-hover:border-[#2D468A]/30 relative min-h-[700px]">
               {isEditingPDF && (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col">
                    <textarea
                      value={tempCV}
                      onChange={(e) => setTempCV(e.target.value)}
                      className="flex-1 w-full p-6 border-none focus:ring-0 resize-none text-gray-800 font-mono text-sm bg-blue-50/30 font-medium"
                      placeholder="Your AI enhancements will appear here, or you can begin manually editing..."
                    />
                  </div>
               )}
               
               <div className="h-full">
                 <CVPreviewCard
                   status="AI Processed Output"
                   content={
                     aiCV?.type === "pdf" ? (
                       <iframe
                         src={`${aiCV.url}#toolbar=0&navpanes=0`}
                         className="w-full h-full min-h-[700px] border-none"
                       />
                     ) : editMode ? (
                       <div className="p-8 whitespace-pre-wrap">{tempCV}</div>
                     ) : aiCV?.content ? (
                       <div className="p-8 whitespace-pre-wrap">{aiCV.content}</div>
                     ) : (
                       <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-gray-400 gap-4">
                         <SiOpenai size={48} className="opacity-20" />
                         <p className="font-medium text-lg">Waiting for AI Generation</p>
                         <p className="text-sm opacity-60">Click "Rewrite Profile with AI" above to begin</p>
                       </div>
                     )
                   }
                 />
               </div>
             </div>
          </div>
          
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-center  gap-4 pt-8 mt-2 border-t border-gray-100">
           <button
             onClick={handleDownload}
             className="flex-1 sm:flex-none border-2 border-[#2D468A]/10 text-[#2D468A] bg-gray-50 hover:bg-[#2D468A] hover:text-white hover:border-[#2D468A] px-10 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm"
           >
             <FiDownload size={18} /> Download Processed CV
           </button>
           <button
             onClick={() => navigate("/ai/mail-submission", { state: { candidate } })}
             className="flex-1 sm:flex-none bg-gradient-to-r from-[#2D468B] to-[#1a3060] hover:scale-[1.02] hover:shadow-lg text-white px-10 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md"
           >
             <FiSend size={18} /> Proceed to Mail Submission
           </button>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { FiEdit2, FiPaperclip, FiSend, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import EmailSignatureCard from "../components/EmailSignatureCard";
import {
  sendToContacts,
  getSendStatus,
  getCandidateById,
  updateCandidateStatus,
} from "../api/candidateApi";

export default function EmailCompose() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state?.candidate || {};
  const contactIds = location.state?.contactIds || []; // ✅ FIXED

  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");

  useEffect(() => {
    const fetchCandidateEmailData = async () => {
      if (candidate.id) {
        try {
          const data = await getCandidateById(candidate.id);
          
          if (data.email_subject) {
            setSubject(data.email_subject);
            setDraftSubject(data.email_subject);
          }
          if (data.email_body) {
            setBody(data.email_body);
            setDraftBody(data.email_body);
          }
        } catch (error) {
          console.error("Failed to fetch candidate email data:", error);
        }
      }
    };
    
    fetchCandidateEmailData();
  }, [candidate.id]);

  /* ================= EDIT HANDLERS ================= */

  const handleEdit = () => {
    setDraftSubject(subject);
    setDraftBody(body);
    setIsEditing(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!draftSubject.trim() || !draftBody.trim()) {
      toast.error("Subject and body cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      await updateCandidateStatus(candidate.id, {
        email_subject: draftSubject,
        email_body: draftBody,
      });

      toast.success("Email content saved locally");

      setSubject(draftSubject);
      setBody(draftBody);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save email edits:", error);
      toast.error("Failed to save changes to the server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftSubject(subject);
    setDraftBody(body);
    setIsEditing(false);
  };

  /* ================= SEND EMAIL ================= */

  const handleSend = async () => {
    if (!candidate.id) {
      toast.error("Candidate ID missing.");
      return;
    }

    if (contactIds.length === 0) {
      toast.error("No contacts selected.");
      return;
    }

    try {
      setIsSending(true);

      // Filter out the email to only send the 36-character UUID
      const cleanContactIds = contactIds.map(id => id.substring(0, 36));

      const res = await sendToContacts(candidate.id, {
        contact_ids: cleanContactIds,
      });

      console.log("SEND RESPONSE:", res);

      const taskId = res.task_id;

      toast.success("Email sending started 🚀");

      pollStatus(taskId);

    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
      setIsSending(false);
    }
  };

  /* ================= POLLING ================= */

  const pollStatus = (taskId) => {
    // Check the status EXACTLY ONCE after a brief delay
    setTimeout(async () => {
      try {
        const res = await getSendStatus(taskId);
        console.log("STATUS RESPONSE:", res);

        const currentStatus = (res?.status || res?.state || res?.task_status || "").toString().toUpperCase();

        if (currentStatus === "SUCCESS" || currentStatus === "COMPLETED") {
          setIsSending(false);
          toast.success("All emails sent 🎉");
          navigate("/cv/queue");
        } 
        else if (currentStatus === "FAILURE" || currentStatus === "FAILED" || currentStatus === "ERROR") {
          setIsSending(false);
          toast.error("Email sending failed ❌ Check backend logs.");
        }
        else {
          // If it's still pending, don't trap the user. Assume it's safely queued.
          setIsSending(false);
          toast.success("Emails queued for background sending 🚀");
          navigate("/cv/queue");
        }
      } catch (err) {
        setIsSending(false);
        console.error(err);
        toast.success("Task is executing in the background.");
        navigate("/cv/queue");
      }
    }, 2000); // Only checks once after 2 seconds
  };

  /* ================= NO CANDIDATE ================= */

  if (!candidate.id) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          No Candidate Selected
        </h2>

        <p className="text-gray-600 mb-6">
          Please start the process by selecting a candidate from the CV Queue or AI Re-writer.
        </p>

        <button
          onClick={() => navigate("/ai/ai-rewriter")}
          className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-2 border rounded-lg hover:shadow-lg transition-all"
        >
          Go to AI Re-writer
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-8 space-y-10 w-full mb-6 max-w-[1800px] mx-auto">

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-brand-primary hover:border-blue-200 transition-all shadow-sm"
        >
          <ArrowLeft size={14} /> Mail Submission
        </button>
      </div>

      {/* Header Section */}
      <div className="space-y-2 flex flex-col bg-white/70 p-6 sm:p-8 rounded-2xl border border-blue-50 shadow-sm relative overflow-hidden">
        <h2 className="text-2xl sm:text-2xl lg:text-3xl font-semibold text-brand-primary">
          Email Submission
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-5">
          Review, customize, and automatically dispatch Candidate CVs to selected contacts.
        </p>
      </div>

      {/* Main Mail Editor Card */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-xl max-w-8xl overflow-hidden mx-auto">
        
        {/* Card Header */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
              <FiSend size={20} />
            </div>
            <h3 className="text-xl font-bold text-brand-primary">
              Compose Email
            </h3>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              disabled={isSending}
              className="flex w-full sm:w-auto items-center justify-center px-4 py-2 gap-2 text-sm font-medium text-brand-primary bg-white border border-brand-primary rounded-xl hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <FiEdit2 />
              Edit Email
            </button>
          ) : (
            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <FiX />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-700 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSave />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-8 bg-white">
          
          {/* Subject Field */}
          <div>
            <label className="text-sm font-semibold text-brand-primary mb-2 block">
              Subject :
            </label>

            {isEditing ? (
              <input
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                autoFocus
                className="w-full border border-blue-300 rounded-xl px-4 py-3 text-sm bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-shadow"
              />
            ) : (
              <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-800 shadow-inner">
                {subject || "No subject provided"}
              </div>
            )}
          </div>

          {/* Message Body Field */}
          <div>
            <label className="text-sm font-semibold text-brand-primary mb-2 block">
              Message Body :
            </label>
            {isEditing ? (
              <textarea
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                rows={16}
                className="w-full border border-blue-300 rounded-xl p-5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-shadow resize-none leading-relaxed"
              />
            ) : (
              <div className="w-full border border-gray-200 rounded-xl p-5 text-sm text-gray-800 bg-gray-50 shadow-inner whitespace-pre-line leading-relaxed min-h-[300px]">
                {body || "No email body provided"}
              </div>
            )}
          </div>

          {/* Attachment Pill */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-brand-primary">Included Attachment:</span>
            <div className="flex items-center gap-3 text-brand-primary bg-blue-50/50 border border-blue-200 px-4 py-3 rounded-xl w-fit shadow-sm">
              <div className="bg-brand-primary text-white p-2 rounded-lg shadow-sm">
                <FiPaperclip size={18} />
              </div>
              <span className="font-medium tracking-wide">
                {candidate.name ? candidate.name.replace(/\s+/g, '_') + "_CV_Enhanced.pdf" : "CV_Enhanced.pdf"}
              </span>
            </div>
          </div>

          {/* Send Button Area */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={handleSend}
              disabled={isSending || isEditing}
              className={`w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 ${
                isSending || isEditing 
                  ? "bg-gray-400 cursor-not-allowed transform-none" 
                  : "bg-gradient-to-r from-brand-primary to-brand-accent hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <FiSend size={22} className={isSending ? "animate-pulse" : ""} />
              {isSending
                ? "Dispatching Emails in Background..."
                : `Send Email to ${contactIds.length} Contact(s)`}
            </button>
            {isEditing && (
              <p className="text-center text-red-500 text-sm mt-3 font-medium">
                Please save your edits before sending.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
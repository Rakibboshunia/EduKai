import { useState, useEffect } from "react";
import { FiEdit2, FiPaperclip, FiSend, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
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
          className="bg-[#2D468A] text-white px-6 py-2 border rounded-lg hover:bg-[#243a73]"
        >
          Go to AI Re-writer
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-4 space-y-16">

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2D468A]">
          Email Submission
        </h2>

        <p className="text-sm text-gray-600 mt-4">
          Generate and send candidate specification emails automatically
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 p-8 max-w-7xl">

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#2D468A]">
            Email Composition
          </h3>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              disabled={isSending}
              className="flex items-center p-2 gap-1 text-sm text-white rounded-lg border bg-[#2D468A] hover:bg-[#243a73]"
            >
              <FiEdit2 />
              Edit Email
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#354b88] text-green-400 px-2 py-1 rounded flex items-center gap-1 hover:bg-green-600 hover:text-white disabled:opacity-50"
              >
                <FiSave />
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                className="bg-[#354b88] text-red-400 px-2 py-1 rounded hover:bg-red-600 hover:text-white flex items-center gap-1"
              >
                <FiX />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="max-w-[820px] mx-auto pt-12 space-y-8">

          <div>
            <label className="text-xs font-medium text-black">
              Subject :
            </label>

            {isEditing ? (
              <input
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white text-black"
              />
            ) : (
              <input
                readOnly
                value={subject}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-black"
              />
            )}
          </div>

          {isEditing ? (
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={16}
              className="w-full border border-gray-400 rounded-lg p-4 text-sm text-black"
            />
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 text-sm text-black whitespace-pre-line bg-gray-50">
              {body}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-[#2D468A] bg-blue-50 border border-blue-200 px-3 py-2 rounded-md w-fit">
            <FiPaperclip />
            Attached: {candidate.name ? candidate.name.replace(/\s+/g, '_') + "_CV_Enhanced.pdf" : "CV_Enhanced.pdf"}
          </div>

          {/* <EmailSignatureCard
            name="Samuel Crona"
            title="Investor Communications Designer"
            email="samuel@walmart.com"
            website="www.walmart.com"
            phone="+1 234 568 8897"
            company="Walmart"
            avatar="/logo.png"
          /> */}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`flex-1 text-white py-3 rounded-lg flex items-center justify-center gap-2 ${
                isSending ? "bg-gray-400" : "bg-[#2D468A] hover:bg-[#243a73]"
              }`}
            >
              <FiSend />
              {isSending
                ? "Sending..."
                : `Send Via Mail to ${contactIds.length} Contact(s)`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { FiEdit2, FiPaperclip, FiSend, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import EmailSignatureCard from "../components/EmailSignatureCard";
import {
  sendToContacts,
  getSendStatus,
} from "../api/candidateApi";

export default function EmailCompose() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state?.candidate || {};
  const contactIds = location.state?.contactIds || []; // ✅ FIXED

  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const defaultSubject = `Candidate Submission - ${
    candidate.name || "John Smith"
  } for ${
    candidate.job_title || "Senior Software Developer"
  }`;

  const [subject, setSubject] = useState(defaultSubject);

  const defaultBody = `Dear Hiring Manager,

I am pleased to present ${
    candidate.name || "John Smith"
  }, an exceptional candidate for your consideration.

CANDIDATE OVERVIEW:
${
    candidate.name || "John Smith"
  } is a highly skilled ${
    candidate.job_title || "Professional"
  } with progressive experience in their field. They bring a strong track record of delivering positive outcomes.

KEY QUALIFICATIONS:
• 5+ years of relevant experience
• Strong track record of improving performance
• Adaptive and collaborative

This candidate has undergone our comprehensive quality screening process and has confirmed their immediate availability. Their CV is attached for your review.

Kind regards,`;

  const [body, setBody] = useState(defaultBody);

  const [draftSubject, setDraftSubject] = useState(subject);
  const [draftBody, setDraftBody] = useState(body);

  /* ================= EDIT HANDLERS ================= */

  const handleEdit = () => {
    setDraftSubject(subject);
    setDraftBody(body);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!draftSubject.trim() || !draftBody.trim()) {
      toast.error("Subject and body cannot be empty");
      return;
    }

    setSubject(draftSubject);
    setBody(draftBody);
    setIsEditing(false);
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

      const res = await sendToContacts(candidate.id, {
        contact_ids: contactIds,
        subject,
        body,
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
    const interval = setInterval(async () => {
      try {
        const res = await getSendStatus(taskId);

        console.log("STATUS:", res);

        if (res.status === "SUCCESS") {
          clearInterval(interval);
          setIsSending(false);
          toast.success("All emails sent 🎉");

          navigate("/ai/mail-submission");
        }

        if (res.status === "FAILURE") {
          clearInterval(interval);
          setIsSending(false);
          toast.error("Email sending failed ❌");
        }

      } catch (err) {
        clearInterval(interval);
        setIsSending(false);
        console.error(err);
      }
    }, 2000);
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
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission
        </h2>

        <p className="text-sm text-gray-600">
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
                className="bg-[#354b88] text-green-400 px-2 py-1 rounded flex items-center gap-1 hover:bg-green-600 hover:text-white"
              >
                <FiSave />
                Save
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
            Attached: {(candidate.name ? candidate.name.replace(/\s+/g, '_') : "John_Smith")}_CV_Enhanced.pdf
          </div>

          <EmailSignatureCard
            name="Samuel Crona"
            title="Investor Communications Designer"
            email="samuel@walmart.com"
            website="www.walmart.com"
            phone="+1 234 568 8897"
            company="Walmart"
            avatar="/logo.png"
          />

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
                : `Send Via Outlook to ${contactIds.length} Contact(s)`}
            </button>

            <button className="px-6 py-3 text-black border border-gray-300 rounded-lg text-sm hover:bg-gray-200">
              Save as Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
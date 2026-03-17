import { useState } from "react";
import { FiEdit2, FiPaperclip, FiSend, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EmailSignatureCard from "../components/EmailSignatureCard";

export default function EmailCompose() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [subject, setSubject] = useState(
    "Candidate Submission - John Smith for Senior Software Developer"
  );

  const [body, setBody] = useState(`Dear Hiring Manager,

I am pleased to present John Smith, an exceptional candidate for your consideration.

CANDIDATE OVERVIEW:
John Smith is a highly skilled Senior Software Developer with 8+ years of progressive experience in enterprise application development. They bring a strong track record of delivering scalable solutions and technical leadership.

KEY QUALIFICATIONS:
• 5+ years of software development experience
• Expert in JavaScript, React, Node.js, Python, and AWS
• Proven leadership in managing development teams
• Strong track record of improving application performance
• Experience with microservices architecture and cloud technologies

ACHIEVEMENTS:
• Led development of microservices architecture
• Improved application performance by 40%
• Successfully mentored junior developers

This candidate has undergone our comprehensive quality screening process and has confirmed their immediate availability. Their CV is attached for your review.

Kind regards,`);

  const [draftSubject, setDraftSubject] = useState(subject);
  const [draftBody, setDraftBody] = useState(body);

  /* ================= HANDLERS ================= */

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

  const handleSend = async () => {
    try {
      // future API call here
      toast.success("Email sent successfully");
    } catch {
      toast.error("Failed to send email");
    }
  };

  return (
    <div className="p-4 space-y-16">

      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission & Outlook Integration
        </h2>

        <p className="text-sm text-gray-600">
          Generate and send candidate specification emails automatically
        </p>

        <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-md w-fit">
          ✓ Outlook Account Connected
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 p-8 max-w-7xl">

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#2D468A]">
            Email Composition
          </h3>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center p-2 gap-1 text-sm text-white rounded-lg border bg-[#2D468A] hover:bg-[#243a73] transition cursor-pointer"
            >
              <FiEdit2 />
              Edit Email
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-[#354b88] text-green-400 px-2 py-1 text-md rounded flex items-center gap-1 cursor-pointer hover:bg-green-600 hover:text-white transition"
              >
                <FiSave />
                Save
              </button>

              <button
                onClick={handleCancel}
                className="bg-[#354b88] text-red-400 px-2 py-1 text-md rounded cursor-pointer hover:bg-red-600 hover:text-white transition flex items-center gap-1"
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
                className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white text-black focus:ring-2 focus:ring-[#2D468A]"
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
              className="w-full border border-gray-400 rounded-lg p-4 text-sm text-black focus:ring-2 focus:ring-[#2D468A]"
            />
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 text-sm text-black leading-relaxed whitespace-pre-line bg-gray-50">
              {body}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-[#2D468A] bg-blue-50 border border-blue-200 px-3 py-2 rounded-md w-fit">
            <FiPaperclip />
            Attached: John_Smith_CV_Enhanced.pdf
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
              className="flex-1 bg-[#2D468A] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#243a73] cursor-pointer"
            >
              <FiSend />
              Send Via Outlook to 1 Organization
            </button>

            <button className="px-6 py-3 text-black border border-gray-300 rounded-lg text-sm hover:bg-gray-200 transition-all cursor-pointer">
              Save as Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
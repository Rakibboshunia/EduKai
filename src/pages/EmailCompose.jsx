import { FiEdit2, FiPaperclip, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmailCompose() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-16">
      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-[#2D468A]">
          Email Submission & Outlook Integration
        </h2>

        <p className="text-sm text-gray-600">
          Generate and send candidate specification emails automatically
        </p>

        <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-md w-fit">
          ✓ Outlook Account Connected — recruiter@company.com
        </div>
      </div>

      {/* ================= EMAIL COMPOSITION CARD ================= */}
      <div className="bg-white rounded-xl border border-gray-300 p-8 max-w-7xl items-center">

        {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#2D468A]">
              Email Composition
            </h3>

            <button className="flex items-center gap-1 text-sm text-[#2D468A] hover:underline cursor-pointer">
              <FiEdit2 />
              Edit Email
            </button>
          </div>

        {/* 🔹 CENTER WRAPPER */}
        <div className="max-w-[820px] mx-auto pt-12 space-y-8">

          {/* Subject */}
          <div>
            <label className="text-xs text-black font-medium">
              Subject :
            </label>
            <input
              readOnly
              value="Candidate Submission - John Smith for Senior Software Developer"
              className="text-black w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
            />
          </div>

          {/* Email Body */}
          <div className="border border-gray-300 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50">
            Dear Hiring Manager,

            {"\n\n"}
            I am pleased to present John Smith, an exceptional candidate for your
            consideration.

            {"\n\n"}
            CANDIDATE OVERVIEW:
            {"\n"}
            John Smith is a highly skilled Senior Software Developer with 8+ years
            of professional experience in enterprise application development.

            {"\n\n"}
            KEY QUALIFICATIONS:
            {"\n"}
            • 8+ years of software development experience
            {"\n"}
            • Expert in JavaScript, React, Node.js, Python, and AWS
            {"\n"}
            • Proven leadership in managing development teams
            {"\n"}
            • Strong track record of improving application performance

            {"\n\n"}
            ACHIEVEMENTS:
            {"\n"}
            • Led development of microservices architecture
            {"\n"}
            • Improved application performance by 40%
            {"\n"}
            • Successfully mentored junior developers

            {"\n\n"}
            This candidate has undergone our comprehensive quality screening
            process and has confirmed their immediate availability.

            {"\n\n"}
            Kind regards,
          </div>

          {/* Attachment */}
          <div className="flex items-center gap-2 text-sm text-[#2D468A] bg-blue-50 border border-blue-200 px-3 py-2 rounded-md w-fit">
            <FiPaperclip />
            Attached: John_Smith_CV_Enhanced.pdf
          </div>

          {/* Sender Info */}
          <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4">
            <img
              src="/logo.png"
              alt="sender"
              className="w-12 h-12 rounded-full"
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-[#0A0A0A]">
                Samuel Crona
              </p>
              <p className="text-xs text-gray-500">
                Senior Communications Designer
              </p>
              <p className="text-xs text-gray-500">
                samuel@walmart.com
              </p>
              <p className="text-xs text-gray-500">
                +1 234 568 8897
              </p>
            </div>

            <span className="text-blue-600 text-sm font-medium">
              Walmart ✨
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button className="flex-1 bg-[#2D468A] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#243a73] cursor-pointer">
              <FiSend />
              Send Via Outlook to 1 Organization
            </button>

            <button className="px-6 py-3 text-black cursor-pointer border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
              Save as Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

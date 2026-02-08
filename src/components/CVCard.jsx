import StatusBadge from "./StatusBadge";
import { Mail, Phone, Briefcase } from "lucide-react";

export default function CVCard({ data, onView }) {
  const {
    name,
    email,
    phone,
    experience,
    skills = [],
    status,
    reviewType,
    availability,
    awaitingResponse,
    issues,
    createdAt,
  } = data;

  const isManual = reviewType === "manual";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start pb-2">
        <div className="space-y-2">
          <h3 className="text-blue-600 font-semibold">{name}</h3>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={16} /> {email}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={16} /> {phone}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Briefcase size={16} /> Experience: {experience} years
          </div>
        </div>

        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>

      {/* Skills */}
      <div className="mt-4">
        <p className="text-sm text-black mb-2">skills</p>
        <div className="flex gap-2 flex-wrap">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-[#E8EDFB] rounded-full text-sm text-black"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ✅ Status row (FIXED) */}
      <div className="mt-4 flex gap-3 flex-wrap items-center">
        {/* Quality status */}
        <StatusBadge
          status={
            status === "failed" && isManual
              ? "manual_review"
              : status
          }
          variant="quality"
        />

        {/* Awaiting Response (only for failed/manual) */}
        {awaitingResponse && (
          <StatusBadge
            status="awaiting_response"
            variant="quality"
          />
        )}

        {/* Available (only for passed) */}
        {availability === "available" && (
          <StatusBadge
            status="available"
            variant="availability"
          />
        )}
      </div>

      {/* Issues */}
      {issues?.length > 0 && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm ${
            isManual
              ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <p className="font-medium mb-2">Quality Issues:</p>
          <ul className="list-disc list-inside space-y-1">
            {issues.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onView(data)}
          className="px-6 py-2 border rounded-xl text-sm text-gray-600 cursor-pointer transition shadow-sm hover:bg-[#2D468A] hover:text-white"
        >
          View CV
        </button>
      </div>
    </div>
  );
}

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
    createdAt,
  } = data;

  const isManual = reviewType === "manual";

  return (
    <div className="bg-white/60 rounded-2xl p-6 border border-gray-300">
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
        <p className="text-sm text-black mb-2">Skills</p>
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

      {/* Status */}
      <div className="mt-4 flex gap-3 flex-wrap items-center">
        <StatusBadge
          status={
            status === "failed" && isManual
              ? "manual_review"
              : status
          }
          variant="quality"
        />

        {availability === "available" && (
          <StatusBadge status="available" variant="availability" />
        )}
      </div>

      {/* Action */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onView(data)}
          className="px-6 py-2 border rounded-xl text-sm text-gray-600 transition hover:bg-[#2D468A] hover:text-white cursor-pointer"
        >
          View CV
        </button>
      </div>
    </div>
  );
}

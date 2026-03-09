import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------- Small Badge ---------- */
const SkillBadge = ({ label }) => (
  <span className="bg-[#EEF2FF] text-[#2D468A] text-xs px-3 py-1 rounded-full whitespace-nowrap">
    {label}
  </span>
);

/* ---------- Info Row ---------- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-3">
    <span className="text-gray-500 whitespace-nowrap">{label} :</span>
    <span className="font-medium text-gray-900 text-right break-words">
      {value}
    </span>
  </div>
);

/* ---------- Organization Card ---------- */
const OrganizationCard = ({
  id,
  name,
  email,
  contactPerson,
  industry,
  phase,
  jobTitle,
  location,
  radius,
  skills = [],

  onEdit,
  onDelete,

  selectable = false,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={selectable ? onSelect : undefined}
      className={`bg-white/70 backdrop-blur rounded-2xl shadow-md border p-4 sm:p-6 transition
      ${selectable ? "cursor-pointer" : "cursor-default"}
      ${
        selected
          ? "border-[#2D468A] bg-blue-50"
          : "border-gray-100 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#EEF2FF] shrink-0">
            <HiOutlineOfficeBuilding className="text-[#2D468A]" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {email}
            </p>
          </div>
        </div>

        {/* Right Side */}
        {selectable ? (
          <input type="checkbox" checked={selected} readOnly />
        ) : (
          <div className="flex items-center gap-3 shrink-0">

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(id);
              }}
              className="text-[#2D468A] hover:bg-blue-100 p-2 rounded-lg transition cursor-pointer"
            >
              <FiEdit2 size={18} />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(id);
              }}
              className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition cursor-pointer"
            >
              <FiTrash2 size={18} />
            </button>

          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">

        {contactPerson && (
          <InfoRow label="Contact Person" value={contactPerson} />
        )}

        {industry && (
          <InfoRow label="Industry" value={industry} />
        )}

        {phase && (
          <InfoRow label="Phase" value={phase} />
        )}

        {jobTitle && (
          <InfoRow label="Job Title" value={jobTitle} />
        )}

        {location && (
          <InfoRow label="Location" value={location} />
        )}

        {radius && (
          <InfoRow label="Radius" value={radius} />
        )}

      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Skill Requirements
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <SkillBadge key={i} label={skill} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
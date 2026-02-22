import { HiOutlineOfficeBuilding } from "react-icons/hi";

/* ---------- Small Badge ---------- */
const SkillBadge = ({ label }) => (
  <span className="bg-[#EEF2FF] text-[#2D468A] text-xs px-3 py-1 rounded-full">
    {label}
  </span>
);

/* ---------- Info Row ---------- */
const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-2">
    <span className="text-gray-500">{label}:</span>
    <span className="font-medium text-gray-900 text-right">
      {value}
    </span>
  </div>
);

/* ---------- Organization Card ---------- */
const OrganizationCard = ({
  id,
  name,
  email,
  industry,
  totalSubmissions,
  location,
  skills = [],
  actionsSlot,

  /* NEW props (optional) */
  selectable = false,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={selectable ? onSelect : undefined}
      className={`bg-white/60 cursor-pointer rounded-2xl shadow-md border p-6 transition
        ${
          selectable
            ? "cursor-pointer"
            : "cursor-default"
        }
        ${
          selected
            ? "border-[#2D468A] bg-blue-50"
            : "border-gray-100 hover:border-gray-300"
        }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#EEF2FF]">
            <HiOutlineOfficeBuilding className="text-[#2D468A]" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {name}
            </h3>
            <p className="text-xs text-gray-500">
              {email}
            </p>
          </div>
        </div>

        {/* Right Side */}
        {selectable ? (
          <input
            type="checkbox"
            checked={selected}
            readOnly
          />
        ) : (
          actionsSlot && (
            <div className="flex items-center gap-3">
              {actionsSlot}
            </div>
          )
        )}
      </div>

      {/* Info Section (unchanged) */}
      <div className="mt-4 text-sm space-y-2">
        {industry && (
          <InfoRow label="Industry" value={industry} />
        )}

        {totalSubmissions !== undefined && (
          <InfoRow
            label="Total Submissions"
            value={totalSubmissions}
          />
        )}

        {location && (
          <InfoRow label="Location" value={location} />
        )}
      </div>

      {/* Skills / Tags */}
      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <SkillBadge key={i} label={skill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;

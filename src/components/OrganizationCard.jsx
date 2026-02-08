import { HiOutlineOfficeBuilding } from "react-icons/hi";
import EditAction from "./EditAction";
import DeleteAction from "./DeleteAction";

const SkillBadge = ({ label }) => (
  <span className="bg-[#EEF2FF] text-[#2D468A] text-xs px-3 py-1 rounded-full">
    {label}
  </span>
);

const OrganizationCard = ({
  id,
  name,
  email,
  industry,
  totalSubmissions,
  location,
  skills,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#EEF2FF]">
            <HiOutlineOfficeBuilding className="text-[#2D468A]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <EditAction
            organization={{
              id,
              name,
              email,
              industry,
              location,
              skills,
              totalSubmissions,
            }}
            onUpdate={onUpdate}
          />

          <DeleteAction organizationName={name} onDelete={() => onDelete(id)} />
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-500">Industry:</span>
          <span className="font-medium text-gray-900 text-right">
            {industry}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-500">Total Submissions:</span>
          <span className="font-medium text-gray-900 text-right">
            {totalSubmissions}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-500">Location:</span>
          <span className="font-medium text-gray-900 text-right">
            {location}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <SkillBadge key={i} label={skill} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationCard;

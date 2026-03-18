import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const InfoRow = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  )
    return null;

  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 whitespace-nowrap">{label} :</span>
      <span className="font-medium text-gray-900 text-right break-words">
        {value}
      </span>
    </div>
  );
};

const labelMap = {
  contact_person: "Contact Person",
  job_title: "Job Title",
  work_email: "Work Email",
};

const ContactCard = ({
  data = {},
  onEdit,
  onDelete,
}) => {

  const title = data.contact_person;
  const subtitle = data.work_email;

  const fieldsToShow = [
    "job_title",
  ];

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md border p-4 sm:p-6 hover:border-gray-300 transition">

      <div className="flex justify-between gap-4">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#EEF2FF]">
            <HiOutlineOfficeBuilding className="text-[#2D468A]" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {title || "N/A"}
            </h3>

            {subtitle && (
              <p className="text-xs text-gray-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit && onEdit(data.id)}
            className="text-[#2D468A] hover:bg-blue-100 p-2 rounded-lg"
          >
            <FiEdit2 size={18} />
          </button>

          <button
            onClick={() => onDelete && onDelete(data.id)}
            className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">

        <InfoRow
          label={labelMap.job_title}
          value={data.job_title}
        />

      </div>
    </div>
  );
};

export default ContactCard;
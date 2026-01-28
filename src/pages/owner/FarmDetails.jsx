import { FaHdd, FaCalendarAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { HiOfficeBuilding } from "react-icons/hi";
import { MdDelete, MdRestartAlt } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import farms from "../../data/farms.json";

const StatCard = ({ icon, title, value, sub }) => (
  <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] flex gap-4 col-span-12 md:col-span-4">
    <div className="text-indigo-600 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-[#4A5565]">{title}</p>
      <p className="text-3xl text-[#0A0A0A] my-2">{value}</p>
      <p className="text-xs text-[#6A7282]">{sub}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-[#0A0A0A]">{value}</span>
  </div>
);

const RecentActivity = ({ activities = [] }) => (
  <ul className="space-y-4 text-sm text-gray-600">
    {activities.map((activity) => (
      <li key={activity.id} className="flex flex-col">
        • {activity.activityTitle}
        <span className="text-gray-400">
          {activity.time} · {activity.by}
        </span>
      </li>
    ))}
  </ul>
);

const FarmDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const farm = farms.find((f) => f.id === Number(id));

  if (!farm) {
    return <p className="text-red-500">Farm not found</p>;
  }

  const statusStyles = {
    Active: "bg-green-100 text-green-600",
    Trial: "bg-yellow-100 text-yellow-600",
    Suspended: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaArrowLeft className="text-[#4A5565]" />
        <p className="text-[#4A5565]">Back to Farms</p>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB] md:flex items-center md:justify-between gap-5  ">

      <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
            <HiOfficeBuilding size={22} />
          </div>

          <div>
            <h2 className="text-3xl text-[#0A0A0A]">{farm.name}</h2>
            <p className="text-sm text-[#4A5565] mt-1">{farm.email}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium
                ${statusStyles[farm.status] || "bg-gray-100 text-gray-600"}`}
            >
              {farm.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0 justify-center">
          <button className="md:px-4 px-2 py-2 rounded-md border border-[#D08700] text-[#D08700] hover:bg-orange-50">
            Suspend Farm
          </button>
          <button className="md:px-4 px-2 py-2 rounded-md border border-[#D1D5DC] text-[#0A0A0A] hover:bg-gray-50 flex items-center gap-2">
            <MdRestartAlt /> Reset Access
          </button>
          <button className="md:px-4 px-2 py-2 rounded-md border border-[#E7000B] text-[#E7000B] hover:bg-red-50 flex items-center gap-2">
            <MdDelete /> Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-6">
        <StatCard
          icon={<FiUsers />}
          title="Total Users"
          value={farm.users}
          sub={`of ${farm.userLimit} limit`}
        />
        <StatCard
          icon={<HiOfficeBuilding />}
          title="Plan"
          value={farm.plan}
          sub={farm.price}
        />
        {/* <StatCard
          icon={<FaHdd />}
          title="Storage"
          value={farm.storage}
          sub={`of ${farm.storageLimit}`}
        /> */}
        <StatCard
          icon={<FaCalendarAlt />}
          title="Created"
          value={farm.createdAt}
          sub={`Last active: ${farm.lastActive}`}
        />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <h3 className="text-xl mb-4 text-[#0A0A0A]">Farm Information</h3>
          <InfoRow label="Farm ID" value={farm.id} />
          <InfoRow label="Country" value={farm.country} />
          <InfoRow label="Language" value={farm.language} />
          <InfoRow label="Admin Email" value={farm.adminEmail} />
          <InfoRow label="Employee Limit" value={farm.userLimit} />
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
          <h3 className="text-xl text-[#0A0A0A] mb-4">Recent Activity</h3>
          <RecentActivity activities={farm.activities} />
        </div>
      </div>
    </div>
  );
};

export default FarmDetails;

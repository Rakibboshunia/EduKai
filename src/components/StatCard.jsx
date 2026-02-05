export default function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${bgColor}`}
      >
        {icon}
      </div>
    </div>
  );
}

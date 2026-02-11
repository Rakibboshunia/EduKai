const StatCard = ({ title, value, icon: Icon, iconBg }) => {
  return (
    <div className="flex items-center justify-between bg-white/60 rounded-lg shadow-md border border-gray-100 p-10 w-full">
      <div>
        <p className="text-xl text-gray-600 mb-4">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>

      <div
        className={`w-12 h-12 flex items-center justify-center rounded-md ${iconBg}`}
      >
        <Icon className="text-white text-3xl" />
      </div>
    </div>
  );
};

export default StatCard;

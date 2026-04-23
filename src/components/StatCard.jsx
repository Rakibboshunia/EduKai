const StatCard = ({ title, value, icon: Icon, iconBg }) => {
  return (
    <div className="group flex items-center justify-between bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#2D468A]/20 p-6 sm:p-8 w-full transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D468A] to-[#4B6EC5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">{title}</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 group-hover:text-[#2D468A] transition-colors">{value}</h2>
      </div>

      <div
        className={`w-14 h-14 flex items-center justify-center rounded-xl shadow-inner ${iconBg || 'bg-gradient-to-br from-blue-500 to-indigo-600'} group-hover:scale-110 transition-transform duration-300`}
      >
        {Icon && <Icon className="text-white text-3xl" />}
      </div>
    </div>
  );
};

export default StatCard;

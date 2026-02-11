export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-xl text-sm border transition cursor-pointer
            ${
              active === tab.key
                ? "bg-[#2D468A] text-white border-[#2D468A]"
                : "bg-white/70 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}

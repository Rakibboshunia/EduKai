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
                 ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent"
                 : "bg-white/70 text-gray-600 hover:bg-gray-200"
             }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}

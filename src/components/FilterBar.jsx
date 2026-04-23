export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {filters.map((f) => (
        <div key={f.name} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">
            {f.label}
          </label>

          <select
            value={values[f.name] || ""}
            onChange={(e) => onChange(f.name, e.target.value)}
            className="w-full border border-gray-200 bg-white text-gray-700 rounded-xl px-3 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[#2D468A] focus:ring-4 focus:ring-[#2D468A]/10 hover:border-gray-300 shadow-sm transition-all appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px top 50%",
              backgroundSize: "10px auto",
              paddingRight: "30px",
            }}
          >
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

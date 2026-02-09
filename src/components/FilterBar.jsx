export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="text-[#2D468A] grid grid-cols-2 md:grid-cols-6 gap-4">
      {filters.map((f) => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#2D468A]">
            {f.label}
          </label>

          <select
            value={values[f.name] || ""}
            onChange={(e) => onChange(f.name, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer"
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

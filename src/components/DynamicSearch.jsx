import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const DynamicSearch = ({
  data = [],
  searchKeys = [],
  onFilter,
  placeholder = "Search...",
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      onFilter(data);
      return;
    }

    const q = value.toLowerCase();

    const filtered = data.filter((item) =>
      searchKeys.some((key) => {
        const field = item[key];

        // 🔹 Handle array fields (e.g. skills)
        if (Array.isArray(field)) {
          return field.join(" ").toLowerCase().includes(q);
        }

        // 🔹 Handle string / number
        if (field !== undefined && field !== null) {
          return field.toString().toLowerCase().includes(q);
        }

        return false;
      })
    );

    onFilter(filtered);
  };

  const clearSearch = () => {
    setQuery("");
    onFilter(data);
  };

  return (
    <div className="relative w-full md:w-96">
      {/* Search Icon */}
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white/60 text-black border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A] transition"
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default DynamicSearch;

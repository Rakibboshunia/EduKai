import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const DynamicSearch = ({
  data = [],
  searchKeys = [],
  onFilter,
  placeholder = "Search...",
}) => {

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {

    if (!debouncedQuery.trim()) {
      onFilter(data);
      return;
    }

    const q = debouncedQuery.trim().toLowerCase();

    const filtered = data.filter((item) =>
      searchKeys.some((key) => {
        const field = item[key];

        if (Array.isArray(field)) {
          return field.join(" ").toLowerCase().includes(q);
        }

        if (field !== undefined && field !== null) {
          return String(field).toLowerCase().includes(q);
        }

        return false;
      })
    );

    onFilter(filtered);

  }, [debouncedQuery, data]);

  const clearSearch = () => {
    setQuery("");
    onFilter(data);
  };

  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white/60 text-black border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
      />

      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default DynamicSearch;
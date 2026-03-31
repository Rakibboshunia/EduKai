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

  // ✅ nested safe getter
  const getValue = (obj, key) => {
    try {
      if (key.includes(".")) {
        return key.split(".").reduce((o, k) => o?.[k], obj);
      }
      return obj?.[key];
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      onFilter(data);
      return;
    }

    const q = debouncedQuery.toLowerCase();

    const filtered = data.filter((item) => {
      if (!item) return false;

      return searchKeys.some((key) => {
        const field = getValue(item, key);

        if (!field) return false;

        return String(field).toLowerCase().includes(q);
      });
    });

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
        className="w-full text-black pl-10 pr-10 py-3 bg-white/60 border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
      />

      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default DynamicSearch;

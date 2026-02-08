import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const DynamicSearch = ({ data, searchKeys, onFilter }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      onFilter(data);
      return;
    }

    const filtered = data.filter((item) =>
      searchKeys.some((key) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );

    onFilter(filtered);
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
        onChange={handleSearch}
        placeholder="Search..."
        className="w-full md:w-130 pl-10 pr-4 py-2 bg-white/70 text-black border border-[#2D468A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D468A] transition"
      />
    </div>
  );
};

export default DynamicSearch;

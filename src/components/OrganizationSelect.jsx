"use client";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { getOrganizations } from "../api/organizationApi";

const OrganizationSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  // 🔥 Fetch organizations
  const fetchOrganizations = async (searchText = "", pageNum = 1) => {
    try {
      setLoading(true);

      const res = await getOrganizations(
        `/api/organizations/?search=${searchText}&page=${pageNum}&page_size=100`
      );

      const newOptions = (res.results || []).map((org) => ({
        value: org.id,
        label: org.local_authority ? `${org.name} - ${org.local_authority}` : org.name,
      }));

      setOptions((prev) =>
        pageNum === 1 ? newOptions : [...prev, ...newOptions]
      );

      setHasMore(!!res.pagination?.next);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchOrganizations("", 1);
  }, []);

  // 🔥 debounce search
  const handleInputChange = (inputValue) => {
    setSearch(inputValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchOrganizations(inputValue, 1);
    }, 400);
  };

  // 🔥 infinite scroll
  const handleMenuScrollToBottom = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrganizations(search, nextPage);
    }
  };

  // 🔥 highlight search text
  const formatOptionLabel = ({ label }) => {
    if (!search) return label;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = label.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} className="text-blue-600 font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // 🔥 group by first letter
  const groupedOptions = Object.values(
    options.reduce((acc, option) => {
      const letter = option.label.charAt(0).toUpperCase();

      if (!acc[letter]) {
        acc[letter] = {
          label: letter,
          options: [],
        };
      }

      acc[letter].options.push(option);
      return acc;
    }, {})
  );

  return (
    <Select
      options={groupedOptions}
      value={
        value
          ? groupedOptions
              .flatMap((g) => g.options)
              .find((opt) => opt.value === value) || null
          : null
      }
      onInputChange={handleInputChange}
      onChange={onChange}
      isLoading={loading}
      className="text-black"
      onMenuScrollToBottom={handleMenuScrollToBottom}
      formatOptionLabel={formatOptionLabel}
      placeholder="Search organization..."
      isClearable
    />
  );
};

export default OrganizationSelect;
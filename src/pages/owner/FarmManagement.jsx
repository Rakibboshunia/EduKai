import React, { useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import FarmCard from "../../components/FarmCard";
import farmsData from "../../data/farms.json";
import { Link } from "react-router-dom";

const FarmManagement = () => {
  const [farms, setFarms] = useState(farmsData);
  const [search, setSearch] = useState("");

  const handleStatusChange = (id) => {
    setFarms((prev) =>
      prev.map((farm) =>
        farm.id === id
          ? {
              ...farm,
              status: farm.status === "Active" ? "Suspended" : "Active",
            }
          : farm
      )
    );
  };

  const filteredFarms = farms.filter((farm) => {
    const query = search.toLowerCase();
    return (
      farm.name.toLowerCase().includes(query) ||
      farm.email.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb />
         <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage all farms across the platform
          </p>
        </div>
        <Link to="/owner/farm/management/create/farm">
          <button className="bg-[#F6A62D] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer">
            <FaPlus />
            Create New Farm
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mt-6 bg-white p-6 rounded-lg border-2 border-[#E5E7EB]">
        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-10 text-[#99A1AF]" />
        <input
          type="text"
          placeholder="Search farms by name or admin email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
        />
      </div>

      {/* Farm Cards */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {filteredFarms.map((farm) => (
          <FarmCard
            key={farm.id}
            farm={farm}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FarmManagement;

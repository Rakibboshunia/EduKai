import { useEffect, useState } from "react";
import { MailCheck, XCircle } from "lucide-react";

import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import DynamicSearch from "../components/DynamicSearch";

import {
  getCandidates,
  updateCandidateStatus,
} from "../api/candidateApi";

export default function Availability() {

  const availabilityOptions = {
    available: {
      label: "available",
      icon: MailCheck,
      className: "bg-green-100 text-green-700",
    },
    not_available: {
      label: "not_available",
      icon: XCircle,
      className: "bg-red-100 text-red-600",
    },
  };

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch candidates
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {

      const res = await getCandidates();

      const formattedData = res.map((item) => ({
        id: item.id,
        date: new Date(item.created_at).toLocaleDateString(),
        name: item.name,
        email: item.email,
        jobTitle: "N/A",
        whatsapp: item.whatsapp_number,
        source: item.source,
        status: item.availability_status,
      }));

      setData(formattedData);
      setFilteredData(formattedData);

    } catch (error) {
      console.error("Candidate fetch error:", error);
    }
  };

  // Update status
  const handleStatusChange = async (id, newStatus) => {

  try {

    await updateCandidateStatus(id, {
      availability_status: newStatus,
    });

    const updated = data.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setData(updated);
    setFilteredData(updated);

  } catch (error) {
    console.error("Status update error:", error);
  }

};

  const columns = [
    { header: "Date & Time", accessor: "date" },
    { header: "Candidate Name", accessor: "name" },
    { header: "Email Address", accessor: "email" },
    { header: "Job Title", accessor: "jobTitle" },
    { header: "WhatsApp", accessor: "whatsapp" },
    { header: "Data Source", accessor: "source" },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (value, row) => (
        <StatusBadge
          value={value}
          options={availabilityOptions}
          onChange={(newStatus) =>
            handleStatusChange(row.id, newStatus)
          }
        />
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2D468A]">
          Availability Check
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Track candidate availability via Email, SMS, and WhatsApp.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <DynamicSearch
          data={data}
          searchKeys={["name", "email", "whatsapp", "source"]}
          onFilter={setFilteredData}
        />
      </div>

      {/* Table Container */}
      <div className="w-full rounded-xl">

        {/* Horizontal scroll */}
        <div className="overflow-x-auto">

          {/* Vertical scroll */}
          <div className="max-h-[80vh] overflow-y-auto overflow-x-auto">

            <Table columns={columns} data={filteredData} />

          </div>

        </div>

      </div>

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { MailCheck, XCircle } from "lucide-react";

import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import DynamicSearch from "../components/DynamicSearch";
import Pagination from "../components/Pagination";

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


  const initialData = useMemo(
    () => [
      {
        id: 1,
        date: "20 Nov, 2025",
        name: "John Doe",
        email: "john.doe@abc.com",
        whatsapp: "+1 555 101 0199",
        source: "CRM",
        status: "available",
      },
      {
        id: 2,
        date: "20 Nov, 2025",
        name: "Emily Carter",
        email: "emily.carter@xyz.com",
        whatsapp: "+44 7700 900123",
        source: "Email",
        status: "not_available",
      },
      {
        id: 3,
        date: "21 Nov, 2025",
        name: "Michael Brown",
        email: "michael.brown@company.io",
        whatsapp: "+1 555 222 3344",
        source: "WhatsApp",
        status: "available",
      },
      {
        id: 1,
        date: "20 Nov, 2025",
        name: "John Doe",
        email: "john.doe@abc.com",
        whatsapp: "+1 555 101 0199",
        source: "CRM",
        status: "available",
      },
      {
        id: 2,
        date: "20 Nov, 2025",
        name: "Emily Carter",
        email: "emily.carter@xyz.com",
        whatsapp: "+44 7700 900123",
        source: "Email",
        status: "not_available",
      },
      {
        id: 3,
        date: "21 Nov, 2025",
        name: "Michael Brown",
        email: "michael.brown@company.io",
        whatsapp: "+1 555 222 3344",
        source: "WhatsApp",
        status: "available",
      },
    ],
    []
  );


  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 8;


  const handleStatusChange = (id, newStatus) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setData(updated);
    setFilteredData(updated);

    console.log("Update availability:", id, newStatus);
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);


  const totalPages = Math.ceil(filteredData.length / PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, currentPage]);


  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Candidate Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "WhatsApp", accessor: "whatsapp" },
    { header: "Source", accessor: "source" },
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
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4 text-[#2D468A]">
        Availability Check
      </h1>

      <p className="text-md text-gray-600 mb-8">
        Track candidate availability via Email, SMS, and WhatsApp.
      </p>

      <div className="mb-10">
        <DynamicSearch
          data={data}
          searchKeys={["name", "email", "whatsapp", "source"]}
          onFilter={setFilteredData}
        />
      </div>

      <Table columns={columns} data={paginatedData} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

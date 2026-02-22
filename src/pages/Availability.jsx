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
    id: 4,
    date: "22 Nov, 2025",
    name: "Sophia Williams",
    email: "sophia.w@domain.com",
    whatsapp: "+44 7911 223344",
    source: "CRM",
    status: "available",
  },
  {
    id: 5,
    date: "23 Nov, 2025",
    name: "Daniel Johnson",
    email: "daniel.johnson@mail.com",
    whatsapp: "+1 555 777 8899",
    source: "Email",
    status: "not_available",
  },
  {
    id: 6,
    date: "24 Nov, 2025",
    name: "Olivia Martinez",
    email: "olivia.m@techhub.io",
    whatsapp: "+34 612 345 678",
    source: "WhatsApp",
    status: "available",
  },
  {
    id: 7,
    date: "25 Nov, 2025",
    name: "William Anderson",
    email: "will.anderson@abc.org",
    whatsapp: "+1 555 999 1122",
    source: "CRM",
    status: "not_available",
  },
  {
    id: 8,
    date: "26 Nov, 2025",
    name: "Ava Thompson",
    email: "ava.thompson@xyz.net",
    whatsapp: "+44 7700 456789",
    source: "Email",
    status: "available",
  },
  {
    id: 9,
    date: "27 Nov, 2025",
    name: "James Wilson",
    email: "james.wilson@company.io",
    whatsapp: "+1 555 333 4455",
    source: "WhatsApp",
    status: "not_available",
  },
  {
    id: 10,
    date: "28 Nov, 2025",
    name: "Mia Clark",
    email: "mia.clark@startup.ai",
    whatsapp: "+44 7700 998877",
    source: "CRM",
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

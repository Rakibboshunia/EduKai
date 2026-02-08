import { useState } from "react";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import DynamicSearch from "../components/DynamicSearch";

export default function Availability() {
  const data = [
    {
      date: "20 Nov, 2025",
      name: "John Doe",
      email: "john.doe@abc.com",
      whatsapp: "+1 555 101 0199",
      source: "CRM",
      status: "active",
    },
    {
      date: "20 Nov, 2025",
      name: "Emily Carter",
      email: "emily.carter@xyz.com",
      whatsapp: "+44 7700 900123",
      source: "Email",
      status: "not_available",
    },
    {
      date: "21 Nov, 2025",
      name: "Michael Brown",
      email: "michael.brown@company.io",
      whatsapp: "+1 555 222 3344",
      source: "WhatsApp",
      status: "follow_up",
    },
    {
      date: "21 Nov, 2025",
      name: "Sarah Johnson",
      email: "sarah.johnson@domain.com",
      whatsapp: "+61 412 345 678",
      source: "CRM",
      status: "na",
    },
    {
      date: "22 Nov, 2025",
      name: "Aisha Rahman",
      email: "aisha.rahman@startup.ai",
      whatsapp: "+880 1711 223344",
      source: "CRM",
      status: "active",
    },
    {
      date: "23 Nov, 2025",
      name: "Carlos Mendes",
      email: "carlos.mendes@global.net",
      whatsapp: "+351 912 345 678",
      source: "WhatsApp",
      status: "follow_up",
    },
  ];

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
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const [filteredData, setFilteredData] = useState(data);

  return (
    <div className="p-6">
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

      <Table columns={columns} data={filteredData} />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  FiSend,
  FiEye,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";

import { Clock, CheckCircle, MailCheck } from "lucide-react";

import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";

export default function Tracking() {

  const trackingOptions = {
    opened: {
      label: "Opened",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-700",
    },
    responded: {
      label: "Responded",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    sent: {
      label: "Sent",
      icon: MailCheck,
      className: "bg-blue-100 text-blue-700",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      className: "bg-purple-100 text-purple-700",
    },
  };

  const initialData = useMemo(
    () => [
      {
        id: 1,
        date: "23 Jan, 2025 10:30 AM",
        name: "John Doe",
        organization: "TechCorp Solutions",
        file: "John_Doe_CV.pdf",
        status: "opened",
        sender: "recruiter@company.com",
      },
      {
        id: 2,
        date: "23 Jan, 2025 11:15 AM",
        name: "Emily Carter",
        organization: "Innova Labs",
        file: "Emily_Carter_CV.pdf",
        status: "responded",
        sender: "hr@innovalabs.com",
      },
      {
        id: 3,
        date: "23 Jan, 2025 12:00 PM",
        name: "Michael Brown",
        organization: "NextGen Systems",
        file: "Michael_Brown_CV.pdf",
        status: "sent",
        sender: "talent@nextgen.io",
      },
      {
        id: 4,
        date: "23 Jan, 2025 01:45 PM",
        name: "Sarah Johnson",
        organization: "BlueWave Tech",
        file: "Sarah_Johnson_CV.pdf",
        status: "delivered",
        sender: "jobs@bluewave.com",
      },
      {
        id: 3,
        date: "23 Jan, 2025 12:00 PM",
        name: "Michael Brown",
        organization: "NextGen Systems",
        file: "Michael_Brown_CV.pdf",
        status: "sent",
        sender: "talent@nextgen.io",
      },
      {
        id: 4,
        date: "23 Jan, 2025 01:45 PM",
        name: "Sarah Johnson",
        organization: "BlueWave Tech",
        file: "Sarah_Johnson_CV.pdf",
        status: "delivered",
        sender: "jobs@bluewave.com",
      },
      {
        id: 3,
        date: "23 Jan, 2025 12:00 PM",
        name: "Michael Brown",
        organization: "NextGen Systems",
        file: "Michael_Brown_CV.pdf",
        status: "sent",
        sender: "talent@nextgen.io",
      },
      {
        id: 4,
        date: "23 Jan, 2025 01:45 PM",
        name: "Sarah Johnson",
        organization: "BlueWave Tech",
        file: "Sarah_Johnson_CV.pdf",
        status: "delivered",
        sender: "jobs@bluewave.com",
      },
    ],
    []
  );

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 8;


  const handleStatusChange = (id, newStatus) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setData(updated);

    console.log("Tracking status updated:", id, newStatus);
  };

  const total = data.length;
  const opened = data.filter((d) => d.status === "opened").length;
  const responded = data.filter((d) => d.status === "responded").length;
  const delivered = data.filter((d) => d.status === "delivered").length;


  const totalPages = Math.ceil(data.length / PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return data.slice(start, start + PER_PAGE);
  }, [currentPage, data]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);


  const columns = [
    {
      header: "Date & Time",
      accessor: "date",
      className: "min-w-[180px]",
    },
    {
      header: "Candidate",
      accessor: "name",
      className: "min-w-[160px]",
    },
    {
      header: "Organization",
      accessor: "organization",
      className: "min-w-[180px]",
    },
    {
      header: "CV File",
      accessor: "file",
      className: "min-w-[160px]",
      render: (v) => (
        <span className="text-blue-600 underline cursor-pointer truncate block max-w-40">
          {v}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "min-w-[140px]",
      render: (value, row) => (
        <StatusBadge
          value={value}
          options={trackingOptions}
          onChange={(newStatus) =>
            handleStatusChange(row.id, newStatus)
          }
        />
      ),
    },
    {
      header: "Sent By",
      accessor: "sender",
      className: "min-w-[200px]",
    },
    {
      header: "Action",
      accessor: "action",
      align: "right",
      className: "min-w-[140px]",
      render: () => (
        <button className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">
          View Details
        </button>
      ),
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D468A] mb-2">
          Submission Tracking & Audit Log
        </h1>
        <p className="text-sm sm:text-md text-gray-600">
          Complete history of all submissions and interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Submissions" value={total} icon={FiSend} iconBg="bg-blue-600" />
        <StatCard title="Opened" value={opened} icon={FiEye} iconBg="bg-yellow-500" />
        <StatCard title="Responded" value={responded} icon={FiMessageSquare} iconBg="bg-green-500" />
        <StatCard title="Delivered" value={delivered} icon={FiCheckCircle} iconBg="bg-purple-600" />
      </div>

      <div className="overflow-x-auto rounded-lg">
        <Table columns={columns} data={paginatedData} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

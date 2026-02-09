import { useEffect, useMemo, useState } from "react";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import {
  FiSend,
  FiEye,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";

export default function Tracking() {
  const data = useMemo(() => [
    {
      date: "23 Jan, 2025 10:30 AM",
      name: "John Doe",
      organization: "TechCorp Solutions",
      file: "John_Doe_CV.pdf",
      status: "opened",
      sender: "recruiter@company.com",
    },
    {
      date: "23 Jan, 2025 11:15 AM",
      name: "Emily Carter",
      organization: "Innova Labs",
      file: "Emily_Carter_CV.pdf",
      status: "responded",
      sender: "hr@innovalabs.com",
    },
    {
      date: "23 Jan, 2025 12:00 PM",
      name: "Michael Brown",
      organization: "NextGen Systems",
      file: "Michael_Brown_CV.pdf",
      status: "sent",
      sender: "talent@nextgen.io",
    },
    {
      date: "23 Jan, 2025 01:45 PM",
      name: "Sarah Johnson",
      organization: "BlueWave Tech",
      file: "Sarah_Johnson_CV.pdf",
      status: "delivered",
      sender: "jobs@bluewave.com",
    },
    {
      date: "23 Jan, 2025 02:30 PM",
      name: "Aisha Rahman",
      organization: "StartupX",
      file: "Aisha_Rahman_CV.pdf",
      status: "responded",
      sender: "careers@startupx.ai",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
    {
      date: "23 Jan, 2025 03:10 PM",
      name: "Carlos Mendes",
      organization: "GlobalSoft",
      file: "Carlos_Mendes_CV.pdf",
      status: "opened",
      sender: "hr@globalsoft.com",
    },
  ],[]);

  /* ================= STATS ================= */

  const total = data.length;
  const opened = data.filter((d) => d.status === "opened").length;
  const responded = data.filter((d) => d.status === "responded").length;
  const delivered = data.filter((d) => d.status === "delivered").length;

  /* ================= TABLE COLUMNS ================= */

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
        <span className="text-blue-600 underline cursor-pointer truncate block max-w-38">
          {v}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "min-w-[140px]",
      render: (v) => <StatusBadge status={v} variant="tracking" />,
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

  /* ================= PAGINATION STATE ================= */

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const totalPages = Math.ceil(data.length / PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return data.slice(start, end);
  }, [currentPage, data]);

  /* ================= RESET PAGE IF DATA CHANGES ================= */

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  /* ================= RENDER ================= */

  return (
    <div className="p-4">
      {/* 🔹 Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D468A] mb-2">
          Submission Tracking & Audit Log
        </h1>
        <p className="text-sm sm:text-md text-gray-600">
          Complete history of all submissions and interactions.
        </p>
      </div>

      {/* 🔹 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Submissions"
          value={total}
          icon={FiSend}
          iconBg="bg-blue-600"
        />
        <StatCard
          title="Opened"
          value={opened}
          icon={FiEye}
          iconBg="bg-yellow-500"
        />
        <StatCard
          title="Responded"
          value={responded}
          icon={FiMessageSquare}
          iconBg="bg-green-500"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={FiCheckCircle}
          iconBg="bg-purple-600"
        />
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto rounded-lg">
        <Table columns={columns} data={paginatedData} />
      </div>

      {/* 🔹 Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

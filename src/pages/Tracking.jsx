import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";

export default function Tracking() {
  const data = [
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
];


  const columns = [
    { header: "Date & Time", accessor: "date" },
    { header: "Candidate", accessor: "name" },
    { header: "Organization", accessor: "organization" },
    {
      header: "CV File",
      accessor: "file",
      render: (v) => (
        <span className="text-blue-600 underline cursor-pointer">
          {v}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <StatusBadge status={v} variant="tracking" />
      ),
    },
    { header: "Sent By", accessor: "sender" },
    {
      header: "Action",
      accessor: "action",
      align: "right",
      render: () => (
        <button className="text-blue-600 text-sm hover:underline">
          View Details
        </button>
      ),
    },
  ];

  return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-[#2D468A]">
          Submission Tracking & Audit Log
        </h1>
        <p className="text-md text-gray-600 mb-8">Complete history of all submissions and interactions.</p>
  
        <Table columns={columns} data={data} />
      </div>
    );
}

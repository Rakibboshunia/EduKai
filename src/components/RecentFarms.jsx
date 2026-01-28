import React from "react";
import Table from "./Table";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const RecentFarms = () => {
  // ✅ unique ids
  const TableRows = [
    {
      id: 1,
      name: "Green Valley Farm",
      status: "Active",
      users: "45",
      plan: "Professional",
      revenue: "$499",
    },
    {
      id: 2,
      name: "Sunrise Agriculture",
      status: "Trial",
      users: "12",
      plan: "Basic",
      revenue: "$0",
    },
    {
      id: 3,
      name: "Ocean Breze Farms",
      status: "Active",
      users: "30",
      plan: "Enterprise",
      revenue: "$999",
    },
    {
      id: 4,
        name: "Mountain View Farm",
        status: "Active",
        users: "18",
        plan: "Professional",
        revenue: "$499",
    },
    {
      id: 5,
      name: "Riverdale Farms",
      status: "Trail",
      users: "10",
      plan: "Basic",
      revenue: "$0",
    },
  ];

  const TableHeads = [
    {
      Title: "Farm Name",
      key: "name",
      width: "25%",
    },
    {
      Title: "Status",
      key: "status",
      width: "15%",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-[#FEF9C2] text-[#A65F00]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      Title: "Users",
      key: "users",
      width: "15%",
    },
    {
      Title: "Plan",
      key: "plan",
      width: "25%",
    },

    {
      Title: "Revenue",
      key: "revenue",
      width: "20%",
    },
  ];

  return (
    <div>
      <Table TableHeads={TableHeads} TableRows={TableRows} />
    </div>
  );
};

export default RecentFarms;

import React from "react";
import Breadcrumb from "../../components/Bredcumb";
import Plan from "../../components/Plan";
import PlanList from "../../components/PlanList";
import { BsWallet2 } from "react-icons/bs";
import Table from "../../components/Table";


const Subscription = () => {
 const TableRows = [
  {
    id: 1,
    billingDate: "2026-01-01",
    plan: "Basic",
    pricing: "$99 / month",
    status: "paid",
    expireDate: "2026-02-01",
  },
  {
    id: 2,
    billingDate: "2025-12-01",
    plan: "Professional",
    pricing: "$499 / month",
    status: "unpaid",
    expireDate: "2026-01-01",
  },
   {
    id: 3,
    billingDate: "2025-12-01",
    plan: "Enterprise",
    pricing: "$999 / month",
    status: "unpaid",
    expireDate: "2026-01-01",
  },
];


   // ===== TABLE HEADS =====
  const TableHeads = [
    {
      Title: "Billing Date",
      key: "billingDate",
      width: "25%",
    },
    {
      Title: "Plan",
      key: "plan",
      width: "15%",
    },
    {
      Title: "Subscription Pricing",
      key: "pricing",
      width: "20%",
    },
    {
  Title: "Status",
  key: "status",
  width: "15%",
  render: (row) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium
        ${
          row.status === "paid"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      {row.status}
    </span>
  ),
},

    {
      Title: "Expire Date",
      key: "expireDate",
      width: "15%",
    },
   
    {
  Title: "Actions",
  key: "actions",
  width: "10%",
  render: (row) => (
    <div className="flex justify-center">
      {row.status === "unpaid" ? (
        <button className="text-[#0A0A0A] cursor-pointer border border-[#0A0A0A]/10 rounded-lg px-4 py-2">
          Renew now
        </button>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </div>
  ),
},

  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex  items-center gap-2">
            <Breadcrumb />
            {/* <p className="text-[#0A0A0A] text-3xl">& Biiling</p> */}
          </div>
         <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
            Manage your farm's subscription and payment details
          </p>
        </div>

        <div className="bg-[#FFF6E9] w-max p-2">
          <p className="text-[#0A0A0A] "> Next renewal date : 26-01-2026</p>
        </div>
      </div>

      <Plan />
      {/* <PlanList /> */}

      <div>
        <h3 className="text-[#0A0A0A] text-xl mt-10 mb-4">Billing History</h3>

        <div className="bg-white rounded-lg border-2 border-[#E5E7EB] overflow-x-scroll md:overflow-x-hidden">
          <Table TableHeads={TableHeads} TableRows={TableRows} />
        </div>
      </div>

      <div className=" mt-12">
        <p className="text-xl text-[#0A0A0A] ">Payment Method</p>

        <div className="bg-white rounded-lg border-2 border-[#E5E7EB] mt-4 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFF6E9] p-3 rounded-lg">
              <BsWallet2 className="text-[#F6A62D] w-6 h-6" />
            </div>
            <div>
              <p className="text-[#101828]">Visa ending in 1234</p>
              <p className="text-[#6A7282]">Expires 12/2027</p>
            </div>
          </div>

          <div className="bg-[#FFF6E9] w-max p-2 rounded-lg">
            <p className="text-[#F6A62D]">Update</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

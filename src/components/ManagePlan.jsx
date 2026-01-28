import React, { useState } from "react";
import ToggleButton from "./ToggleButton";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const Card = ({ name, price, features, employees, farms }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-[#E5E7EB] py-8 px-6 flex flex-col hover:shadow-lg transition-all duration-300 md:col-span-4">
      {/* Header + Actions */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl text-[#0A0A0A]">{name}</p>
          <p className="text-[#4A5565] mt-1">{employees}</p>
        </div>

        {/* <div className="flex items-center gap-3">
          <FiEdit className="text-[#667085] cursor-pointer" />
          <RiDeleteBinLine className="text-red-600 cursor-pointer" />
        </div> */}
      </div>

      {/* Price */}
      <div className="my-4">
        <div className="flex items-end">
          <p className="text-4xl text-[#0A0A0A]">${price}</p>
          <span className="text-[#4A5565] ml-1">/month</span>
        </div>

        {/* Yearly calculation */}
        <p className="text-sm text-[#4A5565] mt-1">
          ${price * 10}/year (save ${price * 2})
        </p>
      </div>

      {/* Trial */}
      <div className="bg-[#EFF6FF] p-3 rounded-lg">
        <p className="text-[#1447E6]">14 days free trial</p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-14 mt-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            {feature.active && (
              <span className="text-[#00A63E] text-lg mr-2">✔</span>
            )}
            <span className="text-[#364153]">{feature.name}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <p className="text-[#101828] border-t border-[#F3F4F6] pt-6">
        {farms}
        <span className="text-[#4A5565] ml-1">farms using this plan</span>
      </p>
    </div>
  );
};

const plans = [
  {
    name: "Basic",
    employees: "1-10 employees",
    monthly: 99,
    yearly: 990,
    farms: 10,
    features: [
      { name: "Up to 10 employees", active: true },
      { name: "Basic SOP management", active: true },
      { name: "Task tracking", active: true },
      { name: "Email support", active: true },
      { name: "5 GB storage", active: true },
    ],
  },
  {
    name: "Professional",
    employees: "11-50 employees",
    monthly: 499,
    yearly: 4990,
    farms: 18,
    features: [
      { name: "Up to 50 employees", active: true },
      { name: "Advanced SOP management", active: true },
      { name: "Task Automation", active: true },
      { name: "Priority Support", active: true },
      { name: "50 GB storage", active: true },
      { name: "Custom Reports", active: true },
    ],
  },
  {
    name: "Enterprise",
    employees: "51+ employees",
    monthly: 999,
    yearly: 9990,
    farms: 8,
    features: [
      { name: "Unlimited employees", active: true },
      { name: "Enterprise SOP suite", active: true },
      { name: "Advanced Automation", active: true },
      { name: "24/7 dedicated support", active: true },
      { name: "Unlimited storage", active: true },
      { name: "Custom Integrations", active: true },
      { name: "White Labeling", active: true },
    ],
  },
];

const ManagePlan = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="">
      {/* Cards */}
      <div className="grid md:grid-cols-12  gap-6">
        {plans.map((plan, i) => (
          <Card
            key={i}
            name={plan.name}
            employees={plan.employees}
            price={isAnnual ? plan.yearly : plan.monthly}
            isAnnual={isAnnual}
            farms={plan.farms}
            features={plan.features}
          />
        ))}
      </div>
    </div>
  );
};

export default ManagePlan;

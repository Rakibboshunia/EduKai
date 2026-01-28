"use client";

// import ToggleButton from "@/src/components/ToggleButton";
import React, { useState } from "react";
import ToggleButton from "./ToggleButton";

const Card = ({
  name,
  price,
  isAnnual,
  features,
  employees,
  farms,
  yearlyPrice,
  monthlyPrice,
}) => {
  return (
    <div className="bg-white rounded-lg border-2 border-[#E5E7EB]  py-8 px-6 flex flex-col  hover:shadow-lg transition-all duration-300 col-span-12 md:col-span-4 ">
      {/* Plan Name */}
      <div>
        <p className="text-2xl text-[#0A0A0A]">{name}</p>
        <p className="text-[#4A5565] mt-1">{employees}</p>
      </div>

      {/* Price */}
      <div className="flex flex-col my-4">
        <div className="flex items-end">
          <p className="text-4xl text-[#0A0A0A]">${price}</p>
          <span className=" text-[#4A5565] ml-1">
            /{isAnnual ? "Year" : "Month"}
          </span>
        </div>
        {isAnnual && (
          <p className="text-[#4A5565] mt-1">
            {/* ${yearlyPrice}/year (save ${monthlyPrice * 2}) */}
             save ${monthlyPrice * 2}
          </p>
        )}
      </div>
      {/* Yearly calculation */}

      <div className="bg-[#EFF6FF] p-3 rounded-lg">
        <p className="text-[#1447E6]">14 days free trial</p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-14 mt-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            {feature.active ? (
              <span className="text-[#00A63E] text-lg mr-2">✔</span>
            ) : (
              ""
            )}
            <span className="text-[#364153]">{feature.name}</span>
          </li>
        ))}
      </ul>

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

const Plan = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="">
      {/* Toggle */}

      <div className="flex items-center justify-center gap-2 mt-10 ">
        <ToggleButton isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        <div className="bg-[#FFF6E9] w-max p-1 rounded-lg">
          <p className="text-[#F6A62D]">Save 17%</p>
        </div>
      </div>

      <p className="text-[#0A0A0A] text-xl mt-10 mb-4">Available Plans</p>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        {plans.map((plan, i) => (
          <Card
            key={i}
            name={plan.name}
            employees={plan.employees}
            price={isAnnual ? plan.yearly : plan.monthly}
            isAnnual={isAnnual}
            farms={plan.farms}
            features={plan.features}
            monthlyPrice={plan.monthly}
            yearlyPrice={plan.yearly}
          />
        ))}
      </div>
    </div>
  );
};

export default Plan;

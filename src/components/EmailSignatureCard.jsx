import React from "react";

export default function EmailSignatureCard({
  name,
  title,
  email,
  website,
  phone,
  company,
  avatar = "/logo.png",
}) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between gap-4">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <p className="text-sm font-semibold text-[#2D468A]">
            {name}
          </p>

          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xs text-gray-500">{email}</p>
          <p className="text-xs text-gray-500">{website}</p>
          <p className="text-xs text-gray-500">{phone}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-right">
        <p className="text-blue-600 font-semibold text-sm">
          {company} ✨
        </p>
      </div>
    </div>
  );
}
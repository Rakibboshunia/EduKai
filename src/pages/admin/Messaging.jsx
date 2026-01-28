import React, { useMemo, useState } from "react";
import Breadcrumb from "../../components/Bredcumb";
import { FaSearch } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../../components/Pagination";
import MessageList from "./MessageList";
import Inbox from "./Inbox";

const initialMessages = [
  {
    id: 1,
    from: "Sarah Johnson",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "Equipment maintenance completed as requested.",
    time: "2026-01-07 14:30",
    unread: false,
  },
  {
    id: 2,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Jan de Vries",
    toRole: "Employee",
    text: "Please check the irrigation system in sector B.",
    time: "2026-01-07 13:15",
    unread: false,
  },
  {
    id: 3,
    from: "Jan de Vries",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "I need clarification on the new safety SOP.",
    time: "2026-01-07 10:45",
    unread: true,
  },
  {
    id: 4,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Sarah Johnson",
    toRole: "Employee",
    text: "Great work on the weekly report!",
    time: "2026-01-06 16:20",
    unread: false,
  },
  {
    id: 5,
    from: "Sarah Johnson",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "Equipment maintenance completed as requested.",
    time: "2026-01-07 14:30",
    unread: false,
  },
  {
    id: 6,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Jan de Vries",
    toRole: "Employee",
    text: "Please check the irrigation system in sector B.",
    time: "2026-01-07 13:15",
    unread: false,
  },
  {
    id: 7,
    from: "Jan de Vries",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "I need clarification on the new safety SOP.",
    time: "2026-01-07 10:45",
    unread: true,
  },
  {
    id: 8,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Sarah Johnson",
    toRole: "Employee",
    text: "Great work on the weekly report!",
    time: "2026-01-06 16:20",
    unread: false,
  },
  {
    id: 9,
    from: "Sarah Johnson",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "Equipment maintenance completed as requested.",
    time: "2026-01-07 14:30",
    unread: false,
  },
  {
    id: 10,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Jan de Vries",
    toRole: "Employee",
    text: "Please check the irrigation system in sector B.",
    time: "2026-01-07 13:15",
    unread: false,
  },
  {
    id: 11,
    from: "Jan de Vries",
    fromRole: "Employee",
    to: "Tom Wilson",
    toRole: "Manager",
    text: "I need clarification on the new safety SOP.",
    time: "2026-01-07 10:45",
    unread: true,
  },
  {
    id: 12,
    from: "Tom Wilson",
    fromRole: "Manager",
    to: "Sarah Johnson",
    toRole: "Employee",
    text: "Great work on the weekly report!",
    time: "2026-01-06 16:20",
    unread: false,
  },
];

const Messaging = () => {
  const [enabled, setEnabled] = useState(true);
  const [messages, setMessages] = useState(initialMessages);

  // 📊 counts
  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => m.unread).length;
  const [activeTab, setActiveTab] = useState("oversight");

  return (
    <div>
      <div>
        <Breadcrumb />
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Monitor communication between employees and managers
        </p>
      </div>

      <div className="flex w-full mt-6 border-b border-[#DEDEDE]">
        <button
          onClick={() => setActiveTab("oversight")}
          className={`px-20 py-2  cursor-pointer ${
            activeTab === "oversight"
              ? "border-[#F6A62D] border-b text-[#0A0A0A]"
              : "text-[#4A5565]"
          }`}
        >
          Oversight
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-20 py-2  cursor-pointer ${
            activeTab === "create"
              ? "border-[#F6A62D] border-b text-[#0A0A0A]"
              : "text-[#4A5565]"
          }`}
        >
          Inbox
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 col-span-12">
        {activeTab === "oversight" && (
          <div>
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className=" p-6 bg-white rounded-lg border-2 border-[#E5E7EB] col-span-12 md:col-span-4">
                <p className="text-sm text-gray-500">Total Messages</p>
                <p className={`text-2xl text-[#0A0A0A] font-semibold mt-1 `}>
                  {totalMessages}
                </p>
              </div>

              <div className=" p-6 bg-white rounded-lg border-2 border-[#E5E7EB] col-span-12 md:col-span-4">
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className={`text-2xl text-[#F54900] font-semibold mt-1 `}>
                  {unreadCount}
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-[#E5E7EB] p-6 col-span-12 md:col-span-4 ">
                <div>
                  <p className="text-sm text-gray-500">Messaging Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => setEnabled(!enabled)}
                      className={`w-11 h-6 rounded-full flex items-center px-1 ${
                        enabled
                          ? " border-2 border-[#00A63E]"
                          : "border-2 border-red-600"
                      }`}
                    >
                      <span
                        className={`border-2 border-[#00A63E] w-4 h-4 rounded-full transform transition ${
                          enabled ? "translate-x-4 " : "border-red-600 border"
                        }`}
                      />
                    </button>
                    <p
                      className={`font-medium ${
                        enabled ? "text-[#00A63E]" : "text-red-600"
                      }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <MessageList messages={messages} setMessages={setMessages} />
          </div>
        )}
        {activeTab === "create" && <Inbox />}
      </div>

      <div></div>
    </div>
  );
};

export default Messaging;

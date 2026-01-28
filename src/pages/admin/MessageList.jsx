import React, { useMemo, useState } from "react";
import Pagination from "../../components/Pagination";
import { FiTrash2 } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

const MessageList = ({ messages, setMessages }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔍 search filter
  const filteredMessages = useMemo(() => {
    return messages.filter(
      (m) =>
        m.text.toLowerCase().includes(search.toLowerCase()) ||
        m.from.toLowerCase().includes(search.toLowerCase()) ||
        m.to.toLowerCase().includes(search.toLowerCase())
    );
  }, [messages, search]);

  // 🗑 delete single
  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // ❌ clear all
  const clearAll = () => {
    setMessages([]);
  };

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredMessages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {/* 🔍 SEARCH + CLEAR */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="relative col-span-8">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#99A1AF]" />
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
          />
        </div>

        <div className="col-span-4 flex justify-end items-center ">
          <button
            onClick={clearAll}
            className="bg-[#E7000B] text-white px-4 md:py-4 py-1 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <FiTrash2 size={20} />
            Clear All Messages
          </button>
        </div>
      </div>

      {/* ===== MESSAGE LIST ===== */}
      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] overflow-hidden col-span-12 mt-6">
        {paginatedData.length === 0 ? (
          <p className="text-center py-10 text-gray-400">
            No messages found
          </p>
        ) : (
          paginatedData.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 border-b border-[#E5E7EB] flex justify-between gap-4 ${
                msg.unread ? "bg-orange-50" : "bg-white"
              }`}
            >
              <div className="space-y-1">
                <p className="text-[#101828]">
                  {msg.from} ({msg.fromRole}) → {msg.to} ({msg.toRole})
                  {msg.unread && (
                    <span className="ml-2 text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded">
                      Unread
                    </span>
                  )}
                </p>

                <p className="text-[#364153]">{msg.text}</p>
                <p className="text-xs text-[#6A7282]">{msg.time}</p>
              </div>

              <button
                onClick={() => deleteMessage(msg.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-center mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default MessageList;

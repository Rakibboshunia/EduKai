import React, { useState } from "react";
import { AiFillPicture } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FaArrowLeft, FaCamera } from "react-icons/fa6";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

export default function Inbox() {
  const currentUserRole = "admin";

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Tom Wilson",
      role: "Manager",
      avatar: "TW",
      unread: true,
      messages: [
        {
          id: 1,
          sender: "manager",
          text: "Vaccination completed for shed A.",
          time: "5 hours ago",
        },
        {
          id: 2,
          sender: "manager",
          text: "All animals are stable.",
          time: "3 hours ago",
        },
      ],
    },
    {
      id: 2,
      name: "John Doe",
      role: "Employee",
      avatar: "JD",
      unread: true,
      messages: [
        {
          id: 1,
          sender: "user",
          text: "Feed stock is running low.",
          time: "2 hours ago",
        },
        {
          id: 2,
          sender: "manager",
          text: "We need 500kg more feed.",
          time: "2 hours ago",
        },
        {
          id: 3,
          sender: "user",
          text: "Okay, noted.",
          time: "1 hour ago",
        },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !imagePreview) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: Date.now(),
                  sender: "admin",
                  text: newMessage,
                  image: imagePreview,
                  time: "Just now",
                },
              ],
            }
          : c,
      ),
    );

    setNewMessage("");
    setImagePreview(null);
  };

  // ===============================
  // 📥 INBOX VIEW
  // ===============================
  if (!selectedConversation) {
    return (
      <>
        <div className="relative  mb-6 bg-white rounded-lg border-2 border-[#E5E7EB] p-6">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-10 text-[#99A1AF]" />
          <input
            type="text"
            placeholder="Search conversation..."
            className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
          />
        </div>

        <div className="bg-white border rounded-lg">
          <div className="px-4 py-5 border-b border-[#0a0a0a]/10 text-[#0A0A0A] flex items-center gap-2">
            <FiMessageSquare className="w-6 h-6" />
            <h3 className="text-xl font-semibold">Inbox</h3>
          </div>

          <div className="h-[535px] overflow-y-scroll hide-scrollbar">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                className={`flex items-start gap-4 px-4 py-5 border-b cursor-pointer
                  ${
                    c.unread
                      ? "bg-orange-50 hover:bg-orange-100"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {c.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-[#0A0A0A]">{c.name}</p>
                    <span className="text-sm text-gray-400">
                      {c.messages[c.messages.length - 1].time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {c.messages[c.messages.length - 1].text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const manager = selectedConversation.name;

  // ===============================
  // 💬 CONVERSATION VIEW
  // ===============================
  return (
    <div className="flex flex-col  rounded-lg h-[740px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b bg-white">
        <button
          onClick={() => setSelectedId(null)}
          className="text-xl text-[#0A0A0A]"
        >
          <FaArrowLeft />
        </button>

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {selectedConversation.avatar}
        </div>

        <div className="flex-1">
          <p className="font-medium text-sm text-[#0A0A0A]">
            {selectedConversation.name}
          </p>
          <p className="text-xs text-gray-500">{selectedConversation.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
        {selectedConversation.messages.map((msg) => {
          const isRightSide =
            msg.sender === "admin" ||
            (selectedConversation.role === "Employee" &&
              msg.sender === "manager");

          return (
            <div
              key={msg.id}
              className={`flex ${
                isRightSide ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  isRightSide ? "text-right" : "text-left"
                }`}
              >
                {msg.sender === "manager" && (
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    {manager} (Manager)
                  </p>
                )}

                <div
                  className={`px-4 py-2 rounded-lg text-base
                    ${
                      isRightSide
                        ? "bg-[#F6A62D] text-white rounded-br-none"
                        : "bg-[#F3F4F6] text-[#101828] rounded-bl-none"
                    }
                  `}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt=""
                      className="mb-2 max-w-[350px] rounded-md block ml-auto cursor-pointer hover:opacity-90"
                    />
                  )}
                  {msg.text}
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin reply */}
      {currentUserRole === "admin" &&
        selectedConversation.role === "Manager" && (
          <div className="p-4 border-t space-y-2">
            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="relative w-25 h-25  overflow-hidden">
                <img src={imagePreview} alt="" className="rounded-md border" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-0 right-0 bg-[#F6A62D] text-white w-5 h-5 rounded-full text-sm flex items-center justify-center cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2 px-1.5 items-center border border-[#0A0A0A]/10 rounded-full">
              {/* IMAGE BUTTON */}
              <label className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-[#F6A62D]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImagePreview(URL.createObjectURL(e.target.files[0]))
                  }
                />
                <AiFillPicture className="w-5 h-5" />
              </label>

              {/* TEXT INPUT */}
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1  text-[#0A0A0A] rounded-md px-3 py-3 outline-0"
                placeholder="Type message..."
              />

              <button
                onClick={handleSendMessage}
                className="bg-[#F6A62D] rounded-full text-white px-2 py-2 cursor-pointer"
              >
                <IoSend className="w-5 h-5 " />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

"use client";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function Pagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 8;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 4) {
      start = 2;
      end = 6;
    }

    if (currentPage >= totalPages - 3) {
      start = totalPages - 5;
      end = totalPages - 1;
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 flex items-center gap-2 text-[#364153] disabled:text-[#697077]"
      >
        <MdKeyboardArrowLeft className="w-6 h-6" />
        Previous
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-2 text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md font-inter transition
              ${
                currentPage === page
                  ? "bg-[#F6A62D] text-white rounded-full"
                  : "text-[#F6A62D] hover:bg-[#F6A62D]/10"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 flex items-center gap-2 text-[#364153] disabled:text-[#697077]"
      >
        Next
        <MdKeyboardArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}

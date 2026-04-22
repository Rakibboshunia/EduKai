import { useState, useMemo } from "react";

export default function Table({ columns = [], data = [], perPage = 100 }) {
  if (!Array.isArray(data)) data = [];

  const paginatedData = data;

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block w-full border border-gray-200 bg-white/80 backdrop-blur shadow-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[750px] overflow-y-auto">
          <table className="w-full min-w-[900px] text-sm">
            
            {/* HEADER */}
            <thead className="bg-gradient-to-r from-[#2D468A] to-[#4F6EDB] text-white sticky top-0 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-4 text-left font-semibold tracking-wide uppercase text-xs ${
                      col.align === "right" ? "text-right" : ""
                    } ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    🚫 No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row.id ?? rowIndex}
                    className="border-b border-gray-100 hover:bg-blue-50/40 transition-all duration-200 group text-black/90"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap ${
                          col.align === "right" ? "text-right" : ""
                        } ${col.className ?? ""}`}
                      >
                        <div className="group-hover:translate-x-[2px] transition-all duration-150">
                          {col.render
                            ? col.render(row[col.accessor], row)
                            : row[col.accessor] ?? "-"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}

      <div className="md:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 shadow">
            🚫 No data found
          </div>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <div
              key={row.id ?? rowIndex}
              className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-gray-200 p-4 space-y-3 hover:shadow-lg transition"
            >
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex justify-between items-start gap-4 border-b last:border-none pb-2"
                >
                  <span className="text-xs text-gray-400 font-semibold uppercase">
                    {col.header}
                  </span>

                  <span className="text-sm text-right text-gray-700 break-words max-w-[60%]">
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor] ?? "-"}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
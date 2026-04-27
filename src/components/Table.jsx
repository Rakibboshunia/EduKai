import { useState, useMemo } from "react";

export default function Table({ columns = [], data = [], perPage = 100 }) {
  if (!Array.isArray(data)) data = [];

  const paginatedData = data;

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block w-full bg-white shadow-sm border border-gray-200 overflow-hidden ">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[900px]">
            
            {/* HEADER */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider ${
                      col.align === "right" ? "text-right" : ""
                    } ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center text-gray-500 text-sm font-medium bg-gray-50/30"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-2xl opacity-50">🚫</span>
                      <span>No data found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row.id ?? rowIndex}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 align-middle text-[14px] font-semibold text-gray-700 ${
                          col.align === "right" ? "text-right" : ""
                        } ${col.className ?? ""}`}
                      >
                        <div className="break-words leading-relaxed">
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
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 font-medium flex flex-col items-center justify-center gap-2">
            <span className="text-3xl opacity-50">🚫</span>
            <span>No data found</span>
          </div>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <div
              key={row.id ?? rowIndex}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-xl hover:border-brand-primary/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex flex-col gap-2 pt-1">
                {columns.map((col, colIndex) => {
                  const content = col.render
                    ? col.render(row[col.accessor], row)
                    : row[col.accessor];
                    
                  // Skip empty data to save space on mobile
                  if (content === null || content === undefined || content === "") return null;

                  return (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-white hover:shadow-md hover:border-brand-primary/20 transition-all duration-300 group/item"
                    >
                      <div className="flex items-center gap-1.5 text-gray-500 group-hover/item:text-brand-primary transition-colors">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{col.header}</span>
                      </div>

                      <div className="text-sm font-semibold text-gray-800 break-words leading-snug w-full">
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
import { useState, useMemo } from "react";

export default function Table({ columns = [], data = [], perPage = 100 }) {

  if (!Array.isArray(data)) data = [];

  // 🔥 pagination state (commented)
  // const [currentPage, setCurrentPage] = useState(1);

  // 🔥 total pages (commented)
  // const totalPages = Math.ceil(data.length / perPage);

  // 🔥 pagination logic (commented)
  // const paginatedData = useMemo(() => {
  //   const start = (currentPage - 1) * perPage;
  //   return data.slice(start, start + perPage);
  // }, [data, currentPage, perPage]);

  // 🔥 now show ALL data
  const paginatedData = data;

  // const nextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  // };

  // const prevPage = () => {
  //   if (currentPage > 1) setCurrentPage((p) => p - 1);
  // };

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block w-full bg-white rounded-2xl shadow-sm border border-gray-200">

        <div className="overflow-x-auto max-h-[800px] overflow-y-auto">

          <table className="w-full min-w-[800px] text-sm">

            <thead className="bg-[#2D468A] text-white sticky top-0 z-10">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3 text-left font-medium whitespace-nowrap ${
                      col.align === "right" ? "text-right" : ""
                    } ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {paginatedData.length === 0 ? (

                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>

              ) : (

                paginatedData.map((row, rowIndex) => (

                  <tr
                    key={row.id ?? rowIndex}
                    className="border-b border-gray-200 text-[#333843] hover:bg-gray-50 transition"
                  >

                    {columns.map((col, colIndex) => (

                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap ${
                          col.align === "right" ? "text-right" : ""
                        } ${col.className ?? ""}`}
                      >

                        {col.render
                          ? col.render(row[col.accessor], row)
                          : row[col.accessor]}

                      </td>

                    ))}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* 🔥 PAGINATION (COMMENTED) */}

        {/*
        {totalPages > 1 && (

          <div className="flex items-center justify-between px-6 py-4 border-t rounded-2xl">

            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-black rounded-lg border hover:bg-[#2D468A] hover:text-white disabled:opacity-40 cursor-pointer transition"
            >
              Previous
            </button>

            <span className="text-sm text-black">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-black rounded-lg border hover:bg-[#2D468A] hover:text-white disabled:opacity-40 cursor-pointer transition"
            >
              Next
            </button>

          </div>

        )}
        */}

      </div>


      {/* ================= MOBILE VIEW ================= */}

      <div className="md:hidden space-y-3">

        {paginatedData.length === 0 ? (

          <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow-sm">
            No data found
          </div>

        ) : (

          paginatedData.map((row, rowIndex) => (

            <div
              key={row.id ?? rowIndex}
              className="bg-white text-[#333843] rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
            >

              {columns.map((col, colIndex) => (

                <div
                  key={colIndex}
                  className="flex justify-between items-start gap-4"
                >

                  <span className="text-xs text-gray-500 font-medium">
                    {col.header}
                  </span>

                  <span className="text-sm text-right break-words max-w-[60%]">
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
                  </span>

                </div>

              ))}

            </div>

          ))

        )}

        {/* 🔥 MOBILE PAGINATION (COMMENTED) */}

        {/*
        {totalPages > 1 && (

          <div className="flex justify-between items-center pt-2">

            <button onClick={prevPage}>Prev</button>
            <span>{currentPage}/{totalPages}</span>
            <button onClick={nextPage}>Next</button>

          </div>

        )}
        */}

      </div>
    </>
  );
}
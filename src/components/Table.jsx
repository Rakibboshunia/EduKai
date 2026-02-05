export default function Table({ columns = [], data = [] }) {
  if (!Array.isArray(data)) data = [];

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl overflow-visible shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#2D468A] text-white">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-left font-medium ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border border-gray-200 text-[#333843] last:border-none hover:bg-gray-50"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${
                        col.align === "right" ? "text-right" : ""
                      }`}
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

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            No data found
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="bg-white text-[#333843] rounded-xl shadow-sm p-4 space-y-3"
            >
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex justify-between gap-4">
                  <span className="text-xs text-gray-500">
                    {col.header}
                  </span>
                  <span className="text-sm text-right break-all">
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
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

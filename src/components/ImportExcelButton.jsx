import { FiUpload } from "react-icons/fi";

export default function ImportExcelButton({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ file type validation
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel"
    ) {
      alert("Please upload a valid Excel file");
      return;
    }

    // ✅ SAFETY CHECK (VERY IMPORTANT)
    if (typeof onFileUpload !== "function") {
      console.error("onFileUpload is not a function");
      alert("Upload handler not configured");
      return;
    }

    // ✅ call parent function
    onFileUpload(file);

    // ✅ reset input (same file re-upload fix)
    e.target.value = null;
  };

  return (
    <label className="border border-gray-300 px-2 py-2 rounded-xl flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-[#2D468B] hover:text-white transition-all text-gray-700">
      <FiUpload />
      Import From Excel File

      <input
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
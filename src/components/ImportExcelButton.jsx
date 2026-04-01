import { FiUpload } from "react-icons/fi";

export default function ImportExcelButton({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("Selected file:", file);

    // ✅ file type validation
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid Excel/CSV file");
      return;
    }

    if (typeof onFileUpload !== "function") {
      console.error("onFileUpload is not a function");
      alert("Upload handler not configured");
      return;
    }

    onFileUpload(file);

    // reset input
    e.target.value = null;
  };

  return (
    <label className="border border-[#2D468A] px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-white text-black hover:bg-[#2D468A] hover:text-white transition">
      <FiUpload />
      Import Excel

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
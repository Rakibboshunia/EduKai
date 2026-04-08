import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ImportExcelButton({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("Selected file:", file);

    // ✅ check by extension as a fallback
    const isExcel = file.name.match(/\.(xlsx|xls)$/i) || 
                    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      toast.error("Please upload a valid .xlsx Excel file");
      return;
    }

    if (typeof onFileUpload !== "function") {
      console.error("onFileUpload is not a function");
      toast.error("Upload handler not configured");
      return;
    }

    onFileUpload(file);

    e.target.value = null;
  };

  return (
    <label className="border border-[#2D468A] px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-white text-black hover:bg-[#2D468A] hover:text-white transition">
      <FiUpload />
      Import From Excel File

      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
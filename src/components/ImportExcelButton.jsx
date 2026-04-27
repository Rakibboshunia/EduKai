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
    <label className="border border-brand-primary/20 px-4 py-2.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:shadow-lg transition-all w-full sm:w-auto font-bold text-sm sm:text-base whitespace-nowrap shadow-md">
      <FiUpload className="shrink-0" />
      <span>Import From Excel File</span>

      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
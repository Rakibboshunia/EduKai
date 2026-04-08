import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const UploadPDF = ({ onFileSelect }) => {

  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const allowedType = "application/pdf";

  const handleFiles = (fileList) => {

    const selectedFiles = Array.from(fileList);

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type === allowedType ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files are allowed.");
    }

    const newFiles = [...files, ...validFiles];

    setFiles(newFiles);
    onFileSelect?.(newFiles);

  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-white/60 rounded-xl p-10">

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-2 transition bg-[#F9FAFB]
        ${isDragging ? "border-[#2D468A] bg-blue-50" : "border-[#A0A0A0]"}`}
      >

        <FaFilePdf className="w-12 h-12 text-[#A0A0A0]" />

        <p className="text-[#4A5565] text-center">
          {files.length > 0
            ? `${files.length} CV ready to upload`
            : "Drop PDF files here or click to browse"}
        </p>

        <p className="text-[#7C7C7C] text-xs">
          Only PDF format is supported
        </p>

        <p className="text-[#4A5565] text-center">or</p>

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="bg-[#2D468A] text-white px-10 py-2 rounded-md flex items-center gap-2 hover:bg-[#354e92] cursor-pointer"
        >
          <HiOutlineDocumentDownload className="w-6 h-6 hover:bg-[#1a3060]" />
          Select PDF
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleChange}
          className="hidden"
        />

      </div>

    </div>
  );
};

export default UploadPDF;
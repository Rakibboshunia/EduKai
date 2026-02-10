import { useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const UploadPDF = ({ onFileSelect }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFiles = (fileList) => {
    const selectedFiles = Array.from(fileList);

    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("Only PDF, DOC, DOCX files are allowed");
    }

    setFiles(validFiles);
    onFileSelect?.(validFiles);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-white p-10">
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
            ? `${files.length} file(s) selected`
            : "Drop CVs here or click to browse"}
        </p>

        <p className="text-[#7C7C7C] text-xs">
          Support for PDF, DOC, DOCX formats
        </p>

        <p className="text-[#4A5565] text-center">or</p>

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="bg-[#2D468A] text-white px-10 py-2 rounded-md flex items-center gap-2 hover:bg-[#354e92] cursor-pointer"
        >
          <HiOutlineDocumentDownload className="w-6 h-6" />
          Select files
        </button>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Selected file list */}
      {files.length > 0 && (
        <ul className="mt-4 text-sm text-gray-600">
          {files.map((file, index) => (
            <li key={index}>📄 {file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadPDF;

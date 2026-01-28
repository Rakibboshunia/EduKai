import React, { useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import Breadcrumb from "../../components/Bredcumb";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import { FiX } from "react-icons/fi";
import UploadPDF from "../../components/UploadPDF";
import CreateDigitalModule from "../../components/CreateDigitalModule";

const AddSOP = () => {
  const navigate = useNavigate();
  const [addCategory, setAddCategory] = useState("false");
  const [activeTab, setActiveTab] = useState("upload");
  const handleFileSelect = (file) => {
    console.log("Selected file:", file);
  };

  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaArrowLeft className=" text-[#4A5565] " />
        <p className="text-[#4A5565]">Back to SOP List</p>
      </div>
      <div className="mt-4">
        <Breadcrumb />
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
          Add a new standard operating procedure document
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] p-6 mt-6">
        <div className="grid grid-cols-12">
          <InputField
            type={`text`}
            inputClass={`rounded-lg`}
            label={`SOP Title`}
            placeholder={`e.g., Safety Protocols`}
            className={`col-span-12`}
          />

          <Dropdown
            placeholder={`Category/Area`}
            options={["Milking", "Feeding", "Health", "Calves", "Maintenance","Emergencies"]}
            className={`col-span-12 `}
          />

         

          <div className="flex bg-[#FFF4E5] rounded-lg p-1.5 w-fit mt-6 md:col-span-6 col-span-12">
            <button
              onClick={() => setActiveTab("upload")}
              className={`md:px-20 px-[38px] py-2 rounded-md cursor-pointer ${
                activeTab === "upload"
                  ? "bg-[#F6A62D] text-white"
                  : "text-[#4A5565]"
              }`}
            >
              Upload PDF
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`md:px-20 px-[38px] py-2 rounded-md cursor-pointer ${
                activeTab === "create"
                  ? "bg-[#F6A62D] text-white"
                  : "text-[#4A5565]"
              }`}
            >
              Create Digital Module
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 col-span-12">
            {activeTab === "upload" && (
              <UploadPDF onFileSelect={handleFileSelect} />
            )}
            {activeTab === "create" && <CreateDigitalModule />}
          </div>

          <p className="col-span-12 text-[#364153] my-6">
            Allow Managers to view this SOP
          </p>

          <div className="col-span-12 gap-3 flex ">
            <button className="py-3 px-5 font-inet   bg-[#F6A62D] text-white] rounded-lg cursor-pointer">
              Create SOP
            </button>

            <button className="py-3 px-5 font-inet   bg-[#E5E7EB] text-[#364153] rounded-lg cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSOP;

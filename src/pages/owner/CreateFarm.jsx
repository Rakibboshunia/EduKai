import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Breadcrumb from "../../components/Bredcumb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import Password from "../../components/Password";

const CreateFarm = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaArrowLeft className=" text-[#4A5565] " />
        <p className="text-[#4A5565]">Back to Farms</p>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#E5E7EB] mt-6 p-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF6E9] rounded-lg p-3">
            <HiOutlineBuildingOffice2 className="text-[#F6A62D] w-6 h-6" />
          </div>
          <div className="">
            <Breadcrumb />
           <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
              Add a new farm to the platform
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl text-[#0A0A0A] mt-6">Farm Details</h3>
          <div className="grid grid-cols-12 gap-4 border-b border-[#E5E7EB] py-4">
            <InputField
            type={`text`}
              inputClass={`rounded-lg`}
              label={`Farm Name`}
              placeholder={`e.g., Farm check`}
              className={`col-span-12`}
            />

            <InputField
            type={`email`}
              inputClass={`rounded-lg`}
              label={`Admin Email`}
              placeholder={`admin@farm.com`}
              className={`col-span-12`}
            />
            <InputField
            type={`text`}
              inputClass={`rounded-lg`}
              label={`Country`}
              placeholder={``}
              className={`col-span-6`}
            />
            <InputField
            type={`text`}
              inputClass={`rounded-lg`}
              label={`Language`}
              placeholder={``}
              className={`col-span-6`}
            />

            <Password
              label="Password"
              inputClass={`rounded-lg`}
              className="col-span-12"
            />
           
          </div>
        </div>

        <div>
          <h3 className="text-xl text-[#0A0A0A] mt-6">Subscription Details</h3>
          <div className=" gap-4 border-b border-[#E5E7EB] py-4">
            {/* <InputField
              inputClass={`rounded-lg`}
              label={`Status `}
              placeholder={``}
              className={`col-span-6`}
            /> */}
            {/* <InputField
          inputClass={`rounded-lg`}
          label={`Plan`}
          placeholder={``}
          className={`col-span-6`}
        /> */}
            <Dropdown
              label={`Plan`}
              placeholder={`Select Plan`}
              options={["Basic", "Professional", "Enterprise "]}
              onSelect={(value) => console.log(value)}
              className={``}
            />
            {/* <InputField
              inputClass={`rounded-lg`}
              label={`Employee Limit`}
              placeholder={``}
              className={`col-span-12`}
            /> */}
          </div>
        </div>

        <div className="grid grid-cols-12  gap-4 mt-4  ">
          <button className="py-3 px-5 col-span-8 md:col-span-10  bg-[#F6A62D] text-white] rounded-lg cursor-pointer">
            Create Farm
          </button>

          <button className="py-3 px-5 col-span-4 md:col-span-2   bg-[#E5E7EB] text-[#364153] rounded-lg cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFarm;

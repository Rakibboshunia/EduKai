import React from 'react'
import InputField from './InputField'
import Dropdown from './Dropdown'

const PreviousDatabase = () => {
  return (
    <div className='bg-white p-8'>
      <h3 className='text-[#2D468A] text-2xl font-semibold'>
        Import from Database Archive
      </h3>

      <div className='mt-5 grid grid-cols-12 gap-6 '>

        <Dropdown
          label="Set Database"
          labelClass={`font-semibold `}
          placeholder="Select CRM"
          options={[
              "Salesforce",
              "HubSpot",
              "Zoho CRM",
              "Custom CRM",
              "Other",
            ]}
          inputClass={`border border-[#D9D9D9] `}
          className={`col-span-12`}
        />
          
            <InputField
              label="API Key "
              labelClass={`font-semibold `}
              type="text"
              placeholder="Enter Your API Key"
              className="col-span-12  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
              
            />

            <InputField
              label="From Date "
              labelClass={`font-semibold `}
              type="date"
              placeholder="Enter Your API Key"
              className="col-span-6  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
            />
            

            <InputField
              label="To Date "
              labelClass={`font-semibold `}
              type="date"
              placeholder="Enter Your API Key"
              className="col-span-6  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
            />


            {/* <button className='bg-[#2D468A] text-white px-6 py-3 rounded-md mt-4 hover:bg-[#354e92] cursor-pointer '>
              Connect & Import
            </button> */}
      </div>
    </div>
  )
}
export default PreviousDatabase

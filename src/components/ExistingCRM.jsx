import React from 'react'
import InputField from './InputField'
import Dropdown from './Dropdown'

const ExistingCRM = () => {
  return (
    <div className='bg-white p-8'>
      <h3 className='text-[#2D468A] text-2xl font-semibold'>
        Connect to CRM System 
      </h3>

      <div className='mt-5 flex flex-col gap-6 '>

        <Dropdown
          label="CRM Provider"
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
        />
          
            <InputField
              label="API Key "
              labelClass={`font-semibold `}
              type="text"
              placeholder="Enter Your API Key"
              className="col-span-12  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
            />


            <button className='bg-[#2D468A] text-white px-6 py-3 rounded-md mt-4 hover:bg-[#354e92] cursor-pointer'>
              Connect & Import
            </button>
      </div>
    </div>
  )
}
export default ExistingCRM

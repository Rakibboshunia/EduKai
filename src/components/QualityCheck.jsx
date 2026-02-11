import React from 'react'
import Dropdown from './Dropdown'
import InputField from './InputField'

const QualityCheck = () => {
  return (
     <div className='bg-white/60 p-8 rounded-xl'>
      <h3 className='text-[#2D468A] text-2xl font-semibold'>
        Automated Quality Check Rules
      </h3>

      <div className='mt-5 grid grid-cols-12 gap-6 '>

        <Dropdown
          label="Minimum Years of Experience"
        //   labelClass={`font-semibold `}
          placeholder="Select Experience "
          options={[
              "1",
              "2",
              "3",
              "4",
              "5",
            ]}
          inputClass={`border border-[#D9D9D9] `}
          className={`col-span-6 text-black`}
        />
          
            <InputField
              label="Required Skills (comma separated) "
              labelClass={`font-semibold `}
              type="text"
              placeholder=" e.g. JavaScript, React, Node.js"
              className="col-span-6  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
              
            />

            <InputField
              label="Job Role Relevance "
              labelClass={`font-semibold `}
              type="text"
              placeholder="e.g. Software Developer, Fronted Engineer"
              className="col-span-12  "
              inputClass={`border border-[#D9D9D9] rounded-lg`}
            />
            
            {/* <button className='bg-[#2D468A] text-white px-6 py-3 rounded-md mt-4 hover:bg-[#354e92] cursor-pointer '>
              Connect & Import
            </button> */}
      </div>
     <div className='flex items-center gap-2 mt-7'>
        <input type="checkbox" defaultChecked className="checkbox checkbox-info w-4 h-4" />
        <p className='text-[#000000]'>
            Check formatting and completeness
        </p>
     </div>
    </div>
  )
}

export default QualityCheck

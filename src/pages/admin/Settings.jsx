import React from 'react'
import Breadcrumb from '../../components/Bredcumb'
import InputField from '../../components/InputField'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { LuSave } from 'react-icons/lu'
import UploadImage from '../../components/UploadImage'

const Settings = () => {
  return (
    <div>
        <div>
        <Breadcrumb />
       <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
         Configure settings for Farm check
        </p>
      </div>

        <div className="mt-6">
      <UploadImage label={`Farm Logo`} branding={`Farm`}  />

      </div>
      <div className='bg-white rounded-lg border-2 border-[#E5E7EB] mt-6 p-6'>
        <div className='flex items-center mb-4 gap-2'>
        <HiOutlineOfficeBuilding className='w-6 h-6 text-[#4A5565] ' />
        <h2 className="text-xl text-[#0A0A0A]  ">Farm Information</h2>
        </div>
        <InputField
          inputClass={`rounded-lg`}
          label={`Farm Name`}
          placeholder={`Enter your farm name`}
        />
        <p className='text-[#6A7282] mt-2'>This name will be displayed throughout the application</p>
      </div>

      <div className='flex justify-end'>
      <button className='bg-[#F6A62D] text-white px-6 py-3 rounded-lg mt-9  flex items-center gap-2 hover:bg-[#e5942b] cursor-pointer '>
        <LuSave className='w-6 h-6 ' />
        Save Changes
      </button>

      </div>

      
    </div>
  )
}

export default Settings

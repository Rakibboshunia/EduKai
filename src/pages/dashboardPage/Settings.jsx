import React from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import InputField from '../../components/InputField'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { LuSave } from 'react-icons/lu'
import UploadImage from '../../components/UploadImage'
import Dropdown from '../../components/Dropdown'
import Password from '../../components/Password'

const Settings = () => {
  return (
    <div>
        <div>
        <Breadcrumb />
       {/* <p className="text-[#4A5565] text-sm md:text-base mt-1.5">
         Configure settings for Farm check
        </p> */}
      </div>

      <div className='grid grid-cols-12 gap-x-6 gap-y-5 mt-10 '>
        <InputField
          label="First Name"
          type="text"
          placeholder="Your First Name"
          className="col-span-12 md:col-span-6  "
          inputClass={`bg-white`}
        />

         <InputField
          label="Last Name"
          type="text"
          placeholder="Your Last Name"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
        />

        <Dropdown
          label="Gender"
          placeholder="Select Gender"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
          options={["Male", "Female", "Other"]}
        />

        <Dropdown
          label="Country"
          placeholder="Select Country"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
          options={["USA", "Canada", "UK", "Australia"]}
        />

        <Dropdown
          label="Language"
          placeholder="Select Language"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
          options={["English", "Spanish", "French", "German"]}
        />

        <Dropdown
          label="Time Zone"
          placeholder="Select Time Zone"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
          options={["GMT", "EST", "PST", "CST"]}
        />

        <Password
          label="Password"
          placeholder="Enter your password"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
        />
        <Password
          label="Confirm Password"
          placeholder="Confirm your password"
          className="col-span-12 md:col-span-6 "
          inputClass={`bg-white`}
        />

      </div>

      

      
    </div>
  )
}

export default Settings

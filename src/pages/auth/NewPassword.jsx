import React from "react";

import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { Link } from "react-router-dom";
import Image from "../../components/Image";

const NewPassword = () => {
  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-10 md:px-11 px-12  rounded-3xl  ">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full ">

        <Image src="/authLogo.png" alt="logo" />
        <h3 className="font-inter font-medium text-[32px] text-[#333333] ">
          Set a new Password
        </h3>

        <p className="font-inter  text-[#333333]">
         Ensure it different from previous ones for security
        </p>

        
        
        <Password
          label="New Password"
          inputClass={`rounded-lg`}
          // placeholder="Enter your password"
        />

        <Password
          label="Confirm Password"
          inputClass={`rounded-lg`}
          // placeholder="Enter your password"
        />

        

       

        <Link className="w-full" to="/auth/success">
          <button className="bg-[#F6A62D] text-[#ffffff]  w-full py-3 rounded-lg cursor-pointer mt-12">
         Reset Password
          </button>
        </Link>

      </form>
    </main>
  );
};

export default NewPassword;
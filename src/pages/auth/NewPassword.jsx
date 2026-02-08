import React from "react";

import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { Link } from "react-router-dom";
import Image from "../../components/Image";

const NewPassword = () => {
  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-10 md:px-11 px-12  rounded-3xl  ">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full ">

        <h3 className="text-[#2D468A] font-semibold text-4xl">Edukai</h3>
        <h3 className="font-inter font-medium text-[32px] text-[#2D468A] ">
          Set a new Password
        </h3>

        <p className="font-inter  text-[#333333]">
         Ensure it different from previous ones for security
        </p>
   
        <Password
          label="New Password"
          placeholder="Enter your new password"
          inputClass={`rounded-lg border border-[#2D468A]`}
          // placeholder="Enter your password"
        />

        <Password
          label="Confirm Password"
          placeholder="Confirm your new password"
          inputClass={`rounded-lg border border-[#2D468A]`}
          // placeholder="Enter your password"
        />

        <Link className="w-full" to="/auth/success">
          <button className="bg-[#2D468A] text-[#ffffff]  w-full py-3 rounded-lg cursor-pointer mt-10 hover:bg-[#354e90] flex items-center justify-center gap-2">
         Reset Password
          </button>
        </Link>

      </form>
    </main>
  );
};

export default NewPassword;
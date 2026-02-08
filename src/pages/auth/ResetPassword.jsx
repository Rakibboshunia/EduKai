
import React from "react";

import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { Link } from "react-router-dom";
import Image from "../../components/Image";

const ResetPassword = () => {
  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-20 md:px-11 px-15 rounded-3xl  ">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full ">

        <h3 className="text-[#2D468A] font-semibold text-4xl">Edukai</h3>
        <h3 className="text-[32px] text-[#2D468A] font-medium">
          Forgot Password?
        </h3>

        <p className="font-inter  text-[#333333] mb-5">
         Enter your email to receive a OTP
        </p>

        
        <InputField
          type={`email`}
          inputClass={`rounded-lg border border-[#2D468A]`}
          label={`Email Address `}
          placeholder={`Enter your email address`}
        />

        <Link className="w-full" to="/auth/verify/otp">
          <button className="bg-[#2D468A] text-[#ffffff]  w-full py-3 rounded-lg cursor-pointer mt-8 hover:bg-[#354e90] flex items-center justify-center gap-2">
           Send
          </button>
        </Link>

      </form>
    </main>
  );
};

export default ResetPassword;

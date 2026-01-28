
import React from "react";

import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { Link } from "react-router-dom";
import Image from "../../components/Image";

const ResetPassword = () => {
  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-10 md:px-11 px-15 rounded-3xl  ">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full ">

        <Image src="/authLogo.png" alt="logo" />
        <p className="font-inter  text-[#00000]">
        Reset Password
        </p>

        <p className="font-inter  text-[#333333] mb-5">
         Enter your email to receive a OTP
        </p>

        
        <InputField
          type={`email`}
          inputClass={`rounded-lg`}
          label={`Email Address `}
          placeholder={``}
        />
       

       

        <Link className="w-full" to="/auth/verify/otp">
          <button className="bg-[#F6A62D] text-[#ffffff]  w-full py-3 rounded-lg cursor-pointer mt-12">
           Send
          </button>
        </Link>

      </form>
    </main>
  );
};

export default ResetPassword;

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../../components/Image";

const OTP = () => {
  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

const handleChange = (e, index) => {
  const value = e.target.value.replace(/[^0-9]/g, "");

  const newOtp = [...otp];
  newOtp[index] = value;   // empty হলেও সেট হবে
  setOtp(newOtp);

  if (value && index < 5) {
    inputs.current[index + 1].focus();
  }
};


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-10 md:px-11 px-12  rounded-3xl  ">
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full ">
        <Image src="/authLogo.png" alt="logo" />
        <h3 className="font-inter font-medium text-[32px] text-[#333333] ">
          Enter your OTP
        </h3>

        <p className="font-inter  text-[#333333] text-center">
       We sent a code to your email address. Please check your email for the
          6 digit code.
        </p>

        <div className="flex gap-4 justify-center my-10">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              value={otp[i]}
              className="appearance-none w-[47px] h-[49px] border border-[#F6A62D] rounded-[10px] text-center outline-none text-xl font-inter font-bold text-[#F6A62D] "
            />
          ))}
        </div>

        <Link className="w-full" to="/auth/new/password">
          <button className="bg-[#F6A62D] text-[#ffffff]  w-full py-3 rounded-lg cursor-pointer mt-12">
            Verify
          </button>
        </Link>
      </form>
    </main>
  );
};

export default OTP;

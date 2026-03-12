import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { verifyOtpApi } from "../../api/authApi.js";

const OTP = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!email) {
      navigate("/auth/reset/password");
    }

  }, [email, navigate]);

  const handleChange = (e, index) => {

    const value = e.target.value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;

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

  const handleSubmit = async (e) => {

    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    try {

      setLoading(true);

      await verifyOtpApi(email, otpCode);

      toast.success("OTP verified");

      setTimeout(() => {
        navigate("/auth/new/password", {
          state: {
            email,
            otp: otpCode
          }
        });
      }, 1000);

    } catch (error) {

      toast.error(
        error?.response?.data?.detail || "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="bg-white grid justify-center items-center py-10 md:px-11 px-12 rounded-3xl">

      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="gap-5 flex flex-col items-center md:w-md w-full"
      >

        <h3 className="text-[#2D468A] font-semibold text-4xl">
          Edukai
        </h3>

        <h3 className="font-inter font-medium text-[32px] text-[#2D468A]">
          Enter your OTP
        </h3>

        <p className="text-[#333333] text-center">
          We sent a code to your email address.
          Please check your email for the 6 digit code.
        </p>

        <div className="flex gap-4 justify-center my-10">

          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              value={otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-11 h-12 border border-[#2D468A] rounded-[10px] text-center outline-none text-xl font-bold text-[#2D468A]"
            />
          ))}

        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg flex items-center justify-center
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2D468A] text-white hover:bg-[#354e90]"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

      </form>

    </main>
  );
};

export default OTP;
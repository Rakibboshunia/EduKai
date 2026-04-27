import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
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
    <main className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">

      <form
        onSubmit={handleSubmit}
        className="gap-6 flex flex-col items-center w-full"
      >

        <h3 className="text-brand-primary font-semibold text-4xl">
          Edukai
        </h3>

        <h3 className="font-inter font-medium text-[32px] text-brand-primary">
          Enter your OTP
        </h3>

        <p className="text-[#333333] text-center">
          We sent a code to your email address.
          Please check your email for the 6 digit code.
        </p>

        <div className="flex gap-2 sm:gap-4 justify-center my-10 w-full">

          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              value={otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 sm:w-12 h-12 sm:h-14 border border-gray-300 rounded-xl text-center outline-none text-xl sm:text-2xl font-bold text-brand-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300 shadow-sm bg-white"
            />
          ))}

        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl flex items-center justify-center transition-all duration-300
          ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

      </form>

    </main>
  );
};

export default OTP;
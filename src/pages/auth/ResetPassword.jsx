import React, { useState } from "react";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import forgotPasswordApi  from "../../Api/authApi";

const ResetPassword = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {

      setLoading(true);

      const data = await forgotPasswordApi(email);

      toast.success(data?.detail || "OTP sent successfully");

      setTimeout(() => {
        navigate("/auth/verify/otp", {
          state: { email }
        });
      }, 1000);

    } catch (error) {

      toast.error(
        error?.response?.data?.detail || "Request failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="bg-white grid justify-center items-center overflow-y-auto hide-scrollbar py-20 md:px-11 px-6 rounded-3xl">

      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="gap-5 flex flex-col items-center md:w-[450px] w-full"
      >

        <h3 className="text-[#2D468A] font-semibold text-4xl">
          Edukai
        </h3>

        <h3 className="text-[32px] text-[#2D468A] font-medium">
          Forgot Password?
        </h3>

        <p className="text-[#333333] mb-5 text-center">
          Enter your email to receive an OTP
        </p>

        <InputField
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg mt-8 flex items-center justify-center
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2D468A] text-white hover:bg-[#354e90]"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>

      </form>

    </main>
  );
};

export default ResetPassword;
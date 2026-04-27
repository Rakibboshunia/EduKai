import React, { useState } from "react";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../api/authApi";

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
    <main className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">

      <form
        onSubmit={handleSubmit}
        className="gap-6 flex flex-col items-center w-full"
      >

        <h3 className="text-brand-primary font-semibold text-4xl">
          Edukai
        </h3>

        <h3 className="text-[32px] text-brand-primary font-medium">
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
          inputClass="rounded-lg border border-brand-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl mt-8 flex items-center justify-center transition-all duration-300
          ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
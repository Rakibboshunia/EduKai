import React, { useState, useEffect } from "react";
import Password from "../../components/Password";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../api/authApi";
import InputField from "../../components/InputField";

const NewPassword = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!email) {
      navigate("/auth/reset/password");
    }

  }, [email, navigate]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const data = await resetPasswordApi({
        email,
        new_password: password,
        new_password_confirm: confirmPassword
      });

      toast.success(data?.detail || "Password reset successful");

      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);

    } catch (error) {

      toast.error(
        error?.response?.data?.detail || "Password reset failed"
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

        <h3 className="text-[#2D468A] font-semibold text-4xl">
          Edukai
        </h3>

        <h3 className="font-medium text-[32px] text-[#2D468A]">
          Set a New Password
        </h3>

        <p className="text-[#333333] text-center">
          Ensure it is different from previous ones for security
        </p>

        <InputField
          type="email"
          label="Email Address"
          value={email || ""}
          disabled
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <Password
          label="New Password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <Password
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl mt-10 flex items-center justify-center transition-all duration-300
          ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-[#2D468A] to-[#1a3060] text-white hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </main>
  );
};

export default NewPassword;
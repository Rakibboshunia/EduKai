import React, { useState, useEffect } from "react";
import Password from "../../components/Password";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { resetPasswordApi } from "../../Api/authApi";
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
    <main className="bg-white grid justify-center items-center py-10 md:px-11 px-12 rounded-3xl">

      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="gap-5 flex flex-col items-center md:w-[450px] w-full"
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
          className={`w-full py-3 rounded-lg mt-10 flex items-center justify-center
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2D468A] text-white hover:bg-[#354e90]"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </main>
  );
};

export default NewPassword;
import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { MdLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LogIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");

      // Remember email logic
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Logged in successfully!");
      navigate("/dashboard", { replace: true });

      setLoading(false);
    }, 1000);
  };

  return (
    <main className="bg-white grid justify-center items-center py-16 md:px-11 px-6 rounded-3xl border border-[#E5E7EB] shadow-lg">
      <Toaster position="top-center" />

      <form
        onSubmit={handleLogin}
        className="gap-5 flex flex-col items-center md:w-md w-full"
      >
        <h3 className="text-[#2D468A] font-semibold text-4xl">Edukai</h3>

        <h3 className="text-[32px] text-[#2D468A] font-medium">
          Login to Account
        </h3>

        <p className="text-[#333333] text-center">
          Please enter your email and password to continue
        </p>

        <InputField
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <Password
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClass="rounded-lg border border-[#2D468A]"
        />

        <div className="w-full flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-[#333]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-[#2D468A]"
            />
            Remember Password
          </label>

          <Link
            to="/auth/reset/password"
            className="text-[#2D468A] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 cursor-pointer
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2D468A] text-white hover:bg-[#243a73]"
            }
          `}
        >
          <MdLogin />
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default LogIn;

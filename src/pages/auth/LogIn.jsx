import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import Password from "../../components/Password";
import { MdLogin, MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const LogIn = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      setLoading(true);

      const data = await loginApi(email, password);

      // ✅ user context e save
      loginUser(data.user);

      // ✅ localStorage e user save (page reload er jonno)
      localStorage.setItem("user", JSON.stringify(data.user));

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success(data.message || "Login successful");

      navigate("/", { replace: true });

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">

      <form
        onSubmit={handleLogin}
        className="gap-6 flex flex-col items-center w-full"
      >
        <h3 className="text-[#2D468A] font-semibold text-4xl">
          Edukai
        </h3>

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
        />

        <Password
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="w-full flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember Email
          </label>

          <Link to="/auth/reset/password">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2D468A] to-[#1a3060] text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <MdLogin />
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default LogIn;
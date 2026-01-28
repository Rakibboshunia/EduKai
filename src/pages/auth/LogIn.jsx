import React, { useState } from "react";
import InputField from "../../components/InputField";
import Password from "../../components/Password";
import Image from "../../components/Image";
import { MdLogin } from "react-icons/md";
import { Link } from "react-router-dom";
import toast, {  Toaster } from "react-hot-toast";

const LogIn = () => {
  const [role, setRole] = useState("Owner");
    const [loading, setLoading] = useState(false);

  const roleText = {
    Admin: {
      title: "Farm Admin",
      subtitle: "Access your farm management dashboard",
      redirect: "/admin/home",
    },
    Owner: {
      title: "System Owner",
      subtitle: "Secure access to farm management platform",
      redirect: "/",
    },
  };

  const handleLogin = () => {
    //  Save role
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");

    toast.success('Logged in successfully!')
    
    //  Redirect
    setTimeout(() => {
    window.location.href = roleText[role].redirect;
  }, 1000);
  };

  return (
    <main className="bg-white grid justify-center items-center py-10 md:px-11 px-15 rounded-3xl">
      <div><Toaster position="top-center"  /></div>
      <form className="gap-5 flex flex-col items-center md:w-[450px] w-full">
        <Image src="/authLogo.png" alt="logo" />

        <h3 className="text-[32px] font-medium">
          {roleText[role].title} Login
        </h3>

        <p>{roleText[role].subtitle}</p>

        <InputField
          type="email"
          label="Email Address"
          inputClass="rounded-lg"
        />
        <Password label="Password" inputClass="rounded-lg" />

        {/* Forgot password */}
        <Link
          to="/auth/reset/password"
          className="text-[#F6A62D] self-end text-sm"
        >
          Forgot Password?
        </Link>

        {/* ROLE SWITCH */}
        {/* <div className="flex gap-2 w-full">
          {["Owner", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                role === r ? "bg-[#F6A62D] text-white" : "bg-[#F1F5F9]"
              }`}
            >
              {r}
            </button>
          ))}
        </div> */}

        {/* LOGIN */}
        <button
          type="button"
          onClick={handleLogin}
          className="bg-[#F6A62D] text-white w-full py-3 rounded-lg mt-6 flex items-center justify-center gap-2 cursor-pointer"
        >
          <MdLogin />
          Login as {roleText[role].title}
        </button>
      </form>
    </main>
  );
};

export default LogIn;

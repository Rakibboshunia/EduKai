import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  return (
    <main className="bg-white grid justify-center items-center py-16 px-6 rounded-3xl shadow-lg border border-[#E5E7EB]">

      <div className="flex flex-col items-center text-center gap-6 md:w-[420px] w-full">

        <div className="bg-green-100 p-5 rounded-full">
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>

        <h3 className="font-semibold text-[32px] text-brand-primary">
          Password Updated Successfully!
        </h3>

        <p className="text-[#555] text-center leading-relaxed">
          Your new password has been saved successfully.  
          You can now log in to your account securely.
        </p>

        <Link to="/auth/login" className="w-full mt-4">

          <button className="w-full bg-gradient-to-r from-brand-primary to-brand-accent transition duration-200 text-white text-lg py-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5">
            Go to Login
          </button>

        </Link>

      </div>

    </main>
  );
};

export default Success;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOutUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logOutUser();
      navigate("/auth/login");
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [navigate, logOutUser]);

  return null; // no axios needed here
};

export default useAxiosSecure;
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const AxiosSecure = axios.create({
  baseURL: "https://test3.fireai.agency"
});

const useAxiosSecure = () => {

  const navigate = useNavigate();
  const { logOutUser } = useAuth();

  AxiosSecure.interceptors.request.use(
    function (config) {

      const token = localStorage.getItem("access-token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  AxiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {

      const status = error.response?.status;

      if (status === 401 || status === 403) {
        await logOutUser();
        navigate("/login");
      }

      return Promise.reject(error);
    }
  );

  return AxiosSecure;
};

export default useAxiosSecure;
import axiosInstance from "../api/axiosInstance";


export const loginApi = async (email, password) => {

  const res = await axiosInstance.post("/api/auth/login/", {
    email,
    password,
  });

  return res.data;
};

export const logoutApi = async () => {

  const res = await axiosInstance.post("/api/auth/logout/");

  return res.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await axiosInstance.post("/api/auth/forgot-password/", {
    email,
  });

  return res.data;
};

export const verifyOtpApi = async (email, otp) => {
  const res = await axiosInstance.post("/api/auth/verify-otp/", {
    email,
    otp,
  });

  return res.data;
};

export const resetPasswordApi = async (data) => {
  const res = await axiosInstance.post("/api/auth/reset-password/", data);

  return res.data;
};
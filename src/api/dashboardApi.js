import axiosInstance from "./axiosInstance";

// 🔹 Dashboard stats
export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/api/auth/dashboard/");
  return res.data;
};

// 🔹 Recent activity
export const getRecentActivities = async () => {
  const res = await axiosInstance.get("/api/auth/activity/");
  return res.data;
};
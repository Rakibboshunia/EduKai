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

// 🔹 Mark activity as read
export const markActivitiesAsRead = async () => {
  const res = await axiosInstance.post("/api/auth/activity/mark-read/");
  return res.data;
};
import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";

//dashboard pages
import Home from "../pages/dashboardPage/Home";
import Settings from "../pages/dashboardPage/Settings";



// auth
import LogIn from "../pages/auth/LogIn";
import ResetPassword from "../pages/auth/ResetPassword";
import NewPassword from "../pages/auth/NewPassword";
import Success from "../pages/auth/Success";
import OTP from "../pages/auth/OTP";
import BulkImport from "../pages/dashboardPage/BulkImport";

const router = createBrowserRouter([
  //  AUTH ROUTES
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "verify/otp", element: <OTP /> },
      { path: "new/password", element: <NewPassword /> },
      { path: "success", element: <Success /> },
    ],
  },

  //  DASHBOARD ROUTES
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      // admin
      { path: "/", element: <Home /> },
      { path: "cv/automation/platform", element: <BulkImport /> },
      
      { path: "settings", element: <Settings /> },
      

    
    ],
  },
]);

export default router;

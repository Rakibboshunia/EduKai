import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";

//dashboard pages
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import BulkImport from "../pages/BulkImport";
import Availability from "../pages/Availability";
import Tracking from "../pages/Tracking";
import Organizations from "../pages/Organizations";
import MailSubmission from "../pages/MailSubmission";
import CvQueue from "../pages/CvQueue";
import AiReWriter from "../pages/AiReWriter";

// auth
import LogIn from "../pages/auth/LogIn";
import ResetPassword from "../pages/auth/ResetPassword";
import NewPassword from "../pages/auth/NewPassword";
import Success from "../pages/auth/Success";
import OTP from "../pages/auth/OTP";


const router = createBrowserRouter([
  // AUTH ROUTES
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "verify/otp", element: <OTP /> },
      { path: "new/password", element: <NewPassword /> },
      { path: "success", element: <Success /> },
    ],
  },

  // DASHBOARD ROUTES
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cv/automation/platform", element: <BulkImport /> },
      { path: "availability", element: <Availability /> },
      { path: "settings", element: <Settings /> },
      { path: "tracking", element: <Tracking /> },
      { path: "organizations", element: <Organizations /> },
      { path: "mail/submission", element: <MailSubmission /> },
      { path: "cv/queue", element: <CvQueue /> },
      { path: "ai/re-writer", element: <AiReWriter /> },
    ],
  },

  {
    path: "*",
    element: <div>Page Not Found</div>,
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";

import Home from "../pages/Home";
import Settings from "../pages/Settings";
import BulkImport from "../pages/BulkImport";
import Availability from "../pages/Availability";
import Tracking from "../pages/Tracking";
import Organizations from "../pages/Organizations";
import CvQueue from "../pages/CvQueue";
import AICVRewriter from "../pages/AICVRewriter";
import EmailCompose from "../pages/EmailCompose";

import LogIn from "../pages/auth/LogIn";
import ResetPassword from "../pages/auth/ResetPassword";
import NewPassword from "../pages/auth/NewPassword";
import Success from "../pages/auth/Success";
import OTP from "../pages/auth/OTP";
import MailSubmission from "../pages/MailSubmission";


const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <LogIn /> },
      { path: "login", element: <LogIn /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "verify/otp", element: <OTP /> },
      { path: "new/password", element: <NewPassword /> },
      { path: "success", element: <Success /> },
    ],
  },

  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cv/automation/platform", element: <BulkImport /> },
      { path: "cv/queue", element: <CvQueue /> },
      { path: "availability", element: <Availability /> },
      { path: "tracking", element: <Tracking /> },
      { path: "settings", element: <Settings /> },

      { path: "ai/re-writer", element: <AICVRewriter /> },
      { path: "mail/submission", element: <MailSubmission/>},
      {
        path: "mail/submission/compose",
        element: <EmailCompose />,                                 
      },
                
      { path: "organizations", element: <Organizations /> },       
    ],
  },

  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        404 | Page Not Found
      </div>
    ),
  },
]);

export default router;

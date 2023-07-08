import { useRoutes } from "react-router-dom";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import Streams from "./pages/social/streams/Streams";
import { AuthTabs } from "./pages/auth/index";

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: <AuthTabs />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/app/social/streams",
      element: <Streams />,
    },
  ]);

  return elements;
};

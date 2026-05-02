import { useRoutes, Navigate } from "react-router-dom";

import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { commonRoutes } from "./common";

import { useUser } from "@/lib/auth";
import { NotFound } from "@/components/NotFound";
import { Spinner } from "@/components/Elements";

const getRedirectPath = (role: string | undefined): string => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin";
    case "floorattendant":
      return "/user";
    case "user":
    default:
      return "/user";
  }
};

const RootRedirect = () => {
  const user = useUser();

  // Wait for user data to load before making redirect decision
  if (user.isLoading) {
    return (
      <div className="w-100 h-100-vh d-flex justify-content-center align-items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // User is not logged in, redirect to login
  if (!user.data) {
    return <Navigate to="/auth/login" replace />;
  }

  // User is logged in, redirect to their dashboard
  const redirectPath = getRedirectPath(user.data.role);
  return <Navigate to={redirectPath} replace />;
};

export const AppRoutes = () => {
  const user = useUser();

  const initialRoute = {
    path: "/",
    element: <RootRedirect />,
  };
  const routes = user.data ? protectedRoutes : publicRoutes;

  const catchAllRoute = {
    path: "*",
    element: <NotFound />,
  };

  const element = useRoutes([initialRoute, ...routes, ...commonRoutes, ...protectedRoutes, ...publicRoutes, catchAllRoute]);

  return <>{element}</>;
};

import { useNavigate, Navigate } from "react-router-dom";

import { LoginForm } from "../components/LoginForm";
import { LoginLayout } from "../components/Layout";
import { useUser } from "@/lib/auth";
import { Spinner } from "@/components/Elements";

const getRedirectPath = (role: string | undefined): string => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin";
    case "floorattendant":
    case "user":
    default:
      return "/user";
  }
};

export const Login = () => {
  const navigate = useNavigate();
  const user = useUser();

  // Wait for auth check to complete
  if (user.isLoading) {
    return (
      <div className="w-100 h-100-vh d-flex justify-content-center align-items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // If user is already logged in, redirect to their dashboard
  if (user.data) {
    const redirectPath = getRedirectPath(user.data.role);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <LoginLayout title="Login">
      <LoginForm
        onSuccess={(user) => navigate(getRedirectPath(user.role))}
      />
    </LoginLayout>
  );
};

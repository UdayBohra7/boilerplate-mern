import { Navigate } from "react-router-dom";

import { LoginLayout } from "../components/Layout";
import { ForgetPasswordForm } from "../components/ForgetPasswordForm";
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

export const ForgetPassword = () => {
  const user = useUser();

  if (user.isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (user.data) {
    return <Navigate to={getRedirectPath(user.data.role)} replace />;
  }

  return (
    <LoginLayout title="Forget Password">
      <ForgetPasswordForm />
    </LoginLayout>
  );
};

import { Navigate } from "react-router-dom";

import { LoginLayout } from "../components/Layout";
import { OtpVerifyForm } from "../components/OtpVerifyForm";
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

export const OtpVerify = () => {
  const user = useUser();

  if (user.isLoading) {
    return (
      <div className="w-100 h-100-vh d-flex justify-content-center align-items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (user.data) {
    return <Navigate to={getRedirectPath(user.data.role)} replace />;
  }

  return (
    <LoginLayout title="Otp Verify">
      <OtpVerifyForm />
    </LoginLayout>
  );
};

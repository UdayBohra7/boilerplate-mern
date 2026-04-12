import React, { useEffect } from "react";
import { Spinner } from "@/components/Elements";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LandingLayout from "@/components/Layout/LandingLayout/Layout";
import { useUser } from "@/lib/auth";

const UserLayout = () => {
  return (
    <Suspense
      fallback={
        <div className="h-90-vh w-100 d-flex align-items-center justify-content-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
};

const Layout = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.data && user.data.role !== "user") {
      navigate("/");
    }
  }, [user]);
  
  return (
    <LandingLayout>
      <UserLayout />
    </LandingLayout>
  );
};

export default Layout;

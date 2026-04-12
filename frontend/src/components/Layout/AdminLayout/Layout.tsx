import React, { useEffect } from "react";
import { SidebarComponent } from "@/components/Layout/AdminLayout/Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";
import { Spinner } from "@/components/Elements";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/lib/auth";

const AdminLayout = () => {
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
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);

  useEffect(() => {
    if (user && user.data && user.data.role !== "admin") {
      navigate("/");
    }
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <main className="w-100 admin-main bg-white">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div className="admin-main-content" style={{ height: "90vh", overflow: "auto" }}>
          <AdminLayout />
        </div>
      </main>
    </div>
  );
};

export default Layout;

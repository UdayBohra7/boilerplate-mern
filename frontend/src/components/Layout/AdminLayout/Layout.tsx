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
        <div className="h-[90vh] w-full flex items-center justify-center">
          <Spinner size="xl" className="text-blue-600" />
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div className="flex-1 overflow-y-auto">
          <AdminLayout />
        </div>
      </main>
    </div>
  );
};

export default Layout;

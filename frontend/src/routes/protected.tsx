import AdminLayout from "@/components/Layout/AdminLayout/Layout";
import UserLayout from "@/components/Layout/UserLayout/Layout";
import { AdminRoutes } from "@/features/admin";
import { UserRoutes } from "@/features/user";

export const protectedRoutes = [
  {
    path: "/admin/*",
    element: <AdminLayout />,
    children: AdminRoutes,
  },
  {
    path: "/user/*",
    element: <UserLayout />,
    children: UserRoutes,
  },
];

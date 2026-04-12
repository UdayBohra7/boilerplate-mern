import { lazyImport } from "@/lib/lazyImport";
import { Navigate } from "react-router-dom";

const { Profile } = lazyImport(() => import("./Profile"), "Profile");

export const UserRoutes = [
  {
    path: "",
    element: <Navigate to="/user/profile" ></Navigate>,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];

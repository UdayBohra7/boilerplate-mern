import { Navigate } from 'react-router-dom';

export const commonRoutes = [
  {
    path: "/app",
    element: <Navigate to={"/owner"} />,
  },
];

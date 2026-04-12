import { useUser } from "@/lib/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const { pathname } = useLocation();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if ((pathname.includes("admin") || pathname.includes("user"))) {
      if (!user.isLoading && !user.data) {
        navigate("/auth/login");
      }
    }
  }, [pathname, user, navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

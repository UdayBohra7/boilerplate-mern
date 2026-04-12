import { useNavigate } from "react-router-dom";

import { RegisterForm } from "../components/RegisterForm";
import { LoginLayout } from "../components/Layout";

export const Register = () => {
  const navigate = useNavigate();

  return (
    <LoginLayout title="Register">
      <RegisterForm onSuccess={() => navigate('/admin')} />
    </LoginLayout>
  );
};

import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { ForgetPassword } from "./ForgetPassword";
import { ResetPassword } from "./ResetPassword";
import { OtpVerify } from "./OtpVerify";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forget" element={<ForgetPassword />} />
      <Route path="reset" element={<ResetPassword />} />
      <Route path="verify-otp" element={<OtpVerify />} />
    </Routes>
  );
};

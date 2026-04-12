import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import { useLogin } from "@/lib/auth";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { AuthUser } from "..";
import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";  

const schema = z.object({
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
});

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: (user: AuthUser) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <h2 className="auth-form-title">Sign In</h2>
          <p className="auth-form-subtitle">
            Enter your email and password to access your account
          </p>
          <Form<LoginValues, typeof schema>
            onSubmit={async (values) => {
              login.mutate(values, { onSuccess });
            }}
            options={{
              defaultValues: {
                email: "",
                password: "",
              },
            }}
            schema={schema}
          >
            {({ register, formState }) => (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">Email</label>
                  <input
                    type="email"
                    placeholder="example123@gmail.com"
                    {...register("email")}
                  />
                  {formState.errors.email && (
                    <span className="auth-error">
                      {formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Password</label>
                  <div className="password-input-container relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn bg-transparent p-0 border-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </button>
                  </div>
                  {formState.errors.password && (
                    <span className="auth-error">
                      {formState.errors.password.message}
                    </span>
                  )}
                </div>

                <div className="auth-options">
                  <label className="auth-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    to="#"
                    onClick={callAfterAnimateFn(() => navigate("/auth/forget"))}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={login.isLoading}
                >
                  {login.isLoading && <span className="auth-spinner" />}
                  Sign In
                </button>
              </>
            )}
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

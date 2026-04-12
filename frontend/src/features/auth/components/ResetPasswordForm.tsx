import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../api/forget";

const schema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least 1 letter")
      .regex(/\d/, "Password must contain at least 1 number"),
    confirm_password: z.string().min(1, "Please enter confirm password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ResetValues = {
  new_password: string;
  confirm_password: string;
};

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { animate } = useAnimateFn();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if reset token exists
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      toast.error("Session expired. Please try again.");
      navigate("/auth/forget");
    }
  }, []);

  const handleSubmit = async (values: ResetValues) => {
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      toast.error("Session expired. Please try again.");
      navigate("/auth/forget");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(resetToken, { password: values.new_password });
      
      // Clear stored tokens
      localStorage.removeItem("resetToken");
      localStorage.removeItem("emailToken");
      
      toast.success(response.message || "Password has been reset successfully!");
      navigate("/auth/login");
    } catch (error: any) {
      // Error is already handled by axios interceptor
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <h2 className="auth-form-title">Reset Password</h2>
          <p className="auth-form-subtitle">
            Your previous password has been reset. Please set a new<br />
            password for your account.
          </p>
          <Form<ResetValues, typeof schema>
            onSubmit={handleSubmit}
            schema={schema}
          >
            {({ register, formState }) => (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">New Password</label>
                  <div className="auth-password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...register("new_password")}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formState.errors.new_password && (
                    <span className="auth-error">
                      {formState.errors.new_password.message}
                    </span>
                  )}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...register("confirm_password")}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formState.errors.confirm_password && (
                    <span className="auth-error">
                      {formState.errors.confirm_password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading && <span className="auth-spinner" />}
                  Reset Password
                </button>
              </>
            )}
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

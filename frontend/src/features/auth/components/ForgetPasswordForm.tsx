import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import { toast } from "react-toastify";
import { forgetPassword } from "../api/forget";

const schema = z.object({
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
});

type ForgetValues = {
  email: string;
};

export const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ForgetValues) => {
    try {
      setLoading(true);
      const response = await forgetPassword({ email: values.email });
      
      // Store tokens for OTP verification and password reset
      localStorage.setItem("resetToken", response.data.resetToken);
      localStorage.setItem("emailToken", response.data.emailToken);
      
      toast.success(response.data.message || "Verification code has been sent to your email!");
      navigate("/auth/verify-otp");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <h2 className="auth-form-title">Forgot Password</h2>
          <p className="auth-form-subtitle">
            Don't worry, happens to all of us. Enter your email<br />
            below to recover your password.
          </p>
          <Form<ForgetValues, typeof schema>
            onSubmit={handleSubmit}
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

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading && <span className="auth-spinner" />}
                  Continue
                </button>
              </>
            )}
          </Form>
          <div className="auth-back-link">
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
            >
              Back to  SignIn
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import { useRegister } from "@/lib/auth";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";

const schema = z.object({
  name: z.string().min(1, "Please enter name"),
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
});

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerFn = useRegister();
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <h2 className="auth-form-title">Sign Up</h2>
          <p className="auth-form-subtitle">
            Create your account to get started
          </p>
          <Form<RegisterValues, typeof schema>
            onSubmit={async (values) => {
              registerFn.mutate(values, { onSuccess });
            }}
            schema={schema}
          >
            {({ register, formState }) => (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                  {formState.errors.name && (
                    <span className="auth-error">
                      {formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Email</label>
                  <input
                    type="email"
                    placeholder="example@email.com"
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
                  <input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {formState.errors.password && (
                    <span className="auth-error">
                      {formState.errors.password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={registerFn.isLoading}
                >
                  {registerFn.isLoading && <span className="auth-spinner" />}
                  Sign Up
                </button>
              </>
            )}
          </Form>
          <p className="auth-footer">
            Already have an account?
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

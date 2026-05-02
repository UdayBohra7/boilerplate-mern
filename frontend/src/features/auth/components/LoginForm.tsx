import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import { useLogin } from "@/lib/auth";
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
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
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
                <div className="mb-5">
                  <label className="block text-base font-normal text-[#8391A1] mb-1.5">Email</label>
                  <input
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-[#E8758B] focus:ring-2 focus:ring-[#E8758B]/15 transition-all"
                    type="email"
                    placeholder="example123@gmail.com"
                    {...register("email")}
                  />
                  {formState.errors.email && (
                    <span className="text-red-600 text-xs mt-1 block">
                      {formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-base font-normal text-[#8391A1] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      className="w-full px-3.5 py-3 pr-11 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-[#E8758B] focus:ring-2 focus:ring-[#E8758B]/15 transition-all"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </button>
                  </div>
                  {formState.errors.password && (
                    <span className="text-red-600 text-xs mt-1 block">
                      {formState.errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-gray-300 rounded cursor-pointer accent-[#E8758B]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-[13px] text-gray-500">Remember me</span>
                  </label>
                  <Link
                    to="#"
                    onClick={callAfterAnimateFn(() => navigate("/auth/forget"))}
                    className="text-[13px] text-black no-underline font-medium hover:text-[#D4757A] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#F882A1] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(232,117,139,0.5)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                  disabled={login.isLoading}
                >
                  {login.isLoading && <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />}
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

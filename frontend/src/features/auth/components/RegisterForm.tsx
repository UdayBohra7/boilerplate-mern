import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Form } from "@/components/Form";
import { useRegister } from "@/lib/auth";
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
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Sign Up</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
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
                <div className="mb-5">
                  <label className="block text-base font-normal text-[#8391A1] mb-1.5">Full Name</label>
                  <input
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-[#E8758B] focus:ring-2 focus:ring-[#E8758B]/15 transition-all"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                  {formState.errors.name && (
                    <span className="text-red-600 text-xs mt-1 block">
                      {formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-base font-normal text-[#8391A1] mb-1.5">Email</label>
                  <input
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-[#E8758B] focus:ring-2 focus:ring-[#E8758B]/15 transition-all"
                    type="email"
                    placeholder="example@email.com"
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
                  <input
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-[#E8758B] focus:ring-2 focus:ring-[#E8758B]/15 transition-all"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {formState.errors.password && (
                    <span className="text-red-600 text-xs mt-1 block">
                      {formState.errors.password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#F882A1] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(232,117,139,0.5)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                  disabled={registerFn.isLoading}
                >
                  {registerFn.isLoading && <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />}
                  Sign Up
                </button>
              </>
            )}
          </Form>
          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?
            <Link
              className="text-[#E8758B] no-underline font-medium ml-1 hover:underline"
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

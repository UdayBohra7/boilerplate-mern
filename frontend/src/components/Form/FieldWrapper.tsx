import clsx from "clsx";
import * as React from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: any;
  description?: string;
  blueLabel?: boolean;
  floating?: boolean;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, className, error, children } = props;
  return (
    <div className="mb-1 input-box">
      <label className={clsx("form-label", className)}>{label}</label>
      {children}
      <AnimatePresence>
        {error?.message && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            id="emailHelp"
            className="form-text text-danger form-error"
          >
            {error?.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// && error?.message

import clsx from "clsx";
import * as React from "react";

import { Spinner } from "@/components/Elements/Spinner";

const variants = {
  primary: "btn-primary",
  white: "btn-light",
  outline: "btn-outline-dark",
  danger: "btn-danger",
  success: "btn-success",
};

const sizes = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  disabled?: boolean;
} & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={clsx("btn", variants[variant], sizes[size], className)}
        {...props}
      >
        <div className="d-flex align-items-center justify-content-center">
          {isLoading && (
            <Spinner
              size="sm"
              variant={
                ["outline", "white"].includes(variant) ? "dark" : "light"
              }
              className="text-current"
            />
          )}
          {!isLoading && startIcon}
          {props.children && (
            <span className="mx-2">{props.children}</span>
          )}{" "}
          {!isLoading && endIcon}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";

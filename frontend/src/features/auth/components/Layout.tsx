import * as React from "react";
import { Head } from "@/components/Head";
import "../routes/auth.css";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const animations = {
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
};

export const LoginLayout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="auth-container">
        <div className="auth-card">
          {children}
        </div>
      </div>
    </>
  );
};

import * as React from "react";
import { Head } from "@/components/Head";

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
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#E53661] to-[#F882A1] p-5 md:p-10 relative">
        <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-16 w-full min-w-[320px] max-w-[700px] shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
};

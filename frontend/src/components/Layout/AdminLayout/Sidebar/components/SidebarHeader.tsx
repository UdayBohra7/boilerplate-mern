import React from "react";
import logo from "@/assets/logo.svg"
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}



export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  ...rest
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-4 space-y-4" {...rest}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
          <img src={logo} className="h-10 w-auto object-contain" alt="Admin Logo" />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-sm font-black text-gray-900 tracking-[0.2em] uppercase">Antigravity</h1>
        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Control Center</p>
      </div>
    </div>
  );
};

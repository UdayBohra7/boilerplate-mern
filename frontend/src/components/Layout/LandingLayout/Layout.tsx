import React from "react";
import Footer from "@/components/Layout/LandingLayout/Footer";
import Header from "@/components/Layout/LandingLayout/Header";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="landing-page">
      <Header />
      {children}
      <Footer />
      <style>{`
          .landing-page {
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}</style>
    </div>
  );
};

export default Layout;

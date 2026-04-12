import React from "react";
import { useUser } from "@/lib/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/lib/auth";

const Profile = () => {
  const logoutFn = useLogout();
  const user = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sample logout function; replace with your actual logic
  const handleLogout = () => {
    logoutFn.mutate({}, { onSuccess: () => {
      navigate('/auth/login');
    }})
    // Add logout logic here (clear tokens/state, etc.)
  };

  return (
    <div className="profile-section" style={{ position: "relative" }}>
      <div
        className="profile-clickable"
        onClick={() => setDropdownOpen((open) => !open)}
        tabIndex={0}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img
          src="https://randomuser.me/api/portraits/men/74.jpg"
          alt="profile"
          className="profile-icon"
        />
        <span className="profile-name">{user.data.name}</span>
      </div>
      {dropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li onClick={() => { setDropdownOpen(false); navigate("/user/profile"); }}>Profile</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
      <style>{`
        .profile-dropdown {
          position: absolute;
          top: 38px;
          right: 0;
          background: #212121;
          border-radius: 8px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          z-index: 105;
          min-width: 132px;
        }
        .profile-dropdown ul {
          list-style: none;
          padding: 0.5rem 0;
          margin: 0;
        }
        .profile-dropdown li {
          padding: 0.6rem 1.2rem;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-dropdown li:hover {
          background: #282c34;
        }
      `}</style>
    </div>
  );
};


const Auth = () => {
  const navigate = useNavigate();
  return (
    <div className="profile-section">
      <button onClick={() => navigate("/auth/login")} className="login-btn">
        Login
      </button>
    </div>
  );
};

const Header = () => {
  const user = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <header className="header">
      <div className="logo-container">
        <span className="site-title">LOGO</span>
      </div>
      <nav className="nav">
        {/* Profile and Login always visible on desktop */}
        {user.data ? <Profile /> : <Auth />}
        {/* Hamburger only visible on mobile */}
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
      {/* Drawer menu for mobile */}
      {drawerOpen && (
        <div className="mobile-drawer" onClick={() => setDrawerOpen(false)}>
          <ul>
            <li>Home</li>
            <li>Features</li>
            <li>Contact</li>
          </ul>
        </div>
      )}
    </header>
    <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 2rem;
          background: #282c34;
          color: #fff;
          position: relative;
        }
        .logo-container {
          display: flex;
          align-items: center;
        }
        .logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 0.8rem;
        }
        .site-title {
          font-size: 1.3rem;
          font-weight: bold;
        }
        .nav {
          display: flex;
          align-items: center;
        }
        .profile-section {
          display: flex;
          align-items: center;
        }
        .profile-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 0.6rem;
          background: #fff;
        }
        .profile-name {
          font-size: 1rem;
          margin-right: 1.1rem;
        }
        .login-btn {
          background: #61dafb;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1.2rem;
          color: #282c34;
          font-weight: 600;
          cursor: pointer;
        }
        .login-btn:hover {
          background: #21a1f3;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 1.5rem;
          outline: none;
        }
        .bar {
          display: block;
          width: 26px;
          height: 3px;
          margin: 5px 0;
          background-color: #fff;
          transition: 0.4s;
          border-radius: 3px;
        }
        .mobile-drawer {
          display: none;
        }
        /* Desktop styles: full nav/profile visible, mobile-drawer hidden */
        @media (max-width: 700px) {
          .profile-section {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .mobile-drawer {
            display: block;
            position: absolute;
            top: 60px;
            right: 0;
            width: 170px;
            background: #212121;
            border-radius: 0 0 0 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            z-index: 101;
            padding: 1rem 1rem 1rem 2rem;
          }
          .mobile-drawer ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .mobile-drawer li {
            padding: 0.7rem 0;
            font-size: 1.1rem;
            color: #fff;
            cursor: pointer;
          }
        }
        /* Desktop: show all nav/profile, hide hamburger/drawer */
        @media (min-width: 701px) {
          .hamburger, .mobile-drawer {
            display: none !important;
          }
          .profile-section {
            display: flex;
          }
        }
      `}</style>
    </>

  );
};

export default Header;

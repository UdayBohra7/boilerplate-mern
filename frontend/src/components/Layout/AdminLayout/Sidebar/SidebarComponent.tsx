import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "./components/SidebarHeader";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/lib/auth";
const themes = {
  light: {
    sidebar: {
      backgroundColor: "#FFFFFF",
      boxShadow: "10px 0 30px -10px rgba(0, 0, 0, 0.04)",
      color: "#64748B",
    },
    menu: {
      menuContent: "#64748B",
      icon: "#94A3B8",
      hover: {
        backgroundColor: "#F8FAFC",
        color: "#2563EB",
      },
      active: {
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
      },
      disabled: {
        color: "rgba(100, 116, 139, 0.5)",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Menu items configuration
const menuItems = [
  { id: "", label: "Dashboard", icon: "fa-solid fa-grip", path: "/admin" },
  {
    id: "users",
    label: "User Directory",
    icon: "fa-solid fa-users",
    path: "/admin/users",
  },
  {
    id: "content",
    label: "Legal Content",
    icon: "fa-solid fa-file-shield",
    path: "/admin/content",
  },
  {
    id: "help-support",
    label: "Help & Support",
    icon: "fa-solid fa-headset",
    path: "/admin/help-support",
  },
  {
    id: "app-settings",
    label: "Banner Config",
    icon: "fa-solid fa-sliders",
    path: "/admin/app-settings",
  },
  {
    id: "settings",
    label: "Profile Settings",
    icon: "fa-solid fa-user-gear",
    path: "/admin/settings",
  },
];

export const SidebarComponent = ({
  toggled,
  setToggled,
  setBroken,
}: {
  toggled: boolean;
  setToggled: (i: boolean) => void;
  setBroken: (i: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutFn = useLogout();

  const to = (url: string) => () => {
    navigate(url);
    if (toggled) setToggled(false);
  };

  const handleLogout = () => {
    logoutFn.mutate(
      {},
      {
        onSuccess: () => {
          navigate("/auth/login");
        },
      }
    );
  };

  // Get active menu item based on current path
  const getActiveItem = () => {
    const pathName = location.pathname;
    const parts = pathName.split("/");
    if (parts.length > 2) {
      return parts[2];
    }
    return "";
  };

  const active = getActiveItem();

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 600,
      fontFamily: 'inherit',
    },
    icon: {
      color: themes.light.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      fontSize: "18px",
    },
    SubMenuExpandIcon: {
      color: themes.light.menu.icon,
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: level === 0 ? "rgba(0, 0, 0, 0.01)" : "transparent",
    }),
    button: {
      margin: "6px 16px",
      borderRadius: "14px",
      padding: "10px 16px",
      transition: "all 0.3s ease",
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: themes.light.menu.hover.backgroundColor,
        color: themes.light.menu.hover.color,
        transform: "translateX(4px)",
      },
      [`&.ps-active`]: {
        backgroundColor: themes.light.menu.active.backgroundColor,
        color: themes.light.menu.active.color,
        boxShadow: "0 4px 12px -2px rgba(37, 99, 235, 0.08)",
      },
      [`&.ps-active .ps-menu-icon`]: {
        color: themes.light.menu.active.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 700 : 600,
      letterSpacing: "-0.01em",
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Sidebar
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        className="admin-sidebar border-r border-gray-100 shadow-2xl shadow-gray-200/20"
        backgroundColor={themes.light.sidebar.backgroundColor}
        rootStyles={{
          color: themes.light.sidebar.color,
          height: '100vh',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="py-8">
            <SidebarHeader />
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <Menu menuItemStyles={menuItemStyles}>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={to(item.path)}
                  active={active === item.id}
                  icon={
                    <i className={item.icon} />
                  }
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Logout Section */}
          <div className="p-6 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-3">
                <i className="fa-solid fa-arrow-right-from-bracket text-lg group-hover:rotate-12 transition-transform"></i>
                <span className="font-bold text-sm tracking-tight">Sign Out</span>
              </div>
              <div className="absolute inset-0 bg-rose-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <div className="mt-6 px-4 py-3 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-[10px]">AD</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-900 truncate tracking-tight">Admin System</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">v2.4.0</p>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};

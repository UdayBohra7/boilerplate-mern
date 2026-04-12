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
      backgroundColor: "#FFEFF3",
      boxShadow: "0px 8px 28px 0px rgba(0, 0, 0, 0.05)",
      color: "#4A4A4A",
    },
    menu: {
      menuContent: "#4A4A4A",
      icon: "#4A4A4A",
      hover: {
        backgroundColor: "rgba(212, 165, 165, 0.15)",
        color: "#4A4A4A",
      },
      active: {
        backgroundColor: "#F882A1",
        color: "#FFFFFF",
      },
      disabled: {
        color: "rgba(74, 74, 74, 0.5)",
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
    id: "products",
    label: "Manage Product ",
    icon: "fa-solid fa-boxes-stacked",
    path: "/admin/products",
  },
  {
    id: "categories",
    label: "Manage Category",
    icon: "fa-solid fa-layer-group",
    path: "/admin/categories",
  },
  {
    id: "users",
    label: "Manage User",
    icon: "fa-solid fa-users",
    path: "/admin/users",
  },
  {
    id: "community",
    label: "Community",
    icon: "fa-solid fa-comments",
    path: "/admin/community",
  },
  {
    id: "meals",
    label: "Marissa Meal Collection",
    icon: "fa-solid fa-utensils",
    path: "/admin/meals",
  },
  // { id: "content", label: "Content Management", icon: "fa-solid fa-file-lines", path: "/admin/content" },
  {
    id: "content",
    label: "Content Management",
    icon: "fa-solid fa-file-lines",
    path: "/admin/content",
  },
  {
    id: "subscription-plans",
    label: "Subscription",
    icon: "fa-solid fa-dollar-sign",
    path: "/admin/subscription-plans",
  },
  {
    id: "help-support",
    label: "Help & Support",
    icon: "fa-solid fa-headset",
    path: "/admin/help-support",
  },
  {
    id: "reports",
    label: "  Reports & Analytics",
    icon: "fa-solid fa-chart-line",
    path: "/admin/reports",
  },
  {
    id: "push-notifications",
    label: "Push Notifications",
    icon: "fa-solid fa-bell",
    path: "/admin/push-notifications",
  },
  {
    id: "app-settings",
    label: "App Settings",
    icon: "fa-solid fa-mobile-screen",
    path: "/admin/app-settings",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "fa-solid fa-gear",
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
      fontSize: "14px",
      fontWeight: 400,
    },
    icon: {
      color: themes.light.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: themes.light.menu.icon,
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: level === 0 ? "rgba(0, 0, 0, 0.02)" : "transparent",
    }),
    button: {
      margin: "4px 12px",
      borderRadius: "8px",
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: themes.light.menu.hover.backgroundColor,
        color: themes.light.menu.hover.color,
      },
      [`&.ps-active`]: {
        backgroundColor: themes.light.menu.active.backgroundColor,
        color: themes.light.menu.active.color,
        fontWeight: 500,
      },
      [`&.ps-active .ps-menu-icon`]: {
        color: themes.light.menu.active.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Sidebar
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        className="admin-sidebar border-0"
        backgroundColor={hexToRgba(themes.light.sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes.light.sidebar.color,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <SidebarHeader style={{ marginBottom: "16px", marginTop: "16px" }} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Menu menuItemStyles={menuItemStyles}>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={to(item.path)}
                  active={active === item.id}
                  icon={
                    <i className={item.icon} style={{ fontSize: "16px" }} />
                  }
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
          {/* Logout Button */}
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "8px",
                color: "#E85A5A",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(232, 90, 90, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <i
                className="fa-solid fa-arrow-right-from-bracket"
                style={{ fontSize: "16px" }}
              ></i>
              Logout
            </button>
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};

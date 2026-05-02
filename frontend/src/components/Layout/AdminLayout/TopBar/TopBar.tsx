import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogout, useUser } from "@/lib/auth";
import userProfileImg from "@/assets/image.png";
import { getImageUrl } from "@/helper/getImageUrl";

export default function TopBar({
  toggled,
  broken,
  setToggled,
}: {
  toggled: boolean;
  broken: boolean;
  setToggled: (i: boolean) => void;
}) {
  const user = useUser();
  const logoutFn = useLogout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logout = () => {
    logoutFn.mutate(
      {},
      {
        onSuccess: () => {
          handleMenuClose();
          navigate("/auth/login");
        },
      }
    );
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const goToSettings = () => {
    handleMenuClose();
    navigate("/admin/settings");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }
        }
      }}
    >
      <MenuItem onClick={goToSettings} sx={{ py: 1.5 }}>
        <i className="fa-solid fa-gear me-3" style={{ color: "#636E72" }}></i>
        Settings
      </MenuItem>
      <MenuItem onClick={logout} sx={{ py: 1.5, color: "#E85A5A" }}>
        <i className="fa-solid fa-arrow-right-from-bracket me-3"></i>
        Logout
      </MenuItem>
    </Menu>
  );


  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }
        }
      }}
    >
      <MenuItem onClick={goToSettings} sx={{ py: 1.5 }}>
        <i className="fa-solid fa-gear me-3" style={{ color: "#636E72" }}></i>
        Settings
      </MenuItem>
      <MenuItem onClick={logout} sx={{ py: 1.5, color: "#E85A5A" }}>
        <i className="fa-solid fa-arrow-right-from-bracket me-3"></i>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <motion.div
      className="admin-topbar"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box sx={{ flexGrow: 1, background: "#FFF" }}>
        <AppBar sx={{ background: "#FFF", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }} color="default" position="static">
          <Toolbar>
            {broken && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2, color: "#2D3436" }}
                onClick={() => setToggled(!toggled)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <div className="flex items-center gap-6">
              
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900 tracking-tight leading-none">{user?.data?.name ?? "Admin"}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
                </div>
                
                <button
                  onClick={handleProfileMenuOpen}
                  className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-95 transition-transform">
                    {user?.data?.image ? (
                      <img
                        src={getImageUrl(user?.data?.image)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = userProfileImg
                        }}
                        alt="profile"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <i className="fa-solid fa-user text-lg"></i>
                      </div>
                    )}
                  </div>
                  <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 mr-2 group-hover:translate-y-0.5 transition-transform"></i>
                </button>
              </Box>

              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon className="text-gray-900" />
                </IconButton>
              </Box>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </motion.div>
  );
}

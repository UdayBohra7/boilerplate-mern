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
            <div className="top-bar-flex py-3 d-flex align-items-center gap-4">
              
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: "#2D3436", fontWeight: 500 }}>{user?.data?.name ?? "Admin"}</Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user?.data?.image ?
                    <img
                      src={getImageUrl(user?.data?.image)}
                      className="rounded-circle object-fit-cover"
                      height={40}
                      width={40}
                      onError={(e) => {
                        e.currentTarget.src = userProfileImg
                      }}
                      alt="profile"
                    />
                    : <AccountCircle style={{ color: "#D4A5A5", fontSize: "36px" }} />
                  }
                </IconButton>
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
                  <MoreIcon style={{ color: "#2D3436" }} />
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

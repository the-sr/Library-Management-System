import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";

const roleColors = {
  ADMIN: "error",
  LIBRARIAN: "primary",
  MEMBER: "success",
};

const AppBar = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar, themeMode, toggleTheme } = useUiStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const isDark = themeMode === "dark";

  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            color: "primary.main",
            "&:hover": { bgcolor: "primary.main", color: "#fff" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            Library Management System
          </Typography>
        </Box>

        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              mr: 1,
              color: isDark ? "secondary.main" : "primary.main",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,183,77,0.12)" : "rgba(57,73,171,0.12)",
              },
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        <Chip
          label={user?.role}
          size="small"
          color={roleColors[user?.role] || "default"}
          sx={{ mr: 1.5, fontWeight: 600, display: { xs: "none", sm: "flex" } }}
        />

        <Tooltip title="Account">
          <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                fontWeight: 700,
                fontSize: "0.95rem",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1, minWidth: 180, borderRadius: 2 },
          }}
        >
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/my-profile");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

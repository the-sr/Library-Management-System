import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Books", icon: <MenuBookIcon />, path: "/books" },
  { text: "My Borrowings", icon: <AssignmentIcon />, path: "/my-borrowings", roles: ["MEMBER"] },
  { text: "Borrow Requests", icon: <AssignmentIcon />, path: "/borrow-requests", roles: ["LIBRARIAN"] },
  { text: "Return Requests", icon: <AssignmentReturnIcon />, path: "/return-requests", roles: ["LIBRARIAN"] },
  { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["ADMIN", "LIBRARIAN"] },
  { text: "Create User", icon: <PersonAddIcon />, path: "/admin/create-user", roles: ["ADMIN"] },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports", roles: ["ADMIN"] },
];

const roleColors = {
  ADMIN: "error",
  LIBRARIAN: "primary",
  MEMBER: "success",
};

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? drawerWidth : 0,
          boxSizing: "border-box",
          transition: "width 0.3s",
          borderRight: "none",
          bgcolor: "background.paper",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", pt: 1, display: "flex", flexDirection: "column", height: "calc(100% - 64px)" }}>
        {/* Logo section */}
        <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 24, color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: "primary.main" }}>
              LMS
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              Library System
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mx: 2, mb: 1 }} />

        {/* Main navigation */}
        <Typography
          variant="caption"
          sx={{ px: 2.5, py: 1, fontWeight: 700, color: "text.secondary", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}
        >
          Menu
        </Typography>
        <List sx={{ px: 1.5 }}>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  position: "relative",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                    "& .MuiListItemText-primary": { color: "#fff" },
                  },
                  ...(isActive && {
                    bgcolor: "primary.main",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                    "& .MuiListItemText-primary": { color: "#fff" },
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, mt: 1 }} />

        {/* Profile section */}
        <Typography
          variant="caption"
          sx={{ px: 2.5, py: 1, mt: 1, fontWeight: 700, color: "text.secondary", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}
        >
          Account
        </Typography>
        <List sx={{ px: 1.5 }}>
          <ListItemButton
            selected={location.pathname === "/my-profile"}
            onClick={() => navigate("/my-profile")}
            sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "primary.main",
                color: "#fff",
                "& .MuiListItemIcon-root": { color: "#fff" },
              },
              ...(location.pathname === "/my-profile" && {
                bgcolor: "primary.main",
                color: "#fff",
                "& .MuiListItemIcon-root": { color: "#fff" },
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" primaryTypographyProps={{ fontSize: "0.9rem" }} />
          </ListItemButton>
        </List>

        {/* User info card */}
        <Box sx={{ mt: "auto", p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "primary.main",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user?.name}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                color={roleColors[user?.role] || "default"}
                sx={{ height: 20, fontSize: "0.65rem", mt: 0.3 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export { drawerWidth };
export default Sidebar;

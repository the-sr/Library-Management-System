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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { canManageUsers, canHandleBorrowRequests, canGenerateReports } from "../../utils/roles";

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
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", pt: 1 }}>
        <List>
          {filteredItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate("/my-profile")}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export { drawerWidth };
export default Sidebar;

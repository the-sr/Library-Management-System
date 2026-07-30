import { Box, Toolbar, Container } from "@mui/material";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";
import { drawerWidth } from "./Sidebar";
import useUiStore from "../../stores/uiStore";

const Layout = ({ children }) => {
  const { sidebarOpen } = useUiStore();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;

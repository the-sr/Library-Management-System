import { Box, Typography, useTheme } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const AuthLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left panel - branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)",
          },
        }}
      >
        <Box sx={{ position: "relative", textAlign: "center", px: 4 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "24px",
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <MenuBookIcon sx={{ fontSize: 56, color: "#fff" }} />
          </Box>
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800, mb: 1 }}>
            Library
          </Typography>
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            Management System
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 320, mx: "auto", lineHeight: 1.6 }}
          >
            Discover, borrow, and manage books with ease. Your digital library awaits.
          </Typography>
        </Box>
      </Box>

      {/* Right panel - form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
              LMS
            </Typography>
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;

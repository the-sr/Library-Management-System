import { CircularProgress, Box, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const LoadingSpinner = ({ size = 48, message = "Loading..." }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    py={6}
    gap={2}
  >
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: "primary.main",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <MenuBookIcon sx={{ fontSize: size * 0.35, color: "primary.main" }} />
      </Box>
    </Box>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      {message}
    </Typography>
  </Box>
);

export default LoadingSpinner;

import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = ({ size = 40 }) => (
  <Box display="flex" justifyContent="center" alignItems="center" py={4}>
    <CircularProgress size={size} />
  </Box>
);

export default LoadingSpinner;

import { Box, Button, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ChevronLeftIcon />}
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>
      <Typography variant="body2">
        Page {currentPage + 1} of {totalPages}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        endIcon={<ChevronRightIcon />}
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;

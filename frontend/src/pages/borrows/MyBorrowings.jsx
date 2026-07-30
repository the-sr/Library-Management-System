import { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import {
  getUserBooks,
  cancelBorrowRequest,
  returnRequest,
  cancelReturnRequest,
} from "../../api/userBooks";
import { formatDate } from "../../utils/format";

const MyBorrowings = () => {
  const { user } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelType, setCancelType] = useState("");

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const res = await getUserBooks({ userId: user.id, isActive: true });
      setBorrowings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleReturnRequest = async (userBookId) => {
    try {
      await returnRequest(userBookId);
      showSnackbar("Return request sent", "success");
      fetchBorrowings();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed", "error");
    }
  };

  const handleCancel = async () => {
    try {
      if (cancelType === "borrow") {
        await cancelBorrowRequest(cancelId);
      } else {
        await cancelReturnRequest(cancelId);
      }
      showSnackbar("Request cancelled", "success");
      fetchBorrowings();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed", "error");
    }
    setCancelId(null);
  };

  const statusColor = (req) => {
    if (req.requestType === "BORROW") return "warning";
    if (req.requestType === "RETURN") return "info";
    return "success";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Borrowings
      </Typography>

      {loading ? (
        <LoadingSpinner />
      ) : borrowings.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Borrowed Date</TableCell>
                <TableCell>Expected Return</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.book?.title || "Book"}</TableCell>
                  <TableCell>{formatDate(b.borrowedDate)}</TableCell>
                  <TableCell>{formatDate(b.expectedReturnDate)}</TableCell>
                  <TableCell>{formatDate(b.returnDate)}</TableCell>
                  <TableCell>
                    {b.fineAmount > 0 ? `$${b.fineAmount.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={b.requestType || "Active"}
                      color={statusColor(b)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {!b.requestType && (
                      <Button
                        size="small"
                        startIcon={<AssignmentReturnIcon />}
                        onClick={() => handleReturnRequest(b.id)}
                        sx={{ mr: 1 }}
                      >
                        Return
                      </Button>
                    )}
                    {b.requestType && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setCancelId(b.book?.id || b.id);
                          setCancelType(b.requestType === "BORROW" ? "borrow" : "return");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">No active borrowings</Typography>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Request"
        message="Are you sure you want to cancel this request?"
        onConfirm={handleCancel}
        onClose={() => setCancelId(null)}
      />
    </Box>
  );
};

export default MyBorrowings;

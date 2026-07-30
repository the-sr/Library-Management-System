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
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useUiStore from "../../stores/uiStore";
import { getUserBooks, handleBorrowRequest, handleReturnRequest } from "../../api/userBooks";
import { formatDate } from "../../utils/format";

const BorrowRequests = () => {
  const { showSnackbar } = useUiStore();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getUserBooks({ requestType: "BORROW", pageNumber: page, pageSize: 10 });
      setRequests(Array.isArray(res.data) ? res.data : res.data?.res || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const handleApprove = async (userBookId) => {
    try {
      await handleBorrowRequest(userBookId);
      showSnackbar("Borrow request approved", "success");
      fetchRequests();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed", "error");
    }
    setConfirmAction(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pending Borrow Requests
      </Typography>

      {loading ? (
        <LoadingSpinner />
      ) : requests.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Book</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.user?.name || "User"}</TableCell>
                    <TableCell>{req.book?.title || "Book"}</TableCell>
                    <TableCell>{formatDate(req.borrowedDate)}</TableCell>
                    <TableCell>
                      <Chip label={req.requestType} color="warning" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Approve">
                        <IconButton
                          color="success"
                          onClick={() => setConfirmAction({ type: "borrow", id: req.id })}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <Typography color="text.secondary">No pending borrow requests</Typography>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title="Approve Borrow Request"
        message="Are you sure you want to approve this borrow request?"
        onConfirm={() => handleApprove(confirmAction?.id)}
        onClose={() => setConfirmAction(null)}
      />
    </Box>
  );
};

export default BorrowRequests;

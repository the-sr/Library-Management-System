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
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useUiStore from "../../stores/uiStore";
import { getUserBooks, handleReturnRequest } from "../../api/userBooks";
import { formatDate } from "../../utils/format";

const ReturnRequests = () => {
  const { showSnackbar } = useUiStore();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getUserBooks({ requestType: "RETURN", pageNumber: page, pageSize: 10 });
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
      await handleReturnRequest(userBookId);
      showSnackbar("Return request approved", "success");
      fetchRequests();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed", "error");
    }
    setConfirmId(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pending Return Requests
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
                  <TableCell>Borrowed Date</TableCell>
                  <TableCell>Fine</TableCell>
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
                      {req.fineAmount > 0 ? (
                        <Chip label={`$${req.fineAmount.toFixed(2)}`} color="error" size="small" />
                      ) : (
                        <Chip label="None" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Approve Return">
                        <IconButton
                          color="success"
                          onClick={() => setConfirmId(req.id)}
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
        <Typography color="text.secondary">No pending return requests</Typography>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Approve Return"
        message="Are you sure you want to approve this return request?"
        onConfirm={() => handleApprove(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </Box>
  );
};

export default ReturnRequests;

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
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useUiStore from "../../stores/uiStore";
import { getUserBooks, handleBorrowRequest } from "../../api/userBooks";
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
          <TableContainer
            component={Paper}
            sx={{
              "& .MuiTableCell-root": { py: 1.5 },
              "& .MuiTableRow-root:nth-of-type(odd)": { bgcolor: "grey.50" },
              "& .MuiTableRow-root:hover": { bgcolor: "primary.main", color: "#fff", "& .MuiTableCell-root": { color: "#fff" } },
            }}
          >
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
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "warning.main", fontWeight: 700, fontSize: "0.8rem" }}>
                          {req.user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={500}>{req.user?.name || "User"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{req.book?.title || "Book"}</TableCell>
                    <TableCell>{formatDate(req.borrowedDate)}</TableCell>
                    <TableCell>
                      <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Approve">
                        <IconButton
                          color="success"
                          onClick={() => setConfirmAction({ type: "borrow", id: req.id })}
                          sx={{
                            "&:hover": { bgcolor: "success.main", color: "#fff" },
                          }}
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
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary" variant="h6">No pending borrow requests</Typography>
        </Paper>
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

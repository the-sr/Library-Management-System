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
  Avatar,
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
                  <TableCell>Borrowed Date</TableCell>
                  <TableCell>Fine</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "info.main", fontWeight: 700, fontSize: "0.8rem" }}>
                          {req.user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={500}>{req.user?.name || "User"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{req.book?.title || "Book"}</TableCell>
                    <TableCell>{formatDate(req.borrowedDate)}</TableCell>
                    <TableCell>
                      {req.fineAmount > 0 ? (
                        <Chip label={`$${req.fineAmount.toFixed(2)}`} color="error" size="small" sx={{ fontWeight: 600 }} />
                      ) : (
                        <Chip label="None" color="success" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Approve Return">
                        <IconButton
                          color="success"
                          onClick={() => setConfirmId(req.id)}
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
          <Typography color="text.secondary" variant="h6">No pending return requests</Typography>
        </Paper>
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

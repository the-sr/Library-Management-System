import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useUiStore from "../../stores/uiStore";
import { getPageWiseUsers, deleteUser } from "../../api/users";
import { formatDate } from "../../utils/format";

const UserList = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useUiStore();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { pageNumber: page, pageSize: 10, sortBy: "id", sortDirection: "asc" };
      if (statusFilter !== "") params.status = statusFilter === "active";
      const res = await getPageWiseUsers(params);
      setUsers(res.data.res || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleDelete = async () => {
    try {
      await deleteUser(deleteId);
      showSnackbar("User deactivated", "success");
      fetchUsers();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed", "error");
    }
    setDeleteId(null);
  };

  const roleColor = (role) => {
    if (role === "ADMIN") return "error";
    if (role === "LIBRARIAN") return "warning";
    return "primary";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <TextField
        select
        label="Filter by Status"
        value={statusFilter}
        onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        sx={{ mb: 3, minWidth: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Borrowed</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} color={roleColor(u.role)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.isActive ? "Active" : "Inactive"}
                        color={u.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{u.borrowedBookCount || 0}</TableCell>
                    <TableCell>{formatDate(u.createdDate)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => navigate(`/users/${u.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate">
                        <IconButton size="small" color="error" onClick={() => setDeleteId(u.id)}>
                          <DeleteIcon />
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
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate User"
        message="Are you sure you want to deactivate this user?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default UserList;

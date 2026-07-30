import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Avatar,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getUserById } from "../../api/users";
import { formatDate } from "../../utils/format";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Typography>User not found</Typography>;

  const roleColor = (role) => {
    if (role === "ADMIN") return "error";
    if (role === "LIBRARIAN") return "warning";
    return "primary";
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/users")} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}>
            {user.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{user.name}</Typography>
            <Chip label={user.role} color={roleColor(user.role)} size="small" sx={{ mt: 0.5 }} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography>{user.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography>{user.phone || "N/A"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip
              label={user.isActive ? "Active" : "Inactive"}
              color={user.isActive ? "success" : "default"}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Borrowed Books</Typography>
            <Typography>{user.borrowedBookCount || 0}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Joined</Typography>
            <Typography>{formatDate(user.createdDate)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Last Updated</Typography>
            <Typography>{formatDate(user.updatedDate)}</Typography>
          </Grid>
        </Grid>

        {user.address && user.address.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Addresses
            </Typography>
            {user.address.map((addr) => (
              <Paper key={addr.id} variant="outlined" sx={{ p: 2, mb: 1 }}>
                <Chip label={addr.addressType} size="small" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  {addr.street}, {addr.city}, {addr.state} {addr.zip}
                </Typography>
                <Typography variant="body2">{addr.country}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;

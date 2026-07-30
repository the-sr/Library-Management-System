import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { getMe, updateMe, updatePassword, addProfilePicture } from "../../api/users";
import { formatDate } from "../../utils/format";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const MyProfile = () => {
  const { user, updateUser } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        setProfileData(res.data);
        profileForm.reset({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await updateMe(data);
      updateUser(res.data);
      showSnackbar("Profile updated", "success");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      showSnackbar("Password updated", "success");
      passwordForm.reset();
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await addProfilePicture(formData);
      showSnackbar("Profile picture updated", "success");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Upload failed", "error");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="text.secondary">{user?.role}</Typography>
            <label>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePictureUpload}
              />
              <Button size="small" component="span" sx={{ mt: 0.5 }}>
                Change Picture
              </Button>
            </label>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Profile Info" />
          <Tab label="Change Password" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {tab === 0 && (
          <Box component="form" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  {...profileForm.register("name")}
                  error={!!profileForm.formState.errors.name}
                  helperText={profileForm.formState.errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  {...profileForm.register("email")}
                  error={!!profileForm.formState.errors.email}
                  helperText={profileForm.formState.errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  {...profileForm.register("phone")}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Joined</Typography>
                <Typography>{formatDate(profileData?.createdDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                <Typography>{formatDate(profileData?.updatedDate)}</Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              {...passwordForm.register("oldPassword")}
              error={!!passwordForm.formState.errors.oldPassword}
              helperText={passwordForm.formState.errors.oldPassword?.message}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              {...passwordForm.register("newPassword")}
              error={!!passwordForm.formState.errors.newPassword}
              helperText={passwordForm.formState.errors.newPassword?.message}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
              {...passwordForm.register("confirmPassword")}
              error={!!passwordForm.formState.errors.confirmPassword}
              helperText={passwordForm.formState.errors.confirmPassword?.message}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MyProfile;

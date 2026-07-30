import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Typography, Paper, Alert, Box } from "@mui/material";
import AuthLayout from "../../components/layout/AuthLayout";
import useUiStore from "../../stores/uiStore";
import { forgotPassword } from "../../api/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

const ForgotPassword = () => {
  const { showSnackbar } = useUiStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(data.email);
      setSent(true);
      showSnackbar("OTP sent to your email", "success");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {sent ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              OTP sent! Check your email.
            </Alert>
            <Button fullWidth variant="contained" component={Link} to="/reset-password">
              Reset Password
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your email to receive a password reset OTP.
            </Typography>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </Box>
        )}
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          <Link to="/login">Back to Sign In</Link>
        </Typography>
      </Paper>
    </AuthLayout>
  );
};

export default ForgotPassword;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import AuthLayout from "../../components/layout/AuthLayout";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { signIn, sendOtp } from "../../api/auth";

const schema = z.object({
  username: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn(data);
      const payload = res.data.data;

      if (payload?.isActive === false) {
        try {
          await sendOtp(data.username);
        } catch {}
        navigate("/verify-otp", { state: { identifier: data.username } });
        showSnackbar("Account not active. OTP sent to your email for activation.", "info");
        return;
      }

      const { token, user } = payload;
      login(token, user);
      showSnackbar("Login successful", "success");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            <Link to="/forgot-password">Forgot password?</Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Don't have an account? <Link to="/sign-up">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default Login;

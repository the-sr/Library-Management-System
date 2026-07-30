import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Typography, Paper, Alert, Box } from "@mui/material";
import AuthLayout from "../../components/layout/AuthLayout";
import useUiStore from "../../stores/uiStore";
import { activateAccount, validateOtp, resetPassword } from "../../api/auth";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resetSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier || "";
  const { showSnackbar } = useUiStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [mode, setMode] = useState("verify"); // "verify" or "reset"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mode === "reset" ? resetSchema : otpSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      if (mode === "reset") {
        await resetPassword({ identifier, newPassword: data.newPassword });
        showSnackbar("Password reset successful", "success");
        navigate("/login");
      } else {
        await activateAccount({ otp: data.otp, identifier });
        setVerified(true);
        showSnackbar("Account activated!", "success");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {mode === "reset" ? "Reset Password" : "Verify Account"}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {verified ? (
          <Alert severity="success">Account verified! Redirecting...</Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {mode === "reset"
                ? `Enter the OTP sent to ${identifier} and your new password.`
                : `Enter the OTP sent to ${identifier}.`}
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              margin="normal"
              {...register("otp")}
              error={!!errors.otp}
              helperText={errors.otp?.message}
            />
            {mode === "reset" && (
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Verifying..." : mode === "reset" ? "Reset Password" : "Verify"}
            </Button>
          </Box>
        )}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          {mode === "verify" ? (
            <Typography variant="body2">
              <Link to="#" onClick={() => setMode("reset")}>
                Need to reset password instead?
              </Link>
            </Typography>
          ) : (
            <Typography variant="body2">
              <Link to="#" onClick={() => setMode("verify")}>
                Verify account instead?
              </Link>
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link to="/login">Back to Sign In</Link>
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default VerifyOTP;

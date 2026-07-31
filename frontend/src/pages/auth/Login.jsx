import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    TextField, Button, Typography, Paper, Alert, Box, InputAdornment, IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import AuthLayout from "../../components/layout/AuthLayout";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import {signIn, sendOtp} from "../../api/auth";

const schema = z.object({
    username: z.string().email("Enter a valid email"), password: z.string().min(1, "Password is required"),
});

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuthStore();
    const {showSnackbar} = useUiStore();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register, handleSubmit, formState: {errors},
    } = useForm({resolver: zodResolver(schema)});

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await signIn(data);
            const payload = res.data.data;

            if (payload?.isActive === false) {
                try {
                    await sendOtp(data.username);
                } catch {
                }
                navigate("/verify-otp", {state: {identifier: data.username}});
                showSnackbar("Account not active. OTP sent to your email for activation.", "info");
                return;
            }

            const {token, user} = payload;
            login(token, user);
            showSnackbar("Login successful", "success");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (<AuthLayout>
        <Paper
            elevation={0}
            sx={{
                p: 4, width: "100%", border: "1px solid", borderColor: "grey.200",
            }}
        >
            <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 700}}>
                Welcome Back
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{mb: 3}}>
                Sign in to your account
            </Typography>

            {error && (<Alert severity="error" sx={{mb: 2, borderRadius: 2}}>
                {error}
            </Alert>)}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start">
                            <EmailIcon color="action"/>
                        </InputAdornment>),
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start">
                            <LockIcon color="action"/>
                        </InputAdornment>), endAdornment: (<InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                            </IconButton>
                        </InputAdornment>),
                    }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={loading}
                    startIcon={<LoginIcon/>}
                    sx={{mt: 3, py: 1.5}}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </Button>
            </Box>

            <Box sx={{mt: 3, textAlign: "center"}}>
                <Link to="/forgot-password" style={{textDecoration: "none", color: "#3949ab"}}>
                    <Typography variant="body2" fontWeight={500}>
                        Forgot password?
                    </Typography>
                </Link>
                <Typography variant="body2" sx={{mt: 1.5}} color="text.secondary">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" style={{textDecoration: "none", color: "#3949ab", fontWeight: 600}}>
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Paper>
    </AuthLayout>);
};

export default Login;

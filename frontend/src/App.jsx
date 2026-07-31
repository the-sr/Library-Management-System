import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SnackbarComponent from "./components/common/SnackbarComponent";
import useUiStore from "./stores/uiStore";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Dashboard from "./pages/dashboard/Dashboard";
import BookList from "./pages/books/BookList";
import BookDetail from "./pages/books/BookDetail";
import BookForm from "./pages/books/BookForm";
import UserList from "./pages/users/UserList";
import UserProfile from "./pages/users/UserProfile";
import BorrowRequests from "./pages/borrows/BorrowRequests";
import ReturnRequests from "./pages/borrows/ReturnRequests";
import MyBorrowings from "./pages/borrows/MyBorrowings";
import Reports from "./pages/reports/Reports";
import MyProfile from "./pages/profile/MyProfile";
import CreateUser from "./pages/admin/CreateUser";

const baseTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h4: { fontWeight: 700, letterSpacing: "-0.02em" },
  h5: { fontWeight: 700, letterSpacing: "-0.01em" },
  h6: { fontWeight: 600 },
  button: { textTransform: "none", fontWeight: 600 },
};

const baseShape = { borderRadius: 12 };

const baseShadows = [
  "none",
  "0px 1px 3px rgba(0,0,0,0.08)",
  "0px 2px 6px rgba(0,0,0,0.08)",
  "0px 4px 12px rgba(0,0,0,0.1)",
  "0px 6px 16px rgba(0,0,0,0.12)",
  "0px 8px 24px rgba(0,0,0,0.14)",
  "0px 10px 32px rgba(0,0,0,0.16)",
  "0px 12px 40px rgba(0,0,0,0.18)",
  "0px 14px 48px rgba(0,0,0,0.2)",
  "0px 16px 56px rgba(0,0,0,0.22)",
  "0px 18px 64px rgba(0,0,0,0.24)",
  "0px 20px 72px rgba(0,0,0,0.26)",
  "0px 22px 80px rgba(0,0,0,0.28)",
  "0px 24px 88px rgba(0,0,0,0.3)",
  "0px 26px 96px rgba(0,0,0,0.32)",
  "0px 28px 104px rgba(0,0,0,0.34)",
  "0px 30px 112px rgba(0,0,0,0.36)",
  "0px 32px 120px rgba(0,0,0,0.38)",
  "0px 34px 128px rgba(0,0,0,0.4)",
  "0px 36px 136px rgba(0,0,0,0.42)",
  "0px 38px 144px rgba(0,0,0,0.44)",
  "0px 40px 152px rgba(0,0,0,0.46)",
  "0px 42px 160px rgba(0,0,0,0.48)",
  "0px 44px 168px rgba(0,0,0,0.5)",
  "0px 46px 176px rgba(0,0,0,0.52)",
];

const lightPalette = {
  mode: "light",
  primary: { main: "#3949ab", light: "#666ad1", dark: "#002270", contrastText: "#fff" },
  secondary: { main: "#ff9800", light: "#ffc570", dark: "#c77700", contrastText: "#000" },
  success: { main: "#2e7d32", light: "#60ad5e", dark: "#005005" },
  warning: { main: "#ed6c02", light: "#ff9800", dark: "#e37200" },
  error: { main: "#d32f2f", light: "#ff6659", dark: "#9a0007" },
  background: { default: "#f0f2f5", paper: "#ffffff" },
  divider: "rgba(0,0,0,0.08)",
};

const darkPalette = {
  mode: "dark",
  primary: { main: "#7986cb", light: "#a4b0e8", dark: "#3949ab", contrastText: "#000" },
  secondary: { main: "#ffb74d", light: "#ffd999", dark: "#ff9800", contrastText: "#000" },
  success: { main: "#66bb6a", light: "#98ee99", dark: "#2e7d32" },
  warning: { main: "#ffa726", light: "#ffcc80", dark: "#ed6c02" },
  error: { main: "#ef5350", light: "#ff867c", dark: "#d32f2f" },
  background: { default: "#121212", paper: "#1e1e1e" },
  divider: "rgba(255,255,255,0.08)",
};

const componentOverrides = (mode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: "8px 20px",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": { boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" },
      },
      containedPrimary: {
        background: "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
        "&:hover": { background: "linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)" },
      },
    },
  },
  MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
  MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
  MuiTextField: {
    styleOverrides: { root: { "& .MuiOutlinedInput-root": { borderRadius: 10 } } },
  },
  MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  MuiTableHead: {
    styleOverrides: {
      root: {
        "& .MuiTableCell-head": {
          fontWeight: 700,
          backgroundColor: mode === "dark" ? "#3949ab" : "#3949ab",
          color: "#fff",
        },
      },
    },
  },
});

function App() {
  const { themeMode } = useUiStore();

  const theme = useMemo(
    () =>
      createTheme({
        palette: themeMode === "dark" ? darkPalette : lightPalette,
        typography: baseTypography,
        shape: baseShape,
        shadows: baseShadows,
        components: componentOverrides(themeMode),
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarComponent />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/add"
            element={
              <ProtectedRoute roles={["LIBRARIAN", "ADMIN"]}>
                <Layout>
                  <BookForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute roles={["LIBRARIAN", "ADMIN"]}>
                <Layout>
                  <BookForm />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["ADMIN", "LIBRARIAN"]}>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute roles={["ADMIN", "LIBRARIAN"]}>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/borrow-requests"
            element={
              <ProtectedRoute roles={["LIBRARIAN"]}>
                <Layout>
                  <BorrowRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/return-requests"
            element={
              <ProtectedRoute roles={["LIBRARIAN"]}>
                <Layout>
                  <ReturnRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-borrowings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBorrowings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Layout>
                  <CreateUser />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

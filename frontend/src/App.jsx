import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SnackbarComponent from "./components/common/SnackbarComponent";

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

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarComponent />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <AuthLayout>
                <VerifyOTP />
              </AuthLayout>
            }
          />

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

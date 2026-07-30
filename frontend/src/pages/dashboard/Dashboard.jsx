import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RatingStars from "../../components/reviews/RatingStars";
import useAuthStore from "../../stores/authStore";
import { getAllBooks } from "../../api/books";
import { getPageWiseBooks } from "../../api/books";
import { getUserBooks } from "../../api/userBooks";

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ books: 0, borrowed: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await getPageWiseBooks({ pageNumber: 0, pageSize: 6 });
        setRecentBooks(booksRes.data.res || []);
        setStats((prev) => ({
          ...prev,
          books: booksRes.data.totalElements || 0,
        }));

        if (user?.role === "MEMBER") {
          const borrowedRes = await getUserBooks({
            userId: user.id,
            isActive: true,
          });
          setBorrowedBooks(borrowedRes.data || []);
          setStats((prev) => ({
            ...prev,
            borrowed: Array.isArray(borrowedRes.data)
              ? borrowedRes.data.length
              : 0,
          }));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getGreeting()}, {user?.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the Library Management System
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <MenuBookIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h3">{stats.books}</Typography>
              <Typography color="text.secondary">Total Books</Typography>
            </Box>
          </Paper>
        </Grid>
        {user?.role === "MEMBER" && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <AssignmentIcon sx={{ fontSize: 40, color: "warning.main" }} />
              <Box>
                <Typography variant="h3">{stats.borrowed}</Typography>
                <Typography color="text.secondary">Borrowed Books</Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={user?.role === "MEMBER" ? 6 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {user?.role === "MEMBER" ? "Available Books" : "Recent Books"}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentBooks.length > 0 ? (
              <List>
                {recentBooks.map((book) => (
                  <ListItem
                    key={book.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <ListItemText
                      primary={book.title}
                      secondary={`by ${book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown"} | Edition: ${book.edition || "N/A"}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                {loading ? "Loading..." : "No books available"}
              </Typography>
            )}
            <Button sx={{ mt: 1 }} onClick={() => navigate("/books")}>
              View All Books
            </Button>
          </Paper>
        </Grid>

        {user?.role === "MEMBER" && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                My Borrowed Books
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {borrowedBooks.length > 0 ? (
                <List>
                  {borrowedBooks.map((ub) => (
                    <ListItem key={ub.id}>
                      <ListItemText
                        primary={ub.book?.title || "Book"}
                        secondary={`Borrowed: ${
                          ub.borrowedDate
                            ? new Date(ub.borrowedDate).toLocaleDateString()
                            : "N/A"
                        } | Due: ${
                          ub.expectedReturnDate
                            ? new Date(ub.expectedReturnDate).toLocaleDateString()
                            : "N/A"
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  {loading ? "Loading..." : "No borrowed books"}
                </Typography>
              )}
              <Button sx={{ mt: 1 }} onClick={() => navigate("/my-borrowings")}>
                View All
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;

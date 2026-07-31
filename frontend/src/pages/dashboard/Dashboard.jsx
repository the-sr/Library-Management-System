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
  CardMedia,
  CardActions,
  Chip,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useAuthStore from "../../stores/authStore";
import { getPageWiseBooks } from "../../api/books";
import { getUserBooks } from "../../api/userBooks";
import { canManageBooks } from "../../utils/roles";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

const CHART_COLORS = ["#3949ab", "#ff9800", "#2e7d32", "#d32f2f", "#9c27b0", "#00bcd4"];

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

  // Prepare chart data from books
  const genreCount = {};
  recentBooks.forEach((book) => {
    book.genre?.forEach((g) => {
      genreCount[g.name] = (genreCount[g.name] || 0) + 1;
    });
  });
  const genreChartData = Object.entries(genreCount).map(([name, value]) => ({ name, value }));

  const statCards = [
    {
      title: "Total Books",
      value: stats.books,
      icon: <MenuBookIcon sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
    },
    ...(user?.role === "MEMBER"
      ? [
          {
            title: "Borrowed",
            value: stats.borrowed,
            icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
            gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
          },
        ]
      : []),
    ...(canManageBooks(user)
      ? [
          {
            title: "Recent Added",
            value: recentBooks.length,
            icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
            gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
          },
        ]
      : []),
  ];

  return (
    <Box>
      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <AutoAwesomeIcon sx={{ color: "secondary.main", fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {getGreeting()}, {user?.name?.split(" ")[0]}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Welcome to your library dashboard
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                background: card.gradient,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.8 }}>{card.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart */}
        {canManageBooks(user) && genreChartData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Books by Genre
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={genreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {genreChartData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Recent Books */}
        <Grid item xs={12} md={canManageBooks(user) && genreChartData.length > 0 ? 6 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              {user?.role === "MEMBER" ? "Available Books" : "Recent Books"}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {recentBooks.length > 0 ? (
                recentBooks.map((book) => (
                  <Grid item xs={12} sm={6} key={book.id}>
                    <Card
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          width: 60,
                          minWidth: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: book.images?.[0] ? "transparent" : "grey.100",
                        }}
                      >
                        {book.images?.[0] ? (
                          <img
                            src={`${API_URL}/api/file?fileName=${book.images[0]}`}
                            alt={book.title}
                            style={{ width: "100%", height: 80, objectFit: "cover" }}
                          />
                        ) : (
                          <MenuBookIcon sx={{ color: "grey.400" }} />
                        )}
                      </CardMedia>
                      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {book.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown"}
                        </Typography>
                        {book.genre?.slice(0, 2).map((g) => (
                          <Chip
                            key={g.id}
                            label={g.name}
                            size="small"
                            sx={{ mt: 0.5, mr: 0.5, height: 20, fontSize: "0.65rem" }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                    {loading ? "Loading..." : "No books available"}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Button sx={{ mt: 2 }} onClick={() => navigate("/books")}>
              View All Books
            </Button>
          </Paper>
        </Grid>

        {/* Member borrowed books */}
        {user?.role === "MEMBER" && borrowedBooks.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                My Borrowed Books
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {borrowedBooks.slice(0, 4).map((ub) => (
                  <Grid item xs={12} sm={6} md={3} key={ub.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                      }}
                      onClick={() => navigate(`/books/${ub.book?.id}`)}
                    >
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {ub.book?.title || "Book"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due:{" "}
                          {ub.expectedReturnDate
                            ? new Date(ub.expectedReturnDate).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Button sx={{ mt: 2 }} onClick={() => navigate("/my-borrowings")}>
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

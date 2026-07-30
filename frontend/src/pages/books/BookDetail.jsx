import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RatingStars from "../../components/reviews/RatingStars";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewCard from "../../components/reviews/ReviewCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { getBookById, deleteBook } from "../../api/books";
import { getReviewsByBook } from "../../api/reviews";
import { borrowRequest } from "../../api/userBooks";
import { canManageBooks } from "../../utils/roles";
import { formatDate } from "../../utils/format";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [bookRes, reviewsRes] = await Promise.all([
        getBookById(id),
        getReviewsByBook(id),
      ]);
      setBook(bookRes.data);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load book details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await borrowRequest(id);
      showSnackbar("Borrow request sent!", "success");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to send borrow request", "error");
    } finally {
      setBorrowing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(id);
      showSnackbar("Book deleted", "success");
      navigate("/books");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to delete book", "error");
    }
    setDeleteDialogOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <Typography>Book not found</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/books")} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              {canManageBooks(user) && (
                <Box>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/books/${id}/edit`)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              {book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown Author"}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <RatingStars value={book.averageRating || 0} readOnly />
              <Typography color="text.secondary">
                ({book.averageRating?.toFixed(1) || "0.0"} | {reviews.length} reviews)
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">ISBN</Typography>
                <Typography>{book.isbn || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Edition</Typography>
                <Typography>{book.edition || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Publisher</Typography>
                <Typography>{book.publisher || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Copies Available</Typography>
                <Typography>{book.bookCount || 0}</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Genres</Typography>
              {book.genre?.map((g) => (
                <Chip key={g.id} label={g.name} sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>

            {user?.role === "MEMBER" && (
              <Button
                variant="contained"
                onClick={handleBorrow}
                disabled={borrowing || book.bookCount <= 0}
                sx={{ mt: 3 }}
              >
                {borrowing ? "Sending Request..." : book.bookCount > 0 ? "Borrow This Book" : "Unavailable"}
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {user?.role === "MEMBER" && (
              <ReviewForm bookId={id} onReviewAdded={fetchData} />
            )}
            {reviews.length > 0 ? (
              <List>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} onUpdate={fetchData} />
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                No reviews yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Book"
        message="Are you sure you want to delete this book?"
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default BookDetail;

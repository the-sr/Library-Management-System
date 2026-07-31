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
  IconButton,
  Dialog,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
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

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

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

  const coverImage = book.images?.[0];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/books")} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown Author"}
                </Typography>
              </Box>
              {canManageBooks(user) && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={() => navigate(`/books/${id}/edit`)}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <RatingStars value={book.averageRating || 0} readOnly />
              <Typography color="text.secondary">
                ({book.averageRating?.toFixed(1) || "0.0"} | {reviews.length} reviews)
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>ISBN</Typography>
                <Typography variant="body1" fontWeight={500}>{book.isbn || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Edition</Typography>
                <Typography variant="body1" fontWeight={500}>{book.edition || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Publisher</Typography>
                <Typography variant="body1" fontWeight={500}>{book.publisher || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Available</Typography>
                <Chip
                  label={book.bookCount > 0 ? `${book.bookCount} copies` : "Out of stock"}
                  color={book.bookCount > 0 ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Genres</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {book.genre?.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    size="small"
                    sx={{ bgcolor: "primary.light", color: "white" }}
                  />
                ))}
              </Box>
            </Box>

            {book.pdfPath && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  endIcon={<DownloadIcon />}
                  href={`${API_URL}/api/file?fileName=${book.pdfPath}`}
                  target="_blank"
                  download
                  sx={{ borderRadius: 2 }}
                >
                  Download PDF
                </Button>
              </Box>
            )}

            {user?.role === "MEMBER" && (
              <Button
                variant="contained"
                size="large"
                onClick={handleBorrow}
                disabled={borrowing || book.bookCount <= 0}
                sx={{ mt: 3, borderRadius: 2, px: 4 }}
              >
                {borrowing ? "Sending Request..." : book.bookCount > 0 ? "Borrow This Book" : "Unavailable"}
              </Button>
            )}
          </Paper>

          {coverImage && (
            <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cover Image
              </Typography>
              <Box
                onClick={() => setImageDialogOpen(true)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 1,
                  overflow: "hidden",
                  display: "inline-block",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <img
                  src={`${API_URL}/api/file?fileName=${coverImage}`}
                  alt={book.title}
                  style={{ width: 200, height: 250, objectFit: "cover" }}
                />
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reviews ({reviews.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {user?.role === "MEMBER" && (
              <ReviewForm bookId={id} onReviewAdded={fetchData} />
            )}
            {reviews.length > 0 ? (
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} onUpdate={fetchData} />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                No reviews yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        PaperProps={{ sx: { bgcolor: "black" } }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 1 }}
            onClick={() => setImageDialogOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={`${API_URL}/api/file?fileName=${coverImage}`}
            alt={book.title}
            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block" }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default BookDetail;

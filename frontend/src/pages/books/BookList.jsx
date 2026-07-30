import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import BookCard from "../../components/books/BookCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { getPageWiseBooks, getBooksByTitle } from "../../api/books";
import { getAllAuthors } from "../../api/authors";
import { getAllGenres } from "../../api/genres";
import useAuthStore from "../../stores/authStore";

const BookList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      if (search) {
        const res = await getBooksByTitle(search);
        setBooks(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      } else {
        const res = await getPageWiseBooks({
          pageNumber: page,
          pageSize: 12,
          sortBy,
          sortDirection,
        });
        setBooks(res.data.res || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy, sortDirection]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Books</Typography>
        {(user?.role === "LIBRARIAN" || user?.role === "ADMIN") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/books/add")}
          >
            Add Book
          </Button>
        )}
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="averageRating">Rating</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              select
              label="Direction"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : books.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No books found
        </Typography>
      )}
    </Box>
  );
};

export default BookList;

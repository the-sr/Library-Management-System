import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  InputAdornment,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import BookCard from "../../components/books/BookCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { getPageWiseBooks, getBooksByTitle, getBooksByAuthor, getBooksByGenre } from "../../api/books";
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
  const [searchType, setSearchType] = useState("title");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    getAllGenres().then((res) => {
      setGenres(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      if (search) {
        let res;
        if (searchType === "title") res = await getBooksByTitle(search);
        else if (searchType === "author") res = await getBooksByAuthor(search);
        else res = await getBooksByGenre(search);
        setBooks(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      } else if (selectedGenre) {
        const res = await getBooksByGenre(selectedGenre);
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
  }, [page, sortBy, sortDirection, search, searchType, selectedGenre]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSelectedGenre("");
    fetchBooks();
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedGenre("");
    setSearchType("title");
    setPage(0);
  };

  const hasFilters = search || selectedGenre;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="h4">Books</Typography>
        {(user?.role === "LIBRARIAN" || user?.role === "ADMIN") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/books/add")}
            sx={{ borderRadius: 2 }}
          >
            Add Book
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchType}
                label="Search By"
                onChange={(e) => setSearchType(e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8} md={3}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Search by ${searchType}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                label="Genre"
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setSearch("");
                  setPage(0);
                }}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g.id} value={g.name}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="averageRating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Direction</InputLabel>
              <Select
                value={sortDirection}
                label="Direction"
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {hasFilters && (
          <Box sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center" }}>
            <FilterListIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">Active filters:</Typography>
            {search && (
              <Chip
                label={`${searchType}: ${search}`}
                size="small"
                onDelete={() => { setSearch(""); fetchBooks(); }}
              />
            )}
            {selectedGenre && (
              <Chip
                label={`Genre: ${selectedGenre}`}
                size="small"
                onDelete={() => { setSelectedGenre(""); fetchBooks(); }}
              />
            )}
            <Button size="small" onClick={handleClearFilters}>
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      {loading ? (
        <LoadingSpinner />
      ) : books.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
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
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <SearchIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasFilters ? "Try adjusting your filters" : "Start by adding some books"}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BookList;

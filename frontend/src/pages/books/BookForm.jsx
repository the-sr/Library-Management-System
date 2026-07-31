import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Chip,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useUiStore from "../../stores/uiStore";
import { addBook, updateBook, getBookById } from "../../api/books";
import { getAllAuthors, createAuthor } from "../../api/authors";
import { getAllGenres } from "../../api/genres";
import ImageUpload from "../../components/books/ImageUpload";
import PdfUpload from "../../components/books/PdfUpload";

const schema = z.object({
  isbn: z.string().min(1, "ISBN is required"),
  title: z.string().min(1, "Title is required"),
  edition: z.string().optional(),
  publisher: z.string().optional(),
  bookCount: z.number().min(0, "Book count must be positive"),
});

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useUiStore();
  const isEdit = !!id;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingPdf, setPendingPdf] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [existingPdf, setExistingPdf] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { bookCount: 0 },
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          getAllAuthors(),
          getAllGenres(),
        ]);
        setAuthors(Array.isArray(authorsRes.data) ? authorsRes.data : []);
        setGenres(Array.isArray(genresRes.data) ? genresRes.data : []);

        if (isEdit) {
          const bookRes = await getBookById(id);
          const book = bookRes.data;
          reset({
            isbn: book.isbn,
            title: book.title,
            edition: book.edition || "",
            publisher: book.publisher || "",
            bookCount: book.bookCount || 0,
          });
          setSelectedAuthors(book.authors || []);
          setSelectedGenres(book.genre || []);
          setExistingImage(book.images?.[0] || "");
          setExistingPdf(book.pdfPath || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadFormData();
  }, [id, isEdit, reset]);

  const handleAuthorChange = async (_, newValue) => {
    const created = [];
    for (const item of newValue) {
      if (item.id) {
        created.push(item);
      } else {
        try {
          const parts = (typeof item === "string" ? item : item.firstName || "").trim().split(/\s+/);
          const firstName = parts[0] || "";
          const lastName = parts.slice(1).join(" ") || "";
          const res = await createAuthor({ firstName, lastName });
          created.push(res.data);
        } catch (err) {
          console.error("Failed to create author:", err);
          showSnackbar("Failed to create author", "error");
        }
      }
    }
    setSelectedAuthors(created);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...data,
        authors: selectedAuthors,
        genre: selectedGenres,
      };
      if (isEdit) {
        payload.id = parseInt(id);
        await updateBook(payload, pendingImage, pendingPdf);
        showSnackbar("Book updated successfully", "success");
      } else {
        const res = await addBook(payload, pendingImage, pendingPdf);
        const newId = res.data?.id || res.id;
        showSnackbar("Book added successfully", "success");
        navigate(`/books/${newId}`);
        return;
      }
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file) => {
    setPendingImage(file);
    if (file) setExistingImage("");
  };

  const handlePdfChange = (file) => {
    setPendingPdf(file);
    if (file) setExistingPdf("");
  };

  const displayImage = pendingImage ? null : existingImage;
  const displayPdf = pendingPdf ? null : existingPdf;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/books")} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Paper sx={{ p: 4, maxWidth: 700 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? "Edit Book" : "Add New Book"}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                {...register("isbn")}
                error={!!errors.isbn}
                helperText={errors.isbn?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Edition" {...register("edition")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Publisher" {...register("publisher")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Book Count"
                type="number"
                {...register("bookCount", { valueAsNumber: true })}
                error={!!errors.bookCount}
                helperText={errors.bookCount?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={authors}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return `${option.firstName} ${option.lastName}`;
                }}
                value={selectedAuthors}
                onChange={handleAuthorChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={typeof option === "string" ? option : `${option.firstName} ${option.lastName}`}
                      {...getTagProps({ index })}
                      key={option.id || index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Authors"
                    placeholder="Type author name and press Enter..."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={genres}
                getOptionLabel={(option) => option.name}
                value={selectedGenres}
                onChange={(_, newValue) => setSelectedGenres(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Genres" placeholder="Search genres..." />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <ImageUpload image={displayImage} onImageChange={handleImageChange} />
            <PdfUpload pdf={displayPdf} onPdfChange={handlePdfChange} />
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/books")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookForm;

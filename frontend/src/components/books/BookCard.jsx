import { Card, CardContent, CardMedia, CardActions, Typography, Button, Box, Chip, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RatingStars from "../reviews/RatingStars";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const coverImage =
    book.images && book.images.length > 0
      ? `${API_URL}/api/file?fileName=${book.images[0]}`
      : null;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        borderRadius: 2,
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: coverImage ? "transparent" : "grey.100",
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={book.title}
            style={{ width: "100%", height: 200, objectFit: "cover" }}
          />
        ) : (
          <MenuBookIcon sx={{ fontSize: 64, color: "grey.400" }} />
        )}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Tooltip title={book.title}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
              minHeight: "2.6em",
            }}
          >
            {book.title}
          </Typography>
        </Tooltip>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown Author"}
        </Typography>
        <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {book.genre?.slice(0, 3).map((g) => (
            <Chip
              key={g.id}
              label={g.name}
              size="small"
              sx={{
                bgcolor: "primary.light",
                color: "white",
                fontWeight: 500,
                fontSize: "0.7rem",
              }}
            />
          ))}
          {book.genre?.length > 3 && (
            <Chip label={`+${book.genre.length - 3}`} size="small" variant="outlined" />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <RatingStars value={book.averageRating || 0} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({book.averageRating?.toFixed(1) || "0.0"})
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => navigate(`/books/${book.id}`)}
          sx={{ borderRadius: 2 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;

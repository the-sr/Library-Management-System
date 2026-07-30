import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RatingStars from "../reviews/RatingStars";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") || "Unknown Author"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Edition: {book.edition || "N/A"} | Publisher: {book.publisher || "N/A"}
        </Typography>
        <Box sx={{ mb: 1 }}>
          {book.genre?.map((g) => (
            <Chip key={g.id} label={g.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <RatingStars value={book.averageRating || 0} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({book.averageRating?.toFixed(1) || "0.0"})
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Copies: {book.bookCount || 0}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/books/${book.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;

import { useState } from "react";
import { Box, TextField, Button, Rating } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { addReview } from "../../api/reviews";

const schema = z.object({
  comment: z.string().min(1, "Review cannot be empty"),
});

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const { user } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addReview({
        comment: data.comment,
        rating,
        userId: user.id,
        bookId: parseInt(bookId),
      });
      showSnackbar("Review added!", "success");
      reset();
      setRating(3);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to add review", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Write your review..."
        {...register("comment")}
        error={!!errors.comment}
        helperText={errors.comment?.message}
        sx={{ mb: 1 }}
      />
      <Button type="submit" variant="contained" size="small" disabled={loading}>
        {loading ? "Posting..." : "Post Review"}
      </Button>
    </Box>
  );
};

export default ReviewForm;

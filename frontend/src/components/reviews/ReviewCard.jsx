import { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RatingStars from "./RatingStars";
import ConfirmDialog from "../common/ConfirmDialog";
import useAuthStore from "../../stores/authStore";
import useUiStore from "../../stores/uiStore";
import { updateReview, deleteReview } from "../../api/reviews";
import { formatDate } from "../../utils/format";

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useAuthStore();
  const { showSnackbar } = useUiStore();
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(review.comment);
  const [rating, setRating] = useState(review.rating);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isOwner = user?.id === review.userId;

  const handleUpdate = async () => {
    try {
      await updateReview({
        id: review.id,
        comment,
        rating,
        userId: review.userId,
        bookId: review.bookId,
      });
      showSnackbar("Review updated", "success");
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to update", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      showSnackbar("Review deleted", "success");
      setDeleteDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to delete", "error");
    }
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{review.user?.name?.charAt(0) || "U"}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2">{review.user?.name || "User"}</Typography>
              <RatingStars value={review.rating} readOnly size="small" />
            </Box>
          }
          secondary={
            editing ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <RatingStars value={rating} onChange={(_, v) => setRating(v)} size="small" />
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={handleUpdate} sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button size="small" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.createdDate)}
                </Typography>
                {isOwner && (
                  <Box sx={{ mt: 0.5 }}>
                    <IconButton size="small" onClick={() => setEditing(true)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </>
            )
          }
        />
      </ListItem>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default ReviewCard;

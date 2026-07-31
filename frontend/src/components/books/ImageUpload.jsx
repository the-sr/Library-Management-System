import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

const ImageUpload = ({ image, onImageChange }) => {
  const [preview, setPreview] = useState(() => {
    if (!image) return null;
    if (typeof image === "string") return `${API_URL}/api/file?fileName=${image}`;
    return URL.createObjectURL(image);
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onImageChange?.(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemove = () => {
    onImageChange?.(null);
    setPreview(null);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Book Cover Image
      </Typography>
      {preview ? (
        <Paper variant="outlined" sx={{ p: 1, display: "inline-block", position: "relative" }}>
          <img
            src={preview}
            alt="Book cover"
            style={{ width: 200, height: 250, objectFit: "cover", borderRadius: 4, display: "block" }}
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
            onClick={handleRemove}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      ) : (
        <label>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
          <Button
            component="span"
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
          >
            Add Cover Image
          </Button>
        </label>
      )}
    </Box>
  );
};

export default ImageUpload;

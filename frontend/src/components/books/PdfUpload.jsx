import { useState } from "react";
import { Box, Button, Typography, IconButton, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

const PdfUpload = ({ pdf, onPdfChange }) => {
  const getPdfName = () => {
    if (!pdf) return null;
    if (typeof pdf === "object") return pdf.name;
    return pdf.split("/").pop();
  };

  const getPdfUrl = () => {
    if (!pdf || typeof pdf === "object") return null;
    return `${API_URL}/api/file?fileName=${pdf}`;
  };

  const pdfName = getPdfName();
  const pdfUrl = getPdfUrl();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Book PDF
      </Typography>
      {pdfName ? (
        <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <PictureAsPdfIcon color="error" />
          <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
            {pdfName}
          </Typography>
          {pdfUrl && (
            <IconButton size="small" component="a" href={pdfUrl} target="_blank" download>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" color="error" onClick={() => onPdfChange?.(null)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      ) : (
        <label>
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onPdfChange?.(file);
              e.target.value = "";
            }}
          />
          <Button
            component="span"
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
          >
            Upload PDF
          </Button>
        </label>
      )}
    </Box>
  );
};

export default PdfUpload;

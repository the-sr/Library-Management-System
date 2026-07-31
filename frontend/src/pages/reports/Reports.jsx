import { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PersonIcon from "@mui/icons-material/Person";
import useUiStore from "../../stores/uiStore";
import {
  generateLibraryReport,
  generateUserReport,
} from "../../api/reports";

const formats = [
  { value: "PDF", label: "PDF" },
  { value: "XLSX", label: "Excel (XLSX)" },
  { value: "HTML", label: "HTML" },
  { value: "XML", label: "XML" },
  { value: "TXT", label: "Text" },
];

const Reports = () => {
  const { showSnackbar } = useUiStore();
  const [reportType, setReportType] = useState("library");
  const [format, setFormat] = useState("PDF");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let res;
      if (reportType === "library") {
        res = await generateLibraryReport(format);
      } else {
        if (!userId) {
          showSnackbar("Please enter a User ID", "error");
          setLoading(false);
          return;
        }
        res = await generateUserReport(userId, format);
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext = format.toLowerCase() === "xlsx" ? "xlsx" : format.toLowerCase();
      link.setAttribute("download", `${reportType}-report.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSnackbar("Report downloaded successfully", "success");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to generate report", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate and download reports for the library
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: "pointer",
              border: "2px solid",
              borderColor: reportType === "library" ? "primary.main" : "grey.200",
              transition: "all 0.2s",
              "&:hover": { borderColor: "primary.light" },
            }}
            onClick={() => setReportType("library")}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LibraryBooksIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Library Summary</Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete library report with books, borrows, and stats
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: "pointer",
              border: "2px solid",
              borderColor: reportType === "user" ? "primary.main" : "grey.200",
              transition: "all 0.2s",
              "&:hover": { borderColor: "primary.light" },
            }}
            onClick={() => setReportType("user")}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: "secondary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>User Report</Typography>
                <Typography variant="body2" color="text.secondary">
                  Individual user borrowing history and activity
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mt: 3, maxWidth: 500 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
          <AssessmentIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>Generate Report</Typography>
        </Box>

        <Grid container spacing={2}>
          {reportType === "user" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                size="small"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              size="small"
            >
              {formats.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleGenerate}
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? "Generating..." : "Download Report"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reports;

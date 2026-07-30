import { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
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

      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
          <AssessmentIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6">Generate Report</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="library">Library Summary</MenuItem>
              <MenuItem value="user">User Report</MenuItem>
            </TextField>
          </Grid>

          {reportType === "user" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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

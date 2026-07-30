import { Snackbar, Alert } from "@mui/material";
import useUiStore from "../../stores/uiStore";

const SnackbarComponent = () => {
  const { snackbar, closeSnackbar } = useUiStore();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;

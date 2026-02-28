/* eslint-disable react/prop-types */
import { Snackbar, Alert } from '@mui/material';

function AdminSnackbar({ snackbar, setSnackbar, autoHideDuration = 3000 }) {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={autoHideDuration}
      onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export default AdminSnackbar;

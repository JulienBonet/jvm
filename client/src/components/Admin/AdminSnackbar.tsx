// client\src\components\Admin\AdminSnackbar.tsx
import { Snackbar, Alert } from '@mui/material';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface AdminSnackbarProps {
  snackbar: SnackbarState; 
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
  autoHideDuration?: number;
}

function AdminSnackbar({ snackbar, setSnackbar, autoHideDuration = 3000 }: AdminSnackbarProps) {
  const handleClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={handleClose}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export default AdminSnackbar;
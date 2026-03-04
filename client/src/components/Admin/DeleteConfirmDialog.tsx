import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName?: string;
  label: string;
}

function DeleteConfirmDialog({ open, onClose, onConfirm, entityName, label } : DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression ?</DialogTitle>

      <DialogContent>
        <Typography>
          Supprimer {label} : {entityName ?? '…'} ?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;

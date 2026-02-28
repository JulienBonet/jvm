/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

function DeleteConfirmDialog({ open, onClose, onConfirm, entityName, label }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression ?</DialogTitle>

      <DialogContent>
        <Typography>
          Supprimer {label} : {entityName} ?
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

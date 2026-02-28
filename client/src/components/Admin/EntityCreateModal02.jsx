/* eslint-disable react/prop-types */
// > ENTITY CREATE MODAL : Genre & Style //
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

function EntityCreateModal02({
  open,
  title,
  label,
  newValue,
  setOpenCreate,
  setNewValue,
  handleCreate,
}) {
  return (
    <Dialog open={open} onClose={() => setOpenCreate(false)}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={label}
          fullWidth
          variant="outlined"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button color="var(--color-02)" onClick={() => [setOpenCreate(false), setNewValue('')]}>
          Annuler
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'var(--color-02)',
          }}
          onClick={handleCreate}
        >
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default EntityCreateModal02;

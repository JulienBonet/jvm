/* eslint-disable react/prop-types */
// > ENTITY DETAIL MODAL : Genre & Style //
import {
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

function EntityDetailModal02({
  open,
  setOpenDetail,
  title,
  label,
  editMode,
  selectedItem,
  editedName,
  setEditedName,
  setEditMode,
  handleUpdate,
}) {
  return (
    <Dialog open={open} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {!editMode ? (
          <>
            <Typography variant="subtitle2">ID</Typography>
            <Typography sx={{ mb: 2 }}>{selectedItem?.id}</Typography>

            <Typography variant="subtitle2">Nom</Typography>
            <Typography>{selectedItem?.name}</Typography>
          </>
        ) : (
          <TextField
            label={label}
            fullWidth
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions>
        {!editMode ? (
          <>
            <Button onClick={() => setOpenDetail(false)}>Fermer</Button>
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default EntityDetailModal02;

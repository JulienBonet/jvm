// client\src\components\Admin\EntityDetailModal02.tsx
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

interface EntityItem {
  id: number;
  name: string;
}

interface EntityDetailModalProps {
  open: boolean;
  setOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  label: string;
  editMode: boolean;
  selectedItem: EntityItem | null;
  editedName: string;
  setEditedName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: () => void;
  startEdit: () => void;
  cancelEdit: () => void;
}

function EntityDetailModal02({
  open,
  setOpenDetail,
  title,
  label,
  editMode,
  selectedItem,
  editedName,
  setEditedName,
  handleUpdate,
  startEdit,
  cancelEdit,
}: EntityDetailModalProps) {
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
            <Button variant="contained" onClick={startEdit}>
              Edit
            </Button>
          </>
        ) : (
          <>
            <Button onClick={cancelEdit}>Cancel</Button>
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

/* eslint-disable react/prop-types */
// > ENTITY DETAIL MODAL : artists & label //
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';

function EntityDetailModal({
  open,
  onClose,
  title,

  entity,
  setEntity,

  editMode,
  setEditMode,

  getImageSrc,

  onEditImageUpload,
  onFetchExternal,

  onSave,

  uploading = false,
  fetching = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">{title}</DialogTitle>

      <DialogContent dividers>
        {!editMode ? (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={getImageSrc()}
              alt={entity?.name}
              style={{ width: '200px', height: '200px', margin: '1rem' }}
            />

            <Typography>
              <span style={{ fontWeight: 500 }}>ID:</span> {entity?.id}
            </Typography>

            <Typography>
              <span style={{ fontWeight: 500 }}>Name:</span> {entity?.name}
            </Typography>

            <Typography>
              <span style={{ fontWeight: 500 }}>Sorted Name:</span> {entity?.sorted_name}
            </Typography>

            {entity?.discogs_id && (
              <Typography>
                <span style={{ fontWeight: 500 }}>Discogs ID:</span> {entity?.discogs_id}
              </Typography>
            )}

            {entity?.release_count && (
              <Typography>
                <span style={{ fontWeight: 500 }}>Releases:</span> {entity?.release_count}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img
                src={getImageSrc()}
                alt={entity?.name}
                style={{ width: '200px', height: '200px' }}
              />
            </Box>

            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
              Changer image
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  onEditImageUpload(file);
                }}
              />
            </Button>

            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={entity?.name || ''}
              onChange={(e) => setEntity({ ...entity, name: e.target.value })}
            />

            <TextField
              label="Sorted Name"
              fullWidth
              sx={{ mb: 2 }}
              value={entity?.sorted_name || ''}
              onChange={(e) => setEntity({ ...entity, sorted_name: e.target.value })}
            />

            <TextField
              label="Discogs ID"
              fullWidth
              sx={{ mb: 1 }}
              value={entity?.discogs_id || ''}
              onChange={(e) => setEntity({ ...entity, discogs_id: e.target.value })}
            />

            <Button
              variant="outlined"
              fullWidth
              onClick={() => onFetchExternal(entity)}
              disabled={!entity?.discogs_id || fetching}
              sx={{ mb: 2 }}
            >
              {fetching ? 'Récupération...' : 'Sync depuis Discogs'}
            </Button>
          </>
        )}
      </DialogContent>

      <DialogActions>
        {!editMode ? (
          <>
            <Button onClick={onClose}>Fermer</Button>
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>

            <Button variant="contained" onClick={onSave} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default EntityDetailModal;
